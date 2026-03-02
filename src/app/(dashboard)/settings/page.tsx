"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/base/buttons/button";
import { usePasskey } from "@/hooks/use-passkey";
import { APP_NAME } from "@/lib/constants";
import { signOutAction } from "@/lib/auth-actions";
import { trpc } from "@/lib/trpc";

const inputClass =
  "rounded-lg border border-primary bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-solid w-full";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"profile" | "account">("profile");
  const { data: profile, refetch } = trpc.user.getProfile.useQuery();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => refetch(),
  });
  const { registerPasskey, loading: passkeyLoading } = usePasskey();
  const [passkeyStatus, setPasskeyStatus] = useState("");

  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});

  const update = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getValue = (field: string) => {
    if (field in formData) return formData[field];
    if (profile && field in profile) return (profile as Record<string, unknown>)[field] ?? "";
    return "";
  };

  async function handleSave() {
    await updateProfile.mutateAsync(formData as Parameters<typeof updateProfile.mutateAsync>[0]);
    setFormData({});
  }

  async function handleAddPasskey() {
    const result = await registerPasskey();
    setPasskeyStatus(result.success ? "Passkey registered!" : result.error ?? "Failed");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-display-sm font-semibold text-primary">Settings</h1>
      <p className="mt-1 text-md text-tertiary">Manage your {APP_NAME} account</p>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-lg bg-secondary p-1">
        {(["profile", "account"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
              tab === t
                ? "bg-primary text-primary shadow-xs"
                : "text-tertiary hover:text-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h2 className="text-lg font-semibold text-primary">Profile Information</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Headline</label>
              <input
                className={inputClass}
                value={String(getValue("headline"))}
                onChange={(e) => update("headline", e.target.value)}
                placeholder="Senior Frontend Engineer"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary">Current Title</label>
                <input
                  className={inputClass}
                  value={String(getValue("currentTitle"))}
                  onChange={(e) => update("currentTitle", e.target.value)}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary">Years of Experience</label>
                <input
                  type="number"
                  className={inputClass}
                  value={String(getValue("yearsOfExperience"))}
                  onChange={(e) => update("yearsOfExperience", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary">Location</label>
                <input
                  className={inputClass}
                  value={String(getValue("location"))}
                  onChange={(e) => update("location", e.target.value)}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary">Country</label>
                <input
                  className={inputClass}
                  value={String(getValue("country"))}
                  onChange={(e) => update("country", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Bio</label>
              <textarea
                className={inputClass + " min-h-24 resize-none"}
                value={String(getValue("bio"))}
                onChange={(e) => update("bio", e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button
                color="primary"
                size="md"
                isLoading={updateProfile.isPending}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h2 className="text-lg font-semibold text-primary">Links</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">LinkedIn</label>
              <input
                className={inputClass}
                value={String(getValue("linkedinUrl"))}
                onChange={(e) => update("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">GitHub</label>
              <input
                className={inputClass}
                value={String(getValue("githubUrl"))}
                onChange={(e) => update("githubUrl", e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Website</label>
              <input
                className={inputClass}
                value={String(getValue("websiteUrl"))}
                onChange={(e) => update("websiteUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end">
              <Button
                color="primary"
                size="md"
                isLoading={updateProfile.isPending}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {tab === "account" && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h2 className="text-lg font-semibold text-primary">Account</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">{session?.user?.name}</p>
                <p className="text-sm text-tertiary">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h2 className="text-lg font-semibold text-primary">Passkeys</h2>
            <p className="text-sm text-tertiary">
              Add a passkey for passwordless sign-in using your device&apos;s biometric authentication.
            </p>
            {passkeyStatus && (
              <p className="text-sm text-brand-secondary">{passkeyStatus}</p>
            )}
            <Button
              color="secondary"
              size="md"
              isLoading={passkeyLoading}
              onClick={handleAddPasskey}
            >
              Add Passkey
            </Button>
          </div>

          <div className="flex flex-col gap-4 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h2 className="text-lg font-semibold text-error-primary">Danger Zone</h2>
            <Button
              color="secondary-destructive"
              size="md"
              onClick={async () => {
                await signOutAction();
                window.location.href = "/login";
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
