import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  Sparkles, 
  Laptop, 
  Clock, 
  Footprints, 
  Home, 
  Gamepad, 
  Smartphone, 
  Briefcase, 
  Shirt,
  User,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { Notification } from '../types';
import { NotificationPanel } from './NotificationPanel';
// @ts-ignore
import logoImg from '../assets/images/btm_official_logo_1783925639173.jpg';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onSearch: (query: string) => void;
  onNavigate: (sectionId: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAllNotifications: () => void;
  onSelectTrackingId?: (trackingId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onSearch,
  onNavigate,
  onOpenCart,
  onOpenWishlist,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onDeleteNotification,
  onClearAllNotifications,
  onSelectTrackingId,
  activeSection
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="w-full bg-[#030303] text-stone-100 border-b border-amber-500/30 font-sans">
      {/* Top Banner Message */}
      <div className="bg-amber-500/10 text-amber-400 text-xs py-2 px-4 text-center border-b border-amber-500/20 font-mono tracking-wider flex justify-center items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
        <span className="truncate max-w-[85vw] sm:max-w-none">BTM - Aapka Bharosa, Hamari Zimmedari! Official Premium Marketplace</span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-start">
            {/* Logo Emblem resembling the reference */}
            <div id="header-logo-emblem" className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-500 bg-zinc-950 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.25)] shrink-0">
              <img
                src={logoImg}
                alt="Balochistan Trusted Mart Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-2xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-600 uppercase leading-snug">
                BALOCHISTAN TRUSTED MART
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-xs font-mono font-bold tracking-wider sm:tracking-widest text-amber-500 bg-amber-500/10 px-1.5 sm:px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                  OFFICIAL (BTM)
                </span>
                <span className="text-[10px] sm:text-xs text-stone-400 font-medium truncate">
                  Trusted Shop • Live Better
                </span>
              </div>
            </div>
          </div>

          {/* Leadership Info */}
          <div className="w-full lg:w-auto max-w-sm sm:max-w-md lg:max-w-none bg-zinc-950/80 p-2.5 sm:p-3 rounded-lg border border-amber-500/20">
            <div className="text-[9px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider w-full text-center border-b border-amber-500/10 pb-1 mb-1 font-bold">
              ★ OUR LEADERSHIP ★
            </div>
            <div className="grid grid-cols-3 gap-1 sm:gap-4 text-center justify-center">
              <div className="px-1">
                <div className="text-[9px] sm:text-[10px] text-amber-500 font-bold flex items-center justify-center gap-0.5">
                  👑 CEO
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-stone-200 truncate">Rajab Dawood</div>
              </div>
              <div className="border-r border-amber-500/10 h-6 my-auto"></div>
              <div className="px-1">
                <div className="text-[9px] sm:text-[10px] text-amber-500 font-bold flex items-center justify-center gap-0.5">
                  💼 CMO
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-stone-200 truncate">Mehraj</div>
              </div>
              <div className="border-r border-amber-500/10 h-6 my-auto"></div>
              <div className="px-1">
                <div className="text-[9px] sm:text-[10px] text-amber-500 font-bold flex items-center justify-center gap-0.5">
                  🤝 COO
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-stone-200 truncate">Uzair Baloch</div>
              </div>
            </div>
          </div>

          {/* Right Controls (Language, Currency, Search & Badges) - Mobile & Tablet */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto min-[1200px]:hidden">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-amber-500/30 focus:border-amber-500 text-stone-100 text-sm px-3.5 py-2.5 rounded-md outline-none pr-10 font-sans"
              />
              <button
                type="submit"
                className="absolute right-0.5 top-0.5 bottom-0.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 px-3.5 rounded flex items-center justify-center transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
              {/* Language Selector */}
              <select className="bg-zinc-900 border border-amber-500/20 text-stone-300 text-xs px-2 py-2 rounded outline-none font-medium cursor-pointer">
                <option value="en">🇺🇸 English</option>
                <option value="ur">🇵🇰 Urdu (اردو)</option>
              </select>

              {/* Currency Selector */}
              <select className="bg-zinc-900 border border-amber-500/20 text-stone-300 text-xs px-2 py-2 rounded outline-none font-medium cursor-pointer">
                <option value="pkr">PKR (Rs.)</option>
                <option value="usd">USD ($)</option>
              </select>

              {/* Notification bell */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="bell-btn-trigger relative bg-zinc-900 hover:bg-zinc-850 p-2.5 rounded-full border border-amber-500/20 hover:border-amber-500 text-amber-400 transition-colors cursor-pointer flex items-center justify-center min-h-[38px]"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-stone-100 text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationPanel
                  isOpen={isNotifOpen}
                  onClose={() => setIsNotifOpen(false)}
                  notifications={notifications}
                  onMarkRead={onMarkNotificationRead}
                  onMarkAllRead={onMarkAllNotificationsRead}
                  onDelete={onDeleteNotification}
                  onClearAll={onClearAllNotifications}
                  onNavigate={onNavigate}
                  onSelectTrackingId={onSelectTrackingId}
                />
              </div>

              {/* Wishlist Button */}
              <button 
                onClick={onOpenWishlist}
                className="wishlist-trigger relative bg-zinc-900 hover:bg-zinc-850 p-2.5 rounded-full border border-amber-500/20 hover:border-amber-500 text-red-500 transition-colors cursor-pointer flex items-center justify-center min-h-[38px] min-w-[38px]"
              >
                <Heart className="w-4 h-4 fill-current" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2.5 rounded-md flex items-center gap-2 transition-colors cursor-pointer h-10"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs">Cart</span>
                <span className="bg-zinc-950 text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Right Controls - Desktop (1200px and above) */}
          <div className="hidden min-[1200px]:flex items-start gap-4 shrink-0">
            {/* Left Column: Larger Search Box with Language & Currency below */}
            <div className="flex flex-col gap-2 w-[420px]">
              {/* Larger Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-amber-500/30 focus:border-amber-500 text-stone-100 text-sm px-3.5 py-2.5 rounded-md outline-none pr-10 font-sans"
                />
                <button
                  type="submit"
                  className="absolute right-0.5 top-0.5 bottom-0.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 px-3.5 rounded flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Language & Currency selectors side-by-side */}
              <div className="flex items-center gap-3">
                {/* Language Selector */}
                <select className="bg-zinc-900 border border-amber-500/20 text-stone-300 text-xs px-2 py-2 rounded outline-none font-medium cursor-pointer">
                  <option value="en">🇺🇸 English</option>
                  <option value="ur">🇵🇰 Urdu (اردو)</option>
                </select>

                {/* Currency Selector */}
                <select className="bg-zinc-900 border border-amber-500/20 text-stone-300 text-xs px-2 py-2 rounded outline-none font-medium cursor-pointer">
                  <option value="pkr">PKR (Rs.)</option>
                  <option value="usd">USD ($)</option>
                </select>
              </div>
            </div>

            {/* Right Column: Badges (Notification bell, Wishlist, Cart) */}
            <div className="flex items-center gap-3 self-start">
              {/* Notification bell */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="bell-btn-trigger relative bg-zinc-900 hover:bg-zinc-850 p-2.5 rounded-full border border-amber-500/20 hover:border-amber-500 text-amber-400 transition-colors cursor-pointer flex items-center justify-center min-h-[38px] min-w-[38px]"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-stone-100 text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationPanel
                  isOpen={isNotifOpen}
                  onClose={() => setIsNotifOpen(false)}
                  notifications={notifications}
                  onMarkRead={onMarkNotificationRead}
                  onMarkAllRead={onMarkAllNotificationsRead}
                  onDelete={onDeleteNotification}
                  onClearAll={onClearAllNotifications}
                  onNavigate={onNavigate}
                  onSelectTrackingId={onSelectTrackingId}
                />
              </div>

              {/* Wishlist Button */}
              <button 
                onClick={onOpenWishlist}
                className="wishlist-trigger relative bg-zinc-900 hover:bg-zinc-850 p-2.5 rounded-full border border-amber-500/20 hover:border-amber-500 text-red-500 transition-colors cursor-pointer flex items-center justify-center min-h-[38px] min-w-[38px]"
              >
                <Heart className="w-4 h-4 fill-current" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2.5 rounded-md flex items-center gap-2 transition-colors cursor-pointer h-10"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs">Cart</span>
                <span className="bg-zinc-950 text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Menu (Section 1 - Nav Bar with Hamburger) */}
      <nav className="w-full bg-zinc-950 border-t border-b border-amber-500/20 py-1.5 sm:py-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between">
          
          {/* Hamburger trigger for mobile/tablet */}
          <div className="flex items-center justify-between w-full md:w-auto md:hidden py-1">
            <span className="text-xs font-bold text-amber-500 font-display tracking-widest uppercase">
              BTM NAVIGATION
            </span>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 bg-zinc-900 text-amber-400 hover:text-amber-300 px-3 py-2 rounded border border-amber-500/20 text-xs font-bold font-display cursor-pointer min-h-[40px]"
            >
              {isMenuOpen ? (
                <>
                  <span className="text-[10px] tracking-wider">CLOSE</span>
                  <X className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span className="text-[10px] tracking-wider">MENU</span>
                  <Menu className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Nav links */}
          <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 text-xs font-medium uppercase tracking-wider font-display mt-2 md:mt-0 w-full md:w-auto`}>
            {[
              { label: 'Home', id: 'home' },
              { label: 'Shop', id: 'shop' },
              { label: 'Categories', id: 'categories' },
              { label: 'Flash Sale', id: 'flash' },
              { label: 'Product Details', id: 'product-details' },
              { label: 'Live Order Tracking', id: 'order-tracking' },
              { label: 'Company Introduction', id: 'company-intro' },
              { label: 'Store Policies', id: 'policies' },
              { label: 'Contact Support', id: 'contact-support' },
              { label: 'Customer Reviews', id: 'reviews' },
              { label: 'Account', id: 'account' },
              { label: 'Reseller Hub', id: 'reseller' },
              { label: 'Spin & Win', id: 'spin' },
              { label: 'Lucky Draw', id: 'lucky' },
              { label: 'Wholesale Zone', id: 'wholesale' },
              { label: 'Admin Panel', id: 'admin' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`py-2 px-3 md:px-2 rounded transition-colors cursor-pointer border-b-2 font-bold text-left md:text-center bg-zinc-900/30 md:bg-transparent hover:bg-zinc-900 md:hover:bg-transparent min-h-[40px] md:min-h-0 ${
                  activeSection === item.id 
                    ? 'text-amber-400 border-amber-500 font-extrabold' 
                    : 'text-stone-300 border-transparent hover:text-amber-400 hover:border-amber-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Section 2: Top Information Bar */}
      <section className="w-full bg-zinc-900/60 border-b border-amber-500/10 py-3">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
          <div className="flex items-center justify-start sm:justify-center gap-2 p-1">
            <CreditCard className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-left min-w-0">
              <h3 className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase truncate">Online Payment Only</h3>
              <p className="text-[9px] sm:text-[10px] text-stone-400 truncate">No COD Available</p>
            </div>
          </div>
          <div className="flex items-center justify-start sm:justify-center gap-2 p-1 border-l border-amber-500/10">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-left min-w-0">
              <h3 className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase truncate">Proof Required</h3>
              <p className="text-[9px] sm:text-[10px] text-stone-400 truncate">Screenshot upload mandatory</p>
            </div>
          </div>
          <div className="flex items-center justify-start sm:justify-center gap-2 p-1 border-l border-amber-500/10">
            <Truck className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-left min-w-0">
              <h3 className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase truncate">Fast Delivery</h3>
              <p className="text-[9px] sm:text-[10px] text-stone-400 truncate">All over Pakistan</p>
            </div>
          </div>
          <div className="flex items-center justify-start sm:justify-center gap-2 p-1 border-l border-amber-500/10">
            <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-left min-w-0">
              <h3 className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase truncate">Secure Shopping</h3>
              <p className="text-[9px] sm:text-[10px] text-stone-400 truncate">100% Secure & Trusted</p>
            </div>
          </div>
        </div>
      </section>
    </header>
  );
};
