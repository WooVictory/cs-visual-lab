"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

// 3-level B-Tree (간단한 형태)
//                  [30]
//              /         \
//        [15, 22]        [40, 55]
//       /  |  \         /   |   \
// [10,12][18,20][25,28] [33,38][45,50][60,70]
//
// 탐색 대상: 50

type NodeData = {
  id: string;
  keys: number[];
  x: number;
  y: number;
  childrenIds: string[];
};

const TREE: NodeData[] = [
  // L0
  { id: "root", keys: [30], x: 380, y: 30, childrenIds: ["l", "r"] },
  // L1
  { id: "l", keys: [15, 22], x: 180, y: 120, childrenIds: ["ll", "lm", "lr"] },
  { id: "r", keys: [40, 55], x: 580, y: 120, childrenIds: ["rl", "rm", "rr"] },
  // L2
  { id: "ll", keys: [10, 12], x: 60, y: 210, childrenIds: [] },
  { id: "lm", keys: [18, 20], x: 180, y: 210, childrenIds: [] },
  { id: "lr", keys: [25, 28], x: 300, y: 210, childrenIds: [] },
  { id: "rl", keys: [33, 38], x: 460, y: 210, childrenIds: [] },
  { id: "rm", keys: [45, 50], x: 580, y: 210, childrenIds: [] },
  { id: "rr", keys: [60, 70], x: 700, y: 210, childrenIds: [] },
];

const TARGET = 50;

type StepDef = {
  id: string;
  label: string;
  activeId: string | null;
  visitedIds: string[];
  found: boolean;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    activeId: null,
    visitedIds: [],
    found: false,
    description: `B-Tree 인덱스에서 값 ${TARGET}을 탐색합니다. 각 노드 내부는 정렬된 키 배열, 자식은 키 범위에 따라 결정됩니다. 트리 높이가 O(log n)이라 디스크 I/O가 매우 적습니다.`,
  },
  {
    id: "s1",
    label: "Root",
    activeId: "root",
    visitedIds: ["root"],
    found: false,
    description: `루트 노드 [30] 방문. ${TARGET} > 30이므로 오른쪽 자식으로 내려갑니다. 이 한 번의 비교로 절반의 키 공간을 제거합니다.`,
  },
  {
    id: "s2",
    label: "L1",
    activeId: "r",
    visitedIds: ["root", "r"],
    found: false,
    description: `L1 노드 [40, 55] 방문. 40 < ${TARGET} < 55이므로 중간 자식으로 내려갑니다.`,
  },
  {
    id: "s3",
    label: "L2",
    activeId: "rm",
    visitedIds: ["root", "r", "rm"],
    found: true,
    description: `리프 노드 [45, 50] 방문. 50을 발견! 단 3번의 노드 방문으로 9개 리프 사이에서 정확한 값을 찾았습니다. 실제 RDB 인덱스는 한 노드에 수백 개 키를 담아 트리 높이를 더 낮춥니다.`,
  },
];

export function BTreeIndex({ slug }: { slug: string }) {
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

      <div className="flex items-center justify-center gap-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm font-mono dark:bg-zinc-900">
        <span className="text-zinc-500 dark:text-zinc-400">탐색 대상:</span>
        <span className="font-bold text-zinc-900 dark:text-zinc-50">
          {TARGET}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <svg viewBox="0 0 760 260" className="min-w-[600px]" aria-hidden>
          {TREE.flatMap((n) =>
            n.childrenIds.map((cid) => {
              const c = TREE.find((x) => x.id === cid)!;
              const isOnPath =
                step.visitedIds.includes(n.id) &&
                step.visitedIds.includes(cid);
              return (
                <line
                  key={`${n.id}-${cid}`}
                  x1={n.x}
                  y1={n.y + 18}
                  x2={c.x}
                  y2={c.y - 18}
                  className={
                    isOnPath
                      ? "stroke-emerald-500 dark:stroke-emerald-400"
                      : "stroke-zinc-300 dark:stroke-zinc-700"
                  }
                  strokeWidth={isOnPath ? 2.5 : 1.5}
                />
              );
            })
          )}
          {TREE.map((n) => {
            const isActive = step.activeId === n.id;
            const isVisited = step.visitedIds.includes(n.id);
            const isFound = step.found && n.id === step.activeId;
            const width = Math.max(60, n.keys.length * 28 + 16);
            return (
              <g key={n.id} transform={`translate(${n.x - width / 2}, ${n.y - 18})`}>
                <rect
                  width={width}
                  height={36}
                  rx={6}
                  className={
                    isFound
                      ? "fill-emerald-500 stroke-emerald-700 dark:fill-emerald-600 dark:stroke-emerald-300"
                      : isActive
                      ? "fill-zinc-900 stroke-zinc-900 dark:fill-zinc-100 dark:stroke-zinc-100"
                      : isVisited
                      ? "fill-zinc-700 stroke-zinc-700 dark:fill-zinc-300 dark:stroke-zinc-300"
                      : "fill-white stroke-zinc-300 dark:fill-zinc-950 dark:stroke-zinc-700"
                  }
                  strokeWidth={1.5}
                />
                <text
                  x={width / 2}
                  y={23}
                  textAnchor="middle"
                  className={`text-[13px] font-mono font-bold ${
                    isActive || isVisited || isFound
                      ? "fill-white dark:fill-zinc-900"
                      : "fill-zinc-700 dark:fill-zinc-300"
                  }`}
                >
                  {n.keys.join(", ")}
                </text>
              </g>
            );
          })}
        </svg>
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
