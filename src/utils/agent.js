import { v4 } from "uuid";
import { safeJsonParse } from "../utils/request";
import { useState, useEffect } from "react";

export const AGENT_SESSION_START = "agentSessionStart";
export const AGENT_SESSION_END = "agentSessionEnd";

const handledEvents = [
  "statusResponse",
  "fileDownload",
  "awaitingFeedback",
  "wssFailure",
  "rechartVisualize",
];

export function websocketURI(embedSettings) {
  const { baseApiUrl } = embedSettings;
  const wsProtocol = baseApiUrl.startsWith("https://") ? "wss:" : "ws:";
  return `${wsProtocol}//${new URL(baseApiUrl).host}`;
}

export default function handleSocketResponse(event, setChatHistory) {
  const data = safeJsonParse(event.data, null);
  if (data === null) return;
  if (data.type === 'statusResponse') return;
  // No message type is defined then this is a generic message
  // that we need to print to the user as a system response
  if (!data.hasOwnProperty("type")) {
    return setChatHistory((prev) => {
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          uuid: v4(),
          content: data.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: null,
          animate: false,
          pending: false,
          sentAt: Math.floor(Date.now() / 1000),
        },
      ];
    });
  }

  if (!handledEvents.includes(data.type) || !data.content) return;

  if (data.type === "fileDownload") {
    // File download functionality for embed
    const blob = new Blob([atob(data.content.b64Content)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.content.filename ?? 'unknown.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }

  if (data.type === "rechartVisualize") {
    return setChatHistory((prev) => {
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          type: "rechartVisualize",
          uuid: v4(),
          content: data.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: null,
          animate: false,
          pending: false,
          sentAt: Math.floor(Date.now() / 1000),
        },
      ];
    });
  }

  if (data.type === "wssFailure") {
    return setChatHistory((prev) => {
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          uuid: v4(),
          content: data.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: data.content,
          animate: false,
          pending: false,
          sentAt: Math.floor(Date.now() / 1000),
        },
      ];
    });
  }

  return setChatHistory((prev) => {
    return [
      ...prev.filter((msg) => !!msg.content),
      {
        uuid: v4(),
        type: data.type,
        content: data.content,
        role: "assistant",
        sources: [],
        closed: true,
        error: null,
        animate: data?.animate || false,
        pending: false,
        sentAt: Math.floor(Date.now() / 1000),
      },
    ];
  });
}

export function useIsAgentSessionActive() {
  const [activeSession, setActiveSession] = useState(false);
  useEffect(() => {
    function listenForAgentSession() {
      if (!window) return;
      window.addEventListener(AGENT_SESSION_START, () =>
        setActiveSession(true)
      );
      window.addEventListener(AGENT_SESSION_END, () => setActiveSession(false));
    }
    listenForAgentSession();
  }, []);

  return activeSession;
}