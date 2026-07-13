export interface Product {
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
  inStock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Payment Verification'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  paymentScreenshot?: string;
  status: OrderStatus;
  date: string;
  refundRequested?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  author: string;
  text: string;
  date: string;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  time: string;
  timestamp: string;
  type: 'order' | 'payment' | 'lucky' | 'product' | 'promo' | 'admin';
  read: boolean;
  relatedOrderId?: string;
}
