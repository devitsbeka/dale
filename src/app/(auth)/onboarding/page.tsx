"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { APP_NAME, ONBOARDING_STEPS } from "@/lib/constants";
import { trpc } from "@/lib/trpc";

type OnboardingData = {
  headline: string;
  currentTitle: string;
  location: string;
  country: string;
  yearsOfExperience: number;
  bio: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
  desiredTitle: string;
  desiredSalaryMin: number;
  desiredSalaryMax: number;
  desiredSalaryCurrency: string;
  openToRemote: boolean;
  openToRelocation: boolean;
};

const inputClass =
  "rounded-lg border border-primary bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-solid w-full";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    headline: "",
    currentTitle: "",
    location: "",
    country: "",
    yearsOfExperience: 0,
    bio: "",
    linkedinUrl: "",
    githubUrl: "",
    websiteUrl: "",
    desiredTitle: "",
    desiredSalaryMin: 0,
    desiredSalaryMax: 0,
    desiredSalaryCurrency: "USD",
    openToRemote: true,
    openToRelocation: false,
  });

  const updateProfile = trpc.user.updateProfile.useMutation();
  const completeOnboarding = trpc.user.completeOnboarding.useMutation();

  const update = (field: keyof OnboardingData, value: string | number | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleComplete() {
    const profileData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== "" && value !== 0 && value !== false) {
        profileData[key] = value;
      }
    }
    await updateProfile.mutateAsync(profileData as Parameters<typeof updateProfile.mutateAsync>[0]);
    await completeOnboarding.mutateAsync();
    router.push("/");
    router.refresh();
  }

  const currentStep = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-primary p-8 shadow-lg ring-1 ring-secondary">
      {/* Progress */}
      <div className="flex gap-1.5">
        {ONBOARDING_STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`h-1.5 flex-1 rounded-full ${
              i <= step ? "bg-brand-solid" : "bg-tertiary"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-secondary">
          Step {step + 1} of {ONBOARDING_STEPS.length}
        </p>
        <h1 className="text-display-xs font-semibold text-primary">{currentStep.label}</h1>
        <p className="text-sm text-tertiary">{currentStep.description}</p>
      </div>

      <div className="flex flex-col gap-4">
        {step === 0 && (
          <>
            <Field label="Headline" placeholder="e.g. Senior Frontend Engineer">
              <input
                className={inputClass}
                value={data.headline}
                onChange={(e) => update("headline", e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
              />
            </Field>
            <Field label="Current Title">
              <input
                className={inputClass}
                value={data.currentTitle}
                onChange={(e) => update("currentTitle", e.target.value)}
                placeholder="Your current role"
              />
            </Field>
            <div className="flex gap-3">
              <Field label="Location" className="flex-1">
                <input
                  className={inputClass}
                  value={data.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="City"
                />
              </Field>
              <Field label="Country" className="flex-1">
                <input
                  className={inputClass}
                  value={data.country}
                  onChange={(e) => update("country", e.target.value)}
                  placeholder="Country"
                />
              </Field>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Years of Experience">
              <input
                type="number"
                className={inputClass}
                value={data.yearsOfExperience || ""}
                onChange={(e) => update("yearsOfExperience", parseInt(e.target.value) || 0)}
                placeholder="0"
                min={0}
              />
            </Field>
            <Field label="Bio">
              <textarea
                className={inputClass + " min-h-24 resize-none"}
                value={data.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="Tell us about your career journey..."
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-tertiary">
              You&apos;ll add specific skills after onboarding. For now, tell us about your links.
            </p>
            <Field label="LinkedIn URL">
              <input
                className={inputClass}
                value={data.linkedinUrl}
                onChange={(e) => update("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </Field>
            <Field label="GitHub URL">
              <input
                className={inputClass}
                value={data.githubUrl}
                onChange={(e) => update("githubUrl", e.target.value)}
                placeholder="https://github.com/..."
              />
            </Field>
            <Field label="Website">
              <input
                className={inputClass}
                value={data.websiteUrl}
                onChange={(e) => update("websiteUrl", e.target.value)}
                placeholder="https://..."
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <>
            <Field label="Desired Salary Range (yearly)">
              <div className="flex gap-3">
                <input
                  type="number"
                  className={inputClass}
                  value={data.desiredSalaryMin || ""}
                  onChange={(e) => update("desiredSalaryMin", parseInt(e.target.value) || 0)}
                  placeholder="Min"
                />
                <input
                  type="number"
                  className={inputClass}
                  value={data.desiredSalaryMax || ""}
                  onChange={(e) => update("desiredSalaryMax", parseInt(e.target.value) || 0)}
                  placeholder="Max"
                />
              </div>
            </Field>
            <Field label="Currency">
              <select
                className={inputClass}
                value={data.desiredSalaryCurrency}
                onChange={(e) => update("desiredSalaryCurrency", e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (&euro;)</option>
                <option value="GBP">GBP (&pound;)</option>
                <option value="GEL">GEL (&#x20BE;)</option>
              </select>
            </Field>
          </>
        )}

        {step === 4 && (
          <>
            <Field label="Desired Role Title">
              <input
                className={inputClass}
                value={data.desiredTitle}
                onChange={(e) => update("desiredTitle", e.target.value)}
                placeholder="e.g. Staff Engineer, Engineering Manager"
              />
            </Field>
            <label className="flex items-center gap-3 rounded-lg border border-primary p-3">
              <input
                type="checkbox"
                checked={data.openToRemote}
                onChange={(e) => update("openToRemote", e.target.checked)}
                className="size-4 rounded"
              />
              <span className="text-sm text-secondary">Open to remote work</span>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-primary p-3">
              <input
                type="checkbox"
                checked={data.openToRelocation}
                onChange={(e) => update("openToRelocation", e.target.checked)}
                className="size-4 rounded"
              />
              <span className="text-sm text-secondary">Open to relocation</span>
            </label>
          </>
        )}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <Button
            type="button"
            color="secondary"
            size="lg"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1"
          >
            Back
          </Button>
        )}
        {!isLast ? (
          <Button
            type="button"
            color="primary"
            size="lg"
            onClick={() => setStep((s) => s + 1)}
            className="flex-1"
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            color="primary"
            size="lg"
            isLoading={updateProfile.isPending || completeOnboarding.isPending}
            onClick={handleComplete}
            className="flex-1"
          >
            Complete Setup
          </Button>
        )}
      </div>

      <button
        onClick={handleComplete}
        className="text-center text-sm text-quaternary hover:text-tertiary"
      >
        Skip for now
      </button>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <label className="text-sm font-medium text-secondary">{label}</label>
      {children}
    </div>
  );
}
