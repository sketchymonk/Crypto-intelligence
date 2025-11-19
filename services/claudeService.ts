import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResult, ChatMessage } from '../types';

const API_KEY_STORAGE_KEY = 'anthropic_api_key';

function getApiKey(): string {
  // Check localStorage first (for user-provided keys), then fall back to environment variable
  const localKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (localKey) {
    return localKey;
  }

  const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!envKey) {
    throw new Error("Claude API key not found. Please set your API key in Settings or add VITE_ANTHROPIC_API_KEY to .env.local");
  }
  return envKey;
}

/**
 * Save Claude API key to localStorage
 */
export function saveApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
}

/**
 * Remove Claude API key from localStorage
 */
export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

/**
 * Check if Claude API key is set
 */
export function hasApiKey(): boolean {
  return !!(localStorage.getItem(API_KEY_STORAGE_KEY) || import.meta.env.VITE_ANTHROPIC_API_KEY);
}

/**
 * Get masked API key for display
 */
export function getMaskedApiKey(): string | null {
  const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!apiKey) {
    // Check if env key exists
    if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
      return 'Environment variable';
    }
    return null;
  }
  if (apiKey.length < 12) return '***';
  return `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
}

/**
 * Runs a deep analysis using Claude Opus with extended thinking.
 * This provides the most thorough, nuanced analysis for complex crypto research.
 * @param prompt The detailed prompt for the analysis.
 * @returns A promise that resolves to an AnalysisResult.
 */
export async function runDeepAnalysis(prompt: string): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey: getApiKey(), dangerouslyAllowBrowser: true });

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 16000,
      temperature: 1,
      thinking: {
        type: 'enabled',
        budget_tokens: 10000
      },
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Extract text from response
    let text = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        text += block.text;
      }
    }

    return { text };
  } catch (error) {
    console.error("Deep Analysis Claude API call failed:", error);
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API Error: ${error.message}`);
    }
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
  }
}

/**
 * Runs a fast analysis using Claude Sonnet 4.5.
 * This is optimized for speed while maintaining high quality.
 * @param prompt The prompt for the analysis.
 * @returns A promise that resolves to an AnalysisResult.
 */
export async function runFastAnalysis(prompt: string): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey: getApiKey(), dangerouslyAllowBrowser: true });

  try {
    const enhancedPrompt = `${prompt}

Please provide a comprehensive analysis based on your knowledge. Focus on:
- Current market data and trends (based on your training data)
- Technical analysis and fundamentals
- Risk factors and opportunities
- Actionable insights

If you need real-time data that's beyond your knowledge cutoff, please note that explicitly.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      temperature: 1,
      messages: [{
        role: 'user',
        content: enhancedPrompt
      }]
    });

    // Extract text from response
    let text = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        text += block.text;
      }
    }

    return { text, groundingChunks: [] };
  } catch (error) {
    console.error("Fast Analysis Claude API call failed:", error);
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API Error: ${error.message}`);
    }
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
  }
}

/**
 * Runs analysis using Claude Sonnet 4.5 with extended thinking.
 * Balances speed and deep reasoning - faster than Opus but with thinking capability.
 * @param prompt The prompt for the analysis.
 * @returns A promise that resolves to an AnalysisResult.
 */
export async function runSonnetThinkingAnalysis(prompt: string): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey: getApiKey(), dangerouslyAllowBrowser: true });

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      temperature: 1,
      thinking: {
        type: 'enabled',
        budget_tokens: 5000
      },
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Extract text from response
    let text = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        text += block.text;
      }
    }

    return { text, groundingChunks: [] };
  } catch (error) {
    console.error("Sonnet Thinking Analysis Claude API call failed:", error);
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API Error: ${error.message}`);
    }
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
  }
}

// Keep backward compatibility with old function name
export const runGroundedAnalysis = runFastAnalysis;

// Alias for balanced analysis
export const runBalancedAnalysis = runSonnetThinkingAnalysis;

/**
 * Chat service for interactive conversations with Claude
 */
export class ClaudeChatService {
  private client: Anthropic;
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  constructor() {
    this.client = new Anthropic({ apiKey: getApiKey(), dangerouslyAllowBrowser: true });
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

    try {
      const stream = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        temperature: 1,
        messages: this.conversationHistory as Anthropic.MessageParam[],
        stream: true,
      });

      let fullResponse = '';

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          const text = event.delta.text;
          fullResponse += text;
          yield text;
        }
      }

      // Add assistant's response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: fullResponse
      });

    } catch (error) {
      console.error("Chat stream failed:", error);
      if (error instanceof Anthropic.APIError) {
        throw new Error(`Claude API Error: ${error.message}`);
      }
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
 * Creates a new chat service instance
 */
export function createChatService(): ClaudeChatService {
  return new ClaudeChatService();
}
