"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function TranslatorToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="rounded-full border border-zinc-300 bg-white/90 px-4 py-2 text-sm text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white"
      aria-label="Toggle translator"
    >
      Translator {language === "ko" ? "off" : "on"}
    </button>
  );
}