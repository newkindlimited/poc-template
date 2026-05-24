import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const MODELS = {
  default: "claude-sonnet-4-5",
  reasoning: "claude-opus-4-5",
} as const;

/**
 * Extract structured data from free-text content using a JSON schema.
 * Returns parsed JSON matching the schema description.
 */
export async function extract<T>(opts: {
  prompt: string;
  schema: string;
  content: string;
  model?: string;
}): Promise<{ value: T; tokensIn: number; tokensOut: number }> {
  const res = await anthropic.messages.create({
    model: opts.model ?? MODELS.default,
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content:
          opts.prompt +
          "\n\nContent:\n" +
          opts.content +
          "\n\nReturn ONLY valid JSON inside a ```json fence, matching this schema:\n" +
          opts.schema,
      },
    ],
  });
  const text = res.content[0].type === "text" ? res.content[0].text : "";
  const m = text.match(/```json\s*([\s\S]*?)\s*```/);
  const json = m?.[1] ?? text;
  return {
    value: JSON.parse(json) as T,
    tokensIn: res.usage.input_tokens,
    tokensOut: res.usage.output_tokens,
  };
}

/**
 * Classify content into one of the provided labels.
 */
export async function classify(opts: {
  content: string;
  labels: string[];
  model?: string;
}): Promise<{ label: string; confidence: "low" | "medium" | "high"; reasoning: string }> {
  const { value } = await extract<{ label: string; confidence: "low" | "medium" | "high"; reasoning: string }>({
    prompt: "Classify the following content into exactly one of the provided labels.",
    schema: `{ "label": "one of ${opts.labels.join(" | ")}", "confidence": "low | medium | high", "reasoning": "one sentence" }`,
    content: opts.content + "\n\nLabels: " + opts.labels.join(", "),
    model: opts.model,
  });
  return value;
}

/**
 * Free-form chat — useful for the "propose" step of propose-review-approve.
 */
export async function chat(opts: {
  system?: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  model?: string;
  maxTokens?: number;
}): Promise<{ content: string; tokensIn: number; tokensOut: number }> {
  const res = await anthropic.messages.create({
    model: opts.model ?? MODELS.default,
    max_tokens: opts.maxTokens ?? 2048,
    ...(opts.system ? { system: opts.system } : {}),
    messages: opts.messages,
  });
  return {
    content: res.content[0].type === "text" ? res.content[0].text : "",
    tokensIn: res.usage.input_tokens,
    tokensOut: res.usage.output_tokens,
  };
}

/**
 * Propose: given context, return Claude's suggested action/output for
 * human review. The output should be reviewable + editable by the human
 * before it ships. See <ReviewGate /> component.
 */
export async function propose<T>(opts: {
  task: string;
  context: string;
  schema: string;
  model?: string;
}): Promise<{ proposal: T; tokensIn: number; tokensOut: number }> {
  const r = await extract<T>({
    prompt:
      "You are proposing an output for human review under the propose-review-approve pattern. " +
      "Make your best suggestion based on the context. The human will edit before approving.\n\nTask: " +
      opts.task,
    schema: opts.schema,
    content: opts.context,
    model: opts.model,
  });
  return { proposal: r.value, tokensIn: r.tokensIn, tokensOut: r.tokensOut };
}
