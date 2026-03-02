"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/base/badges/badges";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";

interface CountryData {
  country: string;
  code: string;
  avgSalary: number;
  employerCost: number; // True cost including taxes/benefits
  taxRate: number;
  benefitsCost: number;
  eorMonthly: number;
  talentPool: number; // Relative talent availability
  timeZone: string;
  languages: string[];
}

const COUNTRIES: CountryData[] = [
  { country: "United States", code: "US", avgSalary: 150000, employerCost: 195000, taxRate: 30, benefitsCost: 25000, eorMonthly: 599, talentPool: 95, timeZone: "UTC-5 to -8", languages: ["English"] },
  { country: "United Kingdom", code: "UK", avgSalary: 95000, employerCost: 118000, taxRate: 28, benefitsCost: 12000, eorMonthly: 499, talentPool: 85, timeZone: "UTC+0", languages: ["English"] },
  { country: "Germany", code: "DE", avgSalary: 80000, employerCost: 108000, taxRate: 42, benefitsCost: 18000, eorMonthly: 549, talentPool: 80, timeZone: "UTC+1", languages: ["German", "English"] },
  { country: "India", code: "IN", avgSalary: 25000, employerCost: 32000, taxRate: 22, benefitsCost: 4000, eorMonthly: 199, talentPool: 92, timeZone: "UTC+5:30", languages: ["English", "Hindi"] },
  { country: "Brazil", code: "BR", avgSalary: 35000, employerCost: 52000, taxRate: 35, benefitsCost: 10000, eorMonthly: 349, talentPool: 75, timeZone: "UTC-3", languages: ["Portuguese"] },
  { country: "Poland", code: "PL", avgSalary: 55000, employerCost: 70000, taxRate: 32, benefitsCost: 8000, eorMonthly: 399, talentPool: 78, timeZone: "UTC+1", languages: ["Polish", "English"] },
  { country: "Canada", code: "CA", avgSalary: 95000, employerCost: 118000, taxRate: 28, benefitsCost: 12000, eorMonthly: 499, talentPool: 82, timeZone: "UTC-4 to -8", languages: ["English", "French"] },
  { country: "Portugal", code: "PT", avgSalary: 42000, employerCost: 56000, taxRate: 30, benefitsCost: 7000, eorMonthly: 349, talentPool: 65, timeZone: "UTC+0", languages: ["Portuguese", "English"] },
  { country: "Singapore", code: "SG", avgSalary: 75000, employerCost: 88000, taxRate: 18, benefitsCost: 6000, eorMonthly: 449, talentPool: 70, timeZone: "UTC+8", languages: ["English", "Mandarin"] },
  { country: "Argentina", code: "AR", avgSalary: 28000, employerCost: 40000, taxRate: 35, benefitsCost: 7000, eorMonthly: 299, talentPool: 68, timeZone: "UTC-3", languages: ["Spanish"] },
];

export default function TalentFabricPage() {
  const [selected, setSelected] = useState<string[]>(["US", "DE", "IN", "PL"]);
  const [metric, setMetric] = useState<"employerCost" | "avgSalary" | "eorMonthly">("employerCost");

  const selectedCountries = COUNTRIES.filter((c) => selected.includes(c.code));

  function toggleCountry(code: string) {
    setSelected((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : prev.length < 6 ? [...prev, code] : prev
    );
  }

  const chartData = selectedCountries.map((c) => ({
    country: c.country,
    value: c[metric],
  }));

  const metricLabels = {
    employerCost: "True Cost (Annual)",
    avgSalary: "Avg. Salary",
    eorMonthly: "EoR Monthly Fee",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Global Talent Fabric</h1>
        <p className="text-md text-tertiary">
          True cost of hiring, talent pool comparison, and EoR analysis across countries
        </p>
      </div>

      {/* Country selector */}
      <div className="mt-6 flex flex-wrap gap-2">
        {COUNTRIES.map((c) => (
          <button
            key={c.code}
            onClick={() => toggleCountry(c.code)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              selected.includes(c.code)
                ? "bg-brand-solid text-white"
                : "bg-secondary text-secondary hover:bg-tertiary"
            }`}
          >
            {c.country}
          </button>
        ))}
      </div>

      {/* Metric toggle */}
      <div className="mt-4 flex gap-2">
        {(Object.keys(metricLabels) as Array<keyof typeof metricLabels>).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              metric === m ? "bg-brand-solid text-white" : "bg-secondary text-secondary"
            }`}
          >
            {metricLabels[m]}
          </button>
        ))}
      </div>

      {/* Chart */}
      {selectedCountries.length > 0 && (
        <div className="mt-6 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
          <h2 className="text-lg font-semibold text-primary">{metricLabels[metric]} Comparison</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={chartData} className="text-tertiary [&_.recharts-text]:text-xs">
                <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                <XAxis dataKey="country" axisLine={false} tickLine={false} angle={-15} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => metric === "eorMonthly" ? `$${v}` : `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltipContent />} formatter={(v) => `$${Number(v).toLocaleString()}`} />
                <Bar dataKey="value" name={metricLabels[metric]} fill="currentColor" className="text-utility-brand-600" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Country detail cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {selectedCountries.map((c) => (
          <div key={c.code} className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
            <h3 className="text-md font-semibold text-primary">{c.country}</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-tertiary">Avg. Tech Salary</span>
                <span className="font-medium text-primary">${(c.avgSalary / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tertiary">True Employer Cost</span>
                <span className="font-medium text-warning-primary">${(c.employerCost / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tertiary">Tax + Benefits Burden</span>
                <span className="font-medium text-primary">{c.taxRate}% + ${(c.benefitsCost / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tertiary">EoR Monthly Fee</span>
                <span className="font-medium text-primary">${c.eorMonthly}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tertiary">Talent Pool</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-12 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-brand-solid" style={{ width: `${c.talentPool}%` }} />
                  </div>
                  <span className="text-xs text-primary">{c.talentPool}%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-tertiary">Time Zone</span>
                <span className="text-primary">{c.timeZone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-tertiary">Languages</span>
                <div className="flex gap-1">
                  {c.languages.map((l) => (
                    <Badge key={l} color="gray" size="sm">{l}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
