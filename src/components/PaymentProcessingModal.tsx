import React, { useState, useEffect } from 'react';
import { CheckCircle, Copy, Check, Clock, QrCode, ShieldCheck, ArrowRight, Download, Package } from 'lucide-react';
import { Order } from '../types';
import { formatIDR } from '../utils/formatters';

interface PaymentProcessingModalProps {
  order: Order | null;
  onPaymentSuccess: (orderId: string) => void;
  onViewOrderTracking: (orderId: string) => void;
  onClose: () => void;
}

export const PaymentProcessingModal: React.FC<PaymentProcessingModalProps> = ({
  order,
  onPaymentSuccess,
  onViewOrderTracking,
  onClose,
}) => {
  if (!order) return null;

  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(order.status !== 'payment_pending');
  const [secondsRemaining, setSecondsRemaining] = useState(900); // 15 mins

  useEffect(() => {
    if (isConfirmed) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isConfirmed]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const handleCopyVA = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
      onPaymentSuccess(order.id);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-[#DDD] shadow-2xl overflow-hidden my-auto">
        {!isConfirmed ? (
          /* Payment Step */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#ECE7DE]">
              <div>
                <span className="text-[10px] tracking-widest text-[#8C877D] uppercase font-mono block">
                  Indonesian Payment Gateway
                </span>
                <h3 className="font-serif-display text-xl sm:text-2xl font-semibold text-[#121212]">
                  Complete Payment for Order {order.id}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#8C877D] uppercase block">Time Remaining</span>
                <div className="flex items-center gap-1 font-mono text-sm font-bold text-red-600 tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Due Banner */}
            <div className="p-4 bg-[#FAF9F6] border border-[#E8E4DB] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#7A756D] uppercase tracking-wider block">Total Amount Due</span>
                <span className="font-mono text-2xl font-bold text-[#121212] tabular-nums">
                  {formatIDR(order.total)}
                </span>
              </div>
              <div className="text-right text-xs">
                <span className="text-[#7A756D] block">Method</span>
                <span className="font-semibold text-[#121212]">{order.payment.provider}</span>
              </div>
            </div>

            {/* QRIS Screen */}
            {order.payment.type === 'qris' && (
              <div className="flex flex-col items-center justify-center text-center p-6 bg-[#FAF9F6] border border-[#E8E4DB] space-y-4">
                <div className="p-4 bg-white border-2 border-[#121212] shadow-sm inline-block">
                  {/* SVG generated QR Code simulation */}
                  <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    {/* Top Left Marker */}
                    <rect x="10" y="10" width="24" height="24" stroke="black" strokeWidth="4" />
                    <rect x="16" y="16" width="12" height="12" fill="black" />
                    {/* Top Right Marker */}
                    <rect x="66" y="10" width="24" height="24" stroke="black" strokeWidth="4" />
                    <rect x="72" y="16" width="12" height="12" fill="black" />
                    {/* Bottom Left Marker */}
                    <rect x="10" y="66" width="24" height="24" stroke="black" strokeWidth="4" />
                    <rect x="16" y="72" width="12" height="12" fill="black" />
                    {/* Data matrix dots */}
                    <rect x="40" y="12" width="6" height="6" fill="black" />
                    <rect x="50" y="18" width="6" height="6" fill="black" />
                    <rect x="42" y="28" width="6" height="6" fill="black" />
                    <rect x="52" y="34" width="6" height="6" fill="black" />
                    <rect x="12" y="42" width="6" height="6" fill="black" />
                    <rect x="24" y="48" width="6" height="6" fill="black" />
                    <rect x="38" y="44" width="6" height="6" fill="black" />
                    <rect x="50" y="48" width="8" height="8" fill="black" />
                    <rect x="68" y="42" width="6" height="6" fill="black" />
                    <rect x="80" y="48" width="6" height="6" fill="black" />
                    <rect x="42" y="60" width="6" height="6" fill="black" />
                    <rect x="54" y="66" width="6" height="6" fill="black" />
                    <rect x="42" y="76" width="6" height="6" fill="black" />
                    <rect x="66" y="68" width="6" height="6" fill="black" />
                    <rect x="76" y="74" width="6" height="6" fill="black" />
                    <rect x="68" y="84" width="6" height="6" fill="black" />
                    <rect x="82" y="84" width="6" height="6" fill="black" />
                    {/* Center Sigma Logo Badge */}
                    <rect x="42" y="42" width="16" height="16" fill="#121212" />
                    <text x="50" y="53" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="serif">Σ</text>
                  </svg>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-xs text-[#121212]">
                    Scan QRIS with BCA, Mandiri Livin, GoPay, OVO, or Dana
                  </span>
                  <p className="text-[11px] text-[#7A756D] max-w-sm">
                    Open your banking or e-wallet application, scan this QR code, and verify transaction amount of {formatIDR(order.total)}.
                  </p>
                </div>
              </div>
            )}

            {/* Virtual Account Screen */}
            {order.payment.type === 'va' && (
              <div className="p-6 bg-[#FAF9F6] border border-[#E8E4DB] space-y-4">
                <span className="text-xs uppercase tracking-wider text-[#7A756D] block">
                  {order.payment.provider} Number
                </span>
                <div className="flex items-center justify-between p-3 bg-white border border-[#D9D4CB]">
                  <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-[#121212] select-all">
                    {order.payment.vaNumber || '8277 0812 8945 6722'}
                  </span>
                  <button
                    onClick={() => handleCopyVA(order.payment.vaNumber || '8277081289456722')}
                    className="p-2 text-xs font-semibold uppercase tracking-wider border border-[#CCC] hover:border-[#121212] flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy VA'}</span>
                  </button>
                </div>

                <div className="text-xs text-[#555] space-y-1 pt-2">
                  <p className="font-medium text-[#121212]">How to Pay via Mobile Banking:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-[#6E6A63]">
                    <li>Open your bank's m-banking app (e.g. BCA Mobile, Livin by Mandiri).</li>
                    <li>Select <strong>m-Transfer</strong> → <strong>Virtual Account</strong>.</li>
                    <li>Paste or enter the VA number above.</li>
                    <li>Confirm the recipient shows <strong>PT SIGMA MODA INDONESIA</strong>.</li>
                    <li>Enter your PIN and complete transaction.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Card & Others */}
            {(order.payment.type === 'card' || order.payment.type === 'paylater') && (
              <div className="p-6 bg-[#FAF9F6] border border-[#E8E4DB] text-center space-y-3">
                <ShieldCheck className="w-8 h-8 text-[#121212] mx-auto" />
                <h4 className="font-serif-display text-base font-semibold text-[#121212]">
                  3D Secure Verification Ready
                </h4>
                <p className="text-xs text-[#7A756D] max-w-md mx-auto">
                  Clicking the button below verifies OTP authorization directly with your issuing card bank / PayLater provider.
                </p>
              </div>
            )}

            {/* Interactive Simulation / Confirmation CTA */}
            <div className="pt-2">
              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-4 bg-[#121212] hover:bg-[#2A2927] text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2 font-mono">
                    <span className="animate-spin">◌</span>
                    Verifying Payment with Bank Indonesia...
                  </span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span>I Have Completed Payment (Simulate Immediate Settlement)</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs text-[#8C877D] hover:text-[#121212] transition-colors mt-2 text-center"
              >
                Pay Later (Will hold items for 15 minutes)
              </button>
            </div>
          </div>
        ) : (
          /* Order Confirmed Screen */
          <div className="p-6 sm:p-10 space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9 stroke-[2]" />
            </div>

            <div>
              <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-mono block">
                PAYMENT VERIFIED & SETTLED
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#121212] mt-1">
                Thank You, {order.customer.fullName}
              </h2>
              <p className="text-xs sm:text-sm text-[#7A756D] mt-2 max-w-md mx-auto">
                Your order has been officially received and dispatched to our SCBD Jakarta Atelier for artisan packaging and white-glove courier pickup.
              </p>
            </div>

            {/* Order Identifiers Card */}
            <div className="p-5 bg-[#FAF9F6] border border-[#E8E4DB] text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-[#8C877D] uppercase font-mono block">Official Order ID</span>
                <span className="font-mono text-base font-bold text-[#121212]">{order.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8C877D] uppercase font-mono block">Waybill / Resi Number</span>
                <span className="font-mono text-base font-bold text-[#121212]">{order.trackingNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8C877D] uppercase font-mono block">Courier Service</span>
                <span className="font-medium text-[#121212]">{order.courier.name} ({order.courier.service})</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8C877D] uppercase font-mono block">Estimated Arrival</span>
                <span className="font-medium text-emerald-700 font-mono">{order.estimatedDelivery}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onViewOrderTracking(order.id)}
                className="flex-1 py-3.5 px-4 bg-[#121212] text-white hover:bg-[#2A2927] text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4 text-[#D4AF37]" />
                <span>Track Delivery in Dedicated Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="py-3.5 px-6 border border-[#DDD] hover:border-[#121212] text-[#121212] text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                Back to Boutique
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
