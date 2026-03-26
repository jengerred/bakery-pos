"use client";

import { useState } from "react";

type TerminalStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "waiting"       // ⭐ NEW
  | "collecting"
  | "succeeded"
  | "failed";

export function useTerminalSimulation() {
  const [status, setStatus] = useState<TerminalStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);

  function connect() {
    setError(null);
    setStatus("connecting");

    // Simulate connecting
    setTimeout(() => {
      setStatus("connected");

      // ⭐ After connecting, reader waits for customer
      setTimeout(() => {
        setStatus("waiting");
      }, 300);
    }, 800);
  }

  async function collectPayment(
    amountInCents: number,
    onSuccess: (paymentIntentId: string) => void
  ) {
    try {
      setError(null);
      setStatus("collecting");

      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({ amount: amountInCents }),
      });

      const { clientSecret, error } = await res.json();

      if (error || !clientSecret) {
        setStatus("failed");
        setError(error || "Failed to create PaymentIntent");
        return;
      }

      // Simulate reader processing
      setTimeout(() => {
        const fakePaymentIntentId =
          "pi_simulated_" + Math.random().toString(36).slice(2);

        setStatus("succeeded");
        onSuccess(fakePaymentIntentId);
      }, 1500);
    } catch (e: any) {
      setStatus("failed");
      setError(e.message || "Terminal simulation error");
    }
  }

  function reset() {
    // ⭐ Reset to connected → waiting
    setStatus("connected");
    setError(null);

    setTimeout(() => {
      setStatus("waiting");
    }, 300);
  }

  return {
    status,
    error,
    connect,
    collectPayment,
    reset,
  };
}
