/**
 * Path Resolution Utilities
 * 
 * Production-ready path resolving for files and assets
 * 
 * @example
 * ```ts
 * import { resolvePath, resolveAsset, usePath } from '@utils/path';
 * ```
 */

export {
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
  type PathAlias,
  type AssetResolutionOptions,
} from './pathResolver';

export { usePath } from './usePath';

export { default } from './pathResolver';
