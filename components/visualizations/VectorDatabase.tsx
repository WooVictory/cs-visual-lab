"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Point = { id: string; x: number; y: number };

// 50개 가상 벡터 (의도적 클러스터링)
function generatePoints(): Point[] {
  const pts: Point[] = [];
  const seed = [
    [80, 80, 12],
    [320, 90, 12],
    [200, 200, 13],
    [400, 220, 13],
  ];
  let idx = 0;
  for (const [cx, cy, n] of seed) {
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      const r = 30 + ((i * 7) % 25);
      pts.push({
        id: `p${idx++}`,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      });
    }
  }
  return pts;
}

const POINTS = generatePoints();
const QUERY = { x: 250, y: 130 };

type StepDef = {
  id: string;
  label: string;
  showQuery: boolean;
  scanRadius: number;
  k: number;
  algorithm: "linear" | "ann";
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    showQuery: false,
    scanRadius: 0,
    k: 0,
    algorithm: "linear",
    description:
      "벡터 DB에 50개 벡터가 저장되어 있습니다. 4개 의미 군집을 형성. 새 query 벡터에 가장 가까운 K개를 찾으려 합니다.",
  },
  {
    id: "linear",
    label: "Linear (전체 스캔)",
    showQuery: true,
    scanRadius: 0,
    k: 0,
    algorithm: "linear",
    description:
      "정확한 KNN: 모든 50개 벡터와 거리를 계산. 작은 데이터엔 OK, 수백만 벡터엔 비현실적 (O(N×D)).",
  },
  {
    id: "ann-coarse",
    label: "ANN 거친 탐색",
    showQuery: true,
    scanRadius: 80,
    k: 0,
    algorithm: "ann",
    description:
      "ANN (Approximate Nearest Neighbor): HNSW나 IVF가 query 근처 후보만 빠르게 좁힘. 전체의 일부만 봐도 충분.",
  },
  {
    id: "ann-final",
    label: "Top-3 결과",
    showQuery: true,
    scanRadius: 80,
    k: 3,
    algorithm: "ann",
    description:
      "후보 중에서 가장 가까운 3개 선정. 정확도 95%+ 수준에서 속도 100배+ 향상. 이게 벡터 DB의 핵심.",
  },
];

export function VectorDatabase({ slug }: { slug: string }) {
  const { stepIndex, setStepIndex, canPrev, canNext, prev, next, reset } =
    useStepState(slug, STEPS.length);
  const step = STEPS[stepIndex];

  const distances = POINTS.map((p) => ({
    ...p,
    d: Math.hypot(p.x - QUERY.x, p.y - QUERY.y),
  }));
  const inRadius = distances.filter((p) => p.d < step.scanRadius);
  const topK = step.k > 0 ? [...distances].sort((a, b) => a.d - b.d).slice(0, step.k) : [];
  const topKSet = new Set(topK.map((p) => p.id));

  return (
    <VizContainer>
      <Stepper
        steps={STEPS}
        currentIndex={stepIndex}
        onSelect={setStepIndex}
      />

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <svg viewBox="0 0 500 280" className="w-full" aria-hidden>
          {/* Scan radius */}
          {step.scanRadius > 0 && (
            <circle
              cx={QUERY.x}
              cy={QUERY.y}
              r={step.scanRadius}
              className="fill-emerald-100/30 stroke-emerald-500 dark:fill-emerald-900/30 dark:stroke-emerald-400"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          )}

          {/* Top-K lines */}
          {topK.map((p) => (
            <line
              key={`l-${p.id}`}
              x1={QUERY.x}
              y1={QUERY.y}
              x2={p.x}
              y2={p.y}
              className="stroke-emerald-600 dark:stroke-emerald-400"
              strokeWidth={2}
            />
          ))}

          {/* Points */}
          {distances.map((p) => {
            const isTopK = topKSet.has(p.id);
            const isInRadius = step.scanRadius > 0 && p.d < step.scanRadius;
            const isLinearScan = step.algorithm === "linear" && step.showQuery;
            return (
              <circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={isTopK ? 7 : 4}
                className={
                  isTopK
                    ? "fill-emerald-500 stroke-emerald-700 dark:fill-emerald-600 dark:stroke-emerald-300"
                    : isInRadius
                    ? "fill-emerald-200 stroke-emerald-500 dark:fill-emerald-900 dark:stroke-emerald-400"
                    : isLinearScan
                    ? "fill-amber-300 stroke-amber-500 dark:fill-amber-900 dark:stroke-amber-500"
                    : "fill-zinc-300 stroke-zinc-400 dark:fill-zinc-700 dark:stroke-zinc-600"
                }
                strokeWidth={1.5}
              />
            );
          })}

          {/* Query point */}
          {step.showQuery && (
            <g>
              <circle
                cx={QUERY.x}
                cy={QUERY.y}
                r={10}
                className="fill-zinc-900 stroke-zinc-900 dark:fill-zinc-100 dark:stroke-zinc-100"
                strokeWidth={2}
              />
              <text
                x={QUERY.x + 14}
                y={QUERY.y + 4}
                className="text-[11px] font-bold fill-zinc-900 dark:fill-zinc-50"
              >
                query
              </text>
            </g>
          )}
        </svg>

        <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
          <Legend color="bg-zinc-400" label="저장된 벡터" />
          {step.algorithm === "linear" && step.showQuery && (
            <Legend color="bg-amber-400" label="모두 스캔" />
          )}
          {step.scanRadius > 0 && (
            <Legend color="bg-emerald-300" label="ANN 후보" />
          )}
          {step.k > 0 && <Legend color="bg-emerald-500" label="Top-K 결과" />}
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

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded-full ${color}`} />
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
    </div>
  );
}
