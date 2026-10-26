export interface MessageSource {
  title: string;
  recordId?: string;
  date?: string;
  snippet?: string;
}

export interface ToolAction {
  toolName: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  status?: 'pending_confirmation' | 'confirmed' | 'cancelled' | 'executed' | 'failed';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  sources?: MessageSource[];
  toolAction?: ToolAction;
  safetyNote?: string;
  isError?: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface ChatResponse {
  success: boolean;
  conversationId: string;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}
