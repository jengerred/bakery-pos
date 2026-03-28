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
    | "printOnly"
    | "thankYou"   // ⭐ Added
  >("rewards");

  const [lookupValue, setLookupValue] = useState("");
  const [paymentEnabled, setPaymentEnabled] = useState(false);

  function broadcastReaderStatus(status: string) {
    window.dispatchEvent(
      new CustomEvent("reader-status-update", { detail: { status } })
    );
  }

  /* -------------------------------------------------------
     LISTEN FOR CASHIER CHECKOUT
  ------------------------------------------------------- */
  useEffect(() => {
    function handleCheckout() {
      if (order.length === 0) return;

      setScreen("orderSummary");
      broadcastReaderStatus("connected");
      broadcastReaderStatus("waiting");
    }

    window.addEventListener("cashier-checkout-ready", handleCheckout);
    return () =>
      window.removeEventListener("cashier-checkout-ready", handleCheckout);
  }, [order]);

  /* -------------------------------------------------------
     LISTEN FOR CASHIER PAYMENT ENABLED
  ------------------------------------------------------- */
  useEffect(() => {
    function handlePaymentEnabled() {
      setPaymentEnabled(true);
    }

    window.addEventListener("cashier-payment-enabled", handlePaymentEnabled);
    return () =>
      window.removeEventListener("cashier-payment-enabled", handlePaymentEnabled);
  }, []);

  /* -------------------------------------------------------
   LISTEN FOR CASHIER CANCEL
    ------------------------------------------------------- */
    useEffect(() => {
    function handleCancel() {
        terminal.reset();
        setPaymentEnabled(false);
        setScreen("rewards");
        broadcastReaderStatus("idle");
    }

    window.addEventListener("cashier-cancel-checkout", handleCancel);
    return () =>
        window.removeEventListener("cashier-cancel-checkout", handleCancel);
    }, []);


    /* -------------------------------------------------------
    ⭐ LISTEN FOR CASHIER RECEIPT DONE (close receipt modal)
    ------------------------------------------------------- */
    useEffect(() => {
    function handleReceiptDone() {
        terminal.reset();
        setPaymentEnabled(false);
        setScreen("rewards");
        broadcastReaderStatus("idle");
    }

    window.addEventListener("cashier-receipt-done", handleReceiptDone);
    return () =>
        window.removeEventListener("cashier-receipt-done", handleReceiptDone);
    }, []);


  /* -------------------------------------------------------
     PAYMENT SIMULATION
  ------------------------------------------------------- */
  const simulatePayment = () => {
    if (!paymentEnabled) return;

    if (terminal.status === "disconnected") terminal.connect();

    broadcastReaderStatus("collecting");
    setScreen("processing");

    broadcastReaderStatus("processing");

    terminal.collectPayment(Math.round(totals.total * 100), () => {
      broadcastReaderStatus("approved");

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
        if (customer) {
          // ⭐ Customer exists → show full receipt options
          setScreen("receiptOptions");
        } else {
          // ⭐ No customer → auto-print
          window.dispatchEvent(
            new CustomEvent("reader-receipt-choice", {
              detail: { method: "print" },
            })
          );
          setScreen("printOnly");
        }
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

            const found = await userService.find(value);

            if (found) {
              setCustomer(found);
              setScreen("orderSummary");
              broadcastReaderStatus("connected");
              broadcastReaderStatus("waiting");
            } else {
              setScreen("quickSignup");
            }
          }}
          onSkip={() => {
            setScreen("orderSummary");
            broadcastReaderStatus("connected");
            broadcastReaderStatus("waiting");
          }}
        />
      )}

      {/* ⭐ QUICK SIGNUP */}
      {screen === "quickSignup" && (
        <ReaderQuickSignupScreen
          initialValue={lookupValue}
          onCreate={async (newUser) => {
            setCustomer(newUser);
            setScreen("orderSummary");
            broadcastReaderStatus("connected");
            broadcastReaderStatus("waiting");
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
            <button
              onClick={simulatePayment}
              disabled={!paymentEnabled}
              className={`w-full px-4 py-2 rounded text-white ${
                paymentEnabled
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              (Simulate) Tap / Insert / Swipe
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
          customerExists={!!customer}
          onDone={(method) => {
            // ⭐ Tell cashier what customer chose
            window.dispatchEvent(
              new CustomEvent("reader-receipt-choice", {
                detail: { method },
              })
            );

            // ⭐ Show Thank You screen
            setScreen("thankYou");

            // ⭐ After 2 seconds → reset to Rewards
            setTimeout(() => {
              terminal.reset();
              setPaymentEnabled(false);
              broadcastReaderStatus("idle");
              setScreen("rewards");
            }, 2000);
          }}
          onTimeout={() => {
            // ⭐ Timeout → treat like "no receipt chosen"
            window.dispatchEvent(
              new CustomEvent("reader-receipt-choice", {
                detail: { method: "none" },
              })
            );

            // ⭐ Show Thank You screen
            setScreen("thankYou");

            setTimeout(() => {
              terminal.reset();
              setPaymentEnabled(false);
              broadcastReaderStatus("idle");
              setScreen("rewards");
            }, 2000);
          }}
        />
      )}

      {/* ⭐ PRINT-ONLY RECEIPT (no customer) */}
      {screen === "printOnly" && (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-lg font-medium">Receipt Printed</p>
          <button
            onClick={() => {
              terminal.reset();
              setPaymentEnabled(false);
              broadcastReaderStatus("idle");
              setScreen("rewards");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Done
          </button>
        </div>
      )}

      {/* ⭐ THANK YOU SCREEN */}
      {screen === "thankYou" && (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-2xl font-semibold text-green-600">Thank you!</p>
          <p className="text-gray-500 text-sm">Your receipt is being processed…</p>
        </div>
      )}
    </div>
  );
}
