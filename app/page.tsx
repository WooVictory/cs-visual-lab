import Link from "next/link";
import { domainOrder, topics } from "@/lib/topics";

const PROFILE = {
  name: "WooVictory",
  role: "안드로이드 엔지니어",
  githubUser: "https://github.com/WooVictory",
  githubRepo: "https://github.com/WooVictory/tech-interviewoo",
  linkedin: "https://www.linkedin.com/in/seungwoo-lee-590844177/",
};

export default function Home() {
  const visualizedCount = topics.filter((t) => t.hasVisualization).length;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12 lg:py-24">
      <header className="mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Tech Interviewoo
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          안녕하세요, {PROFILE.name}입니다 👋
        </h1>
        <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {PROFILE.role} · 기술 면접 준비하면서 만든 학습 도구예요. 시각화로
          익히고, 핵심 개념과 단골 질문으로 검증합니다.
        </p>
      </header>

      <section className="mb-10 grid gap-3 sm:grid-cols-3">
        <StatCard label="도메인" value={domainOrder.length} />
        <StatCard label="토픽" value={topics.length} />
        <StatCard label="인터랙티브 시각화" value={visualizedCount} />
      </section>

      <section className="mb-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/topics/tcp-3-way-handshake"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-base font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          TCP Handshake로 시작하기 →
        </Link>
        <span className="hidden items-center text-sm text-zinc-500 sm:inline-flex dark:text-zinc-400">
          또는 좌측 패널에서 토픽 선택
        </span>
        <span className="text-sm text-zinc-500 sm:hidden dark:text-zinc-400">
          (모바일에서는 위 버튼으로 시작하세요)
        </span>
      </section>

      <section className="mb-12 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          왜 만들었나
        </h2>
        <div className="mt-3 flex flex-col gap-2.5 text-[15px] leading-7 text-zinc-600 dark:text-zinc-400">
          <p>
            GitHub의{" "}
            <a
              href="https://github.com/WooVictory/Ready-For-Tech-Interview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              Ready-For-Tech-Interview
            </a>{" "}
            레포에 정리한 CS 콘텐츠가 마크다운으로만 있어서, 시각화와 학습
            UX를 얹어 인터랙티브 학습 도구로 재구성했어요.
          </p>
          <p>
            점진적으로 시각화 추가 예정 — 다음 후보는 HTTP/2 멀티플렉싱, OSI
            7계층 캡슐화, DNS 흐름입니다. AI 모의 면접도 붙일 예정.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Links
        </h2>
        <ul className="flex flex-col gap-2">
          <LinkItem
            label="이 프로젝트 GitHub"
            href={PROFILE.githubRepo}
            hint="WooVictory/tech-interviewoo"
          />
          <LinkItem
            label="GitHub 프로필"
            href={PROFILE.githubUser}
            hint="@WooVictory"
          />
          <LinkItem
            label="LinkedIn"
            href={PROFILE.linkedin}
            hint="Seungwoo Lee"
          />
        </ul>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-sm text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </div>
    </div>
  );
}

function LinkItem({
  label,
  href,
  hint,
}: {
  label: string;
  href: string;
  hint: string;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-5 py-4 transition hover:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-100"
      >
        <div>
          <div className="text-base font-medium text-zinc-900 dark:text-zinc-50">
            {label}
          </div>
          <div className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {hint}
          </div>
        </div>
        <span className="text-zinc-400 dark:text-zinc-500" aria-hidden>
          ↗
        </span>
      </a>
    </li>
  );
}
