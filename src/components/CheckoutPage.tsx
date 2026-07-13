import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Image as ImageIcon, 
  Upload, 
  Lock, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard 
} from 'lucide-react';
import { CartItem, Product } from '../types';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onPlaceOrder: (billingDetails: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    area: string;
    paymentMethod: string;
    screenshot: string;
  }) => void;
  settings?: {
    shippingRate?: string;
    minOrderFreeShipping?: string;
  };
  onNavigate: (sectionId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onPlaceOrder,
  settings,
  onNavigate
}) => {
  // Form States
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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Calculations
  const shippingRate = parseInt(settings?.shippingRate || '200');
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 0 ? shippingRate : 0;
  const totalBill = subtotal + shipping;

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setScreenshot('https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?w=400&auto=format&fit=crop');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !area) {
      setErrorMsg('Please fill in all required (*) billing fields.');
      return;
    }
    if (cartItems.length === 0) {
      setErrorMsg('Your shopping cart is empty. Please add items to checkout.');
      return;
    }
    if (!screenshot) {
      setErrorMsg('Payment proof screenshot upload is strictly mandatory before placing order.');
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
    setSuccessMsg('Your order has been submitted successfully! Check the Tracker in the Account Panel.');
    
    // Smooth scroll back up
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setSuccessMsg('');
      onNavigate('home');
    }, 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-1 py-4 font-sans text-stone-100">
      {/* Back link */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-wider mb-6 cursor-pointer min-h-[36px]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </button>

      {/* Main Title Banner */}
      <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-5 mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold uppercase font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 tracking-wider">
          Checkout Center
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Complete your premium order details below. Hand-picked selections, secure packaging, and trusted delivery.
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs sm:text-sm">
          {errorMsg}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-10 text-center space-y-4">
          <p className="text-stone-400 text-sm">Your cart is empty. There is nothing to checkout.</p>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-md cursor-pointer"
          >
            Go Shop Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (Colspan 7): Billing & Payment */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Shipping / Billing Information */}
            <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider font-display text-amber-500 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-sm"></span>
                1. Shipping & Billing Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-stone-400 uppercase font-mono font-bold block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sana Baloch"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-900 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2.5 rounded outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 uppercase font-mono font-bold block mb-1">
                    Phone Number (Active WhatsApp) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 03XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2.5 rounded outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-400 uppercase font-mono font-bold block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. customer@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2.5 rounded outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 uppercase font-mono font-bold block mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  required
                  placeholder="House / Apartment #, Street Name, Sector, Ward details"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-900 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2.5 rounded outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-stone-400 uppercase font-mono font-bold block mb-1">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-zinc-900 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2.5 rounded outline-none cursor-pointer font-bold"
                  >
                    <option value="Quetta">Quetta</option>
                    <option value="Loralai">Loralai</option>
                    <option value="Gwadar">Gwadar</option>
                    <option value="Hub">Hub</option>
                    <option value="Khuzdar">Khuzdar</option>
                    <option value="Sibi">Sibi</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 uppercase font-mono font-bold block mb-1">
                    Area / Ward *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sariab Road"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-zinc-900 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2.5 rounded outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Selector */}
            <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider font-display text-amber-500 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-sm"></span>
                2. Select Online Payment Provider
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {['EasyPaisa', 'JazzCash', 'Bank Transfer'].map((method) => (
                  <label
                    key={method}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === method
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                        : 'bg-zinc-900 border-amber-500/10 text-stone-400 hover:border-amber-500/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method_option"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="sr-only"
                    />
                    <CreditCard className="w-4 h-4 mb-1 text-amber-500" />
                    <span className="text-[10px] uppercase font-mono tracking-tighter text-center">{method}</span>
                  </label>
                ))}
              </div>

              {/* Step-by-step guideline */}
              <div className="p-3.5 bg-zinc-900 rounded-lg border border-amber-500/10 text-xs text-stone-400 space-y-1.5">
                <div className="text-amber-500 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Transfer Guidelines:</span>
                </div>
                <p>1. Send the bill amount of <strong className="text-amber-400 font-mono">Rs. {totalBill.toLocaleString()}</strong> to the corresponding BTM Account details provided during chat or invoice.</p>
                <p>2. Save a screenshot or photo of the receipt containing the reference/transaction ID.</p>
                <p>3. Upload this proof in the attachment uploader below so our administrative panel can instantly crossverify and approve.</p>
              </div>
            </div>

            {/* Step 3: Payment Proof Attachment */}
            <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider font-display text-amber-500 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-sm"></span>
                3. Mandatory Payment Screenshot Receipt
              </h3>

              <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-lg border border-amber-500/10">
                <div className="relative shrink-0 w-16 h-16 rounded bg-zinc-950 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  {screenshot ? (
                    <img src={screenshot} alt="Receipt proof" className="w-full h-full object-cover rounded" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-stone-600" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    id="checkout-screenshot-upload"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="checkout-screenshot-upload"
                    className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 hover:text-zinc-950 text-amber-400 text-xs font-bold px-4 py-2 rounded cursor-pointer transition-all min-h-[40px]"
                  >
                    <Upload className="w-4 h-4" />
                    Attach Screenshot Receipt
                  </label>
                  <p className="text-[10px] text-stone-500 mt-2">
                    {screenshot ? '✓ Payment screenshot attached' : 'Upload JPEG or PNG receipt screenshot'}
                  </p>
                </div>
              </div>

              {/* Form submit block */}
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold h-12 rounded-lg text-xs sm:text-sm uppercase tracking-widest transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                <Lock className="w-4 h-4" />
                Submit Order & Pay (Rs. {totalBill.toLocaleString()})
              </button>
            </div>

          </form>

          {/* Right Column (Colspan 5): Order Summary */}
          <div className="lg:col-span-5 bg-zinc-950 border border-amber-500/20 rounded-xl p-5 space-y-5 sticky top-6">
            <h3 className="text-sm font-bold uppercase tracking-wider font-display text-amber-500 flex items-center gap-2 border-b border-amber-500/10 pb-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-sm"></span>
              Order Summary
            </h3>

            {/* List of checkout items */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const itemSubtotal = item.product.price * item.quantity;
                return (
                  <div 
                    key={item.product.id}
                    className="flex gap-3 bg-zinc-900/60 p-2.5 rounded border border-amber-500/5 items-center justify-between"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded object-cover border border-amber-500/10 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-200 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[10px] font-mono text-stone-400 mt-0.5">
                        Rs. {item.product.price.toLocaleString()} x {item.quantity}
                      </div>
                      <div className="text-[11px] font-mono text-amber-500 font-bold mt-0.5">
                        Subtotal: Rs. {itemSubtotal.toLocaleString()}
                      </div>
                    </div>

                    {/* Simple Qty adjust inside checkout */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center bg-zinc-950 border border-amber-500/15 rounded scale-90">
                        <button
                          type="button"
                          onClick={() => onUpdateCartQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-1 py-1 text-stone-400 hover:text-amber-500 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-1.5 text-xs font-mono font-bold text-stone-200">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-1 py-1 text-stone-400 hover:text-amber-500 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveFromCart(item.product.id)}
                        className="text-stone-500 hover:text-red-500 p-0.5"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Calculations block */}
            <div className="border-t border-dashed border-amber-500/20 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal Items:</span>
                <span className="font-mono text-stone-200">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Shipping Fee:</span>
                <span className="font-mono text-stone-200">Rs. {shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-100 font-bold border-t border-amber-500/10 pt-3 text-sm">
                <span>Grand Total:</span>
                <span className="text-amber-500 font-mono text-base">Rs. {totalBill.toLocaleString()}</span>
              </div>
            </div>

            {/* Reassurance text */}
            <div className="text-[10px] text-stone-500 space-y-1 bg-zinc-900/40 p-2.5 rounded border border-amber-500/5">
              <p>🔒 256-Bit SSL Encrypted checkout transmission protocol.</p>
              <p>🛡️ Zero spam or unauthorized sharing. BTM Balochistan Trusted Mart Official Guarantee.</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
