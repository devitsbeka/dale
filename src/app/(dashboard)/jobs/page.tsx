import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Jobs — ${APP_NAME}` };

export default function JobsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Job Board</h1>
      <p className="text-md text-tertiary">Browse and search thousands of opportunities</p>
      <p className="text-sm text-quaternary">Coming in Phase 08</p>
    </div>
  );
}
