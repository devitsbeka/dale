"use client";

import { useState } from "react";
import {
    Download01,
    Edit02,
    Eye,
    File04,
    File06,
    FileCheck02,
    Plus,
    SearchLg,
    Trash01,
    Upload01,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { PageLayout } from "./page-layout";

type Document = {
    id: string;
    name: string;
    type: "resume" | "cover_letter" | "portfolio" | "reference" | "certificate";
    lastModified: string;
    size: string;
    status: "draft" | "active" | "archived";
    usageCount: number;
};

const documents: Document[] = [
    {
        id: "1",
        name: "Senior Product Designer Resume",
        type: "resume",
        lastModified: "2 hours ago",
        size: "245 KB",
        status: "active",
        usageCount: 12,
    },
    {
        id: "2",
        name: "Full-Stack Engineer Resume",
        type: "resume",
        lastModified: "1 day ago",
        size: "198 KB",
        status: "active",
        usageCount: 18,
    },
    {
        id: "3",
        name: "Cover Letter - Stripe",
        type: "cover_letter",
        lastModified: "3 days ago",
        size: "42 KB",
        status: "active",
        usageCount: 1,
    },
    {
        id: "4",
        name: "Cover Letter - General Tech",
        type: "cover_letter",
        lastModified: "1 week ago",
        size: "38 KB",
        status: "active",
        usageCount: 8,
    },
    {
        id: "5",
        name: "Design Portfolio 2026",
        type: "portfolio",
        lastModified: "2 weeks ago",
        size: "4.2 MB",
        status: "active",
        usageCount: 5,
    },
    {
        id: "6",
        name: "AWS Solutions Architect Certificate",
        type: "certificate",
        lastModified: "1 month ago",
        size: "156 KB",
        status: "active",
        usageCount: 3,
    },
    {
        id: "7",
        name: "Reference - John Smith (Former Manager)",
        type: "reference",
        lastModified: "1 month ago",
        size: "28 KB",
        status: "active",
        usageCount: 4,
    },
    {
        id: "8",
        name: "Old Resume (2024)",
        type: "resume",
        lastModified: "3 months ago",
        size: "210 KB",
        status: "archived",
        usageCount: 0,
    },
];

const typeIcons = {
    resume: File06,
    cover_letter: File04,
    portfolio: Eye,
    reference: FileCheck02,
    certificate: FileCheck02,
};

const typeColors = {
    resume: "brand" as const,
    cover_letter: "warning" as const,
    portfolio: "error" as const,
    reference: "gray" as const,
    certificate: "success" as const,
};

const typeBadgeColors = {
    resume: "brand" as const,
    cover_letter: "purple" as const,
    portfolio: "orange" as const,
    reference: "blue" as const,
    certificate: "success" as const,
};

const typeLabels = {
    resume: "Resume",
    cover_letter: "Cover Letter",
    portfolio: "Portfolio",
    reference: "Reference",
    certificate: "Certificate",
};

const statusColors = {
    draft: "warning" as const,
    active: "success" as const,
    archived: "gray" as const,
};

export const DocumentsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = !selectedType || doc.type === selectedType;
        return matchesSearch && matchesType;
    });

    const documentTypes = ["resume", "cover_letter", "portfolio", "reference", "certificate"] as const;

    return (
        <PageLayout activeUrl="/documents">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                        <SectionHeader.Heading>Documents</SectionHeader.Heading>
                        <p className="text-sm text-tertiary">Manage your resumes, cover letters, and other documents</p>
                    </div>
                    <div className="flex gap-2">
                        <Button color="secondary" size="md" iconLeading={Upload01}>
                            Upload
                        </Button>
                        <Button color="primary" size="md" iconLeading={Plus}>
                            Create new
                        </Button>
                    </div>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-xs">
                    <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        icon={SearchLg}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedType(null)}>
                        <Badge
                            color={!selectedType ? "brand" : "gray"}
                            size="md"
                            className="cursor-pointer"
                        >
                            All ({documents.length})
                        </Badge>
                    </button>
                    {documentTypes.map((type) => (
                        <button key={type} onClick={() => setSelectedType(type)}>
                            <Badge
                                color={selectedType === type ? typeBadgeColors[type] : "gray"}
                                size="md"
                                className="cursor-pointer"
                            >
                                {typeLabels[type]} ({documents.filter((d) => d.type === type).length})
                            </Badge>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments.map((doc) => (
                    <div
                        key={doc.id}
                        className="group flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-5 shadow-xs transition hover:border-brand-solid hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
                            <FeaturedIcon
                                icon={typeIcons[doc.type]}
                                color={typeColors[doc.type]}
                                theme="modern"
                                size="md"
                            />
                            <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                                <button className="rounded-md p-1.5 text-fg-quaternary transition hover:bg-secondary hover:text-fg-secondary">
                                    <Eye className="size-4" />
                                </button>
                                <button className="rounded-md p-1.5 text-fg-quaternary transition hover:bg-secondary hover:text-fg-secondary">
                                    <Edit02 className="size-4" />
                                </button>
                                <button className="rounded-md p-1.5 text-fg-quaternary transition hover:bg-secondary hover:text-fg-secondary">
                                    <Download01 className="size-4" />
                                </button>
                                <button className="rounded-md p-1.5 text-fg-quaternary transition hover:bg-error-secondary hover:text-error-primary">
                                    <Trash01 className="size-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-md font-semibold text-primary">{doc.name}</h3>
                            <div className="flex items-center gap-2">
                                <Badge color={typeBadgeColors[doc.type]} size="sm">
                                    {typeLabels[doc.type]}
                                </Badge>
                                <Badge color={statusColors[doc.status]} size="sm">
                                    {doc.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-secondary pt-4 text-sm">
                            <div className="flex flex-col text-tertiary">
                                <span>{doc.size}</span>
                                <span>Modified {doc.lastModified}</span>
                            </div>
                            <div className="text-right">
                                <span className="font-medium text-primary">{doc.usageCount}</span>
                                <span className="text-tertiary"> uses</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PageLayout>
    );
};
