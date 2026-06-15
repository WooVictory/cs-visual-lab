import Link from "next/link";
import {
  domainLabel,
  domainOrder,
  getTopicsByDomain,
  topics,
} from "@/lib/topics";

export default function Home() {
  const visualizedCount = topics.filter((t) => t.hasVisualization).length;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 lg:py-20">
      <header className="mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Tech Interviewoo
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          보면서 이해하고, 설명하면서 검증하는 기술 면접 학습
        </h1>
        <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          네트워크 · OS · 데이터베이스 · 알고리즘 · 디자인 패턴 · 언어 —
          기술 면접 단골 주제 {topics.length}개를 시각화와 핵심 개념으로
          학습하세요.
        </p>
      </header>

      <section className="mb-10 grid gap-3 sm:grid-cols-3">
        <StatCard label="도메인" value={domainOrder.length} />
        <StatCard label="토픽" value={topics.length} />
        <StatCard label="인터랙티브 시각화" value={visualizedCount} />
      </section>

      <Link
        href="/topics/tcp-3-way-handshake"
        className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-base font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        TCP Handshake로 시작하기 →
      </Link>

      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 lg:hidden">
        모바일에서는 토픽 페이지로 직접 이동해야 해요. 데스크탑에선 좌측
        패널에서 바로 선택할 수 있습니다.
      </p>

      <section className="mt-20">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          도메인별 토픽
        </h2>
        <div className="flex flex-col gap-10">
          {domainOrder.map((d) => {
            const list = getTopicsByDomain(d);
            if (list.length === 0) return null;
            return (
              <section key={d}>
                <header className="mb-3 flex items-baseline justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {domainLabel[d]}
                  </h3>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {list.length} 토픽
                  </span>
                </header>
                <ul className="flex flex-col">
                  {list.map((t) => (
                    <li
                      key={t.slug}
                      className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-900"
                    >
                      <Link
                        href={`/topics/${t.slug}`}
                        className="flex items-baseline justify-between gap-4 py-3 transition hover:text-zinc-900 dark:hover:text-zinc-50"
                      >
                        <span className="text-base font-medium text-zinc-700 dark:text-zinc-300">
                          {t.title}
                          {t.hasVisualization && (
                            <span
                              className="ml-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                              title="인터랙티브 시각화 포함"
                            >
                              ◆ 시각화
                            </span>
                          )}
                        </span>
                        <span className="hidden truncate text-sm text-zinc-500 sm:inline dark:text-zinc-400">
                          {t.description.slice(0, 60)}
                          {t.description.length > 60 ? "…" : ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
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
