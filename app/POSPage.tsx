"use client";

import { useState } from "react";
import ProductList from "./pos/components/ProductList";
import OrderSummary from "./pos/components/OrderSummary";
import { Product } from "./pos/lib/products";
import OrderTotals from "./pos/components/OrderTotals";
import CheckoutModal from "./pos/components/CheckoutModal";
import { useOrderHistoryContext } from "./pos/context/OrderHistoryContext";
import OrderHistory from "./pos/components/OrderHistory";
import ReceiptModal from "./pos/components/ReceiptModal";
import type { CompletedOrder } from "./pos/context/OrderHistoryContext";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useTerminalSimulation } from "./pos/lib/useTerminalSimulation";

type PaymentData = {
  paymentType: "cash" | "credit" | "debit";
  cardEntryMethod?: "manual" | "terminal";
  cashTendered?: number;
  changeGiven?: number;
  stripePaymentId?: string;
};


export default function POSPage() {
  const [order, setOrder] = useState<{ product: Product; quantity: number }[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [lastOrder, setLastOrder] = useState<CompletedOrder | null>(null);

  const { addOrder } = useOrderHistoryContext();

  // ⭐ Terminal simulation state
  const terminal = useTerminalSimulation();

  // ⭐ Product modal state
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

  const params = useSearchParams();
  const success = params.get("success");
  const canceled = params.get("canceled");

  if (success) toast.success("Payment successful!");
  if (canceled) toast.error("Payment canceled.");

  // ⭐ PRODUCT OPTIONS MODAL (INLINE)
  type ProductOptionsModalProps = {
    product: Product;
    quantity: number;
    existsInCart: boolean;
    onClose: () => void;
    onSave: (product: Product, newQty: number) => void;
    onDelete: (product: Product) => void;
  };

  function ProductOptionsModal({
    product,
    quantity,
    existsInCart,
    onClose,
    onSave,
    onDelete,
  }: ProductOptionsModalProps) {
    if (!product) return null;

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-80 shadow">
          <h2 className="text-lg font-semibold mb-3">{product.name}</h2>
          <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>

          {/* Quantity selector */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-600">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSave(product, quantity - 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                –
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => onSave(product, quantity + 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">

            {/* Only show delete if item is already in cart */}
            {existsInCart && (
              <button
                onClick={() => onDelete(product)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            )}

            {/* Add or Update button */}
            <button
              onClick={() => {
                onSave(product, quantity);
                onClose();
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded ml-auto"
            >
              {existsInCart ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">

      {/* ⭐ READER STATUS BADGE */}
      <div className="flex justify-end mb-4">
        <span
          className={`px-3 py-1 rounded text-sm ${
            terminal.status === "connected"
              ? "bg-green-100 text-green-700"
              : terminal.status === "connecting"
              ? "bg-yellow-100 text-yellow-700"
              : terminal.status === "collecting"
              ? "bg-blue-100 text-blue-700"
              : terminal.status === "succeeded"
              ? "bg-green-200 text-green-800"
              : terminal.status === "failed"
              ? "bg-red-100 text-red-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {terminal.status === "disconnected" && "Reader Disconnected"}
          {terminal.status === "connecting" && "Reader Connecting…"}
          {terminal.status === "connected" && "Reader Connected"}
          {terminal.status === "collecting" && "Processing Payment…"}
          {terminal.status === "succeeded" && "Payment Complete"}
          {terminal.status === "failed" && "Reader Error"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* PRODUCT LIST */}
        <section className="p-4 border rounded-lg bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <ProductList
            onAdd={(product) => openProductModal(product)}
          />
        </section>

        {/* ORDER SUMMARY */}
        <OrderSummary
          order={order}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />

        {/* TOTALS */}
        <OrderTotals order={order} />

        {/* CHECKOUT BUTTON */}
        <button
          onClick={() => setShowCheckout(true)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Checkout
        </button>

        {/* CHECKOUT MODAL */}
        {showCheckout && (
          <CheckoutModal
            order={order}
            terminal={terminal}
            onClose={() => setShowCheckout(false)}
            onComplete={(paymentData: PaymentData) => {
              const subtotal = order.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
              );
              const tax = subtotal * 0.06;
              const total = subtotal + tax;

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
              };

              addOrder(completed);
              setLastOrder(completed);

              setOrder([]);
              setShowCheckout(false);
            }}
          />
        )}

        {/* RECEIPT MODAL */}
        {lastOrder && (
          <ReceiptModal
            order={lastOrder}
            onClose={() => setLastOrder(null)}
          />
        )}

        {/* ORDER HISTORY */}
        <OrderHistory />
      </div>

      {/* ⭐ RENDER PRODUCT OPTIONS MODAL */}
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
