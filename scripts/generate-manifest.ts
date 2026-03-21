/**
 * Asset Manifest Generator
 * 
 * Scans the project for media assets, computes content hashes,
 * identifies duplicates, and generates a centralized manifest.
 * 
 * Usage: npm run generate-manifest
 */

import { glob } from 'glob';
import { createHash } from 'crypto';
import { readFileSync, writeFileSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, relative, normalize, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = process.env.PROJECT_ROOT || join(__dirname, '..');
const ASSETS_DIR = join(ROOT_DIR, 'src', 'assets');

interface AssetMetadata {
  id: string;
  hash: string;
  filename: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  category: 'animation' | 'aerial' | 'exterior' | 'interior' | 'panorama' | 'works' | 'other';
  size: number;
  mimeType: string;
  dimensions?: { width: number; height: number };
  duration?: number;
  createdAt: string;
  updatedAt: string;
  projects?: Array<{ id: string; name: string; category: string; subcategory?: string }>;
  tags?: string[];
  alt?: string;
  description?: string;
}

interface AssetLocation {
  path: string;
  isCanonical: boolean;
  isReference: boolean;
}

interface AssetRecord extends AssetMetadata {
  locations: AssetLocation[];
  canonicalPath: string;
  importPath: string;
}

interface AssetRegistry {
  byHash: Record<string, AssetRecord>;
  byId: Record<string, AssetRecord>;
  byPath: Record<string, AssetRecord>;
  byCategory: Record<string, AssetRecord[]>;
  byProject: Record<string, AssetRecord[]>;
  meta: {
    version: string;
    generatedAt: string;
    totalAssets: number;
    uniqueAssets: number;
    duplicatedAssets: number;
    spaceSaved: number;
  };
}

/**
 * Generate UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Compute MD5 hash of file content
 */
function computeFileHash(filePath: string): string {
  const content = readFileSync(filePath);
  return createHash('md5').update(content).digest('hex');
}

/**
 * Get MIME type from extension
 */
function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Get asset type from MIME type
 */
function getAssetType(mimeType: string): 'image' | 'video' | 'audio' | 'document' | 'other' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('text/') || mimeType.includes('pdf')) return 'document';
  return 'other';
}

/**
 * Determine asset category from path
 */
function getCategory(relativePath: string): 'animation' | 'aerial' | 'exterior' | 'interior' | 'panorama' | 'works' | 'other' {
  const pathLower = relativePath.toLowerCase();
  
  if (pathLower.includes('/animation/')) return 'animation';
  if (pathLower.includes('/aerial/')) return 'aerial';
  if (pathLower.includes('/exterior/')) return 'exterior';
  if (pathLower.includes('/interior/')) return 'interior';
  if (pathLower.includes('/panorama/')) return 'panorama';
  if (pathLower.includes('/works/')) return 'works';
  
  return 'other';
}

/**
 * Extract project info from path
 */
function extractProjectInfo(relativePath: string): Array<{ id: string; name: string; category: string; subcategory?: string }> | undefined {
  const worksMatch = relativePath.match(/works\/(\d+)_([^/]+)\/([^/]+)\//i);
  
  if (worksMatch) {
    const [, num, category, subcategory] = worksMatch;
    return [{
      id: `project-${num}`,
      name: `${category} - ${subcategory}`,
      category: category.replace(/_/g, ' '),
      subcategory: subcategory,
    }];
  }
  
  return undefined;
}

/**
 * Generate tags from path
 */
function generateTags(relativePath: string, category: string): string[] {
  const tags: string[] = [];
  const pathParts = relativePath.split('/');
  
  // Add category as tag
  tags.push(category);
  
  // Add project number if present
  const projectMatch = relativePath.match(/works\/(\d+)_/i);
  if (projectMatch) {
    tags.push(`project-${projectMatch[1]}`);
  }
  
  // Add type tags from filename
  const filename = pathParts[pathParts.length - 1]?.toLowerCase() || '';
  if (filename.includes('shot')) tags.push('shot');
  if (filename.includes('walk')) tags.push('walkthrough');
  if (filename.includes('fly')) tags.push('flythrough');
  if (filename.includes('panorama')) tags.push('panorama');
  if (filename.includes('d5')) tags.push('d5-render');
  
  return tags;
}

/**
 * Scan and process all assets
 */
async function scanAssets(): Promise<AssetRegistry> {
  console.log('🔍 Scanning for assets...');
  
  // Find all media files
  const patterns = [
    'src/assets/**/*.{webp,jpg,jpeg,png,gif,svg,mp4,webm,mov,avi,mkv}',
  ];
  
  const files: string[] = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, { cwd: ROOT_DIR, nodir: true });
    files.push(...matches);
  }
  
  console.log(`📁 Found ${files.length} asset files`);
  
  // Group files by hash
  const hashToFiles = new Map<string, Array<{ path: string; size: number }>>();
  
  for (const file of files) {
    const fullPath = join(ROOT_DIR, file);
    const stat = statSync(fullPath);
    const hash = computeFileHash(fullPath);
    
    if (!hashToFiles.has(hash)) {
      hashToFiles.set(hash, []);
    }
    hashToFiles.get(hash)!.push({ path: file, size: stat.size });
  }
  
  // Build registry
  const registry: AssetRegistry = {
    byHash: {},
    byId: {},
    byPath: {},
    byCategory: {
      animation: [],
      aerial: [],
      exterior: [],
      interior: [],
      panorama: [],
      works: [],
      other: [],
    },
    byProject: {},
    meta: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      totalAssets: files.length,
      uniqueAssets: hashToFiles.size,
      duplicatedAssets: 0,
      spaceSaved: 0,
    },
  };
  
  let duplicateCount = 0;
  let savedBytes = 0;
  
  for (const [hash, fileInfos] of hashToFiles.entries()) {
    const id = generateUUID();
    const canonicalFile = fileInfos[0]; // First file is canonical
    const category = getCategory(canonicalFile.path);
    const mimeType = getMimeType(canonicalFile.path);
    const type = getAssetType(mimeType);
    
    const locations: AssetLocation[] = fileInfos.map((info, index) => ({
      path: info.path,
      isCanonical: index === 0,
      isReference: index > 0,
    }));
    
    const record: AssetRecord = {
      id,
      hash,
      filename: canonicalFile.path.split('/').pop() || 'unknown',
      type,
      category,
      size: canonicalFile.size,
      mimeType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      locations,
      canonicalPath: canonicalFile.path,
      importPath: canonicalFile.path,
      projects: extractProjectInfo(canonicalFile.path),
      tags: generateTags(canonicalFile.path, category),
    };
    
    // Track duplicates
    if (fileInfos.length > 1) {
      duplicateCount += fileInfos.length - 1;
      // Calculate space saved (duplicate sizes)
      for (let i = 1; i < fileInfos.length; i++) {
        savedBytes += fileInfos[i].size;
      }
    }
    
    // Index the record
    registry.byHash[hash] = record;
    registry.byId[id] = record;
    
    for (const loc of locations) {
      registry.byPath[loc.path] = record;
    }
    
    registry.byCategory[category].push(record);
    
    if (record.projects) {
      for (const project of record.projects) {
        if (!registry.byProject[project.id]) {
          registry.byProject[project.id] = [];
        }
        registry.byProject[project.id].push(record);
      }
    }
  }
  
  registry.meta.duplicatedAssets = duplicateCount;
  registry.meta.spaceSaved = savedBytes;
  
  console.log(`✅ Found ${duplicateCount} duplicate files`);
  console.log(`💾 Space saved by deduplication: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
  
  return registry;
}

/**
 * Generate and save the manifest
 */
async function generateManifest(): Promise<void> {
  console.log('🚀 Generating asset manifest...\n');
  
  const registry = await scanAssets();
  
  // Ensure output directory exists
  const outputDir = join(ROOT_DIR, 'src', 'assets');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  // Write manifest
  const outputPath = join(outputDir, 'manifest.json');
  const manifestContent = JSON.stringify(registry, null, 2);
  writeFileSync(outputPath, manifestContent, 'utf-8');
  
  console.log(`\n📄 Manifest written to: ${outputPath}`);
  console.log(`📊 Registry stats:`);
  console.log(`   Total files: ${registry.meta.totalAssets}`);
  console.log(`   Unique assets: ${registry.meta.uniqueAssets}`);
  console.log(`   Duplicates: ${registry.meta.duplicatedAssets}`);
  console.log(`   Space saved: ${(registry.meta.spaceSaved / 1024 / 1024).toFixed(2)} MB`);
  console.log('\n✨ Manifest generation complete!');
}

// Run if executed directly
if (process.argv[1]?.endsWith('generate-manifest.ts')) {
  generateManifest().catch(console.error);
}

export { generateManifest, scanAssets };
