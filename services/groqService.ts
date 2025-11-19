import { AnalysisResult, ChatService } from '../types';

const API_KEY_STORAGE_KEY = 'groq_api_key';

function getApiKey(): string {
  // Check localStorage first (for user-provided keys), then fall back to environment variable
  const localKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (localKey) {
    return localKey;
  }

  const envKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!envKey) {
    throw new Error("Groq API key not found. Please set your API key in Settings or add VITE_GROQ_API_KEY to .env.local");
  }
  return envKey;
}

/**
 * Save Groq API key to localStorage
 */
export function saveApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
}

/**
 * Remove Groq API key from localStorage
 */
export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

/**
 * Check if Groq API key is set
 */
export function hasApiKey(): boolean {
  return !!(localStorage.getItem(API_KEY_STORAGE_KEY) || import.meta.env.VITE_GROQ_API_KEY);
}

/**
 * Get masked API key for display
 */
export function getMaskedApiKey(): string | null {
  const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!apiKey) {
    // Check if env key exists
    if (import.meta.env.VITE_GROQ_API_KEY) {
      return 'Environment variable';
    }
    return null;
  }
  if (apiKey.length < 12) return '***';
  return `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
}

/**
 * Make Groq API call
 */
async function callGroq(prompt: string, model: string): Promise<AnalysisResult> {
  const apiKey = getApiKey();

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
        temperature: 1,
        max_tokens: 8000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    return { text };
  } catch (error) {
    console.error("Groq API call failed:", error);
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
  }
}

/**
 * Runs a deep analysis using Llama 3.3 70B (most capable free model on Groq)
 */
export async function runDeepAnalysis(prompt: string): Promise<AnalysisResult> {
  return callGroq(prompt, 'llama-3.3-70b-versatile');
}

/**
 * Runs a fast analysis using Llama 3.1 8B (fastest model)
 */
export async function runFastAnalysis(prompt: string): Promise<AnalysisResult> {
  return callGroq(prompt, 'llama-3.1-8b-instant');
}

/**
 * Runs a balanced analysis using Mixtral 8x7B (good balance of speed and quality)
 */
export async function runBalancedAnalysis(prompt: string): Promise<AnalysisResult> {
  return callGroq(prompt, 'mixtral-8x7b-32768');
}


// --- Chat Service ---

/**
 * Chat service for interactive conversations with Groq
 */
export class GroqChatService implements ChatService {
  private history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  private model = 'llama-3.1-8b-instant';

  /**
   * Sends a message and returns a streaming response
   */
  async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    const apiKey = getApiKey();
    this.history.push({ role: 'user', content: message });

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
        throw new Error(`Groq API error: ${response.statusText}`);
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
 * Creates a new Groq chat service instance
 */
export function createChatService(): GroqChatService {
  return new GroqChatService();
}
