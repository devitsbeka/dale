"use client";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ArrowDown, ArrowUp, Download01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { PageLayout } from "./page-layout";

// Application funnel data
const funnelData = [
    { stage: "Applied", count: 47, color: "#7C3AED" },
    { stage: "Reviewed", count: 32, color: "#8B5CF6" },
    { stage: "Phone Screen", count: 18, color: "#A78BFA" },
    { stage: "Interview", count: 12, color: "#C4B5FD" },
    { stage: "Final Round", count: 7, color: "#DDD6FE" },
    { stage: "Offer", count: 3, color: "#EDE9FE" },
];

// Applications over time
const applicationTrend = [
    { week: "Week 1", applications: 8, responses: 2 },
    { week: "Week 2", applications: 12, responses: 4 },
    { week: "Week 3", applications: 15, responses: 5 },
    { week: "Week 4", applications: 12, responses: 7 },
];

// Response rates by company type
const responseByType = [
    { name: "Startups", value: 28, color: "#10B981" },
    { name: "Mid-size", value: 18, color: "#3B82F6" },
    { name: "Enterprise", value: 12, color: "#8B5CF6" },
    { name: "FAANG", value: 8, color: "#F59E0B" },
];

// Top performing industries
const industryData = [
    { industry: "Fintech", applications: 15, responses: 6, rate: 40 },
    { industry: "SaaS", applications: 12, responses: 4, rate: 33 },
    { industry: "E-commerce", applications: 8, responses: 2, rate: 25 },
    { industry: "Healthcare", applications: 7, responses: 1, rate: 14 },
    { industry: "AI/ML", applications: 5, responses: 2, rate: 40 },
];

const metrics = [
    { label: "Total Applications", value: 47, change: 12, trend: "up" as const },
    { label: "Response Rate", value: "18%", change: 4.2, trend: "up" as const },
    { label: "Interview Rate", value: "15%", change: 2.1, trend: "up" as const },
    { label: "Avg Response Time", value: "4.2 days", change: 0.8, trend: "down" as const },
];

export const ReportingPage = () => {
    return (
        <PageLayout activeUrl="/reporting">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                        <SectionHeader.Heading>Reporting</SectionHeader.Heading>
                        <p className="text-sm text-tertiary">Analytics and insights for your job search</p>
                    </div>
                    <Button color="secondary" size="md" iconLeading={Download01}>
                        Export report
                    </Button>
                </SectionHeader.Group>
            </SectionHeader.Root>

            {/* Key Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="flex flex-col gap-2 rounded-xl border border-secondary bg-primary p-5 shadow-xs"
                    >
                        <span className="text-sm font-medium text-tertiary">{metric.label}</span>
                        <div className="flex items-end gap-2">
                            <span className="text-display-sm font-semibold text-primary">{metric.value}</span>
                            <Badge
                                color={metric.trend === "up" ? "success" : "error"}
                                size="sm"
                                className="mb-1"
                            >
                                {metric.trend === "up" ? (
                                    <ArrowUp className="size-3" />
                                ) : (
                                    <ArrowDown className="size-3" />
                                )}
                                {metric.change}%
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Application Funnel */}
                <div className="rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                    <h3 className="mb-4 text-md font-semibold text-primary">Application Funnel</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} layout="vertical">
                                <CartesianGrid horizontal={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis
                                    type="category"
                                    dataKey="stage"
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                    className="text-xs"
                                />
                                <RechartsTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Response by Company Type */}
                <div className="rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                    <h3 className="mb-4 text-md font-semibold text-primary">Responses by Company Type</h3>
                    <div className="flex h-64 items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={responseByType}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {responseByType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center gap-4">
                        {responseByType.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div
                                    className="size-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-tertiary">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Application Trend */}
            <div className="rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                <h3 className="mb-4 text-md font-semibold text-primary">Weekly Application Trend</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={applicationTrend}>
                            <defs>
                                <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="respGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                            <XAxis dataKey="week" axisLine={false} tickLine={false} className="text-xs" />
                            <YAxis axisLine={false} tickLine={false} className="text-xs" />
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Area
                                type="monotone"
                                dataKey="applications"
                                stroke="#7C3AED"
                                fill="url(#appGradient)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="responses"
                                stroke="#10B981"
                                fill="url(#respGradient)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-[#7C3AED]" />
                        <span className="text-sm text-tertiary">Applications</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-[#10B981]" />
                        <span className="text-sm text-tertiary">Responses</span>
                    </div>
                </div>
            </div>

            {/* Industry Performance */}
            <div className="rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                <h3 className="mb-4 text-md font-semibold text-primary">Performance by Industry</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-secondary">
                                <th className="pb-3 text-left text-sm font-medium text-tertiary">Industry</th>
                                <th className="pb-3 text-left text-sm font-medium text-tertiary">Applications</th>
                                <th className="pb-3 text-left text-sm font-medium text-tertiary">Responses</th>
                                <th className="pb-3 text-left text-sm font-medium text-tertiary">Response Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary">
                            {industryData.map((row) => (
                                <tr key={row.industry}>
                                    <td className="py-3 text-sm font-medium text-primary">{row.industry}</td>
                                    <td className="py-3 text-sm text-tertiary">{row.applications}</td>
                                    <td className="py-3 text-sm text-tertiary">{row.responses}</td>
                                    <td className="py-3">
                                        <Badge
                                            color={row.rate >= 30 ? "success" : row.rate >= 20 ? "warning" : "gray"}
                                            size="sm"
                                        >
                                            {row.rate}%
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageLayout>
    );
};
