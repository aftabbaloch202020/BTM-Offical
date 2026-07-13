import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  ShoppingCart, 
  CreditCard, 
  Gift, 
  Award, 
  Sparkles, 
  X,
  Info
} from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: string;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const getToastIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <ShoppingCart className="w-5 h-5 text-amber-500 shrink-0" />;
    case 'payment':
      return <CreditCard className="w-5 h-5 text-emerald-400 shrink-0" />;
    case 'lucky':
      return <Gift className="w-5 h-5 text-purple-400 shrink-0" />;
    case 'product':
      return <Sparkles className="w-5 h-5 text-yellow-400 shrink-0" />;
    case 'admin':
      return <Award className="w-5 h-5 text-amber-500 shrink-0" />;
    case 'promo':
    default:
      return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
  }
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
            layout
            className="pointer-events-auto bg-zinc-950/95 border-l-4 border-l-amber-500 border border-amber-500/20 text-stone-100 p-4 rounded shadow-[0_4px_25px_rgba(212,175,55,0.15)] flex gap-3 items-start justify-between relative overflow-hidden backdrop-blur-md"
          >
            {/* Ambient Gold glow line inside toast */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent"></div>
            
            <div className="flex gap-3 items-start">
              <div className="bg-zinc-900 p-1.5 rounded border border-amber-500/10">
                {getToastIcon(toast.type)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-amber-400 font-display uppercase tracking-wider">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-stone-300 mt-1 leading-relaxed font-sans font-medium">
                  {toast.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => onRemove(toast.id)}
              className="text-stone-400 hover:text-amber-500 p-1 transition-colors hover:bg-zinc-900 rounded"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
