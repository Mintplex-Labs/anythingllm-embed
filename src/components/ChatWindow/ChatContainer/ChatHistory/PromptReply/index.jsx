import { forwardRef, memo } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import renderMarkdown from "@/utils/chat/markdown";
import AssistantMessage from "../AssistantMessage";
import ThoughtBubble from "../ThoughtBubble";
import ErrorMessage from "../ErrorMessage";

const ThinkingIndicator = ({ hasThought }) => {
  if (hasThought) {
    return (
      <div className="allm-flex allm-items-center allm-gap-x-2 allm-text-slate-500">
        <CircleNotch size={16} className="allm-animate-spin" />
        <span className="allm-text-sm allm-leading-5">Thinking...</span>
      </div>
    );
  }
  return (
    <div className="allm-flex allm-items-center allm-gap-x-1 allm-h-5">
      {[0, 200, 400].map((delay) => (
        <div
          key={delay}
          style={{ animationDelay: `${delay}ms` }}
          className="allm-w-[6px] allm-h-[6px] allm-rounded-full allm-bg-slate-500 allm-animate-pulse"
        />
      ))}
    </div>
  );
};

const PromptReply = forwardRef(
  (
    {
      uuid,
      reply,
      pending,
      error,
      sources = [],
      sentAt,
      thoughtsExpanded,
      onToggleThoughts,
    },
    ref
  ) => {
    if (!reply && sources.length === 0 && !pending && !error) return null;
    if (error) console.error(`ANYTHING_LLM_CHAT_WIDGET_ERROR: ${error}`);

    // Extract content between think tags if they exist
    const thinkMatches = reply?.match(/<think>([\s\S]*?)<\/think>/g) || [];
    const thoughts = thinkMatches.map((match) =>
      match.replace(/<\/?think>/g, "").trim()
    );

    const hasIncompleteThinkTag =
      reply?.includes("<think>") && !reply?.includes("</think>");

    // For incomplete think tags during streaming, extract the content after the opening tag
    const streamingThought = hasIncompleteThinkTag
      ? reply
          ?.split("<think>")
          .pop()
          ?.replace(/<\/?think>/g, "")
          .trim()
      : null;

    const lastThought = streamingThought || thoughts[thoughts.length - 1];
    const isThinking = hasIncompleteThinkTag || pending;

    // Get the response content without the think tags - clean more aggressively
    const responseContent = reply
      ?.replace(/<think>[\s\S]*?<\/think>/g, "") // Remove complete think blocks
      .replace(/<think>.*$/g, "") // Remove any incomplete think blocks at the end
      .replace(/<\/?think>/g, "") // Remove any stray think tags
      .trim();

    if (isThinking) {
      return (
        <AssistantMessage>
          {hasIncompleteThinkTag && streamingThought && (
            <ThoughtBubble
              thought={streamingThought}
              expanded={thoughtsExpanded}
              onToggle={onToggleThoughts}
              streaming
            />
          )}
          <ThinkingIndicator hasThought={hasIncompleteThinkTag} />
        </AssistantMessage>
      );
    }

    if (error) {
      return (
        <AssistantMessage plain>
          <ErrorMessage />
        </AssistantMessage>
      );
    }

    return (
      <AssistantMessage key={uuid} ref={ref} sentAt={sentAt}>
        {thoughts.length > 0 && (
          <ThoughtBubble
            thought={thoughts.join("\n\n")}
            expanded={thoughtsExpanded}
            onToggle={onToggleThoughts}
          />
        )}
        <span
          className="allm-reply allm-whitespace-pre-line allm-font-medium allm-text-sm allm-leading-[20px] allm-flex allm-flex-col allm-gap-y-1"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(responseContent || ""),
          }}
        />
      </AssistantMessage>
    );
  }
);

export default memo(PromptReply);
