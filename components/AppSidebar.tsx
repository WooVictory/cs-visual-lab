"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  domainLabel,
  domainOrder,
  getTopicsByDomain,
  topics,
} from "@/lib/topics";
import { SidebarTopicIndicator } from "./SidebarTopicIndicator";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex dark:border-zinc-800 dark:bg-zinc-950">
      <Link
        href="/"
        className="block border-b border-zinc-200 px-5 py-4 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
      >
        <div className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          CS Visual Lab
        </div>
        <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          시각화 + 면접 학습 · {topics.length} 토픽
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {domainOrder.map((d) => {
          const list = getTopicsByDomain(d);
          if (list.length === 0) return null;
          return (
            <section key={d} className="mb-5 last:mb-0">
              <div className="flex items-baseline justify-between px-2 pb-1.5">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {domainLabel[d]}
                </h3>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  {list.length}
                </span>
              </div>
              <ul className="flex flex-col gap-0.5">
                {list.map((t) => {
                  const href = `/topics/${t.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={t.slug}>
                      <Link
                        href={href}
                        className={`flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-sm transition ${
                          active
                            ? "bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                        }`}
                      >
                        <span className="truncate">{t.title}</span>
                        <SidebarTopicIndicator slug={t.slug} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </nav>
    </aside>
  );
}
