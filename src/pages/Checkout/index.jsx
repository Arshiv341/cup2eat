import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Banknote, ArrowRight, AlertCircle, Truck, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import confetti from 'canvas-confetti';
import { checkDeliveryEligibility, isSinglePieceVariant } from '../../utils/deliveryCalculator';

const CheckoutPage = () => {
  const { cartItems, subtotal, shippingFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    houseNo: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'online', // 'online' (Razorpay) or 'cod'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Enter a valid 10-digit Indian phone number';
    }

    if (!formData.houseNo.trim()) errs.houseNo = 'House / Flat number is required';
    if (!formData.street.trim()) errs.street = 'Street or locality is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Enter a valid 6-digit PIN code';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Delivery eligibility check: Single Piece is strictly ineligible for delivery
    const deliveryCheck = checkDeliveryEligibility(cartItems);
    if (!deliveryCheck.eligible) {
      setServerError(deliveryCheck.message);
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      const orderPayload = {
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          houseNo: formData.houseNo,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India',
        },
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          flavour: item.flavour,
          boxSize: item.boxSize,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentMethod: formData.paymentMethod,
      };

      // 1. If Cash on Delivery
      if (formData.paymentMethod === 'cod') {
        const { data } = await api.post('/orders', orderPayload);
        if (data && data.success) {
          clearCart();
          triggerConfetti();
          navigate(`/order-success/${data.order.orderId || data.order._id}`);
          return;
        } else {
          setServerError(data.message || 'Failed to place COD order.');
        }
      }

      // 2. Online Payment via Razorpay
      const { data: orderData } = await api.post('/orders', orderPayload);
      if (!orderData.success) {
        setServerError(orderData.message || 'Could not initiate order.');
        setSubmitting(false);
        return;
      }

      const internalOrder = orderData.order;

      // Initiate Razorpay order from backend
      const { data: rzpData } = await api.post('/payments/create-order', {
        orderId: internalOrder._id,
      });

      if (!rzpData.success) {
        setServerError(rzpData.message || 'Failed to initialize payment gateway.');
        setSubmitting(false);
        return;
      }

      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency || 'INR',
        name: 'Cup2Eat',
        description: `Order #${internalOrder.orderId}`,
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#1B382B',
        },
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              internalOrderId: internalOrder._id,
            });

            if (verifyRes.data && verifyRes.data.success) {
              clearCart();
              triggerConfetti();
              navigate(`/order-success/${internalOrder.orderId || internalOrder._id}`);
            } else {
              setServerError('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error("Verification error:", err);
            setServerError(err.response?.data?.message || 'Payment verification encountered an issue.');
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setServerError(`Payment Failed: ${resp.error.description}`);
          setSubmitting(false);
        });
        rzp.open();
      } else {
        setServerError('Razorpay SDK is not loaded. Please disable ad blockers and refresh.');
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Order placement error:", err);
      setServerError(err.response?.data?.message || 'An error occurred during checkout.');
      setSubmitting(false);
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 bg-[#FBF9F5]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1B382B] tracking-tight">Checkout</h1>
        <p className="text-xs text-[#556058] mt-1">
          Complete your delivery details to confirm your Cup2Eat order.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Contact */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs space-y-4">
            <h2 className="text-base font-black text-[#1B382B] border-b border-[#F2EDE4] pb-3 uppercase tracking-wider">
              1. Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none ${
                    errors.fullName ? 'border-red-500' : 'border-[#DFD1BD] focus:border-[#1B382B]'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="priya@gmail.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none ${
                    errors.email ? 'border-red-500' : 'border-[#DFD1BD] focus:border-[#1B382B]'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none ${
                    errors.phone ? 'border-red-500' : 'border-[#DFD1BD] focus:border-[#1B382B]'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs space-y-4">
            <h2 className="text-base font-black text-[#1B382B] border-b border-[#F2EDE4] pb-3 uppercase tracking-wider">
              2. Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                  House / Flat / Building No. *
                </label>
                <input
                  type="text"
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={handleChange}
                  placeholder="e.g. Flat 302, Green Meadows"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none ${
                    errors.houseNo ? 'border-red-500' : 'border-[#DFD1BD] focus:border-[#1B382B]'
                  }`}
                />
                {errors.houseNo && <p className="text-[11px] text-red-500 mt-1">{errors.houseNo}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                  Street / Area / Locality *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="100 Feet Road, Indiranagar"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none ${
                    errors.street ? 'border-red-500' : 'border-[#DFD1BD] focus:border-[#1B382B]'
                  }`}
                />
                {errors.street && <p className="text-[11px] text-red-500 mt-1">{errors.street}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none ${
                    errors.city ? 'border-red-500' : 'border-[#DFD1BD] focus:border-[#1B382B]'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none ${
                    errors.state ? 'border-red-500' : 'border-[#DFD1BD] focus:border-[#1B382B]'
                  }`}
                />
                {errors.state && <p className="text-[11px] text-red-500 mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                  PIN Code (6 digits) *
                </label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="560038"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none ${
                    errors.pincode ? 'border-red-500' : 'border-[#DFD1BD] focus:border-[#1B382B]'
                  }`}
                />
                {errors.pincode && <p className="text-[11px] text-red-500 mt-1">{errors.pincode}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full px-4 py-3 rounded-xl border border-[#DFD1BD] bg-[#EDE4D5]/40 text-xs font-bold text-[#1B382B]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs space-y-4">
            <h2 className="text-base font-black text-[#1B382B] border-b border-[#F2EDE4] pb-3 uppercase tracking-wider">
              3. Payment Option
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'online'
                    ? 'border-[#1B382B] bg-[#F4F7F5] ring-2 ring-[#1B382B]/20'
                    : 'border-[#DFD1BD] hover:border-[#1B382B]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === 'online'}
                  onChange={handleChange}
                  className="mt-1 text-[#1B382B] focus:ring-[#1B382B]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#1B382B]" />
                    <span className="font-bold text-xs text-[#1B382B]">
                      Razorpay Online Payment (UPI, Cards, NetBanking)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#556058] mt-0.5">
                    Instant secure checkout with Google Pay, PhonePe, Paytm, and all Indian banks.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod'
                    ? 'border-[#1B382B] bg-[#F4F7F5] ring-2 ring-[#1B382B]/20'
                    : 'border-[#DFD1BD] hover:border-[#1B382B]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="mt-1 text-[#1B382B] focus:ring-[#1B382B]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#C8A051]" />
                    <span className="font-bold text-xs text-[#1B382B]">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#556058] mt-0.5">
                    Pay with cash or UPI upon delivery of your box.
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs space-y-6 sticky top-28">
            <h2 className="font-black text-xl text-[#1B382B] tracking-tight">
              Order Review ({cartItems.length} items)
            </h2>

            {/* Item list */}
            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-[#F2EDE4] pr-1">
              {cartItems.map((item) => (
                <div key={item.key} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#1B382B]">{item.productName}</p>
                    <p className="text-[11px] text-[#556058]">
                      {item.flavour} • {item.boxSize} (×{item.quantity})
                    </p>
                  </div>
                  <span className="font-black text-[#1B382B]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 text-xs border-t border-[#F2EDE4] pt-4">
              <div className="flex justify-between text-[#556058]">
                <span>Items Total</span>
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
              <p className="text-[10px] text-[#7A857E] italic">
                {subtotal > 499 ? '✓ Free doorstep delivery qualified (Subtotal > ₹499)' : 'Standard delivery charge applied (Subtotal ≤ ₹499)'}
              </p>
            </div>

            <div className="flex justify-between items-baseline border-t border-[#F2EDE4] pt-4">
              <span className="text-sm font-bold text-[#1B382B]">Total Payable Amount</span>
              <span className="text-2xl font-black text-[#1B382B]">₹{totalAmount?.toLocaleString('en-IN')}</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#1B382B] hover:bg-[#142B21] text-[#D4AF37] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md border border-[#C8A051]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <span>
                    {formData.paymentMethod === 'online' ? 'Pay & Confirm Order' : 'Confirm Cash on Delivery'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-[#6C7A70] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2A513A]" />
              <span>100% Encrypted & Authenticated Transaction</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CheckoutPage;
