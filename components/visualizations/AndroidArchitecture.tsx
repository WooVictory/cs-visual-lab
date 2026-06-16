"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Pattern = "mvvm" | "mvi";

type FlowArrow = {
  from: "view" | "vm" | "state" | "model";
  to: "view" | "vm" | "state" | "model";
  label: string;
  active: boolean;
};

type PanelState = {
  arrows: FlowArrow[];
  activeNodes: ("view" | "vm" | "state" | "model")[];
  note: string;
};

type StepDef = {
  id: string;
  label: string;
  mvvm: PanelState;
  mvi: PanelState;
  showCleanArch: boolean;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "두 패턴 소개",
    mvvm: {
      arrows: [
        { from: "vm", to: "model", label: "request", active: false },
        { from: "vm", to: "view", label: "observe", active: false },
      ],
      activeNodes: [],
      note: "양방향 결합, 단순함",
    },
    mvi: {
      arrows: [
        { from: "view", to: "vm", label: "Intent", active: false },
        { from: "vm", to: "state", label: "Reduce", active: false },
        { from: "state", to: "view", label: "Render", active: false },
      ],
      activeNodes: [],
      note: "단방향 cycle, 예측 가능",
    },
    showCleanArch: false,
    description:
      "Android UI 아키텍처: MVVM과 MVI를 같은 시나리오(좋아요 버튼 클릭)에서 비교합니다. 마지막 단계에서 Clean Architecture의 계층 분리도.",
  },
  {
    id: "click",
    label: "1. 사용자 클릭",
    mvvm: {
      arrows: [
        { from: "vm", to: "model", label: "request", active: false },
        { from: "vm", to: "view", label: "observe", active: false },
      ],
      activeNodes: ["view"],
      note: 'view.likeBtn.onClick { vm.onLike() } 호출',
    },
    mvi: {
      arrows: [
        { from: "view", to: "vm", label: "Intent.Like", active: true },
        { from: "vm", to: "state", label: "Reduce", active: false },
        { from: "state", to: "view", label: "Render", active: false },
      ],
      activeNodes: ["view"],
      note: 'view.send(Intent.Like) — UI는 Intent만 발행',
    },
    showCleanArch: false,
    description:
      "사용자가 좋아요 버튼 클릭. MVVM은 ViewModel 메서드 직접 호출 (명령형). MVI는 'Intent' 객체를 발행 (선언형) — UI는 어떻게 처리될지 모름.",
  },
  {
    id: "process",
    label: "2. 처리",
    mvvm: {
      arrows: [
        { from: "vm", to: "model", label: "request", active: true },
        { from: "vm", to: "view", label: "observe", active: false },
      ],
      activeNodes: ["view", "vm", "model"],
      note: "ViewModel이 Repository 호출 → API → DB",
    },
    mvi: {
      arrows: [
        { from: "view", to: "vm", label: "Intent.Like", active: false },
        { from: "vm", to: "state", label: "Reduce", active: true },
        { from: "state", to: "view", label: "Render", active: false },
      ],
      activeNodes: ["vm", "state", "model"],
      note: "Reducer가 현재 State + Intent → 새 State 계산",
    },
    showCleanArch: false,
    description:
      "비즈니스 로직 처리. MVVM은 ViewModel이 Model에 직접 명령. MVI는 Reducer(순수 함수)가 현재 State와 Intent로 새 State를 계산 — 순수 함수라 테스트 쉬움.",
  },
  {
    id: "state",
    label: "3. State 변경",
    mvvm: {
      arrows: [
        { from: "vm", to: "model", label: "request", active: false },
        { from: "vm", to: "view", label: "observe", active: true },
      ],
      activeNodes: ["vm", "state"],
      note: "_uiState.value = newState — StateFlow 변경",
    },
    mvi: {
      arrows: [
        { from: "view", to: "vm", label: "Intent.Like", active: false },
        { from: "vm", to: "state", label: "Reduce", active: false },
        { from: "state", to: "view", label: "Render", active: true },
      ],
      activeNodes: ["state", "view"],
      note: "단일 UiState 객체 emit — 항상 한 곳에서 상태 관리",
    },
    showCleanArch: false,
    description:
      "상태 갱신. MVVM은 여러 LiveData/StateFlow 가능 (likes, comments 각각). MVI는 항상 단일 UiState 객체로 통합 — Single Source of Truth.",
  },
  {
    id: "render",
    label: "4. UI 갱신",
    mvvm: {
      arrows: [
        { from: "vm", to: "model", label: "request", active: false },
        { from: "vm", to: "view", label: "observe", active: true },
      ],
      activeNodes: ["view"],
      note: "Observer가 변경 감지 → 해당 필드만 업데이트",
    },
    mvi: {
      arrows: [
        { from: "view", to: "vm", label: "Intent", active: false },
        { from: "vm", to: "state", label: "Reduce", active: false },
        { from: "state", to: "view", label: "Render", active: true },
      ],
      activeNodes: ["view"],
      note: "View는 항상 전체 State로부터 렌더 — 일관성 보장",
    },
    showCleanArch: false,
    description:
      "View 재구성. MVVM 트레이드오프: 단순함 ↔ 상태 분산. MVI 트레이드오프: 보일러플레이트 ↑ ↔ 예측 가능성 ↑. 실무에선 MVVM + StateFlow + sealed UiState가 둘의 절충안.",
  },
  {
    id: "clean",
    label: "Clean Architecture",
    mvvm: { arrows: [], activeNodes: [], note: "" },
    mvi: { arrows: [], activeNodes: [], note: "" },
    showCleanArch: true,
    description:
      "위 두 패턴은 'UI 계층'의 이야기. Clean Architecture는 그 위에 더 큰 계층 분리를 더함 — Presentation / Domain / Data. 의존성은 항상 안쪽(Domain)을 향함. Domain은 안드로이드 의존성 없이 순수 Kotlin — 테스트와 재사용성 ↑.",
  },
];

export function AndroidArchitecture({ slug }: { slug: string }) {
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

      {step.showCleanArch ? (
        <CleanArchView />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Panel
            title="MVVM"
            subtitle="양방향 · observable"
            pattern="mvvm"
            state={step.mvvm}
          />
          <Panel
            title="MVI"
            subtitle="단방향 cycle"
            pattern="mvi"
            state={step.mvi}
          />
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

function Panel({
  title,
  subtitle,
  pattern,
  state,
}: {
  title: string;
  subtitle: string;
  pattern: Pattern;
  state: PanelState;
}) {
  const activeSet = new Set(state.activeNodes);
  // MVVM: View ↔ ViewModel ↔ Model (3 nodes)
  // MVI:  View → VM → State → View (cycle), Model feeds VM
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </div>
      </div>

      <div className="relative h-[260px]">
        <svg viewBox="0 0 320 260" className="absolute inset-0 h-full w-full" aria-hidden>
          {pattern === "mvvm" ? (
            <MvvmDiagram activeSet={activeSet} arrows={state.arrows} />
          ) : (
            <MviDiagram activeSet={activeSet} arrows={state.arrows} />
          )}
        </svg>
      </div>

      <div className="rounded-md bg-white px-3 py-2 font-mono text-[11px] text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
        {state.note || "—"}
      </div>
    </div>
  );
}

function MvvmDiagram({
  activeSet,
  arrows,
}: {
  activeSet: Set<string>;
  arrows: FlowArrow[];
}) {
  const find = (from: string, to: string) =>
    arrows.find((a) => a.from === from && a.to === to);
  return (
    <>
      <Edge x1={160} y1={50} x2={160} y2={100} label={find("view", "vm") ? "" : ""} active={false} bidir />
      <Edge x1={160} y1={150} x2={160} y2={200} active={find("vm", "model")?.active ?? false} bidir />
      {find("vm", "view")?.active && (
        <Edge x1={160} y1={100} x2={160} y2={50} active={true} dashed label="observe" />
      )}

      <Box x={110} y={20} w={100} h={32} label="View" sub="Activity/Compose" active={activeSet.has("view")} />
      <Box x={110} y={104} w={100} h={42} label="ViewModel" sub="비즈니스 로직" active={activeSet.has("vm")} />
      <Box x={110} y={204} w={100} h={36} label="Model" sub="Repository" active={activeSet.has("model")} />
    </>
  );
}

function MviDiagram({
  activeSet,
  arrows,
}: {
  activeSet: Set<string>;
  arrows: FlowArrow[];
}) {
  const intent = arrows.find((a) => a.from === "view" && a.to === "vm");
  const reduce = arrows.find((a) => a.from === "vm" && a.to === "state");
  const render = arrows.find((a) => a.from === "state" && a.to === "view");

  return (
    <>
      {/* Cycle arrows */}
      <Edge
        x1={70}
        y1={120}
        x2={150}
        y2={120}
        active={intent?.active ?? false}
        label={intent?.active ? "Intent" : ""}
      />
      <Edge
        x1={250}
        y1={120}
        x2={250}
        y2={50}
        active={reduce?.active ?? false}
        label={reduce?.active ? "Reduce" : ""}
      />
      <Edge
        x1={200}
        y1={32}
        x2={70}
        y2={100}
        active={render?.active ?? false}
        label={render?.active ? "Render" : ""}
      />

      {/* Model arrow (always shown faded) */}
      <Edge x1={250} y1={200} x2={250} y2={150} active={false} dashed />

      {/* Nodes */}
      <Box x={10} y={104} w={60} h={32} label="View" sub="UI" active={activeSet.has("view")} />
      <Box x={190} y={104} w={60} h={32} label="Reducer" sub="순수 함수" active={activeSet.has("vm")} />
      <Box x={170} y={10} w={100} h={32} label="UiState" sub="단일 객체" active={activeSet.has("state")} />
      <Box x={200} y={204} w={100} h={32} label="Repository" sub="" active={activeSet.has("model")} />
    </>
  );
}

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  active,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub: string;
  active: boolean;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={w}
        height={h}
        rx={6}
        className={
          active
            ? "fill-emerald-500 stroke-emerald-700 dark:fill-emerald-600 dark:stroke-emerald-300"
            : "fill-white stroke-zinc-400 dark:fill-zinc-950 dark:stroke-zinc-600"
        }
        strokeWidth={1.5}
      />
      <text
        x={w / 2}
        y={sub ? h / 2 - 2 : h / 2 + 4}
        textAnchor="middle"
        className={`text-xs font-semibold ${
          active ? "fill-white" : "fill-zinc-900 dark:fill-zinc-50"
        }`}
      >
        {label}
      </text>
      {sub && (
        <text
          x={w / 2}
          y={h / 2 + 11}
          textAnchor="middle"
          className={`text-[9px] ${
            active ? "fill-emerald-100" : "fill-zinc-500 dark:fill-zinc-400"
          }`}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Edge({
  x1,
  y1,
  x2,
  y2,
  active,
  label,
  bidir,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  label?: string;
  bidir?: boolean;
  dashed?: boolean;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  return (
    <g
      className={
        active
          ? "stroke-emerald-600 dark:stroke-emerald-400"
          : "stroke-zinc-300 dark:stroke-zinc-700"
      }
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth={active ? 2 : 1}
        strokeDasharray={dashed ? "4 3" : "0"}
      />
      <polygon
        points={`${x2},${y2} ${x2 - ux * 8 - uy * 5},${y2 - uy * 8 + ux * 5} ${x2 - ux * 8 + uy * 5},${y2 - uy * 8 - ux * 5}`}
        className={
          active
            ? "fill-emerald-600 dark:fill-emerald-400"
            : "fill-zinc-300 dark:fill-zinc-700"
        }
        stroke="none"
      />
      {bidir && (
        <polygon
          points={`${x1},${y1} ${x1 + ux * 8 + uy * 5},${y1 + uy * 8 - ux * 5} ${x1 + ux * 8 - uy * 5},${y1 + uy * 8 + ux * 5}`}
          className={
            active
              ? "fill-emerald-600 dark:fill-emerald-400"
              : "fill-zinc-300 dark:fill-zinc-700"
          }
          stroke="none"
        />
      )}
      {label && (
        <text
          x={(x1 + x2) / 2 + 8}
          y={(y1 + y2) / 2}
          className="text-[10px] font-mono fill-zinc-700 dark:fill-zinc-300"
          stroke="none"
        >
          {label}
        </text>
      )}
    </g>
  );
}

const CLEAN_LAYERS = [
  {
    name: "Presentation",
    color: "bg-sky-500",
    items: ["Activity / Fragment / Composable", "ViewModel", "UiState"],
    description: "Android 의존 OK",
  },
  {
    name: "Domain",
    color: "bg-emerald-500",
    items: ["UseCase / Interactor", "Entity / Model", "Repository (interface)"],
    description: "순수 Kotlin · Android 의존 X",
  },
  {
    name: "Data",
    color: "bg-amber-500",
    items: ["Repository (impl)", "Remote (Retrofit)", "Local (Room)", "DTO ↔ Entity 매핑"],
    description: "Android 의존 OK · Domain interface 구현",
  },
];

function CleanArchView() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        ↓ 의존성 방향: 모든 화살표가 안쪽(Domain)을 향함
      </div>
      <div className="flex flex-col gap-2">
        {CLEAN_LAYERS.map((layer, i) => (
          <div
            key={layer.name}
            className="rounded-lg border-2 border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className={`inline-block h-3 w-3 rounded-full ${layer.color}`} />
              <span className="font-bold text-zinc-900 dark:text-zinc-50">
                {layer.name}
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {layer.description}
              </span>
            </div>
            <ul className="ml-6 list-disc font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
              {layer.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {i < CLEAN_LAYERS.length - 1 && (
              <div className="mt-2 flex justify-center text-zinc-400 dark:text-zinc-600">
                ↓ depends on
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-2 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
        💡 Domain은 절대 Presentation/Data를 모름. Repository는 Domain에서{" "}
        <span className="font-mono">interface</span>로 선언, Data에서 구현 — 의존성 역전(DIP).
      </div>
    </div>
  );
}
