"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import letters, { Letter } from "@/lib/letters";
import RichText from "@/components/RichText";
import { useLanguage } from "@/components/LanguageProvider";
import lettersEn from "@/lib/lettersEn";

function rangeDays(start: number, end: number) {
  const arr: number[] = [];
  for (let i = start; i <= end; i += 1) arr.push(i);
  return arr;
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white text-zinc-900">
          <div className="mx-auto max-w-[760px] px-6 py-12">
            <div className="text-center text-sm text-zinc-600">로딩 중</div>
          </div>
        </main>
      }
    >
      <BookPageInner />
    </Suspense>
  );
}

function BookPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const { language } = useLanguage();
  const data = letters as Letter[];
  const allDays = useMemo(() => rangeDays(1, 25), []);

  const dayFromUrl = Number(searchParams.get("day") ?? "1");

  const currentDay =
    Number.isFinite(dayFromUrl) && dayFromUrl >= 1 && dayFromUrl <= 25
      ? dayFromUrl
      : 1;

  const current = data.find((x) => x.day === currentDay) ?? null;

  const [imgIndex, setImgIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const images = current?.images ?? [];
  const currentImage = images[imgIndex] ?? null;
  const canPrevImg = imgIndex > 0;
  const canNextImg = imgIndex < images.length - 1;
  const isIntroImage = currentImage?.endsWith("/00.jpg");

  useEffect(() => {
    setImgIndex(0);
    setFadeIn(true);
  }, [currentDay]);

  useEffect(() => {
    setFadeIn(false);
    const t = window.setTimeout(() => setFadeIn(true), 20);
    return () => window.clearTimeout(t);
  }, [imgIndex]);

  useEffect(() => {
    clickSoundRef.current = new Audio("/sounds/click.mp3");
    clickSoundRef.current.volume = 0.5;
  }, []);

  const goDay = (day: number) => {
    const audio = clickSoundRef.current;

    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }

    router.push(`/book?day=${day}`);
  };

  const currentTranslation = current ? lettersEn[current.day] : undefined;

  const currentText = (() => {
    if (!current) return "";

    const pageTexts =
      language === "en" && currentTranslation?.pageTextsEn
        ? currentTranslation.pageTextsEn
        : current.pageTexts;

    const text =
      language === "en" && currentTranslation?.textEn
        ? currentTranslation.textEn
        : current.text;

    if (pageTexts && pageTexts[imgIndex] != null) {
      return pageTexts[imgIndex];
    }

    return text ?? "";
  })();

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <header className="mx-auto max-w-[760px] text-center">
          <div className="flex items-center justify-center gap-6">
            <Link
              href="/"
              className="text-[10px] tracking-[0.18em] text-zinc-500 opacity-70 hover:opacity-100"
            >
              Home
            </Link>

            <Link
              href="/replies"
              className="text-[10px] tracking-[0.18em] text-zinc-500 opacity-70 hover:opacity-100"
            >
              Replies
            </Link>

            <Link
              href="/about"
              className="text-[10px] tracking-[0.18em] text-zinc-500 opacity-70 hover:opacity-100"
            >
              About
            </Link>
          </div>
        </header>

        <section className="mt-10">
          <div className="text-center">
            <div className="mx-auto max-w-[760px]">
              <div className="mx-auto w-fit">
                <div className="grid grid-cols-7 gap-[6px]">
                  {allDays.map((d) => {
                    const isActive = d === currentDay;

                    const buttonClass = [
                      "aspect-square w-[22px] border",
                      isActive
                        ? "border-zinc-900 bg-zinc-900"
                        : "border-zinc-200 bg-white hover:border-zinc-400",
                    ].join(" ");

                    return (
                      <button
                        key={d}
                        onClick={() => goDay(d)}
                        className={buttonClass}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div
                          className={
                            isActive
                              ? "flex h-full items-center justify-center text-[10px] text-white"
                              : "flex h-full items-center justify-center text-[10px] text-zinc-700"
                          }
                        >
                          {d}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mx-auto mt-8 h-px w-1/3 bg-zinc-100" />
              </div>
            </div>

            <div className="mt-8">
              <div
                className={`mx-auto grid ${isIntroImage ? "max-w-[980px]" : "max-w-[560px]"
                  } grid-cols-[48px_1fr_48px] items-center gap-3`}
              >
                <div className="flex justify-center">
                  {canPrevImg ? (
                    <button
                      onClick={() => setImgIndex((v) => v - 1)}
                      className="h-10 w-10 text-sm text-zinc-800 opacity-70 hover:opacity-100"
                      aria-label="previous image"
                    >
                      ←
                    </button>
                  ) : null}
                </div>

                <div className="min-w-0">
                  {currentImage ? (
                    <div
                      className={`${isIntroImage
                          ? "relative left-1/2 w-[calc(100vw-3rem)] max-w-none -translate-x-1/2 sm:left-auto sm:w-full sm:max-w-[820px] sm:translate-x-0 lg:max-w-[920px] mx-auto"
                          : "mx-auto w-full max-w-[420px]"
                        }`}
                    >
                      <img
                        key={currentImage}
                        src={currentImage}
                        alt={`image ${imgIndex + 1}`}
                        className={`block h-auto w-full ${fadeIn ? "opacity-100" : "opacity-0"
                          } transition-opacity duration-300`}
                      />
                    </div>
                  ) : (
                    <div className="border border-zinc-100 py-16 text-sm text-zinc-600">
                      이미지가 없어.
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  {canNextImg ? (
                    <button
                      onClick={() => setImgIndex((v) => v + 1)}
                      className="h-10 w-10 text-sm text-zinc-800 opacity-70 hover:opacity-100"
                      aria-label="next image"
                    >
                      →
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-[760px] pb-16">
              <RichText
                text={(currentText ?? "").trimEnd()}
                className="mx-auto max-w-[520px] text-center text-[10px] leading-5 text-zinc-800"
              />

              {currentDay === 25 && imgIndex === 1 && (
                <div className="mt-6 text-center">
                  <Link
                    href="/reply"
                    className="text-[10px] text-zinc-500 underline underline-offset-4 transition hover:text-zinc-700"
                  >
                    {language === "en"
                      ? "► Write a reply to her"
                      : "► 그 아이에게 답장쓰기"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}