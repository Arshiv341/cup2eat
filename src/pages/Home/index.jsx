import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Leaf, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  MessageCircle, 
  Coffee, 
  HelpCircle,
  Flame,
  Check,
  UtensilsCrossed,
  Droplets,
  HeartHandshake,
  Truck,
  PackageCheck
} from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { BRAND } from '../../theme/brand';
import AnimatedHero from '../../components/animations/AnimatedHero';
import ScrollReveal from '../../components/animations/ScrollReveal';
import CursorGlow from '../../components/animations/CursorGlow';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        if (data && data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const brandFeatures = [
    {
      num: "01",
      title: "100% Edible & Crispy",
      desc: "Freshly baked grain biscuit structure. The cup becomes a tasty part of your beverage experience.",
      icon: UtensilsCrossed,
    },
    {
      num: "02",
      title: "Holds Hot Chai Up to 85°C",
      desc: "Engineered to hold boiling hot tea, espresso, or hot chocolate for over 40 minutes without leaking or turning soggy.",
      icon: Flame,
    },
    {
      num: "03",
      title: "100% Pure Veg & Vegan",
      desc: "Crafted exclusively with wholesome wheat and plant-based grains. Suitable for all diets.",
      icon: Leaf,
    },
    {
      num: "04",
      title: "0% Plastic & Zero Waste",
      desc: "Eliminates single-use plastic, styrofoam, and wax-lined paper cups that clog landfills.",
      icon: ShieldCheck,
    },
    {
      num: "05",
      title: "Memorable Taste & Crunch",
      desc: "Available in aromatic Chocolate, warm Vanilla, and authentic Elaichi (Cardamom) flavours.",
      icon: Sparkles,
    },
    {
      num: "06",
      title: "Nationwide Doorstep Delivery",
      desc: "Full Sealed Boxes of 200 Pieces qualify for FREE Doorstep Delivery across India (orders > ₹499).",
      icon: Truck,
    },
  ];

  const faqs = [
    {
      q: "How long does a Cup2Eat cup hold hot tea or coffee?",
      a: "Cup2Eat edible wafer cups are specially baked with high-density food-grade barrier technology. They can comfortably hold steaming hot chai or coffee for 35 to 45+ minutes without leaking or softening prematurely."
    },
    {
      q: "What is the purchasing configuration and pricing?",
      a: "Single Pieces are available at ₹20 per cup. Full Sealed Boxes contain 200 Pieces at ₹4,000 (₹20 per cup) and qualify for FREE doorstep delivery across India."
    },
    {
      q: "How are the edible cups packaged for shipping?",
      a: "Our Full Sealed Boxes (200 pieces) are shipped with custom protective food-grade packaging to ensure every cup reaches you crispy, fresh, and completely intact."
    },
    {
      q: "What is the Free Delivery threshold?",
      a: "We offer FREE Doorstep Delivery on all orders strictly above ₹499. Orders of ₹499 or below use our standard flat delivery charge of ₹50."
    },
    {
      q: "What beverage options are Cup2Eat cups suitable for?",
      a: "We offer 100 ML cups optimized for hot tea, chai, espresso, and filter coffee, as well as heavy-gauge 150 ML cups for cold coffee, thick shakes, smoothies, and dessert servings."
    },
    {
      q: "Can I order in bulk for my café, restaurant, or wedding?",
      a: "Yes! We supply cafes, restaurants, corporate event planners, and catering businesses across India. You can order retail boxes directly through the shop or contact us directly on WhatsApp (+91 98181 92575) for commercial volume contracts."
    }
  ];

  return (
    <div className="bg-[#FBF9F5] text-[#1E2922] overflow-x-hidden">
      {/* 1. ADVANCED ANIMATED HERO SECTION - Zero gap, starts flush below Navbar */}
      <AnimatedHero />

      {/* Subsequent Content Sections with consistent vertical spacing */}
      <div className="space-y-20 sm:space-y-24 pb-20 pt-16 sm:pt-20">
        {/* 2. BRAND PHILOSOPHY SECTION */}
        <ScrollReveal direction="up" threshold={0.15}>
          <section id="about-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EDE4D5] rounded-3xl p-8 sm:p-14 border border-[#DFD1BD] shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#8A6728] block">
                  Brand Philosophy
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#1B382B] tracking-tight leading-tight">
                  More Than Just a Cup.
                </h2>
                <div className="w-16 h-1 bg-[#C8A051] rounded-full" />
              </div>

              <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-[#3E4D43] leading-relaxed">
                <p className="font-semibold text-[#1B382B]">
                  Cup2Eat is built around a simple idea — why should the cup be something you throw away when it can become part of the experience?
                </p>
                <p>
                  We bring edible cups to cafés, restaurants, events, and businesses looking for a unique, memorable, and sustainable way to serve hot and cold beverages.
                </p>
                <p>
                  From everyday chai and espresso to cold frappes and desserts, Cup2Eat turns an ordinary beverage into an experience customers remember and talk about.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 3. FEATURES SECTION: Clean 6-feature grid with subtle hover */}
      <ScrollReveal direction="up" threshold={0.15}>
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#8A6728] block mb-2">
              Engineered For Beverages
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1B382B] tracking-tight">
              Crafted For Taste. Built For Purpose.
            </h2>
            <p className="text-xs sm:text-sm text-[#556058] mt-2">
              A delicious, zero-waste dining alternative for cafés, venues, and conscientious beverage lovers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-7 rounded-2xl border border-[#EAE3D9] hover:border-[#C8A051] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-xs space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F7F5] group-hover:bg-[#1B382B] text-[#1B382B] group-hover:text-[#D4AF37] flex items-center justify-center border border-[#C9D7CE] transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#8A6728]">{feat.num}</span>
                  </div>
                  <h3 className="font-black text-base text-[#1B382B] group-hover:text-[#8A6728] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#556058] leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* 4. PRODUCT SHOWCASE SECTION: Real edible biscuit-style cups */}
      <ScrollReveal direction="up" threshold={0.1}>
        <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[#8A6728] font-black text-[11px] uppercase tracking-widest mb-1">
                <Flame className="w-4 h-4 text-[#C8A051]" />
                Edible Biscuit Tableware Catalogue
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B382B] tracking-tight">
                Signature Edible Cups & Flavour Lines
              </h2>
              <p className="text-xs text-[#556058] mt-1">
                Single Piece @ ₹20 • Full Sealed Box of 200 Pcs @ ₹4,000 (FREE Delivery Qualified).
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 font-bold text-[#1B382B] hover:text-[#C8A051] text-xs uppercase tracking-wider transition-colors"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4 text-[#C8A051]" />
            </Link>
          </div>

          {/* Pricing & Free Delivery Notice Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-[#EDE4D5]/80 border border-[#DFD1BD] text-xs text-[#4A3B2A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <Truck className="w-5 h-5 text-[#8A6728] shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <strong className="text-[#1B382B]">FREE Doorstep Delivery on Orders Above ₹499:</strong>
                <span className="block sm:inline sm:ml-1 text-[#556058]">
                  Full Sealed Boxes (200 Pcs @ ₹4,000) automatically ship free with door delivery across India.
                </span>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#1B382B] text-[#D4AF37] font-bold text-[10px] uppercase rounded-full tracking-wider shrink-0">
              Verified Policy
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse h-96" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
              <Coffee className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-slate-800">Products Loading</h3>
              <p className="text-sm text-slate-500 mt-1">Connecting to MongoDB Atlas...</p>
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* 5. INGREDIENTS SECTION (Reference Information) */}
      <ScrollReveal direction="up" threshold={0.15}>
        <section id="ingredients" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE3D9] shadow-sm">
            <div className="max-w-3xl space-y-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#8A6728] block">
                Formulation & Food Safety
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B382B] tracking-tight">
                Wholesome Baked Grain Formulation
              </h2>
              <p className="text-xs sm:text-sm text-[#556058] leading-relaxed">
                Crafted with balanced food-grade grain flours and vegetable oils to provide a crispy texture and leak-proof resilience without any plastic, wax, or chemical film lining.
              </p>

              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E2D5] text-xs text-[#3E4D43] leading-relaxed font-mono">
                <strong className="font-sans block text-xs uppercase font-extrabold text-[#1B382B] mb-1">
                  Reference Ingredient Declaration:
                </strong>
                Refined Wheat Flour (Maida), Wheat Flour, Pulses, Corn Flour, Dextrose Sugar, Salt, Emulsifiers, Food Colours INS 102, INS 122, INS 133, Acidity Regulator (INS 514), Vegetable Oil, Baking Powder E500, Artificial Flavouring Substances, Preservatives E223 and Spices.
              </div>

              <p className="text-[11px] text-[#7A857E] italic">
                * Note: Ingredient declaration is sourced from product packaging references. Verified lab sign-offs can be customized via store settings.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. USAGE SCENARIOS: Cafes, Restaurants & Events */}
      <ScrollReveal direction="up" threshold={0.15}>
        <section className="bg-[#EDE4D5]/60 py-16 border-y border-[#DFD1BD]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#8A6728] block mb-1">
                Versatile Hospitality Applications
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B382B]">
                Every Sip. Every Occasion.
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Hot Indian Chai", temp: "Hot", note: "100 ML Cup • Stays crisp 40+ mins" },
                { name: "Espresso & Mocha", temp: "Hot", note: "Chocolate & Vanilla flavoured cups" },
                { name: "Cold Coffee & Shakes", temp: "Cold", note: "150 ML Cup • Chilled beverage waffle" },
                { name: "Ice Cream & Desserts", temp: "Cold", note: "Gelato, mousse & sweet waffle bowls" },
              ].map((useCase, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-[#DFD1BD] text-center space-y-2 hover:shadow-md transition-shadow">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#1B382B] text-[#D4AF37]">
                    {useCase.temp}
                  </span>
                  <h4 className="font-bold text-sm text-[#1B382B]">{useCase.name}</h4>
                  <p className="text-[11px] text-[#6C7A70]">{useCase.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 7. FAQ ACCORDION */}
      <ScrollReveal direction="up" threshold={0.15}>
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#8A6728] block mb-1">
              Common Questions
            </span>
            <h2 className="text-3xl font-black text-[#1B382B] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E8E2D5] rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1B382B] hover:text-[#8A6728] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-[#C8A051] transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#556058] leading-relaxed border-t border-[#F2EDE4]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 8. WHOLESALE & SAMPLE ENQUIRY SECTION */}
      <ScrollReveal direction="up" threshold={0.15}>
        <section id="wholesale" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#142B21] to-[#1E3A2B] rounded-3xl p-8 sm:p-14 text-white border border-[#2A4836] shadow-xl text-center space-y-6">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#C8A051] text-[#142B21] inline-block">
              Business & Café Partnerships
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FBF9F5] max-w-2xl mx-auto">
              Ready to Upgrade Your Café or Event with Cup2Eat?
            </h2>
            <p className="text-xs sm:text-sm text-[#C8D6CF] max-w-xl mx-auto leading-relaxed">
              Order commercial cartons of 200 pieces with free delivery, or speak with our hospitality specialists for custom branded sleeves and recurring scheduled deliveries.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${BRAND.contact.whatsappNumber}?text=${encodeURIComponent("Hello Cup2Eat team! I would like to inquire about commercial supply and bulk carton pricing for our business.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-[#C8A051] hover:bg-[#D4AF37] text-[#142B21] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 98181 92575)</span>
              </a>

              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-[#1B382B] hover:bg-[#254A37] text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-[#C8A051]/40 transition-colors"
              >
                Shop Full Sealed Boxes
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
      </div>

      {/* Desktop Ambient Cursor Glow (Positioned fixed, outside DOM flow) */}
      <CursorGlow />
    </div>
  );
};

export default HomePage;
