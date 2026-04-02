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
import LogoutModal from "./LogoutModal";

/* -------------------------------------------------------
   👤 Context & Types
------------------------------------------------------- */
import { useCustomer } from "../context/CustomerContext";
import type { CompletedOrder } from "../context/OrderHistoryContext";
import { calculateTotals } from "../lib/calcTotals";
import { Product } from "../lib/products";

type Props = {
  order: { product: Product; quantity: number; overridePrice?: number }[];
  setOrder: (order: any) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  tempQty: number;
  openProductModal: (product: Product, quantity?: number, price?: number) => void;
  saveProductChanges: (product: Product, qty: number, price?: number) => void;
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
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptMethod, setReceiptMethod] = useState<"print" | "email" | "text" | "none" | null | undefined>(undefined);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isReaderActive, setIsReaderActive] = useState(false);
  
  /* -------------------------------------------------------
     ↔️ View State
  ------------------------------------------------------- */
  const [isExpanded, setIsExpanded] = useState(false);

  const { total } = calculateTotals(order);

  const handleBeginCheckout = () => {
    setShowCheckout(true);
    window.dispatchEvent(new CustomEvent("cashier-payment-enabled"));
  };

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

  useEffect(() => {
    function handleReceiptChoice(e: any) {
      if (!lastOrder) return;
      setReceiptMethod(e.detail.method);
      setShowReceipt(true);
    }
    window.addEventListener("reader-receipt-choice", handleReceiptChoice);
    return () => window.removeEventListener("reader-receipt-choice", handleReceiptChoice);
  }, [lastOrder]);

  function handleCloseReceipt() {
    setShowReceipt(false);
    setCustomer(null);
    setReceiptMethod(undefined); 
    setIsReaderActive(false); 
    window.dispatchEvent(new CustomEvent("cashier-receipt-done"));
  }

  return (
    <div className="flex flex-col gap-6 px-8 py-2 bg-violet-100" 
      style={{
        backgroundImage: "url('/background3.png')", 
        backgroundSize: "cover",      
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat", 
        backgroundAttachment: "fixed"
      }}>
        
      {/* 📑 NAVIGATION TABS */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex gap-4 p-1.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-sm">
          <button className="relative px-8 py-3 bg-violet-600 text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-md transition-all active:scale-95 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            </span>
            Register 
          </button>
          
          <Link href="/pos/transactions" className="px-8 py-3 bg-violet-200/50 hover:bg-violet-600 hover:text-white text-violet-700 rounded-xl font-bold uppercase tracking-widest text-sm transition-all active:scale-95 flex items-center shadow-sm border border-white/20">
            Transactions
          </Link>

          <Link href="/pos/employee" className="px-8 py-3 bg-violet-100/50 hover:bg-violet-600 hover:text-white text-violet-700 rounded-xl font-bold uppercase tracking-widest text-sm transition-all active:scale-95 flex items-center shadow-sm border border-white/20">
            Employee
          </Link>
        </div>

        <button onClick={() => setIsLogoutOpen(true)} className="group flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:bg-red-600 transition-all active:scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Exit
        </button>

        <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} onConfirm={() => setIsLogoutOpen(false)} />
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Product Catalog */}
        <div className="col-span-8">
          <section className="p-8 border rounded-[2.5rem] bg-violet-200 border-violet-500 shadow-xl shadow-violet-300 h-fit min-h-[500px]">
            <h2 className="text-2xl font-black mb-8 text-violet-600 uppercase tracking-[0.2em]">
              Our Menu
            </h2>
            <ProductList onAdd={(product, qty, price) => openProductModal(product, qty, price)} />
          </section>
        </div>

        {/* RIGHT COLUMN: Order Details */}
        <div className="col-span-4">
          <section className={`p-6 border rounded-[2.5rem] bg-violet-100/30 backdrop-blur-md px-6 transition-all border-violet-500 shadow-xl shadow-violet-900/50 flex flex-col relative overflow-hidden ${isExpanded ? 'h-auto' : 'h-[500px]'}`}>
            
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-black text-violet-600 uppercase tracking-wider">Current Order</h2>
                
                {/* 🔍 TOGGLE VIEW BUTTON */}
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-3 py-1 bg-violet-600/10 border border-violet-600/20 text-violet-600 text-[10px] font-black uppercase rounded-lg hover:bg-violet-600 hover:text-white transition-all shadow-sm"
                >
                  {isExpanded ? "Collapse" : "Expand All"}
                </button>
              </div>
              
              <div className="flex-1 relative overflow-hidden flex flex-col min-h-0 mb-1">
                {/* Conditional scroll: only scrolls when NOT expanded */}
                <div className={`flex-1 pr-2 custom-scrollbar scroll-smooth ${isExpanded ? '' : 'overflow-y-auto'}`}>
                  <OrderSummary
                    order={order}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                  />
                </div>

                {/* Fade effect only shows when collapsed */}
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-violet-100/60 to-transparent pointer-events-none z-10" />
                )}
              </div>
            </div>
            
            <div className="pt-2 border-t border-violet-500/30 bg-transparent">
              <OrderTotals order={order} />
            </div>
          </section>
        </div>
      </div>

      <div className="space-y-6">
        <button
          onClick={handleBeginCheckout}
          disabled={order.length === 0}
          className="w-full py-7 bg-violet-600 text-white rounded-[1.5rem] hover:bg-violet-700 font-black uppercase tracking-tighter shadow-lg shadow-violet-600/30 active:scale-[0.98] disabled:opacity-50 transition-all flex flex-col items-center justify-center gap-1"
        >
          <span className="text-3xl">Checkout</span>
          <span className="text-lg opacity-90 font-medium">Total: ${total.toFixed(2)}</span>
        </button>

        <section className="p-6 border rounded-[2rem] bg-white/60 backdrop-blur-xl border-violet-100 shadow-lg shadow-violet-900/5">
          <CardReaderContainer terminal={terminal} />
        </section>
      </div>

      {/* MODALS (Checkout, Receipt, etc.) */}
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

      {showReceipt && lastOrder && (
        <div className="fixed top-0 left-0 h-full w-[420px] bg-white dark:bg-slate-900 shadow-2xl z-50 p-6 overflow-y-auto transition-colors">
          <ReceiptModal
            order={lastOrder}
            receiptMethod={receiptMethod as any}
            onClose={handleCloseReceipt}
          />
        </div>
      )}
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.4);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
}