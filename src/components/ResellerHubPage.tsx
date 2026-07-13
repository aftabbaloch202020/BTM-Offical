import React, { useState } from 'react';
import { 
  Briefcase, 
  Check, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Percent, 
  DollarSign 
} from 'lucide-react';

interface ResellerHubPageProps {
  onAddNotification: (title: string, message: string, type: any) => void;
}

export const ResellerHubPage: React.FC<ResellerHubPageProps> = ({ onAddNotification }) => {
  const [resellerName, setResellerName] = useState('');
  const [resellerPhone, setResellerPhone] = useState('');
  const [resellerCity, setResellerCity] = useState('');
  const [resellerExp, setResellerExp] = useState('none');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    onAddNotification(
      'Reseller Hub Update 🤝',
      `Reseller Application submitted by ${resellerName} from ${resellerCity}. Verification pending.`,
      'promo'
    );
    setTimeout(() => {
      setSuccess(false);
      setResellerName('');
      setResellerPhone('');
      setResellerCity('');
      setResellerExp('none');
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-stone-100 min-h-screen">
      
      {/* Page Title Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-widest text-amber-500 uppercase flex items-center justify-center gap-3">
          <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 animate-pulse" />
          Reseller Hub
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
        </h1>
        <p className="text-xs text-stone-400 font-mono tracking-widest uppercase mt-2">
          Start your online earning journey with BTM today • Zero Investment required
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Column 1: Feature Overview (Left 5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-zinc-950 to-zinc-900 border border-amber-500/10 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold font-display uppercase text-amber-500 tracking-wider">
                How It Works
              </h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Balochistan Trusted Mart provides the products, logistics, and delivery. You simply share products with your friends, family, or social media networks, add your desired profit markup, and we will dispatch the packages to your customers on your behalf!
              </p>
            </div>

            {/* Core Features list exactly matching original but larger */}
            <ul className="space-y-3.5 text-xs">
              {[
                { title: 'Free Reseller Registration', desc: 'No signup fee or subscription costs.' },
                { title: 'No Stock or Inventory Required', desc: 'Book orders directly from our real-time stock levels.' },
                { title: 'Referral Bonus System', desc: 'Invite sub-agents and earn 2% lifetime overrides.' },
                { title: 'Integrated Reseller Dashboard', desc: 'Track payouts, pending margins, and customer logs.' },
                { title: 'Highly Profitable Markup Details', desc: 'Earn up to Rs. 1,500 profit margin on premium items.' },
                { title: 'Daily Withdrawal of Profits', desc: 'Instant transfers directly to JazzCash, EasyPaisa, or Banks.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 text-[10px] font-bold">✓</span>
                  <div>
                    <h4 className="font-bold text-stone-200">{item.title}</h4>
                    <p className="text-[11px] text-stone-400 leading-normal mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-zinc-900/60 rounded-lg border border-amber-500/5 mt-6 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 block">Rs. 0</span>
              <span className="text-[9px] text-stone-500 uppercase">Investment</span>
            </div>
            <div className="border-r border-zinc-800 h-6 my-auto"></div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 block">35% Avg</span>
              <span className="text-[9px] text-stone-500 uppercase">Profit Margin</span>
            </div>
          </div>
        </div>

        {/* Column 2: Interactive Application Form (Right 7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950 border border-amber-500/25 rounded-xl p-6 gold-glow flex flex-col justify-center">
          <h3 className="text-base font-bold font-display uppercase text-amber-500 tracking-wider mb-2 flex items-center gap-2 border-b border-amber-500/10 pb-3">
            <Users className="w-4 h-4" />
            Apply As Registered Reseller
          </h3>
          <p className="text-[11px] text-stone-400 mb-6 leading-relaxed">
            Fill out this brief form. Our onboarding managers will check your application and reach out to you on WhatsApp within 12-24 hours to active your reseller profit-ledger accounts.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs leading-relaxed text-center">
                ✓ Reseller Application Submitted Successfully!<br />
                <span className="text-[10px] text-stone-400">Our CM Team CMO Uzair Baloch will message you shortly.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ali Raza"
                  value={resellerName}
                  onChange={(e) => setResellerName(e.target.value)}
                  className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-3 rounded outline-none h-11"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">WhatsApp Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="03001234567"
                  value={resellerPhone}
                  onChange={(e) => setResellerPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-3 rounded outline-none h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Your City / Region</label>
                <input
                  type="text"
                  required
                  placeholder="Quetta, Gwadar, Turbat..."
                  value={resellerCity}
                  onChange={(e) => setResellerCity(e.target.value)}
                  className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-3 rounded outline-none h-11"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Prior Reselling Experience</label>
                <select
                  value={resellerExp}
                  onChange={(e) => setResellerExp(e.target.value)}
                  className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-3 rounded h-11 outline-none cursor-pointer"
                >
                  <option value="none">No Prior Experience</option>
                  <option value="beginner">Beginner (1-6 Months)</option>
                  <option value="intermediate">Intermediate (6+ Months)</option>
                  <option value="expert">Expert (With own group of sub-agents)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-[10px] text-stone-500 cursor-pointer">
                <input type="checkbox" required className="accent-amber-500" />
                I verify that the provided phone number is active on WhatsApp for commission notifications.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold h-11 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center font-display"
            >
              Submit Reseller Application
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
