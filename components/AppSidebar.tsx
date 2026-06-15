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
    <aside className="sticky top-0 hidden h-screen w-[300px] shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex dark:border-zinc-800 dark:bg-zinc-950">
      <Link
        href="/"
        className="block border-b border-zinc-200 px-5 py-5 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
      >
        <div className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tech Interviewoo
        </div>
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          시각화 + 면접 학습 · {topics.length} 토픽
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {domainOrder.map((d) => {
          const list = getTopicsByDomain(d);
          if (list.length === 0) return null;
          const isOpen = expanded.has(d);
          return (
            <section key={d} className="mb-1">
              <button
                type="button"
                onClick={() => toggle(d)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <span className="text-lg leading-none" aria-hidden>
                  📌
                </span>
                <span className="flex-1 truncate text-base font-bold text-zinc-900 dark:text-zinc-50">
                  {domainLabel[d]}
                </span>
                <ChevronIcon open={isOpen} />
              </button>

              {isOpen && (
                <ul className="mb-2 mt-1 flex flex-col">
                  {list.map((t) => {
                    const href = `/topics/${t.slug}`;
                    const active = pathname === href;
                    return (
                      <li key={t.slug} className="relative">
                        {active && (
                          <span
                            className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-emerald-500"
                            aria-hidden
                          />
                        )}
                        <Link
                          href={href}
                          className={`flex items-center justify-between gap-2 py-1.5 pl-11 pr-2.5 text-[15px] transition ${
                            active
                              ? "font-semibold text-emerald-700 dark:text-emerald-400"
                              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                          }`}
                        >
                          <span className="truncate">
                            {active && (
                              <span className="text-emerald-700 dark:text-emerald-400">
                                -{" "}
                              </span>
                            )}
                            {t.title}
                          </span>
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
      className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-150 dark:text-zinc-500 ${
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
