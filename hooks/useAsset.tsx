/**
 * Asset Loading Hook
 * 
 * React hook for loading assets with automatic deduplication.
 * Ensures all components use the canonical path for assets.
 */

import { useState, useEffect, useCallback } from 'react';
import { assetRegistry } from '../utils/assetRegistry';
import type { AssetRecord, AssetLoaderOptions } from '../types/assets';

interface UseAssetOptions extends AssetLoaderOptions {
  /** Skip registry lookup and use path directly */
  skipRegistry?: boolean;
  /** Preload the asset */
  preload?: boolean;
}

interface UseAssetReturn {
  /** Resolved asset path (canonical) */
  path: string;
  /** Asset metadata if found */
  asset: AssetRecord | null;
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | null;
  /** Whether this is a duplicate reference */
  isDuplicate: boolean;
  /** Reload the asset */
  reload: () => void;
}

/**
 * Hook to load a single asset with deduplication
 * 
 * @param path - The asset path to load
 * @param options - Loading options
 * @returns Asset loading result
 */
export function useAsset(
  path: string,
  options: UseAssetOptions = {}
): UseAssetReturn {
  const { skipRegistry = false, preload = false, fallback } = options;
  
  const [state, setState] = useState<{
    path: string;
    asset: AssetRecord | null;
    loading: boolean;
    error: Error | null;
  }>({
    path: path,
    asset: null,
    loading: true,
    error: null,
  });

  const reload = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const loadAsset = async () => {
      try {
        if (skipRegistry) {
          setState({
            path,
            asset: null,
            loading: false,
            error: null,
          });
          return;
        }

        const [resolvedPath, asset] = await Promise.all([
          assetRegistry.resolvePath(path, { fallback }),
          assetRegistry.getByPath(path),
        ]);

        if (preload && resolvedPath) {
          // Preload the asset
          if (asset?.type === 'image') {
            const img = new Image();
            img.src = resolvedPath;
          } else if (asset?.type === 'video') {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.src = resolvedPath;
          }
        }

        setState({
          path: resolvedPath,
          asset,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          path: fallback || path,
          asset: null,
          loading: false,
          error: err instanceof Error ? err : new Error('Failed to load asset'),
        });
      }
    };

    loadAsset();
  }, [path, skipRegistry, fallback, preload]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    ...state,
    isDuplicate: state.asset?.locations.length ? state.asset.locations.length > 1 : false,
    reload,
  };
}

/**
 * Hook to load multiple assets with deduplication
 * 
 * @param paths - Array of asset paths
 * @param options - Loading options
 * @returns Array of asset loading results
 */
export function useAssets(
  paths: string[],
  options: UseAssetOptions = {}
): Array<UseAssetReturn> {
  return paths.map(path => useAsset(path, options));
}

/**
 * Hook to get canonical path for an asset
 * 
 * @param path - The asset path
 * @returns Canonical path
 */
export function useCanonicalPath(path: string): string {
  const [canonicalPath, setCanonicalPath] = useState(path);

  useEffect(() => {
    assetRegistry.getCanonicalPath(path).then(setCanonicalPath);
  }, [path]);

  return canonicalPath;
}

/**
 * Hook to check if an asset is duplicated
 * 
 * @param path - The asset path
 * @returns Whether the asset has duplicates
 */
export function useIsDuplicate(path: string): boolean {
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    assetRegistry.isDuplicate(path).then(setIsDuplicate);
  }, [path]);

  return isDuplicate;
}

/**
 * Hook to get asset statistics
 */
export function useAssetStats() {
  const [stats, setStats] = useState<{
    totalAssets: number;
    uniqueAssets: number;
    duplicatedAssets: number;
    spaceSaved: number;
  } | null>(null);

  useEffect(() => {
    assetRegistry.getStats().then(setStats);
  }, []);

  return stats;
}

/**
 * Higher-order component wrapper for asset deduplication
 * 
 * Usage:
 * ```tsx
 * const DedupedImage = withAsset(ImageComponent);
 * <DedupedImage src="path/to/image.webp" />
 * ```
 */
export function withAsset<P extends { src: string }>(
  Component: React.ComponentType<P>
): React.FC<P & UseAssetOptions> {
  return function AssetWrappedComponent(props: P & UseAssetOptions) {
    const { src, ...options } = props;
    const { path, loading } = useAsset(src, options);

    if (loading) {
      return null; // Or a loading placeholder
    }

    const { src: _, ...restProps } = props as P & { src?: string };
    return <Component {...(restProps as P)} src={path} />;
  };
}

export default useAsset;
