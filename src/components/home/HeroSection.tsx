"use client";

import { HeroTypingAnimation } from "./HeroTypingAnimation";
import { HeroVideoBackground } from "./HeroVideoBackground";

export function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] md:aspect-video md:h-auto md:min-h-[500px] flex items-center justify-center text-white overflow-hidden">
      <HeroVideoBackground />
      
      <div className="absolute inset-0 z-[1] pointer-events-none noise-texture" />
      <div className="absolute inset-0 z-[1] pointer-events-none halftone-pattern" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 z-[2]" />
      <div className="absolute inset-0 bg-black/20 z-[2]" />

      <div className="relative z-10 text-center px-4">
        <HeroTypingAnimation />
      </div>
    </section>
  );
}
