import Link from "next/link";
import { domainLabel, type Topic } from "@/lib/topics";
import { ProgressBadge } from "@/components/ProgressBadge";

export function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link href={`/topics/${topic.slug}`} className="block h-full">
      <div className="group relative flex h-full flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-900 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-100">
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {domainLabel[topic.domain]}
          </span>
          {topic.hasVisualization ? (
            <ProgressBadge slug={topic.slug} />
          ) : (
            <span className="rounded-full bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              개념 자료
            </span>
          )}
        </div>

        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {topic.title}
        </h2>

        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {topic.description}
        </p>

        <div className="mt-auto pt-3 text-xs text-zinc-400 dark:text-zinc-500">
          {topic.hasVisualization ? "학습 시작 →" : "개념 보기 →"}
        </div>
      </div>
    </Link>
  );
}
