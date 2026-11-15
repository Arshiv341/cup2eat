import React from 'react';

/**
 * Realistic Multi-Strand Rising Steam Animation
 * 
 * Uses organic SVG bezier curve paths with staggered CSS keyframe transforms
 * (translation, scaling, opacity and blur diffusion) to render natural aromatic steam.
 */
const RisingSteam = ({ className = '' }) => {
  return (
    <div
      className={`relative w-48 h-48 pointer-events-none select-none overflow-visible ${className}`}
      aria-hidden="true"
    >
      {/* SVG Steam Strands with blur filter */}
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <filter id="steamBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="softSteamBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="9" />
          </filter>

          <linearGradient id="steamGrad1" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#FFF9E6" stopOpacity="0.45" />
            <stop offset="80%" stopColor="#F5ECE0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F5ECE0" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="steamGrad2" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#FFF2D6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EFE8DD" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Strand 1 - Center Left rising vapor */}
        <path
          d="M 95 210 Q 82 170 98 130 T 88 50 T 105 10"
          stroke="url(#steamGrad1)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#steamBlur)"
          className="animate-steam-1 origin-bottom"
        />

        {/* Strand 2 - Center Right rising curl */}
        <path
          d="M 112 210 Q 128 165 110 125 T 124 55 T 115 15"
          stroke="url(#steamGrad2)"
          strokeWidth="16"
          strokeLinecap="round"
          filter="url(#steamBlur)"
          className="animate-steam-2 origin-bottom"
        />

        {/* Strand 3 - Soft central ambient plume */}
        <path
          d="M 102 215 Q 115 175 100 135 T 108 65 T 98 20"
          stroke="url(#steamGrad1)"
          strokeWidth="20"
          strokeLinecap="round"
          filter="url(#softSteamBlur)"
          className="animate-steam-3 origin-bottom"
        />

        {/* Strand 4 - Outer gentle drift */}
        <path
          d="M 88 215 Q 70 170 90 120 T 78 50 T 92 10"
          stroke="url(#steamGrad2)"
          strokeWidth="12"
          strokeLinecap="round"
          filter="url(#steamBlur)"
          className="animate-steam-4 origin-bottom"
        />
      </svg>
    </div>
  );
};

export default RisingSteam;
