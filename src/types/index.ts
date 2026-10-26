export type ProductCategory = 'Cap' | 'Shoes' | 'Dress' | 'Formal' | 'Fragrance';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // in IDR
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  description: string;
  tagline: string;
  materials: string;
  origin: string;
  care: string;
  notes?: string; // Fragrance notes or tailored fit notes
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  featured?: boolean;
  sku: string;
}

export interface CartItem {
  id: string; // unique cart entry key (product.id + size + color)
  product: Product;
  size: string;
  color: { name: string; hex: string };
  quantity: number;
}

export interface DeliveryCourier {
  id: string;
  name: string;
  service: string;
  cost: number;
  etd: string;
}

export type PaymentMethodType = 'va' | 'qris' | 'card' | 'paylater' | 'transfer';

export interface PaymentDetails {
  type: PaymentMethodType;
  provider: string; // 'BCA', 'Mandiri', 'QRIS', 'GoPay', 'Visa', etc.
  vaNumber?: string;
  accountNumber?: string;
  paidAt?: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface TrackingStep {
  title: string;
  time: string;
  location: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  date: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  courier: DeliveryCourier;
  payment: PaymentDetails;
  status: 'payment_pending' | 'payment_verified' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  trackingNumber: string;
  estimatedDelivery: string;
  timeline: TrackingStep[];
}

export interface CustomerReview {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  sizePurchased: string;
  verified: boolean;
}

export interface RefundRequest {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  reason: string;
  itemsDescription: string;
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'approved' | 'completed';
}
