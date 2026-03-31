"use client";

/* -------------------------------------------------------
   📦 React & Next.js
------------------------------------------------------- */
import { useState } from "react";

/* -------------------------------------------------------
   🧠 Context (Global State)
------------------------------------------------------- */
import { useOrderHistoryContext } from "./context/OrderHistoryContext";
import type { CompletedOrder } from "./context/OrderHistoryContext";

/* -------------------------------------------------------
   🧩 Hooks (Local Logic)
------------------------------------------------------- */
import { useTerminalSimulation } from "./hooks/useTerminalSimulation";
import { useCart } from "./hooks/useCart";
import { useStripeRedirectToast } from "./hooks/useStripeRedirectToast";

/* -------------------------------------------------------
   🧱 Components (UI Building Blocks)
------------------------------------------------------- */
import ProductOptionsModal from "./components/ProductOptionsModal";
import POSGrid from "./components/POSGrid";

/* -------------------------------------------------------
   🛠️ Lib Helpers (Utilities & Business Logic)
------------------------------------------------------- */
import { createCompletedOrder } from "./lib/handleCheckout";

/* -------------------------------------------------------
   🖥️ POS Page Content
   🎨 UPDATED: 
   - Fixed background to support Glassmorphism.
   - Removed unused/broken context imports causing build errors.
------------------------------------------------------- */
export default function POSPageContent() {
  /* ------------------------------
     🧾 Local UI State
  ------------------------------ */
  const [showCheckout, setShowCheckout] = useState(false);
  const [lastOrder, setLastOrder] = useState<CompletedOrder | null>(null);

  /* ------------------------------
     🧠 Global Order History
  ------------------------------ */
  const { addOrder } = useOrderHistoryContext();

  /* ------------------------------
     💳 Simulated Card Terminal
  ------------------------------ */
  const terminal = useTerminalSimulation();

  /* ------------------------------
     🛒 Cart Logic (Products, Qty, Modal)
  ------------------------------ */
  const {
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
  } = useCart();

  /* ------------------------------
     🔔 Stripe Redirect Toasts
  ------------------------------ */
  useStripeRedirectToast();

  return (
    /* 🎯 THEME ANCHOR: 
       - min-h-screen: Ensures the background covers the whole browser.
       - bg-slate-50: The clean "daytime" bakery look.
       - dark:bg-slate-950: The deep "closing shift" navy.
       - transition-colors: Makes the toggle feel expensive/smooth.
    */
    <div className="min-h-screen bg-violet-50 dark:bg-slate-950 transition-colors duration-500">  
      
      {/* 🧱 Main POS Grid Layout 
          We removed p-4 here so the Navbar in POSGrid can sit flush at the top.
      */}
      <POSGrid
        order={order}
        setOrder={setOrder}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        tempQty={tempQty}
        openProductModal={openProductModal}
        saveProductChanges={saveProductChanges}
        handleRemove={handleRemove}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
        lastOrder={lastOrder}
        setLastOrder={setLastOrder}
        terminal={terminal}
        addOrder={(paymentData) => {
          const completed = createCompletedOrder(order, paymentData);
          addOrder(completed);
          setLastOrder(completed);
          setOrder([]);
          setShowCheckout(false);
        }}
      />

      {/* 🛠️ Product Options Modal */}
      {selectedProduct && (
        <ProductOptionsModal
          product={selectedProduct}
          quantity={tempQty}
          existsInCart={!!order.find((i) => i.product.id === selectedProduct.id)}
          onClose={() => setSelectedProduct(null)}
          onSave={saveProductChanges}
          onDelete={(product) => {
            setOrder(order.filter((i) => i.product.id !== product.id));
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}