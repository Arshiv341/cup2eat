import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, ShoppingBag, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { useAdminTheme } from '../../context/AdminThemeContext';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const { isDark, cardBg, border, textMuted, textMain, tableHeaderBg, tableRowBg, inputBg } = useAdminTheme();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/admin/customers');
        if (data && data.success) {
          setCustomers(data.customers || []);
        }
      } catch (err) {
        console.error("Failed to load customer list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${textMain}`}>Customer Management</h1>
        <p className={`text-xs mt-1 ${textMuted}`}>
          Registered accounts, order placements, and verified customer profiles.
        </p>
      </div>

      <div className={`p-4 rounded-2xl border flex items-center justify-between ${cardBg}`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, phone..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
          />
        </div>
        <span className={`text-xs hidden sm:block ${textMuted}`}>
          Total Customers: <strong className={textMain}>{customers.length}</strong>
        </span>
      </div>

      <div className={`border rounded-2xl overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${tableHeaderBg} text-[11px] font-bold uppercase`}>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Contact Email</th>
                <th className="p-3.5">Phone Number</th>
                <th className="p-3.5">Joined Date</th>
                <th className="p-3.5">Total Orders</th>
                <th className="p-3.5">Total Spent</th>
                <th className="p-3.5">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#282828]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    Loading customer records...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c._id} className={`${tableRowBg} transition-colors`}>
                    <td className="p-3.5 font-bold">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#C8A051]/15 text-[#C8A051] font-bold flex items-center justify-center text-xs">
                          {c.name?.charAt(0) || 'U'}
                        </div>
                        <span className={textMain}>{c.name}</span>
                      </div>
                    </td>
                    <td className={`p-3.5 ${textMuted}`}>{c.email}</td>
                    <td className={`p-3.5 ${textMain}`}>{c.phone || 'N/A'}</td>
                    <td className={`p-3.5 ${textMuted}`}>
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                        <span className={textMain}>{c.orderCount || 0}</span>
                      </span>
                    </td>
                    <td className={`p-3.5 font-bold ${textMain}`}>
                      ₹{(c.totalSpent || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={`p-8 text-center text-xs ${textMuted}`}>
                    No matching customer accounts found.
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

export default AdminCustomers;
