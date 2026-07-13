import { Product, Review, Notification, Order } from './types';

export const CATEGORIES = [
  { id: 'fashion', name: 'Fashion', icon: 'Shirt' },
  { id: 'beauty', name: 'Beauty', icon: 'Sparkles' },
  { id: 'electronics', name: 'Electronics', icon: 'Laptop' },
  { id: 'watches', name: 'Watches', icon: 'Clock' },
  { id: 'shoes', name: 'Shoes', icon: 'Footprints' },
  { id: 'kitchen', name: 'Home & Kitchen', icon: 'Home' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad' },
  { id: 'mobile', name: 'Mobile Accesories', icon: 'Smartphone' },
  { id: 'bags', name: 'Bags', icon: 'Briefcase' },
];

export const PRODUCTS: Product[] = [
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
    stock: 'In Stock (50+ Available)',
    description: 'High quality sound, long battery life and comfortable fit. Compatible with all Bluetooth devices. Features deep bass, passive noise cancellation, and touch controls with seamless auto-pairing.',
    deliveryEstimate: '2 - 4 Working Days',
    inStock: true
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
    stock: 'In Stock (35 Available)',
    description: 'Track your health and activities with this elegant smart watch. Features blood oxygen monitoring, heart rate detection, custom watch faces, and water resistance.',
    deliveryEstimate: '2 - 3 Working Days',
    inStock: true
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
    stock: 'In Stock (20 Available)',
    description: 'Stay warm and fashionable with this premium quality leather-finish jacket. Crafted with heavy-duty zippers, multiple utility pockets, and warm inner fleece lining.',
    deliveryEstimate: '3 - 5 Working Days',
    inStock: true
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
    stock: 'In Stock (15 Available)',
    description: 'Ultra-comfortable athletic and casual sneakers. Non-slip rubber sole with high elasticity memory foam inside for premium performance.',
    deliveryEstimate: '2 - 4 Working Days',
    inStock: true
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
    stock: 'In Stock (25 Available)',
    description: 'Elegant women\'s shoulder handbag with spacious storage, high quality faux leather, and a sophisticated gold buckle accent.',
    deliveryEstimate: '3 - 4 Working Days',
    inStock: true
  },
  {
    id: 'p6',
    name: 'Deep Cleansing Face Wash',
    price: 999,
    originalPrice: 1499,
    discount: '-33%',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
    category: 'beauty',
    rating: 4.5,
    stock: 'In Stock (40 Available)',
    description: 'Hydrating and oil-controlling foaming face wash, containing natural tea tree oil extract.',
    deliveryEstimate: '2 - 4 Working Days',
    inStock: true
  }
];

export const REVIEWS: Review[] = [
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

export const SEED_ORDERS: Order[] = [];

export const INITIAL_NOTIFICATIONS: Notification[] = [
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
