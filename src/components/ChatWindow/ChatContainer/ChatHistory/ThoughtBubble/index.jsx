import { CaretDown } from "@phosphor-icons/react";
import { embedderSettings } from "@/main";

/**
 * Collapsible panel holding the model's reasoning for a reply.
 * @param {string} props.thought
 * @param {boolean} [props.expanded] - visitor's choice, unset until they toggle
 * @param {(expanded: boolean) => void} props.onToggle
 * @param {boolean} [props.streaming] - thought is still being written, shown open by default
 */
export default function ThoughtBubble({
  thought,
  expanded,
  onToggle,
  streaming = false,
}) {
  if (!thought || !embedderSettings.settings.showThoughts) return null;

  const isExpanded = expanded ?? streaming;
  const cleanThought = thought.replace(/<\/?think>/g, "").trim();

  return (
    <div className="allm-flex allm-flex-col allm-gap-y-2 allm-w-full allm-box-border allm-p-[10px] allm-rounded-xl allm-bg-slate-100">
      <button
        type="button"
        onClick={() => onToggle(!isExpanded)}
        aria-expanded={isExpanded}
        className="allm-border-none allm-bg-transparent allm-p-0 allm-w-full allm-cursor-pointer allm-flex allm-items-center allm-justify-between allm-font-sans allm-text-slate-500 hover:allm-text-slate-700 allm-transition-colors"
      >
        <span className="allm-text-xs allm-leading-4 allm-font-medium">
          View thoughts
        </span>
        <CaretDown
          size={14}
          weight="bold"
          className={`allm-transition-transform ${isExpanded ? "allm-rotate-180" : ""}`}
        />
      </button>
      {isExpanded && (
        <div className="allm-border-0 allm-border-l-2 allm-border-solid allm-border-slate-300 allm-pl-2 allm-pb-1">
          <div className="allm-text-xs allm-leading-4 allm-text-slate-600 allm-font-mono allm-whitespace-pre-wrap">
            {cleanThought}
          </div>
        </div>
      )}
    </div>
  );
}
