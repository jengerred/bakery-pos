"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/pos/hooks/useCart";
import { calculateTotals } from "@/app/pos/lib/calcTotals";

/* Reader Screens */
import ReaderRewardsScreen from "./ReaderRewardsScreen";
import ReaderQuickSignupScreen from "./ReaderQuickSignupScreen";
import ReaderOrderSummaryScreen from "./ReaderOrderSummaryScreen";
import ReaderReceiptOptionsScreen from "./ReaderReceiptOptionsScreen";

import { useCustomer } from "@/app/pos/context/CustomerContext";
import { userService } from "@/app/pos/lib/userService";

export default function CardReaderContainer({ terminal }: { terminal: any }) {
  const { order } = useCart();
  const totals = calculateTotals(order);

  const { customer, setCustomer } = useCustomer();

  const [screen, setScreen] = useState<
    | "rewards"
    | "quickSignup"
    | "orderSummary"
    | "processing"
    | "approved"
    | "receiptOptions"
  >("rewards");

  const [lookupValue, setLookupValue] = useState("");

  /* -------------------------------------------------------
     LISTEN FOR CASHIER CHECKOUT
  ------------------------------------------------------- */
  useEffect(() => {
    function handleCheckout() {
      if (order.length === 0) return;
      setScreen("orderSummary");
    }

    window.addEventListener("cashier-checkout-ready", handleCheckout);
    return () =>
      window.removeEventListener("cashier-checkout-ready", handleCheckout);
  }, [order]);

  /* -------------------------------------------------------
     LISTEN FOR CASHIER CANCEL
  ------------------------------------------------------- */
  useEffect(() => {
    function handleCancel() {
      terminal.reset();
      setScreen("rewards");
    }

    window.addEventListener("cashier-cancel-checkout", handleCancel);
    return () =>
      window.removeEventListener("cashier-cancel-checkout", handleCancel);
  }, []);

  /* -------------------------------------------------------
     PAYMENT SIMULATION
  ------------------------------------------------------- */
  const simulatePayment = () => {
    if (terminal.status === "disconnected") terminal.connect();

    setScreen("processing");

    terminal.collectPayment(Math.round(totals.total * 100), () => {
      window.dispatchEvent(
        new CustomEvent("reader-payment-complete", {
            detail: {
            paymentType: "credit",
            cardEntryMethod: "terminal",
            },
        })
        );


      setScreen("approved");

      setTimeout(() => {
        setScreen("receiptOptions");
      }, 1200);
    });
  };

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
  return (
    <div className="border rounded-lg bg-gray-50 shadow-inner p-4 h-[500px] flex flex-col justify-between text-gray-700">

      {/* ⭐ REWARDS SCREEN */}
      {screen === "rewards" && (
        <ReaderRewardsScreen
          onSubmit={async (value) => {
            setLookupValue(value);

            // ⭐ Use userService instead of API route
            const found = await userService.find(value);

            if (found) {
              setCustomer(found);
              window.dispatchEvent(
                new CustomEvent("cashier-checkout-ready")
              );
            } else {
              setScreen("quickSignup");
            }
          }}

          onSkip={() => {
            window.dispatchEvent(
              new CustomEvent("cashier-checkout-ready")
            );
          }}
        />
      )}

      {/* ⭐ QUICK SIGNUP */}
      {screen === "quickSignup" && (
        <ReaderQuickSignupScreen
            initialValue={lookupValue}
            onCreate={async (newUser) => {
                setCustomer(newUser);

                window.dispatchEvent(
                new CustomEvent("cashier-checkout-ready")
                );
            }}
            onBack={() => setScreen("rewards")}
            />

      )}

      {/* ⭐ ORDER SUMMARY */}
      {screen === "orderSummary" && (
        <div className="flex flex-col h-full w-full">
          <button
            onClick={() => setScreen("rewards")}
            className="text-sm text-blue-600 underline mb-2"
          >
            Back
          </button>

          <div className="flex-1 overflow-auto pr-1">
            <ReaderOrderSummaryScreen
              order={order}
              totals={totals}
              customerName={customer?.name ?? null}
            />
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="text-center text-sm font-medium mb-2">
              Tap / Insert / Swipe to Pay
            </p>

            <button
              onClick={simulatePayment}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Simulate Tap / Insert / Swipe
            </button>

            <p className="text-center text-xs text-gray-500 mt-2">
              Reader Status: {terminal.status}
            </p>
          </div>
        </div>
      )}

      {/* ⭐ PROCESSING */}
      {screen === "processing" && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <p className="text-lg font-medium">Processing…</p>
          <p className="text-gray-500">{terminal.status}</p>
        </div>
      )}

      {/* ⭐ APPROVED */}
      {screen === "approved" && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <p className="text-2xl font-semibold text-green-600">
            Payment Approved
          </p>
        </div>
      )}

      {/* ⭐ RECEIPT OPTIONS */}
      {screen === "receiptOptions" && (
        <ReaderReceiptOptionsScreen
          onDone={() => {
            terminal.reset();
            setScreen("rewards");
          }}
        />
      )}
    </div>
  );
}
