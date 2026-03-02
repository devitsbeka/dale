"use client";

import {
    BookmarkCheck,
    Briefcase01,
    CheckDone01,
    ChevronRight,
    CurrencyDollar,
    Send01,
    Stars02,
    Target04,
} from "@untitledui/icons";
import { Area, AreaChart, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis } from "recharts";
import type { FeedItemType } from "@/components/application/activity-feed/activity-feed";
import { FeedItem } from "@/components/application/activity-feed/activity-feed";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { MetricChangeIndicator } from "@/components/application/metrics/metrics";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { Badge } from "@/components/base/badges/badges";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { WelcomeHero } from "./welcome-hero";

const LOGO_DEV_TOKEN = "pk_JsCdE0PFQ2mPn6GETPLiIw";
const getLogoUrl = (domain: string) => `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`;

// Application activity data
const activityData = [
    { date: new Date(2024, 0, 1), applications: 3 },
    { date: new Date(2024, 1, 1), applications: 5 },
    { date: new Date(2024, 2, 1), applications: 4 },
    { date: new Date(2024, 3, 1), applications: 8 },
    { date: new Date(2024, 4, 1), applications: 6 },
    { date: new Date(2024, 5, 1), applications: 12 },
    { date: new Date(2024, 6, 1), applications: 9 },
    { date: new Date(2024, 7, 1), applications: 15 },
    { date: new Date(2024, 8, 1), applications: 11 },
    { date: new Date(2024, 9, 1), applications: 18 },
    { date: new Date(2024, 10, 1), applications: 14 },
    { date: new Date(2024, 11, 1), applications: 22 },
];

const feed: FeedItemType[] = [
    { id: "1", user: { name: "Stripe", avatarUrl: getLogoUrl("stripe.com") }, action: "Application submitted", timestamp: "2h", href: "#" },
    { id: "2", user: { name: "Vercel", avatarUrl: getLogoUrl("vercel.com") }, action: "Interview scheduled", timestamp: "5h", href: "#" },
    { id: "3", user: { name: "Linear", avatarUrl: getLogoUrl("linear.app") }, action: "Application viewed", timestamp: "1d", href: "#" },
    { id: "4", user: { name: "Notion", avatarUrl: getLogoUrl("notion.so") }, action: "Application submitted", timestamp: "2d", href: "#" },
    { id: "5", user: { name: "GitHub", avatarUrl: getLogoUrl("github.com") }, action: "Profile viewed", timestamp: "3d", href: "#" },
];

// Recommended jobs
const recommendedJobs = [
    { title: "Senior Frontend Engineer", company: "Stripe", domain: "stripe.com", salary: "$150k–$200k", match: 94, tags: ["Remote", "React"] },
    { title: "Full-Stack Engineer", company: "Vercel", domain: "vercel.com", salary: "$130k–$170k", match: 88, tags: ["Remote", "Next.js"] },
    { title: "Staff Engineer", company: "Linear", domain: "linear.app", salary: "$180k–$250k", match: 82, tags: ["Remote", "TypeScript"] },
];

export const Dashboard01 = () => {
    return (
        <div className="pt-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-8 lg:px-8">
                {/* Main content */}
                <div className="flex min-w-0 flex-1 flex-col gap-8">
                    {/* Welcome Hero */}
                    <div className="px-4 lg:px-0">
                        <WelcomeHero userName="Beka" />
                    </div>

                    {/* Metrics row */}
                    <div className="flex flex-col gap-6 px-4 lg:flex-row lg:gap-8 lg:px-0">
                        <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:flex-wrap lg:gap-x-8 lg:gap-y-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-tertiary">Applications sent</p>
                                <div className="flex items-start gap-2">
                                    <span className="text-display-md font-semibold text-primary">47</span>
                                    <MetricChangeIndicator type="trend" trend="positive" value="12%" />
                                </div>
                            </div>

                            <div className="flex h-50 w-full flex-col gap-2 lg:h-60 lg:min-w-[480px] lg:flex-1 xl:min-w-[560px]">
                                <ResponsiveContainer className="h-full">
                                    <AreaChart data={activityData} className="text-tertiary [&_.recharts-text]:text-xs">
                                        <defs>
                                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="currentColor" className="text-utility-brand-700" stopOpacity="0.7" />
                                                <stop offset="95%" stopColor="currentColor" className="text-utility-brand-700" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                                        <XAxis
                                            fill="currentColor"
                                            axisLine={false}
                                            tickLine={false}
                                            tickMargin={10}
                                            interval="preserveStartEnd"
                                            dataKey="date"
                                            padding={{ left: 12, right: 12 }}
                                            tickFormatter={(value) => value.toLocaleDateString(undefined, { month: "short" })}
                                        />
                                        <RechartsTooltip
                                            content={<ChartTooltipContent />}
                                            formatter={(value) => Number(value).toLocaleString()}
                                            labelFormatter={(value) => value.toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                                            cursor={{ className: "stroke-utility-brand-600 stroke-2" }}
                                        />
                                        <Area
                                            isAnimationActive={false}
                                            className="text-utility-brand-600 [&_.recharts-area-area]:translate-y-[6px] [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]"
                                            dataKey="applications"
                                            type="linear"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            fill="url(#gradient)"
                                            fillOpacity={0.1}
                                            activeDot={{ className: "fill-bg-primary stroke-utility-brand-600 stroke-2" }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <dl className="flex w-full max-w-60 flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <dt className="text-sm font-medium text-tertiary">Response rate</dt>
                                <dd className="flex items-start gap-2">
                                    <span className="text-display-sm font-semibold text-primary">18%</span>
                                    <MetricChangeIndicator type="trend" trend="positive" value="4.2%" />
                                </dd>
                            </div>
                            <div className="flex flex-col gap-2">
                                <dt className="text-sm font-medium text-tertiary">Interviews</dt>
                                <dd className="flex items-start gap-2">
                                    <span className="text-display-sm font-semibold text-primary">7</span>
                                    <MetricChangeIndicator type="trend" trend="positive" value="16%" />
                                </dd>
                            </div>
                            <div className="flex flex-col gap-2">
                                <dt className="text-sm font-medium text-tertiary">Skill match avg</dt>
                                <dd className="flex items-start gap-2">
                                    <span className="text-display-sm font-semibold text-primary">86%</span>
                                    <MetricChangeIndicator type="trend" trend="positive" value="3%" />
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Quick actions */}
                    <div className="flex flex-col gap-6 px-4 lg:px-0">
                        <SectionHeader.Root>
                            <SectionHeader.Group>
                                <div className="flex flex-1 flex-col justify-center gap-0.5 self-stretch">
                                    <SectionHeader.Heading>Quick actions</SectionHeader.Heading>
                                </div>
                            </SectionHeader.Group>
                        </SectionHeader.Root>

                        <div className="flex flex-wrap gap-5 lg:gap-6">
                            <a href="/jobs" className="flex min-w-[280px] flex-1 gap-3 rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary outline-focus-ring ring-inset hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2 lg:p-5">
                                <FeaturedIcon icon={Briefcase01} color="brand" theme="modern" size="lg" className="hidden lg:flex" />
                                <FeaturedIcon icon={Briefcase01} color="brand" theme="modern" size="md" className="lg:hidden" />
                                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
                                    <p className="text-md font-semibold text-secondary">Browse opportunities</p>
                                    <p className="max-w-full truncate text-sm text-tertiary">47 new remote roles added today</p>
                                </div>
                            </a>
                            <a href="/salary" className="flex min-w-[280px] flex-1 gap-3 rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary outline-focus-ring ring-inset hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2 lg:p-5">
                                <FeaturedIcon icon={CurrencyDollar} color="success" theme="modern" size="lg" className="hidden lg:flex" />
                                <FeaturedIcon icon={CurrencyDollar} color="success" theme="modern" size="md" className="lg:hidden" />
                                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
                                    <p className="text-md font-semibold text-secondary">Check your market value</p>
                                    <p className="max-w-full truncate text-sm text-tertiary">Salary benchmarks for your role</p>
                                </div>
                            </a>
                            <a href="/skills" className="flex min-w-[280px] flex-1 gap-3 rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary outline-focus-ring ring-inset hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2 lg:p-5">
                                <FeaturedIcon icon={Target04} color="warning" theme="modern" size="lg" className="hidden lg:flex" />
                                <FeaturedIcon icon={Target04} color="warning" theme="modern" size="md" className="lg:hidden" />
                                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
                                    <p className="text-md font-semibold text-secondary">Skill gap analysis</p>
                                    <p className="max-w-full truncate text-sm text-tertiary">Find skills to learn for your target role</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Recommended jobs */}
                    <div className="flex flex-col gap-6 px-4 lg:px-0">
                        <SectionHeader.Root>
                            <SectionHeader.Group>
                                <div className="flex flex-1 flex-col justify-center gap-0.5 self-stretch">
                                    <SectionHeader.Heading>Recommended for you</SectionHeader.Heading>
                                </div>
                                <a href="/jobs" className="flex items-center gap-1 text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover">
                                    View all
                                    <ChevronRight size={16} />
                                </a>
                            </SectionHeader.Group>
                        </SectionHeader.Root>

                        <div className="flex flex-col gap-3">
                            {recommendedJobs.map((job) => (
                                <a key={job.company} href="/jobs" className="flex items-center gap-4 rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary hover:bg-primary_hover">
                                    <img src={getLogoUrl(job.domain)} alt={job.company} className="size-10 rounded-lg bg-secondary object-contain" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-primary">{job.title}</p>
                                        <p className="text-sm text-tertiary">{job.company} &middot; {job.salary}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                                                <div className="h-full rounded-full bg-success-solid" style={{ width: `${job.match}%` }} />
                                            </div>
                                            <span className="text-sm font-medium text-success-primary">{job.match}%</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Application tracker */}
                    <div className="flex flex-col gap-6 px-4 lg:px-0">
                        <SectionHeader.Root>
                            <SectionHeader.Group>
                                <div className="flex flex-1 flex-col justify-center gap-0.5 self-stretch">
                                    <SectionHeader.Heading>Application tracker</SectionHeader.Heading>
                                </div>
                            </SectionHeader.Group>
                        </SectionHeader.Root>

                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            {[
                                { label: "Applied", count: 12, icon: Send01, color: "brand" as const },
                                { label: "Screening", count: 5, icon: CheckDone01, color: "warning" as const },
                                { label: "Interviewing", count: 3, icon: Stars02, color: "success" as const },
                                { label: "Saved", count: 24, icon: BookmarkCheck, color: "gray" as const },
                            ].map((stage) => (
                                <div key={stage.label} className="flex flex-col gap-3 rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary">
                                    <FeaturedIcon icon={stage.icon} color={stage.color} theme="modern" size="md" />
                                    <div>
                                        <p className="text-display-xs font-semibold text-primary">{stage.count}</p>
                                        <p className="text-sm text-tertiary">{stage.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right sidebar - activity feed */}
                <div className="hidden w-64 shrink-0 flex-col gap-6 lg:flex">
                    <p className="text-sm font-medium text-secondary">Recent activity</p>
                    <ul className="flex flex-col gap-5">
                        {feed.map((item) => (
                            <li key={item.id}>
                                <FeedItem {...item} size="sm" connector={false} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
