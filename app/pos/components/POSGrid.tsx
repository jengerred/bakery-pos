"use client";

import { useState, useEffect } from "react";

/* -------------------------------------------------------
🧱 UI Components
------------------------------------------------------- */
import ProductList from "./ProductList";
import OrderSummary from "./OrderSummary";
import OrderTotals from "./OrderTotals";
import CheckoutModal from "./CheckoutModal";
import ReceiptModal from "./ReceiptModal";
import OrderHistory from "./OrderHistory";
import CardReaderContainer from "./card-reader/CardReaderContainer";

/* ⭐ Customer Context */
import { useCustomer } from "../context/CustomerContext";

/* -------------------------------------------------------
🧾 Types & Helpers
------------------------------------------------------- */
import type { CompletedOrder } from "../context/OrderHistoryContext";
import { calculateTotals } from "../lib/calcTotals";
import { Product } from "../lib/products";

/* -------------------------------------------------------
🧩 Props
------------------------------------------------------- */
type Props = {
  order: { product: Product; quantity: number }[];
  setOrder: (order: any) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  tempQty: number;
  openProductModal: (product: Product) => void;
  saveProductChanges: (product: Product, qty: number) => void;
  handleRemove: (id: number) => void;
  handleIncrease: (id: number) => void;
  handleDecrease: (id: number) => void;
  showCheckout: boolean;
  setShowCheckout: (v: boolean) => void;
  lastOrder: CompletedOrder | null;
  setLastOrder: (o: CompletedOrder | null) => void;
  terminal: any;
  addOrder: (o: CompletedOrder) => void;
};

/* -------------------------------------------------------
🧱 POSGrid — Main POS Layout
------------------------------------------------------- */
export default function POSGrid({
  order,
  setOrder,
  selectedProduct,
  setSelectedProduct,
  tempQty,
  openProductModal,
  saveProductChanges,
  handleRemove,
  handleIncrease,
  handleDecrease,
  showCheckout,
  setShowCheckout,
  lastOrder,
  setLastOrder,
  terminal,
  addOrder,
}: Props) {
 const { customer, setCustomer } = useCustomer();


  /* ⭐ NEW: show receipt modal only after customer chooses */
  const [showReceipt, setShowReceipt] = useState(false);

  /* ⭐ NEW: store the receipt method chosen by customer */
  const [receiptMethod, setReceiptMethod] = useState<
    "print" | "email" | "text" | "none" | null
  >(null);

  /* -------------------------------------------------------
  ⭐ Begin Checkout Flow
  ------------------------------------------------------- */
  const handleBeginCheckout = () => {
    setShowCheckout(true);
    window.dispatchEvent(new CustomEvent("cashier-payment-enabled"));
  };

  /* -------------------------------------------------------
  ⭐ LISTEN FOR READER RECEIPT CHOICE
  ------------------------------------------------------- */
  useEffect(() => {
    function handleReceiptChoice(e: any) {
      if (!lastOrder) return;

      const method = e.detail.method;
      setReceiptMethod(method);

      // Show receipt modal on left side
      setShowReceipt(true);
    }

    window.addEventListener("reader-receipt-choice", handleReceiptChoice);
    return () =>
      window.removeEventListener("reader-receipt-choice", handleReceiptChoice);
  }, [lastOrder]);

  /* -------------------------------------------------------
  ⭐ Cashier closes receipt modal → reader resets
  ------------------------------------------------------- */
  function handleCloseReceipt() {
  setShowReceipt(false);

  // ⭐ Reset customer so cashier Order Summary clears
  setCustomer(null);

  // Optional: clear last order from memory
  // setLastOrder(null);

  // Tell reader to reset (you already do this)
  window.dispatchEvent(new CustomEvent("cashier-receipt-done"));
}


  return (
    <>
      {/* ⭐ CHECKOUT SIDE PANEL */}
      {showCheckout && (
        <CheckoutModal
          order={order}
          terminal={terminal}
          onClose={() => {
            setShowCheckout(false);
            window.dispatchEvent(new CustomEvent("cashier-cancel-checkout"));
          }}
          onComplete={(paymentData) => {
            const { subtotal, tax, total } = calculateTotals(order);

            const completed: CompletedOrder = {
              id: crypto.randomUUID(),
              items: order,
              subtotal,
              tax,
              total,
              paymentType: paymentData.paymentType,
              cardEntryMethod: paymentData.cardEntryMethod,
              cashTendered: paymentData.cashTendered,
              changeGiven: paymentData.changeGiven,
              stripePaymentId: paymentData.stripePaymentId,
              timestamp: Date.now(),
              customerId: customer?.id ?? null,
              customerName: customer?.name ?? null,
            };

            addOrder(completed);
            setLastOrder(completed);
            setReceiptMethod(null);   // print-only mode
            setShowReceipt(true);     // show receipt modal immediately
            setOrder([]);
            setShowCheckout(false);
          }}
        />
      )}

      {/* ⭐ RECEIPT SIDE PANEL — LEFT SIDE ONLY */}
      {showReceipt && lastOrder && (
        <div className="fixed top-0 left-0 h-full w-[420px] bg-white shadow-2xl z-50 p-6 overflow-y-auto">
          <ReceiptModal
            order={lastOrder}
            receiptMethod={receiptMethod}
            onClose={handleCloseReceipt}
          />
        </div>
      )}

      {/* ⭐ MAIN GRID */}
      <div className="grid grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <section className="p-4 border rounded-lg bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <ProductList onAdd={openProductModal} />
        </section>

        <OrderSummary
          order={order}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />

        <OrderTotals order={order} />

        <button
          onClick={handleBeginCheckout}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Checkout
        </button>

        <OrderHistory />

        {/* RIGHT SIDE — READER */}
        <section className="p-4 border rounded-lg bg-white shadow">
          <CardReaderContainer terminal={terminal} />
        </section>
      </div>
    </>
  );
}
