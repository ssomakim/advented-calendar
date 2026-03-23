import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[420px] px-6 py-16 text-zinc-900">
      <header className="text-center mb-10">
        <div className="flex items-center justify-center gap-6">
          <Link
            href="/"
            className="text-[10px] tracking-[0.18em] text-zinc-500 opacity-70 hover:opacity-100"
          >
            Home
          </Link>

          <Link
            href="/book?day=1"
            className="text-[10px] tracking-[0.18em] text-zinc-500 opacity-70 hover:opacity-100"
          >
            Calendar
          </Link>

          <Link
            href="/replies"
            className="text-[10px] tracking-[0.18em] text-zinc-500 opacity-70 hover:opacity-100"
          >
            Replies
          </Link>
        </div>
      </header>

      <h1 className="mb-8 text-center text-sm font-medium">
        About
      </h1>

      <div className="space-y-6 text-[12px] leading-6 text-zinc-700">
        <p>
          여기에는 기획의도를 적으면 됩니다~ 저는 지금 주한독일도서관에 있는데요~ 
          사람이 많이 없다고 해서 왔더니 겁나 많네요
        </p>

        <p>
          근데 여기 진짜 독일같아요;; 개신기... 바닥 재질이랑 가구때문인가? 
          체코로 돌아온 것 같은 느낌적인 느낌느낌
        </p>
      </div>

      <div className="mt-12 space-y-4 text-[12px] text-zinc-700">
        <div>
          <p className="text-zinc-400">글 그림</p>
          <a
            href="https://instagram.com/suinria/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            정수인 @suinria
          </a>
        </div>

        <div>
          <p className="text-zinc-400">북디자인 웹디자인 웹 개발</p>
          <a
            href="https://instagram.com/ssomakim/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            김소정 @ssomakim
          </a>
        </div>

        <div>
          <p className="text-zinc-400">기획</p>
          <p>김소정 정수인</p>
        </div>
      </div>
    </main>
  );
}