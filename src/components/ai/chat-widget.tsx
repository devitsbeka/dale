"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSmileSquare, Send01, X } from "@untitledui/icons";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || streaming) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        setMessages([...newMessages, { role: "assistant", content: "Sorry, I'm unable to respond right now. Please try again later." }]);
        setStreaming(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      let assistantContent = "";
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantContent += parsed.text;
                setMessages([
                  ...newMessages,
                  { role: "assistant", content: assistantContent },
                ]);
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }]);
    }

    setStreaming(false);
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-6 bottom-6 z-50 flex size-12 items-center justify-center rounded-full bg-brand-solid text-white shadow-lg hover:bg-brand-solid_hover"
      >
        {open ? <X className="size-5" /> : <MessageSmileSquare className="size-5" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed right-6 bottom-20 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl bg-primary shadow-2xl ring-1 ring-secondary">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-secondary px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-brand-solid text-white text-sm font-bold">
              P
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Planeta AI</p>
              <p className="text-xs text-tertiary">Career advisor</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-secondary">How can I help with your career?</p>
                <div className="mt-3 flex flex-col gap-2">
                  {["What skills should I learn?", "Help me negotiate my salary", "Review my career path"].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                      }}
                      className="rounded-lg bg-secondary px-3 py-2 text-xs text-tertiary hover:bg-tertiary hover:text-secondary"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-brand-solid text-white"
                      : "bg-secondary text-primary"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}

            {streaming && messages[messages.length - 1]?.content === "" && (
              <div className="mb-3 flex justify-start">
                <div className="flex gap-1 rounded-2xl bg-secondary px-4 py-3">
                  <div className="size-2 animate-bounce rounded-full bg-quaternary" style={{ animationDelay: "0ms" }} />
                  <div className="size-2 animate-bounce rounded-full bg-quaternary" style={{ animationDelay: "150ms" }} />
                  <div className="size-2 animate-bounce rounded-full bg-quaternary" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-secondary px-3 py-2.5">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your career..."
                className="flex-1 rounded-lg bg-secondary px-3 py-2 text-sm text-primary outline-none placeholder:text-placeholder"
                disabled={streaming}
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                className="flex size-8 items-center justify-center rounded-lg bg-brand-solid text-white disabled:opacity-50"
              >
                <Send01 className="size-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
