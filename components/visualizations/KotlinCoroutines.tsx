"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type ThreadCell = "main" | "io" | "suspended" | "idle";

type StepDef = {
  id: string;
  label: string;
  timeline: { main: ThreadCell[]; io: ThreadCell[] };
  description: string;
};

// 12 시간 단위
const SLOTS = 12;

const STEPS: StepDef[] = [
  {
    id: "blocking",
    label: "Blocking (안 좋음)",
    timeline: {
      main: ["main", "main", "main", "main", "main", "main", "main", "main", "main", "main", "main", "main"],
      io: ["idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"],
    },
    description:
      "전통적 동기 호출: 메인 스레드가 네트워크 응답을 기다리는 동안 12 시간 단위 내내 블록. UI 멈춤 = ANR 위험.",
  },
  {
    id: "launch",
    label: "코루틴 시작",
    timeline: {
      main: ["main", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"],
      io: ["idle", "io", "io", "io", "io", "io", "io", "io", "io", "io", "io", "idle"],
    },
    description:
      "viewModelScope.launch { withContext(Dispatchers.IO) { ... } } 로 IO 작업 위임. 메인은 즉시 풀려서 UI 응답성 유지.",
  },
  {
    id: "suspend",
    label: "suspend = 중단 (블록 아님)",
    timeline: {
      main: ["main", "idle", "idle", "idle", "idle", "main", "idle", "idle", "idle", "idle", "main", "main"],
      io: ["idle", "io", "io", "io", "io", "suspended", "io", "io", "io", "io", "idle", "idle"],
    },
    description:
      "delay나 다른 suspend 함수를 만나면 코루틴이 일시 중단. 스레드는 풀려서 다른 작업 가능 — 스레드를 블록하지 않는 게 핵심.",
  },
  {
    id: "resume",
    label: "resume + 결과 전달",
    timeline: {
      main: ["main", "idle", "idle", "idle", "idle", "main", "idle", "idle", "idle", "idle", "main", "main"],
      io: ["idle", "io", "io", "io", "io", "suspended", "io", "io", "io", "io", "idle", "idle"],
    },
    description:
      "IO 작업 완료 → 메인 스레드로 복귀해 UI 업데이트. structured concurrency 덕분에 viewModelScope가 끝나면 자식 작업 자동 취소 — 누수 X.",
  },
];

const COLORS: Record<ThreadCell, string> = {
  main: "bg-sky-500 dark:bg-sky-600",
  io: "bg-emerald-500 dark:bg-emerald-600",
  suspended: "bg-amber-400 dark:bg-amber-500",
  idle: "bg-zinc-100 dark:bg-zinc-800",
};

const LABELS: Record<ThreadCell, string> = {
  main: "메인 작업",
  io: "IO 작업",
  suspended: "suspend",
  idle: "유휴",
};

export function KotlinCoroutines({ slug }: { slug: string }) {
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

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Lane title="Main thread (UI)" cells={step.timeline.main} />
        <Lane title="IO thread pool" cells={step.timeline.io} />
        <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
          <Legend color="bg-sky-500" label="메인 작업" />
          <Legend color="bg-emerald-500" label="IO 작업" />
          <Legend color="bg-amber-400" label="suspend 중" />
          <Legend color="bg-zinc-300 dark:bg-zinc-700" label="유휴" />
        </div>
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

function Lane({ title, cells }: { title: string; cells: ThreadCell[] }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        {title}
      </div>
      <div className="flex h-8 gap-0.5 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-950">
        {cells.map((c, i) => (
          <div
            key={i}
            className={`flex flex-1 items-center justify-center rounded text-[8px] font-bold text-white ${COLORS[c]}`}
            title={LABELS[c]}
          />
        ))}
      </div>
    </div>
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
