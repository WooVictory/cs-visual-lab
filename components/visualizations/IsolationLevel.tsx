"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type RowOp = {
  who: "T1" | "T2";
  text: string;
  highlight?: boolean;
};

type StepDef = {
  id: string;
  label: string;
  ops: RowOp[];
  rcResult: string;
  rrResult: string;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    ops: [],
    rcResult: "—",
    rrResult: "—",
    description:
      "초기 상태: account 테이블에 balance = 100. 두 트랜잭션 T1, T2가 같은 행을 동시에 다룹니다. Read Committed와 Repeatable Read 결과를 비교합니다.",
  },
  {
    id: "t1-begin",
    label: "T1 시작",
    ops: [
      { who: "T1", text: "BEGIN" },
      { who: "T1", text: "SELECT balance FROM account WHERE id=1", highlight: true },
    ],
    rcResult: "T1 read: 100",
    rrResult: "T1 read: 100 (스냅샷 시작)",
    description:
      "T1이 트랜잭션을 시작하고 balance를 처음 읽습니다. 100을 받습니다.",
  },
  {
    id: "t2-write",
    label: "T2 UPDATE + COMMIT",
    ops: [
      { who: "T1", text: "BEGIN" },
      { who: "T1", text: "SELECT balance → 100" },
      { who: "T2", text: "BEGIN" },
      { who: "T2", text: "UPDATE account SET balance=200 WHERE id=1", highlight: true },
      { who: "T2", text: "COMMIT" },
    ],
    rcResult: "T2가 200으로 커밋함",
    rrResult: "T2가 200으로 커밋함",
    description:
      "T2가 같은 행의 값을 200으로 바꾸고 커밋합니다. 두 격리 수준에서 T2 자체 동작은 같지만, 다음 단계에서 T1이 보는 값이 달라집니다.",
  },
  {
    id: "t1-reread",
    label: "T1 재조회",
    ops: [
      { who: "T1", text: "BEGIN" },
      { who: "T1", text: "SELECT balance → 100" },
      { who: "T2", text: "BEGIN ... COMMIT (set 200)" },
      { who: "T1", text: "SELECT balance FROM account WHERE id=1", highlight: true },
    ],
    rcResult: "T1 read: 200 (Non-repeatable Read 발생!)",
    rrResult: "T1 read: 100 (스냅샷 유지)",
    description:
      "T1이 같은 쿼리를 다시 실행. Read Committed는 커밋된 최신값(200)을 반환하므로 같은 트랜잭션 내 두 번의 read가 다른 값을 보임 — Non-repeatable Read. Repeatable Read는 트랜잭션 시작 시점의 스냅샷을 유지해 100 그대로.",
  },
  {
    id: "summary",
    label: "비교",
    ops: [
      { who: "T1", text: "BEGIN" },
      { who: "T1", text: "SELECT → 100" },
      { who: "T2", text: "UPDATE 200 + COMMIT" },
      { who: "T1", text: "SELECT → ?" },
      { who: "T1", text: "COMMIT" },
    ],
    rcResult: "100 → 200 (불일관)",
    rrResult: "100 → 100 (일관)",
    description:
      "Repeatable Read는 한 트랜잭션 안의 read 일관성을 보장. 단, Phantom Read(같은 조건 쿼리의 결과 집합 크기 변화)는 SQL 표준상 여전히 가능 — Serializable에서만 완전 차단.",
  },
];

export function IsolationLevel({ slug }: { slug: string }) {
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

      <Timeline ops={step.ops} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ResultCard
          title="Read Committed"
          result={step.rcResult}
          tone="warning"
        />
        <ResultCard
          title="Repeatable Read"
          result={step.rrResult}
          tone="ok"
        />
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

function Timeline({ ops }: { ops: RowOp[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <Column title="T1" ops={ops.filter((o) => o.who === "T1")} />
      <Column title="T2" ops={ops.filter((o) => o.who === "T2")} />
    </div>
  );
}

function Column({ title, ops }: { title: string; ops: RowOp[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </div>
      {ops.length === 0 && (
        <div className="text-xs text-zinc-400 dark:text-zinc-600">
          —
        </div>
      )}
      {ops.map((op, i) => (
        <div
          key={i}
          className={`rounded px-2 py-1.5 font-mono text-[11px] ${
            op.highlight
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          {op.text}
        </div>
      ))}
    </div>
  );
}

function ResultCard({
  title,
  result,
  tone,
}: {
  title: string;
  result: string;
  tone: "ok" | "warning";
}) {
  const toneClasses =
    tone === "ok"
      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950"
      : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950";
  const titleColor =
    tone === "ok"
      ? "text-emerald-800 dark:text-emerald-300"
      : "text-amber-800 dark:text-amber-300";
  return (
    <div className={`rounded-lg border p-4 ${toneClasses}`}>
      <div className={`text-xs font-semibold ${titleColor}`}>{title}</div>
      <div className="mt-1 font-mono text-sm text-zinc-700 dark:text-zinc-300">
        {result}
      </div>
    </div>
  );
}
