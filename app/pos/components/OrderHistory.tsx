"use client";

import { useOrderHistoryContext } from "../context/OrderHistoryContext";


export default function OrderHistory() {
  const { history, clearHistory } = useOrderHistoryContext();

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>

      {history.length === 0 && (
        <p className="text-gray-500">No orders yet.</p>
      )}

      <ul className="space-y-4">
        {history.map((order) => (
          <li key={order.id} className="border p-3 rounded">
            <p className="font-medium">
              Order #{order.id.slice(0, 8)}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(order.timestamp).toLocaleString()}
            </p>

            <ul className="mt-2 text-sm">
              {order.items.map((item) => (
                <li key={item.product.id}>
                  {item.quantity}× {item.product.name}
                </li>
              ))}
            </ul>

            <p className="font-semibold mt-2">
              Total: ${order.total.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>

      {history.length > 0 && (
        <button
          onClick={clearHistory}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear History
        </button>
      )}
    </div>
  );
}
