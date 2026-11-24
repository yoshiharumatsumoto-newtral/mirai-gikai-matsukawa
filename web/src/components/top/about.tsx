import Image from "next/image";
import {
  COUNCIL_KIND,
  COUNCIL_NAME,
  MUNICIPALITY,
  OPERATOR_NAME,
  SITE_NAME,
} from "@/config/local-site";

export function About() {
  return (
    <div className="py-10">
      <div className="flex flex-col gap-4">
        {/* ヘッダー */}
        <div className="flex flex-col gap-4">
          <h2>
            <Image
              src="/icons/about-typography.svg"
              alt="About"
              width={143}
              height={36}
              priority
            />
          </h2>
          <p className="text-sm font-bold text-primary-accent">
            {SITE_NAME}とは
          </p>
        </div>

        {/* コンテンツ */}
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-bold leading-[43.2px]">
            {COUNCIL_KIND}と、
            <br />
            {MUNICIPALITY.kind}に暮らす人の声をつなぐ
          </h3>
          <p className="text-[15px] leading-[28px] text-black">
            {SITE_NAME}
            は、{MUNICIPALITY.name}
            の地域の課題について、{MUNICIPALITY.kind}
            に暮らす人・関わる人の声をAIインタビューでお聞きし、{COUNCIL_NAME}
            での活動や提言につなげるための場です。
          </p>
          <p className="text-[15px] leading-[28px] text-black">
            いただいた声は{OPERATOR_NAME}
            が匿名で集計・要約します。公開を許可いただいた声は、このサイトで誰でも見られるようにしていきます。
          </p>
        </div>
      </div>
    </div>
  );
}
