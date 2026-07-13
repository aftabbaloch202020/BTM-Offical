import React, { useRef, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Heart, 
  ShoppingCart,
  ShoppingBag,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('.wishlist-trigger')) {
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

  // Get wishlist products
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  // Move product to cart (adds to cart, removes from wishlist)
  const handleMoveToCart = (product: Product) => {
    onAddToCart(product);
    onRemoveFromWishlist(product);
  };

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
                <Heart className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="text-base font-bold uppercase font-display tracking-wider text-amber-500">
                  Your Wishlist ({wishlistProducts.length})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-zinc-900 border border-amber-500/10 hover:border-amber-500/50 text-stone-400 hover:text-amber-500 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Close wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
              {wishlistProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-zinc-900/80 border border-amber-500/10 flex items-center justify-center text-stone-600">
                    <Heart className="w-8 h-8" />
                  </div>
                  <p className="text-stone-300 text-sm font-semibold tracking-wide uppercase font-display">
                    Your wishlist is empty.
                  </p>
                  <p className="text-stone-500 text-xs max-w-[250px] leading-relaxed">
                    Explore our curated collection of premium products and tap the heart icon to save them here!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-md transition-all cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlistProducts.map((product) => {
                    // Check stock status
                    const inStock = product.stock !== undefined ? product.stock > 0 : true;
                    return (
                      <div 
                        key={product.id}
                        className="flex gap-4 bg-zinc-950/70 p-3 rounded-lg border border-amber-500/10 items-center justify-between group hover:border-amber-500/30 transition-all"
                      >
                        {/* Product Image */}
                        <div 
                          onClick={() => {
                            if (onSelectProduct) onSelectProduct(product);
                            onClose();
                          }}
                          className="w-16 h-16 rounded overflow-hidden bg-zinc-900 border border-amber-500/10 shrink-0 cursor-pointer"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 
                            onClick={() => {
                              if (onSelectProduct) onSelectProduct(product);
                              onClose();
                            }}
                            className="text-xs font-bold text-stone-200 truncate cursor-pointer hover:text-amber-500 transition-colors"
                          >
                            {product.name}
                          </h4>
                          <div className="text-[11px] font-mono text-amber-500 mt-1">
                            Rs. {product.price.toLocaleString()}
                          </div>
                          
                          {/* Stock Status Indicator */}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            <span className="text-[9px] font-mono tracking-wider uppercase text-stone-400">
                              {inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>

                        {/* Actions Group */}
                        <div className="flex flex-col items-end gap-2.5 shrink-0">
                          {/* Add/Move to Cart */}
                          <button
                            onClick={() => handleMoveToCart(product)}
                            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                            title="Move to Cart"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Add to Cart</span>
                          </button>

                          {/* Remove from Wishlist */}
                          <button
                            onClick={() => onRemoveFromWishlist(product)}
                            className="text-stone-500 hover:text-red-500 p-1 rounded transition-colors flex items-center gap-1 text-[10px] uppercase font-mono tracking-tight"
                            title="Remove from Wishlist"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
