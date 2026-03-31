"use client";

import { useEffect } from "react";

/* -------------------------------------------------------
   🧾 Types
------------------------------------------------------- */
type Props = {
  customerExists: boolean;
  onDone: (method: "print" | "email" | "text" | "none") => void;
  onTimeout: () => void;
};

/* -------------------------------------------------------
   🧱 ReaderReceiptOptionsScreen
   Customer-facing receipt selection screen.
   
   🎨 UPDATED: Added Lilac branding and Dark Mode support.
------------------------------------------------------- */
export default function ReaderReceiptOptionsScreen({
  customerExists,
  onDone,
  onTimeout,
}: Props) {

  /* -------------------------------------------------------
     ⏱️ SNAPPY AUTO-ADVANCE
  ------------------------------------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone("print"); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-4 bg-white dark:bg-slate-900 transition-colors duration-500">

      <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
        Receipt Options
      </h2>

      <div className="flex flex-col space-y-3 w-full px-4">
        {/* ⭐ PRIMARY OPTION - Updated to Brand Lilac */}
        <button
          onClick={() => onDone("print")}
          className="w-full py-4 bg-brand text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 hover:bg-brand-hover transition-all"
        >
          Print Receipt
        </button>

        {customerExists && (
          <>
            <button
              onClick={() => onDone("email")}
              className="w-full py-4 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all"
            >
              Email Receipt
            </button>

            <button
              onClick={() => onDone("text")}
              className="w-full py-4 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all"
            >
              Text Receipt
            </button>
          </>
        )}

        {/* ⭐ DECLINE OPTION */}
        <button
          onClick={() => onDone("none")}
          className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-bold active:scale-95 transition-all"
        >
          No Receipt
        </button>
      </div>

      {/* ⏳ Snappy Status Hint */}
      <p className="text-[10px] text-slate-400 dark:text-brand/60 uppercase tracking-widest animate-pulse font-bold">
        Auto-printing in 2s...
      </p>
    </div>
  );
}