import type { Route } from "next";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { About } from "@/components/top/about";
import { COUNCIL_NAME, MUNICIPALITY, SITE_NAME } from "@/config/local-site";
import { ThemeList } from "@/features/local-themes/server/components/theme-list";
import { getLocalThemes } from "@/features/local-themes/server/loaders/get-local-themes";
import { routes } from "@/lib/routes";

/**
 * 町村版のトップページ。
 *
 * 本家は国会の会期・法案の審議状況・チームみらいの紹介・法案についてのAIチャットで
 * 組み立てているが、町村版で扱うのは「地域の課題テーマ」なので、
 * テーマの一覧と参加状況への入口、このサイトの説明だけを置く。
 */
export default async function Home() {
  const themes = await getLocalThemes();

  return (
    <>
      {/* ひとこと紹介 */}
      <section className="bg-mirai-light-gradient">
        <Container>
          {/* 上は浮いているヘッダーの高さぶん空ける */}
          <div className="flex flex-col gap-3 pt-28 pb-10">
            <p className="text-sm font-bold text-primary-accent">
              {MUNICIPALITY.prefecture}
              {MUNICIPALITY.district}
              {MUNICIPALITY.name}
            </p>
            <h1 className="text-[24px] font-bold leading-[1.5] text-mirai-text">
              {MUNICIPALITY.name}の課題について、
              <br />
              あなたの声を
              <br />
              聞かせてください
            </h1>
            <p className="text-[15px] leading-[1.87] text-mirai-text">
              {SITE_NAME}
              は、地域の課題テーマごとにAIの聞き手がお話を伺い、{COUNCIL_NAME}
              での活動や提言につなげる場です。10分ほどで、匿名で答えられます。
            </p>
            <Link
              href={routes.guide() as Route}
              className="text-[13px] font-bold text-primary-accent hover:underline"
            >
              はじめての方へ →
            </Link>
          </div>
        </Container>
      </section>

      {/* テーマ一覧 */}
      <Container>
        <section className="flex flex-col gap-4 py-10">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[22px] font-bold leading-[1.48] text-mirai-text">
              テーマ一覧
            </h2>
            <p className="text-[13px] text-mirai-text-secondary">
              AIの聞き手が、テーマごとにあなたのお話をうかがいます。
            </p>
          </div>

          <ThemeList themes={themes} />

          <Link
            href={routes.participation() as Route}
            className="text-[13px] font-bold text-primary-accent hover:underline"
          >
            インタビューごとの参加状況を見る →
          </Link>
        </section>
      </Container>

      <Container>
        {/* このサイトについて */}
        <About />
      </Container>
    </>
  );
}
