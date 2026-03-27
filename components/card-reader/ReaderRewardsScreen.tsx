"use client";

import { useState } from "react";

export default function ReaderRewardsScreen({
  onSubmit,
  onSkip,
}: {
  onSubmit: (value: string) => void;
  onSkip: () => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 text-center">

      <h2 className="text-xl font-bold mb-4">Rewards?</h2>

      <p className="text-sm text-gray-600 mb-4">
        Enter phone or email to earn points.
      </p>

      <input
        className="border rounded px-3 py-2 w-full max-w-xs mb-4 text-center"
        placeholder="Phone or Email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white w-full max-w-xs py-2 rounded mb-3 disabled:bg-gray-400"
        disabled={!value}
        onClick={() => onSubmit(value)}
      >
        Continue
      </button>

      <button
        className="text-gray-600 underline text-sm"
        onClick={onSkip}
      >
        Skip
      </button>
    </div>
  );
}
