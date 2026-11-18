import { ArrowUp, CircleNotch } from "@phosphor-icons/react";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function PromptInput({
  settings,
  message,
  submit,
  onChange,
  inputDisabled,
  buttonDisabled,
}) {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const [_, setFocused] = useState(false);

  useEffect(() => {
    if (!inputDisabled && textareaRef.current) {
      textareaRef.current.focus();
    }
    resetTextAreaHeight();
  }, [inputDisabled, buttonDisabled]);

  useEffect(() => {
    if (message === "") resetTextAreaHeight();
  }, [message]);

  const handleSubmit = (e) => {
    setFocused(false);
    submit(e);
  };

  const resetTextAreaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const captureEnter = (event) => {
    if (event.keyCode == 13) {
      if (!event.shiftKey) {
        submit(event);
      }
    }
  };

  const adjustTextArea = (event) => {
    const element = event.target;
    // Measuring needs the textarea collapsed for a moment. Holding the wrapper's
    // height meanwhile stops the chat history above from resizing and losing
    // its scroll position on every keystroke.
    const wrapper = element.parentElement;
    wrapper.style.height = wrapper.offsetHeight + "px";
    element.style.height = "auto";
    element.style.height =
      event.target.value.length !== 0 ? element.scrollHeight + "px" : "auto";
    wrapper.style.height = "";
  };

  return (
    <div className="allm-w-full allm-flex allm-justify-center allm-items-center allm-bg-white">
      <form
        onSubmit={handleSubmit}
        className="allm-flex allm-flex-col allm-gap-y-1 allm-rounded-t-lg allm-w-full allm-items-center allm-justify-center"
      >
        <div className="allm-flex allm-items-center allm-w-full">
          <div className="allm-bg-white allm-flex allm-flex-col allm-px-5 allm-box-border allm-overflow-hidden allm-w-full">
            <div
              onClick={() => textareaRef.current?.focus()}
              className="allm-flex allm-items-center allm-gap-x-2 allm-w-full allm-box-border allm-min-h-[50px] allm-p-3 allm-border allm-border-solid allm-border-slate-300 focus-within:allm-border-slate-500 allm-transition-colors allm-rounded-xl allm-cursor-text"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                onInput={adjustTextArea}
                onKeyDown={captureEnter}
                onChange={onChange}
                required={true}
                disabled={inputDisabled}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                  setFocused(false);
                  adjustTextArea(e);
                }}
                value={message}
                className="allm-box-border allm-font-sans allm-border-none allm-cursor-text allm-max-h-[100px] allm-text-[14px] allm-leading-5 allm-m-0 allm-p-0 allm-w-full allm-text-[#222628] allm-bg-transparent placeholder:allm-text-[#222628]/60 allm-resize-none active:allm-outline-none focus:allm-outline-none allm-flex-grow"
                placeholder={settings.sendMessageText || t("chat.send-message")}
                id="message-input"
              />
              <button
                ref={formRef}
                type="submit"
                disabled={buttonDisabled || !message.trim()}
                className="allm-bg-slate-800 allm-border-none allm-p-0 allm-w-5 allm-h-5 allm-flex-shrink-0 allm-inline-flex allm-items-center allm-justify-center allm-rounded-full allm-cursor-pointer allm-text-white allm-transition-colors hover:allm-bg-slate-950 disabled:allm-cursor-default disabled:hover:allm-bg-slate-800"
                id="send-message-button"
                aria-label="Send message"
              >
                {buttonDisabled ? (
                  <CircleNotch className="allm-w-3 allm-h-3 allm-animate-spin" />
                ) : (
                  <ArrowUp size={12} weight="bold" />
                )}
                <span className="allm-sr-only">Send message</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
