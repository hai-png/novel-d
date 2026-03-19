/**
 * Production-ready path resolution utility
 * 
 * Provides type-safe, environment-aware path resolution for:
 * - Static asset paths
 * - Dynamic imports
 * - URL normalization
 * - Base path handling for different environments
 */

/**
 * Path aliases matching vite.config.ts and tsconfig.json
 */
export const PATH_ALIASES = {
  '@': '',
  '@components': 'components',
  '@hooks': 'hooks',
  '@utils': 'utils',
  '@types': '',
} as const;

export type PathAlias = keyof typeof PATH_ALIASES;

/**
 * Base path configuration
 * Uses relative base ('./') for Vite production builds
 */
const getBasePath = (): string => {
  // In Vite production build with base: './', this will be empty string
  // In development, it's also typically empty
  // Can be overridden via environment variable if needed
  return import.meta.env.BASE_URL || '';
};

/**
 * Normalize path separators and remove redundant slashes
 */
export const normalizePath = (path: string): string => {
  if (!path) return '';
  
  return path
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '')
    .replace(/^\//, '');
};

/**
 * Resolve a relative or aliased path to an absolute URL
 * 
 * @param path - The path to resolve (can be relative, absolute, or aliased)
 * @param baseUrl - Optional base URL to prepend (defaults to Vite's BASE_URL)
 * @returns Normalized absolute path
 * 
 * @example
 * resolvePath('./image.png')           // './image.png'
 * resolvePath('/images/logo.png')      // '/images/logo.png'
 * resolvePath('images/logo.png')       // 'images/logo.png'
 * resolvePath('@components/Button')    // 'components/Button'
 */
export const resolvePath = (path: string, baseUrl?: string): string => {
  if (!path) return '';
  
  // Handle protocol-relative and absolute URLs
  if (path.startsWith('//') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Handle data URIs
  if (path.startsWith('data:')) {
    return path;
  }
  
  // Handle blob URLs
  if (path.startsWith('blob:')) {
    return path;
  }
  
  // Resolve path aliases
  let resolvedPath = path;
  for (const [alias, replacement] of Object.entries(PATH_ALIASES)) {
    if (path.startsWith(`${alias}/`) || path === alias) {
      resolvedPath = path.replace(alias, replacement);
      break;
    }
  }
  
  // Normalize the path
  resolvedPath = normalizePath(resolvedPath);
  
  // Handle root-relative paths (start with /)
  if (path.startsWith('/')) {
    const base = baseUrl ?? getBasePath();
    return normalizePath(`${base}${resolvedPath}`);
  }
  
  // Handle relative paths
  if (resolvedPath.startsWith('./') || resolvedPath.startsWith('../')) {
    const base = baseUrl ?? getBasePath();
    return normalizePath(`${base}${resolvedPath}`);
  }
  
  // For non-relative paths, return as-is or prepend base if provided
  const base = baseUrl ?? getBasePath();
  if (base) {
    return normalizePath(`${base}/${resolvedPath}`);
  }
  
  return resolvedPath;
};

/**
 * Resolve asset paths with cache-busting support
 * 
 * @param path - Asset path
 * @param options - Resolution options
 * @returns Resolved asset path
 */
export interface AssetResolutionOptions {
  /** Add cache-busting query parameter */
  cacheBust?: boolean;
  /** Custom base URL */
  baseUrl?: string;
  /** Asset version for cache busting */
  version?: string;
}

export const resolveAsset = (
  path: string,
  options: AssetResolutionOptions = {}
): string => {
  const { cacheBust = false, baseUrl, version } = options;
  
  let resolvedPath = resolvePath(path, baseUrl);
  
  if (cacheBust) {
    const versionParam = version || Date.now().toString();
    const separator = resolvedPath.includes('?') ? '&' : '?';
    resolvedPath = `${resolvedPath}${separator}v=${versionParam}`;
  }
  
  return resolvedPath;
};

/**
 * Safely join path segments without directory traversal vulnerabilities
 * 
 * @param segments - Path segments to join
 * @returns Safe joined path
 * 
 * @example
 * joinPath('images', 'products', 'logo.png')  // 'images/products/logo.png'
 * joinPath('/assets', '../secret.txt')         // 'assets/secret.txt' (traversal blocked)
 */
export const joinPath = (...segments: string[]): string => {
  if (segments.length === 0) return '';
  
  // Filter out empty segments and normalize each segment
  const normalizedSegments = segments
    .filter(segment => segment && segment !== '.')
    .map(segment => {
      // Remove leading/trailing slashes
      let normalized = segment.replace(/^\/+|\/+$/g, '');
      // Prevent directory traversal
      normalized = normalized.replace(/\.\.\//g, '').replace(/\.\.$/g, '');
      return normalized;
    })
    .filter(segment => segment); // Remove empty segments after normalization
  
  return normalizedSegments.join('/');
};

/**
 * Get the directory name from a path
 */
export const dirname = (path: string): string => {
  if (!path) return '';
  const normalized = normalizePath(path);
  const lastSlash = normalized.lastIndexOf('/');
  return lastSlash === -1 ? '' : normalized.substring(0, lastSlash);
};

/**
 * Get the file name from a path
 */
export const basename = (path: string, ext?: string): string => {
  if (!path) return '';
  const normalized = normalizePath(path);
  const lastSlash = normalized.lastIndexOf('/');
  let name = lastSlash === -1 ? normalized : normalized.substring(lastSlash + 1);
  
  if (ext && name.endsWith(ext)) {
    name = name.slice(0, -ext.length);
  }
  
  return name;
};

/**
 * Get the file extension from a path
 */
export const extname = (path: string): string => {
  if (!path) return '';
  const normalized = normalizePath(path);
  const lastSlash = normalized.lastIndexOf('/');
  const fileName = lastSlash === -1 ? normalized : normalized.substring(lastSlash + 1);
  const lastDot = fileName.lastIndexOf('.');
  return lastDot === -1 ? '' : fileName.substring(lastDot);
};

/**
 * Check if a path is relative (starts with ./ or ../)
 */
export const isRelative = (path: string): boolean => {
  return path.startsWith('./') || path.startsWith('../');
};

/**
 * Check if a path is absolute (starts with / or is a full URL)
 */
export const isAbsolute = (path: string): boolean => {
  return path.startsWith('/') || 
         path.startsWith('http://') || 
         path.startsWith('https://') ||
         path.startsWith('//');
};

/**
 * Make a relative path absolute based on a root path
 */
export const makeAbsolute = (path: string, root: string): string => {
  if (isAbsolute(path)) return path;
  
  const rootNormalized = normalizePath(root);
  const pathNormalized = normalizePath(path);
  
  // If path is relative (./ or ../)
  if (path.startsWith('./')) {
    return joinPath(rootNormalized, pathNormalized.slice(2));
  }
  
  if (path.startsWith('../')) {
    // Simple parent directory handling
    const rootParts = rootNormalized.split('/');
    const pathParts = pathNormalized.split('/');
    
    for (const part of pathParts) {
      if (part === '..') {
        rootParts.pop();
      } else {
        rootParts.push(part);
      }
    }
    
    return rootParts.join('/');
  }
  
  return joinPath(rootNormalized, pathNormalized);
};

/**
 * Convert Windows-style paths to Unix-style for consistency
 */
export const toUnixPath = (path: string): string => {
  return path.replace(/\\/g, '/');
};

/**
 * Sanitize a path to prevent directory traversal attacks
 * 
 * @param path - Path to sanitize
 * @param allowedBase - Optional base directory that paths must be within
 * @returns Sanitized path or null if path escapes allowed base
 */
export const sanitizePath = (path: string, allowedBase?: string): string | null => {
  if (!path) return null;
  
  // Normalize and resolve the path
  const normalized = normalizePath(path);
  
  // Check for obvious traversal attempts
  if (normalized.includes('..')) {
    if (allowedBase) {
      // Resolve the full path and check if it's within allowed base
      const resolved = makeAbsolute(normalized, allowedBase);
      const baseNormalized = normalizePath(allowedBase);
      
      if (!resolved.startsWith(baseNormalized)) {
        return null;
      }
      
      return resolved;
    }
    // Remove traversal sequences if no base is specified
    return normalized.replace(/\.\.\//g, '').replace(/\.\.$/g, '');
  }
  
  return normalized;
};

/**
 * Generate a public URL for an asset
 * This is useful for Vite's public directory assets
 * 
 * @param path - Path to the asset in the public directory
 * @returns Full public URL
 */
export const publicUrl = (path: string): string => {
  const base = getBasePath();
  const normalized = normalizePath(path);
  
  // Ensure we don't double up slashes
  if (base.endsWith('/') && normalized.startsWith('/')) {
    return `${base}${normalized.slice(1)}`;
  }
  
  return `${base}${normalized}`;
};

/**
 * Resolve multiple paths at once
 * 
 * @param paths - Array of paths to resolve
 * @param baseUrl - Optional base URL
 * @returns Array of resolved paths
 */
export const resolvePaths = (paths: string[], baseUrl?: string): string[] => {
  return paths.map(path => resolvePath(path, baseUrl));
};

/**
 * Create a path resolver with a custom base URL
 * 
 * @param baseUrl - Base URL to use for all resolutions
 * @returns Resolver function
 * 
 * @example
 * const resolver = createResolver('/assets/');
 * resolver('images/logo.png') // '/assets/images/logo.png'
 */
export const createResolver = (baseUrl: string) => {
  return {
    resolve: (path: string) => resolvePath(path, baseUrl),
    resolveAsset: (path: string, options?: Omit<AssetResolutionOptions, 'baseUrl'>) => 
      resolveAsset(path, { ...options, baseUrl }),
    join: (...segments: string[]) => joinPath(baseUrl, ...segments),
    publicUrl: (path: string) => {
      const normalized = normalizePath(path);
      return normalized.startsWith('/') 
        ? `${baseUrl}${normalized}` 
        : `${baseUrl}/${normalized}`;
    },
  };
};

export default {
  resolvePath,
  resolveAsset,
  joinPath,
  dirname,
  basename,
  extname,
  isRelative,
  isAbsolute,
  makeAbsolute,
  toUnixPath,
  sanitizePath,
  publicUrl,
  resolvePaths,
  createResolver,
  normalizePath,
  PATH_ALIASES,
};
