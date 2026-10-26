import { apiFetch, ApiError } from './apiClient';
import { ChatResponse, Conversation, ChatMessage } from '../types/ai';

export const aiService = {
  async sendMessage(prompt: string, conversationId?: string): Promise<ChatResponse> {
    return apiFetch<ChatResponse>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, conversationId }),
    });
  },

  async getConversations(): Promise<Conversation[]> {
    try {
      return await apiFetch<Conversation[]>('/ai/conversations');
    } catch (err) {
      console.warn('Failed to fetch conversations:', err);
      return [];
    }
  },

  async getConversation(id: string): Promise<{ id: string; title: string; messages: ChatMessage[] }> {
    return apiFetch<{ id: string; title: string; messages: ChatMessage[] }>(`/ai/conversations/${id}`);
  },

  async deleteConversation(id: string): Promise<void> {
    await apiFetch(`/ai/conversations/${id}`, { method: 'DELETE' });
  },

  async confirmTool(toolName: string, inputData: Record<string, any>): Promise<any> {
    return apiFetch('/ai/tools/confirm', {
      method: 'POST',
      body: JSON.stringify({ toolName, inputData }),
    });
  },
};
