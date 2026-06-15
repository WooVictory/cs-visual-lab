"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

// 3 processes, all arrive at T=0
// P1 burst=8, P2 burst=2, P3 burst=4 → total 14
// FCFS:  P1 P1 P1 P1 P1 P1 P1 P1 P2 P2 P3 P3 P3 P3
// RR(2): P1 P1 P2 P2 P3 P3 P1 P1 P3 P3 P1 P1 P1 P1

const FCFS = [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3];
const RR = [1, 1, 2, 2, 3, 3, 1, 1, 3, 3, 1, 1, 1, 1];

const COLORS: Record<number, string> = {
  1: "bg-rose-500 dark:bg-rose-600",
  2: "bg-sky-500 dark:bg-sky-600",
  3: "bg-emerald-500 dark:bg-emerald-600",
};

const PROCESSES = [
  { id: 1, burst: 8 },
  { id: 2, burst: 2 },
  { id: 3, burst: 4 },
];

type StepDef = {
  id: string;
  label: string;
  revealed: number;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    revealed: 0,
    description:
      "3개 프로세스 P1(burst=8), P2(burst=2), P3(burst=4)가 동시 도착. FCFS와 Round Robin(quantum=2)의 실행 순서를 비교합니다.",
  },
  {
    id: "t0-3",
    label: "T = 0~3",
    revealed: 4,
    description:
      "FCFS는 P1을 통째로 실행 시작 — 도착 순서대로. RR은 quantum=2 단위로 P1 → P2를 차례로 실행. P2는 RR에선 일찍 완료됩니다.",
  },
  {
    id: "t4-7",
    label: "T = 4~7",
    revealed: 8,
    description:
      "FCFS는 여전히 P1 진행 중 (T=8까지). RR은 P3 첫 quantum 실행 후 P1으로 돌아가 — 모든 프로세스가 일찍부터 일부 진행됩니다.",
  },
  {
    id: "t8-11",
    label: "T = 8~11",
    revealed: 12,
    description:
      "FCFS: P1 완료 후 P2, P3 차례 실행. RR: P3가 두 번째 quantum, 이후 P1으로.",
  },
  {
    id: "done",
    label: "완료",
    revealed: 14,
    description:
      "FCFS 평균 대기 시간: (0+8+10)/3 ≈ 6. RR 평균 대기 시간: 더 균등하게 분포. RR은 응답성↑ 하지만 컨텍스트 스위치 비용↑. SJF는 평균 대기 최소지만 burst 시간 예측 필요.",
  },
];

export function CpuScheduling({ slug }: { slug: string }) {
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

      <Legend />

      <Gantt
        title="FCFS"
        subtitle="도착 순서대로 — convoy effect"
        pattern={FCFS}
        revealed={step.revealed}
      />
      <Gantt
        title="Round Robin (quantum = 2)"
        subtitle="순환 quantum — 균등한 응답성"
        pattern={RR}
        revealed={step.revealed}
      />

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

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
      {PROCESSES.map((p) => (
        <div key={p.id} className="flex items-center gap-2">
          <span
            className={`inline-block h-3 w-3 rounded-sm ${COLORS[p.id]}`}
          />
          <span className="font-mono text-zinc-600 dark:text-zinc-400">
            P{p.id} (burst {p.burst})
          </span>
        </div>
      ))}
    </div>
  );
}

function Gantt({
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
          T = {revealed}
        </span>
      </div>
      <div className="flex h-10 gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        {pattern.map((pid, i) => {
          const isVisible = i < revealed;
          return (
            <div
              key={i}
              className={`flex flex-1 items-center justify-center rounded text-[10px] font-mono font-bold text-white transition-all duration-300 ${
                isVisible
                  ? COLORS[pid]
                  : "bg-zinc-100 text-transparent dark:bg-zinc-800"
              }`}
              title={`T = ${i}: P${pid}`}
            >
              {isVisible ? pid : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}
