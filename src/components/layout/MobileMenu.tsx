"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";

/**
 * サイバー感のあるモバイルハンバーガーメニュー
 */
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // メニューが開いている時にbodyのスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (!mounted) {
    return (
      <button
        className="md:hidden relative p-2 rounded-lg overflow-hidden group"
        aria-label="メニューを開く"
        disabled
      >
        <Menu className="w-6 h-6 text-foreground" />
      </button>
    );
  }

  return (
    <>
      {/* ハンバーガーボタン */}
      <button
        onClick={toggleMenu}
        className="md:hidden relative p-2 rounded-lg overflow-hidden group"
        aria-label="メニューを開く"
      >
        {/* グラデーション背景 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* グロー効果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {isOpen ? (
            <X className="w-6 h-6 text-foreground group-hover:text-white transition-colors" />
          ) : (
            <Menu className="w-6 h-6 text-foreground group-hover:text-white transition-colors" />
          )}
        </div>
      </button>

      {/* メニューオーバーレイ - Portalでbody直下にレンダリング */}
      {mounted && createPortal(
        <AnimatePresence mode="wait">
          {isOpen && (
            <>
              {/* 背景オーバーレイ */}
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
                onClick={closeMenu}
              />

              {/* メニューパネル */}
              <motion.div
                key="panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-background/95 backdrop-blur-md border-l border-cyan-500/30 shadow-2xl z-[70] md:hidden overflow-y-auto"
              >
                {/* サイバーグロー効果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 pointer-events-none" />
                
                {/* グラデーションアニメーション背景 */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 animate-pulse" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* ヘッダー */}
                  <div className="flex items-center justify-between p-4 border-b border-cyan-500/30">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      メニュー
                    </h2>
                    <button
                      onClick={closeMenu}
                      className="p-2 rounded-lg hover:bg-cyan-500/20 transition-colors"
                      aria-label="メニューを閉じる"
                    >
                      <X className="w-5 h-5 text-foreground" />
                    </button>
                  </div>

                  {/* ナビゲーション */}
                  <nav className="flex-1 p-4 space-y-2">
                    {NAV_ITEMS.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <NavLink
                          item={item}
                          variant="header"
                          className={cn(
                            "block px-4 py-3 rounded-lg transition-all",
                            "hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20",
                            "hover:border-l-4 hover:border-cyan-400",
                            "hover:text-cyan-400"
                          )}
                          onClick={closeMenu}
                        />
                      </motion.div>
                    ))}
                  </nav>

                  {/* フッター */}
                  <div className="p-4 border-t border-cyan-500/30">
                    <p className="text-xs text-muted-foreground text-center">
                      Star seeds Energy
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

