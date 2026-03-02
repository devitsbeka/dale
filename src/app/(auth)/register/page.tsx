"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { APP_NAME } from "@/lib/constants";
import { signUpWithCredentials } from "@/lib/auth-actions";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const result = await signUpWithCredentials(name, email, password);

    if (result.success) {
      router.push("/onboarding");
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-primary p-8 shadow-lg ring-1 ring-secondary">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-display-sm font-semibold text-primary">Create your account</h1>
        <p className="text-md text-tertiary">Start your career journey with {APP_NAME}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg bg-error-primary px-3 py-2 text-sm text-error-primary">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-secondary">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="rounded-lg border border-primary bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-solid"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="rounded-lg border border-primary bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-solid"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-secondary">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            minLength={8}
            className="rounded-lg border border-primary bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-solid"
          />
        </div>

        <Button
          type="submit"
          color="primary"
          size="lg"
          isLoading={loading}
          className="mt-2 w-full"
        >
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-tertiary">
        Already have an account?{" "}
        <a href="/login" className="font-semibold text-brand-secondary hover:text-brand-secondary_hover">
          Sign in
        </a>
      </p>
    </div>
  );
}
