import type { TopicSidebarContent } from "../topic-content";

export const securityContent: Record<string, TopicSidebarContent> = {
  "oauth-oidc": {
    keyConcepts: [
      {
        term: "OAuth 2.0",
        definition:
          "제3자 앱에 사용자 자원 접근을 위임. Access Token으로 API 호출. '인증'이 아닌 '인가'.",
      },
      {
        term: "OIDC (OpenID Connect)",
        definition:
          "OAuth 위에 신원 확인 추가. ID Token(JWT)이 사용자 정보를 담음.",
      },
      {
        term: "Authorization Code + PKCE",
        definition:
          "보안 표준 흐름. PKCE는 모바일/SPA에서 client secret 없이 안전하게.",
      },
      {
        term: "Implicit Grant 폐기",
        definition:
          "Access Token이 URL에 노출되어 폐기됨. 현재는 Auth Code + PKCE 권장.",
      },
    ],
    interviewQuestions: [
      "OAuth 2.0와 OIDC의 차이는?",
      "Authorization Code 흐름을 단계별로 설명해보세요.",
      "PKCE가 해결하는 문제는?",
      "Access Token과 Refresh Token을 각각 어디에 저장하나요?",
      "OAuth를 인증(로그인)용으로 쓰면 왜 위험한가요?",
    ],
  },

  "password-hashing": {
    keyConcepts: [
      {
        term: "왜 일반 해시는 안 되나",
        definition:
          "SHA-256은 너무 빠름 — GPU로 초당 수십억 시도 가능. 의도적으로 느려야 안전.",
      },
      {
        term: "Salt",
        definition:
          "사용자별 랜덤 값을 비밀번호에 결합. 같은 비밀번호도 다른 해시 → rainbow table 무력화.",
      },
      {
        term: "bcrypt vs Argon2",
        definition:
          "bcrypt: 검증된 표준. Argon2: OWASP 1순위 권장, 메모리 hard로 GPU 공격에 강함.",
      },
      {
        term: "Cost 파라미터",
        definition:
          "bcrypt rounds, Argon2 iterations/memory — 하드웨어 발전에 맞춰 주기적으로 상향.",
      },
    ],
    interviewQuestions: [
      "왜 SHA-256으로 비밀번호 해싱을 하면 안 되나요?",
      "Salt가 어떻게 rainbow table을 무력화하나요?",
      "bcrypt와 Argon2 중 어떤 걸 권장하나요?",
      "Cost를 시간이 지나면서 어떻게 업데이트하나요?",
      "비밀번호 검증 시 timing attack을 어떻게 막나요?",
    ],
  },

  "xss-csrf-sqli": {
    keyConcepts: [
      {
        term: "XSS",
        definition:
          "공격자가 페이지에 스크립트 삽입 → 다른 사용자 브라우저에서 실행. 쿠키/세션 탈취.",
      },
      {
        term: "CSRF",
        definition:
          "로그인된 사용자의 브라우저로 본인 의도와 다른 요청 위조. 쿠키 자동 첨부가 원인.",
      },
      {
        term: "SQL Injection",
        definition:
          "사용자 입력이 SQL 문법으로 해석되는 취약점. ' OR 1=1 -- 같은 페이로드.",
      },
      {
        term: "방어",
        definition:
          "XSS: CSP + 출력 escape, CSRF: SameSite 쿠키 + CSRF 토큰, SQLi: Prepared Statement.",
      },
    ],
    interviewQuestions: [
      "Stored XSS와 Reflected XSS의 차이는?",
      "SameSite 쿠키 속성이 CSRF를 어떻게 막나요?",
      "Prepared Statement가 SQL Injection을 막는 메커니즘은?",
      "CSP(Content Security Policy)를 어떻게 설계하나요?",
      "DOM-based XSS는 어떻게 다른가요?",
    ],
  },

  "jwt-security": {
    keyConcepts: [
      {
        term: "alg=none 공격",
        definition:
          "토큰 헤더의 alg를 none으로 바꾸면 서명 검증 없이 통과되는 라이브러리 함정.",
      },
      {
        term: "Key Confusion",
        definition:
          "RS256 토큰을 HS256으로 검증하게 속이는 공격. 공개키를 비밀키로 오인.",
      },
      {
        term: "즉시 무효화의 어려움",
        definition:
          "JWT는 stateless라 토큰 발행 후 강제 만료가 어려움. 블랙리스트나 짧은 만료+refresh 패턴.",
      },
      {
        term: "어디에 저장?",
        definition:
          "LocalStorage: XSS 취약. HttpOnly Cookie: CSRF 주의. 각각의 트레이드오프.",
      },
    ],
    interviewQuestions: [
      "alg=none 공격을 어떻게 방어하나요?",
      "JWT를 즉시 무효화하려면 어떻게 해야 하나요?",
      "JWT를 LocalStorage vs HttpOnly Cookie에 저장할 때 트레이드오프는?",
      "Access Token이 탈취됐을 때 피해를 줄이는 설계는?",
      "JWT의 자가 검증 가능 특성이 약점이 될 수도 있는 이유는?",
    ],
  },

  "zero-trust": {
    keyConcepts: [
      {
        term: "원칙",
        definition:
          "'네트워크 위치를 신뢰하지 마라' — 사내망이든 외부망이든 모든 요청을 검증.",
      },
      {
        term: "mTLS",
        definition:
          "양방향 TLS — 클라이언트와 서버 모두 인증서로 신원 증명. 서비스간 통신의 기본.",
      },
      {
        term: "최소 권한",
        definition:
          "각 주체에 필요한 최소한의 권한만 부여. 권한은 시간/맥락 제한 (just-in-time).",
      },
      {
        term: "지속 인증 / 컨텍스트 검증",
        definition:
          "한 번 로그인으로 끝이 아니라, 매 요청마다 디바이스/위치/행동 패턴 검증.",
      },
    ],
    interviewQuestions: [
      "기존 경계 기반 보안과 Zero Trust의 차이는?",
      "마이크로서비스 간 mTLS를 어떻게 운영하나요?",
      "Zero Trust 도입 시 가장 큰 어려움은?",
      "BeyondCorp 모델의 핵심 아이디어는?",
      "VPN을 Zero Trust로 어떻게 대체하나요?",
    ],
  },
};
