import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, ChatService, AIService } from '../types';

function getApiKey(): string {
  // In Vite, environment variables are accessed via import.meta.env
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GOOGLE_API_KEY environment variable not set. Please add it to your .env.local file.");
  }
  return apiKey;
}

/**
 * Runs a deep analysis using gemini-2.5-pro with maximum thinking budget.
 * @param prompt The detailed prompt for the analysis.
 * @returns A promise that resolves to an AnalysisResult.
 */
export async function runDeepAnalysis(prompt: string): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    return { text: response.text };
  } catch (error) {
    console.error("Deep Analysis Gemini API call failed:", error);
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
  }
}

/**
 * Runs a fast analysis using gemini-2.5-flash (optimized for speed).
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
 * Runs a grounded analysis using gemini-2.5-flash with Google Search.
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
