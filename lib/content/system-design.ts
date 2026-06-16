import type { TopicSidebarContent } from "../topic-content";

export const systemDesignContent: Record<string, TopicSidebarContent> = {
  "caching-strategy": {
    keyConcepts: [
      {
        term: "Cache-Aside (Lazy Load)",
        definition:
          "앱이 캐시 확인 → 미스 시 DB 조회 → 캐시 쓰기. 가장 일반적. 첫 요청은 느림.",
      },
      {
        term: "Write-Through",
        definition:
          "쓰기 시 DB + 캐시 동시 갱신. 일관성↑, 쓰기 지연↑.",
      },
      {
        term: "Write-Behind (Write-Back)",
        definition:
          "쓰기는 캐시에만 → 비동기로 DB 반영. 쓰기 빠름, 장애 시 데이터 손실 위험.",
      },
      {
        term: "캐시 무효화",
        definition:
          "TTL 만료, 이벤트 기반 무효화, 명시적 invalidate — 'cache invalidation is one of the two hard things'.",
      },
    ],
    interviewQuestions: [
      "Cache-aside와 Write-through 중 언제 무엇을 선택하나요?",
      "Cache Stampede(thundering herd) 문제와 해결책은?",
      "Read-Heavy vs Write-Heavy 워크로드에서 캐시 전략이 어떻게 달라지나요?",
      "캐시 일관성을 어떻게 보장하나요? (TTL vs 이벤트)",
      "Hot Key 문제를 어떻게 다루나요?",
    ],
  },

  "message-queue": {
    keyConcepts: [
      {
        term: "Queue vs Pub/Sub",
        definition:
          "Queue: 메시지 하나가 한 컨슈머에. Pub/Sub: 모든 구독자에게 전달. Kafka는 둘 다 지원.",
      },
      {
        term: "Delivery Semantics",
        definition:
          "at-most-once(손실 가능), at-least-once(중복 가능), exactly-once(어려움, 비쌈).",
      },
      {
        term: "Kafka vs RabbitMQ",
        definition:
          "Kafka: 로그 기반, 처리량↑, 재처리 쉬움. RabbitMQ: 라우팅↑, 메시지 ack 정교함.",
      },
      {
        term: "Backpressure",
        definition:
          "컨슈머가 생산자 속도 못 따라갈 때. 큐 크기 제한, 백프레셔 신호, 차단 vs drop.",
      },
    ],
    interviewQuestions: [
      "Kafka와 RabbitMQ를 언제 각각 선택하나요?",
      "Exactly-once를 구현하기 어려운 이유는?",
      "Consumer가 메시지를 처리하다 죽으면 어떻게 회복하나요?",
      "Dead Letter Queue가 왜 필요한가요?",
      "Backpressure를 어떻게 다루나요?",
    ],
  },

  "event-driven": {
    keyConcepts: [
      {
        term: "이벤트 드리븐",
        definition:
          "서비스가 서로 직접 호출 X, 이벤트(사실)를 발행 → 관심 있는 구독자가 처리. 결합도↓.",
      },
      {
        term: "Event Sourcing",
        definition:
          "상태가 아니라 이벤트의 시퀀스를 저장. 과거 어떤 시점이든 재구성 가능.",
      },
      {
        term: "CQRS",
        definition:
          "Command(쓰기)와 Query(읽기) 모델 분리. 쓰기는 정규화, 읽기는 비정규화로 최적화.",
      },
      {
        term: "Eventual Consistency",
        definition:
          "이벤트 전파에 시간이 걸려 잠시 다른 값을 볼 수 있음. UX 설계에 영향.",
      },
    ],
    interviewQuestions: [
      "이벤트 드리븐의 핵심 장점과 단점은?",
      "Event Sourcing이 어떤 도메인에 적합한가요?",
      "CQRS가 모든 서비스에 좋은 선택인가요?",
      "이벤트 순서 보장은 어떻게 다루나요?",
      "이벤트 스키마 진화(evolution)는 어떻게 관리하나요?",
    ],
  },

  microservices: {
    keyConcepts: [
      {
        term: "독립 배포",
        definition:
          "서비스마다 독립 배포 사이클. 한 팀이 한 서비스 책임 → 조직 확장에 유리.",
      },
      {
        term: "분산 트레이드오프",
        definition:
          "네트워크 호출, 분산 트랜잭션, 모니터링 복잡도↑. 작은 팀에선 보통 손해.",
      },
      {
        term: "서비스 경계",
        definition:
          "도메인 경계(DDD의 bounded context) 기준. 데이터를 공유하지 말고 API로 통신.",
      },
      {
        term: "관찰 가능성",
        definition:
          "로그/메트릭/트레이스 — 분산에서 디버깅 가능하려면 필수. OpenTelemetry 표준화 중.",
      },
    ],
    interviewQuestions: [
      "마이크로서비스로 가야 할 시그널은 무엇인가요?",
      "Modular Monolith가 더 나은 경우는?",
      "서비스 경계를 어떻게 정하나요?",
      "마이크로서비스에서 분산 트랜잭션은 어떻게 처리하나요?",
      "디버깅이 어려워지는 문제를 어떻게 완화하나요?",
    ],
  },

  "api-gateway": {
    keyConcepts: [
      {
        term: "API Gateway",
        definition:
          "공통 관심사 처리: 인증, rate limit, 라우팅, 로깅. 모든 외부 요청의 단일 진입점.",
      },
      {
        term: "BFF (Backend for Frontend)",
        definition:
          "클라이언트별(웹/모바일) 전용 백엔드. 데이터 조합과 모양을 클라이언트에 맞게.",
      },
      {
        term: "Service Mesh와 차이",
        definition:
          "Gateway는 north-south(외부↔내부), Service Mesh는 east-west(서비스간) 트래픽.",
      },
      {
        term: "장단점",
        definition:
          "장: 일관된 정책, 보안 단일점. 단: SPOF 위험, 게이트웨이가 비대해질 위험.",
      },
    ],
    interviewQuestions: [
      "API Gateway가 처리해야 할 책임과 처리하면 안 되는 것은?",
      "BFF 패턴이 적합한 시점은 언제인가요?",
      "Gateway가 SPOF가 되지 않게 어떻게 운영하나요?",
      "Gateway vs Service Mesh를 어떻게 구분하나요?",
      "Gateway에서 인증을 어떻게 위임/검증하나요?",
    ],
  },

  "idempotency-saga": {
    keyConcepts: [
      {
        term: "멱등성 키",
        definition:
          "클라이언트가 보낸 Idempotency-Key를 서버가 저장. 같은 키로 재시도하면 같은 응답.",
      },
      {
        term: "Saga 패턴",
        definition:
          "분산 트랜잭션을 일련의 로컬 트랜잭션 + 보상(compensation) 트랜잭션으로 구성.",
      },
      {
        term: "Orchestration vs Choreography",
        definition:
          "Orchestrator가 흐름 제어 vs 각 서비스가 이벤트로 자율 협업. 가독성 vs 결합도.",
      },
      {
        term: "Outbox 패턴",
        definition:
          "DB 트랜잭션 + 이벤트 발행을 한 번에 — 이벤트를 같은 DB의 outbox 테이블에 저장 후 별도 프로세스가 발송.",
      },
    ],
    interviewQuestions: [
      "결제 API에 멱등성을 어떻게 구현하나요?",
      "Saga Orchestration과 Choreography의 트레이드오프는?",
      "보상 트랜잭션을 설계할 때 주의할 점은?",
      "Outbox 패턴이 해결하는 문제는?",
      "분산 트랜잭션을 아예 피할 방법이 있나요?",
    ],
  },

  "rate-limiting": {
    keyConcepts: [
      {
        term: "Token Bucket",
        definition:
          "토큰을 일정 속도로 채움, 요청은 토큰 소비. 일시적 burst 허용. 대부분 API의 표준.",
      },
      {
        term: "Leaky Bucket",
        definition:
          "고정 속도로만 처리. burst 부드럽게 흐르게 — 트래픽 평탄화에 유리.",
      },
      {
        term: "Fixed vs Sliding Window",
        definition:
          "고정창은 단순하지만 경계 burst 문제. 슬라이딩은 정확하지만 메모리↑.",
      },
      {
        term: "분산 환경",
        definition:
          "여러 노드에서 같이 카운트하려면 중앙 저장소(Redis) 필요. 정확도 vs 지연 트레이드오프.",
      },
    ],
    interviewQuestions: [
      "Token Bucket과 Leaky Bucket의 차이는?",
      "Fixed Window의 경계 burst 문제를 설명해보세요.",
      "분산 환경에서 정확한 rate limit을 구현하기 어려운 이유는?",
      "사용자별/IP별/엔드포인트별 limit을 어떻게 설계하나요?",
      "Rate limit 초과 시 HTTP 응답 코드와 헤더는?",
    ],
  },
};
