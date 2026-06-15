"use client";

import { useEffect, useState } from "react";
import { markCompleted, markViewed } from "@/lib/progress";

export type StepBase = {
  id: string;
  label: string;
};

export function useStepState(slug: string, totalSteps: number) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    markViewed(slug);
  }, [slug]);

  useEffect(() => {
    if (stepIndex === totalSteps - 1) {
      markCompleted(slug);
    }
  }, [stepIndex, totalSteps, slug]);

  return {
    stepIndex,
    setStepIndex,
    canPrev: stepIndex > 0,
    canNext: stepIndex < totalSteps - 1,
    prev: () => setStepIndex((i) => Math.max(0, i - 1)),
    next: () => setStepIndex((i) => Math.min(totalSteps - 1, i + 1)),
    reset: () => setStepIndex(0),
  };
}

export function VizContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      {children}
    </div>
  );
}

export function Stepper<T extends StepBase>({
  steps,
  currentIndex,
  onSelect,
}: {
  steps: T[];
  currentIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <ol className="flex items-center justify-between gap-2">
      {steps.map((s, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(i)}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition ${
                isDone
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : isCurrent
                  ? "border-zinc-900 bg-white text-zinc-900 dark:border-zinc-100 dark:bg-zinc-950 dark:text-zinc-100"
                  : "border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-600"
              }`}
              aria-label={`단계 ${i + 1}: ${s.label}`}
            >
              {i + 1}
            </button>
            <span
              className={`hidden truncate text-xs sm:inline ${
                isCurrent
                  ? "font-medium text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span className="hidden h-px flex-1 bg-zinc-200 sm:block dark:bg-zinc-800" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function StepDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-zinc-50 p-5 text-[15px] leading-7 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
      {children}
    </p>
  );
}

export function StepControls({
  canPrev,
  canNext,
  onPrev,
  onNext,
  onReset,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onReset}
        className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        처음으로
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {canNext ? "다음 단계" : "끝"}
        </button>
      </div>
    </div>
  );
}
