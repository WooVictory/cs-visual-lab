"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type StageId = "query" | "embed" | "search" | "context" | "llm" | "answer";

type StepDef = {
  id: string;
  label: string;
  activeStage: StageId | null;
  completedStages: StageId[];
  detail: string;
  description: string;
};

const STAGES: { id: StageId; label: string; sub: string }[] = [
  { id: "query", label: "사용자 질문", sub: '"우리 회사 환불 정책은?"' },
  { id: "embed", label: "임베딩", sub: "text → vector[768]" },
  { id: "search", label: "벡터 검색", sub: "Top-K 유사 문서" },
  { id: "context", label: "프롬프트 조립", sub: "system + docs + question" },
  { id: "llm", label: "LLM 추론", sub: "답변 생성" },
  { id: "answer", label: "최종 답변", sub: "근거 + 응답" },
];

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    activeStage: null,
    completedStages: [],
    detail: "RAG 파이프라인은 6단계.",
    description:
      "RAG (Retrieval Augmented Generation): LLM이 모르는 사내 문서/최신 정보를 외부 검색으로 보강하는 패턴. 6단계 흐름을 보여드릴게요.",
  },
  {
    id: "s1",
    label: "질문 수신",
    activeStage: "query",
    completedStages: [],
    detail: '사용자 입력: "우리 회사 환불 정책은?"',
    description:
      "사용자 질문이 들어옴. LLM 자체는 회사 내부 문서를 모르니까, 그 회사 문서를 찾아 같이 보여줘야 합니다.",
  },
  {
    id: "s2",
    label: "임베딩",
    activeStage: "embed",
    completedStages: ["query"],
    detail: "embedding model: text-embedding-3-small → vector[1536]",
    description:
      "질문을 임베딩 모델로 벡터화. 같은 모델로 문서들도 미리 임베딩해서 벡터 DB에 저장되어 있어야 합니다.",
  },
  {
    id: "s3",
    label: "벡터 검색",
    activeStage: "search",
    completedStages: ["query", "embed"],
    detail: "vectorDB.search(query_vec, top_k=3) → [doc#42, doc#103, doc#7]",
    description:
      "벡터 DB가 cosine similarity로 가장 가까운 K개 청크 반환. 일반적으로 K=3~10. (옵션) Reranker로 정밀 재순위.",
  },
  {
    id: "s4",
    label: "프롬프트 조립",
    activeStage: "context",
    completedStages: ["query", "embed", "search"],
    detail: "system: '아래 문서를 근거로 답변' + docs + 사용자 질문",
    description:
      "검색된 문서를 LLM 프롬프트에 컨텍스트로 주입. 'Cite from the docs', 'I don\\'t know if not in docs' 같은 규칙도 같이.",
  },
  {
    id: "s5",
    label: "LLM 답변",
    activeStage: "llm",
    completedStages: ["query", "embed", "search", "context"],
    detail: "claude-sonnet-4-6 (또는 GPT-4o, Gemini)",
    description:
      "LLM이 주입된 문서를 근거로 답변 생성. 모델 자체 지식이 아닌 \"진짜 회사 문서\" 기반 → 환각(hallucination)이 줄어듭니다.",
  },
  {
    id: "s6",
    label: "응답 + 근거",
    activeStage: "answer",
    completedStages: ["query", "embed", "search", "context", "llm"],
    detail: '"환불은 구매 후 7일 이내 가능 [doc#42 ¶3]"',
    description:
      "답변과 함께 인용된 문서 ID를 반환 — 사용자가 출처 확인 가능. 신뢰도와 검증 가능성이 RAG의 큰 장점.",
  },
];

export function Rag({ slug }: { slug: string }) {
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

      <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        {STAGES.map((stage, i) => {
          const isActive = step.activeStage === stage.id;
          const isDone = step.completedStages.includes(stage.id);
          return (
            <div key={stage.id} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : isDone
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                {i + 1}
              </div>
              <div
                className={`flex-1 rounded-lg border p-3 transition ${
                  isActive
                    ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950"
                    : isDone
                    ? "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                    : "border-dashed border-zinc-200 bg-white/50 opacity-60 dark:border-zinc-800 dark:bg-zinc-950/50"
                }`}
              >
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {stage.label}
                </div>
                <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                  {stage.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {step.activeStage && (
        <div className="rounded-lg border border-zinc-200 bg-white p-3 font-mono text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          {step.detail}
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
