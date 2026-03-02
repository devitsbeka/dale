"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Badge } from "@/components/base/badges/badges";

interface TreeNode {
  id: string;
  name: string;
  tier: number; // 0 = root, 1-4 = deeper
  x: number;
  y: number;
  prerequisites: string[];
  unlocked: boolean;
  category: string;
}

const TREE_NODES: TreeNode[] = [
  // Tier 0 — Foundations
  { id: "html", name: "HTML/CSS", tier: 0, x: 400, y: 60, prerequisites: [], unlocked: true, category: "Frontend" },
  { id: "js", name: "JavaScript", tier: 0, x: 400, y: 140, prerequisites: ["html"], unlocked: true, category: "Frontend" },

  // Tier 1 — Core
  { id: "ts", name: "TypeScript", tier: 1, x: 300, y: 220, prerequisites: ["js"], unlocked: true, category: "Frontend" },
  { id: "react", name: "React", tier: 1, x: 500, y: 220, prerequisites: ["js"], unlocked: true, category: "Frontend" },
  { id: "node", name: "Node.js", tier: 1, x: 200, y: 280, prerequisites: ["js"], unlocked: true, category: "Backend" },
  { id: "git", name: "Git", tier: 0, x: 600, y: 140, prerequisites: [], unlocked: true, category: "Tools" },

  // Tier 2 — Intermediate
  { id: "nextjs", name: "Next.js", tier: 2, x: 400, y: 320, prerequisites: ["react", "ts"], unlocked: false, category: "Frontend" },
  { id: "tailwind", name: "Tailwind CSS", tier: 2, x: 550, y: 320, prerequisites: ["react"], unlocked: false, category: "Frontend" },
  { id: "sql", name: "SQL/Databases", tier: 2, x: 150, y: 360, prerequisites: ["node"], unlocked: false, category: "Backend" },
  { id: "api", name: "REST/GraphQL", tier: 2, x: 280, y: 360, prerequisites: ["node", "ts"], unlocked: false, category: "Backend" },
  { id: "testing", name: "Testing", tier: 2, x: 650, y: 280, prerequisites: ["git", "react"], unlocked: false, category: "Tools" },

  // Tier 3 — Advanced
  { id: "prisma", name: "Prisma ORM", tier: 3, x: 200, y: 440, prerequisites: ["sql", "ts"], unlocked: false, category: "Backend" },
  { id: "docker", name: "Docker", tier: 3, x: 700, y: 360, prerequisites: ["git"], unlocked: false, category: "DevOps" },
  { id: "cicd", name: "CI/CD", tier: 3, x: 700, y: 440, prerequisites: ["docker", "testing"], unlocked: false, category: "DevOps" },
  { id: "aws", name: "AWS/Cloud", tier: 3, x: 550, y: 440, prerequisites: ["docker"], unlocked: false, category: "DevOps" },
  { id: "perf", name: "Performance", tier: 3, x: 400, y: 420, prerequisites: ["nextjs"], unlocked: false, category: "Frontend" },

  // Tier 4 — Expert
  { id: "k8s", name: "Kubernetes", tier: 4, x: 650, y: 520, prerequisites: ["docker", "aws"], unlocked: false, category: "DevOps" },
  { id: "sysdesign", name: "System Design", tier: 4, x: 350, y: 520, prerequisites: ["prisma", "api", "aws"], unlocked: false, category: "Architecture" },
  { id: "ml", name: "Machine Learning", tier: 4, x: 150, y: 520, prerequisites: ["sql"], unlocked: false, category: "AI/ML" },
];

const TIER_COLORS: Record<string, string> = {
  Frontend: "#7C3AED",
  Backend: "#0EA5E9",
  Tools: "#6B7280",
  DevOps: "#F59E0B",
  Architecture: "#EF4444",
  "AI/ML": "#10B981",
};

export default function SkillTreePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState(TREE_NODES);
  const [hovered, setHovered] = useState<TreeNode | null>(null);

  function toggleUnlock(id: string) {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        // Check prerequisites
        const prereqsMet = n.prerequisites.every((p) => prev.find((nn) => nn.id === p)?.unlocked);
        if (!prereqsMet && !n.unlocked) return n;
        return { ...n, unlocked: !n.unlocked };
      })
    );
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw prerequisite connections
    for (const node of nodes) {
      for (const prereqId of node.prerequisites) {
        const prereq = nodes.find((n) => n.id === prereqId);
        if (!prereq) continue;

        ctx.beginPath();
        ctx.moveTo(prereq.x, prereq.y);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = node.unlocked && prereq.unlocked
          ? (TIER_COLORS[node.category] ?? "#7C3AED") + "80"
          : "rgba(150, 150, 150, 0.2)";
        ctx.lineWidth = node.unlocked && prereq.unlocked ? 2 : 1;
        ctx.stroke();
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const color = TIER_COLORS[node.category] ?? "#7C3AED";
      const isHovered = hovered?.id === node.id;
      const radius = 28;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

      if (node.unlocked) {
        ctx.fillStyle = color;
        if (isHovered) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 15;
        }
      } else {
        ctx.fillStyle = "rgba(100, 100, 100, 0.3)";
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Lock icon for locked nodes
      if (!node.unlocked) {
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "14px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🔒", node.x, node.y);
      }

      // Label
      ctx.fillStyle = node.unlocked ? "#fff" : "rgba(200,200,200,0.5)";
      ctx.font = `${isHovered ? "bold " : ""}10px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (node.unlocked) {
        ctx.fillText(node.name, node.x, node.y);
      }

      // Label below for all nodes
      ctx.fillStyle = node.unlocked ? "rgba(255,255,255,0.8)" : "rgba(150,150,150,0.5)";
      ctx.font = "9px system-ui";
      ctx.fillText(node.name, node.x, node.y + radius + 12);
    }
  }, [nodes, hovered]);

  useEffect(() => {
    draw();
  }, [draw]);

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found: TreeNode | null = null;
    for (const node of nodes) {
      const dx = mx - node.x;
      const dy = my - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= 28) {
        found = node;
        break;
      }
    }
    setHovered(found);
    canvas.style.cursor = found ? "pointer" : "default";
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (hovered) toggleUnlock(hovered.id);
  }

  const unlockedCount = nodes.filter((n) => n.unlocked).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-sm font-semibold text-primary">Skill Tree</h1>
          <p className="text-md text-tertiary">
            Unlock skills by completing prerequisites — click nodes to toggle
          </p>
        </div>
        <Badge color="brand" size="md">
          {unlockedCount}/{nodes.length} unlocked
        </Badge>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(TIER_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs text-tertiary">
            <div className="size-3 rounded-full" style={{ backgroundColor: color }} />
            {cat}
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div className="mt-4 relative rounded-xl bg-[#1a1a2e] shadow-xs ring-1 ring-secondary overflow-hidden">
        <canvas
          ref={canvasRef}
          className="h-[600px] w-full"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        />

        {hovered && (
          <div className="absolute bottom-4 left-4 rounded-xl bg-primary p-4 shadow-lg ring-1 ring-secondary">
            <p className="text-sm font-semibold text-primary">{hovered.name}</p>
            <Badge color={hovered.unlocked ? "success" : "gray"} size="sm">
              {hovered.unlocked ? "Unlocked" : "Locked"}
            </Badge>
            <p className="mt-1 text-xs text-tertiary">
              Category: {hovered.category} &middot; Tier {hovered.tier}
            </p>
            {hovered.prerequisites.length > 0 && (
              <p className="mt-1 text-xs text-tertiary">
                Requires: {hovered.prerequisites.map((p) => nodes.find((n) => n.id === p)?.name).join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
