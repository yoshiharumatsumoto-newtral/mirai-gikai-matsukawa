/**
 * 町村版の自治体・運営者の設定。
 *
 * このサイトは町村議会（町議会・村議会）向けに作っている。市議会・県議会は対象にしない。
 * 画面の言葉はここから組み立てるので、別の町や村で使うときはこのファイルを書き換える。
 */

/** 町か村か。「町民」「村議会」などの言葉はここから作る */
export type MunicipalityKind = "町" | "村";

export const MUNICIPALITY = {
  prefecture: "長野県",
  district: "北安曇郡",
  /** 自治体名（「松川村」） */
  name: "松川村",
  kind: "村" as MunicipalityKind,
} as const;

/** 「松川村議会」 */
export const COUNCIL_NAME = `${MUNICIPALITY.name}議会`;

/** 「村議会」 */
export const COUNCIL_KIND = `${MUNICIPALITY.kind}議会`;

/** 「村議会議員」 */
export const COUNCILOR_KIND = `${MUNICIPALITY.kind}議会議員`;

/** 「村民」 */
export const RESIDENTS = `${MUNICIPALITY.kind}民`;

/** 運営者の表示名（団体名） */
export const OPERATOR_NAME = "これからの地方議会ラボ";

/** 松川村向けに改変した時期（AGPL-3.0 第5条 (a) の改変の明示） */
export const MODIFIED_AT = "2026年11月";

/**
 * 国会向けの表示（審議状況の札・提出日・国会の会期など）を出すか。
 * 町村版では「議案」ではなく「地域の課題テーマ」を扱うので出さない。
 */
export const SHOW_NATIONAL_DIET_FEATURES = false;

/**
 * 公開に同意した回答を、誰でもダウンロードできるオープンデータとして提供するか。
 * 提供する場合は、データ利用規約を運営者のものとして用意してから true にする。
 * false の間は、同意画面の案内・規約の記述・/api/open-data を出さない。
 */
export const OPEN_DATA_ENABLED = false;

/** 管轄裁判所（利用規約の準拠法・管轄） */
export const JURISDICTION_COURT = "長野地方裁判所";

/** 個人情報や回答公開の停止などの問い合わせ先（空の間は「準備中」と表示） */
export const CONTACT = "yoshiharu_matsumoto@matsumotokousakusyo.com";

/** サービス名（Fork ガイドラインの「みらい議会＠地域名」形式） */
export const SITE_NAME = `みらい議会＠${MUNICIPALITY.name}`;
