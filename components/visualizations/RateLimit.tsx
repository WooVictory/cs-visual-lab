"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

const CAPACITY = 10;

type Request = "allowed" | "denied";

type StepDef = {
  id: string;
  label: string;
  tokens: number;
  recentRequests: Request[];
  message: string;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    tokens: 10,
    recentRequests: [],
    message: "버킷 가득 (capacity 10)",
    description:
      "Token Bucket: 용량 10, 초당 2개씩 토큰 충전. 각 요청은 토큰 1개 소비. 토큰이 있으면 통과, 없으면 거절. 일시적 burst를 흡수하면서 평균 속도를 제한.",
  },
  {
    id: "burst",
    label: "burst 5개",
    tokens: 5,
    recentRequests: ["allowed", "allowed", "allowed", "allowed", "allowed"],
    message: "5개 요청 한 번에 → 모두 통과 (burst 흡수)",
    description:
      "갑자기 5개 요청이 와도 버킷에 토큰 충분 → 모두 통과. Leaky Bucket과 달리 일시적 burst를 허용하는 게 Token Bucket의 강점.",
  },
  {
    id: "more",
    label: "추가 5개",
    tokens: 0,
    recentRequests: ["allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed"],
    message: "10개 모두 통과, 버킷 비어있음",
    description:
      "또 5개. 토큰 다 씀 → 버킷 0. 이제 더 이상 요청 불가 (충전 대기 필요).",
  },
  {
    id: "denied",
    label: "거절",
    tokens: 0,
    recentRequests: ["allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "denied", "denied"],
    message: "다음 요청 → 429 Too Many Requests",
    description:
      "토큰 없을 때 요청 → 거절(HTTP 429 + Retry-After 헤더). 클라이언트는 잠시 기다린 후 재시도 (exponential backoff 권장).",
  },
  {
    id: "refill",
    label: "충전 후 일부 허용",
    tokens: 4,
    recentRequests: ["allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "allowed", "denied", "denied", "allowed", "allowed", "allowed", "allowed"],
    message: "2초 후 토큰 4개 충전 → 4개 추가 통과",
    description:
      "2초가 흐르면 4개 토큰 충전 (rate 2/s × 2s). 새 요청 4개까지 처리 가능. 장기 평균 = 충전율로 수렴 → 평균 RPS 제어. 클라이언트는 Retry-After 보고 적절히 재시도.",
  },
];

export function RateLimit({ slug }: { slug: string }) {
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

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Bucket */}
          <div>
            <div className="mb-2 text-center text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Token Bucket (rate: 2/sec)
            </div>
            <div className="relative mx-auto h-40 w-32 overflow-hidden rounded-b-2xl border-4 border-zinc-700 bg-white dark:border-zinc-300 dark:bg-zinc-950">
              {/* Token fill (from bottom) */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-emerald-500 transition-all duration-500 dark:bg-emerald-600"
                style={{ height: `${(step.tokens / CAPACITY) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-2xl font-bold text-zinc-900 mix-blend-difference dark:text-white">
                  {step.tokens}/{CAPACITY}
                </span>
              </div>
            </div>
          </div>

          {/* Requests stream */}
          <div>
            <div className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              최근 요청 (← 오래된 / 최신 →)
            </div>
            <div className="flex flex-wrap gap-1">
              {step.recentRequests.length === 0 ? (
                <span className="text-xs text-zinc-400 dark:text-zinc-600">
                  (요청 없음)
                </span>
              ) : (
                step.recentRequests.map((r, i) => (
                  <div
                    key={i}
                    className={`flex h-7 w-7 items-center justify-center rounded font-mono text-xs font-bold text-white ${
                      r === "allowed"
                        ? "bg-emerald-500 dark:bg-emerald-600"
                        : "bg-rose-500 dark:bg-rose-600"
                    }`}
                    title={r === "allowed" ? "통과" : "거절"}
                  >
                    {r === "allowed" ? "✓" : "✗"}
                  </div>
                ))
              )}
            </div>
            <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
              {step.message}
            </div>
          </div>
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
