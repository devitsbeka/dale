import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Opportunity Radar — ${APP_NAME}` };

export default function RadarPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Opportunity Radar</h1>
      <p className="text-md text-tertiary">Real-time career signals and opportunities</p>
      <p className="text-sm text-quaternary">Coming in Phase 21</p>
    </div>
  );
}
