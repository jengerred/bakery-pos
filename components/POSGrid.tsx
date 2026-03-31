"use client";

/* -------------------------------------------------------
   📦 UI Components (Cashier-Side)
------------------------------------------------------- */
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductList from "./ProductList";
import OrderSummary from "./OrderSummary";
import OrderTotals from "./OrderTotals";
import CheckoutModal from "./CheckoutModal";
import ReceiptModal from "./ReceiptModal";
import CardReaderContainer from "./card-reader/CardReaderContainer";

/* -------------------------------------------------------
   👤 Context & Types
------------------------------------------------------- */
import { useCustomer } from "../context/CustomerContext";
import type { CompletedOrder } from "../context/OrderHistoryContext";
import { calculateTotals } from "../lib/calcTotals";
import { Product } from "../lib/products";

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
  
  /* -------------------------------------------------------
     🧾 Receipt & UI State
  ------------------------------------------------------- */
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptMethod, setReceiptMethod] = useState<"print" | "email" | "text" | "none" | null | undefined>(undefined);

  /* -------------------------------------------------------
     🎯 Auto-Sync State
  ------------------------------------------------------- */
  const [isReaderActive, setIsReaderActive] = useState(false);

  const { total } = calculateTotals(order);

  /* -------------------------------------------------------
     💳 Checkout Lifecycle
  ------------------------------------------------------- */
  const handleBeginCheckout = () => {
    setShowCheckout(true);
    window.dispatchEvent(new CustomEvent("cashier-payment-enabled"));
  };

  /* -------------------------------------------------------
     📡 Hardware Listeners (Reader Sync)
  ------------------------------------------------------- */
  useEffect(() => {
    function handleReaderStatus(e: any) {
      const status = e.detail.status;
      if (status === "waiting" || status === "collecting" || status === "processing") {
        setIsReaderActive(true);
      } else if (status === "idle") {
        setIsReaderActive(false);
      }
    }
    window.addEventListener("reader-status-update", handleReaderStatus);
    return () => window.removeEventListener("reader-status-update", handleReaderStatus);
  }, []);

  /* -------------------------------------------------------
     📡 Receipt Event Listeners
  ------------------------------------------------------- */
  useEffect(() => {
    function handleReceiptChoice(e: any) {
      if (!lastOrder) return;
      setReceiptMethod(e.detail.method);
      setShowReceipt(true);
    }
    window.addEventListener("reader-receipt-choice", handleReceiptChoice);
    return () => window.removeEventListener("reader-receipt-choice", handleReceiptChoice);
  }, [lastOrder]);

  useEffect(() => {
    if (showReceipt && receiptMethod === undefined) {
      const timer = setTimeout(() => {
        setReceiptMethod(null); 
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [showReceipt, receiptMethod]);

  /* -------------------------------------------------------
     🧹 Cleanup & Reset
  ------------------------------------------------------- */
  function handleCloseReceipt() {
    setShowReceipt(false);
    setCustomer(null);
    setReceiptMethod(undefined); 
    setIsReaderActive(false); 
    window.dispatchEvent(new CustomEvent("cashier-receipt-done"));
  }

  return (
    <div className="flex flex-col gap-6 px-8 py-2" 
    style={{
        backgroundImage: "url('/bakery2-bg.png')", // Matches the file name in your public folder
        backgroundSize: "400px", // Adjust this number to make the bakery items bigger or smaller
        backgroundRepeat: "repeat", // Tiles the pattern seamlessly
        backgroundAttachment: "fixed" // Optional: keeps the background still if you scroll
      }}>
      {/* 📑 NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-violet-200 bg-violet-100/80 backdrop-blur-md px-6 transition-colors rounded-t-3xl shadow-sm">
        <div className="flex gap-2">
          <button className="px-6 py-5 border-b-4 border-violet-600 text-violet-700 font-black uppercase tracking-widest text-sm">
            Register
          </button>
          <Link href="/pos/transactions" className="px-6 py-5 text-violet-400 hover:text-violet-600 transition-colors uppercase tracking-widest text-sm font-bold">
            Transactions
          </Link>
        </div>
        <div className="mr-4 px-4 py-1.5 bg-violet-600/10 border border-violet-600/20 rounded-full">
           <span className="text-xs font-black uppercase text-violet-700 tracking-widest">Terminal Live</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT COLUMN: Product Catalog */}
        <div className="col-span-8">
          <section className="p-8 border rounded-[2.5rem] bg-violet-200 backdrop-blur-xl border-violet-500 shadow-xl shadow-violet-300 min-h-[650px]">
            <h2 className="text-2xl font-black mb-8 text-violet-600 uppercase tracking-[0.2em]">
              Our Menu
            </h2>
            <ProductList onAdd={openProductModal} />
          </section>
        </div>

        {/* RIGHT COLUMN: Order Details & Hardware Status */}
        <div className="col-span-4 space-y-6">
          <section className="p-8 border rounded-[2.5rem] bg-violet-100/80 backdrop-blur-md px-6 transition-colors border-violet-400 shadow-xl shadow-violet-900/5">
            <div className="mb-6">
              <h2 className="text-xl font-black mb-4 text-violet-600 uppercase tracking-wider">Current Order</h2>
              <OrderSummary
                order={order}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            </div>
            
            <div className="pt-6 border-t border-violet-100">
              <OrderTotals order={order} />
             <button
                onClick={handleBeginCheckout}
                disabled={order.length === 0}
                className="w-full mt-8 py-7 bg-violet-600 text-white rounded-[1.5rem] hover:bg-violet-700 font-black uppercase tracking-tighter shadow-lg shadow-violet-600/30 active:scale-[0.98] disabled:opacity-50 transition-all flex flex-col items-center justify-center gap-1"
              >
                <span className="text-2xl">Checkout</span>
                <span className="text-lg opacity-90 font-medium">Total: ${total.toFixed(2)}</span>
              </button>
            </div>
          </section>

          {/* Reader UI Container */}
          <section className="p-6 border rounded-[2rem] bg-white/60 backdrop-blur-xl border-violet-100 shadow-lg shadow-violet-900/5">
            <CardReaderContainer terminal={terminal} />
          </section>
        </div>
      </div>

      {/* 💳 CHECKOUT MODAL OVERLAY */}
      {showCheckout && (
        <CheckoutModal
          order={order}
          terminal={terminal}
          forceReaderMode={isReaderActive} 
          onClose={() => {
            setShowCheckout(false);
            window.dispatchEvent(new CustomEvent("cashier-cancel-checkout"));
          }}
          onComplete={(paymentData) => {
            const { subtotal, tax, total: finalTotal } = calculateTotals(order);
            const completed: CompletedOrder = {
              id: crypto.randomUUID(),
              items: order,
              subtotal,
              tax,
              total: finalTotal,
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
            
            if (paymentData.paymentType === "cash" || !customer) {
               window.dispatchEvent(new CustomEvent("reader-force-thank-you"));
               setReceiptMethod(null);
            } else {
               setReceiptMethod(undefined);
            }

            setShowReceipt(true);
            setOrder([]);
            setShowCheckout(false);
          }}
        />
      )}

      {/* 🧾 RECEIPT MODAL OVERLAY */}
      {showReceipt && lastOrder && (
        <div className="fixed top-0 left-0 h-full w-[420px] bg-white dark:bg-slate-900 shadow-2xl z-50 p-6 overflow-y-auto transition-colors">
          <ReceiptModal
            order={lastOrder}
            receiptMethod={receiptMethod as any}
            onClose={handleCloseReceipt}
          />
        </div>
      )}
    </div>
  );
}