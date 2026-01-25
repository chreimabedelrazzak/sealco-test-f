"use client";
import { useEffect } from "react";

const ChatBot = () => {
  useEffect(() => {
    // 1. Initialize the Crisp configuration
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "80f5a619-43c7-4273-9474-a2d0ab99d3fc";

    // 2. Inject the Crisp SDK script
    (function () {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  }, []);

  return null; // This component doesn't render any UI; it just loads the script
};

export default ChatBot;