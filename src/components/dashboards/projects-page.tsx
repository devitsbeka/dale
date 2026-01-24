"use client";

import { useState } from "react";
import { ChevronRight, Plus, SearchLg } from "@untitledui/icons";
import Link from "next/link";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { PageLayout } from "./page-layout";

// Logo.dev helper for company logos
const LOGO_DEV_TOKEN = "pk_JsCdE0PFQ2mPn6GETPLiIw";
const getLogoUrl = (domain: string) => `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`;

type Project = {
    id: string;
    name: string;
    description: string;
    status: "active" | "paused" | "completed";
    companies: string[];
    applicationsCount: number;
    interviewsCount: number;
    createdAt: string;
};

const projects: Project[] = [
    {
        id: "1",
        name: "Senior Product Designer Roles",
        description: "Targeting top-tier tech companies for senior design positions with focus on product strategy",
        status: "active",
        companies: ["stripe.com", "figma.com", "notion.so", "linear.app"],
        applicationsCount: 12,
        interviewsCount: 3,
        createdAt: "2 weeks ago",
    },
    {
        id: "2",
        name: "Remote Engineering Opportunities",
        description: "Full-stack and frontend engineering roles at remote-first companies",
        status: "active",
        companies: ["vercel.com", "github.com", "gitlab.com", "supabase.com"],
        applicationsCount: 18,
        interviewsCount: 4,
        createdAt: "3 weeks ago",
    },
    {
        id: "3",
        name: "Startup Growth Roles",
        description: "Series A-B startups looking for growth and marketing leads",
        status: "paused",
        companies: ["notion.so", "linear.app", "mercury.com"],
        applicationsCount: 8,
        interviewsCount: 1,
        createdAt: "1 month ago",
    },
    {
        id: "4",
        name: "FAANG Applications",
        description: "Targeting large tech companies for senior individual contributor roles",
        status: "active",
        companies: ["google.com", "apple.com", "meta.com", "amazon.com"],
        applicationsCount: 6,
        interviewsCount: 2,
        createdAt: "1 week ago",
    },
    {
        id: "5",
        name: "Fintech Product Roles",
        description: "Product management positions at financial technology companies",
        status: "completed",
        companies: ["stripe.com", "plaid.com", "mercury.com", "ramp.com"],
        applicationsCount: 15,
        interviewsCount: 5,
        createdAt: "2 months ago",
    },
];

const statusColors = {
    active: "success" as const,
    paused: "warning" as const,
    completed: "gray" as const,
};

const statusLabels = {
    active: "Active",
    paused: "Paused",
    completed: "Completed",
};

export const ProjectsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProjects = projects.filter(
        (project) =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageLayout activeUrl="/projects">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                        <SectionHeader.Heading>Projects</SectionHeader.Heading>
                        <p className="text-sm text-tertiary">Organize your job search into focused campaigns</p>
                    </div>
                    <Button color="primary" size="md" iconLeading={Plus}>
                        New project
                    </Button>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-xs">
                    <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        icon={SearchLg}
                    />
                </div>
                <div className="flex gap-2">
                    <Badge color="gray" size="md" className="cursor-pointer">All ({projects.length})</Badge>
                    <Badge color="success" size="md" className="cursor-pointer">Active ({projects.filter(p => p.status === "active").length})</Badge>
                    <Badge color="warning" size="md" className="cursor-pointer">Paused ({projects.filter(p => p.status === "paused").length})</Badge>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                    <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="group flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-5 shadow-xs transition hover:border-brand-solid hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
                            <Badge color={statusColors[project.status]} size="sm">
                                {statusLabels[project.status]}
                            </Badge>
                            <ChevronRight className="size-5 text-fg-quaternary transition group-hover:text-fg-secondary" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-md font-semibold text-primary">{project.name}</h3>
                            <p className="line-clamp-2 text-sm text-tertiary">{project.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {project.companies.slice(0, 4).map((domain) => (
                                    <Avatar
                                        key={domain}
                                        src={getLogoUrl(domain)}
                                        className="size-6 ring-2 ring-bg-primary"
                                    />
                                ))}
                            </div>
                            {project.companies.length > 4 && (
                                <span className="text-xs text-tertiary">+{project.companies.length - 4} more</span>
                            )}
                        </div>

                        <div className="flex items-center gap-4 border-t border-secondary pt-4 text-sm">
                            <div className="flex flex-col">
                                <span className="font-semibold text-primary">{project.applicationsCount}</span>
                                <span className="text-tertiary">Applications</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-primary">{project.interviewsCount}</span>
                                <span className="text-tertiary">Interviews</span>
                            </div>
                            <span className="ml-auto text-xs text-quaternary">{project.createdAt}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </PageLayout>
    );
};
