import { COUNCIL_NAME, MUNICIPALITY, OPERATOR_NAME } from "@/config/local-site";

/**
 * テーマページ下部の「掲載内容について」と免責事項。
 *
 * 本家は国会の法案解説の出典（閣法など）とチームみらいの賛否について書いているが、
 * 町村版では地域の課題テーマと、集めた声の扱いについて書く。
 */
export function BillDisclaimer() {
  return (
    <div className="space-y-6 pt-4 pb-10">
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-black">掲載内容について</h3>
        <p className="text-xs leading-relaxed text-mirai-text-note">
          掲載している地域の課題テーマと説明は、{COUNCIL_NAME}
          の議会だよりなどの公開情報をもとに、{OPERATOR_NAME}
          が作成したものです。{COUNCIL_NAME}としての公式な見解ではありません。
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-black">免責事項</h3>
        <p className="text-xs leading-relaxed text-mirai-text-note">
          掲載する情報は、できる限り正確になるよう努めていますが、その正確性・完全性について保証するものではありません。また、AIの聞き手は不正確または誤解を招く応答をすることがあります。正確な情報は、
          {MUNICIPALITY.kind}の公式な発表や一次資料をご確認ください。
        </p>
      </div>
    </div>
  );
}
