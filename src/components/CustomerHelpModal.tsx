import React, { useState } from 'react';
import { X, Phone, MessageCircle, Clock, MapPin, RotateCcw, ShieldAlert, CheckCircle, ChevronDown, HelpCircle, Send } from 'lucide-react';
import { Order, RefundRequest } from '../types';

interface CustomerHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  prefilledOrder?: Order | null;
  onSubmitRefund: (request: RefundRequest) => void;
  refundRequests: RefundRequest[];
}

export const CustomerHelpModal: React.FC<CustomerHelpModalProps> = ({
  isOpen,
  onClose,
  orders,
  prefilledOrder,
  onSubmitRefund,
  refundRequests,
}) => {
  const [activeTab, setActiveTab] = useState<'contact' | 'refund-rules' | 'submit-refund' | 'faq'>('contact');

  // Refund Form states
  const [orderId, setOrderId] = useState(prefilledOrder?.id || (orders[0]?.id ?? ''));
  const [customerName, setCustomerName] = useState(prefilledOrder?.customer.fullName || 'Bramandi Romadhon');
  const [email, setEmail] = useState(prefilledOrder?.customer.email || 'bramandiromadhon@gmail.com');
  const [phone, setPhone] = useState(prefilledOrder?.customer.phone || '081289456722');
  const [bankName, setBankName] = useState('BCA (Bank Central Asia)');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState(prefilledOrder?.customer.fullName || 'Bramandi Romadhon');
  const [reason, setReason] = useState('Size exchange needed (Too small/large)');
  const [itemsDesc, setItemsDesc] = useState('');
  const [submittedCase, setSubmittedCase] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const handleSubmitRefundForm = (e: React.FormEvent) => {
    e.preventDefault();
    const caseId = `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: RefundRequest = {
      id: caseId,
      orderId: orderId || (orders[0]?.id ?? 'SIG-2026-MANUAL'),
      customerName,
      email,
      phone,
      bankName,
      accountNumber,
      accountHolder,
      reason,
      itemsDescription: itemsDesc || 'Request for refund & return of ordered pieces',
      submittedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'submitted',
    };
    onSubmitRefund(newRequest);
    setSubmittedCase(caseId);
  };

  const faqs = [
    {
      q: 'Are all Sigma products 100% authentic with warranty?',
      a: 'Yes. Every piece across all categories—from Savile Row tailored barathea suits to Grasse extraits and Goodyear-welted brogues—is imported directly from verified master ateliers. All shipments feature a tamper-evident holographic serial seal.'
    },
    {
      q: 'How does the 14-Day Return & Size Exchange policy work?',
      a: 'We offer hassle-free 14-day returns across Indonesia. The item must be unworn, with the original Sigma security seal and fabric tags attached. In accordance with Indonesian luxury standards, please retain a brief unboxing video when first opening the package.'
    },
    {
      q: 'How fast will my refund be transferred to my Indonesian bank account?',
      a: 'Once our SCBD inspection atelier verifies the returned piece (1-2 business days), refunds via Virtual Account, Bank Transfer, or QRIS are processed within 24 to 72 hours directly to your designated bank (BCA, Mandiri, BNI, etc.). Credit card refunds reflect within 7-14 banking days.'
    },
    {
      q: 'Can I request bespoke sizing or private viewing at the Pacific Place SCBD boutique?',
      a: 'Absolutely. Contact our WhatsApp VIP Concierge (+62 811 8900 7446) to reserve a private tailoring suite with our master sartorial consultant at Pacific Place Mall Jakarta.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-[#DDD] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E4DB] flex items-center justify-between bg-[#FAF9F6] shrink-0">
          <div>
            <span className="text-[10px] tracking-widest text-[#8C877D] uppercase font-mono block">
              SIGMA CLIENT SERVICES
            </span>
            <h2 className="font-serif-display text-xl sm:text-2xl font-semibold text-[#121212]">
              Customer Help, Call Center & Returns
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#555] hover:text-[#121212] rounded-full hover:bg-[#EAE5DC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8E4DB] bg-[#FAF9F6] px-6 text-xs uppercase tracking-wider font-semibold overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'border-[#121212] text-[#121212]'
                : 'border-transparent text-[#7A756D] hover:text-[#121212]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Center & Concierge</span>
          </button>
          <button
            onClick={() => setActiveTab('refund-rules')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'refund-rules'
                ? 'border-[#121212] text-[#121212]'
                : 'border-transparent text-[#7A756D] hover:text-[#121212]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refund Method & Rules</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('submit-refund');
              setSubmittedCase(null);
            }}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'submit-refund'
                ? 'border-[#121212] text-[#121212]'
                : 'border-transparent text-[#7A756D] hover:text-[#121212]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Submit Return Request</span>
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'faq'
                ? 'border-b-2 border-[#121212] text-[#121212]'
                : 'border-transparent text-[#7A756D] hover:text-[#121212]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* TAB 1: Call Center & Contact */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Call Center */}
                <div className="p-6 bg-[#FAF9F6] border border-[#E0DBD2] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#121212] text-white flex items-center justify-center rounded-full">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#8C877D] block">Direct Telephone Hotline</span>
                      <h4 className="font-serif-display text-lg font-semibold text-[#121212]">
                        Call Center Indonesia
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#555]">
                    <div className="p-3 bg-white border border-[#DDD] flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-[#121212]">
                        (021) 5088 7446
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-mono">
                        Toll-Free Indonesia
                      </span>
                    </div>

                    <div className="flex items-start gap-2 pt-1 text-[11px] text-[#6E6A63]">
                      <Clock className="w-3.5 h-3.5 text-[#121212] mt-0.5 shrink-0" />
                      <span>
                        <strong>Operational Hours:</strong> Monday – Sunday, 08:00 – 22:00 WIB (Jakarta Time). Closed only on national public holidays.
                      </span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp VIP Concierge */}
                <div className="p-6 bg-[#FAF9F6] border border-[#E0DBD2] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-700 text-white flex items-center justify-center rounded-full">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#8C877D] block">Fast Instant Messenger</span>
                      <h4 className="font-serif-display text-lg font-semibold text-[#121212]">
                        WhatsApp VIP Concierge
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#555]">
                    <div className="p-3 bg-white border border-[#DDD] flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-[#121212]">
                        +62 811 8900 7446
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-mono">
                        ~2 min response
                      </span>
                    </div>

                    <p className="text-[11px] text-[#6E6A63]">
                      Chat with an experienced personal stylist for size advice, bespoke fittings, urgent shipment reroutes, or refund questions.
                    </p>

                    <a
                      href="https://api.whatsapp.com/send?phone=6281189007446&text=Hello%20Sigma%20Haute%20Couture%20Concierge%2C%20I%20would%20like%20assistance%20with%20my%20order."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Start WhatsApp Concierge Chat</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Physical Flagship Boutique Info */}
              <div className="p-6 bg-[#FAF9F6] border border-[#E0DBD2] flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#8C877D] uppercase font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#121212]" />
                    <span>Jakarta Flagship Boutique & Atelier</span>
                  </div>
                  <h4 className="font-serif-display text-base font-semibold text-[#121212]">
                    Sigma Haute Couture Pacific Place
                  </h4>
                  <p className="text-xs text-[#5E5A54] leading-relaxed">
                    Pacific Place Mall, Level 1, Suites 102–104, SCBD, Jl. Jend. Sudirman Kav. 52-53, Senayan, Kebayoran Baru, Jakarta Selatan 12190
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-[#121212] block">Open Daily: 10:00 - 22:00 WIB</span>
                  <span className="text-[11px] text-[#7A756D]">Valet parking & VIP tailoring suites available</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Refund Method & Rules */}
          {activeTab === 'refund-rules' && (
            <div className="space-y-6 text-xs sm:text-sm text-[#444] leading-relaxed">
              <div className="p-4 bg-[#FAF9F6] border border-[#E0DBD2]">
                <h3 className="font-serif-display text-lg font-semibold text-[#121212] mb-2">
                  14-Day Complimentary Indonesian Refund & Return Policy
                </h3>
                <p className="text-xs text-[#666]">
                  Sigma guarantees 100% satisfaction on all luxury apparel, footwear, and extraits. If your piece does not fit impeccably or does not meet your expectations, we provide full refunds or size exchanges under the terms below.
                </p>
              </div>

              {/* Rules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border border-[#ECE7DE] bg-white space-y-2">
                  <h4 className="font-semibold text-sm text-[#121212] flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#121212] text-white flex items-center justify-center rounded-full font-mono text-[10px]">1</span>
                    14-Day Return Window
                  </h4>
                  <p className="text-[#6E6A63]">
                    Requests must be initiated within 14 calendar days from the date of confirmed delivery by our courier (JNE / SiCepat / Paxel).
                  </p>
                </div>

                <div className="p-4 border border-[#ECE7DE] bg-white space-y-2">
                  <h4 className="font-semibold text-sm text-[#121212] flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#121212] text-white flex items-center justify-center rounded-full font-mono text-[10px]">2</span>
                    Tags & Seals Intact
                  </h4>
                  <p className="text-[#6E6A63]">
                    Items must be in original unworn condition with all fabric care tags, branded dustbags, shoe boxes, and tamper-proof hologram ribbons attached and unbroken.
                  </p>
                </div>

                <div className="p-4 border border-[#ECE7DE] bg-white space-y-2">
                  <h4 className="font-semibold text-sm text-[#121212] flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#121212] text-white flex items-center justify-center rounded-full font-mono text-[10px]">3</span>
                    Unboxing Video Requirement
                  </h4>
                  <p className="text-[#6E6A63]">
                    In alignment with Indonesian e-commerce standards, clients are kindly requested to provide a continuous unboxing video when reporting damaged packaging or discrepancies.
                  </p>
                </div>

                <div className="p-4 border border-[#ECE7DE] bg-white space-y-2">
                  <h4 className="font-semibold text-sm text-[#121212] flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#121212] text-white flex items-center justify-center rounded-full font-mono text-[10px]">4</span>
                    Refund Processing & Timelines
                  </h4>
                  <p className="text-[#6E6A63]">
                    Upon receiving the return at our SCBD atelier:
                    <br />
                    • <strong>VA / Transfer / QRIS:</strong> 1 - 3 business days to your bank account.
                    <br />
                    • <strong>Credit Card:</strong> 7 - 14 business days depending on the card issuer.
                  </p>
                </div>
              </div>

              {/* Direct Action to Form */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveTab('submit-refund')}
                  className="px-6 py-3 bg-[#121212] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#333] transition-colors"
                >
                  Proceed to Return Request Form →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Interactive Return / Refund Form */}
          {activeTab === 'submit-refund' && (
            <div>
              {submittedCase ? (
                <div className="p-8 text-center bg-[#FAF9F6] border border-[#E0DBD2] space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif-display text-xl font-semibold text-[#121212]">
                    Return Request Submitted Successfully
                  </h3>
                  <p className="text-xs text-[#7A756D] max-w-md mx-auto">
                    Your request has been logged under reference <strong className="font-mono text-[#121212]">{submittedCase}</strong>. Our logistics concierge will schedule a complimentary home courier pickup at your address within 24 hours.
                  </p>
                  <div className="p-4 bg-white border border-[#DDD] max-w-sm mx-auto text-left text-xs font-mono space-y-1">
                    <div>Status: Under Review by SCBD Atelier</div>
                    <div>Destination Bank: {bankName}</div>
                    <div>Account: {accountNumber || '••••••••'} ({accountHolder})</div>
                  </div>
                  <button
                    onClick={() => setSubmittedCase(null)}
                    className="px-6 py-2.5 bg-[#121212] text-white text-xs uppercase tracking-wider font-semibold"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRefundForm} className="space-y-5 text-xs">
                  <div className="p-3 bg-[#FAF9F6] border border-[#E0DBD2] text-[#6E6A63]">
                    Please fill out the form below. Once approved, our courier will pick up the package from your address at zero cost.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-[#444] mb-1">Select Order ID *</label>
                      <select
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs font-mono text-[#121212]"
                      >
                        {orders.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.id} ({o.items.length} items - {o.date})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-[#444] mb-1">Customer Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#444] mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#444] mb-1">WhatsApp Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212]"
                      />
                    </div>
                  </div>

                  {/* Return Reason */}
                  <div>
                    <label className="block font-medium text-[#444] mb-1">Primary Reason for Return *</label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212]"
                    >
                      <option value="Size exchange needed (Too small/large)">Size exchange needed (Too small/large)</option>
                      <option value="Product color / drape differs from expectation">Product color / drape differs from expectation</option>
                      <option value="Defective / Transit damage observed">Defective / Transit damage observed</option>
                      <option value="Incorrect piece delivered">Incorrect piece delivered</option>
                      <option value="Change of mind (unopened luxury seal)">Change of mind (unopened luxury seal)</option>
                    </select>
                  </div>

                  {/* Bank Destination for Refund Payout */}
                  <div className="p-4 bg-[#FAF9F6] border border-[#DDD] space-y-3">
                    <span className="font-semibold text-[#121212] block">
                      Bank Details for Refund Payout (Indonesia):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#555] mb-1">Bank Name *</label>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full p-2 border border-[#CCC] bg-white text-xs"
                        >
                          <option value="BCA (Bank Central Asia)">BCA</option>
                          <option value="Bank Mandiri">Bank Mandiri</option>
                          <option value="BNI (Bank Negara Indonesia)">BNI</option>
                          <option value="BRI (Bank Rakyat Indonesia)">BRI</option>
                          <option value="Bank CIMB Niaga">CIMB Niaga</option>
                          <option value="Bank Jago">Bank Jago</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#555] mb-1">Account Number (Nomor Rekening) *</label>
                        <input
                          type="text"
                          required
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="e.g. 5210892211"
                          className="w-full p-2 border border-[#CCC] bg-white text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#555] mb-1">Account Holder Name *</label>
                        <input
                          type="text"
                          required
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          placeholder="As stated in bank book"
                          className="w-full p-2 border border-[#CCC] bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-[#444] mb-1">Additional Notes / Defect Details</label>
                    <textarea
                      rows={2}
                      value={itemsDesc}
                      onChange={(e) => setItemsDesc(e.target.value)}
                      placeholder="Please note which item(s) you wish to exchange or return, and describe unboxing details..."
                      className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#121212] hover:bg-[#333] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Official Return Request</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: Frequently Asked Questions */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpenFaq = openFaq === idx;
                return (
                  <div key={idx} className="border border-[#E0DBD2] bg-white overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpenFaq ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-[#121212] hover:bg-[#FAF9F6] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8C877D] transition-transform duration-200 ${
                          isOpenFaq ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpenFaq && (
                      <div className="px-4 pb-4 text-xs text-[#6E6A63] leading-relaxed border-t border-[#F0ECE4] pt-3 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
