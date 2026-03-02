import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Salary — ${APP_NAME}` };

export default function SalaryPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Compensation Reality Engine</h1>
      <p className="text-md text-tertiary">Salary explorer, calculator, and negotiation ranges</p>
      <p className="text-sm text-quaternary">Coming in Phase 14</p>
    </div>
  );
}
