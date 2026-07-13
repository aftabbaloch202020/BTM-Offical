import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingPageProps {
  orders: Order[];
  initialTrackingId?: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ orders, initialTrackingId }) => {
  const [trackingId, setTrackingId] = useState(initialTrackingId || '');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(() => {
    if (initialTrackingId) {
      return orders.find(o => o.id.toLowerCase() === initialTrackingId.trim().toLowerCase()) || null;
    }
    return null;
  });
  const [trackingSubmitted, setTrackingSubmitted] = useState(!!initialTrackingId);

  // Sync state if initialTrackingId changes
  React.useEffect(() => {
    if (initialTrackingId) {
      setTrackingId(initialTrackingId);
      const found = orders.find(o => o.id.toLowerCase() === initialTrackingId.trim().toLowerCase());
      setTrackedOrder(found || null);
      setTrackingSubmitted(true);
    }
  }, [initialTrackingId, orders]);

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingSubmitted(true);
    const found = orders.find(o => o.id.toLowerCase() === trackingId.trim().toLowerCase());
    setTrackedOrder(found || null);
  };

  const timelineSteps = [
    { key: 'Pending', label: 'Pending', desc: 'Order submitted, waiting verification' },
    { key: 'Payment Verification', label: 'Payment Verification', desc: 'Analyzing screenshot payment proof' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Payment verified successfully' },
    { key: 'Processing', label: 'Processing', desc: 'Packing & preparing shipment' },
    { key: 'Shipped', label: 'Shipped', desc: 'Dispatched via fast courier services' },
    { key: 'Delivered', label: 'Delivered', desc: 'Order successfully delivered to destination' }
  ];

  return (
    <div className="max-w-2xl mx-auto py-4 font-sans">
      <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-6 md:p-8">
        <h3 className="text-xl font-bold font-display text-amber-500 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-amber-500/10 pb-4">
          <span className="w-1.5 h-5 bg-amber-500 rounded-sm animate-pulse"></span>
          📍 Live Order Tracking
        </h3>

        <p className="text-xs text-stone-400 mb-6 leading-relaxed">
          Track the status of your BTM order in real-time. Enter your unique Order Tracking ID (e.g., <strong>BTM1001</strong>) provided at the time of checkout.
        </p>

        <form onSubmit={handleTracking} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-stone-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              required
              placeholder="Enter Tracking ID (e.g. BTM1001)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full h-12 bg-zinc-900 border border-amber-500/20 focus:border-amber-500 text-stone-100 text-sm pl-10 pr-3 rounded outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-6 h-12 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            Track Order
          </button>
        </form>

        {trackingSubmitted && (
          <div className="bg-zinc-900/50 rounded-lg p-5 border border-amber-500/10 text-xs">
            {trackedOrder ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-amber-500/10 pb-3 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-stone-200">ID: {trackedOrder.id}</h4>
                    <span className="text-[10px] text-stone-500">Date Placed: {trackedOrder.date}</span>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded text-amber-400 font-bold uppercase text-[10px] font-mono">
                    {trackedOrder.status}
                  </div>
                </div>

                {/* Timeline display */}
                <div className="space-y-4 pl-4 border-l-2 border-amber-500/20 relative ml-2">
                  {timelineSteps.map((step) => {
                    // Check if step is reached
                    const statusIndex = timelineSteps.findIndex(s => s.key === trackedOrder.status);
                    const currentStepIndex = timelineSteps.findIndex(s => s.key === step.key);
                    const isActive = currentStepIndex <= statusIndex && trackedOrder.status !== 'Cancelled';
                    const isCurrent = step.key === trackedOrder.status;

                    return (
                      <div key={step.key} className="relative pl-6">
                        {/* Dot indicator */}
                        <div className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 transition-all ${
                          isCurrent 
                            ? 'bg-amber-500 border-amber-500 scale-125 shadow-[0_0_8px_rgba(212,175,55,0.8)]'
                            : isActive
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'bg-zinc-950 border-zinc-700'
                        }`} />
                        
                        <div className="text-left">
                          <h5 className={`text-xs font-bold uppercase tracking-wide ${
                            isCurrent ? 'text-amber-400' : isActive ? 'text-stone-200' : 'text-stone-500'
                          }`}>
                            {step.label}
                          </h5>
                          <p className="text-[10px] text-stone-500 leading-normal mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}

                  {trackedOrder.status === 'Cancelled' && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg mt-3">
                      ❌ This order has been cancelled. Please contact BTM wholesale support for inquiries.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-stone-500 text-xs">
                ❌ No active order found with tracking ID: <span className="font-mono text-red-400">{trackingId}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
