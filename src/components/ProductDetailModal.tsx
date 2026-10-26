import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Ruler, Truck, RotateCcw, Check, MessageSquarePlus } from 'lucide-react';
import { Product, CustomerReview } from '../types';
import { formatIDR } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }, quantity: number) => void;
  onBuyNow: (product: Product, size: string, color: { name: string; hex: string }, quantity: number) => void;
  reviews: CustomerReview[];
  onAddReview: (review: Omit<CustomerReview, 'id' | 'date' | 'verified'>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  reviews,
  onAddReview,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(product.colors[0] || { name: 'Noir', hex: '#111' });
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'reviews'>('details');
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;
    onAddReview({
      productId: product.id,
      author: reviewAuthor,
      city: reviewCity || 'Jakarta',
      rating: reviewRating,
      title: reviewTitle || 'Exceptional Quality',
      comment: reviewComment,
      sizePurchased: selectedSize
    });
    setReviewAuthor('');
    setReviewCity('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-[#DDD] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-3 border-b border-[#E8E4DB] flex items-center justify-between bg-[#FAF9F6] shrink-0">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7A756D] font-mono">
            <span>{product.category}</span>
            <span>·</span>
            <span>SKU: {product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#555] hover:text-[#121212] transition-colors rounded-full hover:bg-[#EAE5DC]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Product Visual */}
            <div className="md:col-span-6 flex flex-col gap-3">
              <div className="aspect-[3/4] w-full bg-[#F6F4EE] overflow-hidden border border-[#ECE7DE] relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                {product.featured && (
                  <div className="absolute top-3 left-3 bg-[#121212] text-[#FAF9F6] text-[10px] uppercase font-mono tracking-widest px-2.5 py-1">
                    Signature Piece
                  </div>
                )}
              </div>

              {/* Trust Callout */}
              <div className="p-3 bg-[#FAF9F6] border border-[#E8E4DB] space-y-1.5 text-[11px] text-[#6E6A62]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#121212]" />
                  <span>100% Guaranteed Authenticity with Hologram Seal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#121212]" />
                  <span>Insured Express Courier with Real-Time Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-[#121212]" />
                  <span>14-Day Complimentary Indonesian Return Policy</span>
                </div>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#8C877D] mb-1 font-mono">
                  <span>Crafted in {product.origin}</span>
                </div>

                <h1 className="font-serif-display text-2xl sm:text-3xl text-[#121212] font-semibold leading-tight mb-2">
                  {product.name}
                </h1>

                {/* Rating line */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-[#B08D57]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-current text-[#B08D57]'
                            : 'text-[#DDD]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-[#333] font-semibold">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-[#8C877D]">
                    ({product.reviewsCount} customer reviews)
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-4 bg-[#FAF9F6] border border-[#E8E4DB] mb-6">
                  <div className="text-[11px] uppercase tracking-wider text-[#7A756D] font-mono">
                    Retail Price (IDR)
                  </div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[#121212] tabular-nums">
                      {formatIDR(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="font-mono text-sm text-[#8C877D] line-through tabular-nums">
                        {formatIDR(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#7A756D] block mt-1">
                    Includes all Indonesian customs luxury duties & luxury box packaging
                  </span>
                </div>

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-medium text-[#121212] uppercase tracking-wider">
                        Color: <span className="font-normal text-[#555]">{selectedColor.name}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform p-0.5 ${
                            selectedColor.name === color.name
                              ? 'border-[#121212] scale-110 shadow-sm'
                              : 'border-transparent hover:scale-105'
                          }`}
                          title={color.name}
                        >
                          <span
                            className="w-full h-full rounded-full block border border-black/10"
                            style={{ backgroundColor: color.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium text-[#121212] uppercase tracking-wider">
                      Select Size:
                    </span>
                    <button
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-[#7A756D] hover:text-[#121212] flex items-center gap-1 underline text-[11px]"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>{showSizeGuide ? 'Hide Measurements' : 'Size Guide (cm)'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-3 text-xs font-mono font-medium border text-center transition-all ${
                          selectedSize === size
                            ? 'bg-[#121212] text-white border-[#121212]'
                            : 'bg-white text-[#333] border-[#D9D4CB] hover:border-[#121212]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Inline Size Guide Table */}
                  {showSizeGuide && (
                    <div className="mt-3 p-3 bg-[#FAF9F6] border border-[#DDD] text-[11px] text-[#444] animate-fadeIn">
                      <div className="font-semibold text-[#121212] mb-1">
                        Sizing Specifications for {product.category}
                      </div>
                      <p className="mb-2">
                        Measurements taken flat. All pieces are true to high-fashion European specifications.
                      </p>
                      <table className="w-full border-collapse text-left font-mono text-[10px]">
                        <thead>
                          <tr className="border-b border-[#CCC] text-[#777]">
                            <th className="py-1">Size</th>
                            <th className="py-1">Chest/Waist/Brim</th>
                            <th className="py-1">Length/EU</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#EEE]">
                            <td className="py-1 font-bold">Standard S / EU 40</td>
                            <td>92 - 96 cm</td>
                            <td>72 cm</td>
                          </tr>
                          <tr className="border-b border-[#EEE]">
                            <td className="py-1 font-bold">Standard M / EU 42</td>
                            <td>97 - 102 cm</td>
                            <td>74 cm</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-bold">Standard L / EU 44</td>
                            <td>103 - 108 cm</td>
                            <td>76 cm</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Quantity Stepper */}
                <div className="mb-6">
                  <span className="block text-xs font-medium text-[#121212] uppercase tracking-wider mb-2">
                    Quantity:
                  </span>
                  <div className="inline-flex items-center border border-[#D9D4CB] bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-base text-[#444] hover:bg-[#F0ECE2] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-mono text-sm font-semibold text-[#121212] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="px-3.5 py-1.5 text-base text-[#444] hover:bg-[#F0ECE2] transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-4 text-xs uppercase tracking-widest font-semibold border border-[#121212] transition-all flex items-center justify-center gap-2 ${
                      addedAnimation
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-[#121212] text-white hover:bg-[#2A2927]'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 px-4 text-xs uppercase tracking-widest font-semibold border border-[#121212] text-[#121212] bg-[#FAF9F6] hover:bg-[#EAE5DC] transition-all text-center"
                  >
                    Direct Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Tabs: Details, Care, Reviews */}
          <div className="mt-10 pt-6 border-t border-[#E8E4DB]">
            <div className="flex items-center gap-6 border-b border-[#E8E4DB] text-xs uppercase tracking-widest font-medium mb-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'details'
                    ? 'border-b-2 border-[#121212] text-[#121212] font-semibold'
                    : 'text-[#8C877D] hover:text-[#121212]'
                }`}
              >
                Atelier Notes & Fabric
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'care'
                    ? 'border-b-2 border-[#121212] text-[#121212] font-semibold'
                    : 'text-[#8C877D] hover:text-[#121212]'
                }`}
              >
                Care & Origin
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-[#121212] text-[#121212] font-semibold'
                    : 'text-[#8C877D] hover:text-[#121212]'
                }`}
              >
                <span>Reviews ({productReviews.length + 3})</span>
              </button>
            </div>

            {/* Tab 1: Details */}
            {activeTab === 'details' && (
              <div className="space-y-4 text-xs sm:text-sm text-[#4A4742] leading-relaxed">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-[#FAF9F6] border border-[#ECE7DE]">
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-[#8C877D] mb-1">
                      Materials & Hardware
                    </span>
                    <span className="font-medium text-[#121212]">{product.materials}</span>
                  </div>
                  {product.notes && (
                    <div className="p-3 bg-[#FAF9F6] border border-[#ECE7DE]">
                      <span className="block text-[10px] uppercase font-mono tracking-wider text-[#8C877D] mb-1">
                        Olfactory / Architectural Notes
                      </span>
                      <span className="font-medium text-[#121212]">{product.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Care & Origin */}
            {activeTab === 'care' && (
              <div className="space-y-4 text-xs sm:text-sm text-[#4A4742]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FAF9F6] border border-[#ECE7DE]">
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-[#8C877D] mb-1">
                      Origin & Craftsmanship
                    </span>
                    <p className="font-medium text-[#121212]">{product.origin}</p>
                    <p className="text-xs text-[#7A756D] mt-1">
                      Crafted under certified artisanal guild standards and hand-inspected in Jakarta.
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAF9F6] border border-[#ECE7DE]">
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-[#8C877D] mb-1">
                      Preservation & Care
                    </span>
                    <p className="font-medium text-[#121212]">{product.care}</p>
                    <p className="text-xs text-[#7A756D] mt-1">
                      Includes complimentary branded garment bag / cedar blocks / atomiser sheath.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif-display text-lg font-semibold text-[#121212]">
                      Verified Client Feedback
                    </h4>
                    <p className="text-xs text-[#7A756D]">
                      Authentic feedback from verified purchasers in Indonesia.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#121212] text-white hover:bg-[#333] transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Write a Review</span>
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="p-4 bg-[#FAF9F6] border border-[#DDD] space-y-3 text-xs">
                    <div className="font-semibold text-sm text-[#121212]">
                      Submit Your Experience
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#555] mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder="e.g. Raditya Gunawan"
                          className="w-full p-2 border border-[#CCC] bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#555] mb-1">City / Region *</label>
                        <input
                          type="text"
                          required
                          value={reviewCity}
                          onChange={(e) => setReviewCity(e.target.value)}
                          placeholder="e.g. Jakarta Selatan"
                          className="w-full p-2 border border-[#CCC] bg-white text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#555] mb-1">Rating *</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="p-2 border border-[#CCC] bg-white text-xs font-mono"
                      >
                        <option value={5}>★★★★★ (5/5) - Exceptional</option>
                        <option value={4}>★★★★☆ (4/5) - Very Good</option>
                        <option value={3}>★★★☆☆ (3/5) - Good</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#555] mb-1">Review Headline</label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="e.g. Outstanding texture and finish"
                        className="w-full p-2 border border-[#CCC] bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#555] mb-1">Your Detailed Comments *</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Describe the fit, material feel, packaging, or fragrance longevity..."
                        className="w-full p-2 border border-[#CCC] bg-white text-xs"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#121212] text-white font-semibold text-xs uppercase tracking-wider"
                      >
                        Publish Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 border border-[#CCC] text-[#555] text-xs uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {/* Static highlight reviews for this product */}
                  <div className="p-4 bg-[#FAF9F6] border border-[#ECE7DE]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#121212]">
                          Aditya Pratama
                        </span>
                        <span className="text-[10px] text-[#7A756D]">Jakarta Selatan</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 font-mono">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#8C877D]">19 Oct 2026</span>
                    </div>
                    <div className="flex items-center text-[#B08D57] mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="font-medium text-xs text-[#121212] mb-1">
                      Impeccable finishing and authentic feel
                    </p>
                    <p className="text-xs text-[#555] leading-relaxed">
                      Ordered via JNE YES and received the very next morning at SCBD. Packaging included wooden hanger, garment dust cover, and authenticated certification card.
                    </p>
                  </div>

                  {/* Dynamic submitted reviews */}
                  {productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-[#FAF9F6] border border-[#ECE7DE]">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#121212]">{rev.author}</span>
                          <span className="text-[10px] text-[#7A756D]">{rev.city}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 font-mono">
                            Verified Client
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[#8C877D]">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-[#B08D57] mb-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <p className="font-medium text-xs text-[#121212] mb-1">{rev.title}</p>
                      <p className="text-xs text-[#555] leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-[#8C877D] block mt-1">
                        Size chosen: {rev.sizePurchased}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
