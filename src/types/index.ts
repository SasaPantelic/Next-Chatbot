export interface ChatSession {
    id: string;
    createdAt: string;
    updatedAt?: string;
    messages: ChatMessage[];
    userId?: string;
}


export interface ChatMessage {
    text: string;
    role: 'system' | 'user' | 'assistant'
    timestamp: string;
    choices?: string[];
    visible: 'API' | 'USER' | 'BOTH'
}
