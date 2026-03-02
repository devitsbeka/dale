import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Companies — ${APP_NAME}` };

export default function CompaniesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Company Intelligence</h1>
      <p className="text-md text-tertiary">Health scores, salary data, and deep dives</p>
      <p className="text-sm text-quaternary">Coming in Phase 26</p>
    </div>
  );
}
