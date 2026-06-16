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
  attack: "xss" | "csrf" | "sqli" | null;
  code: string;
  defense: string;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "init",
    label: "초기",
    attack: null,
    code: "// 사용자 입력을 안전하게 다루는 것이 핵심",
    defense: "각 공격마다 다른 방어 패턴",
    description:
      "웹 3대 취약점 XSS · CSRF · SQL Injection. 각각의 공격 메커니즘과 방어 패턴을 살펴봅니다.",
  },
  {
    id: "xss",
    label: "XSS 공격",
    attack: "xss",
    code: `// ❌ 취약: 사용자 입력을 그대로 innerHTML
commentDiv.innerHTML = userInput;
// 입력: <script>fetch('/steal?c='+document.cookie)</script>
// → 다른 사용자 브라우저에서 실행됨`,
    defense:
      "방어:\n1. HTML 출력 시 escape (React는 자동)\n2. CSP 헤더로 inline script 차단\n3. HttpOnly 쿠키로 JS 접근 차단",
    description:
      "XSS: 공격자가 페이지에 스크립트 주입 → 다른 사용자 브라우저에서 실행. 쿠키/세션 탈취, 가짜 폼, 키로깅 등 가능.",
  },
  {
    id: "csrf",
    label: "CSRF 공격",
    attack: "csrf",
    code: `// ❌ 취약: 쿠키 인증만으로 상태 변경
// 공격자 사이트의 폼:
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="hacker"/>
  <input name="amount" value="1000000"/>
</form>
// 로그인한 사용자가 방문하면 자동 제출`,
    defense:
      "방어:\n1. SameSite=Lax/Strict 쿠키\n2. CSRF 토큰 (서버 발급, 폼에 포함)\n3. 상태 변경은 POST + Origin 검증",
    description:
      "CSRF: 로그인된 사용자의 브라우저로 본인 의도와 다른 요청 위조. 브라우저가 쿠키를 자동 첨부하는 게 원인. GET으로 상태 변경 절대 금지.",
  },
  {
    id: "sqli",
    label: "SQL Injection",
    attack: "sqli",
    code: `// ❌ 취약: 문자열 연결로 쿼리 조립
const q = "SELECT * FROM users WHERE name='" + name + "'";
// 입력: name = "' OR '1'='1"
// → SELECT * FROM users WHERE name='' OR '1'='1'
// → 모든 사용자 데이터 반환`,
    defense:
      "방어:\n1. Prepared Statement (파라미터 바인딩)\n2. ORM 사용 (자동 escape)\n3. 최소 권한 DB 계정\n4. 입력 검증 (whitelist)",
    description:
      "SQLi: 사용자 입력이 SQL 문법으로 해석되는 취약점. 데이터 유출/변조, 인증 우회, 심지어 OS 명령 실행까지. Prepared Statement가 가장 확실한 방어.",
  },
  {
    id: "summary",
    label: "요약",
    attack: null,
    code: `// 각 공격의 핵심:
// XSS  - 신뢰할 수 없는 입력이 코드로 실행됨
// CSRF - 인증된 세션을 다른 사이트가 악용
// SQLi - 입력이 SQL 문법 일부가 됨

// 공통 원칙:
// 1. 사용자 입력 = 적대적 입력
// 2. 경계에서 검증
// 3. 출력 시 컨텍스트별 escape`,
    defense:
      "OWASP Top 10에서 매년 갱신. 보안 헤더(CSP, HSTS, X-Frame-Options) 기본 셋업 + 정기 보안 감사 필수.",
    description:
      "세 공격 모두 '신뢰할 수 없는 입력'에서 출발. 방어 원칙은 항상 같음: 입력 검증 + 컨텍스트별 escape + 최소 권한. 한 가지에 의존하지 말고 다층 방어.",
  },
];

export function WebAttacks({ slug }: { slug: string }) {
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

      {step.attack && (
        <div className="flex items-center gap-3 rounded-lg bg-rose-50 px-4 py-2 dark:bg-rose-950">
          <span className="text-xl">🚨</span>
          <span className="font-mono text-sm font-bold text-rose-800 dark:text-rose-200">
            공격 시나리오: {step.attack.toUpperCase()}
          </span>
        </div>
      )}

      <div className="rounded-lg border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs leading-6 text-zinc-100 dark:border-zinc-800">
        <pre className="whitespace-pre-wrap break-words">{step.code}</pre>
      </div>

      <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-950">
        <div className="mb-1 text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300">
          🛡️ 방어
        </div>
        <pre className="whitespace-pre-wrap break-words font-mono text-xs text-emerald-900 dark:text-emerald-100">
          {step.defense}
        </pre>
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
