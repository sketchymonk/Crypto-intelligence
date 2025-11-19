import { AnalysisResult, ChatService } from '../types';

const BASE_URL_STORAGE_KEY = 'ollama_base_url';
const MODEL_STORAGE_KEY = 'ollama_model';

/**
 * Get the Ollama base URL from localStorage, environment, or use default
 */
function getBaseUrl(): string {
  const localUrl = localStorage.getItem(BASE_URL_STORAGE_KEY);
  if (localUrl) {
    return localUrl;
  }
  return import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';
}

/**
 * Get the default model name from localStorage, environment, or use default
 */
function getDefaultModel(): string {
  const localModel = localStorage.getItem(MODEL_STORAGE_KEY);
  if (localModel) {
    return localModel;
  }
  return import.meta.env.VITE_OLLAMA_MODEL || 'llama3.1:8b';
}

/**
 * Save Ollama configuration to localStorage
 */
export function saveConfig(baseUrl: string, model?: string): void {
  localStorage.setItem(BASE_URL_STORAGE_KEY, baseUrl.trim());
  if (model) {
    localStorage.setItem(MODEL_STORAGE_KEY, model.trim());
  }
}

/**
 * Clear Ollama configuration from localStorage
 */
export function clearConfig(): void {
  localStorage.removeItem(BASE_URL_STORAGE_KEY);
  localStorage.removeItem(MODEL_STORAGE_KEY);
}

/**
 * Get current Ollama configuration
 */
export function getConfig(): { baseUrl: string; model: string } {
  return {
    baseUrl: getBaseUrl(),
    model: getDefaultModel()
  };
}

/**
 * Check if Ollama is available
 */
export async function checkOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/tags`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get list of available models
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/tags`);
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    const data = await response.json();
    return data.models?.map((m: any) => m.name) || [];
  } catch (error) {
    console.error("Failed to get Ollama models:", error);
    return [];
  }
}

/**
 * Generate completion using Ollama
 */
async function generateCompletion(prompt: string, model: string): Promise<string> {
  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || '';
  } catch (error) {
    console.error("Ollama generation failed:", error);
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
  }
}

/**
 * Runs a deep analysis using a larger, more capable model.
 * @param prompt The detailed prompt for the analysis.
 * @returns A promise that resolves to an AnalysisResult.
 */
export async function runDeepAnalysis(prompt: string): Promise<AnalysisResult> {
  // Use a larger model for deep analysis if available
  const model = import.meta.env.VITE_OLLAMA_DEEP_MODEL || 'llama3.1:70b';

  const enhancedPrompt = `You are an expert cryptocurrency analyst. Provide a comprehensive, in-depth analysis for the following research request. Be thorough, detailed, and analytical.

${prompt}`;

  const text = await generateCompletion(enhancedPrompt, model);
  return { text };
}

/**
 * Runs a fast analysis using a smaller, faster model.
 * @param prompt The prompt for the analysis.
 * @returns A promise that resolves to an AnalysisResult.
 */
export async function runFastAnalysis(prompt: string): Promise<AnalysisResult> {
  const model = getDefaultModel();

  const enhancedPrompt = `You are a cryptocurrency analyst. Provide a clear and concise analysis for the following research request.

${prompt}`;

  const text = await generateCompletion(enhancedPrompt, model);
  return { text };
}

/**
 * Runs a balanced analysis using the default model.
 * @param prompt The prompt for the analysis.
 * @returns A promise that resolves to an AnalysisResult.
 */
export async function runBalancedAnalysis(prompt: string): Promise<AnalysisResult> {
  const model = import.meta.env.VITE_OLLAMA_BALANCED_MODEL || getDefaultModel();

  const enhancedPrompt = `You are an expert cryptocurrency analyst. Provide a detailed and well-reasoned analysis for the following research request.

${prompt}`;

  const text = await generateCompletion(enhancedPrompt, model);
  return { text };
}

// --- Chat Service ---

/**
 * Chat service for interactive conversations with Ollama
 */
export class OllamaChatService implements ChatService {
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  private model: string;
  private baseUrl: string;

  constructor(model?: string) {
    this.model = model || getDefaultModel();
    this.baseUrl = getBaseUrl();
  }

  /**
   * Sends a message and returns a streaming response
   * @param message The user's message
   * @returns An async generator that yields response chunks
   */
  async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: message
    });

    // Build context from conversation history
    const context = this.conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: context,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              fullResponse += json.response;
              yield json.response;
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }

      // Add assistant's response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: fullResponse
      });

    } catch (error) {
      console.error("Chat stream failed:", error);
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }

  /**
   * Clears the conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Gets the current conversation history
   */
  getHistory(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return [...this.conversationHistory];
  }
}

/**
 * Creates a new Ollama chat service instance
 */
export function createChatService(model?: string): OllamaChatService {
  return new OllamaChatService(model);
}
