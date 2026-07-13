import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = process.env.VERCEL
  ? path.join("/tmp", "database.json")
  : path.join(process.cwd(), "database.json");

// Middleware
app.use(express.json());

// Type Declarations matching types.ts
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  stock: string;
  description: string;
  deliveryEstimate?: string;
  inStock: boolean;
  brand?: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  paymentScreenshot?: string;
  status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  verificationNotes?: string;
  refundRequested?: boolean;
  timestamp?: number;
}

interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  time: string;
  timestamp: string;
  type: "order" | "payment" | "lucky" | "product" | "promo" | "admin";
  read: boolean;
  relatedOrderId?: string;
}

interface Review {
  id: string;
  rating: number;
  author: string;
  text: string;
  date: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  disabled: boolean;
  createdAt: string;
}

interface Coupon {
  code: string;
  discount: string;
  minSpend: string;
  status: string;
  usage: number;
}

interface Reseller {
  id: string;
  name: string;
  city: string;
  sales: number;
  commission: number;
  status: string;
}

interface LuckyDraw {
  prize: string;
  participants: number;
  status: string;
  winner?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  resetToken?: string;
  resetTokenExpiry?: string;
  createdAt: string;
  rewardsPoints: number;
  lastSpinTimestamp?: string;
}

interface Session {
  token: string;
  userId: string;
  email: string;
  name: string;
  expiresAt: string;
}

interface SpinResult {
  id: string;
  userId: string;
  email: string;
  prize: string;
  timestamp: string;
  lastSpinTimestamp?: string;
}

interface LuckyDrawEntry {
  id: string;
  userId: string;
  email: string;
  orderId: string;
  ticketId: string;
  timestamp: string;
}

interface Reward {
  id: string;
  userId: string;
  email: string;
  points: number;
  description: string;
  timestamp: string;
}

interface DailyActivity {
  id: string;
  userId: string;
  email: string;
  date: string;
  hasSpun: boolean;
  hasEnteredLuckyDraw: boolean;
  lastActivityAt: string;
}

interface DatabaseSchema {
  products: Product[];
  categories: { id: string; name: string; icon: string; count?: number; order?: number }[];
  orders: Order[];
  notifications: Notification[];
  reviews: Review[];
  customers: Customer[];
  coupons: Coupon[];
  resellers: Reseller[];
  luckyDraws: LuckyDraw[];
  settings: {
    shippingRate: string;
    minOrderFreeShipping: string;
    maintenanceMode: boolean;
  };
  users?: User[];
  sessions?: Session[];
  spinResults?: SpinResult[];
  luckyDrawEntries?: LuckyDrawEntry[];
  rewards?: Reward[];
  dailyActivity?: DailyActivity[];
}

// Initial seed data fallback
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Bluetooth Earbuds',
    price: 2299,
    originalPrice: 2999,
    discount: '-23%',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1588449668338-d1517689ee66?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1590658006821-04f4008d5717?w=500&auto=format&fit=crop&q=60'
    ],
    category: 'electronics',
    rating: 5,
    stock: '50',
    description: 'High quality sound, long battery life and comfortable fit. Compatible with all Bluetooth devices. Features deep bass, passive noise cancellation, and touch controls with seamless auto-pairing.',
    deliveryEstimate: '2 - 4 Working Days',
    inStock: true,
    brand: 'Audionic'
  },
  {
    id: 'p2',
    name: 'Smart Watch',
    price: 3399,
    originalPrice: 3999,
    discount: '-15%',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&auto=format&fit=crop&q=60'
    ],
    category: 'watches',
    rating: 4.8,
    stock: '35',
    description: 'Track your health and activities with this elegant smart watch. Features blood oxygen monitoring, heart rate detection, custom watch faces, and water resistance.',
    deliveryEstimate: '2 - 3 Working Days',
    inStock: true,
    brand: 'Mi'
  },
  {
    id: 'p3',
    name: "Men's Stylish Jacket",
    price: 2399,
    originalPrice: 2999,
    discount: '-20%',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60'
    ],
    category: 'fashion',
    rating: 4.7,
    stock: '20',
    description: 'Stay warm and fashionable with this premium quality leather-finish jacket. Crafted with heavy-duty zippers, multiple utility pockets, and warm inner fleece lining.',
    deliveryEstimate: '3 - 5 Working Days',
    inStock: true,
    brand: 'Outfitter'
  },
  {
    id: 'p4',
    name: 'Casual Sneakers',
    price: 2699,
    originalPrice: 3499,
    discount: '-23%',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60'
    ],
    category: 'shoes',
    rating: 4.9,
    stock: '15',
    description: 'Ultra-comfortable athletic and casual sneakers. Non-slip rubber sole with high elasticity memory foam inside for premium performance.',
    deliveryEstimate: '2 - 4 Working Days',
    inStock: true,
    brand: 'Ndure'
  },
  {
    id: 'p5',
    name: 'Handbag',
    price: 1799,
    originalPrice: 1999,
    discount: '-10%',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60'
    ],
    category: 'bags',
    rating: 4.6,
    stock: '25',
    description: "Elegant women's shoulder handbag with spacious storage, high quality faux leather, and a sophisticated gold buckle accent.",
    deliveryEstimate: '3 - 4 Working Days',
    inStock: true,
    brand: 'Stylo'
  },
  {
    id: 'p6',
    name: 'Deep Cleansing Face Wash',
    price: 999,
    originalPrice: 1499,
    discount: '-33%',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60'
    ],
    category: 'beauty',
    rating: 4.5,
    stock: '40',
    description: 'Hydrating and oil-controlling foaming face wash, containing natural tea tree oil extract.',
    deliveryEstimate: '2 - 4 Working Days',
    inStock: true,
    brand: 'Saeed Ghani'
  }
];

const INITIAL_CATEGORIES = [
  { id: 'fashion', name: 'Fashion', icon: 'Shirt', order: 1 },
  { id: 'beauty', name: 'Beauty', icon: 'Sparkles', order: 2 },
  { id: 'electronics', name: 'Electronics', icon: 'Laptop', order: 3 },
  { id: 'watches', name: 'Watches', icon: 'Clock', order: 4 },
  { id: 'shoes', name: 'Shoes', icon: 'Footprints', order: 5 },
  { id: 'kitchen', name: 'Home & Kitchen', icon: 'Home', order: 6 },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad', order: 7 },
  { id: 'mobile', name: 'Mobile Accessories', icon: 'Smartphone', order: 8 },
  { id: 'bags', name: 'Bags', icon: 'Briefcase', order: 9 },
];

const INITIAL_ORDERS: Order[] = [];

const INITIAL_NOTIFS: Notification[] = [
  {
    id: 'n1',
    title: 'Order Updates',
    message: 'Order #BTM1003 has been shipped via Fast Delivery!',
    time: '10 mins ago',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    type: 'order',
    read: false
  },
  {
    id: 'n2',
    title: 'Payment Confirmation',
    message: 'Payment verified for Order #BTM1001 by Ali Raza.',
    time: '1 hour ago',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    type: 'payment',
    read: false
  },
  {
    id: 'n3',
    title: 'Lucky Draw Results',
    message: 'Winner of 25 May Draw announced! Check My Account.',
    time: '1 day ago',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: 'lucky',
    read: false
  },
  {
    id: 'n4',
    title: 'New Product Alerts',
    message: 'Wireless Bluetooth Earbuds with ANC are now in stock!',
    time: '2 days ago',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'product',
    read: false
  },
  {
    id: 'n5',
    title: 'Special Offers',
    message: 'Flash Sale: Flat 20% OFF on premium watches!',
    time: '3 days ago',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'promo',
    read: false
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    rating: 5,
    author: 'Ali Raza',
    text: 'Excellent quality products and fast delivery. Highly recommended!',
    date: '24 June 2026'
  },
  {
    id: 'r2',
    rating: 5,
    author: 'Sana Khan',
    text: 'BTM is my trusted shop now. Very easy payment verification and original items!',
    date: '12 June 2026'
  },
  {
    id: 'r3',
    rating: 4.8,
    author: 'Hassan Shah',
    text: 'The bluetooth earbuds have amazing bass. Delivery was completed in 2 days.',
    date: '02 June 2026'
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Ali Raza', email: 'aliraza@gmail.com', phone: '03012345678', address: 'Sariab Road, Quetta', city: 'Quetta', disabled: false, createdAt: '2026-06-20' },
  { id: 'c2', name: 'Hassan Shah', email: 'hassan@yahoo.com', phone: '03339876543', address: 'Cantt Area, Quetta', city: 'Quetta', disabled: false, createdAt: '2026-06-22' },
  { id: 'c3', name: 'Sana Khan', email: 'sana@hotmail.com', phone: '03124455667', address: 'Satellite Town, Quetta', city: 'Quetta', disabled: false, createdAt: '2026-06-25' },
  { id: 'c4', name: 'Usman Ali', email: 'usman@gmail.com', phone: '03211122334', address: 'Jinnah Road, Loralai', city: 'Loralai', disabled: false, createdAt: '2026-07-01' }
];

const INITIAL_COUPONS: Coupon[] = [
  { code: 'BTM500', discount: 'Rs. 500 Off', minSpend: 'Rs. 5,000', status: 'Active', usage: 142 },
  { code: 'QUETTA10', discount: '10% Off', minSpend: 'Rs. 2,000', status: 'Active', usage: 89 },
  { code: 'WELCOME15', discount: '15% Off', minSpend: 'No Limit', status: 'Expired', usage: 310 }
];

const INITIAL_RESELLERS: Reseller[] = [
  { id: 'R-7041', name: 'Imran Khan', city: 'Quetta', sales: 45000, commission: 4500, status: 'Approved' },
  { id: 'R-9203', name: 'Shazia Baloch', city: 'Gwadar', sales: 12000, commission: 1200, status: 'Approved' },
  { id: 'R-1142', name: 'Zainab Bibi', city: 'Hub', sales: 0, commission: 0, status: 'Pending Approval' }
];

const INITIAL_LUCKY: LuckyDraw[] = [
  { prize: 'Premium Smart Watch', participants: 421, status: 'Active' },
  { prize: 'Wireless Bluetooth Buds', participants: 189, status: 'Active' },
  { prize: 'Rs. 10,000 Cash Voucher', participants: 312, status: 'Completed', winner: 'Abid Shah (Turbat)' }
];

// Read DB helper
function readDB(): DatabaseSchema {
  try {
    if (process.env.VERCEL && !fs.existsSync(DB_FILE)) {
      const origPath = path.join(process.cwd(), "database.json");
      if (fs.existsSync(origPath)) {
        try {
          const content = fs.readFileSync(origPath, "utf8");
          fs.writeFileSync(DB_FILE, content, "utf8");
        } catch (e) {
          console.error("Failed to copy database to /tmp", e);
        }
      }
    }
    if (!fs.existsSync(DB_FILE)) {
      const defaultData: DatabaseSchema = {
        products: INITIAL_PRODUCTS,
        categories: INITIAL_CATEGORIES,
        orders: INITIAL_ORDERS,
        notifications: INITIAL_NOTIFS,
        reviews: INITIAL_REVIEWS,
        customers: INITIAL_CUSTOMERS,
        coupons: INITIAL_COUPONS,
        resellers: INITIAL_RESELLERS,
        luckyDraws: INITIAL_LUCKY,
        settings: {
          shippingRate: "200",
          minOrderFreeShipping: "10000",
          maintenanceMode: false
        },
        users: [],
        sessions: [],
        spinResults: [],
        luckyDrawEntries: [],
        rewards: [],
        dailyActivity: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), "utf8");
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as DatabaseSchema;
    
    // Auto-migrate if any of our keys are missing from existing database.json
    let migrated = false;
    if (!parsed.users) { parsed.users = []; migrated = true; }
    if (!parsed.sessions) { parsed.sessions = []; migrated = true; }
    if (!parsed.spinResults) { parsed.spinResults = []; migrated = true; }
    if (!parsed.luckyDrawEntries) { parsed.luckyDrawEntries = []; migrated = true; }
    if (!parsed.rewards) { parsed.rewards = []; migrated = true; }
    if (!parsed.dailyActivity) { parsed.dailyActivity = []; migrated = true; }
    
    if (migrated) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf8");
    }
    
    return parsed;
  } catch (err) {
    console.error("Error reading database file", err);
    return {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: INITIAL_ORDERS,
      notifications: INITIAL_NOTIFS,
      reviews: INITIAL_REVIEWS,
      customers: INITIAL_CUSTOMERS,
      coupons: INITIAL_COUPONS,
      resellers: INITIAL_RESELLERS,
      luckyDraws: INITIAL_LUCKY,
      settings: {
        shippingRate: "200",
        minOrderFreeShipping: "10000",
        maintenanceMode: false
      },
      users: [],
      sessions: [],
      spinResults: [],
      luckyDrawEntries: [],
      rewards: [],
      dailyActivity: []
    };
  }
}

// Write DB helper
function writeDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// Secure Password Hashing Helper
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Token-based Session Authenticator
function getAuthenticatedUser(req: express.Request, db: DatabaseSchema): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  
  const session = db.sessions?.find(s => s.token === token && new Date(s.expiresAt) > new Date());
  if (!session) return null;
  
  const user = db.users?.find(u => u.id === session.userId);
  return user || null;
}

// In-memory cache for duplicate prevention
const recentNotificationsInMemory = new Map<string, number>();

function isMemoryDuplicate(title: string, message: string): boolean {
  const now = Date.now();
  // Clear old entries
  for (const [sig, ts] of recentNotificationsInMemory.entries()) {
    if (now - ts > 60000) {
      recentNotificationsInMemory.delete(sig);
    }
  }

  const sig = `${title.trim().toLowerCase()}|${message.trim().toLowerCase()}`;
  const lastTime = recentNotificationsInMemory.get(sig);
  if (lastTime && (now - lastTime < 15000)) { // 15s window
    return true;
  }
  recentNotificationsInMemory.set(sig, now);
  return false;
}

// Notification trigger helper
function createNotification(
  db: DatabaseSchema,
  title: string,
  message: string,
  type: "order" | "payment" | "lucky" | "product" | "promo" | "admin",
  relatedOrderId?: string,
  userId?: string
) {
  const normTitle = (title || "").trim();
  const normMessage = (message || "").trim();
  const normType = type || "admin";
  const normOrderId = (relatedOrderId || "").trim();
  const normUserId = (userId || "guest").trim();

  // Prevent duplicate notifications in the database (within last 60 seconds)
  const now = Date.now();
  const isDuplicate = db.notifications.some(n => {
    const titleMatch = (n.title || "").trim().toLowerCase() === normTitle.toLowerCase();
    const msgMatch = (n.message || "").trim().toLowerCase() === normMessage.toLowerCase();
    const typeMatch = n.type === normType;
    const orderIdMatch = (n.relatedOrderId || "").trim().toLowerCase() === normOrderId.toLowerCase();
    const userIdMatch = (n.userId || "guest").trim().toLowerCase() === normUserId.toLowerCase();

    if (titleMatch && msgMatch && typeMatch && orderIdMatch && userIdMatch) {
      if (n.timestamp) {
        const elapsed = now - new Date(n.timestamp).getTime();
        return elapsed < 60000; // 60 seconds duplicate window
      }
      return true;
    }
    return false;
  });

  if (isDuplicate || isMemoryDuplicate(normTitle, normMessage)) {
    console.log(`[DUPLICATE PREVENTED] Title: "${normTitle}", Message: "${normMessage}"`);
    return;
  }

  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const newNotif: Notification = {
    id: `n-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    userId: normUserId,
    title: normTitle,
    message: normMessage,
    time: timeStr,
    timestamp: new Date().toISOString(),
    type: normType,
    read: false,
    relatedOrderId: normOrderId
  };
  db.notifications.unshift(newNotif);
}

// REST APIs
// 1. PRODUCTS
app.get("/api/products", (req, res) => {
  const db = readDB();
  res.json(db.products);
});

app.post("/api/products", (req, res) => {
  const db = readDB();
  const newProduct: Product = {
    id: `p-${Date.now()}`,
    name: req.body.name || "Unnamed Product",
    price: Number(req.body.price) || 0,
    originalPrice: Number(req.body.originalPrice) || Number(req.body.price) || 0,
    discount: req.body.discount || "0%",
    image: req.body.image || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
    images: req.body.images || [req.body.image],
    category: req.body.category || "electronics",
    rating: Number(req.body.rating) || 5,
    stock: String(req.body.stock) || "0",
    description: req.body.description || "",
    deliveryEstimate: req.body.deliveryEstimate || "2 - 4 Working Days",
    inStock: req.body.inStock !== false,
    brand: req.body.brand || ""
  };

  // Prevent duplicate product names
  if (db.products.some(p => p.name.toLowerCase() === newProduct.name.toLowerCase())) {
    return res.status(400).json({ error: "Product with this name already exists!" });
  }

  db.products.unshift(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  const oldProduct = db.products[idx];
  const oldStock = parseInt(oldProduct.stock) || 0;

  db.products[idx] = {
    ...db.products[idx],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : db.products[idx].price,
    originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : db.products[idx].originalPrice,
    rating: req.body.rating !== undefined ? Number(req.body.rating) : db.products[idx].rating
  };

  const newStock = parseInt(db.products[idx].stock) || 0;

  // Trigger Notifications
  if (oldStock === 0 && newStock > 0) {
    createNotification(db, "Product Back In Stock 🔔", `${db.products[idx].name} is now back in stock! Order yours now.`, "product", "", "guest");
  } else if (newStock === 0 && oldStock > 0) {
    createNotification(db, "Product Out of Stock ⚠️", `Product ${db.products[idx].name} (ID: ${id}) is completely out of stock.`, "admin");
  } else if (newStock > 0 && newStock <= 5 && (oldStock > 5 || oldStock !== newStock)) {
    createNotification(db, "Low Stock Warning ⚠️", `Product ${db.products[idx].name} has only ${newStock} units left in inventory.`, "admin");
  }

  writeDB(db);
  res.json(db.products[idx]);
});

app.delete("/api/products/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.products = db.products.filter(p => p.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// 2. CATEGORIES
app.get("/api/categories", (req, res) => {
  const db = readDB();
  res.json(db.categories);
});

app.post("/api/categories", (req, res) => {
  const db = readDB();
  const newCat = {
    id: req.body.id || `c-${Date.now()}`,
    name: req.body.name || "New Category",
    icon: req.body.icon || "Tag",
    order: Number(req.body.order) || db.categories.length + 1
  };
  db.categories.push(newCat);
  writeDB(db);
  res.status(201).json(newCat);
});

app.put("/api/categories/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.categories.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Category not found" });

  db.categories[idx] = {
    ...db.categories[idx],
    ...req.body
  };
  writeDB(db);
  res.json(db.categories[idx]);
});

app.delete("/api/categories/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.categories = db.categories.filter(c => c.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// 3. ORDERS
app.get("/api/orders", (req, res) => {
  const db = readDB();
  const user = getAuthenticatedUser(req, db);
  if (user) {
    const filtered = db.orders.filter(o => 
      (o.email && o.email.toLowerCase() === user.email.toLowerCase()) || 
      (o.phone && o.phone === user.phone)
    );
    return res.json(filtered);
  }
  res.json(db.orders);
});

app.post("/api/orders", (req, res) => {
  const db = readDB();
  const newOrder: Order = {
    id: req.body.id || `BTM${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: req.body.customerName || "Walk-in Customer",
    phone: req.body.phone || "",
    email: req.body.email || "",
    address: req.body.address || "",
    city: req.body.city || "",
    area: req.body.area || "",
    items: req.body.items || [],
    total: Number(req.body.total) || 0,
    paymentMethod: req.body.paymentMethod || "EasyPaisa",
    paymentScreenshot: req.body.paymentScreenshot || "",
    status: req.body.status || "Pending",
    date: req.body.date || new Date().toISOString().split('T')[0],
    verificationNotes: req.body.verificationNotes || "",
    timestamp: Date.now()
  };

  db.orders.unshift(newOrder);

  // Link to user if logged in and award points
  const user = db.users?.find(u => 
    (newOrder.email && u.email.toLowerCase() === newOrder.email.toLowerCase()) || 
    (newOrder.phone && u.phone === newOrder.phone)
  );
  if (user) {
    const pointsEarned = Math.floor(newOrder.total / 100);
    user.rewardsPoints = (user.rewardsPoints || 0) + pointsEarned;
    db.rewards?.push({
      id: `r-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      email: user.email,
      points: pointsEarned,
      description: `Points earned from Order ${newOrder.id}`,
      timestamp: new Date().toISOString()
    });
    
    // Auto populate dailyActivity row for today to unlock rewards!
    const todayStr = new Date().toISOString().split('T')[0];
    let activity = db.dailyActivity?.find(a => a.userId === user.id && a.date === todayStr);
    if (!activity) {
      db.dailyActivity?.push({
        id: `act-${Date.now()}`,
        userId: user.id,
        email: user.email,
        date: todayStr,
        hasSpun: false,
        hasEnteredLuckyDraw: false,
        lastActivityAt: new Date().toISOString()
      });
    }
  }

  // Trigger Notifications for Order Placed
  createNotification(db, "Order Placed Successfully ✅", `Your order ${newOrder.id} has been submitted. Total amount is Rs. ${newOrder.total.toLocaleString()}.`, "order", newOrder.id, newOrder.email || "guest");
  createNotification(db, "Order Received", `📦 New order #${newOrder.id} received.`, "admin", newOrder.id, "admin");

  if (newOrder.paymentScreenshot) {
    createNotification(db, "Payment Receipt Uploaded 💳", `We have received your payment proof screenshot for order ${newOrder.id}. A manual audit desk is validating.`, "payment", newOrder.id, newOrder.email || "guest");
    createNotification(db, "Payment Proof Received 💳", `Payment receipt screenshot uploaded for order ${newOrder.id} by ${newOrder.customerName}.`, "admin", newOrder.id, "admin");
  }

  // Auto create or update Customer
  if (newOrder.email || newOrder.phone) {
    const existingCust = db.customers.find(c => 
      (newOrder.email && c.email === newOrder.email) || 
      (newOrder.phone && c.phone === newOrder.phone)
    );
    if (!existingCust) {
      db.customers.unshift({
        id: `c-${Date.now()}`,
        name: newOrder.customerName,
        email: newOrder.email,
        phone: newOrder.phone,
        address: newOrder.address,
        city: newOrder.city,
        disabled: false,
        createdAt: new Date().toISOString().split('T')[0]
      });
      // Trigger Admin Notification for New Customer
      createNotification(db, "Customer Registered", "👤 A new customer has registered.", "admin", "", "admin");
    }
  }

  // Auto decrement Stock if order is processing or confirmed
  newOrder.items.forEach(item => {
    const pIdx = db.products.findIndex(p => p.id === item.product.id);
    if (pIdx > -1) {
      let currentStock = parseInt(db.products[pIdx].stock);
      if (!isNaN(currentStock)) {
        currentStock = Math.max(0, currentStock - item.quantity);
        db.products[pIdx].stock = String(currentStock);
        db.products[pIdx].inStock = currentStock > 0;
      }
    }
  });

  writeDB(db);
  res.status(201).json(newOrder);
});

app.put("/api/orders/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.orders.findIndex(o => o.id === id);
  if (idx === -1) return res.status(404).json({ error: "Order not found" });

  const oldOrder = db.orders[idx];
  const oldStatus = oldOrder.status;
  const newStatus = req.body.status;

  db.orders[idx] = {
    ...db.orders[idx],
    ...req.body
  };

  const updatedOrder = db.orders[idx];

  // If status is updated, trigger status-specific notifications
  if (newStatus && oldStatus !== newStatus) {
    const custEmail = updatedOrder.email || "guest";
    
    if (newStatus === 'Payment Verification') {
      createNotification(db, "Payment Verification Underway 🔍", `Your screenshot receipt for order ${id} is being analyzed by our verification desk.`, "payment", id, custEmail);
    } 
    else if (newStatus === 'Confirmed') {
      createNotification(db, "Payment Verified & Order Confirmed 🎉", `Your payment of Rs. ${updatedOrder.total.toLocaleString()} has been verified! Order ${id} is now confirmed.`, "payment", id, custEmail);
      createNotification(db, "Order Confirmed ✅", `Order ${id} is successfully confirmed and locked.`, "order", id, custEmail);
      createNotification(db, "Payment Verified", "💳 Payment verified successfully.", "admin", id, "admin");
    }
    else if (newStatus === 'Processing') {
      createNotification(db, "Order Processing Started 📦", `Your items in order ${id} are being packed and verified at our Quetta warehouse.`, "order", id, custEmail);
      createNotification(db, "Order in Processing 📦", `Order ${id} has moved to processing status.`, "admin", id, "admin");
    }
    else if (newStatus === 'Shipped') {
      createNotification(db, "Order Shipped Out! 🚚", `Good news! Order ${id} has been dispatched via fast courier service. It should arrive in 2-4 working days.`, "order", id, custEmail);
      createNotification(db, "Order Shipped 🚚", `Order ${id} has been marked as shipped.`, "admin", id, "admin");
    }
    else if (newStatus === 'Delivered') {
      createNotification(db, "Order Delivered Successfully 🎁", `Your order ${id} has been delivered successfully. Thank you for your trust in BTM! "Aapka Bharosa, Hamari Zimmedari!"`, "order", id, custEmail);
      createNotification(db, "Order Delivered 🎁", `Order ${id} has been delivered to destination.`, "admin", id, "admin");
    }
    else if (newStatus === 'Cancelled') {
      createNotification(db, "Order Cancelled ❌", `Your order ${id} has been cancelled. Please contact BTM wholesale support if you have any questions.`, "order", id, custEmail);
      createNotification(db, "Order Cancelled ❌", `Order ${id} has been cancelled.`, "admin", id, "admin");
    }
  }

  // Handle case of explicit Refund requested
  if (req.body.refundRequested && !oldOrder.refundRequested) {
    createNotification(db, "Refund Requested 🪙", `Refund request submitted for order ${id}. Our accounts team is reviewing.`, "payment", id, updatedOrder.email || "guest");
    createNotification(db, "Refund Requested 🪙", `Customer requested a refund for order ${id}.`, "admin", id, "admin");
  }

  writeDB(db);
  res.json(db.orders[idx]);
});

app.delete("/api/orders/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.orders = db.orders.filter(o => o.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// 4. CUSTOMERS
app.get("/api/customers", (req, res) => {
  const db = readDB();
  res.json(db.customers);
});

app.post("/api/customers", (req, res) => {
  const db = readDB();
  const newCust: Customer = {
    id: `c-${Date.now()}`,
    name: req.body.name || "New Customer",
    email: req.body.email || "",
    phone: req.body.phone || "",
    address: req.body.address || "",
    city: req.body.city || "",
    disabled: req.body.disabled === true,
    createdAt: req.body.createdAt || new Date().toISOString().split('T')[0]
  };
  db.customers.unshift(newCust);
  writeDB(db);
  res.status(201).json(newCust);
});

app.put("/api/customers/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.customers.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Customer not found" });

  db.customers[idx] = {
    ...db.customers[idx],
    ...req.body
  };
  writeDB(db);
  res.json(db.customers[idx]);
});

app.delete("/api/customers/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.customers = db.customers.filter(c => c.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// 5. NOTIFICATIONS
app.get("/api/notifications", (req, res) => {
  const db = readDB();
  let updated = false;
  db.notifications = db.notifications.map(n => {
    if (n.read === undefined) {
      n.read = false;
      updated = true;
    }
    if (!n.timestamp) {
      n.timestamp = new Date().toISOString();
      updated = true;
    }
    return n;
  });
  if (updated) {
    writeDB(db);
  }
  res.json(db.notifications);
});

app.post("/api/notifications", (req, res) => {
  const db = readDB();
  const title = (req.body.title || "").trim();
  const message = (req.body.message || "").trim();
  const type = req.body.type || "promo";
  const relatedOrderId = (req.body.relatedOrderId || "").trim();
  const userId = (req.body.userId || "guest").trim();

  // Prevent duplicate notifications in the database (within last 60 seconds)
  const now = Date.now();
  const isDuplicate = db.notifications.some(n => {
    const titleMatch = (n.title || "").trim().toLowerCase() === title.toLowerCase();
    const msgMatch = (n.message || "").trim().toLowerCase() === message.toLowerCase();
    const typeMatch = n.type === type;
    const orderIdMatch = (n.relatedOrderId || "").trim().toLowerCase() === relatedOrderId.toLowerCase();
    const userIdMatch = (n.userId || "guest").trim().toLowerCase() === userId.toLowerCase();

    if (titleMatch && msgMatch && typeMatch && orderIdMatch && userIdMatch) {
      if (n.timestamp) {
        const elapsed = now - new Date(n.timestamp).getTime();
        return elapsed < 60000; // 60 seconds duplicate window
      }
      return true;
    }
    return false;
  });

  if (isDuplicate || isMemoryDuplicate(title, message)) {
    const existing = db.notifications.find(n => 
      (n.title || "").trim().toLowerCase() === title.toLowerCase() &&
      (n.message || "").trim().toLowerCase() === message.toLowerCase()
    );
    console.log(`[API DUPLICATE PREVENTED] Title: "${title}", Message: "${message}"`);
    return res.status(200).json(existing || { id: `n-dup-${Date.now()}`, title, message, type, read: false });
  }

  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const newNotif: Notification = {
    id: req.body.id || `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    title,
    message,
    time: req.body.time || timeStr,
    timestamp: req.body.timestamp || new Date().toISOString(),
    type,
    read: req.body.read === true,
    relatedOrderId
  };
  db.notifications.unshift(newNotif);
  writeDB(db);
  res.status(201).json(newNotif);
});

// Mark single notification as read
app.post("/api/notifications/:id/read", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.notifications.findIndex(n => n.id === id);
  if (idx !== -1) {
    db.notifications[idx].read = true;
    writeDB(db);
    return res.json(db.notifications[idx]);
  }
  res.status(404).json({ error: "Notification not found" });
});

// Mark all notifications as read
app.post("/api/notifications/mark-all-read", (req, res) => {
  const db = readDB();
  db.notifications = db.notifications.map(n => ({ ...n, read: true }));
  writeDB(db);
  res.json({ success: true, count: db.notifications.length });
});

// Delete a single notification
app.delete("/api/notifications/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const initialLength = db.notifications.length;
  db.notifications = db.notifications.filter(n => n.id !== id);
  if (db.notifications.length !== initialLength) {
    writeDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "Notification not found" });
});

// Clear all notifications
app.post("/api/notifications/clear-all", (req, res) => {
  const db = readDB();
  db.notifications = [];
  writeDB(db);
  res.json({ success: true });
});

// 6. REVIEWS
app.get("/api/reviews", (req, res) => {
  const db = readDB();
  res.json(db.reviews);
});

app.post("/api/reviews", (req, res) => {
  const db = readDB();
  const newReview: Review = {
    id: `r-${Date.now()}`,
    rating: Number(req.body.rating) || 5,
    author: req.body.author || "Anonymous",
    text: req.body.text || "",
    date: req.body.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  };
  db.reviews.unshift(newReview);

  // Trigger Admin Notification for New Review
  createNotification(db, "New Customer Review ⭐", `${newReview.author} submitted a ${newReview.rating}-star review: "${newReview.text.slice(0, 40)}${newReview.text.length > 40 ? '...' : ''}"`, "admin", "", "admin");

  writeDB(db);
  res.status(201).json(newReview);
});

// 7. SETTINGS
app.get("/api/settings", (req, res) => {
  const db = readDB();
  res.json(db.settings);
});

app.put("/api/settings", (req, res) => {
  const db = readDB();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  writeDB(db);
  res.json(db.settings);
});

// 8. COUPONS
app.get("/api/coupons", (req, res) => {
  const db = readDB();
  res.json(db.coupons);
});

app.post("/api/coupons", (req, res) => {
  const db = readDB();
  const newCoupon: Coupon = {
    code: (req.body.code || "").toUpperCase(),
    discount: req.body.discount || "10% Off",
    minSpend: req.body.minSpend || "No Limit",
    status: req.body.status || "Active",
    usage: Number(req.body.usage) || 0
  };
  db.coupons.unshift(newCoupon);
  writeDB(db);
  res.status(201).json(newCoupon);
});

app.put("/api/coupons/:code", (req, res) => {
  const db = readDB();
  const { code } = req.params;
  const idx = db.coupons.findIndex(c => c.code.toUpperCase() === code.toUpperCase());
  if (idx === -1) return res.status(404).json({ error: "Coupon not found" });

  db.coupons[idx] = {
    ...db.coupons[idx],
    ...req.body
  };
  writeDB(db);
  res.json(db.coupons[idx]);
});

app.delete("/api/coupons/:code", (req, res) => {
  const db = readDB();
  const { code } = req.params;
  db.coupons = db.coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
  writeDB(db);
  res.json({ success: true });
});

// 9. RESELLERS
app.get("/api/resellers", (req, res) => {
  const db = readDB();
  res.json(db.resellers);
});

app.post("/api/resellers", (req, res) => {
  const db = readDB();
  const newReseller: Reseller = {
    id: req.body.id || `R-${Math.floor(1000 + Math.random() * 9000)}`,
    name: req.body.name || "New Reseller",
    city: req.body.city || "",
    sales: Number(req.body.sales) || 0,
    commission: Number(req.body.commission) || 0,
    status: req.body.status || "Pending Approval"
  };
  db.resellers.unshift(newReseller);

  // Trigger Admin Notification for Reseller Application
  createNotification(db, "New Reseller Application 💼", `A reseller partnership application has been submitted by ${newReseller.name} from ${newReseller.city || "Pakistan"}.`, "admin", "", "admin");

  writeDB(db);
  res.status(201).json(newReseller);
});

app.put("/api/resellers/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.resellers.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: "Reseller not found" });

  db.resellers[idx] = {
    ...db.resellers[idx],
    ...req.body
  };
  writeDB(db);
  res.json(db.resellers[idx]);
});

app.delete("/api/resellers/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.resellers = db.resellers.filter(r => r.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// 10. LUCKY DRAWS
app.get("/api/lucky-draws", (req, res) => {
  const db = readDB();
  res.json(db.luckyDraws);
});

app.post("/api/lucky-draws", (req, res) => {
  const db = readDB();
  const newLd: LuckyDraw = {
    prize: req.body.prize || "Premium Prize",
    participants: Number(req.body.participants) || 0,
    status: req.body.status || "Active",
    winner: req.body.winner || ""
  };
  db.luckyDraws.unshift(newLd);
  writeDB(db);
  res.status(201).json(newLd);
});

app.put("/api/lucky-draws/:prize", (req, res) => {
  const db = readDB();
  const { prize } = req.params;
  const idx = db.luckyDraws.findIndex(l => l.prize.toLowerCase() === prize.toLowerCase());
  if (idx === -1) return res.status(404).json({ error: "Lucky Draw not found" });

  const oldWinner = db.luckyDraws[idx].winner;

  db.luckyDraws[idx] = {
    ...db.luckyDraws[idx],
    ...req.body
  };

  const newWinner = db.luckyDraws[idx].winner;
  if (newWinner && newWinner !== oldWinner) {
    createNotification(db, "Lucky Draw Winner Announced! 🎉", `Congratulations to ${newWinner} on winning the Lucky Draw prize: ${db.luckyDraws[idx].prize}!`, "lucky", "", "guest");
  }

  writeDB(db);
  res.json(db.luckyDraws[idx]);
});

app.delete("/api/lucky-draws/:prize", (req, res) => {
  const db = readDB();
  const { prize } = req.params;
  db.luckyDraws = db.luckyDraws.filter(l => l.prize.toLowerCase() !== prize.toLowerCase());
  writeDB(db);
  res.json({ success: true });
});

// --- AUTH & REWARDS SYSTEM ENDPOINTS ---

// 1. REGISTER
app.post("/api/auth/register", (req, res) => {
  const db = readDB();
  const { name, email, phone, password } = req.body;
  
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "All registration fields are required." });
  }
  
  const dup = db.users?.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (dup) {
    return res.status(400).json({ error: "Email address is already registered." });
  }
  
  const newUser: User = {
    id: `u-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    email,
    phone,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    rewardsPoints: 0
  };
  
  db.users?.push(newUser);
  
  // Register as customer
  const custIndex = db.customers.findIndex(c => c.email.toLowerCase() === email.toLowerCase());
  if (custIndex === -1) {
    db.customers.unshift({
      id: `c-${Date.now()}`,
      name,
      email,
      phone,
      address: "",
      city: "",
      disabled: false,
      createdAt: new Date().toISOString().split('T')[0]
    });
  }
  
  writeDB(db);
  res.status(201).json({ message: "Registration successful." });
});

// 2. LOGIN
app.post("/api/auth/login", (req, res) => {
  const db = readDB();
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  
  const user = db.users?.find(u => u.email.toLowerCase() === email.toLowerCase() || u.phone === email);
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  
  const token = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
  
  db.sessions?.push({
    token,
    userId: user.id,
    email: user.email,
    name: user.name,
    expiresAt
  });
  
  writeDB(db);
  
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      rewardsPoints: user.rewardsPoints,
      createdAt: user.createdAt
    }
  });
});

// 3. GET CURRENT USER (ME)
app.get("/api/auth/me", (req, res) => {
  const db = readDB();
  const user = getAuthenticatedUser(req, db);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized access." });
  }
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    rewardsPoints: user.rewardsPoints,
    createdAt: user.createdAt
  });
});

// 4. FORGOT PASSWORD
app.post("/api/auth/forgot-password", (req, res) => {
  const db = readDB();
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  
  const user = db.users?.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "No user found with this email." });
  }
  
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hr
  
  createNotification(db, "Password Reset Link Generated 🔑", `A reset link was generated. Reset Token is: ${resetToken}`, "admin", "", user.email);
  
  writeDB(db);
  res.json({ message: "Reset token generated successfully.", resetToken });
});

// 5. RESET PASSWORD
app.post("/api/auth/reset-password", (req, res) => {
  const db = readDB();
  const { token, password } = req.body;
  
  if (!token || !password) {
    return res.status(400).json({ error: "Token and password are required." });
  }
  
  const user = db.users?.find(u => u.resetToken === token && u.resetTokenExpiry && new Date(u.resetTokenExpiry) > new Date());
  if (!user) {
    return res.status(400).json({ error: "Invalid or expired reset token." });
  }
  
  user.passwordHash = hashPassword(password);
  delete user.resetToken;
  delete user.resetTokenExpiry;
  
  writeDB(db);
  res.json({ message: "Password updated successfully." });
});

// 6. DASHBOARD & REWARDS SUMMARY
app.get("/api/user/dashboard-summary", (req, res) => {
  const db = readDB();
  const user = getAuthenticatedUser(req, db);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized access." });
  }
  
  const userOrders = db.orders.filter(o => 
    (o.email && o.email.toLowerCase() === user.email.toLowerCase()) || 
    (o.phone && o.phone === user.phone)
  );
  
  const userSpins = db.spinResults?.filter(s => s.userId === user.id) || [];
  const userDrawEntries = db.luckyDrawEntries?.filter(l => l.userId === user.id) || [];
  const userRewardsHistory = db.rewards?.filter(r => r.userId === user.id) || [];
  
  const todayStr = new Date().toISOString().split('T')[0];
  let activity = db.dailyActivity?.find(a => a.userId === user.id && a.date === todayStr);
  if (!activity) {
    activity = {
      id: `act-${Date.now()}`,
      userId: user.id,
      email: user.email,
      date: todayStr,
      hasSpun: false,
      hasEnteredLuckyDraw: false,
      lastActivityAt: new Date().toISOString()
    };
    db.dailyActivity?.push(activity);
    writeDB(db);
  }
  
  const hasOrders = userOrders.length > 0;
  
  res.json({
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      rewardsPoints: user.rewardsPoints,
      createdAt: user.createdAt
    },
    orders: userOrders,
    spins: userSpins,
    drawEntries: userDrawEntries,
    rewardsHistory: userRewardsHistory,
    activity: {
      ...activity,
      eligible: hasOrders
    }
  });
});

// 7. SPIN WHEEL ACTION
app.post("/api/rewards/spin", (req, res) => {
  const db = readDB();
  const user = getAuthenticatedUser(req, db);
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: "Please log in to use Spin & Win.",
      error: "Please log in to use Spin & Win."
    });
  }
  
  // Initialize optional database arrays if they are missing
  if (!db.dailyActivity) db.dailyActivity = [];
  if (!db.spinResults) db.spinResults = [];
  if (!db.rewards) db.rewards = [];
  if (!db.notifications) db.notifications = [];

  // Enforce strict 24-hour limit from actual spin history
  const userSpins = db.spinResults.filter(s => s.userId === user.id);
  if (userSpins.length > 0) {
    const lastSpin = userSpins.reduce((latest, current) => {
      return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
    }, userSpins[0]);
    
    const lastSpinTime = new Date(lastSpin.timestamp).getTime();
    const nowTime = Date.now();
    const hoursElapsed = (nowTime - lastSpinTime) / (1000 * 60 * 60);
    if (hoursElapsed < 24) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already used your free spin today.",
        error: "You have already used your free spin today."
      });
    }
  }
  
  const todayStr = new Date().toISOString().split('T')[0];
  let activity = db.dailyActivity.find(a => a.userId === user.id && a.date === todayStr);
  if (!activity) {
    activity = {
      id: `act-${Date.now()}`,
      userId: user.id,
      email: user.email,
      date: todayStr,
      hasSpun: false,
      hasEnteredLuckyDraw: false,
      lastActivityAt: new Date().toISOString()
    };
    db.dailyActivity.push(activity);
  }
  
  if (activity.hasSpun) {
    return res.status(400).json({ 
      success: false, 
      message: "You have already used your free spin today.",
      error: "You have already used your free spin today."
    });
  }
  
  const sectorPrizes = [
    'Discount Coupon',
    '50 Coins',
    'Gift Voucher',
    '100 Coins',
    'Free Gift',
    '200 Coins',
    'Cash Prize',
    'Better Luck Next Time'
  ];
  const prize = sectorPrizes[Math.floor(Math.random() * sectorPrizes.length)];
  
  // Award points/coins if appropriate
  let pointsAwarded = 0;
  if (prize === '50 Coins') {
    pointsAwarded = 50;
  } else if (prize === '100 Coins') {
    pointsAwarded = 100;
  } else if (prize === '200 Coins') {
    pointsAwarded = 200;
  } else if (prize !== 'Better Luck Next Time') {
    pointsAwarded = 25; // Bonus points for coupon/gift/cash
  }
  
  if (pointsAwarded > 0) {
    user.rewardsPoints = (user.rewardsPoints || 0) + pointsAwarded;
    db.rewards.push({
      id: `r-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      email: user.email,
      points: pointsAwarded,
      description: `Won from Fortune Spin Wheel: ${prize}`,
      timestamp: new Date().toISOString()
    });
  }
  
  const nowStr = new Date().toISOString();
  activity.hasSpun = true;
  activity.lastActivityAt = nowStr;
  
  // Save spin timestamp on the user object too
  user.lastSpinTimestamp = nowStr;
  
  db.spinResults.push({
    id: `spin-${Date.now()}`,
    userId: user.id,
    email: user.email,
    prize,
    timestamp: nowStr,
    lastSpinTimestamp: nowStr
  });
  
  createNotification(db, "Fortune Wheel Spin! 🎉", `You spun the BTM Fortune Wheel and won: ${prize}!`, "lucky", "", user.email);
  
  writeDB(db);
  res.json({ 
    success: true,
    reward: prize,
    prize, 
    message: "Spin completed successfully.",
    pointsAwarded, 
    rewardsPoints: user.rewardsPoints 
  });
});

// 8. LUCKY DRAW ENTRY ACTION
app.post("/api/rewards/lucky-draw", (req, res) => {
  const db = readDB();
  const user = getAuthenticatedUser(req, db);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized access. Please login." });
  }
  
  const todayStr = new Date().toISOString().split('T')[0];
  let activity = db.dailyActivity?.find(a => a.userId === user.id && a.date === todayStr);
  if (!activity) {
    activity = {
      id: `act-${Date.now()}`,
      userId: user.id,
      email: user.email,
      date: todayStr,
      hasSpun: false,
      hasEnteredLuckyDraw: false,
      lastActivityAt: new Date().toISOString()
    };
    db.dailyActivity?.push(activity);
  }
  
  if (activity.hasEnteredLuckyDraw) {
    return res.status(400).json({ error: "You have already entered the Lucky Draw pool today. Try again tomorrow!" });
  }
  
  const userOrders = db.orders.filter(o => 
    (o.email && o.email.toLowerCase() === user.email.toLowerCase()) || 
    (o.phone && o.phone === user.phone)
  );
  
  const hasOrders = userOrders.length > 0;
  const ticketId = hasOrders ? userOrders[0].id : `tkt-${Math.floor(Math.random() * 90000) + 10000}`;
  const orderId = hasOrders ? userOrders[0].id : "";
  
  activity.hasEnteredLuckyDraw = true;
  activity.lastActivityAt = new Date().toISOString();
  
  if (!db.luckyDrawEntries) db.luckyDrawEntries = [];
  db.luckyDrawEntries.push({
    id: `draw-${Date.now()}`,
    userId: user.id,
    email: user.email,
    orderId,
    ticketId,
    timestamp: new Date().toISOString()
  });
  
  db.luckyDraws.forEach(ld => {
    if (ld.status === "Active") {
      ld.participants = (ld.participants || 0) + 1;
    }
  });
  
  createNotification(db, "Lucky Draw Entered! 🗳️", `Your ticket ${ticketId} has been successfully submitted into the drawing drum!`, "lucky", orderId, user.email);
  
  writeDB(db);
  res.json({ success: true, ticketId });
});

// Background order status progressing daemon
function autoProgressOrders() {
  const db = readDB();
  let changed = false;
  const now = Date.now();
  
  db.orders.forEach(o => {
    if (!o.timestamp) {
      o.timestamp = now;
      changed = true;
    }
    const ageSeconds = (now - o.timestamp) / 1000;
    
    // Status Progression cycle:
    // Pending (0-30s) -> Processing (30-90s) -> Shipped (90-180s) -> Delivered (after 180s)
    if (o.status === "Pending" && ageSeconds > 30) {
      o.status = "Processing";
      changed = true;
      createNotification(db, "Order Processing 📦", `Your order ${o.id} is now being processed and packed.`, "order", o.id, o.email || "guest");
    } else if (o.status === "Processing" && ageSeconds > 90) {
      o.status = "Shipped";
      changed = true;
      createNotification(db, "Order Dispatched 🚚", `Great news! Your order ${o.id} has been shipped via fast cargo.`, "order", o.id, o.email || "guest");
    } else if (o.status === "Shipped" && ageSeconds > 180) {
      o.status = "Delivered";
      changed = true;
      createNotification(db, "Order Delivered 🎉", `Your order ${o.id} has been successfully delivered. Thank you for shopping with us!`, "order", o.id, o.email || "guest");
    }
  });
  
  if (changed) {
    writeDB(db);
  }
}

// Start order progression scheduler every 10 seconds if not on Vercel
if (!process.env.VERCEL) {
  setInterval(autoProgressOrders, 10000);
}

// Vite & Static file serving setup
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    
    if (!process.env.VERCEL) {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running in development on http://localhost:${PORT}`);
      });
    }
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running in production on http://localhost:${PORT}`);
    });
  }
}

export default app;
