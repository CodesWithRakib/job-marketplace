import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { Chat, Message } from "@/types/chat";

interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  activeChat: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  messages: {},
  activeChat: null,
  isLoading: false,
  error: null,
};

// Fetch user's chats
export const fetchUserChats = createAsyncThunk(
  "chat/fetchUserChats",
  async () => {
    const response = await api.get("/chat");
    return response.data;
  }
);

// Fetch messages for a specific chat
export const fetchChatMessages = createAsyncThunk(
  "chat/fetchChatMessages",
  async (chatId: string) => {
    const response = await api.get(`/chat/${chatId}/messages`);
    return { chatId, messages: response.data };
  }
);

// Send a message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, content }: { chatId: string; content: string }) => {
    const response = await api.post(`/chat/${chatId}/messages`, { content });
    return response.data;
  }
);

// Create a new chat
export const createChat = createAsyncThunk(
  "chat/createChat",
  async (userId: string) => {
    const response = await api.post("/chat", { userId });
    return response.data;
  }
);

// Mark messages as read
export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async (chatId: string) => {
    await api.put(`/chat/${chatId}/read`);
    return chatId;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChat = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: Message }>
    ) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    clearChatError: (state) => {
      state.error = null;
    },
    clearChatMessages: (state) => {
      state.messages = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user chats
      .addCase(fetchUserChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload;
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch chats";
      })

      // Fetch chat messages
      .addCase(fetchChatMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        const { chatId, messages } = action.payload;
        state.messages[chatId] = messages;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch messages";
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const chatId = action.payload.chat_id;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        state.messages[chatId].push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send message";
      })

      // Create chat
      .addCase(createChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats.unshift(action.payload);
      })
      .addCase(createChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create chat";
      })

      // Mark messages as read
      .addCase(markMessagesAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        const chatId = action.payload;
        if (state.messages[chatId]) {
          state.messages[chatId] = state.messages[chatId].map((msg) => ({
            ...msg,
            is_read: true,
          }));
        }
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to mark messages as read";
      });
  },
});

export const { setActiveChat, addMessage, clearChatError, clearChatMessages } =
  chatSlice.actions;
export default chatSlice.reducer;
