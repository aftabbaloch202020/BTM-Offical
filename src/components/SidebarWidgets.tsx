import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Search, 
  Award, 
  Gift, 
  Star, 
  MessageSquare, 
  Phone, 
  Mail, 
  Facebook, 
  Bell, 
  Check, 
  RotateCw, 
  MapPin, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Review, Notification, Order } from '../types';

interface SidebarWidgetsProps {
  orders: Order[];
  reviews: Review[];
  notifications: Notification[];
  onAddNotification: (title: string, message: string, type: any) => void;
  onSpinWin: (prize: string) => void;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({
  orders,
  reviews,
  notifications,
  onAddNotification,
  onSpinWin
}) => {
  // 11. Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAccountTab, setUserAccountTab] = useState('dashboard');

  // 12. Order Tracking State
  const [trackingId, setTrackingId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackingSubmitted, setTrackingSubmitted] = useState(false);

  // 15. Spin & Win State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  const [prizeWon, setPrizeWon] = useState<string | null>(null);

  // 17. Reviews Carousel State
  const [reviewIdx, setReviewIdx] = useState(0);

  // 20. Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // General Read Mores
  const [activeExpander, setActiveExpander] = useState<string | null>(null);

  // 11. Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPass) {
      setIsLoggedIn(true);
      onAddNotification('Login Alert', 'Logged in successfully into BTM account.', 'payment');
    }
  };

  // 12. Handle Tracking search
  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingSubmitted(true);
    const found = orders.find(o => o.id.toLowerCase() === trackingId.trim().toLowerCase());
    setTrackedOrder(found || null);
  };

  // 15. Handle Spin Wheel
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setPrizeWon(null);

    // Dynamic rotation angles
    const sectorPrizes = [
      'Discount Coupons (BTM10OFF)',
      '100 Reward Points',
      'Gift Vouchers',
      'Bonus Rewards',
      'Better Luck Next Time'
    ];
    const prizeIndex = Math.floor(Math.random() * sectorPrizes.length);
    const addedDegrees = 1800 + (prizeIndex * (360 / sectorPrizes.length));
    
    setSpinDeg(prev => prev + addedDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = sectorPrizes[prizeIndex];
      setPrizeWon(prize);
      onSpinWin(prize);
      onAddNotification('Lucky Wheel Win!', `You won: ${prize}! Check My Account.`, 'lucky');
    }, 4000);
  };

  // 20. Contact Form submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactMsg) {
      setContactSuccess(true);
      setContactName('');
      setContactMsg('');
      onAddNotification('Inquiry Submitted', 'Your contact message has been sent to BTM Wholesale Support.', 'promo');
      setTimeout(() => setContactSuccess(false), 4000);
    }
  };

  // Order status timeline configuration
  const timelineSteps = [
    { key: 'Pending', label: 'Pending', desc: 'Order submitted, waiting verification' },
    { key: 'Payment Verification', label: 'Payment Verification', desc: 'Analyzing screenshot payment proof' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Payment verified successfully' },
    { key: 'Processing', label: 'Processing', desc: 'Packing & preparing shipment' },
    { key: 'Shipped', label: 'Shipped', desc: 'Dispatched via fast courier services' },
    { key: 'Delivered', label: 'Delivered', desc: 'Order successfully delivered to destination' }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Section 21: Notifications */}
      <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-5">
        <h4 className="text-sm font-bold font-display text-amber-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>🔔 Notifications</span>
          <span className="bg-red-600 text-stone-100 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {notifications.length} Active
          </span>
        </h4>

        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div 
              key={n.id}
              className="p-2.5 bg-zinc-900 rounded border border-amber-500/5 hover:border-amber-500/20 transition-all flex gap-2.5 items-start"
            >
              <div className="p-1 rounded bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                <Bell className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-stone-200">{n.title}</span>
                  <span className="text-[8px] font-mono text-stone-500">{n.time}</span>
                </div>
                <p className="text-[10px] text-stone-400 leading-snug mt-0.5">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
