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

// Analysis History Types
export interface SavedAnalysis {
    id: string;
    timestamp: number;
    projectName: string;
    projectSymbol?: string;
    formData: FormData;
    prompt: string;
    response: string;
    analysisType: 'deep' | 'fast' | 'balanced' | 'risk' | 'consensus';
    provider: AIProvider;
    groundingChunks?: GroundingChunk[];
    tags?: string[];
    notes?: string;
    coinGeckoId?: string; // For tracking live data
    favorite?: boolean; // For bookmarking analyses
    consensusResults?: ConsensusAnalysisResult[]; // For multi-provider analysis
}

export interface ConsensusAnalysisResult {
    provider: AIProvider;
    response: string;
    timestamp: number;
}

export interface AnalysisComparison {
    older: SavedAnalysis;
    newer: SavedAnalysis;
    changes: {
        timeElapsed: number;
        priceChange?: number;
        volumeChange?: number;
        tvlChange?: number;
    };
}

// Live Data Types
export interface CryptoMarketData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: number;
    ath_date: string;
    atl: number;
    atl_date: string;
    last_updated: string;
}

export interface ChartDataPoint {
    timestamp: number;
    price: number;
    volume?: number;
}

export interface LiveDataState {
    loading: boolean;
    error?: string;
    data?: CryptoMarketData;
    chartData?: ChartDataPoint[];
    lastUpdated?: number;
}
