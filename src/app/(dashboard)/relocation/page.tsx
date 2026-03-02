"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";

interface CityData {
  id: string;
  city: string;
  country: string;
  costOfLivingIndex: number;
  avgTechSalary: number;
  taxRate: number;
  qualityOfLife: number;
  techJobCount: number;
  internetSpeed: number;
  safety: number;
}

const CITIES: CityData[] = [
  { id: "sf", city: "San Francisco", country: "US", costOfLivingIndex: 95, avgTechSalary: 195000, taxRate: 37, qualityOfLife: 72, techJobCount: 45000, internetSpeed: 200, safety: 62 },
  { id: "nyc", city: "New York", country: "US", costOfLivingIndex: 90, avgTechSalary: 180000, taxRate: 38, qualityOfLife: 75, techJobCount: 38000, internetSpeed: 180, safety: 65 },
  { id: "austin", city: "Austin", country: "US", costOfLivingIndex: 60, avgTechSalary: 155000, taxRate: 25, qualityOfLife: 80, techJobCount: 15000, internetSpeed: 150, safety: 72 },
  { id: "london", city: "London", country: "UK", costOfLivingIndex: 78, avgTechSalary: 120000, taxRate: 33, qualityOfLife: 78, techJobCount: 32000, internetSpeed: 170, safety: 70 },
  { id: "berlin", city: "Berlin", country: "DE", costOfLivingIndex: 55, avgTechSalary: 85000, taxRate: 42, qualityOfLife: 82, techJobCount: 12000, internetSpeed: 140, safety: 78 },
  { id: "amsterdam", city: "Amsterdam", country: "NL", costOfLivingIndex: 65, avgTechSalary: 90000, taxRate: 40, qualityOfLife: 88, techJobCount: 8000, internetSpeed: 160, safety: 85 },
  { id: "toronto", city: "Toronto", country: "CA", costOfLivingIndex: 62, avgTechSalary: 110000, taxRate: 30, qualityOfLife: 80, techJobCount: 18000, internetSpeed: 150, safety: 80 },
  { id: "singapore", city: "Singapore", country: "SG", costOfLivingIndex: 72, avgTechSalary: 95000, taxRate: 18, qualityOfLife: 85, techJobCount: 10000, internetSpeed: 250, safety: 95 },
  { id: "lisbon", city: "Lisbon", country: "PT", costOfLivingIndex: 40, avgTechSalary: 55000, taxRate: 35, qualityOfLife: 84, techJobCount: 4000, internetSpeed: 120, safety: 88 },
  { id: "dubai", city: "Dubai", country: "AE", costOfLivingIndex: 60, avgTechSalary: 80000, taxRate: 0, qualityOfLife: 76, techJobCount: 6000, internetSpeed: 200, safety: 92 },
];

function computeLifeScore(city: CityData): number {
  const netSalary = city.avgTechSalary * (1 - city.taxRate / 100);
  const purchasingPower = netSalary / (city.costOfLivingIndex / 50); // normalized
  const normalized = Math.min(100, (purchasingPower / 3000) * 40 + city.qualityOfLife * 0.3 + city.safety * 0.15 + Math.min(100, city.internetSpeed / 2.5) * 0.15);
  return Math.round(normalized);
}

function computeNetSalary(salary: number, taxRate: number): number {
  return Math.round(salary * (1 - taxRate / 100));
}

export default function RelocationPage() {
  const [selected, setSelected] = useState<string[]>(["sf", "austin", "london"]);
  const [salary, setSalary] = useState(150000);

  const selectedCities = CITIES.filter((c) => selected.includes(c.id));

  const comparisonData = selectedCities.map((c) => ({
    city: c.city,
    netSalary: computeNetSalary(salary, c.taxRate),
    costOfLiving: Math.round(salary * c.costOfLivingIndex / 100 * 0.4),
    lifeScore: computeLifeScore(c),
  }));

  function toggleCity(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : prev.length < 5
          ? [...prev, id]
          : prev
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Relocation Intelligence</h1>
        <p className="text-md text-tertiary">
          Compare cities by net salary, cost of living, and quality of life
        </p>
      </div>

      {/* Salary input */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm font-medium text-secondary">Your salary:</span>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="w-40 rounded-lg border border-primary bg-primary px-3 py-2 text-md font-medium text-primary shadow-xs outline-none focus:ring-2 focus:ring-brand-solid"
        />
        <span className="text-sm text-tertiary">USD/year</span>
      </div>

      {/* City selector */}
      <div className="mt-4 flex flex-wrap gap-2">
        {CITIES.map((c) => (
          <button
            key={c.id}
            onClick={() => toggleCity(c.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              selected.includes(c.id)
                ? "bg-brand-solid text-white"
                : "bg-secondary text-secondary hover:bg-tertiary"
            }`}
          >
            {c.city}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-quaternary">Select up to 5 cities to compare</p>

      {selectedCities.length > 0 && (
        <>
          {/* Net Salary Chart */}
          <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h2 className="text-lg font-semibold text-primary">Net Salary vs Cost of Living</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer>
                <BarChart data={comparisonData} className="text-tertiary [&_.recharts-text]:text-xs">
                  <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                  <XAxis dataKey="city" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltipContent />} formatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Bar dataKey="netSalary" name="Net Salary" fill="currentColor" className="text-utility-brand-600" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="costOfLiving" name="Est. Annual Cost" fill="currentColor" className="text-utility-error-300" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* City cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedCities.map((c) => {
              const lifeScore = computeLifeScore(c);
              const net = computeNetSalary(salary, c.taxRate);
              return (
                <div key={c.id} className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-semibold text-primary">{c.city}</h3>
                      <p className="text-xs text-tertiary">{c.country}</p>
                    </div>
                    <div className={`flex size-12 items-center justify-center rounded-full text-lg font-bold ${
                      lifeScore >= 75 ? "bg-utility-success-50 text-success-primary" :
                      lifeScore >= 60 ? "bg-utility-brand-50 text-brand-primary" :
                      "bg-utility-warning-50 text-warning-primary"
                    }`}>
                      {lifeScore}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-tertiary">Net Salary</span>
                      <span className="font-medium text-primary">${(net / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tertiary">Tax Rate</span>
                      <span className="font-medium text-primary">{c.taxRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tertiary">CoL Index</span>
                      <span className="font-medium text-primary">{c.costOfLivingIndex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tertiary">Quality of Life</span>
                      <span className="font-medium text-primary">{c.qualityOfLife}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tertiary">Tech Jobs</span>
                      <span className="font-medium text-primary">{c.techJobCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tertiary">Safety</span>
                      <span className="font-medium text-primary">{c.safety}/100</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
