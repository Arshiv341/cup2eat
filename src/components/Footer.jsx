import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { BRAND } from '../theme/brand';

const Footer = () => {
  return (
    <footer className="bg-[#142B21] text-[#C9D7CE] pt-16 pb-12 border-t border-[#2A4836]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C8A051] bg-[#1B382B] shrink-0">
                <img
                  src={BRAND.logo.src}
                  alt={BRAND.logo.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-extrabold text-2xl text-[#FBF9F5] tracking-tight leading-none">
                  CUP<span className="text-[#C8A051] mx-1">2</span>EAT
                </span>
                <span className="block text-[10px] text-[#A4BCAD] uppercase font-bold tracking-wider mt-0.5">
                  The Cup You Can Eat
                </span>
              </div>
            </div>
            <p className="text-xs text-[#A4BCAD] leading-relaxed">
              {BRAND.subheadline} Turning every chai and coffee into an edible, memorable snack.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1B382B] border border-[#C8A051]/40 hover:bg-[#C8A051] hover:text-[#142B21] text-[#FBF9F5] flex items-center justify-center transition-colors"
                aria-label="Cup2Eat Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="w-9 h-9 rounded-full bg-[#1B382B] border border-[#C8A051]/40 hover:bg-[#C8A051] hover:text-[#142B21] text-[#FBF9F5] flex items-center justify-center transition-colors"
                aria-label="Cup2Eat Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#FBF9F5] font-bold text-xs uppercase tracking-widest mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#D4AF37] transition-colors">Shop All Edible Cups</Link>
              </li>
              <li>
                <a href="/#our-cups" className="hover:text-[#D4AF37] transition-colors">Flavours & Specifications</a>
              </li>
              <li>
                <a href="/#about-us" className="hover:text-[#D4AF37] transition-colors">Brand Story</a>
              </li>
              <li>
                <a href="/#ingredients" className="hover:text-[#D4AF37] transition-colors">Ingredients Information</a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#D4AF37] transition-colors">Order Tracking</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-[#FBF9F5] font-bold text-xs uppercase tracking-widest mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-xs text-[#A4BCAD]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8A051] shrink-0 mt-0.5" />
                <span>{BRAND.contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8A051] shrink-0" />
                <a href={`mailto:${BRAND.contact.email}`} className="hover:text-[#FBF9F5]">
                  {BRAND.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C8A051] shrink-0" />
                <a href={`tel:${BRAND.contact.phone}`} className="hover:text-[#FBF9F5]">
                  {BRAND.contact.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Eco Pledge & Quality */}
          <div className="bg-[#1B382B] p-5 rounded-2xl border border-[#2A513A]">
            <div className="flex items-center gap-2 text-[#D4AF37] mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-wider">Zero-Waste Promise</span>
            </div>
            <p className="text-[11px] text-[#A4BCAD] leading-relaxed mb-4">
              100% baked grain formulation designed to completely replace single-use plastic cups.
            </p>
            <div className="text-[10px] text-[#A4BCAD] border-t border-[#2A513A] pt-3 flex items-center justify-between">
              <span>Secure Razorpay Gateway</span>
              <span className="text-[#D4AF37] font-semibold">SSL Encrypted</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2A4836] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A4BCAD] gap-4">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted for an eco-friendly dining experience.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
