"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type MsgState = "queued" | "delivering" | "ack" | "failed";

type StepDef = {
  id: string;
  label: string;
  queue: { id: string; state: MsgState }[];
  producer: string;
  consumer: string;
  consumerLag: number;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    queue: [],
    producer: "Order Service",
    consumer: "Notification Service",
    consumerLag: 0,
    description:
      "Producer가 메시지를 큐에 publish, Consumer가 subscribe해서 처리. 두 서비스는 서로 모르고 큐만 안다 — 결합도↓.",
  },
  {
    id: "produce",
    label: "Producer 발행",
    queue: [
      { id: "msg-1", state: "queued" },
      { id: "msg-2", state: "queued" },
      { id: "msg-3", state: "queued" },
    ],
    producer: "→ 3개 메시지 발행",
    consumer: "대기 중",
    consumerLag: 3,
    description:
      "Producer가 3개 메시지를 큐에 던짐. Consumer가 아직 처리 안 했으므로 큐에 쌓임. 이게 시간/공간 디커플링.",
  },
  {
    id: "consume1",
    label: "Consumer 처리 시작",
    queue: [
      { id: "msg-1", state: "delivering" },
      { id: "msg-2", state: "queued" },
      { id: "msg-3", state: "queued" },
    ],
    producer: "(쉬는 중)",
    consumer: "msg-1 처리 중",
    consumerLag: 3,
    description:
      "Consumer가 msg-1 fetch. 처리 중에 ack 보내기 전까지는 다른 consumer가 못 가져감 (at-least-once).",
  },
  {
    id: "ack1",
    label: "ack 후 다음",
    queue: [
      { id: "msg-2", state: "delivering" },
      { id: "msg-3", state: "queued" },
    ],
    producer: "(쉬는 중)",
    consumer: "msg-2 처리 중",
    consumerLag: 2,
    description:
      "Consumer가 msg-1 처리 완료 → ack → 큐에서 제거. 다음 메시지 fetch. 처리 중 실패해서 ack 못 보내면 메시지 복구 → 재처리.",
  },
  {
    id: "fail",
    label: "처리 실패",
    queue: [
      { id: "msg-2", state: "failed" },
      { id: "msg-3", state: "queued" },
    ],
    producer: "(쉬는 중)",
    consumer: "예외! 재시도",
    consumerLag: 2,
    description:
      "msg-2 처리 중 예외 발생. ack 안 보냄 → 큐가 메시지 복구. 재시도 N번 후에도 실패 시 Dead Letter Queue로 격리.",
  },
  {
    id: "done",
    label: "처리 완료",
    queue: [],
    producer: "(쉬는 중)",
    consumer: "전부 처리 완료",
    consumerLag: 0,
    description:
      "모두 처리. 메시지 큐의 가치: backpressure(생산이 빨라도 큐가 흡수), 재시도/내구성, 여러 consumer 확장(같은 메시지를 여러 그룹이 처리 — Kafka 모델).",
  },
];

export function MessageQueue({ slug }: { slug: string }) {
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
        <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-3">
          <Endpoint label="Producer" sub={step.producer} />
          <QueueView messages={step.queue} lag={step.consumerLag} />
          <Endpoint label="Consumer" sub={step.consumer} />
        </div>
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
    <div className="flex flex-col items-center gap-1 rounded-xl border-2 border-zinc-900 bg-white p-3 dark:border-zinc-100 dark:bg-zinc-950">
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {label}
      </span>
      <span className="text-center font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
        {sub}
      </span>
    </div>
  );
}

function QueueView({
  messages,
  lag,
}: {
  messages: { id: string; state: MsgState }[];
  lag: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Queue (lag: {lag})
      </div>
      <div className="flex min-h-[60px] w-full items-center gap-1 rounded-lg border-2 border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950">
        {messages.length === 0 ? (
          <span className="flex-1 text-center text-xs text-zinc-400 dark:text-zinc-600">
            (비어있음)
          </span>
        ) : (
          messages.map((m) => {
            const colorClass =
              m.state === "delivering"
                ? "bg-amber-400 dark:bg-amber-500"
                : m.state === "failed"
                ? "bg-rose-500 dark:bg-rose-600"
                : "bg-sky-500 dark:bg-sky-600";
            return (
              <div
                key={m.id}
                className={`flex flex-1 flex-col items-center justify-center rounded px-1 py-1.5 text-[9px] font-mono text-white ${colorClass}`}
              >
                <span>{m.id}</span>
                <span className="opacity-80">{m.state}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
