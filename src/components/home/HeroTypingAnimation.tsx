"use client";

import { useEffect, useState } from "react";
import { TypingCursor } from "./TypingCursor";
import { HeroGlowOverlay } from "./HeroGlowOverlay";

const TEXT_LINE1 = "Driven by Nature,";
const TEXT_LINE2 = "Empowered by Technology.";
const TYPING_SPEED = 60; // ミリ秒
const GLOW_DELAY = 300; // ミリ秒

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
      className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-wide"
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
