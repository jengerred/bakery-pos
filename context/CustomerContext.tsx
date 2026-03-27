"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Customer } from "../types/customer"
import type { User } from "../types/user";


type CustomerContextType = {
  customer: User | null
  setCustomer: (c: User | null) => void
  clearCustomer: () => void
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<User | null>(null)

  const clearCustomer = () => setCustomer(null)

  return (
    <CustomerContext.Provider value={{ customer, setCustomer, clearCustomer }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomer() {
  const ctx = useContext(CustomerContext)
  if (!ctx) throw new Error("useCustomer must be used inside CustomerProvider")
  return ctx
}
