"use client";

import { useEffect, useRef, useState } from "react";

export default function Bgm() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);

  const tryPlay = async () => {
    const a = audioRef.current;
    if (!a) return;

    try {
      a.volume = 0.5;
      await a.play();
      setStarted(true);
    } catch {}
  };

  useEffect(() => {
    tryPlay();

    const onFirst = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };

    window.addEventListener("pointerdown", onFirst);
    window.addEventListener("keydown", onFirst);

    return () => {
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />
      <div className="hidden" data-bgm-started={started ? "1" : "0"} />
    </>
  );
}