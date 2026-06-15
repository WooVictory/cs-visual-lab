import type { TopicSidebarContent } from "../topic-content";

export const networkContent: Record<string, TopicSidebarContent> = {
  "tcp-3-way-handshake": {
    keyConcepts: [
      {
        term: "3-way handshake",
        definition:
          "양쪽이 서로의 초기 시퀀스 번호를 확인하고 연결을 수립하는 세 번의 패킷 교환 과정.",
      },
      {
        term: "시퀀스 번호 (seq)",
        definition:
          "전송 데이터의 순서를 보장하기 위한 번호. 연결 시작 시 양쪽이 임의 값으로 시작.",
      },
      {
        term: "ACK 번호",
        definition:
          "다음에 받을 것으로 예상하는 시퀀스 번호. 누적 확인 응답에 사용.",
      },
      {
        term: "TCP 상태",
        definition:
          "CLOSED → SYN_SENT → ESTABLISHED (클라이언트), LISTEN → SYN_RCVD → ESTABLISHED (서버).",
      },
    ],
    interviewQuestions: [
      "왜 2-way가 아니라 3-way handshake가 필요한가요?",
      "SYN flood 공격은 어떻게 동작하고, 어떻게 방어할 수 있나요?",
      "TCP 연결 종료는 왜 4-way handshake인가요?",
      "TIME_WAIT 상태는 왜 존재하나요? 너무 많아지면 어떤 문제가 생기나요?",
      "초기 시퀀스 번호(ISN)를 랜덤하게 시작하는 이유는?",
    ],
  },

  "osi-7-layers": {
    keyConcepts: [
      {
        term: "OSI 7계층",
        definition:
          "물리 → 데이터 링크 → 네트워크 → 전송 → 세션 → 표현 → 응용. 통신을 책임 단위로 추상화한 표준 모델.",
      },
      {
        term: "PDU (Protocol Data Unit)",
        definition:
          "계층별 데이터 단위 이름 — 비트(L1), 프레임(L2), 패킷(L3), 세그먼트(L4), 데이터(L5~7).",
      },
      {
        term: "캡슐화 / 디캡슐화",
        definition:
          "상위 계층 데이터에 헤더를 붙여 내려보내고(캡슐화), 받는 쪽은 헤더를 떼며 올려보냄(디캡슐화).",
      },
      {
        term: "TCP/IP 4계층",
        definition:
          "OSI를 단순화한 실용 모델 — 네트워크 인터페이스 / 인터넷 / 전송 / 응용 4계층.",
      },
    ],
    interviewQuestions: [
      "각 계층의 역할을 한 줄로 설명해보세요.",
      "OSI 7계층과 TCP/IP 4계층의 매핑은 어떻게 되나요?",
      "ARP, IP, TCP, HTTP는 각각 몇 계층에 속하나요?",
      "스위치 · 라우터 · L7 로드밸런서는 각각 어느 계층에서 동작하나요?",
      "왜 7개 계층으로 나누어 추상화하나요 — 한 덩어리면 안 되는 이유?",
    ],
  },

  "https-handshake": {
    keyConcepts: [
      {
        term: "TLS Handshake",
        definition:
          "ClientHello → ServerHello → 인증서 교환 → 키 합의 → Finished. TCP 연결 위에서 동작.",
      },
      {
        term: "대칭키 vs 비대칭키",
        definition:
          "비대칭키(RSA/ECDHE)로 안전하게 대칭키를 합의한 뒤, 본 통신은 빠른 대칭키(AES)로 암호화.",
      },
      {
        term: "인증서 (X.509)",
        definition:
          "서버의 공개키 + 도메인 + 발급기관(CA) 서명. 클라이언트는 CA 체인을 따라 신뢰 검증.",
      },
      {
        term: "Forward Secrecy",
        definition:
          "ECDHE 같은 키 교환을 쓰면 서버 개인키가 나중에 유출돼도 과거 세션은 복호화 불가.",
      },
    ],
    interviewQuestions: [
      "HTTPS와 HTTP의 차이를 보안 관점에서 설명해보세요.",
      "TLS 핸드셰이크 흐름을 단계별로 설명해보세요.",
      "왜 대칭키와 비대칭키를 둘 다 쓰나요? 비대칭키만 쓰면 안 되나요?",
      "중간자 공격(MITM)이 인증서 체계로 어떻게 막아지나요?",
      "TLS 1.3은 1.2 대비 어떤 점이 개선되었나요?",
    ],
  },

  "dns-resolution": {
    keyConcepts: [
      {
        term: "재귀 질의 (Recursive)",
        definition:
          "클라이언트가 리졸버에게 '답만 줘' 요청. 리졸버가 모든 일을 떠안음.",
      },
      {
        term: "반복 질의 (Iterative)",
        definition:
          "리졸버 ↔ 루트 → TLD → 권한 네임서버를 차례로 물어봄. 각 서버는 '다음 서버 위치'만 알려줌.",
      },
      {
        term: "캐시 계층",
        definition:
          "브라우저 → OS → 로컬 리졸버(통신사) → 권한 NS. 각 단계가 TTL 동안 응답을 캐시.",
      },
      {
        term: "주요 레코드 타입",
        definition:
          "A(IPv4), AAAA(IPv6), CNAME(별칭), MX(메일), NS(네임서버), TXT(인증/메타).",
      },
    ],
    interviewQuestions: [
      "브라우저에 도메인을 입력했을 때 DNS 단계가 어떻게 진행되나요?",
      "재귀 질의와 반복 질의의 차이와 각각 누가 사용하나요?",
      "TTL이 너무 짧으면 / 너무 길면 각각 어떤 문제가 생기나요?",
      "CNAME과 ALIAS(또는 ANAME)의 차이는?",
      "CDN은 DNS와 어떻게 연결되어 사용자에게 가까운 서버로 라우팅하나요?",
    ],
  },

  "http-versions": {
    keyConcepts: [
      {
        term: "HOL Blocking (Head-of-Line)",
        definition:
          "앞 요청이 막히면 뒤 요청도 같이 막히는 현상. HTTP/1.1의 핵심 약점.",
      },
      {
        term: "HTTP/2 멀티플렉싱",
        definition:
          "하나의 TCP 연결 위에서 여러 스트림을 동시에 주고받음. 바이너리 프레이밍 + 헤더 압축(HPACK).",
      },
      {
        term: "HTTP/3 + QUIC",
        definition:
          "전송 계층을 TCP에서 UDP 기반 QUIC으로 교체. 0-RTT 연결, 패킷 손실에도 다른 스트림 안 막힘.",
      },
      {
        term: "왜 UDP 위에 QUIC?",
        definition:
          "TCP는 OS 커널과 미들박스에 박혀있어 진화가 어려움. UDP 위에 새 프로토콜을 얹어 빠르게 반복 개선.",
      },
    ],
    interviewQuestions: [
      "HTTP/1.1의 keep-alive와 파이프라이닝의 한계는 무엇인가요?",
      "HTTP/2의 멀티플렉싱이 어떻게 HOL blocking을 해결하나요? 완전히 해결되나요?",
      "HTTP/3는 왜 TCP가 아닌 UDP 기반으로 만들어졌나요?",
      "Server Push (HTTP/2)는 왜 사실상 폐기되었나요?",
      "HTTPS와 HTTP/2의 관계 — H2가 사실상 HTTPS 전제인 이유는?",
    ],
  },

  udp: {
    keyConcepts: [
      {
        term: "비연결성 (Connectionless)",
        definition:
          "핸드셰이크 없이 패킷을 즉시 전송. 연결 수립 비용 없음.",
      },
      {
        term: "비신뢰성",
        definition:
          "재전송/순서보장/혼잡제어 없음. 손실되면 그대로 손실. 빠른 대신 책임은 응용 계층이.",
      },
      {
        term: "UDP 헤더",
        definition:
          "단 8바이트 — 출발지/목적지 포트, 길이, 체크섬. TCP의 20+ 바이트 대비 매우 가벼움.",
      },
      {
        term: "사용 사례",
        definition:
          "DNS(짧은 질의), 게임, VoIP, 비디오 스트리밍, QUIC(HTTP/3 기반).",
      },
    ],
    interviewQuestions: [
      "TCP와 UDP의 차이를 신뢰성 관점에서 설명해보세요.",
      "왜 DNS는 UDP를 사용하나요? 큰 응답이 필요하면 어떻게 하나요?",
      "실시간 영상 스트리밍에서 UDP가 선호되는 이유는?",
      "UDP 위에서 신뢰성을 구현하려면 어떤 요소가 필요한가요?",
      "QUIC이 UDP 기반인데 어떻게 TCP의 신뢰성을 제공하나요?",
    ],
  },

  websocket: {
    keyConcepts: [
      {
        term: "HTTP Upgrade",
        definition:
          "초기 연결은 HTTP로 시작, `Upgrade: websocket` 헤더로 프로토콜 전환. 같은 포트(80/443) 사용.",
      },
      {
        term: "양방향 풀-듀플렉스",
        definition:
          "서버도 클라이언트에 능동적으로 메시지를 보낼 수 있음. 폴링 불필요.",
      },
      {
        term: "프레임 기반",
        definition:
          "HTTP 같은 요청/응답이 아닌, 작은 프레임(바이너리/텍스트)을 양쪽이 자유롭게 전송.",
      },
      {
        term: "사용 사례",
        definition:
          "채팅, 실시간 알림, 협업 문서, 게임, 주식 시세 — 서버 push가 필요한 모든 경우.",
      },
    ],
    interviewQuestions: [
      "WebSocket과 HTTP의 차이를 설명해보세요.",
      "Long Polling, SSE, WebSocket 중 어떤 상황에 어느 것을 쓰나요?",
      "WebSocket 연결이 끊겼을 때 어떻게 재연결/복구 처리하나요?",
      "WebSocket 인증은 보통 어떻게 처리하나요? HTTP 쿠키가 그대로 쓰이나요?",
      "WebSocket 서버를 수평 확장할 때 고려할 점은?",
    ],
  },

  "rest-graphql-grpc": {
    keyConcepts: [
      {
        term: "REST",
        definition:
          "리소스 + HTTP 동사. 캐시 친화, 표준 도구 풍부. 과/소 페칭(over/under-fetching) 문제.",
      },
      {
        term: "GraphQL",
        definition:
          "단일 엔드포인트 + 스키마 + 쿼리. 클라이언트가 필요한 필드만 요청. N+1 문제 주의.",
      },
      {
        term: "gRPC",
        definition:
          "Protocol Buffers + HTTP/2. 바이너리, 강타입, 빠름. 서버-서버 내부 통신에 적합.",
      },
      {
        term: "선택 기준",
        definition:
          "공개 API → REST, 복잡한 모바일/SPA → GraphQL, 마이크로서비스 내부 → gRPC.",
      },
    ],
    interviewQuestions: [
      "REST의 over-fetching / under-fetching이 무엇이고 GraphQL은 어떻게 해결하나요?",
      "GraphQL의 N+1 문제는 무엇이고 DataLoader가 어떻게 해결하나요?",
      "gRPC가 REST보다 빠른 이유는 무엇인가요?",
      "공개 API를 만들 때 GraphQL보다 REST가 선호되는 이유는?",
      "각 방식의 캐싱 전략 차이를 설명해보세요.",
    ],
  },

  "cookie-session-jwt": {
    keyConcepts: [
      {
        term: "Cookie",
        definition:
          "브라우저가 자동으로 저장/전송하는 키-값. Domain, Path, HttpOnly, Secure, SameSite 속성.",
      },
      {
        term: "Session",
        definition:
          "서버가 상태(로그인 등)를 보관, 브라우저엔 식별자(Session ID)만 쿠키로. 서버 메모리/DB 필요.",
      },
      {
        term: "JWT",
        definition:
          "Header.Payload.Signature 구조. 서버는 상태 저장 안 함(stateless). 토큰 자체에 정보+서명.",
      },
      {
        term: "트레이드오프",
        definition:
          "Session: 강제 만료/즉시 무효화 쉬움, 확장성 부담. JWT: 확장성 좋음, 즉시 무효화 어려움.",
      },
    ],
    interviewQuestions: [
      "Session과 JWT의 차이와 각각의 장단점을 설명해보세요.",
      "JWT를 LocalStorage vs HttpOnly Cookie에 저장할 때 보안 차이는?",
      "Refresh Token이 왜 필요한가요? Access Token만 길게 주면 안 되나요?",
      "JWT를 즉시 무효화하려면 어떻게 해야 하나요?",
      "SameSite 쿠키 속성이 CSRF 방어에 어떻게 기여하나요?",
    ],
  },

  cors: {
    keyConcepts: [
      {
        term: "동일 출처 정책 (SOP)",
        definition:
          "브라우저가 다른 출처(scheme + host + port)의 리소스를 스크립트로 접근 못하게 막는 보안 정책.",
      },
      {
        term: "Preflight (OPTIONS)",
        definition:
          "GET/HEAD/POST의 단순 요청이 아닌 경우, 본 요청 전에 OPTIONS로 서버 허용 여부 확인.",
      },
      {
        term: "주요 응답 헤더",
        definition:
          "Access-Control-Allow-Origin/Methods/Headers/Credentials. 브라우저가 응답을 받아도 헤더 없으면 차단.",
      },
      {
        term: "credentials: include",
        definition:
          "쿠키를 함께 보내려면 클라이언트는 credentials, 서버는 Allow-Credentials=true + 명시적 Origin 필요.",
      },
    ],
    interviewQuestions: [
      "CORS가 정확히 무엇을 막는 것인가요? 서버 요청을 막는 게 아니라는데 무슨 뜻인가요?",
      "Preflight 요청이 발생하는 조건은?",
      "Allow-Origin을 `*`로 설정해도 되는 경우와 안 되는 경우는?",
      "쿠키 인증을 쓰는 SPA에서 CORS는 어떻게 설정하나요?",
      "CORS 에러가 났을 때 서버/클라이언트 중 어디를 고쳐야 하는지 어떻게 판단하나요?",
    ],
  },

  "load-balancer": {
    keyConcepts: [
      {
        term: "L4 vs L7",
        definition:
          "L4 = TCP/UDP 수준, IP·포트로 분배. L7 = HTTP 수준, URL·쿠키·헤더로 분배. L7이 유연하지만 비용↑.",
      },
      {
        term: "분배 알고리즘",
        definition:
          "Round Robin, Least Connections, IP Hash, Weighted, Random — 트래픽 특성에 따라 선택.",
      },
      {
        term: "헬스 체크",
        definition:
          "주기적으로 백엔드 상태 확인. 응답 없는 노드는 풀에서 제외해 장애 격리.",
      },
      {
        term: "세션 어피니티 (Sticky)",
        definition:
          "같은 클라이언트는 같은 서버로 라우팅. 세션 공유 못 할 때 사용 — 다만 확장성 저해.",
      },
    ],
    interviewQuestions: [
      "L4 vs L7 로드밸런서의 차이와 각각 언제 쓰나요?",
      "Round Robin과 Least Connections의 트레이드오프는?",
      "헬스 체크가 너무 빈번하면 / 너무 드물면 각각 어떤 문제가 생기나요?",
      "Sticky Session의 단점과 대안은?",
      "DNS Round Robin과 진짜 로드밸런서의 차이는?",
    ],
  },

  cdn: {
    keyConcepts: [
      {
        term: "Edge Server",
        definition:
          "사용자와 지리적으로 가까운 PoP에 배치된 캐시 서버. 첫 응답 후 캐시해 이후 요청은 origin 없이 즉시 응답.",
      },
      {
        term: "Cache-Control",
        definition:
          "max-age, s-maxage, public/private, no-store 등 — 어떻게/얼마나 캐시할지 origin이 명시.",
      },
      {
        term: "캐시 무효화 (Invalidation)",
        definition:
          "Purge API, 버전드 URL(fingerprint), 짧은 TTL — 새 콘텐츠를 빠르게 반영하는 전략.",
      },
      {
        term: "Origin Shield",
        definition:
          "Edge들 사이에 한 단계 더 두는 캐시. Origin 직접 요청 수 줄여 부하 보호.",
      },
    ],
    interviewQuestions: [
      "CDN이 어떻게 응답 속도를 줄이는지 단계별로 설명해보세요.",
      "정적 자산에 fingerprint(파일명에 해시)를 붙이는 이유는?",
      "Cache-Control의 public과 private 차이는?",
      "캐시 히트율을 측정하고 개선하려면 무엇을 보나요?",
      "CDN을 쓸 때 SSL 인증서는 어디서 발급되어 어디에 설치되나요?",
    ],
  },

  proxy: {
    keyConcepts: [
      {
        term: "Forward Proxy",
        definition:
          "클라이언트 측에 위치. 클라이언트 → 프록시 → 인터넷. 사용자 익명화, 콘텐츠 필터링, 캐시.",
      },
      {
        term: "Reverse Proxy",
        definition:
          "서버 측에 위치. 클라이언트 → 프록시 → 백엔드. 로드밸런싱, SSL 종료, 캐시, 보안.",
      },
      {
        term: "SSL Termination",
        definition:
          "프록시에서 HTTPS를 풀고 백엔드는 평문 HTTP로 통신. CPU 비용을 한 곳에 집중.",
      },
      {
        term: "대표 도구",
        definition:
          "Nginx, HAProxy, Envoy, Traefik — 대부분 reverse proxy로 사용.",
      },
    ],
    interviewQuestions: [
      "Forward Proxy와 Reverse Proxy의 차이를 사용 위치로 설명해보세요.",
      "Reverse Proxy로 SSL 종료를 하면 어떤 이점과 위험이 있나요?",
      "Nginx 같은 reverse proxy가 보통 어떤 일을 처리하나요?",
      "API Gateway와 Reverse Proxy의 차이는?",
      "프록시를 다단계로 두는 이유는 무엇인가요?",
    ],
  },

  nat: {
    keyConcepts: [
      {
        term: "NAT 동작",
        definition:
          "사설 IP(10.x, 172.16~31.x, 192.168.x)를 공인 IP + 포트로 매핑해 인터넷과 통신.",
      },
      {
        term: "PAT (포트 변환)",
        definition:
          "여러 내부 호스트를 단일 공인 IP에 다중화. 포트로 구분 — 대부분의 가정/회사 NAT가 이것.",
      },
      {
        term: "NAT 부작용",
        definition:
          "외부에서 내부로 먼저 연결 불가(in-bound 차단), P2P 어려움, end-to-end 원칙 깨짐.",
      },
      {
        term: "NAT 우회 기법",
        definition:
          "STUN, TURN, ICE — 외부 보조 서버로 NAT 뒤에 있는 호스트끼리 연결 (WebRTC가 사용).",
      },
    ],
    interviewQuestions: [
      "NAT이 왜 등장했고 무엇을 해결하나요?",
      "포트 포워딩이 무엇이고 어떤 경우에 필요한가요?",
      "NAT 뒤에 있는 두 사용자가 어떻게 직접 P2P 연결을 맺나요?",
      "IPv6가 보급되면 NAT은 사라지나요?",
      "Symmetric NAT과 Cone NAT의 차이를 P2P 관점에서 설명해보세요.",
    ],
  },

  "subnet-cidr": {
    keyConcepts: [
      {
        term: "서브넷 마스크",
        definition:
          "IP 주소에서 네트워크 부분과 호스트 부분을 구분. 예: /24는 상위 24비트가 네트워크.",
      },
      {
        term: "CIDR 표기",
        definition:
          "192.168.1.0/24 같은 형식. 가변 길이 서브넷을 단순 표기. 클래스 기반의 한계 극복.",
      },
      {
        term: "주소 계산",
        definition:
          "/24 = 256개 주소 (256 - 2 호스트, 네트워크/브로드캐스트 제외). 비트 수마다 2의 거듭제곱.",
      },
      {
        term: "Supernetting",
        definition:
          "여러 작은 네트워크를 큰 prefix 하나로 묶어 라우팅 테이블 크기 축소.",
      },
    ],
    interviewQuestions: [
      "192.168.1.0/24와 192.168.1.0/25는 각각 몇 개의 호스트를 수용하나요?",
      "CIDR이 클래스 기반(A/B/C) 주소 체계를 대체한 이유는?",
      "VPC 설계 시 서브넷 크기를 어떻게 정하나요?",
      "Public Subnet과 Private Subnet의 차이를 라우팅 관점에서 설명해보세요.",
      "두 CIDR이 겹치는지(overlap) 어떻게 판단하나요?",
    ],
  },
};
