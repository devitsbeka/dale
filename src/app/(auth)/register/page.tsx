import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Create Account — ${APP_NAME}` };

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-primary p-8 shadow-lg ring-1 ring-secondary">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-display-sm font-semibold text-primary">Create your account</h1>
        <p className="text-md text-tertiary">Start your career journey with {APP_NAME}</p>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-quaternary text-center">Registration form will be implemented in Phase 03</p>
      </div>
    </div>
  );
}
