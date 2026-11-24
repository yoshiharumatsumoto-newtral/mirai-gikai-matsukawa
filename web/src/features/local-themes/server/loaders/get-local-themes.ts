import "server-only";

import { countPublicReportsByBillIds } from "@mirai-gikai/shared/report-publication/count-public-reports";
import { createAdminClient } from "@mirai-gikai/supabase";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { LocalTheme } from "../../shared/types";

/**
 * 町村版のテーマ一覧（AIインタビューを受け付けているもの）と、テーマごとの参加状況を取得する。
 *
 * トップの一覧と「インタビューごとの参加状況」ページの両方で使う。
 * 並び順は登録時に付けた日付の新しい順（①が先頭）。
 */
export async function getLocalThemes(): Promise<LocalTheme[]> {
  try {
    return await _getCachedLocalThemes();
  } catch (error) {
    // 失敗をキャッシュしないよう、キャッシュ関数の外で受けて空に縮退させる
    console.error("Failed to fetch local themes:", error);
    return [];
  }
}

const _getCachedLocalThemes = unstable_cache(
  async (): Promise<LocalTheme[]> => {
    const supabase = createAdminClient();

    const { data: bills, error } = await supabase
      .from("bills")
      .select(
        `
        id,
        thumbnail_url,
        bill_contents!inner ( title, summary, difficulty_level ),
        interview_configs!inner ( name, themes, estimated_duration, status, deleted_at )
      `
      )
      .eq("publish_status", "published")
      .eq("bill_contents.difficulty_level", "normal")
      .eq("interview_configs.status", "public")
      .is("interview_configs.deleted_at", null)
      .order("submitted_date", { ascending: false, nullsFirst: false });

    if (error) {
      throw new Error(`Failed to fetch local themes: ${error.message}`);
    }

    const { data: metrics, error: metricsError } = await supabase.rpc(
      "get_interview_metrics_by_bill",
      {}
    );
    if (metricsError) {
      throw new Error(
        `Failed to fetch interview metrics: ${metricsError.message}`
      );
    }
    const metricsByBill = new Map(metrics.map((m) => [m.bill_id, m]));

    const publicCounts = await countPublicReportsByBillIds(
      bills.map((bill) => bill.id)
    );

    return bills.map((bill) => {
      const content = bill.bill_contents[0];
      const config = bill.interview_configs[0];
      const metric = metricsByBill.get(bill.id);
      // 設定名は「① 交通・移動」の形で登録している
      const [no, ...rest] = (config?.name ?? "").split(" ");
      return {
        id: bill.id,
        no: rest.length > 0 ? no : "",
        field: config?.themes?.[0] ?? rest.join(" "),
        title: content?.title ?? "",
        summary: content?.summary ?? "",
        thumbnailUrl: bill.thumbnail_url,
        estimatedMinutes: config?.estimated_duration ?? null,
        participantCount: metric?.conducted_count ?? 0,
        completedCount: metric?.completed_count ?? 0,
        publicReportCount: publicCounts.get(bill.id) ?? 0,
      };
    });
  },
  ["local-themes"],
  {
    revalidate: 600, // 10分
    tags: [
      CACHE_TAGS.BILLS,
      CACHE_TAGS.INTERVIEW_CONFIGS,
      CACHE_TAGS.PUBLIC_INTERVIEW_REPORTS,
    ],
  }
);
