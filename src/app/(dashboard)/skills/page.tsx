import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Skills — ${APP_NAME}` };

export default function SkillsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Skills Genome</h1>
      <p className="text-md text-tertiary">Your skill profile, gap analysis, and growth paths</p>
      <p className="text-sm text-quaternary">Coming in Phase 15</p>
    </div>
  );
}
