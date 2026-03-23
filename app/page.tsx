"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "frames" | "toWhite" | "cover" | "toCalendar" | "calendar";

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

function rangeDays(start: number, end: number) {
  const arr: number[] = [];
  for (let i = start; i <= end; i += 1) arr.push(i);
  return arr;
}

export default function HomePage() {
  const sfx1Ref = useRef<HTMLAudioElement | null>(null);
  const sfx2Ref = useRef<HTMLAudioElement | null>(null);
  const sfx3Ref = useRef<HTMLAudioElement | null>(null);

  const playSfx = (which: 1 | 2 | 3) => {
    const a =
      which === 1
        ? sfx1Ref.current
        : which === 2
          ? sfx2Ref.current
          : sfx3Ref.current;

    if (!a) return;

    a.currentTime = 0;
    a.volume = 0.7;
    a.play().catch(() => {});
  };

  const router = useRouter();

  const FRAME_COUNT = 10;
  const [hasStarted, setHasStarted] = useState(false);

  const frameSrcs = useMemo(() => {
    const arr: string[] = [];
    for (let i = 1; i <= FRAME_COUNT; i += 1) {
      arr.push(`/home/frames/${pad3(i)}.jpg`);
    }
    return arr;
  }, []);

  const allDays = useMemo(() => rangeDays(1, 25), []);

  const [phase, setPhase] = useState<Phase>("frames");
  const [frameIndex, setFrameIndex] = useState(0);
  const [imgVisible, setImgVisible] = useState(true);
  const [whiteVisible, setWhiteVisible] = useState(false);

  const currentFrame = frameSrcs[frameIndex] ?? null;

  useEffect(() => {
    frameSrcs.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const cover = new Image();
    cover.src = "/home/book.jpg";
  }, [frameSrcs]);

  useEffect(() => {
    if (phase !== "frames") return;
    setImgVisible(false);
    const t = window.setTimeout(() => setImgVisible(true), 30);
    return () => window.clearTimeout(t);
  }, [frameIndex, phase]);

  const goNextFrame = () => {
    setHasStarted(true);

    if (phase === "frames") {
      const currentFrameNumber = frameIndex + 1;

      if (currentFrameNumber <= 5) {
        playSfx(1);
      } else {
        const isEven = currentFrameNumber % 2 === 0;
        playSfx(isEven ? 2 : 3);
      }
    }

    if (frameIndex < FRAME_COUNT - 1) {
      setFrameIndex((v) => v + 1);
      return;
    }

    setPhase("toWhite");
    setWhiteVisible(true);

    window.setTimeout(() => {
      setPhase("cover");
      window.setTimeout(() => setWhiteVisible(false), 120);
    }, 420);
  };

  const coverToCalendar = () => {
    setPhase("toCalendar");
    setWhiteVisible(true);

    window.setTimeout(() => {
      setPhase("calendar");
      window.setTimeout(() => setWhiteVisible(false), 120);
    }, 360);
  };

  const goBookDay = (day: number) => {
    router.push(`/book?day=${day}`);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <audio ref={sfx1Ref} src="/sfx1.mp3" preload="auto" />
      <audio ref={sfx2Ref} src="/sfx2.mp3" preload="auto" />
      <audio ref={sfx3Ref} src="/sfx3.mp3" preload="auto" />

      <div className="mx-auto flex min-h-screen max-w-[920px] flex-col items-center justify-center px-5 py-12">
        <div className="-translate-y-[56px] sm:-translate-y-8">
          <div className="w-full text-center">
            <p className="text-[11px] tracking-[0.22em] text-zinc-500">
              Advented Calendar
            </p>
          </div>

          <div className="relative mt-6 w-full max-w-[560px]">
            {(phase === "frames" || phase === "toWhite") && (
              <button
                onClick={goNextFrame}
                className="group relative block w-full select-none"
                aria-label="next"
              >
                {currentFrame ? (
                  <img
                    key={currentFrame}
                    src={currentFrame}
                    alt="story frame"
                    className={
                      imgVisible
                        ? "mx-auto h-auto w-full opacity-100 transition-opacity duration-300"
                        : "mx-auto h-auto w-full opacity-0 transition-opacity duration-300"
                    }
                  />
                ) : null}

                {phase === "frames" && frameIndex === 0 && !hasStarted ? (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center translate-y-[16px]">
                    <div className="cursor-float cursor-icon">
                      <svg viewBox="0 0 24 24" className="cursor-svg" aria-hidden="true">
                        <path
                          d="M4 3l8.6 18.2 2.3-7.2 7.1-2.3L4 3z"
                          fill="rgba(255,255,255,0.95)"
                        />
                      </svg>
                      <div className="cursor-ring" />
                    </div>
                  </div>
                ) : null}

                <div
                  className={
                    whiteVisible
                      ? "pointer-events-none absolute inset-0 bg-white opacity-100 transition-opacity duration-400"
                      : "pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-400"
                  }
                />
              </button>
            )}

            {(phase === "cover" || phase === "toCalendar") && (
              <button
                onClick={coverToCalendar}
                className="group relative block w-full select-none"
                aria-label="open calendar"
              >
                <img
                  src="/home/book.jpg"
                  alt="book cover"
                  className="mx-auto h-auto w-[60%]"
                />

                <div
                  className={
                    whiteVisible
                      ? "pointer-events-none absolute inset-0 bg-white opacity-100 transition-opacity duration-400"
                      : "pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-400"
                  }
                />
              </button>
            )}

            {phase === "calendar" && (
              <div className="relative">
                <div className="mx-auto w-fit">
                  <div className="grid grid-cols-7 gap-[6px]">
                    {allDays.map((d) => {
                      const isBlinkDay = d === 1;

                      return (
                        <button
                          key={d}
                          onClick={() => goBookDay(d)}
                          className={`aspect-square w-[22px] border bg-white hover:border-zinc-400 ${
                            isBlinkDay
                              ? "border-zinc-200 home-day-blink"
                              : "border-zinc-200"
                          }`}
                          aria-label={`day ${d}`}
                        >
                          <div className="flex h-full items-center justify-center text-[10px] text-zinc-700">
                            {d}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className={
                    whiteVisible
                      ? "pointer-events-none absolute inset-0 bg-white opacity-100 transition-opacity duration-400"
                      : "pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-400"
                  }
                />
              </div>
            )}

            <div className="mt-5 text-center text-xs text-zinc-500">
              {phase === "frames" ? "click the photo to continue" : null}
              {phase === "cover" ? "click the book" : null}
              {phase === "calendar" ? "select a day" : null}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes cursorFloat {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          50% {
            transform: translateY(6px);
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 0;
          }
        }

        .cursor-float {
          position: relative;
          width: 88px;
          height: 88px;
          animation: cursorFloat 1.25s ease-in-out infinite;
        }

        .cursor-icon {
          display: grid;
          place-items: center;
        }

        .cursor-svg {
          width: 36px;
          height: 36px;
          transform: translate(2px, -2px) rotate(-8deg);
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
        }

        @keyframes dayBorderBlink {
          0%,
          100% {
            border-color: rgb(228 228 231);
          }
          50% {
            border-color: rgb(24 24 27);
          }
        }

        .home-day-blink {
          animation: dayBorderBlink 1s steps(1, end) infinite;
        }
      `}</style>
    </main>
  );
}