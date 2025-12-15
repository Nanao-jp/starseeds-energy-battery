"use client";

export function TypingCursor() {
  return (
    <span
      className="inline-block w-[2px] h-[1em] ml-1 typing-cursor-blink"
      style={{
        verticalAlign: "baseline",
        backgroundColor: "currentColor",
      }}
      aria-hidden="true"
    />
  );
}

