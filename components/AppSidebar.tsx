"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  domainLabel,
  domainOrder,
  getTopic,
  getTopicsByDomain,
  topics,
  type TopicDomain,
} from "@/lib/topics";
import { SidebarTopicIndicator } from "./SidebarTopicIndicator";

export function AppSidebar() {
  const pathname = usePathname();

  const currentDomain = useMemo<TopicDomain | null>(() => {
    if (!pathname.startsWith("/topics/")) return null;
    const slug = pathname.slice("/topics/".length);
    return getTopic(slug)?.domain ?? null;
  }, [pathname]);

  const [expanded, setExpanded] = useState<Set<TopicDomain>>(
    () => new Set(currentDomain ? [currentDomain] : [])
  );

  useEffect(() => {
    if (currentDomain) {
      setExpanded((prev) => {
        if (prev.has(currentDomain)) return prev;
        const next = new Set(prev);
        next.add(currentDomain);
        return next;
      });
    }
  }, [currentDomain]);

  const toggle = (d: TopicDomain) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex dark:border-zinc-800 dark:bg-zinc-950">
      <Link
        href="/"
        className="block border-b border-zinc-200 px-5 py-4 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
      >
        <div className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tech Interviewoo
        </div>
        <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          시각화 + 면접 학습 · {topics.length} 토픽
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {domainOrder.map((d) => {
          const list = getTopicsByDomain(d);
          if (list.length === 0) return null;
          const isOpen = expanded.has(d);
          return (
            <section key={d} className="mb-1.5 last:mb-0">
              <button
                type="button"
                onClick={() => toggle(d)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <span className="flex items-center gap-2">
                  <ChevronIcon open={isOpen} />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {domainLabel[d]}
                  </span>
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {list.length}
                </span>
              </button>

              {isOpen && (
                <ul className="mb-3 mt-1 flex flex-col gap-0.5">
                  {list.map((t) => {
                    const href = `/topics/${t.slug}`;
                    const active = pathname === href;
                    return (
                      <li key={t.slug}>
                        <Link
                          href={href}
                          className={`flex items-center justify-between gap-2 rounded-md py-1.5 pl-8 pr-2.5 text-[15px] transition ${
                            active
                              ? "bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                              : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                          }`}
                        >
                          <span className="truncate">{t.title}</span>
                          <SidebarTopicIndicator slug={t.slug} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </nav>
    </aside>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform duration-150 dark:text-zinc-500 ${
        open ? "rotate-90" : ""
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
