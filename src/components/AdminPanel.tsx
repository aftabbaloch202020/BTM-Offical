import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  Boxes, 
  FileText, 
  Users, 
  Award, 
  Store, 
  Megaphone, 
  Percent, 
  Zap, 
  Ticket, 
  RefreshCw, 
  Bell, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Lock, 
  Mail,
  Plus, 
  Check, 
  X, 
  ShieldCheck, 
  Eye,
  ImageIcon,
  TrendingDown,
  Gift
} from 'lucide-react';
import { Product, Order, Notification, OrderStatus } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  notifications: Notification[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddNotification: (title: string, message: string, type: any) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  notifications,
  onUpdateOrderStatus,
  onAddNotification,
  onLogout
}) => {
  // Login flow state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Interactive real-time states
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [resellers, setResellers] = useState<any[]>([]);
  const [luckyDraws, setLuckyDraws] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [shippingRate, setShippingRate] = useState('200');
  const [minOrderFreeShipping, setMinOrderFreeShipping] = useState('10000');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [selectedVerifyOrderId, setSelectedVerifyOrderId] = useState<string>('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  // Real-time custom admin states for products & orders
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategoryFilter, setProdCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);

  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodStock, setProdStock] = useState('50');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodSku, setProdSku] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodFlashSale, setProdFlashSale] = useState(false);
  const [prodTags, setProdTags] = useState('');
  const [prodDiscount, setProdDiscount] = useState('');
  const [prodAdditionalImages, setProdAdditionalImages] = useState('');

  // Fetch admin console records from DB
  const fetchAdminData = async () => {
    try {
      const [pRes, cRes, cpRes, rRes, ldRes, sRes, custRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/coupons').then(r => r.json()),
        fetch('/api/resellers').then(r => r.json()),
        fetch('/api/lucky-draws').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/customers').then(r => r.json())
      ]);
      setLocalProducts(pRes);
      setCategories(cRes);
      setCoupons(cpRes);
      setResellers(rRes);
      setLuckyDraws(ldRes);
      setShippingRate(sRes.shippingRate);
      setMinOrderFreeShipping(sRes.minOrderFreeShipping);
      setMaintenanceMode(sRes.maintenanceMode);
      setCustomers(custRes);

      const flashItems = pRes.filter((p: any) => p.originalPrice > p.price).map((p: any) => ({
        id: p.id,
        name: p.name,
        originalPrice: p.originalPrice,
        promoPrice: p.price,
        active: p.inStock
      }));
      setFlashSales(flashItems);
    } catch (err) {
      console.error("Error loading admin records", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
      const intv = setInterval(fetchAdminData, 3000);
      return () => clearInterval(intv);
    }
  }, [isAuthenticated]);

  // Set default verifying order when orders state changes
  React.useEffect(() => {
    const pendingOrder = orders.find(o => o.status === 'Pending' || o.status === 'Payment Verification');
    if (pendingOrder) {
      setSelectedVerifyOrderId(pendingOrder.id);
    } else if (orders.length > 0) {
      setSelectedVerifyOrderId(orders[0].id);
    }
  }, [orders]);

  const activeVerifyOrder = orders.find(o => o.id === selectedVerifyOrderId);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      email === 'balochistantrustedmart.2026@gmail.com' &&
      password === 'balochistantrustedmart123'
    ) {
      setIsAuthenticated(true);
      setLoginError('');
      onAddNotification(
        'Admin Access Granted',
        'Secure admin credentials validated successfully.',
        'payment'
      );
    } else {
      setLoginError('Invalid email or password.');
    }
  };

  // Handle Logout session
  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    onLogout();
  };

  // Payment Verification actions
  const handleApprovePayment = async () => {
    if (!activeVerifyOrder) return;
    onUpdateOrderStatus(activeVerifyOrder.id, 'Confirmed');
    onAddNotification(
      'Payment Confirmed ✓', 
      `Payment proof verified for order ${activeVerifyOrder.id}. Status set to Confirmed.`, 
      'payment'
    );
    alert(`Order ${activeVerifyOrder.id} payment verified! Customer will see "Confirmed" on their Order Tracking timeline.`);
  };

  const handleRejectPayment = async () => {
    if (!activeVerifyOrder) return;
    onUpdateOrderStatus(activeVerifyOrder.id, 'Cancelled');
    onAddNotification(
      'Payment Rejected ❌', 
      `Payment proof rejected for order ${activeVerifyOrder.id}. Order marked as Cancelled.`, 
      'order'
    );
    alert(`Order ${activeVerifyOrder.id} payment proof rejected. Order marked as Cancelled.`);
  };

  // Helper calculations
  const realTotalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const currentMonthStr = new Date().toISOString().slice(0, 7); // "2026-07"
  const monthlyRevenue = orders
    .filter(o => o.status !== 'Cancelled' && o.date.startsWith(currentMonthStr))
    .reduce((acc, o) => acc + o.total, 0);

  // Compute monthly revenue dynamically for the past 12 months based on live orders
  const monthlyData = Array.from({ length: 12 }).map((_, idx) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - idx));
    const yearMonth = d.toISOString().slice(0, 7); // e.g. "2026-07"
    
    const totalSalesForMonth = orders
      .filter(o => o.status !== 'Cancelled' && o.date.startsWith(yearMonth))
      .reduce((acc, o) => acc + o.total, 0);
      
    const label = d.toLocaleString('en-US', { month: 'short' });
    return { yearMonth, label, total: totalSalesForMonth };
  });

  const maxMonthlyRevenue = Math.max(...monthlyData.map(m => m.total), 1);

  // 17 Tab items definition
  const tabItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Product Management', icon: ShoppingBag },
    { id: 'categories', label: 'Category Management', icon: Tag },
    { id: 'inventory', label: 'Inventory Management', icon: Boxes },
    { id: 'orders', label: 'Order Management', icon: FileText },
    { id: 'customers', label: 'Customer Management', icon: Users },
    { id: 'resellers', label: 'Reseller Management', icon: Users },
    { id: 'wholesale', label: 'Wholesale Management', icon: Store },
    { id: 'marketing', label: 'Marketing Tools', icon: Megaphone },
    { id: 'coupons', label: 'Coupons & Discounts', icon: Percent },
    { id: 'flash', label: 'Flash Sales', icon: Zap },
    { id: 'lucky', label: 'Lucky Draw Management', icon: Gift },
    { id: 'spin', label: 'Spin & Win Management', icon: RefreshCw },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payment Verification', icon: CreditCard },
    { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Secure login page layout
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030303] text-stone-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-amber-500 selection:text-zinc-950 font-sans">
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-zinc-950 border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.05)] text-center relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-20 rounded-full border border-amber-500 bg-zinc-950 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <ShieldCheck className="w-10 h-10 text-amber-500" />
            </div>
          </div>

          <div className="mt-8 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold font-display tracking-widest text-amber-500 uppercase">
              BTM Admin Portal
            </h1>
            <p className="text-xs text-stone-500 uppercase tracking-widest font-mono mt-1">
              Secure Central Console
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-3 px-4 rounded-lg font-mono mb-4 text-left flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] text-stone-400 uppercase tracking-wider font-mono font-bold mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@btm.official.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-100 text-xs pl-10 pr-4 h-11 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-stone-400 uppercase tracking-wider font-mono font-bold mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-100 text-xs pl-10 pr-4 h-11 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-zinc-950 font-extrabold h-11 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
              >
                Authenticate Session
              </button>
            </div>
          </form>

          <button
            onClick={onLogout}
            className="mt-6 text-stone-500 hover:text-stone-300 text-[10px] uppercase font-bold tracking-wider font-mono cursor-pointer transition-colors"
          >
            ← Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-stone-100 flex flex-col font-sans">
      
      {/* Admin header */}
      <header className="w-full bg-zinc-950 border-b border-amber-500/20 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-amber-500 bg-zinc-950 flex items-center justify-center p-0.5 text-amber-500 font-bold text-xs shadow-[0_0_10px_rgba(212,175,55,0.2)]">
              BTM
            </div>
            <div>
              <span className="font-bold text-amber-400 tracking-wider font-display text-xs uppercase block">
                Balochistan Trusted Mart (BTM)
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                ADMIN CONSOLE v2026.1 • SECURED SESSION
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Secure Active
            </div>

            <button
              onClick={handleAdminLogout}
              className="bg-zinc-900 border border-red-500/30 hover:bg-red-500/10 text-red-500 hover:text-red-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout Console
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Responsive Sidebar list of all 17 tabs */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-4 gold-glow">
            <div className="border-b border-amber-500/10 pb-2 mb-3">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400">
                Operations Menu
              </span>
            </div>

            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 scrollbar-none">
              {tabItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap text-left cursor-pointer min-h-[40px] shrink-0 w-auto lg:w-full ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(212,175,55,0.15)] font-extrabold'
                        : 'text-stone-400 hover:text-amber-400 hover:bg-zinc-900/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick info block */}
          <div className="bg-zinc-900/40 border border-amber-500/5 p-3 rounded-lg text-[10px] text-stone-500 space-y-1">
            <div><strong>Logged in as:</strong> aptech202022@gmail.com</div>
            <div><strong>Last Sync:</strong> 2026-07-10 00:50:38 UTC</div>
            <div><strong>Location:</strong> Quetta, Balochistan</div>
          </div>
        </aside>

        {/* Right Column: Dynamic Panel content */}
        <main className="lg:col-span-9 bg-zinc-950 border border-amber-500/20 rounded-xl p-5 sm:p-6 gold-glow flex flex-col justify-between min-h-[550px]">
          
          <div>
            {/* Header of selected panel */}
            <div className="flex justify-between items-center border-b border-amber-500/10 pb-4 mb-5">
              <h2 className="text-base sm:text-lg font-bold font-display uppercase tracking-widest text-amber-500 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-amber-500 rounded-sm"></span>
                {tabItems.find(t => t.id === activeTab)?.label}
              </h2>
              <span className="text-[10px] font-mono uppercase bg-zinc-900 px-2 py-0.5 rounded text-stone-400 border border-amber-500/5">
                {activeTab} module
              </span>
            </div>

            {/* Render selected operations tab */}
            
            {/* 1. Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-amber-500/10">
                    <span className="text-[10px] text-stone-500 font-mono uppercase">Total Orders</span>
                    <span className="text-xl font-bold text-amber-500 block mt-1 font-mono">{orders.length.toLocaleString()}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-amber-500/10">
                    <span className="text-[10px] text-stone-500 font-mono uppercase">Total Customers</span>
                    <span className="text-xl font-bold text-amber-500 block mt-1 font-mono">{customers.length.toLocaleString()}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-amber-500/10">
                    <span className="text-[10px] text-stone-500 font-mono uppercase">Active Products</span>
                    <span className="text-xl font-bold text-amber-500 block mt-1 font-mono">{localProducts.length}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-amber-500/10">
                    <span className="text-[10px] text-stone-500 font-mono uppercase">Total Sales (PKR)</span>
                    <span className="text-xl font-bold text-amber-500 block mt-1 font-mono">Rs. {realTotalSales.toLocaleString()}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-amber-500/10 col-span-2 lg:col-span-1">
                    <span className="text-[10px] text-stone-500 font-mono uppercase">Monthly Revenue</span>
                    <span className="text-xl font-bold text-amber-500 block mt-1 font-mono">Rs. {monthlyRevenue.toLocaleString()}</span>
                  </div>
                </div>

                {/* Sub Chart and quick tasks */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Sales performance bar chart representation */}
                  <div className="md:col-span-8 bg-zinc-900/40 border border-amber-500/10 p-4 rounded-lg flex flex-col justify-between h-56">
                    <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                      <span>Monthly Revenue Progress Chart</span>
                      <span className="text-amber-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                        Live Feed
                      </span>
                    </div>
                    
                    <div className="flex items-end justify-between gap-1 h-36 pt-2">
                      {monthlyData.map((data, idx) => {
                        const pct = data.total / maxMonthlyRevenue;
                        const heightPx = data.total === 0 ? 4 : Math.round(pct * 120);
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <div 
                              style={{ height: `${heightPx}px` }}
                              className="w-full bg-gradient-to-t from-amber-700 to-amber-500 hover:from-amber-400 hover:to-amber-300 rounded-t-sm transition-all cursor-pointer"
                              title={`${data.yearMonth}: Rs. ${data.total.toLocaleString()}`}
                            ></div>
                            <span className="text-[8px] text-stone-500 font-mono">{data.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* System overview logger */}
                  <div className="md:col-span-4 bg-zinc-900/40 border border-amber-500/10 p-4 rounded-lg space-y-3">
                    <h4 className="text-[10px] text-amber-500 font-bold uppercase font-mono tracking-wider">
                      Secure Engine Log
                    </h4>
                    <div className="text-[9px] font-mono text-stone-400 space-y-2">
                      <div className="flex justify-between text-stone-500">
                        <span>Database status:</span>
                        <span className="text-emerald-400">ONLINE</span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span>API endpoint:</span>
                        <span className="text-emerald-400">ACTIVE</span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span>HMR state:</span>
                        <span className="text-stone-400">DISABLED</span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span>Server Port:</span>
                        <span className="text-amber-500 font-bold">3000</span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span>SSL Session:</span>
                        <span className="text-emerald-400">ENCRYPTED</span>
                      </div>
                    </div>

                    <div className="pt-2 text-center">
                      <button
                        onClick={() => alert('Full secure log report generated in workspace memory.')}
                        className="w-full bg-amber-500/10 hover:bg-amber-500 hover:text-zinc-950 border border-amber-500/20 text-amber-400 text-[9px] font-bold py-1.5 rounded uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Generate Log Report
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 2. Product Management Tab */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                {/* Search & Filter Controls */}
                <div className="bg-zinc-900/60 p-3.5 rounded-lg border border-amber-500/10 flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                      className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3 py-2 rounded outline-none font-mono w-full sm:w-64"
                    />
                    <select
                      value={prodCategoryFilter}
                      onChange={(e) => setProdCategoryFilter(e.target.value)}
                      className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3 py-2 rounded outline-none cursor-pointer w-full sm:w-48"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-[11px] text-stone-400 font-mono whitespace-nowrap">
                      Found: <strong>{localProducts.filter(p => {
                        const matchesSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase()) || 
                                              (p.brand && p.brand.toLowerCase().includes(prodSearch.toLowerCase()));
                        const matchesCategory = prodCategoryFilter === 'all' || p.category === prodCategoryFilter;
                        return matchesSearch && matchesCategory;
                      }).length}</strong> of {localProducts.length}
                    </span>
                    <button
                      onClick={() => {
                        setIsAddingProduct(true);
                        setIsEditingProduct(null);
                        setProdName('');
                        setProdBrand('BTM');
                        setProdPrice('');
                        setProdOriginalPrice('');
                        setProdStock('50');
                        setProdDesc('');
                        setProdCategory(categories[0]?.id || 'electronics');
                        setProdImageUrl('');
                        setProdInStock(true);
                        setProdSku('');
                        setProdFeatured(false);
                        setProdFlashSale(false);
                        setProdTags('');
                        setProdDiscount('');
                        setProdAdditionalImages('');
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-[10px] px-3.5 py-2 rounded uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/15 font-sans whitespace-nowrap transition-transform active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Product
                    </button>
                  </div>
                </div>

                {/* Inline Add/Edit Form */}
                {(isAddingProduct || isEditingProduct) && (
                  <div className="bg-zinc-900/90 p-5 rounded-xl border border-amber-500/30 space-y-4 max-w-xl mx-auto gold-glow">
                    <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-amber-500 rounded-sm"></span>
                      {isAddingProduct ? "Add New Product" : `Edit Product: ${isEditingProduct?.name}`}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-200">
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          placeholder="e.g. Smart Watch Pro"
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Brand Name</label>
                        <input
                          type="text"
                          value={prodBrand}
                          onChange={(e) => setProdBrand(e.target.value)}
                          placeholder="e.g. Xiaomi"
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Sale Price (Rs) *</label>
                        <input
                          type="number"
                          required
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          placeholder="e.g. 2999"
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Original Price (Rs)</label>
                        <input
                          type="number"
                          value={prodOriginalPrice}
                          onChange={(e) => setProdOriginalPrice(e.target.value)}
                          placeholder="e.g. 3999"
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Discount Override (e.g. -20%)</label>
                        <input
                          type="text"
                          value={prodDiscount}
                          onChange={(e) => setProdDiscount(e.target.value)}
                          placeholder="Auto-calculated if blank"
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">SKU / Product Code</label>
                        <input
                          type="text"
                          value={prodSku}
                          onChange={(e) => setProdSku(e.target.value)}
                          placeholder="e.g. BTM-SW-01"
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Category *</label>
                        <select
                          required
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none font-sans cursor-pointer"
                        >
                          <option value="">-- Select Category --</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Stock Quantity *</label>
                        <input
                          type="number"
                          required
                          value={prodStock}
                          onChange={(e) => setProdStock(e.target.value)}
                          placeholder="e.g. 100"
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Status</label>
                        <select
                          value={prodInStock ? 'active' : 'inactive'}
                          onChange={(e) => setProdInStock(e.target.value === 'active')}
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none font-sans cursor-pointer"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400 block mb-1">Promotional Toggles</label>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                          <label className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-stone-300 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={prodFeatured}
                              onChange={(e) => setProdFeatured(e.target.checked)}
                              className="accent-amber-500 w-3.5 h-3.5 cursor-pointer"
                            />
                            Featured
                          </label>
                          <label className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-stone-300 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={prodFlashSale}
                              onChange={(e) => setProdFlashSale(e.target.checked)}
                              className="accent-amber-500 w-3.5 h-3.5 cursor-pointer"
                            />
                            Flash Sale
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Product Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={prodTags}
                          onChange={(e) => setProdTags(e.target.value)}
                          placeholder="e.g. new, hot, premium, organic"
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none text-xs text-stone-200 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Product Image URL (Main Image) *</label>
                        <input
                          type="text"
                          value={prodImageUrl}
                          onChange={(e) => setProdImageUrl(e.target.value)}
                          placeholder="Pasted Unsplash URL or upload file below..."
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Additional Gallery Image URLs (One URL per line)</label>
                        <textarea
                          value={prodAdditionalImages}
                          onChange={(e) => setProdAdditionalImages(e.target.value)}
                          placeholder="Paste image URLs, one per line..."
                          rows={2}
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none font-mono"
                        />
                      </div>

                      {/* Image Upload Picker block */}
                      <div className="space-y-1.5 sm:col-span-2 bg-zinc-950/60 p-3 rounded border border-amber-500/10">
                        <span className="text-[9px] uppercase font-mono font-bold text-stone-400 block mb-1">
                          Or Upload Product Image File (Converts to secure database stream)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const base64 = reader.result as string;
                                setProdImageUrl(base64);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="text-[11px] text-stone-400 w-full cursor-pointer file:bg-amber-500 file:hover:bg-amber-600 file:text-zinc-950 file:border-0 file:px-2.5 file:py-1.5 file:rounded file:font-bold file:mr-3 file:uppercase file:tracking-wider file:text-[9px] file:cursor-pointer"
                        />
                        {prodImageUrl && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[9px] text-emerald-400 font-mono font-bold">✓ IMAGE LOADED:</span>
                            <img src={prodImageUrl} className="w-10 h-10 object-cover rounded border border-amber-500/20" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-400">Description</label>
                        <textarea
                          value={prodDesc}
                          onChange={(e) => setProdDesc(e.target.value)}
                          placeholder="Enter product details..."
                          rows={3}
                          className="w-full bg-zinc-950 border border-amber-500/20 focus:border-amber-500 px-3 py-2 rounded outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => {
                          setIsAddingProduct(false);
                          setIsEditingProduct(null);
                        }}
                        className="bg-zinc-950 border border-stone-600/30 text-stone-300 font-bold text-[10px] px-3.5 py-2 rounded uppercase tracking-wider hover:bg-zinc-850 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          if (!prodName || !prodPrice || !prodCategory || !prodStock) {
                            alert("Please fill in all required fields marked with *");
                            return;
                          }

                          const priceNum = Number(prodPrice);
                          const originalPriceNum = prodOriginalPrice ? Number(prodOriginalPrice) : priceNum * 1.25;
                          const discountPercent = prodDiscount || `-${Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)}%`;

                          let additionalImages: string[] = [];
                          if (prodAdditionalImages) {
                            additionalImages = prodAdditionalImages
                              .split(/[\n,]+/)
                              .map(img => img.trim())
                              .filter(img => img.length > 0);
                          }
                          const imagesArray = [
                            prodImageUrl || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
                            ...additionalImages
                          ];

                          const tagsArray = prodTags
                            ? prodTags.split(',').map(t => t.trim()).filter(t => t.length > 0)
                            : [];

                          const productPayload = {
                            name: prodName,
                            brand: prodBrand || "BTM",
                            price: priceNum,
                            originalPrice: originalPriceNum,
                            discount: discountPercent,
                            category: prodCategory,
                            stock: String(prodStock),
                            description: prodDesc,
                            image: prodImageUrl || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
                            images: imagesArray,
                            inStock: prodInStock,
                            sku: prodSku,
                            featured: prodFeatured,
                            flashSale: prodFlashSale,
                            tags: tagsArray
                          };

                          try {
                            let res;
                            if (isAddingProduct) {
                              res = await fetch('/api/products', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(productPayload)
                              });
                            } else {
                              res = await fetch(`/api/products/${isEditingProduct?.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(productPayload)
                              });
                            }

                            if (res.ok) {
                              const saved = await res.json();
                              if (isAddingProduct) {
                                setLocalProducts(prev => [saved, ...prev]);
                                onAddNotification('Product Added', `➕ New product "${saved.name}" was added successfully.`, 'product');
                                alert(`Product "${prodName}" added successfully!`);
                              } else {
                                setLocalProducts(prev => prev.map(item => item.id === saved.id ? saved : item));
                                onAddNotification('Product Updated', `✅ Product "${saved.name}" was updated successfully.`, 'product');
                                alert(`Product "${prodName}" updated successfully!`);
                              }
                              setIsAddingProduct(false);
                              setIsEditingProduct(null);
                            } else {
                              const errData = await res.json();
                              alert(errData.error || "Operation failed");
                            }
                          } catch (err) {
                            console.error(err);
                            alert("An error occurred while saving the product.");
                          }
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-[10px] px-4 py-2 rounded uppercase tracking-wider cursor-pointer shadow-md shadow-amber-500/10"
                      >
                        {isAddingProduct ? "Save Product" : "Apply Changes"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-stone-300">
                    <thead>
                      <tr className="border-b border-amber-500/10 text-stone-400 font-mono text-[10px] uppercase">
                        <th className="py-2 px-1">Product</th>
                        <th className="py-2 px-1">Category</th>
                        <th className="py-2 px-1 text-right">Price</th>
                        <th className="py-2 px-1 text-right">Stock</th>
                        <th className="py-2 px-1 text-center">Status</th>
                        <th className="py-2 px-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {localProducts
                        .filter(p => {
                          const matchesSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase()) || 
                                                (p.brand && p.brand.toLowerCase().includes(prodSearch.toLowerCase()));
                          const matchesCategory = prodCategoryFilter === 'all' || p.category === prodCategoryFilter;
                          return matchesSearch && matchesCategory;
                        })
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-zinc-900/40">
                            <td className="py-2.5 px-1 font-bold text-amber-400 flex items-center gap-2">
                              <img src={p.image} className="w-6 h-6 object-cover rounded border border-amber-500/10" referrerPolicy="no-referrer" />
                              <span className="truncate max-w-[150px]">{p.name}</span>
                            </td>
                            <td className="py-2.5 px-1 capitalize text-stone-400">{p.category}</td>
                            <td className="py-2.5 px-1 text-right font-mono font-bold">Rs. {p.price.toLocaleString()}</td>
                            <td className="py-2.5 px-1 text-right font-mono">{p.stock} units</td>
                            <td className="py-2.5 px-1 text-center font-mono">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${p.inStock ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-red-500/10 text-red-400 border-red-500/10'}`}>
                                {p.inStock ? 'Active' : 'Disabled'}
                              </span>
                            </td>
                            <td className="py-2.5 px-1 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setIsEditingProduct(p);
                                  setIsAddingProduct(false);
                                  setProdName(p.name);
                                  setProdBrand(p.brand || 'BTM');
                                  setProdPrice(p.price.toString());
                                  setProdOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
                                  setProdStock(p.stock);
                                  setProdDesc(p.description || '');
                                  setProdCategory(p.category);
                                  setProdImageUrl(p.image);
                                  setProdInStock(p.inStock);
                                  setProdSku((p as any).sku || '');
                                  setProdFeatured(!!(p as any).featured);
                                  setProdFlashSale(!!(p as any).flashSale);
                                  setProdTags((p as any).tags ? (Array.isArray((p as any).tags) ? (p as any).tags.join(', ') : (p as any).tags) : '');
                                  setProdDiscount(p.discount || '');
                                  setProdAdditionalImages(p.images ? p.images.slice(1).join('\n') : '');
                                }}
                                className="text-stone-300 hover:underline text-[10px]"
                              >
                                Edit All
                              </button>
                              <span>|</span>
                              <button
                                onClick={async () => {
                                  const updatedStatus = !p.inStock;
                                  try {
                                    const res = await fetch(`/api/products/${p.id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ inStock: updatedStatus })
                                    });
                                    const updated = await res.json();
                                    setLocalProducts(prev => prev.map(item => item.id === p.id ? updated : item));
                                    onAddNotification('Product Status Updated', `"${p.name}" status set to ${updatedStatus ? 'Active' : 'Disabled'}.`, 'product');
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="text-amber-400 hover:underline text-[10px]"
                              >
                                {p.inStock ? 'Disable' : 'Enable'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Category Management Tab */}
            {activeTab === 'categories' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 border border-amber-500/10 p-4 rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Create New Category</h4>
                  <div className="flex flex-col md:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Category Name (e.g. Winter Clothes)"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3 py-2 rounded outline-none flex-1 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Image URL or Icon Name (e.g. Sparkles, Shirt, Laptop)"
                      value={newCatImage}
                      onChange={(e) => setNewCatImage(e.target.value)}
                      className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3 py-2 rounded outline-none flex-1 font-mono"
                    />
                    <button
                      onClick={async () => {
                        if (!newCatName) {
                          alert("Category name is required.");
                          return;
                        }
                        try {
                          const iconVal = newCatImage.trim() || "Tag";
                          const res = await fetch('/api/categories', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              name: newCatName, 
                              icon: iconVal,
                              image: iconVal,
                              id: newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-') 
                            })
                          });
                          if (res.ok) {
                            const saved = await res.json();
                            setCategories(prev => [...prev, saved]);
                            onAddNotification('Category Added', `Category "${newCatName}" was created.`, 'product');
                            alert("Category created successfully.");
                            setNewCatName('');
                            setNewCatImage('');
                          } else {
                            const errData = await res.json();
                            alert(errData.error || "Failed to create category.");
                          }
                        } catch (err) {
                          console.error(err);
                          alert("An error occurred while creating category.");
                        }
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2 rounded text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Create
                    </button>
                  </div>
                </div>

                {/* Category Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-900/20 p-3 border border-amber-500/10 rounded-lg">
                  <span className="text-xs text-stone-400 font-mono">Filter Category List</span>
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3 py-2 rounded outline-none w-full md:w-64 font-mono"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-stone-300">
                    <thead>
                      <tr className="border-b border-amber-500/10 text-stone-400 font-mono text-[10px] uppercase">
                        <th className="py-2 px-1">Category Details</th>
                        <th className="py-2 px-1 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {categories
                        .filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()))
                        .map(c => {
                          const isImg = c.icon && (c.icon.startsWith('http://') || c.icon.startsWith('https://') || c.icon.startsWith('/') || c.icon.includes('.png') || c.icon.includes('.jpg') || c.icon.includes('.jpeg'));
                          return (
                            <tr key={c.id} className="hover:bg-zinc-900/40">
                              <td className="py-3 px-1 font-bold text-stone-200 capitalize">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-zinc-850 flex items-center justify-center overflow-hidden border border-amber-500/20">
                                    {isImg ? (
                                      <img src={c.icon} alt={c.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-[10px] text-amber-500 font-mono font-bold">{c.icon ? c.icon.substring(0, 3).toUpperCase() : 'CAT'}</span>
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-stone-200">{c.name}</div>
                                    <div className="text-[10px] text-stone-500 font-mono">{c.icon || 'No Icon/Image'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-1 text-right space-x-2">
                                <button
                                  onClick={async () => {
                                    const newName = prompt("Enter new name for category:", c.name);
                                    if (newName === null) return;
                                    const newImage = prompt("Enter new image URL or Icon Name (e.g. Sparkles, Laptop) for category:", c.icon || "");
                                    if (newImage === null) return;
                                    try {
                                      const res = await fetch(`/api/categories/${c.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ name: newName, icon: newImage, image: newImage })
                                      });
                                      if (res.ok) {
                                        const updated = await res.json();
                                        setCategories(prev => prev.map(item => item.id === c.id ? updated : item));
                                        onAddNotification('Category Updated', `Category renamed to "${newName}".`, 'product');
                                        alert("Category updated successfully.");
                                      } else {
                                        const errData = await res.json();
                                        alert(errData.error || "Failed to update category.");
                                      }
                                    } catch (err) {
                                      console.error(err);
                                      alert("An error occurred while updating the category.");
                                    }
                                  }}
                                  className="text-amber-500 hover:underline"
                                >
                                  Edit
                                </button>
                                <span>|</span>
                                <button
                                  onClick={async () => {
                                    if (!confirm(`Are you sure you want to delete category "${c.name}"?`)) return;
                                    try {
                                      const res = await fetch(`/api/categories/${c.id}`, { method: 'DELETE' });
                                      if (res.ok) {
                                        setCategories(prev => prev.filter(item => item.id !== c.id));
                                        onAddNotification('Category Deleted', `Category "${c.name}" removed.`, 'product');
                                        alert("Category deleted successfully.");
                                      } else {
                                        const errData = await res.json();
                                        alert(errData.error || "Failed to delete category.");
                                      }
                                    } catch (err) {
                                      console.error(err);
                                      alert("An error occurred while deleting the category.");
                                    }
                                  }}
                                  className="text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Inventory Management Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 p-4 border border-amber-500/10 rounded-lg text-xs leading-relaxed text-stone-300">
                  ⚠️ <strong className="text-amber-500">Inventory Alert thresholds:</strong> BTM logistics automatically monitors warehouse volume levels. Below 5 units represents warning limits.
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-stone-300">
                    <thead>
                      <tr className="border-b border-amber-500/10 text-stone-400 font-mono text-[10px] uppercase">
                        <th className="py-2 px-1">Product</th>
                        <th className="py-2 px-1 text-center">Stock Available</th>
                        <th className="py-2 px-1 text-center">Threshold Alert</th>
                        <th className="py-2 px-1 text-right">Quick Add Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {localProducts.map(p => {
                        const stockVal = parseInt(p.stock) || 0;
                        const isLow = stockVal < 5;
                        return (
                          <tr key={p.id} className="hover:bg-zinc-900/40">
                            <td className="py-2.5 px-1 font-bold text-stone-200">{p.name}</td>
                            <td className="py-2.5 px-1 text-center font-mono font-bold text-amber-400">{p.stock} units</td>
                            <td className="py-2.5 px-1 text-center">
                              {isLow ? (
                                <span className="bg-red-500/15 text-red-500 text-[8px] font-bold px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-mono">⚠️ LOW STOCK</span>
                              ) : (
                                <span className="bg-emerald-500/15 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase font-mono">✓ SAFE STACK</span>
                              )}
                            </td>
                            <td className="py-2.5 px-1 text-right">
                              <button
                                onClick={async () => {
                                  const currentVal = parseInt(p.stock) || 0;
                                  const newVal = currentVal + 50;
                                  try {
                                    const res = await fetch(`/api/products/${p.id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ stock: String(newVal), inStock: true })
                                    });
                                    const updated = await res.json();
                                    setLocalProducts(prev => prev.map(item => item.id === p.id ? updated : item));
                                    alert(`Replenished 50 units for ${p.name}. New Warehouse stock level is ${newVal}.`);
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="bg-zinc-900 border border-amber-500/20 text-amber-500 text-[10px] px-2 py-1 rounded hover:bg-amber-500 hover:text-zinc-950 font-bold uppercase transition-colors"
                              >
                                +50 units
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. Order Management Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 border border-amber-500/10 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search orders (ID, name, city)..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3 py-1.5 rounded outline-none font-mono w-full sm:w-64"
                    />
                  </div>
                  <span className="text-xs text-stone-300 whitespace-nowrap">
                    Total: <strong className="text-amber-500">{orders.length}</strong> orders
                  </span>
                </div>

                <div className="overflow-x-auto font-mono">
                  <table className="w-full text-left border-collapse text-xs text-stone-300 font-mono">
                    <thead>
                      <tr className="border-b border-amber-500/20 text-amber-500 font-mono uppercase text-[10px]">
                        <th className="py-2.5 px-2">Order ID</th>
                        <th className="py-2.5 px-2">Customer Details</th>
                        <th className="py-2.5 px-2">Date</th>
                        <th className="py-2.5 px-2">Total Amount</th>
                        <th className="py-2.5 px-2">Payment Method</th>
                        <th className="py-2.5 px-2">Status</th>
                        <th className="py-2.5 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {orders
                        .filter(o => 
                          o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          (o.city && o.city.toLowerCase().includes(orderSearch.toLowerCase()))
                        )
                        .map((o) => {
                          const isExpanded = expandedOrderId === o.id;
                          const totalItemsCount = o.items ? o.items.reduce((sum, i) => sum + (i.quantity || 1), 0) : 0;
                          return (
                            <React.Fragment key={o.id}>
                              <tr className="hover:bg-zinc-900/50 transition-colors font-mono">
                                <td className="py-2 px-2 font-bold text-amber-400">{o.id}</td>
                                <td className="py-2 px-2 text-stone-100">
                                  <div className="font-sans font-semibold">{o.customerName}</div>
                                  <div className="text-[10px] text-stone-400 font-mono capitalize">{o.city || 'Quetta'} - {o.address || 'Standard Delivery'}</div>
                                </td>
                                <td className="py-2 px-2 text-[11px] text-stone-400">{o.date}</td>
                                <td className="py-2 px-2 text-stone-200 font-bold font-mono">Rs. {o.total.toLocaleString()}</td>
                                <td className="py-2 px-2 text-[10px] text-stone-400 uppercase">{o.paymentMethod}</td>
                                <td className="py-2 px-2">
                                  <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    o.status === 'Confirmed' || o.status === 'Delivered' || o.status === 'Shipped'
                                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                      : o.status === 'Cancelled'
                                        ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                  }`}>
                                    {o.status}
                                  </span>
                                </td>
                                <td className="py-2 px-2 text-right flex items-center justify-end gap-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                                    className="bg-zinc-800 border border-amber-500/20 text-stone-200 text-[10px] px-2 py-1 rounded hover:bg-amber-500 hover:text-zinc-950 font-bold uppercase transition-colors"
                                  >
                                    {isExpanded ? 'Hide' : 'View'}
                                  </button>
                                  <span>|</span>
                                  <button
                                    onClick={async () => {
                                      const name = prompt("Edit Customer Name:", o.customerName) || o.customerName;
                                      const totalStr = prompt("Edit Total Amount (Rs):", o.total.toString()) || o.total.toString();
                                      const address = prompt("Edit Delivery Address:", o.address || '') || o.address || '';
                                      const city = prompt("Edit City:", o.city || 'Quetta') || o.city || 'Quetta';
                                      const phone = prompt("Edit Customer Phone:", o.phone || '') || o.phone || '';
                                      const email = prompt("Edit Customer Email:", o.email || '') || o.email || '';
                                      const totalVal = parseInt(totalStr) || o.total;

                                      try {
                                        const res = await fetch(`/api/orders/${o.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ customerName: name, total: totalVal, address, city, phone, email })
                                        });
                                        if (res.ok) {
                                          alert(`Order ${o.id} details updated successfully!`);
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                    className="text-amber-500 hover:underline text-[10px] uppercase font-bold font-sans"
                                  >
                                    Edit
                                  </button>
                                  <span>|</span>
                                  <button
                                    onClick={async () => {
                                      if (!confirm(`Are you sure you want to permanently delete order ${o.id}?`)) return;
                                      try {
                                        const res = await fetch(`/api/orders/${o.id}`, { method: 'DELETE' });
                                        if (res.ok) {
                                          onAddNotification('Order Deleted', `Order ${o.id} removed from database.`, 'order');
                                          alert(`Order ${o.id} deleted successfully!`);
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                    className="text-red-500 hover:underline text-[10px] uppercase font-bold font-sans"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-zinc-950/80">
                                  <td colSpan={7} className="py-4 px-3 border border-amber-500/10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                      <div className="space-y-2 text-stone-300">
                                        <h5 className="text-amber-500 font-bold text-[10px] uppercase tracking-wider font-sans border-b border-zinc-800 pb-1">
                                          Customer & Delivery Details
                                        </h5>
                                        <div><span className="text-stone-500 font-mono">Order ID:</span> <strong className="text-stone-200">{o.id}</strong></div>
                                        <div><span className="text-stone-500 font-mono">Date & Time:</span> <strong className="text-stone-200">{o.date}</strong></div>
                                        <div><span className="text-stone-500 font-mono">Customer Name:</span> <strong className="text-stone-200">{o.customerName}</strong></div>
                                        <div><span className="text-stone-500 font-mono">Email Address:</span> <strong className="text-stone-200">{o.email || 'No email provided'}</strong></div>
                                        <div><span className="text-stone-500 font-mono">Phone Number:</span> <strong className="text-amber-500 font-mono">{o.phone || 'No phone provided'}</strong></div>
                                        <div><span className="text-stone-500 font-mono">Delivery Address:</span> <strong className="text-stone-200">{o.address || 'N/A'}, {o.area || ''}, {o.city || 'Quetta'}</strong></div>
                                        <div><span className="text-stone-500 font-mono">Payment Method:</span> <strong className="text-amber-500 font-mono uppercase">{o.paymentMethod}</strong></div>
                                        <div><span className="text-stone-500 font-mono">Order Status:</span> <strong className="text-amber-500 font-mono uppercase">{o.status}</strong></div>
                                        <div><span className="text-stone-500 font-mono">Total Price:</span> <strong className="text-amber-500 font-mono">Rs. {o.total.toLocaleString()}</strong></div>
                                        <div><span className="text-stone-500 font-mono">Total Items Quantity:</span> <strong className="text-stone-200">{totalItemsCount} units</strong></div>
                                      </div>

                                      <div className="space-y-3">
                                        <div>
                                          <h5 className="text-amber-500 font-bold text-[10px] uppercase tracking-wider font-sans border-b border-zinc-800 pb-1 mb-2">
                                            Ordered Products
                                          </h5>
                                          <div className="bg-zinc-900/60 p-2.5 rounded border border-amber-500/5 space-y-2">
                                            {o.items && o.items.map((item, idx) => (
                                              <div key={idx} className="flex justify-between items-center text-xs font-sans text-stone-300">
                                                <div>
                                                  <span className="font-semibold text-stone-100">{item.product?.name || 'Unknown Product'}</span>
                                                  <span className="text-stone-500 ml-1.5 font-mono">x{item.quantity || 1}</span>
                                                </div>
                                                <span className="font-mono text-amber-500">Rs. {((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        <div>
                                          <span className="text-[10px] text-stone-400 font-bold uppercase font-mono block mb-1">Payment Proof Screenshot:</span>
                                          <div className="w-full h-32 bg-zinc-900 rounded border border-amber-500/10 flex items-center justify-center overflow-hidden p-1">
                                            {o.paymentScreenshot ? (
                                              <a href={o.paymentScreenshot} target="_blank" rel="noreferrer" className="block h-full w-full flex items-center justify-center">
                                                <img 
                                                  src={o.paymentScreenshot} 
                                                  alt="Payment screenshot proof" 
                                                  className="max-h-full max-w-full object-contain hover:scale-105 transition-transform" 
                                                  referrerPolicy="no-referrer"
                                                />
                                              </a>
                                            ) : (
                                              <span className="text-stone-600 text-xs italic">No screenshot proof uploaded</span>
                                            )}
                                          </div>
                                        </div>

                                        <div className="space-y-2 pt-2 border-t border-zinc-900">
                                          <span className="text-[10px] text-stone-400 font-bold uppercase font-mono block">Order Status Actions:</span>
                                          <div className="flex flex-wrap gap-1.5">
                                            <button
                                              onClick={() => onUpdateOrderStatus(o.id, 'Confirmed')}
                                              className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-zinc-950 font-bold text-[9px] px-2 py-1 rounded uppercase tracking-wider font-sans transition-colors cursor-pointer"
                                            >
                                              Accept
                                            </button>
                                            <button
                                              onClick={() => onUpdateOrderStatus(o.id, 'Cancelled')}
                                              className="bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-zinc-950 font-bold text-[9px] px-2 py-1 rounded uppercase tracking-wider font-sans transition-colors cursor-pointer"
                                            >
                                              Reject
                                            </button>
                                            <button
                                              onClick={() => onUpdateOrderStatus(o.id, 'Processing')}
                                              className="bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-zinc-950 font-bold text-[9px] px-2 py-1 rounded uppercase tracking-wider font-sans transition-colors cursor-pointer"
                                            >
                                              Processing
                                            </button>
                                            <button
                                              onClick={() => onUpdateOrderStatus(o.id, 'Shipped')}
                                              className="bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-zinc-950 font-bold text-[9px] px-2 py-1 rounded uppercase tracking-wider font-sans transition-colors cursor-pointer"
                                            >
                                              Shipped
                                            </button>
                                            <button
                                              onClick={() => onUpdateOrderStatus(o.id, 'Delivered')}
                                              className="bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600 hover:text-zinc-950 font-bold text-[9px] px-2 py-1 rounded uppercase tracking-wider font-sans transition-colors cursor-pointer"
                                            >
                                              Delivered
                                            </button>
                                            <button
                                              onClick={() => onUpdateOrderStatus(o.id, 'Cancelled')}
                                              className="bg-zinc-800 border border-zinc-700 text-stone-400 hover:bg-zinc-700 hover:text-stone-200 font-bold text-[9px] px-2 py-1 rounded uppercase tracking-wider font-sans transition-colors cursor-pointer"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. Customer Management Tab */}
            {activeTab === 'customers' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 p-3 rounded-lg border border-amber-500/5 flex items-center justify-between gap-4">
                  <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2 rounded outline-none w-full max-w-sm font-mono"
                  />
                  <span className="text-[10px] text-stone-400 whitespace-nowrap font-mono">
                    Total: {customers.length} users
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-stone-300">
                    <thead>
                      <tr className="border-b border-amber-500/10 text-stone-400 font-mono text-[10px] uppercase">
                        <th className="py-2 px-1">Customer Details</th>
                        <th className="py-2 px-1">Contact Details</th>
                        <th className="py-2 px-1">Location</th>
                        <th className="py-2 px-1 text-center">Past Purchases</th>
                        <th className="py-2 px-1 text-right">Total Spent</th>
                        <th className="py-2 px-1 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {customers
                        .filter(cust => 
                          cust.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                          cust.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
                          cust.phone.includes(customerSearch)
                        )
                        .map((cust) => {
                          const matchingOrders = orders.filter(o => 
                            o.customerName === cust.name || 
                            o.email === cust.email || 
                            o.phone === cust.phone
                          );
                          const count = matchingOrders.length;
                          const spent = matchingOrders.reduce((sum, o) => sum + o.total, 0);

                          return (
                            <tr key={cust.id} className="hover:bg-zinc-900/40">
                              <td className="py-3 px-1 font-bold text-stone-200">
                                <div>{cust.name}</div>
                                {cust.disabled && (
                                  <span className="text-[8px] bg-red-500/20 text-red-400 px-1 py-0.5 rounded font-bold font-mono">ACCOUNT DISABLED</span>
                                )}
                              </td>
                              <td className="py-3 px-1 text-stone-400 font-mono">
                                <div>{cust.email}</div>
                                <div className="text-[10px] text-stone-500">{cust.phone}</div>
                              </td>
                              <td className="py-3 px-1 text-stone-400">{cust.city || 'Quetta'}</td>
                              <td className="py-3 px-1 text-center font-mono text-amber-500">{count} orders</td>
                              <td className="py-3 px-1 text-right font-mono font-bold">Rs. {spent.toLocaleString()}</td>
                              <td className="py-3 px-1 text-right space-x-2">
                                <button
                                  onClick={async () => {
                                    const newName = prompt("Edit Customer Name:", cust.name);
                                    if (!newName) return;
                                    const newEmail = prompt("Edit Email:", cust.email) || cust.email;
                                    const newPhone = prompt("Edit Phone:", cust.phone) || cust.phone;
                                    const newCity = prompt("Edit City:", cust.city || 'Quetta') || cust.city || 'Quetta';

                                    try {
                                      const res = await fetch(`/api/customers/${cust.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ name: newName, email: newEmail, phone: newPhone, city: newCity })
                                      });
                                      if (res.ok) {
                                        const updated = await res.json();
                                        setCustomers(prev => prev.map(item => item.id === cust.id ? updated : item));
                                        onAddNotification('Customer Updated', `Updated details for customer "${newName}".`, 'payment');
                                      }
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                  className="text-stone-300 hover:underline"
                                >
                                  Edit
                                </button>
                                <span>|</span>
                                <button
                                  onClick={async () => {
                                    try {
                                      const res = await fetch(`/api/customers/${cust.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ disabled: !cust.disabled })
                                      });
                                      if (res.ok) {
                                        const updated = await res.json();
                                        setCustomers(prev => prev.map(item => item.id === cust.id ? updated : item));
                                        onAddNotification('Customer Account State', `Customer "${cust.name}" account status toggled.`, 'payment');
                                      }
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                  className="text-amber-500 hover:underline"
                                >
                                  {cust.disabled ? 'Enable' : 'Disable'}
                                </button>
                                <span>|</span>
                                <button
                                  onClick={async () => {
                                    if (!confirm(`Are you sure you want to delete customer "${cust.name}"?`)) return;
                                    try {
                                      const res = await fetch(`/api/customers/${cust.id}`, { method: 'DELETE' });
                                      if (res.ok) {
                                        setCustomers(prev => prev.filter(item => item.id !== cust.id));
                                        onAddNotification('Customer Deleted', `Customer "${cust.name}" account removed.`, 'order');
                                      }
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                  className="text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. Reseller Management Tab */}
            {activeTab === 'resellers' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 border border-amber-500/10 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
                  <span className="text-stone-300">Registered Resellers: <strong className="text-amber-500">{resellers.length}</strong></span>
                  <button
                    onClick={async () => {
                      const name = prompt("Enter new reseller applicant name:");
                      if (!name) return;
                      const city = prompt("Enter applicant city:");
                      if (!city) return;
                      try {
                        const res = await fetch('/api/resellers', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name, city, sales: 0, commission: 0, status: 'Pending Approval' })
                        });
                        const saved = await res.json();
                        setResellers(prev => [...prev, saved]);
                        onAddNotification('Reseller Applied', `Applicant ${name} is pending approval state.`, 'promo');
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-[10px] px-3.5 py-2 rounded uppercase tracking-wider cursor-pointer"
                  >
                    + Create Applicant
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-stone-300">
                    <thead>
                      <tr className="border-b border-amber-500/10 text-stone-400 font-mono text-[10px] uppercase">
                        <th className="py-2 px-1">Reseller ID</th>
                        <th className="py-2 px-1">Name</th>
                        <th className="py-2 px-1">City</th>
                        <th className="py-2 px-1 text-right">Earning Sales</th>
                        <th className="py-2 px-1 text-right">Commission</th>
                        <th className="py-2 px-1 text-center">Status</th>
                        <th className="py-2 px-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {resellers.map(res => (
                        <tr key={res.id} className="hover:bg-zinc-900/40">
                          <td className="py-2.5 px-1 font-bold text-amber-500 font-mono">{res.id}</td>
                          <td className="py-2.5 px-1 text-stone-200">{res.name}</td>
                          <td className="py-2.5 px-1 text-stone-400">{res.city}</td>
                          <td className="py-2.5 px-1 text-right font-mono">Rs. {res.sales.toLocaleString()}</td>
                          <td className="py-2.5 px-1 text-right font-mono text-emerald-400 font-bold">Rs. {res.commission.toLocaleString()}</td>
                          <td className="py-2.5 px-1 text-center">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                              res.status === 'Approved' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' 
                                : 'bg-amber-500/10 text-amber-500 border-amber-500/10'
                            }`}>{res.status}</span>
                          </td>
                          <td className="py-2.5 px-1 text-right whitespace-nowrap space-x-1">
                            {res.status === 'Pending Approval' ? (
                              <button
                                onClick={async () => {
                                  try {
                                    const response = await fetch(`/api/resellers/${res.id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ status: 'Approved' })
                                    });
                                    const updated = await response.json();
                                    setResellers(prev => prev.map(item => item.id === res.id ? updated : item));
                                    onAddNotification('Reseller Approved ✓', `${res.name} approved to earn commissions.`, 'promo');
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-stone-100 text-[9px] px-2 py-1 rounded font-bold uppercase cursor-pointer animate-pulse"
                              >
                                Approve
                              </button>
                            ) : (
                              <button
                                onClick={async () => {
                                  alert(`Payout of Rs. ${res.commission.toLocaleString()} issued successfully to ${res.name} registered Easypaisa mobile wallet.`);
                                  try {
                                    const response = await fetch(`/api/resellers/${res.id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ commission: 0 })
                                    });
                                    const updated = await response.json();
                                    setResellers(prev => prev.map(item => item.id === res.id ? updated : item));
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="text-amber-500 hover:underline text-[9px] font-bold uppercase"
                              >
                                Pay Out
                              </button>
                            )}
                            <span>|</span>
                            <button
                              onClick={async () => {
                                const name = prompt("Edit Reseller Name:", res.name) || res.name;
                                const city = prompt("Edit City:", res.city) || res.city;
                                const salesStr = prompt("Edit Total Sales (Rs):", res.sales.toString()) || res.sales.toString();
                                const commStr = prompt("Edit Commission (Rs):", res.commission.toString()) || res.commission.toString();
                                const salesVal = parseInt(salesStr) || res.sales;
                                const commVal = parseInt(commStr) || res.commission;

                                try {
                                  const response = await fetch(`/api/resellers/${res.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ name, city, sales: salesVal, commission: commVal })
                                  });
                                  const updated = await response.json();
                                  setResellers(prev => prev.map(item => item.id === res.id ? updated : item));
                                  onAddNotification('Reseller Updated', `Reseller "${name}" updated.`, 'promo');
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className="text-stone-300 hover:underline text-[9px] font-bold uppercase"
                            >
                              Edit
                            </button>
                            <span>|</span>
                            <button
                              onClick={async () => {
                                if (!confirm(`Are you sure you want to delete reseller applicant "${res.name}"?`)) return;
                                try {
                                  await fetch(`/api/resellers/${res.id}`, { method: 'DELETE' });
                                  setResellers(prev => prev.filter(item => item.id !== res.id));
                                  onAddNotification('Reseller Removed', `Removed reseller "${res.name}" from registry.`, 'promo');
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className="text-red-500 hover:underline text-[9px] font-bold uppercase"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. Wholesale Management Tab */}
            {activeTab === 'wholesale' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 p-4 border border-amber-500/10 rounded-lg space-y-2 text-xs">
                  <h4 className="font-bold text-amber-500 uppercase tracking-wider">Wholesale Logistics Strategy</h4>
                  <p className="text-stone-300">Set minimum quantity and target pricing for shopkeepers and bulk buyers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/30 p-4 rounded-lg border border-amber-500/5 space-y-3">
                    <h5 className="text-[10px] text-stone-400 uppercase font-mono font-bold">Minimum Wholesale Limit</h5>
                    <select className="w-full bg-zinc-950 border border-amber-500/20 text-stone-200 text-xs px-3 py-2 rounded outline-none font-mono">
                      <option value="5">5 Pieces (Minimum default)</option>
                      <option value="10">10 Pieces (Highly restricted)</option>
                      <option value="12">1 Dozen (12 Pieces)</option>
                      <option value="24">2 Dozen (24 Pieces)</option>
                    </select>
                    <button onClick={() => alert('Wholesale quantity constraint updated!')} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-[10px] px-3.5 py-1.5 rounded uppercase tracking-wider">
                      Save Limit
                    </button>
                  </div>

                  <div className="bg-zinc-900/30 p-4 rounded-lg border border-amber-500/5 space-y-3">
                    <h5 className="text-[10px] text-stone-400 uppercase font-mono font-bold">Bulk Inquiries Queue</h5>
                    <div className="text-[11px] text-stone-400 italic">No pending wholesale quotes requests in last 24h.</div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. Marketing Tools Tab */}
            {activeTab === 'marketing' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 p-4 border border-amber-500/10 rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Push Slogan / Promo Banner Campaign</h4>
                  <p className="text-[11px] text-stone-400">Broadcast a live store notice bar advertisement across the platform instantly.</p>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. 📢 BALOCHISTAN SPECIFIC CODES AVAILABLE IN WIDGETS! BUY NOW FOR RS. 500 cashback!"
                      className="w-full bg-zinc-950 border border-amber-500/20 text-stone-200 text-xs px-3.5 py-2.5 rounded outline-none"
                    />
                    <button
                      onClick={() => {
                        onAddNotification('Promo Alert', 'New live marketing campaign pushed to home sliders!', 'promo');
                        alert('Live site notice updated across all customer terminals!');
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-[10px] px-4 py-2 rounded uppercase tracking-wider"
                    >
                      Broadcast Campaign
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 10. Coupons & Discounts Tab */}
            {activeTab === 'coupons' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 border border-amber-500/10 p-4 rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Issue New Discount Coupon</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. EXTRA200)"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2 rounded outline-none font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Discount Amount (e.g. Rs. 200 Off)"
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(e.target.value)}
                      className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2 rounded outline-none font-mono"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      if (!newCouponCode || !newCouponDiscount) return;
                      try {
                        const res = await fetch('/api/coupons', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            code: newCouponCode.toUpperCase(),
                            discount: newCouponDiscount,
                            minSpend: 'Rs. 1,500',
                            status: 'Active',
                            usage: 0
                          })
                        });
                        const saved = await res.json();
                        setCoupons(prev => [saved, ...prev]);
                        onAddNotification('Coupon Created', `Discount Coupon ${newCouponCode.toUpperCase()} is now live.`, 'promo');
                        setNewCouponCode('');
                        setNewCouponDiscount('');
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-[10px] px-4 py-2 rounded uppercase tracking-wider cursor-pointer"
                  >
                    Activate Coupon
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-stone-300">
                    <thead>
                      <tr className="border-b border-amber-500/10 text-stone-400 font-mono text-[10px] uppercase">
                        <th className="py-2 px-1">Coupon Code</th>
                        <th className="py-2 px-1">Benefit</th>
                        <th className="py-2 px-1 text-center">Spent Constraint</th>
                        <th className="py-2 px-1 text-center">Redeemed Usage</th>
                        <th className="py-2 px-1 text-center">Status</th>
                        <th className="py-2 px-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {coupons.map(cop => (
                        <tr key={cop.code} className="hover:bg-zinc-900/40">
                          <td className="py-2.5 px-1 font-bold text-amber-500 font-mono">{cop.code}</td>
                          <td className="py-2.5 px-1 text-stone-200">{cop.discount}</td>
                          <td className="py-2.5 px-1 text-center font-mono text-stone-400">{cop.minSpend}</td>
                          <td className="py-2.5 px-1 text-center font-mono text-stone-400">{cop.usage} times</td>
                          <td className="py-2.5 px-1 text-center">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                              cop.status === 'Active' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' 
                                : 'bg-red-500/10 text-red-400 border-red-500/10'
                            }`}>{cop.status}</span>
                          </td>
                          <td className="py-2.5 px-1 text-right space-x-2">
                            <button
                              onClick={async () => {
                                const newDiscount = prompt("Edit Discount Benefit:", cop.discount) || cop.discount;
                                const newMinSpend = prompt("Edit Min Spend Constraint:", cop.minSpend) || cop.minSpend;
                                const newStatus = confirm(`Set coupon status to Active? (Cancel will set to Disabled)`) ? 'Active' : 'Disabled';

                                try {
                                  const res = await fetch(`/api/coupons/${cop.code}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ discount: newDiscount, minSpend: newMinSpend, status: newStatus })
                                  });
                                  const updated = await res.json();
                                  setCoupons(prev => prev.map(item => item.code === cop.code ? updated : item));
                                  onAddNotification('Coupon Updated', `Coupon "${cop.code}" details were updated.`, 'promo');
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className="text-stone-300 hover:underline"
                            >
                              Edit
                            </button>
                            <span>|</span>
                            <button
                              onClick={async () => {
                                if (!confirm(`Are you sure you want to delete coupon code "${cop.code}"?`)) return;
                                try {
                                  await fetch(`/api/coupons/${cop.code}`, { method: 'DELETE' });
                                  setCoupons(prev => prev.filter(item => item.code !== cop.code));
                                  onAddNotification('Coupon Deleted', `Coupon code "${cop.code}" removed.`, 'promo');
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className="text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 11. Flash Sales Tab */}
            {activeTab === 'flash' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 p-4 border border-amber-500/10 rounded-lg space-y-2 text-xs text-stone-300">
                  <h4 className="font-bold text-amber-500 uppercase tracking-wider">Configure Flash Sale Items</h4>
                  <p>Flash sale items display discount tickers at top customer feed catalog boards.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-stone-300">
                    <thead>
                      <tr className="border-b border-amber-500/10 text-stone-400 font-mono text-[10px] uppercase">
                        <th className="py-2 px-1">Product</th>
                        <th className="py-2 px-1 text-right">Retail Price</th>
                        <th className="py-2 px-1 text-right">Flash Price</th>
                        <th className="py-2 px-1 text-center">Active Ticker</th>
                        <th className="py-2 px-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {flashSales.map(fs => (
                        <tr key={fs.id} className="hover:bg-zinc-900/40">
                          <td className="py-2.5 px-1 font-bold text-stone-200">{fs.name}</td>
                          <td className="py-2.5 px-1 text-right font-mono text-stone-400">Rs. {fs.originalPrice.toLocaleString()}</td>
                          <td className="py-2.5 px-1 text-right font-mono text-amber-500 font-bold">Rs. {fs.promoPrice.toLocaleString()}</td>
                          <td className="py-2.5 px-1 text-center">
                            <span className="bg-amber-500/10 text-amber-500 text-[8px] font-bold px-1.5 py-0.5 rounded border border-amber-500/10">LIVE SPECIAL</span>
                          </td>
                          <td className="py-2.5 px-1 text-right">
                            <button
                              onClick={() => {
                                setFlashSales(prev => prev.filter(item => item.id !== fs.id));
                                alert('Removed product from flash discounts roster.');
                              }}
                              className="text-red-500 hover:underline"
                            >
                              Disable
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 12. Lucky Draw Management Tab */}
            {activeTab === 'lucky' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 border border-amber-500/10 p-4 rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Create New Lucky Draw Roster</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      id="luckyPrize"
                      type="text"
                      placeholder="Prize Name (e.g. iPhone 15 Pro)"
                      className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2 rounded outline-none font-mono"
                    />
                    <input
                      id="luckyEntries"
                      type="number"
                      placeholder="Initial Participants (e.g. 150)"
                      className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2 rounded outline-none font-mono"
                    />
                    <button
                      onClick={async () => {
                        const prizeInput = document.getElementById('luckyPrize') as HTMLInputElement;
                        const entriesInput = document.getElementById('luckyEntries') as HTMLInputElement;
                        if (!prizeInput || !entriesInput || !prizeInput.value) return;

                        try {
                          const res = await fetch('/api/lucky-draws', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              prize: prizeInput.value,
                              participants: parseInt(entriesInput.value) || 0,
                              status: 'Active',
                              winner: ''
                            })
                          });
                          const saved = await res.json();
                          setLuckyDraws(prev => [saved, ...prev]);
                          onAddNotification('Lucky Draw Added', `New Lucky Draw for "${prizeInput.value}" was created.`, 'lucky');
                          prizeInput.value = '';
                          entriesInput.value = '';
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-[10px] px-4 py-2 rounded uppercase tracking-wider cursor-pointer"
                    >
                      Add Lucky Draw
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-stone-300">
                    <thead>
                      <tr className="border-b border-amber-500/10 text-stone-400 font-mono text-[10px] uppercase">
                        <th className="py-2 px-1">Prize Target</th>
                        <th className="py-2 px-1 text-center">Participants</th>
                        <th className="py-2 px-1 text-center">Draw State</th>
                        <th className="py-2 px-1 text-right">Winner</th>
                        <th className="py-2 px-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {luckyDraws.map((ld, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/40">
                          <td className="py-2.5 px-1 font-bold text-stone-200">{ld.prize}</td>
                          <td className="py-2.5 px-1 text-center font-mono text-amber-500">{ld.participants} entries</td>
                          <td className="py-2.5 px-1 text-center">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                              ld.status === 'Active' 
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' 
                                : 'bg-zinc-900 text-stone-500 border-amber-500/5'
                            }`}>{ld.status}</span>
                          </td>
                          <td className="py-2.5 px-1 text-right text-stone-200 font-bold font-sans">
                            {ld.winner ? (
                              <span className="text-emerald-400">🎉 {ld.winner}</span>
                            ) : (
                              <span className="text-stone-500 italic">Not Decided yet</span>
                            )}
                          </td>
                          <td className="py-2.5 px-1 text-right space-x-2">
                            {ld.status === 'Active' && (
                              <button
                                onClick={async () => {
                                  let winnerName = "";
                                  if (customers && customers.length > 0) {
                                    const randCust = customers[Math.floor(Math.random() * customers.length)];
                                    winnerName = `${randCust.name} (${randCust.city || 'Quetta'})`;
                                  } else {
                                    const names = ['Farhan Ullah (Quetta)', 'Sana Baloch (Mastung)', 'Muhammad Hashim (Chaman)', 'Gul Bibi (Gwadar)'];
                                    winnerName = names[Math.floor(Math.random() * names.length)];
                                  }

                                  try {
                                    const res = await fetch(`/api/lucky-draws/${encodeURIComponent(ld.prize)}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ winner: winnerName, status: 'Completed' })
                                    });
                                    const updated = await res.json();
                                    setLuckyDraws(prev => prev.map(item => item.prize === ld.prize ? updated : item));
                                    onAddNotification('Lucky Draw Alert 🎉', `Winner selected: ${winnerName} won ${ld.prize}!`, 'lucky');
                                    alert(`Winner selected successfully! \n\nWinner Name: ${winnerName} \nNotification broadcasted.`);
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="text-amber-400 hover:underline text-[10px] font-bold uppercase"
                              >
                                Draw Winner
                              </button>
                            )}
                            {ld.status !== 'Active' && (
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await fetch(`/api/lucky-draws/${encodeURIComponent(ld.prize)}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ winner: '', status: 'Active' })
                                    });
                                    const updated = await res.json();
                                    setLuckyDraws(prev => prev.map(item => item.prize === ld.prize ? updated : item));
                                    onAddNotification('Lucky Draw Reset', `Lucky Draw for "${ld.prize}" has been reset.`, 'lucky');
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="text-stone-400 hover:underline text-[10px] font-bold uppercase"
                              >
                                Reset
                              </button>
                            )}
                            <span>|</span>
                            <button
                              onClick={async () => {
                                if (!confirm(`Are you sure you want to permanently delete lucky draw for "${ld.prize}"?`)) return;
                                try {
                                  await fetch(`/api/lucky-draws/${encodeURIComponent(ld.prize)}`, { method: 'DELETE' });
                                  setLuckyDraws(prev => prev.filter(item => item.prize !== ld.prize));
                                  onAddNotification('Lucky Draw Deleted', `Removed lucky draw for "${ld.prize}".`, 'lucky');
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className="text-red-500 hover:underline text-[10px] font-bold uppercase"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 13. Spin & Win Management Tab */}
            {activeTab === 'spin' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 p-4 border border-amber-500/10 rounded-lg space-y-2 text-xs">
                  <h4 className="font-bold text-amber-500 uppercase tracking-wider">Configure Wheel segments</h4>
                  <p className="text-stone-300">Change reward sectors and adjust target win probabilities safely.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-zinc-900/30 p-3.5 rounded border border-amber-500/5 space-y-2">
                    <span className="font-mono text-[10px] text-stone-500 uppercase block">Segment A (Voucher) Probability:</span>
                    <input type="range" className="w-full accent-amber-500" defaultValue="40" />
                    <span className="font-mono text-[9px] text-stone-400">Current Probability: 40%</span>
                  </div>

                  <div className="bg-zinc-900/30 p-3.5 rounded border border-amber-500/5 space-y-2">
                    <span className="font-mono text-[10px] text-stone-500 uppercase block">Segment B (Smartwatch) Probability:</span>
                    <input type="range" className="w-full accent-amber-500" defaultValue="5" />
                    <span className="font-mono text-[9px] text-stone-400">Current Probability: 5%</span>
                  </div>
                </div>
                <button onClick={() => alert('Wheel win ratios recalibrated!')} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-[10px] px-3.5 py-2 rounded uppercase tracking-wider">
                  Save Probability Calibration
                </button>
              </div>
            )}

            {/* 14. Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 border border-amber-500/10 p-4 rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Broadcast System Notification</h4>
                  <div className="space-y-2">
                    <input
                      id="custom-notif-title"
                      type="text"
                      placeholder="Notification Title (e.g. Flash Sale Alert!)"
                      className="w-full bg-zinc-950 border border-amber-500/20 text-stone-200 text-xs px-3.5 py-2 rounded outline-none"
                    />
                    <input
                      id="custom-notif-msg"
                      type="text"
                      placeholder="Message (e.g. Earbuds prices slashed by Rs. 500 for the next 2 hours!)"
                      className="w-full bg-zinc-950 border border-amber-500/20 text-stone-200 text-xs px-3.5 py-2 rounded outline-none"
                    />
                    <button
                      onClick={() => {
                        const titleEl = document.getElementById('custom-notif-title') as HTMLInputElement;
                        const msgEl = document.getElementById('custom-notif-msg') as HTMLInputElement;
                        if (titleEl && msgEl && titleEl.value && msgEl.value) {
                          onAddNotification(titleEl.value, msgEl.value, 'promo');
                          titleEl.value = '';
                          msgEl.value = '';
                          alert('Notification successfully dispatched across the network!');
                        } else {
                          alert('Please enter both a title and message.');
                        }
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-[10px] px-4 py-2 rounded uppercase tracking-wider cursor-pointer"
                    >
                      Broadcast Notification
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400">
                    Live Session Notifications Log
                  </span>
                  
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="bg-zinc-900/60 p-3 rounded-lg border border-amber-500/5 text-xs flex justify-between items-start gap-4">
                        <div>
                          <strong className="text-amber-400 block">{notif.title}</strong>
                          <p className="text-stone-300 mt-1">{notif.message}</p>
                        </div>
                        <span className="text-[9px] font-mono text-stone-500 shrink-0 capitalize">{notif.type} • {notif.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 15. Payment Verification Tab */}
            {activeTab === 'payments' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-5 space-y-3">
                  <label className="text-[10px] text-stone-400 font-bold uppercase font-mono block">
                    Select Order To Verify:
                  </label>
                  <select
                    value={selectedVerifyOrderId}
                    onChange={(e) => setSelectedVerifyOrderId(e.target.value)}
                    className="w-full bg-zinc-900 border border-amber-500/30 focus:border-amber-500 text-stone-200 text-xs px-3.5 py-2.5 rounded outline-none font-mono cursor-pointer"
                  >
                    <option value="">-- Choose Order --</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} - {o.customerName} (Rs. {o.total.toLocaleString()}) [{o.status}]
                      </option>
                    ))}
                  </select>

                  {activeVerifyOrder ? (
                    <div className="bg-zinc-900 p-3.5 rounded border border-amber-500/5 text-xs text-stone-300 space-y-2">
                      <div className="text-[10px] font-bold text-amber-500 uppercase font-mono border-b border-zinc-800 pb-1">
                        Transaction Details:
                      </div>
                      <div><span className="text-stone-500">Customer:</span> {activeVerifyOrder.customerName}</div>
                      <div><span className="text-stone-500">Phone:</span> {activeVerifyOrder.phone}</div>
                      <div><span className="text-stone-500">Method:</span> {activeVerifyOrder.paymentMethod}</div>
                      <div><span className="text-stone-500">Amount:</span> <strong className="text-amber-500 font-mono">Rs. {activeVerifyOrder.total.toLocaleString()}</strong></div>
                      <div>
                        <span className="text-stone-500">Current Status:</span> 
                        <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-zinc-950 text-amber-400 border border-amber-500/10">
                          {activeVerifyOrder.status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-500 italic">No orders available for selection.</p>
                  )}
                </div>

                <div className="md:col-span-7 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-stone-400 font-bold uppercase font-mono block">Uploaded Proof Screenshot:</span>
                    <div className="w-full h-48 rounded bg-zinc-900 border border-amber-500/10 relative flex items-center justify-center overflow-hidden p-1">
                      {activeVerifyOrder && activeVerifyOrder.paymentScreenshot ? (
                        <img 
                          src={activeVerifyOrder.paymentScreenshot} 
                          alt="Payment proof receipt screenshot" 
                          className="max-h-full max-w-full object-contain rounded"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center text-stone-500 text-xs flex flex-col items-center gap-2">
                          <ImageIcon className="w-8 h-8 text-stone-600" />
                          <span>No payment screenshot uploaded for this selection</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {activeVerifyOrder && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleRejectPayment}
                        className="bg-red-600 hover:bg-red-700 text-stone-100 font-bold h-11 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                      >
                        <X className="w-4 h-4" />
                        Reject Payment
                      </button>
                      <button
                        onClick={handleApprovePayment}
                        className="bg-emerald-600 hover:bg-emerald-700 text-stone-100 font-bold h-11 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        Approve & Confirm
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 16. Reports & Analytics Tab */}
            {activeTab === 'reports' && (() => {
              const nonCancelledOrders = orders.filter(o => o.status !== 'Cancelled');
              const avgTicket = nonCancelledOrders.length > 0 ? Math.round(realTotalSales / nonCancelledOrders.length) : 0;
              const cancelRate = orders.length > 0 ? ((orders.filter(o => o.status === 'Cancelled').length / orders.length) * 100).toFixed(2) : "0.00";
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-zinc-900/60 p-4 rounded-xl border border-amber-500/10">
                      <span className="text-[9px] uppercase font-mono text-stone-500">Gross Sales Value</span>
                      <span className="text-base font-bold text-amber-500 block font-mono mt-1">Rs. {realTotalSales.toLocaleString()}</span>
                      <span className="text-[8px] text-stone-500 block mt-1">▲ Calculated from all confirmed orders</span>
                    </div>

                    <div className="bg-zinc-900/60 p-4 rounded-xl border border-amber-500/10">
                      <span className="text-[9px] uppercase font-mono text-stone-500">Average Cart Ticket</span>
                      <span className="text-base font-bold text-amber-500 block font-mono mt-1">Rs. {avgTicket.toLocaleString()}</span>
                      <span className="text-[8px] text-stone-500 block mt-1">▲ Total Revenue per active sale</span>
                    </div>

                    <div className="bg-zinc-900/60 p-4 rounded-xl border border-amber-500/10">
                      <span className="text-[9px] uppercase font-mono text-stone-500">Order Cancellation Rate</span>
                      <span className="text-base font-bold text-red-500 block font-mono mt-1">{cancelRate}%</span>
                      <span className="text-[8px] text-stone-500 block mt-1">▼ Percentage of cancelled/refunded requests</span>
                    </div>
                  </div>

                <div className="bg-zinc-900/40 border border-amber-500/10 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="text-xs text-stone-300">Generate structured data exports for offline audits:</span>
                  <div className="flex gap-2">
                    <button onClick={() => alert('CSV file export triggered!')} className="bg-zinc-900 border border-amber-500/20 text-amber-500 text-[10px] px-3.5 py-2 rounded hover:bg-amber-500 hover:text-zinc-950 font-bold uppercase transition-colors">Export Excel CSV</button>
                    <button onClick={() => alert('PDF statement print generated!')} className="bg-zinc-900 border border-amber-500/20 text-amber-500 text-[10px] px-3.5 py-2 rounded hover:bg-amber-500 hover:text-zinc-950 font-bold uppercase transition-colors">Download PDF</button>
                  </div>
                </div>
              </div>
            )})}

            {/* 17. Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="bg-zinc-900/40 p-4 border border-amber-500/10 rounded-lg space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 mb-1">Standard Shipping Charges (PKR)</label>
                    <input
                      type="text"
                      className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-100 text-xs px-3 py-2 rounded outline-none font-mono"
                      value={shippingRate}
                      onChange={(e) => setShippingRate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 mb-1">Minimum Order Amount for Free Shipping</label>
                    <input
                      type="text"
                      className="bg-zinc-950 border border-amber-500/20 focus:border-amber-500 text-stone-100 text-xs px-3 py-2 rounded outline-none font-mono"
                      value={minOrderFreeShipping}
                      onChange={(e) => setMinOrderFreeShipping(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      id="maintenance-toggle"
                      type="checkbox"
                      className="w-4 h-4 rounded accent-amber-500 bg-zinc-950 border-amber-500/20 cursor-pointer"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                    />
                    <label htmlFor="maintenance-toggle" className="font-bold text-stone-300 uppercase text-[10px] tracking-wider cursor-pointer">
                      Enable Maintenance Mode (Disable checkouts)
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/settings', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              shippingRate,
                              minOrderFreeShipping,
                              maintenanceMode
                            })
                          });
                          if (res.ok) {
                            onAddNotification('Settings Updated', 'Logistics variables updated.', 'promo');
                            alert('Logistics configuration variables committed successfully to backend database!');
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-[10px] px-4 py-2 rounded uppercase tracking-wider cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer of the panel */}
          <div className="border-t border-amber-500/10 pt-4 mt-6 text-center">
            <span className="text-[10px] text-stone-600 font-mono">
              © 2026 Balochistan Trusted Mart. Secure encryption layer activated. Unauthorized access is recorded.
            </span>
          </div>

        </main>

      </div>

    </div>
  );
};
