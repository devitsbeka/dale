"use client";

import { ArrowLeft, Calendar, CheckCircle, Clock, MessageSquare01, Users01 } from "@untitledui/icons";
import Link from "next/link";
import { Avatar } from "@/components/base/avatar/avatar";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { PageLayout } from "./page-layout";

// Logo.dev helper for company logos
const LOGO_DEV_TOKEN = "pk_JsCdE0PFQ2mPn6GETPLiIw";
const getLogoUrl = (domain: string) => `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`;

type TeamMember = {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    status: "online" | "offline";
};

type Activity = {
    id: string;
    user: string;
    action: string;
    target: string;
    timestamp: string;
};

type TeamData = {
    id: string;
    name: string;
    description: string;
    logo: string;
    members: TeamMember[];
    stats: {
        applications: number;
        interviews: number;
        offers: number;
    };
    recentActivity: Activity[];
    companies: string[];
};

const teamsData: Record<string, TeamData> = {
    catalog: {
        id: "catalog",
        name: "Catalog",
        description: "Design-focused job search targeting product design and UX roles at top tech companies",
        logo: "https://www.untitledui.com/logos/images/Catalog.jpg",
        members: [
            {
                id: "1",
                name: "Olivia Rhye",
                role: "Lead",
                avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
                status: "online",
            },
            {
                id: "2",
                name: "Phoenix Baker",
                role: "Member",
                avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
                status: "online",
            },
            {
                id: "3",
                name: "Lana Steiner",
                role: "Member",
                avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                status: "online",
            },
        ],
        stats: {
            applications: 28,
            interviews: 8,
            offers: 2,
        },
        recentActivity: [
            { id: "1", user: "Olivia", action: "submitted application to", target: "Figma", timestamp: "2h ago" },
            { id: "2", user: "Phoenix", action: "scheduled interview with", target: "Notion", timestamp: "5h ago" },
            { id: "3", user: "Lana", action: "received offer from", target: "Linear", timestamp: "1d ago" },
        ],
        companies: ["figma.com", "notion.so", "linear.app", "stripe.com"],
    },
    warpspeed: {
        id: "warpspeed",
        name: "Warpspeed",
        description: "Engineering roles at high-growth startups and scale-ups with focus on full-stack development",
        logo: "https://www.untitledui.com/logos/images/Warpspeed.jpg",
        members: [
            {
                id: "1",
                name: "Demi Wilkinson",
                role: "Lead",
                avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                status: "online",
            },
            {
                id: "2",
                name: "Candice Wu",
                role: "Member",
                avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
                status: "offline",
            },
        ],
        stats: {
            applications: 35,
            interviews: 12,
            offers: 3,
        },
        recentActivity: [
            { id: "1", user: "Demi", action: "completed coding challenge for", target: "Vercel", timestamp: "3h ago" },
            { id: "2", user: "Candice", action: "had final round with", target: "GitHub", timestamp: "1d ago" },
        ],
        companies: ["vercel.com", "github.com", "supabase.com", "railway.app"],
    },
    boltshift: {
        id: "boltshift",
        name: "Boltshift",
        description: "Product management and strategy roles at enterprise and mid-market companies",
        logo: "https://www.untitledui.com/logos/images/Boltshift.jpg",
        members: [
            {
                id: "1",
                name: "Drew Cano",
                role: "Lead",
                avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                status: "online",
            },
            {
                id: "2",
                name: "Orlando Diggs",
                role: "Member",
                avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
                status: "online",
            },
            {
                id: "3",
                name: "Andi Lane",
                role: "Member",
                avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                status: "online",
            },
            {
                id: "4",
                name: "Kate Morrison",
                role: "Member",
                avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
                status: "offline",
            },
        ],
        stats: {
            applications: 42,
            interviews: 15,
            offers: 4,
        },
        recentActivity: [
            { id: "1", user: "Drew", action: "negotiated offer with", target: "Salesforce", timestamp: "1h ago" },
            { id: "2", user: "Orlando", action: "submitted application to", target: "Atlassian", timestamp: "4h ago" },
            { id: "3", user: "Andi", action: "had phone screen with", target: "Datadog", timestamp: "6h ago" },
        ],
        companies: ["salesforce.com", "atlassian.com", "datadog.com", "snowflake.com"],
    },
};

export const TeamPage = ({ teamId }: { teamId: string }) => {
    const team = teamsData[teamId] || teamsData.catalog;

    return (
        <PageLayout activeUrl={`/teams/${teamId}`}>
            <div className="flex flex-col gap-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-tertiary transition hover:text-primary"
                >
                    <ArrowLeft className="size-4" />
                    Back to Dashboard
                </Link>

                <SectionHeader.Root>
                    <SectionHeader.Group>
                        <div className="flex items-center gap-4">
                            <Avatar src={team.logo} className="size-12" />
                            <div className="flex flex-col gap-1">
                                <SectionHeader.Heading>{team.name}</SectionHeader.Heading>
                                <p className="text-sm text-tertiary">{team.description}</p>
                            </div>
                        </div>
                        <Button color="primary" size="md" iconLeading={Users01}>
                            Invite member
                        </Button>
                    </SectionHeader.Group>
                </SectionHeader.Root>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2 rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                    <span className="text-sm font-medium text-tertiary">Applications</span>
                    <span className="text-display-sm font-semibold text-primary">{team.stats.applications}</span>
                </div>
                <div className="flex flex-col gap-2 rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                    <span className="text-sm font-medium text-tertiary">Interviews</span>
                    <span className="text-display-sm font-semibold text-primary">{team.stats.interviews}</span>
                </div>
                <div className="flex flex-col gap-2 rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                    <span className="text-sm font-medium text-tertiary">Offers</span>
                    <span className="text-display-sm font-semibold text-success-primary">{team.stats.offers}</span>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Team Members */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-md font-semibold text-primary">Team Members</h3>
                    <div className="flex flex-col gap-3">
                        {team.members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between rounded-xl border border-secondary bg-primary p-4 shadow-xs"
                            >
                                <AvatarLabelGroup
                                    status={member.status}
                                    size="md"
                                    src={member.avatarUrl}
                                    title={member.name}
                                    subtitle={member.role}
                                />
                                <button className="rounded-md p-1.5 text-fg-quaternary transition hover:bg-secondary hover:text-fg-secondary">
                                    <MessageSquare01 className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-md font-semibold text-primary">Recent Activity</h3>
                    <div className="flex flex-col gap-3">
                        {team.recentActivity.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 rounded-xl border border-secondary bg-primary p-4 shadow-xs"
                            >
                                <Clock className="size-5 text-fg-quaternary mt-0.5" />
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-primary">
                                        <span className="font-medium">{activity.user}</span>{" "}
                                        {activity.action}{" "}
                                        <span className="font-medium">{activity.target}</span>
                                    </p>
                                    <span className="text-xs text-tertiary">{activity.timestamp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Target Companies */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-md font-semibold text-primary">Target Companies</h3>
                    <div className="flex flex-col gap-3">
                        {team.companies.map((domain) => (
                            <div
                                key={domain}
                                className="flex items-center gap-3 rounded-xl border border-secondary bg-primary p-4 shadow-xs transition hover:border-brand-solid"
                            >
                                <Avatar src={getLogoUrl(domain)} className="size-8" />
                                <span className="font-medium text-primary">
                                    {domain.replace(".com", "").replace(".app", "").replace(".so", "")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
