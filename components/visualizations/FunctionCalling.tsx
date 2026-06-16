"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type StepDef = {
  id: string;
  label: string;
  activeNode: "user" | "llm" | "tool" | null;
  message: string;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "user-q",
    label: "1. 질문",
    activeNode: "user",
    message: '"내일 서울 날씨 어때?"',
    description:
      "사용자가 LLM에 질문. LLM 자체는 실시간 날씨를 모름. 도구(get_weather)를 호출해야 답할 수 있는 상황.",
  },
  {
    id: "tool-call",
    label: "2. Tool 호출 결정",
    activeNode: "llm",
    message: 'tool_use: get_weather({"city":"Seoul","date":"tomorrow"})',
    description:
      "LLM이 제공된 tool schema를 보고 get_weather가 적절하다고 판단. 인자를 JSON으로 자동 채워서 'tool_use' 응답.",
  },
  {
    id: "exec",
    label: "3. 실제 실행",
    activeNode: "tool",
    message: "GET api.weather.com/seoul/tomorrow → {temp:18, sky:'맑음'}",
    description:
      "백엔드 코드가 LLM이 만든 인자로 실제 API 호출. **중요**: LLM이 만든 인자는 검증 없이 신뢰 X — 스키마 재검증 + 권한 확인 필수.",
  },
  {
    id: "result",
    label: "4. 결과 LLM에 반환",
    activeNode: "llm",
    message: 'tool_result: {"temp":18,"sky":"맑음"}',
    description:
      "도구 실행 결과를 LLM에 다시 보냄. 같은 메시지 스레드에 'tool_result' 메시지로 추가.",
  },
  {
    id: "answer",
    label: "5. 자연어 답변",
    activeNode: "llm",
    message: '"내일 서울은 맑음, 기온은 18°C 정도 예상돼요."',
    description:
      "LLM이 결과를 자연어로 변환해 사용자에게 응답. 사용자는 LLM이 직접 안 것처럼 보이지만, 실은 도구가 답을 가져옴.",
  },
];

export function FunctionCalling({ slug }: { slug: string }) {
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
        <div className="grid grid-cols-3 gap-3">
          <Node label="User" sub="질문 / 답변" active={step.activeNode === "user"} />
          <Node
            label="LLM"
            sub="추론 + 도구 결정"
            active={step.activeNode === "llm"}
          />
          <Node
            label="Tool / API"
            sub="get_weather"
            active={step.activeNode === "tool"}
          />
        </div>

        <div className="mt-4 rounded-lg border border-zinc-300 bg-white p-4 font-mono text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
          {step.message}
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

function Node({
  label,
  sub,
  active,
}: {
  label: string;
  sub: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition ${
        active
          ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950"
          : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950"
      }`}
    >
      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
        {label}
      </div>
      <div className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
        {sub}
      </div>
    </div>
  );
}
