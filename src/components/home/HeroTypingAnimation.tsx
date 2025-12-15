"use client";

import { useEffect, useState } from "react";
import { TypingCursor } from "./TypingCursor";
import { HeroGlowOverlay } from "./HeroGlowOverlay";
import { HERO_CONFIG } from "@/lib/constants";

const TEXT_LINE1 = HERO_CONFIG.text.line1;
const TEXT_LINE2 = HERO_CONFIG.text.line2;
const TYPING_SPEED = HERO_CONFIG.typing.speed;
const GLOW_DELAY = HERO_CONFIG.typing.glowDelay;

export function HeroTypingAnimation() {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [showGlow, setShowGlow] = useState(false);

  const line1Length = TEXT_LINE1.length;
  const line2Length = TEXT_LINE2.length;
  const totalLength = line1Length + line2Length;

  useEffect(() => {
    if (displayedChars >= totalLength) {
      const timer = setTimeout(() => {
        setShowGlow(true);
      }, GLOW_DELAY);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setDisplayedChars(displayedChars + 1);
    }, TYPING_SPEED);

    return () => clearTimeout(timer);
  }, [displayedChars, totalLength]);

  const line1Visible = Math.min(displayedChars, line1Length);
  const line2Visible = Math.min(Math.max(0, displayedChars - line1Length), line2Length);
  const isComplete = displayedChars >= totalLength;
  const showCursor = !isComplete;
  const cursorOnLine1 = displayedChars < line1Length;

  const line1Text = TEXT_LINE1.slice(0, line1Visible);
  const line2Text = TEXT_LINE2.slice(0, line2Visible);

  return (
    <h1
      className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-wide cursor-default"
      style={{ fontFamily: 'var(--font-hero)' }}
    >
      <div className="relative">
        <div className="block italic font-light">
          {line1Text}
          {showCursor && cursorOnLine1 && <TypingCursor />}
        </div>

        <div className="block mt-2 md:mt-3 italic font-semibold">
          {line2Text}
          {showCursor && !cursorOnLine1 && <TypingCursor />}
        </div>

        {showGlow && <HeroGlowOverlay />}
      </div>
    </h1>
  );
}
