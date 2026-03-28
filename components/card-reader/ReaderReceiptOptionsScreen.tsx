"use client";

import { useEffect } from "react";

type Props = {
  customerExists: boolean;
  onDone: (method: "print" | "email" | "text" | "none") => void;
  onTimeout: () => void;   // ⭐ Added this line
};

export default function ReaderReceiptOptionsScreen({
  customerExists,
  onDone,
  onTimeout,              // ⭐ Accept it here
}: Props) {

  /* -------------------------------------------------------
     AUTO-TIMEOUT (e.g., customer walks away)
     After 10 seconds → treat as no receipt chosen
  ------------------------------------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout();        // ⭐ Trigger timeout callback
    }, 10000);

    return () => clearTimeout(timer);
  }, [onTimeout]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">

      <h2 className="text-xl font-semibold">Receipt Options</h2>

      {/* ⭐ Customer with account gets all options */}
      {customerExists ? (
        <div className="flex flex-col space-y-3 w-full px-6">
          <button
            onClick={() => onDone("print")}
            className="w-full py-2 bg-gray-800 text-white rounded"
          >
            Print Receipt
          </button>

          <button
            onClick={() => onDone("email")}
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            Email Receipt
          </button>

          <button
            onClick={() => onDone("text")}
            className="w-full py-2 bg-green-600 text-white rounded"
          >
            Text Receipt
          </button>

          <button
            onClick={() => onDone("none")}
            className="w-full py-2 bg-gray-300 text-gray-700 rounded"
          >
            No Receipt
          </button>
        </div>
      ) : (
        /* ⭐ No customer → only print or none */
        <div className="flex flex-col space-y-3 w-full px-6">
          <button
            onClick={() => onDone("print")}
            className="w-full py-2 bg-gray-800 text-white rounded"
          >
            Print Receipt
          </button>

          <button
            onClick={() => onDone("none")}
            className="w-full py-2 bg-gray-300 text-gray-700 rounded"
          >
            No Receipt
          </button>
        </div>
      )}
    </div>
  );
}
