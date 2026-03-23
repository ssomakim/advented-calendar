"use client";

import { useRouter } from "next/navigation";

type ReplyPromptProps = {
  open: boolean;
  onClose: () => void;
};

export default function ReplyPrompt({
  open,
  onClose,
}: ReplyPromptProps) {
  const router = useRouter();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-lg">
        <p className="mb-2 text-lg font-medium text-neutral-900">
          아이에게 답장을 보내시겠습니까?
        </p>

        <p className="mb-8 text-sm text-neutral-500">
          From. 미스터 산타
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/reply")}
            className="rounded-full border border-neutral-300 px-5 py-2 text-sm text-neutral-900 transition hover:bg-neutral-100"
          >
            Yes
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-300 px-5 py-2 text-sm text-neutral-500 transition hover:bg-neutral-100"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}