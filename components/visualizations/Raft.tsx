"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Role = "follower" | "candidate" | "leader";

type Node = {
  id: string;
  x: number;
  y: number;
  role: Role;
  term: number;
  log: number[];
  votedFor?: string;
};

type StepDef = {
  id: string;
  label: string;
  nodes: Node[];
  arrows: Array<{ from: string; to: string; label: string }>;
  description: string;
};

const POSITIONS: Record<string, { x: number; y: number }> = {
  N1: { x: 250, y: 60 },
  N2: { x: 130, y: 200 },
  N3: { x: 370, y: 200 },
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    nodes: [
      { id: "N1", ...POSITIONS.N1, role: "follower", term: 1, log: [] },
      { id: "N2", ...POSITIONS.N2, role: "follower", term: 1, log: [] },
      { id: "N3", ...POSITIONS.N3, role: "follower", term: 1, log: [] },
    ],
    arrows: [],
    description:
      "Raft 클러스터 3개 노드 모두 follower 상태. 리더가 일정 시간 heartbeat를 안 보내면 follower가 candidate로 전환.",
  },
  {
    id: "candidate",
    label: "후보 등장",
    nodes: [
      { id: "N1", ...POSITIONS.N1, role: "candidate", term: 2, log: [], votedFor: "N1" },
      { id: "N2", ...POSITIONS.N2, role: "follower", term: 1, log: [] },
      { id: "N3", ...POSITIONS.N3, role: "follower", term: 1, log: [] },
    ],
    arrows: [
      { from: "N1", to: "N2", label: "RequestVote(term=2)" },
      { from: "N1", to: "N3", label: "RequestVote(term=2)" },
    ],
    description:
      "N1의 election timeout 만료 → 후보가 됨. term을 2로 올리고 자신에게 투표한 후, 다른 노드에게 투표 요청.",
  },
  {
    id: "votes",
    label: "투표 수집",
    nodes: [
      { id: "N1", ...POSITIONS.N1, role: "candidate", term: 2, log: [], votedFor: "N1" },
      { id: "N2", ...POSITIONS.N2, role: "follower", term: 2, log: [], votedFor: "N1" },
      { id: "N3", ...POSITIONS.N3, role: "follower", term: 2, log: [], votedFor: "N1" },
    ],
    arrows: [
      { from: "N2", to: "N1", label: "Vote(yes)" },
      { from: "N3", to: "N1", label: "Vote(yes)" },
    ],
    description:
      "N2, N3가 term 2 처음 본 거고 N1 로그가 자기보다 안 뒤떨어졌으므로 yes 투표. N1은 자신 표 1 + 2표 = 과반(3개 중 2개) 획득.",
  },
  {
    id: "leader",
    label: "리더 선출",
    nodes: [
      { id: "N1", ...POSITIONS.N1, role: "leader", term: 2, log: [], votedFor: "N1" },
      { id: "N2", ...POSITIONS.N2, role: "follower", term: 2, log: [], votedFor: "N1" },
      { id: "N3", ...POSITIONS.N3, role: "follower", term: 2, log: [], votedFor: "N1" },
    ],
    arrows: [
      { from: "N1", to: "N2", label: "Heartbeat" },
      { from: "N1", to: "N3", label: "Heartbeat" },
    ],
    description:
      "N1이 리더가 됨. 모든 follower에게 주기적으로 heartbeat 전송 — '내가 살아있다, 다른 후보 되지 마라'. 리더가 끊기면 다시 election.",
  },
  {
    id: "replicate",
    label: "로그 복제",
    nodes: [
      { id: "N1", ...POSITIONS.N1, role: "leader", term: 2, log: [42], votedFor: "N1" },
      { id: "N2", ...POSITIONS.N2, role: "follower", term: 2, log: [42], votedFor: "N1" },
      { id: "N3", ...POSITIONS.N3, role: "follower", term: 2, log: [42], votedFor: "N1" },
    ],
    arrows: [
      { from: "N1", to: "N2", label: "AppendEntries(42)" },
      { from: "N1", to: "N3", label: "AppendEntries(42)" },
    ],
    description:
      "클라이언트 요청 → 리더가 로그 추가 → follower에게 복제. 과반이 저장하면 commit. 안전성 보장: commit된 entry는 절대 사라지지 않음.",
  },
];

const ROLE_STYLE: Record<Role, string> = {
  follower: "fill-white stroke-zinc-500 dark:fill-zinc-950 dark:stroke-zinc-400",
  candidate: "fill-amber-200 stroke-amber-600 dark:fill-amber-900 dark:stroke-amber-400",
  leader: "fill-emerald-500 stroke-emerald-700 dark:fill-emerald-600 dark:stroke-emerald-300",
};

export function Raft({ slug }: { slug: string }) {
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

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <svg viewBox="0 0 500 280" className="w-full" aria-hidden>
          {/* Arrows */}
          {step.arrows.map((a, i) => {
            const from = step.nodes.find((n) => n.id === a.from)!;
            const to = step.nodes.find((n) => n.id === a.to)!;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = Math.hypot(dx, dy);
            const ux = dx / len;
            const uy = dy / len;
            const PAD = 32;
            const x1 = from.x + ux * PAD;
            const y1 = from.y + uy * PAD;
            const x2 = to.x - ux * PAD;
            const y2 = to.y - uy * PAD;
            return (
              <g key={i} className="stroke-emerald-600 dark:stroke-emerald-400">
                <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={2} />
                <polygon
                  points={`${x2},${y2} ${x2 - ux * 8 - uy * 5},${y2 - uy * 8 + ux * 5} ${x2 - ux * 8 + uy * 5},${y2 - uy * 8 - ux * 5}`}
                  className="fill-emerald-600 dark:fill-emerald-400"
                  stroke="none"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 6}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-zinc-700 dark:fill-zinc-300"
                  stroke="none"
                >
                  {a.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {step.nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
              <circle r={30} className={ROLE_STYLE[n.role]} strokeWidth={2.5} />
              <text textAnchor="middle" y={-4} className="text-sm font-bold fill-zinc-900 dark:fill-zinc-50">
                {n.id}
              </text>
              <text textAnchor="middle" y={10} className="text-[9px] font-mono fill-zinc-700 dark:fill-zinc-300">
                {n.role}
              </text>
              <text textAnchor="middle" y={22} className="text-[9px] font-mono fill-zinc-500 dark:fill-zinc-400">
                term {n.term}{n.log.length > 0 ? ` log[${n.log.join(",")}]` : ""}
              </text>
            </g>
          ))}
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
