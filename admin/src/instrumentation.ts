export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (!process.env.ANTHROPIC_API_KEY || process.env.AI_GATEWAY_API_KEY) return;

  const { enableClaudeAsDefaultProvider } = await import(
    "@/lib/ai/claude-provider"
  );
  enableClaudeAsDefaultProvider();
}
