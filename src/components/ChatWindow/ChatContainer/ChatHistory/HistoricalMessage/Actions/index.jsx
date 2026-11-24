import { useState } from "react";
import { Check, Copy, ThumbsUp } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import ChatService from "@/models/chatService";

const ACTION_CLASSES =
  "allm-flex allm-border-none allm-bg-transparent allm-p-0 allm-cursor-pointer allm-text-inherit";

/**
 * Copy and thumbs up buttons shown under an assistant reply.
 * @param {string} props.message - reply text to copy
 * @param {object} props.settings - embed settings with `baseApiUrl` and `embedId`
 * @param {string} props.sessionId
 * @param {number} [props.chatId] - id of the saved chat, missing until the reply is stored
 * @param {boolean|null} [props.feedbackScore]
 */
export default function Actions({
  message,
  settings,
  sessionId,
  chatId,
  feedbackScore = null,
}) {
  return (
    <div className="allm-self-start allm-flex allm-items-center allm-gap-x-2">
      <CopyButton message={message} />
      <FeedbackButton
        settings={settings}
        sessionId={sessionId}
        chatId={chatId}
        feedbackScore={feedbackScore}
      />
    </div>
  );
}

function CopyButton({ message }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  if (copied) {
    return (
      <div title={t("chat.message-copied")} className="allm-flex">
        <Check size={16} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={copyMessage}
      title={t("chat.copy-response")}
      aria-label={t("chat.copy-response")}
      className={`${ACTION_CLASSES} allm-opacity-50 hover:allm-opacity-100`}
    >
      <Copy size={16} />
    </button>
  );
}

function FeedbackButton({ settings, sessionId, chatId, feedbackScore }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(feedbackScore === true);
  if (!chatId) return null;

  // The button keeps the state the visitor clicked even if the request fails.
  const toggleFeedback = () => {
    setSelected(!selected);
    ChatService.updateChatFeedback(
      settings,
      sessionId,
      chatId,
      selected ? null : true
    );
  };

  return (
    <button
      type="button"
      onClick={toggleFeedback}
      title={t("chat.good-response")}
      aria-label={t("chat.good-response")}
      aria-pressed={selected}
      className={`${ACTION_CLASSES} ${selected ? "allm-opacity-100" : "allm-opacity-50 hover:allm-opacity-100"}`}
    >
      <ThumbsUp size={16} weight={selected ? "fill" : "regular"} />
    </button>
  );
}
