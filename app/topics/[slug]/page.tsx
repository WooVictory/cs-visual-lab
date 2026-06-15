import Link from "next/link";
import { notFound } from "next/navigation";
import { TcpHandshake } from "@/components/visualizations/TcpHandshake";
import { TopicSidebar } from "@/components/TopicSidebar";
import { getTopicSidebarContent } from "@/lib/topic-content";
import { getTopic, topics } from "@/lib/topics";

export function generateStaticParams() {
  return topics
    .filter((t) => t.status === "ready")
    .map((t) => ({ slug: t.slug }));
}

function renderVisualization(slug: string) {
  switch (slug) {
    case "tcp-3-way-handshake":
      return <TcpHandshake slug={slug} />;
    default:
      return null;
  }
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);

  if (!topic || topic.status !== "ready") {
    notFound();
  }

  const visualization = renderVisualization(slug);
  const sidebarContent = getTopicSidebarContent(slug);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← 토픽 목록
          </Link>
          <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
            {topic.slug}
          </span>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_360px]">
        <section className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {topic.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {topic.description}
            </p>
          </div>

          {visualization ?? <VisualizationComingSoon />}
        </section>

        {sidebarContent ? (
          <TopicSidebar content={sidebarContent} />
        ) : (
          <aside className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-500">
            사이드바 콘텐츠 준비 중
          </aside>
        )}
      </main>
    </div>
  );
}

function VisualizationComingSoon() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-950">
      <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        인터랙티브 시각화는 다음 업데이트에서 공개됩니다
      </div>
      <p className="max-w-md text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        지금은 오른쪽 사이드바의 핵심 개념과 면접 단골 질문으로 학습할 수 있어요.
        먼저 개념을 짚고, 시각화가 추가되면 다시 와서 동작을 눈으로 확인해보세요.
      </p>
    </div>
  );
}
