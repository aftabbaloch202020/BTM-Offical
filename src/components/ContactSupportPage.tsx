import React, { useState } from 'react';
import { Phone, Mail, Facebook, Send, MapPin, CheckCircle2 } from 'lucide-react';

interface ContactSupportPageProps {
  onAddNotification?: (title: string, message: string, type: any) => void;
}

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({ onAddNotification }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactMsg) {
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      if (onAddNotification) {
        onAddNotification(
          'Inquiry Submitted',
          'Your contact message has been sent to BTM Wholesale Support.',
          'promo'
        );
      }
      setTimeout(() => setContactSuccess(false), 5000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 font-sans space-y-6">
      
      {/* Top Banner */}
      <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 md:p-8">
        <h3 className="text-xl font-bold font-display text-amber-500 uppercase tracking-widest text-center">
          📞 Contact Support
        </h3>
        <p className="text-xs text-stone-400 text-center mt-2 leading-relaxed">
          Need assistance with bulk purchase receipts, reseller registrations, or order tracking status? Our support agents are here to help you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Contact Info Column (5 Cols) */}
        <div className="md:col-span-5 bg-zinc-950 border border-amber-500/20 rounded-xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-display text-amber-400 uppercase tracking-wider border-b border-amber-500/10 pb-2">
              Corporate Desk
            </h4>

            <div className="space-y-4">
              <a 
                href="https://wa.me/923001234567" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-start gap-3 hover:text-amber-400 transition-colors p-2 rounded bg-zinc-900/30 border border-amber-500/5 hover:border-amber-500/20"
              >
                <Phone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-stone-200 uppercase font-mono">WhatsApp Support</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">+92 300 1234567</p>
                  <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">● Online (Immediate Replies)</span>
                </div>
              </a>

              <div className="flex items-start gap-3 p-2 rounded bg-zinc-900/30 border border-amber-500/5">
                <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-stone-200 uppercase font-mono">Official Email</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">support@btm.official.pk</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded bg-zinc-900/30 border border-amber-500/5">
                <Facebook className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-stone-200 uppercase font-mono">Facebook Page</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">@BTM.Official.PK</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded bg-zinc-900/30 border border-amber-500/5">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-stone-200 uppercase font-mono">Headquarters</h5>
                  <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">
                    Quetta Head Office: Jinnah Road, Balochistan, Pakistan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-stone-500 leading-normal border-t border-amber-500/10 pt-4">
            * Note: For custom bulk payment validation queries, please prepare your transaction receipt photo or PDF prior to initiating discussions with representatives.
          </div>
        </div>

        {/* Form Column (7 Cols) */}
        <div className="md:col-span-7 bg-zinc-950 border border-amber-500/20 rounded-xl p-6 space-y-4">
          <h4 className="text-sm font-bold font-display text-amber-400 uppercase tracking-wider border-b border-amber-500/10 pb-2">
            Leave a Message
          </h4>

          {contactSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 animate-bounce" />
              <span>✓ Message sent successfully! We will get back to you on WhatsApp or Email within 24 hours.</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-zinc-900 border border-amber-500/15 focus:border-amber-500 text-stone-200 text-xs px-3 py-2.5 rounded outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Email/Phone Number (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 03XXXXXXXXX or name@gmail.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-amber-500/15 focus:border-amber-500 text-stone-200 text-xs px-3 py-2.5 rounded outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Message Description *</label>
              <textarea
                required
                placeholder="How can we assist you with bulk supplies or reseller dashboards?"
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                rows={4}
                className="w-full bg-zinc-900 border border-amber-500/15 focus:border-amber-500 text-stone-200 text-xs px-3 py-2.5 rounded outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold h-12 rounded-lg text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md hover:shadow-amber-500/10"
            >
              <Send className="w-3.5 h-3.5" />
              Send Inquiry Message
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
