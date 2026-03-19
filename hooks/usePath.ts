import { useMemo, useCallback } from 'react';
import {
  resolvePath,
  resolveAsset,
  joinPath,
  dirname,
  basename,
  extname,
  isRelative,
  isAbsolute,
  makeAbsolute,
  sanitizePath,
  publicUrl,
  createResolver,
  type AssetResolutionOptions,
} from '../utils/pathResolver';

/**
 * Hook for using path resolution utilities in React components
 * 
 * Provides memoized resolver functions and access to path utilities
 * 
 * @param baseUrl - Optional custom base URL for this component instance
 * @returns Object with path resolution utilities
 * 
 * @example
 * ```tsx
 * function ImageGallery() {
 *   const { resolve, publicUrl } = usePath();
 *   
 *   return (
 *     <div>
 *       <img src={resolve('images/gallery/photo1.jpg')} alt="Gallery 1" />
 *       <img src={publicUrl('logo.svg')} alt="Logo" />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // With custom base URL
 * function AssetLoader() {
 *   const { resolve } = usePath('/assets/');
 *   const src = resolve('images/icon.png'); // '/assets/images/icon.png'
 * }
 * ```
 */
export const usePath = (baseUrl?: string) => {
  // Memoize the resolver to avoid recreating it on every render
  const resolver = useMemo(() => {
    if (baseUrl) {
      return createResolver(baseUrl);
    }
    return null;
  }, [baseUrl]);

  // Memoized resolve function
  const resolve = useCallback(
    (path: string): string => {
      return resolvePath(path, baseUrl);
    },
    [baseUrl]
  );

  // Memoized resolveAsset function
  const resolveAssetFn = useCallback(
    (path: string, options?: Omit<AssetResolutionOptions, 'baseUrl'>): string => {
      return resolveAsset(path, { ...options, baseUrl });
    },
    [baseUrl]
  );

  // Memoized publicUrl function
  const publicUrlFn = useCallback(
    (path: string): string => {
      if (resolver) {
        return resolver.publicUrl(path);
      }
      return publicUrl(path);
    },
    [resolver]
  );

  // Memoized join function
  const join = useCallback(
    (...segments: string[]): string => {
      if (baseUrl && resolver) {
        return resolver.join(...segments);
      }
      return joinPath(...segments);
    },
    [baseUrl, resolver]
  );

  return {
    /** Resolve a path with optional base URL */
    resolve,
    
    /** Resolve an asset path with cache-busting support */
    resolveAsset: resolveAssetFn,
    
    /** Get public URL for an asset */
    publicUrl: publicUrlFn,
    
    /** Join path segments safely */
    join,
    
    /** Get directory name from a path */
    dirname,
    
    /** Get file name from a path */
    basename,
    
    /** Get file extension from a path */
    extname,
    
    /** Check if path is relative */
    isRelative,
    
    /** Check if path is absolute */
    isAbsolute,
    
    /** Make a relative path absolute */
    makeAbsolute: (path: string, root: string) => makeAbsolute(path, root),
    
    /** Sanitize a path to prevent directory traversal */
    sanitize: (path: string, allowedBase?: string) => sanitizePath(path, allowedBase),
    
    /** Create a custom resolver with a specific base URL */
    createResolver: (customBase: string) => createResolver(customBase),
  };
};

export default usePath;
