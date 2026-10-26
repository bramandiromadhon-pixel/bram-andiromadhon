import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryShowcaseProps {
  onSelectCategory: (cat: ProductCategory) => void;
  selectedCategory: ProductCategory | 'All';
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const categories: {
    name: ProductCategory;
    label: string;
    description: string;
    image: string;
    priceRange: string;
    itemCount: number;
  }[] = [
    {
      name: 'Formal',
      label: 'Formal Tailoring',
      description: 'Savile Row full-canvas tuxedos, Fox Brothers flannels & Sea Island shirting.',
      image: '/src/assets/images/category_formal_tailoring_1793016169715.jpg',
      priceRange: 'Rp 4.2M - Rp 11.95M',
      itemCount: 13,
    },
    {
      name: 'Shoes',
      label: 'Footwear & Brogues',
      description: 'Goodyear-welted oxfords, Horween cordovan boots, and minimalist sneakers.',
      image: '/src/assets/images/category_designer_shoes_1793016170579.jpg',
      priceRange: 'Rp 3.6M - Rp 11.8M',
      itemCount: 14,
    },
    {
      name: 'Fragrance',
      label: 'Haute Parfumerie',
      description: '38% high-concentration extraits, 15-year aged Cambodian agarwood & Grasse florals.',
      image: '/src/assets/images/category_luxury_fragrance_1793016170779.jpg',
      priceRange: 'Rp 2.45M - Rp 6.8M',
      itemCount: 12,
    },
    {
      name: 'Dress',
      label: 'Evening & Silk Dresses',
      description: 'Heavy 40mm silk crepe column gowns, bias-cut slips & hand-embroidered paillettes.',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      priceRange: 'Rp 2.85M - Rp 12.0M',
      itemCount: 14,
    },
    {
      name: 'Cap',
      label: 'Artisanal Caps & Hats',
      description: 'Mongolian cashmere baseball caps, Grade 12 Toquilla straw & Italian lambskin.',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      priceRange: 'Rp 1.15M - Rp 2.95M',
      itemCount: 13,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-[#E8E4DB]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C877D] font-mono">
            Curated Disciplines
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#121212] font-normal tracking-tight mt-1">
            Five Pillars of the Sigma Wardrobe
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#6E6A63] max-w-md">
          Explore individual ateliers specializing in structural evening wear, hand-welted leather soles, and niche Grasse extraits.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => {
                onSelectCategory(cat.name);
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`group text-left relative overflow-hidden bg-white border transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? 'border-[#121212] ring-1 ring-[#121212] shadow-md'
                  : 'border-[#E6E1D8] hover:border-[#121212] hover:shadow-sm'
              }`}
            >
              {/* Image Container with 4:3 Aspect */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EBE7DF]">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to stylized SVG placeholder if external URL fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-2 right-2 bg-[#121212]/80 backdrop-blur-sm text-white p-1 text-[10px] flex items-center gap-1 font-mono">
                  <span>{cat.itemCount} items</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif-display text-base font-semibold text-[#121212] group-hover:text-[#8B7355] transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-[11px] text-[#736E65] line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[#8C877D]">{cat.priceRange}</span>
                  <span className="font-semibold text-[#121212] group-hover:underline">View</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
