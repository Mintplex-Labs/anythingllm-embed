import HistoricalMessage from "./HistoricalMessage";
import PromptReply from "./PromptReply";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowDown, CircleNotch } from "@phosphor-icons/react";
import { embedderSettings } from "@/main";
import { SEND_TEXT_EVENT } from "..";
import { formatDay } from "@/utils/date";
import { contrastTextColor } from "@/utils/color";

export default function ChatHistory({
  settings = {},
  sessionId,
  history = [],
  onScrolled = () => {},
}) {
  const replyRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const chatHistoryRef = useRef(null);
  const stickToBottom = useRef(true);
  const [expandedThoughts, setExpandedThoughts] = useState({});
  const hasHistory = history.length > 0;

  useEffect(() => {
    // A message the visitor just sent always brings the view back to the bottom.
    if (history[history.length - 1]?.pending) {
      stickToBottom.current = true;
      scrollToBottom("auto");
    }
    if (history.length === 0) {
      onScrolled(false);
      stickToBottom.current = true;
      setIsAtBottom(true);
      setExpandedThoughts({});
    }
  }, [history]);

  // Keeps the latest message in view whenever the content or the visible area
  // changes height (streaming text, an opened thought, a taller prompt input),
  // unless the visitor has scrolled up to read.
  useEffect(() => {
    const container = chatHistoryRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      if (stickToBottom.current) scrollToBottom("auto");
    });
    observer.observe(container);
    observer.observe(container.firstElementChild);
    return () => observer.disconnect();
  }, [hasHistory]);

  const handleScroll = () => {
    if (!chatHistoryRef.current) return;
    onScrolled(chatHistoryRef.current.scrollTop > 0);
    const diff =
      chatHistoryRef.current.scrollHeight -
      chatHistoryRef.current.scrollTop -
      chatHistoryRef.current.clientHeight;
    // Fuzzy margin for what qualifies as "bottom". Stronger than straight comparison since that may change over time.
    const isBottom = diff <= 40;
    stickToBottom.current = isBottom;
    setIsAtBottom(isBottom);
  };

  const setThoughtsExpanded = (index, expanded) =>
    setExpandedThoughts((prev) => ({ ...prev, [index]: expanded }));

  const scrollToBottom = (behavior = "smooth") => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior,
      });
    }
  };

  if (history.length === 0) {
    return (
      <div className="allm-absolute allm-inset-0 allm-box-border allm-overflow-y-auto allm-px-5 allm-py-4 allm-flex allm-flex-col allm-justify-start allm-no-scroll">
        <div className="allm-flex allm-h-full allm-flex-col allm-items-center allm-justify-center">
          <p className="allm-m-0 allm-text-slate-600 allm-text-sm allm-leading-5 allm-font-medium allm-font-sans allm-py-5 allm-text-center">
            {settings?.greeting ?? "Send a chat to get started."}
          </p>
          <SuggestedMessages settings={settings} />
        </div>
      </div>
    );
  }

  return (
    <div className="allm-absolute allm-inset-0">
      <div
        className="allm-h-full allm-box-border allm-overflow-y-auto allm-pt-4 allm-pb-5 allm-flex allm-flex-col allm-justify-start allm-no-scroll"
        id="chat-history"
        ref={chatHistoryRef}
        onScroll={handleScroll}
      >
        <div className="allm-flex allm-flex-col allm-gap-y-5">
          {history.map((props, index) => {
            const isLastMessage = index === history.length - 1;
            const isLastBotReply =
              index === history.length - 1 && props.role === "assistant";

            if (isLastBotReply && props.animate) {
              return (
                <Fragment key={props.uuid}>
                  <DayDivider history={history} index={index} />
                  <PromptReply
                    ref={isLastMessage ? replyRef : null}
                    uuid={props.uuid}
                    reply={props.content}
                    pending={props.pending}
                    sources={props.sources}
                    error={props.error}
                    closed={props.closed}
                    sentAt={props.sentAt}
                    thoughtsExpanded={expandedThoughts[index]}
                    onToggleThoughts={(expanded) =>
                      setThoughtsExpanded(index, expanded)
                    }
                  />
                </Fragment>
              );
            }

            return (
              <Fragment key={index}>
                <DayDivider history={history} index={index} />
                <HistoricalMessage
                  ref={isLastMessage ? replyRef : null}
                  message={props.content}
                  sentAt={props.sentAt || Date.now() / 1000}
                  role={props.role}
                  sources={props.sources}
                  chatId={props.chatId}
                  feedbackScore={props.feedbackScore}
                  settings={settings}
                  sessionId={sessionId}
                  error={props.error}
                  errorMsg={props.errorMsg}
                  thoughtsExpanded={expandedThoughts[index]}
                  onToggleThoughts={(expanded) =>
                    setThoughtsExpanded(index, expanded)
                  }
                />
              </Fragment>
            );
          })}
        </div>
      </div>
      {!isAtBottom && (
        <div className="allm-absolute allm-bottom-[18px] allm-left-1/2 -allm-translate-x-1/2 allm-z-10 allm-box-border allm-w-8 allm-h-8 allm-rounded-full allm-border allm-border-solid allm-border-white allm-bg-slate-400 hover:allm-bg-slate-500 allm-animate-pulse">
          <button
            type="button"
            onClick={() => scrollToBottom()}
            id="scroll-to-bottom-button"
            aria-label="Scroll to bottom"
            className="allm-border-none allm-bg-transparent allm-p-0 allm-w-full allm-h-full allm-rounded-full allm-cursor-pointer allm-flex allm-items-center allm-justify-center allm-text-white"
          >
            <ArrowDown weight="bold" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export function ChatHistoryLoading() {
  return (
    <div className="allm-flex-1 allm-min-h-0 allm-flex allm-items-center allm-justify-center">
      <CircleNotch size={32} className="allm-text-sky-500 allm-animate-spin" />
    </div>
  );
}

function SuggestedMessages({ settings }) {
  if (!settings?.defaultMessages?.length) return null;
  const backgroundColor = embedderSettings.USER_STYLES.msgBg;

  return (
    <div className="allm-flex allm-flex-col allm-gap-y-2 allm-w-[300px] allm-max-w-full">
      {settings.defaultMessages.map((content, i) => (
        <button
          key={i}
          style={{
            opacity: 0,
            wordBreak: "break-word",
            backgroundColor,
            color: contrastTextColor(backgroundColor),
            fontSize: settings.textSize,
          }}
          type="button"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent(SEND_TEXT_EVENT, { detail: { command: content } })
            );
          }}
          className={`msg-suggestion allm-border-none allm-transition-shadow hover:allm-shadow-[0_4px_14px_rgba(0,0,0,0.5)] allm-cursor-pointer allm-box-border allm-min-h-[42px] allm-p-2 allm-rounded-lg allm-font-sans allm-text-sm allm-leading-5 allm-font-medium allm-w-full allm-shadow-[0_4px_14px_rgba(0,0,0,0.25)]`}
        >
          {content}
        </button>
      ))}
    </div>
  );
}

/**
 * Day label shown above the first message of each calendar day.
 * @param {object[]} props.history
 * @param {number} props.index - position of the message the label precedes
 */
function DayDivider({ history, index }) {
  const dayOf = (message) => formatDay(message.sentAt || Date.now() / 1000);
  const day = dayOf(history[index]);
  if (index > 0 && dayOf(history[index - 1]) === day) return null;

  return (
    <p className="allm-m-0 allm-text-center allm-font-sans allm-text-xs allm-leading-4 allm-font-bold allm-text-[#222628]/60">
      {day}
    </p>
  );
}
