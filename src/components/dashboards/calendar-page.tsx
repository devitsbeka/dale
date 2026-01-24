"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MarkerPin01, VideoRecorder } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { PageLayout } from "./page-layout";

// Logo.dev helper for company logos
const LOGO_DEV_TOKEN = "pk_JsCdE0PFQ2mPn6GETPLiIw";
const getLogoUrl = (domain: string) => `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`;

type Event = {
    id: string;
    title: string;
    company: string;
    domain: string;
    type: "phone_screen" | "technical" | "behavioral" | "onsite" | "offer_call" | "follow_up";
    date: string;
    time: string;
    duration: string;
    location: "video" | "phone" | "onsite";
    notes?: string;
};

const events: Event[] = [
    {
        id: "1",
        title: "Final Round Interview",
        company: "Stripe",
        domain: "stripe.com",
        type: "onsite",
        date: "2026-01-27",
        time: "10:00 AM",
        duration: "3 hours",
        location: "video",
        notes: "System design + behavioral with hiring manager",
    },
    {
        id: "2",
        title: "Technical Interview",
        company: "Notion",
        domain: "notion.so",
        type: "technical",
        date: "2026-01-28",
        time: "2:00 PM",
        duration: "1 hour",
        location: "video",
        notes: "Focus on frontend architecture",
    },
    {
        id: "3",
        title: "Phone Screen",
        company: "Linear",
        domain: "linear.app",
        type: "phone_screen",
        date: "2026-01-29",
        time: "11:00 AM",
        duration: "30 min",
        location: "phone",
    },
    {
        id: "4",
        title: "Offer Discussion",
        company: "Vercel",
        domain: "vercel.com",
        type: "offer_call",
        date: "2026-01-30",
        time: "3:00 PM",
        duration: "45 min",
        location: "video",
        notes: "Discuss compensation and start date",
    },
    {
        id: "5",
        title: "Behavioral Interview",
        company: "Figma",
        domain: "figma.com",
        type: "behavioral",
        date: "2026-01-31",
        time: "9:00 AM",
        duration: "1 hour",
        location: "video",
    },
    {
        id: "6",
        title: "Follow-up Call",
        company: "GitHub",
        domain: "github.com",
        type: "follow_up",
        date: "2026-02-03",
        time: "4:00 PM",
        duration: "30 min",
        location: "video",
        notes: "Discuss next steps",
    },
];

const typeColors = {
    phone_screen: "gray" as const,
    technical: "blue" as const,
    behavioral: "purple" as const,
    onsite: "brand" as const,
    offer_call: "success" as const,
    follow_up: "orange" as const,
};

const typeLabels = {
    phone_screen: "Phone Screen",
    technical: "Technical",
    behavioral: "Behavioral",
    onsite: "On-site/Final",
    offer_call: "Offer Call",
    follow_up: "Follow-up",
};

const locationIcons = {
    video: VideoRecorder,
    phone: Clock,
    onsite: MarkerPin01,
};

// Simple calendar generation
const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
        days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return days;
};

export const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 24)); // Jan 24, 2026
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = generateCalendarDays(year, month);
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getEventsForDay = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return events.filter((e) => e.date === dateStr);
    };

    const upcomingEvents = events
        .filter((e) => new Date(e.date) >= new Date("2026-01-24"))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    return (
        <PageLayout activeUrl="/calendar">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                        <SectionHeader.Heading>Calendar</SectionHeader.Heading>
                        <p className="text-sm text-tertiary">Track your interviews and important dates</p>
                    </div>
                    <Button color="primary" size="md" iconLeading={CalendarIcon}>
                        Add event
                    </Button>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-secondary bg-primary p-4 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-primary">
                                {monthNames[month]} {year}
                            </h2>
                            <div className="flex gap-2">
                                <Button color="secondary" size="sm" iconLeading={ChevronLeft} onClick={prevMonth} />
                                <Button color="secondary" size="sm" iconLeading={ChevronRight} onClick={nextMonth} />
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="py-2 text-center text-sm font-medium text-tertiary">
                                    {day}
                                </div>
                            ))}

                            {days.map((day, index) => {
                                const dayEvents = day ? getEventsForDay(day) : [];
                                const isToday = day === 24 && month === 0 && year === 2026;

                                return (
                                    <div
                                        key={index}
                                        className={`min-h-[80px] rounded-lg border p-1.5 ${
                                            day
                                                ? "border-secondary bg-primary hover:bg-secondary/50"
                                                : "border-transparent bg-transparent"
                                        } ${isToday ? "ring-2 ring-brand-solid" : ""}`}
                                    >
                                        {day && (
                                            <>
                                                <span
                                                    className={`text-sm font-medium ${
                                                        isToday ? "text-brand-primary" : "text-primary"
                                                    }`}
                                                >
                                                    {day}
                                                </span>
                                                <div className="mt-1 flex flex-col gap-0.5">
                                                    {dayEvents.slice(0, 2).map((event) => (
                                                        <div
                                                            key={event.id}
                                                            className="truncate rounded bg-brand-secondary px-1 py-0.5 text-xs text-brand-primary"
                                                        >
                                                            {event.company}
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 2 && (
                                                        <span className="text-xs text-tertiary">
                                                            +{dayEvents.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-md font-semibold text-primary">Upcoming Events</h3>

                    <div className="flex flex-col gap-3">
                        {upcomingEvents.map((event) => {
                            const LocationIcon = locationIcons[event.location];
                            return (
                                <div
                                    key={event.id}
                                    className="flex flex-col gap-3 rounded-xl border border-secondary bg-primary p-4 shadow-xs transition hover:border-brand-solid"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar src={getLogoUrl(event.domain)} className="size-10" />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-primary">{event.company}</span>
                                                <span className="text-sm text-tertiary">{event.title}</span>
                                            </div>
                                        </div>
                                        <Badge color={typeColors[event.type]} size="sm">
                                            {typeLabels[event.type]}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 text-sm text-tertiary">
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="size-4" />
                                            {new Date(event.date).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="size-4" />
                                            {event.time} ({event.duration})
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <LocationIcon className="size-4" />
                                            {event.location === "video"
                                                ? "Video call"
                                                : event.location === "phone"
                                                ? "Phone"
                                                : "In-person"}
                                        </div>
                                    </div>

                                    {event.notes && (
                                        <p className="text-sm text-tertiary">{event.notes}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
