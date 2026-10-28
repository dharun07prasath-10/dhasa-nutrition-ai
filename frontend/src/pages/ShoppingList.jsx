import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('500g');
  const [cost, setCost] = useState('30');
  const [category, setCategory] = useState('General');

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const fetchShoppingList = async () => {
    try {
      const data = await api.getShoppingList();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    try {
      const created = await api.addShoppingItem({
        item_name: itemName.trim(),
        quantity: quantity.trim(),
        estimated_cost_inr: parseFloat(cost) || 20.0,
        category: category.trim()
      });
      setItems(prev => [created, ...prev]);
      setItemName('');
    } catch (err) {
      alert('Error adding item: ' + err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.toggleShoppingItem(id);
      setItems(prev => prev.map(item => item.id === id ? { ...item, is_checked: res.is_checked } : item));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteShoppingItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await api.clearCompletedShopping();
      setItems(prev => prev.filter(item => !item.is_checked));
    } catch (err) {
      console.error(err);
    }
  };

  const totalCost = items.reduce((sum, item) => sum + (item.estimated_cost_inr || 0), 0);
  const remainingCost = items.filter(i => !i.is_checked).reduce((sum, item) => sum + (item.estimated_cost_inr || 0), 0);

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Pantry & Grocery Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Grocery Shopping List
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep track of pulses, soya chunks, eggs, and millets for your weekly meal plans.
          </p>
        </div>

        {/* Budget summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl shadow-sm text-right">
          <span className="text-xs text-slate-400 font-semibold uppercase">Pending Spend</span>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400">₹{remainingCost.toFixed(0)}</p>
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form
        onSubmit={handleAddItem}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Add Item to List</span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Item name (e.g., Soya chunks)"
            className="sm:col-span-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity (e.g. 500g)"
            className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="₹ Est."
              className="w-20 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-brand-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </form>

      {/* Shopping List Items */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            {items.filter(i => !i.is_checked).length} Items Remaining • {items.filter(i => i.is_checked).length} Completed
          </span>
          {items.some(i => i.is_checked) && (
            <button
              onClick={handleClearCompleted}
              className="text-xs font-bold text-rose-500 hover:underline"
            >
              Clear Checked Items
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading shopping items...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">Your shopping list is empty</p>
            <p className="text-xs text-slate-400">Add ingredients from Recipe Details or generate a 7-day meal plan to populate.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.is_checked
                    ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 text-slate-400 line-through'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-500/60'
                }`}
              >
                <div
                  onClick={() => handleToggle(item.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  {item.is_checked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {item.item_name}
                    </h5>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.quantity} • {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                    ₹{item.estimated_cost_inr}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

