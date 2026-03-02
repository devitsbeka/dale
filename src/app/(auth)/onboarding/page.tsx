import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Onboarding — ${APP_NAME}` };

export default function OnboardingPage() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-primary p-8 shadow-lg ring-1 ring-secondary">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-display-sm font-semibold text-primary">Let&apos;s get you set up</h1>
        <p className="text-md text-tertiary">Tell us about yourself so {APP_NAME} can personalize your experience</p>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-quaternary text-center">Onboarding wizard will be implemented in Phase 06</p>
      </div>
    </div>
  );
}
