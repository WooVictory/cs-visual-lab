import type { TopicSidebarContent } from "../topic-content";

export const osContent: Record<string, TopicSidebarContent> = {
  "process-vs-thread": {
    keyConcepts: [
      {
        term: "프로세스",
        definition:
          "독립된 주소공간을 가진 실행 단위. PCB(Process Control Block)로 관리. 자원 단위.",
      },
      {
        term: "스레드",
        definition:
          "프로세스 내부의 실행 흐름. 코드/데이터/힙은 공유, 스택/레지스터/PC는 개별.",
      },
      {
        term: "멀티프로세스 vs 멀티스레드",
        definition:
          "멀티프로세스: 안전(격리) but 무거움. 멀티스레드: 가벼움 but 동기화 필요.",
      },
      {
        term: "사용자 vs 커널 스레드",
        definition:
          "사용자 스레드는 라이브러리가 관리(빠름, 커널은 모름). 커널 스레드는 OS가 직접 스케줄링.",
      },
    ],
    interviewQuestions: [
      "프로세스와 스레드의 차이를 메모리 구조 관점에서 설명해보세요.",
      "멀티스레드가 멀티프로세스보다 가벼운 이유는?",
      "스레드 사이에 공유되지 않는 것은 무엇인가요?",
      "Race Condition이 발생하는 근본 원인은 무엇인가요?",
      "Java의 스레드 모델과 Go의 고루틴은 어떻게 다른가요?",
    ],
  },

  "cpu-scheduling": {
    keyConcepts: [
      {
        term: "FCFS / SJF",
        definition:
          "FCFS: 도착 순서대로(공평하지만 convoy effect). SJF: 짧은 작업 우선(평균 대기 최소, 기아 위험).",
      },
      {
        term: "Round Robin",
        definition:
          "타임 슬라이스 단위로 순환. 공평 + 응답성. 슬라이스 크기가 핵심 — 너무 짧으면 컨텍스트 스위치 비용↑.",
      },
      {
        term: "MLFQ (다단계 피드백)",
        definition:
          "여러 우선순위 큐. 짧게 끝나면 우선순위↑, CPU 많이 쓰면 우선순위↓. 현대 OS의 기본 방식.",
      },
      {
        term: "선점 vs 비선점",
        definition:
          "선점: OS가 강제로 CPU 회수(반응성↑). 비선점: 작업이 자발적으로 양보(단순하지만 응답성↓).",
      },
    ],
    interviewQuestions: [
      "Round Robin에서 타임 슬라이스를 어떻게 정해야 하나요?",
      "SJF의 단점인 기아(starvation) 문제를 어떻게 해결할 수 있나요?",
      "선점형과 비선점형 스케줄링의 트레이드오프는?",
      "리눅스의 CFS(Completely Fair Scheduler) 핵심 아이디어는?",
      "실시간 시스템에서는 어떤 스케줄링이 사용되나요?",
    ],
  },

  synchronization: {
    keyConcepts: [
      {
        term: "Mutex (상호 배제)",
        definition:
          "임계 구역에 한 번에 한 스레드만 진입. 소유자 개념이 있어 풀 수 있는 사람이 정해짐.",
      },
      {
        term: "Semaphore",
        definition:
          "정수 카운터. P(wait)/V(signal) 연산. 카운팅 세마포어는 N개 자원, 이진 세마포어는 뮤텍스 유사.",
      },
      {
        term: "Monitor",
        definition:
          "락 + 조건 변수를 묶은 고수준 추상화. Java의 synchronized + wait/notify가 대표적.",
      },
      {
        term: "Race Condition",
        definition:
          "공유 자원에 동기화 없이 동시 접근해 결과가 실행 순서에 따라 달라지는 버그.",
      },
    ],
    interviewQuestions: [
      "뮤텍스와 세마포어의 차이는?",
      "Spinlock과 일반 락의 차이와 각각 언제 쓰나요?",
      "Java의 synchronized와 ReentrantLock의 차이는?",
      "Volatile만으로 동기화가 충분하지 않은 이유는?",
      "Lock-free 자료구조는 어떻게 동기화 없이 안전성을 보장하나요?",
    ],
  },

  deadlock: {
    keyConcepts: [
      {
        term: "4가지 발생 조건",
        definition:
          "상호 배제 · 점유와 대기 · 비선점 · 순환 대기 — 네 조건 모두 만족할 때만 데드락 발생.",
      },
      {
        term: "예방 (Prevention)",
        definition:
          "4조건 중 하나를 깸. 예: 자원 한 번에 모두 요청, 자원에 순서 부여 후 순서대로만 요청.",
      },
      {
        term: "회피 (Avoidance)",
        definition:
          "Banker's algorithm — 자원 할당 시 안전 상태가 유지되는지 동적으로 검사.",
      },
      {
        term: "탐지 & 복구",
        definition:
          "Wait-for 그래프로 주기 검출. 발견되면 프로세스 강제 종료 또는 자원 선점.",
      },
    ],
    interviewQuestions: [
      "데드락의 4가지 발생 조건을 설명해보세요.",
      "예방, 회피, 탐지 중 실제 OS는 주로 어떤 전략을 쓰나요? 왜죠?",
      "데이터베이스에서 데드락이 발생했을 때 보통 어떻게 처리되나요?",
      "Livelock과 Deadlock의 차이는?",
      "코드를 짤 때 데드락을 피하는 실용적인 규칙은?",
    ],
  },

  "paging-segmentation": {
    keyConcepts: [
      {
        term: "페이징",
        definition:
          "메모리를 고정 크기 페이지로 분할. 외부 단편화 없음, 내부 단편화는 발생. 페이지 테이블로 매핑.",
      },
      {
        term: "세그멘테이션",
        definition:
          "논리적 단위(코드/데이터/스택)별 가변 크기 분할. 외부 단편화 발생, 보호/공유 단순.",
      },
      {
        term: "가상 메모리 + TLB",
        definition:
          "물리 메모리보다 큰 주소공간 제공. TLB는 페이지 테이블 조회 캐시 — hit율이 성능에 직결.",
      },
      {
        term: "페이지 교체",
        definition:
          "FIFO, LRU, Clock — 어떤 페이지를 디스크로 내보낼지 결정. Thrashing 주의.",
      },
    ],
    interviewQuestions: [
      "페이징과 세그멘테이션의 차이와 트레이드오프를 설명해보세요.",
      "내부 단편화와 외부 단편화의 차이는?",
      "TLB가 무엇이고 왜 필요한가요?",
      "LRU와 Clock 알고리즘의 차이는?",
      "Thrashing이 무엇이고 어떻게 대응하나요?",
    ],
  },

  ipc: {
    keyConcepts: [
      {
        term: "Pipe",
        definition:
          "단방향 바이트 스트림. 익명 파이프는 부모-자식, named pipe(FIFO)는 무관 프로세스도 가능.",
      },
      {
        term: "Message Queue",
        definition:
          "메시지 단위 송수신. 보낸 쪽과 받는 쪽이 동시에 안 있어도 됨. 우선순위 지원.",
      },
      {
        term: "Shared Memory",
        definition:
          "여러 프로세스가 같은 메모리 영역을 매핑. 가장 빠르지만 동기화는 직접 처리.",
      },
      {
        term: "Socket",
        definition:
          "네트워크 또는 같은 머신 내 IPC. UNIX domain socket은 네트워크 스택 거치지 않음 — 빠름.",
      },
    ],
    interviewQuestions: [
      "Pipe, Message Queue, Shared Memory의 성능과 용도 차이는?",
      "Shared Memory가 가장 빠른 이유와 그 위험은?",
      "프로세스 간 통신에 소켓을 쓰는 경우는 언제인가요?",
      "Signal은 IPC의 일종인가요? 어떤 한계가 있나요?",
      "마이크로서비스의 메시지 큐(Kafka, RabbitMQ)와 OS의 message queue는 어떻게 다른가요?",
    ],
  },

  "system-call": {
    keyConcepts: [
      {
        term: "사용자 모드 vs 커널 모드",
        definition:
          "사용자 모드는 제한된 권한, 커널 모드는 모든 자원 접근 가능. CPU의 특권 레벨로 구분.",
      },
      {
        term: "모드 전환",
        definition:
          "시스템 콜은 trap(소프트웨어 인터럽트)으로 커널 모드로 전환. 상태 저장 + 보안 검사 비용.",
      },
      {
        term: "주요 시스템 콜",
        definition:
          "open, read, write, close, fork, exec, wait, exit — 파일/프로세스/IPC 기본.",
      },
      {
        term: "libc 래퍼",
        definition:
          "C 라이브러리(glibc 등)가 시스템 콜을 함수처럼 감싸 제공. 직접 호출도 가능(syscall 명령).",
      },
    ],
    interviewQuestions: [
      "시스템 콜이 일반 함수 호출보다 느린 이유는?",
      "사용자 모드와 커널 모드를 OS가 왜 구분하나요?",
      "fork()와 exec()를 각각 설명하고 왜 보통 둘을 함께 쓰나요?",
      "시스템 콜 한 번의 비용을 줄이려면 어떤 기법이 있나요?",
      "vDSO나 io_uring 같은 최적화가 어떻게 시스템 콜 오버헤드를 줄이나요?",
    ],
  },

  "context-switch": {
    keyConcepts: [
      {
        term: "컨텍스트 스위치",
        definition:
          "현재 실행 중인 프로세스/스레드 상태(레지스터, PC, 스택 포인터)를 저장하고 다른 것 로드.",
      },
      {
        term: "직접 비용",
        definition:
          "레지스터 저장/복원 — 보통 수 마이크로초. 빈번하면 CPU 시간의 상당 부분을 차지.",
      },
      {
        term: "간접 비용",
        definition:
          "TLB/캐시 무효화 → 새 프로세스가 캐시 재구축에 시간 소요. 직접 비용보다 클 수도 있음.",
      },
      {
        term: "스레드 vs 프로세스 전환",
        definition:
          "같은 프로세스 내 스레드 전환은 주소공간 그대로 → TLB flush 없어 더 가벼움.",
      },
    ],
    interviewQuestions: [
      "컨텍스트 스위칭이 발생하는 상황은 무엇인가요?",
      "프로세스 전환과 스레드 전환의 비용 차이는?",
      "왜 TLB flush가 큰 비용으로 작용하나요?",
      "고루틴이 OS 스레드보다 가벼운 이유는?",
      "컨텍스트 스위치 횟수를 줄이는 실용적 방법은?",
    ],
  },
};
