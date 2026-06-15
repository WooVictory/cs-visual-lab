import type { TopicSidebarContent } from "../topic-content";

export const databaseContent: Record<string, TopicSidebarContent> = {
  "db-index": {
    keyConcepts: [
      {
        term: "B-Tree 인덱스",
        definition:
          "균형 트리. 범위 조회/정렬/like 'prefix%' 지원. 대부분의 RDB 기본 인덱스 타입.",
      },
      {
        term: "Hash 인덱스",
        definition:
          "정확한 일치(=)에 O(1). 범위/정렬 불가. Memory 엔진, 일부 NoSQL에서 사용.",
      },
      {
        term: "Composite Index",
        definition:
          "여러 컬럼 묶인 인덱스. (A, B) 인덱스는 A 단독, A+B는 OK. B 단독은 못 씀(선두 컬럼 규칙).",
      },
      {
        term: "쓰기 비용",
        definition:
          "INSERT/UPDATE/DELETE 시 인덱스도 갱신. 인덱스 많을수록 쓰기 느려짐 — 무분별한 인덱스는 독.",
      },
    ],
    interviewQuestions: [
      "인덱스가 조회를 빠르게 하는 원리를 B-Tree로 설명해보세요.",
      "(A, B, C) 복합 인덱스가 있을 때 어떤 쿼리가 인덱스를 탈 수 있나요?",
      "Covering Index가 무엇이고 왜 빠른가요?",
      "인덱스를 추가했는데 쿼리가 더 느려지는 경우가 있나요?",
      "EXPLAIN으로 인덱스 사용 여부를 어떻게 확인하나요?",
    ],
  },

  normalization: {
    keyConcepts: [
      {
        term: "1NF",
        definition:
          "원자값(atomic value)만 허용. 한 컬럼에 리스트/JSON 같은 복합 값 금지.",
      },
      {
        term: "2NF",
        definition:
          "1NF + 부분 함수 종속 제거. 복합 키의 일부에만 의존하는 컬럼을 분리.",
      },
      {
        term: "3NF",
        definition:
          "2NF + 이행적 종속 제거. 키가 아닌 컬럼이 다른 비-키 컬럼에 의존하지 않게.",
      },
      {
        term: "역정규화 (Denormalization)",
        definition:
          "읽기 성능을 위해 의도적으로 중복 허용. 조인 비용 ↓ 대신 쓰기 일관성 비용 ↑.",
      },
    ],
    interviewQuestions: [
      "1NF, 2NF, 3NF를 예시와 함께 설명해보세요.",
      "BCNF는 3NF와 어떻게 다른가요?",
      "정규화의 장단점은 무엇인가요?",
      "언제 역정규화를 고려해야 하나요?",
      "NoSQL에서는 왜 의도적으로 정규화를 풀어 설계하나요?",
    ],
  },

  "transaction-acid": {
    keyConcepts: [
      {
        term: "Atomicity (원자성)",
        definition:
          "All-or-nothing. 트랜잭션 내 모든 연산이 다 성공하거나 다 롤백.",
      },
      {
        term: "Consistency (일관성)",
        definition:
          "트랜잭션 전후로 DB 무결성 제약 유지. 외래키, NOT NULL, 체크 제약 등.",
      },
      {
        term: "Isolation (격리성)",
        definition:
          "동시 실행되는 트랜잭션이 서로 영향 안 주게. 격리 수준으로 강도 조절.",
      },
      {
        term: "Durability (지속성)",
        definition:
          "커밋된 트랜잭션은 시스템 장애가 나도 살아남음. WAL(Write-Ahead Log)로 보장.",
      },
    ],
    interviewQuestions: [
      "ACID 각각을 한 줄로 설명해보세요.",
      "WAL이 어떻게 Durability를 보장하나요?",
      "분산 시스템에서 ACID와 BASE의 차이는?",
      "Eventual Consistency는 ACID의 어떤 속성을 포기하는 건가요?",
      "2-Phase Commit이 무엇이고 어떤 한계가 있나요?",
    ],
  },

  "isolation-level": {
    keyConcepts: [
      {
        term: "Read Uncommitted",
        definition:
          "다른 트랜잭션의 미커밋 변경도 읽음. Dirty Read 발생. 가장 약한 격리.",
      },
      {
        term: "Read Committed",
        definition:
          "커밋된 데이터만 읽음. Non-repeatable Read 발생 — 같은 쿼리가 다른 결과 가능. 대부분 RDB 기본값.",
      },
      {
        term: "Repeatable Read",
        definition:
          "트랜잭션 동안 같은 행은 같은 값. MySQL InnoDB 기본. Phantom Read 발생 가능.",
      },
      {
        term: "Serializable",
        definition:
          "직렬 실행한 것과 동일한 결과 보장. 가장 강하지만 성능 비용 큼.",
      },
    ],
    interviewQuestions: [
      "Dirty Read, Non-repeatable Read, Phantom Read의 차이를 예시로 설명해보세요.",
      "MySQL InnoDB는 왜 Repeatable Read를 기본값으로 쓰나요?",
      "MVCC가 어떻게 격리 수준을 구현하나요?",
      "Serializable이 성능을 크게 떨어뜨리는 이유는?",
      "낙관적 동시성 제어와 격리 수준은 어떤 관계가 있나요?",
    ],
  },

  "rdb-vs-nosql": {
    keyConcepts: [
      {
        term: "관계형 (RDB)",
        definition:
          "테이블, 스키마, JOIN, ACID. 정규화된 데이터 + 복잡한 쿼리에 강함. 수직 확장 친화.",
      },
      {
        term: "Document DB",
        definition:
          "MongoDB류. JSON-like 문서. 스키마 유연, 중첩 데이터 친화. 조인 약함.",
      },
      {
        term: "Key-Value",
        definition:
          "Redis, DynamoDB. 단순 키로 값 조회 — 매우 빠름. 복잡한 쿼리는 어려움.",
      },
      {
        term: "CAP Theorem",
        definition:
          "분산 시스템은 Consistency, Availability, Partition tolerance 중 둘만. NoSQL은 보통 AP 또는 CP 선택.",
      },
    ],
    interviewQuestions: [
      "RDB와 NoSQL을 언제 어떤 기준으로 선택하나요?",
      "CAP Theorem을 예시 시스템과 함께 설명해보세요.",
      "MongoDB와 PostgreSQL의 JSONB는 어떤 차이가 있나요?",
      "NoSQL이 수평 확장에 유리한 이유는?",
      "최근 RDB가 JSON 컬럼을 지원하면서 NoSQL의 입지는 어떻게 변했나요?",
    ],
  },

  "db-lock": {
    keyConcepts: [
      {
        term: "공유 락 (S Lock)",
        definition:
          "여러 트랜잭션이 동시에 보유 가능. 읽기 용. 다른 S와는 호환, X와는 충돌.",
      },
      {
        term: "배타 락 (X Lock)",
        definition:
          "한 트랜잭션만 보유 가능. 쓰기 용. 다른 어떤 락과도 충돌.",
      },
      {
        term: "비관적 vs 낙관적",
        definition:
          "비관적: 미리 락. 낙관적: 충돌 가정 안 함, 커밋 시 version 검사로 충돌 감지.",
      },
      {
        term: "Row vs Table Lock",
        definition:
          "행 단위 락은 동시성 ↑ 비용↑. 테이블 락은 단순하지만 동시성 ↓.",
      },
    ],
    interviewQuestions: [
      "공유 락과 배타 락의 호환 관계를 설명해보세요.",
      "비관적 락과 낙관적 락을 언제 각각 선택하나요?",
      "MySQL에서 SELECT ... FOR UPDATE가 어떤 락을 거는지 설명해보세요.",
      "Gap Lock과 Next-Key Lock이 무엇이고 왜 필요한가요?",
      "락 경합을 줄이는 실무적인 방법은?",
    ],
  },
};
