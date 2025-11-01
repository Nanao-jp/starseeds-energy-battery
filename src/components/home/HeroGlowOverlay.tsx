"use client";

import { motion } from "framer-motion";
import { HERO_CONFIG } from "@/lib/constants";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import { useEffect, useRef } from "react";

const TEXT_LINE1 = HERO_CONFIG.text.line1;
const TEXT_LINE2 = HERO_CONFIG.text.line2;

export function HeroGlowOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserver({
    threshold: 0,
    rootMargin: "50px",
  });

  // 表示外の時はアニメーションを停止
  useEffect(() => {
    if (!containerRef.current) return;
    const glowElement = containerRef.current;
    
    if (isIntersecting) {
      glowElement.classList.remove("animation-paused");
    } else {
      glowElement.classList.add("animation-paused");
    }
  }, [isIntersecting]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none hero-glow-pulse"
    >
      <motion.div
        className="block italic font-light animate-gradientGlow drop-shadow-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {TEXT_LINE1}
      </motion.div>
      <motion.div
        className="block mt-2 md:mt-3 italic font-semibold animate-gradientGlow drop-shadow-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        {TEXT_LINE2}
      </motion.div>
    </div>
  );
}

