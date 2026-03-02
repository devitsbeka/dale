"use client";

import { useState } from "react";
import { Briefcase01, TrendUp01, Lightning01, BookOpen01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";

type SignalType = "job" | "trend" | "opportunity" | "learning";
interface Signal {
  id: string;
  type: SignalType;
  title: string;
  description: string;
  relevance: number;
  source: string;
  time: string;
  tags: string[];
}

const ICONS: Record<SignalType, React.FC<{ className?: string }>> = {
  job: Briefcase01,
  trend: TrendUp01,
  opportunity: Lightning01,
  learning: BookOpen01,
};

const TYPE_COLORS: Record<SignalType, "brand" | "success" | "warning" | "blue"> = {
  job: "brand",
  trend: "success",
  opportunity: "warning",
  learning: "blue",
};

// Mock signals — in production these come from SSE + DB
const MOCK_SIGNALS: Signal[] = [
  { id: "1", type: "job", title: "Senior Frontend Engineer at Stripe", description: "New opening matching 85% of your skills. Remote-friendly, $180k-$240k base.", relevance: 92, source: "Job Match", time: "2h ago", tags: ["React", "TypeScript", "Remote"] },
  { id: "2", type: "trend", title: "AI/ML Engineer demand up 34%", description: "Roles requiring ML skills grew 34% QoQ. Consider adding Python ML to your toolkit.", relevance: 87, source: "Market Trend", time: "5h ago", tags: ["AI/ML", "Growth", "Skills Gap"] },
  { id: "3", type: "opportunity", title: "Your company is hiring for Lead roles", description: "3 new Lead Engineer positions opened at your company. Internal mobility advantage.", relevance: 85, source: "Company Intel", time: "1d ago", tags: ["Promotion", "Leadership"] },
  { id: "4", type: "learning", title: "AWS Solutions Architect certification trending", description: "Professionals with this cert earn 23% more. Matches your cloud skills.", relevance: 78, source: "Skill Intel", time: "1d ago", tags: ["AWS", "Certification", "Cloud"] },
  { id: "5", type: "job", title: "Staff Engineer at Vercel", description: "Vercel is expanding their framework team. Strong match for your Next.js expertise.", relevance: 88, source: "Job Match", time: "3h ago", tags: ["Next.js", "Vercel", "Staff"] },
  { id: "6", type: "trend", title: "Rust adoption growing in web infrastructure", description: "Rust usage in backend/infra roles up 45% YoY. High demand, low supply.", relevance: 72, source: "Market Trend", time: "2d ago", tags: ["Rust", "Infrastructure"] },
  { id: "7", type: "opportunity", title: "Tech conference CFP deadline approaching", description: "ReactConf 2026 CFP closes in 2 weeks. Speaking boosts visibility significantly.", relevance: 65, source: "Network", time: "3d ago", tags: ["Speaking", "React", "Networking"] },
  { id: "8", type: "learning", title: "System Design interviews trending", description: "72% of senior+ interviews now include system design. Practice recommended.", relevance: 80, source: "Interview Intel", time: "1d ago", tags: ["System Design", "Interviews"] },
];

export default function RadarPage() {
  const [filter, setFilter] = useState<SignalType | "all">("all");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const signals = MOCK_SIGNALS
    .filter((s) => !dismissed.has(s.id))
    .filter((s) => filter === "all" || s.type === filter)
    .sort((a, b) => b.relevance - a.relevance);

  const typeCount = {
    all: MOCK_SIGNALS.filter((s) => !dismissed.has(s.id)).length,
    job: MOCK_SIGNALS.filter((s) => !dismissed.has(s.id) && s.type === "job").length,
    trend: MOCK_SIGNALS.filter((s) => !dismissed.has(s.id) && s.type === "trend").length,
    opportunity: MOCK_SIGNALS.filter((s) => !dismissed.has(s.id) && s.type === "opportunity").length,
    learning: MOCK_SIGNALS.filter((s) => !dismissed.has(s.id) && s.type === "learning").length,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Opportunity Radar</h1>
        <p className="text-md text-tertiary">
          Real-time career signals personalized to your profile
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "job", "trend", "opportunity", "learning"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              filter === type
                ? "bg-brand-solid text-white"
                : "bg-secondary text-secondary hover:bg-tertiary"
            }`}
          >
            {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
            <span className="ml-1.5 opacity-70">{typeCount[type]}</span>
          </button>
        ))}
      </div>

      {/* Signal cards */}
      <div className="mt-6 flex flex-col gap-3">
        {signals.map((signal) => {
          const Icon = ICONS[signal.type];
          return (
            <div
              key={signal.id}
              className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary transition hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary`}>
                  <Icon className="size-5 text-fg-quaternary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-md font-semibold text-primary">{signal.title}</p>
                      <p className="mt-0.5 text-sm text-tertiary">{signal.description}</p>
                    </div>
                    <span className={`shrink-0 text-sm font-bold ${
                      signal.relevance >= 85 ? "text-success-primary" :
                      signal.relevance >= 70 ? "text-brand-primary" :
                      "text-tertiary"
                    }`}>
                      {signal.relevance}%
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge color={TYPE_COLORS[signal.type]} size="sm">{signal.source}</Badge>
                    {signal.tags.map((tag) => (
                      <Badge key={tag} color="gray" size="sm">{tag}</Badge>
                    ))}
                    <span className="ml-auto text-xs text-quaternary">{signal.time}</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button color="secondary" size="sm">View Details</Button>
                    <Button
                      color="tertiary"
                      size="sm"
                      onClick={() => setDismissed(new Set([...dismissed, signal.id]))}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {signals.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-secondary py-16">
            <p className="text-lg font-semibold text-primary">All caught up!</p>
            <p className="text-sm text-tertiary">No more signals to review</p>
          </div>
        )}
      </div>
    </div>
  );
}
