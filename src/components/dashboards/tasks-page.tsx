"use client";

import { useState } from "react";
import { Calendar, CheckCircle, Circle, Clock, Flag06, Plus, SearchLg } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { PageLayout } from "./page-layout";

// Logo.dev helper for company logos
const LOGO_DEV_TOKEN = "pk_JsCdE0PFQ2mPn6GETPLiIw";
const getLogoUrl = (domain: string) => `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`;

type Task = {
    id: string;
    title: string;
    description?: string;
    priority: "high" | "medium" | "low";
    status: "todo" | "in_progress" | "completed";
    dueDate: string;
    company?: { name: string; domain: string };
    category: "application" | "interview" | "follow_up" | "research" | "networking";
};

const initialTasks: Task[] = [
    {
        id: "1",
        title: "Prepare for Stripe final round interview",
        description: "Review system design concepts and prepare behavioral stories",
        priority: "high",
        status: "in_progress",
        dueDate: "Jan 26, 2026",
        company: { name: "Stripe", domain: "stripe.com" },
        category: "interview",
    },
    {
        id: "2",
        title: "Send thank-you email to Notion interviewer",
        priority: "high",
        status: "todo",
        dueDate: "Today",
        company: { name: "Notion", domain: "notion.so" },
        category: "follow_up",
    },
    {
        id: "3",
        title: "Update resume with latest project",
        description: "Add the new mobile app feature I shipped",
        priority: "medium",
        status: "todo",
        dueDate: "Jan 27, 2026",
        category: "application",
    },
    {
        id: "4",
        title: "Research Linear company culture",
        priority: "medium",
        status: "todo",
        dueDate: "Jan 28, 2026",
        company: { name: "Linear", domain: "linear.app" },
        category: "research",
    },
    {
        id: "5",
        title: "Review Vercel offer details",
        description: "Compare with other opportunities and prepare negotiation points",
        priority: "high",
        status: "in_progress",
        dueDate: "Jan 29, 2026",
        company: { name: "Vercel", domain: "vercel.com" },
        category: "follow_up",
    },
    {
        id: "6",
        title: "Connect with recruiter on LinkedIn",
        priority: "low",
        status: "todo",
        dueDate: "Jan 30, 2026",
        company: { name: "Figma", domain: "figma.com" },
        category: "networking",
    },
    {
        id: "7",
        title: "Complete GitHub coding challenge",
        description: "Build a REST API with documentation",
        priority: "high",
        status: "todo",
        dueDate: "Jan 28, 2026",
        company: { name: "GitHub", domain: "github.com" },
        category: "application",
    },
    {
        id: "8",
        title: "Prepare portfolio presentation",
        priority: "medium",
        status: "completed",
        dueDate: "Jan 20, 2026",
        category: "interview",
    },
];

const priorityColors = {
    high: "error" as const,
    medium: "warning" as const,
    low: "gray" as const,
};

const categoryColors = {
    application: "blue" as const,
    interview: "purple" as const,
    follow_up: "orange" as const,
    research: "success" as const,
    networking: "brand" as const,
};

const categoryLabels = {
    application: "Application",
    interview: "Interview",
    follow_up: "Follow-up",
    research: "Research",
    networking: "Networking",
};

export const TasksPage = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "todo" | "in_progress" | "completed">("all");

    const toggleTask = (taskId: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          status: task.status === "completed" ? "todo" : "completed",
                      }
                    : task
            )
        );
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" || task.status === filter;
        return matchesSearch && matchesFilter;
    });

    const todoTasks = filteredTasks.filter((t) => t.status === "todo");
    const inProgressTasks = filteredTasks.filter((t) => t.status === "in_progress");
    const completedTasks = filteredTasks.filter((t) => t.status === "completed");

    const TaskItem = ({ task }: { task: Task }) => (
        <div
            className={`flex items-start gap-3 rounded-lg border border-secondary bg-primary p-4 transition hover:border-brand-solid ${
                task.status === "completed" ? "opacity-60" : ""
            }`}
        >
            <Checkbox
                isSelected={task.status === "completed"}
                onChange={() => toggleTask(task.id)}
                className="mt-0.5"
            />
            <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                        <span
                            className={`font-medium ${
                                task.status === "completed"
                                    ? "text-tertiary line-through"
                                    : "text-primary"
                            }`}
                        >
                            {task.title}
                        </span>
                        {task.description && (
                            <span className="text-sm text-tertiary">{task.description}</span>
                        )}
                    </div>
                    <Badge color={priorityColors[task.priority]} size="sm">
                        <Flag06 className="size-3" />
                        {task.priority}
                    </Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                    {task.company && (
                        <div className="flex items-center gap-1.5">
                            <Avatar src={getLogoUrl(task.company.domain)} className="size-4" />
                            <span className="text-sm text-tertiary">{task.company.name}</span>
                        </div>
                    )}
                    <Badge color={categoryColors[task.category]} size="sm">
                        {categoryLabels[task.category]}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-tertiary">
                        <Calendar className="size-4" />
                        {task.dueDate}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <PageLayout activeUrl="/tasks">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                        <SectionHeader.Heading>Tasks</SectionHeader.Heading>
                        <p className="text-sm text-tertiary">
                            Manage your job search action items
                        </p>
                    </div>
                    <Button color="primary" size="md" iconLeading={Plus}>
                        Add task
                    </Button>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-xs">
                    <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        icon={SearchLg}
                    />
                </div>
                <div className="flex gap-2">
                    {(
                        [
                            { key: "all", label: `All (${tasks.length})` },
                            { key: "todo", label: `To do (${tasks.filter((t) => t.status === "todo").length})` },
                            { key: "in_progress", label: `In progress (${tasks.filter((t) => t.status === "in_progress").length})` },
                            { key: "completed", label: `Completed (${tasks.filter((t) => t.status === "completed").length})` },
                        ] as const
                    ).map((f) => (
                        <button key={f.key} onClick={() => setFilter(f.key)}>
                            <Badge
                                color={filter === f.key ? "brand" : "gray"}
                                size="md"
                                className="cursor-pointer"
                            >
                                {f.label}
                            </Badge>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* To Do */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Circle className="size-5 text-fg-quaternary" />
                        <h3 className="text-md font-semibold text-primary">To Do</h3>
                        <Badge color="gray" size="sm">
                            {todoTasks.length}
                        </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                        {todoTasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                </div>

                {/* In Progress */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Clock className="size-5 text-warning-primary" />
                        <h3 className="text-md font-semibold text-primary">In Progress</h3>
                        <Badge color="warning" size="sm">
                            {inProgressTasks.length}
                        </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                        {inProgressTasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                </div>

                {/* Completed */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="size-5 text-success-primary" />
                        <h3 className="text-md font-semibold text-primary">Completed</h3>
                        <Badge color="success" size="sm">
                            {completedTasks.length}
                        </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                        {completedTasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
