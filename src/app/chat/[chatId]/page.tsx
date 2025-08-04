"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/chat";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const chatId = params.chatId as string;

  useEffect(() => {
    // Fetch messages for this chat
    // This is a placeholder - in a real app, you would fetch from your API
    setMessages([]);
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      // This is a placeholder - in a real app, you would send to your API
      const message: Message = {
        id: Date.now().toString(),
        chat_id: chatId,
        sender_id: "current-user-id",
        content: newMessage,
        created_at: new Date().toISOString(),
      };

      setMessages([...messages, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">
                No messages yet. Start a conversation!
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                    message.sender_id === "current-user-id"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 mr-auto"
                  }`}
                >
                  {message.content}
                </div>
              ))
            )}
          </div>
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
