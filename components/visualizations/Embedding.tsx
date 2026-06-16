"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Word = {
  text: string;
  x: number;
  y: number;
  group: "animal" | "food" | "color" | "code";
};

const WORDS: Word[] = [
  { text: "고양이", x: 120, y: 80, group: "animal" },
  { text: "강아지", x: 95, y: 105, group: "animal" },
  { text: "토끼", x: 150, y: 95, group: "animal" },
  { text: "햄스터", x: 130, y: 65, group: "animal" },

  { text: "피자", x: 360, y: 70, group: "food" },
  { text: "파스타", x: 380, y: 95, group: "food" },
  { text: "햄버거", x: 340, y: 90, group: "food" },
  { text: "샐러드", x: 395, y: 60, group: "food" },

  { text: "빨강", x: 100, y: 230, group: "color" },
  { text: "파랑", x: 140, y: 245, group: "color" },
  { text: "초록", x: 115, y: 265, group: "color" },
  { text: "노랑", x: 135, y: 220, group: "color" },

  { text: "Python", x: 360, y: 240, group: "code" },
  { text: "JavaScript", x: 395, y: 255, group: "code" },
  { text: "Kotlin", x: 350, y: 270, group: "code" },
  { text: "TypeScript", x: 400, y: 220, group: "code" },
];

const GROUP_COLOR: Record<Word["group"], string> = {
  animal: "fill-rose-500 stroke-rose-700",
  food: "fill-amber-500 stroke-amber-700",
  color: "fill-sky-500 stroke-sky-700",
  code: "fill-emerald-500 stroke-emerald-700",
};

type StepDef = {
  id: string;
  label: string;
  query: { text: string; x: number; y: number } | null;
  topK: number;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "벡터 공간",
    query: null,
    topK: 0,
    description:
      "16개 단어를 임베딩 공간에 배치. 실제로는 384/768차원이지만 시각화를 위해 2D로. 의미가 비슷한 단어끼리 자연스럽게 군집을 이룹니다 — 학습이 잘 된 임베딩의 핵심.",
  },
  {
    id: "groups",
    label: "의미 군집",
    query: null,
    topK: 0,
    description:
      "동물 / 음식 / 색 / 프로그래밍 언어 — 4개 도메인이 공간상 분리되어 있습니다. 모델은 텍스트만 보고 이런 구조를 학습해요.",
  },
  {
    id: "query",
    label: "검색 시작",
    query: { text: "치킨", x: 365, y: 105 },
    topK: 0,
    description:
      "새 단어 '치킨'을 같은 임베딩 모델로 벡터화. 음식 군집 근처에 떨어집니다. 이제 가장 가까운 단어들을 찾아봅시다.",
  },
  {
    id: "top3",
    label: "Top-3 검색",
    query: { text: "치킨", x: 365, y: 105 },
    topK: 3,
    description:
      "Cosine similarity 기준 가장 가까운 3개 — 모두 음식 군집. 단어 사전 검색이 아니라 의미 기반 검색입니다. 이게 RAG의 출발점.",
  },
];

export function EmbeddingViz({ slug }: { slug: string }) {
  const { stepIndex, setStepIndex, canPrev, canNext, prev, next, reset } =
    useStepState(slug, STEPS.length);
  const step = STEPS[stepIndex];

  // Find top-K nearest words to query
  let topKWords: Word[] = [];
  if (step.query && step.topK > 0) {
    const q = step.query;
    topKWords = [...WORDS]
      .map((w) => ({ ...w, d: Math.hypot(w.x - q.x, w.y - q.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, step.topK);
  }
  const topKSet = new Set(topKWords.map((w) => w.text));

  return (
    <VizContainer>
      <Stepper
        steps={STEPS}
        currentIndex={stepIndex}
        onSelect={setStepIndex}
      />

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <svg viewBox="0 0 500 320" className="w-full" aria-hidden>
          {/* Top-K lines from query */}
          {step.query &&
            topKWords.map((w) => (
              <line
                key={`l-${w.text}`}
                x1={step.query!.x}
                y1={step.query!.y}
                x2={w.x}
                y2={w.y}
                className="stroke-emerald-500 dark:stroke-emerald-400"
                strokeWidth={2}
                strokeDasharray="4 3"
              />
            ))}

          {/* Words */}
          {WORDS.map((w) => {
            const isInTopK = topKSet.has(w.text);
            return (
              <g key={w.text} transform={`translate(${w.x}, ${w.y})`}>
                <circle
                  r={isInTopK ? 8 : 6}
                  className={`${GROUP_COLOR[w.group]} ${
                    isInTopK ? "opacity-100" : "opacity-80"
                  }`}
                  strokeWidth={isInTopK ? 2.5 : 1}
                />
                <text
                  x={10}
                  y={4}
                  className={`text-[11px] ${
                    isInTopK
                      ? "fill-zinc-900 font-bold dark:fill-zinc-50"
                      : "fill-zinc-600 dark:fill-zinc-400"
                  }`}
                >
                  {w.text}
                </text>
              </g>
            );
          })}

          {/* Query point */}
          {step.query && (
            <g transform={`translate(${step.query.x}, ${step.query.y})`}>
              <circle
                r={10}
                className="fill-zinc-900 stroke-zinc-900 dark:fill-zinc-100 dark:stroke-zinc-100"
                strokeWidth={2}
              />
              <text
                x={14}
                y={4}
                className="text-[12px] font-bold fill-zinc-900 dark:fill-zinc-50"
              >
                {step.query.text} (query)
              </text>
            </g>
          )}
        </svg>

        <div className="mt-3 flex flex-wrap gap-4 text-[11px]">
          {(["animal", "food", "color", "code"] as const).map((g) => {
            const labels: Record<typeof g, string> = {
              animal: "동물",
              food: "음식",
              color: "색",
              code: "언어",
            };
            return (
              <div key={g} className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-3 w-3 rounded-full ${GROUP_COLOR[g]
                    .replace("stroke-", "")
                    .split(" ")[0]}`}
                />
                <span className="text-zinc-600 dark:text-zinc-400">
                  {labels[g]}
                </span>
              </div>
            );
          })}
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
