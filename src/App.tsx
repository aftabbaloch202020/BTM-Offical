import { useState, useEffect, useRef } from 'react';
import { 
  Header 
} from './components/Header';
import {
  ToastContainer
} from './components/ToastContainer';
import { 
  MainCatalog 
} from './components/MainCatalog';
import { 
  ProductAndCart 
} from './components/ProductAndCart';
import { 
  WholesaleAndAdmin 
} from './components/WholesaleAndAdmin';
import {
  AdminPanel
} from './components/AdminPanel';
import {
  CustomerReviewsPage
} from './components/CustomerReviewsPage';
import {
  AccountPage
} from './components/AccountPage';
import {
  ResellerHubPage
} from './components/ResellerHubPage';
import {
  SpinWinPage
} from './components/SpinWinPage';
import {
  LuckyDrawPage
} from './components/LuckyDrawPage';
import {
  CartDrawer
} from './components/CartDrawer';
import {
  WishlistDrawer
} from './components/WishlistDrawer';
import {
  CheckoutPage
} from './components/CheckoutPage';
import {
  OrderTrackingPage
} from './components/OrderTrackingPage';
import {
  CompanyIntroductionPage
} from './components/CompanyIntroductionPage';
import {
  StorePoliciesPage
} from './components/StorePoliciesPage';
import {
  ContactSupportPage
} from './components/ContactSupportPage';
import { 
  PRODUCTS, 
  CATEGORIES, 
  REVIEWS, 
  SEED_ORDERS, 
  INITIAL_NOTIFICATIONS 
} from './data';
import { 
  Product, 
  CartItem, 
  Order, 
  Notification, 
  OrderStatus 
} from './types';
import { 
  ShieldCheck, 
  Phone, 
  Sparkles, 
  Award,
  ChevronUp
} from 'lucide-react';
import { SplashPreloader } from './components/SplashPreloader';

export default function App() {
  // Global States
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [activePage, setActivePage] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('btm_local_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return PRODUCTS;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      
      const dedicatedPages = ['reviews', 'account', 'reseller', 'spin', 'lucky', 'admin', 'checkout', 'product-details', 'order-tracking', 'company-intro', 'policies', 'contact-support'];
      
      if (hash === 'admin') {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentView('public');
        setActivePage(hash);
        
        if (dedicatedPages.includes(hash)) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
          // Scroll to the respective homepage section
          setTimeout(() => {
            if (hash === 'home' || hash === 'shop') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (hash === 'categories' || hash === 'flash') {
              const element = document.getElementById('shop-section');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            } else if (hash === 'wholesale') {
              const element = document.getElementById('wholesale-zone-section');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            } else if (hash === 'contact' || hash === 'about') {
              const element = document.getElementById('footer-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }
            }
          }, 80);
        }
      }
    };

    // Run once on load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [categories, setCategories] = useState<any[]>(() => {
    const saved = localStorage.getItem('btm_local_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return CATEGORIES;
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeProduct, setActiveProduct] = useState<Product>(PRODUCTS[0]);
  
  // Seed and persist the cart in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('btm_cart_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cart items from localStorage", e);
      }
    }
    return [
      { product: PRODUCTS[0], quantity: 1 }, // Earbuds - Rs. 2,299
      { product: PRODUCTS[1], quantity: 1 }, // Smart Watch - Rs. 3,399
      { product: PRODUCTS[2], quantity: 1 }  // Jacket - Rs. 2,399
    ];
  });

  useEffect(() => {
    localStorage.setItem('btm_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('btm_wishlist_ids');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Keep track of displayed notifications to avoid duplicates on refresh
  const seenNotifIdsRef = useRef<string[]>([]);
  const recentNotifsRef = useRef<Map<string, number>>(new Map());

  const [seenNotifIds, setSeenNotifIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('btm_seen_notif_ids');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        seenNotifIdsRef.current = parsed || [];
        return parsed || [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const isFirstFetchRef = useRef(true);
  const isFetchingRef = useRef(false);
  const failureCountRef = useRef(0);
  const [isLocalMode, setIsLocalMode] = useState(false);

  const markNotifsAsSeen = (ids: string[]) => {
    const currentSeen = seenNotifIdsRef.current || [];
    const updated = Array.from(new Set([...currentSeen, ...ids]));
    seenNotifIdsRef.current = updated;
    localStorage.setItem('btm_seen_notif_ids', JSON.stringify(updated));
    setSeenNotifIds(updated);
  };

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('btm_local_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SEED_ORDERS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('btm_local_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [reviews, setReviews] = useState<any[]>(() => {
    const saved = localStorage.getItem('btm_local_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return REVIEWS;
  });

  const [settings, setSettings] = useState<any>(() => {
    const saved = localStorage.getItem('btm_local_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      shippingRate: "200",
      minOrderFreeShipping: "10000",
      maintenanceMode: false
    };
  });

  const [toasts, setToasts] = useState<any[]>([]);
  const [selectedTrackingId, setSelectedTrackingId] = useState<string>('');

  const showToast = (title: string, message: string, type: string) => {
    const id = `t-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const fetchBackendData = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const token = localStorage.getItem('btm_auth_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const fetchJson = async (url: string) => {
        const r = await fetch(url, { headers });
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        const contentType = r.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Expected JSON response, but got: ${contentType || "unknown"}`);
        }
        return r.json();
      };

      const [resProds, resCats, resOrders, resNotifs, resReviews, resSettings] = await Promise.all([
        fetchJson('/api/products'),
        fetchJson('/api/categories'),
        fetchJson('/api/orders'),
        fetchJson('/api/notifications'),
        fetchJson('/api/reviews'),
        fetchJson('/api/settings')
      ]);

      // Deduplicate resProds and resCats to ensure no repeated renders or duplicates
      const uniqueProds = Array.from(new Map(resProds.map((p: any) => [p.id, p])).values()) as Product[];
      const uniqueCats = Array.from(new Map(resCats.map((c: any) => [c.id, c])).values());

      setProducts(prev => {
        if (JSON.stringify(prev) === JSON.stringify(uniqueProds)) return prev;
        return uniqueProds;
      });

      setCategories(prev => {
        if (JSON.stringify(prev) === JSON.stringify(uniqueCats)) return prev;
        return uniqueCats;
      });

      setOrders(prev => {
        if (JSON.stringify(prev) === JSON.stringify(resOrders)) return prev;
        return resOrders;
      });

      setReviews(prev => {
        if (JSON.stringify(prev) === JSON.stringify(resReviews)) return prev;
        return resReviews;
      });

      setSettings(prev => {
        if (JSON.stringify(prev) === JSON.stringify(resSettings)) return prev;
        return resSettings;
      });

      setNotifications(prev => {
        if (JSON.stringify(prev) === JSON.stringify(resNotifs)) return prev;
        return resNotifs;
      });

      failureCountRef.current = 0;
      setIsLocalMode(false);

      if (isFirstFetchRef.current) {
        // On first load, mark all fetched notifications as seen without showing any toasts
        const allIds = resNotifs.map((n: any) => n.id);
        markNotifsAsSeen(allIds);
        isFirstFetchRef.current = false;
      } else {
        // On subsequent loads, only toast brand new unseen notifications
        const seenSet = new Set(seenNotifIdsRef.current);
        const newNotifs = resNotifs.filter((n: any) => !seenSet.has(n.id));
        if (newNotifs.length > 0) {
          const newIds = newNotifs.map((n: any) => n.id);
          markNotifsAsSeen(newIds);
          newNotifs.slice(0, 3).forEach((n: any) => {
            showToast(n.title, n.message, n.type);
          });
        }
      }
    } catch (err: any) {
      console.warn("Backend synchronization pending:", err instanceof Error ? err.message : String(err));
      failureCountRef.current += 1;
      if (failureCountRef.current >= 2) {
        setIsLocalMode(true);
      }
    } finally {
      isFetchingRef.current = false;
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    fetchBackendData();
    const interval = setInterval(() => {
      // If we are in local mode (failureCountRef >= 2), only check occasionally to prevent flooding
      if (failureCountRef.current >= 2) {
        if (Math.random() < 0.1) {
          fetchBackendData();
        }
      } else {
        fetchBackendData();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Helper to add a notification
  const handleAddNotification = async (title: string, message: string, type: 'order' | 'payment' | 'lucky' | 'product' | 'promo' | 'admin') => {
    const now = Date.now();
    const signature = `${title.trim().toLowerCase()}|${message.trim().toLowerCase()}`;
    const lastTime = recentNotifsRef.current.get(signature);
    if (lastTime && (now - lastTime < 5000)) {
      console.log(`[FRONTEND DUPLICATE PREVENTED] Title: "${title}", Message: "${message}"`);
      return;
    }
    recentNotifsRef.current.set(signature, now);

    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type })
      });
      const newNotif = await res.json();
      
      // Mark as seen immediately BEFORE state update or toast to block interval race conditions
      markNotifsAsSeen([newNotif.id]);

      setNotifications(prev => {
        if (prev.some(n => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });
      showToast(title, message, type);
    } catch (err) {
      console.error("Error creating notification", err);
      const newNotification: Notification = {
        id: `n-${Date.now()}`,
        title,
        message,
        time: 'Just now',
        timestamp: new Date().toISOString(),
        type,
        read: false
      };
      markNotifsAsSeen([newNotification.id]);
      setNotifications(prev => [newNotification, ...prev]);
      showToast(title, message, type);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error("Error marking notification read", err);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Error marking all read", err);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error("Error deleting notification", err);
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/clear-all', { method: 'POST' });
      if (res.ok) {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error clearing notifications", err);
      setNotifications([]);
    }
  };

  // Add to Cart
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    handleAddNotification(
      'Cart Update', 
      `${quantity}x ${product.name} added to shopping cart successfully.`, 
      'product'
    );
  };

  // Update Cart Quantity
  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => item.product.id === productId ? { ...item, quantity } : item)
    );
  };

  // Remove from Cart
  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    const prod = products.find(p => p.id === productId);
    if (prod) {
      handleAddNotification('Cart Update', `${prod.name} removed from cart.`, 'promo');
    }
  };

  // Toggle Wishlist
  const handleAddToWishlist = (product: Product) => {
    setWishlistIds(prev => {
      const isPresent = prev.includes(product.id);
      if (isPresent) {
        handleAddNotification('Wishlist Update', `${product.name} removed from wishlist.`, 'promo');
        return prev.filter(id => id !== product.id);
      } else {
        handleAddNotification('Wishlist Update', `${product.name} added to wishlist!`, 'lucky');
        return [...prev, product.id];
      }
    });
  };

  // Remove from Wishlist explicitly
  const handleRemoveFromWishlist = (product: Product) => {
    setWishlistIds(prev => {
      if (prev.includes(product.id)) {
        handleAddNotification('Wishlist Update', `${product.name} removed from wishlist.`, 'promo');
        return prev.filter(id => id !== product.id);
      }
      return prev;
    });
  };

  // Automatically persist wishlist updates to correct storage bucket (guest vs logged-in user)
  useEffect(() => {
    const user = localStorage.getItem('btm_logged_in_user');
    const key = user ? `btm_wishlist_ids_${user}` : 'btm_wishlist_ids';
    localStorage.setItem(key, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Synchronize products to localStorage as a local fallback
  useEffect(() => {
    localStorage.setItem('btm_local_products', JSON.stringify(products));
  }, [products]);

  // Synchronize categories to localStorage as a local fallback
  useEffect(() => {
    localStorage.setItem('btm_local_categories', JSON.stringify(categories));
  }, [categories]);

  // Synchronize orders to localStorage as a local fallback
  useEffect(() => {
    localStorage.setItem('btm_local_orders', JSON.stringify(orders));
  }, [orders]);

  // Synchronize reviews to localStorage as a local fallback
  useEffect(() => {
    localStorage.setItem('btm_local_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Synchronize settings to localStorage as a local fallback
  useEffect(() => {
    localStorage.setItem('btm_local_settings', JSON.stringify(settings));
  }, [settings]);

  // Synchronize notifications to localStorage as a local fallback
  useEffect(() => {
    localStorage.setItem('btm_local_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Synchronize wishlist when logging in or logging out
  useEffect(() => {
    const handleAuthChange = () => {
      fetchBackendData();
      const user = localStorage.getItem('btm_logged_in_user');
      if (user) {
        const guestWishlistStr = localStorage.getItem('btm_wishlist_ids');
        const userWishlistStr = localStorage.getItem(`btm_wishlist_ids_${user}`);
        
        let guestWishlist: string[] = [];
        let userWishlist: string[] = [];
        
        if (guestWishlistStr) {
          try { guestWishlist = JSON.parse(guestWishlistStr); } catch (e) {}
        }
        if (userWishlistStr) {
          try { userWishlist = JSON.parse(userWishlistStr); } catch (e) {}
        }
        
        // Merge uniquely to prevent duplicate entries
        const merged = Array.from(new Set([...userWishlist, ...guestWishlist]));
        
        localStorage.setItem(`btm_wishlist_ids_${user}`, JSON.stringify(merged));
        // Clear guest storage after merge
        localStorage.removeItem('btm_wishlist_ids');
        
        setWishlistIds(merged);
      } else {
        // Logged out - revert to guest wishlist
        const guestWishlistStr = localStorage.getItem('btm_wishlist_ids');
        let guestWishlist: string[] = [];
        if (guestWishlistStr) {
          try { guestWishlist = JSON.parse(guestWishlistStr); } catch (e) {}
        }
        setWishlistIds(guestWishlist);
      }
    };

    window.addEventListener('btm_auth_change', handleAuthChange);
    return () => window.removeEventListener('btm_auth_change', handleAuthChange);
  }, []);

  // Protect rewards routes from unauthenticated access
  useEffect(() => {
    const protectedPages = ['spin', 'lucky'];
    if (protectedPages.includes(activePage)) {
      const loggedIn = !!localStorage.getItem('btm_logged_in_user');
      if (!loggedIn) {
        alert("Access Denied: Please register or login to unlock Spin Wheel, Lucky Draw, and rewards!");
        setActivePage('account');
        window.location.hash = 'account';
      }
    }
  }, [activePage]);

  // Create Checkout Order
  const handlePlaceOrder = async (billingDetails: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    area: string;
    paymentMethod: string;
    screenshot: string;
  }) => {
    const shippingCost = parseInt(settings?.shippingRate || '200');
    const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) + shippingCost;
    
    const orderData = {
      customerName: billingDetails.fullName,
      phone: billingDetails.phone,
      email: billingDetails.email,
      address: billingDetails.address,
      city: billingDetails.city,
      area: billingDetails.area,
      items: [...cartItems],
      total,
      paymentMethod: billingDetails.paymentMethod,
      paymentScreenshot: billingDetails.screenshot,
      status: 'Pending'
    };

    try {
      const token = localStorage.getItem('btm_auth_token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });
      const newOrder = await res.json();
      setOrders(prev => [newOrder, ...prev]);
      setCartItems([]); // clear cart
      
      handleAddNotification(
        'Order Placed 🔔', 
        `New order ${newOrder.id} placed by ${newOrder.customerName}. Payment is pending verification.`, 
        'order'
      );

      alert(`Order submitted! Please use tracking ID: ${newOrder.id} to track order status on the right panel. Approved transactions will reflect there instantly.`);
    } catch (err) {
      console.error("Error placing order on backend", err);
      alert("Error submitting order. Please check connection and try again.");
    }
  };

  // Update order status from Admin panel
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updated = await res.json();
      setOrders(prev => 
        prev.map(order => order.id === orderId ? updated : order)
      );
    } catch (err) {
      console.error("Error updating order status on backend", err);
    }
  };

  // Spin wheel win result handling
  const handleSpinWin = (prize: string) => {
    console.log(`User spun the wheel and won: ${prize}`);
  };

  // Handle category selection
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Handle specific product view click
  const handleSelectProduct = (product: Product) => {
    setActiveProduct(product);
    window.location.hash = 'product-details';
  };

  // Header navigation smooth scroll routing
  const handleNavigationRoute = (sectionId: string) => {
    window.location.hash = sectionId;
  };

  if (currentView === 'admin') {
    return (
      <>
        {showPreloader && (
          <SplashPreloader
            isReady={isDataLoaded}
            onComplete={() => setShowPreloader(false)}
          />
        )}
        <AdminPanel
          products={products}
          orders={orders}
          notifications={notifications}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onAddNotification={handleAddNotification}
          onLogout={() => { window.location.hash = 'home'; }}
        />
      </>
    );
  }

  return (
    <>
      {showPreloader && (
        <SplashPreloader
          isReady={isDataLoaded}
          onComplete={() => setShowPreloader(false)}
        />
      )}
      <div className="min-h-screen bg-[#030303] text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-zinc-950 font-sans">
      
      {/* 1. Header & 2. Top Info Bar */}
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onSearch={(q) => {
          if (!q) {
            setProducts(PRODUCTS);
          } else {
            setProducts(PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase())));
          }
        }}
        onNavigate={handleNavigationRoute}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAllNotifications={handleClearAllNotifications}
        onSelectTrackingId={(tid) => setSelectedTrackingId(tid)}
        activeSection={activePage}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          window.location.hash = 'checkout';
        }}
        onSelectProduct={handleSelectProduct}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        products={products}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleSelectProduct}
      />

      {/* Main Responsive Grid Layout matching the reference images */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">
        
        {activePage === 'reviews' && (
          <CustomerReviewsPage reviews={REVIEWS} />
        )}

        {activePage === 'account' && (
          <AccountPage 
            orders={orders} 
            onAddNotification={handleAddNotification} 
          />
        )}

        {activePage === 'reseller' && (
          <ResellerHubPage 
            onAddNotification={handleAddNotification} 
          />
        )}

        {activePage === 'spin' && (
          <SpinWinPage 
            onAddNotification={handleAddNotification} 
            onSpinWin={handleSpinWin} 
          />
        )}

        {activePage === 'lucky' && (
          <LuckyDrawPage 
            orders={orders} 
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onPlaceOrder={handlePlaceOrder}
            settings={settings}
            onNavigate={handleNavigationRoute}
          />
        )}

        {activePage === 'product-details' && (
          <div className="max-w-4xl mx-auto">
            <ProductAndCart
              activeProduct={activeProduct}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateCartQuantity={handleUpdateCartQuantity}
              onRemoveFromCart={handleRemoveFromCart}
              onPlaceOrder={handlePlaceOrder}
              onSelectProduct={handleSelectProduct}
            />
          </div>
        )}

        {activePage === 'order-tracking' && (
          <OrderTrackingPage 
            orders={orders} 
            initialTrackingId={selectedTrackingId} 
          />
        )}

        {activePage === 'company-intro' && (
          <CompanyIntroductionPage />
        )}

        {activePage === 'policies' && (
          <StorePoliciesPage />
        )}

        {activePage === 'contact-support' && (
          <ContactSupportPage onAddNotification={handleAddNotification} />
        )}

        {/* Default / Homepage view */}
        {!['reviews', 'account', 'reseller', 'spin', 'lucky', 'checkout', 'product-details', 'order-tracking', 'company-intro', 'policies', 'contact-support'].includes(activePage) && (
          <>
            <div className="w-full flex flex-col gap-6">
              <MainCatalog
                products={products}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onSelectProduct={handleSelectProduct}
                onAddToWishlist={handleAddToWishlist}
                wishlistIds={wishlistIds}
                onAddToCart={handleAddToCart}
              />
            </div>

            {/* Section 22: Wholesale Zone */}
            <div id="wholesale-zone-section" className="mt-8">
              <WholesaleAndAdmin
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onAddNotification={handleAddNotification}
              />
            </div>
          </>
        )}

      </main>

      {/* Footer Branding & Badges */}
      <footer className="w-full bg-zinc-950 border-t border-amber-500/30 text-stone-300 font-sans mt-12">
        
        {/* Upper Foot links matching reference footer requirements */}
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left border-b border-amber-500/10">
          
          {/* Join as Reseller */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Join as Reseller</h4>
            <p className="text-xs text-stone-400">
              Start Your Online Earning Journey With BTM Today! Register in the Account Hub or contact Wholesalers.
            </p>
            <button 
              onClick={() => alert('Starting Reseller Registration Form...')}
              className="mt-2 inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md cursor-pointer"
            >
              Start Earning
            </button>
          </div>

          {/* WhatsApp Support */}
          <div className="space-y-2 text-center">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">WhatsApp Support</h4>
            <p className="text-xs text-stone-400">
              Get immediate status updates or help with custom bulk payment proof validations.
            </p>
            <a 
              href="https://wa.me/923001234567" 
              target="_blank" 
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-stone-100 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md cursor-pointer"
            >
              💬 WhatsApp Support
            </a>
          </div>

          {/* Contact us */}
          <div className="space-y-2 md:text-right">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Contact Us</h4>
            <p className="text-xs text-stone-400">
              Quetta Head Office: Jinnah Road, Balochistan, Pakistan.<br />
              Email: support@btm.official.pk
            </p>
          </div>

        </div>

        {/* Bottom copyright & brand slogan */}
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Logo Title */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-amber-500 bg-zinc-950 flex items-center justify-center p-0.5 text-amber-500 font-bold text-[8px]">
              BTM
            </div>
            <span className="font-bold text-amber-500 tracking-wider font-display text-[10px]">
              BALOCHISTAN TRUSTED MART OFFICIAL (BTM)
            </span>
          </div>

          <div className="text-stone-400 font-bold tracking-wide italic font-display text-center sm:text-right">
            ✨ BTM - Aapka Bharosa, Hamari Zimmedari! ✨
          </div>

          <div className="text-stone-500 text-[10px] font-mono">
            © 2026 BTM Official. All rights reserved. Built with pride.
          </div>

        </div>

      </footer>
      <ToastContainer 
        toasts={toasts} 
        onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} 
      />
    </div>
    </>
  );
}
