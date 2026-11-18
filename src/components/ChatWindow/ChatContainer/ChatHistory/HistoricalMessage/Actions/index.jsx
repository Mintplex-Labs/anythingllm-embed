import { useState } from "react";
import { ThumbsUp } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import ChatService from "@/models/chatService";

/**
 * Thumbs up a visitor can toggle on a saved assistant reply.
 * @param {object} props.settings - embed settings with `baseApiUrl` and `embedId`
 * @param {string} props.sessionId
 * @param {number} [props.chatId] - id of the saved chat, missing until the reply is stored
 * @param {boolean|null} [props.feedbackScore]
 */
export default function Actions({
  settings,
  sessionId,
  chatId,
  feedbackScore = null,
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(feedbackScore === true);
  if (!chatId) return null;

  const toggleFeedback = async () => {
    const feedback = selected ? null : true;
    // Updating before the request settles lets a second click undo the first.
    setSelected(!selected);
    const success = await ChatService.updateChatFeedback(
      settings,
      sessionId,
      chatId,
      feedback
    );
    if (!success) setSelected(selected);
  };

  return (
    <button
      type="button"
      onClick={toggleFeedback}
      title={t("chat.good-response")}
      aria-label={t("chat.good-response")}
      aria-pressed={selected}
      className={`allm-self-start allm-flex allm-border-none allm-bg-transparent allm-p-0 allm-cursor-pointer allm-text-inherit ${selected ? "allm-opacity-100" : "allm-opacity-50 hover:allm-opacity-100"}`}
    >
      <ThumbsUp size={16} weight={selected ? "fill" : "regular"} />
    </button>
  );
}
