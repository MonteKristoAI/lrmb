import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are a blog editor assistant for MonteKristo AI. You help improve blog posts for SEO, readability, and anti-AI detection.

RULES YOU ENFORCE:
- ZERO em dashes (U+2014) allowed. Replace with commas, colons, periods, or parentheses.
- ZERO banned words: delve, tapestry, nuanced, realm, landscape, multifaceted, pivotal, utilize, facilitate, elucidate, robust, seamless, cutting-edge, transformative, innovative, dynamic, agile, game-changer, revolutionize, crucial, moreover, furthermore, in conclusion, it's worth noting, it's important to note, dive deep, incredibly, extremely, absolutely, truly, significantly, groundbreaking, revolutionary, leverage, streamline, empower, harness, unpack, unravel
- No AI structural patterns: no symmetrical 3-item lists, no "In today's world", no "Let's dive in", no uniform paragraph lengths
- Readability: Flesch 60+, transition words in 30-50% of sentences, max 300 words between subheadings
- Every post needs 3+ external authority links, 3-5 internal links
- SEO title: 40-60 chars. Meta description: 140-160 chars.

WHEN SUGGESTING CHANGES, format them as:
REPLACE: \`exact old text here\`
WITH: \`exact new replacement text\`

This format allows the editor to apply find-and-replace directly. Always use the exact text from the post, not paraphrased versions.

Be specific. Be concise. Act like a senior editor, not a cheerful assistant.`;

export async function POST(request: Request) {
  try {
    const { postId, message, htmlBody, conversationHistory } = await request.json();

    if (!message) {
      return new Response("Message required", { status: 400 });
    }

    // Build messages array
    const messages: Anthropic.MessageParam[] = [
      ...(conversationHistory || []).map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      {
        role: "user",
        content: htmlBody
          ? `Here is the current blog post HTML (first 6000 chars):\n\n<post>\n${htmlBody.slice(0, 6000)}\n</post>\n\nMy request: ${message}`
          : message,
      },
    ];

    // Stream response
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-5-20251022",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages,
    });

    // Convert to ReadableStream for SSE
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const response = await stream.finalMessage();

          // Stream each content block
          for (const block of response.content) {
            if (block.type === "text") {
              // Send the full text as a single event
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "text", text: block.text })}\n\n`)
              );
            }
          }

          // Send usage stats
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "done",
                usage: {
                  input_tokens: response.usage.input_tokens,
                  output_tokens: response.usage.output_tokens,
                },
              })}\n\n`
            )
          );

          controller.close();
        } catch (err: any) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", error: err.message })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
