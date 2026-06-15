"use client";

import { useEffect, useState } from "react";
import { getTopicProgress, type TopicProgress } from "@/lib/progress";

export function ProgressBadge({ slug }: { slug: string }) {
  const [progress, setProgress] = useState<TopicProgress | null>(null);

  useEffect(() => {
    const update = () => setProgress(getTopicProgress(slug));
    update();

    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith("cs-visual-lab")) update();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("cs-progress-updated", update);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cs-progress-updated", update);
    };
  }, [slug]);

  if (!progress || (!progress.viewed && !progress.completed)) {
    return null;
  }

  if (progress.completed) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <span aria-hidden>✓</span> 완료
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
      학습 중
    </span>
  );
}
