import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Activity,
  Calendar,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Heart
} from 'lucide-react';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner'];

export default function DailyTracker() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick manual log modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [activeMealType, setActiveMealType] = useState('Breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('200');
  const [protein, setProtein] = useState('15');
  const [carbs, setCarbs] = useState('20');
  const [fats, setFats] = useState('5');
  const [fiber, setFiber] = useState('4');

  useEffect(() => {
    fetchSummary();
  }, [selectedDate]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await api.getDailySummary(selectedDate);
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualLog = async (e) => {
    e.preventDefault();
    if (!foodName.trim()) return;
    try {
      await api.logMealItem({
        log_date: selectedDate,
        meal_type: activeMealType,
        food_name: foodName.trim(),
        serving_amount: 1.0,
        serving_unit: 'serving',
        calories: parseFloat(calories) || 0,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fats: parseFloat(fats) || 0,
        fiber: parseFloat(fiber) || 0
      });
      setShowLogModal(false);
      setFoodName('');
      fetchSummary();
    } catch (err) {
      alert('Error logging item: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.deleteLoggedItem(itemId);
      fetchSummary();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateWater = async (glasses) => {
    try {
      await api.updateWaterIntake(glasses, selectedDate);
      fetchSummary();
    } catch (err) {
      console.error(err);
    }
  };

  const calorieTarget = user?.daily_calorie_target || 2200;
  const proteinTarget = user?.daily_protein_target || 110;
  const caloriePct = Math.min(100, Math.round(((summary?.total_calories || 0) / calorieTarget) * 100));
  const proteinPct = Math.min(100, Math.round(((summary?.total_protein || 0) / proteinTarget) * 100));

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header and Date Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
            <Activity className="w-3.5 h-3.5" />
            <span>Daily Intake & Progress Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Daily Nutrition Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Record Breakfast, Lunch, Snacks, and Dinner to see your actual macro consumption against goals.
          </p>
        </div>

        {/* Date picker */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-2xl shadow-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Calories Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Calories Consumed</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {summary?.total_calories || 0} <span className="text-xs font-normal text-slate-500">/ {calorieTarget} kcal</span>
                </h3>
              </div>
            </div>
            <span className="text-base font-black text-amber-600">{caloriePct}%</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: `${caloriePct}%` }}></div>
          </div>
        </div>

        {/* Protein Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Protein Consumed</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {summary?.total_protein || 0}g <span className="text-xs font-normal text-slate-500">/ {proteinTarget}g</span>
                </h3>
              </div>
            </div>
            <span className="text-base font-black text-emerald-600">{proteinPct}%</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${proteinPct}%` }}></div>
          </div>
        </div>
      </div>

      {/* Water Tracker Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Water Intake</h4>
            <p className="text-xs text-slate-500">
              {summary?.water_glasses || 0} glasses ({summary?.water_ml || 0} ml) • Recommended: 8-10 glasses (2-2.5L)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUpdateWater(Math.max(0, (summary?.water_glasses || 0) - 1))}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200"
          >
            -
          </button>
          <span className="text-lg font-black text-slate-900 dark:text-white min-w-[36px] text-center">
            {summary?.water_glasses || 0}
          </span>
          <button
            onClick={() => handleUpdateWater((summary?.water_glasses || 0) + 1)}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-sky-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Glass
          </button>
        </div>
      </div>

      {/* 4 Meals Grouping */}
      <div className="space-y-6">
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Recorded Meals</h3>

        <div className="space-y-4">
          {MEAL_TYPES.map((type) => {
            const mealItems = summary?.items?.filter(i => i.meal_type === type) || [];
            const mealCalories = Math.round(mealItems.reduce((acc, curr) => acc + curr.calories, 0));
            const mealProtein = mealItems.reduce((acc, curr) => acc + curr.protein, 0).toFixed(1);

            return (
              <div
                key={type}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">{type}</span>
                    <span className="text-xs text-slate-400 font-semibold">
                      ({mealCalories} kcal • {mealProtein}g protein)
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveMealType(type);
                      setShowLogModal(true);
                    }}
                    className="p-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Item</span>
                  </button>
                </div>

                {mealItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No food logged for {type} yet.</p>
                ) : (
                  <div className="space-y-2">
                    {mealItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-slate-900 dark:text-white font-bold block">{item.food_name}</strong>
                          <span className="text-slate-400 text-[11px]">
                            {item.serving_amount} {item.serving_unit} • Carbs: {item.carbs}g • Fats: {item.fats}g • Fiber: {item.fiber}g
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">{item.protein}g Prot</span>
                            <span className="text-slate-400">{Math.round(item.calories)} kcal</span>
                          </div>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200/60 dark:hover:bg-slate-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Quick Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleManualLog}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp"
          >
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Log {activeMealType} Item</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Food / Dish Name</label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. 2 Boiled Eggs, 1 cup Dal Khichdi"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500">Calories (kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500">Protein (g)</label>
                <input
                  type="number"
                  step="0.5"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500">Carbs (g)</label>
                <input
                  type="number"
                  step="0.5"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500">Fats (g)</label>
                <input
                  type="number"
                  step="0.5"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20"
              >
                Save Food
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

