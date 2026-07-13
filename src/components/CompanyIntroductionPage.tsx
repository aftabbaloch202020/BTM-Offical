import React from 'react';
import { Award, ShieldCheck, Heart, Users } from 'lucide-react';

export const CompanyIntroductionPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-4 font-sans space-y-6">
      
      {/* Introduction Hero Section */}
      <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 md:p-8 text-center space-y-4">
        <h3 className="text-xl md:text-2xl font-bold font-display text-amber-500 uppercase tracking-widest">
          🏢 Company Introduction
        </h3>
        <p className="text-sm text-stone-200 leading-relaxed max-w-2xl mx-auto">
          Balochistan Trusted Mart (BTM) is a leading customer-centric premium e-commerce platform dedicated to serving Pakistani online buyers with absolute transparency. We bridge regional markets with premium products under the slogan: <span className="text-amber-500 italic font-bold">"BTM - Aapka Bharosa, Hamari Zimmedari!"</span>
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold font-display text-amber-400 uppercase tracking-wider">
            Our Mission
          </h4>
          <p className="text-xs text-stone-300 leading-relaxed">
            To bridge regional markets with high-quality, global-standard goods while keeping cost profiles highly competitive and reasonable. We aim to eradicate traditional retail inefficiencies and provide transparent pricing for every customer.
          </p>
        </div>

        <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold font-display text-amber-400 uppercase tracking-wider">
            Our Vision
          </h4>
          <p className="text-xs text-stone-300 leading-relaxed">
            To empower thousands of independent, self-reliant resellers, and establish the most modern, technologically driven, and highly trusted wholesale supply chain ecosystem inside Balochistan and across Pakistan.
          </p>
        </div>
      </div>

      {/* Core Leadership & Values */}
      <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 md:p-8 space-y-6">
        <h4 className="text-base font-bold font-display text-amber-500 uppercase tracking-wider text-center flex items-center justify-center gap-2 border-b border-amber-500/10 pb-4">
          <Users className="w-5 h-5 text-amber-500" />
          Executive Leadership Team
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-zinc-900/40 p-5 rounded-lg border border-amber-500/10 space-y-2">
            <div className="text-2xl">👑</div>
            <h5 className="text-sm font-bold text-stone-200">Rajab Dawood</h5>
            <div className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-wider">Chief Executive Officer</div>
            <p className="text-[11px] text-stone-400 leading-relaxed">Oversees strategic direction, bulk manufacturer alliances, and legal frameworks.</p>
          </div>

          <div className="bg-zinc-900/40 p-5 rounded-lg border border-amber-500/10 space-y-2">
            <div className="text-2xl">💼</div>
            <h5 className="text-sm font-bold text-stone-200">Mehraj</h5>
            <div className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-wider">Chief Marketing Officer</div>
            <p className="text-[11px] text-stone-400 leading-relaxed">Leads marketing campaigns, branding initiatives, and customer outreach nationwide.</p>
          </div>

          <div className="bg-zinc-900/40 p-5 rounded-lg border border-amber-500/10 space-y-2">
            <div className="text-2xl">🤝</div>
            <h5 className="text-sm font-bold text-stone-200">Uzair Baloch</h5>
            <div className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-wider">Chief Operating Officer</div>
            <p className="text-[11px] text-stone-400 leading-relaxed">Manages bulk warehouses, verification desks, and regional logistics dispatch units.</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 md:p-8 space-y-4">
        <h4 className="text-base font-bold font-display text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Heart className="w-5 h-5 text-amber-500" />
          Why Pakistani Buyers Trust BTM
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <h5 className="font-bold text-amber-500">✓ Strict Payment Verifications</h5>
            <p className="text-stone-400">Our manual payment validation desk verifies all transaction receipts against corporate accounts prior to dispatching items, securing complete trust.</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-amber-500">✓ Local Warehousing</h5>
            <p className="text-stone-400">Headquartered in Quetta, we maintain local logistics controls to ensure swift transit across Balochistan and rest of Pakistan.</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-amber-500">✓ Quality Checking Desk</h5>
            <p className="text-stone-400">All wholesale batches are cataloged and hand-inspected before listing in our system to ensure we supply only genuine premium products.</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-amber-500">✓ Reseller Empowerment</h5>
            <p className="text-stone-400">Through our dedicated Account Reseller Hub, we offer robust earning potentials for individuals wanting to work from home.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
