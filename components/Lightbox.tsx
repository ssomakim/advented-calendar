"use client";

type Props = {
  src: string | null;
  onClose: () => void;
};

export default function Lightbox({ src, onClose }: Props) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700"
          >
            Close
          </button>
        </div>

        <div className="mt-3">
          <img src={src} alt="note" className="h-auto w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
