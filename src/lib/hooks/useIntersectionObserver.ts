"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * Intersection Observer フック
 * 要素がビューポート内にあるかを監視し、表示外の時はアニメーションを停止
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px", enabled = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !elementRef.current) {
      return;
    }

    const element = elementRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting;
        setIsIntersecting(intersecting);
        if (intersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, enabled, hasIntersected]);

  return { elementRef, isIntersecting, hasIntersected };
}

