"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Packet = {
  direction: "c2s" | "s2c";
  flags: string;
  detail: string;
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
    id: "http",
    label: "초기 HTTP",
    clientState: "HTTP",
    serverState: "HTTP",
    packet: null,
    description:
      "WebSocket은 HTTP 위에서 시작합니다. 같은 포트(80/443)로 HTTP처럼 연결을 맺은 뒤 프로토콜을 업그레이드합니다.",
  },
  {
    id: "upgrade-req",
    label: "Upgrade 요청",
    clientState: "WAIT_UPGRADE",
    serverState: "HTTP",
    packet: {
      direction: "c2s",
      flags: "GET / HTTP/1.1",
      detail: "Upgrade: websocket, Sec-WebSocket-Key",
    },
    description:
      "클라이언트가 'Upgrade: websocket' 헤더와 함께 핸드셰이크 요청을 보냅니다. 같은 TCP 연결을 WebSocket으로 전환하자는 신호.",
  },
  {
    id: "switching",
    label: "101 응답",
    clientState: "WS_OPEN",
    serverState: "WS_OPEN",
    packet: {
      direction: "s2c",
      flags: "101 Switching Protocols",
      detail: "Sec-WebSocket-Accept",
    },
    description:
      "서버가 101 응답으로 업그레이드를 수락. 이제 양쪽이 WebSocket 프레임을 자유롭게 주고받을 수 있습니다.",
  },
  {
    id: "server-push",
    label: "서버 push",
    clientState: "WS_OPEN",
    serverState: "WS_OPEN",
    packet: {
      direction: "s2c",
      flags: "Frame",
      detail: '{"type":"notif","msg":"새 메시지"}',
    },
    description:
      "HTTP와 달리 서버가 먼저 메시지를 보낼 수 있습니다. 폴링 없이 실시간 이벤트 전달이 가능 — 이것이 WebSocket의 핵심.",
  },
  {
    id: "client-msg",
    label: "양방향 통신",
    clientState: "WS_OPEN",
    serverState: "WS_OPEN",
    packet: {
      direction: "c2s",
      flags: "Frame",
      detail: '{"type":"ack","id":42}',
    },
    description:
      "클라이언트도 같은 연결로 응답을 보냅니다. 한 TCP 연결 위에서 양쪽이 자유롭게 메시지를 교환 (Full-duplex).",
  },
  {
    id: "close",
    label: "종료",
    clientState: "CLOSING",
    serverState: "CLOSED",
    packet: {
      direction: "c2s",
      flags: "Close Frame",
      detail: "code=1000 normal closure",
    },
    description:
      "한쪽이 Close 프레임을 보내면 다른 쪽도 Close로 응답하고 TCP 연결을 종료합니다.",
  },
];

export function WebSocketViz({ slug }: { slug: string }) {
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
      <div className="grid grid-cols-[minmax(120px,1fr)_2fr_minmax(120px,1fr)] items-center gap-4 py-2">
        <Endpoint label="클라이언트" state={step.clientState} />
        <PacketLane packet={step.packet} stepKey={step.id} />
        <Endpoint label="서버" state={step.serverState} />
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

function Endpoint({ label, state }: { label: string; state: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-zinc-900 bg-zinc-50 px-3 py-4 dark:border-zinc-100 dark:bg-zinc-900">
      <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {label}
      </span>
      <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
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
        (HTTP 연결만 수립)
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
        } rounded-md border border-zinc-900 bg-white px-3 py-2 shadow-sm dark:border-zinc-100 dark:bg-zinc-950`}
      >
        <div className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-50">
          {packet.flags}
        </div>
        <div className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
          {packet.detail}
        </div>
      </div>
    </div>
  );
}
