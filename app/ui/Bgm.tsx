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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white/85 shadow-sm backdrop-blur transition hover:bg-white"
          aria-label={isPlaying ? "음악 끄기" : "음악 켜기"}
        >
          <img
            src={isPlaying ? "/icons/music-on.png" : "/icons/music-off.png"}
            alt=""
            className="h-7 w-7 object-contain"
          />
        </button>

        <button
          type="button"
          onClick={toggleLanguage}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white/85 shadow-sm backdrop-blur transition hover:bg-white"
          aria-label={language === "ko" ? "번역 켜기" : "번역 끄기"}
        >
          <img
            src={
              language === "ko"
                ? "/icons/translate-off.png"
                : "/icons/translate-on.png"
            }
            alt=""
            className="h-10 w-10 object-contain"
          />
        </button>
      </div>
    </>
  );
}