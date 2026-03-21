/**
 * Asset Registry Types
 * 
 * This module provides type definitions for the centralized asset management system.
 * It enables deduplication of media files by tracking files by content hash rather than path.
 */

/**
 * Asset type enumeration
 */
export type AssetType = 'image' | 'video' | 'audio' | 'document' | 'other';

/**
 * Asset category for organization
 */
export type AssetCategory = 
  | 'animation'
  | 'aerial'
  | 'exterior'
  | 'interior'
  | 'panorama'
  | 'works'
  | 'other';

/**
 * Project metadata for work-specific assets
 */
export interface ProjectInfo {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
}

/**
 * Core asset metadata
 */
export interface AssetMetadata {
  /** Unique identifier for the asset (UUID) */
  id: string;
  
  /** Content hash (MD5/SHA) for deduplication */
  hash: string;
  
  /** Original filename */
  filename: string;
  
  /** Asset type */
  type: AssetType;
  
  /** Asset category */
  category: AssetCategory;
  
  /** File size in bytes */
  size: number;
  
  /** MIME type */
  mimeType: string;
  
  /** Dimensions (for images/videos) */
  dimensions?: {
    width: number;
    height: number;
  };
  
  /** Duration in seconds (for videos) */
  duration?: number;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last modified timestamp */
  updatedAt: string;
  
  /** Associated projects */
  projects?: ProjectInfo[];
  
  /** Tags for searchability */
  tags?: string[];
  
  /** Alt text for accessibility */
  alt?: string;
  
  /** Description */
  description?: string;
}

/**
 * Asset location information
 */
export interface AssetLocation {
  /** Relative path from project root */
  path: string;
  
  /** Whether this is the canonical (master) location */
  isCanonical: boolean;
  
  /** Whether this is a symlink/reference */
  isReference: boolean;
}

/**
 * Complete asset record
 */
export interface AssetRecord extends AssetMetadata {
  /** All locations where this asset exists */
  locations: AssetLocation[];
  
  /** Canonical path (source of truth) */
  canonicalPath: string;
  
  /** Import path for use in code */
  importPath: string;
}

/**
 * Asset registry mapping hash to asset records
 */
export interface AssetRegistry {
  /** Map of content hash to asset record */
  byHash: Record<string, AssetRecord>;
  
  /** Map of asset ID to asset record */
  byId: Record<string, AssetRecord>;
  
  /** Map of canonical path to asset record */
  byPath: Record<string, AssetRecord>;
  
  /** Assets grouped by category */
  byCategory: Record<AssetCategory, AssetRecord[]>;
  
  /** Assets grouped by project */
  byProject: Record<string, AssetRecord[]>;
  
  /** Registry metadata */
  meta: {
    version: string;
    generatedAt: string;
    totalAssets: number;
    uniqueAssets: number;
    duplicatedAssets: number;
    spaceSaved: number; // bytes saved by deduplication
  };
}

/**
 * Asset loader options
 */
export interface AssetLoaderOptions {
  /** Prefer specific category */
  category?: AssetCategory;
  
  /** Filter by project */
  project?: string;
  
  /** Fallback path if asset not found */
  fallback?: string;
}

/**
 * Asset query parameters
 */
export interface AssetQuery {
  /** Search by hash */
  hash?: string;
  
  /** Search by category */
  category?: AssetCategory;
  
  /** Search by project */
  project?: string;
  
  /** Search by tags */
  tags?: string[];
  
  /** Search by filename pattern */
  filenamePattern?: string;
  
  /** Filter by type */
  type?: AssetType;
}
