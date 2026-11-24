import { forwardRef } from "react";
import { embedderSettings } from "@/main";
import AnythingLLMMark from "@/components/AnythingLLMMark";
import { formatDate } from "@/utils/date";
import { contrastTextColor } from "@/utils/color";

/**
 * Assistant name, timestamp, and avatar wrapped around a reply's content.
 * @param {number} [props.sentAt] - unix timestamp in seconds
 * @param {boolean} [props.plain] - skip the custom assistant bubble color
 */
const AssistantMessage = forwardRef(
  ({ sentAt = null, plain = false, children }, ref) => {
    const bubbleColor = plain ? null : embedderSettings.ASSISTANT_STYLES.msgBg;

    return (
      <div className="allm-flex allm-flex-col allm-gap-y-[5px] allm-pl-5 allm-pr-[23px] allm-font-sans">
        <div className="allm-flex allm-items-center allm-gap-x-2 allm-pl-[29px] allm-text-[10px] allm-leading-[15px] allm-tracking-[0.1px]">
          <p className="allm-m-0 allm-font-semibold allm-text-slate-700">
            {embedderSettings.settings.assistantName ||
              "AnythingLLM Chat Assistant"}
          </p>
          {sentAt && (
            <p className="allm-m-0 allm-text-slate-500 allm-whitespace-nowrap">
              {formatDate(sentAt)}
            </p>
          )}
        </div>
        <div
          ref={ref}
          className="allm-flex allm-items-start allm-gap-x-[10px] allm-w-full"
        >
          <AssistantAvatar />
          <AssistantContent bubbleColor={bubbleColor}>
            {children}
          </AssistantContent>
        </div>
      </div>
    );
  }
);

export default AssistantMessage;

function AssistantAvatar() {
  const customIcon =
    embedderSettings.settings.assistantIcon ||
    embedderSettings.settings.brandImageUrl;

  if (customIcon) {
    return (
      <img
        src={customIcon}
        alt="Anything LLM Icon"
        className="allm-w-5 allm-h-5 allm-rounded-full allm-flex-shrink-0 allm-object-contain"
        id="anything-llm-icon"
      />
    );
  }

  return (
    <div
      className="allm-w-5 allm-h-5 allm-rounded-full allm-flex-shrink-0 allm-flex allm-items-center allm-justify-center allm-bg-slate-950 allm-text-white"
      id="anything-llm-icon"
    >
      <AnythingLLMMark className="allm-w-[11px]" />
    </div>
  );
}

function AssistantContent({ bubbleColor, children }) {
  if (!bubbleColor) {
    return (
      <div
        style={{ wordBreak: "break-word" }}
        className="allm-flex allm-flex-col allm-gap-y-2 allm-flex-1 allm-min-w-0 allm-text-slate-950 [&>span]:allm-pr-[27px] allm-anything-llm-assistant-message"
      >
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        wordBreak: "break-word",
        backgroundColor: bubbleColor,
        color: contrastTextColor(bubbleColor),
      }}
      className="allm-flex allm-flex-col allm-gap-y-2 allm-min-w-0 allm-p-3 allm-rounded-xl allm-anything-llm-assistant-message"
    >
      {children}
    </div>
  );
}
