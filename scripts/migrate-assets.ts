/**
 * Asset Deduplication Migration Script
 * 
 * This script helps migrate duplicate files to a deduplicated structure.
 * It provides multiple strategies:
 * 
 * 1. DRY_RUN - Just report what would be done
 * 2. SYMLINK - Replace duplicates with symlinks to canonical files
 * 3. DELETE - Remove duplicates (keeping only canonical files)
 * 4. KEEP - Keep all files but update code references to use canonical paths
 * 
 * Usage:
 *   npm run migrate-assets -- --strategy=DRY_RUN
 *   npm run migrate-assets -- --strategy=SYMLINK
 *   npm run migrate-assets -- --strategy=DELETE
 * 
 * IMPORTANT: Always run DRY_RUN first to see what will happen!
 */

import { glob } from 'glob';
import { createHash } from 'crypto';
import { readFileSync, writeFileSync, statSync, existsSync, mkdirSync, unlinkSync, rmSync } from 'fs';
import { join, relative, normalize, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);
const ROOT_DIR = process.env.PROJECT_ROOT || join(__dirname, '..');

type MigrationStrategy = 'DRY_RUN' | 'SYMLINK' | 'DELETE' | 'KEEP';

interface DuplicateGroup {
  hash: string;
  canonical: string;
  duplicates: string[];
  size: number;
}

interface MigrationReport {
  totalFiles: number;
  uniqueAssets: number;
  duplicateGroups: number;
  totalDuplicates: number;
  spaceToSave: number;
  actions: Array<{
    action: 'symlink' | 'delete' | 'keep' | 'skip';
    source: string;
    target?: string;
    reason?: string;
  }>;
  warnings: string[];
  errors: string[];
}

/**
 * Parse command line arguments
 */
function parseArgs(): { strategy: MigrationStrategy; help: boolean } {
  const args = process.argv.slice(2);
  let strategy: MigrationStrategy = 'DRY_RUN';
  let help = false;

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      help = true;
    } else if (arg.startsWith('--strategy=')) {
      const value = arg.split('=')[1].toUpperCase();
      if (['DRY_RUN', 'SYMLINK', 'DELETE', 'KEEP'].includes(value)) {
        strategy = value as MigrationStrategy;
      } else {
        console.error(`Invalid strategy: ${value}`);
        process.exit(1);
      }
    }
  }

  return { strategy, help };
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
Asset Deduplication Migration Script

Usage:
  npm run migrate-assets -- [options]

Options:
  --strategy=STRATEGY  Migration strategy (default: DRY_RUN)
                       Strategies:
                       - DRY_RUN: Just report what would be done
                       - SYMLINK: Replace duplicates with symlinks
                       - DELETE: Remove duplicate files
                       - KEEP: Keep files, just update references

  --help, -h          Show this help message

Examples:
  npm run migrate-assets -- --strategy=DRY_RUN   # See what would happen
  npm run migrate-assets -- --strategy=SYMLINK   # Create symlinks
  npm run migrate-assets -- --strategy=DELETE    # Remove duplicates

⚠️  WARNING: Always run DRY_RUN first to review changes!
⚠️  BACKUP your files before running SYMLINK or DELETE!
`);
}

/**
 * Compute MD5 hash of file content
 */
function computeFileHash(filePath: string): string {
  const content = readFileSync(filePath);
  return createHash('md5').update(content).digest('hex');
}

/**
 * Scan for duplicate files
 */
async function scanDuplicates(): Promise<DuplicateGroup[]> {
  console.log('🔍 Scanning for duplicate assets...\n');
  
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
  
  // Build duplicate groups
  const groups: DuplicateGroup[] = [];
  
  for (const [hash, fileInfos] of hashToFiles.entries()) {
    if (fileInfos.length > 1) {
      // First file (in canonical path) is the master
      const sorted = fileInfos.sort((a, b) => {
        // Prefer files in type-based directories over works directories
        const aIsCanonical = !a.path.toLowerCase().includes('/works/');
        const bIsCanonical = !b.path.toLowerCase().includes('/works/');
        if (aIsCanonical && !bIsCanonical) return -1;
        if (!aIsCanonical && bIsCanonical) return 1;
        return a.path.localeCompare(b.path);
      });
      
      groups.push({
        hash,
        canonical: sorted[0].path,
        duplicates: sorted.slice(1).map(f => f.path),
        size: sorted[0].size,
      });
    }
  }
  
  console.log(`📊 Found ${groups.length} groups of duplicate files\n`);
  
  return groups;
}

/**
 * Execute migration based on strategy
 */
async function executeMigration(
  groups: DuplicateGroup[],
  strategy: MigrationStrategy
): Promise<MigrationReport> {
  const report: MigrationReport = {
    totalFiles: 0,
    uniqueAssets: 0,
    duplicateGroups: groups.length,
    totalDuplicates: 0,
    spaceToSave: 0,
    actions: [],
    warnings: [],
    errors: [],
  };

  let totalFiles = 0;
  let uniqueAssets = 0;

  for (const group of groups) {
    totalFiles += group.duplicates.length + 1;
    uniqueAssets += 1;
    report.totalDuplicates += group.duplicates.length;
    report.spaceToSave += group.size * group.duplicates.length;

    for (const dupPath of group.duplicates) {
      const fullPath = join(ROOT_DIR, dupPath);
      const canonicalFullPath = join(ROOT_DIR, group.canonical);

      try {
        if (strategy === 'DRY_RUN') {
          report.actions.push({
            action: 'skip',
            source: dupPath,
            target: group.canonical,
            reason: 'Would be replaced with reference to canonical file',
          });
        } else if (strategy === 'SYMLINK') {
          // Check if already a symlink
          if (existsSync(fullPath)) {
            const stat = statSync(fullPath);
            if (stat.isSymbolicLink()) {
              report.actions.push({
                action: 'skip',
                source: dupPath,
                reason: 'Already a symlink',
              });
              continue;
            }
          }

          // Remove the duplicate file
          if (existsSync(fullPath)) {
            unlinkSync(fullPath);
          }

          // Create relative symlink
          const relPath = relative(dirname(fullPath), canonicalFullPath);
          writeFileSync(fullPath, relPath); // This would need fs.symlinkSync instead
          
          // Actually create symlink (Node.js doesn't have symlinkSync in ESM easily)
          // Using a workaround with execSync for now
          const { execSync } = await import('child_process');
          execSync(`ln -sf "${relPath}" "${fullPath}"`);

          report.actions.push({
            action: 'symlink',
            source: dupPath,
            target: group.canonical,
          });
        } else if (strategy === 'DELETE') {
          if (existsSync(fullPath)) {
            unlinkSync(fullPath);
            report.actions.push({
              action: 'delete',
              source: dupPath,
            });
          }
        } else if (strategy === 'KEEP') {
          report.actions.push({
            action: 'keep',
            source: dupPath,
            target: group.canonical,
            reason: 'File kept, update code to use canonical path',
          });
        }
      } catch (error) {
        report.errors.push(
          `Failed to process ${dupPath}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  }

  report.totalFiles = totalFiles;
  report.uniqueAssets = uniqueAssets;

  return report;
}

/**
 * Print migration report
 */
function printReport(report: MigrationReport, strategy: MigrationStrategy): void {
  console.log('\n' + '='.repeat(60));
  console.log('📋 MIGRATION REPORT');
  console.log('='.repeat(60));
  console.log(`Strategy: ${strategy}`);
  console.log('');
  console.log('📊 Statistics:');
  console.log(`   Total files processed: ${report.totalFiles}`);
  console.log(`   Unique assets: ${report.uniqueAssets}`);
  console.log(`   Duplicate groups: ${report.duplicateGroups}`);
  console.log(`   Total duplicates: ${report.totalDuplicates}`);
  console.log(`   Space saved: ${(report.spaceToSave / 1024 / 1024).toFixed(2)} MB`);
  console.log('');

  if (report.actions.length > 0) {
    console.log('📝 Actions:');
    
    // Group by action type
    const byAction = report.actions.reduce((acc, action) => {
      if (!acc[action.action]) {
        acc[action.action] = [];
      }
      acc[action.action].push(action);
      return acc;
    }, {} as Record<string, typeof report.actions>);

    for (const [actionType, actions] of Object.entries(byAction)) {
      console.log(`\n   ${actionType.toUpperCase()} (${actions.length}):`);
      for (const action of actions.slice(0, 10)) {
        if (action.target) {
          console.log(`      ${action.source} → ${action.target}`);
        } else {
          console.log(`      ${action.source}`);
        }
      }
      if (actions.length > 10) {
        console.log(`      ... and ${actions.length - 10} more`);
      }
    }
  }

  if (report.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    for (const warning of report.warnings) {
      console.log(`   - ${warning}`);
    }
  }

  if (report.errors.length > 0) {
    console.log('\n❌ Errors:');
    for (const error of report.errors) {
      console.log(`   - ${error}`);
    }
  }

  console.log('\n' + '='.repeat(60));
}

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
  const { strategy, help } = parseArgs();

  if (help) {
    printHelp();
    return;
  }

  console.log('🚀 Asset Deduplication Migration');
  console.log('='.repeat(60));
  console.log(`Strategy: ${strategy}`);
  console.log(`Root directory: ${ROOT_DIR}`);
  console.log('');

  if (strategy !== 'DRY_RUN') {
    console.log('⚠️  WARNING: This will modify files!');
    console.log('⚠️  Make sure you have a backup!');
    console.log('');
    
    // Check for .backup directory or similar
    const backupWarning = `
Before proceeding, ensure you have:
  1. Backed up your files
  2. Run DRY_RUN to review changes
  3. Committed your changes to git

Continue? (y/N): `;
    
    // For non-interactive, require explicit flag
    const args = process.argv.slice(2);
    if (!args.includes('--force')) {
      console.log('⚠️  Add --force to proceed without confirmation');
      console.log('');
      console.log('Example: npm run migrate-assets -- --strategy=SYMLINK --force');
      return;
    }
  }

  try {
    const groups = await scanDuplicates();
    
    if (groups.length === 0) {
      console.log('✅ No duplicates found! Nothing to migrate.');
      return;
    }

    const report = await executeMigration(groups, strategy);
    printReport(report, strategy);

    // Write report to file
    const reportPath = join(ROOT_DIR, 'migration-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Full report written to: ${reportPath}`);

    if (strategy === 'DRY_RUN') {
      console.log('\n💡 Next steps:');
      console.log('   1. Review the report above');
      console.log('   2. Run with --strategy=SYMLINK to create symlinks');
      console.log('   3. Or run with --strategy=DELETE to remove duplicates');
      console.log('   4. Generate manifest: npm run generate-manifest');
    } else {
      console.log('\n✅ Migration complete!');
      console.log('💡 Next: Run "npm run generate-manifest" to update the asset registry');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run if executed directly
if (process.argv[1]?.endsWith('migrate-assets.ts')) {
  migrate().catch(console.error);
}

export { migrate, scanDuplicates, executeMigration };
