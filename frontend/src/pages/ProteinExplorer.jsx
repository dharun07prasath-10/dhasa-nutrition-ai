import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Search,
  Filter,
  ArrowUpDown,
  UtensilsCrossed,
  ChefHat,
  Clock,
  Sparkles,
  Edit3,
  Check,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Pulses and legumes',
  'Soya and dairy',
  'Eggs, poultry, and seafood',
  'Grains, seeds, and nuts',
  'Healthy, budget-friendly meal ideas',
];

const DIETARY_TYPES = ['all', 'vegetarian', 'vegan', 'egg-based', 'non-vegetarian'];

export default function ProteinExplorer({ onSelectRecipe, setActiveTab }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Price Edit Modal
  const [editingItem, setEditingItem] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, selectedDiet, sortBy, sortOrder]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const params = {
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All Categories') params.category = selectedCategory;
      if (selectedDiet !== 'all') params.dietary_type = selectedDiet;

      const data = await api.getFoods(params);
      setFoods(data);
    } catch (err) {
      console.error('Error fetching foods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFoods();
  };

  const handlePriceUpdate = async () => {
    if (!editingItem || !newPrice) return;
    setSavingPrice(true);
    try {
      const updated = await api.adjustFoodPrice(editingItem.id, parseFloat(newPrice));
      setFoods((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      setEditingItem(null);
    } catch (err) {
      alert('Failed to update price: ' + err.message);
    } finally {
      setSavingPrice(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>100 Verified High-Protein Indian Entries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Protein & Recipe Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Explore 100 affordable high-protein foods and recipes, clearly distinguishing raw ingredients from cooked meals.
          </p>
        </div>

        {/* Total Count Badge */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm text-right">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Catalogue</span>
          <p className="text-lg font-black text-brand-600 dark:text-brand-400">{foods.length} Foods & Recipes</p>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Sorting Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by food name, ingredient or Tamil dish..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </form>

        {/* Dietary Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Diet:</span>
          <select
            value={selectedDiet}
            onChange={(e) => setSelectedDiet(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            {DIETARY_TYPES.map((d) => (
              <option key={d} value={d}>
                {d.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="id">Default Catalogue (1-100)</option>
            <option value="protein">Highest Protein</option>
            <option value="cost_per_10g_protein_inr">Best Value (₹ per 10g Protein)</option>
            <option value="cost_per_serving_inr">Lowest Cost / Serving</option>
            <option value="calories">Lowest Calories</option>
            <option value="fiber">Highest Fiber</option>
          </select>

          <button
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of 100 Foods */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">Loading 100 food items...</p>
        </div>
      ) : foods.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">No items match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Try resetting filters or searching for pulses, soya, eggs, or seeds.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/80 rounded-3xl p-5 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 uppercase">
                    {food.dietary_type}
                  </span>
                  <span className="text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                    {food.weight_status.toUpperCase()} WEIGHT
                  </span>
                </div>

                {/* Name & Category */}
                <div>
                  <h3
                    onClick={() => {
                      if (onSelectRecipe) onSelectRecipe(food.id);
                      setActiveTab('recipe_detail');
                    }}
                    className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 cursor-pointer transition-colors line-clamp-1"
                  >
                    #{food.id}. {food.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{food.category}</p>
                </div>

                {/* Serving size note */}
                <div className="text-xs text-slate-500 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                  <span>Serving: <strong>{food.serving_size}</strong></span>
                  <span>{Math.round(food.calories)} kcal</span>
                </div>

                {/* Macro pill summary */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-bold">PROTEIN</span>
                    <strong className="text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">{food.protein}g</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40">
                    <span className="text-[10px] text-sky-700 dark:text-sky-400 block font-bold">CARBS</span>
                    <strong className="text-sky-800 dark:text-sky-300 font-extrabold text-sm">{food.carbs}g</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40">
                    <span className="text-[10px] text-purple-700 dark:text-purple-400 block font-bold">FATS</span>
                    <strong className="text-purple-800 dark:text-purple-300 font-extrabold text-sm">{food.fats}g</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-bold">FIBER</span>
                    <strong className="text-amber-800 dark:text-amber-300 font-extrabold text-sm">{food.fiber}g</strong>
                  </div>
                </div>

                {/* Budget metric calculation (₹ per 10g protein) */}
                <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Protein Value:</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                    ₹{food.cost_per_10g_protein_inr?.toFixed(2)} / 10g protein
                  </span>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {/* Price Display with Edit button */}
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                    ₹{food.cost_per_serving_inr}
                  </span>
                  <span className="text-[11px] text-slate-400">/ serving</span>
                  <button
                    onClick={() => {
                      setEditingItem(food);
                      setNewPrice(food.cost_per_serving_inr);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 ml-1"
                    title="Adjust your local ingredient price"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* View Details CTA */}
                <button
                  onClick={() => {
                    if (onSelectRecipe) onSelectRecipe(food.id);
                    setActiveTab('recipe_detail');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>{food.is_recipe ? 'Cook Recipe' : 'Nutrition Details'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Adjust Local Market Price Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Adjust Local Price</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Customize the local retail price for <strong className="text-slate-800 dark:text-slate-200">{editingItem.name}</strong> according to your neighborhood market / kirana store rates in Indian Rupees (₹).
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Cost Per Serving (₹)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePriceUpdate}
                disabled={savingPrice}
                className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Local Price</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

