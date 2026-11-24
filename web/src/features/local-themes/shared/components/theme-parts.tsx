import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import type { LocalTheme } from "../types";

/** 「● 募集中」の札 */
export function OpenBadge() {
  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-mirai-brand-mint px-2.5 py-0.5 text-[11px] font-bold text-primary-accent">
      <span aria-hidden className="size-1.5 rounded-full bg-primary" />
      募集中
    </span>
  );
}

/** 「参加する」「会話を読む（〇件）」のボタン */
export function ThemeActions({ theme }: { theme: LocalTheme }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={routes.interviewLP(theme.id) as Route}
        className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
      >
        参加する
      </Link>
      {theme.publicReportCount > 0 && (
        <Link
          href={routes.billOpinions(theme.id) as Route}
          className="inline-flex items-center rounded-full border border-mirai-text bg-white px-4 py-1.5 text-[13px] font-bold text-mirai-text transition-colors hover:bg-mirai-surface"
        >
          会話を読む（{theme.publicReportCount}件）
        </Link>
      )}
    </div>
  );
}
