"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/base/badges/badges";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";

type IndexType = "salary" | "skills" | "company" | "education" | "labor";

interface IndexData {
  id: IndexType;
  name: string;
  value: number;
  change: number;
  description: string;
  history: Array<{ month: string; value: number }>;
  topItems: Array<{ name: string; value: number; change: number }>;
}

const INDICES: IndexData[] = [
  {
    id: "salary",
    name: "Planeta Salary Index",
    value: 142.3,
    change: 4.2,
    description: "Tracks global tech compensation trends normalized to a 2020 baseline of 100.",
    history: [
      { month: "Jan", value: 135.1 }, { month: "Feb", value: 136.4 }, { month: "Mar", value: 137.8 },
      { month: "Apr", value: 138.2 }, { month: "May", value: 138.9 }, { month: "Jun", value: 139.5 },
      { month: "Jul", value: 140.1 }, { month: "Aug", value: 140.8 }, { month: "Sep", value: 141.2 },
      { month: "Oct", value: 141.5 }, { month: "Nov", value: 141.9 }, { month: "Dec", value: 142.3 },
    ],
    topItems: [
      { name: "AI/ML Engineer", value: 198000, change: 12 },
      { name: "Staff Engineer", value: 245000, change: 8 },
      { name: "Engineering Manager", value: 215000, change: 5 },
      { name: "DevOps/SRE", value: 168000, change: 7 },
      { name: "Product Manager", value: 178000, change: 3 },
    ],
  },
  {
    id: "skills",
    name: "Planeta Skills Demand Index",
    value: 156.7,
    change: 8.9,
    description: "Measures relative demand for tech skills based on job postings and hiring velocity.",
    history: [
      { month: "Jan", value: 140.2 }, { month: "Feb", value: 142.1 }, { month: "Mar", value: 143.8 },
      { month: "Apr", value: 145.5 }, { month: "May", value: 147.2 }, { month: "Jun", value: 149.0 },
      { month: "Jul", value: 150.8 }, { month: "Aug", value: 152.1 }, { month: "Sep", value: 153.4 },
      { month: "Oct", value: 154.5 }, { month: "Nov", value: 155.6 }, { month: "Dec", value: 156.7 },
    ],
    topItems: [
      { name: "GenAI / LLMs", value: 95, change: 45 },
      { name: "Rust", value: 82, change: 32 },
      { name: "Kubernetes", value: 88, change: 15 },
      { name: "TypeScript", value: 92, change: 10 },
      { name: "System Design", value: 78, change: 18 },
    ],
  },
  {
    id: "company",
    name: "Company Health Index",
    value: 71.4,
    change: -1.8,
    description: "Composite health score across tech companies factoring growth, culture, and stability.",
    history: [
      { month: "Jan", value: 74.2 }, { month: "Feb", value: 73.8 }, { month: "Mar", value: 73.5 },
      { month: "Apr", value: 73.1 }, { month: "May", value: 72.8 }, { month: "Jun", value: 72.5 },
      { month: "Jul", value: 72.2 }, { month: "Aug", value: 72.0 }, { month: "Sep", value: 71.8 },
      { month: "Oct", value: 71.6 }, { month: "Nov", value: 71.5 }, { month: "Dec", value: 71.4 },
    ],
    topItems: [
      { name: "Stripe", value: 92, change: 3 },
      { name: "Vercel", value: 89, change: 5 },
      { name: "Anthropic", value: 88, change: 12 },
      { name: "Figma", value: 86, change: 1 },
      { name: "Linear", value: 85, change: 4 },
    ],
  },
  {
    id: "education",
    name: "Education ROI Index",
    value: 88.5,
    change: -3.2,
    description: "Measures the return on investment for various education paths relative to career outcomes.",
    history: [
      { month: "Jan", value: 92.1 }, { month: "Feb", value: 91.8 }, { month: "Mar", value: 91.4 },
      { month: "Apr", value: 91.0 }, { month: "May", value: 90.5 }, { month: "Jun", value: 90.1 },
      { month: "Jul", value: 89.8 }, { month: "Aug", value: 89.5 }, { month: "Sep", value: 89.2 },
      { month: "Oct", value: 88.9 }, { month: "Nov", value: 88.7 }, { month: "Dec", value: 88.5 },
    ],
    topItems: [
      { name: "Bootcamp → SWE", value: 340, change: -5 },
      { name: "CS Degree → SWE", value: 280, change: -8 },
      { name: "Self-taught → SWE", value: 420, change: 2 },
      { name: "MBA → PM", value: 180, change: -12 },
      { name: "Online Certs", value: 380, change: 15 },
    ],
  },
  {
    id: "labor",
    name: "Labor Flow Index",
    value: 118.9,
    change: 6.1,
    description: "Tracks cross-border talent movement and remote work adoption trends.",
    history: [
      { month: "Jan", value: 110.5 }, { month: "Feb", value: 111.2 }, { month: "Mar", value: 112.0 },
      { month: "Apr", value: 112.8 }, { month: "May", value: 113.5 }, { month: "Jun", value: 114.3 },
      { month: "Jul", value: 115.1 }, { month: "Aug", value: 116.0 }, { month: "Sep", value: 116.8 },
      { month: "Oct", value: 117.5 }, { month: "Nov", value: 118.2 }, { month: "Dec", value: 118.9 },
    ],
    topItems: [
      { name: "US → EU migration", value: 24, change: 18 },
      { name: "Remote-first %", value: 42, change: 8 },
      { name: "Digital nomad visas", value: 35, change: 28 },
      { name: "India → US H-1B", value: 65, change: -3 },
      { name: "Nearshoring (LATAM)", value: 48, change: 22 },
    ],
  },
];

export default function IndicesPage() {
  const [selected, setSelected] = useState<IndexType>("salary");
  const index = INDICES.find((i) => i.id === selected)!;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Planeta Indices</h1>
        <p className="text-md text-tertiary">
          Public benchmarks tracking salary, skills, and labor market trends
        </p>
      </div>

      {/* Index summary cards */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {INDICES.map((idx) => (
          <button
            key={idx.id}
            onClick={() => setSelected(idx.id)}
            className={`rounded-xl p-4 text-left transition ${
              selected === idx.id
                ? "bg-brand-solid text-white shadow-md"
                : "bg-primary shadow-xs ring-1 ring-secondary hover:shadow-md"
            }`}
          >
            <p className={`text-xl font-bold ${selected === idx.id ? "" : "text-primary"}`}>
              {idx.value}
            </p>
            <p className={`text-xs ${selected === idx.id ? "text-white/70" : "text-tertiary"}`}>
              {idx.name.replace("Planeta ", "")}
            </p>
            <p className={`mt-1 text-xs font-medium ${
              idx.change >= 0
                ? selected === idx.id ? "text-white/90" : "text-success-primary"
                : selected === idx.id ? "text-white/90" : "text-error-primary"
            }`}>
              {idx.change >= 0 ? "+" : ""}{idx.change}%
            </p>
          </button>
        ))}
      </div>

      {/* Selected index detail */}
      <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">{index.name}</h2>
            <p className="mt-1 text-sm text-tertiary">{index.description}</p>
          </div>
          <div className="text-right">
            <p className="text-display-xs font-bold text-primary">{index.value}</p>
            <Badge color={index.change >= 0 ? "success" : "error"} size="sm">
              {index.change >= 0 ? "+" : ""}{index.change}% YoY
            </Badge>
          </div>
        </div>

        <div className="mt-6 h-64">
          <ResponsiveContainer>
            <AreaChart data={index.history} className="text-tertiary [&_.recharts-text]:text-xs">
              <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="value"
                stroke="currentColor"
                fill="currentColor"
                fillOpacity={0.1}
                strokeWidth={2}
                className="text-utility-brand-600"
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top items */}
      <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
        <h2 className="text-lg font-semibold text-primary">Top Movers</h2>
        <div className="mt-4 flex flex-col gap-2">
          {index.topItems.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-secondary">
              <div className="flex items-center gap-3">
                <span className="w-6 text-center text-sm font-bold text-tertiary">#{i + 1}</span>
                <span className="text-sm font-medium text-primary">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-primary">
                  {index.id === "salary" ? `$${(item.value / 1000).toFixed(0)}k` :
                   index.id === "education" ? `${item.value}% ROI` :
                   `${item.value}`}
                </span>
                <Badge color={item.change >= 0 ? "success" : "error"} size="sm">
                  {item.change >= 0 ? "+" : ""}{item.change}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
