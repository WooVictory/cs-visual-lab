import { TopicCard } from "@/components/TopicCard";
import { topics } from "@/lib/topics";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-24">
        <header className="mb-12 flex flex-col gap-3">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            CS Visual Lab
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            보면서 이해하고, 설명하면서 검증하는 CS 학습
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            네트워크 개념을 시각화로 직관적으로 파악하고, AI 면접관과 대화하며
            본인이 정말 이해했는지 확인하세요.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </section>
      </main>
    </div>
  );
}
