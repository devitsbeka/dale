import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Simple event emitter for SSE
type Listener = (event: string, data: unknown) => void;
const listeners = new Map<string, Set<Listener>>();

export function emitToUser(userId: string, event: string, data: unknown) {
  const userListeners = listeners.get(userId);
  if (userListeners) {
    for (const listener of userListeners) {
      listener(event, data);
    }
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const listener: Listener = (event, data) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Register listener
      if (!listeners.has(userId)) {
        listeners.set(userId, new Set());
      }
      listeners.get(userId)!.add(listener);

      // Send heartbeat every 30s
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 30000);

      // Send initial connection event
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ userId })}\n\n`)
      );

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        listeners.get(userId)?.delete(listener);
        if (listeners.get(userId)?.size === 0) {
          listeners.delete(userId);
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
