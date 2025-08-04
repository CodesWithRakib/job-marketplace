import api from "@/lib/api";
import { Chat, Message } from "@/types/chat";

export const chatService = {
  // Get user's chats
  async getUserChats(): Promise<Chat[]> {
    const response = await api.get<Chat[]>("/chat");
    return response.data;
  },

  // Get messages for a specific chat
  async getChatMessages(chatId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/chat/${chatId}/messages`);
    return response.data;
  },

  // Send a message
  async sendMessage(chatId: string, content: string): Promise<Message> {
    const response = await api.post<Message>(`/chat/${chatId}/messages`, {
      content,
    });
    return response.data;
  },

  // Create a new chat
  async createChat(userId: string): Promise<Chat> {
    const response = await api.post<Chat>("/chat", { userId });
    return response.data;
  },

  // Mark messages as read
  async markMessagesAsRead(chatId: string): Promise<void> {
    await api.put(`/chat/${chatId}/read`);
  },
};
