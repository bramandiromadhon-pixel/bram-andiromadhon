import React, { useState } from 'react';
import { ShoppingBag, Search, PackageCheck, Headphones, Menu, X } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectCategory: (cat: ProductCategory | 'All') => void;
  selectedCategory: ProductCategory | 'All';
  onOpenTracking: () => void;
  onOpenHelp: () => void;
  onToggleSearch: () => void;
  isSearchOpen: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onSelectCategory,
  selectedCategory,
  onOpenTracking,
  onOpenHelp,
  onToggleSearch,
  isSearchOpen,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories: { label: string; value: ProductCategory | 'All' }[] = [
    { label: 'All Pieces', value: 'All' },
    { label: 'Caps', value: 'Cap' },
    { label: 'Shoes', value: 'Shoes' },
    { label: 'Dresses', value: 'Dress' },
    { label: 'Formal', value: 'Formal' },
    { label: 'Fragrance', value: 'Fragrance' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E6E1D8] transition-colors">
      {/* Top Announcement Bar */}
      <div className="bg-[#121212] text-[#E8E6DF] py-1.5 px-4 text-center text-xs tracking-wider">
        <span className="font-medium">SIGMA HAUTE COUTURE</span>
        <span className="mx-2 text-[#888880]">·</span>
        <span>Complimentary Insured Delivery Across Indonesia on Orders over Rp 3.000.000</span>
        <span className="mx-2 text-[#888880] hidden sm:inline">·</span>
        <span className="hidden sm:inline text-[#D4AF37]">Flagship Boutique: Pacific Place SCBD Jakarta</span>
      </div>

      {/* Main Top Bar: Zone 1, Zone 2, Zone 3 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#121212] hover:text-[#555] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex flex-col items-start leading-none shrink-0"
          >
            <span className="font-serif-display text-2xl sm:text-3xl tracking-[0.25em] font-semibold text-[#121212] uppercase">
              SIGMA
            </span>
            <span className="text-[9px] tracking-[0.35em] text-[#7A756D] uppercase font-sans mt-0.5">
              Haute Couture
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs tracking-[0.15em] uppercase font-medium text-[#4A4742]">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                selectedCategory === cat.value
                  ? 'border-[#121212] text-[#121212] font-semibold'
                  : 'border-transparent text-[#6B665E] hover:text-[#121212]'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <button
            onClick={onOpenTracking}
            className="whitespace-nowrap text-[#6B665E] hover:text-[#121212] transition-colors pb-1 border-b-2 border-transparent hover:border-[#121212] flex items-center gap-1.5"
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Track Order</span>
          </button>
          <button
            onClick={onOpenHelp}
            className="whitespace-nowrap text-[#6B665E] hover:text-[#121212] transition-colors pb-1 border-b-2 border-transparent hover:border-[#121212] flex items-center gap-1.5"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Help & Concierge</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & Utilities */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={onToggleSearch}
            className={`p-2.5 rounded-full transition-colors flex items-center gap-1 text-xs uppercase tracking-wider ${
              isSearchOpen ? 'bg-[#EAE5DC] text-[#121212]' : 'text-[#4A4742] hover:text-[#121212] hover:bg-[#F0ECE2]'
            }`}
            title="Search products"
            aria-label="Search collection"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px] font-sans">Search</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative px-3 sm:px-4 py-2 text-xs uppercase tracking-widest font-semibold text-white bg-[#121212] hover:bg-[#2A2927] transition-all flex items-center gap-2"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono text-xs px-1.5 py-0.2 bg-[#D4AF37] text-[#121212] font-bold rounded-sm">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Search Bar */}
      {isSearchOpen && (
        <div className="border-t border-[#E6E1D8] bg-white px-4 sm:px-6 lg:px-8 py-3 transition-all animate-fadeIn">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-[#8C877D] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across 66+ luxury pieces (e.g. Oxford, Cashmere Cap, Extrait, Tuxedo, Silk Gown)..."
              className="w-full text-sm text-[#121212] placeholder-[#9E998E] bg-transparent border-none focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#8C877D] hover:text-[#121212] underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6E1D8] bg-[#FAF9F6] px-6 py-6 space-y-4">
          <div className="text-[10px] uppercase tracking-widest text-[#8C877D] font-semibold">
            Collections & Categories
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  onSelectCategory(cat.value);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded text-xs uppercase tracking-wider font-medium ${
                  selectedCategory === cat.value
                    ? 'bg-[#121212] text-white'
                    : 'bg-white border border-[#E8E4DB] text-[#333]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E6E1D8] space-y-2 text-xs">
            <button
              onClick={() => {
                onOpenTracking();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 bg-white border border-[#E8E4DB] text-[#121212] uppercase tracking-wider font-semibold"
            >
              <span className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4" />
                Track Order & Resi
              </span>
              <span>→</span>
            </button>
            <button
              onClick={() => {
                onOpenHelp();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 bg-white border border-[#E8E4DB] text-[#121212] uppercase tracking-wider font-semibold"
            >
              <span className="flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                Help, Call Center & Returns
              </span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
