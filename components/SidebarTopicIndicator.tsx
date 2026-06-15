"use client";

import { useEffect, useState } from "react";
import { getTopicProgress } from "@/lib/progress";

type State = "none" | "viewed" | "completed";

export function SidebarTopicIndicator({ slug }: { slug: string }) {
  const [state, setState] = useState<State>("none");

  useEffect(() => {
    const update = () => {
      const p = getTopicProgress(slug);
      setState(p.completed ? "completed" : p.viewed ? "viewed" : "none");
    };
    update();
    window.addEventListener("cs-progress-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cs-progress-updated", update);
      window.removeEventListener("storage", update);
    };
  }, [slug]);

  if (state === "completed") {
    return (
      <span
        className="text-emerald-500 dark:text-emerald-400"
        aria-label="완료"
      >
        ✓
      </span>
    );
  }
  if (state === "viewed") {
    return (
      <span
        className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500"
        aria-label="학습 중"
      />
    );
  }
  return null;
}
