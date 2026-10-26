import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, MapPin, Copy, Check, ArrowRight, RotateCcw, FileText, ChevronRight } from 'lucide-react';
import { Order } from '../types';
import { formatIDR } from '../utils/formatters';

interface OrderTrackingDashboardProps {
  orders: Order[];
  currentOrderId?: string;
  onSelectOrder: (orderId: string) => void;
  onAdvanceOrderStep: (orderId: string) => void;
  onOpenRefundModal: (order: Order) => void;
  onClose: () => void;
}

export const OrderTrackingDashboard: React.FC<OrderTrackingDashboardProps> = ({
  orders,
  currentOrderId,
  onSelectOrder,
  onAdvanceOrderStep,
  onOpenRefundModal,
  onClose,
}) => {
  const [searchInput, setSearchInput] = useState(currentOrderId || (orders[0]?.id ?? ''));
  const [copiedResi, setCopiedResi] = useState(false);

  const selectedOrder = orders.find((o) => o.id.toUpperCase() === searchInput.trim().toUpperCase()) || orders[0];

  const handleCopyResi = (resi: string) => {
    navigator.clipboard.writeText(resi);
    setCopiedResi(true);
    setTimeout(() => setCopiedResi(false), 2000);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'payment_pending':
        return <span className="bg-amber-100 text-amber-900 px-2.5 py-1 text-xs font-mono font-medium">Payment Pending</span>;
      case 'payment_verified':
        return <span className="bg-blue-100 text-blue-900 px-2.5 py-1 text-xs font-mono font-medium">Payment Verified</span>;
      case 'processing':
        return <span className="bg-purple-100 text-purple-900 px-2.5 py-1 text-xs font-mono font-medium">Artisan Packing & QC</span>;
      case 'shipped':
        return <span className="bg-indigo-100 text-indigo-900 px-2.5 py-1 text-xs font-mono font-medium">In Transit via Courier</span>;
      case 'out_for_delivery':
        return <span className="bg-orange-100 text-orange-900 px-2.5 py-1 text-xs font-mono font-medium">Out for Delivery</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 text-xs font-mono font-medium">Delivered & Signed</span>;
      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen bg-[#FAF9F6] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#E8E4DB] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#8C877D] font-mono">
              <Package className="w-4 h-4 text-[#121212]" />
              <span>SIGMA LOGISTICS DASHBOARD</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#121212] mt-1">
              Live Order Tracking & Delivery Status
            </h1>
            <p className="text-xs sm:text-sm text-[#7A756D] mt-1">
              Real-time courier telemetry, waypoint tracking, and authenticated digital receipts across Indonesia.
            </p>
          </div>

          <button
            onClick={onClose}
            className="self-start md:self-auto px-4 py-2 border border-[#121212] text-[#121212] text-xs uppercase tracking-wider font-semibold hover:bg-[#121212] hover:text-white transition-colors"
          >
            ← Back to Storefront
          </button>
        </div>

        {/* Search Bar / Order Switcher */}
        <div className="bg-white p-4 border border-[#E0DBD2] shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#888] absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Sigma Order ID (e.g. SIG-2026-88412)..."
                className="w-full pl-9 pr-3 py-2.5 border border-[#D9D4CB] text-xs font-mono uppercase focus:outline-none focus:border-[#121212]"
              />
            </div>
            <button
              onClick={() => {
                if (selectedOrder) onSelectOrder(selectedOrder.id);
              }}
              className="px-6 py-2.5 bg-[#121212] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#333] transition-colors"
            >
              Track Order
            </button>
          </div>

          {/* Quick Select among recent orders */}
          {orders.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F0EBE1] text-xs text-[#7A756D] overflow-x-auto no-scrollbar">
              <span className="font-medium text-[#121212] shrink-0">Recent Orders:</span>
              {orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSearchInput(o.id)}
                  className={`px-2.5 py-1 font-mono text-[11px] border transition-colors whitespace-nowrap ${
                    selectedOrder?.id === o.id
                      ? 'border-[#121212] bg-[#121212] text-white'
                      : 'border-[#DDD] bg-[#FAF9F6] text-[#444] hover:border-[#121212]'
                  }`}
                >
                  {o.id} ({o.items.length} items)
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedOrder ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Cols: Interactive Tracking Timeline */}
            <div className="lg:col-span-7 space-y-6">
              {/* Order Status Headline Card */}
              <div className="bg-white p-6 border border-[#E0DBD2] shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EFECE6]">
                  <div>
                    <span className="text-[10px] text-[#8C877D] uppercase font-mono block">Order Reference</span>
                    <span className="font-mono text-xl font-bold text-[#121212]">{selectedOrder.id}</span>
                  </div>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>

                {/* Waybill / Resi Banner */}
                <div className="mt-4 p-3 bg-[#FAF9F6] border border-[#E8E4DB] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8C877D] block">
                      Courier & Waybill (Nomor Resi)
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-xs text-[#121212]">{selectedOrder.courier.name}</span>
                      <span className="font-mono text-xs text-[#555] bg-white px-2 py-0.5 border border-[#DDD]">
                        {selectedOrder.trackingNumber}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyResi(selectedOrder.trackingNumber)}
                    className="px-2.5 py-1.5 border border-[#CCC] hover:border-[#121212] bg-white text-xs text-[#121212] flex items-center gap-1.5 transition-colors"
                  >
                    {copiedResi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedResi ? 'Resi Copied' : 'Copy Resi'}</span>
                  </button>
                </div>

                {/* Simulation Control (Testing the delivery step progression!) */}
                <div className="mt-4 pt-4 border-t border-[#EFECE6] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#7A756D]">
                    Experience live courier tracking updates:
                  </span>
                  <button
                    onClick={() => onAdvanceOrderStep(selectedOrder.id)}
                    disabled={selectedOrder.status === 'delivered'}
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C29E2E] text-[#121212] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Advance Next Delivery Step</span>
                  </button>
                </div>
              </div>

              {/* Waypoint Timeline */}
              <div className="bg-white p-6 border border-[#E0DBD2] shadow-sm">
                <h3 className="font-serif-display text-base font-semibold text-[#121212] uppercase tracking-wider mb-6 pb-2 border-b border-[#ECE7DE]">
                  Real-Time Courier Waypoints & Checkpoints
                </h3>

                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E0DBD2]">
                  {selectedOrder.timeline.map((step, idx) => {
                    return (
                      <div key={idx} className="relative group">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 transition-colors ${
                            step.completed
                              ? 'bg-[#121212] border-[#121212] text-white'
                              : 'bg-white border-[#CCC]'
                          }`}
                        >
                          {step.completed && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-0.5" />
                          )}
                        </div>

                        {/* Event Content */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                          <div>
                            <h4
                              className={`text-xs font-semibold uppercase tracking-wider ${
                                step.completed ? 'text-[#121212]' : 'text-[#8C877D]'
                              }`}
                            >
                              {step.title}
                            </h4>
                            <p className="text-xs text-[#5E5A54] mt-0.5 leading-relaxed">
                              {step.description}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] text-[#8C877D] mt-1 font-mono">
                              <MapPin className="w-3 h-3 text-[#121212]" />
                              <span>{step.location}</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono text-[11px] text-[#7A756D] tabular-nums">
                              {step.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Items, Shipping Address & Receipt */}
            <div className="lg:col-span-5 space-y-6">
              {/* Delivery Destination Card */}
              <div className="bg-white p-6 border border-[#E0DBD2] shadow-sm space-y-3">
                <h3 className="font-serif-display text-base font-semibold text-[#121212] uppercase tracking-wider pb-2 border-b border-[#ECE7DE]">
                  Recipient & Destination
                </h3>

                <div className="text-xs space-y-1.5 text-[#555]">
                  <div className="font-semibold text-sm text-[#121212]">
                    {selectedOrder.customer.fullName}
                  </div>
                  <div className="text-[#6E6A63]">
                    {selectedOrder.customer.address}
                  </div>
                  <div>
                    {selectedOrder.customer.city}, {selectedOrder.customer.province} {selectedOrder.customer.postalCode}
                  </div>
                  <div className="font-mono text-[#121212] pt-1">
                    WhatsApp: {selectedOrder.customer.phone}
                  </div>
                  {selectedOrder.customer.notes && (
                    <div className="p-2 bg-[#FAF9F6] border border-[#ECE7DE] text-[11px] text-[#7A756D] mt-2">
                      <strong>Courier Note:</strong> {selectedOrder.customer.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items & Financials */}
              <div className="bg-white p-6 border border-[#E0DBD2] shadow-sm space-y-4">
                <h3 className="font-serif-display text-base font-semibold text-[#121212] uppercase tracking-wider pb-2 border-b border-[#ECE7DE]">
                  Items Ordered ({selectedOrder.items.length})
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <div className="w-12 h-14 bg-[#FAF9F6] border border-[#DDD] shrink-0 overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[#121212]">{item.product.name}</div>
                        <div className="text-[11px] text-[#7A756D] font-mono">
                          Size: {item.size} · Color: {item.color.name} · Qty: {item.quantity}
                        </div>
                        <div className="font-mono text-xs text-[#121212] font-medium mt-0.5">
                          {formatIDR(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 pt-3 border-t border-[#EFECE6] text-xs">
                  <div className="flex justify-between text-[#555]">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums text-[#121212]">{formatIDR(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Voucher Discount</span>
                      <span className="font-mono tabular-nums">-{formatIDR(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#555]">
                    <span>Courier ({selectedOrder.courier.name})</span>
                    <span className="font-mono tabular-nums text-[#121212]">
                      {selectedOrder.shippingFee === 0 ? 'Complimentary' : formatIDR(selectedOrder.shippingFee)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#DDD] flex justify-between text-sm font-bold text-[#121212]">
                    <span>Total Paid</span>
                    <span className="font-mono tabular-nums text-base">{formatIDR(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Actions: Download Invoice & Request Return */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full py-2.5 border border-[#CCC] hover:border-[#121212] text-xs font-semibold uppercase tracking-wider text-[#121212] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Print Tax Invoice & Seal Certificate</span>
                  </button>

                  <button
                    onClick={() => onOpenRefundModal(selectedOrder)}
                    className="w-full py-2.5 bg-[#FAF9F6] hover:bg-[#EAE5DC] border border-[#D9D4CB] text-xs font-semibold uppercase tracking-wider text-[#555] hover:text-[#121212] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Request 14-Day Return / Refund</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-[#E0DBD2]">
            <p className="font-serif-display text-lg text-[#121212] mb-2">No Order Selected</p>
            <p className="text-xs text-[#7A756D] mb-4">Please input a valid Order ID or place a new order from our catalog.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#121212] text-white text-xs uppercase tracking-wider font-semibold"
            >
              Browse Catalog
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
