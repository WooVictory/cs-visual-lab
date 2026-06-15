"use client";

import { useEffect, useState } from "react";
import { markCompleted, markViewed } from "@/lib/progress";

type Mode = "h1" | "h2";

type StepDef = {
  id: string;
  label: string;
  cellsRevealed: number;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "idle",
    label: "초기 상태",
    cellsRevealed: 0,
    description:
      "3개의 HTTP 요청을 한 연결로 동시에 보내고 싶습니다. HTTP/1.1과 HTTP/2가 같은 9개의 프레임을 어떻게 다르게 처리하는지 단계별로 비교합니다.",
  },
  {
    id: "t1",
    label: "T = 1",
    cellsRevealed: 3,
    description:
      "HTTP/1.1은 Stream 1의 첫 3 프레임만 전송 — Stream 2, 3은 대기 중 (Head-of-Line Blocking). HTTP/2는 같은 시간에 세 stream의 첫 프레임을 각각 전송 — 모두 동시 진행.",
  },
  {
    id: "t2",
    label: "T = 2",
    cellsRevealed: 6,
    description:
      "HTTP/1.1은 Stream 1을 완료한 뒤에야 Stream 2 시작. HTTP/2는 이미 모든 stream이 진행 중이며 곧 완료를 앞두고 있습니다.",
  },
  {
    id: "t3",
    label: "T = 3",
    cellsRevealed: 9,
    description:
      "HTTP/2는 멀티플렉싱 덕분에 같은 시점에 세 응답이 거의 동시에 도착. HTTP/1.1은 아직 Stream 3을 시작도 못한 상태로 한참 더 기다려야 합니다. 동일한 양의 데이터, 완전히 다른 latency.",
  },
];

const H1_PATTERN = [0, 0, 0, 1, 1, 1, 2, 2, 2];
const H2_PATTERN = [0, 1, 2, 0, 1, 2, 0, 1, 2];

const STREAM_COLORS = [
  "bg-rose-500 dark:bg-rose-500",
  "bg-sky-500 dark:bg-sky-500",
  "bg-emerald-500 dark:bg-emerald-500",
];

const STREAM_LABELS = ["GET /index.html", "GET /style.css", "GET /app.js"];

export function Http2Multiplexing({ slug }: { slug: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  useEffect(() => {
    markViewed(slug);
  }, [slug]);

  useEffect(() => {
    if (stepIndex === STEPS.length - 1) {
      markCompleted(slug);
    }
  }, [stepIndex, slug]);

  const canPrev = stepIndex > 0;
  const canNext = stepIndex < STEPS.length - 1;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <Stepper currentIndex={stepIndex} onSelect={setStepIndex} />

      <Legend />

      <div className="flex flex-col gap-5">
        <Lane
          title="HTTP/1.1"
          subtitle="순차 전송 — 한 요청 끝나야 다음 시작"
          pattern={H1_PATTERN}
          revealed={step.cellsRevealed}
        />
        <Lane
          title="HTTP/2"
          subtitle="멀티플렉싱 — 프레임이 인터리브됨"
          pattern={H2_PATTERN}
          revealed={step.cellsRevealed}
        />
      </div>

      <p className="rounded-lg bg-zinc-50 p-5 text-[15px] leading-7 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        {step.description}
      </p>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStepIndex(0)}
          className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          처음으로
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
            className="rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() =>
              setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))
            }
            disabled={!canNext}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {canNext ? "다음 단계" : "끝"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stepper({
  currentIndex,
  onSelect,
}: {
  currentIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <ol className="flex items-center justify-between gap-2">
      {STEPS.map((s, i) => {
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
            {i < STEPS.length - 1 && (
              <span className="hidden h-px flex-1 bg-zinc-200 sm:block dark:bg-zinc-800" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
      {STREAM_LABELS.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className={`inline-block h-3 w-3 rounded-sm ${STREAM_COLORS[i]}`}
          />
          <span className="font-mono text-zinc-600 dark:text-zinc-400">
            Stream {i + 1}: {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Lane({
  title,
  subtitle,
  pattern,
  revealed,
}: {
  title: string;
  subtitle: string;
  pattern: number[];
  revealed: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div>
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </span>
          <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
            {subtitle}
          </span>
        </div>
        <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          {revealed} / {pattern.length} frames
        </span>
      </div>
      <div className="flex h-12 gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 dark:border-zinc-800 dark:bg-zinc-900">
        {pattern.map((streamIdx, cellIdx) => {
          const isVisible = cellIdx < revealed;
          return (
            <div
              key={cellIdx}
              className={`flex flex-1 items-center justify-center rounded text-[10px] font-mono font-bold text-white transition-all duration-300 ${
                isVisible
                  ? STREAM_COLORS[streamIdx]
                  : "bg-zinc-100 text-transparent dark:bg-zinc-800"
              }`}
              title={`Frame ${cellIdx + 1}: Stream ${streamIdx + 1}`}
            >
              {isVisible ? streamIdx + 1 : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}
