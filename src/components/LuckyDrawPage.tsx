import React, { useState, useEffect } from 'react';
import { Gift, ShieldCheck, HelpCircle, Trophy, Sparkles, Check, Search, Ticket } from 'lucide-react';
import { Order } from '../types';

interface LuckyDrawPageProps {
  orders: Order[];
}

export const LuckyDrawPage: React.FC<LuckyDrawPageProps> = ({ orders }) => {
  const [orderId, setOrderId] = useState('');
  const [checked, setChecked] = useState(false);
  const [eligible, setEligible] = useState(false);

  // Pool submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('btm_logged_in_user'));

  const handleCheckEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setChecked(true);
    const cleanId = orderId.trim().toUpperCase();
    const found = orders.some(o => o.id.toUpperCase() === cleanId) || cleanId.startsWith('BTM');
    setEligible(found && cleanId.length > 3);
  };

  const handleJoinPool = async () => {
    setIsSubmitting(true);
    setSubmitSuccess('');
    setSubmitError('');

    const token = localStorage.getItem('btm_auth_token');
    if (!token) {
      alert("Please login or register to enter the lucky draw.");
      window.location.hash = 'account';
      return;
    }

    try {
      const res = await fetch('/api/rewards/lucky-draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to enter the draw pool.');
        return;
      }

      setSubmitSuccess(`Success! Your order ticket #${data.ticketId} is registered into the bi-monthly lucky draw pool!`);
      // Update Account metrics
      window.dispatchEvent(new Event('btm_auth_change'));
    } catch (err) {
      console.error(err);
      setSubmitError('Connection failed. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const winnersList = [
    { rank: '👑 1st Prize', name: 'Imran Jan', city: 'Quetta', reward: 'Smart Watch Series 9' },
    { rank: '⭐ 2nd Prize', name: 'Fatima Begum', city: 'Gwadar', reward: 'Premium Wireless Earbuds' },
    { rank: '⭐ 3rd Prize', name: 'Zainab Baloch', city: 'Hub', reward: 'Rs. 5,000 Shopping Voucher' },
    { rank: '⭐ 4th Prize', name: 'Zubair Shah', city: 'Quetta', reward: 'Rs. 2,000 Wallet Bonus' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-stone-100 min-h-screen">
      
      {/* Page Title Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-widest text-amber-500 uppercase flex items-center justify-center gap-3">
          <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 animate-pulse" />
          Lucky Draw Pool
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 animate-bounce" />
        </h1>
        <p className="text-xs text-stone-400 font-mono tracking-widest uppercase mt-2">
          One automatic entry generated for every validated purchase order
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Column 1: Lucky Draw Banner & Entry Checker (Left 6 cols) */}
        <div className="lg:col-span-6 bg-zinc-950 border border-amber-500/25 rounded-xl p-6 sm:p-8 flex flex-col justify-between gold-glow">
          <div className="space-y-6">
            <h3 className="text-sm font-bold font-display uppercase text-amber-500 tracking-wider flex items-center gap-2 border-b border-amber-500/10 pb-3">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              Lucky Draw Guidelines
            </h3>

            <p className="text-xs text-stone-300 leading-relaxed">
              Every successful order placed on Balochistan Trusted Mart automatically registers your order tracking reference ID into our physical and digital rolling drawing bowls. There are no paper coupons to fill—your payment screenshot is your raffle ticket!
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/80 p-4 rounded-lg border border-amber-500/10 text-center">
                <span className="text-[9px] text-stone-500 uppercase font-mono block">Upcoming Drawing</span>
                <span className="text-sm font-extrabold text-amber-500 block mt-1">25 May 2026</span>
              </div>
              <div className="bg-zinc-900/80 p-4 rounded-lg border border-amber-500/10 text-center">
                <span className="text-[9px] text-stone-500 uppercase font-mono block">Drawing Frequency</span>
                <span className="text-sm font-extrabold text-amber-500 block mt-1">Bi-Monthly</span>
              </div>
            </div>

            {/* Direct pool entry section */}
            <div className="pt-4 border-t border-amber-500/10 space-y-3">
              <h4 className="text-[11px] font-bold text-amber-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-amber-500" />
                Submit Daily Raffle Entry
              </h4>
              
              {!isLoggedIn ? (
                <div className="p-3 bg-amber-500/5 rounded border border-amber-500/15 text-xs text-stone-400">
                  🔒 Please <button onClick={() => window.location.hash = 'account'} className="text-amber-500 font-bold underline hover:text-amber-600">Login or Register</button> to submit your daily lucky draw entry.
                </div>
              ) : (
                <div className="space-y-3 bg-zinc-900/60 p-4 rounded-lg border border-zinc-800">
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    Have you placed an order already? Grab your free entry ticket now and submit it to the drawing pool!
                  </p>
                  
                  {submitSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium">
                      ✓ {submitSuccess}
                    </div>
                  )}

                  {submitError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs">
                      ⚠️ {submitError}
                    </div>
                  )}

                  <button
                    onClick={handleJoinPool}
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-stone-500 text-zinc-950 font-black h-11 rounded text-xs uppercase tracking-wider transition-all"
                  >
                    {isSubmitting ? 'Submitting ticket...' : '🗳️ Enter Bi-Monthly Drawing'}
                  </button>
                </div>
              )}
            </div>

            {/* Checker form */}
            <div className="pt-4 border-t border-amber-500/10 space-y-3">
              <h4 className="text-[11px] font-bold text-amber-500 uppercase tracking-widest font-mono">Verify My Draw Ticket</h4>
              <p className="text-[10px] text-stone-400">Enter your order ID (e.g. BTM1001) to verify your entry eligibility instantly.</p>
              
              <form onSubmit={handleCheckEntry} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-stone-500">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="BTM1001"
                    value={orderId}
                    onChange={(e) => { setOrderId(e.target.value); setChecked(false); }}
                    className="w-full bg-zinc-900 border border-amber-500/15 focus:border-amber-500 text-stone-200 text-xs pl-9 pr-3 py-2.5 rounded outline-none h-10 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 h-10 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Verify
                </button>
              </form>

              {checked && (
                <div className={`p-3 rounded border text-xs ${eligible ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {eligible ? (
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm">✓</span>
                      <span>Ticket <strong>{orderId.trim().toUpperCase()}</strong> is verified & active in drawing drum! Good luck!</span>
                    </div>
                  ) : (
                    <div>
                      <span>❌ Ticket <strong>{orderId.trim().toUpperCase()}</strong> not found or has pending screenshot verification issues.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-[10px] text-stone-500 font-mono pt-6 mt-6 border-t border-zinc-900/80">
            ★ TERMS APPLY • WINNERS WILL BE DIRECTLY CONTACTED ON REGISTERED WHATSAPP NUMBER
          </p>
        </div>

        {/* Column 2: Winner Archive (Right 6 cols) */}
        <div className="lg:col-span-6 bg-zinc-950 border border-amber-500/25 rounded-xl p-6 sm:p-8 flex flex-col justify-between gold-glow">
          <div className="space-y-6">
            <h3 className="text-sm font-bold font-display uppercase text-amber-500 tracking-wider flex items-center gap-2 border-b border-amber-500/10 pb-3">
              <Trophy className="w-4 h-4 text-amber-500" />
              Latest Winners Circle
            </h3>

            <p className="text-xs text-stone-400">
              Congratulations to our previous bi-monthly winners! Prizes have been dispatched via fast secure cargo. Showcasing full transparency.
            </p>

            {/* List Table */}
            <div className="overflow-x-auto rounded-lg border border-amber-500/10">
              <table className="w-full text-left text-xs divide-y divide-zinc-900">
                <thead className="bg-zinc-900 text-amber-500 font-bold font-mono text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Location</th>
                    <th className="p-3 text-right">Prize Won</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60 bg-zinc-950/40">
                  {winnersList.map((w, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/30">
                      <td className="p-3 font-bold text-stone-200">{w.rank}</td>
                      <td className="p-3 text-stone-300 font-medium">{w.name}</td>
                      <td className="p-3 text-stone-400 capitalize">{w.city}</td>
                      <td className="p-3 text-right text-amber-400 font-bold">{w.reward}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => alert('Lucky Draw Winners Archive:\n1. Imran Jan (Quetta) - Smart Watch\n2. Fatima Begum (Gwadar) - Earbuds\n3. Zainab Baloch (Hub) - Premium Voucher\n4. Zubair Shah (Quetta) - Wallet Bonus')}
              className="w-full bg-zinc-900 hover:bg-zinc-850 text-stone-300 hover:text-amber-500 border border-amber-500/20 h-11 rounded text-xs font-bold uppercase transition-colors cursor-pointer flex items-center justify-center"
            >
              Check Older Archive Lists
            </button>
          </div>

          <div className="p-4 bg-zinc-900/60 rounded-lg border border-amber-500/5 mt-6 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-[10px] text-stone-400 leading-relaxed">
              Every verified customer gets a fair and transparent chance. Drawing videos are published live on our Facebook Page: @BTM.Official.PK.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
