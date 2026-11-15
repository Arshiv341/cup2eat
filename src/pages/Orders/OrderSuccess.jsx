import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, MessageCircle, ArrowRight, Package, Truck, Clock } from 'lucide-react';
import api from '../../services/api';
import { BRAND } from '../../theme/brand';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/track/${id}`);
        if (data && data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Failed to load order confirmation details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      const response = await api.get(`/orders/${order?._id || id}/invoice`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Cup2Eat-Invoice-${order?.orderId || id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Invoice download failed:", err);
      alert("Could not generate invoice at this time. Please try again later or check your dashboard.");
    } finally {
      setDownloading(false);
    }
  };

  const getWhatsAppSupportLink = () => {
    const text = encodeURIComponent(
      `Hello Cup2Eat Support! I have placed Order #${order?.orderId || id}. Could you share an update on dispatch?`
    );
    return `https://wa.me/${BRAND.contact.whatsappNumber}?text=${text}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 bg-[#FBF9F5]">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E2D5] shadow-xs text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[#F4F7F5] text-[#2A513A] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C9D7CE]">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <span className="text-xs font-bold text-[#8A6728] uppercase tracking-widest block mb-1">
          Thank you for choosing Cup2Eat!
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1B382B] tracking-tight">
          Your Order is Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-[#556058] mt-2 max-w-md mx-auto">
          We have received your order. A confirmation email with receipt and order tracking has been sent to your email.
        </p>

        {/* Order ID Badge */}
        <div className="my-8 inline-block bg-[#F4F7F5] border border-[#2A4836]/20 px-6 py-3 rounded-2xl">
          <p className="text-[11px] text-[#6C7A70] font-semibold uppercase tracking-wider">Order Reference ID</p>
          <p className="text-xl font-black text-[#1B382B] font-mono tracking-wider mt-0.5">
            #{order?.orderId || id}
          </p>
        </div>

        {/* Order Details Snapshot */}
        {order && (
          <div className="text-left bg-[#FBF9F5] rounded-2xl p-6 border border-[#E8E2D5] mb-8 space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#1B382B] border-b border-[#EDE4D5] pb-2">
              Order Details
            </h3>

            <div className="space-y-2 text-xs">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[#3E4D43]">
                  <span>
                    <strong>{item.productName}</strong> ({item.flavour}, {item.boxSize}) × {item.quantity}
                  </span>
                  <span className="font-black text-[#1B382B]">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EDE4D5] pt-3 flex justify-between text-xs font-bold text-[#1B382B]">
              <span>Total Paid ({order.paymentMethod?.toUpperCase()}):</span>
              <span className="text-base text-[#1B382B] font-black">₹{order.totalAmount}</span>
            </div>

            <div className="border-t border-[#EDE4D5] pt-3 text-xs text-[#556058]">
              <p className="font-bold text-[#1B382B]">Delivering to:</p>
              <p>{order.shippingAddress?.houseNo}, {order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleDownloadInvoice}
            disabled={downloading}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#1B382B] hover:bg-[#142B21] text-[#D4AF37] border border-[#C8A051]/40 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Preparing PDF...' : 'Download Invoice (PDF)'}</span>
          </button>

          <a
            href={getWhatsAppSupportLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#C8A051] hover:bg-[#D4AF37] text-[#142B21] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-[#142B21] text-[#C8A051]" />
            <span>Track on WhatsApp</span>
          </a>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#EDE4D5] hover:bg-[#DFD1BD] text-[#1B382B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            My Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
