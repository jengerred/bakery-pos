"use client";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all">
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border-4 border-red-500 max-w-md w-full animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-red-100 rounded-full text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">End Shift?</h2>
          <p className="text-slate-500 font-medium mb-10">This will lock the terminal and require a PIN to re-enter.</p>

          <div className="grid grid-cols-1 w-full gap-4">
            <button 
              onClick={onConfirm}
              className="py-5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-500/40 transition-all active:scale-95"
            >
              Confirm Logout
            </button>
            <button 
              onClick={onClose}
              className="py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}