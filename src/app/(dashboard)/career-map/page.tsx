import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Career Map — ${APP_NAME}` };

export default function CareerMapPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
      <h1 className="text-display-sm font-semibold text-primary">Career Map</h1>
      <p className="text-md text-tertiary">3D interactive visualization of your career landscape</p>
      <p className="text-sm text-quaternary">Coming in Phase 31</p>
    </div>
  );
}
