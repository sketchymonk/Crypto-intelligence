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
