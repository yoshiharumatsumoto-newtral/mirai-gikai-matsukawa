import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { OpenBadge, ThemeActions } from "../../shared/components/theme-parts";
import { ThemeThumbnail } from "../../shared/components/theme-thumbnail";
import type { LocalTheme } from "../../shared/types";

/**
 * トップのテーマ一覧。1テーマ1行で、左に文字、右にタイトル画像（写真）を置く。
 */
export function ThemeList({ themes }: { themes: LocalTheme[] }) {
  if (themes.length === 0) {
    return (
      <p className="text-sm text-mirai-text-secondary">
        いま受け付けているテーマはありません。
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-mirai-border border-y border-mirai-border">
      {themes.map((theme) => (
        <li key={theme.id} className="py-5">
          <ThemeListItem theme={theme} />
        </li>
      ))}
    </ul>
  );
}

function ThemeListItem({ theme }: { theme: LocalTheme }) {
  return (
    <article className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-mirai-text-secondary">
            <OpenBadge />
            {theme.estimatedMinutes != null && (
              <span>約{theme.estimatedMinutes}分</span>
            )}
            <span>
              <span className="font-bold text-mirai-text">
                {theme.completedCount}
              </span>
              件の声
            </span>
          </div>
          <h3 className="text-[16px] font-bold leading-[1.5] text-mirai-text">
            <Link
              href={routes.billDetail(theme.id) as Route}
              className="hover:underline"
            >
              {theme.title}
            </Link>
          </h3>
        </div>
        <ThemeThumbnail
          no={theme.no}
          field={theme.field}
          thumbnailUrl={theme.thumbnailUrl}
          className="w-[84px] shrink-0"
        />
      </div>
      <p className="line-clamp-2 text-[13px] leading-[1.7] text-mirai-text-secondary">
        {theme.summary}
      </p>
      <ThemeActions theme={theme} />
    </article>
  );
}
