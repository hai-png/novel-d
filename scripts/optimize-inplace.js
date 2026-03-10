import { exec } from 'child_process';
import { promisify } from 'util';
import { glob } from 'glob';
import { dirname, join, basename, extname } from 'path';
import { stat, rename, unlink, cp } from 'fs/promises';
import { existsSync } from 'fs';
import sharp from 'sharp';

const execAsync = promisify(exec);

const ROOT_DIR = 'src/assets/images-optimized';

// Thresholds for optimization
const VIDEO_MAX_BITRATE = 10000000; // 10 Mbps
const VIDEO_MAX_WIDTH = 1920;
const VIDEO_MAX_HEIGHT = 1080;
const IMAGE_MAX_DIMENSION = 2560;
const IMAGE_QUALITY = 85;

async function getFileSize(filePath) {
  const stats = await stat(filePath);
  return stats.size;
}

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }
  return `${bytes.toFixed(2)} ${units[unitIndex]}`;
}

async function getDirectorySize(dir) {
  const { readdir } = await import('fs/promises');
  let totalSize = 0;

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      totalSize += await getDirectorySize(fullPath);
    } else if (entry.isFile()) {
      const stats = await stat(fullPath);
      totalSize += stats.size;
    }
  }

  return totalSize;
}

async function checkVideo(filePath) {
  try {
    const metadata = await execAsync(`ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,bit_rate -of csv=p=0 "${filePath}"`);
    const info = metadata.stdout.trim();
    const [codec, width, height, bitrate] = info.split(',');
    
    const needsOptimization = 
      codec !== 'h264' || 
      (parseInt(width) > VIDEO_MAX_WIDTH) || 
      (parseInt(height) > VIDEO_MAX_HEIGHT) || 
      (bitrate && parseInt(bitrate) > VIDEO_MAX_BITRATE);
    
    return {
      needsOptimization,
      codec,
      width: parseInt(width),
      height: parseInt(height),
      bitrate: parseInt(bitrate) || 0
    };
  } catch (error) {
    console.error(`  Warning: Could not analyze ${basename(filePath)}`);
    return { needsOptimization: false, error: true };
  }
}

async function optimizeVideo(inputPath) {
  try {
    const originalSize = await getFileSize(inputPath);
    const dir = dirname(inputPath);
    const name = basename(inputPath, extname(inputPath));
    
    const check = await checkVideo(inputPath);
    if (check.error || !check.needsOptimization) {
      return { skipped: true, reason: 'already optimized' };
    }

    console.log(`  Optimizing: ${basename(inputPath)} (${(originalSize/1024/1024).toFixed(2)} MB)`);
    
    const tempOutput = join(dir, name + '.temp.mp4');

    // Optimize video with ffmpeg
    const ffmpegCommand = `ffmpeg -y -i "${inputPath}" ` +
      `-c:v libx264 -preset fast -crf 28 ` +
      `-vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2" ` +
      `-c:a aac -b:a 128k ` +
      `-movflags +faststart ` +
      `"${tempOutput}"`;

    await execAsync(ffmpegCommand, { maxBuffer: 1024 * 1024 * 100 });

    // Replace original with optimized version
    await unlink(inputPath);
    await rename(tempOutput, inputPath);

    const newSize = await getFileSize(inputPath);
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    return { success: true, originalSize, newSize, savings };
  } catch (error) {
    console.error(`  ✗ Failed: ${basename(inputPath)} - ${error.message}`);
    return { failed: true, error: error.message };
  }
}

async function checkImage(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    const { width, height, format } = metadata;
    
    const needsOptimization = 
      (width > IMAGE_MAX_DIMENSION) || 
      (height > IMAGE_MAX_DIMENSION) ||
      format === 'png' || // Always convert PNG to WebP
      format === 'jpeg' || format === 'jpg'; // Optimize JPEGs
    
    return {
      needsOptimization,
      width,
      height,
      format
    };
  } catch (error) {
    return { needsOptimization: false, error: true };
  }
}

async function optimizeImage(inputPath) {
  try {
    const originalSize = await getFileSize(inputPath);
    const ext = extname(inputPath).toLowerCase();
    const dir = dirname(inputPath);
    const name = basename(inputPath, extname(inputPath));
    
    const check = await checkImage(inputPath);
    if (check.error || !check.needsOptimization) {
      return { skipped: true, reason: 'already optimized' };
    }

    console.log(`  Optimizing: ${basename(inputPath)} (${(originalSize/1024/1024).toFixed(2)} MB) - ${check.width}x${check.height} ${check.format}`);
    
    const outputPath = join(dir, name + '.webp');
    const tempOutput = join(dir, name + '.temp.webp');

    let pipeline = sharp(inputPath);

    // Resize if image is too large
    if (check.width > IMAGE_MAX_DIMENSION || check.height > IMAGE_MAX_DIMENSION) {
      pipeline = pipeline.resize(IMAGE_MAX_DIMENSION, IMAGE_MAX_DIMENSION, { 
        fit: 'inside', 
        withoutEnlargement: true 
      });
    }

    // Convert to WebP with optimization
    pipeline = pipeline.webp({
      quality: IMAGE_QUALITY,
      effort: 6
    });

    await pipeline.toFile(tempOutput);

    // Replace original with optimized version (as WebP)
    await unlink(inputPath);
    await rename(tempOutput, outputPath);

    const newSize = await getFileSize(outputPath);
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    return { success: true, originalSize, newSize, savings, outputPath };
  } catch (error) {
    console.error(`  ✗ Failed: ${basename(inputPath)} - ${error.message}`);
    return { failed: true, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting in-place optimization...\n');
  console.log(`📁 Root directory: ${ROOT_DIR}\n`);

  const originalSize = await getDirectorySize(ROOT_DIR);
  console.log(`📦 Original size: ${formatBytes(originalSize)}\n`);

  // Find all videos
  const videoPattern = `${ROOT_DIR}/**/*.{mp4,mov,MP4,MOV}`;
  const videos = await glob(videoPattern);
  
  // Find all images
  const imagePattern = `${ROOT_DIR}/**/*.{png,jpg,jpeg,PNG,JPG,JPEG}`;
  const images = await glob(imagePattern);

  console.log(`📹 Found ${videos.length} videos`);
  console.log(`🖼️  Found ${images.length} images\n`);

  let videoSuccess = 0;
  let videoSkipped = 0;
  let videoFailed = 0;

  let imageSuccess = 0;
  let imageSkipped = 0;
  let imageFailed = 0;

  // Optimize videos
  if (videos.length > 0) {
    console.log('=== OPTIMIZING VIDEOS ===\n');
    for (const video of videos) {
      const result = await optimizeVideo(video);
      if (result.success) videoSuccess++;
      else if (result.skipped) videoSkipped++;
      else if (result.failed) videoFailed++;
    }
    console.log();
  }

  // Optimize images
  if (images.length > 0) {
    console.log('=== OPTIMIZING IMAGES ===\n');
    for (const image of images) {
      const result = await optimizeImage(image);
      if (result.success) imageSuccess++;
      else if (result.skipped) imageSkipped++;
      else if (result.failed) imageFailed++;
    }
    console.log();
  }

  // Get final size
  const finalSize = await getDirectorySize(ROOT_DIR);
  const totalSaved = originalSize - finalSize;

  console.log('='.repeat(60));
  console.log('✅ OPTIMIZATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`\n📹 Videos: ${videoSuccess} optimized, ${videoSkipped} skipped, ${videoFailed} failed`);
  console.log(`🖼️  Images: ${imageSuccess} optimized, ${imageSkipped} skipped, ${imageFailed} failed`);
  console.log(`\n📦 Original size: ${formatBytes(originalSize)}`);
  console.log(`📦 Final size: ${formatBytes(finalSize)}`);
  console.log(`💾 Space saved: ${formatBytes(totalSaved)} (${(totalSaved/originalSize*100).toFixed(1)}%)`);
  console.log('='.repeat(60));
}

main().catch(console.error);
