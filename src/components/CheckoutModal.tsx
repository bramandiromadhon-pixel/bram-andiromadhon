import React, { useState } from 'react';
import { X, ArrowLeft, ShieldCheck, Truck, CreditCard, QrCode, Building, Wallet, CheckCircle2 } from 'lucide-react';
import { CartItem, CustomerInfo, DeliveryCourier, PaymentDetails, PaymentMethodType } from '../types';
import { AVAILABLE_COURIERS, INDONESIA_PROVINCES } from '../data/products';
import { formatIDR, generateVANumber } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  onCompleteOrder: (
    customerInfo: CustomerInfo,
    courier: DeliveryCourier,
    paymentDetails: PaymentDetails,
    shippingFee: number,
    total: number
  ) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  onCompleteOrder,
}) => {
  if (!isOpen) return null;

  // Form states
  const [fullName, setFullName] = useState('Bramandi Romadhon');
  const [email, setEmail] = useState('bramandiromadhon@gmail.com');
  const [phone, setPhone] = useState('081289456722');
  const [address, setAddress] = useState('Jl. Jend. Sudirman Kav 52-53, SCBD Suites Tower 1');
  const [province, setProvince] = useState('DKI Jakarta');
  const [city, setCity] = useState('Jakarta Selatan');
  const [postalCode, setPostalCode] = useState('12190');
  const [courierNotes, setCourierNotes] = useState('Please deliver to lobby reception if unavailable');

  const [selectedCourierId, setSelectedCourierId] = useState<string>('paxel_luxury');
  const [paymentType, setPaymentType] = useState<PaymentMethodType>('qris');
  const [paymentProvider, setPaymentProvider] = useState<string>('QRIS Instant');

  // Card details state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Courier selection
  const selectedCourier = AVAILABLE_COURIERS[selectedCourierId] || AVAILABLE_COURIERS['jne_yes'];
  const isFreeDelivery = subtotal >= 3000000;
  const shippingFee = isFreeDelivery ? 0 : selectedCourier.cost;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  // Available cities for selected province
  const currentCities = INDONESIA_PROVINCES[province] || ['Kota'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let vaNum = undefined;
    if (paymentType === 'va') {
      vaNum = generateVANumber(paymentProvider);
    }

    const customer: CustomerInfo = {
      fullName,
      email,
      phone,
      address,
      province,
      city,
      postalCode,
      notes: courierNotes,
    };

    const courier: DeliveryCourier = {
      id: selectedCourierId,
      name: selectedCourier.name,
      service: selectedCourier.service,
      cost: shippingFee,
      etd: selectedCourier.etd,
    };

    const payment: PaymentDetails = {
      type: paymentType,
      provider: paymentProvider,
      vaNumber: vaNum,
    };

    onCompleteOrder(customer, courier, payment, shippingFee, finalTotal);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white border border-[#DDD] shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E4DB] flex items-center justify-between bg-[#FAF9F6] shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-serif-display text-xl font-semibold tracking-wide text-[#121212]">
              SIGMA HAUTE COUTURE CHECKOUT
            </span>
            <span className="text-xs bg-[#121212] text-white px-2 py-0.5 font-mono">
              SCBD JAKARTA
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#555] hover:text-[#121212] rounded-full hover:bg-[#EAE5DC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Body: 2 Columns */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Details (Customer, Address, Payment) */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Customer Information */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#ECE7DE]">
                  <span className="font-mono text-xs font-bold bg-[#121212] text-white w-5 h-5 flex items-center justify-center rounded-full">
                    1
                  </span>
                  <h3 className="font-serif-display text-base font-semibold text-[#121212] uppercase tracking-wider">
                    Customer Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-[#444] mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Bramandi Romadhon"
                      className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212] focus:bg-white focus:outline-none focus:border-[#121212]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#444] mb-1">Email for Receipt & Invoice *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@domain.com"
                      className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212] focus:bg-white focus:outline-none focus:border-[#121212]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#444] mb-1">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812-XXXX-XXXX"
                      className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212] focus:bg-white focus:outline-none focus:border-[#121212]"
                    />
                    <span className="text-[10px] text-[#8C877D] mt-0.5 block">
                      Used for live delivery notifications & courier verification
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Delivery Destination */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#ECE7DE]">
                  <span className="font-mono text-xs font-bold bg-[#121212] text-white w-5 h-5 flex items-center justify-center rounded-full">
                    2
                  </span>
                  <h3 className="font-serif-display text-base font-semibold text-[#121212] uppercase tracking-wider">
                    Indonesian Delivery Address
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-[#444] mb-1">Complete Street Address, Building / Unit *</label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Apartemen Senopati Suites Tower 2 Unit 18B, Jl. Senopati No. 41"
                      className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212] focus:bg-white focus:outline-none focus:border-[#121212]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-medium text-[#444] mb-1">Province *</label>
                      <select
                        value={province}
                        onChange={(e) => {
                          const newProv = e.target.value;
                          setProvince(newProv);
                          const cities = INDONESIA_PROVINCES[newProv] || [];
                          if (cities.length > 0) setCity(cities[0]);
                        }}
                        className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212] focus:bg-white focus:outline-none focus:border-[#121212]"
                      >
                        {Object.keys(INDONESIA_PROVINCES).map((prov) => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-[#444] mb-1">City / Regency *</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212] focus:bg-white focus:outline-none focus:border-[#121212]"
                      >
                        {currentCities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-[#444] mb-1">Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="12190"
                        className="w-full p-2.5 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212] focus:bg-white focus:outline-none focus:border-[#121212]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-[#444] mb-1">Special Courier Instructions</label>
                    <input
                      type="text"
                      value={courierNotes}
                      onChange={(e) => setCourierNotes(e.target.value)}
                      placeholder="e.g. Leave with receptionist / Ring doorbell"
                      className="w-full p-2 border border-[#D9D4CB] bg-[#FAF9F6] text-xs text-[#121212] focus:bg-white focus:outline-none focus:border-[#121212]"
                    />
                  </div>

                  {/* Courier Selection */}
                  <div className="pt-2">
                    <label className="block font-medium text-[#444] mb-2">Select Insured Courier Service *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {Object.entries(AVAILABLE_COURIERS).map(([id, courier]) => (
                        <label
                          key={id}
                          className={`p-3 border flex items-start justify-between cursor-pointer transition-all ${
                            selectedCourierId === id
                              ? 'border-[#121212] bg-[#FAF9F6] ring-1 ring-[#121212]'
                              : 'border-[#E0DBD2] bg-white hover:border-[#BBB]'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <input
                              type="radio"
                              name="courier"
                              checked={selectedCourierId === id}
                              onChange={() => setSelectedCourierId(id)}
                              className="mt-0.5 accent-[#121212]"
                            />
                            <div>
                              <div className="font-semibold text-xs text-[#121212]">{courier.name}</div>
                              <div className="text-[11px] text-[#7A756D]">{courier.service}</div>
                              <div className="text-[10px] text-[#8C877D] font-mono mt-0.5">{courier.etd}</div>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-semibold tabular-nums text-[#121212]">
                            {isFreeDelivery ? 'FREE' : formatIDR(courier.cost)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Preferred Indonesian Payment Method */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#ECE7DE]">
                  <span className="font-mono text-xs font-bold bg-[#121212] text-white w-5 h-5 flex items-center justify-center rounded-full">
                    3
                  </span>
                  <h3 className="font-serif-display text-base font-semibold text-[#121212] uppercase tracking-wider">
                    Preferred Payment Method (Indonesia)
                  </h3>
                </div>

                {/* Payment Category Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('qris');
                      setPaymentProvider('QRIS Instant');
                    }}
                    className={`p-3 border text-center transition-all ${
                      paymentType === 'qris'
                        ? 'bg-[#121212] text-white border-[#121212]'
                        : 'bg-white text-[#444] border-[#DDD] hover:border-[#121212]'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-medium uppercase tracking-wider block">QRIS / E-Wallet</span>
                    <span className="text-[10px] text-[#AAA] block">GoPay, OVO, Dana</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('va');
                      setPaymentProvider('BCA Virtual Account');
                    }}
                    className={`p-3 border text-center transition-all ${
                      paymentType === 'va'
                        ? 'bg-[#121212] text-white border-[#121212]'
                        : 'bg-white text-[#444] border-[#DDD] hover:border-[#121212]'
                    }`}
                  >
                    <Building className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-medium uppercase tracking-wider block">Virtual Account</span>
                    <span className="text-[10px] text-[#AAA] block">BCA, Mandiri, BNI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('card');
                      setPaymentProvider('Credit / Debit Card');
                    }}
                    className={`p-3 border text-center transition-all ${
                      paymentType === 'card'
                        ? 'bg-[#121212] text-white border-[#121212]'
                        : 'bg-white text-[#444] border-[#DDD] hover:border-[#121212]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-medium uppercase tracking-wider block">Credit Card</span>
                    <span className="text-[10px] text-[#AAA] block">Visa, Mastercard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('paylater');
                      setPaymentProvider('Kredivo PayLater');
                    }}
                    className={`p-3 border text-center transition-all ${
                      paymentType === 'paylater'
                        ? 'bg-[#121212] text-white border-[#121212]'
                        : 'bg-white text-[#444] border-[#DDD] hover:border-[#121212]'
                    }`}
                  >
                    <Wallet className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-medium uppercase tracking-wider block">PayLater</span>
                    <span className="text-[10px] text-[#AAA] block">Kredivo, Akulaku</span>
                  </button>
                </div>

                {/* Sub-options for payment */}
                <div className="p-4 bg-[#FAF9F6] border border-[#DDD] text-xs">
                  {paymentType === 'qris' && (
                    <div className="space-y-2">
                      <span className="font-semibold text-[#121212] block">Select E-Wallet / QRIS:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['QRIS Instant', 'GoPay', 'OVO', 'ShopeePay'].map((provider) => (
                          <button
                            type="button"
                            key={provider}
                            onClick={() => setPaymentProvider(provider)}
                            className={`p-2 border text-center font-medium ${
                              paymentProvider === provider
                                ? 'bg-[#121212] text-white border-[#121212]'
                                : 'bg-white text-[#444] border-[#CCC]'
                            }`}
                          >
                            {provider}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#7A756D] pt-1">
                        A real-time scannable QR code will be generated on the next confirmation screen.
                      </p>
                    </div>
                  )}

                  {paymentType === 'va' && (
                    <div className="space-y-2">
                      <span className="font-semibold text-[#121212] block">Select Bank for Virtual Account:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['BCA', 'Mandiri', 'BNI', 'BRI', 'Permata'].map((bank) => (
                          <button
                            type="button"
                            key={bank}
                            onClick={() => setPaymentProvider(`${bank} Virtual Account`)}
                            className={`p-2 border text-center font-medium ${
                              paymentProvider.includes(bank)
                                ? 'bg-[#121212] text-white border-[#121212]'
                                : 'bg-white text-[#444] border-[#CCC]'
                            }`}
                          >
                            {bank} VA
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#7A756D] pt-1">
                        Instant automated verification 24/7 with zero transfer fees.
                      </p>
                    </div>
                  )}

                  {paymentType === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#444] mb-1">Card Number *</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full p-2 border border-[#CCC] bg-white font-mono text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-[#444] mb-1">Expiry (MM/YY) *</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full p-2 border border-[#CCC] bg-white font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-[#444] mb-1">CVV Security Code *</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full p-2 border border-[#CCC] bg-white font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentType === 'paylater' && (
                    <div className="space-y-2">
                      <span className="font-semibold text-[#121212] block">Select Installment / PayLater Partner:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {['Kredivo PayLater (0% 30 Days)', 'Akulaku PayLater'].map((p) => (
                          <button
                            type="button"
                            key={p}
                            onClick={() => setPaymentProvider(p)}
                            className={`p-2 border text-center font-medium ${
                              paymentProvider === p
                                ? 'bg-[#121212] text-white border-[#121212]'
                                : 'bg-white text-[#444] border-[#CCC]'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Completion Button */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="p-6 bg-[#FAF9F6] border border-[#E8E4DB] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DE]">
                  <h3 className="font-serif-display text-base font-semibold text-[#121212] uppercase tracking-wider">
                    Order Summary
                  </h3>
                  <span className="font-mono text-xs text-[#8C877D]">
                    {items.length} Unique Items
                  </span>
                </div>

                {/* Item Thumbnail Rows */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <div className="w-12 h-14 bg-white border border-[#DDD] shrink-0 overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[#121212] line-clamp-1">{item.product.name}</div>
                        <div className="text-[11px] text-[#7A756D] font-mono">
                          Size: {item.size} · Qty: {item.quantity}
                        </div>
                        <div className="font-mono text-[11px] font-medium text-[#121212]">
                          {formatIDR(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-3 border-t border-[#ECE7DE] text-xs">
                  <div className="flex justify-between text-[#555]">
                    <span>Items Subtotal</span>
                    <span className="font-mono tabular-nums text-[#121212] font-semibold">{formatIDR(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Voucher Discount</span>
                      <span className="font-mono tabular-nums font-semibold">-{formatIDR(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#555]">
                    <span>Selected Courier ({selectedCourier.name})</span>
                    <span className="font-mono tabular-nums text-[#121212]">
                      {shippingFee === 0 ? 'COMPLIMENTARY' : formatIDR(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#555]">
                    <span>Luxury Insurance & Packaging</span>
                    <span className="font-mono text-emerald-700 font-semibold">INCLUDED</span>
                  </div>
                  <div className="pt-3 border-t border-[#D9D4CB] flex items-baseline justify-between text-base font-bold text-[#121212]">
                    <span className="font-serif-display">Grand Total</span>
                    <span className="font-mono tabular-nums text-lg text-[#121212]">
                      {formatIDR(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#121212] hover:bg-[#2A2927] text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Confirm Order & Pay {formatIDR(finalTotal)}</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-[#7A756D] mt-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Protected by Bank Indonesia & OJK payment compliance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
