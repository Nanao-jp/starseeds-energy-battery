/**
 * チャットボット関連の型定義
 */

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatbotState {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
}

export interface ChatRequest {
  message: string;
  history: Message[];
}

export interface ChatResponse {
  message: string;
  error?: string;
}

