import type { TopicSidebarContent } from "@/lib/topic-content";

export function TopicContent({ content }: { content: TopicSidebarContent }) {
  return (
    <div className="flex flex-col gap-14">
      <section>
        <h2 className="mb-5 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          핵심 개념
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.keyConcepts.map((c) => (
            <div
              key={c.term}
              className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {c.term}
              </div>
              <p className="mt-2 text-[15px] leading-7 text-zinc-600 dark:text-zinc-400">
                {c.definition}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          면접 단골 질문
        </h2>
        <ol className="flex flex-col gap-3">
          {content.interviewQuestions.map((q, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <span className="shrink-0 font-mono text-base font-medium text-zinc-400 dark:text-zinc-500">
                Q{i + 1}.
              </span>
              <span className="text-[15px] leading-7 text-zinc-700 dark:text-zinc-300">
                {q}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
