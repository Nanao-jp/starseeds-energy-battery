"use client";

import dynamic from "next/dynamic";

// vaulはブラウザAPIを使用するため、SSRを無効化
const Chatbot = dynamic(() => import("./Chatbot").then(mod => ({ default: mod.Chatbot })), {
  ssr: false,
});

export function ChatbotClient() {
  return <Chatbot />;
}

