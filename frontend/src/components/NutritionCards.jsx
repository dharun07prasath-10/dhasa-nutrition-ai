import React, { useState } from 'react';
import { Flame, Dumbbell, Wheat, Droplets, Heart, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function NutritionCards({ data, servingWeight = 100 }) {
  const [showMicros, setShowMicros] = useState(false);

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* 4 Main Core Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Calories */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Energy</span>
            <div className="p-2 rounded-xl bg-amber-500 text-white">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              {Math.round(data.calories)} <span className="text-sm font-semibold text-slate-500">kcal</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {data.calories_per_100g ? `${data.calories_per_100g} kcal/100g` : `For ${servingWeight}g serving`}
            </p>
          </div>
        </div>

        {/* Protein */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Protein</span>
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {data.protein?.toFixed(1)} <span className="text-sm font-semibold">g</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Muscle synthesis & repair
            </p>
          </div>
        </div>

        {/* Carbs & Fiber */}
        <div className="bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-200 dark:border-sky-800/60 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">Carbs & Fiber</span>
            <div className="p-2 rounded-xl bg-sky-600 text-white">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              {data.carbs?.toFixed(1)} <span className="text-sm font-semibold text-slate-500">g</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Fiber: <strong className="text-sky-600 dark:text-sky-400">{data.fiber?.toFixed(1)}g</strong></span>
              <span>Sugar: {data.sugar ? `${data.sugar.toFixed(1)}g` : '0g'}</span>
            </p>
          </div>
        </div>

        {/* Total Fats */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800/60 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">Total Fats</span>
            <div className="p-2 rounded-xl bg-purple-600 text-white">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              {data.fats?.toFixed(1)} <span className="text-sm font-semibold text-slate-500">g</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sat Fat: {data.saturated_fat ? `${data.saturated_fat.toFixed(1)}g` : '0g'}
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Fat Analysis Section (Requirement 3.C) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Fat Composition Analysis</h3>
          </div>
          <span className="text-xs text-slate-500">Nutritional Biochemistry Breakdown</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Good Fats */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Good Unsaturated Fats
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-600 text-white">HEALTHY</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {((data.good_fats_mufa || data.mufa || 0) + (data.good_fats_pufa || data.pufa || 0)).toFixed(1)} g
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-1">
              <li className="flex justify-between">
                <span>MUFA (Heart health):</span>
                <strong>{(data.good_fats_mufa || data.mufa || 0).toFixed(2)}g</strong>
              </li>
              <li className="flex justify-between">
                <span>PUFA (Cell integrity):</span>
                <strong>{(data.good_fats_pufa || data.pufa || 0).toFixed(2)}g</strong>
              </li>
              <li className="flex justify-between text-emerald-700 dark:text-emerald-400">
                <span>Omega-3 Active:</span>
                <strong>{(data.omega3 || 0).toFixed(2)}g</strong>
              </li>
            </ul>
          </div>

          {/* Saturated Fat */}
          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Saturated Fat
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500 text-white">MODERATION</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {(data.saturated_fat || 0).toFixed(1)} g
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Essential for steroid hormone synthesis in moderation. Keep total saturated fat intake below 10% of daily total calories.
            </p>
          </div>

          {/* Trans Fat */}
          <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Trans Fat
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-600 text-white">RESTRICT</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {(data.trans_fat || 0).toFixed(2)} g
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Industrial trans fats (partially hydrogenated oils) increase LDL and cardiovascular disease risk. Naturally absent or minimal in clean whole foods.
            </p>
          </div>
        </div>
      </div>

      {/* Micronutrients Toggle Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <button
          onClick={() => setShowMicros(!showMicros)}
          className="w-full flex items-center justify-between text-left font-bold text-slate-900 dark:text-white"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>Essential Micronutrients, Minerals & Vitamins</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 font-semibold">
            <span>{showMicros ? 'Hide Minerals' : 'View Minerals (Sodium, Iron, Calcium, Vitamins)'}</span>
            {showMicros ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showMicros && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Sodium</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{Math.round(data.sodium_mg || 0)} mg</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Potassium</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{Math.round(data.potassium_mg || 0)} mg</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Calcium</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{Math.round(data.calcium_mg || 0)} mg</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Iron</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{(data.iron_mg || 0).toFixed(1)} mg</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Magnesium</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{Math.round(data.magnesium_mg || 0)} mg</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Vitamin A</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{Math.round(data.vitamin_a_mcg || 0)} mcg</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Vitamin C</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{(data.vitamin_c_mg || 0).toFixed(1)} mg</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Vitamin D</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{Math.round(data.vitamin_d_iu || 0)} IU</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Vitamin B12</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{(data.vitamin_b12_mcg || 0).toFixed(1)} mcg</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Cholesterol</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{Math.round(data.cholesterol_mg || 0)} mg</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

