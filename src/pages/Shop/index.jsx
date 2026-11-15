import React, { useState, useEffect } from 'react';
import { Search, Coffee, HelpCircle } from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        if (data && data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to fetch shop products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', '100 ML | HOT', '150 ML | COLD', 'Chocolate Coated'];

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const getMinPrice = (p) => p.variants?.[0]?.price || 0;
      if (sortBy === 'price-low') return getMinPrice(a) - getMinPrice(b);
      if (sortBy === 'price-high') return getMinPrice(b) - getMinPrice(a);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 bg-[#FBF9F5]">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#8A6728] block mb-1">
          Complete Collection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1B382B] tracking-tight">
          Shop Cup2Eat Edible Cups
        </h1>
        <p className="text-xs sm:text-sm text-[#556058] mt-2">
          100 ML Hot beverage cups (Chocolate, Vanilla, Elaichi), 150 ML Cold beverage cups, and Chocolate Coated waffle cups.
        </p>
      </div>

      {/* Pricing & Free Delivery Overview */}
      <div className="mb-8 p-4 rounded-2xl bg-[#EDE4D5]/80 border border-[#DFD1BD] text-xs text-[#4A3B2A] flex items-start gap-3 shadow-xs">
        <HelpCircle className="w-5 h-5 text-[#8A6728] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#1B382B]">Purchasing Options & Free Delivery:</strong>
          <ul className="list-disc list-inside mt-1 space-y-0.5 text-[#556058]">
            <li><strong>Single Piece:</strong> ₹20 per cup.</li>
            <li><strong>Full Sealed Box (200 Pieces):</strong> ₹4,000 (₹20 / piece) with <strong>FREE Doorstep Delivery</strong> across India.</li>
          </ul>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D5] shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cups, flavours, tea, cold..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DFD1BD] bg-[#FBF9F5] text-xs font-semibold text-[#1B382B] focus:outline-none focus:border-[#1B382B]"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                selectedCategory === cat
                  ? 'bg-[#1B382B] text-[#D4AF37] border border-[#C8A051]/40 shadow-xs'
                  : 'bg-[#F2EDE4] text-[#556058] hover:bg-[#E8E2D5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <span className="text-xs text-[#556058] font-bold uppercase tracking-wider whitespace-nowrap">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto text-xs font-bold bg-[#FBF9F5] border border-[#DFD1BD] rounded-xl px-3 py-2 text-[#1B382B] focus:outline-none"
          >
            <option value="popular">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse h-96"></div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-300 max-w-xl mx-auto">
          <Coffee className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-slate-800">No products matched</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or reset category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-6 py-2.5 bg-[#1B382B] text-[#D4AF37] rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
