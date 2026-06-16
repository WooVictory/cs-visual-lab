"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type Callback =
  | "onCreate"
  | "onStart"
  | "onResume"
  | "onPause"
  | "onStop"
  | "onDestroy";

const CALLBACK_ORDER: Callback[] = [
  "onCreate",
  "onStart",
  "onResume",
  "onPause",
  "onStop",
  "onDestroy",
];

type StepDef = {
  id: string;
  label: string;
  activeCallback: Callback | null;
  visited: Callback[];
  state: string;
  event: string;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "launch",
    label: "앱 시작",
    activeCallback: "onCreate",
    visited: ["onCreate"],
    state: "CREATED",
    event: "사용자가 앱 실행",
    description:
      "onCreate(): Activity가 처음 생성됨. layout 인플레이트, ViewBinding 셋업, ViewModel 초기화 — 일회성 셋업.",
  },
  {
    id: "start",
    label: "보이기 시작",
    activeCallback: "onStart",
    visited: ["onCreate", "onStart"],
    state: "STARTED",
    event: "화면이 사용자에게 보이기 시작",
    description:
      "onStart(): 화면이 보이지만 아직 포커스 없음. 일반적으로 큰 작업 X. LifecycleOwner의 ON_START 디스패치.",
  },
  {
    id: "resume",
    label: "포커스",
    activeCallback: "onResume",
    visited: ["onCreate", "onStart", "onResume"],
    state: "RESUMED",
    event: "사용자와 상호작용 가능",
    description:
      "onResume(): 사용자가 실제로 상호작용 시작. 카메라/센서 시작, 애니메이션 재개. 가장 자주 호출되는 'active' 상태.",
  },
  {
    id: "background",
    label: "다른 앱 전환",
    activeCallback: "onPause",
    visited: ["onCreate", "onStart", "onResume", "onPause"],
    state: "STARTED",
    event: "홈 버튼 또는 다른 앱 진입",
    description:
      "onPause(): 포커스 잃음 (다이얼로그 띄울 때도). 빠르게 해야 함 (다음 Activity의 onResume이 지연됨). 카메라/센서 정지.",
  },
  {
    id: "stopped",
    label: "안 보임",
    activeCallback: "onStop",
    visited: ["onCreate", "onStart", "onResume", "onPause", "onStop"],
    state: "CREATED",
    event: "화면에서 완전히 가려짐",
    description:
      "onStop(): 더 이상 화면에 안 보임. 무거운 작업 정지, 데이터 저장. 이 상태에서 메모리 압박 시 시스템이 onDestroy 없이 프로세스 종료 가능.",
  },
  {
    id: "destroy",
    label: "종료 (정상)",
    activeCallback: "onDestroy",
    visited: ["onCreate", "onStart", "onResume", "onPause", "onStop", "onDestroy"],
    state: "DESTROYED",
    event: "finish() 또는 시스템이 종료",
    description:
      "onDestroy(): Activity 정리. 메모리 누수 방지 위해 리스너 해제, 코루틴 취소. 화면 회전 시에도 호출 → 새 인스턴스 onCreate.",
  },
  {
    id: "rotate",
    label: "회전 → 재생성",
    activeCallback: "onCreate",
    visited: ["onCreate", "onStart", "onResume", "onPause", "onStop", "onDestroy", "onCreate"],
    state: "CREATED",
    event: "화면 회전 발생",
    description:
      "구성 변경(회전, 다크모드 등) → onDestroy → onCreate. ViewModel은 살아남고, savedInstanceState로 추가 상태 복원 가능. Compose는 이 부분이 더 자동화됨.",
  },
];

export function AndroidLifecycle({ slug }: { slug: string }) {
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

      <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2 text-xs font-mono dark:bg-zinc-900">
        <span className="text-zinc-500 dark:text-zinc-400">이벤트:</span>
        <span className="text-zinc-700 dark:text-zinc-300">{step.event}</span>
        <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-white dark:bg-zinc-100 dark:text-zinc-900">
          {step.state}
        </span>
      </div>

      <div className="space-y-2">
        {CALLBACK_ORDER.map((cb) => {
          const isActive = step.activeCallback === cb;
          const visitCount = step.visited.filter((v) => v === cb).length;
          const wasVisited = visitCount > 0;
          return (
            <div
              key={cb}
              className={`flex items-center justify-between rounded-lg border p-3 transition ${
                isActive
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 dark:border-emerald-400 dark:bg-emerald-950"
                  : wasVisited
                  ? "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                  : "border-dashed border-zinc-200 bg-white/50 opacity-50 dark:border-zinc-800 dark:bg-zinc-950/50"
              }`}
            >
              <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {cb}()
              </span>
              {visitCount > 0 && (
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  호출 {visitCount}회
                </span>
              )}
            </div>
          );
        })}
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
