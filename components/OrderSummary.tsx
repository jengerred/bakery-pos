"use client";

import { Product } from "@/app/pos/lib/products";
import { useCustomer } from "@/app/pos/context/CustomerContext";

/* -------------------------------------------------------
   🧾 OrderSummary
------------------------------------------------------- */
type OrderSummaryProps = {
  order: { product: Product; quantity: number }[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
};

export default function OrderSummary({
  order,
  onIncrease,
  onDecrease,
  onRemove,
}: OrderSummaryProps) {

  // ⭐ FIX: Get customer from context
  const { customer } = useCustomer();

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {/* ⭐ FIX: Show customer name ABOVE the list */}
      {customer?.name && (
        <p className="text-sm text-gray-700 mb-4">
          <strong>Customer:</strong> {customer.name}
        </p>
      )}

      {/* Empty state */}
      {order.length === 0 && (
        <p className="text-gray-500">No items added yet.</p>
      )}

      {/* Order items */}
      <ul className="space-y-4">
        {order.map((item: { product: Product; quantity: number }) => (
          <li
            key={item.product.id}
            className="flex justify-between items-center"
          >
            {/* Product name + line total */}
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center space-x-2">

              <button
                onClick={() => onDecrease(item.product.id)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                –
              </button>

              <span className="w-8 text-center">{item.quantity}</span>

              <button
                onClick={() => onIncrease(item.product.id)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>

              <button
                onClick={() => onRemove(item.product.id)}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
