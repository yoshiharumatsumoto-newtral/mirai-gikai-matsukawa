/** 町村版の地域の課題テーマ（一覧と参加状況で使う） */
export type LocalTheme = {
  id: string;
  /** 「①」など。無ければ空文字 */
  no: string;
  /** 分野（「交通・移動」など） */
  field: string;
  title: string;
  summary: string;
  /** 写真を用意したら入れる。無ければタイトル画像を描く */
  thumbnailUrl: string | null;
  estimatedMinutes: number | null;
  /** インタビューを始めた人の数 */
  participantCount: number;
  /** 最後まで答えた数（「〇件の声」） */
  completedCount: number;
  /** 公開に同意した会話の数 */
  publicReportCount: number;
};
