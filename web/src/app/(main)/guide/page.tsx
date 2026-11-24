import type { Metadata, Route } from "next";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { COUNCIL_NAME, MUNICIPALITY, SITE_NAME } from "@/config/local-site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: `はじめての方へ | ${SITE_NAME}`,
  description:
    "AIの聞き手の質問に答えるだけで、地域の課題について声を寄せられます。",
};

const STEPS: { title: string; body: string[] }[] = [
  {
    title: "テーマを選ぶ",
    body: ["テーマ一覧から、気になるテーマを選んで「参加する」を押します。"],
  },
  {
    title: "同意して始める",
    body: [
      "注意事項を読み、同意のチェックを入れて「同意してはじめる」を押します。",
    ],
  },
  {
    title: "AIの質問に答える",
    body: [
      "思ったことを、自由に書いて送ります。答えに合わせて、AIがもう少し詳しく聞くことがあります。",
      "選択肢が出たときは、ボタンを押すだけでも答えられます。",
    ],
  },
  {
    title: "答えにくい質問は飛ばす",
    body: [
      "質問の下の「スキップする」で、次の質問に進めます。",
      "途中でやめたいときは、画面上の「保存して中断」を押します。同じスマホ・同じブラウザなら、あとで続きから答えられます。",
    ],
  },
  {
    title: "まとめを確かめる",
    body: [
      "最後に、AIがお話を短くまとめます。直してほしいところがあれば、そのまま書いて伝えられます。",
    ],
  },
  {
    title: "公開するかを選んで提出する",
    body: [
      "「公開を許可して提出する」か「非公開で提出する」を選べば完了です。",
    ],
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "子どもでも答えられますか？",
    a: "はい。子どもも大人も、同じように答えられます。名前や学校名は書かないでください。",
  },
  {
    q: "AIの質問の意味がわからないときは？",
    a: "「どういうこと？」と書いて送れば、AIが言いかえて説明します。",
  },
  {
    q: "スマートフォンで答えられますか？",
    a: "はい。スマートフォンで答えやすいように作っています。",
  },
];

export default function GuidePage() {
  return (
    <Container>
      <div className="flex flex-col gap-10 pt-28 pb-12">
        {/* 導入 */}
        <section className="flex flex-col gap-4">
          <h1 className="text-[26px] font-bold leading-[1.5] text-mirai-text">
            はじめての方へ
          </h1>
          <p className="text-[15px] leading-[1.87] text-mirai-text">
            AIの聞き手の質問に答えるだけで、{MUNICIPALITY.name}
            の地域の課題について声を寄せられます。1回10分ほどで、名前や連絡先の入力はいりません。
          </p>
          <Link
            href={routes.home() as Route}
            className="inline-flex w-fit items-center rounded-full bg-primary px-5 py-2.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
          >
            テーマ一覧を見る →
          </Link>
        </section>

        {/* 参加の流れ */}
        <section className="flex flex-col gap-5">
          <h2 className="text-[20px] font-bold text-mirai-text">参加の流れ</h2>
          <ol className="flex flex-col">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white">
                    {index + 1}
                  </span>
                  {index < STEPS.length - 1 && (
                    <span aria-hidden className="w-px flex-1 bg-mirai-border" />
                  )}
                </div>
                <div className="flex flex-col gap-1.5 pb-6">
                  <h3 className="text-[15px] font-bold leading-7 text-mirai-text">
                    {step.title}
                  </h3>
                  {step.body.map((text) => (
                    <p
                      key={text}
                      className="text-[13px] leading-[1.8] text-mirai-text-secondary"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 回答の扱い */}
        <section className="flex flex-col gap-3 rounded-2xl bg-mirai-brand-mint p-5">
          <h2 className="text-[17px] font-bold text-mirai-text">
            あなたの回答の扱い
          </h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-[13px] leading-[1.8] text-mirai-text">
            <li>
              お名前・地区名・勤務先・学校名など、あなたや他の方が特定できることは書かないでください。
            </li>
            <li>
              公開するかどうかは、提出のときにあなたが選びます。公開すると、まとめとAIとのやりとり全文が、匿名でこのサイトに載ります。
            </li>
            <li>
              集まった声は匿名で集計・要約し、{COUNCIL_NAME}
              の活動や、地域の課題を{MUNICIPALITY.kind}
              全体で話し合う材料にします。
            </li>
            <li>
              AIへの指示（プロンプト）は、各インタビューの「AIインタビューに関する情報開示」から全文を読めます。
            </li>
          </ul>
        </section>

        {/* よくある質問 */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[20px] font-bold text-mirai-text">
            よくある質問
          </h2>
          <dl className="flex flex-col gap-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="flex flex-col gap-1">
                <dt className="text-[14px] font-bold text-mirai-text">
                  {faq.q}
                </dt>
                <dd className="text-[13px] leading-[1.8] text-mirai-text-secondary">
                  {faq.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="flex flex-col gap-2 text-[13px] font-bold text-primary-accent">
          <Link href={routes.home() as Route} className="hover:underline">
            テーマ一覧へ →
          </Link>
          <Link
            href={routes.participation() as Route}
            className="hover:underline"
          >
            インタビューごとの参加状況 →
          </Link>
        </div>
      </div>
    </Container>
  );
}
