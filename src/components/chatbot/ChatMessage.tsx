"use client";

import type { Message } from "@/types/chatbot";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { UserAvatar } from "./UserAvatar";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar
          src="/images/chatbot/chatbot-avatar.png"
          alt="チャットボット"
          size="md"
        />
      )}
      
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
            : "bg-card border border-border text-foreground"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <span className={cn(
          "text-xs mt-1 block",
          isUser ? "text-cyan-100" : "text-muted-foreground"
        )}>
          {new Date(message.timestamp).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {isUser && <UserAvatar />}
    </motion.div>
  );
}

