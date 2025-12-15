"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { HERO_CONFIG } from "@/lib/constants";

const FADE_DURATION = HERO_CONFIG.video.fadeDuration;
const MOBILE_BREAKPOINT = HERO_CONFIG.video.mobileBreakpoint;
const RESIZE_DEBOUNCE_MS = 150; // リサイズイベントのデバウンス時間（ミリ秒）

// 動画要素の共通スタイル
const videoStyle: React.CSSProperties = {
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
  pointerEvents: 'none',
};

export function HeroVideoBackground() {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // モバイル判定（デバウンス付き）
  const checkMobile = useCallback(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }
  }, []);

  useEffect(() => {
    // 初回判定
    checkMobile();

    // リサイズ時も判定（デバウンス）
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (resizeTimerRef.current) {
          clearTimeout(resizeTimerRef.current);
        }
        resizeTimerRef.current = setTimeout(checkMobile, RESIZE_DEBOUNCE_MS);
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (resizeTimerRef.current) {
          clearTimeout(resizeTimerRef.current);
        }
      };
    }
  }, [checkMobile]);

  // 動画ソースをデバイスに応じて決定
  const videoSource = isMobile 
    ? HERO_CONFIG.video.sources.mobile 
    : HERO_CONFIG.video.sources.desktop;

  useEffect(() => {
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    
    if (!video1 || !video2) return;

    // 動画ソースが変更された場合は再読み込み
    const updateVideoSource = (video: HTMLVideoElement) => {
      const source = video.querySelector('source');
      if (source) {
        // 現在のソースパスを取得（相対パスまたは絶対パスに対応）
        const currentSrc = source.getAttribute('src') || '';
        if (currentSrc !== videoSource) {
          source.src = videoSource;
          video.load();
        }
      }
    };

    updateVideoSource(video1);
    updateVideoSource(video2);

    const activeVideo = currentVideo === 1 ? video1 : video2;
    const nextVideo = currentVideo === 1 ? video2 : video1;

    // timeupdateイベントのハンドラーを保持（クリーンアップ用）
    let timeUpdateHandler: (() => void) | null = null;
    let loadedMetadataHandler: (() => void) | null = null;
    let videoEndHandler: (() => void) | null = null;

    const setupFade = () => {
      if (activeVideo.duration && !isNaN(activeVideo.duration)) {
        const duration = activeVideo.duration;
        const fadeStartTime = duration - (FADE_DURATION / 1000);
        
        if (activeVideo.currentTime >= fadeStartTime) {
          nextVideo.currentTime = 0;
          nextVideo.play().catch(console.error);
          setCurrentVideo(currentVideo === 1 ? 2 : 1);
          return;
        }

        // ハンドラーを定義して保持
        timeUpdateHandler = () => {
          if (activeVideo.currentTime >= fadeStartTime) {
            nextVideo.currentTime = 0;
            nextVideo.play().catch(console.error);
            setCurrentVideo(currentVideo === 1 ? 2 : 1);
            // イベントを削除
            if (timeUpdateHandler) {
              activeVideo.removeEventListener('timeupdate', timeUpdateHandler);
              timeUpdateHandler = null;
            }
          }
        };
        
        activeVideo.addEventListener('timeupdate', timeUpdateHandler);
      }
    };

    if (activeVideo.readyState >= 1) {
      setupFade();
    } else {
      loadedMetadataHandler = setupFade;
      activeVideo.addEventListener('loadedmetadata', loadedMetadataHandler, { once: true });
    }

    videoEndHandler = () => {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(console.error);
      setCurrentVideo(currentVideo === 1 ? 2 : 1);
    };

    activeVideo.addEventListener('ended', videoEndHandler);
    
    if (activeVideo.paused) {
      activeVideo.play().catch(console.error);
    }

    // クリーンアップ: すべてのイベントリスナーを確実に削除
    return () => {
      // 保存したハンドラー参照を使用して確実に削除
      if (videoEndHandler) {
        activeVideo.removeEventListener('ended', videoEndHandler);
        video1.removeEventListener('ended', videoEndHandler);
        video2.removeEventListener('ended', videoEndHandler);
      }
      if (loadedMetadataHandler) {
        activeVideo.removeEventListener('loadedmetadata', loadedMetadataHandler);
        video1.removeEventListener('loadedmetadata', loadedMetadataHandler);
        video2.removeEventListener('loadedmetadata', loadedMetadataHandler);
      }
      if (timeUpdateHandler) {
        activeVideo.removeEventListener('timeupdate', timeUpdateHandler);
        // 念のため、両方の動画からも削除
        video1.removeEventListener('timeupdate', timeUpdateHandler);
        video2.removeEventListener('timeupdate', timeUpdateHandler);
      }
    };
  }, [currentVideo, videoSource]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.video
        ref={videoRef1}
        autoPlay
        muted
        loop={false}
        playsInline
        preload="auto"
        className="absolute"
        style={videoStyle}
        initial={{ opacity: 1 }}
        animate={{ opacity: currentVideo === 1 ? 1 : 0 }}
        transition={{ duration: FADE_DURATION / 1000, ease: "easeInOut" }}
      >
        <source key={videoSource} src={videoSource} type="video/webm" />
      </motion.video>
      <motion.video
        ref={videoRef2}
        muted
        loop={false}
        playsInline
        preload="none"
        className="absolute"
        style={videoStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: currentVideo === 2 ? 1 : 0 }}
        transition={{ duration: FADE_DURATION / 1000, ease: "easeInOut" }}
      >
        <source key={videoSource} src={videoSource} type="video/webm" />
      </motion.video>
    </div>
  );
}

