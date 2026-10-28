import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Scale,
  ArrowUpDown,
  Search,
  Filter,
  CheckCircle2,
  TrendingDown,
  Info
} from 'lucide-react';

export default function CostComparison({ onSelectRecipe, setActiveTab }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [dietaryType, setDietaryType] = useState('all');
  const [sortBy, setSortBy] = useState('cost_per_10g_protein_inr');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchComparisonData();
  }, [category, dietaryType, sortBy, sortOrder]);

  const fetchComparisonData = async () => {
    setLoading(true);
    try {
      const params = {
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      if (search.trim()) params.search = search.trim();
      if (category !== 'all') params.category = category;
      if (dietaryType !== 'all') params.dietary_type = dietaryType;

      const data = await api.getFoods(params);
      setFoods(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
          <Scale className="w-3.5 h-3.5" />
          <span>Value Evaluation Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Protein & Cost Comparison Tool
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Evaluate foods by the most crucial budget fitness metric: <strong className="text-slate-800 dark:text-slate-200">Cost per 10g of pure protein</strong>. Dry raw weights vs cooked portions are explicitly labelled.
        </p>
      </div>

      {/* Golden Metric Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-start gap-3 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <strong>Scientific Comparison Rule:</strong> Soya chunks contain 52g protein per 100g dry weight, which expands to ~300g cooked weight. To ensure 100% transparency, dry raw ingredients are benchmarked by their dry state, while prepared recipes reflect real plate serving weights.
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[220px]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter food items..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
          >
            <option value="all">All Categories</option>
            <option value="Pulses and legumes">Pulses & Legumes</option>
            <option value="Soya and dairy">Soya & Dairy</option>
            <option value="Eggs, poultry, and seafood">Eggs, Poultry & Seafood</option>
            <option value="Grains, seeds, and nuts">Grains, Seeds & Nuts</option>
            <option value="Healthy, budget-friendly meal ideas">Healthy Meal Ideas</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
          >
            <option value="cost_per_10g_protein_inr">₹ per 10g Protein (Best Value)</option>
            <option value="protein">Total Protein (Highest First)</option>
            <option value="cost_per_serving_inr">Cost Per Serving (Lowest First)</option>
            <option value="calories">Calories</option>
            <option value="fiber">Dietary Fiber</option>
          </select>

          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Toggle Sort Order"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">Calculating cost and protein ratios...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-5">Food / Dish Name</th>
                  <th className="py-4 px-4">State</th>
                  <th className="py-4 px-4 text-emerald-600 dark:text-emerald-400">Protein / Serving</th>
                  <th className="py-4 px-4">Protein / 100g</th>
                  <th className="py-4 px-4 text-amber-600 dark:text-amber-400">Cost / Serving</th>
                  <th className="py-4 px-4 font-black text-brand-600 dark:text-brand-400">Cost / 10g Protein</th>
                  <th className="py-4 px-4">Calories</th>
                  <th className="py-4 px-4">Fiber</th>
                  <th className="py-4 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {foods.map((food, idx) => {
                  const protPer100g = ((food.protein / maxVal(food.serving_weight_g, 1)) * 100).toFixed(1);
                  const isTopValue = idx < 5 && sortBy === 'cost_per_10g_protein_inr';

                  return (
                    <tr
                      key={food.id}
                      className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                        isTopValue ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {isTopValue && (
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black">
                              ★
                            </span>
                          )}
                          <span>{food.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {food.weight_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                        {food.protein}g
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-bold">
                        {protPer100g}g
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-amber-600 dark:text-amber-400">
                        ₹{food.cost_per_serving_inr}
                      </td>
                      <td className="py-3.5 px-4 font-black text-brand-600 dark:text-brand-400 text-sm">
                        ₹{food.cost_per_10g_protein_inr?.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {Math.round(food.calories)} kcal
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {food.fiber}g
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            if (onSelectRecipe) onSelectRecipe(food.id);
                            setActiveTab('recipe_detail');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white text-[11px] font-bold transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function maxVal(val, min) {
  return val && val > min ? val : min;
}

