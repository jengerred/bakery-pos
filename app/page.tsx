"use client";

import { Suspense } from "react";
import POSPage from "./POSPage";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading POS…</div>}>
      <POSPage />
    </Suspense>
  );
}
