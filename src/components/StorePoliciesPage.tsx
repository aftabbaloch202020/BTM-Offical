import React from 'react';
import { ShieldAlert, RefreshCw, Truck, CreditCard } from 'lucide-react';

export const StorePoliciesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-4 font-sans space-y-6">
      
      {/* Title */}
      <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 md:p-8">
        <h3 className="text-xl font-bold font-display text-amber-500 uppercase tracking-widest text-center">
          📜 BTM Store Policies
        </h3>
        <p className="text-xs text-stone-400 text-center mt-2 leading-relaxed">
          Please read through our official shop policies before placing bulk or individual orders. Our rules are designed to ensure transparency, security, and exceptional service quality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Refund & Return Policy */}
        <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-500">
            <RefreshCw className="w-5 h-5 shrink-0" />
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-stone-200">
              Refund & Return Policy
            </h4>
          </div>
          <div className="text-xs text-stone-400 space-y-2 leading-relaxed">
            <p>
              • <strong className="text-amber-500">Video Proof Requirement:</strong> Returns are strictly valid only for defective/damaged items reported within <strong className="text-stone-100">24 hours</strong> of package delivery.
            </p>
            <p>
              • You <strong className="text-stone-100">MUST</strong> record a continuous, unedited video of yourself opening the courier bag/carton showing the delivery label clearly. Without the parcel opening video proof, return requests will be automatically declined.
            </p>
            <p>
              • Change of mind returns are not accepted. Shipping fees are non-refundable.
            </p>
          </div>
        </div>

        {/* Shipping & Delivery */}
        <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-500">
            <Truck className="w-5 h-5 shrink-0" />
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-stone-200">
              Shipping & Delivery Policy
            </h4>
          </div>
          <div className="text-xs text-stone-400 space-y-2 leading-relaxed">
            <p>
              • <strong className="text-amber-500">Standard Delivery Timeline:</strong> Items are dispatched within 24-48 working hours from our regional transit nodes. Average delivery times are:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li>Quetta & Balochistan Cities: 2 to 3 Working Days</li>
              <li>Karachi, Lahore & Major Hubs: 3 to 4 Working Days</li>
              <li>AJK, Gilgit & Remote Districts: 4 to 6 Working Days</li>
            </ul>
            <p>
              • Flat shipping fee of Rs. 200 is charged on order subtotals below Rs. 10,000.
            </p>
          </div>
        </div>

        {/* Secure Online Payment */}
        <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-500">
            <CreditCard className="w-5 h-5 shrink-0" />
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-stone-200">
              Secure Online Payment Policy
            </h4>
          </div>
          <div className="text-xs text-stone-400 space-y-2 leading-relaxed">
            <p>
              • <strong className="text-amber-500">No Cash on Delivery (COD):</strong> BTM operates exclusively on pre-verified online transaction booking models. We support EasyPaisa, JazzCash, and direct Bank Transfers.
            </p>
            <p>
              • <strong className="text-amber-500">Screenshot Validation:</strong> Stock booking is only locked after you upload a valid screenshot of your payment receipt in the Checkout Secure Form.
            </p>
            <p>
              • Fake or reused screenshot proofs are immediately cancelled and flagged in our risk logs.
            </p>
          </div>
        </div>

        {/* Terms, Conditions & Privacy */}
        <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-500">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-stone-200">
              Terms & Privacy Policy
            </h4>
          </div>
          <div className="text-xs text-stone-400 space-y-2 leading-relaxed">
            <p>
              • <strong className="text-amber-500">Data Security:</strong> Customer contact details, addresses, and transaction hashes are heavily encrypted on server logs and never shared with third parties.
            </p>
            <p>
              • <strong className="text-amber-500">Reseller Integrity:</strong> Resellers inside our system must provide accurate information when tracking customer dispatches and billing.
            </p>
            <p>
              • Admin accounts reserve the right to ban or freeze wholesale access to any reseller violating terms.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
