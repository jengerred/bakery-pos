"use client";

import { Product } from "@/app/pos/lib/products";

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
  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {order.length === 0 && (
        <p className="text-gray-500">No items added yet.</p>
      )}

      <ul className="space-y-4">
        {order.map((item) => (
          <li
            key={item.product.id}
            className="flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {/* Decrease */}
              <button
                onClick={() => onDecrease(item.product.id)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                –
              </button>

              {/* Quantity */}
              <span className="w-8 text-center">{item.quantity}</span>

              {/* Increase */}
              <button
                onClick={() => onIncrease(item.product.id)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>

              {/* Remove */}
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
