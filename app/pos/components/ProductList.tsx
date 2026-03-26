"use client";

import { products } from "@/app/pos/lib/products";
import { Product } from "@/app/pos/lib/products";


type ProductListProps = {
  onAdd: (product: Product) => void;
};

export default function ProductList({ onAdd }: ProductListProps) {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
        >
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
          </div>

          <button
            onClick={() => onAdd(product)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}
