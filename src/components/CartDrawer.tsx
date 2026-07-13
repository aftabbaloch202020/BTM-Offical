import React, { useRef, useEffect } from 'react';
import { 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onClearCart,
  onProceedToCheckout,
  onSelectProduct
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        // Prevent closing if we clicked on the Cart button itself or another trigger that might handle it
        const target = event.target as HTMLElement;
        if (!target.closest('.cart-trigger')) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Lock scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000000] z-[999]"
          />

          {/* Sliding Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full bg-[#050505] border-l border-amber-500/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] z-[1000] flex flex-col w-full sm:w-[450px] md:w-[480px] max-w-full"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-amber-500/20 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold uppercase font-display tracking-wider text-amber-500">
                  Your Cart ({totalItems})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-zinc-900 border border-amber-500/10 hover:border-amber-500/50 text-stone-400 hover:text-amber-500 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-zinc-900/80 border border-amber-500/10 flex items-center justify-center text-stone-600">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-stone-400 text-sm font-medium">Your cart is currently empty.</p>
                  <p className="text-stone-600 text-xs">Browse the catalog to add premium items!</p>
                  <button
                    onClick={onClose}
                    className="mt-2 inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-md transition-all cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const itemSubtotal = item.product.price * item.quantity;
                    return (
                      <div 
                        key={item.product.id}
                        className="flex gap-4 bg-zinc-950/70 p-3 rounded-lg border border-amber-500/10 items-center justify-between group hover:border-amber-500/30 transition-all"
                      >
                        {/* Product Image */}
                        <div 
                          onClick={() => {
                            if (onSelectProduct) onSelectProduct(item.product);
                            onClose();
                          }}
                          className="w-16 h-16 rounded overflow-hidden bg-zinc-900 border border-amber-500/10 shrink-0 cursor-pointer"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 
                            onClick={() => {
                              if (onSelectProduct) onSelectProduct(item.product);
                              onClose();
                            }}
                            className="text-xs font-bold text-stone-200 truncate cursor-pointer hover:text-amber-500 transition-colors"
                          >
                            {item.product.name}
                          </h4>
                          <div className="text-[11px] font-mono text-amber-500 mt-1">
                            Rs. {item.product.price.toLocaleString()}
                          </div>
                          
                          <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                            Subtotal: Rs. {itemSubtotal.toLocaleString()}
                          </div>
                        </div>

                        {/* Quantity Selector & Actions Group */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          {/* Qty Buttons */}
                          <div className="flex items-center bg-zinc-900 border border-amber-500/15 rounded">
                            <button
                              onClick={() => onUpdateCartQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="p-1.5 text-stone-400 hover:text-amber-500 transition-colors"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-bold text-stone-200">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateCartQuantity(item.product.id, item.quantity + 1)}
                              className="p-1.5 text-stone-400 hover:text-amber-500 transition-colors"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => onRemoveFromCart(item.product.id)}
                            className="text-stone-500 hover:text-red-500 p-1 rounded transition-colors flex items-center gap-1 text-[10px] uppercase font-mono tracking-tight"
                            title="Remove product"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Drawer Footer Summary (only if items exist) */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-amber-500/20 bg-zinc-950 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-stone-400 font-medium">
                    <span>Total Items:</span>
                    <span className="font-mono text-stone-200">{totalItems}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-amber-500/10 pt-2.5">
                    <span className="text-xs uppercase tracking-wider font-bold text-amber-500">Subtotal:</span>
                    <span className="text-xl font-mono font-extrabold text-amber-500">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 italic">
                    * Final shipping calculated at checkout
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    onClick={onProceedToCheckout}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold h-11 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={onClose}
                      className="bg-zinc-900 hover:bg-zinc-850 text-stone-300 border border-amber-500/10 font-bold h-10 rounded text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to empty your shopping cart?')) {
                          onClearCart();
                        }
                      }}
                      className="bg-zinc-950 hover:bg-red-950/20 text-stone-500 hover:text-red-400 border border-amber-500/5 hover:border-red-500/20 font-bold h-10 rounded text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Empty Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
