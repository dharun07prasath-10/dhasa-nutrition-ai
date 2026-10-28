import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Sparkles,
  ChefHat,
  Clock,
  Dumbbell,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Flame,
  Scale
} from 'lucide-react';

export default function Recommendations({ onSelectRecipe, setActiveTab }) {
  const [dietaryPreference, setDietaryPreference] = useState('all');
  const [dailyBudget, setDailyBudget] = useState(180);
  const [availableIngredients, setAvailableIngredients] = useState('soya chunks, onions, eggs, rice');
  const [preferredCuisine, setPreferredCuisine] = useState('South Indian & Tamil');
  const [cookingTime, setCookingTime] = useState(30);
  const [allergies, setAllergies] = useState('');
  const [proteinRange, setProteinRange] = useState('20g - 35g');
  const [equipment, setEquipment] = useState('Pan, Pressure Cooker');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Generate initial intelligent recommendations
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const ingrs = availableIngredients
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const algs = allergies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const equips = equipment
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.getRecommendations({
        dietary_preference: dietaryPreference,
        daily_budget_inr: dailyBudget,
        available_ingredients: ingrs,
        preferred_cuisine: preferredCuisine,
        available_cooking_time: cookingTime,
        allergies: algs,
        preferred_protein_range: proteinRange,
        cooking_equipment: equips,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Personalised Indian Cuisine Matcher</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          AI Personalised Recipe Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Tell the AI your budget, available kitchen ingredients, and dietary restrictions to get customized high-protein Indian meals with affordable ingredient substitutions.
        </p>
      </div>

      {/* Preferences Input Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Diet */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Dietary Type</label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <option value="all">Any / Flexitarian</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="egg-based">Egg-based</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
            </select>
          </div>

          {/* Daily Budget */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="uppercase tracking-wider text-slate-500">Food Budget</span>
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
          </div>

          {/* Protein Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Protein / Meal</label>
            <select
              value={proteinRange}
              onChange={(e) => setProteinRange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <option value="15g - 25g">15g - 25g (Maintenance)</option>
              <option value="20g - 35g">20g - 35g (Muscle Building)</option>
              <option value="30g+">30g+ (High Protein Focus)</option>
            </select>
          </div>

          {/* Cuisine */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Cuisine Focus</label>
            <select
              value={preferredCuisine}
              onChange={(e) => setPreferredCuisine(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <option value="South Indian & Tamil">South Indian & Tamil</option>
              <option value="Pan-Indian">Pan-Indian Homestyle</option>
              <option value="North Indian">North Indian</option>
            </select>
          </div>
        </div>

        {/* Available Ingredients & Allergies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Available Ingredients (comma-separated)
            </label>
            <input
              type="text"
              value={availableIngredients}
              onChange={(e) => setAvailableIngredients(e.target.value)}
              placeholder="e.g. soya chunks, eggs, curd, tomatoes, onions"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Food Allergies / Dislikes (comma-separated)
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Peanuts, Dairy, Soy"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-brand-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Synthesizing Matches...' : 'Find Tailored Meals'}</span>
          </button>
        </div>
      </div>

      {/* Recommended Meals Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">Matching ingredients with verified nutrition models...</p>
        </div>
      ) : result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Tamil Cuisine Highlights Banner */}
          {result.tamil_cuisine_highlights && result.tamil_cuisine_highlights.length > 0 && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-teal-500/10 border border-brand-200 dark:border-brand-800/40 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Regional Tamil & South Indian Fitness Insights
              </span>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 pl-1 list-disc list-inside leading-relaxed">
                {result.tamil_cuisine_highlights.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Meals Cards */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Recommended Recipes</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {result.recommended_meals?.map((meal, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between transition-all hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 uppercase">
                        {meal.dietary_type}
                      </span>
                      <span className="text-slate-400 font-semibold">{meal.prep_time} mins prep</span>
                    </div>

                    <h4 className="font-extrabold text-lg text-slate-900 dark:text-white line-clamp-1">
                      {meal.name}
                    </h4>

                    {/* AI Match Explanation (Requirement 3) */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-brand-600 dark:text-brand-400 block mb-0.5">Why it fits your profile:</strong>
                      {meal.match_reason}
                    </div>

                    {/* Macros Bar */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-bold">PROTEIN</span>
                        <strong className="text-emerald-800 dark:text-emerald-300 font-extrabold">{meal.protein}g</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-bold">CALORIES</span>
                        <strong className="text-amber-800 dark:text-amber-300 font-extrabold">{Math.round(meal.calories)} kcal</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40">
                        <span className="text-[10px] text-sky-700 dark:text-sky-400 block font-bold">COST</span>
                        <strong className="text-sky-800 dark:text-sky-300 font-extrabold">₹{meal.cost_inr}</strong>
                      </div>
                    </div>

                    {/* Substitutions */}
                    {meal.budget_substitutions && meal.budget_substitutions.length > 0 && (
                      <div className="text-xs text-slate-500 pt-1">
                        <strong className="text-slate-700 dark:text-slate-300">Economical Substitutions:</strong>{' '}
                        {meal.budget_substitutions.join('; ')}
                      </div>
                    )}
                  </div>

                  {/* Cook Button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => {
                        if (meal.id && onSelectRecipe) onSelectRecipe(meal.id);
                        setActiveTab('recipe_detail');
                      }}
                      className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20"
                    >
                      <span>View Recipe & Scale Servings</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

