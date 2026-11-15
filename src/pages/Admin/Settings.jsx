import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, ShieldAlert, Sun, Moon } from 'lucide-react';
import api from '../../services/api';
import { useAdminTheme } from '../../context/AdminThemeContext';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    businessEmail: 'support@cup2eat.com',
    contactNumber: '+91 98181 92575',
    whatsappNumber: '919818192575',
    businessAddress: 'Registered Facility & Kitchen Labs, Bengaluru, Karnataka, India',
    deliveryCharge: 50,
    freeShippingThreshold: 499,
    lowStockThreshold: 15,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const { isDark, toggleTheme, cardBg, border, textMuted, textMain, inputBg } = useAdminTheme();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/admin/settings');
        if (data && data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: ['deliveryCharge', 'freeShippingThreshold', 'lowStockThreshold'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.put('/admin/settings', settings);
      if (data && data.success) {
        setMsg('Store settings updated successfully.');
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${textMain}`}>Store Settings</h1>
        <p className={`text-xs mt-1 ${textMuted}`}>
          Configure store logistics, delivery policies, and admin interface preferences.
        </p>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Admin Theme Preference Box */}
      <div className={`border rounded-2xl p-6 ${cardBg}`}>
        <h2 className="text-xs font-bold text-[#C8A051] uppercase tracking-wider mb-2">
          Dashboard Appearance
        </h2>
        <p className={`text-xs mb-4 ${textMuted}`}>
          Select between clean Light mode (white/grey) and Dark mode (charcoal/dark grey).
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              !isDark
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Theme {!isDark ? '(Active)' : ''}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              isDark
                ? 'bg-[#2A2A2A] text-white border-[#383838] shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Dark Theme {isDark ? '(Active)' : ''}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className={`border rounded-2xl p-6 sm:p-8 space-y-6 ${cardBg}`}>
        {/* Business Communication */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-[#C8A051] uppercase tracking-wider border-b border-slate-100 dark:border-[#2C2C2C] pb-2">
            1. Business Information & WhatsApp Support
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${textMain}`}>
                Official Support Email
              </label>
              <input
                type="email"
                name="businessEmail"
                value={settings.businessEmail}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
                required
              />
            </div>

            <div>
              <label className={`text-xs font-semibold block mb-1 ${textMain}`}>
                Display Phone Number
              </label>
              <input
                type="text"
                name="contactNumber"
                value={settings.contactNumber}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`text-xs font-semibold block mb-1 ${textMain}`}>
                WhatsApp Business Number (with country code, e.g. 919818192575)
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={settings.whatsappNumber}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`text-xs font-semibold block mb-1 ${textMain}`}>
                Official Facility Address
              </label>
              <textarea
                name="businessAddress"
                rows={2}
                value={settings.businessAddress}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
              />
            </div>
          </div>
        </div>

        {/* Shipping & Inventory Thresholds */}
        <div className="space-y-4 border-t border-slate-100 dark:border-[#2C2C2C] pt-6">
          <h2 className="text-xs font-bold text-[#C8A051] uppercase tracking-wider border-b border-slate-100 dark:border-[#2C2C2C] pb-2">
            2. Shipping Rates & Delivery Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${textMain}`}>
                Standard Delivery Charge (₹)
              </label>
              <input
                type="number"
                name="deliveryCharge"
                value={settings.deliveryCharge}
                onChange={handleChange}
                min={0}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
                required
              />
              <span className={`text-[10px] ${textMuted}`}>Applies on orders ≤ ₹499</span>
            </div>

            <div>
              <label className={`text-xs font-semibold block mb-1 ${textMain}`}>
                Free Delivery Qualifying Threshold (₹)
              </label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                min={0}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
                required
              />
              <span className={`text-[10px] ${textMuted}`}>Orders &gt; ₹499 get FREE delivery</span>
            </div>

            <div>
              <label className={`text-xs font-semibold block mb-1 ${textMain}`}>
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={settings.lowStockThreshold}
                onChange={handleChange}
                min={1}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
                required
              />
              <span className={`text-[10px] ${textMuted}`}>Alert trigger for variant stock</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8A051] hover:bg-[#B38D40] text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
