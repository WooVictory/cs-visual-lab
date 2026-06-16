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
  flowEmissions: { sub1: number[]; sub2: number[] };
  stateEmissions: { sub1: number[]; sub2: number[] };
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    flowEmissions: { sub1: [], sub2: [] },
    stateEmissions: { sub1: [], sub2: [] },
    description:
      "두 개의 스트림: 일반 Flow(cold)와 StateFlow(hot). 구독자 두 명이 어떻게 다른 값을 받는지 비교합니다.",
  },
  {
    id: "sub1",
    label: "Sub1 구독 시작",
    flowEmissions: { sub1: [1, 2], sub2: [] },
    stateEmissions: { sub1: [10], sub2: [] },
    description:
      "Sub1이 구독 시작. Flow: 처음부터 emit 시작 → 1, 2 받음. StateFlow: 즉시 마지막 값(10) 받음 — 'hot' + '상태 보유'.",
  },
  {
    id: "more-emit",
    label: "값 더 emit",
    flowEmissions: { sub1: [1, 2, 3, 4, 5], sub2: [] },
    stateEmissions: { sub1: [10, 20], sub2: [] },
    description:
      "시간이 흐름. Flow는 계속 1→5까지 발행, StateFlow는 10→20으로 상태 갱신.",
  },
  {
    id: "sub2",
    label: "Sub2 늦게 구독",
    flowEmissions: { sub1: [1, 2, 3, 4, 5], sub2: [1, 2] },
    stateEmissions: { sub1: [10, 20], sub2: [20] },
    description:
      "Sub2가 늦게 구독. Cold Flow: 처음부터 다시 시작 → 1, 2부터 받음. Hot StateFlow: 현재 값(20)을 즉시 받음. 이게 핵심 차이!",
  },
  {
    id: "final",
    label: "최종 비교",
    flowEmissions: { sub1: [1, 2, 3, 4, 5, 6, 7], sub2: [1, 2, 3, 4] },
    stateEmissions: { sub1: [10, 20, 30], sub2: [20, 30] },
    description:
      "결론: 각 구독자가 독립 스트림이 필요하면 Cold Flow. 'UI 상태'처럼 항상 현재 값을 보여줘야 하면 StateFlow. SharedFlow는 그 중간 (replay/buffer 설정 가능, 이벤트 스트림).",
  },
];

export function FlowColdHot({ slug }: { slug: string }) {
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StreamCard
          title="Cold Flow"
          subtitle="구독자별 독립 스트림"
          sub1={step.flowEmissions.sub1}
          sub2={step.flowEmissions.sub2}
        />
        <StreamCard
          title="StateFlow (Hot)"
          subtitle="상태 보유 · 즉시 현재값"
          sub1={step.stateEmissions.sub1}
          sub2={step.stateEmissions.sub2}
        />
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

function StreamCard({
  title,
  subtitle,
  sub1,
  sub2,
}: {
  title: string;
  subtitle: string;
  sub1: number[];
  sub2: number[];
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3">
        <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </div>
      </div>
      <SubscriberRow label="Sub1" values={sub1} colorClass="bg-sky-500" />
      <SubscriberRow label="Sub2" values={sub2} colorClass="bg-emerald-500" />
    </div>
  );
}

function SubscriberRow({
  label,
  values,
  colorClass,
}: {
  label: string;
  values: number[];
  colorClass: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-2 last:mb-0">
      <span className="w-12 font-mono text-xs text-zinc-600 dark:text-zinc-400">
        {label}
      </span>
      <div className="flex flex-1 gap-1">
        {values.length === 0 ? (
          <span className="text-xs text-zinc-400 dark:text-zinc-600">
            (구독 전)
          </span>
        ) : (
          values.map((v, i) => (
            <span
              key={i}
              className={`flex h-6 min-w-[24px] items-center justify-center rounded px-1.5 font-mono text-[11px] font-bold text-white ${colorClass}`}
            >
              {v}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
