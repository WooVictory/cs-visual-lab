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
  cacheState: "empty" | "filled";
  activeArrow: "browser-edge" | "edge-origin" | "origin-edge" | "edge-browser" | "browser-edge-2" | "edge-browser-2" | null;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    cacheState: "empty",
    activeArrow: null,
    description:
      "브라우저가 서울에서, Edge가 서울, Origin이 미국에 있다고 가정. Edge 캐시는 비어있는 상태.",
  },
  {
    id: "req1",
    label: "첫 요청",
    cacheState: "empty",
    activeArrow: "browser-edge",
    description:
      "브라우저가 /image.jpg를 요청. DNS가 가장 가까운 Edge로 라우팅 → 서울 Edge에 도달.",
  },
  {
    id: "miss",
    label: "Cache Miss",
    cacheState: "empty",
    activeArrow: "edge-origin",
    description:
      "Edge 캐시에 없음 (cache miss). Origin(미국)으로 전달 — 이때 RTT가 길어 약간의 지연 발생.",
  },
  {
    id: "fill",
    label: "Origin 응답 + 캐시 저장",
    cacheState: "filled",
    activeArrow: "origin-edge",
    description:
      "Origin이 응답. Edge가 응답을 캐시에 저장 (Cache-Control: max-age 기준). 다음 요청은 Origin 없이 즉시 처리됨.",
  },
  {
    id: "first-done",
    label: "Edge → Browser",
    cacheState: "filled",
    activeArrow: "edge-browser",
    description:
      "Edge가 캐시 저장과 동시에 브라우저에 응답. 첫 사용자는 한 번의 origin RTT를 감수 — 캐시 워밍.",
  },
  {
    id: "req2",
    label: "다음 요청 (Hit)",
    cacheState: "filled",
    activeArrow: "browser-edge-2",
    description:
      "다른 사용자(또는 같은 사용자)가 같은 URL 요청. Edge에 캐시 있음 → cache hit.",
  },
  {
    id: "hit-done",
    label: "Edge 즉시 응답",
    cacheState: "filled",
    activeArrow: "edge-browser-2",
    description:
      "Edge가 origin 없이 즉시 응답. Latency: 수 ms (vs 수십~수백 ms). 이게 CDN의 핵심 — 지리적으로 가까운 캐시로 origin 부하를 줄이고 사용자 경험을 빠르게.",
  },
];

export function Cdn({ slug }: { slug: string }) {
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
        <svg viewBox="0 0 700 200" className="w-full" aria-hidden>
          <Box x={20} y={70} w={110} h={60} label="Browser" sub="서울" />
          <Box
            x={280}
            y={70}
            w={130}
            h={60}
            label="Edge"
            sub={step.cacheState === "filled" ? "✓ cached" : "(empty)"}
            cached={step.cacheState === "filled"}
          />
          <Box x={560} y={70} w={120} h={60} label="Origin" sub="미국" />

          <Arrow
            x1={130}
            y1={100}
            x2={280}
            y2={100}
            active={
              step.activeArrow === "browser-edge" ||
              step.activeArrow === "browser-edge-2"
            }
            label={
              step.activeArrow === "browser-edge"
                ? "GET /image.jpg"
                : step.activeArrow === "browser-edge-2"
                ? "GET /image.jpg"
                : ""
            }
            below
          />
          <Arrow
            x1={280}
            y1={100}
            x2={130}
            y2={100}
            active={
              step.activeArrow === "edge-browser" ||
              step.activeArrow === "edge-browser-2"
            }
            label={
              step.activeArrow === "edge-browser-2"
                ? "Cache HIT (즉시)"
                : step.activeArrow === "edge-browser"
                ? "200 + 캐시 저장"
                : ""
            }
            above
          />
          <Arrow
            x1={410}
            y1={100}
            x2={560}
            y2={100}
            active={step.activeArrow === "edge-origin"}
            label={
              step.activeArrow === "edge-origin"
                ? "Cache MISS → fetch"
                : ""
            }
            below
          />
          <Arrow
            x1={560}
            y1={100}
            x2={410}
            y2={100}
            active={step.activeArrow === "origin-edge"}
            label={step.activeArrow === "origin-edge" ? "origin 응답" : ""}
            above
          />
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

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  cached,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  cached?: boolean;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={w}
        height={h}
        rx={8}
        className={
          cached
            ? "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950 dark:stroke-emerald-400"
            : "fill-white stroke-zinc-400 dark:fill-zinc-950 dark:stroke-zinc-600"
        }
        strokeWidth={2}
      />
      <text
        x={w / 2}
        y={h / 2 - 3}
        textAnchor="middle"
        className="text-sm font-semibold fill-zinc-900 dark:fill-zinc-50"
      >
        {label}
      </text>
      {sub && (
        <text
          x={w / 2}
          y={h / 2 + 14}
          textAnchor="middle"
          className={`text-[11px] font-mono ${
            cached
              ? "fill-emerald-700 dark:fill-emerald-300"
              : "fill-zinc-500 dark:fill-zinc-400"
          }`}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  active,
  label,
  below,
  above,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  label: string;
  below?: boolean;
  above?: boolean;
}) {
  const dx = x2 - x1;
  const yOffset = above ? -10 : below ? 10 : 0;
  const labelY = y1 + yOffset + (above ? -6 : 18);
  const midX = (x1 + x2) / 2;
  return (
    <g
      className={
        active
          ? "stroke-zinc-900 dark:stroke-zinc-100"
          : "stroke-zinc-200 dark:stroke-zinc-800"
      }
    >
      <line
        x1={x1}
        y1={y1 + yOffset}
        x2={x2 - (dx > 0 ? 8 : -8)}
        y2={y2 + yOffset}
        strokeWidth={active ? 2 : 1}
      />
      <polygon
        points={
          dx > 0
            ? `${x2},${y2 + yOffset} ${x2 - 8},${y2 + yOffset - 4} ${x2 - 8},${y2 + yOffset + 4}`
            : `${x2},${y2 + yOffset} ${x2 + 8},${y2 + yOffset - 4} ${x2 + 8},${y2 + yOffset + 4}`
        }
        className={
          active
            ? "fill-zinc-900 dark:fill-zinc-100"
            : "fill-zinc-200 dark:fill-zinc-800"
        }
        stroke="none"
      />
      {active && label && (
        <text
          x={midX}
          y={labelY}
          textAnchor="middle"
          className="text-[11px] font-mono fill-zinc-700 dark:fill-zinc-300"
          stroke="none"
        >
          {label}
        </text>
      )}
    </g>
  );
}
