"use client";

import { Product } from "@/app/pos/lib/products";

type OrderItem = {
  product: Product;
  quantity: number;
};

type OrderTotalsProps = {
  order: OrderItem[];
};

export default function OrderTotals({ order }: OrderTotalsProps) {
  const subtotal = order.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const taxRate = 0.06; // Michigan sales tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <section className="p-4 border rounded-lg bg-white shadow mt-4">
      <h2 className="text-lg font-semibold mb-3">Totals</h2>

      <div className="flex justify-between text-sm mb-1">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm mb-1">
        <span>Tax (6%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>

      <div className="flex justify-between font-semibold text-base mt-2">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </section>
  );
}
