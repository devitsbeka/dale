'use client';

import React from 'react';
import { useResumeAnalytics } from '@/hooks/resume/useResumeAnalytics';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    Eye,
    Download03,
    Share07,
    Edit05,
    RefreshCcw01,
} from '@untitledui/icons';

interface AnalyticsPanelProps {
    resumeId: string;
    days?: number;
}

export function AnalyticsPanel({ resumeId, days = 30 }: AnalyticsPanelProps) {
    const { stats, isLoading, error } = useResumeAnalytics(resumeId, days);

    if (isLoading) {
        return (
            <div className="rounded-lg border border-secondary bg-primary p-8">
                <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-brand-600" />
                    <span className="ml-3 text-sm text-tertiary">Loading analytics...</span>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="rounded-lg border border-secondary bg-primary p-8">
                <p className="text-center text-sm text-tertiary">
                    {error || 'No analytics data available'}
                </p>
            </div>
        );
    }

    const eventTypeIcons = {
        view: Eye,
        export: Download03,
        share: Share07,
        edit: Edit05,
        restore: RefreshCcw01,
    };

    const eventTypeColors = {
        view: '#3B82F6',
        export: '#10B981',
        share: '#8B5CF6',
        edit: '#F59E0B',
        restore: '#EF4444',
    };

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {Object.entries(stats.byType).map(([type, count]) => {
                    const Icon = eventTypeIcons[type as keyof typeof eventTypeIcons];
                    const color = eventTypeColors[type as keyof typeof eventTypeColors];

                    return (
                        <div
                            key={type}
                            className="rounded-lg border border-secondary bg-primary p-4"
                        >
                            <div className="flex items-center gap-2">
                                {Icon && <Icon className="h-5 w-5" style={{ color }} />}
                                <span className="text-xs font-medium capitalize text-secondary">
                                    {type}s
                                </span>
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-primary">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Timeline Chart */}
            <div className="rounded-lg border border-secondary bg-primary p-6">
                <h3 className="mb-4 text-lg font-semibold text-primary">Activity Timeline</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.timeline}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis
                                dataKey="date"
                                stroke="var(--color-text-tertiary)"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis stroke="var(--color-text-tertiary)" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            {Object.keys(stats.byType).map((type) => (
                                <Line
                                    key={type}
                                    type="monotone"
                                    dataKey={type}
                                    stroke={eventTypeColors[type as keyof typeof eventTypeColors]}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Event Distribution */}
            <div className="rounded-lg border border-secondary bg-primary p-6">
                <h3 className="mb-4 text-lg font-semibold text-primary">Event Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={Object.entries(stats.byType).map(([type, count]) => ({
                                type: type.charAt(0).toUpperCase() + type.slice(1),
                                count,
                            }))}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis
                                dataKey="type"
                                stroke="var(--color-text-tertiary)"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis stroke="var(--color-text-tertiary)" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '8px',
                                }}
                            />
                            <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Events */}
            <div className="rounded-lg border border-secondary bg-primary p-6">
                <h3 className="mb-4 text-lg font-semibold text-primary">Recent Activity</h3>
                {stats.recent.length === 0 ? (
                    <p className="text-sm text-tertiary">No recent activity</p>
                ) : (
                    <div className="space-y-3">
                        {stats.recent.map((event) => {
                            const Icon = eventTypeIcons[event.eventType as keyof typeof eventTypeIcons];
                            const color = eventTypeColors[event.eventType as keyof typeof eventTypeColors];
                            const timestamp = new Date(event.timestamp);

                            return (
                                <div
                                    key={event.id}
                                    className="flex items-center gap-3 rounded-lg bg-secondary/10 p-3"
                                >
                                    {Icon && (
                                        <div
                                            className="flex h-8 w-8 items-center justify-center rounded-full"
                                            style={{ backgroundColor: `${color}20` }}
                                        >
                                            <Icon className="h-4 w-4" style={{ color }} />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium capitalize text-primary">
                                            {event.eventType}
                                        </p>
                                        <p className="text-xs text-tertiary">
                                            {timestamp.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
