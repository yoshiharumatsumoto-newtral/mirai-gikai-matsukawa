import { Container } from "@/components/layouts/container";
import { About } from "@/components/top/about";
import { COUNCIL_NAME, MUNICIPALITY, SITE_NAME } from "@/config/local-site";
import { InterviewOpenBillSection } from "@/features/bills/server/components/interview-open-bill-section";
import { loadHomeData } from "@/features/bills/server/loaders/load-home-data";

/**
 * 町村版のトップページ。
 *
 * 本家は国会の会期・法案の審議状況・チームみらいの紹介・法案についてのAIチャットで
 * 組み立てているが、町村版で扱うのは「地域の課題テーマ」なので、
 * 意見を受け付けているテーマの一覧と、このサイトの説明だけを置く。
 */
export default async function Home() {
  const { interviewOpenBills } = await loadHomeData();

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
          </div>
        </Container>
      </section>

      {/* 意見を受け付けているテーマ */}
      <Container>
        <div className="py-10">
          <InterviewOpenBillSection bills={interviewOpenBills} />
        </div>
      </Container>

      <Container>
        {/* このサイトについて */}
        <About />
      </Container>
    </>
  );
}
