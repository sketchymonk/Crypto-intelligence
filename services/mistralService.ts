import { AnalysisResult, ChatService } from '../types';

const API_KEY_STORAGE_KEY = 'mistral_api_key';

function getApiKey(): string {
  // Check localStorage first (for user-provided keys), then fall back to environment variable
  const localKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (localKey) {
    return localKey;
  }

  const envKey = import.meta.env.VITE_MISTRAL_API_KEY;
  if (!envKey) {
    throw new Error("Mistral API key not found. Please set your API key in Settings or add VITE_MISTRAL_API_KEY to .env.local");
  }
  return envKey;
}

/**
 * Save Mistral API key to localStorage
 */
export function saveApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
}

/**
 * Remove Mistral API key from localStorage
 */
export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

/**
 * Check if Mistral API key is set
 */
export function hasApiKey(): boolean {
  return !!(localStorage.getItem(API_KEY_STORAGE_KEY) || import.meta.env.VITE_MISTRAL_API_KEY);
}

/**
 * Get masked API key for display
 */
export function getMaskedApiKey(): string | null {
  const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!apiKey) {
    // Check if env key exists
    if (import.meta.env.VITE_MISTRAL_API_KEY) {
      return 'Environment variable';
    }
    return null;
  }
  if (apiKey.length < 12) return '***';
  return `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
}

/**
 * Make Mistral API call
 */
async function callMistral(prompt: string, model: string): Promise<AnalysisResult> {
  const apiKey = getApiKey();

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 8000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Mistral API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    return { text };
  } catch (error) {
    console.error("Mistral API call failed:", error);
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
  }
}

/**
 * Runs a deep analysis using Mistral Large (most capable model)
 */
export async function runDeepAnalysis(prompt: string): Promise<AnalysisResult> {
  return callMistral(prompt, 'mistral-large-latest');
}

/**
 * Runs a fast analysis using Mistral Small (fast and efficient)
 */
export async function runFastAnalysis(prompt: string): Promise<AnalysisResult> {
  return callMistral(prompt, 'mistral-small-latest');
}

/**
 * Runs a balanced analysis using Mistral Medium/Nemo (balanced performance)
 */
export async function runBalancedAnalysis(prompt: string): Promise<AnalysisResult> {
  return callMistral(prompt, 'open-mistral-nemo');
}


// --- Chat Service ---

/**
 * Chat service for interactive conversations with Mistral
 */
export class MistralChatService implements ChatService {
  private history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  private model = 'mistral-small-latest';

  /**
   * Sends a message and returns a streaming response
   */
  async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    const apiKey = getApiKey();
    this.history.push({ role: 'user', content: message });

    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.history.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          })),
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream available');

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

        for (const line of lines) {
          const data = line.replace(/^data: /, '');
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              yield content;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }

      this.history.push({ role: 'assistant', content: fullResponse });
    } catch (error) {
      console.error("Chat stream failed:", error);
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }

  /**
   * Clears the conversation history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Gets the current conversation history
   */
  getHistory(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return this.history;
  }
}

/**
 * Creates a new Mistral chat service instance
 */
export function createChatService(): MistralChatService {
  return new MistralChatService();
}
