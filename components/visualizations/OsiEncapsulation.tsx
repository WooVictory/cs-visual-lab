"use client";

import { useEffect, useState } from "react";
import { markCompleted, markViewed } from "@/lib/progress";

type Header = {
  label: string;
  color: string;
};

type StepDef = {
  id: string;
  label: string;
  activeLayer: number; // 7 → 1 (display order top to bottom)
  pduName: string;
  headers: Header[];
  trailer: Header | null;
  payload: string;
  asBits: boolean;
  description: string;
};

const LAYERS = [
  { num: 7, name: "Application", role: "응용 (HTTP, FTP, DNS)" },
  { num: 6, name: "Presentation", role: "표현 (TLS, 인코딩)" },
  { num: 5, name: "Session", role: "세션 관리" },
  { num: 4, name: "Transport", role: "전송 (TCP/UDP)" },
  { num: 3, name: "Network", role: "네트워크 (IP, 라우팅)" },
  { num: 2, name: "Data Link", role: "데이터 링크 (이더넷, MAC)" },
  { num: 1, name: "Physical", role: "물리 (비트, 신호)" },
];

const STEPS: StepDef[] = [
  {
    id: "l7",
    label: "L7 응용",
    activeLayer: 7,
    pduName: "Data",
    headers: [],
    trailer: null,
    payload: "GET /index.html HTTP/1.1\\nHost: example.com",
    asBits: false,
    description:
      "사용자 응용 프로그램이 보낼 데이터를 만듭니다. HTTP 요청 메시지가 그대로 PDU.",
  },
  {
    id: "l4",
    label: "L4 전송",
    activeLayer: 4,
    pduName: "Segment",
    headers: [
      { label: "TCP Header", color: "bg-sky-500 dark:bg-sky-600" },
    ],
    trailer: null,
    payload: "GET /index.html HTTP/1.1...",
    asBits: false,
    description:
      "전송 계층은 TCP 헤더(출발지/목적지 포트, 시퀀스, ACK)를 앞에 붙입니다. 단위는 Segment로 부릅니다.",
  },
  {
    id: "l3",
    label: "L3 네트워크",
    activeLayer: 3,
    pduName: "Packet",
    headers: [
      { label: "IP Header", color: "bg-indigo-500 dark:bg-indigo-600" },
      { label: "TCP Header", color: "bg-sky-500 dark:bg-sky-600" },
    ],
    trailer: null,
    payload: "GET /index.html HTTP/1.1...",
    asBits: false,
    description:
      "네트워크 계층이 IP 헤더(출발지/목적지 IP, TTL)를 추가. 단위는 Packet — 라우팅 단위입니다.",
  },
  {
    id: "l2",
    label: "L2 데이터 링크",
    activeLayer: 2,
    pduName: "Frame",
    headers: [
      { label: "Eth Header", color: "bg-violet-500 dark:bg-violet-600" },
      { label: "IP Header", color: "bg-indigo-500 dark:bg-indigo-600" },
      { label: "TCP Header", color: "bg-sky-500 dark:bg-sky-600" },
    ],
    trailer: { label: "FCS", color: "bg-violet-500 dark:bg-violet-600" },
    payload: "GET /index.html HTTP/1.1...",
    asBits: false,
    description:
      "데이터 링크 계층은 이더넷 헤더(MAC 주소)와 끝에 오류 검출용 FCS를 붙입니다. 단위는 Frame.",
  },
  {
    id: "l1",
    label: "L1 물리",
    activeLayer: 1,
    pduName: "Bits",
    headers: [],
    trailer: null,
    payload: "01010111 00100001 10110010 00011101 11000110 ...",
    asBits: true,
    description:
      "물리 계층은 모든 비트를 전기/광 신호로 변환해 케이블/무선으로 전송합니다. 받는 쪽은 역순으로 헤더를 하나씩 떼어내며 올라갑니다(디캡슐화).",
  },
];

export function OsiEncapsulation({ slug }: { slug: string }) {
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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_1.4fr]">
        <LayerStack activeLayer={step.activeLayer} />
        <PacketView step={step} />
      </div>

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

function LayerStack({ activeLayer }: { activeLayer: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      {LAYERS.map((layer) => {
        const isActive = layer.num === activeLayer;
        return (
          <div
            key={layer.num}
            className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition ${
              isActive
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            }`}
          >
            <div>
              <div className="text-sm font-semibold">
                L{layer.num} · {layer.name}
              </div>
              <div
                className={`text-[11px] ${
                  isActive
                    ? "text-zinc-300 dark:text-zinc-600"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {layer.role}
              </div>
            </div>
            {isActive && (
              <span className="font-mono text-xs" aria-hidden>
                ◀
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PacketView({ step }: { step: StepDef }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          PDU
        </span>
        <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {step.pduName}
        </span>
      </div>

      {step.asBits ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs leading-6 text-zinc-700 break-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          {step.payload}
        </div>
      ) : (
        <div className="flex flex-wrap items-stretch gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">
          {step.headers.map((h, i) => (
            <div
              key={i}
              className={`flex items-center justify-center rounded px-2 py-3 text-[11px] font-mono font-bold text-white ${h.color}`}
            >
              {h.label}
            </div>
          ))}
          <div className="flex flex-1 items-center justify-center rounded bg-zinc-200 px-3 py-3 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {step.payload}
          </div>
          {step.trailer && (
            <div
              className={`flex items-center justify-center rounded px-2 py-3 text-[11px] font-mono font-bold text-white ${step.trailer.color}`}
            >
              {step.trailer.label}
            </div>
          )}
        </div>
      )}

      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
        {step.headers.length > 0
          ? "← 헤더가 앞에 누적됩니다 (캡슐화)"
          : "원본 데이터"}
      </div>
    </div>
  );
}
