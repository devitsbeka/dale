"use client";

import { useState, useEffect, type FC } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
    ArrowUpRight,
    BarChartSquare02,
    Calendar,
    CheckDone01,
    ChevronRight,
    Edit04,
    File05,
    FilterLines,
    HomeLine,
    LifeBuoy01,
    PieChart03,
    Rows01,
    Settings01,
    Users01,
} from "@untitledui/icons";
import { Area, AreaChart, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis } from "recharts";
import type { FeedItemType } from "@/components/application/activity-feed/activity-feed";
import { FeedItem } from "@/components/application/activity-feed/activity-feed";
import { FeaturedCardImage } from "@/components/application/app-navigation/base-components/featured-cards";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { SidebarCollapsible } from "@/components/application/app-navigation/sidebar-navigation/sidebar-collapsible";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { MetricChangeIndicator } from "@/components/application/metrics/metrics";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { TableRowActionsDropdown } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import type { BadgeColor } from "@/components/base/badges/badges";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";
import { WelcomeHero } from "./welcome-hero";

interface DashboardStats {
    applicationsCount: number;
    applicationsChange: number;
    responseRate: number;
    responseRateChange: number;
    interviewsCount: number;
    interviewsChange: number;
    profileViews: number;
    profileViewsChange: number;
}

interface ChartDataPoint {
    date: string;
    applications: number;
}



// Navigation items for expanded view (grouped sections)
const expandedNavItems: Array<{ label: string; items: NavItemType[] }> = [
    {
        label: "General",
        items: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: BarChartSquare02,
            },
            {
                label: "Jobs",
                href: "/jobs",
                icon: Rows01,
            },
            {
                label: "Resumes",
                href: "/resumes",
                icon: File05,
            },
        ],
    },
];

// Navigation items for collapsed view (icon-only)
const collapsedNavItems: (NavItemType & { icon: FC<{ className?: string }> })[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: BarChartSquare02,
    },
    {
        label: "Jobs",
        href: "/jobs",
        icon: Rows01,
    },
    {
        label: "Resumes",
        href: "/resumes",
        icon: File05,
    },
];

const footerNavItems: (NavItemType & { icon: FC<{ className?: string }> })[] = [
    {
        label: "Support",
        href: "/support",
        icon: LifeBuoy01,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings01,
    },
];


export const Dashboard01 = () => {
    const { user } = useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState<string>("12-months");
    const [stats, setStats] = useState<DashboardStats>({
        applicationsCount: 0,
        applicationsChange: 0,
        responseRate: 0,
        responseRateChange: 0,
        interviewsCount: 0,
        interviewsChange: 0,
        profileViews: 0,
        profileViewsChange: 0,
    });
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [recentActivity, setRecentActivity] = useState<FeedItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const userName = user?.name || user?.email?.split('@')[0] || 'there';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('auth_token');
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                // Fetch stats
                const statsRes = await fetch(`/api/dashboard/stats?period=${selectedPeriod}`, {
                    headers,
                });
                const statsData = await statsRes.json();

                if (statsData.stats) {
                    setStats(statsData.stats);
                    setChartData(statsData.chartData || []);
                }

                // Fetch recent activity
                const activityRes = await fetch('/api/dashboard/activity', {
                    headers,
                });
                const activityData = await activityRes.json();

                if (Array.isArray(activityData)) {
                    setRecentActivity(activityData);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [selectedPeriod]);

    return (
        <div className="min-w-0 flex-1 bg-primary pb-12 pt-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-8 lg:px-8">
                    {/* Main content */}
                    <div className="flex min-w-0 flex-1 flex-col gap-8">
                    
                    {/* Welcome Hero Section */}
                    <div className="px-4 lg:px-0">
                        <WelcomeHero userName={userName} />
                    </div>

                    <div className="flex flex-col gap-5 px-4 lg:px-0">
                        {/* Time range filters */}
                        <div className="flex gap-3 lg:justify-between">
                            <ButtonGroup
                                selectedKeys={[selectedPeriod]}
                                onSelectionChange={(keys) => {
                                    const key = Array.from(keys)[0];
                                    if (typeof key === 'string') {
                                        setSelectedPeriod(key);
                                    }
                                }}
                            >
                                <ButtonGroupItem id="12-months">
                                    <span className="max-lg:hidden">12 months</span>
                                    <span className="lg:hidden">12m</span>
                                </ButtonGroupItem>
                                <ButtonGroupItem id="30-days">
                                    <span className="max-lg:hidden">30 days</span>
                                    <span className="lg:hidden">30d</span>
                                </ButtonGroupItem>
                                <ButtonGroupItem id="7-days">
                                    <span className="max-lg:hidden">7 days</span>
                                    <span className="lg:hidden">7d</span>
                                </ButtonGroupItem>
                                <ButtonGroupItem id="24-hours">
                                    <span className="max-lg:hidden">24 hours</span>
                                    <span className="lg:hidden">24h</span>
                                </ButtonGroupItem>
                            </ButtonGroup>

                            <div className="hidden gap-3 lg:flex" suppressHydrationWarning>
                                <DateRangePicker />

                                <Button color="secondary" size="md" iconLeading={FilterLines}>
                                    Filters
                                </Button>
                            </div>

                            <div className="lg:hidden" suppressHydrationWarning>
                                <Button color="secondary" size="md" iconLeading={FilterLines} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 px-4 lg:flex-row lg:gap-8 lg:px-0">
                        <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:flex-wrap lg:gap-x-8 lg:gap-y-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-tertiary">Applications sent</p>

                                <div className="flex items-start gap-2">
                                    <div className="flex items-start gap-0.5">
                                        <span className="text-display-md font-semibold text-primary">
                                            {isLoading ? '-' : stats.applicationsCount}
                                        </span>
                                    </div>

                                    {!isLoading && stats.applicationsChange !== 0 && (
                                        <MetricChangeIndicator
                                            type="trend"
                                            trend={stats.applicationsChange >= 0 ? "positive" : "negative"}
                                            value={`${Math.abs(stats.applicationsChange)}%`}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex h-50 w-full flex-col gap-2 lg:h-60 lg:min-w-[480px] lg:flex-1 xl:min-w-[560px]">
                                <ResponsiveContainer className="h-full">
                                    <AreaChart
                                        data={chartData.map(d => ({
                                            date: new Date(d.date),
                                            A: d.applications
                                        }))}
                                        className="text-tertiary [&_.recharts-text]:text-xs"
                                    >
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
                                            cursor={{
                                                className: "stroke-utility-brand-600 stroke-2",
                                            }}
                                        />

                                        <Area
                                            isAnimationActive={false}
                                            className="text-utility-brand-600 [&_.recharts-area-area]:translate-y-[6px] [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]"
                                            dataKey="A"
                                            type="linear"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            fill="url(#gradient)"
                                            fillOpacity={0.1}
                                            activeDot={{
                                                className: "fill-bg-primary stroke-utility-brand-600 stroke-2",
                                            }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <dl className="flex w-full max-w-60 flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <dt className="text-sm font-medium text-tertiary">Response rate</dt>
                                <dd className="flex items-start gap-2">
                                    <span className="text-display-sm font-semibold text-primary">
                                        {isLoading ? '-' : `${Math.round(stats.responseRate)}%`}
                                    </span>
                                    {!isLoading && stats.responseRateChange !== 0 && (
                                        <MetricChangeIndicator
                                            type="trend"
                                            trend={stats.responseRateChange >= 0 ? "positive" : "negative"}
                                            value={`${Math.abs(stats.responseRateChange)}%`}
                                        />
                                    )}
                                </dd>
                            </div>
                            <div className="flex flex-col gap-2">
                                <dt className="text-sm font-medium text-tertiary">Interviews</dt>
                                <dd className="flex items-start gap-2">
                                    <span className="text-display-sm font-semibold text-primary">
                                        {isLoading ? '-' : stats.interviewsCount}
                                    </span>
                                    {!isLoading && stats.interviewsChange !== 0 && (
                                        <MetricChangeIndicator
                                            type="trend"
                                            trend={stats.interviewsChange >= 0 ? "positive" : "negative"}
                                            value={`${Math.abs(stats.interviewsChange)}%`}
                                        />
                                    )}
                                </dd>
                            </div>
                            <div className="flex flex-col gap-2">
                                <dt className="text-sm font-medium text-tertiary">Resume views</dt>
                                <dd className="flex items-start gap-2">
                                    <span className="text-display-sm font-semibold text-primary">
                                        {isLoading ? '-' : stats.profileViews}
                                    </span>
                                    {!isLoading && stats.profileViewsChange !== 0 && (
                                        <MetricChangeIndicator
                                            type="trend"
                                            trend={stats.profileViewsChange >= 0 ? "positive" : "negative"}
                                            value={`${Math.abs(stats.profileViewsChange)}%`}
                                        />
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="flex flex-col gap-6 px-4 lg:px-0">
                        <SectionHeader.Root>
                            <SectionHeader.Group>
                                <div className="flex flex-1 flex-col justify-center gap-0.5 self-stretch">
                                    <SectionHeader.Heading>Quick actions</SectionHeader.Heading>
                                </div>

                                <div className="absolute top-0 right-0 md:static">
                                    <TableRowActionsDropdown />
                                </div>
                            </SectionHeader.Group>
                        </SectionHeader.Root>

                        <div className="flex flex-wrap gap-5 lg:gap-6">
                            <a
                                href="/jobs"
                                className="flex min-w-[280px] flex-1 cursor-pointer gap-3 rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary outline-focus-ring ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 lg:p-5 transition hover:bg-secondary"
                            >
                                <FeaturedIcon icon={BarChartSquare02} color="gray" theme="modern" size="lg" className="hidden lg:flex" />
                                <FeaturedIcon icon={BarChartSquare02} color="gray" theme="modern" size="md" className="lg:hidden" />

                                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
                                    <p className="text-md font-semibold text-secondary">Browse job opportunities</p>
                                    <p className="max-w-full truncate text-sm text-tertiary">Find your next role</p>
                                </div>
                            </a>
                            <a
                                href="/resumes/new"
                                className="flex min-w-[280px] flex-1 cursor-pointer gap-3 rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary outline-focus-ring ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 lg:p-5 transition hover:bg-secondary"
                            >
                                <FeaturedIcon icon={Edit04} color="gray" theme="modern" size="lg" className="hidden lg:flex" />
                                <FeaturedIcon icon={Edit04} color="gray" theme="modern" size="md" className="lg:hidden" />

                                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
                                    <p className="text-md font-semibold text-secondary">Generate tailored resume</p>
                                    <p className="max-w-full truncate text-sm text-tertiary">ATS-optimized for specific roles</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    </div>

                    {/* Right sidebar - Recent activity */}
                    <div className="hidden w-64 shrink-0 flex-col gap-6 lg:flex">
                        <p className="text-sm font-medium text-secondary">Recent activity</p>

                        {isLoading ? (
                            <div className="flex flex-col gap-5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="size-10 rounded-full bg-secondary animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-secondary rounded animate-pulse w-3/4" />
                                            <div className="h-3 bg-secondary rounded animate-pulse w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentActivity.length > 0 ? (
                            <ul className="flex flex-col gap-5">
                                {recentActivity.map((item) => (
                                    <li key={item.id}>
                                        <FeedItem {...item} size="sm" connector={false} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <p className="text-sm text-tertiary">No recent activity yet</p>
                                <p className="text-xs text-quaternary mt-1">Start applying to jobs!</p>
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
};
