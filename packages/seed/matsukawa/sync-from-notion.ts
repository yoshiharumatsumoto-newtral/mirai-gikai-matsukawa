/**
 * Notion の「テーマ」「質問」データベースの内容を、サイトのデータベースに反映するスクリプト
 *
 * - 「公開」にチェックがあるテーマだけをサイトに出す。チェックを外したテーマは下書きに戻す（データは残す）。
 * - 登録済みのテーマ（サイトIDあり）は、インタビュー設定を消さずに中身だけを書き換える。
 *   設定を消すと、集まった回答（セッション）まで一緒に消えるため。
 * - サイトIDが空のテーマは新しく登録し、できたサイトIDを Notion に書き戻す。
 *
 * 必要な環境変数（.env）: NOTION_TOKEN, SUPABASE_URL, SUPABASE_SECRET_KEY
 * 反映後のキャッシュ更新に使う（任意）: NEXT_PUBLIC_WEB_URL, REVALIDATE_SECRET
 *
 * 実行:       pnpm --filter @mirai-gikai/seed exec dotenv -e ../../.env -- tsx matsukawa/sync-from-notion.ts
 * 確認だけ:   上のコマンドの末尾に --dry-run（何が変わるかを表示し、書き込まない）
 */
import { createAdminClient } from "../shared/helper";
import {
  CAUTIONS,
  CHAT_MODEL,
  contentOf,
  knowledgeSourceOf,
} from "./theme-text";

/** 編集ページの中のデータベース（IDは秘密情報ではない） */
const THEME_DB_ID = "422b8632-00dc-817b-b843-f80eb2fa7298";
const QUESTION_DB_ID = "422b8632-00dc-816f-b313-e086d74fd4f5";

const NOTION_VERSION = "2022-06-28";

/** 一覧の並び（新しい順）を「並び順」に合わせるための基準日。並び順が小さいほど新しくする */
const ORDER_BASE = Date.UTC(2026, 10, 24);

const dryRun = process.argv.includes("--dry-run");

// ── Notion の読み書き ─────────────────────────────────────

type NotionProperty = {
  type: string;
  title?: { plain_text: string }[];
  rich_text?: { plain_text: string }[];
  number?: number | null;
  checkbox?: boolean;
  relation?: { id: string }[];
};

type NotionPage = {
  id: string;
  properties: Record<string, NotionProperty>;
};

async function notion(
  path: string,
  init: { method: string; body?: unknown }
): Promise<unknown> {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error(
      "NOTION_TOKEN が .env に設定されていません（Notion のインテグレーションのキー）"
    );
  }
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 404) {
      throw new Error(
        "Notion のデータベースが見つかりません。編集ページをインテグレーションと共有しているか確認してください"
      );
    }
    throw new Error(`Notion API エラー (${res.status}): ${text}`);
  }
  return res.json();
}

async function queryAll(databaseId: string): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;
  do {
    const data = (await notion(`/databases/${databaseId}/query`, {
      method: "POST",
      body: { page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) },
    })) as {
      results: NotionPage[];
      has_more: boolean;
      next_cursor: string | null;
    };
    pages.push(...data.results);
    cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return pages;
}

function text(page: NotionPage, name: string): string {
  const prop = page.properties[name];
  if (!prop) return "";
  const parts = prop.title ?? prop.rich_text ?? [];
  return parts
    .map((p) => p.plain_text)
    .join("")
    .trim();
}

function num(page: NotionPage, name: string): number | null {
  return page.properties[name]?.number ?? null;
}

function checked(page: NotionPage, name: string): boolean {
  return page.properties[name]?.checkbox === true;
}

function relationIds(page: NotionPage, name: string): string[] {
  return (page.properties[name]?.relation ?? []).map((r) => r.id);
}

async function writeSiteId(pageId: string, siteId: string) {
  await notion(`/pages/${pageId}`, {
    method: "PATCH",
    body: {
      properties: {
        サイトID: { rich_text: [{ text: { content: siteId } }] },
      },
    },
  });
}

// ── Notion の行を、サイトに入れる形に整える ─────────────────

type SyncQuestion = {
  question: string;
  follow_up_guide: string | null;
  quick_replies: string[] | null;
  target_audience: string | null;
};

type SyncTheme = {
  notionPageId: string;
  siteId: string;
  isPublic: boolean;
  order: number;
  no: string;
  field: string;
  title: string;
  summary: string;
  clue: string;
  source: string;
  extraNote?: string;
  questions: SyncQuestion[];
};

function toThemes(
  themePages: NotionPage[],
  questionPages: NotionPage[]
): SyncTheme[] {
  const questionsByTheme = new Map<string, NotionPage[]>();
  for (const q of questionPages) {
    for (const themeId of relationIds(q, "テーマ")) {
      const list = questionsByTheme.get(themeId) ?? [];
      list.push(q);
      questionsByTheme.set(themeId, list);
    }
  }

  return themePages.map((page) => {
    const questions = (questionsByTheme.get(page.id) ?? [])
      .filter((q) => text(q, "質問文"))
      .sort((a, b) => (num(a, "順番") ?? 999) - (num(b, "順番") ?? 999))
      .map((q) => {
        const replies = text(q, "選択肢")
          .split(/[／/]/)
          .map((s) => s.trim())
          .filter(Boolean);
        return {
          question: text(q, "質問文"),
          follow_up_guide: text(q, "深掘りの観点") || null,
          quick_replies: replies.length > 0 ? replies : null,
          target_audience: text(q, "聞く相手") || null,
        };
      });

    return {
      notionPageId: page.id,
      siteId: text(page, "サイトID"),
      isPublic: checked(page, "公開"),
      order: num(page, "並び順") ?? 999,
      no: text(page, "番号"),
      field: text(page, "分野"),
      title: text(page, "問い"),
      summary: text(page, "短い説明"),
      clue: text(page, "手がかり"),
      source: text(page, "出典"),
      extraNote: text(page, "AIへの配慮メモ") || undefined,
      questions,
    };
  });
}

/** 公開するテーマに足りない項目があれば、その一覧を返す */
function missingFields(theme: SyncTheme): string[] {
  const missing: string[] = [];
  if (!theme.title) missing.push("問い");
  if (!theme.no) missing.push("番号");
  if (!theme.field) missing.push("分野");
  if (!theme.summary) missing.push("短い説明");
  if (theme.questions.length === 0) missing.push("質問（1問以上）");
  return missing;
}

// ── サイトのデータベースへの反映 ───────────────────────────

const supabase = createAdminClient();

async function billExists(id: string): Promise<boolean> {
  const { data } = await supabase
    .from("bills")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  return data != null;
}

async function hideTheme(theme: SyncTheme) {
  if (dryRun) return;
  await supabase
    .from("bills")
    .update({ publish_status: "draft" })
    .eq("id", theme.siteId);
  await supabase
    .from("interview_configs")
    .update({ status: "closed" })
    .eq("bill_id", theme.siteId);
}

/**
 * テーマを新しく登録する。id を渡すとその id で作る（Notion のサイトIDと、
 * 別のデータベース（試験用と本番用など）の id をそろえるため）。
 */
async function createTheme(theme: SyncTheme, id?: string): Promise<string> {
  const { data: bill, error } = await supabase
    .from("bills")
    .insert({
      ...(id ? { id } : {}),
      name: theme.title,
      originating_house: "HR", // 必須項目のため形式上の値（画面には出さない）
      status: "preparing",
      publish_status: "published",
      published_at: new Date().toISOString(),
      submitted_date: new Date(ORDER_BASE - theme.order * 60_000).toISOString(),
      is_featured: false,
      knowledge_source: knowledgeSourceOf(theme),
    })
    .select("id")
    .single();
  if (error) throw new Error(`テーマの登録に失敗: ${error.message}`);

  const { error: contentError } = await supabase.from("bill_contents").insert(
    (["normal", "hard"] as const).map((difficulty_level) => ({
      bill_id: bill.id,
      difficulty_level,
      title: theme.title,
      summary: theme.summary,
      content: contentOf(theme),
    }))
  );
  if (contentError) throw new Error(`本文の登録に失敗: ${contentError.message}`);

  await upsertConfigAndQuestions(bill.id, theme);
  return bill.id;
}

async function updateTheme(theme: SyncTheme) {
  const { error } = await supabase
    .from("bills")
    .update({
      name: theme.title,
      publish_status: "published",
      submitted_date: new Date(ORDER_BASE - theme.order * 60_000).toISOString(),
      knowledge_source: knowledgeSourceOf(theme),
    })
    .eq("id", theme.siteId);
  if (error) throw new Error(`テーマの更新に失敗: ${error.message}`);

  const { error: contentError } = await supabase
    .from("bill_contents")
    .update({
      title: theme.title,
      summary: theme.summary,
      content: contentOf(theme),
    })
    .eq("bill_id", theme.siteId);
  if (contentError) throw new Error(`本文の更新に失敗: ${contentError.message}`);

  await upsertConfigAndQuestions(theme.siteId, theme);
}

/** インタビュー設定は消さずに書き換え、質問は順番ごとに書き換える（足りなければ足し、余れば消す） */
async function upsertConfigAndQuestions(billId: string, theme: SyncTheme) {
  const configValues = {
    name: `${theme.no} ${theme.field}`,
    status: "public" as const,
    mode: "targeted" as const,
    estimated_duration: 10,
    themes: [theme.field],
    prompt_overrides: { targeted: { cautions: CAUTIONS } },
  };

  const { data: configs } = await supabase
    .from("interview_configs")
    .select("id")
    .eq("bill_id", billId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1);

  let configId = configs?.[0]?.id;
  if (configId) {
    const { error } = await supabase
      .from("interview_configs")
      .update(configValues)
      .eq("id", configId);
    if (error) throw new Error(`設定の更新に失敗: ${error.message}`);
  } else {
    const { data, error } = await supabase
      .from("interview_configs")
      .insert({ bill_id: billId, chat_model: CHAT_MODEL, ...configValues })
      .select("id")
      .single();
    if (error) throw new Error(`設定の登録に失敗: ${error.message}`);
    configId = data.id;
  }

  const { data: existing } = await supabase
    .from("interview_questions")
    .select("id")
    .eq("interview_config_id", configId)
    .order("question_order", { ascending: true });
  const existingIds = (existing ?? []).map((q) => q.id);

  for (const [index, q] of theme.questions.entries()) {
    const values = { ...q, question_order: index + 1 };
    const id = existingIds[index];
    const { error } = id
      ? await supabase.from("interview_questions").update(values).eq("id", id)
      : await supabase
          .from("interview_questions")
          .insert({ ...values, interview_config_id: configId });
    if (error) throw new Error(`質問の反映に失敗: ${error.message}`);
  }

  const extra = existingIds.slice(theme.questions.length);
  if (extra.length > 0) {
    await supabase.from("interview_questions").delete().in("id", extra);
  }
}

async function revalidateSite() {
  const url = process.env.NEXT_PUBLIC_WEB_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;
  try {
    await fetch(`${url}/api/revalidate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    console.log("🔄 サイトの表示を更新しました");
  } catch {
    console.log(
      "（サイトが動いていないため、表示の更新は飛ばしました。次にサイトを開いたときに反映されます）"
    );
  }
}

// ── 実行 ─────────────────────────────────────────────

async function main() {
  console.log(dryRun ? "【確認だけ（書き込みません）】" : "【反映します】");

  const [themePages, questionPages] = await Promise.all([
    queryAll(THEME_DB_ID),
    queryAll(QUESTION_DB_ID),
  ]);
  const themes = toThemes(themePages, questionPages).sort(
    (a, b) => a.order - b.order
  );

  let problems = 0;
  for (const theme of themes) {
    const label = `${theme.no || "（番号なし）"} ${theme.title || "（問いなし）"}`;

    if (!theme.isPublic) {
      if (theme.siteId) {
        await hideTheme(theme);
        console.log(`🙈 非公開にする: ${label}`);
      } else {
        console.log(`⏭️  非公開のまま: ${label}`);
      }
      continue;
    }

    const missing = missingFields(theme);
    if (missing.length > 0) {
      problems++;
      console.log(`⚠️  飛ばしました（${missing.join("・")}が空）: ${label}`);
      continue;
    }

    if (theme.siteId && (await billExists(theme.siteId))) {
      if (!dryRun) await updateTheme(theme);
      console.log(`✅ 更新: ${label}（質問 ${theme.questions.length}問）`);
    } else if (theme.siteId) {
      // 別のデータベース（本番用など）にはまだ無いので、同じ id で作る
      if (!dryRun) await createTheme(theme, theme.siteId);
      console.log(`🆕 新規（同じサイトIDで）: ${label}（質問 ${theme.questions.length}問）`);
    } else {
      if (!dryRun) {
        const siteId = await createTheme(theme);
        await writeSiteId(theme.notionPageId, siteId);
      }
      console.log(`🆕 新規: ${label}（質問 ${theme.questions.length}問）`);
    }
  }

  if (!dryRun) await revalidateSite();
  console.log(
    problems > 0
      ? `完了（${problems}件は飛ばしました。Notion で空の項目を埋めてから、もう一度実行してください）`
      : "完了しました"
  );
}

main().catch((e) => {
  console.error("❌", e instanceof Error ? e.message : e);
  process.exit(1);
});
