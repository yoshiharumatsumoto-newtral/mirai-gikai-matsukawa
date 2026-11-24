import { createAnthropic } from "@ai-sdk/anthropic";

/**
 * Vercel AI Gateway を使わず、Claude API を直接呼ぶための既定プロバイダー。
 *
 * コード中のモデルIDは "openai/gpt-5.2" のような AI Gateway 形式の文字列なので、
 * どのIDが来ても CLAUDE_MODEL（既定 claude-opus-5-5）に差し替えて Claude API に送る。
 * ANTHROPIC_API_KEY があり AI_GATEWAY_API_KEY が無いときだけ instrumentation.ts から有効にする。
 */
export function enableClaudeAsDefaultProvider() {
  const anthropic = createAnthropic();
  const model = process.env.CLAUDE_MODEL || "claude-opus-5-5";

  globalThis.AI_SDK_DEFAULT_PROVIDER = {
    specificationVersion: "v3",
    languageModel: () => anthropic.languageModel(model),
    embeddingModel: (id) => anthropic.embeddingModel(id),
    imageModel: (id) => anthropic.imageModel(id),
  };

  console.log(`[AI] Claude API を直接使用します（モデル: ${model}）`);
}
