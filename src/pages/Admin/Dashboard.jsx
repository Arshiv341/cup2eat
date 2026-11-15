import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Eye,
  Boxes
} from 'lucide-react';
import api from '../../services/api';
import { useAdminTheme } from '../../context/AdminThemeContext';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark, cardBg, border, textMuted, textMain, tableHeaderBg, tableRowBg } = useAdminTheme();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get('/admin/metrics');
        if (data && data.success) {
          setMetrics(data.metrics);
        }
      } catch (err) {
        console.error("Failed to load admin metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className={`h-28 rounded-2xl border ${isDark ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-slate-200'}`} />
          ))}
        </div>
      </div>
    );
  }

  // Pure numerical summary cards as explicitly requested (No graphs or charts)
  const summaryCards = [
    {
      title: 'Total Revenue',
      value: `₹${(metrics?.totalRevenue || 0).toLocaleString('en-IN')}`,
      subtitle: 'From settled & delivered orders',
      icon: IndianRupee,
      iconColor: 'text-emerald-500',
      iconBg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
    },
    {
      title: 'Total Orders',
      value: metrics?.totalOrders || 0,
      subtitle: 'All customer placements',
      icon: ShoppingBag,
      iconColor: 'text-indigo-500',
      iconBg: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
    },
    {
      title: 'Paid Orders',
      value: metrics?.paidOrdersCount ?? 0,
      subtitle: 'Payment verified',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      iconBg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
    },
    {
      title: 'Pending Orders',
      value: metrics?.pendingOrdersCount ?? (metrics?.ordersByStatus?.Placed || 0),
      subtitle: 'Awaiting fulfillment',
      icon: Clock,
      iconColor: 'text-amber-500',
      iconBg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
    },
    {
      title: 'Total Customers',
      value: metrics?.totalCustomers || 0,
      subtitle: 'Registered accounts',
      icon: Users,
      iconColor: 'text-blue-500',
      iconBg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
    },
    {
      title: 'Total Products',
      value: metrics?.totalProducts || 0,
      subtitle: 'Active edible cup lines',
      icon: Package,
      iconColor: 'text-purple-500',
      iconBg: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
    },
    {
      title: 'Low Stock Items',
      value: metrics?.lowStockCount ?? (metrics?.lowStockItems?.length || 0),
      subtitle: 'Below reorder threshold',
      icon: Boxes,
      iconColor: 'text-rose-500',
      iconBg: isDark ? 'bg-rose-500/10' : 'bg-rose-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${textMain}`}>
            Dashboard Overview
          </h1>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Live store metrics and real-time operational status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#C8A051] hover:bg-[#B38D40] text-slate-950 transition-colors shadow-sm"
          >
            <span>Manage Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 1. Numerical Metric Cards Grid (No Charts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`p-5 rounded-2xl border transition-all ${cardBg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold ${textMuted}`}>
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className={`text-2xl font-black tracking-tight ${textMain}`}>
                {card.value}
              </div>

              <p className={`text-[11px] mt-1.5 font-medium ${textMuted}`}>
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* 2. Operational Tables: Recent Orders & Inventory Status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders Table (Takes 2 cols) */}
        <div className={`xl:col-span-2 rounded-2xl border p-5 ${cardBg}`}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-[#2C2C2C]">
            <div>
              <h2 className={`font-bold text-sm ${textMain}`}>Recent Customer Orders</h2>
              <p className={`text-[11px] ${textMuted}`}>Latest real placements from database</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-[#C8A051] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${tableHeaderBg} text-[11px] uppercase font-bold`}>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#282828]">
                {metrics?.recentOrders && metrics.recentOrders.length > 0 ? (
                  metrics.recentOrders.map((ord) => (
                    <tr key={ord._id} className={`${tableRowBg} transition-colors`}>
                      <td className={`py-3 px-3 font-semibold ${textMain}`}>
                        {ord.orderId}
                      </td>
                      <td className="py-3 px-3">
                        <p className={`font-medium ${textMain}`}>{ord.customer?.name}</p>
                        <p className={`text-[10px] ${textMuted}`}>{ord.customer?.email}</p>
                      </td>
                      <td className={`py-3 px-3 font-bold ${textMain}`}>
                        ₹{ord.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
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
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to="/admin/orders"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white inline-block"
                          title="Inspect Order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={`py-8 text-center text-xs ${textMuted}`}>
                      No orders placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist (Takes 1 col) */}
        <div className={`rounded-2xl border p-5 ${cardBg}`}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-[#2C2C2C]">
            <div>
              <h2 className={`font-bold text-sm ${textMain}`}>Inventory Alerts</h2>
              <p className={`text-[11px] ${textMuted}`}>Low stock indicators</p>
            </div>
            <Link
              to="/admin/inventory"
              className="text-xs font-semibold text-[#C8A051] hover:underline"
            >
              Inventory
            </Link>
          </div>

          <div className="space-y-3">
            {metrics?.lowStockItems && metrics.lowStockItems.length > 0 ? (
              metrics.lowStockItems.slice(0, 6).map((item, idx) => (
                <div
                  key={`${item.productId}-${idx}`}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-[#242424] border-[#303030]' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className={`text-xs font-bold truncate ${textMain}`}>
                      {item.productName}
                    </p>
                    <p className={`text-[10px] ${textMuted}`}>
                      {item.flavour} • {item.boxSize}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 bg-rose-500/10 text-rose-500 font-bold text-xs rounded-lg">
                      {item.stock} left
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={`py-10 text-center text-xs ${textMuted}`}>
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">All Stock Levels Healthy</p>
                <p className="text-[11px] mt-0.5">No products currently below low stock threshold.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
