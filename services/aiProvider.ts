import { AIProvider, AnalysisResult, ChatService, ModelInfo } from '../types';
import * as claudeService from './claudeService';
import * as geminiService from './geminiService';
import * as ollamaService from './ollamaService';
import * as openrouterService from './openrouterService';
import * as groqService from './groqService';
import * as mistralService from './mistralService';

/**
 * Available models across all providers
 */
export const AVAILABLE_MODELS: ModelInfo[] = [
  // Claude Models
  {
    id: 'claude-opus-deep',
    name: 'Claude Opus 4 (Deep Thinking)',
    description: 'Most powerful analysis with extended thinking. Best for complex research.',
    provider: 'claude',
    cost: 'high',
    speed: 'slow'
  },
  {
    id: 'claude-sonnet-balanced',
    name: 'Claude Sonnet 4.5 (Balanced)',
    description: 'Balanced speed and reasoning with thinking mode.',
    provider: 'claude',
    cost: 'medium',
    speed: 'medium'
  },
  {
    id: 'claude-sonnet-fast',
    name: 'Claude Sonnet 4.5 (Fast)',
    description: 'Fast analysis without thinking mode.',
    provider: 'claude',
    cost: 'medium',
    speed: 'fast'
  },

  // Gemini Models
  {
    id: 'gemini-pro-deep',
    name: 'Gemini 3.0 Pro (Deep Thinking)',
    description: 'Deep analysis with maximum thinking budget. FREE with Google AI Studio!',
    provider: 'gemini',
    cost: 'free',
    speed: 'slow'
  },
  {
    id: 'gemini-flash-grounded',
    name: 'Gemini 2.5 Flash (Web Search)',
    description: 'Fast analysis with real-time Google Search grounding. FREE!',
    provider: 'gemini',
    cost: 'free',
    speed: 'fast'
  },
  {
    id: 'gemini-flash-fast',
    name: 'Gemini 2.5 Flash',
    description: 'Quick analysis without web search. FREE!',
    provider: 'gemini',
    cost: 'free',
    speed: 'fast'
  },

  // Ollama Models
  {
    id: 'ollama-deep',
    name: 'Local Model (Large)',
    description: 'Deep analysis using larger local model (e.g., Llama 3.1 70B). Completely FREE!',
    provider: 'ollama',
    cost: 'free',
    speed: 'slow'
  },
  {
    id: 'ollama-balanced',
    name: 'Local Model (Medium)',
    description: 'Balanced analysis with local model. Completely FREE!',
    provider: 'ollama',
    cost: 'free',
    speed: 'medium'
  },
  {
    id: 'ollama-fast',
    name: 'Local Model (Small)',
    description: 'Fast analysis using smaller local model (e.g., Llama 3.1 8B). Completely FREE!',
    provider: 'ollama',
    cost: 'free',
    speed: 'fast'
  },

  // OpenRouter Models (Many FREE models via aggregation)
  {
    id: 'openrouter-deep',
    name: 'DeepSeek R1 (Reasoning)',
    description: 'Advanced reasoning model with deep analysis. FREE via OpenRouter!',
    provider: 'openrouter',
    cost: 'free',
    speed: 'medium'
  },
  {
    id: 'openrouter-balanced',
    name: 'DeepSeek Chat',
    description: 'Balanced chat model for general analysis. FREE!',
    provider: 'openrouter',
    cost: 'free',
    speed: 'fast'
  },
  {
    id: 'openrouter-fast',
    name: 'Gemini 2.5 Flash (via OpenRouter)',
    description: 'Fast Google model via OpenRouter. FREE!',
    provider: 'openrouter',
    cost: 'free',
    speed: 'fast'
  },

  // Groq Models (Super fast inference, FREE tier)
  {
    id: 'groq-deep',
    name: 'Llama 3.3 70B (Groq)',
    description: 'Most capable model with lightning-fast inference. FREE with generous limits!',
    provider: 'groq',
    cost: 'free',
    speed: 'fast'
  },
  {
    id: 'groq-balanced',
    name: 'Mixtral 8x7B (Groq)',
    description: 'Balanced mixture-of-experts model. FREE with ultra-fast speed!',
    provider: 'groq',
    cost: 'free',
    speed: 'fast'
  },
  {
    id: 'groq-fast',
    name: 'Llama 3.1 8B Instant (Groq)',
    description: 'Fastest model with instant responses. FREE!',
    provider: 'groq',
    cost: 'free',
    speed: 'fast'
  },

  // Mistral Models (FREE tier available)
  {
    id: 'mistral-deep',
    name: 'Mistral Large',
    description: 'Most capable Mistral model. FREE tier available with rate limits!',
    provider: 'mistral',
    cost: 'free',
    speed: 'medium'
  },
  {
    id: 'mistral-balanced',
    name: 'Mistral Nemo',
    description: 'Balanced open-source model. FREE tier!',
    provider: 'mistral',
    cost: 'free',
    speed: 'fast'
  },
  {
    id: 'mistral-fast',
    name: 'Mistral Small',
    description: 'Fast and efficient model. FREE tier!',
    provider: 'mistral',
    cost: 'free',
    speed: 'fast'
  },
];

/**
 * AI Provider Manager
 * Handles switching between different AI providers (Claude, Gemini, Ollama)
 */
export class AIProviderManager {
  private currentProvider: AIProvider;

  constructor(provider: AIProvider = 'claude') {
    this.currentProvider = provider;
  }

  /**
   * Set the active AI provider
   */
  setProvider(provider: AIProvider): void {
    this.currentProvider = provider;
  }

  /**
   * Get the current provider
   */
  getProvider(): AIProvider {
    return this.currentProvider;
  }

  /**
   * Run deep analysis using the current provider
   */
  async runDeepAnalysis(prompt: string): Promise<AnalysisResult> {
    switch (this.currentProvider) {
      case 'claude':
        return claudeService.runDeepAnalysis(prompt);
      case 'gemini':
        return geminiService.runDeepAnalysis(prompt);
      case 'ollama':
        return ollamaService.runDeepAnalysis(prompt);
      case 'openrouter':
        return openrouterService.runDeepAnalysis(prompt);
      case 'groq':
        return groqService.runDeepAnalysis(prompt);
      case 'mistral':
        return mistralService.runDeepAnalysis(prompt);
      default:
        throw new Error(`Unknown provider: ${this.currentProvider}`);
    }
  }

  /**
   * Run fast analysis using the current provider
   */
  async runFastAnalysis(prompt: string): Promise<AnalysisResult> {
    switch (this.currentProvider) {
      case 'claude':
        return claudeService.runFastAnalysis(prompt);
      case 'gemini':
        return geminiService.runFastAnalysis(prompt);
      case 'ollama':
        return ollamaService.runFastAnalysis(prompt);
      case 'openrouter':
        return openrouterService.runFastAnalysis(prompt);
      case 'groq':
        return groqService.runFastAnalysis(prompt);
      case 'mistral':
        return mistralService.runFastAnalysis(prompt);
      default:
        throw new Error(`Unknown provider: ${this.currentProvider}`);
    }
  }

  /**
   * Run balanced analysis using the current provider
   */
  async runBalancedAnalysis(prompt: string): Promise<AnalysisResult> {
    switch (this.currentProvider) {
      case 'claude':
        return claudeService.runBalancedAnalysis(prompt);
      case 'gemini':
        return geminiService.runGroundedAnalysis(prompt); // Gemini's grounded = balanced
      case 'ollama':
        return ollamaService.runBalancedAnalysis(prompt);
      case 'openrouter':
        return openrouterService.runBalancedAnalysis(prompt);
      case 'groq':
        return groqService.runBalancedAnalysis(prompt);
      case 'mistral':
        return mistralService.runBalancedAnalysis(prompt);
      default:
        throw new Error(`Unknown provider: ${this.currentProvider}`);
    }
  }

  /**
   * Create a chat service instance for the current provider
   */
  createChatService(): ChatService {
    switch (this.currentProvider) {
      case 'claude':
        return claudeService.createChatService();
      case 'gemini':
        return geminiService.createChatService();
      case 'ollama':
        return ollamaService.createChatService();
      case 'openrouter':
        return openrouterService.createChatService();
      case 'groq':
        return groqService.createChatService();
      case 'mistral':
        return mistralService.createChatService();
      default:
        throw new Error(`Unknown provider: ${this.currentProvider}`);
    }
  }

  /**
   * Check if the current provider is properly configured
   */
  async checkProviderAvailability(): Promise<{ available: boolean; message: string }> {
    try {
      switch (this.currentProvider) {
        case 'claude':
          // Check if API key is set (localStorage or env)
          const hasClaudeKey = claudeService.hasApiKey();
          if (!hasClaudeKey) {
            return {
              available: false,
              message: 'Claude API key not set. Please configure it in Settings.'
            };
          }
          return { available: true, message: 'Claude is ready' };

        case 'gemini':
          // Check if API key is set (localStorage or env)
          const hasGeminiKey = geminiService.hasApiKey();
          if (!hasGeminiKey) {
            return {
              available: false,
              message: 'Gemini API key not set. Please configure it in Settings or get a FREE key from Google AI Studio.'
            };
          }
          return { available: true, message: 'Gemini is ready (FREE tier available!)' };

        case 'ollama':
          // Check if Ollama is running
          const isAvailable = await ollamaService.checkOllamaAvailable();
          if (!isAvailable) {
            return {
              available: false,
              message: 'Ollama is not running. Start Ollama or configure the base URL in Settings.'
            };
          }
          const models = await ollamaService.getAvailableModels();
          return {
            available: true,
            message: `Ollama is ready with ${models.length} model(s): ${models.slice(0, 3).join(', ')}${models.length > 3 ? '...' : ''}`
          };

        case 'openrouter':
          const hasOpenRouterKey = openrouterService.hasApiKey();
          if (!hasOpenRouterKey) {
            return {
              available: false,
              message: 'OpenRouter API key not set. Get a FREE key from openrouter.ai and configure in Settings.'
            };
          }
          return { available: true, message: 'OpenRouter is ready (Many FREE models available!)' };

        case 'groq':
          const hasGroqKey = groqService.hasApiKey();
          if (!hasGroqKey) {
            return {
              available: false,
              message: 'Groq API key not set. Get a FREE key from console.groq.com and configure in Settings.'
            };
          }
          return { available: true, message: 'Groq is ready (Ultra-fast inference, FREE!)' };

        case 'mistral':
          const hasMistralKey = mistralService.hasApiKey();
          if (!hasMistralKey) {
            return {
              available: false,
              message: 'Mistral API key not set. Get a FREE tier key from console.mistral.ai and configure in Settings.'
            };
          }
          return { available: true, message: 'Mistral is ready (FREE tier available!)' };

        default:
          return { available: false, message: 'Unknown provider' };
      }
    } catch (error) {
      return {
        available: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get models available for the current provider
   */
  getAvailableModels(): ModelInfo[] {
    return AVAILABLE_MODELS.filter(model => model.provider === this.currentProvider);
  }
}

/**
 * Create a singleton provider manager instance
 */
let providerManager: AIProviderManager | null = null;

export function getProviderManager(): AIProviderManager {
  if (!providerManager) {
    // Default to Claude, but can be changed by user
    const savedProvider = localStorage.getItem('ai-provider') as AIProvider;
    providerManager = new AIProviderManager(savedProvider || 'claude');
  }
  return providerManager;
}

/**
 * Set and persist the AI provider choice
 */
export function setAIProvider(provider: AIProvider): void {
  localStorage.setItem('ai-provider', provider);
  const manager = getProviderManager();
  manager.setProvider(provider);
}

/**
 * Get all available models across all providers
 */
export function getAllModels(): ModelInfo[] {
  return AVAILABLE_MODELS;
}

/**
 * Get models filtered by provider
 */
export function getModelsByProvider(provider: AIProvider): ModelInfo[] {
  return AVAILABLE_MODELS.filter(model => model.provider === provider);
}
