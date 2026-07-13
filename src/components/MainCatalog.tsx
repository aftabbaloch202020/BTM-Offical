import React, { useState, useEffect } from 'react';
import { 
  Shirt, 
  Sparkles, 
  Laptop, 
  Clock as ClockIcon, 
  Footprints, 
  Home as HomeIcon, 
  Gamepad, 
  Smartphone, 
  Briefcase, 
  Heart,
  ChevronRight,
  ArrowRight,
  ShoppingCart,
  Check
} from 'lucide-react';
import { Product } from '../types';
// @ts-ignore
import bannerImg from '../assets/images/balochistan_banner_1783758743515.jpg';

interface MainCatalogProps {
  products: Product[];
  categories: Array<{ id: string; name: string; icon: string }>;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistIds: string[];
  onAddToCart: (product: Product) => void;
}

// Icon mapper for categories using Lucide icons
const iconMap: Record<string, any> = {
  Shirt,
  Sparkles,
  Laptop,
  Clock: ClockIcon,
  Footprints,
  Home: HomeIcon,
  Gamepad,
  Smartphone,
  Briefcase
};

export const MainCatalog: React.FC<MainCatalogProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToWishlist,
  wishlistIds,
  onAddToCart
}) => {
  // Countdown state for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 15, seconds: 30 });
  const [addedPopupId, setAddedPopupId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset
          return { hours: 2, minutes: 15, seconds: 30 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerAddNotification = (productId: string) => {
    setAddedPopupId(productId);
    setTimeout(() => {
      setAddedPopupId(null);
    }, 1500);
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Section 3: Hero Banner */}
      <div className="relative w-full rounded-xl overflow-hidden border border-amber-500/35 bg-zinc-950 shadow-xl shadow-amber-500/5 hover:shadow-amber-500/15 transition-all duration-500 gold-glow h-auto md:h-[340px] flex items-center justify-center">
        <img
          src={bannerImg}
          alt="Balochistan Trusted Mart Official Banner"
          referrerPolicy="no-referrer"
          className="w-full h-auto md:h-full md:object-cover md:object-center block rounded-xl"
        />
        {/* Responsive Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent flex items-center p-4 sm:p-6 md:p-8">
          <div className="max-w-[85%] sm:max-w-[70%] md:max-w-[60%] flex flex-col justify-center space-y-1 sm:space-y-2 md:space-y-3">
            <div className="space-y-0.5 sm:space-y-1">
              <h2 className="text-xs sm:text-xl md:text-2xl lg:text-3xl font-extrabold font-display tracking-tight leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 drop-shadow-sm">
                  Trusted Shop
                </span>
                <br />
                <span className="text-white drop-shadow-md">
                  Live Better
                </span>
              </h2>
            </div>
            
            <div className="text-[8px] sm:text-[11px] md:text-xs lg:text-sm text-white/95 font-medium leading-relaxed tracking-wide space-y-0.5 sm:space-y-1">
              <p className="drop-shadow">Quality Products | Best Prices</p>
              <p className="drop-shadow">Secure Shopping | Fast Delivery</p>
            </div>

            <div className="pt-1 sm:pt-2">
              <button 
                onClick={() => {
                  onSelectCategory('all');
                  const element = document.getElementById('shop-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-black px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] md:text-xs transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 cursor-pointer uppercase tracking-widest border border-amber-300/35"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Shop by Category */}
      <div id="shop-section" className="bg-zinc-950 border border-amber-500/20 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold font-display text-amber-500 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-sm"></span>
            Shop by Category
          </h3>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs text-stone-400 hover:text-amber-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {categories.map((cat) => {
            const isImageUrl = cat.icon && (cat.icon.startsWith('http://') || cat.icon.startsWith('https://') || cat.icon.startsWith('/') || cat.icon.includes('.png') || cat.icon.includes('.jpg') || cat.icon.includes('.jpeg'));
            const IconComp = !isImageUrl ? (iconMap[cat.icon] || Shirt) : null;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all text-center group cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 border-amber-500 text-zinc-950 font-bold'
                    : 'bg-zinc-900 border-amber-500/10 text-stone-300 hover:border-amber-500/50 hover:bg-zinc-850'
                }`}
              >
                <div className={`w-9 h-9 rounded-full mb-1.5 transition-colors overflow-hidden flex items-center justify-center ${
                  isSelected ? 'bg-zinc-950 text-amber-400' : 'bg-zinc-800 text-amber-500 group-hover:bg-amber-500/10'
                }`}>
                  {isImageUrl ? (
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                  ) : IconComp ? (
                    <IconComp className="w-5 h-5" />
                  ) : null}
                </div>
                <span className="text-[10px] sm:text-xs font-semibold uppercase leading-tight tracking-tight">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedCategory !== 'all' ? (
        /* Dedicated Category view */
        <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-5">
          <div className="flex justify-between items-center mb-5 border-b border-amber-500/10 pb-3">
            <h3 className="text-base font-bold font-display text-amber-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-sm"></span>
              {categories.find(c => c.id === selectedCategory)?.name || 'Products'}
            </h3>
            <button 
              onClick={() => onSelectCategory('all')}
              className="text-xs text-stone-400 hover:text-amber-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[1200px]:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map((p) => {
              const isWishlisted = wishlistIds.includes(p.id);
              return (
                <div 
                  key={p.id}
                  className="bg-zinc-900 border border-amber-500/10 rounded-lg p-3 relative group hover:border-amber-500/50 transition-all flex flex-col justify-between h-full"
                >
                  {/* Discount Tag */}
                  <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-stone-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {p.discount || '-20%'}
                  </div>
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => onAddToWishlist(p)}
                    className="absolute top-2.5 right-2.5 z-10 bg-zinc-950/80 hover:bg-zinc-950 p-2 rounded-full border border-amber-500/20 text-stone-400 hover:text-red-500 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Image */}
                  <div 
                    onClick={() => onSelectProduct(p)}
                    className="aspect-square rounded overflow-hidden bg-zinc-950 relative mb-3 cursor-pointer"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Name & Pricing */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h4 
                        onClick={() => onSelectProduct(p)}
                        className="text-xs font-bold text-stone-200 line-clamp-2 mb-1 hover:text-amber-400 cursor-pointer h-8 leading-tight"
                      >
                        {p.name}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-500/5">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-500 block">
                          Rs. {p.price.toLocaleString()}
                        </span>
                        <span className="text-[9px] font-mono text-stone-500 line-through">
                          Rs. {(p.originalPrice || Math.round(p.price * 1.25)).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          onAddToCart(p);
                          triggerAddNotification(p.id);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-zinc-950 h-11 w-11 sm:h-9 sm:w-9 flex items-center justify-center rounded-md transition-colors cursor-pointer shrink-0"
                        title="Add to Cart"
                      >
                        {addedPopupId === p.id ? (
                          <Check className="w-4 h-4 font-bold" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* Section 5: Flash Sale */}
          <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 border-b border-amber-500/10 pb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold font-display text-amber-500 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-amber-500 rounded-sm animate-pulse"></span>
                  ⚡ Flash Sale
                </h3>
                {/* Dynamic Clock */}
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded text-amber-500 text-xs font-mono font-bold uppercase">
                  <span className="mr-1">Ending in:</span>
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
              <button 
                onClick={() => onSelectCategory('all')}
                className="text-xs text-stone-400 hover:text-amber-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Flash sale products with perfect 5-column responsive alignment */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[1200px]:grid-cols-5 gap-3 sm:gap-4">
              {products.slice(0, 5).map((p) => {
                const isWishlisted = wishlistIds.includes(p.id);
                return (
                  <div 
                    key={p.id}
                    className="bg-zinc-900 border border-amber-500/10 rounded-lg p-3 relative group hover:border-amber-500/50 transition-all flex flex-col justify-between h-full"
                  >
                    {/* Discount Tag */}
                    <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-stone-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {p.discount || '-20%'}
                    </div>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={() => onAddToWishlist(p)}
                      className="absolute top-2.5 right-2.5 z-10 bg-zinc-950/80 hover:bg-zinc-950 p-2 rounded-full border border-amber-500/20 text-stone-400 hover:text-red-500 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    {/* Image */}
                    <div 
                      onClick={() => onSelectProduct(p)}
                      className="aspect-square rounded overflow-hidden bg-zinc-950 relative mb-3 cursor-pointer"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Name & Pricing */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h4 
                          onClick={() => onSelectProduct(p)}
                          className="text-xs font-bold text-stone-200 line-clamp-2 mb-1 hover:text-amber-400 cursor-pointer h-8 leading-tight"
                        >
                          {p.name}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-500/5">
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-500 block">
                            Rs. {p.price.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-mono text-stone-500 line-through">
                            Rs. {(p.originalPrice || Math.round(p.price * 1.25)).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            onAddToCart(p);
                            triggerAddNotification(p.id);
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 h-11 w-11 sm:h-9 sm:w-9 flex items-center justify-center rounded-md transition-colors cursor-pointer shrink-0"
                          title="Add to Cart"
                        >
                          {addedPopupId === p.id ? (
                            <Check className="w-4 h-4 font-bold" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 6: New Arrivals */}
          <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4 border-b border-amber-500/10 pb-3">
              <h3 className="text-base font-bold font-display text-amber-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-sm"></span>
                📦 New Arrivals
              </h3>
              <button 
                onClick={() => onSelectCategory('all')}
                className="text-xs text-stone-400 hover:text-amber-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[1200px]:grid-cols-5 gap-3 sm:gap-4">
              {products.slice(1, 6).map((p) => {
                const isWishlisted = wishlistIds.includes(p.id);
                return (
                  <div 
                    key={p.id}
                    className="bg-zinc-900 border border-amber-500/10 rounded-lg p-3 relative group hover:border-amber-500/50 transition-all flex flex-col justify-between h-full"
                  >
                    {/* Discount Tag */}
                    <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-stone-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {p.discount || '-20%'}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => onAddToWishlist(p)}
                      className="absolute top-2.5 right-2.5 z-10 bg-zinc-950/80 hover:bg-zinc-950 p-2 rounded-full border border-amber-500/20 text-stone-400 hover:text-red-500 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    {/* Image */}
                    <div 
                      onClick={() => onSelectProduct(p)}
                      className="aspect-square rounded overflow-hidden bg-zinc-950 mb-3 cursor-pointer"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Name & Pricing */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h4 
                          onClick={() => onSelectProduct(p)}
                          className="text-xs font-bold text-stone-200 line-clamp-2 mb-1 hover:text-amber-400 cursor-pointer h-8 leading-tight"
                        >
                          {p.name}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-500/5">
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-500 block">
                            Rs. {p.price.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-mono text-stone-500 line-through">
                            Rs. {(p.originalPrice || Math.round(p.price * 1.25)).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            onAddToCart(p);
                            triggerAddNotification(p.id);
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 h-11 w-11 sm:h-9 sm:w-9 flex items-center justify-center rounded-md transition-colors cursor-pointer shrink-0"
                          title="Add to Cart"
                        >
                          {addedPopupId === p.id ? (
                            <Check className="w-4 h-4 font-bold" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 7: Best Selling Products */}
          <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4 border-b border-amber-500/10 pb-3">
              <h3 className="text-base font-bold font-display text-amber-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-sm"></span>
                🔥 Best Selling Products
              </h3>
              <button 
                onClick={() => onSelectCategory('all')}
                className="text-xs text-stone-400 hover:text-amber-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[1200px]:grid-cols-5 gap-3 sm:gap-4">
              {products.slice(0, 5).reverse().map((p) => {
                const isWishlisted = wishlistIds.includes(p.id);
                return (
                  <div 
                    key={p.id}
                    className="bg-zinc-900 border border-amber-500/10 rounded-lg p-3 relative group hover:border-amber-500/50 transition-all flex flex-col justify-between h-full"
                  >
                    {/* Discount Tag */}
                    <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-stone-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {p.discount || '-20%'}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => onAddToWishlist(p)}
                      className="absolute top-2.5 right-2.5 z-10 bg-zinc-950/80 hover:bg-zinc-950 p-2 rounded-full border border-amber-500/20 text-stone-400 hover:text-red-500 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    {/* Image */}
                    <div 
                      onClick={() => onSelectProduct(p)}
                      className="aspect-square rounded overflow-hidden bg-zinc-950 mb-3 cursor-pointer"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Name & Pricing */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h4 
                          onClick={() => onSelectProduct(p)}
                          className="text-xs font-bold text-stone-200 line-clamp-2 mb-1 hover:text-amber-400 cursor-pointer h-8 leading-tight"
                        >
                          {p.name}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-500/5">
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-500 block">
                            Rs. {p.price.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-mono text-stone-500 line-through">
                            Rs. {(p.originalPrice || Math.round(p.price * 1.25)).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            onAddToCart(p);
                            triggerAddNotification(p.id);
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 h-11 w-11 sm:h-9 sm:w-9 flex items-center justify-center rounded-md transition-colors cursor-pointer shrink-0"
                          title="Add to Cart"
                        >
                          {addedPopupId === p.id ? (
                            <Check className="w-4 h-4 font-bold" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

    </div>
  );
};
