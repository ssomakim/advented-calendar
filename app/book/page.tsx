"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import letters from "../../data/letters.json";

type Letter = {
  day: number;
  title: string;
  images: string[];
  pageTexts?: string[];
  text: string;
  isFinal: boolean;
};

function rangeDays(start: number, end: number) {
  const arr: number[] = [];
  for (let i = start; i <= end; i += 1) arr.push(i);
  return arr;
}

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const data = letters as Letter[];

  const availableDays = useMemo(
    () => data.map((x) => x.day).sort((a, b) => a - b),
    [data]
  );

  const allDays = useMemo(() => rangeDays(1, 25), []);

  const dayParam = searchParams.get("day");
  const dayFromUrl = dayParam ? Number(dayParam) : null;

  const defaultDay = availableDays[0] ?? 1;
  const currentDay =
    dayFromUrl && availableDays.includes(dayFromUrl) ? dayFromUrl : defaultDay;

  const current = data.find((x) => x.day === currentDay) ?? null;

  const [imgIndex, setImgIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    setImgIndex(0);
    setFadeIn(true);
  }, [currentDay]);

  useEffect(() => {
    setFadeIn(false);
    const t = window.setTimeout(() => setFadeIn(true), 20);
    return () => window.clearTimeout(t);
  }, [imgIndex]);

  const goDay = (day: number) => {
    router.push(`/book?day=${day}`);
  };

  const images = current?.images ?? [];
  const currentImage = images[imgIndex] ?? null;

  const canPrevImg = imgIndex > 0;
  const canNextImg = imgIndex < images.length - 1;

  const currentText = (() => {
    if (!current) return "";
    if (current.pageTexts && current.pageTexts[imgIndex] != null) {
      return current.pageTexts[imgIndex];
    }
    return current.text ?? "";
  })();

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-[760px] px-6 py-12">
        {/* 제목 */}
        <header className="text-center">
          <div className="flex justify-center">
            <Link
              href="/"
              className="text-xs tracking-[0.22em] text-zinc-500 opacity-70 hover:opacity-100"
            >
              Advented Calendar
            </Link>
          </div>
        </header>

        <section className="mt-10">
          {!current ? (
            <div className="text-center text-sm text-zinc-600">
              아직 준비된 날짜가 없어.
            </div>
          ) : (
            <div className="text-center">
              {/* 사진 */}
              <div className="mt-6 translate-y-[56px]">
                <div className="mx-auto grid max-w-[560px] grid-cols-[48px_1fr_48px] items-center gap-3">
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
                      <img
                        key={currentImage}
                        src={currentImage}
                        alt={`image ${imgIndex + 1}`}
                        className={
                          fadeIn
                            ? "mx-auto h-auto w-full max-w-[420px] opacity-100 transition-opacity duration-300"
                            : "mx-auto h-auto w-full max-w-[420px] opacity-0 transition-opacity duration-300"
                        }
                      />
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

              {/* 텍스트 */}
              <div className="mt-10 pt-8 pb-16">
                <div className="mx-auto max-w-[520px] whitespace-pre-wrap text-center text-[10px] leading-5 text-zinc-800">
                  {(currentText ?? "").trimEnd()}
                </div>
                {/* 짧은 구분선 */}
                <div className="mx-auto mt-[95px] h-px w-1/3 bg-zinc-100" />
              </div>

              {/* 달력: 맨 아래로 이동 */}
              <div className="mt-[24px] pt-8">
                <div className="mx-auto w-fit">
                  <div className="grid grid-cols-7 gap-[6px]">
                    {allDays.map((d) => {
                      const isAvailable = availableDays.includes(d);
                      const isActive = d === currentDay;

                      if (!isAvailable) {
                        return (
                          <div
                            key={d}
                            className="aspect-square w-[22px] border border-zinc-100 bg-white"
                            aria-hidden="true"
                            title="준비중"
                          >
                            <div className="flex h-full items-center justify-center text-[10px] text-zinc-200">
                              {d}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={d}
                          onClick={() => goDay(d)}
                          className={
                            isActive
                              ? "aspect-square w-[22px] border border-zinc-900 bg-zinc-900"
                              : "aspect-square w-[22px] border border-zinc-200 bg-white hover:border-zinc-400"
                          }
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
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
