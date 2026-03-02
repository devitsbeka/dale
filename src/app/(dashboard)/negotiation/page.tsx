import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Negotiation — ${APP_NAME}` };

export default function NegotiationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Negotiation Intelligence</h1>
      <p className="text-md text-tertiary">AI-powered prep, scripts, and offer comparison</p>
      <p className="text-sm text-quaternary">Coming in Phase 19</p>
    </div>
  );
}
