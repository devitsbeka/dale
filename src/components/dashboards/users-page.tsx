"use client";

import { useState } from "react";
import { Mail01, MessageSquare01, Phone, Plus, SearchLg } from "@untitledui/icons";
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

type Contact = {
    id: string;
    name: string;
    role: string;
    company: { name: string; domain: string };
    email: string;
    phone?: string;
    type: "recruiter" | "hiring_manager" | "referral" | "network";
    status: "active" | "responded" | "no_response";
    lastContact: string;
    notes?: string;
    avatarUrl?: string;
};

const contacts: Contact[] = [
    {
        id: "1",
        name: "Sarah Chen",
        role: "Senior Technical Recruiter",
        company: { name: "Stripe", domain: "stripe.com" },
        email: "sarah.chen@stripe.com",
        phone: "+1 (555) 234-5678",
        type: "recruiter",
        status: "active",
        lastContact: "2 days ago",
        notes: "Very responsive, scheduled final round",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
        id: "2",
        name: "Michael Torres",
        role: "Engineering Manager",
        company: { name: "Vercel", domain: "vercel.com" },
        email: "michael.t@vercel.com",
        type: "hiring_manager",
        status: "active",
        lastContact: "1 week ago",
        notes: "Met during portfolio review",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
        id: "3",
        name: "Emily Park",
        role: "Product Design Lead",
        company: { name: "Figma", domain: "figma.com" },
        email: "emily.park@figma.com",
        type: "referral",
        status: "responded",
        lastContact: "3 days ago",
        notes: "Former colleague, referred me to design team",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
        id: "4",
        name: "David Kim",
        role: "Staff Engineer",
        company: { name: "Linear", domain: "linear.app" },
        email: "david@linear.app",
        type: "network",
        status: "active",
        lastContact: "5 days ago",
        notes: "Connected at React Conf 2025",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    {
        id: "5",
        name: "Lisa Wang",
        role: "Talent Acquisition",
        company: { name: "Notion", domain: "notion.so" },
        email: "lisa.wang@notion.so",
        phone: "+1 (555) 876-5432",
        type: "recruiter",
        status: "responded",
        lastContact: "1 day ago",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    },
    {
        id: "6",
        name: "James Wilson",
        role: "VP of Engineering",
        company: { name: "GitHub", domain: "github.com" },
        email: "jwilson@github.com",
        type: "hiring_manager",
        status: "no_response",
        lastContact: "2 weeks ago",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
];

const typeColors = {
    recruiter: "blue" as const,
    hiring_manager: "purple" as const,
    referral: "success" as const,
    network: "orange" as const,
};

const typeLabels = {
    recruiter: "Recruiter",
    hiring_manager: "Hiring Manager",
    referral: "Referral",
    network: "Network",
};

const statusColors = {
    active: "success" as const,
    responded: "blue" as const,
    no_response: "gray" as const,
};

const statusLabels = {
    active: "Active",
    responded: "Responded",
    no_response: "No Response",
};

export const UsersPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = !selectedType || contact.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <PageLayout activeUrl="/users">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                        <SectionHeader.Heading>Contacts</SectionHeader.Heading>
                        <p className="text-sm text-tertiary">
                            Manage your recruiters, hiring managers, and network connections
                        </p>
                    </div>
                    <Button color="primary" size="md" iconLeading={Plus}>
                        Add contact
                    </Button>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-xs">
                    <Input
                        placeholder="Search contacts..."
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
                            All ({contacts.length})
                        </Badge>
                    </button>
                    {(Object.keys(typeLabels) as (keyof typeof typeLabels)[]).map((type) => (
                        <button key={type} onClick={() => setSelectedType(type)}>
                            <Badge
                                color={selectedType === type ? typeColors[type] : "gray"}
                                size="md"
                                className="cursor-pointer"
                            >
                                {typeLabels[type]} ({contacts.filter((c) => c.type === type).length})
                            </Badge>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredContacts.map((contact) => (
                    <div
                        key={contact.id}
                        className="flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-5 shadow-xs transition hover:border-brand-solid hover:shadow-md"
                    >
                        <div className="flex items-start gap-3">
                            <Avatar
                                src={contact.avatarUrl}
                                className="size-12"
                                alt={contact.name}
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-primary">{contact.name}</h3>
                                <p className="text-sm text-tertiary">{contact.role}</p>
                            </div>
                            <Badge color={statusColors[contact.status]} size="sm">
                                {statusLabels[contact.status]}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                            <Avatar
                                src={getLogoUrl(contact.company.domain)}
                                className="size-5"
                            />
                            <span className="text-sm font-medium text-primary">
                                {contact.company.name}
                            </span>
                            <Badge color={typeColors[contact.type]} size="sm">
                                {typeLabels[contact.type]}
                            </Badge>
                        </div>

                        {contact.notes && (
                            <p className="text-sm text-tertiary line-clamp-2">{contact.notes}</p>
                        )}

                        <div className="flex items-center justify-between border-t border-secondary pt-4">
                            <span className="text-xs text-quaternary">
                                Last contact: {contact.lastContact}
                            </span>
                            <div className="flex gap-1">
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="rounded-md p-1.5 text-fg-quaternary transition hover:bg-secondary hover:text-fg-secondary"
                                >
                                    <Mail01 className="size-4" />
                                </a>
                                {contact.phone && (
                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="rounded-md p-1.5 text-fg-quaternary transition hover:bg-secondary hover:text-fg-secondary"
                                    >
                                        <Phone className="size-4" />
                                    </a>
                                )}
                                <button className="rounded-md p-1.5 text-fg-quaternary transition hover:bg-secondary hover:text-fg-secondary">
                                    <MessageSquare01 className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PageLayout>
    );
};
