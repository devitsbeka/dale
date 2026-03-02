import { NextRequest } from "next/server";
import { anthropic, AI_MODEL, SYSTEM_PROMPTS } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { getAgent } from "@/lib/agents";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!anthropic) {
    return new Response("AI service not configured", { status: 503 });
  }

  const { messages, role = "career_advisor", agentId } = await request.json();

  // Use agent system prompt if agentId provided, otherwise fall back to role-based prompts
  let systemPrompt: string;
  if (agentId) {
    const agent = getAgent(agentId);
    systemPrompt = agent?.systemPrompt ?? SYSTEM_PROMPTS.career_advisor;
  } else {
    systemPrompt = SYSTEM_PROMPTS[role as keyof typeof SYSTEM_PROMPTS] ?? SYSTEM_PROMPTS.career_advisor;
  }

  // Stream the response
  const stream = anthropic.messages.stream({
    model: AI_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
          )
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
}
