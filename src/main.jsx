import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { parseStylesSrc } from "./utils/constants.js";
import { initI18n } from "./i18n.js";

const appElement = document.createElement("div");
document.body.appendChild(appElement);

const scriptSettings = Object.assign(
  {},
  document?.currentScript?.dataset || {}
);

export const embedderSettings = {
  settings: scriptSettings,
  stylesSrc: parseStylesSrc(document?.currentScript?.src),
  USER_STYLES: {
    msgBg: scriptSettings?.userBgColor ?? "#E2E8F0",
  },
  ASSISTANT_STYLES: {
    // Assistant replies only render inside a bubble when a color is set.
    msgBg: scriptSettings?.assistantBgColor ?? null,
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
