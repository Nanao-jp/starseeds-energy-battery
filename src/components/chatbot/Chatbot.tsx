"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChatbotSimpleButton } from "./ChatbotSimpleButton";
import { ChatbotWindowContent } from "./ChatbotWindowContent";
import { useViewport } from "@/lib/hooks/useViewport";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/chatbot";

export function Chatbot() {
  const { isMobile } = useViewport();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleSendMessage = useCallback(async (content: string) => {
    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // APIを呼び出し
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          history: messagesRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error("API呼び出しに失敗しました");
      }

      const data = await response.json();

      // アシスタントメッセージを追加
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message || "申し訳ございませんが、回答を生成できませんでした。",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("チャットエラー:", error);
      
      // エラーメッセージを追加
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "申し訳ございませんが、エラーが発生しました。しばらく時間をおいてから再度お試しください。",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            key="button"
            {...(!isMobile && { layoutId: "chatbot-container" })}
            layout={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: "1rem",
              right: `max(1rem, env(safe-area-inset-right, 1rem))`,
              zIndex: 99999,
              pointerEvents: "auto",
            }}
          >
            <ChatbotSimpleButton onClick={handleOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm"
              onClick={handleClose}
            />
            <motion.div
              {...(!isMobile && { layoutId: "chatbot-container" })}
              layout={false}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                position: "fixed",
                ...(isMobile
                  ? {
                      top: "1rem",
                      right: `max(1rem, env(safe-area-inset-right, 1rem))`,
                      bottom: "1rem",
                      left: "1rem",
                    }
                  : {
                      bottom: "1rem",
                      right: `max(1rem, env(safe-area-inset-right, 1rem))`,
                      top: "auto",
                      left: "auto",
                      width: "28rem",
                      height: "600px",
                    }),
              }}
              className={cn(
                "chatbot-window-glow chatbot-gradient-animated z-[9999] border border-cyan-500/30 flex flex-col focus:outline-none shadow-2xl shadow-cyan-500/20 rounded-2xl overflow-hidden"
              )}
            >
              <ChatbotWindowContent
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onClose={handleClose}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}

