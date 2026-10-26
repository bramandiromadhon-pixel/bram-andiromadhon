import React from 'react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory | 'All') => void;
  onOpenTracking: () => void;
  onOpenHelp: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTracking,
  onOpenHelp,
}) => {
  return (
    <footer className="bg-[#121212] text-[#B0AAA0] border-t border-[#262422]">
      {/* Upper Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif-display text-2xl tracking-[0.25em] text-[#FAF9F6] font-semibold block uppercase">
              SIGMA
            </span>
            <p className="text-xs text-[#8C877D] leading-relaxed max-w-sm">
              Sigma is an Indonesian luxury fashion maison dedicated to architectural silhouettes, Savile Row structural tailoring, rare Grasse extraits, and Goodyear-welted leathercraft.
            </p>
            <div className="text-xs text-[#8C877D] space-y-1 pt-2 font-mono">
              <div>Boutique: Pacific Place SCBD Level 1, Jakarta Selatan</div>
              <div>Hotline: (021) 5088 7446 · WhatsApp: +62 811 8900 7446</div>
              <div>Operational Hours: Monday – Sunday, 08:00 – 22:00 WIB</div>
            </div>
          </div>

          {/* Column 1: Collections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F6] font-semibold font-mono">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('Formal')}
                  className="hover:text-white transition-colors"
                >
                  Formal & Bespoke Tuxedos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Shoes')}
                  className="hover:text-white transition-colors"
                >
                  Goodyear-Welted Footwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Dress')}
                  className="hover:text-white transition-colors"
                >
                  Silk Gowns & Evening Slips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Fragrance')}
                  className="hover:text-white transition-colors"
                >
                  Haute Parfumerie Extraits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Cap')}
                  className="hover:text-white transition-colors"
                >
                  Artisanal Caps & Headwear
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Client Services */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F6] font-semibold font-mono">
              Client Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition-colors">
                  Track Delivery & Resi
                </button>
              </li>
              <li>
                <button onClick={onOpenHelp} className="hover:text-white transition-colors">
                  Call Center & Concierge
                </button>
              </li>
              <li>
                <button onClick={onOpenHelp} className="hover:text-white transition-colors">
                  14-Day Return Method & Rules
                </button>
              </li>
              <li>
                <button onClick={onOpenHelp} className="hover:text-white transition-colors">
                  Size Guide & Alterations
                </button>
              </li>
              <li>
                <button onClick={onOpenHelp} className="hover:text-white transition-colors">
                  Authenticity Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Logistics & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F6] font-semibold font-mono">
              Indonesian Logistics
            </h4>
            <p className="text-xs text-[#8C877D] leading-relaxed">
              Dispatched daily from our SCBD Central Jakarta fulfillment hub via JNE Express, SiCepat BEST, and Paxel White-Glove Vault.
            </p>
            <div className="pt-2 text-[11px] text-[#A6A095]">
              <span className="block font-semibold text-white mb-1">Accepted Payment Methods:</span>
              <span className="leading-relaxed">
                BCA, Mandiri, BNI, BRI, Permata Virtual Account, QRIS (GoPay, OVO, DANA, ShopeePay), Visa, Mastercard, Kredivo.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright and Legal */}
      <div className="border-t border-[#1F1E1D] bg-[#0A0A0A] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B665E] gap-4">
          <div>
            © 2026 PT Sigma Moda Indonesia. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Notice</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>OJK & Bank Indonesia Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
