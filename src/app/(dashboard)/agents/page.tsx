"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { AGENTS, type AgentDef } from "@/lib/agents";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentDef | null>(null);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedAgent]);

  const currentMessages = selectedAgent ? (conversations[selectedAgent.id] ?? []) : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || streaming || !selectedAgent) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...currentMessages, userMessage];
    setConversations({ ...conversations, [selectedAgent.id]: newMessages });
    setInput("");
    setStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, agentId: selectedAgent.id }),
      });

      if (!response.ok) {
        setConversations({
          ...conversations,
          [selectedAgent.id]: [...newMessages, { role: "assistant", content: "Sorry, I'm unable to respond right now." }],
        });
        setStreaming(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      let assistantContent = "";
      setConversations({
        ...conversations,
        [selectedAgent.id]: [...newMessages, { role: "assistant", content: "" }],
      });

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
                setConversations((prev) => ({
                  ...prev,
                  [selectedAgent.id]: [
                    ...newMessages,
                    { role: "assistant", content: assistantContent },
                  ],
                }));
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch {
      setConversations({
        ...conversations,
        [selectedAgent.id]: [...newMessages, { role: "assistant", content: "Connection error. Please try again." }],
      });
    }

    setStreaming(false);
  }

  if (selectedAgent) {
    return (
      <div className="mx-auto flex h-[calc(100vh-64px)] max-w-4xl flex-col px-4 py-4">
        {/* Agent header */}
        <div className="flex items-center gap-3 border-b border-secondary pb-4">
          <button
            onClick={() => setSelectedAgent(null)}
            className="flex size-8 items-center justify-center rounded-lg hover:bg-secondary"
          >
            <ArrowLeft className="size-4 text-fg-quaternary" />
          </button>
          <span className="text-2xl">{selectedAgent.emoji}</span>
          <div>
            <p className="text-md font-semibold text-primary">{selectedAgent.name}</p>
            <p className="text-xs text-tertiary">{selectedAgent.role}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4">
          {currentMessages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="text-5xl">{selectedAgent.emoji}</span>
              <p className="mt-3 text-md font-semibold text-primary">
                I&apos;m {selectedAgent.name}, your {selectedAgent.role}
              </p>
              <p className="mt-1 text-sm text-tertiary">{selectedAgent.description}</p>
              <div className="mt-4 flex flex-col gap-2">
                {selectedAgent.suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="rounded-lg bg-secondary px-4 py-2 text-sm text-tertiary hover:bg-tertiary hover:text-secondary"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentMessages.map((m, i) => (
            <div
              key={i}
              className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "bg-brand-solid text-white"
                    : "bg-secondary text-primary"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}

          {streaming && currentMessages[currentMessages.length - 1]?.content === "" && (
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
        <form onSubmit={handleSubmit} className="border-t border-secondary pt-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${selectedAgent.name}...`}
              className="flex-1 rounded-lg bg-secondary px-4 py-3 text-sm text-primary outline-none placeholder:text-placeholder"
              disabled={streaming}
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="flex size-10 items-center justify-center rounded-lg bg-brand-solid text-white disabled:opacity-50"
            >
              <Send01 className="size-4" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">OpenClaw Agents</h1>
        <p className="text-md text-tertiary">
          Your team of 8 AI-powered career specialists
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {AGENTS.map((agent) => {
          const msgCount = conversations[agent.id]?.length ?? 0;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className="group flex flex-col gap-3 rounded-xl bg-primary p-5 text-left shadow-xs ring-1 ring-secondary transition hover:shadow-md hover:ring-brand-solid/30"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{agent.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-md font-semibold text-primary group-hover:text-brand-secondary">
                      {agent.name}
                    </p>
                    {msgCount > 0 && (
                      <Badge color="brand" size="sm">{msgCount} msgs</Badge>
                    )}
                  </div>
                  <p className="text-sm text-tertiary">{agent.role}</p>
                </div>
              </div>
              <p className="text-sm text-secondary">{agent.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {agent.capabilities.map((cap) => (
                  <Badge key={cap} color="gray" size="sm">{cap}</Badge>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
