"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FADE_DURATION = 3000; // クロスフェード時間（ミリ秒）

export function HeroVideoBackground() {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState(1);

  useEffect(() => {
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    
    if (!video1 || !video2) return;

    const activeVideo = currentVideo === 1 ? video1 : video2;
    const nextVideo = currentVideo === 1 ? video2 : video1;

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

        const checkTime = () => {
          if (activeVideo.currentTime >= fadeStartTime) {
            nextVideo.currentTime = 0;
            nextVideo.play().catch(console.error);
            setCurrentVideo(currentVideo === 1 ? 2 : 1);
            activeVideo.removeEventListener('timeupdate', checkTime);
          }
        };
        
        activeVideo.addEventListener('timeupdate', checkTime);
      }
    };

    if (activeVideo.readyState >= 1) {
      setupFade();
    } else {
      activeVideo.addEventListener('loadedmetadata', setupFade, { once: true });
    }

    const handleVideoEnd = () => {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(console.error);
      setCurrentVideo(currentVideo === 1 ? 2 : 1);
    };

    activeVideo.addEventListener('ended', handleVideoEnd);
    
    if (activeVideo.paused) {
      activeVideo.play().catch(console.error);
    }

    return () => {
      activeVideo.removeEventListener('ended', handleVideoEnd);
      activeVideo.removeEventListener('loadedmetadata', setupFade);
    };
  }, [currentVideo]);

  return (
    <div className="absolute inset-0 z-0">
      <motion.video
        ref={videoRef1}
        src="/video/hero.mp4"
        autoPlay
        muted
        loop={false}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 1 }}
        animate={{ opacity: currentVideo === 1 ? 1 : 0 }}
        transition={{ duration: FADE_DURATION / 1000, ease: "easeInOut" }}
      />
      <motion.video
        ref={videoRef2}
        src="/video/hero.mp4"
        muted
        loop={false}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: currentVideo === 2 ? 1 : 0 }}
        transition={{ duration: FADE_DURATION / 1000, ease: "easeInOut" }}
      />
    </div>
  );
}

