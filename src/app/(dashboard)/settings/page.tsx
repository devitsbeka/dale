import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Settings — ${APP_NAME}` };

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Settings</h1>
      <p className="text-md text-tertiary">Profile, account, and preferences</p>
      <p className="text-sm text-quaternary">Coming in Phase 06</p>
    </div>
  );
}
