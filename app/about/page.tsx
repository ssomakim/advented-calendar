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
          2025년 여름,
          </p>
        
          <p>
          소중한 친구와 의미 있는 무언가를 하고 싶어진 마음으로부터 시작된 프로젝트입니다.
          평소 각자가 좋아하는 것을 담아 어드벤트 캘린더를 만들기로 결정했습니다.
          크리스마스를 애정하는 만큼, 크리스마스를 고대하는 시간도 애정하기에 즐거운 마음으로 만들었습니다.
          </p>
          <p>
          크리스마스를 기다리며 설레하는 시간을 한 소녀의 이야기와 함께 즐겨주시길 바랍니다.
          어느 해에도 메리 크리스마스.
        </p>
      </div>

      <div className="mt-12 space-y-4 text-[12px] text-zinc-700">
        <div>
          <p className="text-zinc-400">글 ・ 그림</p>
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
          <p className="text-zinc-400">북디자인 ・ 웹 디자인 ・ 웹 개발</p>
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