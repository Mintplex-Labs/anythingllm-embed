import ChatService from "@/models/chatService";
import { useEffect, useState } from "react";

export default function useChatHistory(settings = null, sessionId = null) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchChatHistory() {
      if (!sessionId || !settings) return;
      try {
        const formattedMessages = await ChatService.embedSessionHistory(
          settings,
          sessionId
        );

        if (settings.firstMessage && formattedMessages.length === 0) {
          formattedMessages.push({ content: settings.firstMessage, role: "user", sentAt: Math.floor(Date.now() / 1000) });
          formattedMessages.push({
            content: "",
            role: "assistant",
            pending: true,
            userMessage: settings.firstMessage,
            animate: true,
            sentAt: Math.floor(Date.now() / 1000),
          });
        }

        setMessages(formattedMessages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching historical chats:", error);
        setLoading(false);
      }
    }
    fetchChatHistory();
  }, [sessionId, settings]);

  return { chatHistory: messages, setChatHistory: setMessages, loading };
}
