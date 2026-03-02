"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Badge } from "@/components/base/badges/badges";

interface MapNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  size: number;
  connections: string[];
  demandScore: number;
}

const NODES: MapNode[] = [
  { id: "swe", label: "Software Engineer", category: "Engineering", x: 400, y: 300, size: 40, connections: ["fe", "be", "fs", "devops", "ml"], demandScore: 92 },
  { id: "fe", label: "Frontend Engineer", category: "Engineering", x: 250, y: 180, size: 35, connections: ["swe", "ui", "fs"], demandScore: 85 },
  { id: "be", label: "Backend Engineer", category: "Engineering", x: 550, y: 180, size: 35, connections: ["swe", "devops", "data"], demandScore: 88 },
  { id: "fs", label: "Full-Stack Engineer", category: "Engineering", x: 400, y: 150, size: 32, connections: ["fe", "be", "swe"], demandScore: 90 },
  { id: "devops", label: "DevOps / SRE", category: "Infrastructure", x: 650, y: 300, size: 30, connections: ["swe", "be", "cloud"], demandScore: 86 },
  { id: "ml", label: "ML Engineer", category: "AI/ML", x: 300, y: 420, size: 38, connections: ["swe", "data", "ai"], demandScore: 95 },
  { id: "data", label: "Data Engineer", category: "Data", x: 500, y: 420, size: 28, connections: ["be", "ml", "analyst"], demandScore: 82 },
  { id: "ai", label: "AI Researcher", category: "AI/ML", x: 200, y: 500, size: 32, connections: ["ml"], demandScore: 90 },
  { id: "cloud", label: "Cloud Architect", category: "Infrastructure", x: 700, y: 200, size: 28, connections: ["devops"], demandScore: 84 },
  { id: "ui", label: "UI/UX Designer", category: "Design", x: 150, y: 280, size: 26, connections: ["fe", "pm"], demandScore: 75 },
  { id: "pm", label: "Product Manager", category: "Product", x: 200, y: 380, size: 30, connections: ["ui", "swe"], demandScore: 80 },
  { id: "analyst", label: "Data Analyst", category: "Data", x: 600, y: 480, size: 24, connections: ["data"], demandScore: 70 },
  { id: "em", label: "Engineering Manager", category: "Management", x: 500, y: 280, size: 30, connections: ["swe", "be", "fe"], demandScore: 78 },
];

const CATEGORY_COLORS: Record<string, string> = {
  Engineering: "#7C3AED",
  Infrastructure: "#0EA5E9",
  "AI/ML": "#10B981",
  Data: "#F59E0B",
  Design: "#EC4899",
  Product: "#8B5CF6",
  Management: "#EF4444",
};

export default function CareerMapPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const categories = [...new Set(NODES.map((n) => n.category))];

  const filteredNodes = selectedCategory
    ? NODES.filter((n) => n.category === selectedCategory)
    : NODES;

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

    // Draw connections
    ctx.strokeStyle = "rgba(150, 150, 150, 0.2)";
    ctx.lineWidth = 1;
    for (const node of filteredNodes) {
      for (const connId of node.connections) {
        const target = NODES.find((n) => n.id === connId);
        if (target && filteredNodes.includes(target)) {
          ctx.beginPath();
          ctx.moveTo(node.x + offset.x, node.y + offset.y);
          ctx.lineTo(target.x + offset.x, target.y + offset.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const node of filteredNodes) {
      const nx = node.x + offset.x;
      const ny = node.y + offset.y;
      const color = CATEGORY_COLORS[node.category] ?? "#7C3AED";
      const isHovered = hoveredNode?.id === node.id;

      // Glow
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(nx, ny, node.size + 8, 0, Math.PI * 2);
        ctx.fillStyle = color + "20";
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(nx, ny, node.size, 0, Math.PI * 2);
      ctx.fillStyle = color + (isHovered ? "FF" : "CC");
      ctx.fill();

      // Label
      ctx.fillStyle = isHovered ? "#ffffff" : "rgba(255,255,255,0.9)";
      ctx.font = `${isHovered ? "bold " : ""}${Math.max(10, node.size / 3)}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, nx, ny);
    }
  }, [filteredNodes, hoveredNode, offset]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (dragging) {
      setOffset({
        x: offset.x + (e.clientX - dragStart.current.x),
        y: offset.y + (e.clientY - dragStart.current.y),
      });
      dragStart.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Hit test
    let found: MapNode | null = null;
    for (const node of filteredNodes) {
      const dx = mx - (node.x + offset.x);
      const dy = my - (node.y + offset.y);
      if (Math.sqrt(dx * dx + dy * dy) <= node.size) {
        found = node;
        break;
      }
    }
    setHoveredNode(found);
    canvas.style.cursor = found ? "pointer" : dragging ? "grabbing" : "grab";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Career Map</h1>
        <p className="text-md text-tertiary">
          Interactive visualization of career roles and their connections
        </p>
      </div>

      {/* Category filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            !selectedCategory ? "bg-brand-solid text-white" : "bg-secondary text-secondary hover:bg-tertiary"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              selectedCategory === cat ? "bg-brand-solid text-white" : "bg-secondary text-secondary hover:bg-tertiary"
            }`}
          >
            <span className="mr-1 inline-block size-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
            {cat}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="mt-6 relative rounded-xl bg-secondary shadow-xs ring-1 ring-secondary overflow-hidden">
        <canvas
          ref={canvasRef}
          className="h-[500px] w-full"
          onMouseMove={handleMouseMove}
          onMouseDown={(e) => { setDragging(true); dragStart.current = { x: e.clientX, y: e.clientY }; }}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => { setDragging(false); setHoveredNode(null); }}
        />

        {/* Tooltip */}
        {hoveredNode && (
          <div className="absolute top-4 right-4 rounded-xl bg-primary p-4 shadow-lg ring-1 ring-secondary">
            <p className="text-md font-semibold text-primary">{hoveredNode.label}</p>
            <Badge color="gray" size="sm">{hoveredNode.category}</Badge>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-tertiary">Demand:</span>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-brand-solid" style={{ width: `${hoveredNode.demandScore}%` }} />
              </div>
              <span className="text-xs font-medium text-primary">{hoveredNode.demandScore}%</span>
            </div>
            <p className="mt-1 text-xs text-tertiary">
              Connects to: {hoveredNode.connections.map((c) => NODES.find((n) => n.id === c)?.label).filter(Boolean).join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
