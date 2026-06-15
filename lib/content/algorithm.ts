import type { TopicSidebarContent } from "../topic-content";

export const algorithmContent: Record<string, TopicSidebarContent> = {
  "big-o": {
    keyConcepts: [
      {
        term: "점근 표기법",
        definition:
          "입력 크기가 커질 때 실행 시간의 증가 추세. 상수와 낮은 차수는 무시.",
      },
      {
        term: "주요 등급",
        definition:
          "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!).",
      },
      {
        term: "최선/평균/최악",
        definition:
          "보통 면접에선 최악(Big-O)을 기준으로 평가. 평균(Theta)과 최선(Omega)도 의미 있음.",
      },
      {
        term: "공간 복잡도",
        definition:
          "시간뿐 아니라 추가 메모리 사용량도 분석 대상. 재귀는 콜 스택 깊이도 카운트.",
      },
    ],
    interviewQuestions: [
      "O(n log n)과 O(n²)의 차이를 입력 크기 100만 기준으로 비교해보세요.",
      "이진 탐색의 시간복잡도가 O(log n)인 이유를 식으로 설명해보세요.",
      "Big-O, Big-Omega, Big-Theta의 차이는?",
      "재귀 함수의 시간복잡도를 어떻게 분석하나요?",
      "Amortized 분석이 무엇인가요? 동적 배열의 push가 왜 amortized O(1)인가요?",
    ],
  },

  sorting: {
    keyConcepts: [
      {
        term: "O(n²) 정렬",
        definition:
          "버블, 선택, 삽입 — 단순하지만 느림. 작은 입력이나 거의 정렬된 데이터엔 OK.",
      },
      {
        term: "O(n log n) 정렬",
        definition:
          "병합, 퀵, 힙 — 비교 기반의 이론적 하한. 대부분의 실용 정렬이 여기 속함.",
      },
      {
        term: "안정 정렬 (Stable)",
        definition:
          "같은 키 원소의 상대 순서 보존. 병합, 삽입, 팀소트는 안정. 퀵, 힙은 불안정.",
      },
      {
        term: "비교 vs 비비교 정렬",
        definition:
          "비교 정렬은 O(n log n)이 하한. 카운팅/라딕스 정렬은 데이터 가정 하에 O(n) 가능.",
      },
    ],
    interviewQuestions: [
      "퀵 정렬의 평균과 최악 시간복잡도를 설명해보세요.",
      "거의 정렬된 배열에 가장 빠른 정렬은 무엇이고 왜인가요?",
      "안정 정렬이 왜 중요한 경우가 있나요?",
      "병합 정렬과 퀵 정렬을 메모리 관점에서 비교해보세요.",
      "Java의 Arrays.sort()는 내부적으로 어떤 알고리즘을 쓰나요?",
    ],
  },

  searching: {
    keyConcepts: [
      {
        term: "선형 탐색",
        definition:
          "처음부터 끝까지 순회. O(n). 정렬 안 된 작은 데이터에 OK.",
      },
      {
        term: "이진 탐색",
        definition:
          "정렬된 배열에서 절반씩 좁힘. O(log n). 정렬 비용을 한 번 지불 후 여러 번 조회에 유리.",
      },
      {
        term: "해시 탐색",
        definition:
          "키를 해시 함수로 인덱스 변환. 평균 O(1). 충돌 처리(체이닝/오픈 어드레싱)가 핵심.",
      },
      {
        term: "트리 기반 탐색",
        definition:
          "BST, AVL, B-Tree. O(log n) + 정렬 순회 가능. DB 인덱스의 기본.",
      },
    ],
    interviewQuestions: [
      "이진 탐색을 정렬되지 않은 배열에 쓸 수 없는 이유는?",
      "해시맵의 평균 O(1)인데 최악은 왜 O(n)인가요?",
      "Rolling Hash와 그 응용(예: Rabin-Karp)을 설명해보세요.",
      "이진 탐색의 변형(lower_bound, upper_bound) 차이는?",
      "DB 인덱스가 해시가 아니라 B-Tree를 주로 쓰는 이유는?",
    ],
  },

  "dynamic-programming": {
    keyConcepts: [
      {
        term: "최적 부분 구조",
        definition:
          "전체 최적해가 부분 문제의 최적해로 구성됨. 분할 정복과 비슷하지만 부분 문제가 겹침.",
      },
      {
        term: "겹치는 부분 문제",
        definition:
          "같은 부분 문제를 여러 번 푸는 상황. 메모이제이션으로 계산 결과 재활용.",
      },
      {
        term: "메모이제이션 (Top-down)",
        definition:
          "재귀 + 캐시. 호출 트리에서 같은 인자는 한 번만 계산. 코드가 직관적.",
      },
      {
        term: "타뷸레이션 (Bottom-up)",
        definition:
          "반복문으로 작은 문제부터 채워나감. 콜 스택 없음 → 메모리/속도 유리.",
      },
    ],
    interviewQuestions: [
      "DP를 적용 가능한 문제인지 어떻게 판단하나요?",
      "피보나치 수열을 메모이제이션과 타뷸레이션으로 각각 풀어보세요.",
      "분할 정복과 DP의 차이는?",
      "0/1 Knapsack 문제의 점화식을 설명해보세요.",
      "DP의 공간 복잡도를 줄이는 기법(rolling array)이 무엇인가요?",
    ],
  },

  "graph-dfs-bfs": {
    keyConcepts: [
      {
        term: "DFS",
        definition:
          "스택(혹은 재귀)으로 깊이 우선 탐색. 경로 탐색, 백트래킹, 사이클 검출에 적합.",
      },
      {
        term: "BFS",
        definition:
          "큐로 너비 우선 탐색. 가중치 없는 그래프의 최단 경로에 최적.",
      },
      {
        term: "그래프 표현",
        definition:
          "인접 리스트 (희소 그래프) vs 인접 행렬 (밀집 그래프, O(1) 간선 조회).",
      },
      {
        term: "최단 경로 알고리즘",
        definition:
          "BFS(가중치 없음), Dijkstra(양수 가중치), Bellman-Ford(음수 가능), Floyd-Warshall(전체 쌍).",
      },
    ],
    interviewQuestions: [
      "DFS와 BFS를 언제 각각 사용하나요?",
      "방문 처리(visited)를 빠뜨리면 어떤 일이 생기나요?",
      "Dijkstra가 음수 가중치를 다룰 수 없는 이유는?",
      "Topological Sort를 DFS로 구현하는 방법을 설명해보세요.",
      "Union-Find의 시간복잡도가 거의 O(1)인 이유는?",
    ],
  },

  "tree-heap": {
    keyConcepts: [
      {
        term: "이진 탐색 트리 (BST)",
        definition:
          "왼쪽 < 노드 < 오른쪽. 평균 O(log n) 조회. 편향되면 O(n)으로 퇴화.",
      },
      {
        term: "균형 트리 (AVL/Red-Black)",
        definition:
          "삽입/삭제 시 회전으로 균형 유지. 항상 O(log n) 보장. 표준 라이브러리의 set/map이 사용.",
      },
      {
        term: "힙 (Heap)",
        definition:
          "부모-자식 간 대소 관계만 보장. 우선순위 큐 구현. 삽입/삭제 O(log n), top O(1).",
      },
      {
        term: "B-Tree",
        definition:
          "한 노드에 여러 키. 디스크 I/O 최소화 — 데이터베이스 인덱스의 기본.",
      },
    ],
    interviewQuestions: [
      "BST가 편향되는 경우와 그 영향을 설명해보세요.",
      "AVL과 Red-Black 트리의 차이는?",
      "힙으로 K번째 큰 값을 어떻게 찾나요?",
      "DB 인덱스가 일반 BST가 아닌 B-Tree를 쓰는 이유는?",
      "Trie 자료구조가 적합한 문제는 어떤 것이 있나요?",
    ],
  },
};
