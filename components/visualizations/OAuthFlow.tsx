"use client";

import {
  StepControls,
  StepDescription,
  Stepper,
  VizContainer,
  useStepState,
} from "./_shared";

type NodeId = "user" | "client" | "auth" | "resource";

type StepDef = {
  id: string;
  label: string;
  from?: NodeId;
  to?: NodeId;
  message?: string;
  highlight: NodeId[];
  description: string;
};

const NODES: Record<NodeId, { label: string; sub: string }> = {
  user: { label: "User", sub: "브라우저" },
  client: { label: "Client App", sub: "우리 앱" },
  auth: { label: "Auth Server", sub: "Google 등" },
  resource: { label: "Resource Server", sub: "API" },
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    highlight: [],
    description:
      "OAuth 2.0 Authorization Code Flow + PKCE — 가장 권장되는 안전한 흐름. SPA/모바일에서도 안전.",
  },
  {
    id: "pkce",
    label: "1. PKCE 생성",
    from: "client",
    highlight: ["client"],
    message: "code_verifier 생성 → code_challenge = SHA256(verifier)",
    description:
      "클라이언트가 랜덤 code_verifier 생성, 그 해시(code_challenge)를 만듦. PKCE의 핵심 — 토큰을 받을 때 원본 verifier로 본인임을 증명.",
  },
  {
    id: "authorize",
    label: "2. 인가 요청",
    from: "client",
    to: "user",
    highlight: ["client", "user"],
    message: "Redirect to /authorize?client_id=&code_challenge=&state=",
    description:
      "사용자를 인가 서버로 리다이렉트. 우리 앱의 client_id, PKCE challenge, state(CSRF 방지) 등을 쿼리로.",
  },
  {
    id: "consent",
    label: "3. 사용자 동의",
    from: "user",
    to: "auth",
    highlight: ["user", "auth"],
    message: "로그인 + 권한 동의",
    description:
      "사용자가 Auth 서버에서 로그인하고 '이 앱이 내 프로필을 볼 수 있게 허락' 동의.",
  },
  {
    id: "code",
    label: "4. Authorization Code",
    from: "auth",
    to: "client",
    highlight: ["auth", "client"],
    message: "Redirect 우리 앱 callback?code=ABC123&state=...",
    description:
      "Auth 서버가 짧은 수명의 'authorization code'를 클라이언트로 리다이렉트. 이 코드 자체로는 API 호출 못함 — token으로 교환 필요.",
  },
  {
    id: "exchange",
    label: "5. Token 교환",
    from: "client",
    to: "auth",
    highlight: ["client", "auth"],
    message: "POST /token { code, code_verifier }",
    description:
      "백채널(서버↔서버)로 코드 + 원본 code_verifier 전송. Auth 서버가 hash(verifier) == code_challenge 확인 → PKCE 검증 통과.",
  },
  {
    id: "token",
    label: "6. Access Token",
    from: "auth",
    to: "client",
    highlight: ["auth", "client"],
    message: "{ access_token, refresh_token, id_token (OIDC) }",
    description:
      "Access Token (수명 짧음), Refresh Token (수명 김), ID Token (OIDC: 사용자 신원 JWT) 발급. 이제 API 호출 가능.",
  },
  {
    id: "api",
    label: "7. API 호출",
    from: "client",
    to: "resource",
    highlight: ["client", "resource"],
    message: "Authorization: Bearer <access_token>",
    description:
      "Access Token을 Authorization 헤더에 담아 API 호출. Resource 서버가 토큰 검증 후 데이터 반환.",
  },
];

export function OAuthFlow({ slug }: { slug: string }) {
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
        <div className="grid grid-cols-4 gap-3">
          {(["user", "client", "auth", "resource"] as NodeId[]).map((id) => {
            const n = NODES[id];
            const isHighlighted = step.highlight.includes(id);
            return (
              <div
                key={id}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition ${
                  isHighlighted
                    ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950"
                    : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                }`}
              >
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  {n.label}
                </div>
                <div className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                  {n.sub}
                </div>
              </div>
            );
          })}
        </div>

        {step.message && (
          <div className="mt-4 rounded-lg border border-zinc-300 bg-white p-3 font-mono text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
            {step.from && step.to && (
              <span className="text-zinc-400">
                {NODES[step.from].label} → {NODES[step.to].label}:{" "}
              </span>
            )}
            {step.message}
          </div>
        )}
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
