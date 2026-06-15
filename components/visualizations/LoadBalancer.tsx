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
  activeBackend: number | null; // 0, 1, 2
  loads: [number, number, number];
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    activeBackend: null,
    loads: [0, 0, 0],
    description:
      "클라이언트 요청이 로드밸런서(LB)로 들어오고, LB가 3개 백엔드 중 하나로 분배합니다. Round Robin 방식: 순서대로 돌아가며 분배.",
  },
  {
    id: "r1",
    label: "Req 1",
    activeBackend: 0,
    loads: [1, 0, 0],
    description:
      "첫 요청: LB가 Backend A로 라우팅. 다음 요청은 B를 받게 될 차례.",
  },
  {
    id: "r2",
    label: "Req 2",
    activeBackend: 1,
    loads: [1, 1, 0],
    description: "두 번째 요청: Backend B로. 라운드 진행.",
  },
  {
    id: "r3",
    label: "Req 3",
    activeBackend: 2,
    loads: [1, 1, 1],
    description: "세 번째 요청: Backend C로. 모든 백엔드가 1개씩 처리 — 균등 분배.",
  },
  {
    id: "r4",
    label: "Req 4 (순환)",
    activeBackend: 0,
    loads: [2, 1, 1],
    description:
      "네 번째 요청: 다시 A로 — 순환. Round Robin은 단순하지만 백엔드 응답 시간이 다르면 부하 불균형 발생 가능. 그래서 Least Connections / Weighted RR 같은 대안이 있습니다.",
  },
];

export function LoadBalancer({ slug }: { slug: string }) {
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
        <svg viewBox="0 0 600 240" className="w-full" aria-hidden>
          {/* Client */}
          <Box x={20} y={90} w={90} h={60} label="Client" />
          {/* LB */}
          <Box x={220} y={90} w={100} h={60} label="LB" sub="Round Robin" />
          {/* Backends */}
          {[0, 1, 2].map((i) => {
            const labels = ["Backend A", "Backend B", "Backend C"];
            const isActive = step.activeBackend === i;
            return (
              <g key={i}>
                <Box
                  x={460}
                  y={20 + i * 80}
                  w={120}
                  h={60}
                  label={labels[i]}
                  sub={`부하 ${step.loads[i]}`}
                  active={isActive}
                />
              </g>
            );
          })}
          {/* Arrows: Client → LB */}
          <ArrowSeg x1={110} y1={120} x2={220} y2={120} active />
          {/* LB → backends (active highlighted) */}
          {[0, 1, 2].map((i) => {
            const ty = 50 + i * 80;
            return (
              <ArrowSeg
                key={i}
                x1={320}
                y1={120}
                x2={460}
                y2={ty}
                active={step.activeBackend === i}
                dimmed={step.activeBackend !== i && step.activeBackend !== null}
              />
            );
          })}
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

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  active,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  active?: boolean;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={w}
        height={h}
        rx={8}
        className={
          active
            ? "fill-emerald-500 stroke-emerald-700 dark:fill-emerald-600 dark:stroke-emerald-300"
            : "fill-white stroke-zinc-400 dark:fill-zinc-950 dark:stroke-zinc-600"
        }
        strokeWidth={2}
      />
      <text
        x={w / 2}
        y={sub ? h / 2 - 3 : h / 2 + 5}
        textAnchor="middle"
        className={`text-sm font-semibold ${
          active ? "fill-white" : "fill-zinc-900 dark:fill-zinc-50"
        }`}
      >
        {label}
      </text>
      {sub && (
        <text
          x={w / 2}
          y={h / 2 + 13}
          textAnchor="middle"
          className={`text-[10px] font-mono ${
            active
              ? "fill-emerald-100"
              : "fill-zinc-500 dark:fill-zinc-400"
          }`}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function ArrowSeg({
  x1,
  y1,
  x2,
  y2,
  active,
  dimmed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active?: boolean;
  dimmed?: boolean;
}) {
  const colorClass = active
    ? "stroke-emerald-600 dark:stroke-emerald-400"
    : dimmed
    ? "stroke-zinc-200 dark:stroke-zinc-800"
    : "stroke-zinc-400 dark:stroke-zinc-600";
  const fillClass = active
    ? "fill-emerald-600 dark:fill-emerald-400"
    : dimmed
    ? "fill-zinc-200 dark:fill-zinc-800"
    : "fill-zinc-400 dark:fill-zinc-600";
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const tipX = x2;
  const tipY = y2;
  return (
    <g className={colorClass}>
      <line
        x1={x1}
        y1={y1}
        x2={tipX}
        y2={tipY}
        strokeWidth={active ? 2.5 : 1.5}
      />
      <polygon
        points={`${tipX},${tipY} ${tipX - ux * 8 - uy * 5},${tipY - uy * 8 + ux * 5} ${tipX - ux * 8 + uy * 5},${tipY - uy * 8 - ux * 5}`}
        className={fillClass}
        stroke="none"
      />
    </g>
  );
}
