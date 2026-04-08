import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ArrowUpDown,
  AlertTriangle
} from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Stationery',
    quantity: 0,
    unit: 'pcs',
    lowStockThreshold: 5
  });

  const categories = ["Furniture", "Electronics", "Stationery", "Other"];

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/inventory?search=${search}&category=${category}`);
      setItems(data);
    } catch (error) {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory', formData);
      toast.success("Item added successfully");
      setShowModal(false);
      setFormData({ name: '', category: 'Stationery', quantity: 0, unit: 'pcs', lowStockThreshold: 5 });
      fetchItems();
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/inventory/${id}`);
        toast.success("Item deleted");
        fetchItems();
      } catch (error) {
        toast.error("Failed to delete item");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 text-sm">Track and manage school assets and supplies.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="input-field min-w-[150px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Asset Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No items found</td>
                </tr>
              ) : items.map((item) => {
                const isLowStock = item.quantity <= item.lowStockThreshold;
                return (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-400">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge bg-indigo-50 text-indigo-700">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <span className="badge bg-red-50 text-red-600 flex items-center gap-1 w-fit">
                          <AlertTriangle size={12} />
                          Low Stock
                        </span>
                      ) : (
                        <span className="badge bg-emerald-50 text-emerald-600 w-fit">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add New Inventory Item</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select 
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Unit</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="pcs, kg, etc."
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Quantity</label>
                  <input 
                    type="number" 
                    className="input-field"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Low Stock Alert</label>
                  <input 
                    type="number" 
                    className="input-field"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
