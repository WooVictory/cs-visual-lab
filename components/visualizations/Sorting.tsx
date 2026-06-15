"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type StepDef = {
  id: string;
  label: string;
  array: number[];
  compare: [number, number] | null;
  swapped: boolean;
  sortedFrom: number; // 끝에서부터 sorted인 인덱스
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    array: [3, 1, 4, 2],
    compare: null,
    swapped: false,
    sortedFrom: 4,
    description:
      "버블 정렬: 인접한 두 원소를 비교해서 큰 것이 뒤로 가도록 swap. 한 번의 패스가 끝나면 가장 큰 원소가 끝으로 확정됩니다.",
  },
  {
    id: "p1-01",
    label: "비교 0-1",
    array: [1, 3, 4, 2],
    compare: [0, 1],
    swapped: true,
    sortedFrom: 4,
    description:
      "인덱스 0과 1을 비교: 3 > 1이므로 swap. 결과 [1, 3, 4, 2]. 더 큰 값이 뒤로 흘러갑니다 (bubble up).",
  },
  {
    id: "p1-12",
    label: "비교 1-2",
    array: [1, 3, 4, 2],
    compare: [1, 2],
    swapped: false,
    sortedFrom: 4,
    description:
      "인덱스 1과 2를 비교: 3 < 4이므로 swap하지 않음. 더 큰 값(4)이 자연스럽게 뒤로 이동.",
  },
  {
    id: "p1-23",
    label: "비교 2-3",
    array: [1, 3, 2, 4],
    compare: [2, 3],
    swapped: true,
    sortedFrom: 3,
    description:
      "인덱스 2와 3을 비교: 4 > 2이므로 swap → [1, 3, 2, 4]. 첫 패스 완료, 가장 큰 원소(4)가 끝에 확정됩니다.",
  },
  {
    id: "p2-01",
    label: "비교 0-1",
    array: [1, 3, 2, 4],
    compare: [0, 1],
    swapped: false,
    sortedFrom: 3,
    description:
      "두 번째 패스 시작. 인덱스 0과 1을 비교: 1 < 3, swap 없음.",
  },
  {
    id: "p2-12",
    label: "비교 1-2",
    array: [1, 2, 3, 4],
    compare: [1, 2],
    swapped: true,
    sortedFrom: 2,
    description:
      "인덱스 1과 2를 비교: 3 > 2이므로 swap → [1, 2, 3, 4]. 이제 두 번째로 큰 원소(3)도 자리 확정.",
  },
  {
    id: "done",
    label: "완료",
    array: [1, 2, 3, 4],
    compare: null,
    swapped: false,
    sortedFrom: 0,
    description:
      "정렬 완료 — 평균/최악 O(n²). 작은 데이터엔 OK지만 실무에선 퀵 정렬(평균 O(n log n))이나 팀소트(병합+삽입)를 씁니다.",
  },
];

const MAX = 5;

export function Sorting({ slug }: { slug: string }) {
  const { stepIndex, setStepIndex, canPrev, canNext, prev, next, reset } =
    useStepState(slug, STEPS.length);
  const step = STEPS[stepIndex];

  return (
    <VizContainer>
      <Stepper
        steps={STEPS}
        currentIndex={stepIndex}
        onSelect={setStepIndex}
      />

      <div className="flex h-44 items-end justify-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        {step.array.map((v, i) => {
          const isCompare = step.compare && (i === step.compare[0] || i === step.compare[1]);
          const isSorted = i >= step.sortedFrom;
          const colorClass = isSorted
            ? "bg-emerald-500 dark:bg-emerald-600"
            : isCompare
            ? step.swapped
              ? "bg-rose-500 dark:bg-rose-600"
              : "bg-sky-500 dark:bg-sky-600"
            : "bg-zinc-400 dark:bg-zinc-600";
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-2"
              style={{ width: 64 }}
            >
              <div
                className={`flex w-full items-end justify-center rounded-md transition-all ${colorClass}`}
                style={{ height: `${(v / MAX) * 100}%`, minHeight: 24 }}
              >
                <span className="pb-1 font-mono text-sm font-bold text-white">
                  {v}
                </span>
              </div>
              <div
                className={`font-mono text-[10px] ${
                  isCompare
                    ? "font-semibold text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                [{i}]
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 text-xs">
        <Legend color="bg-sky-500" label="비교" />
        <Legend color="bg-rose-500" label="swap" />
        <Legend color="bg-emerald-500" label="정렬 완료" />
      </div>

      <StepDescription>{step.description}</StepDescription>

      <StepControls
        canPrev={canPrev}
        canNext={canNext}
        onPrev={prev}
        onNext={next}
        onReset={reset}
      />
    </VizContainer>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded-sm ${color}`} />
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
    </div>
  );
}
