import { FormData } from './types';

/**
 * Saved prompt configuration system
 * Allows users to save and load customized prompt configurations
 */

export interface SavedPrompt {
  id: string;
  name: string;
  description?: string;
  formData: FormData;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'crypto_intelligence_saved_prompts';

/**
 * Generate a unique ID for saved prompts
 */
function generateId(): string {
  return `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all saved prompts from localStorage
 */
export function getAllSavedPrompts(): SavedPrompt[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading saved prompts:', error);
    return [];
  }
}

/**
 * Save a new prompt configuration
 */
export function savePrompt(
  name: string,
  formData: FormData,
  description?: string
): SavedPrompt {
  const prompts = getAllSavedPrompts();

  const newPrompt: SavedPrompt = {
    id: generateId(),
    name: name.trim(),
    description: description?.trim(),
    formData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  prompts.push(newPrompt);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));

  return newPrompt;
}

/**
 * Update an existing saved prompt
 */
export function updatePrompt(
  id: string,
  name: string,
  formData: FormData,
  description?: string
): SavedPrompt | null {
  const prompts = getAllSavedPrompts();
  const index = prompts.findIndex(p => p.id === id);

  if (index === -1) return null;

  prompts[index] = {
    ...prompts[index],
    name: name.trim(),
    description: description?.trim(),
    formData,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  return prompts[index];
}

/**
 * Delete a saved prompt by ID
 */
export function deletePrompt(id: string): boolean {
  const prompts = getAllSavedPrompts();
  const filtered = prompts.filter(p => p.id !== id);

  if (filtered.length === prompts.length) return false; // Not found

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Get a single saved prompt by ID
 */
export function getPromptById(id: string): SavedPrompt | null {
  const prompts = getAllSavedPrompts();
  return prompts.find(p => p.id === id) || null;
}

/**
 * Check if a prompt name already exists
 */
export function promptNameExists(name: string, excludeId?: string): boolean {
  const prompts = getAllSavedPrompts();
  return prompts.some(p =>
    p.name.toLowerCase() === name.toLowerCase().trim() &&
    p.id !== excludeId
  );
}

/**
 * Export all saved prompts as JSON file
 */
export function exportPrompts(): string {
  const prompts = getAllSavedPrompts();
  return JSON.stringify(prompts, null, 2);
}

/**
 * Import prompts from JSON
 */
export function importPrompts(jsonString: string): { success: number; errors: number } {
  try {
    const imported = JSON.parse(jsonString);
    if (!Array.isArray(imported)) {
      throw new Error('Invalid format: expected array');
    }

    const existing = getAllSavedPrompts();
    let success = 0;
    let errors = 0;

    imported.forEach((item: any) => {
      try {
        // Validate structure
        if (!item.name || !item.formData) {
          errors++;
          return;
        }

        // Check for duplicates by name
        if (existing.some(p => p.name.toLowerCase() === item.name.toLowerCase())) {
          // Rename duplicates
          item.name = `${item.name} (imported)`;
        }

        const newPrompt: SavedPrompt = {
          id: generateId(), // Generate new ID
          name: item.name,
          description: item.description,
          formData: item.formData,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        existing.push(newPrompt);
        success++;
      } catch (err) {
        errors++;
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return { success, errors };
  } catch (error) {
    console.error('Error importing prompts:', error);
    return { success: 0, errors: 1 };
  }
}

/**
 * Get formatted date string
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
