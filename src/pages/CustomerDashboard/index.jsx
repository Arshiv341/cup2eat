import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  User, 
  MapPin, 
  Download, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MessageCircle, 
  LogOut,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { BRAND } from '../../theme/brand';

const CustomerDashboardPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        if (data && data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to load user orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  const handleInvoiceDownload = async (orderId, internalId) => {
    try {
      setDownloadingId(orderId);
      const res = await api.get(`/orders/${internalId}/invoice`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Cup2Eat-Invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Invoice download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/profile', profileForm);
      if (data && data.success) {
        updateProfile(data.user);
        setProfileMsg('Profile updated successfully!');
        setTimeout(() => setProfileMsg(''), 3000);
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update profile.');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'Placed': 'bg-blue-100 text-blue-800',
      'Confirmed': 'bg-[#F4F7F5] text-[#2A513A] border border-[#2A513A]/30',
      'Processing': 'bg-indigo-100 text-indigo-800',
      'Packed': 'bg-purple-100 text-purple-800',
      'Shipped': 'bg-cyan-100 text-cyan-800',
      'Out for Delivery': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-emerald-100 text-emerald-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 bg-[#FBF9F5]">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1B382B] text-[#D4AF37] font-black text-xl flex items-center justify-center border border-[#C8A051]/40">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1B382B]">
              Welcome, {user?.name}!
            </h1>
            <p className="text-xs text-[#556058]">{user?.email} • {user?.phone || 'No phone set'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E8E2D5] mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-[#1B382B] text-[#1B382B]'
              : 'border-transparent text-[#7A857E] hover:text-[#1B382B]'
          }`}
        >
          <Package className="w-4 h-4" />
          My Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-[#1B382B] text-[#1B382B]'
              : 'border-transparent text-[#7A857E] hover:text-[#1B382B]'
          }`}
        >
          <User className="w-4 h-4" />
          Profile Settings
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-slate-200"></div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            orders.map((ord) => (
              <div
                key={ord._id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs space-y-5"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2EDE4] pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#8A6728] uppercase tracking-wider block">
                      Order Reference
                    </span>
                    <span className="font-mono font-black text-[#1B382B] text-base">
                      #{ord.orderId}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-[#556058]">
                      Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getStatusBadge(ord.orderStatus)}`}>
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-[#1B382B]">{item.productName}</p>
                        <p className="text-[#6C7A70]">{item.flavour} • {item.boxSize} (×{item.quantity})</p>
                      </div>
                      <span className="font-black text-[#1B382B]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Details & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#F2EDE4] pt-4">
                  <div className="text-xs text-[#556058]">
                    <span className="font-bold text-[#1B382B]">
                      Total: ₹{ord.totalAmount}
                    </span>{' '}
                    ({ord.paymentMethod?.toUpperCase()} • {ord.paymentStatus})
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleInvoiceDownload(ord.orderId, ord._id)}
                      disabled={downloadingId === ord.orderId}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#EDE4D5] hover:bg-[#DFD1BD] text-[#1B382B] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadingId === ord.orderId ? 'Downloading...' : 'PDF Invoice'}</span>
                    </button>

                    <a
                      href={`https://wa.me/${BRAND.contact.whatsappNumber}?text=${encodeURIComponent(`Hello Cup2Eat! I want to check tracking for Order #${ord.orderId}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#C8A051] hover:bg-[#D4AF37] text-[#142B21] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-[#142B21] text-[#C8A051]" />
                      <span>Track via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-slate-300">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-[#1B382B]">No Orders Yet</h3>
              <p className="text-xs text-[#556058] mt-1 mb-6">
                You haven't placed any orders with Cup2Eat yet.
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-[#1B382B] text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-xl"
              >
                Explore Cups & Flavours
              </button>
            </div>
          )}
        </div>
      )}

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs max-w-xl">
          <h2 className="text-lg font-black text-[#1B382B] mb-4 uppercase tracking-wider">Edit Profile</h2>

          {profileMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#F4F7F5] border border-[#2A513A]/30 text-[#1B382B] text-xs font-bold">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#DFD1BD] bg-[#FBF9F5] text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                Email (Cannot be changed)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 rounded-xl border border-[#DFD1BD] bg-[#EDE4D5]/30 text-xs font-medium text-[#7A857E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#DFD1BD] bg-[#FBF9F5] text-xs font-medium"
                placeholder="9876543210"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#1B382B] hover:bg-[#142B21] text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all border border-[#C8A051]/40"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboardPage;
