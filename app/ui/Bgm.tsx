"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Bgm() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userTurnedOffRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.5;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const tryPlay = async () => {
      if (userTurnedOffRef.current || !audio.paused) return;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    const handleFirstInteraction = (
      event: PointerEvent | KeyboardEvent
    ) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("[data-bgm-toggle]")
      ) {
        return;
      }

      void tryPlay();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // 페이지가 열리면 바로 자동재생을 시도합니다.
    void tryPlay();

    // 브라우저가 자동재생을 막은 경우,
    // 사용자가 화면을 처음 조작하는 순간 음악을 재생합니다.
    window.addEventListener("pointerdown", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      userTurnedOffRef.current = false;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      userTurnedOffRef.current = true;
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
          data-bgm-toggle
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