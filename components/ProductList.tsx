"use client";

import { products, Product } from "../lib/products";

type ProductListProps = {
  onAdd: (product: Product, quantity: number, price?: number) => void;
};

export default function ProductList({ onAdd }: ProductListProps) {
  // 1. Group products by flavor (Chocolate Chip, Brownie, Peanut Butter)
  // This looks for the part of the name before the " - "
  const flavors = ["Chocolate Chip Cookies", "Brownies", "Peanut Butter Cookies"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {flavors.map((flavor) => {
        // Find the specific single and dozen versions from our products file
        const single = products.find(p => p.name === `${flavor} - Single`);
        const dozen = products.find(p => p.name === `${flavor} - Dozen`);

        if (!single || !dozen) return null;

        const isCookie = flavor.toLowerCase().includes("cookie");

        return (
          <div
            key={flavor}
            className="group relative flex flex-col items-center p-8 border-2 border-violet-400 bg-violet-300 transition-all duration-300 rounded-[2.5rem] hover:border-violet-600 hover:bg-violet-100/50 hover:shadow-[0_0_40px_8px_rgba(167,139,250,0.6)]"
          >
            {/* 🍪 Icon */}
            <div className="w-20 h-20 mb-4 rounded-full bg-violet-200 flex items-center justify-center group-hover:bg-violet-300 transition-colors duration-300">
              <span className="text-5xl filter drop-shadow-md">
                {isCookie ? "🍪" : "🍫"}
              </span>
            </div>

            {/* 🏷️ Name */}
            <div className="h-16 flex items-center justify-center mb-8">
              <h3 className="font-black text-slate-900 text-2xl uppercase tracking-tighter text-center leading-tight">
                {flavor}
              </h3>
            </div>

            {/* 💰 Buttons */}
            <div className="grid grid-cols-2 w-full gap-4 mt-auto">
              <button
                onClick={() => onAdd(single, 1)}
                className="flex flex-col items-center justify-center py-6 px-2 bg-white/70 border-2 border-violet-500 rounded-[1.5rem] transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-sm"
              >
                <span className="text-[13px] font-black text-violet-900 uppercase tracking-widest mb-1">SINGLE</span>
                <span className="text-2xl font-black text-violet-600">${single.price.toFixed(2)}</span>
              </button>

              <button
                onClick={() => onAdd(dozen, 1)}
                className="flex flex-col items-center justify-center py-6 px-2 bg-violet-600 border-2 border-violet-600 rounded-[1.5rem] transition-all hover:bg-violet-700 hover:border-violet-800 hover:scale-105 active:scale-95 shadow-md"
              >
                <span className="text-[13px] font-black text-violet-100 uppercase tracking-widest mb-1">DOZEN</span>
                <span className="text-3xl font-black text-white">${dozen.price.toFixed(0)}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}