"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Obj = {
  id: string;
  age: number;
  alive: boolean;
};

type StepDef = {
  id: string;
  label: string;
  eden: Obj[];
  survivor0: Obj[];
  survivor1: Obj[];
  oldGen: Obj[];
  description: string;
  highlight: ("eden" | "s0" | "s1" | "old")[];
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    eden: [],
    survivor0: [],
    survivor1: [],
    oldGen: [],
    description:
      "JVM Heap은 Young(Eden + Survivor 0/1)과 Old로 나뉩니다. 대부분의 객체는 짧은 생애 (weak generational hypothesis). 새 객체는 Eden에 할당됩니다.",
    highlight: [],
  },
  {
    id: "alloc",
    label: "객체 할당",
    eden: [
      { id: "A", age: 0, alive: true },
      { id: "B", age: 0, alive: false },
      { id: "C", age: 0, alive: true },
      { id: "D", age: 0, alive: false },
    ],
    survivor0: [],
    survivor1: [],
    oldGen: [],
    description:
      "Eden이 빠르게 채워집니다. 일부는 참조가 끊겨 죽은 상태(garbage)이지만 GC 전까지 그대로 있음.",
    highlight: ["eden"],
  },
  {
    id: "minor1",
    label: "Minor GC #1",
    eden: [],
    survivor0: [
      { id: "A", age: 1, alive: true },
      { id: "C", age: 1, alive: true },
    ],
    survivor1: [],
    oldGen: [],
    description:
      "Eden이 가득 차면 Minor GC 발생. 살아있는 객체(A, C)만 Survivor 0로 이동(복사). 죽은 객체(B, D)는 그냥 폐기 — 빠른 회수. 나이(age) +1.",
    highlight: ["eden", "s0"],
  },
  {
    id: "alloc2",
    label: "다시 할당 + GC",
    eden: [],
    survivor0: [],
    survivor1: [
      { id: "A", age: 2, alive: true },
      { id: "C", age: 2, alive: true },
      { id: "E", age: 1, alive: true },
    ],
    oldGen: [],
    description:
      "더 많은 할당과 다음 Minor GC. Survivor 0의 살아있는 객체 + Eden의 살아있는 신규 객체가 Survivor 1로. S0/S1을 번갈아 사용 — 항상 한쪽은 비어있음.",
    highlight: ["s1"],
  },
  {
    id: "promotion",
    label: "Old gen 승급",
    eden: [],
    survivor0: [],
    survivor1: [{ id: "E", age: 3, alive: true }],
    oldGen: [
      { id: "A", age: 15, alive: true },
      { id: "C", age: 15, alive: true },
    ],
    description:
      "특정 임계 나이(보통 15)를 넘긴 객체는 Old gen으로 승급 — 오래 살 객체로 판단. Old gen은 더 비싼 Major GC(전체 스캔) 대상이라 가능한 줄여야 함. 이게 G1, ZGC 같은 GC 알고리즘이 최적화하려는 핵심 영역.",
    highlight: ["old"],
  },
];

export function JvmGc({ slug }: { slug: string }) {
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

      <div className="space-y-3">
        <Region
          name="Young: Eden"
          objects={step.eden}
          highlight={step.highlight.includes("eden")}
          capacity={6}
        />
        <div className="grid grid-cols-2 gap-3">
          <Region
            name="Young: Survivor 0"
            objects={step.survivor0}
            highlight={step.highlight.includes("s0")}
            capacity={3}
            compact
          />
          <Region
            name="Young: Survivor 1"
            objects={step.survivor1}
            highlight={step.highlight.includes("s1")}
            capacity={3}
            compact
          />
        </div>
        <Region
          name="Old Generation"
          objects={step.oldGen}
          highlight={step.highlight.includes("old")}
          capacity={6}
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

function Region({
  name,
  objects,
  highlight,
  capacity,
  compact,
}: {
  name: string;
  objects: Obj[];
  highlight: boolean;
  capacity: number;
  compact?: boolean;
}) {
  const slots = Array.from({ length: capacity });
  return (
    <div
      className={`rounded-lg border-2 p-3 transition ${
        highlight
          ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <div className="mb-2 flex items-baseline justify-between">
        <span
          className={`text-xs font-semibold ${
            highlight
              ? "text-amber-800 dark:text-amber-300"
              : "text-zinc-700 dark:text-zinc-300"
          }`}
        >
          {name}
        </span>
        <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
          {objects.length} / {capacity}
        </span>
      </div>
      <div className={`grid gap-1 ${compact ? "grid-cols-3" : "grid-cols-6"}`}>
        {slots.map((_, i) => {
          const obj = objects[i];
          if (!obj) {
            return (
              <div
                key={i}
                className="h-10 rounded border border-dashed border-zinc-300 dark:border-zinc-700"
              />
            );
          }
          return (
            <div
              key={obj.id}
              className={`flex h-10 flex-col items-center justify-center rounded font-mono text-[10px] ${
                obj.alive
                  ? "bg-emerald-500 text-white dark:bg-emerald-600"
                  : "bg-zinc-400 text-zinc-100 dark:bg-zinc-700 dark:text-zinc-300 line-through"
              }`}
            >
              <span className="font-bold">{obj.id}</span>
              <span className="opacity-75">age {obj.age}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
