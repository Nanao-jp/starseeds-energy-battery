import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * LINEブラウザを検出する関数
 * User-Agentに "Line/" が含まれているかチェック
 */
export function isLineBrowser(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return /Line\//i.test(navigator.userAgent);
}