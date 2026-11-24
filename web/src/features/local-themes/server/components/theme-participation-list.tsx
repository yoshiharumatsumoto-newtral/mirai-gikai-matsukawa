import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { OpenBadge, ThemeActions } from "../../shared/components/theme-parts";
import { ThemeThumbnail } from "../../shared/components/theme-thumbnail";
import type { LocalTheme } from "../../shared/types";

/**
 * 「インタビューごとの参加状況」。回答者の多い順に、数字だけを出す（回答の中身は出さない）。
 */
export function ThemeParticipationList({ themes }: { themes: LocalTheme[] }) {
  const sorted = [...themes].sort(
    (a, b) => b.participantCount - a.participantCount
  );

  return (
    <ul className="flex flex-col gap-4">
      {sorted.map((theme) => (
        <li key={theme.id}>
          <ParticipationCard theme={theme} />
        </li>
      ))}
    </ul>
  );
}

function ParticipationCard({ theme }: { theme: LocalTheme }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-mirai-border bg-white p-4">
      <div className="flex items-start gap-3">
        <ThemeThumbnail
          no={theme.no}
          field={theme.field}
          thumbnailUrl={theme.thumbnailUrl}
          compact
          className="w-[56px] shrink-0"
        />
        <div className="flex min-w-0 flex-col gap-1.5">
          <OpenBadge />
          <h2 className="text-[14px] font-bold leading-[1.5] text-mirai-text">
            <Link
              href={routes.billDetail(theme.id) as Route}
              className="hover:underline"
            >
              {theme.title}
            </Link>
          </h2>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2 rounded-xl bg-mirai-brand-mint px-3 py-2.5">
        <Stat label="回答者" value={theme.participantCount} unit="人" />
        <Stat label="最後まで回答" value={theme.completedCount} unit="件" />
        <Stat
          label="公開された会話"
          value={theme.publicReportCount}
          unit="件"
        />
      </dl>

      {theme.participantCount === 0 && (
        <p className="text-[12px] text-mirai-text-secondary">
          まだ声が届いていません。最初の声を寄せてみませんか。
        </p>
      )}

      <ThemeActions theme={theme} />
    </article>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] text-mirai-text-secondary">{label}</dt>
      <dd className="text-[18px] font-bold leading-none text-primary-accent">
        {value.toLocaleString()}
        <span className="ml-0.5 text-[11px] font-medium text-mirai-text">
          {unit}
        </span>
      </dd>
    </div>
  );
}
