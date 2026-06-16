"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type NodeData = {
  id: string;
  label: string;
  x: number;
  y: number;
  alive: boolean;
};

type StepDef = {
  id: string;
  label: string;
  nodes: NodeData[];
  edges: Array<{ from: string; to: string; type: "ref" | "leak" }>;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "normal",
    label: "정상 — Activity 살아있음",
    nodes: [
      { id: "static", label: "static field\n(MyApp.cachedActivity)", x: 60, y: 60, alive: true },
      { id: "activity", label: "Activity", x: 250, y: 60, alive: true },
      { id: "context", label: "Context", x: 250, y: 180, alive: true },
      { id: "view", label: "View Hierarchy", x: 420, y: 60, alive: true },
    ],
    edges: [
      { from: "static", to: "activity", type: "ref" },
      { from: "activity", to: "context", type: "ref" },
      { from: "activity", to: "view", type: "ref" },
    ],
    description:
      "정상 상황: static 필드가 Activity 참조 중. Activity는 View와 Context를 가지고 있고, 사용자가 화면을 보고 있는 상태.",
  },
  {
    id: "finish",
    label: "Activity finish() 호출",
    nodes: [
      { id: "static", label: "static field", x: 60, y: 60, alive: true },
      { id: "activity", label: "Activity\n(finish됨)", x: 250, y: 60, alive: false },
      { id: "context", label: "Context", x: 250, y: 180, alive: false },
      { id: "view", label: "View Hierarchy", x: 420, y: 60, alive: false },
    ],
    edges: [
      { from: "static", to: "activity", type: "leak" },
      { from: "activity", to: "context", type: "ref" },
      { from: "activity", to: "view", type: "ref" },
    ],
    description:
      "Activity.finish() 또는 사용자가 백 버튼 → Activity는 onDestroy. **하지만 static 필드가 여전히 참조 중!** GC가 Activity를 해제 못함.",
  },
  {
    id: "leak",
    label: "메모리 누수 발생",
    nodes: [
      { id: "static", label: "static field 🚨", x: 60, y: 60, alive: true },
      { id: "activity", label: "Activity\n(좀비)", x: 250, y: 60, alive: false },
      { id: "context", label: "Context\n(살아있음)", x: 250, y: 180, alive: false },
      { id: "view", label: "View Hierarchy\n(살아있음)", x: 420, y: 60, alive: false },
    ],
    edges: [
      { from: "static", to: "activity", type: "leak" },
      { from: "activity", to: "context", type: "ref" },
      { from: "activity", to: "view", type: "ref" },
    ],
    description:
      "결과: Activity 객체는 destroyed지만 GC 대상 X. 참조하는 Context, View 트리, ViewModel까지 모두 살아있음 — 메모리 영구 점유. 회전 반복하면 누적되어 OOM.",
  },
  {
    id: "fix",
    label: "수정 — 약한 참조 / 해제",
    nodes: [
      { id: "static", label: "static field\n(null)", x: 60, y: 60, alive: true },
      { id: "activity", label: "Activity", x: 250, y: 60, alive: false },
      { id: "context", label: "Context", x: 250, y: 180, alive: false },
      { id: "view", label: "View Hierarchy", x: 420, y: 60, alive: false },
    ],
    edges: [],
    description:
      "수정 방법: (1) static 참조 onDestroy에서 null 처리. (2) WeakReference 사용. (3) Application Context만 보관. (4) ApplicationScope ViewModel로 분리. LeakCanary가 이런 사례를 자동 탐지해 알려줌.",
  },
];

export function MemoryLeak({ slug }: { slug: string }) {
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

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <svg viewBox="0 0 540 240" className="min-w-[480px]" aria-hidden>
          {/* Edges */}
          {step.edges.map((e, i) => {
            const from = step.nodes.find((n) => n.id === e.from);
            const to = step.nodes.find((n) => n.id === e.to);
            if (!from || !to) return null;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = Math.hypot(dx, dy);
            const ux = dx / len;
            const uy = dy / len;
            const PAD = 38;
            const x1 = from.x + ux * PAD;
            const y1 = from.y + uy * PAD;
            const x2 = to.x - ux * PAD;
            const y2 = to.y - uy * PAD;
            const isLeak = e.type === "leak";
            return (
              <g
                key={i}
                className={
                  isLeak
                    ? "stroke-rose-600 dark:stroke-rose-400"
                    : "stroke-zinc-500 dark:stroke-zinc-400"
                }
              >
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth={isLeak ? 2.5 : 1.5}
                  strokeDasharray={isLeak ? "0" : "0"}
                />
                <polygon
                  points={`${x2},${y2} ${x2 - ux * 8 - uy * 5},${y2 - uy * 8 + ux * 5} ${x2 - ux * 8 + uy * 5},${y2 - uy * 8 - ux * 5}`}
                  className={
                    isLeak
                      ? "fill-rose-600 dark:fill-rose-400"
                      : "fill-zinc-500 dark:fill-zinc-400"
                  }
                  stroke="none"
                />
              </g>
            );
          })}

          {/* Nodes */}
          {step.nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x - 70}, ${n.y - 30})`}>
              <rect
                width={140}
                height={60}
                rx={8}
                className={
                  n.alive
                    ? "fill-white stroke-zinc-700 dark:fill-zinc-950 dark:stroke-zinc-300"
                    : "fill-rose-50 stroke-rose-500 dark:fill-rose-950 dark:stroke-rose-400"
                }
                strokeWidth={2}
                strokeDasharray={n.alive ? "0" : "0"}
              />
              <text
                x={70}
                y={28}
                textAnchor="middle"
                className={`text-[11px] font-bold ${
                  n.alive
                    ? "fill-zinc-900 dark:fill-zinc-50"
                    : "fill-rose-700 dark:fill-rose-300"
                }`}
              >
                {n.label.split("\n")[0]}
              </text>
              {n.label.includes("\n") && (
                <text
                  x={70}
                  y={44}
                  textAnchor="middle"
                  className={`text-[9px] ${
                    n.alive
                      ? "fill-zinc-500 dark:fill-zinc-400"
                      : "fill-rose-600 dark:fill-rose-400"
                  }`}
                >
                  {n.label.split("\n")[1]}
                </text>
              )}
            </g>
          ))}
        </svg>
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
