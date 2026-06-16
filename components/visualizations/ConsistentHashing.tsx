"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type NodePos = { id: string; angle: number; color: string };
type KeyPos = { id: string; angle: number; label: string };

const STEPS_NODES: NodePos[][] = [
  // step 0: 3 nodes
  [
    { id: "N1", angle: 30, color: "#3b82f6" },
    { id: "N2", angle: 150, color: "#10b981" },
    { id: "N3", angle: 270, color: "#f59e0b" },
  ],
  // step 1: same 3 nodes (visualizing keys)
  [
    { id: "N1", angle: 30, color: "#3b82f6" },
    { id: "N2", angle: 150, color: "#10b981" },
    { id: "N3", angle: 270, color: "#f59e0b" },
  ],
  // step 2: add N4
  [
    { id: "N1", angle: 30, color: "#3b82f6" },
    { id: "N2", angle: 150, color: "#10b981" },
    { id: "N3", angle: 270, color: "#f59e0b" },
    { id: "N4", angle: 210, color: "#ef4444" },
  ],
  // step 3: same + show migration
  [
    { id: "N1", angle: 30, color: "#3b82f6" },
    { id: "N2", angle: 150, color: "#10b981" },
    { id: "N3", angle: 270, color: "#f59e0b" },
    { id: "N4", angle: 210, color: "#ef4444" },
  ],
];

const KEYS: KeyPos[] = [
  { id: "k1", angle: 60, label: "user-42" },
  { id: "k2", angle: 100, label: "user-99" },
  { id: "k3", angle: 180, label: "session-7" },
  { id: "k4", angle: 240, label: "order-3" },
  { id: "k5", angle: 320, label: "cart-1" },
];

type StepDef = {
  id: string;
  label: string;
  nodes: NodePos[];
  showKeys: boolean;
  migratedKeys: string[];
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "링 + 3 노드",
    nodes: STEPS_NODES[0],
    showKeys: false,
    migratedKeys: [],
    description:
      "Consistent Hashing: 0~2π의 가상 링 위에 노드를 해시값에 따라 배치. 키도 같은 해시 함수로 위치 결정.",
  },
  {
    id: "keys",
    label: "키 분배",
    nodes: STEPS_NODES[1],
    showKeys: true,
    migratedKeys: [],
    description:
      "각 키는 시계 방향으로 가장 가까운 노드에 할당. user-42는 N2로, session-7도 N3로 — 키마다 자기 책임 노드가 정해짐.",
  },
  {
    id: "add",
    label: "N4 추가",
    nodes: STEPS_NODES[2],
    showKeys: true,
    migratedKeys: ["k4"],
    description:
      "노드 N4를 링에 추가. order-3 키가 이제 N4의 책임 (이전엔 N3). 그 외 키들은 그대로 — 단순 hash mod N과 달리 일부만 재분배.",
  },
  {
    id: "vnodes",
    label: "Virtual Nodes",
    nodes: STEPS_NODES[3],
    showKeys: true,
    migratedKeys: ["k4"],
    description:
      "실제 시스템은 각 물리 노드를 여러 가상 위치(virtual nodes, 예: 100~200개)에 배치. 불균등 분배를 평탄화하고 hot spot을 줄임 — Dynamo, Cassandra 모두 이 방식.",
  },
];

export function ConsistentHashing({ slug }: { slug: string }) {
  const { stepIndex, setStepIndex, canPrev, canNext, prev, next, reset } =
    useStepState(slug, STEPS.length);
  const step = STEPS[stepIndex];

  const CX = 200;
  const CY = 200;
  const R = 130;
  const toXY = (angle: number, r = R) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: CX + Math.cos(rad) * r, y: CY + Math.sin(rad) * r };
  };

  // For each key, find the responsible node (clockwise nearest in step.nodes)
  const sortedNodes = [...step.nodes].sort((a, b) => a.angle - b.angle);
  const keyToNode = (keyAngle: number): NodePos => {
    for (const n of sortedNodes) {
      if (n.angle >= keyAngle) return n;
    }
    return sortedNodes[0]; // wrap
  };

  return (
    <VizContainer>
      <Stepper
        steps={STEPS}
        currentIndex={stepIndex}
        onSelect={setStepIndex}
      />

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <svg viewBox="0 0 400 400" className="mx-auto block max-w-md" aria-hidden>
          {/* Ring */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            className="stroke-zinc-300 dark:stroke-zinc-700"
            strokeWidth={2}
            strokeDasharray="6 4"
          />

          {/* Keys */}
          {step.showKeys &&
            KEYS.map((k) => {
              const pos = toXY(k.angle, R - 30);
              const targetNode = keyToNode(k.angle);
              const tpos = toXY(targetNode.angle);
              const isMigrated = step.migratedKeys.includes(k.id);
              return (
                <g key={k.id}>
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={tpos.x}
                    y2={tpos.y}
                    className={
                      isMigrated
                        ? "stroke-rose-500 dark:stroke-rose-400"
                        : "stroke-zinc-300 dark:stroke-zinc-700"
                    }
                    strokeWidth={isMigrated ? 2 : 1}
                    strokeDasharray={isMigrated ? "0" : "3 3"}
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={6}
                    fill={targetNode.color}
                    className="stroke-white"
                    strokeWidth={1.5}
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 10}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-zinc-700 dark:fill-zinc-300"
                  >
                    {k.label}
                  </text>
                </g>
              );
            })}

          {/* Nodes */}
          {step.nodes.map((n) => {
            const pos = toXY(n.angle);
            return (
              <g key={n.id} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle
                  r={18}
                  fill={n.color}
                  className="stroke-white"
                  strokeWidth={3}
                />
                <text
                  textAnchor="middle"
                  y={4}
                  className="text-xs font-bold fill-white"
                >
                  {n.id}
                </text>
              </g>
            );
          })}

          {/* Center */}
          <text
            x={CX}
            y={CY + 4}
            textAnchor="middle"
            className="text-[10px] font-mono fill-zinc-400 dark:fill-zinc-500"
          >
            Hash Ring
          </text>
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
