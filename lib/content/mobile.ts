import type { TopicSidebarContent } from "../topic-content";

export const mobileContent: Record<string, TopicSidebarContent> = {
  "android-lifecycle": {
    keyConcepts: [
      {
        term: "Activity 콜백 시퀀스",
        definition:
          "onCreate → onStart → onResume → (사용 중) → onPause → onStop → onDestroy. 회전이나 백 버튼 등에 따라 호출.",
      },
      {
        term: "구성 변경 (Configuration Change)",
        definition:
          "화면 회전, 언어 변경 등으로 Activity가 재생성됨. 상태는 SavedStateHandle / ViewModel로 보존.",
      },
      {
        term: "Fragment Lifecycle",
        definition:
          "Activity와 비슷하지만 View 라이프사이클이 별개 — onCreateView, onDestroyView 추가.",
      },
      {
        term: "LifecycleOwner",
        definition:
          "Jetpack의 추상화 — Lifecycle-aware 컴포넌트(LiveData, ViewModel)들이 자동으로 구독/해제.",
      },
    ],
    interviewQuestions: [
      "화면 회전 시 Activity가 어떻게 재생성되고, 상태를 어떻게 보존하나요?",
      "Activity onPause와 onStop의 차이는 어떤 상황에 해당하나요?",
      "Fragment의 view lifecycle과 fragment lifecycle은 어떻게 다른가요?",
      "ViewModel이 Activity 재생성에도 살아남는 이유는?",
      "onSaveInstanceState와 ViewModel을 언제 각각 쓰나요?",
    ],
  },

  "jetpack-compose": {
    keyConcepts: [
      {
        term: "선언형 UI",
        definition:
          "상태(state)에 따라 UI를 함수로 기술. 명령형 View 트리 조작 불필요.",
      },
      {
        term: "Recomposition",
        definition:
          "관찰 중인 state가 변하면 영향 받는 Composable만 다시 호출. Smart skipping으로 최소화.",
      },
      {
        term: "remember / rememberSaveable",
        definition:
          "Composable 함수 내 로컬 상태 보존. Saveable은 구성 변경에도 살아남음.",
      },
      {
        term: "Side Effect",
        definition:
          "LaunchedEffect, DisposableEffect, SideEffect — Composable 밖 세계와 상호작용하는 안전한 방법.",
      },
    ],
    interviewQuestions: [
      "Jetpack Compose와 XML View의 핵심 차이를 설명해보세요.",
      "Recomposition을 최적화하려면 어떤 점을 신경 써야 하나요?",
      "Compose에서 remember와 rememberSaveable의 차이는?",
      "Stable / Immutable 어노테이션이 Recomposition에 어떤 영향을 주나요?",
      "Compose의 단점은 무엇이고, 언제 여전히 XML이 더 나을 수 있나요?",
    ],
  },

  "kotlin-coroutines": {
    keyConcepts: [
      {
        term: "suspend 함수",
        definition:
          "스레드 차단 없이 일시 중단 가능한 함수. 컴파일러가 상태 머신으로 변환.",
      },
      {
        term: "CoroutineScope",
        definition:
          "코루틴의 생명주기 관리. viewModelScope, lifecycleScope를 쓰면 자동 정리.",
      },
      {
        term: "Structured Concurrency",
        definition:
          "부모 코루틴이 자식을 책임짐. 부모가 취소되면 자식도 모두 취소. 누수 방지.",
      },
      {
        term: "Dispatchers",
        definition:
          "Main(UI), IO(네트워크/파일), Default(CPU). withContext로 안전하게 스위칭.",
      },
    ],
    interviewQuestions: [
      "Coroutines가 Thread보다 가벼운 이유는?",
      "Structured Concurrency가 해결하는 문제는 무엇인가요?",
      "Job, Deferred, SupervisorJob의 차이는?",
      "withContext와 launch의 차이는?",
      "코루틴 예외 처리는 어떻게 하나요? (CoroutineExceptionHandler)",
    ],
  },

  "flow-stateflow": {
    keyConcepts: [
      {
        term: "Flow",
        definition:
          "비동기 스트림. cold(구독자가 생기면 emit), suspend 친화적. RxJava의 코루틴 대안.",
      },
      {
        term: "StateFlow",
        definition:
          "Hot stream + 항상 현재 값 보유. UI 상태 표현에 표준. 새 구독자에게 즉시 마지막 값 emit.",
      },
      {
        term: "SharedFlow",
        definition:
          "이벤트 스트림 — replay/buffer 설정 가능. 일회성 이벤트(네비게이션, 토스트)에 적합.",
      },
      {
        term: "LiveData와 비교",
        definition:
          "LiveData는 생명주기 인식 자동이지만 구식. Flow + repeatOnLifecycle이 현재 권장.",
      },
    ],
    interviewQuestions: [
      "Cold Flow와 Hot Flow의 차이는?",
      "StateFlow와 LiveData를 언제 각각 쓰나요?",
      "SharedFlow의 replay와 buffer 설정은 어떻게 정하나요?",
      "Flow의 collect와 collectLatest의 차이는?",
      "repeatOnLifecycle이 무엇을 해결하나요?",
    ],
  },

  "android-architecture": {
    keyConcepts: [
      {
        term: "MVVM",
        definition:
          "View ← ViewModel ← Model. ViewModel이 UI 상태와 비즈니스 로직 분리. Android 공식 권장.",
      },
      {
        term: "MVI (Model-View-Intent)",
        definition:
          "단방향 데이터 흐름 — Intent(사용자 액션) → State 변환 → View 갱신. State가 명시적.",
      },
      {
        term: "Clean Architecture",
        definition:
          "Presentation / Domain / Data 계층 분리. UseCase로 비즈니스 로직 캡슐화.",
      },
      {
        term: "UI State 모델",
        definition:
          "data class로 모든 UI 상태를 한 객체에 — Loading/Success/Error 등을 sealed로.",
      },
    ],
    interviewQuestions: [
      "MVVM과 MVI의 차이와 각각의 트레이드오프는?",
      "ViewModel은 왜 LifecycleOwner의 일종이 아닌가요?",
      "Clean Architecture를 모든 앱에 적용할 가치가 있나요?",
      "UI 상태를 sealed class로 표현하는 패턴의 장점은?",
      "도메인 로직을 ViewModel에 두면 어떤 문제가 생기나요?",
    ],
  },

  "dependency-injection-android": {
    keyConcepts: [
      {
        term: "Hilt",
        definition:
          "Dagger 기반 + Android 통합. 컴파일 타임 검증 → 런타임 에러 ↓.",
      },
      {
        term: "Component Scope",
        definition:
          "@Singleton, @ActivityScoped, @ViewModelScoped — 객체 수명을 컴포넌트와 일치.",
      },
      {
        term: "Koin",
        definition:
          "DSL 기반 런타임 DI. 학습 곡선↓, 런타임 검증, 멀티모듈 친화.",
      },
      {
        term: "왜 DI?",
        definition:
          "테스트 시 fake 주입 용이, 객체 생성 보일러플레이트 제거, 의존성 그래프 명시화.",
      },
    ],
    interviewQuestions: [
      "Hilt와 Koin의 핵심 차이는?",
      "@ViewModelScoped와 @ActivityScoped를 언제 각각 쓰나요?",
      "Hilt를 쓸 때 컴파일 시간이 길어지는 문제를 어떻게 다루나요?",
      "Constructor Injection이 Field Injection보다 좋은 이유는?",
      "DI 없이 수동으로 의존성을 관리할 때 생기는 문제는?",
    ],
  },

  "android-memory-leak": {
    keyConcepts: [
      {
        term: "Context 누수",
        definition:
          "Activity Context를 static 필드나 long-lived 객체에 보관 → Activity 소멸 후에도 GC 안 됨.",
      },
      {
        term: "Inner Class 함정",
        definition:
          "비-static inner class와 anonymous class는 외부 클래스의 묵시적 참조. AsyncTask/Handler 흔한 케이스.",
      },
      {
        term: "Listener 미해제",
        definition:
          "Broadcast Receiver, EventBus 구독, Sensor Listener 등 해제 안 하면 View/Activity 누수.",
      },
      {
        term: "LeakCanary",
        definition:
          "디버그 빌드에서 자동으로 누수를 감지하고 참조 경로를 보여줌. 표준 도구.",
      },
    ],
    interviewQuestions: [
      "Activity Context를 ViewModel에 전달하면 왜 위험한가요?",
      "AsyncTask가 deprecated된 이유 중 하나가 메모리 누수와 관련 있는데, 그 메커니즘은?",
      "static Drawable 참조가 누수를 일으킬 수 있는 시나리오는?",
      "Handler에 Runnable을 postDelayed로 던질 때 누수를 어떻게 방지하나요?",
      "LeakCanary 보고서를 보는 순서는?",
    ],
  },

  "work-manager": {
    keyConcepts: [
      {
        term: "보장된 실행",
        definition:
          "앱이 죽거나 기기가 재부팅돼도 작업 완료 보장. 백업으로 JobScheduler/AlarmManager 활용.",
      },
      {
        term: "Constraints",
        definition:
          "네트워크, 충전 중, 유휴 상태 등 조건을 지정하면 만족 시에만 실행.",
      },
      {
        term: "OneTime vs Periodic",
        definition:
          "OneTimeWorkRequest는 한 번, PeriodicWorkRequest는 반복. Periodic은 최소 15분 간격.",
      },
      {
        term: "Doze 모드 대응",
        definition:
          "Android 6+ 절전 모드에서 백그라운드 제한. WorkManager가 적절히 호환되게 관리.",
      },
    ],
    interviewQuestions: [
      "WorkManager와 단순 Coroutine 작업의 차이는?",
      "어떤 작업을 WorkManager로, 어떤 작업을 Coroutine으로 처리하나요?",
      "Periodic Work가 정확한 시간을 보장하지 않는 이유는?",
      "Work Chain과 expedited work는 언제 쓰나요?",
      "백그라운드 동기화를 만들 때 WorkManager 설계 패턴은?",
    ],
  },

  anr: {
    keyConcepts: [
      {
        term: "ANR 발생 조건",
        definition:
          "메인 스레드가 5초 이상 응답 없으면 시스템이 ANR 다이얼로그. BroadcastReceiver는 10초.",
      },
      {
        term: "흔한 원인",
        definition:
          "메인에서 디스크 I/O / 네트워크 / 큰 JSON 파싱 / 무거운 Bitmap 작업.",
      },
      {
        term: "디버깅",
        definition:
          "/data/anr/traces.txt에 스레드 덤프. Logcat에서 'ANR in' 검색. StrictMode로 사전 감지.",
      },
      {
        term: "방지 패턴",
        definition:
          "withContext(Dispatchers.IO) / Default로 무거운 작업 이동. UI는 가볍게.",
      },
    ],
    interviewQuestions: [
      "ANR이 발생하는 정확한 기준은?",
      "디스크 I/O를 메인 스레드에서 하면 안 되는 이유는?",
      "StrictMode를 어떻게 활용하나요?",
      "ANR 트레이스 파일에서 어떤 정보를 봐야 하나요?",
      "BindService의 onBind가 오래 걸리면 어떤 문제가 생기나요?",
    ],
  },

  "android-build": {
    keyConcepts: [
      {
        term: "Gradle 멀티모듈",
        definition:
          "기능별/계층별 모듈 분리 — 빌드 캐시 활용↑, 빌드 시간↓, 책임 명확.",
      },
      {
        term: "R8",
        definition:
          "Android 기본 코드 축소/난독화/최적화. ProGuard 후속. shrinking + obfuscation + optimization.",
      },
      {
        term: "Build Variants",
        definition:
          "build type(debug/release) × product flavor(free/pro) 조합. 환경별 빌드.",
      },
      {
        term: "빌드 캐시",
        definition:
          "Gradle Build Cache + Configuration Cache로 재빌드 시간 단축. CI에서 원격 캐시도 가능.",
      },
    ],
    interviewQuestions: [
      "멀티 모듈로 분리할 때의 장단점은?",
      "R8과 ProGuard의 차이는?",
      "Build variants를 어떤 기준으로 설계하나요?",
      "Gradle 빌드 시간이 느릴 때 어디부터 분석하나요?",
      "Configuration Cache가 무엇을 해결하나요?",
    ],
  },
};
