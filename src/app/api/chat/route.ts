import { NextRequest } from "next/server";
import { anthropic, AI_MODEL, SYSTEM_PROMPTS } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { getAgent } from "@/lib/agents";
import { buildAgentContext } from "@/lib/agent-context";
import { getToolsForAgent, executeTool } from "@/lib/agent-tools";
import type Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!anthropic) {
    return new Response("AI service not configured", { status: 503 });
  }

  const { messages, role = "career_advisor", agentId } = await request.json();
  const userId = session.user.id!;

  // Build system prompt — enriched with user context for agents
  let systemPrompt: string;
  let tools: Anthropic.Tool[] = [];

  if (agentId) {
    const agent = getAgent(agentId);
    if (agent) {
      // Fetch user context from DB and inject into system prompt
      systemPrompt = await buildAgentContext(userId, agent);
      tools = getToolsForAgent(agentId);
    } else {
      systemPrompt = SYSTEM_PROMPTS.career_advisor;
    }
  } else {
    systemPrompt = SYSTEM_PROMPTS[role as keyof typeof SYSTEM_PROMPTS] ?? SYSTEM_PROMPTS.career_advisor;
  }

  const apiMessages: Anthropic.MessageParam[] = messages.map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        await runAgentLoop(controller, encoder, systemPrompt, apiMessages, tools, userId);
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`)
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

/**
 * Agentic loop: sends messages to Claude, handles tool_use responses,
 * executes tools, feeds results back, and streams the final text response.
 * Max 5 tool rounds to prevent infinite loops.
 */
async function runAgentLoop(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  systemPrompt: string,
  messages: Anthropic.MessageParam[],
  tools: Anthropic.Tool[],
  userId: string,
) {
  const MAX_TOOL_ROUNDS = 5;
  let currentMessages = [...messages];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const requestParams: Anthropic.MessageCreateParams = {
      model: AI_MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: currentMessages,
    };

    // Only include tools if we have them
    if (tools.length > 0) {
      requestParams.tools = tools;
    }

    // If this might be the last round or no tools, stream text directly
    // Otherwise, use non-streaming to handle tool calls efficiently
    if (tools.length === 0 || round === MAX_TOOL_ROUNDS - 1) {
      // Final round — stream text to client
      const stream = anthropic!.messages.stream(requestParams);
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
          );
        }
      }
      return;
    }

    // Non-streaming call to check for tool use
    const response = await anthropic!.messages.create(requestParams);

    // Check if the response contains tool use
    const toolUseBlocks = response.content.filter(
      (block): block is Anthropic.ContentBlock & { type: "tool_use" } => block.type === "tool_use"
    );

    if (toolUseBlocks.length === 0) {
      // No tool calls — stream any text content to client
      for (const block of response.content) {
        if (block.type === "text" && block.text) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: block.text })}\n\n`)
          );
        }
      }
      return;
    }

    // Stream any text that came before tool calls (thinking out loud)
    for (const block of response.content) {
      if (block.type === "text" && block.text) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text: block.text })}\n\n`)
        );
      }
    }

    // Execute all tool calls in parallel
    const toolResults = await Promise.all(
      toolUseBlocks.map(async (toolBlock) => {
        const result = await executeTool(
          toolBlock.name,
          toolBlock.input as Record<string, unknown>,
          userId,
        );
        return {
          type: "tool_result" as const,
          tool_use_id: toolBlock.id,
          content: result,
        };
      })
    );

    // Add assistant response + tool results to conversation
    currentMessages = [
      ...currentMessages,
      { role: "assistant" as const, content: response.content },
      { role: "user" as const, content: toolResults },
    ];

    // Continue loop — Claude will process tool results and either call more tools or respond
  }

  // If we exhausted all rounds, do one final streaming call without tools
  const finalStream = anthropic!.messages.stream({
    model: AI_MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: currentMessages,
  });

  for await (const event of finalStream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
      );
    }
  }
}
