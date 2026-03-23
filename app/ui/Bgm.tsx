"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Bgm() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.5;

    const tryAutoplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    tryAutoplay();
  }, []);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasInteracted(true);

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/bgm.mp3" preload="auto" />

      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          className="rounded-full border border-zinc-300 bg-white/85 px-4 py-2 text-[11px] tracking-[0.14em] text-zinc-700 shadow-sm backdrop-blur hover:bg-white"
          aria-label={isPlaying ? "음악 멈추기" : "음악 재생하기"}
        >
          {isPlaying ? "MUSIC OFF" : hasInteracted ? "MUSIC ON" : "PLAY MUSIC"}
        </button>

        <button
          type="button"
          onClick={toggleLanguage}
          className="rounded-full border border-zinc-300 bg-white/85 px-4 py-2 text-[11px] tracking-[0.14em] text-zinc-700 shadow-sm backdrop-blur hover:bg-white"
          aria-label={language === "ko" ? "영어 번역 켜기" : "한국어로 보기"}
        >
          {language === "ko" ? "TRANSLATOR OFF" : "TRANSLATOR ON"}
        </button>
      </div>
    </>
  );
}