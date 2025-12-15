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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // キーボードの高さを検知（モバイルのみ）
  useEffect(() => {
    if (!isMobile || typeof window === 'undefined' || !window.visualViewport) {
      return;
    }

    const handleResize = () => {
      const viewport = window.visualViewport;
      if (viewport) {
        // ビューポートの高さとウィンドウの高さの差がキーボードの高さ
        const heightDiff = window.innerHeight - viewport.height;
        setKeyboardHeight(Math.max(0, heightDiff));
      }
    };

    const viewport = window.visualViewport;
    if (viewport) {
      viewport.addEventListener('resize', handleResize);
      viewport.addEventListener('scroll', handleResize);
      handleResize(); // 初期値の設定
    }

    return () => {
      if (viewport) {
        viewport.removeEventListener('resize', handleResize);
        viewport.removeEventListener('scroll', handleResize);
      }
    };
  }, [isMobile, isOpen]);

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

      const data = await response.json();

      // エラーレスポンスのチェック
      if (!response.ok || data.error) {
        const errorMessage = data.error || `API呼び出しに失敗しました (ステータス: ${response.status})`;
        console.error("APIエラー詳細:", {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          data: data
        });
        throw new Error(errorMessage);
      }

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
        content: error instanceof Error 
          ? `申し訳ございませんが、エラーが発生しました: ${error.message}`
          : "申し訳ございませんが、エラーが発生しました。しばらく時間をおいてから再度お試しください。",
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
              initial={isMobile ? {
                scale: 0.8,
                opacity: 0,
                y: 100,
              } : undefined}
              animate={isMobile ? {
                scale: 1,
                opacity: 1,
                y: 0,
              } : undefined}
              exit={isMobile ? {
                scale: 0.8,
                opacity: 0,
                y: 100,
              } : undefined}
              transition={isMobile ? {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              } : {
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
                      bottom: keyboardHeight > 0 ? `${keyboardHeight + 1}rem` : "1rem",
                      left: "1rem",
                      maxHeight: keyboardHeight > 0 ? `calc(100dvh - ${keyboardHeight}px - 2rem)` : "calc(100dvh - 2rem)",
                      transition: keyboardHeight > 0 ? "bottom 0.2s ease-out, max-height 0.2s ease-out" : undefined,
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

