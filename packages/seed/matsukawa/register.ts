/**
 * 「松川村の住民と考える12の問い」をAIインタビューとして登録するスクリプト
 *
 * みらい議会はインタビューを「議案」にぶら下げる作りなので、問いごとに議案（＝地域の課題テーマ）を1件作り、
 * そこにインタビュー設定と質問を付ける。既存データは消さない（pnpm seed と違い clearAllData を呼ばない）。
 * 同じ名前のテーマが既にあれば、そのテーマは飛ばす。
 * 最初に作った「松川村議会の課題と、村議会議員への期待」は、下書きに戻して一覧から外す（データは残す）。
 *
 * 最初の登録だけに使う。登録したあとの文言の直しは、Notion で編集して sync-from-notion.ts で反映する。
 *
 * 実行: pnpm --filter @mirai-gikai/seed exec dotenv -e ../../.env -- tsx matsukawa/register.ts
 */
import { createAdminClient } from "../shared/helper";
import {
  CAUTIONS,
  CHAT_MODEL,
  contentOf,
  knowledgeSourceOf,
  type ThemeText,
} from "./theme-text";

const OLD_THEME_NAME = "松川村議会の課題と、村議会議員への期待";

type Question = {
  question: string;
  follow_up_guide: string | null;
  quick_replies?: string[] | null;
  target_audience?: string | null;
};

type Theme = ThemeText & {
  /** 問い（テーマ名） */
  title: string;
  /** 「〇〇について、『こうなってくれたら』」の〇〇 */
  topic: string;
  /** 1問目：テーマとの関わり */
  q1: Question;
  /** 3問目：中心の質問 */
  q3: Question;
  /** 4問目：立場を絞った質問 */
  q4: Question;
};

const THEMES: Theme[] = [
  {
    no: "①",
    field: "交通・移動",
    title: "車を使わなくても、安心して学校や病院、買い物に行けるか？",
    summary:
      "車を使わずに村の中を移動するとき、困っていることや助かっていることを聞かせてください。",
    clue: "中学生が、夜道の暗さや、無人駅で切符を買えなかった経験を村長に伝えました。",
    source: "広報まつかわ 2026年4月号 p.2",
    topic: "移動",
    q1: {
      question: "普段、どのような方法で出かけることが多いですか。",
      quick_replies: [
        "自分で車を運転する",
        "家族などに送ってもらう",
        "自転車・徒歩",
        "電車やバス",
        "その他",
      ],
      follow_up_guide:
        "運転しない・できない事情は、本人が話す範囲で聞く。深掘りは1往復まで。",
    },
    q3: {
      question:
        "車を使わずに出かけたとき、または出かけようとしたときに、困った場面を教えてください。",
      follow_up_guide:
        "行き先（学校・病院・買い物）、時間帯、何に困ったか（暗さ、本数、切符、荷物、天気）。場所は地名ではなく道の様子で聞く。",
    },
    q4: {
      question: "家族などの送り迎えで、負担に感じていることはありますか。",
      target_audience: "家族などの送り迎えをしている人",
      follow_up_guide:
        "頻度、時間帯、仕事との兼ね合い。送り迎えができなくなったらと考えることはあるか。",
    },
  },
  {
    no: "②",
    field: "産業振興・観光・雇用",
    title:
      "地元のお店や会社が商売を続け、ここで働きたい人が仕事を見つけられるには？",
    summary:
      "村で商売を続けること、村で働くことについて、感じていることを聞かせてください。",
    clue: "中学生から、すずむし荘とキャンプ場を一緒に紹介する提案がありました。",
    source: "広報まつかわ 2026年4月号 p.3",
    topic: "村で商売を続けることや、村で働くこと",
    q1: {
      question: "村での仕事や商売と、どのような関わりがありますか。",
      quick_replies: [
        "お店や会社を営んでいる",
        "村内のお店や会社で働いている",
        "村内で働きたい・仕事を探している",
        "観光などで関わっている",
        "その他",
      ],
      follow_up_guide:
        "業種や勤務先は聞かない。本人が話す範囲で、関わりの長さや形を聞く。深掘りは1往復まで。",
    },
    q3: {
      question:
        "村で商売を続けること、または村で働くことについて、難しさを感じている場面を教えてください。",
      follow_up_guide:
        "お客さんの数、人手、仕入れや費用、働き口の種類や条件。観光客の立ち寄り先として感じていることがあれば聞く。",
    },
    q4: {
      question: "商売を続けるうえで、いま気がかりになっていることはありますか。",
      target_audience: "お店や会社、観光の事業を営んでいる人",
      follow_up_guide:
        "後を継ぐ人、人手、設備、お客さんの変化。続けるための条件として何が大きいか。",
    },
  },
  {
    no: "③",
    field: "農業振興",
    title: "地元の田んぼや畑で、これからも米や野菜を作り続けていくには？",
    summary:
      "田んぼや畑で作り続けるうえでの負担や工夫を聞かせてください。",
    clue: "農業委員会が、機械の共同購入・貸し出しや、資材高への支援を要望しています。",
    source: "広報まつかわ 2026年7月号 p.21",
    topic: "田んぼや畑で作り続けること",
    q1: {
      question: "田んぼや畑とは、どのような関わりがありますか。",
      quick_replies: [
        "主な仕事として米や野菜を作っている",
        "家の田畑で作っている",
        "新しく農業を始めた・始めたい",
        "農業はしていない",
        "その他",
      ],
      follow_up_guide:
        "作付面積や場所は聞かない。本人が話す範囲で、作っているものや続けてきた年数を聞く。深掘りは1往復まで。",
    },
    q3: {
      question:
        "来年も作り続けるうえで、重いと感じている負担を教えてください。",
      follow_up_guide:
        "機械、資材の値上がり、人手、体力、天候、販売先。どの負担から先に軽くなると続けやすいか。",
    },
    q4: {
      question:
        "農業を始めるとき、または始めてから、つまずいたことはありますか。",
      target_audience: "新しく農業を始めた人、これから始めたい人",
      follow_up_guide:
        "農地や機械の確保、教わる相手、地域とのつながり、収入の見通し。",
    },
  },
  {
    no: "④",
    field: "防災・暮らしの安全",
    title: "大雨や地震のとき、近所で誰に声をかけ、どう避難するか？",
    summary:
      "大雨や地震のときの避難の道のりや、近所での声のかけ合いについて聞かせてください。",
    clue: "各地区で、避難訓練や防災学習が行われました。",
    source: "広報まつかわ 2026年8月号 pp.2–3、9月号 p.7",
    topic: "災害のときの避難や助け合い",
    q1: {
      question:
        "大雨や地震に備えて、普段から何か準備したり、話し合ったりしていることはありますか。",
      quick_replies: [
        "地区の防災の役をしている",
        "家族で決めていることがある",
        "避難訓練に参加したことがある",
        "特にしていない",
        "その他",
      ],
      follow_up_guide: "深掘りは1往復まで。",
    },
    q3: {
      question:
        "大雨や地震のとき、家から避難先までの道のりで、不安に感じていることを教えてください。",
      follow_up_guide:
        "道の様子（川沿い、坂、暗さ）、時間帯、移動の手段、情報の受け取り方。場所は地名ではなく様子で聞く。",
    },
    q4: {
      question:
        "避難のときに手助けが必要になったら、連絡を取り合える人や方法はありますか。",
      target_audience:
        "一人で避難するのが難しい人、またはそうした家族がいる人",
      follow_up_guide:
        "相手の名前や関係の詳細は聞かない。決まっているか、決まっていなくて不安か、どんな形なら頼みやすいか。",
    },
    extraNote:
      "このテーマは、手助けが必要な人や家族の事情に触れやすい。体の状態や家族構成をこちらから尋ねず、回答者が話した範囲だけで聞くこと。",
  },
  {
    no: "⑤",
    field: "子育て支援・教育",
    title:
      "子どもが急に熱を出した朝や、放課後、夏休み。親子が頼れる人や場所はあるか？",
    summary:
      "子どもが急に熱を出した朝や、放課後・夏休みに、頼れる人や場所について聞かせてください。",
    clue: "病児・病後児保育や「こどもカフェ」が紹介されています。",
    source: "広報まつかわ 2026年2月号 p.4、10月号 p.14",
    topic: "子育て",
    q1: {
      question: "このテーマとは、どのような関わりがありますか。",
      quick_replies: [
        "子ども・学生として",
        "子どもを育てている",
        "保育や放課後の活動に関わっている",
        "身近な子どもを見守っている",
        "その他",
      ],
      follow_up_guide:
        "子どもの人数・年齢・学校名は聞かない。深掘りは1往復まで。",
    },
    q3: {
      question:
        "急に熱を出した朝や、放課後、夏休みに、困ったことや助かったことがあった場面を教えてください。",
      follow_up_guide:
        "回答者が子どもでも大人でも同じように聞く。急な預け先、仕事や学校との兼ね合い、頼れる人や場所。病児・病後児保育などを使ったことがあれば、使ってみてどうだったか。",
    },
    q4: {
      question: "学校が終わったあと、どこで、誰と過ごしたいですか。",
      target_audience: "小学生・中学生・高校生などの子ども・学生",
      follow_up_guide:
        "過ごしたい場所、一緒にいたい人、いまはそれができているか。できていないなら何が足りないか。",
    },
  },
  {
    no: "⑥",
    field: "健康・医療・福祉",
    title:
      "年を重ねても、病気や障がいがあっても、必要なときに助けを借りて、住み慣れた家や地域で暮らし続けられるか？",
    summary:
      "外出や通院が難しい日に、相談できる人や場所があるかを聞かせてください。",
    clue: "地区の公民館で開く「晴ればれ教室」が、人と会う機会になっています。",
    source: "広報まつかわ 2025年12月号 表紙、2026年8月号 p.11",
    topic: "住み慣れた地域で暮らし続けること",
    q1: {
      question: "このテーマとは、どのような関わりがありますか。",
      quick_replies: [
        "自分自身のこととして考えている",
        "家族を介護・支援している",
        "医療や福祉の仕事をしている",
        "今は関わりはないが気になっている",
        "回答しない",
      ],
      follow_up_guide:
        "病名や障がいの内容、介護の詳細は聞かない。深掘りしない。",
    },
    q3: {
      question:
        "外出や通院が難しい日に、相談したり頼ったりできる人や場所はありますか。",
      follow_up_guide:
        "人と会う機会（地区の集まりや教室など）、通院の手段、相談先が見つからなかった経験。",
    },
    q4: {
      question: "支える側として、いま負担に感じていることはありますか。",
      target_audience:
        "家族を介護・支援している人、医療や福祉の仕事をしている人",
      follow_up_guide:
        "時間、体力、相談相手、仕事との両立。支える人を支える仕組みとして何があるとよいか。",
    },
    extraNote:
      "このテーマは、病気・障がい・介護の事情に触れやすい。病名や体の状態、家族構成をこちらから尋ねず、回答者が話した範囲だけで聞くこと。",
  },
  {
    no: "⑦",
    field: "担い手・後継者不足",
    title:
      "店や農地、地域の役目を「そろそろ誰かに引き継ぎたい」と思ったとき、どうすれば次の人に渡せるか？",
    summary:
      "店や農地、地域の役目を次の人に引き継ぐことについて、渡す側・受け取る側の経験を聞かせてください。",
    clue: "農業委員会は担い手の確保を求め、正調安曇節保存会も後継者育成を課題に挙げています。",
    source: "広報まつかわ 2026年7月号 p.21、10月号 p.17",
    topic: "引き継ぐこと",
    q1: {
      question: "引き継ぐことについて、どのような立場にありますか。",
      quick_replies: [
        "店や仕事を引き継ぎたい・引き継いだ",
        "農地を引き継ぎたい・引き継いだ",
        "地区や団体の役目を担っている",
        "引き継ぐ側になることに関心がある",
        "その他",
      ],
      follow_up_guide:
        "店名や団体名は聞かない。渡す側か受け取る側かを本人の言葉で聞く。深掘りは1往復まで。",
    },
    q3: {
      question:
        "引き継ぐこと、または引き継ぐ人を探すことで、難しさを感じた場面を教えてください。",
      follow_up_guide:
        "相手の見つけ方、条件の折り合い、気持ちの面、手続き。引き継ぐ前に一緒に働いたり教わったりする時間があったか。",
    },
    q4: {
      question:
        "引き継ぐ前に、一緒に働いたり教わったりする時間は持てそうですか。",
      target_audience: "これから何かを引き継ぐことに関心がある人",
      follow_up_guide:
        "持てそうか、持てないならどんな事情か。どんな形なら始めやすいか。",
    },
  },
  {
    no: "⑧",
    field: "デジタル活用・AI活用",
    title:
      "役場の手続き、地区のお知らせ、仕事の書類づくり。スマホやAIでどんな手間を減らせるか？",
    summary:
      "手続きや書類づくりで、時間や手間がかかっていることを聞かせてください。",
    clue: "広報には、子育てアプリや子育て情報サイトの実例が載っています。",
    source: "広報まつかわ 2026年4月号 p.22、6月号 p.7",
    topic: "手続きや書類づくりの手間",
    q1: {
      question: "スマホは、普段どのくらい使いますか。",
      quick_replies: [
        "よく使う",
        "使うが、苦手なこともある",
        "ほとんど使わない",
        "仕事や地区の役で書類をよく扱う",
        "その他",
      ],
      follow_up_guide: "深掘りは1往復まで。",
    },
    q3: {
      question:
        "役場の手続き、地区のお知らせ、仕事の書類づくりなどで、時間や手間がかかっていると感じることを教えてください。",
      follow_up_guide:
        "どの作業に、どのくらい時間を使っているか。紙と窓口で困ること、スマホで困ること。AIやスマホに寄せた答えに誘導しない。",
    },
    q4: {
      question:
        "手続きやお知らせがスマホ中心になると、困ることはありますか。",
      target_audience: "スマホが使いづらい人、ほとんど使わない人",
      follow_up_guide: "どんな場面で困るか。どんな手助けや代わりの方法があれば安心か。",
    },
    extraNote:
      "回答者はAIの聞き手と話しているので、AIやスマホを良いものとして話を進めないこと。紙や窓口のよさを話す人の声も同じ重さで聞く。",
  },
  {
    no: "⑨",
    field: "インフラ・公共施設",
    title:
      "水道・下水道や公民館など、暮らしを支える設備や建物を、これからどう維持していくか？",
    summary:
      "水道・下水道や公民館などについて、「使えなくなると困る」「ここを直してほしい」と感じていることを聞かせてください。",
    clue: "下水道の修繕費や、公共施設の使用料が取り上げられました。",
    source: "広報まつかわ 2025年11月号 pp.2–3、2026年2月号 p.2",
    topic: "暮らしを支える設備や建物",
    q1: {
      question: "暮らしを支える設備や建物とは、どのような関わりがありますか。",
      quick_replies: [
        "公民館などの施設をよく使う",
        "店や事業で設備を使っている",
        "設備や建物の修繕に関わっている",
        "特に意識したことはない",
        "その他",
      ],
      follow_up_guide: "施設名は本人が話す範囲で。深掘りは1往復まで。",
    },
    q3: {
      question:
        "水道・下水道や公民館などで、「使えなくなると困る」「ここを直してほしい」と感じたことはありますか。",
      follow_up_guide:
        "どんな場面で困ったか、どのくらい困るか。直す順番を考えるとしたら、どれを先にしたいか。",
    },
    q4: {
      question:
        "施設を使うとき、使用料や使い勝手で感じていることはありますか。",
      target_audience: "公民館などの施設を使っている人や団体",
      follow_up_guide:
        "使用料、予約、設備の古さ、使える時間。続けて使うための条件。",
    },
  },
  {
    no: "⑩",
    field: "定住・住まい・地域コミュニティ",
    title:
      "引っ越してきた人も、前から暮らす人も、近所につながりができて「ここに住み続けたい」と思えるには？",
    summary:
      "住まいを探した経験や、近所とつながりができたときのことを聞かせてください。",
    clue: "村には、子育て世代を含む若い世代の転入が多くあります。",
    source: "広報まつかわ 2026年5月号 pp.4–5",
    topic: "住み続けること",
    q1: {
      question: "松川村に住むようになって、どのくらいになりますか。",
      quick_replies: [
        "5年以内に転入した",
        "5年より前に転入した",
        "生まれ育ちが松川村",
        "村内で住まいを探している",
        "村外に住んでいる",
      ],
      follow_up_guide: "転入前の住所や地区名は聞かない。深掘りは1往復まで。",
    },
    q3: {
      question:
        "近所の人とつながりができたきっかけや、最初に声をかけ合ったときのことを教えてください。",
      follow_up_guide:
        "新しく来た人と迎えた人の両方の立場で。声をかけにくかった経験、つながりがなくて困った経験も聞く。",
    },
    q4: {
      question: "村で住まいを探したとき、困ったことはありましたか。",
      target_audience: "最近転入した人、村内で住まいを探した・探している人",
      follow_up_guide: "物件の見つけ方、条件、情報の手に入れ方、相談先。",
    },
  },
  {
    no: "⑪",
    field: "文化・伝統の継承",
    title: "地域で大切にしてきた伝統を、これからの世代にどう手渡すか？",
    summary:
      "祭りや日々の暮らしの中で教わってきたこと、伝えたいことを聞かせてください。",
    clue: "創唱100周年を迎えた正調安曇節の保存会が、次の世代への継承を呼びかけています。",
    source: "広報まつかわ 2026年10月号 p.17",
    topic: "伝統を手渡すこと",
    q1: {
      question: "地域の伝統や祭りとは、どのような関わりがありますか。",
      quick_replies: [
        "保存会や伝統行事に関わっている",
        "祭りに参加している",
        "これから習ってみたい",
        "見たり聞いたりするのが好き",
        "その他",
      ],
      follow_up_guide: "団体名や役職は聞かない。深掘りは1往復まで。",
    },
    q3: {
      question:
        "祭りや日々の暮らしの中で、教わってきたことや、受け継いできたことを教えてください。",
      follow_up_guide:
        "誰から、どんな場で教わったか（名前は聞かない）。どんな形で次の世代に伝えたいか。",
    },
    q4: {
      question:
        "習ってみたいと思ったきっかけや、始めにくいと感じることはありますか。",
      target_audience: "これから伝統を習ってみたい人",
      follow_up_guide: "知る機会、時間、教わる場、気軽さ。",
    },
  },
  {
    no: "⑫",
    field: "物価高への対応",
    title:
      "食料品や光熱費、入学準備にかかるお金。値上がりで何にいちばん困り、どんな支援が実際に助かるか？",
    summary:
      "値上がりで困っていることや、実際に助かった支援について聞かせてください。",
    clue: "村は「くらしの応援券」と「進学等準備応援券」を配布しました。",
    source: "広報まつかわ 2026年11月号 p.7",
    topic: "値上がりへの対応",
    q1: {
      question: "暮らしの中で、値上がりをどのように感じていますか。",
      quick_replies: [
        "日々の買い物で強く感じる",
        "入学や進学の準備で感じる",
        "店や商売の側で感じる",
        "それほど感じていない",
        "その他",
      ],
      follow_up_guide: "収入や家計の金額は聞かない。深掘りは1往復まで。",
    },
    q3: {
      question:
        "食料品や光熱費、入学準備など、値上がりで困っていることを教えてください。",
      follow_up_guide:
        "何の値上がりが重いか、暮らしの中でどう工夫しているか。金額は聞かない。",
    },
    q4: {
      question: "応援券は、何を買うときに助かりましたか。",
      target_audience: "応援券を使った人、応援券を扱う店の人",
      follow_up_guide:
        "使ってみてどうだったか。使った後も残った負担は何か。村の施策の良し悪しを評価させる聞き方はしない。",
    },
    extraNote:
      "このテーマは村の施策の評価になりやすい。施策を褒めたり批判したりする方向に誘導せず、暮らしの中の具体的な場面を聞くこと。",
  },
];

/** 2問目：年代（全テーマ共通、任意） */
const Q_AGE: Question = {
  question: "差し支えなければ、年代を教えてください。",
  quick_replies: [
    "18歳未満",
    "18〜29歳",
    "30〜49歳",
    "50〜69歳",
    "70歳以上",
    "回答しない",
  ],
  follow_up_guide: "深掘りはやめて次の質問に行く。",
};

/** 6問目：自分や近所、地区でできること（全テーマ共通） */
const Q_OURSELVES: Question = {
  question:
    "このことで、自分や近所、地区のなかでできそうだと思うことはありますか。",
  follow_up_guide:
    "すでにやっていること、やってみたいけれど難しいこと。難しい理由も聞く。",
};

/** 7問目：村全体で決めることと、その話し合いへの関わり方（全テーマ共通） */
const Q_DECIDE: Question = {
  question:
    "村全体で話し合って決めたほうがいいと思うことは何ですか。そのとき、どんな形なら話し合いに加わってみたいですか。",
  follow_up_guide:
    "2つの問いを1つずつ聞く。加わり方は、集まる場、時間帯、オンライン、地区の集まりなど。加わりにくい理由があればそれも聞く。",
};

function questionsOf(theme: Theme): Question[] {
  return [
    theme.q1,
    Q_AGE,
    theme.q3,
    theme.q4,
    {
      question: `${theme.topic}について、「こうなってくれたら」と思うことはありますか。`,
      follow_up_guide:
        "具体的にどんな姿か。そうなるために気がかりなこと（費用、担い手など）も聞く。",
    },
    Q_OURSELVES,
    Q_DECIDE,
  ];
}

async function main() {
  const supabase = createAdminClient();

  // 最初に作ったテーマは下書きに戻し、インタビューも受付終了にする（データは残す）
  const { data: oldTheme } = await supabase
    .from("bills")
    .select("id")
    .eq("name", OLD_THEME_NAME)
    .maybeSingle();
  if (oldTheme) {
    await supabase
      .from("bills")
      .update({ publish_status: "draft", is_featured: false })
      .eq("id", oldTheme.id);
    await supabase
      .from("interview_configs")
      .update({ status: "closed" })
      .eq("bill_id", oldTheme.id);
    console.log(`📦 「${OLD_THEME_NAME}」を下書きに戻しました`);
  }

  // ①が一覧の先頭に来るよう、日付を1分ずつずらす（一覧は新しい順）
  const base = Date.now();

  for (const [index, theme] of THEMES.entries()) {
    const { data: existing } = await supabase
      .from("bills")
      .select("id")
      .eq("name", theme.title)
      .maybeSingle();

    if (existing) {
      console.log(`⏭️  ${theme.no} は登録済みのため飛ばします`);
      continue;
    }

    const { data: bill, error } = await supabase
      .from("bills")
      .insert({
        name: theme.title,
        originating_house: "HR", // 必須項目のため形式上の値（画面には出さない）
        status: "preparing",
        publish_status: "published",
        published_at: new Date().toISOString(),
        submitted_date: new Date(base - index * 60_000).toISOString(),
        is_featured: false,
        knowledge_source: knowledgeSourceOf(theme),
      })
      .select("id")
      .single();
    if (error) throw new Error(`${theme.no} の登録に失敗: ${error.message}`);
    const billId = bill.id;

    const { error: contentError } = await supabase.from("bill_contents").insert(
      (["normal", "hard"] as const).map((difficulty_level) => ({
        bill_id: billId,
        difficulty_level,
        title: theme.title,
        summary: theme.summary,
        content: contentOf(theme),
      }))
    );
    if (contentError)
      throw new Error(`${theme.no} の本文の登録に失敗: ${contentError.message}`);

    const { data: config, error: configError } = await supabase
      .from("interview_configs")
      .insert({
        bill_id: billId,
        name: `${theme.no} ${theme.field}`,
        status: "public",
        mode: "targeted",
        chat_model: CHAT_MODEL,
        estimated_duration: 10,
        themes: [theme.field],
        prompt_overrides: { targeted: { cautions: CAUTIONS } },
      })
      .select("id")
      .single();
    if (configError)
      throw new Error(`${theme.no} の設定の登録に失敗: ${configError.message}`);

    const { error: questionsError } = await supabase
      .from("interview_questions")
      .insert(
        questionsOf(theme).map((q, i) => ({
          interview_config_id: config.id,
          question: q.question,
          follow_up_guide: q.follow_up_guide,
          quick_replies: q.quick_replies ?? null,
          target_audience: q.target_audience ?? null,
          question_order: i + 1,
        }))
      );
    if (questionsError)
      throw new Error(`${theme.no} の質問の登録に失敗: ${questionsError.message}`);

    console.log(`✅ ${theme.no} ${theme.field}`);
  }

  console.log("完了しました");
}

main().catch((e) => {
  console.error("❌", e instanceof Error ? e.message : e);
  process.exit(1);
});
