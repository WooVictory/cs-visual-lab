"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Edge = {
  from: string; // P1, P2, R1, R2
  to: string;
  type: "hold" | "request"; // Resource → Process (hold), Process → Resource (request)
};

type StepDef = {
  id: string;
  label: string;
  edges: Edge[];
  deadlock: boolean;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    edges: [],
    deadlock: false,
    description:
      "프로세스 P1, P2가 자원 R1, R2를 사용하려 합니다. 자원 할당 그래프(Resource Allocation Graph)에서 데드락이 생기는 4가지 조건을 단계별로 확인합니다.",
  },
  {
    id: "p1-hold-r1",
    label: "P1 holds R1",
    edges: [{ from: "R1", to: "P1", type: "hold" }],
    deadlock: false,
    description:
      "P1이 R1을 획득. 자원에서 프로세스 방향 화살표 (R1 → P1)는 '소유 중'. 1번 조건: 상호 배제(Mutual Exclusion) 만족 — R1은 동시에 한 프로세스만 사용.",
  },
  {
    id: "p2-hold-r2",
    label: "P2 holds R2",
    edges: [
      { from: "R1", to: "P1", type: "hold" },
      { from: "R2", to: "P2", type: "hold" },
    ],
    deadlock: false,
    description:
      "P2가 R2 획득. 두 프로세스 모두 하나씩 자원을 갖고 있는 상태.",
  },
  {
    id: "p1-req-r2",
    label: "P1 → R2 요청",
    edges: [
      { from: "R1", to: "P1", type: "hold" },
      { from: "R2", to: "P2", type: "hold" },
      { from: "P1", to: "R2", type: "request" },
    ],
    deadlock: false,
    description:
      "P1이 R2를 추가로 요청 (R1은 계속 보유). 2번 조건: 점유와 대기(Hold and Wait) 만족. P2가 R2를 놓아주길 기다리는 상태로 블록.",
  },
  {
    id: "p2-req-r1",
    label: "P2 → R1 요청 (사이클)",
    edges: [
      { from: "R1", to: "P1", type: "hold" },
      { from: "R2", to: "P2", type: "hold" },
      { from: "P1", to: "R2", type: "request" },
      { from: "P2", to: "R1", type: "request" },
    ],
    deadlock: true,
    description:
      "P2도 R1을 요청. 이제 P1↔R2↔P2↔R1↔P1 사이클이 생김. 3번 조건: 비선점(자원을 강제로 뺏을 수 없음), 4번 조건: 순환 대기 — 4조건 모두 만족 = 데드락. 영원히 진행 불가.",
  },
];

const POSITIONS: Record<string, { x: number; y: number }> = {
  P1: { x: 80, y: 80 },
  P2: { x: 80, y: 200 },
  R1: { x: 280, y: 80 },
  R2: { x: 280, y: 200 },
};

export function Deadlock({ slug }: { slug: string }) {
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
        <svg viewBox="0 0 360 280" className="w-full" aria-hidden>
          {/* Edges */}
          {step.edges.map((e, i) => (
            <ArrowLine
              key={`${e.from}-${e.to}-${i}`}
              from={POSITIONS[e.from]}
              to={POSITIONS[e.to]}
              type={e.type}
              highlight={step.deadlock}
            />
          ))}

          {/* Processes — circles */}
          {["P1", "P2"].map((id) => {
            const p = POSITIONS[id];
            return (
              <g key={id} transform={`translate(${p.x}, ${p.y})`}>
                <circle
                  r={30}
                  className={
                    step.deadlock
                      ? "fill-rose-500 stroke-rose-700 dark:fill-rose-600 dark:stroke-rose-300"
                      : "fill-white stroke-zinc-700 dark:fill-zinc-950 dark:stroke-zinc-300"
                  }
                  strokeWidth={2}
                />
                <text
                  textAnchor="middle"
                  y={5}
                  className={`text-sm font-bold ${
                    step.deadlock
                      ? "fill-white"
                      : "fill-zinc-900 dark:fill-zinc-50"
                  }`}
                >
                  {id}
                </text>
              </g>
            );
          })}

          {/* Resources — squares */}
          {["R1", "R2"].map((id) => {
            const r = POSITIONS[id];
            return (
              <g key={id} transform={`translate(${r.x - 30}, ${r.y - 30})`}>
                <rect
                  width={60}
                  height={60}
                  rx={4}
                  className={
                    step.deadlock
                      ? "fill-rose-500 stroke-rose-700 dark:fill-rose-600 dark:stroke-rose-300"
                      : "fill-white stroke-zinc-700 dark:fill-zinc-950 dark:stroke-zinc-300"
                  }
                  strokeWidth={2}
                />
                <text
                  x={30}
                  y={36}
                  textAnchor="middle"
                  className={`text-sm font-bold ${
                    step.deadlock
                      ? "fill-white"
                      : "fill-zinc-900 dark:fill-zinc-50"
                  }`}
                >
                  {id}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="mt-3 flex gap-4 text-xs">
          <LegendItem color="text-zinc-700" label="실선 ← : 보유" />
          <LegendItem color="text-zinc-700" label="점선 → : 요청 대기" />
          {step.deadlock && (
            <LegendItem
              color="text-rose-600 dark:text-rose-400"
              label="🚨 DEADLOCK"
              bold
            />
          )}
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

function ArrowLine({
  from,
  to,
  type,
  highlight,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  type: "hold" | "request";
  highlight: boolean;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const PAD = 32;
  const x1 = from.x + ux * PAD;
  const y1 = from.y + uy * PAD;
  const x2 = to.x - ux * PAD;
  const y2 = to.y - uy * PAD;
  return (
    <g
      className={
        highlight
          ? "stroke-rose-600 dark:stroke-rose-400"
          : "stroke-zinc-700 dark:stroke-zinc-300"
      }
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth={2}
        strokeDasharray={type === "request" ? "4 4" : "0"}
      />
      {/* Arrowhead */}
      <polygon
        points={`${x2},${y2} ${x2 - ux * 8 - uy * 5},${y2 - uy * 8 + ux * 5} ${x2 - ux * 8 + uy * 5},${y2 - uy * 8 - ux * 5}`}
        className={
          highlight
            ? "fill-rose-600 dark:fill-rose-400"
            : "fill-zinc-700 dark:fill-zinc-300"
        }
        stroke="none"
      />
    </g>
  );
}

function LegendItem({
  color,
  label,
  bold,
}: {
  color: string;
  label: string;
  bold?: boolean;
}) {
  return (
    <span
      className={`${color} ${bold ? "font-semibold" : ""} dark:opacity-90`}
    >
      {label}
    </span>
  );
}
