import type { TopicSidebarContent } from "../topic-content";

export const designPatternContent: Record<string, TopicSidebarContent> = {
  singleton: {
    keyConcepts: [
      {
        term: "의도",
        definition:
          "단 하나의 인스턴스만 존재함을 보장하고 전역 접근점을 제공.",
      },
      {
        term: "Thread-safe 구현",
        definition:
          "Double-Checked Locking, static inner holder, enum 싱글톤 — Java에서 enum이 가장 안전.",
      },
      {
        term: "DI와의 관계",
        definition:
          "Spring에선 빈 스코프가 기본 싱글톤. 패턴 자체보다 컨테이너 책임으로 다룸.",
      },
      {
        term: "안티 패턴 측면",
        definition:
          "전역 상태 → 테스트 어려움 + 결합도 증가. 신중히 사용하거나 DI로 대체.",
      },
    ],
    interviewQuestions: [
      "싱글톤을 구현하는 여러 방법과 각각의 장단점은?",
      "왜 싱글톤이 안티 패턴이라 불리기도 하나요?",
      "Java에서 enum 싱글톤이 가장 안전한 이유는?",
      "Spring 빈의 기본 스코프가 왜 싱글톤인가요?",
      "테스트 시 싱글톤이 문제가 되는 상황과 해결책은?",
    ],
  },

  factory: {
    keyConcepts: [
      {
        term: "Simple Factory",
        definition:
          "정적 메서드로 객체 생성 위임. 클라이언트가 구체 클래스를 모르고 인터페이스만 안다.",
      },
      {
        term: "Factory Method",
        definition:
          "서브클래스가 어떤 인스턴스를 만들지 결정. 생성 로직을 상속으로 확장.",
      },
      {
        term: "Abstract Factory",
        definition:
          "관련된 객체 군(family)을 함께 생성. 예: UI 테마별 버튼/체크박스 세트.",
      },
      {
        term: "의도",
        definition:
          "new를 직접 호출하지 않음으로써 객체 생성과 사용의 결합을 끊는다.",
      },
    ],
    interviewQuestions: [
      "Simple Factory, Factory Method, Abstract Factory의 차이는?",
      "팩토리 패턴이 왜 OCP(개방-폐쇄 원칙)에 도움이 되나요?",
      "팩토리와 빌더 패턴의 차이는?",
      "DI 컨테이너가 본질적으로 어떤 의미에서 팩토리인가요?",
      "팩토리 패턴이 과한 추상화로 느껴지는 경우는 언제인가요?",
    ],
  },

  observer: {
    keyConcepts: [
      {
        term: "Subject - Observer",
        definition:
          "Subject가 상태 변경 시 등록된 Observer 모두에게 알림. 1:N 의존 관계.",
      },
      {
        term: "Push vs Pull",
        definition:
          "Push: 알림과 함께 데이터 전달. Pull: 알림만 받고 Observer가 직접 조회. 트레이드오프 있음.",
      },
      {
        term: "활용 예",
        definition:
          "이벤트 리스너, Pub/Sub, Reactive 스트림(RxJS, Reactor), MVC의 View-Model 바인딩.",
      },
      {
        term: "메모리 누수 주의",
        definition:
          "구독 해제 안 하면 Subject가 Observer 참조 유지 — GC 안 됨. 명시적 unsubscribe 필요.",
      },
    ],
    interviewQuestions: [
      "옵저버 패턴의 구조를 클래스 다이어그램으로 설명해보세요.",
      "Pub/Sub과 옵저버 패턴의 차이는?",
      "옵저버 패턴에서 흔히 발생하는 메모리 누수 상황과 해결책은?",
      "Reactive Streams가 옵저버 패턴을 어떻게 확장했나요?",
      "옵저버 패턴의 단점과 대안은?",
    ],
  },

  strategy: {
    keyConcepts: [
      {
        term: "의도",
        definition:
          "알고리즘 군을 인터페이스로 정의하고 캡슐화. 런타임에 알고리즘 교체 가능.",
      },
      {
        term: "조건문 다중 분기 대안",
        definition:
          "if/switch 폭증을 객체 합성으로 대체. 새 전략 추가가 기존 코드 수정 없이 가능.",
      },
      {
        term: "활용 예",
        definition:
          "결제 수단(카드/페이팔/암호화폐), 정렬 비교자, 압축 알고리즘 선택.",
      },
      {
        term: "관련 패턴",
        definition:
          "State 패턴과 구조 동일 — 차이는 의도. Strategy는 알고리즘, State는 상태별 동작.",
      },
    ],
    interviewQuestions: [
      "전략 패턴이 OCP를 어떻게 만족시키나요?",
      "전략 패턴과 상태 패턴의 차이는?",
      "함수형 언어에선 전략 패턴이 어떻게 자연스럽게 표현되나요?",
      "전략 객체를 어디서 주입받는 게 좋나요? (생성자/setter/메서드 인자)",
      "조건문이 적은 경우에도 전략 패턴이 항상 좋은가요?",
    ],
  },

  solid: {
    keyConcepts: [
      {
        term: "SRP (단일 책임)",
        definition:
          "클래스는 하나의 변경 이유만 가져야 함. 책임이 섞이면 변경 영향 범위가 커짐.",
      },
      {
        term: "OCP (개방-폐쇄)",
        definition:
          "확장에는 열려있고, 수정에는 닫혀있어야 함. 기존 코드 안 건드리고 새 기능 추가.",
      },
      {
        term: "LSP / ISP",
        definition:
          "LSP: 자식이 부모를 대체 가능해야 함. ISP: 클라이언트는 필요한 인터페이스에만 의존.",
      },
      {
        term: "DIP (의존성 역전)",
        definition:
          "고수준 모듈이 저수준 모듈에 의존하지 않음. 둘 다 추상화에 의존. DI의 이론적 근거.",
      },
    ],
    interviewQuestions: [
      "SOLID 5원칙을 각각 한 줄로 설명해보세요.",
      "OCP를 만족하는 코드 예시를 들어보세요.",
      "LSP 위반의 대표적 사례(Square-Rectangle 등)를 설명해보세요.",
      "DIP가 어떻게 테스트 가능성을 높이나요?",
      "SOLID를 너무 엄격하게 적용하면 어떤 문제가 생기나요?",
    ],
  },
};
