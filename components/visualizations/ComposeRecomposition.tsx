"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type ComposableNode = {
  id: string;
  name: string;
  level: number; // 0=root, deeper levels nested
  reads: string[]; // 상태 의존성
};

const TREE: ComposableNode[] = [
  { id: "screen", name: "ProfileScreen", level: 0, reads: [] },
  { id: "header", name: "Header", level: 1, reads: [] },
  { id: "counter", name: "CounterBadge", level: 1, reads: ["count"] },
  { id: "name", name: "NameLabel", level: 1, reads: ["name"] },
  { id: "list", name: "ItemList", level: 1, reads: ["items"] },
  { id: "item1", name: "Item #1", level: 2, reads: ["items"] },
  { id: "item2", name: "Item #2", level: 2, reads: ["items"] },
  { id: "footer", name: "Footer", level: 1, reads: [] },
];

type StepDef = {
  id: string;
  label: string;
  changedState: string | null;
  recomposed: string[];
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기 컴포지션",
    changedState: null,
    recomposed: TREE.map((n) => n.id),
    description:
      "처음에는 모든 Composable이 컴포지션됨. 각 노드가 어떤 상태를 읽는지(reads) Compose가 추적.",
  },
  {
    id: "count",
    label: "count 변경",
    changedState: "count",
    recomposed: ["counter"],
    description:
      "count 상태만 +1. CounterBadge만 reads에 count가 있으므로 그것만 recompose. Header/NameLabel/ItemList 등 무관한 노드는 skip — smart skipping.",
  },
  {
    id: "name",
    label: "name 변경",
    changedState: "name",
    recomposed: ["name"],
    description:
      "이번엔 name 변경. NameLabel만 영향 — 다른 노드는 안 그려짐. UI 트리 일부만 갱신되는 게 Compose의 효율 핵심.",
  },
  {
    id: "items",
    label: "items 변경",
    changedState: "items",
    recomposed: ["list", "item1", "item2"],
    description:
      "items 리스트 변경 → ItemList와 그 자식 Item들 recompose. Stable/Immutable로 표시된 객체면 동일 참조일 때 자식도 skip 가능.",
  },
];

export function ComposeRecomposition({ slug }: { slug: string }) {
  const { stepIndex, setStepIndex, canPrev, canNext, prev, next, reset } =
    useStepState(slug, STEPS.length);
  const step = STEPS[stepIndex];
  const recomposedSet = new Set(step.recomposed);

  return (
    <VizContainer>
      <Stepper
        steps={STEPS}
        currentIndex={stepIndex}
        onSelect={setStepIndex}
      />

      {step.changedState && (
        <div className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2 text-sm dark:bg-amber-950">
          <span className="font-mono text-amber-800 dark:text-amber-300">
            상태 변경: {step.changedState}
          </span>
          <span className="font-mono text-xs text-amber-700 dark:text-amber-400">
            recomposed: {step.recomposed.length} / {TREE.length}
          </span>
        </div>
      )}

      <div className="space-y-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        {TREE.map((n) => {
          const isRecomposed = recomposedSet.has(n.id);
          const reads = n.reads;
          return (
            <div
              key={n.id}
              style={{ marginLeft: `${n.level * 24}px` }}
              className={`flex items-center justify-between rounded-md border px-3 py-2 transition ${
                isRecomposed
                  ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950"
                  : "border-zinc-200 bg-white opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
              }`}
            >
              <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {n.name}
              </span>
              <div className="flex items-center gap-2">
                {reads.length > 0 && (
                  <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                    reads: {reads.join(", ")}
                  </span>
                )}
                {isRecomposed ? (
                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    ↻ recompose
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                    skip
                  </span>
                )}
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
