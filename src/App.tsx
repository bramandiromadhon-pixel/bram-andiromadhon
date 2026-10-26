import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryShowcase } from './components/CategoryShowcase';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PaymentProcessingModal } from './components/PaymentProcessingModal';
import { OrderTrackingDashboard } from './components/OrderTrackingDashboard';
import { CustomerHelpModal } from './components/CustomerHelpModal';
import { ConciergeLiveChat } from './components/ConciergeLiveChat';
import { Footer } from './components/Footer';

import { PRODUCTS, INITIAL_REVIEWS } from './data/products';
import { Product, ProductCategory, CartItem, Order, CustomerInfo, DeliveryCourier, PaymentDetails, CustomerReview, RefundRequest, TrackingStep } from './types';
import { generateOrderId, generateTrackingNumber } from './utils/formatters';

const STORAGE_ORDERS_KEY = 'sigma_orders_v1';
const STORAGE_CART_KEY = 'sigma_cart_v1';
const STORAGE_REVIEWS_KEY = 'sigma_reviews_v1';

// Initial pre-seeded order so tracking dashboard is immediately rich & experiential
const SAMPLE_INITIAL_ORDER: Order = {
  id: 'SIG-2026-77218',
  date: '24 Oct 2026',
  customer: {
    fullName: 'Bramandi Romadhon',
    email: 'bramandiromadhon@gmail.com',
    phone: '0812-8945-6722',
    address: 'Apartemen Senopati Suites Tower 2 Unit 18B, Jl. Senopati No. 41',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    postalCode: '12190',
    notes: 'Please hand over to lobby concierge if recipient is unavailable',
  },
  items: [
    {
      id: 'shoes-01-EU42-MuseumBlack',
      product: PRODUCTS[13], // Sigma Goodyear-Welted Oxford Brogues
      size: 'EU 42',
      color: { name: 'Museum Black', hex: '#111111' },
      quantity: 1,
    },
    {
      id: 'fragrance-01-100ml-AmberGold',
      product: PRODUCTS[40], // Sigma Ambre & Chêne Extrait de Parfum
      size: '100ml Extrait',
      color: { name: 'Amber Gold', hex: '#B87A36' },
      quantity: 1,
    },
  ],
  subtotal: 13750000,
  discount: 1000000,
  shippingFee: 0,
  total: 12750000,
  courier: {
    id: 'paxel_luxury',
    name: 'Paxel White-Glove',
    service: 'Luxury Vault Next-Day',
    cost: 55000,
    etd: 'Delivered',
  },
  payment: {
    type: 'va',
    provider: 'BCA Virtual Account',
    vaNumber: '8277 0812 8945 6722',
    paidAt: '24 Oct 2026, 09:14 WIB',
  },
  status: 'out_for_delivery',
  trackingNumber: 'PXL-889214022ID',
  estimatedDelivery: 'Today by 14:00 WIB',
  timeline: [
    {
      title: 'Order Placed & Confirmed',
      time: '24 Oct 2026, 09:10 WIB',
      location: 'Sigma E-Commerce Platform',
      description: 'Order SIG-2026-77218 successfully verified with electronic signature.',
      completed: true,
    },
    {
      title: 'Payment Settled via BCA VA',
      time: '24 Oct 2026, 09:14 WIB',
      location: 'Bank Central Asia Gateway',
      description: 'Payment of Rp 12.750.000 settled automatically. Electronic receipt issued.',
      completed: true,
    },
    {
      title: 'White-Glove QC & Velvet Packaging',
      time: '24 Oct 2026, 11:30 WIB',
      location: 'Pacific Place Atelier SCBD, Jakarta',
      description: 'Items inspected under daylight lamp. Hologram tamper seal applied.',
      completed: true,
    },
    {
      title: 'Dispatched to Paxel Vault Courier',
      time: '24 Oct 2026, 15:45 WIB',
      location: 'Central Jakarta Distribution Hub',
      description: 'Waybill PXL-889214022ID logged. Handed to armored vehicle transit.',
      completed: true,
    },
    {
      title: 'Arrival at Sorting Center Jakarta Selatan',
      time: '25 Oct 2026, 07:20 WIB',
      location: 'Paxel Hub Kebayoran Baru',
      description: 'Package sorted to South Jakarta VIP route.',
      completed: true,
    },
    {
      title: 'Courier on Delivery Route',
      time: '25 Oct 2026, 09:15 WIB',
      location: 'Jl. Senopati / SCBD Area',
      description: 'Paxel Courier Mas Dimas is en route to Apartemen Senopati Suites Tower 2.',
      completed: true,
    },
    {
      title: 'Delivered & Signed by Recipient',
      time: 'Pending Delivery',
      location: 'Apartemen Senopati Suites Lobby',
      description: 'Recipient signature and live photograph upon handover.',
      completed: false,
    },
  ],
};

export default function App() {
  // Navigation & Category filter state
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number } | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      return saved ? JSON.parse(saved) : [SAMPLE_INITIAL_ORDER];
    } catch {
      return [SAMPLE_INITIAL_ORDER];
    }
  });

  // Reviews state
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REVIEWS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Refund requests state
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);

  // Modals & Views
  const [activeModal, setActiveModal] = useState<
    'none' | 'product-detail' | 'cart' | 'checkout' | 'payment-processing' | 'order-tracking' | 'help'
  >('none');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [prefilledRefundOrder, setPrefilledRefundOrder] = useState<Order | null>(null);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Cart actions
  const handleAddToCart = (
    product: Product,
    size: string,
    color: { name: string; hex: string },
    quantity: number
  ) => {
    const cartItemId = `${product.id}-${size}-${color.name.replace(/\s+/g, '')}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: cartItemId, product, size, color, quantity }];
    });
  };

  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes[0] || 'Standard';
    const defaultColor = product.colors[0] || { name: 'Standard', hex: '#111' };
    handleAddToCart(product, defaultSize, defaultColor, 1);
    setActiveModal('cart');
  };

  const handleBuyNow = (
    product: Product,
    size: string,
    color: { name: string; hex: string },
    quantity: number
  ) => {
    handleAddToCart(product, size, color, quantity);
    setActiveModal('checkout');
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Promo actions
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleApplyPromo = (code: string) => {
    if (code === 'SIGMA10') {
      const disc = Math.round(cartSubtotal * 0.1);
      setAppliedPromo({ code, discountAmount: disc });
      return { success: true, message: `10% VIP Discount (-Rp ${disc.toLocaleString('id-ID')}) applied!` };
    }
    if (code === 'WELCOME1M') {
      setAppliedPromo({ code, discountAmount: 1000000 });
      return { success: true, message: 'Welcome voucher of Rp 1.000.000 applied!' };
    }
    if (code === 'BEBASONGKIR') {
      setAppliedPromo({ code, discountAmount: 0 });
      return { success: true, message: 'Complimentary Free Express Shipping unlocked!' };
    }
    return { success: false, message: 'Invalid voucher code. Try SIGMA10 or WELCOME1M.' };
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Checkout and Order Generation
  const handleCompleteOrder = (
    customerInfo: CustomerInfo,
    courier: DeliveryCourier,
    paymentDetails: PaymentDetails,
    shippingFee: number,
    finalTotal: number
  ) => {
    const orderId = generateOrderId();
    const trackingNumber = generateTrackingNumber(courier.name);

    const initialTimeline: TrackingStep[] = [
      {
        title: 'Order Placed & Confirmed',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        location: 'Sigma E-Commerce Platform',
        description: `Order ${orderId} created by ${customerInfo.fullName}. Awaiting payment settlement.`,
        completed: true,
      },
      {
        title: 'Payment Verification',
        time: 'Pending Transaction',
        location: `${paymentDetails.provider} Gateway`,
        description: `Awaiting payment confirmation for ${paymentDetails.provider}.`,
        completed: false,
      },
      {
        title: 'Atelier Packaging & Quality Check',
        time: 'Scheduled after payment',
        location: 'SCBD Fulfillment Center, Jakarta',
        description: 'Piece inspection, dustbag placement, and security seal application.',
        completed: false,
      },
      {
        title: 'Courier Pick Up',
        time: 'Scheduled',
        location: `${courier.name} Logistics Center`,
        description: `Waybill ${trackingNumber} assigned for insured transport.`,
        completed: false,
      },
      {
        title: 'In Transit',
        time: 'Estimated ' + courier.etd,
        location: `${customerInfo.city} Hub`,
        description: `En route to recipient address in ${customerInfo.city}, ${customerInfo.province}.`,
        completed: false,
      },
      {
        title: 'Delivered',
        time: 'Pending',
        location: customerInfo.address,
        description: 'Recipient signature upon handover.',
        completed: false,
      },
    ];

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      customer: customerInfo,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: appliedPromo ? appliedPromo.discountAmount : 0,
      shippingFee,
      total: finalTotal,
      courier,
      payment: paymentDetails,
      status: 'payment_pending',
      trackingNumber,
      estimatedDelivery: courier.etd,
      timeline: initialTimeline,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setCart([]);
    setAppliedPromo(null);
    setActiveModal('payment-processing');
  };

  // Payment simulated success
  const handlePaymentSuccess = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedTimeline = o.timeline.map((step, idx) => {
            if (idx === 1) {
              return {
                ...step,
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                description: `Payment settled via ${o.payment.provider}. Authentic invoice generated.`,
                completed: true,
              };
            }
            if (idx === 2) {
              return {
                ...step,
                time: 'In Progress',
                description: 'Master tailor inspecting garments. Hologram seal applied.',
                completed: true,
              };
            }
            return step;
          });
          return {
            ...o,
            status: 'processing',
            timeline: updatedTimeline,
          };
        }
        return o;
      })
    );
  };

  // Simulation: Advance delivery step
  const handleAdvanceOrderStep = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          // Find first non-completed step
          const stepIndex = o.timeline.findIndex((s) => !s.completed);
          if (stepIndex === -1) return o;

          const updatedTimeline = [...o.timeline];
          updatedTimeline[stepIndex] = {
            ...updatedTimeline[stepIndex],
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            completed: true,
          };

          let newStatus: Order['status'] = o.status;
          if (stepIndex === 1) newStatus = 'payment_verified';
          else if (stepIndex === 2) newStatus = 'processing';
          else if (stepIndex === 3) newStatus = 'shipped';
          else if (stepIndex === 4) newStatus = 'out_for_delivery';
          else if (stepIndex === 5) newStatus = 'delivered';

          return {
            ...o,
            status: newStatus,
            timeline: updatedTimeline,
          };
        }
        return o;
      })
    );
  };

  // Add customer review
  const handleAddReview = (newRev: Omit<CustomerReview, 'id' | 'date' | 'verified'>) => {
    const reviewObj: CustomerReview = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      verified: true,
    };
    setReviews((prev) => [reviewObj, ...prev]);
  };

  // Submit refund request
  const handleSubmitRefund = (req: RefundRequest) => {
    setRefundRequests((prev) => [req, ...prev]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#121212] selection:bg-[#121212] selection:text-[#FAF9F6]">
      {/* Top Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setActiveModal('cart')}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (activeModal === 'order-tracking') setActiveModal('none');
        }}
        selectedCategory={selectedCategory}
        onOpenTracking={() => {
          setCurrentOrder(orders[0] || null);
          setActiveModal('order-tracking');
        }}
        onOpenHelp={() => setActiveModal('help')}
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        isSearchOpen={isSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Condition: Storefront or Order Tracking Dashboard */}
      {activeModal === 'order-tracking' ? (
        <OrderTrackingDashboard
          orders={orders}
          currentOrderId={currentOrder?.id}
          onSelectOrder={(id) => {
            const found = orders.find((o) => o.id === id);
            if (found) setCurrentOrder(found);
          }}
          onAdvanceOrderStep={handleAdvanceOrderStep}
          onOpenRefundModal={(order) => {
            setPrefilledRefundOrder(order);
            setActiveModal('help');
          }}
          onClose={() => setActiveModal('none')}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Banner with Generated Runway Campaign Image */}
          <HeroBanner
            onExplore={() => {
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Curated Category Showcase (5 Disciplines) */}
          <CategoryShowcase
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            selectedCategory={selectedCategory}
          />

          {/* Main 66+ Product Catalog Grid */}
          <ProductGrid
            products={PRODUCTS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onViewDetails={(prod) => {
              setSelectedProduct(prod);
              setActiveModal('product-detail');
            }}
            onQuickAdd={handleQuickAdd}
          />
        </main>
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (activeModal === 'order-tracking') setActiveModal('none');
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
        onOpenTracking={() => {
          setCurrentOrder(orders[0] || null);
          setActiveModal('order-tracking');
        }}
        onOpenHelp={() => setActiveModal('help')}
      />

      {/* Floating Concierge Chat */}
      <ConciergeLiveChat
        onOpenTracking={() => {
          setCurrentOrder(orders[0] || null);
          setActiveModal('order-tracking');
        }}
        onOpenHelp={() => setActiveModal('help')}
      />

      {/* Product Detail Modal */}
      {activeModal === 'product-detail' && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setActiveModal('none')}
          onAddToCart={(prod, size, color, qty) => {
            handleAddToCart(prod, size, color, qty);
          }}
          onBuyNow={(prod, size, color, qty) => {
            handleBuyNow(prod, size, color, qty);
          }}
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={activeModal === 'cart'}
        onClose={() => setActiveModal('none')}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setActiveModal('checkout')}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Checkout Modal */}
      {activeModal === 'checkout' && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setActiveModal('none')}
          items={cart}
          subtotal={cartSubtotal}
          discount={appliedPromo ? appliedPromo.discountAmount : 0}
          onCompleteOrder={handleCompleteOrder}
        />
      )}

      {/* Payment Processing & Settlement Simulation Modal */}
      {activeModal === 'payment-processing' && currentOrder && (
        <PaymentProcessingModal
          order={currentOrder}
          onPaymentSuccess={handlePaymentSuccess}
          onViewOrderTracking={(orderId) => {
            const found = orders.find((o) => o.id === orderId);
            if (found) setCurrentOrder(found);
            setActiveModal('order-tracking');
          }}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* Customer Help, Call Center, and Refund Modal */}
      {activeModal === 'help' && (
        <CustomerHelpModal
          isOpen={true}
          onClose={() => {
            setActiveModal('none');
            setPrefilledRefundOrder(null);
          }}
          orders={orders}
          prefilledOrder={prefilledRefundOrder}
          onSubmitRefund={handleSubmitRefund}
          refundRequests={refundRequests}
        />
      )}
    </div>
  );
}
