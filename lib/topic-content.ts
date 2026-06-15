export type KeyConcept = {
  term: string;
  definition: string;
};

export type TopicSidebarContent = {
  keyConcepts: KeyConcept[];
  interviewQuestions: string[];
};

export const topicSidebarContent: Record<string, TopicSidebarContent> = {
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
          "전송되는 데이터의 순서를 보장하기 위한 번호. 연결 시작 시 양쪽이 임의의 값으로 시작.",
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
          "계층별로 부르는 단위 이름: 비트 (L1), 프레임 (L2), 패킷 (L3), 세그먼트 (L4), 데이터 (L5–7).",
      },
      {
        term: "캡슐화 / 디캡슐화",
        definition:
          "상위 계층 데이터에 헤더를 붙여 내려보내고(캡슐화), 받는 쪽은 헤더를 떼며 올려보냄(디캡슐화).",
      },
      {
        term: "TCP/IP 4계층과의 차이",
        definition:
          "TCP/IP는 OSI를 단순화한 실용 모델 — 네트워크 인터페이스 / 인터넷 / 전송 / 응용 4계층.",
      },
    ],
    interviewQuestions: [
      "각 계층의 역할을 한 줄로 설명해보세요.",
      "OSI 7계층과 TCP/IP 4계층의 매핑은 어떻게 되나요?",
      "ARP, IP, TCP, HTTP는 각각 몇 계층에 속하나요?",
      "스위치/라우터/L7 로드밸런서는 각각 어느 계층에서 동작하나요?",
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
          "비대칭키(RSA/ECDHE)로 안전하게 대칭키를 합의한 뒤, 본 통신은 빠른 대칭키(AES 등)로 암호화.",
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
          "A (IPv4), AAAA (IPv6), CNAME (별칭), MX (메일), NS (네임서버), TXT (인증/메타).",
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
};

export function getTopicSidebarContent(
  slug: string
): TopicSidebarContent | undefined {
  return topicSidebarContent[slug];
}
