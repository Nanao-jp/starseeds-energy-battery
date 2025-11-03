"use client";

import type { Message } from "@/types/chatbot";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar
          src="/images/chatbot/chatbot-avatar.png"
          alt="チャットボット"
          size="sm"
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

      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-[10px] md:text-xs font-medium">
          あなた
        </div>
      )}
    </div>
  );
}

