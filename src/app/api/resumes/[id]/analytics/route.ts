import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// Track an analytics event
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { eventType, metadata } = body;

        if (!eventType) {
            return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
        }

        // Create analytics event
        const event = await prisma.resumeAnalytics.create({
            data: {
                resumeId: id,
                eventType,
                metadata: metadata ? JSON.stringify(metadata) : null,
            },
        });

        return NextResponse.json({ success: true, event });
    } catch (error) {
        console.error('Error tracking analytics:', error);
        return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
    }
}

// Get analytics for a resume
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30');

        // Get events from the last N days
        const since = new Date();
        since.setDate(since.getDate() - days);

        const events = await prisma.resumeAnalytics.findMany({
            where: {
                resumeId: id,
                timestamp: {
                    gte: since,
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        // Aggregate stats
        const stats = {
            total: events.length,
            byType: events.reduce((acc, event) => {
                acc[event.eventType] = (acc[event.eventType] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            recent: events.slice(0, 10),
            timeline: generateTimeline(events, days),
        };

        return NextResponse.json({ success: true, stats });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}

// Helper function to generate timeline data for charts
function generateTimeline(events: any[], days: number) {
    const timeline: Record<string, Record<string, number>> = {};
    const today = new Date();

    // Initialize timeline with all days
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        timeline[dateKey] = {};
    }

    // Populate timeline with events
    events.forEach((event) => {
        const dateKey = event.timestamp.toISOString().split('T')[0];
        if (timeline[dateKey]) {
            timeline[dateKey][event.eventType] = (timeline[dateKey][event.eventType] || 0) + 1;
        }
    });

    // Convert to array format for charts
    return Object.entries(timeline)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, events]) => ({
            date,
            ...events,
            total: Object.values(events).reduce((sum, count) => sum + count, 0),
        }));
}
