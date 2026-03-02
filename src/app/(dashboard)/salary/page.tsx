"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { trpc } from "@/lib/trpc";

const inputClass =
  "rounded-lg border border-primary bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-solid";

const levels = [
  { value: "", label: "All Levels" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "principal", label: "Principal" },
  { value: "director", label: "Director" },
];

export default function SalaryPage() {
  const [title, setTitle] = useState("Software Engineer");
  const [country, setCountry] = useState("US");
  const [level, setLevel] = useState("");
  const [searchTitle, setSearchTitle] = useState("Software Engineer");
  const [searchCountry, setSearchCountry] = useState("US");
  const [searchLevel, setSearchLevel] = useState("");

  const queryInput = {
    title: searchTitle || undefined,
    country: searchCountry || undefined,
    level: searchLevel || undefined,
  } as { title?: string; country?: string; level?: "junior" | "mid" | "senior" | "lead" | "principal" | "director" | "vp" | "c_level" };

  const { data, isLoading } = trpc.salary.explore.useQuery(queryInput);

  function handleSearch() {
    setSearchTitle(title);
    setSearchCountry(country);
    setSearchLevel(level);
  }

  const chartData = data
    ? [
        { name: "P25", base: data.base.p25, total: data.totalComp.p25 },
        { name: "Median", base: data.base.p50, total: data.totalComp.p50 },
        { name: "P75", base: data.base.p75, total: data.totalComp.p75 },
      ]
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Compensation Reality Engine</h1>
        <p className="text-md text-tertiary">
          Explore real salary data across roles, locations, and experience levels
        </p>
      </div>

      {/* Search */}
      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className={inputClass + " flex-1 min-w-[200px]"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job title (e.g. Software Engineer)"
        />
        <input
          className={inputClass + " w-32"}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
        />
        <select
          className={inputClass}
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {levels.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
        <Button color="primary" size="md" onClick={handleSearch} isLoading={isLoading}>
          Explore
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-8 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      ) : !data ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl bg-secondary py-16">
          <p className="text-lg font-semibold text-primary">No salary data found</p>
          <p className="text-sm text-tertiary">Try adjusting your search criteria</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
              <p className="text-sm font-medium text-tertiary">Base Salary (Median)</p>
              <p className="mt-1 text-display-xs font-semibold text-primary">
                ${(data.base.p50 / 1000).toFixed(0)}k
              </p>
              <p className="mt-1 text-sm text-tertiary">
                Range: ${(data.base.p25 / 1000).toFixed(0)}k – ${(data.base.p75 / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
              <p className="text-sm font-medium text-tertiary">Total Compensation (Median)</p>
              <p className="mt-1 text-display-xs font-semibold text-success-primary">
                ${(data.totalComp.p50 / 1000).toFixed(0)}k
              </p>
              <p className="mt-1 text-sm text-tertiary">
                Range: ${(data.totalComp.p25 / 1000).toFixed(0)}k – ${(data.totalComp.p75 / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
              <p className="text-sm font-medium text-tertiary">Data Points</p>
              <p className="mt-1 text-display-xs font-semibold text-primary">
                {data.count.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-tertiary">
                Reported by professionals
              </p>
            </div>
          </div>

          {/* Distribution chart */}
          <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h2 className="text-lg font-semibold text-primary">Compensation Distribution</h2>
            <p className="mt-1 text-sm text-tertiary">Base salary vs total compensation at percentiles</p>

            <div className="mt-6 h-72">
              <ResponsiveContainer>
                <BarChart data={chartData} className="text-tertiary [&_.recharts-text]:text-xs">
                  <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                  />
                  <Bar dataKey="base" name="Base Salary" fill="currentColor" className="text-utility-brand-600" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" name="Total Comp" fill="currentColor" className="text-utility-brand-300" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent data points */}
          <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h2 className="text-lg font-semibold text-primary">Recent Reports</h2>
            <div className="mt-4 flex flex-col gap-2">
              {data.dataPoints.slice(0, 15).map((dp) => (
                <div key={dp.id} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-secondary">
                  <div className="flex items-center gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary">{dp.title}</p>
                      <p className="text-xs text-tertiary">
                        {dp.company ?? "Anonymous"} &middot; {dp.location} &middot; {dp.yearsOfExperience}yr exp
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge color="gray" size="sm">{dp.level}</Badge>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">
                        ${(dp.totalCompensation / 1000).toFixed(0)}k
                      </p>
                      <p className="text-xs text-tertiary">
                        ${(dp.baseSalary / 1000).toFixed(0)}k base
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
