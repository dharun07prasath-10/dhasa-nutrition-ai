import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Flame,
  Dumbbell,
  Droplets,
  Camera,
  UtensilsCrossed,
  CalendarDays,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus
} from 'lucide-react';

export default function Dashboard({ setActiveTab, onSelectRecipe }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDailySummary(),
      api.getFoods({ sort_by: 'protein', sort_order: 'desc' })
    ])
      .then(([summaryData, foodsData]) => {
        setSummary(summaryData);
        setFeaturedFoods(foodsData.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const proteinPct = Math.min(
    100,
    Math.round(((summary?.total_protein || 0) / (user?.daily_protein_target || 110)) * 100)
  );

  const caloriePct = Math.min(
    100,
    Math.round(((summary?.total_calories || 0) / (user?.daily_calorie_target || 2200)) * 100)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-brand-600 to-teal-700 text-white p-6 sm:p-8 shadow-xl shadow-brand-900/10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered High-Protein Fitness Companion</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Fuel your fitness, {user?.full_name?.split(' ')[0] || 'Champion'}!
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-medium">
            Scan meals with computer vision, discover 100 budget-friendly Indian protein foods, and build high-protein 7-day meal plans within ₹{user?.daily_budget_inr || 180}/day.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('scanner')}
              className="px-5 py-2.5 rounded-xl bg-white text-brand-700 hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Food Image</span>
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className="px-5 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-2 transition-all"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>100 Foods Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Progress Targets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Protein Target */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Protein Today</span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {summary?.total_protein || 0}g <span className="text-xs font-normal text-slate-500">/ {user?.daily_protein_target || 110}g</span>
                </h3>
              </div>
            </div>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{proteinPct}%</span>
          </div>

          <div className="mt-5 space-y-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${proteinPct}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 flex justify-between">
              <span>{Math.max(0, (user?.daily_protein_target || 110) - (summary?.total_protein || 0)).toFixed(1)}g remaining</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">Muscle Goal</span>
            </p>
          </div>
        </div>

        {/* Calories Target */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Calories Today</span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {summary?.total_calories || 0} <span className="text-xs font-normal text-slate-500">/ {user?.daily_calorie_target || 2200} kcal</span>
                </h3>
              </div>
            </div>
            <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">{caloriePct}%</span>
          </div>

          <div className="mt-5 space-y-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${caloriePct}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 flex justify-between">
              <span>{Math.max(0, (user?.daily_calorie_target || 2200) - (summary?.total_calories || 0)).toFixed(0)} kcal remaining</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">Energy Target</span>
            </p>
          </div>
        </div>

        {/* Hydration */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hydration</span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {summary?.water_glasses || 0} glasses <span className="text-xs font-normal text-slate-500">({summary?.water_ml || 0} ml)</span>
                </h3>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300">
              8 Goal
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-1.5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-6 rounded-md transition-colors ${
                    i < (summary?.water_glasses || 0)
                      ? 'bg-sky-500'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => {
                const next = (summary?.water_glasses || 0) + 1;
                api.updateWaterIntake(next).then(() => {
                  api.getDailySummary().then(setSummary);
                });
              }}
              className="p-1.5 rounded-xl bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300 hover:bg-sky-100 text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Glass
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('scanner')}
          className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-3xl p-5 shadow-sm transition-all hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-4">DHASA Food Scanner</h4>
          <p className="text-xs text-slate-500 mt-1">Upload meal photo or food label for instant macro & fat analysis.</p>
        </div>

        <div
          onClick={() => setActiveTab('explorer')}
          className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-3xl p-5 shadow-sm transition-all hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-4">Protein Explorer</h4>
          <p className="text-xs text-slate-500 mt-1">100 budget foods, raw vs cooked metrics, and local price adjustments.</p>
        </div>

        <div
          onClick={() => setActiveTab('meal_planner')}
          className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-3xl p-5 shadow-sm transition-all hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-4">7-Day Meal Planner</h4>
          <p className="text-xs text-slate-500 mt-1">Zero-waste budget plans with consolidated grocery shopping lists.</p>
        </div>

        <div
          onClick={() => setActiveTab('assistant')}
          className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-3xl p-5 shadow-sm transition-all hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-4">AI Nutrition Coach</h4>
          <p className="text-xs text-slate-500 mt-1">Get scientific guidance on South Indian foods, fats, and muscle gain.</p>
        </div>
      </div>

      {/* Featured Protein Champions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Top High-Protein Champions</h3>
            <p className="text-xs text-slate-500">Highest protein density per ₹ in the verified 100-item catalogue</p>
          </div>
          <button
            onClick={() => setActiveTab('explorer')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>View All 100 Entries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredFoods.map((f) => (
            <div
              key={f.id}
              onClick={() => {
                if (onSelectRecipe) onSelectRecipe(f.id);
                setActiveTab('recipe_detail');
              }}
              className="cursor-pointer group border border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-2xl p-4 flex flex-col justify-between transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                    {f.dietary_type}
                  </span>
                  <span className="text-slate-400">{f.weight_status}</span>
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors line-clamp-1">
                  {f.name}
                </h5>
                <p className="text-xs text-slate-500 line-clamp-1">{f.category}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-600 dark:text-emerald-400">{f.protein}g Protein</span>
                <span className="text-amber-600 dark:text-amber-400">₹{f.cost_per_serving_inr} / serving</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

