import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, X, AlertCircle, Package } from 'lucide-react';
import api from '../../services/api';
import { useAdminTheme } from '../../context/AdminThemeContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { isDark, cardBg, border, textMuted, textMain, inputBg } = useAdminTheme();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '100 ML | HOT',
    images: ['/assets/products/chocolate-cup.svg'],
    variants: [
      { flavour: 'Chocolate', boxSize: 'Single Piece (1 Pc)', price: 20, stock: 500, sku: 'C2E-100-CHOC-1', isDeliveryEligible: false },
      { flavour: 'Chocolate', boxSize: 'Full Sealed Box (200 Pieces)', price: 4000, stock: 50, sku: 'C2E-100-CHOC-200', isDeliveryEligible: true },
    ]
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      if (data && data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      description: '',
      category: '100 ML | HOT',
      images: ['/assets/products/chocolate-cup.svg'],
      variants: [
        { flavour: 'Chocolate', boxSize: 'Single Piece (1 Pc)', price: 20, stock: 500, sku: 'C2E-100-CHOC-1', isDeliveryEligible: false },
        { flavour: 'Chocolate', boxSize: 'Full Sealed Box (200 Pieces)', price: 4000, stock: 50, sku: 'C2E-100-CHOC-200', isDeliveryEligible: true },
      ]
    });
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      description: prod.description || '',
      category: prod.category || '100 ML | HOT',
      images: prod.images || [],
      variants: prod.variants || []
    });
    setModalOpen(true);
  };

  const handleAddVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          flavour: 'Vanilla',
          boxSize: 'Full Sealed Box (200 Pieces)',
          price: 4000,
          stock: 25,
          sku: `C2E-VAR-${Date.now().toString().slice(-4)}`,
          isDeliveryEligible: true,
        }
      ]
    }));
  };

  const handleRemoveVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'boxSize') {
        const lower = value.toLowerCase();
        if (lower.includes('single')) {
          updated[index].isDeliveryEligible = false;
        } else {
          updated[index].isDeliveryEligible = true;
        }
      }
      return { ...prev, variants: updated };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, form);
      } else {
        await api.post('/admin/products', form);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${textMain}`}>Product Catalogue</h1>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Configure edible cup lines, flavours, pricing tiers, and delivery permissions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C8A051] hover:bg-[#B38D40] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Product List Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-xs text-slate-400">Loading products...</p>
        ) : products.length > 0 ? (
          products.map((prod) => (
            <div key={prod._id} className={`border rounded-2xl p-5 space-y-4 ${cardBg}`}>
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#252525] border border-slate-200 dark:border-[#333] shrink-0 p-2 flex items-center justify-center">
                  <img
                    src={prod.images?.[0] || '/assets/cup2eat-logo.jpg'}
                    alt={prod.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A051]">
                        {prod.category}
                      </span>
                      <h3 className={`font-bold text-sm tracking-tight truncate ${textMain}`}>
                        {prod.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(prod)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isDark
                            ? 'border-[#333] hover:bg-[#282828] text-slate-300'
                            : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#C8A051]" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className={`p-1.5 rounded-lg border transition-colors text-rose-500 ${
                          isDark ? 'border-[#333] hover:bg-[#282828]' : 'border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className={`text-xs mt-1 line-clamp-2 ${textMuted}`}>
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Variants Pill List */}
              <div className="border-t border-slate-100 dark:border-[#2C2C2C] pt-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${textMuted}`}>
                  Configured Variants ({prod.variants?.length || 0})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {prod.variants?.map((v) => (
                    <div
                      key={v.sku}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                        isDark ? 'bg-[#252525] border-[#333]' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className={`font-bold truncate ${textMain}`}>{v.flavour}</p>
                        <p className={`text-[10px] ${textMuted}`}>{v.boxSize}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-black ${textMain}`}>₹{v.price}</p>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                          v.isDeliveryEligible === false
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {v.isDeliveryEligible === false ? 'No Delivery' : 'Delivered'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400">No products found.</p>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-xl border rounded-2xl p-6 space-y-4 my-8 shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2C2C2C]">
              <h2 className={`font-bold text-base ${textMain}`}>
                {editingProduct ? 'Edit Product' : 'Add New Edible Cup Line'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className={`text-xs font-semibold block mb-1 ${textMain}`}>Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
                  required
                />
              </div>

              <div>
                <label className={`text-xs font-semibold block mb-1 ${textMain}`}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
                >
                  <option value="100 ML | HOT">100 ML | HOT</option>
                  <option value="150 ML | COLD">150 ML | COLD</option>
                  <option value="Chocolate Coated">Chocolate Coated</option>
                  <option value="Assorted Pack">Assorted Pack</option>
                </select>
              </div>

              <div>
                <label className={`text-xs font-semibold block mb-1 ${textMain}`}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
                />
              </div>

              <div>
                <label className={`text-xs font-semibold block mb-1 ${textMain}`}>Image URL / Path</label>
                <input
                  type="text"
                  value={form.images[0] || ''}
                  onChange={(e) => setForm({ ...form, images: [e.target.value] })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C8A051] ${inputBg}`}
                  placeholder="/assets/products/chocolate-cup.svg"
                />
              </div>

              {/* Variants Section */}
              <div className="border-t border-slate-100 dark:border-[#2C2C2C] pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#C8A051] uppercase tracking-wider">
                    Flavour & Purchasing Variants
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-xs font-bold text-[#C8A051] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Variant
                  </button>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {form.variants.map((v, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border space-y-2 ${
                        isDark ? 'bg-[#242424] border-[#333]' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <span className={`text-[10px] block mb-0.5 ${textMuted}`}>Flavour</span>
                          <input
                            type="text"
                            value={v.flavour}
                            onChange={(e) => handleVariantChange(idx, 'flavour', e.target.value)}
                            className={`w-full px-2 py-1 rounded-lg text-xs border ${inputBg}`}
                          />
                        </div>
                        <div>
                          <span className={`text-[10px] block mb-0.5 ${textMuted}`}>Package Spec</span>
                          <input
                            type="text"
                            value={v.boxSize}
                            onChange={(e) => handleVariantChange(idx, 'boxSize', e.target.value)}
                            className={`w-full px-2 py-1 rounded-lg text-xs border ${inputBg}`}
                          />
                        </div>
                        <div>
                          <span className={`text-[10px] block mb-0.5 ${textMuted}`}>Price (₹)</span>
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => handleVariantChange(idx, 'price', Number(e.target.value))}
                            className={`w-full px-2 py-1 rounded-lg text-xs border ${inputBg}`}
                          />
                        </div>
                        <div>
                          <span className={`text-[10px] block mb-0.5 ${textMuted}`}>Stock</span>
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => handleVariantChange(idx, 'stock', Number(e.target.value))}
                            className={`w-full px-2 py-1 rounded-lg text-xs border ${inputBg}`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className={`text-[10px] font-mono ${textMuted}`}>SKU: {v.sku}</span>
                        {form.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="text-[11px] text-rose-500 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#C8A051] hover:bg-[#B38D40] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold border ${
                    isDark ? 'border-[#333] hover:bg-[#282828] text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
