"use client";

import { useState } from "react";
import {
    Bell01,
    CreditCard01,
    Globe02,
    Key01,
    Link01,
    Lock01,
    Mail01,
    Moon01,
    Shield01,
    User01,
} from "@untitledui/icons";
import { useTheme } from "next-themes";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { PageLayout } from "./page-layout";

type SettingsSection = "profile" | "notifications" | "security" | "integrations" | "billing";

export const SettingsPage = () => {
    const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
    const { resolvedTheme, setTheme } = useTheme();
    const isDarkMode = resolvedTheme === "dark";

    // Profile state
    const [profile, setProfile] = useState({
        name: "Beka",
        email: "beka@example.com",
        title: "Senior Product Designer",
        location: "San Francisco, CA",
    });

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailApplications: true,
        emailInterviews: true,
        emailOffers: true,
        pushApplications: true,
        pushInterviews: true,
        pushReminders: true,
        weeklyDigest: true,
    });

    const sections = [
        { id: "profile" as const, label: "Profile", icon: User01 },
        { id: "notifications" as const, label: "Notifications", icon: Bell01 },
        { id: "security" as const, label: "Security", icon: Shield01 },
        { id: "integrations" as const, label: "Integrations", icon: Link01 },
        { id: "billing" as const, label: "Billing", icon: CreditCard01 },
    ];

    const integrations = [
        { name: "LinkedIn", connected: true, icon: "linkedin.com" },
        { name: "Gmail", connected: true, icon: "google.com" },
        { name: "Google Calendar", connected: true, icon: "calendar.google.com" },
        { name: "Slack", connected: false, icon: "slack.com" },
        { name: "Notion", connected: false, icon: "notion.so" },
    ];

    return (
        <PageLayout activeUrl="/settings">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                        <SectionHeader.Heading>Settings</SectionHeader.Heading>
                        <p className="text-sm text-tertiary">
                            Manage your account settings and preferences
                        </p>
                    </div>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <div className="grid gap-8 lg:grid-cols-4">
                {/* Sidebar */}
                <div className="flex flex-col gap-1">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                                    activeSection === section.id
                                        ? "bg-brand-secondary text-brand-primary"
                                        : "text-tertiary hover:bg-secondary hover:text-primary"
                                }`}
                            >
                                <Icon className="size-5" />
                                <span className="font-medium">{section.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    {activeSection === "profile" && (
                        <div className="flex flex-col gap-6">
                            <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                                <h3 className="text-md font-semibold text-primary mb-6">Profile Information</h3>

                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar
                                        src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"
                                        className="size-16"
                                    />
                                    <div>
                                        <Button color="secondary" size="sm">Change photo</Button>
                                        <p className="mt-1 text-xs text-tertiary">JPG, PNG or GIF. Max 2MB.</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-secondary">Full name</label>
                                        <Input
                                            value={profile.name}
                                            onChange={(value) => setProfile({ ...profile, name: value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-secondary">Email</label>
                                        <Input
                                            type="email"
                                            value={profile.email}
                                            onChange={(value) => setProfile({ ...profile, email: value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-secondary">Job title</label>
                                        <Input
                                            value={profile.title}
                                            onChange={(value) => setProfile({ ...profile, title: value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-secondary">Location</label>
                                        <Input
                                            value={profile.location}
                                            onChange={(value) => setProfile({ ...profile, location: value })}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button color="primary" size="md">Save changes</Button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                                <h3 className="text-md font-semibold text-primary mb-4">Appearance</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Moon01 className="size-5 text-fg-tertiary" />
                                        <div>
                                            <p className="font-medium text-primary">Dark mode</p>
                                            <p className="text-sm text-tertiary">Toggle dark theme</p>
                                        </div>
                                    </div>
                                    <Toggle
                                        isSelected={isDarkMode}
                                        onChange={(isSelected) => setTheme(isSelected ? "dark" : "light")}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "notifications" && (
                        <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                            <h3 className="text-md font-semibold text-primary mb-6">Notification Preferences</h3>

                            <div className="flex flex-col gap-6">
                                <div>
                                    <h4 className="font-medium text-primary mb-4 flex items-center gap-2">
                                        <Mail01 className="size-4" />
                                        Email Notifications
                                    </h4>
                                    <div className="flex flex-col gap-4 pl-6">
                                        {[
                                            { key: "emailApplications" as const, label: "Application updates", desc: "When your application status changes" },
                                            { key: "emailInterviews" as const, label: "Interview reminders", desc: "24 hours before scheduled interviews" },
                                            { key: "emailOffers" as const, label: "Offer notifications", desc: "When you receive a new offer" },
                                            { key: "weeklyDigest" as const, label: "Weekly digest", desc: "Summary of your job search progress" },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-primary">{item.label}</p>
                                                    <p className="text-sm text-tertiary">{item.desc}</p>
                                                </div>
                                                <Toggle
                                                    isSelected={notifications[item.key]}
                                                    onChange={(isSelected) =>
                                                        setNotifications({ ...notifications, [item.key]: isSelected })
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-secondary pt-6">
                                    <h4 className="font-medium text-primary mb-4 flex items-center gap-2">
                                        <Bell01 className="size-4" />
                                        Push Notifications
                                    </h4>
                                    <div className="flex flex-col gap-4 pl-6">
                                        {[
                                            { key: "pushApplications" as const, label: "Application updates", desc: "Real-time status changes" },
                                            { key: "pushInterviews" as const, label: "Interview alerts", desc: "Upcoming interview reminders" },
                                            { key: "pushReminders" as const, label: "Task reminders", desc: "Follow-up and deadline alerts" },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-primary">{item.label}</p>
                                                    <p className="text-sm text-tertiary">{item.desc}</p>
                                                </div>
                                                <Toggle
                                                    isSelected={notifications[item.key]}
                                                    onChange={(isSelected) =>
                                                        setNotifications({ ...notifications, [item.key]: isSelected })
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "security" && (
                        <div className="flex flex-col gap-6">
                            <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                                <h3 className="text-md font-semibold text-primary mb-6">Password</h3>
                                <div className="flex flex-col gap-4 max-w-md">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-secondary">Current password</label>
                                        <Input type="password" placeholder="Enter current password" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-secondary">New password</label>
                                        <Input type="password" placeholder="Enter new password" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-secondary">Confirm password</label>
                                        <Input type="password" placeholder="Confirm new password" />
                                    </div>
                                    <Button color="primary" size="md" className="self-start mt-2">
                                        Update password
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                                <h3 className="text-md font-semibold text-primary mb-4">Two-Factor Authentication</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FeaturedIcon icon={Lock01} color="success" theme="modern" size="md" />
                                        <div>
                                            <p className="font-medium text-primary">2FA Enabled</p>
                                            <p className="text-sm text-tertiary">Your account is protected with authenticator app</p>
                                        </div>
                                    </div>
                                    <Badge color="success" size="md">Active</Badge>
                                </div>
                            </div>

                            <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                                <h3 className="text-md font-semibold text-primary mb-4">Active Sessions</h3>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                                        <div className="flex items-center gap-3">
                                            <Globe02 className="size-5 text-fg-tertiary" />
                                            <div>
                                                <p className="font-medium text-primary">Chrome on MacOS</p>
                                                <p className="text-sm text-tertiary">San Francisco, CA • Current session</p>
                                            </div>
                                        </div>
                                        <Badge color="success" size="sm">Active</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                                        <div className="flex items-center gap-3">
                                            <Globe02 className="size-5 text-fg-tertiary" />
                                            <div>
                                                <p className="font-medium text-primary">Safari on iPhone</p>
                                                <p className="text-sm text-tertiary">San Francisco, CA • 2 hours ago</p>
                                            </div>
                                        </div>
                                        <Button color="tertiary" size="sm">Revoke</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "integrations" && (
                        <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                            <h3 className="text-md font-semibold text-primary mb-6">Connected Apps</h3>
                            <div className="flex flex-col gap-4">
                                {integrations.map((integration) => (
                                    <div
                                        key={integration.name}
                                        className="flex items-center justify-between p-4 rounded-lg border border-secondary"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                src={`https://img.logo.dev/${integration.icon}?token=pk_JsCdE0PFQ2mPn6GETPLiIw`}
                                                className="size-10"
                                            />
                                            <div>
                                                <p className="font-medium text-primary">{integration.name}</p>
                                                <p className="text-sm text-tertiary">
                                                    {integration.connected ? "Connected" : "Not connected"}
                                                </p>
                                            </div>
                                        </div>
                                        {integration.connected ? (
                                            <Button color="secondary" size="sm">Disconnect</Button>
                                        ) : (
                                            <Button color="primary" size="sm">Connect</Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === "billing" && (
                        <div className="flex flex-col gap-6">
                            <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-md font-semibold text-primary">Current Plan</h3>
                                        <p className="text-sm text-tertiary">You are on the Pro plan</p>
                                    </div>
                                    <Badge color="brand" size="lg">Pro</Badge>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                                    <div className="p-4 rounded-lg bg-secondary">
                                        <p className="text-2xl font-semibold text-primary">$29</p>
                                        <p className="text-sm text-tertiary">per month</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-secondary">
                                        <p className="text-2xl font-semibold text-primary">Unlimited</p>
                                        <p className="text-sm text-tertiary">applications</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-secondary">
                                        <p className="text-2xl font-semibold text-primary">5</p>
                                        <p className="text-sm text-tertiary">team members</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button color="secondary" size="md">Change plan</Button>
                                    <Button color="tertiary" size="md">Cancel subscription</Button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                                <h3 className="text-md font-semibold text-primary mb-4">Payment Method</h3>
                                <div className="flex items-center justify-between p-4 rounded-lg border border-secondary">
                                    <div className="flex items-center gap-3">
                                        <FeaturedIcon icon={CreditCard01} color="gray" theme="modern" size="md" />
                                        <div>
                                            <p className="font-medium text-primary">Visa ending in 4242</p>
                                            <p className="text-sm text-tertiary">Expires 12/2027</p>
                                        </div>
                                    </div>
                                    <Button color="secondary" size="sm">Update</Button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-secondary bg-primary p-6 shadow-xs">
                                <h3 className="text-md font-semibold text-primary mb-4">Billing History</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-secondary">
                                                <th className="pb-3 text-left text-sm font-medium text-tertiary">Date</th>
                                                <th className="pb-3 text-left text-sm font-medium text-tertiary">Description</th>
                                                <th className="pb-3 text-left text-sm font-medium text-tertiary">Amount</th>
                                                <th className="pb-3 text-left text-sm font-medium text-tertiary">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-secondary">
                                            {[
                                                { date: "Jan 1, 2026", desc: "Pro plan - Monthly", amount: "$29.00", status: "Paid" },
                                                { date: "Dec 1, 2025", desc: "Pro plan - Monthly", amount: "$29.00", status: "Paid" },
                                                { date: "Nov 1, 2025", desc: "Pro plan - Monthly", amount: "$29.00", status: "Paid" },
                                            ].map((invoice, idx) => (
                                                <tr key={idx}>
                                                    <td className="py-3 text-sm text-primary">{invoice.date}</td>
                                                    <td className="py-3 text-sm text-tertiary">{invoice.desc}</td>
                                                    <td className="py-3 text-sm font-medium text-primary">{invoice.amount}</td>
                                                    <td className="py-3">
                                                        <Badge color="success" size="sm">{invoice.status}</Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};
