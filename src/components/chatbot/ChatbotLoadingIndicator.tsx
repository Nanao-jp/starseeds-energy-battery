"use client";

import { motion } from "framer-motion";
import { Avatar } from "./Avatar";

/**
 * チャットボットのローディングインジケーター
 */
export function ChatbotLoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex gap-3 mb-4"
    >
      <Avatar
        src="/images/chatbot/chatbot-avatar.png"
        alt="チャットボット"
        size="md"
      />
      <div className="bg-card border border-border rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </motion.div>
  );
}

