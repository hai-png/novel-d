# Asset Deduplication & Management System

## Overview

This project now includes a **production-ready asset management system** that handles duplicate files intelligently by tracking them via content hash rather than file path. This ensures all references to the same file point to a single canonical source.

## Problem Solved

Previously, the project had **67 groups of duplicate files** (141 total file instances) - mostly images and videos - duplicated across:
- Type-based directories: `animation/`, `exterior/`, `interior/`, etc.
- Project-based directories: `works/01_APARTMENT/`, `works/02_MIXED_USE/`, etc.

This caused:
- Wasted storage space (~MBs of duplicates)
- Inconsistent asset loading
- Maintenance overhead
- Potential caching issues

## Solution Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Asset Management System                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────┐ │
│  │   Manifest   │────▶│   Registry   │◀────│  React Hook │ │
│  │  Generator   │     │   Manager    │     │  useAsset() │ │
│  └──────────────┘     └──────────────┘     └─────────────┘ │
│         │                   │                      │        │
│         ▼                   ▼                      ▼        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Content-Hash Based Deduplication          │   │
│  │  - Track files by MD5 hash, not path                │   │
│  │  - Canonical path + reference locations             │   │
│  │  - Automatic path resolution                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Asset Registry (`src/utils/assetRegistry.ts`)

Centralized manager that:
- Loads asset manifest at runtime
- Resolves canonical paths for assets
- Provides query capabilities (by hash, category, project, tags)
- Tracks duplicate locations

### 2. Asset Manifest (`src/assets/manifest.json`)

Auto-generated JSON file containing:
- Complete asset inventory with metadata
- Content hashes for deduplication
- Canonical vs reference path mapping
- Project associations and tags
- Statistics (space saved, duplicate count)

### 3. React Hooks (`hooks/useAsset.ts`)

Ready-to-use hooks:
- `useAsset(path)` - Load single asset with deduplication
- `useAssets(paths[])` - Load multiple assets
- `useCanonicalPath(path)` - Get canonical path
- `useIsDuplicate(path)` - Check if asset has duplicates
- `useAssetStats()` - Get registry statistics
- `withAsset(Component)` - HOC wrapper

### 4. Type Definitions (`src/types/assets.ts`)

TypeScript types for:
- Asset metadata and records
- Registry structure
- Query parameters
- Loader options

### 5. Migration Scripts (`scripts/`)

- **`generate-manifest.ts`** - Scans assets and generates manifest
- **`migrate-assets.ts`** - Deduplicates files (symlink/delete strategies)

## Usage

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate asset manifest (auto-runs during build)
npm run generate-manifest

# 3. (Optional) Migrate duplicates
npm run migrate-assets -- --strategy=DRY_RUN
npm run migrate-assets -- --strategy=SYMLINK --force

# 4. Build (manifest generated automatically)
npm run build
```

### Using Assets in Components

#### Before (no deduplication):
```tsx
<img src="src/assets/works/02_MIXED_USE/MNRC/Shot 3.mp4" />
```

#### After (with deduplication):
```tsx
import { useAsset } from '@/hooks/useAsset';

function MyComponent() {
  const { path, asset, loading } = useAsset(
    'src/assets/works/02_MIXED_USE/MNRC/Shot 3.mp4'
  );
  
  if (loading) return <Loader />;
  
  return <img src={path} alt={asset?.alt} />;
}
```

The hook automatically resolves to the canonical path, ensuring:
- Consistent caching
- Reduced bundle size
- Single source of truth

### Querying Assets

```tsx
import { assetRegistry } from '@/utils/assetRegistry';

// Get all animation assets
const animations = await assetRegistry.query({
  category: 'animation',
  type: 'video'
});

// Get assets by project
const projectAssets = await assetRegistry.getByProject('project-02');

// Get assets by tags
const shots = await assetRegistry.query({
  tags: ['shot', 'walkthrough']
});
```

## Migration Strategies

### DRY_RUN (Recommended First)
```bash
npm run migrate-assets -- --strategy=DRY_RUN
```
Reports what would be done without making changes.

### SYMLINK
```bash
npm run migrate-assets -- --strategy=SYMLINK --force
```
Replaces duplicate files with symlinks to canonical files.

**Pros:**
- Saves disk space immediately
- No code changes needed
- Reversible

**Cons:**
- Symlinks may not work on all systems
- Git may not track symlinks properly

### DELETE
```bash
npm run migrate-assets -- --strategy=DELETE --force
```
Removes duplicate files entirely.

**Pros:**
- Maximum space savings
- Clean file structure

**Cons:**
- Requires code updates to use canonical paths
- Irreversible without backup

### KEEP
```bash
npm run migrate-assets -- --strategy=KEEP --force
```
Keeps all files but generates manifest for path resolution.

**Pros:**
- No file changes
- Safe migration

**Cons:**
- No immediate space savings
- Still need to update code eventually

## Production Readiness

### Build Integration

The build process automatically:
1. Generates fresh manifest before bundling
2. Uses Vite's asset hashing for cache busting
3. Organizes assets by type in output

### Performance Optimizations

- **Lazy loading**: Manifest loaded on-demand, not in main bundle
- **Caching**: Registry cached after first load
- **Preloading**: Optional asset preloading via hook options
- **Compression**: Gzip + Brotli compression enabled

### Best Practices

1. **Always run DRY_RUN first** before migrating
2. **Backup files** before SYMLINK or DELETE strategies
3. **Commit manifest** to version control
4. **Regenerate manifest** when adding/removing assets
5. **Use hooks consistently** for asset loading

## File Structure

```
novel-d/
├── src/
│   ├── assets/
│   │   ├── manifest.json          # Auto-generated asset registry
│   │   └── images-optimized/      # Source asset files
│   ├── types/
│   │   └── assets.ts              # Type definitions
│   └── utils/
│       └── assetRegistry.ts       # Registry manager
├── hooks/
│   ├── useAsset.ts                # Asset loading hooks
│   └── useNavigation.ts           # Existing navigation hook
├── scripts/
│   ├── generate-manifest.ts       # Manifest generator
│   └── migrate-assets.ts          # Migration tool
├── vite.config.ts                 # Updated with asset aliases
└── package.json                   # New npm scripts
```

## NPM Scripts

```json
{
  "dev": "vite",                          // Start dev server
  "build": "npm run generate-manifest && vite build",  // Build with manifest
  "generate-manifest": "tsx scripts/generate-manifest.ts",
  "migrate-assets": "tsx scripts/migrate-assets.ts"
}
```

## Statistics & Monitoring

Check asset statistics:
```tsx
import { useAssetStats } from '@/hooks/useAsset';

function Stats() {
  const stats = useAssetStats();
  
  return (
    <div>
      <p>Total files: {stats?.totalAssets}</p>
      <p>Unique assets: {stats?.uniqueAssets}</p>
      <p>Duplicates: {stats?.duplicatedAssets}</p>
      <p>Space saved: {(stats!.spaceSaved / 1024 / 1024).toFixed(2)} MB</p>
    </div>
  );
}
```

## Troubleshooting

### Manifest not found
```bash
npm run generate-manifest
```

### Path resolution issues
Ensure you're using absolute paths from project root:
```tsx
// ✅ Correct
useAsset('src/assets/animation/flythroughs/Shot 3.mp4')

// ❌ Incorrect
useAsset('./Shot 3.mp4')
```

### Build errors
Clear cache and regenerate:
```bash
rm -rf dist/ src/assets/manifest.json
npm run build
```

## Future Enhancements

- [ ] Automatic image optimization during manifest generation
- [ ] CDN integration for asset delivery
- [ ] Asset usage analytics
- [ ] Automated duplicate detection in CI/CD
- [ ] Asset prefetching based on routes

## Support

For issues or questions:
1. Check migration report: `migration-report.json`
2. Review manifest: `src/assets/manifest.json`
3. Run dry-run: `npm run migrate-assets -- --strategy=DRY_RUN`

---

**Last Updated**: March 2025  
**Version**: 1.0.0
