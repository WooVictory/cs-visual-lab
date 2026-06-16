export type TopicDomain =
  | "ai-llm"
  | "mobile"
  | "network"
  | "system-design"
  | "distributed"
  | "security"
  | "os"
  | "database"
  | "algorithm"
  | "design-pattern"
  | "language";

export type TopicStatus = "ready" | "draft";

export type Topic = {
  slug: string;
  title: string;
  description: string;
  domain: TopicDomain;
  status: TopicStatus;
  hasVisualization: boolean;
};

export const domainLabel: Record<TopicDomain, string> = {
  "ai-llm": "AI / LLM",
  mobile: "안드로이드 · 모바일",
  network: "네트워크",
  "system-design": "시스템 디자인",
  distributed: "분산 시스템",
  security: "보안",
  os: "운영체제",
  database: "데이터베이스",
  algorithm: "알고리즘 & 자료구조",
  "design-pattern": "디자인 패턴",
  language: "언어",
};

export const domainOrder: TopicDomain[] = [
  "ai-llm",
  "mobile",
  "network",
  "system-design",
  "distributed",
  "security",
  "os",
  "database",
  "algorithm",
  "design-pattern",
  "language",
];

export const topics: Topic[] = [
  // ===== 네트워크 (15) =====
  {
    slug: "tcp-3-way-handshake",
    title: "TCP 3-way Handshake",
    description:
      "클라이언트와 서버가 SYN / SYN-ACK / ACK 세 번의 패킷 교환으로 연결을 수립하는 과정.",
    domain: "network",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "osi-7-layers",
    title: "OSI 7계층",
    description:
      "네트워크 통신을 물리 계층부터 응용 계층까지 7개의 추상 계층으로 나눈 표준 모델.",
    domain: "network",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "https-handshake",
    title: "HTTPS Handshake",
    description:
      "TLS 핸드셰이크로 인증서를 교환하고 대칭키를 합의해 안전한 채널을 만드는 흐름.",
    domain: "network",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "dns-resolution",
    title: "DNS Resolution",
    description:
      "도메인 이름이 IP 주소로 변환되는 재귀/반복 질의와 캐시 단계.",
    domain: "network",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "http-versions",
    title: "HTTP/1.1 → HTTP/2 → HTTP/3",
    description:
      "HOL blocking, 멀티플렉싱, QUIC까지 — HTTP가 진화해 온 이유.",
    domain: "network",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "udp",
    title: "UDP",
    description:
      "비연결 · 비신뢰성 전송 프로토콜. TCP의 안전성 대신 속도와 단순함을 선택.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "websocket",
    title: "WebSocket",
    description:
      "HTTP 업그레이드로 시작해 양방향 풀-듀플렉스 통신을 지원하는 프로토콜.",
    domain: "network",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "rest-graphql-grpc",
    title: "REST vs GraphQL vs gRPC",
    description:
      "세 가지 API 스타일의 데이터 모델, 전송 방식, 사용 시점 비교.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "cookie-session-jwt",
    title: "Cookie · Session · JWT",
    description:
      "웹 인증 상태 유지의 세 가지 접근과 각각의 보안 트레이드오프.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "cors",
    title: "CORS",
    description:
      "브라우저 동일 출처 정책과 그 우회 메커니즘. preflight와 헤더 협상.",
    domain: "network",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "load-balancer",
    title: "Load Balancer",
    description:
      "L4(전송) vs L7(응용) 로드밸런서. 라운드 로빈, Least Conn 등 분배 알고리즘.",
    domain: "network",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "cdn",
    title: "CDN",
    description:
      "지리적으로 분산된 엣지 서버 네트워크. 캐시 무효화와 origin shield.",
    domain: "network",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "proxy",
    title: "Forward · Reverse Proxy",
    description:
      "클라이언트 측 프록시와 서버 측 프록시의 역할과 사용 사례 차이.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "nat",
    title: "NAT",
    description:
      "사설 IP 주소를 공인 IP로 변환. IPv4 주소 부족과 NAT의 부작용.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "subnet-cidr",
    title: "Subnet & CIDR",
    description:
      "IP 주소 공간을 분할하는 방식. 비트 마스크와 라우팅 효율.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },

  // ===== 운영체제 (8) =====
  {
    slug: "process-vs-thread",
    title: "프로세스 vs 스레드",
    description:
      "주소공간 격리 vs 공유. 자원 단위와 실행 단위의 차이.",
    domain: "os",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "cpu-scheduling",
    title: "CPU 스케줄링",
    description:
      "FCFS, SJF, Round Robin, MLFQ — 어떤 프로세스를 언제 실행할지 결정하는 정책.",
    domain: "os",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "synchronization",
    title: "동기화 (Mutex/Semaphore)",
    description:
      "뮤텍스, 세마포어, 모니터 — 공유 자원 접근을 직렬화하는 메커니즘.",
    domain: "os",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "deadlock",
    title: "데드락",
    description:
      "프로세스들이 서로 자원을 기다리며 진행 못하는 상태. 4가지 발생 조건과 회피 전략.",
    domain: "os",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "paging-segmentation",
    title: "페이징 & 세그멘테이션",
    description:
      "가상 메모리를 관리하는 두 가지 방식과 그 트레이드오프.",
    domain: "os",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "ipc",
    title: "IPC (프로세스 간 통신)",
    description:
      "파이프, 메시지 큐, 공유 메모리, 소켓 — 격리된 프로세스가 데이터를 교환하는 방법.",
    domain: "os",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "system-call",
    title: "시스템 콜",
    description:
      "사용자 모드와 커널 모드의 경계를 넘어 OS 기능을 호출하는 인터페이스.",
    domain: "os",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "context-switch",
    title: "컨텍스트 스위칭",
    description:
      "실행 중인 프로세스/스레드 상태를 저장하고 다른 것으로 전환하는 과정과 그 비용.",
    domain: "os",
    status: "ready",
    hasVisualization: true,
  },

  // ===== 데이터베이스 (6) =====
  {
    slug: "db-index",
    title: "데이터베이스 인덱스",
    description:
      "B-Tree, Hash Index — 조회 성능을 위한 자료구조와 쓰기 비용 트레이드오프.",
    domain: "database",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "normalization",
    title: "정규화",
    description:
      "1NF · 2NF · 3NF · BCNF — 중복 제거와 데이터 무결성 vs 조인 비용.",
    domain: "database",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "transaction-acid",
    title: "트랜잭션 & ACID",
    description:
      "원자성 · 일관성 · 격리성 · 지속성 — DB 신뢰성의 4가지 보장.",
    domain: "database",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "isolation-level",
    title: "격리 수준",
    description:
      "Read Uncommitted부터 Serializable까지 — 동시성과 일관성의 트레이드오프.",
    domain: "database",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "rdb-vs-nosql",
    title: "RDB vs NoSQL",
    description:
      "관계형 vs 도큐먼트 / 키-값 / 그래프 — 데이터 모델과 확장성 차이.",
    domain: "database",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "db-lock",
    title: "데이터베이스 락",
    description:
      "공유 락 vs 배타 락, 낙관적 vs 비관적 — 동시 트랜잭션 충돌 관리.",
    domain: "database",
    status: "ready",
    hasVisualization: false,
  },

  // ===== 알고리즘 (6) =====
  {
    slug: "big-o",
    title: "시간복잡도 (Big-O)",
    description:
      "알고리즘 효율을 입력 크기 대비 증가율로 표현하는 점근 표기법.",
    domain: "algorithm",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "sorting",
    title: "정렬 알고리즘",
    description:
      "버블 · 선택 · 삽입 · 병합 · 퀵 · 힙 — 평균과 최악 시간복잡도 비교.",
    domain: "algorithm",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "searching",
    title: "탐색 알고리즘",
    description:
      "선형 · 이진 · 해시 — 자료구조 선택이 탐색 효율을 결정한다.",
    domain: "algorithm",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "dynamic-programming",
    title: "동적 프로그래밍",
    description:
      "겹치는 부분 문제 + 최적 부분 구조 — 메모이제이션 vs 타뷸레이션.",
    domain: "algorithm",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "graph-dfs-bfs",
    title: "그래프 탐색 (DFS/BFS)",
    description:
      "깊이 우선 vs 너비 우선 — 스택 vs 큐, 최단 경로 vs 백트래킹.",
    domain: "algorithm",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "tree-heap",
    title: "트리 & 힙",
    description:
      "이진 트리, BST, AVL, 힙 — 균형과 우선순위 처리를 위한 자료구조.",
    domain: "algorithm",
    status: "ready",
    hasVisualization: false,
  },

  // ===== 디자인 패턴 (5) =====
  {
    slug: "singleton",
    title: "싱글톤 패턴",
    description:
      "단 하나의 인스턴스를 보장. 멀티스레드 환경과 테스트 가능성 이슈.",
    domain: "design-pattern",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "factory",
    title: "팩토리 패턴",
    description:
      "객체 생성을 캡슐화. 직접 new 호출 대신 팩토리에 위임.",
    domain: "design-pattern",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "observer",
    title: "옵저버 패턴",
    description:
      "1-N 의존 관계 — 상태 변화를 구독자에게 자동 전파.",
    domain: "design-pattern",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "strategy",
    title: "전략 패턴",
    description:
      "알고리즘을 캡슐화해 런타임에 교체. 조건문 다중 분기의 대안.",
    domain: "design-pattern",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "solid",
    title: "SOLID 원칙",
    description:
      "객체지향 설계의 5가지 원칙 — SRP · OCP · LSP · ISP · DIP.",
    domain: "design-pattern",
    status: "ready",
    hasVisualization: false,
  },

  // ===== 언어 (3) =====
  {
    slug: "jvm-gc",
    title: "JVM & Garbage Collection",
    description:
      "JVM의 메모리 영역과 GC 알고리즘 (Serial, Parallel, G1, ZGC) 비교.",
    domain: "language",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "java-vs-kotlin",
    title: "Java vs Kotlin",
    description:
      "Null 안전성, 데이터 클래스, 코루틴 — Kotlin이 Java 위에서 해결한 문제들.",
    domain: "language",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "python-gil",
    title: "Python GIL",
    description:
      "Global Interpreter Lock — Python 멀티스레드가 진짜 병렬이 아닌 이유.",
    domain: "language",
    status: "ready",
    hasVisualization: false,
  },

  // ===== AI / LLM (10) =====
  {
    slug: "transformer-attention",
    title: "트랜스포머 & Self-Attention",
    description:
      "Self-attention으로 문맥을 동시에 처리하는 신경망 구조. GPT/BERT의 기반.",
    domain: "ai-llm",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "embedding",
    title: "임베딩 (Embedding)",
    description:
      "단어/문장을 의미를 보존하는 고차원 벡터로 변환. 유사도 검색의 핵심.",
    domain: "ai-llm",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "tokenization",
    title: "토큰화 (Tokenization)",
    description:
      "텍스트를 모델 입력 단위로 쪼개기. BPE, WordPiece, SentencePiece.",
    domain: "ai-llm",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "context-window",
    title: "컨텍스트 윈도우",
    description:
      "LLM이 한 번에 처리할 수 있는 토큰 수. 비용과 메모리의 핵심 제약.",
    domain: "ai-llm",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "rag",
    title: "RAG (검색 증강 생성)",
    description:
      "임베딩 검색으로 관련 문서를 찾아 LLM에 컨텍스트로 주입하는 패턴.",
    domain: "ai-llm",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "vector-database",
    title: "벡터 데이터베이스",
    description:
      "임베딩 벡터를 저장하고 유사도 검색을 빠르게 — pgvector, Pinecone, Qdrant.",
    domain: "ai-llm",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "prompt-engineering",
    title: "프롬프트 엔지니어링",
    description:
      "Few-shot, Chain-of-Thought, 역할 부여 — LLM에서 좋은 답을 끌어내는 방법.",
    domain: "ai-llm",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "function-calling",
    title: "함수 호출 (Tool Use)",
    description:
      "LLM이 외부 함수/API를 스키마에 따라 호출하게 — Agent의 출발점.",
    domain: "ai-llm",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "mcp",
    title: "MCP (Model Context Protocol)",
    description:
      "LLM과 외부 도구/리소스를 표준화된 프로토콜로 연결하는 Anthropic의 오픈 표준.",
    domain: "ai-llm",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "ai-agent",
    title: "AI 에이전트 패턴",
    description:
      "ReAct, Reflection, Multi-agent — LLM이 도구를 쓰며 단계적으로 문제를 푸는 패턴.",
    domain: "ai-llm",
    status: "ready",
    hasVisualization: true,
  },

  // ===== 안드로이드 · 모바일 (10) =====
  {
    slug: "android-lifecycle",
    title: "Activity / Fragment 생명주기",
    description:
      "onCreate → onStart → onResume → ... → onDestroy. 시스템 이벤트가 부르는 콜백 시퀀스.",
    domain: "mobile",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "jetpack-compose",
    title: "Jetpack Compose vs XML View",
    description:
      "선언형 UI vs 명령형 UI. Recomposition과 State 기반의 새로운 패러다임.",
    domain: "mobile",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "kotlin-coroutines",
    title: "Kotlin Coroutines",
    description:
      "suspend 함수, structured concurrency, CoroutineScope — 콜백 지옥 없이 비동기 처리.",
    domain: "mobile",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "flow-stateflow",
    title: "Flow · StateFlow · LiveData",
    description:
      "비동기 스트림 (Flow), UI 상태 (StateFlow), 생명주기 인식 (LiveData) — 언제 무엇을 쓰는가.",
    domain: "mobile",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "android-architecture",
    title: "앱 아키텍처 (MVVM · MVI · Clean)",
    description:
      "UI 상태 관리와 도메인 로직 분리 — 안드로이드 권장 아키텍처와 변형들.",
    domain: "mobile",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "dependency-injection-android",
    title: "Hilt · Koin 의존성 주입",
    description:
      "안드로이드용 DI 프레임워크 — 컴포넌트 스코프, 빌드 타임 vs 런타임.",
    domain: "mobile",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "android-memory-leak",
    title: "안드로이드 메모리 누수",
    description:
      "Context 누수, inner class, static 참조 — LeakCanary로 잡는 흔한 패턴들.",
    domain: "mobile",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "work-manager",
    title: "WorkManager 백그라운드 작업",
    description:
      "앱이 죽어도 보장되는 작업 큐. Doze 모드, 배터리 제약과 함께 동작.",
    domain: "mobile",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "anr",
    title: "ANR (Application Not Responding)",
    description:
      "메인 스레드 5초 이상 블록 시 발생. 원인 패턴과 디버깅 방법.",
    domain: "mobile",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "android-build",
    title: "Gradle · R8 · ProGuard",
    description:
      "멀티 모듈 빌드, 코드 축소/난독화, 빌드 시간 최적화의 핵심 도구들.",
    domain: "mobile",
    status: "ready",
    hasVisualization: false,
  },

  // ===== 시스템 디자인 (7) =====
  {
    slug: "caching-strategy",
    title: "캐싱 전략",
    description:
      "Cache-aside, Write-through, Write-behind, Read-through — 데이터 일관성과 성능 트레이드오프.",
    domain: "system-design",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "message-queue",
    title: "메시지 큐 (Kafka · RabbitMQ)",
    description:
      "Pub/Sub vs Queue, at-most/at-least/exactly-once delivery — 비동기 통신의 코어.",
    domain: "system-design",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "event-driven",
    title: "이벤트 드리븐 아키텍처",
    description:
      "서비스간 직접 호출 대신 이벤트로 결합도 낮춤. 이벤트 소싱과 CQRS.",
    domain: "system-design",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "microservices",
    title: "마이크로서비스 vs 모놀리스",
    description:
      "독립 배포 vs 단순 배포, 분산 트레이드오프, 언제 분리하고 언제 합치는가.",
    domain: "system-design",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "api-gateway",
    title: "API Gateway · BFF",
    description:
      "공통 관심사(인증, rate limit)를 게이트웨이로, 클라이언트별 BFF로 분리.",
    domain: "system-design",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "idempotency-saga",
    title: "멱등성 · Saga 패턴",
    description:
      "재시도 안전성을 위한 멱등 키, 분산 트랜잭션을 보상 트랜잭션으로 묶는 Saga.",
    domain: "system-design",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "rate-limiting",
    title: "Rate Limiting",
    description:
      "Token Bucket, Leaky Bucket, Fixed/Sliding Window — 트래픽 제어 알고리즘.",
    domain: "system-design",
    status: "ready",
    hasVisualization: true,
  },

  // ===== 분산 시스템 (5) =====
  {
    slug: "cap-pacelc",
    title: "CAP · PACELC 정리",
    description:
      "분할 시 일관성 vs 가용성 선택. 평상시엔 지연 vs 일관성 — PACELC가 보강.",
    domain: "distributed",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "consensus-raft",
    title: "Consensus (Raft)",
    description:
      "리더 선출, 로그 복제, 안전성 — 분산 합의를 이해하기 쉬운 알고리즘으로.",
    domain: "distributed",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "data-replication",
    title: "데이터 복제",
    description:
      "Master-Slave, Multi-Master, Quorum 기반 — 가용성과 일관성의 균형.",
    domain: "distributed",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "sharding",
    title: "샤딩 · 파티셔닝",
    description:
      "데이터를 키 기준으로 노드에 분산. Hash · Range · Consistent Hashing.",
    domain: "distributed",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "consistency-models",
    title: "일관성 모델",
    description:
      "Strong · Sequential · Causal · Eventual — 분산에서 '같은 값을 본다'의 정확한 의미.",
    domain: "distributed",
    status: "ready",
    hasVisualization: false,
  },

  // ===== 보안 (5) =====
  {
    slug: "oauth-oidc",
    title: "OAuth 2.0 · OIDC",
    description:
      "위임 인가 (OAuth) + 신원 확인 (OIDC). Auth Code, PKCE, ID Token 흐름.",
    domain: "security",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "password-hashing",
    title: "비밀번호 해싱 (bcrypt · Argon2)",
    description:
      "salt + cost — 무차별 대입을 의도적으로 느리게. SHA-256으로는 부족한 이유.",
    domain: "security",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "xss-csrf-sqli",
    title: "XSS · CSRF · SQL Injection",
    description:
      "웹 3대 취약점 — 어떻게 동작하고, 어떻게 방어하는가.",
    domain: "security",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "jwt-security",
    title: "JWT 보안 함정",
    description:
      "alg=none, key confusion, 만료/취소 어려움 — JWT가 자주 잘못 쓰이는 패턴들.",
    domain: "security",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "zero-trust",
    title: "Zero Trust 아키텍처",
    description:
      "네트워크 경계 신뢰 ❌, 모든 접근을 검증. mTLS, 최소 권한, 지속 인증.",
    domain: "security",
    status: "ready",
    hasVisualization: false,
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getTopicsByDomain(domain: TopicDomain): Topic[] {
  return topics.filter((t) => t.domain === domain);
}
