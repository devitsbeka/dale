"use client";

import type { FC } from "react";
import { usePathname } from "next/navigation";
import {
  BarChartSquare02,
  Briefcase01,
  Building07,
  CurrencyDollar,
  Flag06,
  Trophy01,
  Globe01,
  LayersThree01,
  LifeBuoy01,
  Map01,
  MarkerPin01,
  Plane,
  Route,
  Settings01,
  Stars02,
  Target04,
  TrendUp01,
  Zap,
} from "@untitledui/icons";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { SidebarCollapsible } from "@/components/application/app-navigation/sidebar-navigation/sidebar-collapsible";
import { ChatWidget } from "@/components/ai/chat-widget";
import { Badge } from "@/components/base/badges/badges";

const expandedNavItems: Array<{ label: string; items: NavItemType[] }> = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: BarChartSquare02 },
      { label: "Jobs", href: "/jobs", icon: Briefcase01, badge: <Badge size="sm" type="modern">47</Badge> },
      { label: "Skills", href: "/skills", icon: Target04 },
      { label: "Salary", href: "/salary", icon: CurrencyDollar },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Career Paths", href: "/paths", icon: Route },
      { label: "Companies", href: "/companies", icon: Building07 },
      { label: "AI Agents", href: "/agents", icon: Stars02 },
      { label: "Indices", href: "/indices", icon: TrendUp01 },
    ],
  },
  {
    label: "Explore",
    items: [
      { label: "Radar", href: "/radar", icon: Zap },
      { label: "Relocation", href: "/relocation", icon: MarkerPin01 },
      { label: "Immigration", href: "/immigration", icon: Plane },
      { label: "Career Map", href: "/career-map", icon: Map01 },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Negotiation", href: "/negotiation", icon: Flag06 },
      { label: "Talent Fabric", href: "/talent-fabric", icon: Globe01 },
      { label: "Skill Tree", href: "/skill-tree", icon: LayersThree01 },
      { label: "Game", href: "/game", icon: Trophy01 },
    ],
  },
];

const collapsedNavItems: (NavItemType & { icon: FC<{ className?: string }> })[] = [
  { label: "Dashboard", href: "/", icon: BarChartSquare02 },
  { label: "Jobs", href: "/jobs", icon: Briefcase01 },
  { label: "Skills", href: "/skills", icon: Target04 },
  { label: "Salary", href: "/salary", icon: CurrencyDollar },
  { label: "Career Paths", href: "/paths", icon: Route },
  { label: "Companies", href: "/companies", icon: Building07 },
  { label: "AI Agents", href: "/agents", icon: Stars02 },
  { label: "Indices", href: "/indices", icon: TrendUp01 },
  { label: "Radar", href: "/radar", icon: Zap },
  { label: "Relocation", href: "/relocation", icon: MarkerPin01 },
  { label: "Immigration", href: "/immigration", icon: Plane },
  { label: "Career Map", href: "/career-map", icon: Map01 },
  { label: "Negotiation", href: "/negotiation", icon: Flag06 },
  { label: "Talent Fabric", href: "/talent-fabric", icon: Globe01 },
  { label: "Skill Tree", href: "/skill-tree", icon: LayersThree01 },
  { label: "Game", href: "/game", icon: Trophy01 },
];

const footerNavItems: (NavItemType & { icon: FC<{ className?: string }> })[] = [
  { label: "Support", href: "/support", icon: LifeBuoy01 },
  { label: "Settings", href: "/settings", icon: Settings01 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col bg-primary lg:flex-row">
      <SidebarCollapsible
        activeUrl={pathname}
        expandedItems={expandedNavItems}
        collapsedItems={collapsedNavItems}
        footerItems={footerNavItems}
        showThemeToggle={false}
      />

      <main className="min-w-0 flex-1 bg-primary pb-12">
        {children}
      </main>

      <ChatWidget />
    </div>
  );
}
