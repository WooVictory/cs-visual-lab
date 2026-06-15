export type TopicDomain =
  | "network"
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
  network: "네트워크",
  os: "운영체제",
  database: "데이터베이스",
  algorithm: "알고리즘 & 자료구조",
  "design-pattern": "디자인 패턴",
  language: "언어",
};

export const domainOrder: TopicDomain[] = [
  "network",
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
    hasVisualization: false,
  },
  {
    slug: "https-handshake",
    title: "HTTPS Handshake",
    description:
      "TLS 핸드셰이크로 인증서를 교환하고 대칭키를 합의해 안전한 채널을 만드는 흐름.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "dns-resolution",
    title: "DNS Resolution",
    description:
      "도메인 이름이 IP 주소로 변환되는 재귀/반복 질의와 캐시 단계.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "http-versions",
    title: "HTTP/1.1 → HTTP/2 → HTTP/3",
    description:
      "HOL blocking, 멀티플렉싱, QUIC까지 — HTTP가 진화해 온 이유.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
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
    hasVisualization: false,
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
    hasVisualization: false,
  },
  {
    slug: "load-balancer",
    title: "Load Balancer",
    description:
      "L4(전송) vs L7(응용) 로드밸런서. 라운드 로빈, Least Conn 등 분배 알고리즘.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "cdn",
    title: "CDN",
    description:
      "지리적으로 분산된 엣지 서버 네트워크. 캐시 무효화와 origin shield.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
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
    hasVisualization: false,
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
    hasVisualization: false,
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
    hasVisualization: false,
  },

  // ===== 데이터베이스 (6) =====
  {
    slug: "db-index",
    title: "데이터베이스 인덱스",
    description:
      "B-Tree, Hash Index — 조회 성능을 위한 자료구조와 쓰기 비용 트레이드오프.",
    domain: "database",
    status: "ready",
    hasVisualization: false,
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
    hasVisualization: false,
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
    hasVisualization: false,
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
    hasVisualization: false,
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
    hasVisualization: false,
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
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getTopicsByDomain(domain: TopicDomain): Topic[] {
  return topics.filter((t) => t.domain === domain);
}
