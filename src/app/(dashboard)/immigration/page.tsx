import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Immigration — ${APP_NAME}` };

export default function ImmigrationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Immigration Intelligence</h1>
      <p className="text-md text-tertiary">Visa explorer, probabilities, and pathways</p>
      <p className="text-sm text-quaternary">Coming in Phase 23</p>
    </div>
  );
}
