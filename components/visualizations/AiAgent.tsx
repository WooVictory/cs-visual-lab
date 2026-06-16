"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Phase = "thought" | "action" | "observation";

type Entry = {
  phase: Phase;
  text: string;
  highlight?: boolean;
};

type StepDef = {
  id: string;
  label: string;
  entries: Entry[];
  iteration: number;
  finished: boolean;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "task",
    label: "0. 작업",
    entries: [
      {
        phase: "thought",
        text: '사용자: "TypeScript 최신 버전과 Node.js 호환성 알려줘"',
        highlight: true,
      },
    ],
    iteration: 0,
    finished: false,
    description:
      "에이전트가 받은 작업. 단순 Q&A 같지만 최신 정보가 필요하므로 LLM이 도구를 활용해 단계적으로 풀어야 합니다.",
  },
  {
    id: "loop1",
    label: "1차 ReAct",
    entries: [
      {
        phase: "thought",
        text: 'Thought: "TypeScript 최신 버전을 확인해야 함. npm registry 검색."',
      },
      {
        phase: "action",
        text: 'Action: search_npm("typescript")',
        highlight: true,
      },
      { phase: "observation", text: "Observation: 최신 버전 = 5.7.2" },
    ],
    iteration: 1,
    finished: false,
    description:
      "ReAct 첫 루프: Thought (다음에 뭘 할지) → Action (도구 호출) → Observation (결과). 에이전트가 능동적으로 도구를 선택하고 호출.",
  },
  {
    id: "loop2",
    label: "2차 ReAct",
    entries: [
      { phase: "thought", text: 'Thought: "TypeScript 버전 확인 완료. 5.7.2"' },
      {
        phase: "action",
        text: "Action: search_npm_engines(\"typescript@5.7.2\")",
      },
      { phase: "observation", text: 'Observation: "engines": {"node": ">=14.17"}' },
    ],
    iteration: 2,
    finished: false,
    description:
      "두 번째 루프: 첫 결과를 보고 다음 행동 결정. Node 호환성 정보가 필요하다고 판단 → 다른 도구 호출.",
  },
  {
    id: "loop3",
    label: "3차 ReAct (종료 판단)",
    entries: [
      {
        phase: "thought",
        text: 'Thought: "필요한 정보 모두 확보. 답변 가능. 도구 호출 불필요."',
        highlight: true,
      },
    ],
    iteration: 3,
    finished: false,
    description:
      "에이전트가 충분한 정보를 모았다고 판단하면 더 이상 도구를 호출하지 않고 최종 답변 생성으로 진입. 무한 루프 방지 핵심.",
  },
  {
    id: "answer",
    label: "최종 답변",
    entries: [
      {
        phase: "thought",
        text: 'Final Answer: "TypeScript 5.7.2가 최신이며 Node.js 14.17+ 와 호환됩니다."',
        highlight: true,
      },
    ],
    iteration: 3,
    finished: true,
    description:
      "최종 답변. 안전 장치: 최대 step 제한(예: 10), 비용 한도, 위험한 도구 사용 시 사용자 확인, 결과 검증. 폭주 없이 동작하게.",
  },
];

const PHASE_STYLE: Record<Phase, { bg: string; border: string; label: string }> = {
  thought: {
    bg: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-400 dark:border-amber-600",
    label: "💭 Thought",
  },
  action: {
    bg: "bg-sky-50 dark:bg-sky-950",
    border: "border-sky-400 dark:border-sky-600",
    label: "⚡ Action",
  },
  observation: {
    bg: "bg-emerald-50 dark:bg-emerald-950",
    border: "border-emerald-400 dark:border-emerald-600",
    label: "👁 Observation",
  },
};

export function AiAgent({ slug }: { slug: string }) {
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

      <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2 text-xs font-mono dark:bg-zinc-900">
        <span className="text-zinc-500 dark:text-zinc-400">
          ReAct = Reason + Act
        </span>
        <span className="text-zinc-700 dark:text-zinc-300">
          iteration: {step.iteration}{" "}
          {step.finished && (
            <span className="ml-2 rounded-full bg-emerald-500 px-2 py-0.5 text-white">
              ✓ done
            </span>
          )}
        </span>
      </div>

      <div className="space-y-2">
        {step.entries.map((e, i) => {
          const s = PHASE_STYLE[e.phase];
          return (
            <div
              key={i}
              className={`rounded-lg border-l-4 p-3 ${s.bg} ${s.border} ${
                e.highlight ? "ring-2 ring-zinc-300 dark:ring-zinc-700" : ""
              }`}
            >
              <div className="text-[10px] font-semibold uppercase text-zinc-600 dark:text-zinc-400">
                {s.label}
              </div>
              <div className="mt-1 font-mono text-xs text-zinc-800 dark:text-zinc-200">
                {e.text}
              </div>
            </div>
          );
        })}
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
