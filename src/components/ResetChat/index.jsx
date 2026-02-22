import ChatService from "@/models/chatService";
import { useTranslation } from "react-i18next";

export default function ResetChat({
  setChatHistory,
  settings,
  sessionId,
}) {
  const { t } = useTranslation();

  const handleChatReset = async () => {
    await ChatService.resetEmbedChatSession(settings, sessionId);
    setChatHistory([]);
  };

  return (
    <div className="allm-w-full allm-flex allm-justify-center allm-gap-x-1 p-0">
      <button
        style={{ color: "#7A7D7E" }}
        className="allm-h-fit allm-px-0 hover:allm-cursor-pointer allm-border-none allm-text-sm allm-bg-transparent hover:allm-opacity-80 hover:allm-underline"
        onClick={() => handleChatReset()}
      >
        {settings.resetChatText || t("chat.reset-chat")}
      </button>
    </div>
  );
}
