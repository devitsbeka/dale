"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CountryData, MetricKey } from "../_data/types";
import { metrics, getFlagEmoji } from "../_data/utils";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";

const COLORS = ["#7C3AED", "#2563EB", "#059669"];

interface CountryComparisonProps {
  countries: CountryData[];
  onRemove: (numericCode: string) => void;
}

export function CountryComparison({ countries, onRemove }: CountryComparisonProps) {
  if (countries.length < 2) return null;

  const displayMetrics: MetricKey[] = ["lifeScore", "qualityOfLife", "safety", "healthcareIndex", "costOfLivingIndex", "taxRate", "internetSpeed"];

  const chartData = displayMetrics.map((key) => {
    const config = metrics[key];
    const row: Record<string, string | number> = { metric: config.shortLabel };
    countries.forEach((c) => { row[c.code] = c[key] as number; });
    return row;
  });

  return (
    <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-md font-semibold text-primary">Country Comparison</h3>
        <div className="flex gap-3">
          {countries.map((c, i) => (
            <button key={c.code} onClick={() => onRemove(c.numericCode)} className="flex items-center gap-1.5 text-xs text-secondary hover:text-primary">
              <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              {getFlagEmoji(c.code)} {c.name}
              <span className="text-quaternary">×</span>
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={chartData} barGap={2} className="text-tertiary [&_.recharts-text]:text-xs">
            <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
            <XAxis dataKey="metric" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} width={50} />
            <Tooltip content={<ChartTooltipContent />} />
            {countries.map((c, i) => (
              <Bar key={c.code} dataKey={c.code} name={`${getFlagEmoji(c.code)} ${c.name}`} fill={COLORS[i]} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
