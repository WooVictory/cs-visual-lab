"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Regs = {
  PC: string;
  SP: string;
  R1: string;
  R2: string;
};

type StepDef = {
  id: string;
  label: string;
  running: "A" | "B";
  cpuRegs: Regs;
  pcbA: Regs;
  pcbB: Regs;
  arrows: Array<{ from: string; to: string; label: string }>;
  description: string;
};

const A_REGS: Regs = {
  PC: "0x4001",
  SP: "0xFFE0",
  R1: "42",
  R2: "hello",
};
const B_REGS: Regs = {
  PC: "0x8200",
  SP: "0xFFD0",
  R1: "99",
  R2: "world",
};

const EMPTY: Regs = { PC: "—", SP: "—", R1: "—", R2: "—" };

const STEPS: StepDef[] = [
  {
    id: "a-running",
    label: "A 실행 중",
    running: "A",
    cpuRegs: A_REGS,
    pcbA: EMPTY,
    pcbB: B_REGS,
    arrows: [],
    description:
      "Thread A가 CPU에서 실행 중. 레지스터(PC, SP, 범용 R1/R2)는 CPU에 로드되어 있고, B의 상태는 PCB(Process Control Block) B에 저장되어 있습니다.",
  },
  {
    id: "interrupt",
    label: "인터럽트",
    running: "A",
    cpuRegs: A_REGS,
    pcbA: EMPTY,
    pcbB: B_REGS,
    arrows: [],
    description:
      "타이머 인터럽트가 발생해 커널 모드로 진입. 스케줄러가 'A를 멈추고 B를 실행하라'고 결정합니다. 이제 컨텍스트 스위치가 시작됩니다.",
  },
  {
    id: "save-a",
    label: "A 저장",
    running: "A",
    cpuRegs: A_REGS,
    pcbA: A_REGS,
    pcbB: B_REGS,
    arrows: [{ from: "cpu", to: "pcbA", label: "A 레지스터 저장" }],
    description:
      "CPU의 모든 레지스터를 PCB A에 복사. 이렇게 해야 나중에 A가 정확히 멈춘 지점부터 다시 실행될 수 있습니다.",
  },
  {
    id: "load-b",
    label: "B 로드",
    running: "B",
    cpuRegs: B_REGS,
    pcbA: A_REGS,
    pcbB: EMPTY,
    arrows: [{ from: "pcbB", to: "cpu", label: "B 레지스터 복원" }],
    description:
      "PCB B에서 저장돼있던 B의 레지스터를 CPU에 복원. 이제 PC가 B 코드를 가리키게 됩니다.",
  },
  {
    id: "b-running",
    label: "B 실행 중",
    running: "B",
    cpuRegs: B_REGS,
    pcbA: A_REGS,
    pcbB: EMPTY,
    arrows: [],
    description:
      "B가 CPU에서 실행 시작 — B 입장에선 끊김 없이 이어지는 것처럼 보임. 비용: 레지스터 저장/복원 + TLB/캐시 무효화(다른 프로세스라면). 컨텍스트 스위치를 줄이는 게 OS 성능 튜닝의 핵심.",
  },
];

export function ContextSwitch({ slug }: { slug: string }) {
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <PcbCard
          title="PCB Thread A"
          regs={step.pcbA}
          isEmpty={step.pcbA === EMPTY}
        />
        <CpuCard regs={step.cpuRegs} running={step.running} />
        <PcbCard
          title="PCB Thread B"
          regs={step.pcbB}
          isEmpty={step.pcbB === EMPTY}
        />
      </div>

      {step.arrows.length > 0 && (
        <div className="rounded-lg bg-zinc-50 px-4 py-2 text-center text-xs font-mono text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
          ↔ {step.arrows[0].label}
        </div>
      )}

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

function CpuCard({ regs, running }: { regs: Regs; running: "A" | "B" }) {
  return (
    <div className="rounded-xl border-2 border-zinc-900 bg-white p-4 dark:border-zinc-100 dark:bg-zinc-950">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          CPU
        </div>
        <div
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            running === "A"
              ? "bg-rose-500 text-white"
              : "bg-sky-500 text-white"
          }`}
        >
          실행 중: {running}
        </div>
      </div>
      <RegList regs={regs} />
    </div>
  );
}

function PcbCard({
  title,
  regs,
  isEmpty,
}: {
  title: string;
  regs: Regs;
  isEmpty: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        isEmpty
          ? "border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      }`}
    >
      <div className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </div>
      {isEmpty ? (
        <div className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
          (현재 CPU에 로드됨)
        </div>
      ) : (
        <RegList regs={regs} />
      )}
    </div>
  );
}

function RegList({ regs }: { regs: Regs }) {
  return (
    <div className="space-y-0.5 font-mono text-[11px]">
      <RegRow name="PC" value={regs.PC} />
      <RegRow name="SP" value={regs.SP} />
      <RegRow name="R1" value={regs.R1} />
      <RegRow name="R2" value={regs.R2} />
    </div>
  );
}

function RegRow({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-500 dark:text-zinc-400">{name}</span>
      <span className="text-zinc-900 dark:text-zinc-50">{value}</span>
    </div>
  );
}
