import React, { useState, useRef, useCallback } from 'react';
import { MoveHorizontal, Sparkles } from 'lucide-react';
import { BRAND_IMAGES } from '../data/detailingData';

interface ComparisonPreset {
  id: string;
  label: string;
  vehicle: string;
  beforeTitle: string;
  afterTitle: string;
  beforeStats: string;
  afterStats: string;
  beforeImg: string;
  afterImg: string;
  beforeFilter?: string;
}

const COMPARISON_PRESETS: ComparisonPreset[] = [
  {
    id: 'paint-correction',
    label: '2-Stage Paint Correction & 9H Ceramic',
    vehicle: 'Black & Crimson Metallic Hood · 209 Studio Bay',
    beforeTitle: 'Before: Swirl Marks, Oxidation & Water Etching',
    afterTitle: 'After: Two-Stage Jeweling & 9H Liquid Quartz Ceramic',
    beforeStats: 'Gloss Reading: 54.2 GU · Heavy Automated Wash Swirls',
    afterStats: 'Gloss Reading: 98.4 GU · 92% Defect Removal · Hydrophobic Bead',
    beforeImg: BRAND_IMAGES.paintCorrectionBefore,
    afterImg: BRAND_IMAGES.paintCorrectionAfter,
  },
  {
    id: 'interior-exterior-reset',
    label: 'Showroom Ceramic & Cockpit Restoration',
    vehicle: '1969 Classic Restomod & Luxury Cockpit · Stockton, CA',
    beforeTitle: 'Before: Hazy Clear Coat & Untreated Surfaces',
    afterTitle: 'After: Mirror Wet Gloss & Steam-Sanitized Cabin',
    beforeStats: 'Unprotected Clear Coat · Dull Surface Reflection',
    afterStats: '3-Year 9H Ceramic Armor · 212°F Steam Sanitized',
    beforeImg: BRAND_IMAGES.paintCorrectionBefore,
    afterImg: BRAND_IMAGES.heroClassicCar,
  },
];

interface BeforeAfterSliderProps {
  onBookTransformation?: (packageId: string) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ onBookTransformation }) => {
  const [activePresetIdx, setActivePresetIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(52);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const preset = COMPARISON_PRESETS[activePresetIdx];

  const updateSliderFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(Math.max(4, Math.min(96, percent)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPos((prev) => Math.max(5, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPos((prev) => Math.min(95, prev + 5));
    }
  };

  return (
    <div className="w-full">
      {/* Interactive Preset Switcher + Quick Percentages */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#C9CCD1]/15">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Comparison Presets">
          {COMPARISON_PRESETS.map((item, idx) => {
            const active = idx === activePresetIdx;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActivePresetIdx(idx)}
                className={`px-4 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer border ${
                  active
                    ? 'bg-[#A50F1B] text-[#F3EFE8] border-[#D91E2E] shadow-[0_0_20px_rgba(165,15,27,0.4)]'
                    : 'bg-[#141414] text-[#9A9A9F] border-[#C9CCD1]/15 hover:text-[#F3EFE8] hover:border-[#C9CCD1]/35'
                }`}
              >
                0{idx + 1}. {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs text-[#9A9A9F]">
          <span>Quick Inspect:</span>
          <button
            type="button"
            onClick={() => setSliderPos(15)}
            className="px-2.5 py-1 bg-[#141414] hover:bg-[#1C1C1C] text-[#F3EFE8] border border-[#C9CCD1]/15 transition-colors cursor-pointer whitespace-nowrap"
          >
            Full After
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(50)}
            className="px-2.5 py-1 bg-[#141414] hover:bg-[#1C1C1C] text-[#F3EFE8] border border-[#C9CCD1]/15 transition-colors cursor-pointer whitespace-nowrap"
          >
            50 / 50 Split
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(85)}
            className="px-2.5 py-1 bg-[#141414] hover:bg-[#1C1C1C] text-[#F3EFE8] border border-[#C9CCD1]/15 transition-colors cursor-pointer whitespace-nowrap"
          >
            Full Before
          </button>
        </div>
      </div>

      {/* Main Drag-to-Compare Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label="Drag left or right to compare before and after paint correction"
        aria-valuemin={5}
        aria-valuemax={95}
        aria-valuenow={Math.round(sliderPos)}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[560px] bg-[#141414] border border-[#A50F1B]/50 overflow-hidden select-none cursor-ew-resize group focus-visible:outline-2 focus-visible:outline-[#D91E2E]"
      >
        {/* Background Layer: AFTER Image (Right / Full Base) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1C1C1C] via-[#0A0A0A] to-[#5E0A10]/30">
          <img
            src={preset.afterImg}
            alt={preset.afterTitle}
            referrerPolicy="no-referrer"
            draggable={false}
            className="w-full h-full object-cover object-center select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />
        </div>

        {/* Foreground Clipped Layer: BEFORE Image (Left Side) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <div className="w-full h-full bg-[#141414]">
            <img
              src={preset.beforeImg}
              alt={preset.beforeTitle}
              referrerPolicy="no-referrer"
              draggable={false}
              className="w-full h-full object-cover object-center filter contrast-95 brightness-90 select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45 pointer-events-none" />
          </div>
        </div>

        {/* Top Unboxed Technical Labels */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="bg-black/80 backdrop-blur-md border-l-2 border-[#9A9A9F] px-3.5 py-2">
            <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#9A9A9F]">
              BEFORE INSPECTION
            </p>
            <p className="text-xs font-medium text-[#F3EFE8] hidden sm:block mt-0.5">
              {preset.beforeStats}
            </p>
          </div>

          <div className="bg-black/80 backdrop-blur-md border-r-2 border-[#D91E2E] px-3.5 py-2 text-right">
            <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#E8B84A]">
              AFTER YGO ROYAL SHINE
            </p>
            <p className="text-xs font-medium text-[#F3EFE8] hidden sm:block mt-0.5">
              {preset.afterStats}
            </p>
          </div>
        </div>

        {/* Vertical Divider Line & Crimson Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#D91E2E] shadow-[0_0_18px_#D91E2E] pointer-events-none z-20"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0A0A0A] border-2 border-[#D91E2E] shadow-[0_0_24px_rgba(217,30,46,0.8)] flex items-center justify-center text-[#F3EFE8] transition-transform duration-150 group-hover:scale-110">
            <MoveHorizontal className="w-5 h-5 text-[#F3EFE8]" />
          </div>
        </div>

        {/* Bottom Caption Bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col sm:flex-row sm:items-end justify-between gap-3 pointer-events-none z-10">
          <div>
            <p className="text-xs text-[#C9CCD1] tracking-wider uppercase font-mono-tabular">
              {preset.vehicle} · Split at {Math.round(sliderPos)}%
            </p>
            <h4 className="font-display text-xl sm:text-2xl text-[#F3EFE8] tracking-wider uppercase mt-0.5">
              {preset.label}
            </h4>
          </div>
          {onBookTransformation && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookTransformation('pkg-ultimate');
              }}
              className="pointer-events-auto self-start sm:self-auto px-4 py-2 bg-[#A50F1B] hover:bg-[#D91E2E] text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#C9CCD1]/25 transition-colors cursor-pointer whitespace-nowrap"
            >
              Book This Paint Correction →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
