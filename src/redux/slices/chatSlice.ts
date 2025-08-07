import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import {
  Chat,
  Message,
  UserOnlineStatus,
  TypingIndicator,
  MessageStatus,
} from "@/shared/interfaces";

interface ChatState {
  entities: {
    chats: Record<string, Chat>;
    messages: Record<string, Message[]>;
  };
  ui: {
    isLoading: boolean;
    error: string | null;
  };
  activeChat: string | null;
  socketConnected: boolean;
  onlineUsers: UserOnlineStatus[];
  typingIndicators: TypingIndicator[];
  messageStatuses: MessageStatus[];
  unreadCounts: { [chatId: string]: number };
}

const initialState: ChatState = {
  entities: {
    chats: {},
    messages: {},
  },
  ui: {
    isLoading: false,
    error: null,
  },
  activeChat: null,
  socketConnected: false,
  onlineUsers: [],
  typingIndicators: [],
  messageStatuses: [],
  unreadCounts: {},
};

// Thunks
export const fetchUserChats = createAsyncThunk(
  "chat/fetchUserChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/chat");
      return response.data as Chat[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch chats"
      );
    }
  }
);

export const fetchChatMessages = createAsyncThunk(
  "chat/fetchChatMessages",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chat/${chatId}/messages`);
      return { chatId, messages: response.data as Message[] };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    {
      chatId,
      content,
      attachments,
      applicationId,
    }: {
      chatId: string;
      content: string;
      attachments?: any[];
      applicationId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/chat/${chatId}/messages`, {
        content,
        attachments,
        applicationId,
      });
      return response.data as Message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to send message"
      );
    }
  }
);

export const createChat = createAsyncThunk(
  "chat/createChat",
  async (participantId: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/chat", { participantId });
      return response.data as Chat;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create chat"
      );
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async (chatId: string, { rejectWithValue }) => {
    try {
      await api.put(`/chat/${chatId}/read`);
      return chatId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to mark messages as read"
      );
    }
  }
);

export const connectSocket = createAsyncThunk(
  "chat/connectSocket",
  async (_, { rejectWithValue }) => {
    try {
      // This would initialize your WebSocket connection
      return { connected: true };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to connect to chat server"
      );
    }
  }
);

export const disconnectSocket = createAsyncThunk(
  "chat/disconnectSocket",
  async (_, { rejectWithValue }) => {
    try {
      // This would disconnect your WebSocket connection
      return { connected: false };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to disconnect from chat server"
      );
    }
  }
);

export const sendTypingIndicator = createAsyncThunk(
  "chat/sendTypingIndicator",
  async (
    { chatId, isTyping }: { chatId: string; isTyping: boolean },
    { rejectWithValue }
  ) => {
    try {
      // This would send a typing indicator via WebSocket
      return { chatId, isTyping };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to send typing status");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChat = action.payload;
      // Reset unread count when opening a chat
      if (action.payload && state.unreadCounts[action.payload]) {
        state.unreadCounts[action.payload] = 0;
      }
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: Message }>
    ) => {
      const { chatId, message } = action.payload;
      if (!state.entities.messages[chatId]) {
        state.entities.messages[chatId] = [];
      }
      state.entities.messages[chatId].push(message);

      // Update unread count if message is not from current user and chat is not active
      if (message.sender !== "current-user-id" && state.activeChat !== chatId) {
        state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
      }

      // Add initial message status
      state.messageStatuses.push({
        messageId: message.id,
        status: "sent",
        timestamp: new Date().toISOString(),
      });
    },
    clearError: (state) => {
      state.ui.error = null;
    },
    clearChatMessages: (state) => {
      state.entities.messages = {};
    },
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.socketConnected = action.payload;
    },
    updateOnlineStatus: (state, action: PayloadAction<UserOnlineStatus>) => {
      const existingIndex = state.onlineUsers.findIndex(
        (u) => u.userId === action.payload.userId
      );
      if (existingIndex >= 0) {
        state.onlineUsers[existingIndex] = action.payload;
      } else {
        state.onlineUsers.push(action.payload);
      }
    },
    updateTypingIndicator: (state, action: PayloadAction<TypingIndicator>) => {
      const existingIndex = state.typingIndicators.findIndex(
        (t) =>
          t.chatId === action.payload.chatId &&
          t.userId === action.payload.userId
      );

      if (existingIndex >= 0) {
        state.typingIndicators[existingIndex] = action.payload;
      } else {
        state.typingIndicators.push(action.payload);
      }
    },
    updateMessageStatus: (state, action: PayloadAction<MessageStatus>) => {
      const existingIndex = state.messageStatuses.findIndex(
        (m) => m.messageId === action.payload.messageId
      );

      if (existingIndex >= 0) {
        state.messageStatuses[existingIndex] = action.payload;
      } else {
        state.messageStatuses.push(action.payload);
      }
    },
    clearTypingIndicators: (state, action: PayloadAction<string>) => {
      // Clear typing indicators for a specific chat after a timeout
      const chatId = action.payload;
      state.typingIndicators = state.typingIndicators.filter(
        (t) => t.chatId !== chatId
      );
    },
    updateUnreadCount: (
      state,
      action: PayloadAction<{ chatId: string; count: number }>
    ) => {
      const { chatId, count } = action.payload;
      state.unreadCounts[chatId] = count;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user chats
      .addCase(fetchUserChats.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        action.payload.forEach((chat) => {
          state.entities.chats[chat.id] = chat;
        });
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Fetch chat messages
      .addCase(fetchChatMessages.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        const { chatId, messages } = action.payload;
        state.entities.messages[chatId] = messages;

        // Initialize message statuses
        messages.forEach((message: Message) => {
          if (!state.messageStatuses.some((s) => s.messageId === message.id)) {
            state.messageStatuses.push({
              messageId: message.id,
              status: message.readBy.length > 0 ? "read" : "sent",
              timestamp: message.updatedAt || message.createdAt,
            });
          }
        });
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        const chatId = action.payload.chat;
        if (!state.entities.messages[chatId]) {
          state.entities.messages[chatId] = [];
        }
        state.entities.messages[chatId].push(action.payload);

        // Add message status
        state.messageStatuses.push({
          messageId: action.payload.id,
          status: "sent",
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Create chat
      .addCase(createChat.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.entities.chats[action.payload.id] = action.payload;
        state.activeChat = action.payload.id;
        state.entities.messages[action.payload.id] = [];
        state.unreadCounts[action.payload.id] = 0;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Mark messages as read
      .addCase(markMessagesAsRead.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        const chatId = action.payload;
        if (state.entities.messages[chatId]) {
          state.entities.messages[chatId] = state.entities.messages[chatId].map(
            (msg) => ({
              ...msg,
              readBy: [...msg.readBy, "current-user-id"],
            })
          );

          // Update message statuses to read
          state.messageStatuses = state.messageStatuses.map((status) => {
            const message = state.entities.messages[chatId].find(
              (m) => m.id === status.messageId
            );
            if (message && status.status !== "read") {
              return {
                ...status,
                status: "read" as const,
                timestamp: new Date().toISOString(),
              };
            }
            return status;
          });
        }

        // Reset unread count
        state.unreadCounts[chatId] = 0;
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Socket connection
      .addCase(connectSocket.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(connectSocket.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.socketConnected = action.payload.connected;
      })
      .addCase(connectSocket.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
        state.socketConnected = false;
      })
      .addCase(disconnectSocket.pending, (state) => {
        state.ui.isLoading = true;
      })
      .addCase(disconnectSocket.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.socketConnected = action.payload.connected;
        // Clear real-time data when disconnecting
        state.onlineUsers = [];
        state.typingIndicators = [];
      })
      .addCase(disconnectSocket.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Typing indicator
      .addCase(sendTypingIndicator.pending, (state) => {
        state.ui.error = null;
      })
      .addCase(sendTypingIndicator.fulfilled, (state, action) => {
        // Update local typing indicator immediately for better UX
        const { chatId, isTyping } = action.payload;
        state.typingIndicators = state.typingIndicators.filter(
          (t) => !(t.chatId === chatId && t.userId === "current-user-id")
        );

        if (isTyping) {
          state.typingIndicators.push({
            chatId,
            userId: "current-user-id",
            isTyping: true,
          });
        }
      })
      .addCase(sendTypingIndicator.rejected, (state, action) => {
        state.ui.error = action.payload as string;
      });
  },
});

export const {
  setActiveChat,
  addMessage,
  clearError,
  clearChatMessages,
  setSocketConnected,
  updateOnlineStatus,
  updateTypingIndicator,
  updateMessageStatus,
  clearTypingIndicators,
  updateUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;
