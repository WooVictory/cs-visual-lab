import Link from "next/link";
import { notFound } from "next/navigation";
import { TcpHandshake } from "@/components/visualizations/TcpHandshake";
import { Http2Multiplexing } from "@/components/visualizations/Http2Multiplexing";
import { OsiEncapsulation } from "@/components/visualizations/OsiEncapsulation";
import { DnsResolution } from "@/components/visualizations/DnsResolution";
import { HttpsHandshake } from "@/components/visualizations/HttpsHandshake";
import { WebSocketViz } from "@/components/visualizations/WebSocket";
import { CorsViz } from "@/components/visualizations/CorsViz";
import { IsolationLevel } from "@/components/visualizations/IsolationLevel";
import { Sorting } from "@/components/visualizations/Sorting";
import { GraphTraversal } from "@/components/visualizations/GraphTraversal";
import { BTreeIndex } from "@/components/visualizations/BTreeIndex";
import { CpuScheduling } from "@/components/visualizations/CpuScheduling";
import { Deadlock } from "@/components/visualizations/Deadlock";
import { ContextSwitch } from "@/components/visualizations/ContextSwitch";
import { LoadBalancer } from "@/components/visualizations/LoadBalancer";
import { Cdn } from "@/components/visualizations/Cdn";
import { JvmGc } from "@/components/visualizations/JvmGc";
import { TopicContent } from "@/components/TopicContent";
import { getTopicSidebarContent } from "@/lib/topic-content";
import { domainLabel, getTopic, topics } from "@/lib/topics";

export function generateStaticParams() {
  return topics
    .filter((t) => t.status === "ready")
    .map((t) => ({ slug: t.slug }));
}

function renderVisualization(slug: string) {
  switch (slug) {
    case "tcp-3-way-handshake":
      return <TcpHandshake slug={slug} />;
    case "http-versions":
      return <Http2Multiplexing slug={slug} />;
    case "osi-7-layers":
      return <OsiEncapsulation slug={slug} />;
    case "dns-resolution":
      return <DnsResolution slug={slug} />;
    case "https-handshake":
      return <HttpsHandshake slug={slug} />;
    case "websocket":
      return <WebSocketViz slug={slug} />;
    case "cors":
      return <CorsViz slug={slug} />;
    case "isolation-level":
      return <IsolationLevel slug={slug} />;
    case "sorting":
      return <Sorting slug={slug} />;
    case "graph-dfs-bfs":
      return <GraphTraversal slug={slug} />;
    case "db-index":
      return <BTreeIndex slug={slug} />;
    case "cpu-scheduling":
      return <CpuScheduling slug={slug} />;
    case "deadlock":
      return <Deadlock slug={slug} />;
    case "context-switch":
      return <ContextSwitch slug={slug} />;
    case "load-balancer":
      return <LoadBalancer slug={slug} />;
    case "cdn":
      return <Cdn slug={slug} />;
    case "jvm-gc":
      return <JvmGc slug={slug} />;
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
  const content = getTopicSidebarContent(slug);

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-10 lg:py-16">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-zinc-500 transition hover:text-zinc-900 lg:hidden dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← 홈
      </Link>

      <header className="mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {domainLabel[topic.domain]}
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {topic.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {topic.description}
        </p>
      </header>

      {visualization && <section className="mb-14">{visualization}</section>}

      {content ? (
        <TopicContent content={content} />
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
          학습 자료 준비 중
        </div>
      )}
    </article>
  );
}
