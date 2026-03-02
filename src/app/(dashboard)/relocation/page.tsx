import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Relocation — ${APP_NAME}` };

export default function RelocationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Relocation Intelligence</h1>
      <p className="text-md text-tertiary">City comparison, cost of living, and Life Score</p>
      <p className="text-sm text-quaternary">Coming in Phase 22</p>
    </div>
  );
}
