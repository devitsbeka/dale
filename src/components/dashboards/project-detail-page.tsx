"use client";

import { ArrowLeft, Building07, Calendar, LinkExternal01, MarkerPin01, Plus } from "@untitledui/icons";
import Link from "next/link";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { PageLayout } from "./page-layout";

// Logo.dev helper for company logos
const LOGO_DEV_TOKEN = "pk_JsCdE0PFQ2mPn6GETPLiIw";
const getLogoUrl = (domain: string) => `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`;

type Application = {
    id: string;
    company: string;
    domain: string;
    role: string;
    salary: string;
    location: string;
    status: "applied" | "interviewing" | "offered" | "rejected" | "withdrawn";
    appliedDate: string;
    lastActivity: string;
};

const projectData = {
    name: "Senior Product Designer Roles",
    description: "Targeting top-tier tech companies for senior design positions with focus on product strategy",
    status: "active" as const,
    createdAt: "January 10, 2026",
    applications: [
        {
            id: "1",
            company: "Stripe",
            domain: "stripe.com",
            role: "Senior Product Designer",
            salary: "$180k - $220k",
            location: "Remote (US)",
            status: "interviewing" as const,
            appliedDate: "Jan 15, 2026",
            lastActivity: "Final round scheduled for Jan 28",
        },
        {
            id: "2",
            company: "Figma",
            domain: "figma.com",
            role: "Staff Product Designer",
            salary: "$200k - $250k",
            location: "San Francisco, CA",
            status: "applied" as const,
            appliedDate: "Jan 18, 2026",
            lastActivity: "Application under review",
        },
        {
            id: "3",
            company: "Notion",
            domain: "notion.so",
            role: "Senior Product Designer, Core",
            salary: "$170k - $210k",
            location: "New York, NY / Remote",
            status: "interviewing" as const,
            appliedDate: "Jan 12, 2026",
            lastActivity: "Portfolio review completed",
        },
        {
            id: "4",
            company: "Linear",
            domain: "linear.app",
            role: "Product Designer",
            salary: "$150k - $190k",
            location: "Remote",
            status: "offered" as const,
            appliedDate: "Jan 5, 2026",
            lastActivity: "Offer received - $175k + equity",
        },
        {
            id: "5",
            company: "Vercel",
            domain: "vercel.com",
            role: "Senior Design Engineer",
            salary: "$160k - $200k",
            location: "Remote",
            status: "rejected" as const,
            appliedDate: "Jan 8, 2026",
            lastActivity: "Position filled internally",
        },
    ] as Application[],
};

const statusColors = {
    applied: "gray" as const,
    interviewing: "blue" as const,
    offered: "success" as const,
    rejected: "error" as const,
    withdrawn: "warning" as const,
};

const statusLabels = {
    applied: "Applied",
    interviewing: "Interviewing",
    offered: "Offer Received",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
};

export const ProjectDetailPage = ({ id }: { id: string }) => {
    return (
        <PageLayout activeUrl="/projects">
            <div className="flex flex-col gap-6">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-sm font-medium text-tertiary transition hover:text-primary"
                >
                    <ArrowLeft className="size-4" />
                    Back to Projects
                </Link>

                <SectionHeader.Root>
                    <SectionHeader.Group>
                        <div className="flex flex-1 flex-col justify-center gap-1">
                            <div className="flex items-center gap-3">
                                <SectionHeader.Heading>{projectData.name}</SectionHeader.Heading>
                                <Badge color="success" size="sm">Active</Badge>
                            </div>
                            <p className="text-sm text-tertiary">{projectData.description}</p>
                        </div>
                        <Button color="primary" size="md" iconLeading={Plus}>
                            Add application
                        </Button>
                    </SectionHeader.Group>
                </SectionHeader.Root>

                <div className="flex flex-wrap gap-4">
                    <Badge color="gray" size="md">
                        <Calendar className="size-4" />
                        Created {projectData.createdAt}
                    </Badge>
                    <Badge color="gray" size="md">
                        {projectData.applications.length} applications
                    </Badge>
                    <Badge color="blue" size="md">
                        {projectData.applications.filter(a => a.status === "interviewing").length} in progress
                    </Badge>
                    <Badge color="success" size="md">
                        {projectData.applications.filter(a => a.status === "offered").length} offers
                    </Badge>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-md font-semibold text-primary">Applications</h3>

                <div className="overflow-hidden rounded-xl border border-secondary">
                    <table className="w-full">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-tertiary">Company</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-tertiary">Role</th>
                                <th className="hidden px-4 py-3 text-left text-sm font-medium text-tertiary md:table-cell">Salary</th>
                                <th className="hidden px-4 py-3 text-left text-sm font-medium text-tertiary lg:table-cell">Location</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-tertiary">Status</th>
                                <th className="hidden px-4 py-3 text-left text-sm font-medium text-tertiary sm:table-cell">Last Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary">
                            {projectData.applications.map((app) => (
                                <tr key={app.id} className="transition hover:bg-secondary/50">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar src={getLogoUrl(app.domain)} className="size-8" />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-primary">{app.company}</span>
                                                <span className="text-xs text-tertiary">{app.appliedDate}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-primary">{app.role}</span>
                                    </td>
                                    <td className="hidden px-4 py-4 md:table-cell">
                                        <span className="text-sm font-medium text-primary">{app.salary}</span>
                                    </td>
                                    <td className="hidden px-4 py-4 lg:table-cell">
                                        <div className="flex items-center gap-1 text-sm text-tertiary">
                                            <MarkerPin01 className="size-4" />
                                            {app.location}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <Badge color={statusColors[app.status]} size="sm">
                                            {statusLabels[app.status]}
                                        </Badge>
                                    </td>
                                    <td className="hidden px-4 py-4 sm:table-cell">
                                        <span className="text-sm text-tertiary">{app.lastActivity}</span>
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
