/**
 * Asset Verification Script
 *
 * Verifies that all assets match their content from the last git commit.
 * Compares MD5 hashes of current files against committed versions.
 */

import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { readFileSync, statSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = process.cwd();

interface VerificationResult {
  totalFiles: number;
  verified: number;
  modified: number;
  missing: number;
  symlinks: number;
  errors: Array<{
    path: string;
    error: string;
  }>;
  modifiedFiles: Array<{
    path: string;
    expectedHash: string;
    actualHash: string;
    isSymlink: boolean;
  }>;
}

/**
 * Compute MD5 hash of file content
 * For symlinks, follows the link and reads the target content
 */
function computeFileHash(filePath: string): string {
  // readFileSync automatically follows symlinks
  const content = readFileSync(filePath);
  return createHash('md5').update(content).digest('hex');
}

/**
 * Get committed file hash from git
 * For Git LFS files, we need to checkout the actual content using smudge
 */
function getGitFileHash(path: string): string | null {
  try {
    // Check if it's an LFS file by looking at the pointer
    const pointer = execSync(`git show HEAD:"${path}"`, {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 1024 * 1024
    });
    
    // If it's an LFS pointer, use git lfs smudge to get the actual content
    if (pointer.startsWith('version https://git-lfs.github.com/')) {
      const result = execSync(`git show HEAD:"${path}" | git lfs smudge | md5sum`, {
        cwd: ROOT_DIR,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        maxBuffer: 100 * 1024 * 1024
      });
      return result.split(' ')[0].trim();
    }
    
    // For non-LFS files, use regular md5sum
    const result = execSync(`git show HEAD:"${path}" | md5sum`, {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.split(' ')[0].trim();
  } catch (error) {
    console.error(`Error getting hash for ${path}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * Get list of asset files from git
 */
function getCommittedAssets(): string[] {
  const result = execSync('git ls-tree -r HEAD --name-only', {
    cwd: ROOT_DIR,
    encoding: 'utf-8'
  });
  
  return result
    .split('\n')
    .filter(line => line.trim())
    .filter(path => /\.(webp|jpg|jpeg|png|gif|mp4|webm|mov|avi|mkv)$/i.test(path));
}

/**
 * Verify all assets match their committed versions
 */
async function verifyAssets(): Promise<VerificationResult> {
  console.log('🔍 Verifying assets against last commit...\n');
  
  const committedAssets = getCommittedAssets();
  console.log(`📊 Found ${committedAssets.length} asset files in last commit\n`);
  
  const result: VerificationResult = {
    totalFiles: committedAssets.length,
    verified: 0,
    modified: 0,
    missing: 0,
    symlinks: 0,
    errors: [],
    modifiedFiles: [],
  };
  
  for (const path of committedAssets) {
    const fullPath = join(ROOT_DIR, path);
    
    try {
      // Check if file exists (follows symlinks)
      let stat;
      try {
        stat = statSync(fullPath);
      } catch (err) {
        result.missing++;
        result.errors.push({
          path,
          error: 'File not found',
        });
        console.log(`❌ ${path} - MISSING`);
        continue;
      }
      
      // Check if it's a symlink
      const lstat = statSync(fullPath, { throwIfNoEntry: false });
      const isSymlink = lstat?.isSymbolicLink?.() || false;
      
      if (isSymlink) {
        result.symlinks++;
      }
      
      // Get committed hash
      const committedHash = getGitFileHash(path);
      if (!committedHash) {
        result.errors.push({
          path,
          error: 'Could not get committed hash',
        });
        continue;
      }
      
      // Get current hash
      const currentHash = computeFileHash(fullPath);
      
      if (committedHash === currentHash) {
        result.verified++;
        if (isSymlink) {
          console.log(`✅ ${path} - OK (symlink)`);
        } else {
          console.log(`✅ ${path} - OK`);
        }
      } else {
        result.modified++;
        result.modifiedFiles.push({
          path,
          expectedHash: committedHash,
          actualHash: currentHash,
          isSymlink,
        });
        console.log(`⚠️  ${path} - MODIFIED`);
        console.log(`    Expected: ${committedHash}`);
        console.log(`    Actual:   ${currentHash}`);
      }
    } catch (err) {
      result.errors.push({
        path,
        error: err instanceof Error ? err.message : String(err),
      });
      console.log(`❌ ${path} - ERROR: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  
  return result;
}

/**
 * Print verification report
 */
function printReport(result: VerificationResult): void {
  console.log('\n' + '='.repeat(70));
  console.log('📋 ASSET VERIFICATION REPORT');
  console.log('='.repeat(70));
  console.log('');
  console.log('📊 Summary:');
  console.log(`   Total files:     ${result.totalFiles}`);
  console.log(`   ✅ Verified:     ${result.verified}`);
  console.log(`   ⚠️  Modified:     ${result.modified}`);
  console.log(`   ❌ Missing:      ${result.missing}`);
  console.log(`   🔗 Symlinks:     ${result.symlinks}`);
  console.log(`   📝 Errors:       ${result.errors.length}`);
  console.log('');
  
  if (result.modifiedFiles.length > 0) {
    console.log('⚠️  Modified Files:');
    for (const file of result.modifiedFiles.slice(0, 20)) {
      console.log(`   ${file.path}`);
      console.log(`      Expected: ${file.expectedHash}`);
      console.log(`      Actual:   ${file.actualHash}`);
    }
    if (result.modifiedFiles.length > 20) {
      console.log(`   ... and ${result.modifiedFiles.length - 20} more`);
    }
    console.log('');
  }
  
  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    for (const error of result.errors) {
      console.log(`   ${error.path}: ${error.error}`);
    }
    console.log('');
  }
  
  // Final verdict
  console.log('='.repeat(70));
  if (result.modified === 0 && result.missing === 0 && result.errors.length === 0) {
    console.log('✅ ALL ASSETS VERIFIED - Content matches last commit!');
  } else {
    console.log('⚠️  VERIFICATION ISSUES FOUND');
    if (result.modified > 0) {
      console.log(`   - ${result.modified} file(s) have different content`);
    }
    if (result.missing > 0) {
      console.log(`   - ${result.missing} file(s) are missing`);
    }
    if (result.errors.length > 0) {
      console.log(`   - ${result.errors.length} error(s) during verification`);
    }
  }
  console.log('='.repeat(70));
}

// Main
verifyAssets()
  .then(printReport)
  .catch(console.error);

export { verifyAssets };
