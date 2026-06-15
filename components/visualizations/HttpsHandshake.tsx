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
    id: "tcp",
    label: "TCP 수립",
    clientState: "TCP CONNECTED",
    serverState: "TCP CONNECTED",
    packet: null,
    description:
      "TLS는 TCP 위에서 동작합니다. 먼저 TCP 3-way handshake로 신뢰성 있는 연결이 수립되어 있어야 합니다.",
  },
  {
    id: "client-hello",
    label: "ClientHello",
    clientState: "WAIT_SERVER_HELLO",
    serverState: "TCP CONNECTED",
    packet: {
      direction: "c2s",
      flags: "ClientHello",
      detail: "지원 TLS 버전, cipher suites, client random",
    },
    description:
      "클라이언트가 지원하는 TLS 버전과 cipher suite 목록, 그리고 client random(난수)을 보냅니다.",
  },
  {
    id: "server-hello",
    label: "ServerHello + Cert",
    clientState: "WAIT_SERVER_HELLO",
    serverState: "WAIT_CLIENT_KEY",
    packet: {
      direction: "s2c",
      flags: "ServerHello + Certificate",
      detail: "선택된 cipher, server random, X.509 인증서",
    },
    description:
      "서버가 cipher suite를 선택해 알리고, server random과 인증서(공개키 포함)를 보냅니다.",
  },
  {
    id: "key-exchange",
    label: "키 교환",
    clientState: "VERIFY + KEY_EXCHANGE",
    serverState: "WAIT_CLIENT_KEY",
    packet: {
      direction: "c2s",
      flags: "ClientKeyExchange",
      detail: "ECDHE 공유 + 사인",
    },
    description:
      "클라이언트가 인증서를 CA 체인으로 검증 후, ECDHE 키 교환을 위한 자신의 공개 파라미터를 보냅니다. 양쪽이 같은 pre-master secret을 계산할 수 있게 됩니다.",
  },
  {
    id: "finished",
    label: "Finished",
    clientState: "ESTABLISHED",
    serverState: "ESTABLISHED",
    packet: {
      direction: "s2c",
      flags: "Finished (양쪽)",
      detail: "ChangeCipherSpec → 암호화 시작",
    },
    description:
      "양쪽이 master secret으로 세션 키를 도출하고, ChangeCipherSpec + Finished를 교환합니다. 이후 모든 통신은 대칭키 암호화로 보호됩니다.",
  },
];

export function HttpsHandshake({ slug }: { slug: string }) {
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
        (TCP 연결만 수립된 상태)
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
