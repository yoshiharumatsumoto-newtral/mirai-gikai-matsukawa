import type { Metadata } from "next";
import { Container } from "@/components/layouts/container";
import {
  LegalList,
  LegalPageLayout,
  LegalParagraph,
  LegalSectionTitle,
} from "@/components/layouts/legal-page-layout";
import {
  CONTACT,
  COUNCIL_NAME,
  OPERATOR_NAME,
  SITE_NAME,
} from "@/config/local-site";

export const metadata: Metadata = {
  title: `プライバシーポリシー | ${SITE_NAME}`,
  description: `${SITE_NAME}のプライバシーポリシー`,
};

/**
 * 町村版のプライバシーポリシー。
 *
 * 本家（チームみらい）のものを下敷きに、運営者・利用目的・保管期間・問い合わせ先を
 * 町村版の運営者のものに置き換えている。公開前に内容を運営者が確認すること。
 */
export default function PrivacyPage() {
  return (
    <LegalPageLayout
      className="bg-transparent pt-24 md:pt-12"
      title="プライバシーポリシー"
      enLabel="Privacy Policy"
      description={`${OPERATOR_NAME}（以下「当運営者」といいます）が運営する${SITE_NAME}（以下「本サービス」といいます）における、個人情報の取り扱いについてご説明します。`}
    >
      <Container className="space-y-8">
        <p className="text-sm text-mirai-text-muted">
          最終更新日：2026年11月24日
        </p>

        <section className="space-y-4">
          <LegalSectionTitle>1. 個人情報の定義</LegalSectionTitle>
          <LegalParagraph>
            個人情報とは、以下のような情報であって、特定の個人を識別することができるものを指します。
          </LegalParagraph>
          <LegalList
            items={[
              "氏名、年齢、性別、住所、電話番号、職業、メールアドレス",
              "個人ごとに割り当てられたIDやパスワード、その他識別可能な記号",
              "本サービスのAIインタビュー機能（以下「AIインタビュー機能」といいます）を通じて取得される対話ログ、および行動履歴",
              "他の情報と容易に照合することができ、それにより特定の個人を識別できることとなるもの",
            ]}
          />
          <LegalParagraph>
            本サービスでは、お名前や地区名、勤務先など、ご本人や他の方が特定できる情報は入力しないようお願いしています。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>2. 利用目的</LegalSectionTitle>
          <LegalParagraph>
            当運営者は、以下の目的の範囲で、取得した情報を利用します。
          </LegalParagraph>
          <LegalList
            items={[
              "本サービスの運営",
              "本サービスの安全な運営に必要な不正対策",
              "本サービスの改善",
              `いただいた声を匿名で集計・要約し、${COUNCIL_NAME}での活動・質問・政策提言の検討に役立てること`,
              "上記の各目的に必要な調査・分析",
            ]}
          />
          <LegalParagraph>
            AIインタビュー機能を通じて取得した回答内容は、以下のとおり取り扱います。
          </LegalParagraph>
          <LegalList
            items={[
              {
                id: "publish",
                content: (
                  <>
                    <span className="font-semibold text-slate-800">公開：</span>
                    回答者が公開に同意した場合に限り、本サービスや報告資料などで匿名で公開することがあります。公開に同意しなかった回答内容は、第三者に公開または提供しません。
                  </>
                ),
              },
              {
                id: "statistics",
                content: (
                  <>
                    <span className="font-semibold text-slate-800">
                      集計・要約：
                    </span>
                    個人を特定できない形に集計・要約したうえで、議会での発言や報告などで用いることがあります。
                  </>
                ),
              },
            ]}
          />
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>3. 第三者への提供</LegalSectionTitle>
          <LegalParagraph>
            以下のいずれかに該当する場合を除き、個人情報を第三者に開示・提供することはありません。
          </LegalParagraph>
          <LegalList
            items={[
              "回答者が公開に同意した範囲で、回答内容を匿名で公開する場合",
              "本人の同意がある場合",
              "個人を特定できない統計的な情報として提供する場合",
              "法令に基づく開示請求（裁判所・警察等）があった場合",
              "不正アクセスや規約違反など、緊急の対応が必要と判断された場合",
            ]}
          />
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>4. 外部サービスの利用</LegalSectionTitle>
          <LegalParagraph>
            AIインタビュー機能では、応答の生成のために外部のAIサービスを利用しており、入力された内容はその処理のために外部のAIサービスに送られます。また、データの保管のために外部のデータベースサービスを利用しています。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>5. 安全管理</LegalSectionTitle>
          <LegalParagraph>
            取得した情報は、当運営者が責任をもって管理し、不正なアクセスや漏えいを防ぐための対策を講じます。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>6. Cookie（クッキー）について</LegalSectionTitle>
          <LegalParagraph>
            本サービスでは、利便性の向上とアクセス解析のためにCookieを使用することがあります。これらは個人を特定するものではありません。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>7. 保管期間と削除</LegalSectionTitle>
          <LegalParagraph>
            取得した対話ログは、本サービスの目的のために必要な期間保管し、不要となった時点で適切な方法で削除します。なお、回答者の同意に基づいて公開した内容のうち、すでに第三者に閲覧・保存されたものについては、削除できない場合があります。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>8. 改訂</LegalSectionTitle>
          <LegalParagraph>
            本ポリシーは必要に応じて改訂します。改訂内容は本サービスへの掲載をもって効力を生じるものとします。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>9. お問い合わせ窓口</LegalSectionTitle>
          <LegalParagraph>
            回答内容の確認・削除や、回答の公開の停止などのご相談は、下記までご連絡ください。
          </LegalParagraph>
          <LegalParagraph>
            {OPERATOR_NAME}
            <br />
            {CONTACT || "（お問い合わせ先は準備中です）"}
          </LegalParagraph>
        </section>
      </Container>
    </LegalPageLayout>
  );
}
