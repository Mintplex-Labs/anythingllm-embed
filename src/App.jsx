import useGetScriptAttributes from "@/hooks/useScriptAttributes";
import useSessionId from "@/hooks/useSessionId";
import Head from "@/components/Head";
import ChatWindow from "./components/ChatWindow";
import { I18nextProvider } from "react-i18next";
import i18next from "@/i18n";

export default function App() {
  const embedSettings = useGetScriptAttributes();
  const sessionId = useSessionId();

  if (!embedSettings.loaded) return null;

  return (
    <I18nextProvider i18n={i18next}>
      <Head />
      <div
        id="anything-llm-embed-chat-container"
        className="allm-w-full allm-h-full allm-bg-white allm-flex allm-flex-col allm-overflow-hidden"
        style={{
          maxWidth: embedSettings.windowWidth ?? "100%",
          maxHeight: embedSettings.windowHeight ?? "100%",
          height: "100%",
          width: "100%",
        }}
      >
        <ChatWindow settings={embedSettings} sessionId={sessionId} />
      </div>
    </I18nextProvider>
  );
}
