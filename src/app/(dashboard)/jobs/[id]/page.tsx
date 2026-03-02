import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Job Detail — ${APP_NAME}` };

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Job Detail</h1>
      <p className="text-md text-tertiary">Full job description, skill match, and apply</p>
      <p className="text-sm text-quaternary">Coming in Phase 09</p>
    </div>
  );
}
