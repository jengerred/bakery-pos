"use client";

import { useEffect } from "react";
import { userService } from "../../lib/userService";
import type { User } from "../../types/user";

export default function ReaderCustomerLookupScreen({
  value,
  onFound,
  onNotFound,
  onBack,
  auto = true,
}: {
  value: string;
  onFound: (user: User) => void;
  onNotFound: (value: string) => void;
  onBack: () => void;
  auto?: boolean;
}) {
  useEffect(() => {
    if (!auto) return;

    let cancelled = false;

    async function lookup() {
      const found = await userService.find(value);
      if (cancelled) return;

      if (found) onFound(found);
      else onNotFound(value);
    }

    lookup();

    return () => {
      cancelled = true;
    };
  }, [value, auto, onFound, onNotFound]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 text-center">

      <h2 className="text-xl font-semibold mb-2">Looking up account…</h2>

      <p className="text-gray-600 text-sm mb-4">{value}</p>

      <div className="animate-pulse text-gray-500 mb-6">Searching…</div>

      <button
        onClick={onBack}
        className="text-gray-600 underline text-sm"
      >
        Back
      </button>
    </div>
  );
}
