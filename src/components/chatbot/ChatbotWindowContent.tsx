"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { Avatar } from "./Avatar";
import { ChatbotGradientBackground } from "./ChatbotGradientBackground";
import { ChatbotLoadingIndicator } from "./ChatbotLoadingIndicator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useViewport } from "@/lib/hooks/useViewport";
import type { Message } from "@/types/chatbot";

interface ChatbotWindowContentProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClose: () => void;
}

export function ChatbotWindowContent({
  messages,
  isLoading,
  onSendMessage,
  onClose,
}: ChatbotWindowContentProps) {
  const { isMobile } = useViewport();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // メッセージが追加されたらスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ウィンドウが開いたら入力欄にフォーカス（モバイルでは自動フォーカスを無効化）
  // モバイルではキーボード表示によるレイアウト崩れを防ぐため、ユーザーが手動でタップするまで待つ
  useEffect(() => {
    if (!isMobile) {
      // デスクトップは即座にフォーカス
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
    // モバイルは自動フォーカスしない（ユーザーがタップするまで待つ）
  }, [isMobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || isLoading) return;

    onSendMessage(trimmedValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー - ボタンと統一されたデザイン */}
      <div className="relative flex items-center justify-between p-4 border-b border-cyan-500/30 overflow-hidden">
        <ChatbotGradientBackground />
        
        <div className="relative z-10 flex items-center gap-2 md:gap-3 flex-1">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm md:text-base flex items-center gap-1.5">
              <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                Star seeds AI
              </span>
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-cyan-200 animate-pulse flex-shrink-0" />
            </h3>
            <p className="text-xs text-cyan-100/80 hidden md:block mt-0.5">製品・工事についてお答えします</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="relative z-10 h-8 w-8 text-cyan-200 hover:text-white hover:bg-cyan-500/20"
          aria-label="閉じる"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* メッセージエリア */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-4 bg-card/95 backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Avatar
              src="/images/chatbot/chatbot-avatar.png"
              alt="チャットボット"
              size="lg"
              className="mb-4"
              fallback="💬"
            />
            <p className="text-sm font-medium mb-2">こんにちは！</p>
            <p className="text-xs">
              製品や工事についてのご質問にお答えします。
              <br />
              何かお聞きになりたいことはありますか？
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <ChatbotLoadingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          製品・工事に関する質問にお答えします
        </p>
      </form>
    </div>
  );
}

