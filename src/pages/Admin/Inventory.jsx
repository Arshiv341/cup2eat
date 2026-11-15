import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, CheckCircle2, Search, Plus, Minus, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useAdminTheme } from '../../context/AdminThemeContext';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');
  const [adjustingSku, setAdjustingSku] = useState(null);

  const { isDark, cardBg, border, textMuted, textMain, tableHeaderBg, tableRowBg, inputBg } = useAdminTheme();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      if (data && data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockAdjust = async (productId, sku, changeAmount) => {
    try {
      setAdjustingSku(sku);
      const { data } = await api.post('/admin/inventory/adjust', {
        productId,
        sku,
        adjustment: changeAmount,
      });

      if (data && data.success) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p._id === productId) {
              const updatedVariants = p.variants.map((v) => {
                if (v.sku === sku) {
                  return { ...v, stock: Math.max(0, v.stock + changeAmount) };
                }
                return v;
              });
              return { ...p, variants: updatedVariants };
            }
            return p;
          })
        );
        setMsg(`Stock adjusted for SKU ${sku}`);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setAdjustingSku(null);
    }
  };

  // Flatten products into variant rows
  const variantRows = [];
  products.forEach((p) => {
    p.variants?.forEach((v) => {
      variantRows.push({
        productId: p._id,
        productName: p.name,
        category: p.category,
        flavour: v.flavour,
        boxSize: v.boxSize,
        price: v.price,
        sku: v.sku,
        stock: v.stock,
      });
    });
  });

  const filteredRows = variantRows.filter(
    (r) =>
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.flavour.toLowerCase().includes(search.toLowerCase()) ||
      r.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${textMain}`}>Inventory & Stock Control</h1>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Variant-level inventory management and stock level monitoring.
          </p>
        </div>

        <button
          onClick={fetchInventory}
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

      {/* Search Bar */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between ${cardBg}`}>
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by product name, flavour or SKU..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
          />
        </div>
        <div className={`text-xs font-semibold hidden sm:block ${textMuted}`}>
          {filteredRows.length} active variants tracked
        </div>
      </div>

      {/* Inventory Table */}
      <div className={`border rounded-2xl overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${tableHeaderBg} text-[11px] font-bold uppercase`}>
                <th className="p-3.5">Product & Flavour</th>
                <th className="p-3.5">Package Spec</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#282828]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredRows.length > 0 ? (
                filteredRows.map((row) => {
                  const isLow = row.stock <= 15;
                  const isOut = row.stock === 0;

                  return (
                    <tr key={row.sku} className={`${tableRowBg} transition-colors`}>
                      <td className="p-3.5">
                        <p className={`font-bold ${textMain}`}>{row.productName}</p>
                        <p className={`text-[10px] ${textMuted}`}>{row.flavour}</p>
                      </td>
                      <td className={`p-3.5 font-medium ${textMain}`}>
                        {row.boxSize}
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-400">
                        {row.sku}
                      </td>
                      <td className={`p-3.5 font-bold ${textMain}`}>
                        ₹{row.price}
                      </td>
                      <td className="p-3.5">
                        <span className={`font-black text-sm ${isOut ? 'text-rose-500' : isLow ? 'text-amber-500' : textMain}`}>
                          {row.stock}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isOut
                              ? 'bg-rose-500/10 text-rose-500'
                              : isLow
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleStockAdjust(row.productId, row.sku, -5)}
                            disabled={row.stock <= 0 || adjustingSku === row.sku}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isDark
                                ? 'border-[#333] hover:bg-[#282828] text-slate-300'
                                : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                            title="Decrease stock by 5"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStockAdjust(row.productId, row.sku, 10)}
                            disabled={adjustingSku === row.sku}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isDark
                                ? 'border-[#333] hover:bg-[#282828] text-slate-300'
                                : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                            title="Restock +10"
                          >
                            <Plus className="w-3.5 h-3.5 text-emerald-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className={`p-8 text-center text-xs ${textMuted}`}>
                    No matching inventory variants found.
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

export default AdminInventory;
