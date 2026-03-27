"use client";

import { useState } from "react";
import { userService } from "../../lib/userService";
import type { User } from "../../types/user";

export default function ReaderQuickSignupScreen({
  initialValue,
  onCreate,
  onBack,
}: {
  initialValue: string;
  onCreate: (user: User) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);

    const newUser: User = await userService.create({
      name,
      phone: value.includes("@") ? undefined : value,
      email: value.includes("@") ? value : undefined,
    });

    setLoading(false);
    onCreate(newUser);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 text-center">

      <h2 className="text-xl font-semibold mb-4">Quick Sign Up</h2>

      <input
        className="border rounded px-3 py-2 w-full max-w-xs mb-3 text-center"
        placeholder="First Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border rounded px-3 py-2 w-full max-w-xs mb-4 text-center"
        placeholder="Phone or Email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        onClick={handleCreate}
        disabled={!name || !value || loading}
        className="bg-green-600 text-white w-full max-w-xs py-2 rounded mb-3 disabled:bg-gray-400"
      >
        {loading ? "Creating…" : "Create Account"}
      </button>

      <button
        onClick={onBack}
        className="text-gray-600 underline text-sm"
      >
        Back
      </button>
    </div>
  );
}
