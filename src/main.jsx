import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { parseStylesSrc } from "./utils/constants.js";
import { initI18n } from "./i18n.js";

// Mount into the script tag's parent element so the chat renders inline,
// like an iframe embedded in the page.
const currentScript = document.currentScript;
const appElement = currentScript?.parentElement || document.body;

const scriptSettings = Object.assign(
  {},
  currentScript?.dataset || {}
);

export const embedderSettings = {
  settings: scriptSettings,
  stylesSrc: parseStylesSrc(currentScript?.src),
  USER_STYLES: {
    msgBg: scriptSettings?.userBgColor ?? "#3DBEF5",
    base: `allm-text-white allm-rounded-t-[18px] allm-rounded-bl-[18px] allm-rounded-br-[4px] allm-mx-[20px]`,
  },
  ASSISTANT_STYLES: {
    msgBg: scriptSettings?.assistantBgColor ?? "#FFFFFF",
    base: `allm-text-[#222628] allm-rounded-t-[18px] allm-rounded-br-[18px] allm-rounded-bl-[4px] allm-mr-[37px] allm-ml-[9px]`,
  },
};

// Initialize i18n after settings are available
initI18n(scriptSettings);

const root = ReactDOM.createRoot(appElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
