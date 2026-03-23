"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

export default function ReplyPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const copy = {
    ko: {
      title: "답장 보내기",
      nameLabel: "보내는 이",
      namePlaceholder: "이름을 적어 주세요",
      messageLabel: "편지 내용",
      messagePlaceholder: "답장을 적어 주세요",
      secretLabel: "몰래 보내기",
      secretHint: "*다른 사람에게 답장이 보이지 않아요.",
      submit: "답장 보내기",
      sending: "보내는 중...",
      errors: {
        noName: "보내는 이를 입력해 주세요.",
        noMessage: "편지 내용을 입력해 주세요.",
        submitFail: "답장을 보내지 못했습니다.",
        network: "네트워크 오류가 발생했습니다.",
      },
    },
    en: {
      title: "Send a Reply",
      nameLabel: "From",
      namePlaceholder: "Enter your name",
      messageLabel: "Message",
      messagePlaceholder: "Write your reply",
      secretLabel: "Send secretly",
      secretHint: "*Your reply will not be visible to others.",
      submit: "Send Reply",
      sending: "Sending...",
      errors: {
        noName: "Please enter your name.",
        noMessage: "Please enter your message.",
        submitFail: "Failed to send your reply.",
        network: "A network error occurred.",
      },
    },
  } as const;

  const t = copy[language];

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSecret, setIsSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError(t.errors.noName);
      return;
    }

    if (!message.trim()) {
      setError(t.errors.noMessage);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          message,
          isSecret,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t.errors.submitFail);
        return;
      }

      router.push("/replies");
    } catch {
      setError(t.errors.network);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-[420px] px-6 py-16">
      <div className="border border-neutral-200 bg-white p-5 md:p-6">
        <h1 className="mb-6 text-center text-sm font-semibold text-neutral-900">
          {t.title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-[12px] font-medium text-neutral-700"
            >
              {t.nameLabel}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              className="w-full border border-neutral-300 px-3 py-2 text-[12px] outline-none focus:border-neutral-500"
              placeholder={t.namePlaceholder}
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-[12px] font-medium text-neutral-700"
            >
              {t.messageLabel}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              rows={10}
              className="w-full border border-neutral-300 px-3 py-2 text-[12px] whitespace-pre-wrap outline-none focus:border-neutral-500"
              placeholder={t.messagePlaceholder}
            />
          </div>

          <div className="border border-neutral-200 px-3 py-3">
            <label className="flex items-center gap-3 text-[12px] text-neutral-800">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
                className="h-3.5 w-3.5"
              />
              {t.secretLabel}
            </label>

            <p className="mt-2 text-[8px] text-neutral-500">
              {t.secretHint}
            </p>
          </div>

          {error ? <p className="text-[12px] text-red-500">{error}</p> : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="border border-neutral-300 px-4 py-2 text-[12px] text-neutral-900 transition hover:bg-neutral-100 disabled:opacity-50"
            >
              {loading ? t.sending : t.submit}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}