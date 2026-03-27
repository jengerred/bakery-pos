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

/* ⭐ NEW — Customer Flow Modals */
import RewardsPromptModal from "./customer/RewardsPromptModal";
import CustomerLookupModal from "./customer/CustomerLookupModal";
import QuickCreateCustomerModal from "./customer/QuickCreateCustomerModal";

/* ⭐ NEW — Customer Context */
import { useCustomer } from "../context/CustomerContext";

/* -------------------------------------------------------
   🧾 Types & Helpers
------------------------------------------------------- */
import type { CompletedOrder } from "../context/OrderHistoryContext";
import { calculateTotals } from "../lib/calcTotals";
import { Product } from "../lib/products";
import type { User } from "../types/user";

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

  /* ⭐ NEW — Customer Context */
  const { customer, setCustomer } = useCustomer();

  /* ⭐ NEW — Local modal state */
  const [showRewardsPrompt, setShowRewardsPrompt] = useState(false);
  const [showLookup, setShowLookup] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  const [lookupValue, setLookupValue] = useState("");

  /* -------------------------------------------------------
     ⭐ Begin Checkout Flow
  ------------------------------------------------------- */
  const handleBeginCheckout = () => {
    setShowRewardsPrompt(true);
  };

  /* -------------------------------------------------------
     ⭐ When lookup finds a customer
  ------------------------------------------------------- */
  const handleCustomerFound = (user: User) => {
    setCustomer(user);
    setShowLookup(false);
    setShowRewardsPrompt(false);
    setShowCheckout(true);
  };

  /* -------------------------------------------------------
     ⭐ When lookup fails → go to quick create
  ------------------------------------------------------- */
  const handleCustomerNotFound = (value: string) => {
    setLookupValue(value);
    setShowLookup(false);
    setShowQuickCreate(true);
  };

  /* -------------------------------------------------------
     ⭐ After quick create
  ------------------------------------------------------- */
  const handleCustomerCreated = (user: User) => {
    setCustomer(user);
    setShowQuickCreate(false);
    setShowRewardsPrompt(false);
    setShowCheckout(true);
  };

  return (
    <div className="grid grid-cols-2 gap-6">

      {/* 🛒 PRODUCT LIST */}
      <section className="p-4 border rounded-lg bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <ProductList onAdd={openProductModal} />
      </section>

      {/* 📦 ORDER SUMMARY */}
      <OrderSummary
        order={order}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
      />

      {/* 💵 TOTALS */}
      <OrderTotals order={order} />

      {/* 💳 CHECKOUT BUTTON */}
      <button
        onClick={handleBeginCheckout}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Checkout
      </button>

      {/* ⭐ Rewards Prompt */}
      {showRewardsPrompt && (
        <RewardsPromptModal
          onLookup={() => {
            setShowRewardsPrompt(false);
            setShowLookup(true);
          }}
          onCreate={() => {
            setShowRewardsPrompt(false);
            setShowQuickCreate(true);
          }}
          onGuest={() => {
            setCustomer(null);
            setShowRewardsPrompt(false);
            setShowCheckout(true);
          }}
        />
      )}

      {/* ⭐ Lookup Modal */}
      {showLookup && (
        <CustomerLookupModal
          onFound={handleCustomerFound}
          onNotFound={handleCustomerNotFound}
          onClose={() => setShowLookup(false)}
        />
      )}

      {/* ⭐ Quick Create Modal */}
      {showQuickCreate && (
        <QuickCreateCustomerModal
          initialValue={lookupValue}
          onCreate={handleCustomerCreated}
          onClose={() => setShowQuickCreate(false)}
        />
      )}

      {/* 🧾 CHECKOUT MODAL */}
      {showCheckout && (
        <CheckoutModal
          order={order}
          terminal={terminal}
          onClose={() => setShowCheckout(false)}
          onComplete={(paymentData) => {
            const { subtotal, tax, total } = calculateTotals(order);

            /* -------------------------------------------------------
               ⭐ BUILD COMPLETED ORDER
               This is where customerId + customerName MUST be added.
            ------------------------------------------------------- */
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

      {/* 🧾 RECEIPT MODAL */}
      {lastOrder && (
        <ReceiptModal
          order={lastOrder}
          onClose={() => setLastOrder(null)}
        />
      )}

      {/* 📜 ORDER HISTORY */}
      <OrderHistory />
    </div>
  );
}
