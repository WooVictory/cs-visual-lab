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
  blocked?: boolean;
};

type StepDef = {
  id: string;
  label: string;
  packet: Packet | null;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    packet: null,
    description:
      "프론트엔드 https://app.example.com이 API https://api.other.com에 POST 요청을 보내려 합니다. 출처(origin)가 다르므로 브라우저가 CORS 정책을 검사합니다.",
  },
  {
    id: "preflight-req",
    label: "Preflight 요청",
    packet: {
      direction: "c2s",
      flags: "OPTIONS /data",
      detail: "Origin: app.example.com / Access-Control-Request-Method: POST",
    },
    description:
      "POST + Content-Type: application/json은 '단순 요청'이 아니므로, 브라우저가 자동으로 Preflight(OPTIONS)를 먼저 보내 서버 허용 여부를 확인합니다.",
  },
  {
    id: "preflight-res",
    label: "Preflight 응답",
    packet: {
      direction: "s2c",
      flags: "204 No Content",
      detail:
        "Allow-Origin: app.example.com / Allow-Methods: POST / Allow-Headers: Content-Type",
    },
    description:
      "서버가 허용 origin, 메서드, 헤더를 응답. 브라우저는 이 헤더들을 검사하고 통과하면 본 요청을 진행합니다.",
  },
  {
    id: "actual-req",
    label: "본 요청",
    packet: {
      direction: "c2s",
      flags: "POST /data",
      detail: "Origin: app.example.com / Content-Type: application/json",
    },
    description:
      "Preflight 통과 후 실제 POST 요청을 보냅니다. 서버는 평소처럼 처리하면 됩니다.",
  },
  {
    id: "actual-res",
    label: "응답",
    packet: {
      direction: "s2c",
      flags: "200 OK",
      detail: "Access-Control-Allow-Origin: app.example.com 필수",
    },
    description:
      "응답에도 Access-Control-Allow-Origin 헤더가 있어야 브라우저가 응답 본문을 자바스크립트에 노출합니다. 없으면 CORS 에러로 차단.",
  },
];

export function CorsViz({ slug }: { slug: string }) {
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
      <div className="grid grid-cols-[minmax(140px,1fr)_2fr_minmax(140px,1fr)] items-center gap-4 py-2">
        <Endpoint label="브라우저 / SPA" sub="app.example.com" />
        <PacketLane packet={step.packet} stepKey={step.id} />
        <Endpoint label="API 서버" sub="api.other.com" />
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

function Endpoint({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-zinc-900 bg-zinc-50 px-3 py-4 dark:border-zinc-100 dark:bg-zinc-900">
      <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {label}
      </span>
      <span className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
        {sub}
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
        (요청 시도 전)
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
        } max-w-[260px] rounded-md border border-zinc-900 bg-white px-3 py-2 shadow-sm dark:border-zinc-100 dark:bg-zinc-950`}
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
