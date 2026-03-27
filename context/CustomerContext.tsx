"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "../types/user";

/* -------------------------------------------------------
   Customer Context Type
------------------------------------------------------- */
type CustomerContextType = {
  customer: User | null;
  setCustomer: (c: User | null) => void;
  clearCustomer: () => void;
};

/* -------------------------------------------------------
   Create Context
------------------------------------------------------- */
const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

/* -------------------------------------------------------
   Provider
------------------------------------------------------- */
export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<User | null>(null);

  const clearCustomer = () => setCustomer(null);

  return (
    <CustomerContext.Provider value={{ customer, setCustomer, clearCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

/* -------------------------------------------------------
   Hook
------------------------------------------------------- */
export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) {
    throw new Error("useCustomer must be used inside CustomerProvider");
  }
  return ctx;
}
