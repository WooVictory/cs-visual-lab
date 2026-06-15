import { TopicCard } from "@/components/TopicCard";
import {
  domainLabel,
  domainOrder,
  getTopicsByDomain,
  topics,
} from "@/lib/topics";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:py-24">
        <header className="mb-12 flex flex-col gap-3">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            CS Visual Lab
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            보면서 이해하고, 설명하면서 검증하는 CS 학습
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            네트워크 · OS · 데이터베이스 · 알고리즘 · 디자인 패턴 · 언어 —
            기술 면접 단골 주제 {topics.length}개를 시각화와 핵심 개념으로
            학습하세요.
          </p>
        </header>

        <nav className="mb-12 flex flex-wrap gap-2">
          {domainOrder.map((d) => {
            const count = getTopicsByDomain(d).length;
            if (count === 0) return null;
            return (
              <a
                key={d}
                href={`#${d}`}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
              >
                {domainLabel[d]} · {count}
              </a>
            );
          })}
        </nav>

        <div className="flex flex-col gap-16">
          {domainOrder.map((d) => {
            const list = getTopicsByDomain(d);
            if (list.length === 0) return null;
            return (
              <section key={d} id={d} className="scroll-mt-8">
                <header className="mb-5 flex items-baseline justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {domainLabel[d]}
                  </h2>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {list.length} 토픽
                  </span>
                </header>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((topic) => (
                    <TopicCard key={topic.slug} topic={topic} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
