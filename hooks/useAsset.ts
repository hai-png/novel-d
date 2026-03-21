/**
 * useAsset Hook
 *
 * React hooks for loading assets with automatic deduplication.
 * Uses the asset registry to resolve canonical paths.
 */

import { useState, useEffect, useCallback } from 'react';
import { assetRegistry } from '@/utils/assetRegistry';
import type { AssetRecord, AssetLoaderOptions } from '@/types/assets';

export interface UseAssetResult {
  /** The resolved asset path (canonical path) */
  path: string | null;
  /** The full asset record from the registry */
  asset: AssetRecord | null;
  /** Loading state */
  loading: boolean;
  /** Error if loading failed */
  error: Error | null;
  /** Whether this asset has duplicates in the project */
  isDuplicate: boolean;
  /** All duplicate paths for this asset */
  duplicatePaths: string[];
}

export interface UseAssetStats {
  totalAssets: number;
  uniqueAssets: number;
  duplicatedAssets: number;
  spaceSaved: number;
  spaceSavedFormatted: string;
}

/**
 * Load a single asset with automatic deduplication
 *
 * @param path - The asset path to load (can be canonical or reference path)
 * @param options - Optional loader configuration
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { path, asset, loading, error } = useAsset(
 *     'src/assets/works/02_MIXED_USE/MNRC/Shot 3.mp4'
 *   );
 *
 *   if (loading) return <Loader />;
 *   if (error) return <Error message={error.message} />;
 *
 *   return <video src={path} />;
 * }
 * ```
 */
export function useAsset(
  path: string | null | undefined,
  options?: AssetLoaderOptions
): UseAssetResult {
  const [result, setResult] = useState<UseAssetResult>({
    path: null,
    asset: null,
    loading: true,
    error: null,
    isDuplicate: false,
    duplicatePaths: [],
  });

  useEffect(() => {
    let mounted = true;

    async function loadAsset() {
      if (!path) {
        setResult({
          path: null,
          asset: null,
          loading: false,
          error: null,
          isDuplicate: false,
          duplicatePaths: [],
        });
        return;
      }

      try {
        // Resolve to canonical path
        const canonicalPath = await assetRegistry.resolvePath(path, options);
        const asset = await assetRegistry.getByPath(path);
        const isDuplicate = await assetRegistry.isDuplicate(path);
        const duplicatePaths = await assetRegistry.getDuplicates(path);

        if (mounted) {
          setResult({
            path: canonicalPath,
            asset,
            loading: false,
            error: null,
            isDuplicate,
            duplicatePaths,
          });
        }
      } catch (err) {
        if (mounted) {
          setResult({
            path: options?.fallback || path,
            asset: null,
            loading: false,
            error: err instanceof Error ? err : new Error('Failed to load asset'),
            isDuplicate: false,
            duplicatePaths: [],
          });
        }
      }
    }

    loadAsset();

    return () => {
      mounted = false;
    };
  }, [path, options?.fallback]);

  return result;
}

/**
 * Load multiple assets with automatic deduplication
 *
 * @param paths - Array of asset paths to load
 * @param options - Optional loader configuration
 *
 * @example
 * ```tsx
 * function Gallery({ imagePaths }) {
 *   const { assets, loading, errors } = useAssets(imagePaths);
 *
 *   if (loading) return <Loader />;
 *
 *   return (
 *     <div>
 *       {assets.map((asset, i) => (
 *         <img key={i} src={asset.path} alt={asset.asset?.filename} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAssets(
  paths: (string | null | undefined)[],
  options?: AssetLoaderOptions
): {
  assets: UseAssetResult[];
  loading: boolean;
  allLoaded: boolean;
  errors: Array<Error | null>;
} {
  const [assets, setAssets] = useState<UseAssetResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Load each asset individually
  const assetResults = paths.map((path) => useAsset(path, options));

  useEffect(() => {
    setAssets(assetResults);
    const allLoaded = assetResults.every((a) => !a.loading);
    setLoading(!allLoaded);
  }, [assetResults]);

  const errors = assets.map((a) => a.error);
  const allLoaded = assets.every((a) => !a.loading);

  return {
    assets,
    loading,
    allLoaded,
    errors,
  };
}

/**
 * Get the canonical path for an asset
 *
 * @param path - The asset path (canonical or reference)
 *
 * @example
 * ```tsx
 * const canonicalPath = useCanonicalPath('src/assets/works/02_MIXED_USE/MNRC/Shot 3.mp4');
 * // Returns the canonical path even if the file exists in multiple locations
 * ```
 */
export function useCanonicalPath(path: string | null | undefined): string | null {
  const [canonicalPath, setCanonicalPath] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setCanonicalPath(null);
      return;
    }

    assetRegistry.getCanonicalPath(path).then(setCanonicalPath);
  }, [path]);

  return canonicalPath;
}

/**
 * Check if an asset has duplicates
 *
 * @param path - The asset path to check
 *
 * @example
 * ```tsx
 * const isDuplicate = useIsDuplicate('src/assets/works/02_MIXED_USE/MNRC/Shot 3.mp4');
 * // Returns true if this file exists in multiple locations
 * ```
 */
export function useIsDuplicate(path: string | null | undefined): boolean {
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    if (!path) {
      setIsDuplicate(false);
      return;
    }

    assetRegistry.isDuplicate(path).then(setIsDuplicate);
  }, [path]);

  return isDuplicate;
}

/**
 * Get asset registry statistics
 *
 * @example
 * ```tsx
 * const stats = useAssetStats();
 * // Returns { totalAssets, uniqueAssets, duplicatedAssets, spaceSaved, spaceSavedFormatted }
 * ```
 */
export function useAssetStats(): UseAssetStats | null {
  const [stats, setStats] = useState<UseAssetStats | null>(null);

  useEffect(() => {
    assetRegistry.getStats().then((s) => {
      setStats({
        ...s,
        spaceSavedFormatted: formatBytes(s.spaceSaved),
      });
    });
  }, []);

  return stats;
}

/**
 * Higher-Order Component wrapper for automatic asset deduplication
 *
 * @param Component - The component to wrap
 * @param pathProp - The prop name that contains the asset path (default: 'src')
 *
 * @example
 * ```tsx
 * // Wrap an image component
 * const OptimizedImage = withAsset(({ src, ...props }) => (
 *   <img src={src} {...props} />
 * ));
 *
 * // Use it normally - path is auto-resolved to canonical
 * <OptimizedImage src="src/assets/works/02_MIXED_USE/MNRC/Shot 3.mp4" alt="Project" />
 * ```
 */
export function withAsset<P extends { src?: string }>(
  Component: React.ComponentType<P>,
  pathProp: keyof P = 'src' as keyof P
): React.FC<P> {
  return function AssetWrappedComponent(props: P) {
    const path = props[pathProp] as unknown as string | undefined;
    const { path: resolvedPath, loading } = useAsset(path);

    if (loading) {
      return null;
    }

    return <Component {...props} {[pathProp]: resolvedPath as unknown as P[keyof P]} />;
  };
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Preload assets for better performance
 *
 * @example
 * ```tsx
 * // In a route component
 * useEffect(() => {
 *   preloadAssets(['path1.jpg', 'path2.mp4']);
 * }, []);
 * ```
 */
export function preloadAssets(paths: string[]): void {
  paths.forEach((path) => {
    assetRegistry.resolvePath(path);
  });
}
