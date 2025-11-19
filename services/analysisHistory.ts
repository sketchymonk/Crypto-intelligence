import { SavedAnalysis } from '../types';

const STORAGE_KEY = 'crypto_intelligence_analysis_history';
const MAX_HISTORY_ITEMS = 500; // Prevent localStorage overflow

/**
 * Service for managing analysis history in localStorage
 */
class AnalysisHistoryService {
  /**
   * Get all saved analyses
   */
  getAll(): SavedAnalysis[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const analyses: SavedAnalysis[] = JSON.parse(stored);
      // Sort by timestamp descending (newest first)
      return analyses.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to load analysis history:', error);
      return [];
    }
  }

  /**
   * Save a new analysis
   */
  save(analysis: Omit<SavedAnalysis, 'id' | 'timestamp'>): SavedAnalysis {
    const newAnalysis: SavedAnalysis = {
      ...analysis,
      id: this.generateId(),
      timestamp: Date.now(),
    };

    const existing = this.getAll();
    const updated = [newAnalysis, ...existing];

    // Keep only the most recent items
    const trimmed = updated.slice(0, MAX_HISTORY_ITEMS);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      return newAnalysis;
    } catch (error) {
      console.error('Failed to save analysis:', error);
      // If storage is full, try removing old items
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        const reduced = updated.slice(0, Math.floor(MAX_HISTORY_ITEMS / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
        return newAnalysis;
      }
      throw error;
    }
  }

  /**
   * Get analysis by ID
   */
  getById(id: string): SavedAnalysis | undefined {
    const all = this.getAll();
    return all.find(a => a.id === id);
  }

  /**
   * Delete analysis by ID
   */
  delete(id: string): void {
    const all = this.getAll();
    const filtered = all.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Update analysis (e.g., add notes, tags)
   */
  update(id: string, updates: Partial<SavedAnalysis>): SavedAnalysis | undefined {
    const all = this.getAll();
    const index = all.findIndex(a => a.id === id);

    if (index === -1) return undefined;

    all[index] = { ...all[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    return all[index];
  }

  /**
   * Search analyses by project name or symbol
   */
  search(query: string): SavedAnalysis[] {
    const all = this.getAll();
    const lowerQuery = query.toLowerCase();

    return all.filter(a =>
      a.projectName.toLowerCase().includes(lowerQuery) ||
      a.projectSymbol?.toLowerCase().includes(lowerQuery) ||
      a.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get analyses for a specific project
   */
  getByProject(projectName: string): SavedAnalysis[] {
    const all = this.getAll();
    return all.filter(a =>
      a.projectName.toLowerCase() === projectName.toLowerCase() ||
      a.projectSymbol?.toLowerCase() === projectName.toLowerCase()
    );
  }

  /**
   * Get analyses by tag
   */
  getByTag(tag: string): SavedAnalysis[] {
    const all = this.getAll();
    return all.filter(a => a.tags?.includes(tag));
  }

  /**
   * Get all unique tags
   */
  getAllTags(): string[] {
    const all = this.getAll();
    const tags = new Set<string>();

    all.forEach(a => {
      a.tags?.forEach(tag => tags.add(tag));
    });

    return Array.from(tags).sort();
  }

  /**
   * Get all unique project names
   */
  getAllProjects(): Array<{ name: string; symbol?: string; count: number }> {
    const all = this.getAll();
    const projectMap = new Map<string, { name: string; symbol?: string; count: number }>();

    all.forEach(a => {
      const key = a.projectName.toLowerCase();
      if (projectMap.has(key)) {
        const existing = projectMap.get(key)!;
        existing.count++;
      } else {
        projectMap.set(key, {
          name: a.projectName,
          symbol: a.projectSymbol,
          count: 1
        });
      }
    });

    return Array.from(projectMap.values()).sort((a, b) => b.count - a.count);
  }

  /**
   * Clear all history
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Export history as JSON
   */
  export(): string {
    const all = this.getAll();
    return JSON.stringify(all, null, 2);
  }

  /**
   * Import history from JSON
   */
  import(jsonString: string): void {
    try {
      const imported: SavedAnalysis[] = JSON.parse(jsonString);
      const existing = this.getAll();

      // Merge and deduplicate by ID
      const merged = [...imported, ...existing];
      const unique = Array.from(new Map(merged.map(a => [a.id, a])).values());

      // Sort and trim
      const sorted = unique.sort((a, b) => b.timestamp - a.timestamp);
      const trimmed = sorted.slice(0, MAX_HISTORY_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to import history:', error);
      throw new Error('Invalid history format');
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get storage stats
   */
  getStats(): { count: number; oldestDate: Date | null; newestDate: Date | null } {
    const all = this.getAll();

    if (all.length === 0) {
      return { count: 0, oldestDate: null, newestDate: null };
    }

    const timestamps = all.map(a => a.timestamp);

    return {
      count: all.length,
      oldestDate: new Date(Math.min(...timestamps)),
      newestDate: new Date(Math.max(...timestamps))
    };
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(id: string): boolean {
    const analysis = this.getById(id);
    if (!analysis) return false;

    const newFavoriteStatus = !analysis.favorite;
    this.update(id, { favorite: newFavoriteStatus });
    return newFavoriteStatus;
  }

  /**
   * Get all favorite analyses
   */
  getFavorites(): SavedAnalysis[] {
    const all = this.getAll();
    return all.filter(a => a.favorite);
  }

  /**
   * Add or update notes for an analysis
   */
  updateNotes(id: string, notes: string): boolean {
    const updated = this.update(id, { notes });
    return !!updated;
  }

  /**
   * Add tags to an analysis
   */
  addTags(id: string, newTags: string[]): boolean {
    const analysis = this.getById(id);
    if (!analysis) return false;

    const existingTags = analysis.tags || [];
    const uniqueTags = Array.from(new Set([...existingTags, ...newTags]));
    this.update(id, { tags: uniqueTags });
    return true;
  }

  /**
   * Remove tags from an analysis
   */
  removeTags(id: string, tagsToRemove: string[]): boolean {
    const analysis = this.getById(id);
    if (!analysis) return false;

    const existingTags = analysis.tags || [];
    const filteredTags = existingTags.filter(tag => !tagsToRemove.includes(tag));
    this.update(id, { tags: filteredTags });
    return true;
  }
}

// Export singleton instance
export const analysisHistoryService = new AnalysisHistoryService();
