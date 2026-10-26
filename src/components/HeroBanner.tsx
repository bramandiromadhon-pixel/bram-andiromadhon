import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeroBannerProps {
  onExplore: () => void;
  onSelectCategory: (cat: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExplore, onSelectCategory }) => {
  return (
    <section className="relative overflow-hidden bg-[#121212] text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
        {/* Left Column: Brand Statement & Editorial Narrative */}
        <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between z-10">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLECTION 2026 / VOL. IV</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.08] text-[#F5F2EB] mb-6 text-balance">
              The Architecture of Pure Silhouette.
            </h1>

            <p className="text-sm sm:text-base text-[#B0AAA0] font-light leading-relaxed max-w-lg mb-8">
              Sigma redefines contemporary Indonesian luxury through structural tailoring, rare Grasse extraits, Italian leather brogues, and bespoke silk drapery.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onExplore}
                className="px-6 py-3.5 bg-[#FAF9F6] text-[#121212] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-[#121212] transition-all flex items-center gap-2"
              >
                <span>Explore 66 Pieces</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectCategory('Formal')}
                className="px-5 py-3.5 border border-[#44423E] text-[#D6D2CA] text-xs font-medium uppercase tracking-[0.18em] hover:border-white hover:text-white transition-all"
              >
                Formal & Tailoring
              </button>
            </div>
          </div>

          {/* Adjacency Proof Strip */}
          <div className="pt-8 mt-8 border-t border-[#262422] grid grid-cols-3 gap-4 text-xs">
            <div>
              <div className="font-mono text-base font-medium text-white tabular-nums">66+</div>
              <div className="text-[11px] text-[#8C877D] uppercase tracking-wider mt-0.5">Curated Pieces</div>
            </div>
            <div>
              <div className="font-mono text-base font-medium text-white tabular-nums">100%</div>
              <div className="text-[11px] text-[#8C877D] uppercase tracking-wider mt-0.5">Authenticity</div>
            </div>
            <div>
              <div className="font-mono text-base font-medium text-white tabular-nums">1-2 Days</div>
              <div className="text-[11px] text-[#8C877D] uppercase tracking-wider mt-0.5">Express Delivery</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Canvas */}
        <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-full">
          <img
            src="/src/assets/images/hero_sigma_runway_1793016169303.jpg"
            alt="Sigma Runway Haute Couture Collection 2026"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#121212] via-transparent to-transparent opacity-80" />

          {/* Visual Floating Editorial Tag */}
          <div className="absolute bottom-6 right-6 hidden sm:block bg-[#121212]/80 backdrop-blur-md border border-[#333] p-3 text-right max-w-xs">
            <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase block font-mono">
              Campaign Feature
            </span>
            <span className="text-xs text-[#EAE6DF] font-light">
              Look 01: Mongolian Cashmere Overcoat & Barathea Tuxedo
            </span>
          </div>
        </div>
      </div>

      {/* Trust Badges Strip */}
      <div className="border-t border-[#222120] bg-[#161514] px-4 py-3.5 text-xs text-[#9E998E]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>14-Day Full Return & Authenticity Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#D4AF37]" />
            <span>Real-time Tracking via JNE, SiCepat & Paxel White-Glove</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#D4AF37] font-semibold">IDR</span>
            <span>All Prices Inclusive of Luxury Import Duty & Tax</span>
          </div>
        </div>
      </div>
    </section>
  );
};
