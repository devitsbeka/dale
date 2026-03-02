"use client";

import { useState } from "react";
import { Plus, X } from "@untitledui/icons";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";

const inputClass =
  "rounded-lg border border-primary bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-solid";

interface PathStep {
  title: string;
  yearStart: number;
  yearEnd: number;
  salaryMin: number;
  salaryMax: number;
}

interface CareerPath {
  id: string;
  name: string;
  color: string;
  steps: PathStep[];
}

const COLORS = ["#7C3AED", "#0EA5E9", "#10B981", "#F59E0B"];

const PRESET_PATHS: CareerPath[] = [
  {
    id: "ic",
    name: "IC Track",
    color: COLORS[0],
    steps: [
      { title: "Junior Engineer", yearStart: 0, yearEnd: 2, salaryMin: 70000, salaryMax: 95000 },
      { title: "Mid Engineer", yearStart: 2, yearEnd: 5, salaryMin: 95000, salaryMax: 140000 },
      { title: "Senior Engineer", yearStart: 5, yearEnd: 8, salaryMin: 140000, salaryMax: 200000 },
      { title: "Staff Engineer", yearStart: 8, yearEnd: 12, salaryMin: 200000, salaryMax: 300000 },
      { title: "Principal Engineer", yearStart: 12, yearEnd: 20, salaryMin: 300000, salaryMax: 450000 },
    ],
  },
  {
    id: "mgmt",
    name: "Management Track",
    color: COLORS[1],
    steps: [
      { title: "Junior Engineer", yearStart: 0, yearEnd: 2, salaryMin: 70000, salaryMax: 95000 },
      { title: "Mid Engineer", yearStart: 2, yearEnd: 4, salaryMin: 95000, salaryMax: 140000 },
      { title: "Senior Engineer", yearStart: 4, yearEnd: 6, salaryMin: 140000, salaryMax: 185000 },
      { title: "Engineering Manager", yearStart: 6, yearEnd: 10, salaryMin: 180000, salaryMax: 280000 },
      { title: "Director of Engineering", yearStart: 10, yearEnd: 15, salaryMin: 280000, salaryMax: 400000 },
      { title: "VP Engineering", yearStart: 15, yearEnd: 20, salaryMin: 350000, salaryMax: 600000 },
    ],
  },
];

function simulatePath(steps: PathStep[], years: number): Array<{ year: number; min: number; median: number; max: number }> {
  const data: Array<{ year: number; min: number; median: number; max: number }> = [];
  for (let y = 0; y <= years; y++) {
    const step = steps.find((s) => y >= s.yearStart && y <= s.yearEnd) ?? steps[steps.length - 1];
    const progress = step.yearEnd > step.yearStart
      ? (y - step.yearStart) / (step.yearEnd - step.yearStart)
      : 1;
    const min = Math.round(step.salaryMin + (step.salaryMax - step.salaryMin) * progress * 0.3);
    const max = Math.round(step.salaryMin + (step.salaryMax - step.salaryMin) * (0.7 + progress * 0.3));
    const median = Math.round((min + max) / 2);
    data.push({ year: y, min, median, max });
  }
  return data;
}

export default function PathsPage() {
  const [paths, setPaths] = useState<CareerPath[]>([PRESET_PATHS[0]]);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customSteps, setCustomSteps] = useState<PathStep[]>([
    { title: "", yearStart: 0, yearEnd: 3, salaryMin: 70000, salaryMax: 100000 },
  ]);

  const years = 20;

  // Generate chart data for all paths
  const chartData: Array<Record<string, number | string>> = [];
  for (let y = 0; y <= years; y++) {
    const point: Record<string, number | string> = { year: `Year ${y}` };
    for (const path of paths) {
      const sim = simulatePath(path.steps, years);
      point[path.name] = sim[y]?.median ?? 0;
    }
    chartData.push(point);
  }

  function addPreset(preset: CareerPath) {
    if (!paths.find((p) => p.id === preset.id)) {
      setPaths([...paths, preset]);
    }
  }

  function removePath(id: string) {
    setPaths(paths.filter((p) => p.id !== id));
  }

  function addCustomPath() {
    if (!customName || customSteps.some((s) => !s.title)) return;
    const newPath: CareerPath = {
      id: `custom-${Date.now()}`,
      name: customName,
      color: COLORS[paths.length % COLORS.length],
      steps: customSteps,
    };
    setPaths([...paths, newPath]);
    setShowCustom(false);
    setCustomName("");
    setCustomSteps([{ title: "", yearStart: 0, yearEnd: 3, salaryMin: 70000, salaryMax: 100000 }]);
  }

  const selectedPath = paths.find((p) => p.id === selectedPathId) ?? paths[0];
  const selectedSim = selectedPath ? simulatePath(selectedPath.steps, years) : [];
  const peak = selectedSim.length > 0 ? selectedSim[selectedSim.length - 1] : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Path Simulator</h1>
        <p className="text-md text-tertiary">
          Visualize career trajectories and compare salary growth over time
        </p>
      </div>

      {/* Path selector */}
      <div className="mt-6 flex flex-wrap gap-2">
        {paths.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPathId(p.id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              (selectedPathId ?? paths[0]?.id) === p.id
                ? "bg-brand-solid text-white"
                : "bg-secondary text-secondary hover:bg-tertiary"
            }`}
          >
            <div className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}
            {paths.length > 1 && (
              <X
                className="size-3.5 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  removePath(p.id);
                }}
              />
            )}
          </button>
        ))}
        {PRESET_PATHS.filter((p) => !paths.find((pp) => pp.id === p.id)).map((p) => (
          <button
            key={p.id}
            onClick={() => addPreset(p)}
            className="flex items-center gap-1 rounded-lg border border-dashed border-secondary px-3 py-2 text-sm text-tertiary hover:bg-secondary"
          >
            <Plus className="size-3.5" />
            {p.name}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(true)}
          className="flex items-center gap-1 rounded-lg border border-dashed border-secondary px-3 py-2 text-sm text-tertiary hover:bg-secondary"
        >
          <Plus className="size-3.5" />
          Custom Path
        </button>
      </div>

      {/* Custom path builder */}
      {showCustom && (
        <div className="mt-4 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
          <h3 className="text-md font-semibold text-primary">Build Custom Path</h3>
          <input
            className={inputClass + " mt-3 w-full"}
            placeholder="Path name (e.g. Product Management)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <div className="mt-3 flex flex-col gap-2">
            {customSteps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <input className={inputClass + " flex-1"} placeholder="Title" value={step.title} onChange={(e) => { const s = [...customSteps]; s[i] = { ...s[i], title: e.target.value }; setCustomSteps(s); }} />
                <input className={inputClass + " w-20"} type="number" placeholder="From yr" value={step.yearStart} onChange={(e) => { const s = [...customSteps]; s[i] = { ...s[i], yearStart: Number(e.target.value) }; setCustomSteps(s); }} />
                <input className={inputClass + " w-20"} type="number" placeholder="To yr" value={step.yearEnd} onChange={(e) => { const s = [...customSteps]; s[i] = { ...s[i], yearEnd: Number(e.target.value) }; setCustomSteps(s); }} />
                <input className={inputClass + " w-28"} type="number" placeholder="Salary min" value={step.salaryMin} onChange={(e) => { const s = [...customSteps]; s[i] = { ...s[i], salaryMin: Number(e.target.value) }; setCustomSteps(s); }} />
                <input className={inputClass + " w-28"} type="number" placeholder="Salary max" value={step.salaryMax} onChange={(e) => { const s = [...customSteps]; s[i] = { ...s[i], salaryMax: Number(e.target.value) }; setCustomSteps(s); }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Button color="secondary" size="sm" iconLeading={Plus} onClick={() => setCustomSteps([...customSteps, { title: "", yearStart: customSteps[customSteps.length - 1]?.yearEnd ?? 0, yearEnd: (customSteps[customSteps.length - 1]?.yearEnd ?? 0) + 3, salaryMin: customSteps[customSteps.length - 1]?.salaryMax ?? 80000, salaryMax: (customSteps[customSteps.length - 1]?.salaryMax ?? 80000) + 30000 }])}>
              Add Step
            </Button>
            <Button color="primary" size="sm" onClick={addCustomPath}>Save Path</Button>
            <Button color="tertiary" size="sm" onClick={() => setShowCustom(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Comparison Chart */}
      <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
        <h2 className="text-lg font-semibold text-primary">Salary Trajectory Comparison</h2>
        <p className="mt-1 text-sm text-tertiary">Projected median total comp over {years} years</p>

        <div className="mt-6 h-80">
          <ResponsiveContainer>
            <AreaChart data={chartData} className="text-tertiary [&_.recharts-text]:text-xs">
              <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} interval={4} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<ChartTooltipContent />}
                formatter={(value) => `$${Number(value).toLocaleString()}`}
              />
              {paths.map((p) => (
                <Area
                  key={p.id}
                  dataKey={p.name}
                  stroke={p.color}
                  fill={p.color}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  type="monotone"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected path detail */}
      {selectedPath && (
        <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">{selectedPath.name} — Timeline</h2>
            {peak && (
              <div className="text-right">
                <p className="text-sm text-tertiary">Year {years} projection</p>
                <p className="text-lg font-bold text-primary">${(peak.median / 1000).toFixed(0)}k</p>
              </div>
            )}
          </div>

          <div className="relative mt-6">
            {/* Timeline line */}
            <div className="absolute top-3 left-3 h-[calc(100%-24px)] w-0.5 bg-secondary" />

            <div className="flex flex-col gap-4">
              {selectedPath.steps.map((step, i) => (
                <div key={i} className="relative flex items-start gap-4 pl-8">
                  <div
                    className="absolute left-1.5 top-1.5 size-3 rounded-full ring-2 ring-primary"
                    style={{ backgroundColor: selectedPath.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-primary">{step.title}</p>
                      <Badge color="gray" size="sm">
                        Yr {step.yearStart}–{step.yearEnd}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-tertiary">
                      ${(step.salaryMin / 1000).toFixed(0)}k – ${(step.salaryMax / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
