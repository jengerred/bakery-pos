"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/app/pos/lib/products";

/* -----------------------------
   TYPES (exported for POSPage)
------------------------------ */

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type CompletedOrder = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;

  // What the customer actually paid with
  paymentType: "cash" | "credit" | "debit";

  // How the card was captured (only applies if paymentType is credit/debit)
  cardEntryMethod?: "manual" | "terminal";

  cashTendered?: number;
  changeGiven?: number;

  stripePaymentId?: string;
  timestamp: number;
};

/* -----------------------------
   CONTEXT SHAPE
------------------------------ */

type OrderHistoryContextType = {
  history: CompletedOrder[];
  addOrder: (order: CompletedOrder) => void;
  clearHistory: () => void;
};

/* -----------------------------
   CREATE CONTEXT
------------------------------ */

export const OrderHistoryContext = createContext<OrderHistoryContextType | null>(null);

/* -----------------------------
   PROVIDER
------------------------------ */

export function OrderHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<CompletedOrder[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("orderHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveHistory = (orders: CompletedOrder[]) => {
    localStorage.setItem("orderHistory", JSON.stringify(orders));
    setHistory(orders);
  };

  const addOrder = (order: CompletedOrder) => {
    const updated = [...history, order];
    saveHistory(updated);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  return (
    <OrderHistoryContext.Provider value={{ history, addOrder, clearHistory }}>
      {children}
    </OrderHistoryContext.Provider>
  );
}

/* -----------------------------
   HOOK
------------------------------ */

export function useOrderHistoryContext() {
  const ctx = useContext(OrderHistoryContext);
  if (!ctx) throw new Error("useOrderHistoryContext must be used inside OrderHistoryProvider");
  return ctx;
}
