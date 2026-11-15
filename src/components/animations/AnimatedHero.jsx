import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Coffee, Heart } from 'lucide-react';
import RisingSteam from './RisingSteam';

const AnimatedHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#142B21] via-[#1B382B] to-[#12241B] text-[#FBF9F5] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mt-0">
      {/* 1. Subtle Warm Sunlight Rays & Ambient Cafe Lighting Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 75% 20%, rgba(212, 175, 55, 0.28) 0%, rgba(200, 160, 81, 0.08) 40%, transparent 70%),
            radial-gradient(circle at 20% 80%, rgba(27, 56, 43, 0.6) 0%, transparent 60%)
          `,
        }}
      />

      {/* Decorative Warm Sunlight Beam */}
      <div
        className="absolute -top-32 right-1/4 w-96 h-[600px] pointer-events-none rotate-12 opacity-20 blur-3xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 230, 150, 0.4) 0%, rgba(200, 160, 81, 0.1) 60%, transparent 100%)',
        }}
      />

      {/* 2. Main Hero Grid */}
      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Column: Brand Typography & Action CTAs (Takes 7 cols) */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          {/* Natural Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2A4836]/90 border border-[#C8A051]/40 text-[#D4AF37] text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-lg animate-gentle-float">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>The Original Edible Cup Revolution</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-[#FBF9F5]">
              EAT YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C8A051]">
                DRINK.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl font-serif italic text-[#D4AF37] tracking-wide pt-1">
              "The Cup You Can Eat."
            </p>
          </div>

          {/* Value Narrative */}
          <p className="text-base sm:text-lg text-[#C8D6CF] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
            An edible way to make every sip more memorable. Pour steaming hot Indian chai, artisan coffee, or decadent desserts into baked, crispy biscuit cups. Drink your beverage, then enjoy the cup!
          </p>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 pt-2 pb-2">
            <div className="p-3 rounded-2xl bg-[#142B21]/80 border border-[#2A513A] text-center">
              <span className="block text-lg font-black text-[#D4AF37]">85°C</span>
              <span className="text-[10px] uppercase font-bold text-[#A4BCAD]">Holds Hot 40 Min</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#142B21]/80 border border-[#2A513A] text-center">
              <span className="block text-lg font-black text-[#D4AF37]">100%</span>
              <span className="text-[10px] uppercase font-bold text-[#A4BCAD]">Baked & Edible</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#142B21]/80 border border-[#2A513A] text-center">
              <span className="block text-lg font-black text-[#D4AF37]">0%</span>
              <span className="text-[10px] uppercase font-bold text-[#A4BCAD]">Plastic Waste</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C8A051] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#C8A051] text-[#142B21] font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#C8A051]/20 flex items-center justify-center gap-3 group"
            >
              <span>Explore Our Cups</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#products-section"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#142B21] hover:bg-[#1B382B] text-[#FBF9F5] font-bold text-sm uppercase tracking-wider transition-all duration-300 border border-[#2A513A] hover:border-[#C8A051]/60 flex items-center justify-center gap-2"
            >
              <span>Shop Now</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Edible Cup with Real Steam & Wooden Table Setting (Takes 5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          {/* Cup Container with Atmospheric Lighting */}
          <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] flex items-center justify-center">
            
            {/* Ambient Sunlight Glow behind the Cup */}
            <div className="absolute top-1/4 w-72 h-72 rounded-full bg-gradient-to-tr from-[#C8A051]/30 via-[#D4AF37]/20 to-transparent blur-3xl pointer-events-none" />

            {/* Rising Continuous Steam Animation Positioned Above Cup Rim */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <RisingSteam />
            </div>

            {/* Realistic Edible Chai Cup Graphic Composition */}
            <div className="relative z-10 w-full flex flex-col items-center">
              
              {/* Cup Visual with Realistic Biscuit Texture, Rim and Hot Chai Liquid Surface */}
              <div className="relative w-64 sm:w-72 h-72 sm:h-80 drop-shadow-2xl transition-transform duration-500 hover:scale-105">
                <svg
                  viewBox="0 0 280 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    {/* Biscuit Exterior Gradient */}
                    <linearGradient id="biscuitExterior" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7A4E2B" />
                      <stop offset="25%" stopColor="#A87243" />
                      <stop offset="55%" stopColor="#C48E59" />
                      <stop offset="85%" stopColor="#9C6639" />
                      <stop offset="100%" stopColor="#694022" />
                    </linearGradient>

                    {/* Dark Chocolate Inner Coating Glaze */}
                    <linearGradient id="chocolateInner" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#301A10" />
                      <stop offset="50%" stopColor="#4A2818" />
                      <stop offset="100%" stopColor="#25140C" />
                    </linearGradient>

                    {/* Hot Indian Chai Liquid Surface */}
                    <radialGradient id="chaiLiquid" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#E49B5B" />
                      <stop offset="45%" stopColor="#C27A3C" />
                      <stop offset="80%" stopColor="#8C4E20" />
                      <stop offset="100%" stopColor="#5E3112" />
                    </radialGradient>

                    {/* Wooden Table Surface Gradient */}
                    <linearGradient id="woodTableGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2A1B12" />
                      <stop offset="30%" stopColor="#442E20" />
                      <stop offset="65%" stopColor="#5A3E2C" />
                      <stop offset="100%" stopColor="#251710" />
                    </linearGradient>

                    {/* Soft Shadow Filter */}
                    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                      <feOffset dx="0" dy="16" result="offsetblur" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.4" />
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* 1. Wooden Table Surface Base */}
                  <ellipse cx="140" cy="285" rx="125" ry="24" fill="url(#woodTableGrad)" opacity="0.9" />
                  <ellipse cx="140" cy="283" rx="120" ry="20" fill="#1C120C" opacity="0.6" />

                  {/* 2. Cup Drop Shadow on Table */}
                  <ellipse cx="140" cy="275" rx="58" ry="14" fill="#000000" opacity="0.45" filter="url(#softShadow)" />

                  {/* 3. Edible Cup Tapered Body with Biscuit Ridge Texture */}
                  <path
                    d="M 68 85 L 88 265 C 89 272, 98 276, 140 276 C 182 276, 191 272, 192 265 L 212 85 Z"
                    fill="url(#biscuitExterior)"
                    filter="url(#softShadow)"
                  />

                  {/* Biscuit Horizontal Waffle Grid Rings */}
                  <path d="M 72 120 C 100 130, 180 130, 208 120" stroke="#5E381C" strokeWidth="2.5" opacity="0.5" fill="none" />
                  <path d="M 77 165 C 100 174, 180 174, 203 165" stroke="#5E381C" strokeWidth="2.5" opacity="0.5" fill="none" />
                  <path d="M 82 210 C 100 218, 180 218, 198 210" stroke="#5E381C" strokeWidth="2" opacity="0.45" fill="none" />

                  {/* Biscuit Texture Highlights (Warm Sunlight Reflection) */}
                  <path
                    d="M 165 92 L 152 265 C 158 266, 172 264, 178 260 L 195 92 Z"
                    fill="#FFFFFF"
                    opacity="0.12"
                  />

                  {/* 4. Cup Rim & Inner Chocolate Glaze Layer */}
                  <ellipse cx="140" cy="85" rx="72" ry="24" fill="url(#chocolateInner)" stroke="#4A2818" strokeWidth="4" />
                  <ellipse cx="140" cy="85" rx="66" ry="20" fill="#3D2012" />

                  {/* 5. Hot Steaming Chai Liquid Surface with Gentle Shimmer */}
                  <ellipse
                    cx="140"
                    cy="87"
                    rx="58"
                    ry="16"
                    fill="url(#chaiLiquid)"
                    className="animate-liquid-shimmer"
                  />

                  {/* Chai Liquid Creamy Foam & Golden Reflection Ring */}
                  <ellipse cx="134" cy="86" rx="42" ry="10" fill="#E8B078" opacity="0.3" />
                  <ellipse cx="130" cy="85" rx="20" ry="5" fill="#FFE2B8" opacity="0.4" />
                </svg>
              </div>

              {/* Floating Product Callout Pill */}
              <div className="mt-4 px-4 py-2 rounded-2xl bg-[#142B21]/90 border border-[#C8A051]/50 backdrop-blur-md shadow-xl flex items-center gap-2.5">
                <Coffee className="w-4 h-4 text-[#C8A051]" />
                <span className="text-xs font-bold text-[#FBF9F5]">100% Edible Chai Cup</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Subtle Bottom Wave Transition to Page Body */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#FBF9F5] to-transparent pointer-events-none" />
    </section>
  );
};

export default AnimatedHero;
