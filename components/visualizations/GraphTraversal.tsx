"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

// Graph:
//       1
//      / \
//     2   3
//    /|   |
//   4 5   6
const NODES = [
  { id: 1, x: 150, y: 30 },
  { id: 2, x: 80, y: 100 },
  { id: 3, x: 220, y: 100 },
  { id: 4, x: 40, y: 170 },
  { id: 5, x: 120, y: 170 },
  { id: 6, x: 220, y: 170 },
];

const EDGES: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [3, 6],
];

const DFS_ORDER = [1, 2, 4, 5, 3, 6];
const BFS_ORDER = [1, 2, 3, 4, 5, 6];

type StepDef = {
  id: string;
  label: string;
  visitedCount: number; // 0~6
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "s0",
    label: "초기",
    visitedCount: 0,
    description:
      "같은 그래프에서 DFS(깊이 우선)와 BFS(너비 우선)의 방문 순서를 단계별로 비교합니다. 시작 노드는 1.",
  },
  {
    id: "s1",
    label: "1",
    visitedCount: 1,
    description:
      "시작 노드 1을 방문. DFS는 스택에, BFS는 큐에 자식 노드들을 추가합니다.",
  },
  {
    id: "s2",
    label: "2",
    visitedCount: 2,
    description:
      "DFS: 인접 노드 중 하나(2)를 깊게 따라 내려감. BFS: 같은 레벨의 첫 노드(2)를 큐에서 꺼내 방문.",
  },
  {
    id: "s3",
    label: "3",
    visitedCount: 3,
    description:
      "DFS: 더 깊이 들어가서 4를 방문. BFS: 같은 레벨의 두 번째 노드(3)를 방문 — 레벨 순서 유지.",
  },
  {
    id: "s4",
    label: "4",
    visitedCount: 4,
    description:
      "DFS: 4에서 더 갈 곳이 없어 백트랙 후 5 방문. BFS: 다음 레벨로 내려와 4 방문.",
  },
  {
    id: "s5",
    label: "5",
    visitedCount: 5,
    description:
      "DFS: 2의 자식 끝나고 백트랙 후 3 방문. BFS: 같은 레벨 계속해서 5 방문.",
  },
  {
    id: "s6",
    label: "완료",
    visitedCount: 6,
    description:
      "DFS 최종 순서 [1,2,4,5,3,6]. BFS [1,2,3,4,5,6]. BFS는 시작점에서의 거리가 짧은 순서로 — 가중치 없는 그래프의 최단 경로에 최적.",
  },
];

export function GraphTraversal({ slug }: { slug: string }) {
  const { stepIndex, setStepIndex, canPrev, canNext, prev, next, reset } =
    useStepState(slug, STEPS.length);
  const step = STEPS[stepIndex];

  const dfsVisited = DFS_ORDER.slice(0, step.visitedCount);
  const bfsVisited = BFS_ORDER.slice(0, step.visitedCount);
  const dfsCurrent = step.visitedCount > 0 ? DFS_ORDER[step.visitedCount - 1] : null;
  const bfsCurrent = step.visitedCount > 0 ? BFS_ORDER[step.visitedCount - 1] : null;

  return (
    <VizContainer>
      <Stepper
        steps={STEPS}
        currentIndex={stepIndex}
        onSelect={setStepIndex}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <GraphPanel
          title="DFS (스택)"
          visited={dfsVisited}
          current={dfsCurrent}
          order={DFS_ORDER}
        />
        <GraphPanel
          title="BFS (큐)"
          visited={bfsVisited}
          current={bfsCurrent}
          order={BFS_ORDER}
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

function GraphPanel({
  title,
  visited,
  current,
  order,
}: {
  title: string;
  visited: number[];
  current: number | null;
  order: number[];
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </div>
      <svg viewBox="0 0 280 220" className="w-full" aria-hidden>
        {EDGES.map(([a, b]) => {
          const na = NODES.find((n) => n.id === a)!;
          const nb = NODES.find((n) => n.id === b)!;
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              className="stroke-zinc-300 dark:stroke-zinc-700"
              strokeWidth={2}
            />
          );
        })}
        {NODES.map((n) => {
          const isVisited = visited.includes(n.id);
          const isCurrent = current === n.id;
          return (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
              <circle
                r={20}
                className={
                  isCurrent
                    ? "fill-emerald-500 stroke-emerald-700 dark:fill-emerald-600 dark:stroke-emerald-300"
                    : isVisited
                    ? "fill-zinc-900 stroke-zinc-900 dark:fill-zinc-100 dark:stroke-zinc-100"
                    : "fill-white stroke-zinc-400 dark:fill-zinc-950 dark:stroke-zinc-600"
                }
                strokeWidth={2}
              />
              <text
                textAnchor="middle"
                y={5}
                className={`text-sm font-bold ${
                  isCurrent || isVisited
                    ? "fill-white dark:fill-zinc-900"
                    : "fill-zinc-700 dark:fill-zinc-300"
                }`}
              >
                {n.id}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          순서:
        </span>
        {order.map((id, i) => {
          const isVisited = i < visited.length;
          return (
            <span
              key={id}
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono ${
                isVisited
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              {id}
            </span>
          );
        })}
      </div>
    </div>
  );
}
