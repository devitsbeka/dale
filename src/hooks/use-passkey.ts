"use client";

import { useState } from "react";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

export function usePasskey() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function registerPasskey() {
    setLoading(true);
    setError(null);
    try {
      const optionsRes = await fetch("/api/auth/webauthn/register", {
        method: "POST",
      });
      const options = await optionsRes.json();
      if (!optionsRes.ok) throw new Error(options.error);

      const credential = await startRegistration(options);

      const verifyRes = await fetch("/api/auth/webauthn/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });
      const result = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(result.error);

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to register passkey";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  async function authenticateWithPasskey() {
    setLoading(true);
    setError(null);
    try {
      const optionsRes = await fetch("/api/auth/webauthn/authenticate", {
        method: "POST",
      });
      const options = await optionsRes.json();
      if (!optionsRes.ok) throw new Error(options.error);

      const credential = await startAuthentication(options);

      const verifyRes = await fetch("/api/auth/webauthn/authenticate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });
      const result = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(result.error);

      return { success: true, userId: result.userId };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to authenticate";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  return {
    registerPasskey,
    authenticateWithPasskey,
    loading,
    error,
  };
}
