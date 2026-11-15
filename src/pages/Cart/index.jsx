import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  Info
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { isSinglePieceVariant, getAmountToFreeDelivery } from '../../utils/deliveryCalculator';

const CartPage = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    shippingFee, 
    totalAmount,
    freeShippingThreshold,
    isDeliveryEligible,
    deliveryIneligibleReason
  } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center bg-[#FBF9F5]">
        <div className="w-20 h-20 bg-[#EDE4D5] text-[#1B382B] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-[#1B382B] tracking-tight">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-[#556058] mt-2 mb-8 max-w-md mx-auto leading-relaxed">
          You haven't selected any Cup2Eat edible wafer cups yet. Explore our crispy flavours and upgrade your coffee & chai ritual!
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#1B382B] hover:bg-[#142B21] text-[#D4AF37] font-bold uppercase tracking-wider rounded-xl shadow-md transition-all text-xs border border-[#C8A051]/40"
        >
          <span>Explore Flavours</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const amountNeededForFreeShipping = getAmountToFreeDelivery(subtotal, freeShippingThreshold);
  const progressPercent = Math.min(100, (subtotal / (freeShippingThreshold + 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 bg-[#FBF9F5]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1B382B] tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-[#556058] mt-1">
            Review your selected edible cups, packaging options, and delivery eligibility.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free delivery progress banner */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="flex items-center gap-1.5 text-[#1B382B]">
                <Truck className="w-4 h-4 text-[#C8A051]" />
                {amountNeededForFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-[#8A6728]">₹{amountNeededForFreeShipping}</strong> more for <strong className="text-[#2A513A]">FREE Delivery!</strong>
                  </span>
                ) : (
                  <span className="text-[#2A513A]">🎉 You have qualified for FREE Doorstep Delivery!</span>
                )}
              </span>
              <span className="text-[11px] text-[#6C7A70] font-normal">
                (Orders &gt; ₹499 qualify)
              </span>
            </div>
            <div className="w-full bg-[#EDE4D5] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#C8A051] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden divide-y divide-[#F2EDE4] shadow-xs">
            {cartItems.map((item) => {
              const isItemSinglePiece = isSinglePieceVariant(item);

              return (
                <div key={item.key} className="p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#F6F3ED] p-2 flex items-center justify-center shrink-0 border border-[#EDE7DC] relative">
                    <img
                      src={item.productImage || '/assets/products/chocolate-cup.svg'}
                      alt={item.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-bold text-base text-[#1B382B] hover:text-[#C8A051] transition-colors"
                      >
                        {item.productName}
                      </Link>
                    </div>

                    <p className="text-xs text-[#556058] mt-1">
                      Flavour: <span className="font-bold text-[#1B382B]">{item.flavour}</span> • Packaging: <span className="font-bold text-[#1B382B]">{item.boxSize}</span>
                    </p>
                    <p className="text-[11px] font-mono text-[#8C9890] mt-0.5">
                      SKU: {item.sku}
                    </p>
                    <p className="text-sm font-black text-[#1B382B] mt-2">
                      ₹{item.price?.toLocaleString('en-IN')} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#DFD1BD] rounded-xl bg-[#FBF9F5] p-1">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#1B382B] font-bold"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#1B382B]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center text-[#1B382B] font-bold disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-base font-black text-[#1B382B] w-20 text-right">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/shop"
            className="inline-block text-xs font-bold text-[#1B382B] hover:text-[#C8A051] pt-2 uppercase tracking-wider"
          >
            ← Add more cups from shop
          </Link>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs space-y-6 sticky top-24">
            <h3 className="font-black text-xl text-[#1B382B] tracking-tight">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs border-b border-[#F2EDE4] pb-5">
              <div className="flex justify-between text-[#556058]">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#1B382B]">₹{subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#556058]">
                <span>Delivery Charges</span>
                {shippingFee === 0 ? (
                  <span className="font-bold text-[#2A513A] bg-emerald-50 px-2 py-0.5 rounded">FREE</span>
                ) : (
                  <span className="font-bold text-[#1B382B]">₹{shippingFee}</span>
                )}
              </div>
              <div className="text-[10px] text-[#7A857E] italic">
                {subtotal > 499 ? '✓ Qualified for free delivery (Subtotal > ₹499)' : 'Standard delivery charge applied (Subtotal ≤ ₹499)'}
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#1B382B]">Grand Total</span>
              <span className="text-2xl font-black text-[#1B382B]">₹{totalAmount?.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#1B382B] hover:bg-[#142B21] text-[#D4AF37] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md border border-[#C8A051]/40 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#2A513A]">
                <ShieldCheck className="w-4 h-4" />
                Guaranteed Safe Razorpay Checkout
              </div>
              <p className="text-[10px] text-[#7A857E]">
                Backend database verification on all rates & stock levels.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
