/**
 * Asset Registry
 * 
 * Centralized asset management system that handles deduplication
 * by tracking files by content hash rather than path.
 */

import type {
  AssetRegistry,
  AssetRecord,
  AssetQuery,
  AssetCategory,
  AssetLoaderOptions,
} from '../types/assets';

/**
 * Asset Registry Class
 * 
 * Provides methods to query and load assets while handling deduplication automatically.
 * In production, this loads from a pre-generated manifest.
 * In development, it can optionally scan for assets dynamically.
 */
class AssetRegistryManager {
  private registry: AssetRegistry | null = null;
  private loadPromise: Promise<AssetRegistry> | null = null;

  /**
   * Initialize the asset registry
   * Loads the manifest from the generated JSON file
   */
  async initialize(): Promise<AssetRegistry> {
    if (this.registry) {
      return this.registry;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      try {
        // Dynamic import to avoid bundling the large manifest in main bundle
        const manifest = await import('../assets/manifest.json');
        this.registry = manifest.default as AssetRegistry;
        return this.registry;
      } catch (error) {
        console.warn('Asset manifest not found. Running in development mode without asset deduplication.');
        // Create empty registry for development
        this.registry = this.createEmptyRegistry();
        return this.registry;
      }
    })();

    return this.loadPromise;
  }

  /**
   * Create an empty registry for development/fallback
   */
  private createEmptyRegistry(): AssetRegistry {
    return {
      byHash: {},
      byId: {},
      byPath: {},
      byCategory: {
        animation: [],
        aerial: [],
        exterior: [],
        interior: [],
        panorama: [],
        works: [],
        other: [],
      },
      byProject: {},
      meta: {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        totalAssets: 0,
        uniqueAssets: 0,
        duplicatedAssets: 0,
        spaceSaved: 0,
      },
    };
  }

  /**
   * Get asset by content hash
   */
  async getByHash(hash: string): Promise<AssetRecord | null> {
    await this.initialize();
    return this.registry?.byHash[hash] || null;
  }

  /**
   * Get asset by ID
   */
  async getById(id: string): Promise<AssetRecord | null> {
    await this.initialize();
    return this.registry?.byId[id] || null;
  }

  /**
   * Get asset by path (canonical or reference)
   */
  async getByPath(path: string): Promise<AssetRecord | null> {
    await this.initialize();
    // Normalize path
    const normalizedPath = path.replace(/^\/+/, '').replace(/\/+/g, '/');
    return this.registry?.byPath[normalizedPath] || null;
  }

  /**
   * Query assets with filters
   */
  async query(query: AssetQuery): Promise<AssetRecord[]> {
    await this.initialize();
    if (!this.registry) return [];

    let results = Object.values(this.registry.byHash);

    // Filter by hash
    if (query.hash) {
      results = results.filter(asset => asset.hash === query.hash);
    }

    // Filter by category
    if (query.category) {
      results = results.filter(asset => asset.category === query.category);
    }

    // Filter by project
    if (query.project) {
      results = results.filter(asset =>
        asset.projects?.some(p => p.id === query.project || p.name === query.project)
      );
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      results = results.filter(asset =>
        asset.tags?.some(tag => query.tags!.includes(tag))
      );
    }

    // Filter by type
    if (query.type) {
      results = results.filter(asset => asset.type === query.type);
    }

    // Filter by filename pattern
    if (query.filenamePattern) {
      const pattern = new RegExp(query.filenamePattern, 'i');
      results = results.filter(asset => pattern.test(asset.filename));
    }

    return results;
  }

  /**
   * Get assets by category
   */
  async getByCategory(category: AssetCategory): Promise<AssetRecord[]> {
    await this.initialize();
    return this.registry?.byCategory[category] || [];
  }

  /**
   * Get assets by project
   */
  async getByProject(projectId: string): Promise<AssetRecord[]> {
    await this.initialize();
    return this.registry?.byProject[projectId] || [];
  }

  /**
   * Resolve asset path - returns the canonical path for an asset
   * This ensures all references to the same file point to the same location
   */
  async resolvePath(path: string, options?: AssetLoaderOptions): Promise<string> {
    const asset = await this.getByPath(path);
    
    if (asset) {
      return asset.canonicalPath;
    }

    // If not found in registry, return original path or fallback
    return options?.fallback || path;
  }

  /**
   * Get import path for use in code
   */
  async getImportPath(path: string): Promise<string> {
    const asset = await this.getByPath(path);
    return asset?.importPath || path;
  }

  /**
   * Get registry statistics
   */
  async getStats(): Promise<{
    totalAssets: number;
    uniqueAssets: number;
    duplicatedAssets: number;
    spaceSaved: number;
  }> {
    await this.initialize();
    if (!this.registry) {
      return {
        totalAssets: 0,
        uniqueAssets: 0,
        duplicatedAssets: 0,
        spaceSaved: 0,
      };
    }

    const { meta } = this.registry;
    return {
      totalAssets: meta.totalAssets,
      uniqueAssets: meta.uniqueAssets,
      duplicatedAssets: meta.duplicatedAssets,
      spaceSaved: meta.spaceSaved,
    };
  }

  /**
   * Check if a file is a duplicate
   */
  async isDuplicate(path: string): Promise<boolean> {
    const asset = await this.getByPath(path);
    if (!asset) return false;
    
    return asset.locations.length > 1;
  }

  /**
   * Get all duplicates of a file
   */
  async getDuplicates(path: string): Promise<string[]> {
    const asset = await this.getByPath(path);
    if (!asset) return [];
    
    return asset.locations
      .filter(loc => !loc.isCanonical)
      .map(loc => loc.path);
  }

  /**
   * Get canonical path for a potentially duplicated file
   */
  async getCanonicalPath(path: string): Promise<string> {
    const asset = await this.getByPath(path);
    return asset?.canonicalPath || path;
  }
}

// Singleton instance
export const assetRegistry = new AssetRegistryManager();

// Default export
export default assetRegistry;
