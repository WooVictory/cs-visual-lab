import type { TopicSidebarContent } from "../topic-content";

export const aiLlmContent: Record<string, TopicSidebarContent> = {
  "transformer-attention": {
    keyConcepts: [
      {
        term: "Self-Attention",
        definition:
          "각 토큰이 시퀀스의 다른 모든 토큰을 한 번에 참조해 가중치(attention)를 계산. RNN의 순차 처리 한계를 깸.",
      },
      {
        term: "Q · K · V",
        definition:
          "Query(찾고 싶은 것), Key(매칭 기준), Value(가져올 정보). 모두 같은 입력에서 가중치 행렬로 변환.",
      },
      {
        term: "Multi-Head",
        definition:
          "여러 attention을 병렬로 — 각각이 다른 관계(문법, 의미, 위치 등)를 학습.",
      },
      {
        term: "Positional Encoding",
        definition:
          "Attention 자체엔 순서 정보가 없으므로, 위치 임베딩을 더해 시퀀스 순서를 주입.",
      },
    ],
    interviewQuestions: [
      "Self-attention이 RNN/LSTM 대비 어떤 장점을 가지나요?",
      "Multi-head attention의 head 수가 늘면 무엇이 좋아지나요?",
      "트랜스포머의 시간복잡도가 O(n²)인 이유와 그 한계는?",
      "Encoder-only(BERT), Decoder-only(GPT), Encoder-Decoder(T5)의 차이는?",
      "왜 positional encoding이 필요한가요?",
    ],
  },

  embedding: {
    keyConcepts: [
      {
        term: "벡터화",
        definition:
          "텍스트/이미지를 고정 차원 벡터로 변환. 의미가 비슷하면 벡터 거리가 가깝게 학습됨.",
      },
      {
        term: "차원 (dimension)",
        definition:
          "주로 384/768/1536/3072 차원. 클수록 표현력↑이지만 비용↑.",
      },
      {
        term: "유사도 측정",
        definition:
          "Cosine similarity가 표준. Dot product, Euclidean도 사용. 정규화하면 셋이 거의 같음.",
      },
      {
        term: "임베딩 모델",
        definition:
          "OpenAI text-embedding-3, Cohere embed, Voyage, BGE 등. 작업/언어에 맞춰 선택.",
      },
    ],
    interviewQuestions: [
      "왜 임베딩으로 의미 검색이 가능한가요? 키워드 검색과 어떻게 다른가요?",
      "Cosine vs Dot product, 언제 무엇을 쓰나요?",
      "임베딩 차원이 크면/작으면 각각 어떤 트레이드오프가 있나요?",
      "다국어 임베딩의 어려움은 무엇인가요?",
      "임베딩 모델을 fine-tune 해야 하는 경우는?",
    ],
  },

  tokenization: {
    keyConcepts: [
      {
        term: "BPE (Byte Pair Encoding)",
        definition:
          "자주 같이 등장하는 바이트 쌍을 점차 병합. GPT 계열이 사용. OOV(미등록어) 문제 회피.",
      },
      {
        term: "WordPiece / SentencePiece",
        definition:
          "BERT(WordPiece), T5/LLaMA(SentencePiece) — 다른 머지 기준이지만 비슷한 결과.",
      },
      {
        term: "토큰 != 단어",
        definition:
          "영어는 평균 1단어 ≈ 1.3토큰, 한국어는 1단어 ≈ 2~3토큰. 한국어 LLM 비용이 더 큰 이유.",
      },
      {
        term: "Special Token",
        definition:
          "[CLS], [SEP], <|endoftext|>, [INST] 등 — 모델 동작을 제어하는 예약 토큰.",
      },
    ],
    interviewQuestions: [
      "왜 단순 공백 분리가 아니라 BPE를 쓰나요?",
      "한국어 LLM이 영어 대비 비용이 더 드는 이유는?",
      "토큰 수를 줄이는 실무 팁은? (예: 시스템 프롬프트 최적화)",
      "tiktoken으로 토큰 수를 정확히 셀 수 있는 이유와 한계는?",
      "Tokenization이 모델 성능에 미치는 영향은?",
    ],
  },

  "context-window": {
    keyConcepts: [
      {
        term: "컨텍스트 윈도우",
        definition:
          "모델이 한 번에 처리 가능한 입력+출력 토큰의 최대 수. 8K, 128K, 1M, 2M까지 확장 중.",
      },
      {
        term: "Lost in the Middle",
        definition:
          "긴 컨텍스트에서 중간에 있는 정보를 모델이 잘 못 찾는 현상. 중요한 건 처음/끝에.",
      },
      {
        term: "비용 모델",
        definition:
          "Input/Output 토큰별로 과금. 컨텍스트가 길면 비용도 선형 증가. Cache로 일부 절감 가능.",
      },
      {
        term: "Prompt Caching",
        definition:
          "Anthropic/OpenAI 모두 지원 — 반복되는 시스템 프롬프트를 캐시해 입력 비용 90% 절감.",
      },
    ],
    interviewQuestions: [
      "1M 컨텍스트가 있어도 RAG가 필요한 이유는?",
      "Lost in the Middle을 어떻게 완화하나요?",
      "긴 컨텍스트일 때 어떻게 비용을 관리하나요?",
      "Prompt Caching이 효과를 보려면 어떤 조건이 필요한가요?",
      "컨텍스트 안에서 정보 우선순위를 어떻게 배치하나요?",
    ],
  },

  rag: {
    keyConcepts: [
      {
        term: "RAG 흐름",
        definition:
          "(1) 쿼리 임베딩 → (2) 벡터 DB에서 유사 문서 검색 → (3) 검색 결과를 컨텍스트에 주입 → (4) LLM 답변.",
      },
      {
        term: "Chunking",
        definition:
          "문서를 200~1000 토큰 단위로 잘라 임베딩. 너무 작으면 맥락↓, 너무 크면 검색 정확도↓.",
      },
      {
        term: "Reranking",
        definition:
          "1차 벡터 검색으로 top-K 후보 → 2차 cross-encoder로 정밀 재순위. 비용↑ 품질↑.",
      },
      {
        term: "Hybrid Search",
        definition:
          "임베딩(의미) + BM25(키워드) 결합. 고유명사/숫자 검색은 키워드가 강함.",
      },
    ],
    interviewQuestions: [
      "RAG가 단순 fine-tuning보다 유리한 경우는?",
      "Chunking 전략이 RAG 품질에 어떤 영향을 주나요?",
      "Hybrid Search가 단일 임베딩 검색보다 좋은 이유는?",
      "RAG에서 잘못된 답변(hallucination)이 나는 흔한 원인은?",
      "Reranker는 언제 도입해야 가성비가 나오나요?",
    ],
  },

  "vector-database": {
    keyConcepts: [
      {
        term: "ANN (Approximate Nearest Neighbor)",
        definition:
          "정확한 최근접 대신 근사 검색. 수백만 벡터에서 ms 단위 응답을 위해 정확도와 속도 절충.",
      },
      {
        term: "주요 인덱스",
        definition:
          "HNSW(그래프), IVF(클러스터), PQ(양자화). HNSW가 정확도/속도 균형으로 인기.",
      },
      {
        term: "주요 제품",
        definition:
          "pgvector(Postgres 확장, 단순), Qdrant/Weaviate(전용), Pinecone(서버리스), Milvus(스케일).",
      },
      {
        term: "필터링 + 벡터 검색",
        definition:
          "메타데이터 필터(예: user_id, date)와 벡터 검색 결합. Pre vs Post 필터링 트레이드오프.",
      },
    ],
    interviewQuestions: [
      "ANN과 정확한 KNN의 차이와 트레이드오프는?",
      "HNSW의 핵심 아이디어를 한 줄로 설명하면?",
      "pgvector를 쓰는 게 좋은 경우와 별도 벡터 DB가 좋은 경우는?",
      "메타데이터 필터링은 왜 까다로운가요?",
      "벡터 DB 비용을 줄이는 실용적인 방법은? (양자화 등)",
    ],
  },

  "prompt-engineering": {
    keyConcepts: [
      {
        term: "Few-shot",
        definition:
          "프롬프트에 입력-출력 예시 2~5개를 제공. 모델이 패턴을 보고 비슷하게 답함.",
      },
      {
        term: "Chain-of-Thought (CoT)",
        definition:
          "'단계별로 생각해보자'로 추론 과정을 명시. 산수/추론 문제에서 정답률 큰 폭 향상.",
      },
      {
        term: "System Prompt",
        definition:
          "역할/제약/형식을 미리 설정. 모델의 톤과 안전성에 가장 큰 영향.",
      },
      {
        term: "출력 형식 강제",
        definition:
          "JSON Schema, XML 태그, 결정형 stop sequence — 다음 단계 파싱을 안정화.",
      },
    ],
    interviewQuestions: [
      "Few-shot이 Zero-shot보다 항상 좋은가요? 언제 효과가 작죠?",
      "CoT가 효과를 보는 작업과 그렇지 않은 작업의 차이는?",
      "System prompt와 user prompt를 어떻게 나누는 게 좋나요?",
      "출력을 JSON으로 강제할 때 흔한 함정은?",
      "최신 추론 모델(o1, R1)은 왜 CoT를 직접 쓰지 말라고 하나요?",
    ],
  },

  "function-calling": {
    keyConcepts: [
      {
        term: "Tool Schema",
        definition:
          "함수 이름 + 설명 + 파라미터(JSON Schema) 제공. 모델이 이걸 보고 언제/어떻게 호출할지 결정.",
      },
      {
        term: "호출 흐름",
        definition:
          "User → LLM → tool_call → 실제 함수 실행 → 결과를 다시 LLM에 → 최종 답변.",
      },
      {
        term: "다중 도구",
        definition:
          "여러 도구 중 적절한 것 선택, 또는 순차/병렬 호출. 모델이 결정하지만 가이드 가능.",
      },
      {
        term: "검증과 안전",
        definition:
          "LLM이 만든 인자는 신뢰 ❌ — 서버에서 스키마 재검증 + 권한 확인 필수.",
      },
    ],
    interviewQuestions: [
      "Function calling이 단순 프롬프트 기반 파싱보다 좋은 점은?",
      "도구 호출 결과를 LLM에 어떻게 반환해야 후속 추론이 잘 되나요?",
      "도구 수가 많아질 때(50+) 어떻게 효율을 유지하나요?",
      "악의적 인자를 막기 위한 검증 패턴은?",
      "Streaming 응답에서 function calling을 어떻게 다루나요?",
    ],
  },

  mcp: {
    keyConcepts: [
      {
        term: "MCP란",
        definition:
          "Anthropic이 만든 오픈 표준 — LLM 호스트와 외부 도구/리소스를 연결하는 프로토콜.",
      },
      {
        term: "Resources · Tools · Prompts",
        definition:
          "Resources(데이터), Tools(함수 호출), Prompts(템플릿) 세 종류 자원을 서버가 제공.",
      },
      {
        term: "Transport",
        definition:
          "stdio (로컬 프로세스) 또는 HTTP+SSE/Streamable HTTP (원격). JSON-RPC 메시지.",
      },
      {
        term: "왜 표준이 필요한가",
        definition:
          "도구마다 다른 API를 매번 통합하는 비용 제거. 한 번 만든 MCP 서버를 여러 클라이언트가 재사용.",
      },
    ],
    interviewQuestions: [
      "MCP가 해결하려는 문제는 무엇인가요?",
      "Function calling과 MCP는 어떤 관계인가요?",
      "MCP 서버를 만들 때 stdio와 HTTP 중 어떤 transport를 고르나요?",
      "보안 관점에서 MCP 서버 설계 시 주의할 점은?",
      "Resources와 Tools의 의미적 차이는 무엇인가요?",
    ],
  },

  "ai-agent": {
    keyConcepts: [
      {
        term: "ReAct (Reason + Act)",
        definition:
          "Thought(추론) → Action(도구 호출) → Observation(결과) 루프. 가장 기본적인 에이전트 패턴.",
      },
      {
        term: "Reflection",
        definition:
          "작업 후 자신의 결과를 비평/개선하는 메타 단계. 코드/글쓰기 품질 향상.",
      },
      {
        term: "Multi-agent",
        definition:
          "역할별 에이전트(Planner, Coder, Reviewer)가 협업. Orchestrator가 조율.",
      },
      {
        term: "안전 장치",
        definition:
          "최대 step 제한, 비용 한도, 위험 도구 사용 시 confirm, 결과 검증 — 에이전트가 폭주하지 않게.",
      },
    ],
    interviewQuestions: [
      "단순 RAG와 에이전트의 차이는?",
      "ReAct 루프에서 에이전트가 무한 반복하지 않게 어떻게 막나요?",
      "Multi-agent가 single-agent보다 유리한 경우와 그 반대는?",
      "에이전트의 hallucination을 어떻게 검증하나요?",
      "에이전트 비용을 예측 가능하게 만들려면 어떤 패턴이 필요한가요?",
    ],
  },
};
