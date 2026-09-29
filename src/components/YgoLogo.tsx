import React from 'react';

interface YgoLogoProps {
  variant?: 'navbar' | 'badge' | 'footer';
  className?: string;
}

export const YgoLogo: React.FC<YgoLogoProps> = ({ variant = 'badge', className = '' }) => {
  if (variant === 'navbar') {
    return (
      <span className={`inline-flex items-center gap-3 select-none ${className}`}>
        <svg
          width="38"
          height="38"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="shrink-0"
        >
          <circle cx="60" cy="60" r="57" fill="#0A0A0A" stroke="#A50F1B" strokeWidth="3.5" />
          <circle cx="60" cy="60" r="51" stroke="#C9CCD1" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="3 3" />
          {/* 5 Stars */}
          <g fill="#E8B84A">
            <polygon points="60,18 61.8,22.2 66.2,22.5 62.8,25.4 63.9,29.8 60,27.4 56.1,29.8 57.2,25.4 53.8,22.5 58.2,22.2" />
            <polygon points="43,21 44.5,24.5 48.2,24.8 45.4,27.2 46.3,30.8 43,28.8 39.7,30.8 40.6,27.2 37.8,24.8 41.5,24.5" />
            <polygon points="77,21 78.5,24.5 82.2,24.8 79.4,27.2 80.3,30.8 77,28.8 73.7,30.8 74.6,27.2 71.8,24.8 75.5,24.5" />
            <polygon points="28,28 29.2,30.8 32.2,31 29.9,33 30.6,36 28,34.4 25.4,36 26.1,33 23.8,31 26.8,30.8" />
            <polygon points="92,28 93.2,30.8 96.2,31 93.9,33 94.6,36 92,34.4 89.4,36 90.1,33 87.8,31 90.8,30.8" />
          </g>
          {/* Vintage Red Classic Muscle Car Silhouette */}
          <path
            d="M18 68 L28 65 L41 51 C44 48 48 47 54 47 L73 47 C79 47 83 49 87 54 L96 63 L103 66 C105 67 106 69 105 72 L103 77 L17 77 L15 72 C14 69 16 68 18 68 Z"
            fill="url(#crimsonGradNav)"
            stroke="#F3EFE8"
            strokeWidth="1.4"
          />
          {/* Classic Windshield & Chrome Trim */}
          <path
            d="M44 52 L53 52 L53 62 L35 62 Z M57 52 L73 52 L82 62 L57 62 Z"
            fill="#0A0A0A"
            stroke="#C9CCD1"
            strokeWidth="1.2"
          />
          {/* Chrome Bumper & Grille Line */}
          <line x1="15" y1="74" x2="105" y2="74" stroke="#C9CCD1" strokeWidth="2" />
          {/* Classic Wheels */}
          <circle cx="34" cy="77" r="9" fill="#0A0A0A" stroke="#C9CCD1" strokeWidth="2.5" />
          <circle cx="34" cy="77" r="4" fill="#D91E2E" />
          <circle cx="86" cy="77" r="9" fill="#0A0A0A" stroke="#C9CCD1" strokeWidth="2.5" />
          <circle cx="86" cy="77" r="4" fill="#D91E2E" />
          <defs>
            <linearGradient id="crimsonGradNav" x1="15" y1="47" x2="105" y2="78" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D91E2E" />
              <stop offset="60%" stopColor="#A50F1B" />
              <stop offset="100%" stopColor="#5E0A10" />
            </linearGradient>
          </defs>
        </svg>
        <span className="font-display text-2xl tracking-[0.14em] text-[#F3EFE8] uppercase whitespace-nowrap">
          YGO Detailing
        </span>
      </span>
    );
  }

  // Full circular vintage crest badge for Loading Screen, Hero Emblem, and Footer
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 220 220"
        className="w-full h-full max-w-[180px] max-h-[180px] drop-shadow-[0_0_25px_rgba(165,15,27,0.45)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="YGO Detailing Est. 2024 Vintage Classic Car Crest"
      >
        <defs>
          <linearGradient id="badgeRingGrad" x1="0" y1="0" x2="220" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D91E2E" />
            <stop offset="50%" stopColor="#A50F1B" />
            <stop offset="100%" stopColor="#5E0A10" />
          </linearGradient>
          <linearGradient id="carBodyGrad" x1="35" y1="95" x2="185" y2="145" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D91E2E" />
            <stop offset="55%" stopColor="#A50F1B" />
            <stop offset="100%" stopColor="#5E0A10" />
          </linearGradient>
          <path id="topTextArc" d="M 30,110 A 80,80 0 1,1 190,110" />
          <path id="bottomTextArc" d="M 182,122 A 74,74 0 0,1 38,122" />
        </defs>

        {/* Outer Obsidian & Crimson Ring */}
        <circle cx="110" cy="110" r="104" fill="#0A0A0A" stroke="url(#badgeRingGrad)" strokeWidth="5" />
        <circle cx="110" cy="110" r="95" fill="#0F0F0F" stroke="#C9CCD1" strokeOpacity="0.25" strokeWidth="1.2" />
        <circle cx="110" cy="110" r="68" fill="#0A0A0A" stroke="#A50F1B" strokeOpacity="0.45" strokeWidth="1.5" />

        {/* Curved Top Text: YGO DETAILING */}
        <text
          fill="#F3EFE8"
          fontSize="19"
          fontWeight="700"
          letterSpacing="5.5"
          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
        >
          <textPath href="#topTextArc" startOffset="50%" textAnchor="middle">
            YGO DETAILING
          </textPath>
        </text>

        {/* Five Gold & Crimson Stars Above the Car */}
        <g fill="#E8B84A">
          <polygon points="110,54 112.4,59.5 118.4,60 113.8,63.9 115.2,69.8 110,66.6 104.8,69.8 106.2,63.9 101.6,60 107.6,59.5" />
          <polygon points="88,59 90,63.6 95,64 91.2,67.2 92.4,72 88,69.4 83.6,72 84.8,67.2 81,64 86,63.6" />
          <polygon points="132,59 134,63.6 139,64 135.2,67.2 136.4,72 132,69.4 127.6,72 128.8,67.2 125,64 130,63.6" />
          <polygon points="69,68 70.6,71.8 74.6,72.1 71.5,74.8 72.5,78.8 69,76.6 65.5,78.8 66.5,74.8 63.4,72.1 67.4,71.8" />
          <polygon points="151,68 152.6,71.8 156.6,72.1 153.5,74.8 154.5,78.8 151,76.6 147.5,78.8 148.5,74.8 145.4,72.1 149.4,71.8" />
        </g>

        {/* Vintage Red Classic Car Centerpiece */}
        <g>
          {/* Subtle Crimson Glow Under Car */}
          <ellipse cx="110" cy="138" rx="62" ry="7" fill="#A50F1B" fillOpacity="0.45" />
          {/* Classic Fastback Muscle Car Silhouette */}
          <path
            d="M44 118 L62 113 L82 93 C86 89 92 87 102 87 L131 87 C140 87 146 90 152 98 L167 111 L179 115 C183 116 185 119 184 124 L180 132 L40 132 L37 124 C36 120 39 119 44 118 Z"
            fill="url(#carBodyGrad)"
            stroke="#F3EFE8"
            strokeWidth="1.8"
          />
          {/* Cabin Greenhouse Windows */}
          <path
            d="M84 93 L102 93 L102 109 L69 109 Z M107 93 L131 93 L145 109 L107 109 Z"
            fill="#0A0A0A"
            stroke="#C9CCD1"
            strokeWidth="1.5"
          />
          {/* Chrome Side Spear & Bumpers */}
          <path d="M38 125 L182 125" stroke="#C9CCD1" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M55 116 L165 116" stroke="#F3EFE8" strokeOpacity="0.55" strokeWidth="1" />
          {/* Classic Deep-Dish Chrome & Crimson Wheels */}
          <circle cx="67" cy="132" r="13.5" fill="#0A0A0A" stroke="#C9CCD1" strokeWidth="3.2" />
          <circle cx="67" cy="132" r="6.5" fill="#D91E2E" stroke="#F3EFE8" strokeWidth="1" />
          <circle cx="153" cy="132" r="13.5" fill="#0A0A0A" stroke="#C9CCD1" strokeWidth="3.2" />
          <circle cx="153" cy="132" r="6.5" fill="#D91E2E" stroke="#F3EFE8" strokeWidth="1" />
        </g>

        {/* Bottom Stacked / Curved EST. 2024 */}
        <line x1="72" y1="158" x2="148" y2="158" stroke="#A50F1B" strokeWidth="1.5" />
        <text
          x="110"
          y="175"
          textAnchor="middle"
          fill="#C9CCD1"
          fontSize="13.5"
          fontStyle="italic"
          fontWeight="600"
          letterSpacing="3"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          EST. 2024
        </text>
        <text
          x="110"
          y="193"
          textAnchor="middle"
          fill="#9A9A9F"
          fontSize="9.5"
          letterSpacing="2.8"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          209 AREA · CALIFORNIA
        </text>
      </svg>
    </div>
  );
};
