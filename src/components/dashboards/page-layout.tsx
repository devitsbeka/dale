"use client";

import type { FC, ReactNode } from "react";
import {
    BarChartSquare02,
    Calendar,
    CheckDone01,
    ChevronRight,
    File05,
    HomeLine,
    LifeBuoy01,
    PieChart03,
    Rows01,
    Settings01,
    Users01,
} from "@untitledui/icons";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { SidebarCollapsible } from "@/components/application/app-navigation/sidebar-navigation/sidebar-collapsible";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";

// Navigation items for expanded view (grouped sections)
export const expandedNavItems: Array<{ label: string; items: NavItemType[] }> = [
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
export const collapsedNavItems: (NavItemType & { icon: FC<{ className?: string }> })[] = [
    {
        label: "Home",
        href: "/",
        icon: HomeLine,
    },
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

export const footerNavItems: (NavItemType & { icon: FC<{ className?: string }> })[] = [
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

interface PageLayoutProps {
    activeUrl: string;
    children: ReactNode;
}

export const PageLayout = ({ activeUrl, children }: PageLayoutProps) => {
    return (
        <div className="flex flex-col bg-primary lg:flex-row">
            <SidebarCollapsible
                activeUrl={activeUrl}
                expandedItems={expandedNavItems}
                collapsedItems={collapsedNavItems}
                footerItems={footerNavItems}
                showThemeToggle={false}
            />

            <main className="min-w-0 flex-1 bg-primary pb-12 pt-8">
                <div className="flex flex-col gap-8 px-4 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
