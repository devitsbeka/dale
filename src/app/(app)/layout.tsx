'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
    BarChartSquare02,
    Briefcase02,
    Calendar,
    CheckDone01,
    Edit04,
    File05,
    HomeLine,
    LifeBuoy01,
    PieChart03,
    Rows01,
    Settings01,
    Users01,
} from '@untitledui/icons';
import type { NavItemType } from '@/components/application/app-navigation/config';
import { SidebarCollapsible } from '@/components/application/app-navigation/sidebar-navigation/sidebar-collapsible';
import { Badge } from '@/components/base/badges/badges';

// Navigation items for expanded view (grouped sections)
const expandedNavItems: Array<{ label: string; items: NavItemType[] }> = [
    {
        label: 'General',
        items: [
            {
                label: 'Dashboard',
                href: '/dashboard',
                icon: BarChartSquare02,
            },
            {
                label: 'Resumes',
                href: '/resumes/new',
                icon: Edit04,
                badge: <Badge size="sm" color="brand">New</Badge>,
            },
            {
                label: 'Jobs',
                href: '/jobs',
                icon: Briefcase02,
                badge: <Badge size="sm" color="success">Live</Badge>,
            },
            {
                label: 'Projects',
                href: '/projects',
                icon: Rows01,
            },
            {
                label: 'Documents',
                href: '/documents',
                icon: File05,
            },
            {
                label: 'Calendar',
                href: '/calendar',
                icon: Calendar,
            },
        ],
    },
    {
        label: 'Work',
        items: [
            {
                label: 'Tasks',
                href: '/tasks',
                icon: CheckDone01,
            },
            {
                label: 'Reporting',
                href: '/reporting',
                icon: PieChart03,
            },
            {
                label: 'Users',
                href: '/users',
                icon: Users01,
            },
        ],
    },
];

// Navigation items for collapsed view (icon-only)
const collapsedNavItems: (NavItemType & { icon: React.FC<{ className?: string }> })[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: BarChartSquare02,
    },
    {
        label: 'Resumes',
        href: '/resumes/new',
        icon: Edit04,
    },
    {
        label: 'Jobs',
        href: '/jobs',
        icon: Briefcase02,
    },
    {
        label: 'Projects',
        href: '/projects',
        icon: Rows01,
    },
    {
        label: 'Tasks',
        href: '/tasks',
        icon: CheckDone01,
    },
    {
        label: 'Reporting',
        href: '/reporting',
        icon: PieChart03,
    },
    {
        label: 'Users',
        href: '/users',
        icon: Users01,
    },
];

// Footer navigation items
const footerNavItems: (NavItemType & { icon: React.FC<{ className?: string }> })[] = [
    {
        label: 'Support',
        href: '/support',
        icon: LifeBuoy01,
    },
    {
        label: 'Settings',
        href: '/settings',
        icon: Settings01,
    },
];

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen flex-col bg-primary lg:flex-row">
            <SidebarCollapsible
                activeUrl={pathname}
                expandedItems={expandedNavItems}
                collapsedItems={collapsedNavItems}
                footerItems={footerNavItems}
                showThemeToggle={false}
            />
            <main className="min-w-0 flex-1 bg-primary">
                {children}
            </main>
        </div>
    );
}
