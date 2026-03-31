"use client";

import { products, Product } from "../lib/products";

type ProductListProps = {
  onAdd: (product: Product) => void;
};

export default function ProductList({ onAdd }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onAdd(product)}
        className="group relative flex flex-col items-center justify-center aspect-square p-6 
           border-2 border-violet-300 bg-violet-50 
           transition-all duration-300 active:scale-95 rounded-3xl
           /* ✨ The Glow Effect */
           hover:border-brand hover:shadow-[0_0_40px_8px_rgba(167,139,250,0.6)]">
          <div className="w-20 h-20 mb-4 rounded-full bg-violet-200 flex items-center justify-center 
                          group-hover:bg-violet-300 transition-colors duration-300 
                          ">
            <span className="text-4xl filter drop-shadow-sm">
              {product.name.toLowerCase().includes("cookie") ? "🍪" : "🍫"}
            </span>
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base leading-tight">
              {product.name}
            </h3>
            <p className="text-brand-hover dark:text-brand font-black text-lg">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-brand text-white rounded-full p-1.5 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}