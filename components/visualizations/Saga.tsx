"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type TxState = "pending" | "done" | "failed" | "compensated";

type Tx = {
  id: string;
  service: string;
  action: string;
  compensation: string;
  state: TxState;
};

type StepDef = {
  id: string;
  label: string;
  txs: Tx[];
  description: string;
};

const BASE_TXS: Omit<Tx, "state">[] = [
  { id: "t1", service: "Order", action: "주문 생성", compensation: "주문 취소" },
  { id: "t2", service: "Inventory", action: "재고 차감", compensation: "재고 복원" },
  { id: "t3", service: "Payment", action: "결제 처리", compensation: "환불" },
  { id: "t4", service: "Shipping", action: "배송 예약", compensation: "배송 취소" },
];

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    txs: BASE_TXS.map((t) => ({ ...t, state: "pending" })),
    description:
      "Saga 패턴: 분산 트랜잭션을 일련의 로컬 트랜잭션으로 분해. 한 단계 실패하면 이미 성공한 단계를 보상 트랜잭션으로 되돌립니다.",
  },
  {
    id: "t1",
    label: "1. 주문 생성",
    txs: [
      { ...BASE_TXS[0], state: "done" },
      ...BASE_TXS.slice(1).map((t) => ({ ...t, state: "pending" as TxState })),
    ],
    description:
      "Order 서비스가 주문 생성 — 로컬 트랜잭션으로 자기 DB에 저장 + '주문 생성됨' 이벤트 발행.",
  },
  {
    id: "t2",
    label: "2. 재고 차감",
    txs: [
      { ...BASE_TXS[0], state: "done" },
      { ...BASE_TXS[1], state: "done" },
      ...BASE_TXS.slice(2).map((t) => ({ ...t, state: "pending" as TxState })),
    ],
    description:
      "Inventory가 이벤트 받아 재고 차감. 여기까진 ok.",
  },
  {
    id: "t3-fail",
    label: "3. 결제 실패!",
    txs: [
      { ...BASE_TXS[0], state: "done" },
      { ...BASE_TXS[1], state: "done" },
      { ...BASE_TXS[2], state: "failed" },
      { ...BASE_TXS[3], state: "pending" },
    ],
    description:
      "결제 단계에서 실패 (카드 오류 등). 분산 환경이라 이전 단계를 일반 rollback으로 못 되돌림 — 이미 다른 DB에 커밋됨. 보상 트랜잭션을 발동해야 합니다.",
  },
  {
    id: "comp2",
    label: "보상: 재고 복원",
    txs: [
      { ...BASE_TXS[0], state: "done" },
      { ...BASE_TXS[1], state: "compensated" },
      { ...BASE_TXS[2], state: "failed" },
      { ...BASE_TXS[3], state: "pending" },
    ],
    description:
      "역순으로 보상 시작. Inventory에 '재고 복원' 명령 → 차감했던 양을 되돌림. 보상 트랜잭션도 멱등성 보장 필수.",
  },
  {
    id: "comp1",
    label: "보상: 주문 취소",
    txs: [
      { ...BASE_TXS[0], state: "compensated" },
      { ...BASE_TXS[1], state: "compensated" },
      { ...BASE_TXS[2], state: "failed" },
      { ...BASE_TXS[3], state: "pending" },
    ],
    description:
      "Order 서비스가 주문 취소 처리. 결국 시스템 전체적으로 '아무 일도 없었던 것처럼'. ACID 트랜잭션은 아니지만 결과적 일관성 달성.",
  },
];

export function Saga({ slug }: { slug: string }) {
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

      <div className="space-y-2">
        {step.txs.map((tx) => (
          <TxRow key={tx.id} tx={tx} />
        ))}
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

function TxRow({ tx }: { tx: Tx }) {
  const styles: Record<TxState, { bg: string; border: string; status: string; statusColor: string }> = {
    pending: {
      bg: "bg-white dark:bg-zinc-950",
      border: "border-zinc-300 dark:border-zinc-700",
      status: "대기",
      statusColor: "text-zinc-500 dark:text-zinc-400",
    },
    done: {
      bg: "bg-emerald-50 dark:bg-emerald-950",
      border: "border-emerald-500 dark:border-emerald-400",
      status: "✓ 완료",
      statusColor: "text-emerald-700 dark:text-emerald-300",
    },
    failed: {
      bg: "bg-rose-50 dark:bg-rose-950",
      border: "border-rose-500 dark:border-rose-400",
      status: "✗ 실패",
      statusColor: "text-rose-700 dark:text-rose-300",
    },
    compensated: {
      bg: "bg-amber-50 dark:bg-amber-950",
      border: "border-amber-500 dark:border-amber-400",
      status: "↶ 보상됨",
      statusColor: "text-amber-700 dark:text-amber-300",
    },
  };
  const s = styles[tx.state];
  return (
    <div className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 ${s.bg} ${s.border}`}>
      <div>
        <div className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          [{tx.service}]
        </div>
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {tx.action}
        </div>
        <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
          보상: {tx.compensation}
        </div>
      </div>
      <span className={`font-mono text-xs font-bold ${s.statusColor}`}>
        {s.status}
      </span>
    </div>
  );
}
