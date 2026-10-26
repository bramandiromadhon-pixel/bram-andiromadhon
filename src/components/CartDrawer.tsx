import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { formatIDR } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: { code: string; discountAmount: number } | null;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  // Free delivery over Rp 3.000.000
  const isFreeDelivery = subtotal >= 3000000 || (appliedPromo && appliedPromo.code === 'BEBASONGKIR');
  const estimatedShipping = items.length === 0 ? 0 : (isFreeDelivery ? 0 : 45000);
  const total = Math.max(0, subtotal - discount + estimatedShipping);

  const freeDeliveryThreshold = 3000000;
  const remainingForFreeShipping = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (!promoCodeInput.trim()) return;

    const res = onApplyPromo(promoCodeInput.trim().toUpperCase());
    if (res.success) {
      setPromoSuccess(res.message);
      setPromoCodeInput('');
    } else {
      setPromoError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#DDD] shadow-2xl flex flex-col justify-between">
          {/* Drawer Top Header */}
          <div className="px-6 py-4 border-b border-[#E8E4DB] flex items-center justify-between bg-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#121212]" />
              <span className="font-serif-display text-lg font-semibold tracking-wide text-[#121212]">
                Your Shopping Bag
              </span>
              <span className="font-mono text-xs text-[#8C877D]">
                ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#555] hover:text-[#121212] rounded-full hover:bg-[#EAE5DC]"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {items.length > 0 && (
            <div className="bg-[#121212] text-white px-6 py-2.5 text-xs">
              <div className="flex items-center justify-between mb-1 text-[11px]">
                {isFreeDelivery ? (
                  <span className="text-[#D4AF37] font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Complimentary White-Glove Delivery Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="font-mono text-[#D4AF37]">{formatIDR(remainingForFreeShipping)}</strong> for Free Delivery
                  </span>
                )}
                <span className="font-mono text-[10px] text-[#AAA]">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-[#333] h-1 rounded-full overflow-hidden">
                <div
                  className="bg-[#D4AF37] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#EFECE6]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7A756D]">
                <ShoppingBag className="w-12 h-12 stroke-[1.2] text-[#CCC] mb-3" />
                <p className="font-serif-display text-lg text-[#121212] mb-1">
                  Your bag is empty
                </p>
                <p className="text-xs text-[#8C877D] max-w-xs mb-6 leading-relaxed">
                  Discover our architectural tailoring, fine extraits, and handcrafted footwear.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#121212] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#333]"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                  {/* Item Image */}
                  <div className="w-20 h-24 bg-[#F5F2EB] shrink-0 border border-[#EBE6DD] overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif-display text-xs sm:text-sm font-semibold text-[#121212] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#9E998E] hover:text-red-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant metadata */}
                      <div className="flex items-center gap-2 text-[11px] text-[#7A756D] font-mono mt-0.5">
                        <span>Size: {item.size}</span>
                        <span>·</span>
                        <span>{item.color.name}</span>
                      </div>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5F2EB]">
                      <div className="inline-flex items-center border border-[#DDD] bg-[#FAF9F6]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#555] hover:bg-[#EAE5DC]"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-[#121212]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#555] hover:bg-[#EAE5DC]"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-[#121212] tabular-nums">
                        {formatIDR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 bg-[#FAF9F6] border-t border-[#E8E4DB] space-y-4">
              {/* Promo Code Input */}
              <div>
                {!appliedPromo ? (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-[#888] absolute left-2.5 top-3" />
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="Voucher code (try SIGMA10 or WELCOME1M)"
                        className="w-full text-xs pl-8 pr-2 py-2 bg-white border border-[#D9D4CB] uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-[#121212]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#121212] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#333]"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{appliedPromo.code} applied (-{formatIDR(appliedPromo.discountAmount)})</span>
                    </div>
                    <button
                      onClick={onRemovePromo}
                      className="text-emerald-700 hover:text-emerald-900 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-600 mt-1">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-[11px] text-emerald-700 mt-1">{promoSuccess}</p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-[#555] font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#121212] font-semibold tabular-nums">{formatIDR(subtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Voucher Discount</span>
                    <span className="font-mono font-semibold tabular-nums">-{formatIDR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Courier Delivery</span>
                  <span className="font-mono text-[#121212] tabular-nums">
                    {estimatedShipping === 0 ? 'Complimentary' : formatIDR(estimatedShipping)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#DDD] flex justify-between text-sm sm:text-base font-bold text-[#121212]">
                  <span className="font-serif-display">Total Amount</span>
                  <span className="font-mono tabular-nums">{formatIDR(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#121212] hover:bg-[#2A2927] text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-[#8C877D]">
                Secure 256-bit encrypted Indonesian payment gateway · 14-day returns
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
