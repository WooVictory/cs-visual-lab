"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Mode = "cp" | "ap" | "split";

type StepDef = {
  id: string;
  label: string;
  highlight: Array<"C" | "A" | "P">;
  mode: Mode | null;
  example: string;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "normal",
    label: "정상 동작",
    highlight: ["C", "A", "P"],
    mode: null,
    example: "분할 없음 → C와 A 둘 다 만족",
    description:
      "CAP 정리: 분산 시스템은 일관성(C) · 가용성(A) · 분할 내성(P) 셋 중 둘만. 평상시(분할 없을 때)엔 셋 다 만족하는 것처럼 보입니다.",
  },
  {
    id: "partition",
    label: "네트워크 분할",
    highlight: ["P"],
    mode: "split",
    example: "데이터센터간 네트워크 끊김",
    description:
      "분할(Partition) 발생! 노드 그룹이 서로 통신 불가. 이 순간 C와 A 중 하나는 양보해야 합니다 — 둘 다 가질 수 없어요.",
  },
  {
    id: "cp",
    label: "CP 선택",
    highlight: ["C", "P"],
    mode: "cp",
    example: "etcd, Zookeeper, MongoDB(기본)",
    description:
      "CP 선택: 일관성을 지킨다 → 분할 시 일부 노드는 응답 거부 (가용성 양보). 'wrong answer 보단 차라리 응답 없음'. 메타데이터, 금융 등에 적합.",
  },
  {
    id: "ap",
    label: "AP 선택",
    highlight: ["A", "P"],
    mode: "ap",
    example: "Cassandra, DynamoDB, Riak",
    description:
      "AP 선택: 가용성을 지킨다 → 분할 시에도 응답하되 일관성은 양보 (eventually consistent). '응답 없음 보단 stale 데이터'. SNS, 카탈로그 등에 적합.",
  },
  {
    id: "pacelc",
    label: "PACELC",
    highlight: ["C", "A", "P"],
    mode: null,
    example: "현실은 평상시에도 L vs C 선택",
    description:
      "PACELC = 분할(P) 시 A↔C, Else(평상시)엔 Latency↔Consistency. 더 실용적 — 평상시에도 강한 일관성을 위해 RTT 늘릴지, 빠르게 답하지만 약간의 stale을 허용할지 선택해야 합니다.",
  },
];

export function CapTriangle({ slug }: { slug: string }) {
  const { stepIndex, setStepIndex, canPrev, canNext, prev, next, reset } =
    useStepState(slug, STEPS.length);
  const step = STEPS[stepIndex];

  const highlightSet = new Set(step.highlight);

  return (
    <VizContainer>
      <Stepper
        steps={STEPS}
        currentIndex={stepIndex}
        onSelect={setStepIndex}
      />

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <svg viewBox="0 0 400 320" className="mx-auto block max-w-md" aria-hidden>
          {/* Triangle */}
          <polygon
            points="200,40 60,280 340,280"
            fill="none"
            className="stroke-zinc-300 dark:stroke-zinc-700"
            strokeWidth={2}
          />
          {/* Vertices */}
          <Vertex x={200} y={40} label="C" name="Consistency" active={highlightSet.has("C")} color="emerald" />
          <Vertex x={60} y={280} label="A" name="Availability" active={highlightSet.has("A")} color="sky" />
          <Vertex x={340} y={280} label="P" name="Partition" active={highlightSet.has("P")} color="amber" />

          {/* Mode label */}
          {step.mode && (
            <text x={200} y={170} textAnchor="middle" className="text-xl font-bold fill-zinc-900 dark:fill-zinc-50">
              {step.mode === "cp" ? "CP" : step.mode === "ap" ? "AP" : "⚡ Partition"}
            </text>
          )}
        </svg>
        <div className="mt-2 rounded-lg bg-white px-4 py-2 text-center font-mono text-xs text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
          {step.example}
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

function Vertex({
  x,
  y,
  label,
  name,
  active,
  color,
}: {
  x: number;
  y: number;
  label: string;
  name: string;
  active: boolean;
  color: "emerald" | "sky" | "amber";
}) {
  const colorMap = {
    emerald: active ? "fill-emerald-500 stroke-emerald-700" : "fill-zinc-200 stroke-zinc-400",
    sky: active ? "fill-sky-500 stroke-sky-700" : "fill-zinc-200 stroke-zinc-400",
    amber: active ? "fill-amber-500 stroke-amber-700" : "fill-zinc-200 stroke-zinc-400",
  };
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={36} className={colorMap[color]} strokeWidth={3} />
      <text textAnchor="middle" y={-4} className="text-2xl font-bold fill-white">
        {label}
      </text>
      <text textAnchor="middle" y={14} className="text-[9px] font-semibold fill-white">
        {name}
      </text>
    </g>
  );
}
