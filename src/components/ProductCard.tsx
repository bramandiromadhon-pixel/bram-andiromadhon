import React, { useState } from 'react';
import { Star, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatIDR } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onQuickAdd,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="group relative bg-white border border-[#EBE6DD] flex flex-col justify-between transition-all duration-300 hover:border-[#121212] hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F4EE] cursor-pointer" onClick={() => onViewDetails(product)}>
        {!imageError ? (
          <img
            src={isHovered && product.secondaryImage ? product.secondaryImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EDE8DF] text-[#7A756D]">
            <span className="font-serif-display text-lg font-semibold text-[#121212] mb-1">
              {product.category}
            </span>
            <span className="text-xs uppercase tracking-wider">{product.sku}</span>
          </div>
        )}

        {/* Quiet Tag */}
        {product.featured && (
          <div className="absolute top-2.5 left-2.5 bg-[#121212] text-[#FAF9F6] text-[10px] uppercase font-mono tracking-widest px-2 py-0.5">
            Signature
          </div>
        )}

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="flex-1 py-2 px-3 bg-[#FAF9F6] hover:bg-[#121212] hover:text-white text-[#121212] text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="py-2 px-3 bg-[#121212] hover:bg-[#2F2D2A] text-white text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center shadow-sm"
            title="Quick add to bag"
            aria-label={`Quick add ${product.name} to bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Metadata line with typographic dot separator (Zero Pill discipline) */}
          <div className="flex items-center justify-between text-[11px] text-[#7A756C] uppercase tracking-wider font-sans mb-1.5">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-[#B08D57]">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-mono text-[#333] font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-[#888]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onViewDetails(product)}
            className="font-serif-display text-base font-semibold text-[#121212] group-hover:text-[#8B7355] transition-colors leading-snug cursor-pointer line-clamp-2"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#736E66] line-clamp-1 mt-1 font-light">
            {product.tagline}
          </p>
        </div>

        {/* Pricing Baseline */}
        <div className="pt-3 mt-3 border-t border-[#F0EBE1] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm sm:text-base font-bold text-[#121212] tabular-nums">
              {formatIDR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-[#9E998E] line-through tabular-nums">
                {formatIDR(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#8C877D] uppercase font-mono tracking-wider">
            {product.origin.split(',')[0]}
          </span>
        </div>
      </div>
    </article>
  );
};
