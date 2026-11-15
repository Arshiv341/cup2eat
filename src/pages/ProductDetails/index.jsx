import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Clock, 
  Leaf, 
  MessageCircle, 
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  Truck,
  Info
} from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { BRAND } from '../../theme/brand';
import { isSinglePieceVariant } from '../../utils/deliveryCalculator';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        if (data && data.success) {
          setProduct(data.product);
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 bg-[#FBF9F5]">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded-xl w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded-xl w-1/2"></div>
            <div className="h-24 bg-slate-200 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center bg-[#FBF9F5]">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The requested edible cup could not be located.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#1B382B] text-[#D4AF37] font-bold rounded-xl text-xs uppercase"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : [
        {
          flavour: 'Chocolate',
          boxSize: '10 Cups Pack',
          price: 249,
          stock: 50,
          sku: 'C2E-100-CHOC-10',
        },
      ];

  const selectedVariant = variants[selectedVariantIndex] || variants[0];
  const isOutOfStock = selectedVariant.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const getDisplayImage = () => {
    if (selectedVariant.flavour?.toLowerCase().includes('vanilla') && product.images?.[1]) {
      return product.images[1];
    }
    if (selectedVariant.flavour?.toLowerCase().includes('elaichi') && product.images?.[2]) {
      return product.images[2];
    }
    return product.images?.[0] || '/assets/products/chocolate-cup.svg';
  };

  const getWhatsAppProductInquiry = () => {
    const text = encodeURIComponent(
      `Hello Cup2Eat! I am looking at "${product.name}" (${selectedVariant.flavour}, ${selectedVariant.boxSize}). Could you confirm volume pricing and delivery time?`
    );
    return `https://wa.me/${BRAND.contact.whatsappNumber}?text=${text}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 bg-[#FBF9F5]">
      {/* Back link */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#556058] hover:text-[#1B382B] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Cups
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#F6F3ED] border border-[#E8E2D5] p-8 flex items-center justify-center">
            <img
              src={getDisplayImage()}
              alt={product.name}
              className="w-full h-full object-contain max-h-[420px]"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-red-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-full tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Details & Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#1B382B] text-[#D4AF37] inline-block mb-2">
              {product.category || '100 ML | HOT'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1B382B] tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#556058] mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & SKU */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] flex items-baseline justify-between shadow-xs">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#1B382B]">
                ₹{selectedVariant.price?.toLocaleString('en-IN')}
              </span>
              {selectedVariant.boxSize?.includes('200') && (
                <span className="text-xs font-bold text-[#C8A051]">
                  (₹20 per piece)
                </span>
              )}
              {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                <span className="text-sm text-[#9CA7A0] line-through">
                  ₹{selectedVariant.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#6C7A70] block font-mono">
                SKU: {selectedVariant.sku || 'N/A'}
              </span>
              <span className="text-[11px] font-bold text-[#2A513A]">
                {selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock} units)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Reference Specification Note if bulk */}
          {selectedVariant.boxSize?.includes('Pending') && (
            <div className="p-3.5 rounded-xl bg-[#EDE4D5]/70 border border-[#DFD1BD] text-xs text-[#4A3B2A] flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-[#8A6728] shrink-0 mt-0.5" />
              <span>
                <strong>Reference Bulk Specification:</strong> This carton quantity reflects promotional reference information. Actual unit counts and bulk discounts can be confirmed via WhatsApp.
              </span>
            </div>
          )}

          {/* Variant Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#1B382B] uppercase tracking-wider block mb-2">
                Choose Flavour & Pack Size:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {variants.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedVariantIndex === idx
                        ? 'border-[#1B382B] bg-[#F4F7F5] ring-2 ring-[#1B382B]/30'
                        : 'border-[#DFD1BD] bg-white hover:border-[#1B382B]'
                    }`}
                  >
                    <p className="font-extrabold text-xs text-[#1B382B]">{v.flavour}</p>
                    <p className="text-[11px] text-[#6C7A70] mt-0.5">{v.boxSize} • ₹{v.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-[#1B382B] uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-[#DFD1BD] rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={isOutOfStock}
                  className="w-8 h-8 flex items-center justify-center text-[#1B382B] font-bold disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-black text-[#1B382B]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                  disabled={isOutOfStock}
                  className="w-8 h-8 flex items-center justify-center text-[#1B382B] font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-[#2A513A] text-white'
                    : 'bg-[#EDE4D5] hover:bg-[#DFD1BD] text-[#1B382B] disabled:opacity-50'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#1B382B] hover:bg-[#142B21] text-[#D4AF37] border border-[#C8A051]/40 flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <span>Buy Now Instantly</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Direct WhatsApp Product Inquiry */}
            <a
              href={getWhatsAppProductInquiry()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl border border-[#C8A051]/50 text-[#1B382B] bg-[#FBF9F5] hover:bg-[#F2EDE4] text-xs font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4 text-[#C8A051]" />
              Enquire About This Cup On WhatsApp
            </a>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E8E2D5] text-center">
            <div className="p-3 rounded-xl bg-white border border-[#E8E2D5]">
              <Clock className="w-4 h-4 text-[#C8A051] mx-auto mb-1" />
              <p className="text-[10px] font-bold uppercase text-[#1B382B]">40+ Mins Hold</p>
              <p className="text-[9px] text-[#6C7A70]">Hot liquids leak-proof</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E8E2D5]">
              <Leaf className="w-4 h-4 text-[#2A513A] mx-auto mb-1" />
              <p className="text-[10px] font-bold uppercase text-[#1B382B]">100% Edible</p>
              <p className="text-[9px] text-[#6C7A70]">Zero plastic waste</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E8E2D5]">
              <ShieldCheck className="w-4 h-4 text-[#1B382B] mx-auto mb-1" />
              <p className="text-[10px] font-bold uppercase text-[#1B382B]">Pure Veg</p>
              <p className="text-[9px] text-[#6C7A70]">Natural grain flours</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
