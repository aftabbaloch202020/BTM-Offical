import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  ShoppingCart, 
  CreditCard, 
  Gift, 
  Award, 
  Sparkles, 
  Info,
  ChevronRight,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Notification } from '../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (sectionId: string) => void;
  onSelectTrackingId?: (trackingId: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <ShoppingCart className="w-4 h-4 text-amber-500" />;
    case 'payment':
      return <CreditCard className="w-4 h-4 text-emerald-400" />;
    case 'lucky':
      return <Gift className="w-4 h-4 text-purple-400" />;
    case 'product':
      return <Sparkles className="w-4 h-4 text-yellow-400" />;
    case 'admin':
      return <Award className="w-4 h-4 text-amber-500" />;
    case 'promo':
    default:
      return <Info className="w-4 h-4 text-blue-400" />;
  }
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onClearAll,
  onNavigate,
  onSelectTrackingId
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        // Only close if we didn't click on the bell button itself (handled by parent click)
        const target = event.target as HTMLElement;
        if (!target.closest('.bell-btn-trigger')) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleTrackOrderClick = (orderId: string) => {
    if (onSelectTrackingId) {
      onSelectTrackingId(orderId);
    }
    onNavigate('order-tracking');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for Mobile */}
          <div className="fixed inset-0 bg-black/60 z-[999] md:hidden backdrop-blur-sm" onClick={onClose} />

          {/* Panel Container */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-y-0 right-0 md:absolute md:inset-y-auto md:right-0 md:top-full md:mt-2 z-[1000] w-full max-w-sm md:w-96 h-full md:h-[500px] bg-zinc-950 border-l border-amber-500/20 md:border md:rounded-lg shadow-[0_10px_35px_rgba(212,175,55,0.25)] flex flex-col overflow-hidden backdrop-blur-md"
          >
            {/* Header */}
            <div className="p-4 border-b border-amber-500/20 flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bell className="w-5 h-5 text-amber-500" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-stone-100 text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h3 className="font-bold font-display uppercase tracking-widest text-sm text-amber-500">
                  Notifications
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="flex items-center gap-1 text-[10px] font-mono tracking-wider font-bold uppercase text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded border border-amber-500/20 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Read All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 text-stone-400 hover:text-amber-500 transition-colors rounded"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto divide-y divide-amber-500/10 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="w-10 h-10 text-stone-500 mb-2.5 animate-bounce" />
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">No notifications yet</p>
                  <p className="text-[10px] text-stone-500 mt-1 font-medium max-w-[200px]">
                    Automatic updates about your orders and status changes will appear here instantly.
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 transition-all flex gap-3 relative ${
                      notif.read 
                        ? 'bg-transparent hover:bg-zinc-900/30' 
                        : 'bg-amber-500/[0.04] border-l-2 border-l-amber-500 hover:bg-amber-500/[0.07]'
                    }`}
                  >
                    {/* Unread indicator */}
                    {!notif.read && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-ping" />
                    )}

                    {/* Left Icon */}
                    <div className="bg-zinc-900 p-2 rounded border border-amber-500/10 self-start mt-0.5 shrink-0 shadow">
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Middle Text Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-mono tracking-widest font-bold uppercase text-stone-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-amber-500/10">
                          {notif.type}
                        </span>
                        <span className="text-[9px] font-mono text-stone-500">
                          {notif.time}
                        </span>
                      </div>
                      <h4 className={`text-xs font-bold uppercase tracking-wider mt-1 ${
                        notif.read ? 'text-stone-300' : 'text-amber-400'
                      }`}>
                        {notif.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-1 leading-relaxed font-sans font-medium">
                        {notif.message}
                      </p>

                      {/* Interactive Button Actions inside Notification */}
                      {notif.relatedOrderId && (
                        <button
                          onClick={() => handleTrackOrderClick(notif.relatedOrderId!)}
                          className="mt-2.5 flex items-center gap-1 text-[9px] font-mono tracking-widest font-bold uppercase text-amber-500 hover:text-amber-400 border border-amber-500/20 hover:border-amber-500 bg-amber-500/5 hover:bg-amber-500/10 px-2 py-1 rounded transition-all cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          Track Order ID: {notif.relatedOrderId}
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </button>
                      )}
                    </div>

                    {/* Right Action buttons */}
                    <div className="flex flex-col gap-2 items-center justify-between py-0.5 shrink-0">
                      {!notif.read && (
                        <button
                          onClick={() => onMarkRead(notif.id)}
                          className="p-1 text-stone-500 hover:text-amber-400 hover:bg-zinc-900/60 rounded transition-colors"
                          title="Mark as read"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(notif.id)}
                        className="p-1 text-stone-500 hover:text-red-500 hover:bg-zinc-900/60 rounded transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Clear All */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-amber-500/10 flex items-center justify-center bg-zinc-950">
                <button
                  onClick={onClearAll}
                  className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest font-extrabold uppercase text-stone-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All Notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
