"use client";

import type { Product } from "@/app/pos/lib/products";

type CartItem = {
  product: Product;
  quantity: number;
};

type Props = {
  order: CartItem[];
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
};

export default function ReaderOrderSummaryScreen({
  order,
  totals,
  customerName,
}: {
  order: any;
  totals: any;
  customerName: string | null;
}) {


  return (
    <div className="space-y-4 text-gray-700">

      <h2 className="text-xl font-semibold text-center">Order Summary</h2>

       {customerName && (
        <p className="text-sm text-gray-700 mb-2">
          <strong>Customer:</strong> {customerName}
        </p>
      )}

      {/* Items */}
      <div className="space-y-2 max-h-48 overflow-auto pr-1">
        {order.map((item: { product: Product; quantity: number }) => (
          <div
            key={item.product.id}
            className="flex justify-between text-sm"
          >
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t pt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>${totals.tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
