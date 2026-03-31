"use client";

/* -------------------------------------------------------
   🧺 Product Type
------------------------------------------------------- */
import { Product } from "../lib/products";

/* -------------------------------------------------------
   🪟 ProductOptionsModal (Cashier-Side)
   🎨 UPDATED: Support for Lilac Brand theme and Dark Mode.
------------------------------------------------------- */
type ProductOptionsModalProps = {
  product: Product;
  quantity: number;
  existsInCart: boolean;
  onClose: () => void;
  onSave: (product: Product, newQty: number) => void;
  onDelete: (product: Product) => void;
};

export default function ProductOptionsModal({
  product,
  quantity,
  existsInCart,
  onClose,
  onSave,
  onDelete,
}: ProductOptionsModalProps) {

  if (!product) return null;

  return (
    /* Overlay uses a darker backdrop for better focus */
    <div className="fixed inset-0 bg-violet-900/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
      
      {/* 🎯 MAIN MODAL CONTAINER
          Added dark:bg-slate-900 and dark:border-slate-800 
      */}
      <div className="bg-white dark:bg-violet-100 p-8 rounded-3xl w-96 shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-500">

        {/* 🏷️ PRODUCT HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {product.name}
          </h2>
          <p className="text-brand dark:text-brand-light font-bold text-lg">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* 🔢 QUANTITY SELECTOR 
            Updated with larger touch targets for the cashier
        */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-8">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-widest">
              Quantity
            </span>

            <div className="flex items-center gap-6">
              <button
                onClick={() => onSave(product, Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-xl hover:border-brand transition-colors dark:text-white"
              >
                –
              </button>

              <span className="text-2xl font-black w-8 text-center dark:text-white">
                {quantity}
              </span>

              <button
                onClick={() => onSave(product, quantity + 1)}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-xl hover:border-brand transition-colors dark:text-white"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 🗑️ ACTION BUTTONS */}
        <div className="flex gap-4 items-center">
          
          <button
            onClick={onClose}
            className="flex-1 py-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold transition-colors"
          >
            Cancel
          </button>

          {existsInCart && (
            <button
              onClick={() => onDelete(product)}
              className="px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold transition-all"
            >
              Remove
            </button>
          )}

          {/* 🟣 THE LILAC BRAND BUTTON */}
          <button
            onClick={() => {
              onSave(product, quantity);
              onClose();
            }}
            className="flex-1 py-4 bg-brand hover:bg-brand-hover text-white rounded-2xl font-black text-lg shadow-lg shadow-brand/20 active:scale-95 transition-all"
          >
            {existsInCart ? "Update" : "Add to Order"}
          </button>
        </div>
      </div>
    </div>
  );
}