"use client";

import { useState, type FC } from "react";
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
import { ResumeWizard } from "@/components/resume/resume-wizard";
import { ResumeProvider } from "@/contexts/resume-context";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import type { BadgeColor } from "@/components/base/badges/badges";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";
import { WelcomeHero } from "./welcome-hero";

const lineData = [
    { date: new Date(2024, 0, 1), A: 14500 },
    { date: new Date(2024, 1, 1), A: 15200 },
    { date: new Date(2024, 2, 1), A: 14800 },
    { date: new Date(2024, 3, 1), A: 16100 },
    { date: new Date(2024, 4, 1), A: 15900 },
    { date: new Date(2024, 5, 1), A: 17200 },
    { date: new Date(2024, 6, 1), A: 16800 },
    { date: new Date(2024, 7, 1), A: 17900 },
    { date: new Date(2024, 8, 1), A: 18200 },
    { date: new Date(2024, 9, 1), A: 17600 },
    { date: new Date(2024, 10, 1), A: 18400 },
    { date: new Date(2024, 11, 1), A: 18880 },
];

type Article = {
    id: string;
    href: string;
    thumbnailUrl: string;
    title: string;
    summary: string;
    category: {
        href: string;
        name: string;
    };
    author: {
        href: string;
        name: string;
        avatarUrl: string;
    };
    publishedAt: string;
    readingTime: string;
    tags: Array<{ name: string; color: BadgeColor<"color">; href: string }>;
    isFeatured?: boolean;
};

// Logo.dev helper for company logos
const LOGO_DEV_TOKEN = "pk_JsCdE0PFQ2mPn6GETPLiIw";
const getLogoUrl = (domain: string) => `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`;

const articles: Article[] = [
    {
        id: "1",
        href: "#",
        thumbnailUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
        title: "Senior Product Designer at Stripe",
        summary: "Remote-first role building the future of payment infrastructure. Competitive salary + equity.",
        category: {
            href: "#",
            name: "Stripe",
        },
        author: {
            href: "#",
            name: "Posted 2h ago",
            avatarUrl: getLogoUrl("stripe.com"),
        },
        publishedAt: "Posted today",
        readingTime: "$140k–$180k",
        tags: [
            { name: "Remote", color: "purple", href: "#" },
            { name: "Design", color: "orange", href: "#" },
        ],
        isFeatured: true,
    },
    {
        id: "2",
        href: "#",
        thumbnailUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=3270&q=80",
        title: "Full-Stack Engineer at Vercel",
        summary: "Build the modern web with Next.js and React. Work with a globally distributed team.",
        category: {
            href: "#",
            name: "Vercel",
        },
        author: {
            href: "#",
            name: "Posted 5h ago",
            avatarUrl: getLogoUrl("vercel.com"),
        },
        publishedAt: "Posted today",
        readingTime: "$130k–$170k",
        tags: [
            { name: "Remote", color: "purple", href: "#" },
            { name: "Engineering", color: "blue", href: "#" },
        ],
    },
];

const feed: FeedItemType[] = [
    {
        id: "1",
        user: {
            name: "Stripe",
            avatarUrl: getLogoUrl("stripe.com"),
        },
        action: "Application submitted",
        timestamp: "2h",
        href: "#",
    },
    {
        id: "2",
        user: {
            name: "Vercel",
            avatarUrl: getLogoUrl("vercel.com"),
        },
        action: "Interview scheduled",
        timestamp: "5h",
        href: "#",
    },
    {
        id: "3",
        user: {
            name: "Linear",
            avatarUrl: getLogoUrl("linear.app"),
        },
        action: "Application viewed",
        timestamp: "1d",
        href: "#",
    },
    {
        id: "4",
        user: {
            name: "Notion",
            avatarUrl: getLogoUrl("notion.so"),
        },
        action: "Application submitted",
        timestamp: "2d",
        href: "#",
    },
    {
        id: "5",
        user: {
            name: "GitHub",
            avatarUrl: getLogoUrl("github.com"),
        },
        action: "Profile viewed",
        timestamp: "3d",
        href: "#",
    },
];

// Navigation items for expanded view (grouped sections)
const expandedNavItems: Array<{ label: string; items: NavItemType[] }> = [
    {
        label: "General",
        items: [
            {
                label: "Dashboard",
                href: "/",
                icon: BarChartSquare02,
            },
            {
                label: "Projects",
                href: "/projects",
                icon: Rows01,
            },
            {
                label: "Documents",
                href: "/documents",
                icon: File05,
            },
            {
                label: "Calendar",
                href: "/calendar",
                icon: Calendar,
            },
        ],
    },
    {
        label: "Work",
        items: [
            {
                label: "Reporting",
                href: "/reporting",
                icon: PieChart03,
            },
            {
                label: "Tasks",
                href: "/tasks",
                icon: CheckDone01,
                badge: (
                    <Badge size="sm" type="modern">
                        8
                    </Badge>
                ),
            },
            {
                label: "Users",
                href: "/users",
                icon: Users01,
            },
        ],
    },
    {
        label: "Your teams",
        items: [
            {
                label: "Catalog",
                href: "/teams/catalog",
                icon: () => <Avatar src="https://www.untitledui.com/logos/images/Catalog.jpg" className="mr-2 size-5" />,
                badge: (
                    <div className="flex items-center gap-3">
                        <Badge size="sm" type="modern">
                            ⌘1
                        </Badge>
                        <ChevronRight size={16} className="text-fg-quaternary" />
                    </div>
                ),
            },
            {
                label: "Warpspeed",
                href: "/teams/warpspeed",
                icon: () => <Avatar src="https://www.untitledui.com/logos/images/Warpspeed.jpg" className="mr-2 size-5" />,
                badge: (
                    <div className="flex items-center gap-3">
                        <Badge size="sm" type="modern">
                            ⌘2
                        </Badge>
                        <ChevronRight size={16} className="text-fg-quaternary" />
                    </div>
                ),
            },
            {
                label: "Boltshift",
                href: "/teams/boltshift",
                icon: () => <Avatar src="https://www.untitledui.com/logos/images/Boltshift.jpg" className="mr-2 size-5" />,
                badge: (
                    <div className="flex items-center gap-3">
                        <Badge size="sm" type="modern">
                            ⌘3
                        </Badge>
                        <ChevronRight size={16} className="text-fg-quaternary" />
                    </div>
                ),
            },
        ],
    },
];

// Navigation items for collapsed view (icon-only)
const collapsedNavItems: (NavItemType & { icon: FC<{ className?: string }> })[] = [
    {
        label: "Home",
        href: "/",
        icon: HomeLine,
    },
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: BarChartSquare02,
    },
    {
        label: "Projects",
        href: "/projects",
        icon: Rows01,
    },
    {
        label: "Tasks",
        href: "/tasks",
        icon: CheckDone01,
    },
    {
        label: "Reporting",
        href: "/reporting",
        icon: PieChart03,
    },
    {
        label: "Users",
        href: "/users",
        icon: Users01,
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

const Simple03Vertical = ({
    article,
    imageClassName,
    titleClassName,
    className,
}: {
    article: Article;
    imageClassName?: string;
    titleClassName?: string;
    className?: string;
}) => (
    <div className={cx("flex flex-col gap-4", className)}>
        <a href={article.href} className="overflow-hidden rounded-2xl" tabIndex={-1}>
            <img src={article.thumbnailUrl} alt={article.title} className={cx("aspect-[1.5] w-full object-cover", imageClassName)} />
        </a>

        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-2">
                <p className="text-sm font-semibold text-brand-secondary">
                    {article.author.name} • {article.publishedAt}
                </p>
                <div className="flex w-full flex-col gap-1">
                    <a
                        href={article.category.href}
                        className={cx(
                            "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                            titleClassName,
                        )}
                    >
                        {article.title}
                        <ArrowUpRight className="mt-0.5 size-6 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    </a>
                    <p className="line-clamp-2 text-md text-tertiary">{article.summary}</p>
                </div>
            </div>

            <div className="flex gap-2">
                {article.tags.map((tag) => (
                    <a key={tag.name} href={tag.href} className="rounded-xl outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2">
                        <Badge color={tag.color} size="md">
                            {tag.name}
                        </Badge>
                    </a>
                ))}
            </div>
        </div>
    </div>
);

export const Dashboard01 = () => {
    const [isResumeWizardOpen, setIsResumeWizardOpen] = useState(false);

    return (
        <ResumeProvider>
            <div className="flex flex-col bg-primary lg:flex-row">
                <SidebarCollapsible
                    activeUrl="/"
                    expandedItems={expandedNavItems}
                    collapsedItems={collapsedNavItems}
                    footerItems={footerNavItems}
                    showThemeToggle={false}
                />

            <main className="min-w-0 flex-1 bg-primary pb-12 pt-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-8 lg:px-8">
                    {/* Main content */}
                    <div className="flex min-w-0 flex-1 flex-col gap-8">
                    
                    {/* Welcome Hero Section */}
                    <div className="px-4 lg:px-0">
                        <WelcomeHero userName="Beka" />
                    </div>

                    <div className="flex flex-col gap-5 px-4 lg:px-0">
                        {/* Time range filters */}
                        <div className="flex gap-3 lg:justify-between">
                            <ButtonGroup defaultSelectedKeys={["12-months"]}>
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

                            <div className="hidden gap-3 lg:flex">
                                <DateRangePicker />

                                <Button color="secondary" size="md" iconLeading={FilterLines}>
                                    Filters
                                </Button>
                            </div>

                            <div className="lg:hidden">
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
                                        <span className="text-display-md font-semibold text-primary">47</span>
                                    </div>

                                    <MetricChangeIndicator type="trend" trend="positive" value="12%" />
                                </div>
                            </div>

                            <div className="flex h-50 w-full flex-col gap-2 lg:h-60 lg:min-w-[480px] lg:flex-1 xl:min-w-[560px]">
                                <ResponsiveContainer className="h-full">
                                    <AreaChart data={lineData} className="text-tertiary [&_.recharts-text]:text-xs">
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
                                <dt className="text-sm font-medium text-tertiary">Profile views</dt>
                                <dd className="flex items-start gap-2">
                                    <span className="text-display-sm font-semibold text-primary">342</span>
                                    <MetricChangeIndicator type="trend" trend="positive" value="23%" />
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
                            <button className="flex min-w-[280px] flex-1 cursor-pointer gap-3 rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary outline-focus-ring ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 lg:p-5">
                                <FeaturedIcon icon={BarChartSquare02} color="gray" theme="modern" size="lg" className="hidden lg:flex" />
                                <FeaturedIcon icon={BarChartSquare02} color="gray" theme="modern" size="md" className="lg:hidden" />

                                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
                                    <p className="text-md font-semibold text-secondary">Browse fresh opportunities</p>
                                    <p className="max-w-full truncate text-sm text-tertiary">47 new remote roles added today</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setIsResumeWizardOpen(true)}
                                className="flex min-w-[280px] flex-1 cursor-pointer gap-3 rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary outline-focus-ring ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 lg:p-5 transition hover:bg-secondary"
                            >
                                <FeaturedIcon icon={Edit04} color="gray" theme="modern" size="lg" className="hidden lg:flex" />
                                <FeaturedIcon icon={Edit04} color="gray" theme="modern" size="md" className="lg:hidden" />

                                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
                                    <p className="text-md font-semibold text-secondary">Generate tailored resume</p>
                                    <p className="max-w-full truncate text-sm text-tertiary">ATS-optimized for specific roles</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    </div>

                    {/* Right sidebar - Recent activity */}
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
            </main>

            {/* Resume Wizard Modal */}
            <ResumeWizard
                isOpen={isResumeWizardOpen}
                onClose={() => setIsResumeWizardOpen(false)}
            />
        </div>
        </ResumeProvider>
    );
};
