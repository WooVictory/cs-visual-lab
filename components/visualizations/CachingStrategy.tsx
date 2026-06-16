"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Arrow = "app-cache" | "cache-app" | "app-db" | "db-app" | "cache-db" | null;

type Mode = "cache-aside" | "write-through";

type StepDef = {
  id: string;
  label: string;
  modes: Record<Mode, { active: Arrow; message: string; cacheState: string; dbState: string }>;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    modes: {
      "cache-aside": { active: null, message: "—", cacheState: "(empty)", dbState: "balance=100" },
      "write-through": { active: null, message: "—", cacheState: "(empty)", dbState: "balance=100" },
    },
    description:
      "두 전략 비교: Cache-Aside(앱이 캐시 관리) vs Write-Through(쓰기는 캐시+DB 동시). 같은 작업을 각각 다르게 처리.",
  },
  {
    id: "read1",
    label: "첫 읽기 (miss)",
    modes: {
      "cache-aside": { active: "app-db", message: "1. 캐시 miss → DB 조회", cacheState: "(empty)", dbState: "balance=100" },
      "write-through": { active: "app-cache", message: "1. 캐시 확인 → miss", cacheState: "(empty)", dbState: "balance=100" },
    },
    description:
      "첫 요청: 캐시가 비어있으니 둘 다 miss. Cache-Aside는 앱이 직접 DB로, Write-Through도 결국 DB로 가야 함.",
  },
  {
    id: "fill",
    label: "캐시 채우기",
    modes: {
      "cache-aside": { active: "cache-app", message: "2. DB 결과 → 캐시 저장", cacheState: "balance=100", dbState: "balance=100" },
      "write-through": { active: "cache-app", message: "2. DB 결과 → 캐시 저장", cacheState: "balance=100", dbState: "balance=100" },
    },
    description:
      "읽기 시점엔 두 전략이 거의 동일. 캐시에 결과 저장 후 응답.",
  },
  {
    id: "write",
    label: "쓰기 발생",
    modes: {
      "cache-aside": { active: "app-db", message: "DB만 쓰고 캐시 무효화", cacheState: "(invalidated)", dbState: "balance=200" },
      "write-through": { active: "cache-db", message: "캐시 + DB 동시 갱신", cacheState: "balance=200", dbState: "balance=200" },
    },
    description:
      "차이가 드러나는 순간! Cache-Aside: DB만 쓰고 캐시는 invalidate (다음 read 때 다시 fetch). Write-Through: 캐시와 DB 동시 갱신, 캐시가 항상 최신.",
  },
  {
    id: "read2",
    label: "다시 읽기",
    modes: {
      "cache-aside": { active: "app-db", message: "캐시 비어있음 → DB 다시", cacheState: "(empty)", dbState: "balance=200" },
      "write-through": { active: "cache-app", message: "캐시 hit → 즉시 응답", cacheState: "balance=200", dbState: "balance=200" },
    },
    description:
      "다음 read: Cache-Aside는 캐시가 비어 또 DB 가야 함 (한 번 더 miss). Write-Through는 hit — 빠른 응답. 트레이드오프: Write-Through는 쓰기 비용↑, 캐시 일관성↑.",
  },
];

export function CachingStrategy({ slug }: { slug: string }) {
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
        <Mode
          title="Cache-Aside"
          subtitle="앱이 캐시 관리"
          mode={step.modes["cache-aside"]}
        />
        <Mode
          title="Write-Through"
          subtitle="쓰기는 캐시+DB 동시"
          mode={step.modes["write-through"]}
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

function Mode({
  title,
  subtitle,
  mode,
}: {
  title: string;
  subtitle: string;
  mode: { active: Arrow; message: string; cacheState: string; dbState: string };
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center">
        <Box label="App" sub="" active={false} />
        <Box label="Cache" sub={mode.cacheState} active={mode.active === "app-cache" || mode.active === "cache-app"} />
        <Box label="DB" sub={mode.dbState} active={mode.active === "app-db" || mode.active === "db-app" || mode.active === "cache-db"} />
      </div>

      <div className="rounded-lg bg-white px-3 py-2 text-center font-mono text-[11px] text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
        {mode.message}
      </div>
    </div>
  );
}

function Box({ label, sub, active }: { label: string; sub: string; active: boolean }) {
  return (
    <div
      className={`rounded-md border-2 p-2 ${
        active
          ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950"
          : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950"
      }`}
    >
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {label}
      </div>
      <div className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
        {sub || "—"}
      </div>
    </div>
  );
}
