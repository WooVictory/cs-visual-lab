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
  tokens: { text: string; isMerge?: boolean }[];
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "chars",
    label: "문자 단위",
    tokens: "playgrounds".split("").map((c) => ({ text: c })),
    description:
      "초기: 모든 텍스트를 단일 문자(또는 바이트) 토큰으로 분해. 어휘 사전은 작지만 시퀀스가 길어짐.",
  },
  {
    id: "step1",
    label: "병합 1",
    tokens: [
      { text: "p" },
      { text: "l" },
      { text: "ay", isMerge: true },
      { text: "g" },
      { text: "r" },
      { text: "ou", isMerge: true },
      { text: "n" },
      { text: "d" },
      { text: "s" },
    ],
    description:
      "BPE 학습: 자주 등장하는 인접 쌍을 병합. 'a'+'y' → 'ay', 'o'+'u' → 'ou'. 영어에서 흔한 글자쌍부터.",
  },
  {
    id: "step2",
    label: "병합 2",
    tokens: [
      { text: "play", isMerge: true },
      { text: "g" },
      { text: "r" },
      { text: "ou" },
      { text: "n" },
      { text: "d" },
      { text: "s" },
    ],
    description:
      "더 많은 데이터를 보며 'p'+'l'+'ay' → 'play'까지 병합. 빈도 높은 단어 어간이 점차 한 토큰으로.",
  },
  {
    id: "step3",
    label: "병합 3",
    tokens: [
      { text: "play" },
      { text: "ground", isMerge: true },
      { text: "s" },
    ],
    description:
      "'gr'+'ou'+'nd' → 'ground' 병합. 학습된 어휘 사전이 자라면서 자주 등장하는 청크가 한 토큰이 됨.",
  },
  {
    id: "final",
    label: "최종 (BPE)",
    tokens: [
      { text: "play" },
      { text: "ground" },
      { text: "s", isMerge: true },
    ],
    description:
      "최종 BPE 결과: ['play', 'ground', 's']. 단순 단어 분리가 아니라 의미 있는 서브워드 단위. 미등록 단어도 알려진 서브워드 조합으로 표현 가능 (OOV 문제 해결).",
  },
];

export function Tokenization({ slug }: { slug: string }) {
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

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 text-center">
          <div className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            입력 텍스트
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            playgrounds
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {step.tokens.map((t, i) => (
            <div
              key={i}
              className={`flex items-center rounded-md border-2 px-3 py-2 font-mono text-sm font-bold transition-all ${
                t.isMerge
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-100"
                  : "border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
              }`}
            >
              {t.text}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          토큰 수: {step.tokens.length}
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
