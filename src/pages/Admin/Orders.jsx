import React, { useState, useEffect } from 'react';
import { Search, Download, RefreshCw, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useAdminTheme } from '../../context/AdminThemeContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [msg, setMsg] = useState('');

  const { isDark, cardBg, border, textMuted, textMain, tableHeaderBg, tableRowBg, inputBg } = useAdminTheme();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/orders');
      if (data && data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const { data } = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (data && data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord))
        );
        setMsg(`Order status updated to "${newStatus}".`);
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadInvoice = async (orderId, formattedId) => {
    try {
      setDownloadingId(orderId);
      const res = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Cup2Eat-Invoice-${formattedId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download invoice.");
    } finally {
      setDownloadingId(null);
    }
  };

  const statuses = ['All', 'Placed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'All' || ord.orderStatus === statusFilter;
    const matchesSearch =
      ord.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer?.email?.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer?.phone?.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${textMain}`}>Order Management</h1>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Track and update fulfillment stages for all customer purchases.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
            isDark
              ? 'bg-[#242424] border-[#333333] text-slate-200 hover:bg-[#2C2C2C]'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center justify-between ${cardBg}`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, Name, Phone..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-[#C8A051] dark:text-slate-950 font-bold shadow-sm'
                  : isDark
                  ? 'bg-[#252525] text-slate-400 hover:bg-[#2C2C2C]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className={`border rounded-2xl overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${tableHeaderBg} text-[11px] font-bold uppercase`}>
                <th className="p-3.5">Order ID & Date</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Items Summary</th>
                <th className="p-3.5">Total & Method</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Fulfillment</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#282828]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => (
                  <tr key={ord._id} className={`${tableRowBg} transition-colors`}>
                    <td className="p-3.5">
                      <p className={`font-bold ${textMain}`}>{ord.orderId}</p>
                      <p className={`text-[10px] ${textMuted}`}>
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>

                    <td className="p-3.5">
                      <p className={`font-semibold ${textMain}`}>{ord.customer?.name}</p>
                      <p className={`text-[10px] ${textMuted}`}>{ord.customer?.phone}</p>
                    </td>

                    <td className="p-3.5">
                      <p className={`font-medium line-clamp-1 ${textMain}`}>
                        {ord.items?.map((it) => `${it.productName} (${it.boxSize}) x${it.quantity}`).join(', ')}
                      </p>
                      <span className={`text-[10px] ${textMuted}`}>
                        {ord.items?.reduce((sum, it) => sum + it.quantity, 0)} units total
                      </span>
                    </td>

                    <td className="p-3.5">
                      <p className={`font-bold ${textMain}`}>
                        ₹{ord.totalAmount?.toLocaleString('en-IN')}
                      </p>
                      <p className={`text-[10px] uppercase font-semibold ${textMuted}`}>
                        {ord.paymentMethod}
                      </p>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={ord.orderStatus}
                        disabled={updatingId === ord._id}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded-lg border focus:outline-none ${
                          isDark
                            ? 'bg-[#252525] border-[#383838] text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {statuses.filter((s) => s !== 'All').map((s) => (
                          <option key={s} value={s} className={isDark ? 'bg-[#222] text-white' : 'bg-white text-slate-900'}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(ord._id, ord.orderId)}
                        disabled={downloadingId === ord._id}
                        className={`p-1.5 rounded-lg border transition-colors inline-flex items-center gap-1 text-[11px] font-medium ${
                          isDark
                            ? 'border-[#333] hover:bg-[#282828] text-slate-300'
                            : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                        title="Download Invoiced PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C8A051]" />
                        <span className="hidden sm:inline">PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={`p-8 text-center text-xs ${textMuted}`}>
                    No matching orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
