"use client";

import { useState } from "react";
import {
    BookOpen01,
    HelpCircle,
    LifeBuoy01,
    Mail01,
    MessageSquare01,
    SearchLg,
    Send01,
    Zap,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { PageLayout } from "./page-layout";

type FAQ = {
    id: string;
    question: string;
    answer: string;
    category: "getting_started" | "applications" | "interviews" | "account";
};

const faqs: FAQ[] = [
    {
        id: "1",
        question: "How do I create a new job search project?",
        answer: "Navigate to the Projects page and click 'New project'. You can organize your job search by role type, company size, or industry. Each project tracks applications, interviews, and offers separately.",
        category: "getting_started",
    },
    {
        id: "2",
        question: "Can I import my existing resume?",
        answer: "Yes! Go to Documents and click 'Upload'. We support PDF, DOC, and DOCX formats. Our AI will parse your resume and help you create tailored versions for different roles.",
        category: "getting_started",
    },
    {
        id: "3",
        question: "How does the AI resume tailoring work?",
        answer: "When you apply to a job, Dale analyzes the job description and suggests modifications to highlight relevant experience. It optimizes for ATS systems while maintaining authenticity.",
        category: "applications",
    },
    {
        id: "4",
        question: "How do I track my application status?",
        answer: "Each application in a project has a status (Applied, Interviewing, Offered, Rejected). You can update statuses manually or Dale will automatically detect updates from your connected email.",
        category: "applications",
    },
    {
        id: "5",
        question: "Can Dale help me prepare for interviews?",
        answer: "Yes! For each scheduled interview, Dale provides company research, common interview questions, and practice sessions. You can also review your past interview notes and feedback.",
        category: "interviews",
    },
    {
        id: "6",
        question: "How do I schedule mock interviews?",
        answer: "Go to Calendar and click 'Add event'. Select 'Mock Interview' as the event type. You can practice with AI or invite team members for peer feedback.",
        category: "interviews",
    },
    {
        id: "7",
        question: "How do I invite team members?",
        answer: "Navigate to any team page and click 'Invite member'. Team members can share job leads, collaborate on applications, and provide interview feedback.",
        category: "account",
    },
    {
        id: "8",
        question: "Is my data secure?",
        answer: "Absolutely. We use end-to-end encryption for all sensitive data. Your documents, contacts, and application history are never shared with third parties.",
        category: "account",
    },
];

const categoryLabels = {
    getting_started: "Getting Started",
    applications: "Applications",
    interviews: "Interviews",
    account: "Account & Security",
};

const categoryColors = {
    getting_started: "blue" as const,
    applications: "purple" as const,
    interviews: "orange" as const,
    account: "success" as const,
};

export const SupportPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
    const [contactMessage, setContactMessage] = useState("");

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageLayout activeUrl="/support">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                        <SectionHeader.Heading>Support</SectionHeader.Heading>
                        <p className="text-sm text-tertiary">
                            Get help with Dale and find answers to common questions
                        </p>
                    </div>
                </SectionHeader.Group>
            </SectionHeader.Root>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button className="flex flex-col items-center gap-3 rounded-xl border border-secondary bg-primary p-5 shadow-xs transition hover:border-brand-solid hover:shadow-md">
                    <FeaturedIcon icon={BookOpen01} color="brand" theme="modern" size="lg" />
                    <div className="text-center">
                        <p className="font-semibold text-primary">Documentation</p>
                        <p className="text-sm text-tertiary">Browse guides & tutorials</p>
                    </div>
                </button>
                <button className="flex flex-col items-center gap-3 rounded-xl border border-secondary bg-primary p-5 shadow-xs transition hover:border-brand-solid hover:shadow-md">
                    <FeaturedIcon icon={MessageSquare01} color="gray" theme="modern" size="lg" />
                    <div className="text-center">
                        <p className="font-semibold text-primary">Live Chat</p>
                        <p className="text-sm text-tertiary">Chat with our team</p>
                    </div>
                </button>
                <button className="flex flex-col items-center gap-3 rounded-xl border border-secondary bg-primary p-5 shadow-xs transition hover:border-brand-solid hover:shadow-md">
                    <FeaturedIcon icon={Mail01} color="warning" theme="modern" size="lg" />
                    <div className="text-center">
                        <p className="font-semibold text-primary">Email Support</p>
                        <p className="text-sm text-tertiary">support@dale.ai</p>
                    </div>
                </button>
                <button className="flex flex-col items-center gap-3 rounded-xl border border-secondary bg-primary p-5 shadow-xs transition hover:border-brand-solid hover:shadow-md">
                    <FeaturedIcon icon={Zap} color="success" theme="modern" size="lg" />
                    <div className="text-center">
                        <p className="font-semibold text-primary">Feature Request</p>
                        <p className="text-sm text-tertiary">Suggest improvements</p>
                    </div>
                </button>
            </div>

            {/* FAQ Section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold text-primary">Frequently Asked Questions</h2>
                    <div className="w-full sm:max-w-xs">
                        <Input
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                            icon={SearchLg}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {filteredFaqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="rounded-xl border border-secondary bg-primary shadow-xs"
                        >
                            <button
                                className="flex w-full items-center justify-between p-4 text-left"
                                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <HelpCircle className="size-5 text-fg-quaternary" />
                                    <span className="font-medium text-primary">{faq.question}</span>
                                </div>
                                <Badge color={categoryColors[faq.category]} size="sm">
                                    {categoryLabels[faq.category]}
                                </Badge>
                            </button>
                            {expandedFaq === faq.id && (
                                <div className="border-t border-secondary px-4 py-3">
                                    <p className="text-sm text-tertiary pl-8">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                <div className="flex items-start gap-4">
                    <FeaturedIcon icon={LifeBuoy01} color="brand" theme="modern" size="lg" />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-primary">Still need help?</h3>
                        <p className="mt-1 text-sm text-tertiary">
                            Send us a message and we'll get back to you within 24 hours.
                        </p>

                        <div className="mt-4 flex flex-col gap-4">
                            <TextArea
                                placeholder="Describe your issue or question..."
                                value={contactMessage}
                                onChange={setContactMessage}
                                rows={4}
                            />
                            <div className="flex justify-end">
                                <Button color="primary" size="md" iconLeading={Send01}>
                                    Send message
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
