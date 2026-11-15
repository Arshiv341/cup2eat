import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Check, AlertCircle, Truck, Info, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { isSinglePieceVariant } from '../utils/deliveryCalculator';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : [
        {
          flavour: 'Chocolate',
          boxSize: 'Full Sealed Box (200 Pieces)',
          price: 4000,
          originalPrice: 4800,
          stock: 40,
          sku: 'C2E-100-CHOC-200',
          isDeliveryEligible: true,
        },
        {
          flavour: 'Chocolate',
          boxSize: 'Single Piece (1 Pc)',
          price: 20,
          originalPrice: 25,
          stock: 500,
          sku: 'C2E-100-CHOC-1',
          isDeliveryEligible: false,
        },
      ];

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = variants[selectedVariantIndex] || variants[0];
  const [quantity, setQuantity] = useState(1);

  const isSinglePiece = isSinglePieceVariant(selectedVariant);
  const isOutOfStock = selectedVariant.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (selectedVariant.stock <= 0) return;
    addToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (selectedVariant.stock <= 0) return;
    addToCart(product, selectedVariant, quantity);
    navigate('/cart');
  };

  // Image fallback based on variant flavour if image is generic
  const getDisplayImage = () => {
    if (selectedVariant.flavour?.toLowerCase().includes('vanilla') && product.images?.[1]) {
      return product.images[1];
    }
    if (selectedVariant.flavour?.toLowerCase().includes('elaichi') && product.images?.[2]) {
      return product.images[2];
    }
    return product.images?.[0] || '/assets/products/chocolate-cup.svg';
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E2D5] hover:border-[#C8A051] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Product Image Box */}
        <div className="relative aspect-square w-full rounded-xl bg-[#F6F3ED] overflow-hidden mb-4 border border-[#EDE7DC]">
          <img
            src={getDisplayImage()}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#1B382B] text-[#D4AF37] uppercase tracking-wider shadow-sm">
              {product.category || '100 ML | HOT'}
            </span>
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-20">
              <span className="bg-rose-700 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Title & Description */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-extrabold text-base text-[#1B382B] hover:text-[#C8A051] transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-[#556058] line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Variant Selectors */}
        <div className="space-y-2.5 pt-2 border-t border-[#F2EDE4] mb-4">
          <div>
            <label className="text-[10px] font-bold text-[#8A6728] uppercase tracking-wider block mb-1">
              Flavour & Packaging Selection:
            </label>
            <select
              value={selectedVariantIndex}
              onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
              className="w-full text-xs font-semibold bg-[#FBF9F5] border border-[#DFD1BD] rounded-xl px-3 py-2 text-[#1B382B] focus:outline-none focus:border-[#C8A051]"
            >
              {variants.map((v, idx) => (
                <option key={idx} value={idx}>
                  {v.flavour} — {v.boxSize} (₹{v.price?.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Stock Availability */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[#6C7A70] font-medium text-[11px]">Availability:</span>
            {isOutOfStock ? (
              <span className="text-rose-600 font-bold text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
              </span>
            ) : (
              <span className="text-[#2A513A] font-bold text-[11px] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({selectedVariant.stock} units)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="pt-2">
        <div className="flex items-baseline gap-2 mb-3">
          <div>
            <span className="text-2xl font-black text-[#1B382B]">
              ₹{selectedVariant.price?.toLocaleString('en-IN')}
            </span>
            {selectedVariant.boxSize?.includes('200') && (
              <span className="text-[11px] font-bold text-[#C8A051] ml-2">
                (₹20 / piece)
              </span>
            )}
          </div>
          {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
            <span className="text-xs text-[#9CA7A0] line-through ml-auto">
              ₹{selectedVariant.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quantity selector */}
          <div className="flex items-center border border-[#DFD1BD] rounded-xl bg-[#FBF9F5] p-0.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={isOutOfStock}
              className="w-7 h-7 flex items-center justify-center text-[#1B382B] font-bold disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-extrabold text-[#1B382B]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
              disabled={isOutOfStock}
              className="w-7 h-7 flex items-center justify-center text-[#1B382B] font-bold disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              addedAnimation
                ? 'bg-[#2A513A] text-white'
                : 'bg-[#EDE4D5] hover:bg-[#DFD1BD] text-[#1B382B] disabled:opacity-50'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" /> Added!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add
              </>
            )}
          </button>

          {/* Buy Now / Explore */}
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#1B382B] hover:bg-[#142B21] text-[#D4AF37] border border-[#C8A051]/40 transition-all shadow-xs disabled:opacity-50"
          >
            <span>Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
