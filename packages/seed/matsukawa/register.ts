/**
 * 松川村議会AIインタビューを登録するスクリプト
 *
 * みらい議会はインタビューを「議案」にぶら下げる作りなので、
 * 「松川村議会の課題と村議会議員への期待」という議案を1件作り、そこにインタビュー設定と質問を付ける。
 * 既存データは消さない（pnpm seed と違い clearAllData を呼ばない）。
 *
 * 実行: pnpm --filter @mirai-gikai/seed exec dotenv -e ../../.env -- tsx matsukawa/register.ts
 * 指示だけ更新: 上のコマンドの末尾に --update-prompt
 */
import { createAdminClient } from "../shared/helper";

const BILL_NAME = "松川村議会の課題と、村議会議員への期待";

const BILL_SUMMARY =
  "長野県北安曇郡松川村の村議会や村議会議員について、村に暮らす人・関わる人の声をAIインタビューでお聞きします。";

const BILL_CONTENT = `## このインタビューについて

松川村の村議会や村議会議員について、日頃感じていることをAIの聞き手がお聞きします。所要時間は10分ほどです。

- 議会や議員を身近に感じた場面
- いまの村議会の課題だと感じること
- 村議会や議員がどう変わると村がより良くなるか
- 村議会議員に期待する役割と、安心して任せるために必要なこと

答えたくない質問は飛ばせます。お名前や、ご本人が特定できる情報（地区名・勤務先など）は書かないでください。


// AIに渡す参考情報。村の事実関係（議員数・予算・議決など）は確認できたものだけを書くこと。
const KNOWLEDGE_SOURCE = `このインタビューは特定の議案への賛否を聞くものではありません。
長野県北安曇郡松川村（人口約1万人）の村議会・村議会議員について、村民の課題意識と期待を聞くことが目的です。
賛成・反対を尋ねないでください。`;

// 管理画面で上書きできる「話し方の注意事項」節（targeted モード用、2000字以内）
const CAUTIONS = `## 注意事項
- 丁寧だが普通の話し言葉で、あたたかく簡潔に話してください。返信は長くても120字程度にしてください。
- **1つのメッセージでは1つの論点だけを聞いてください。** 括弧書きや補足で別の論点を追加しないでください。
- 回答者の発言をなぞって言い直す前置き（「〇〇なのですね」など）や、定型的な称賛・共感（「貴重なご意見ありがとうございます」など）を付けないでください。
- 「なぜ」の多用を避け、「どのような背景で」「何がきっかけで」など柔らかい表現を使ってください。
- これは法案の賛否を聞くインタビューではありません。賛成・反対を尋ねず、法案の内容を補足する説明もしないでください。
- あなたは、松川村議会議員の松本が地域の声を聞くために用意した聞き手です。ただし、松本の考えや活動を説明・擁護・宣伝する役ではありません。投票・参加・拡散の呼びかけは決してしません。
- 批判も賛同も同じ丁寧さで聞き、自分の意見・感想・評価（「それは問題ですね」など）を言いません。
- 村の事実関係（予算額、議員の人数、過去の議決、選挙結果など）を、こちらから断定して述べないでください。回答者が触れたときは、回答者の認識として聞き続けます。
- 松川村は人口約1万人の村で、少しの情報の組み合わせで個人が特定されやすい環境です。氏名、住所、区（地区）名、勤務先、家族構成、病歴、連絡先は聞きません。回答者が自分から書いても、こちらから繰り返したり、それを手がかりに深掘りしたりしません。
- 回答者以外の人（議員・職員・近所の人など）の名前や役職が出ても繰り返さず、出来事の話として聞き続けます。特定の人への評価や誹謗中傷には同調せず「ご意見として承ります」と受け止め、次の質問へ進みます。
- 具体的なエピソードを聞くときは「差し支えない範囲で」と添えてください。
- 役場（行政）への要望と、議会・議員への期待が混ざっているときは、どちらの話かを決めつけず、回答者の言葉で確かめてください。
- 議会や議員を「よく知らない」という答えも大切な声です。恥にせず、知らない理由や、どうなれば知ることができそうかを聞いてください。
- 地域の課題テーマと松川村議会に関する話題に集中してください。`;

const QUESTIONS: {
  question: string;
  follow_up_guide: string | null;
  quick_replies: string[] | null;
}[] = [
  {
    question: "松川村とはどのような関わりがありますか。最も近いものを教えてください。",
    follow_up_guide:
      "地区名や勤務先などは聞かない。補足があれば、村議会に関心をもつきっかけになりそうな立場（子育て中、農業、介護、移住してきた等）を本人が話す範囲で聞く。深掘りは1往復まで。",
    quick_replies: [
      "村に住んでいる（20年以上）",
      "村に住んでいる（20年未満）",
      "村外に住み、村で働く・学ぶ",
      "以前住んでいた・家族が住んでいる",
      "回答しない",
    ],
  },
  {
    question: "差し支えなければ、年代を教えてください。",
    follow_up_guide: "深掘りはやめて次の質問に行く。",
    quick_replies: ["29歳以下", "30〜49歳", "50〜69歳", "70歳以上", "回答しない"],
  },
  {
    question: "差し支えなければ、性別について教えてください。",
    follow_up_guide: "深掘りはやめて次の質問に行く。",
    quick_replies: ["女性", "男性", "その他", "回答しない"],
  },
  {
    question:
      "これまで松川村の村議会や村議会議員を身近に感じたのは、どのような場面でしたか。",
    follow_up_guide:
      "議会だよりや村の広報、議会中継・傍聴、地区の集まりや行事、選挙での接点。議員に直接相談したことがあるか。身近に感じない場合はその理由。",
    quick_replies: null,
  },
  {
    question:
      "いまの松川村議会について、課題だと感じることは何ですか。そう感じるきっかけや理由も教えてください。",
    follow_up_guide:
      "具体的な出来事や見聞きした例（差し支えない範囲で）。議会で何が話し合われているかの分かりやすさ。住民の声が届く仕組み。議員の顔ぶれ（年代・性別・立場の偏り）やなり手。選挙で選ぶ実感があるか。役場（行政）との関係。",
    quick_replies: null,
  },
  {
    question:
      "松川村の村議会や議員が、今後どのように変わると、村にとってより良くなると思いますか。",
    follow_up_guide:
      "優先して取り組んでほしい村の課題。住民との関わり方（意見交換会、オンライン、若い世代や移住者との接点）。変化を実感できる具体的な姿。期待を実現するうえでの心配。",
    quick_replies: null,
  },
  {
    question:
      "松川村の議員に、どのような役割や行動を期待しますか。また、安心して任せるために必要なことは何だと思いますか。",
    follow_up_guide:
      "取り組んでほしい政策や地域の課題。議会の中と外での活動。活動の報告や情報発信。他の議員や役場との協力。期待だけでなく心配や条件。",
    quick_replies: null,
  },
  {
    question:
      "ご自身が、これから村議会と関わるとしたら、どのような関わり方ならできそうですか。",
    follow_up_guide:
      "時間に余裕があるときだけ聞く。傍聴や中継を見る、意見を出す、地区の集まりで話す等。関わりにくい理由があればそれも聞く。立候補を勧めるような聞き方はしない。",
    quick_replies: null,
  },
];

async function main() {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("bills")
    .select("id")
    .eq("name", BILL_NAME)
    .maybeSingle();
  if (existing && process.argv.includes("--update-prompt")) {
    // 登録済みの設定の「話し方の注意事項」だけを最新の CAUTIONS に差し替える
    const { error } = await supabase
      .from("interview_configs")
      .update({ prompt_overrides: { targeted: { cautions: CAUTIONS } } })
      .eq("bill_id", existing.id);
    if (error) throw new Error(`指示の更新に失敗: ${error.message}`);
    console.log("✅ AIへの指示（話し方の注意事項）を更新しました");
    return;
  }
  if (existing) {
    throw new Error(
      `既に登録済みです（bill id: ${existing.id}）。作り直す場合は管理画面で削除してから実行してください。`
    );
  }

  const { data: bill, error: billError } = await supabase
    .from("bills")
    .insert({
      name: BILL_NAME,
      originating_house: "HR", // 必須項目のため形式上の値
      status: "preparing",
      status_note: "松川村議会への意見募集",
      publish_status: "published",
      published_at: new Date().toISOString(),
      is_featured: true,
      knowledge_source: KNOWLEDGE_SOURCE,
    })
    .select("id")
    .single();
  if (billError) throw new Error(`議案の登録に失敗: ${billError.message}`);

  const { error: contentError } = await supabase.from("bill_contents").insert(
    (["normal", "hard"] as const).map((difficulty_level) => ({
      bill_id: bill.id,
      difficulty_level,
      title: BILL_NAME,
      summary: BILL_SUMMARY,
      content: BILL_CONTENT,
    }))
  );
  if (contentError)
    throw new Error(`本文の登録に失敗: ${contentError.message}`);

  const { data: config, error: configError } = await supabase
    .from("interview_configs")
    .insert({
      bill_id: bill.id,
      name: "松川村議会 2026",
      status: "public",
      mode: "targeted",
      chat_model: "openai/gpt-5.6-terra",
      estimated_duration: 10,
      themes: [
        "村議会・議員との接点",
        "村議会の課題",
        "村議会・議員に望む変化",
        "議員への期待と信頼の条件",
      ],
      prompt_overrides: { targeted: { cautions: CAUTIONS } },
    })
    .select("id")
    .single();
  if (configError)
    throw new Error(`インタビュー設定の登録に失敗: ${configError.message}`);

  const { error: questionsError } = await supabase
    .from("interview_questions")
    .insert(
      QUESTIONS.map((q, i) => ({
        ...q,
        interview_config_id: config.id,
        question_order: i + 1,
      }))
    );
  if (questionsError)
    throw new Error(`質問の登録に失敗: ${questionsError.message}`);

  console.log("✅ 松川村議会AIインタビューを登録しました");
  console.log(`   議案ページ:     /bills/${bill.id}`);
  console.log(`   インタビュー:   /bills/${bill.id}/interview`);
}

main().catch((e) => {
  console.error("❌", e instanceof Error ? e.message : e);
  process.exit(1);
});
