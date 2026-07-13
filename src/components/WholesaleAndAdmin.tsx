import React, { useState } from 'react';
import { 
  Users, 
  Building,
  Briefcase,
  Store,
  ShoppingBag
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface WholesaleAndAdminProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddNotification: (title: string, message: string, type: any) => void;
}

export const WholesaleAndAdmin: React.FC<WholesaleAndAdminProps> = ({
  orders,
  onUpdateOrderStatus,
  onAddNotification
}) => {
  // Wholesale state
  const [selectedWholesaleQty, setSelectedWholesaleQty] = useState('5 Pieces');

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Section 22: Wholesale Zone */}
      <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 gold-glow">
        <div className="border-b border-amber-500/20 pb-4 mb-6">
          <h3 className="text-xl font-bold font-display text-amber-500 uppercase tracking-widest text-center">
            🏢 WHOLESALE ZONE (FOR SHOPKEEPERS & BULK ORDERS)
          </h3>
          <p className="text-center text-stone-400 text-xs mt-1">
            Hum shopkeepers, retailers aur business partners ke liye wholesale rate par samaan available karate hain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Bulk Purchase Info */}
          <div className="bg-zinc-900/40 p-4 rounded-lg border border-amber-500/10 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Bulk Purchases</h4>
              <p className="text-[11px] text-stone-300 leading-relaxed mb-4">
                We bridge regional shopkeepers with global supply chains. Get custom quotation rates on original electronic gadgets, fashion garments and daily accessories.
              </p>
            </div>
            {/* Box vector replacement representation */}
            <div className="w-full h-24 rounded bg-zinc-950 border border-amber-500/10 flex flex-col items-center justify-center p-2 text-center">
              <span className="text-amber-500 font-extrabold text-xs">BTM WAREHOUSE LOGISTICS</span>
              <span className="text-[9px] text-stone-500 mt-1">Quetta • Gwadar • Hub Hubs</span>
            </div>
          </div>

          {/* Card 2: Bulk Order Options */}
          <div className="bg-zinc-900/40 p-4 rounded-lg border border-amber-500/10">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3">Bulk Order Options</h4>
            <div className="space-y-1.5 text-[10px] uppercase font-mono font-bold">
              {[
                '5 Pieces',
                'Half Dozen (6 Pieces)',
                '1 Dozen (12 Pieces)',
                '2 Dozen & Above',
                'Custom Bulk Quantity'
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedWholesaleQty(opt)}
                  className={`w-full text-left py-2.5 px-3 rounded border transition-colors min-h-[44px] flex items-center ${
                    selectedWholesaleQty === opt
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold'
                      : 'bg-zinc-950 text-stone-300 border-amber-500/10 hover:border-amber-500/35 font-medium'
                  }`}
                >
                  <span className="mr-1.5">📦</span> {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Card 3: Wholesale Benefits */}
          <div className="bg-zinc-900/40 p-4 rounded-lg border border-amber-500/10">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3">Wholesale Benefits</h4>
            <ul className="space-y-2 text-[10px] text-stone-300">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500">💰</span>
                <span>Special discounted wholesale rates</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500">📉</span>
                <span>Tier-based progressive bulk discounts</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500">🚀</span>
                <span>Fast dispatch directly from major shipping hubs</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500">🌏</span>
                <span>Imported products from Pakistan & China</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500">📞</span>
                <span>24/7 Dedicated Wholesaler VIP support desk</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500">📈</span>
                <span>Better net profit margins for local vendors</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Who can apply? */}
          <div className="bg-zinc-900/40 p-4 rounded-lg border border-amber-500/10">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3">Who Can Apply?</h4>
            <div className="grid grid-cols-1 gap-2 text-[11px] text-stone-300">
              <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded border border-amber-500/5">
                <Store className="w-4 h-4 text-amber-500" />
                <span>Shopkeepers</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded border border-amber-500/5">
                <Building className="w-4 h-4 text-amber-500" />
                <span>Retail Stores</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded border border-amber-500/5">
                <ShoppingBag className="w-4 h-4 text-amber-500" />
                <span>Online Sellers</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded border border-amber-500/5">
                <Users className="w-4 h-4 text-amber-500" />
                <span>Resellers</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded border border-amber-500/5">
                <Briefcase className="w-4 h-4 text-amber-500" />
                <span>Business Owners</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bulk Order Process (Timeline of steps 1 to 6) */}
        <div className="mt-8 border-t border-amber-500/10 pt-6">
          <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest text-center mb-6">
            🛠️ BULK ORDER PROCESS FLOW
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { step: 1, title: 'Contact Team', desc: 'Reach out to BTM Wholesalers' },
              { step: 2, title: 'Select Goods', desc: 'Confirm products & bulk levels' },
              { step: 3, title: 'Quotation', desc: 'Receive wholesale discounted price' },
              { step: 4, title: 'Send Payment', desc: 'Transfer amount via online system' },
              { step: 5, title: 'Verification', desc: 'Admin verifies deposit receipt' },
              { step: 6, title: 'Processing', desc: 'Direct fast shipping dispatched' }
            ].map((s, idx) => (
              <div key={s.step} className="relative flex flex-col items-center bg-zinc-900/20 p-3 rounded border border-amber-500/5 hover:border-amber-500/20 transition-all">
                {/* Step indicator circle */}
                <div className="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-xs mb-2 shadow-[0_0_8px_rgba(212,175,55,0.3)]">
                  {s.step}
                </div>
                <h5 className="text-[11px] font-bold text-stone-200 uppercase leading-snug">{s.title}</h5>
                <p className="text-[9px] text-stone-500 leading-tight mt-1">{s.desc}</p>
                
                {/* Connecting arrow for desktop layout */}
                {idx < 5 && (
                  <div className="hidden lg:block absolute -right-3 top-7 text-amber-500/40 font-bold z-10">
                    ➔
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-amber-500/5 border border-dashed border-amber-500/20 rounded-lg text-[10px] text-stone-400 text-center">
            ⚠️ <strong className="text-amber-500">IMPORTANT NOTE:</strong> Wholesale rates are strictly reserved for bulk limits (Minimum 5 pieces or custom sets). Individual pieces are billed automatically at normal retail pricing thresholds.
          </div>
        </div>
      </div>

    </div>
  );
};
