"use client";

import { useState } from "react";

type Props = {
  onSubmit: (pin: string) => void;
};

export default function StripePinPad({ onSubmit }: Props) {
  const [pin, setPin] = useState("");

  const handlePress = (digit: string) => {
    if (pin.length >= 4) return;
    setPin((prev) => prev + digit);
  };

  const handleClear = () => setPin("");
  const handleEnter = () => {
    if (pin.length === 4) onSubmit(pin);
  };

  return (
    <div className="flex flex-col items-center space-y-4">

      {/* PIN dots */}
      <div className="flex space-x-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border border-gray-400 ${
              pin.length > i ? "bg-gray-700" : "bg-transparent"
            }`}
          />
        ))}
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-3 gap-3 text-lg font-semibold">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => handlePress(String(n))}
            className="w-16 h-16 bg-white border rounded shadow-sm hover:bg-gray-100"
          >
            {n}
          </button>
        ))}

        {/* Empty placeholder */}
        <div />

        {/* Zero */}
        <button
          onClick={() => handlePress("0")}
          className="w-16 h-16 bg-white border rounded shadow-sm hover:bg-gray-100"
        >
          0
        </button>

        {/* Empty placeholder */}
        <div />
      </div>

      {/* Clear + Enter */}
      <div className="flex space-x-4 mt-2">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Clear
        </button>

        <button
          onClick={handleEnter}
          disabled={pin.length !== 4}
          className={`px-4 py-2 rounded text-white ${
            pin.length === 4
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400"
          }`}
        >
          Enter
        </button>
      </div>
    </div>
  );
}
