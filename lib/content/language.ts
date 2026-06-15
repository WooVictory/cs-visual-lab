import type { TopicSidebarContent } from "../topic-content";

export const languageContent: Record<string, TopicSidebarContent> = {
  "jvm-gc": {
    keyConcepts: [
      {
        term: "JVM 메모리 영역",
        definition:
          "Heap(객체) · Stack(메서드 호출) · Metaspace(클래스 메타) · Native Method Stack · PC Register.",
      },
      {
        term: "Heap 세분화",
        definition:
          "Young(Eden+Survivor) → Old. 대부분 객체는 짧은 생애 → 약한 세대 가설(Weak Generational).",
      },
      {
        term: "GC 알고리즘",
        definition:
          "Serial(단일 스레드), Parallel(처리량), G1(예측 가능한 일시정지), ZGC/Shenandoah(저지연).",
      },
      {
        term: "Stop-the-World",
        definition:
          "GC 동안 애플리케이션 스레드 일시 정지. 최신 GC들은 STW 시간을 수 ms 수준으로 줄임.",
      },
    ],
    interviewQuestions: [
      "JVM의 메모리 구조를 설명해보세요.",
      "Minor GC와 Major GC의 차이는?",
      "G1 GC와 ZGC를 비교해보세요.",
      "메모리 누수가 의심될 때 어떻게 디버깅하나요?",
      "JVM 튜닝 파라미터 중 자주 조정하는 것 몇 가지를 들어보세요.",
    ],
  },

  "java-vs-kotlin": {
    keyConcepts: [
      {
        term: "Null 안전성",
        definition:
          "Kotlin은 nullable(`String?`)과 non-null을 타입으로 구분. 컴파일 타임에 NPE 방지.",
      },
      {
        term: "데이터 클래스 / sealed",
        definition:
          "Kotlin의 data class는 equals/hashCode/copy 자동 생성. sealed class로 대수적 데이터 타입 표현.",
      },
      {
        term: "코루틴",
        definition:
          "비동기 코드를 동기처럼 쓸 수 있는 경량 스레드. Java의 CompletableFuture/Reactor보다 직관적.",
      },
      {
        term: "상호 호환성",
        definition:
          "같은 JVM 바이트코드로 컴파일 — Java와 Kotlin 코드를 자유롭게 섞을 수 있음.",
      },
    ],
    interviewQuestions: [
      "Kotlin의 Null 안전성이 Java의 Optional과 어떻게 다른가요?",
      "data class가 무엇이고 어떤 메서드를 자동 생성하나요?",
      "Kotlin Coroutine과 Java Thread의 차이는?",
      "Kotlin이 JVM 바이트코드로 컴파일되는데, 왜 성능 차이가 발생할 수 있나요?",
      "백엔드를 Kotlin으로 전환할 때 고려해야 할 점은?",
    ],
  },

  "python-gil": {
    keyConcepts: [
      {
        term: "GIL이란",
        definition:
          "Global Interpreter Lock — CPython에서 한 번에 하나의 스레드만 Python 바이트코드 실행 가능.",
      },
      {
        term: "왜 존재하는가",
        definition:
          "메모리 관리(특히 reference counting)를 단순/안전하게 하려는 설계 결정. C 확장 호환성도 이유.",
      },
      {
        term: "영향",
        definition:
          "CPU-bound 작업은 멀티스레드로 가속 불가. IO-bound는 GIL이 풀려있어 멀티스레드도 효과적.",
      },
      {
        term: "우회 방법",
        definition:
          "multiprocessing(프로세스 분리), C 확장으로 GIL 해제, asyncio(IO-bound), 최근엔 No-GIL 빌드 실험 중.",
      },
    ],
    interviewQuestions: [
      "GIL이 정확히 무엇이고 왜 존재하나요?",
      "GIL이 있는데도 멀티스레드가 의미 있는 경우는?",
      "CPU-bound 작업을 빠르게 하려면 Python에서 어떻게 해야 하나요?",
      "asyncio가 멀티스레드와 어떻게 다른가요?",
      "최근 PEP 703(No-GIL)이 어떤 변화를 시도하고 있나요?",
    ],
  },
};
