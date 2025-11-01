"use client";

import { motion } from "framer-motion";

const TEXT_LINE1 = "Driven by Nature,";
const TEXT_LINE2 = "Empowered by Technology.";

export function HeroGlowOverlay() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{
        opacity: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
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
    </motion.div>
  );
}

