import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `AI Agents — ${APP_NAME}` };

export default function AgentsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">OpenClaw Agents</h1>
      <p className="text-md text-tertiary">Your team of AI-powered career agents</p>
      <p className="text-sm text-quaternary">Coming in Phase 27</p>
    </div>
  );
}
