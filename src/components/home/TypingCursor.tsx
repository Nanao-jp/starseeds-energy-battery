"use client";

import { motion } from "framer-motion";

export function TypingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block w-[2px] h-[1em] ml-1"
      style={{
        verticalAlign: "baseline",
        backgroundColor: "currentColor",
      }}
      aria-hidden="true"
    />
  );
}

