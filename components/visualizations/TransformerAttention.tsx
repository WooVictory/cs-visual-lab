"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

const TOKENS = ["The", "cat", "sat", "on", "mat"];

// 가상의 Attention weight matrix (각 행: query, 각 열: key)
// 합이 1이 되도록 정규화된 값 (가짜 데이터지만 직관적)
const ATTENTION: number[][] = [
  [0.55, 0.10, 0.15, 0.10, 0.10], // "The" → 자기 자신
  [0.05, 0.40, 0.10, 0.05, 0.40], // "cat" → "cat" + "mat" (의미 관련)
  [0.10, 0.45, 0.30, 0.10, 0.05], // "sat" → "cat" (주어 참조)
  [0.10, 0.15, 0.20, 0.30, 0.25], // "on" → "sat" + "mat" (관계어)
  [0.05, 0.40, 0.10, 0.15, 0.30], // "mat" → "cat" (관련)
];

type StepDef = {
  id: string;
  label: string;
  activeRow: number | null;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기 매트릭스",
    activeRow: null,
    description:
      "트랜스포머의 Self-Attention. 5개 토큰이 서로를 얼마나 참조하는지 행렬로 표현. 각 행(query)이 각 열(key)에 부여하는 가중치 — 합이 1.",
  },
  {
    id: "q0",
    label: "Q=The",
    activeRow: 0,
    description:
      "'The'(관사)는 자기 자신과 다른 토큰에 비교적 균등하게 분배. 의미가 가벼운 토큰은 보통 약한 attention 패턴.",
  },
  {
    id: "q1",
    label: "Q=cat",
    activeRow: 1,
    description:
      "'cat'은 자기 자신과 'mat'에 큰 weight. 두 명사가 같은 문장에서 의미적으로 연결되어 있다는 모델의 학습 결과.",
  },
  {
    id: "q2",
    label: "Q=sat",
    activeRow: 2,
    description:
      "'sat'(동사)은 'cat'(주어)에 가장 큰 weight. 동사가 어떤 명사를 주어로 가지는지 학습 — 문법 관계 포착.",
  },
  {
    id: "q3",
    label: "Q=on",
    activeRow: 3,
    description:
      "'on'(전치사)은 'sat'(동작)과 'mat'(목적어) 양쪽에 분배. 관계어가 양 끝을 잇는 역할을 학습.",
  },
  {
    id: "q4",
    label: "Q=mat",
    activeRow: 4,
    description:
      "'mat'도 'cat'에 큰 weight — 양방향 의미 관계 형성. 모든 토큰이 모든 토큰을 참조 가능한 게 RNN과의 가장 큰 차이. O(n²) 비용이지만 병렬 처리 가능.",
  },
];

export function TransformerAttention({ slug }: { slug: string }) {
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

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>↓ Query (행)</span>
          <span>Key (열) →</span>
        </div>
        <div className="inline-grid grid-cols-[80px_repeat(5,minmax(60px,1fr))] gap-1">
          <div />
          {TOKENS.map((t) => (
            <div
              key={`h-${t}`}
              className="text-center font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300"
            >
              {t}
            </div>
          ))}
          {TOKENS.map((qt, i) => (
            <Row
              key={qt}
              rowIdx={i}
              tokenLabel={qt}
              active={step.activeRow === i}
              weights={ATTENTION[i]}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
          <span>weight 강도:</span>
          <span className="inline-block h-3 w-3 rounded bg-emerald-200 dark:bg-emerald-900" />
          <span>약함</span>
          <span className="inline-block h-3 w-3 rounded bg-emerald-500 dark:bg-emerald-500" />
          <span>중간</span>
          <span className="inline-block h-3 w-3 rounded bg-emerald-700 dark:bg-emerald-400" />
          <span>강함</span>
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

function Row({
  rowIdx,
  tokenLabel,
  active,
  weights,
}: {
  rowIdx: number;
  tokenLabel: string;
  active: boolean;
  weights: number[];
}) {
  return (
    <>
      <div
        className={`flex items-center justify-end pr-2 font-mono text-xs font-bold ${
          active
            ? "text-zinc-900 dark:text-zinc-50"
            : "text-zinc-500 dark:text-zinc-400"
        }`}
      >
        {tokenLabel}
      </div>
      {weights.map((w, i) => {
        const opacity = active ? w * 2 : w * 0.5;
        const intensity = Math.min(w * 2.5, 1);
        return (
          <div
            key={`${rowIdx}-${i}`}
            className={`flex h-12 items-center justify-center rounded font-mono text-[11px] transition-all ${
              active
                ? "ring-2 ring-emerald-500 dark:ring-emerald-400"
                : ""
            }`}
            style={{
              backgroundColor: active
                ? `rgba(16, 185, 129, ${intensity})`
                : `rgba(161, 161, 170, ${opacity})`,
              color: active && w > 0.3 ? "white" : undefined,
            }}
          >
            {w.toFixed(2)}
          </div>
        );
      })}
    </>
  );
}
