"use client";

import { Sparkles } from "lucide-react";
import { Avatar } from "./Avatar";
import { useViewport } from "@/lib/hooks/useViewport";

interface ChatbotSimpleButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatbotSimpleButton({ onClick, isOpen }: ChatbotSimpleButtonProps) {
  const { isMobile } = useViewport();

  // チャットが開いている時は非表示
  if (isOpen) {
    return null;
  }

  // モバイル: テキストのみのコンパクトなボタン
  if (isMobile) {
    return (
      <button
        onClick={onClick}
        className="chatbot-gradient-animated animate-fade-up"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "0.5rem 0.75rem",
          boxShadow: "0 4px 6px -1px rgba(6, 182, 212, 0.3), 0 2px 4px -1px rgba(6, 182, 212, 0.2)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          borderRadius: "0.75rem",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          overflow: "hidden",
          fontWeight: 600,
          color: "white",
          fontSize: "0.75rem",
          cursor: "pointer",
          maxWidth: "calc(100vw - 2rem)",
          pointerEvents: "auto",
        }}
        aria-label="Star seeds AIに相談"
      >
        {/* グラデーションアニメーション背景 */}
        <div className="chatbot-gradient-bg" />
        
        {/* グロー効果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20" />

        {/* テキストのみ */}
        <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
            Star seeds AI
          </span>
          <span className="text-cyan-100 text-xs">に相談</span>
          <Sparkles className="w-3 h-3 text-cyan-200 animate-pulse flex-shrink-0" />
        </span>
      </button>
    );
  }

  // デスクトップ: アイコン+テキストのボタン
  return (
    <button
      onClick={onClick}
      className="chatbot-gradient-animated animate-fade-up"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "0.75rem 1rem",
        boxShadow: "0 10px 15px -3px rgba(6, 182, 212, 0.5), 0 4px 6px -2px rgba(6, 182, 212, 0.5)",
        border: "1px solid rgba(6, 182, 212, 0.3)",
        borderRadius: "1rem",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        overflow: "hidden",
        fontWeight: 600,
        color: "white",
        fontSize: "0.875rem",
        cursor: "pointer",
        pointerEvents: "auto",
      }}
      aria-label="Star seeds AIに相談"
    >
      {/* グラデーションアニメーション背景 */}
      <div className="chatbot-gradient-bg" />
      
      {/* サイバーテックな光る効果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* グロー効果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20" />

      {/* アイコン画像 */}
      <div className="relative z-10 flex-shrink-0">
        <Avatar
          src="/images/chatbot/chatbot-avatar.png"
          alt="チャットボット"
          size="md"
          className="w-10 h-10 ring-2 ring-white/30"
        />
      </div>

      {/* テキスト */}
      <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
        <span className="font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
          Star seeds AI
        </span>
        <span className="text-cyan-100">に相談</span>
        <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse flex-shrink-0" />
      </span>
    </button>
  );
}
