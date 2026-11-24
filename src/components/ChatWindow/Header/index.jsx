import AnythingLLMMark from "@/components/AnythingLLMMark";
import AnythingLLMWordmark from "@/assets/anything-llm-wordmark.svg";
import ChatService from "@/models/chatService";
import {
  ArrowCounterClockwise,
  Check,
  Copy,
  DotsThreeVertical,
  Envelope,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const MENU_ITEM_CLASSES =
  "hover:allm-cursor-pointer allm-bg-transparent allm-border-none allm-box-border allm-w-full allm-px-[6px] allm-py-1 allm-rounded-md allm-flex allm-items-center allm-gap-x-2 allm-font-sans allm-text-sm allm-leading-5 allm-font-semibold allm-text-slate-700 allm-no-underline allm-whitespace-nowrap hover:allm-bg-slate-100 active:allm-bg-slate-200 allm-transition-colors";

export default function ChatWindowHeader({
  sessionId,
  settings = {},
  iconUrl = null,
  closeChat,
  setChatHistory,
  scrolled = false,
}) {
  const [showingOptions, setShowOptions] = useState(false);
  const menuRef = useRef();
  const buttonRef = useRef();

  const handleChatReset = async () => {
    await ChatService.resetEmbedChatSession(settings, sessionId);
    setChatHistory([]);
    setShowOptions(false);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div
      className={`allm-flex allm-items-center allm-justify-between allm-relative allm-flex-shrink-0 allm-box-border allm-h-[60px] allm-pl-[25px] allm-pr-4 allm-rounded-t-2xl allm-border-0 allm-border-b allm-border-solid allm-transition-colors ${scrolled ? "allm-border-slate-300" : "allm-border-[#E9E9E9]"}`}
      id="anything-llm-header"
    >
      <Brand iconUrl={iconUrl} />
      <div className="allm-flex allm-items-center">
        {settings.loaded && (
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setShowOptions(!showingOptions)}
            className="allm-bg-transparent hover:allm-cursor-pointer allm-border-none allm-p-1 allm-flex allm-items-center hover:allm-bg-slate-100 active:allm-bg-slate-200 allm-rounded-md allm-text-slate-500 hover:allm-text-slate-700 allm-transition-colors"
            aria-label="Options"
          >
            <DotsThreeVertical size={18} weight="bold" />
          </button>
        )}
        <button
          type="button"
          onClick={closeChat}
          className="allm-bg-transparent hover:allm-cursor-pointer allm-border-none allm-p-1 allm-flex allm-items-center hover:allm-bg-slate-100 active:allm-bg-slate-200 allm-rounded-md allm-text-slate-500 hover:allm-text-slate-700 allm-transition-colors"
          aria-label="Close"
        >
          <X size={20} weight="bold" />
        </button>
      </div>
      <OptionsMenu
        settings={settings}
        showing={showingOptions}
        resetChat={handleChatReset}
        sessionId={sessionId}
        menuRef={menuRef}
      />
    </div>
  );
}

function Brand({ iconUrl = null }) {
  if (iconUrl) {
    return (
      <img style={{ maxWidth: 160, maxHeight: 32 }} src={iconUrl} alt="Brand" />
    );
  }

  return (
    <div className="allm-flex allm-items-center allm-gap-x-2">
      <AnythingLLMMark className="allm-w-5 allm-text-slate-950" />
      <img src={AnythingLLMWordmark} alt="AnythingLLM" />
    </div>
  );
}

function OptionsMenu({ settings, showing, resetChat, sessionId, menuRef }) {
  if (!showing) return null;
  const { t } = useTranslation();

  return (
    <div
      ref={menuRef}
      className="allm-bg-white allm-absolute allm-z-20 allm-flex allm-flex-col allm-items-stretch allm-px-[6px] allm-py-2 allm-rounded-xl allm-border allm-border-solid allm-border-slate-300 allm-top-[54px] allm-right-[34px]"
    >
      <button onClick={resetChat} className={MENU_ITEM_CLASSES}>
        <ArrowCounterClockwise size={18} />
        <p className="allm-m-0">{t("chat.reset-chat")}</p>
      </button>
      <ContactSupport email={settings.supportEmail} />
      <SessionID sessionId={sessionId} />
    </div>
  );
}

function SessionID({ sessionId }) {
  if (!sessionId) return null;
  const { t } = useTranslation();
  const [sessionIdCopied, setSessionIdCopied] = useState(false);

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setSessionIdCopied(true);
    setTimeout(() => setSessionIdCopied(false), 1000);
  };

  if (sessionIdCopied) {
    return (
      <div className={MENU_ITEM_CLASSES}>
        <Check size={18} />
        <p className="allm-m-0">{t("chat.message-copied")}</p>
      </div>
    );
  }

  return (
    <button onClick={copySessionId} className={MENU_ITEM_CLASSES}>
      <Copy size={18} />
      <p className="allm-m-0">{t("chat.session-id")}</p>
    </button>
  );
}

function ContactSupport({ email = null }) {
  if (!email) return null;
  const { t } = useTranslation();
  const subject = `Inquiry from ${window.location.origin}`;
  return (
    <a
      href={`mailto:${email}?Subject=${encodeURIComponent(subject)}`}
      className={MENU_ITEM_CLASSES}
    >
      <Envelope size={18} />
      <p className="allm-m-0">{t("chat.email-support")}</p>
    </a>
  );
}
