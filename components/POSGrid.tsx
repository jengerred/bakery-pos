"use client";

import { useState } from "react";

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
  const { customer } = useCustomer();

  /* -------------------------------------------------------
  ⭐ Begin Checkout Flow
  ------------------------------------------------------- */
  const handleBeginCheckout = () => {
    setShowCheckout(true);
   window.dispatchEvent(new CustomEvent("cashier-checkout-ready"));

  };

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
            setOrder([]);
            setShowCheckout(false);
          }}
        />
      )}

      {/* ⭐ RECEIPT SIDE PANEL */}
      {lastOrder && (
        <ReceiptModal
          order={lastOrder}
          onClose={() => setLastOrder(null)}
        />
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
