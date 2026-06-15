import type { TopicSidebarContent } from "@/lib/topic-content";

export function TopicSidebar({ content }: { content: TopicSidebarContent }) {
  return (
    <aside className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          핵심 개념
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {content.keyConcepts.map((c) => (
            <li
              key={c.term}
              className="rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
            >
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {c.term}
              </div>
              <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                {c.definition}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          면접 단골 질문
        </h2>
        <ol className="mt-3 flex flex-col gap-2">
          {content.interviewQuestions.map((q, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300"
            >
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
                Q{i + 1}.
              </span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="rounded-lg bg-zinc-50 p-3 text-[11px] leading-5 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
        다음 업데이트에서 이 자리에 AI 면접관이 들어옵니다 — 시각화 상태를
        인지하고 꼬리질문을 하는 형태로.
      </p>
    </aside>
  );
}
