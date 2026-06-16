import type { TopicSidebarContent } from "../topic-content";

export const distributedContent: Record<string, TopicSidebarContent> = {
  "cap-pacelc": {
    keyConcepts: [
      {
        term: "CAP 정리",
        definition:
          "분산 시스템은 네트워크 분할(P) 시 일관성(C)과 가용성(A) 중 하나만 선택 가능.",
      },
      {
        term: "CP vs AP",
        definition:
          "CP: 분할 시 응답 거부(일관성 유지) — etcd, Zookeeper. AP: 분할 시 일관성 양보 — Cassandra, DynamoDB.",
      },
      {
        term: "PACELC",
        definition:
          "CAP 확장 — 분할 없는 평상시(E)에도 지연(L)과 일관성(C) 선택. 더 실용적.",
      },
      {
        term: "오해",
        definition:
          "'CA 시스템'은 분산이 아님 (분할은 피할 수 없음). C/A는 spectrum이지 이분법 아님.",
      },
    ],
    interviewQuestions: [
      "CAP 정리를 한 문장으로 설명해보세요.",
      "MongoDB는 CP인가 AP인가? 설정에 따라 어떻게 달라지나요?",
      "PACELC가 CAP보다 실용적인 이유는?",
      "Spanner가 'CA에 가까운 CP'라고 불리는 이유는?",
      "분할(Partition)이 정말 자주 발생하나요? 어떤 상황에서?",
    ],
  },

  "consensus-raft": {
    keyConcepts: [
      {
        term: "Leader Election",
        definition:
          "Follower가 일정 시간 heartbeat 없으면 Candidate가 되어 투표 요청. 과반 득표 → Leader.",
      },
      {
        term: "Log Replication",
        definition:
          "Leader가 로그 엔트리 받아 Follower에게 복제. 과반이 저장하면 commit.",
      },
      {
        term: "Term",
        definition:
          "논리적 시간 단위. 각 선거마다 증가. 더 높은 term을 본 노드는 즉시 follower로.",
      },
      {
        term: "Safety",
        definition:
          "한 term에 leader는 최대 1명, commit된 entry는 절대 사라지지 않음 — 핵심 안전 보장.",
      },
    ],
    interviewQuestions: [
      "Raft의 Leader Election 흐름을 설명해보세요.",
      "Raft가 Paxos보다 이해하기 쉽다고 평가되는 이유는?",
      "Split Vote 상황은 어떻게 처리되나요?",
      "Log가 일치하지 않을 때 Leader가 Follower 로그를 어떻게 동기화하나요?",
      "Raft 클러스터 노드 수는 보통 왜 홀수인가요?",
    ],
  },

  "data-replication": {
    keyConcepts: [
      {
        term: "Master-Slave (Primary-Replica)",
        definition:
          "쓰기는 마스터, 읽기는 슬레이브. 단순하지만 마스터 장애 시 failover 필요.",
      },
      {
        term: "Multi-Master",
        definition:
          "여러 노드가 쓰기 받음. 충돌 해결(LWW, CRDT) 필요. 지리적 분산에 유리.",
      },
      {
        term: "Quorum 기반",
        definition:
          "R + W > N 보장. Cassandra, Dynamo. 읽기/쓰기 일관성을 튜닝 가능.",
      },
      {
        term: "동기 vs 비동기",
        definition:
          "동기: 일관성↑ 지연↑, 비동기: 빠름 but 데이터 손실 가능. 반동기(semi-sync)는 절충.",
      },
    ],
    interviewQuestions: [
      "Master-Slave 복제에서 read 일관성 문제는 어떻게 발생하나요?",
      "Multi-Master의 충돌 해결을 어떻게 하나요?",
      "Quorum 기반의 R+W>N의 의미를 설명해보세요.",
      "Replica Lag이 클 때 발생하는 문제는?",
      "Sync 복제가 항상 좋은 선택은 아닌 이유는?",
    ],
  },

  sharding: {
    keyConcepts: [
      {
        term: "Hash Sharding",
        definition:
          "샤드 키를 해시 → 노드 매핑. 균등 분배. 단, 범위 쿼리 어려움.",
      },
      {
        term: "Range Sharding",
        definition:
          "키 범위로 분할. 범위 쿼리 효율적. Hot spot 위험 (예: 시간순 데이터).",
      },
      {
        term: "Consistent Hashing",
        definition:
          "노드 추가/제거 시 재분배 최소화. DHT, CDN, DynamoDB에서 사용.",
      },
      {
        term: "Resharding",
        definition:
          "데이터 양 변화에 따른 재분배. 트래픽 영향 없이 하려면 split/merge가 필수.",
      },
    ],
    interviewQuestions: [
      "Hash vs Range sharding을 언제 각각 선택하나요?",
      "Consistent Hashing이 해결하는 문제는?",
      "Hot Shard 문제를 어떻게 다루나요?",
      "Resharding을 무중단으로 하는 방법은?",
      "Cross-shard 쿼리/트랜잭션은 왜 어려운가요?",
    ],
  },

  "consistency-models": {
    keyConcepts: [
      {
        term: "Strong Consistency",
        definition:
          "쓰기 직후 모든 노드가 같은 값을 본다. 비싸지만 가장 직관적. Linearizability가 최강.",
      },
      {
        term: "Sequential Consistency",
        definition:
          "모든 노드가 같은 순서로 본다. 실제 시간 순서는 보장 X. 멀티코어 메모리 모델.",
      },
      {
        term: "Causal Consistency",
        definition:
          "인과 관계가 있는 작업의 순서만 보장. 분산 시스템에서 자주 채택.",
      },
      {
        term: "Eventual Consistency",
        definition:
          "쓰기가 멈추면 결국 모든 노드가 같은 값에 수렴. 가장 약하지만 가장 빠름.",
      },
    ],
    interviewQuestions: [
      "Linearizability와 Sequential Consistency의 차이는?",
      "Causal Consistency가 'Eventual Consistency + α'인 이유는?",
      "Read-Your-Writes 일관성이 무엇이고, 어떻게 구현하나요?",
      "Strong Consistency를 제공하면서 빠른 시스템이 있나요?",
      "사용자 입장에서 Eventual Consistency가 어떤 UX 문제를 일으키나요?",
    ],
  },
};
