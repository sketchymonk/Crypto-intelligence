import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { AnalysisResult } from './types';

function getApiKey() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
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
 * Runs a grounded analysis using gemini-2.5-flash with Google Search.
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

let chat: Chat | null = null;

/**
 * Creates and returns a singleton chat session instance.
 */
export function createChatSession(): Chat {
    if (!chat) {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
        });
    }
    return chat;
}

/**
 * Sends a message to the chat session and returns a streaming response.
 * @param chatInstance The chat instance to use.
 * @param message The user's message.
 * @returns An async generator that yields response chunks.
 */
export async function sendMessageStream(
    chatInstance: Chat,
    message: string
): Promise<AsyncIterable<GenerateContentResponse>> {
    return chatInstance.sendMessageStream({ message });
}
