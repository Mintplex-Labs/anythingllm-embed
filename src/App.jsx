import useGetScriptAttributes from "@/hooks/useScriptAttributes";
import useSessionId from "@/hooks/useSessionId";
import useOpenChat from "@/hooks/useOpen";
import Head from "@/components/Head";
import OpenButton from "@/components/OpenButton";
import ChatWindow from "./components/ChatWindow";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "@/i18n";

export default function App() {
  const { isChatOpen, toggleOpenChat } = useOpenChat();
  const embedSettings = useGetScriptAttributes();
  const sessionId = useSessionId();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (embedSettings.openOnLoad === "on") {
      toggleOpenChat(true);
    }
  }, [embedSettings.loaded]);

  if (!embedSettings.loaded) return null;

  const positionClasses = {
    "bottom-left": "allm-bottom-0 allm-left-0 allm-ml-4",
    "bottom-right": "allm-bottom-0 allm-right-0 allm-mr-4",
    "top-left": "allm-top-0 allm-left-0 allm-ml-4 allm-mt-4",
    "top-right": "allm-top-0 allm-right-0 allm-mr-4 allm-mt-4",
  };

  // The window grows out of, and shrinks back into, the open button's center.
  const originClasses = {
    "bottom-left": "allm-origin-[28px_calc(100%-28px)]",
    "bottom-right": "allm-origin-[calc(100%-28px)_calc(100%-28px)]",
    "top-left": "allm-origin-[28px_28px]",
    "top-right": "allm-origin-[calc(100%-28px)_28px]",
  };

  const position = embedSettings.position || "bottom-right";
  const windowWidth = embedSettings.windowWidth ?? "400px";
  const windowHeight = embedSettings.windowHeight ?? "700px";

  const closeChat = () => {
    // Without motion there is no animation end to wait for.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return toggleOpenChat(false);
    setClosing(true);
  };

  const handleAnimationEnd = (event) => {
    if (!closing || event.target !== event.currentTarget) return;
    setClosing(false);
    toggleOpenChat(false);
  };

  return (
    <I18nextProvider i18n={i18next}>
      <Head />
      <div
        id="anything-llm-embed-chat-container"
        className={`allm-fixed allm-inset-0 allm-z-50 ${isChatOpen ? "allm-block" : "allm-hidden"}`}
      >
        <div
          style={{
            maxWidth: `min(${windowWidth}, calc(100% - 32px))`,
            maxHeight: `min(${windowHeight}, calc(100% - 32px))`,
            height: "100%",
          }}
          className={`allm-h-full allm-w-full allm-bg-white allm-fixed allm-bottom-0 allm-right-0 allm-mb-4 allm-md:mr-4 allm-rounded-2xl allm-border allm-border-gray-300 allm-shadow-[0_4px_14px_rgba(0,0,0,0.25)] allm-flex allm-flex-col motion-reduce:allm-animate-none ${originClasses[position]} ${closing ? "allm-animate-chat-close" : "allm-animate-chat-open"} ${positionClasses[position]}`}
          onAnimationEnd={handleAnimationEnd}
          id="anything-llm-chat"
        >
          {isChatOpen && (
            <ChatWindow
              closeChat={closeChat}
              settings={embedSettings}
              sessionId={sessionId}
            />
          )}
        </div>
      </div>
      {(!isChatOpen || closing) && (
        <div
          id="anything-llm-embed-chat-button-container"
          className={`allm-fixed allm-bottom-0 ${positionClasses[position]} allm-mb-4 allm-z-50 allm-animate-chat-button motion-reduce:allm-animate-none`}
        >
          <OpenButton
            settings={embedSettings}
            isOpen={isChatOpen && !closing}
            toggleOpen={() => {
              setClosing(false);
              toggleOpenChat(true);
            }}
          />
        </div>
      )}
    </I18nextProvider>
  );
}
