"use client";

import { OrderHistoryProvider } from "./pos/context/OrderHistoryContext";
import { Toaster } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./globals.css";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Elements stripe={stripePromise}>
          <OrderHistoryProvider>
            {children}
            <Toaster position="top-right" />
          </OrderHistoryProvider>
        </Elements>
      </body>
    </html>
  );
}
