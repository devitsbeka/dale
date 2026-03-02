import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Planeta Indices — ${APP_NAME}` };

export default function IndicesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Planeta Indices</h1>
      <p className="text-md text-tertiary">Public salary, skills, and labor flow indices</p>
      <p className="text-sm text-quaternary">Coming in Phase 30</p>
    </div>
  );
}
