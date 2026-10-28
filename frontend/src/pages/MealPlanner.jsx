import React, { useState } from 'react';
import { api } from '../services/api';
import {
  CalendarDays,
  Sparkles,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Flame,
  Dumbbell,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function MealPlanner({ onSelectRecipe, setActiveTab }) {
  const [dietaryPreference, setDietaryPreference] = useState('all');
  const [dailyBudget, setDailyBudget] = useState(180);
  const [preferredCuisine, setPreferredCuisine] = useState('South Indian & Tamil');
  const [targetProtein, setTargetProtein] = useState(105);
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [notice, setNotice] = useState(null);
  const [expandedDay, setExpandedDay] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const plan = await api.generateMealPlan({
        daily_budget_inr: dailyBudget,
        dietary_preference: dietaryPreference,
        preferred_cuisine: preferredCuisine,
        target_protein: targetProtein,
        target_calories: 2200
      });
      setMealPlan(plan);
    } catch (err) {
      setNotice('Generation error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!mealPlan) return;
    try {
      await api.saveMealPlan(mealPlan);
      setNotice('Meal plan successfully saved to your active schedules!');
      setTimeout(() => setNotice(null), 3000);
    } catch (err) {
      setNotice('Notice: ' + err.message);
    }
  };

  const handleExportToShoppingList = async () => {
    if (!mealPlan || !mealPlan.grocery_list) return;
    try {
      await api.addBulkGrocery(mealPlan.grocery_list);
      setNotice('Consolidated grocery list added to your Shopping List!');
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      setNotice('Notice: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>7-Day Zero-Waste Meal Planner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Budget High-Protein Meal Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Generate an intelligent, localized 7-day meal plan that maximizes protein while reusing pantry staples to minimize grocery waste and stay within budget.
        </p>
      </div>

      {/* Configuration Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dietary Preference */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Dietary Type</label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="all">Any / Flexitarian</option>
              <option value="vegetarian">Pure Vegetarian</option>
              <option value="vegan">100% Plant-Based Vegan</option>
              <option value="egg-based">Eggetarian (Egg-based)</option>
              <option value="non-vegetarian">Non-Vegetarian (Chicken & Fish)</option>
            </select>
          </div>

          {/* Daily Budget Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="uppercase tracking-wider text-slate-500">Daily Budget</span>
              <span className="text-amber-600 dark:text-amber-400">₹{dailyBudget} / day</span>
            </div>
            <input
              type="range"
              min="90"
              max="350"
              step="10"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(parseInt(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Budget (₹90)</span>
              <span>Generous (₹350)</span>
            </div>
          </div>

          {/* Target Protein */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="uppercase tracking-wider text-slate-500">Protein Target</span>
              <span className="text-emerald-600 dark:text-emerald-400">{targetProtein}g / day</span>
            </div>
            <input
              type="range"
              min="60"
              max="150"
              step="5"
              value={targetProtein}
              onChange={(e) => setTargetProtein(parseInt(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>60g</span>
              <span>150g</span>
            </div>
          </div>

          {/* Preferred Cuisine */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Cuisine Style</label>
            <select
              value={preferredCuisine}
              onChange={(e) => setPreferredCuisine(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="South Indian & Tamil">South Indian & Tamil Style</option>
              <option value="Pan-Indian">Pan-Indian Homestyle</option>
              <option value="North Indian">North Indian Dhabha Style</option>
            </select>
          </div>
        </div>

        {/* Generate CTA Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Synthesizing 7-Day Plan...' : 'Generate 7-Day Plan'}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Generated Plan Section */}
      {mealPlan && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Metric Strip */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plan Summary</span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{mealPlan.title}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-center">
              <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">Avg Protein</span>
                <strong className="text-base font-extrabold text-emerald-700 dark:text-emerald-300">{mealPlan.average_daily_protein}g/day</strong>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">Weekly Cost</span>
                <strong className="text-base font-extrabold text-amber-700 dark:text-amber-300">₹{mealPlan.estimated_weekly_cost}</strong>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                <span className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-400 block">Avg Calories</span>
                <strong className="text-base font-extrabold text-sky-700 dark:text-sky-300">{mealPlan.average_daily_calories} kcal</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSavePlan}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Plan</span>
              </button>
              <button
                onClick={handleExportToShoppingList}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-500/20"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Shopping List</span>
              </button>
            </div>
          </div>

          {/* 7-Days Schedule Accordions */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Daily 4-Meal Schedule</h3>

            <div className="space-y-3">
              {mealPlan.days?.map((day, idx) => {
                const isExpanded = expandedDay === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setExpandedDay(isExpanded ? -1 : idx)}
                      className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-extrabold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{day.day}</h4>
                          <p className="text-xs text-slate-400">
                            {day.total_protein}g protein • ₹{day.total_cost} estimated total
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                          {day.total_calories} kcal
                        </span>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                        {/* Breakfast */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                            Breakfast
                          </span>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{day.breakfast.name}</h5>
                          <div className="flex justify-between text-xs font-semibold text-slate-500 pt-1">
                            <span className="text-emerald-600 dark:text-emerald-400">{day.breakfast.protein}g Prot</span>
                            <span>₹{day.breakfast.cost_inr}</span>
                          </div>
                        </div>

                        {/* Lunch */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                            Lunch
                          </span>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{day.lunch.name}</h5>
                          <div className="flex justify-between text-xs font-semibold text-slate-500 pt-1">
                            <span className="text-emerald-600 dark:text-emerald-400">{day.lunch.protein}g Prot</span>
                            <span>₹{day.lunch.cost_inr}</span>
                          </div>
                        </div>

                        {/* Evening Snack */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            Evening Snack
                          </span>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{day.evening_snack.name}</h5>
                          <div className="flex justify-between text-xs font-semibold text-slate-500 pt-1">
                            <span className="text-emerald-600 dark:text-emerald-400">{day.evening_snack.protein}g Prot</span>
                            <span>₹{day.evening_snack.cost_inr}</span>
                          </div>
                        </div>

                        {/* Dinner */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                            Dinner
                          </span>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{day.dinner.name}</h5>
                          <div className="flex justify-between text-xs font-semibold text-slate-500 pt-1">
                            <span className="text-emerald-600 dark:text-emerald-400">{day.dinner.protein}g Prot</span>
                            <span>₹{day.dinner.cost_inr}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consolidated Grocery List & Ingredient Reuse Notes (Requirement 5) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grocery List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-brand-500" />
                  <span>Consolidated Weekly Grocery List</span>
                </h4>
                <span className="text-xs text-slate-500">{mealPlan.grocery_list?.length} items</span>
              </div>

              <div className="space-y-2">
                {mealPlan.grocery_list?.map((g, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200 font-bold block">{g.item}</strong>
                      <span className="text-slate-400">{g.quantity} • {g.category}</span>
                    </div>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">₹{g.estimated_cost}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredient Reuse & Waste Reduction */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Zero-Waste Pantry Strategy
                </h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                To maximize your budget, ingredients are intelligently reused across distinct recipes:
              </p>

              <div className="space-y-2.5">
                {mealPlan.ingredient_reuse_notes?.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

