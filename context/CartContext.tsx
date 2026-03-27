"use client";

import { createContext, useContext, useState } from "react";
import type { Product } from "../lib/products";

type CartItem = { product: Product; quantity: number };

type CartContextType = {
  order: CartItem[];
  setOrder: (items: CartItem[]) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  tempQty: number;
  setTempQty: (n: number) => void;
  openProductModal: (p: Product) => void;
  saveProductChanges: (p: Product, qty: number) => void;
  handleRemove: (id: number) => void;
  handleIncrease: (id: number) => void;
  handleDecrease: (id: number) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [order, setOrder] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tempQty, setTempQty] = useState(1);

  const openProductModal = (product: Product) => {
    const existing = order.find((i) => i.product.id === product.id);
    setSelectedProduct(product);
    setTempQty(existing ? existing.quantity : 1);
  };

  const saveProductChanges = (product: Product, newQty: number) => {
    if (newQty <= 0) {
      setOrder(order.filter((i) => i.product.id !== product.id));
      return;
    }

    const exists = order.find((i) => i.product.id === product.id);

    if (exists) {
      setOrder(
        order.map((i) =>
          i.product.id === product.id ? { ...i, quantity: newQty } : i
        )
      );
    } else {
      setOrder([...order, { product, quantity: newQty }]);
    }

    setTempQty(newQty);
  };

  const handleRemove = (productId: number) => {
    setOrder(order.filter((item) => item.product.id !== productId));
  };

  const handleIncrease = (productId: number) => {
    setOrder(
      order.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = (productId: number) => {
    setOrder(
      order
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        order,
        setOrder,
        selectedProduct,
        setSelectedProduct,
        tempQty,
        setTempQty,
        openProductModal,
        saveProductChanges,
        handleRemove,
        handleIncrease,
        handleDecrease,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be inside CartProvider");
  return ctx;
}
