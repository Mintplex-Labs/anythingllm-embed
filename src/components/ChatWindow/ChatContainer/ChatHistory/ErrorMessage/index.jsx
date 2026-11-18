import { Warning } from "@phosphor-icons/react";

export default function ErrorMessage({ errorMsg = null }) {
  return (
    <div className="allm-flex allm-flex-col allm-gap-y-2 allm-w-full allm-box-border allm-p-2 allm-rounded-lg allm-bg-red-100">
      <div className="allm-flex allm-items-center allm-gap-x-1 allm-text-red-600">
        <Warning size={16} className="allm-flex-shrink-0" />
        <p className="allm-m-0 allm-text-sm allm-leading-5 allm-font-semibold">
          Could not respond to message.
        </p>
      </div>
      <p className="allm-m-0 allm-text-xs allm-leading-4 allm-font-mono allm-text-red-800 allm-bg-red-300 allm-border-0 allm-border-l-2 allm-border-solid allm-border-red-500 allm-rounded allm-pl-4 allm-pr-2 allm-py-2">
        {errorMsg || "Server error"}
      </p>
    </div>
  );
}
