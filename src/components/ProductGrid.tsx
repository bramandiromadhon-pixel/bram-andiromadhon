import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { formatIDR } from '../utils/formatters';

interface ProductGridProps {
  products: Product[];
  selectedCategory: ProductCategory | 'All';
  onSelectCategory: (category: ProductCategory | 'All') => void;
  searchQuery: string;
  onClearSearch: () => void;
  onViewDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  onViewDetails,
  onQuickAdd,
}) => {
  const [maxPrice, setMaxPrice] = useState<number>(12000000);
  const [minPrice, setMinPrice] = useState<number>(1000000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const categories: { label: string; value: ProductCategory | 'All' }[] = [
    { label: 'All Pieces', value: 'All' },
    { label: 'Caps', value: 'Cap' },
    { label: 'Shoes', value: 'Shoes' },
    { label: 'Dresses', value: 'Dress' },
    { label: 'Formal', value: 'Formal' },
    { label: 'Fragrance', value: 'Fragrance' },
  ];

  // Filtering and Sorting
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category check
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Price range
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesMaterials = p.materials.toLowerCase().includes(query);
        const matchesOrigin = p.origin.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc && !matchesMaterials && !matchesOrigin) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first, then rating
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }, [products, selectedCategory, minPrice, maxPrice, searchQuery, sortBy]);

  const resetAllFilters = () => {
    onSelectCategory('All');
    onClearSearch();
    setMinPrice(1000000);
    setMaxPrice(12000000);
    setSortBy('featured');
  };

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Catalog Header & Controls Bar */}
      <div className="flex flex-col gap-6 mb-8 border-b border-[#E8E4DB] pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-[#121212] font-semibold">
              The Collection
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#7A756D] mt-1 font-sans">
              <span>{filteredProducts.length} of {products.length} Curated Pieces</span>
              <span aria-hidden="true">·</span>
              <span>100% Authentic Haute Couture</span>
              <span aria-hidden="true">·</span>
              <span>All Ready for Dispatch in SCBD Jakarta</span>
            </div>
          </div>

          {/* Interactive Filter & Sort Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`px-3 py-2 text-xs uppercase tracking-wider font-medium border flex items-center gap-2 transition-colors ${
                isFilterPanelOpen || minPrice > 1000000 || maxPrice < 12000000
                  ? 'border-[#121212] bg-[#121212] text-white'
                  : 'border-[#D9D4CB] bg-white text-[#4A4742] hover:border-[#121212]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Price Filter {minPrice > 1000000 || maxPrice < 12000000 ? '(Active)' : ''}</span>
            </button>

            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-[#D9D4CB] text-xs uppercase tracking-wider font-medium text-[#4A4742] py-2 pl-3 pr-8 focus:outline-none focus:border-[#121212] cursor-pointer"
              >
                <option value="featured">Sort: Curated & Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-[#7A756D] absolute right-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Tabs: Segmented interactive buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const count = cat.value === 'All'
              ? products.length
              : products.filter(p => p.category === cat.value).length;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-colors flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#121212] text-white border-[#121212]'
                    : 'bg-white text-[#5E5A54] border-[#E2DDD4] hover:border-[#121212] hover:text-[#121212]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-[#D4AF37]' : 'text-[#8C877D]'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Chips & Feedback */}
        {(searchQuery || minPrice > 1000000 || maxPrice < 12000000 || selectedCategory !== 'All') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-[#555]">
            <span className="font-medium text-[#121212]">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EAE5DC] text-[#121212] text-xs">
                Search: "{searchQuery}"
                <button onClick={onClearSearch} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EAE5DC] text-[#121212] text-xs">
                Category: {selectedCategory}
                <button onClick={() => onSelectCategory('All')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(minPrice > 1000000 || maxPrice < 12000000) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EAE5DC] text-[#121212] text-xs">
                {formatIDR(minPrice)} - {formatIDR(maxPrice)}
                <button
                  onClick={() => {
                    setMinPrice(1000000);
                    setMaxPrice(12000000);
                  }}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="text-[#8C877D] hover:text-[#121212] underline ml-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset all
            </button>
          </div>
        )}

        {/* Collapsible Price Filter Panel */}
        {isFilterPanelOpen && (
          <div className="p-4 bg-white border border-[#E0DBD2] transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-[#555] mb-2 font-mono">
                  <span>Min: {formatIDR(minPrice)}</span>
                  <span>Max: {formatIDR(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={12000000}
                  step={250000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#121212] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#8C877D] font-mono mt-1">
                  <span>Rp 1.000.000</span>
                  <span>Rp 6.000.000</span>
                  <span>Rp 12.000.000</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setMinPrice(1000000);
                    setMaxPrice(5000000);
                  }}
                  className="px-2.5 py-1 text-xs border border-[#DDD] hover:border-[#121212] text-[#444]"
                >
                  Under Rp 5M
                </button>
                <button
                  onClick={() => {
                    setMinPrice(5000000);
                    setMaxPrice(12000000);
                  }}
                  className="px-2.5 py-1 text-xs border border-[#DDD] hover:border-[#121212] text-[#444]"
                >
                  Rp 5M - 12M
                </button>
                <button
                  onClick={() => {
                    setMinPrice(1000000);
                    setMaxPrice(12000000);
                  }}
                  className="px-2.5 py-1 text-xs text-[#777] hover:text-[#121212] underline"
                >
                  All Prices
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Cards Grid: 66 products! */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white border border-[#E8E4DB] px-6">
          <p className="font-serif-display text-xl text-[#121212] mb-2">
            No pieces match your current criteria
          </p>
          <p className="text-xs text-[#7A756D] max-w-sm mx-auto mb-6">
            We couldn't find items matching your search or price range. Try broadening your criteria or reset the filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-6 py-2.5 bg-[#121212] text-white text-xs uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
