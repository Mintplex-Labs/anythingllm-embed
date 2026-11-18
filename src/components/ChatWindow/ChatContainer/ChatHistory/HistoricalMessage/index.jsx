import React, { memo, forwardRef } from "react";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";
import { embedderSettings } from "@/main";
import { v4 } from "uuid";
import { formatDate } from "@/utils/date";
import { contrastTextColor } from "@/utils/color";
import AssistantMessage from "../AssistantMessage";
import ThoughtBubble from "../ThoughtBubble";
import ErrorMessage from "../ErrorMessage";
import Actions from "./Actions";

const HistoricalMessage = forwardRef(
  (
    {
      uuid = v4(),
      message,
      role,
      sources = [],
      error = false,
      errorMsg = null,
      sentAt,
      chatId,
      feedbackScore = null,
      settings,
      sessionId,
      thoughtsExpanded,
      onToggleThoughts,
    },
    ref
  ) => {
    const textSize = !!embedderSettings.settings.textSize
      ? `allm-text-[${embedderSettings.settings.textSize}px]`
      : "allm-text-sm";
    if (error) console.error(`ANYTHING_LLM_CHAT_WIDGET_ERROR: ${error}`);

    // Extract content between think tags if they exist
    const thinkMatches = message?.match(/<think>([\s\S]*?)<\/think>/g) || [];
    const thoughts = thinkMatches.map((match) =>
      match.replace(/<think>|<\/think>/g, "").trim()
    );

    // Get the response content without the think tags
    const responseContent = message
      ?.replace(/<think>[\s\S]*?<\/think>/g, "")
      .trim();

    if (role === "user") {
      return (
        <div
          key={uuid}
          ref={ref}
          className="allm-flex allm-flex-col allm-items-end allm-gap-y-[5px] allm-pl-[60px] allm-pr-5 allm-font-sans"
        >
          {sentAt && (
            <p className="allm-m-0 allm-text-[10px] allm-leading-[15px] allm-tracking-[0.1px] allm-text-slate-500">
              {formatDate(sentAt)}
            </p>
          )}
          <div
            style={{
              wordBreak: "break-word",
              backgroundColor: embedderSettings.USER_STYLES.msgBg,
              color: contrastTextColor(embedderSettings.USER_STYLES.msgBg),
            }}
            className="allm-max-w-full allm-box-border allm-p-3 allm-rounded-xl allm-anything-llm-user-message"
          >
            <span
              className={`allm-whitespace-pre-line allm-flex allm-flex-col allm-gap-y-1 allm-font-medium ${textSize} allm-leading-[20px]`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMarkdown(message)),
              }}
            />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <AssistantMessage key={uuid} ref={ref} sentAt={sentAt} plain>
          <ErrorMessage errorMsg={errorMsg} />
        </AssistantMessage>
      );
    }

    return (
      <AssistantMessage ref={ref} sentAt={sentAt}>
        {thoughts.length > 0 && (
          <ThoughtBubble
            thought={thoughts.join("\n\n")}
            expanded={thoughtsExpanded}
            onToggle={onToggleThoughts}
          />
        )}
        <span
          className={`allm-whitespace-pre-line allm-flex allm-flex-col allm-gap-y-1 allm-font-medium ${textSize} allm-leading-[20px]`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              renderMarkdown(responseContent || message)
            ),
          }}
        />
        <Actions
          settings={settings}
          sessionId={sessionId}
          chatId={chatId}
          feedbackScore={feedbackScore}
        />
      </AssistantMessage>
    );
  }
);

export default memo(HistoricalMessage);
