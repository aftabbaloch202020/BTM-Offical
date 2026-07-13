import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  Share2, 
  CheckCircle2, 
  Upload, 
  Lock, 
  Image as ImageIcon 
} from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductAndCartProps {
  activeProduct: Product;
  cartItems: CartItem[];
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onPlaceOrder: (orderData: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    area: string;
    paymentMethod: string;
    screenshot: string;
  }) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductAndCart: React.FC<ProductAndCartProps> = ({
  activeProduct,
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onPlaceOrder,
  onSelectProduct
}) => {
  // Product details quantity state
  const [detailQty, setDetailQty] = useState(1);
  const [activeImg, setActiveImg] = useState(activeProduct.image);

  // Sync activeImg if activeProduct changes
  React.useEffect(() => {
    setActiveImg(activeProduct.image);
    setDetailQty(1);
  }, [activeProduct]);

  // Checkout Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Quetta');
  const [area, setArea] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('JazzCash');
  const [screenshot, setScreenshot] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 200 : 0;
  const totalBill = subtotal + shipping;

  // Handle local screenshot upload (reads as DataURL)
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Fallback template image
      setScreenshot('https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?w=400&auto=format&fit=crop');
    }
  };

  const submitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !area) {
      setErrorMsg('Please fill in all required (*) billing fields.');
      return;
    }
    if (cartItems.length === 0) {
      setErrorMsg('Your shopping cart is empty.');
      return;
    }
    if (!screenshot) {
      setErrorMsg('Payment screenshot upload is mandatory before placing order.');
      return;
    }

    onPlaceOrder({
      fullName,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '')}@btm.com`,
      address,
      city,
      area,
      paymentMethod,
      screenshot
    });

    // Reset forms
    setFullName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setArea('');
    setScreenshot('');
    setErrorMsg('');
    setSuccessMsg('Your order has been submitted successfully! Check Order Tracking.');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const shareProduct = (platform: string) => {
    alert(`Sharing ${activeProduct.name} via ${platform}! Link copied to clipboard.`);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Section 8: Product Details Page */}
      <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-5">
        <h3 className="text-base font-bold font-display text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-amber-500 rounded-sm"></span>
          🛍️ Product Details
        </h3>

        <div className="grid grid-cols-1 gap-5">
          {/* Main Large Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-amber-500/10 relative">
            <img
              src={activeImg}
              alt={activeProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-red-600 text-stone-100 text-xs font-bold px-2 py-0.5 rounded">
              {activeProduct.discount}
            </div>
          </div>

          {/* Image Gallery Thumbnails */}
          {activeProduct.images && activeProduct.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {activeProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img)}
                  className={`w-14 h-14 rounded border overflow-hidden bg-zinc-900 shrink-0 transition-all ${
                    activeImg === img ? 'border-amber-500 scale-95' : 'border-amber-500/10 hover:border-amber-500/40'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Product Meta */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-stone-100 font-display tracking-tight leading-snug">
              {activeProduct.name}
            </h4>

            {/* Price Line */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-xl font-mono font-extrabold text-amber-500">
                Rs. {activeProduct.price.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-stone-500 line-through">
                Rs. {activeProduct.originalPrice.toLocaleString()}
              </span>
              <span className="text-xs text-red-500 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/10">
                SAVE {activeProduct.discount}
              </span>
            </div>

            {/* Inventory Status */}
            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-amber-500/10 font-medium">
              <div className="text-stone-400">
                Stock: <span className="text-emerald-500 font-bold">{activeProduct.stock}</span>
              </div>
              <div className="text-stone-400 text-right">
                Delivery: <span className="text-amber-400 font-bold">{activeProduct.deliveryEstimate || '2-4 Days'}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-300 leading-relaxed">
              {activeProduct.description}
            </p>

            {/* Actions: Quantity + Add/Buy */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center bg-zinc-900 border border-amber-500/20 rounded-md">
                  <button
                    onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                    className="p-2 text-stone-400 hover:text-amber-500 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-mono font-bold text-stone-100">{detailQty}</span>
                  <button
                    onClick={() => setDetailQty(detailQty + 1)}
                    className="p-2 text-stone-400 hover:text-amber-500 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => onAddToCart(activeProduct, detailQty)}
                  className="bg-zinc-900 hover:bg-zinc-850 text-amber-500 hover:text-amber-400 border border-amber-500/30 hover:border-amber-500 font-bold h-11 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    onAddToCart(activeProduct, detailQty);
                    window.location.hash = 'checkout';
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold h-11 rounded-lg text-xs uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Share Grid */}
            <div className="pt-2">
              <div className="text-[10px] text-stone-500 font-mono uppercase tracking-wider mb-1.5">Share product:</div>
              <div className="flex gap-2">
                {['WhatsApp', 'Facebook', 'Twitter', 'Link'].map((p) => (
                  <button
                    key={p}
                    onClick={() => shareProduct(p)}
                    className="text-[10px] bg-zinc-900 hover:bg-zinc-800 text-stone-400 hover:text-amber-400 px-2.5 py-1 rounded border border-amber-500/10 transition-colors cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
