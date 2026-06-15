"use client";

import { useEffect, useState } from "react";
import { markCompleted, markViewed } from "@/lib/progress";

type Packet = {
  direction: "c2s" | "s2c";
  flags: string;
  seq: number;
  ack: number | null;
};

type StepDef = {
  id: string;
  label: string;
  clientState: string;
  serverState: string;
  packet: Packet | null;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "idle",
    label: "초기 상태",
    clientState: "CLOSED",
    serverState: "LISTEN",
    packet: null,
    description:
      "서버는 LISTEN 상태로 연결 요청을 기다리고, 클라이언트는 아직 어떤 연결도 시도하지 않은 CLOSED 상태입니다.",
  },
  {
    id: "syn",
    label: "1. SYN",
    clientState: "SYN_SENT",
    serverState: "LISTEN",
    packet: { direction: "c2s", flags: "SYN", seq: 0, ack: null },
    description:
      "클라이언트가 SYN 플래그와 함께 초기 시퀀스 번호(seq=x, 여기선 0으로 표기)를 보내며 SYN_SENT 상태로 전이합니다.",
  },
  {
    id: "syn-ack",
    label: "2. SYN-ACK",
    clientState: "SYN_SENT",
    serverState: "SYN_RCVD",
    packet: { direction: "s2c", flags: "SYN + ACK", seq: 0, ack: 1 },
    description:
      "서버는 패킷을 받으면 SYN_RCVD로 전이하고, SYN과 ACK을 한 패킷에 담아 응답합니다. 자신의 seq=y와 클라이언트 시퀀스+1을 ack로 보냅니다.",
  },
  {
    id: "ack",
    label: "3. ACK",
    clientState: "ESTABLISHED",
    serverState: "SYN_RCVD",
    packet: { direction: "c2s", flags: "ACK", seq: 1, ack: 1 },
    description:
      "클라이언트는 서버의 응답을 받으면 ESTABLISHED 상태가 됩니다. 마지막으로 ack=y+1을 담은 ACK을 보내 서버의 SYN을 확인합니다.",
  },
  {
    id: "established",
    label: "연결 수립",
    clientState: "ESTABLISHED",
    serverState: "ESTABLISHED",
    packet: null,
    description:
      "서버가 ACK을 받으면 ESTABLISHED. 이제 양방향 데이터 송수신이 가능합니다. 흥미롭게도 양쪽 모두 상대방의 시퀀스 번호를 확인한 셈입니다.",
  },
];

export function TcpHandshake({ slug }: { slug: string }) {
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

      <p className="rounded-lg bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
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
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))}
            disabled={!canNext}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
  return (
    <div className="grid grid-cols-[minmax(120px,1fr)_2fr_minmax(120px,1fr)] items-center gap-4 py-2">
      <Endpoint label="클라이언트" state={step.clientState} />
      <PacketLane packet={step.packet} stepKey={step.id} />
      <Endpoint label="서버" state={step.serverState} />
    </div>
  );
}

function Endpoint({ label, state }: { label: string; state: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-zinc-900 bg-zinc-50 px-3 py-4 dark:border-zinc-100 dark:bg-zinc-900">
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {label}
      </span>
      <span className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
        {state}
      </span>
    </div>
  );
}

function PacketLane({
  packet,
  stepKey,
}: {
  packet: Packet | null;
  stepKey: string;
}) {
  if (!packet) {
    return (
      <div className="flex h-24 items-center justify-center text-xs text-zinc-300 dark:text-zinc-700">
        (대기 중)
      </div>
    );
  }

  const isLtr = packet.direction === "c2s";

  return (
    <div className="relative h-24" key={stepKey}>
      <svg
        className="absolute inset-0 h-full w-full text-zinc-400 dark:text-zinc-600"
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line
          x1={isLtr ? 4 : 196}
          y1="30"
          x2={isLtr ? 196 : 4}
          y2="30"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          vectorEffect="non-scaling-stroke"
        />
        {isLtr ? (
          <polygon points="196,30 188,26 188,34" fill="currentColor" />
        ) : (
          <polygon points="4,30 12,26 12,34" fill="currentColor" />
        )}
      </svg>

      <div
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
          isLtr ? "packet-travel-ltr" : "packet-travel-rtl"
        } rounded-md border border-zinc-900 bg-white px-3 py-1.5 shadow-sm dark:border-zinc-100 dark:bg-zinc-950`}
      >
        <div className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-50">
          {packet.flags}
        </div>
        <div className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
          seq={packet.seq}
          {packet.ack !== null ? `, ack=${packet.ack}` : ""}
        </div>
      </div>
    </div>
  );
}
