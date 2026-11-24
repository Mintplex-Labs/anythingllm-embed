import React, { useState, useEffect, useRef } from "react";
import ChatHistory from "./ChatHistory";
import PromptInput from "./PromptInput";
import handleChat from "@/utils/chat";
import ChatService from "@/models/chatService";
export const SEND_TEXT_EVENT = "anythingllm-embed-send-prompt";

export default function ChatContainer({
  sessionId,
  settings,
  knownHistory = [],
  onScrolled,
}) {
  const [message, setMessage] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [chatHistory, setChatHistory] = useState(knownHistory);
  const streamCtrl = useRef(null);

  // Resync history if the ref to known history changes
  // eg: cleared.
  useEffect(() => {
    // A reply still streaming belongs to the history being replaced.
    streamCtrl.current?.abort();
    if (knownHistory.length !== chatHistory.length)
      setChatHistory([...knownHistory]);
  }, [knownHistory]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loadingResponse) return false;
    if (!message || message.trim() === "") return false;

    const prevChatHistory = [
      ...chatHistory,
      { content: message, role: "user", sentAt: Math.floor(Date.now() / 1000) },
      {
        content: "",
        role: "assistant",
        pending: true,
        userMessage: message,
        animate: true,
        sentAt: Math.floor(Date.now() / 1000),
      },
    ];
    setChatHistory(prevChatHistory);
    setMessage("");
    setLoadingResponse(true);
  };

  const sendCommand = (command, history = [], attachments = []) => {
    if (!command || command === "") return false;

    let prevChatHistory;
    if (history.length > 0) {
      // use pre-determined history chain.
      prevChatHistory = [
        ...history,
        {
          content: "",
          role: "assistant",
          pending: true,
          userMessage: command,
          attachments,
          animate: true,
        },
      ];
    } else {
      const sentAt = Math.floor(Date.now() / 1000);
      prevChatHistory = (currentHistory) => [
        ...currentHistory,
        {
          content: command,
          role: "user",
          attachments,
          sentAt,
        },
        {
          content: "",
          role: "assistant",
          pending: true,
          userMessage: command,
          animate: true,
          sentAt,
        },
      ];
    }

    setChatHistory(prevChatHistory);
    setLoadingResponse(true);
  };

  useEffect(() => {
    async function fetchReply() {
      const promptMessage =
        chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
      const remHistory = chatHistory.length > 0 ? chatHistory.slice(0, -1) : [];
      var _chatHistory = [...remHistory];

      if (!promptMessage) {
        setLoadingResponse(false);
        return false;
      }
      // The reply is already streaming in, so it owns the loading state.
      if (!promptMessage?.userMessage) return false;

      const ctrl = new AbortController();
      streamCtrl.current = ctrl;
      await ChatService.streamChat(
        sessionId,
        settings,
        promptMessage.userMessage,
        (chatResult) => {
          if (ctrl.signal.aborted) return;
          handleChat(
            chatResult,
            setLoadingResponse,
            setChatHistory,
            remHistory,
            _chatHistory
          );
        },
        ctrl
      );
      setLoadingResponse(false);
      return;
    }

    loadingResponse === true && fetchReply();
  }, [loadingResponse, chatHistory]);

  const handleAutofillEvent = (event) => {
    if (loadingResponse) return;
    if (!event.detail.command) return;
    sendCommand(event.detail.command, [], []);
  };

  useEffect(() => {
    window.addEventListener(SEND_TEXT_EVENT, handleAutofillEvent);
    return () => {
      window.removeEventListener(SEND_TEXT_EVENT, handleAutofillEvent);
    };
  }, [loadingResponse]);

  return (
    <div className="allm-h-full allm-w-full allm-flex allm-flex-col">
      <div className="allm-relative allm-flex-1 allm-min-h-0 allm-overflow-hidden">
        <ChatHistory
          settings={settings}
          sessionId={sessionId}
          history={chatHistory}
          onScrolled={onScrolled}
        />
      </div>
      <div className="allm-flex-shrink-0 allm-mt-auto">
        <PromptInput
          settings={settings}
          message={message}
          submit={handleSubmit}
          onChange={handleMessageChange}
          buttonDisabled={loadingResponse}
        />
      </div>
    </div>
  );
}
