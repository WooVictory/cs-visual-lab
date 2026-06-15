"use client";

import { useEffect, useState } from "react";
import { markCompleted, markViewed } from "@/lib/progress";

type NodeId = "client" | "resolver" | "root" | "tld" | "auth";

type StepDef = {
  id: string;
  label: string;
  from?: NodeId;
  to?: NodeId;
  message?: string;
  highlight: NodeId[];
  description: string;
};

const NODES: Record<NodeId, { label: string; sub: string; x: number }> = {
  client: { label: "클라이언트", sub: "브라우저", x: 50 },
  resolver: { label: "Resolver", sub: "ISP DNS", x: 225 },
  root: { label: "Root NS", sub: "·  (root)", x: 400 },
  tld: { label: "TLD NS", sub: ".com", x: 575 },
  auth: { label: "Auth NS", sub: "example.com", x: 750 },
};

const NODE_ORDER: NodeId[] = ["client", "resolver", "root", "tld", "auth"];

const STEPS: StepDef[] = [
  {
    id: "idle",
    label: "초기 상태",
    highlight: [],
    description:
      "브라우저가 www.example.com을 IP로 변환해야 합니다. 모든 캐시가 비어있다고 가정합니다.",
  },
  {
    id: "q1",
    label: "1. 재귀 질의",
    from: "client",
    to: "resolver",
    message: "www.example.com?",
    highlight: ["client", "resolver"],
    description:
      "클라이언트가 로컬 리졸버(ISP DNS)에게 '답을 알아다 줘' 형식의 재귀 질의를 보냅니다. 이후 클라이언트는 응답을 기다리기만 합니다.",
  },
  {
    id: "q2",
    label: "2. → Root",
    from: "resolver",
    to: "root",
    message: ".com NS는?",
    highlight: ["resolver", "root"],
    description:
      "리졸버는 캐시가 없으니 루트 네임서버부터 묻습니다. Root는 .com을 책임지는 TLD NS의 위치를 알려줍니다.",
  },
  {
    id: "q3",
    label: "3. → TLD",
    from: "resolver",
    to: "tld",
    message: "example.com NS는?",
    highlight: ["resolver", "tld"],
    description:
      "리졸버가 .com TLD 네임서버에게 'example.com 도메인의 권한 네임서버 위치'를 묻습니다.",
  },
  {
    id: "q4",
    label: "4. → Auth",
    from: "resolver",
    to: "auth",
    message: "www.example.com IP는?",
    highlight: ["resolver", "auth"],
    description:
      "리졸버가 example.com 권한 네임서버에게 호스트명 www의 실제 IP를 묻습니다. 권한 NS는 해당 도메인의 진짜 레코드를 보유합니다.",
  },
  {
    id: "a",
    label: "5. 응답 + 캐시",
    from: "resolver",
    to: "client",
    message: "1.2.3.4 (TTL 동안 캐시)",
    highlight: ["resolver", "client", "auth"],
    description:
      "권한 NS의 응답을 받은 리졸버는 TTL 동안 결과를 캐시하고 클라이언트에게 IP를 돌려줍니다. 같은 도메인에 대한 다음 요청은 위 단계 없이 캐시에서 즉시 응답됩니다.",
  },
];

export function DnsResolution({ slug }: { slug: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  useEffect(() => {
    markViewed(slug);
  }, [slug]);

  useEffect(() => {
    if (stepIndex === STEPS.length - 1) {
      markCompleted(slug);
    }
  }, [stepIndex, slug]);

  const canPrev = stepIndex > 0;
  const canNext = stepIndex < STEPS.length - 1;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <Stepper currentIndex={stepIndex} onSelect={setStepIndex} />

      <Diagram step={step} />

      <p className="rounded-lg bg-zinc-50 p-5 text-[15px] leading-7 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        {step.description}
      </p>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStepIndex(0)}
          className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          처음으로
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
            className="rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() =>
              setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))
            }
            disabled={!canNext}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {canNext ? "다음 단계" : "끝"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stepper({
  currentIndex,
  onSelect,
}: {
  currentIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <ol className="flex items-center justify-between gap-2">
      {STEPS.map((s, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(i)}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition ${
                isDone
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : isCurrent
                  ? "border-zinc-900 bg-white text-zinc-900 dark:border-zinc-100 dark:bg-zinc-950 dark:text-zinc-100"
                  : "border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-600"
              }`}
              aria-label={`단계 ${i + 1}: ${s.label}`}
            >
              {i + 1}
            </button>
            <span
              className={`hidden truncate text-xs sm:inline ${
                isCurrent
                  ? "font-medium text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="hidden h-px flex-1 bg-zinc-200 sm:block dark:bg-zinc-800" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Diagram({ step }: { step: StepDef }) {
  const fromNode = step.from ? NODES[step.from] : null;
  const toNode = step.to ? NODES[step.to] : null;

  const VIEW_W = 800;
  const NODE_W = 100;
  const NODE_H = 60;
  const NODE_Y = 80;
  const ARROW_Y = 30;

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <svg
        viewBox={`0 0 ${VIEW_W} 180`}
        className="min-w-[640px] text-zinc-400 dark:text-zinc-600"
        aria-hidden
      >
        {/* Arrow */}
        {fromNode && toNode && (
          <ArrowPath
            fromX={fromNode.x + NODE_W / 2}
            toX={toNode.x + NODE_W / 2}
            y={ARROW_Y}
            nodeTopY={NODE_Y}
            message={step.message ?? ""}
          />
        )}

        {/* Nodes */}
        {NODE_ORDER.map((id) => {
          const n = NODES[id];
          const isHighlighted = step.highlight.includes(id);
          return (
            <g key={id} transform={`translate(${n.x}, ${NODE_Y})`}>
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={8}
                className={
                  isHighlighted
                    ? "fill-zinc-900 stroke-zinc-900 dark:fill-zinc-100 dark:stroke-zinc-100"
                    : "fill-white stroke-zinc-300 dark:fill-zinc-950 dark:stroke-zinc-700"
                }
                strokeWidth={1.5}
              />
              <text
                x={NODE_W / 2}
                y={26}
                textAnchor="middle"
                className={`text-[13px] font-semibold ${
                  isHighlighted
                    ? "fill-white dark:fill-zinc-900"
                    : "fill-zinc-900 dark:fill-zinc-100"
                }`}
              >
                {n.label}
              </text>
              <text
                x={NODE_W / 2}
                y={44}
                textAnchor="middle"
                className={`text-[10px] font-mono ${
                  isHighlighted
                    ? "fill-zinc-300 dark:fill-zinc-600"
                    : "fill-zinc-500 dark:fill-zinc-400"
                }`}
              >
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ArrowPath({
  fromX,
  toX,
  y,
  nodeTopY,
  message,
}: {
  fromX: number;
  toX: number;
  y: number;
  nodeTopY: number;
  message: string;
}) {
  const isLtr = fromX < toX;
  const midX = (fromX + toX) / 2;
  const ctrlOffset = Math.abs(toX - fromX) * 0.25;
  const startY = nodeTopY;
  const path = `M ${fromX} ${startY} Q ${midX} ${y} ${toX} ${startY}`;
  const arrowSize = 6;

  return (
    <g>
      <path
        d={path}
        className="stroke-zinc-900 dark:stroke-zinc-100"
        strokeWidth={1.5}
        fill="none"
        strokeDasharray="0"
      />
      {/* Arrowhead at toX */}
      <polygon
        points={
          isLtr
            ? `${toX},${startY} ${toX - arrowSize},${startY - arrowSize} ${toX - arrowSize},${startY + arrowSize}`
            : `${toX},${startY} ${toX + arrowSize},${startY - arrowSize} ${toX + arrowSize},${startY + arrowSize}`
        }
        className="fill-zinc-900 dark:fill-zinc-100"
      />
      {/* Message */}
      <text
        x={midX}
        y={y - 4}
        textAnchor="middle"
        className="text-[11px] font-mono fill-zinc-700 dark:fill-zinc-300"
      >
        {message}
      </text>
    </g>
  );
}
