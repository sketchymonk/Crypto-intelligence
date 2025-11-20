import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, ChatService, AIService } from '../types';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

function getApiKey(): string {
  // Check localStorage first (for user-provided keys), then fall back to environment variable
  const localKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (localKey) {
    return localKey;
  }

  const envKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!envKey) {
    throw new Error("Gemini API key not found. Please set your API key in Settings or add VITE_GOOGLE_API_KEY to .env.local");
  }
  return envKey;
}

/**
 * Save Gemini API key to localStorage
 */
export function saveApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
}

/**
 * Remove Gemini API key from localStorage
 */
export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

/**
 * Check if Gemini API key is set
 */
export function hasApiKey(): boolean {
  return !!(localStorage.getItem(API_KEY_STORAGE_KEY) || import.meta.env.VITE_GOOGLE_API_KEY);
}

/**
 * Get masked API key for display
 */
export function getMaskedApiKey(): string | null {
  const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!apiKey) {
    // Check if env key exists
    if (import.meta.env.VITE_GOOGLE_API_KEY) {
      return 'Environment variable';
    }
    return null;
  }
  if (apiKey.length < 12) return '***';
  return `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
}

/**
 * Runs a deep analysis using Gemini 2.5 Pro.
 * @param prompt The detailed prompt for the analysis.
 * @returns A promise that resolves to an AnalysisResult.
 */
export async function runDeepAnalysis(prompt: string): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return { text: response.text };
  } catch (error) {
    console.error("Deep Analysis Gemini API call failed:", error);
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
  }
}

/**
 * Runs a fast analysis using Gemini 2.5 Flash (optimized for speed).
 * @param prompt The prompt for the analysis.
 * @returns A promise that resolves to an AnalysisResult.
 */
export async function runFastAnalysis(prompt: string): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return { text: response.text };
  } catch (error) {
    console.error("Fast Analysis Gemini API call failed:", error);
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
  }
}

/**
 * Runs a grounded analysis using Gemini 2.5 Flash with Google Search.
 * This is unique to Gemini and provides real-time web search results.
 * @param prompt The prompt for the analysis.
 * @returns A promise that resolves to an AnalysisResult, including grounding sources.
 */
export async function runGroundedAnalysis(prompt: string): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return { text: response.text, groundingChunks: groundingChunks as any[] };
  } catch (error) {
    console.error("Grounded Analysis Gemini API call failed:", error);
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
  }
}


// --- Chat Service ---

/**
 * Chat service for interactive conversations with Gemini
 */
export class GeminiChatService implements ChatService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: getApiKey() });
  }

  /**
   * Sends a message and returns a streaming response
   * @param message The user's message
   * @returns An async generator that yields response chunks
   */
  async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!this.chat) {
      this.chat = this.ai.chats.create({
        model: 'gemini-2.5-flash',
      });
    }

    try {
      const stream = await this.chat.sendMessageStream({ message });

      for await (const chunk of stream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error) {
      console.error("Chat stream failed:", error);
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }

  /**
   * Clears the conversation history by creating a new chat session
   */
  clearHistory(): void {
    this.chat = null;
  }

  /**
   * Gets the current conversation history
   * Note: Gemini SDK doesn't expose history directly, so we return empty array
   */
  getHistory(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return [];
  }
}

/**
 * Creates a new Gemini chat service instance
 */
export function createChatService(): GeminiChatService {
  return new GeminiChatService();
}

// Legacy function for backward compatibility
export function createChatSession(): Chat {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  return ai.chats.create({
    model: 'gemini-2.5-flash',
  });
}
