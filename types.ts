export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox';
    placeholder?: string;
    options?: { value: string; label: string }[];
}

export interface FormSection {
    id: string;
    title: string;
    fields: FormField[];
}

export interface FormData {
    [sectionId: string]: {
        [fieldId: string]: string | boolean | string[];
    };
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AnalysisResult {
  text: string;
  groundingChunks?: GroundingChunk[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

// AI Provider Types
export type AIProvider = 'claude' | 'gemini' | 'ollama';

export interface ProviderConfig {
    provider: AIProvider;
    apiKey?: string;
    baseUrl?: string; // For Ollama
    model?: string; // For custom model selection
}

export interface AIService {
    // Analysis methods
    runDeepAnalysis(prompt: string): Promise<AnalysisResult>;
    runFastAnalysis(prompt: string): Promise<AnalysisResult>;
    runBalancedAnalysis?(prompt: string): Promise<AnalysisResult>;

    // Chat methods
    createChatService(): ChatService;
}

export interface ChatService {
    sendMessageStream(message: string): AsyncGenerator<string, void, unknown>;
    clearHistory(): void;
    getHistory(): Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface ModelInfo {
    id: string;
    name: string;
    description: string;
    provider: AIProvider;
    cost: 'free' | 'low' | 'medium' | 'high';
    speed: 'slow' | 'medium' | 'fast';
}
