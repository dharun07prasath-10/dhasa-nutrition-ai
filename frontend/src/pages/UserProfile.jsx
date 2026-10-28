import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Settings,
  Dumbbell,
  Flame,
  CheckCircle2,
  Sparkles,
  Heart
} from 'lucide-react';

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [calorieTarget, setCalorieTarget] = useState(2200);
  const [proteinTarget, setProteinTarget] = useState(110);
  const [budget, setBudget] = useState(180);
  const [dietaryPref, setDietaryPref] = useState('all');
  const [cuisine, setCuisine] = useState('South Indian & Tamil');
  const [allergies, setAllergies] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setCalorieTarget(user.daily_calorie_target || 2200);
      setProteinTarget(user.daily_protein_target || 110);
      setBudget(user.daily_budget_inr || 180);
      setDietaryPref(user.dietary_preference || 'all');
      setCuisine(user.preferred_cuisine || 'South Indian & Tamil');
      setAllergies(user.allergies || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const updated = await api.updateProfile({
        full_name: fullName,
        daily_calorie_target: parseFloat(calorieTarget),
        daily_protein_target: parseFloat(proteinTarget),
        daily_budget_inr: parseFloat(budget),
        dietary_preference: dietaryPref,
        preferred_cuisine: cuisine,
        allergies: allergies
      });
      updateUser(updated);
      setNotice('Fitness profile & daily nutrition targets updated successfully!');
      setTimeout(() => setNotice(null), 3000);
    } catch (err) {
      setNotice('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
          <Settings className="w-3.5 h-3.5" />
          <span>Targets & Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Fitness Profile & Nutrition Targets
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure your body goals, daily protein targets, and food budget.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Macro Targets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Protein Target (g)
            </label>
            <input
              type="number"
              value={proteinTarget}
              onChange={(e) => setProteinTarget(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Daily Calorie Goal (kcal)
            </label>
            <input
              type="number"
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Daily Food Budget (₹)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Dietary & Cuisine Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Dietary Pattern</label>
            <select
              value={dietaryPref}
              onChange={(e) => setDietaryPref(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <option value="all">Any / Flexitarian</option>
              <option value="vegetarian">Pure Vegetarian</option>
              <option value="vegan">Vegan (100% Plant-Based)</option>
              <option value="egg-based">Eggetarian (Egg-based)</option>
              <option value="non-vegetarian">Non-Vegetarian (Chicken, Fish & Eggs)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Preferred Cuisine</label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <option value="South Indian & Tamil">South Indian & Tamil Style</option>
              <option value="Pan-Indian">Pan-Indian Homestyle</option>
              <option value="North Indian">North Indian</option>
            </select>
          </div>
        </div>

        {/* Known Allergies */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Known Food Allergies & Restrictions (comma separated)
          </label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. Peanuts, Lactose, Gluten, Soy"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {notice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notice}</span>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-brand-500/20"
          >
            {saving ? 'Updating...' : 'Save Targets & Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}

