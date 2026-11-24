import type { Metadata, Route } from "next";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { SITE_NAME } from "@/config/local-site";
import { ThemeParticipationList } from "@/features/local-themes/server/components/theme-participation-list";
import { getLocalThemes } from "@/features/local-themes/server/loaders/get-local-themes";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: `インタビューごとの参加状況 | ${SITE_NAME}`,
  description: "どのテーマに、どれだけの人が答えているかの一覧です。",
};

export default async function ParticipationPage() {
  const themes = await getLocalThemes();

  return (
    <Container>
      <div className="flex flex-col gap-6 pt-28 pb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-[24px] font-bold leading-[1.5] text-mirai-text">
            インタビューごとの参加状況
          </h1>
          <p className="text-[13px] leading-[1.8] text-mirai-text-secondary">
            どのテーマに、どれだけの人が答えているかの一覧です。回答者の多い順に並べています。読めるのは、回答した人が公開に同意した会話だけです。
          </p>
          <p className="text-[13px] leading-[1.8] text-mirai-text-secondary">
            声の少ないテーマは、まだ声を待っているテーマです。周りの人と声をかけ合うきっかけにしてください。
          </p>
        </div>

        <ThemeParticipationList themes={themes} />

        <Link
          href={routes.home() as Route}
          className="text-[13px] font-bold text-primary-accent hover:underline"
        >
          ← テーマ一覧へ戻る
        </Link>
      </div>
    </Container>
  );
}
