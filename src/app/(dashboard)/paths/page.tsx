import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Career Paths — ${APP_NAME}` };

export default function PathsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Path Simulator</h1>
      <p className="text-md text-tertiary">Visualize career trajectories and simulate outcomes</p>
      <p className="text-sm text-quaternary">Coming in Phase 20</p>
    </div>
  );
}
