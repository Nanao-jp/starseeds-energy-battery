"use client";

import { HeroTypingAnimation } from "./HeroTypingAnimation";
import { HeroVideoBackground } from "./HeroVideoBackground";
import { HERO_CONFIG } from "@/lib/constants";

export function HeroSection() {
  const { zIndex } = HERO_CONFIG;

  return (
    <section className="relative w-full h-[60vh] md:aspect-video flex items-center justify-center text-white overflow-hidden border-b border-white/20 cursor-default">
      <HeroVideoBackground />
      
      <div 
        className="absolute inset-0 pointer-events-none noise-texture" 
        style={{ zIndex: zIndex.overlay }}
      />
      <div 
        className="absolute inset-0 pointer-events-none halftone-pattern" 
        style={{ zIndex: zIndex.overlay }}
      />
      
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30" 
        style={{ zIndex: zIndex.overlayGradient }}
      />
      <div 
        className="absolute inset-0 bg-black/20" 
        style={{ zIndex: zIndex.overlayGradient }}
      />

      <div 
        className="relative text-center px-4" 
        style={{ zIndex: zIndex.content }}
      >
        <HeroTypingAnimation />
      </div>
    </section>
  );
}
