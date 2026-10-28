import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import NutritionCards from '../components/NutritionCards';
import {
  Clock,
  ChefHat,
  Users,
  Bookmark,
  ShoppingCart,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lightbulb,
  Plus,
  Minus
} from 'lucide-react';

export default function RecipeDetail({ recipeId, onBack, setActiveTab }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(1);
  const [scaledData, setScaledData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    if (!recipeId) return;
    setLoading(true);
    api.getFoodById(recipeId)
      .then((data) => {
        setRecipe(data);
        setServings(1);
        setScaledData(null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [recipeId]);

  // Adjust servings dynamically
  const updateServings = async (newServings) => {
    if (newServings < 0.5) return;
    setServings(newServings);
    try {
      const scaled = await api.recalculateServing(recipe.id, newServings);
      setScaledData(scaled);
    } catch (err) {
      console.error('Serving scaling error:', err);
    }
  };

  const handleSaveFavorite = async () => {
    try {
      await api.saveFavorite(recipe.id);
      setIsSaved(true);
      setActionNotice('Saved to your favourites list!');
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      setActionNotice('Notice: ' + err.message);
    }
  };

  const handleAddToShoppingList = async () => {
    try {
      await api.addFromRecipe(recipe.id);
      setActionNotice('All recipe ingredients added to your Grocery Shopping List!');
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      setActionNotice('Notice: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-slate-500">Loading recipe details...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">No Recipe Selected</h3>
        <p className="text-xs text-slate-500">Please choose a dish from the Protein & Recipe Explorer.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
        >
          Back to Explorer
        </button>
      </div>
    );
  }

  let ingredients = [];
  try {
    ingredients = JSON.parse(recipe.main_ingredients || '[]');
  } catch {
    ingredients = [recipe.main_ingredients];
  }

  let instructions = [];
  try {
    instructions = JSON.parse(recipe.recipe_instructions || '[]');
  } catch {
    instructions = [recipe.recipe_instructions];
  }

  let substitutions = [];
  try {
    substitutions = JSON.parse(recipe.budget_substitutions || '[]');
  } catch {
    substitutions = [recipe.budget_substitutions];
  }

  // Active nutrition display (scaled or base)
  const activeNutrition = scaledData || recipe;
  const totalCost = (recipe.cost_per_serving_inr * servings).toFixed(1);

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explorer</span>
      </button>

      {/* Main Recipe Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {recipe.image_url && (
          <div className="h-56 sm:h-72 w-full overflow-hidden relative">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-600 text-white text-[11px] font-extrabold uppercase">
                {recipe.dietary_type} • {recipe.cuisine}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                {recipe.name}
              </h1>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {!recipe.image_url && (
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-600 text-white text-[11px] font-extrabold uppercase">
                {recipe.dietary_type} • {recipe.cuisine}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {recipe.name}
              </h1>
            </div>
          )}

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Total Time</span>
              <strong className="text-slate-800 dark:text-slate-200 font-extrabold text-sm">
                {recipe.prep_time_minutes + recipe.cooking_time_minutes} mins
              </strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Difficulty</span>
              <strong className="text-slate-800 dark:text-slate-200 font-extrabold text-sm">
                {recipe.difficulty}
              </strong>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold block uppercase text-[10px]">Protein</span>
              <strong className="text-emerald-700 dark:text-emerald-300 font-extrabold text-sm">
                {activeNutrition.protein}g
              </strong>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
              <span className="text-amber-700 dark:text-amber-400 font-semibold block uppercase text-[10px]">Estimated Cost</span>
              <strong className="text-amber-700 dark:text-amber-300 font-extrabold text-sm">
                ₹{totalCost}
              </strong>
            </div>
          </div>

          {/* Serving Size Quantity Adjuster (Requirement 4) */}
          <div className="bg-gradient-to-r from-brand-50 to-emerald-50 dark:from-slate-800/60 dark:to-slate-800/30 border border-brand-200 dark:border-slate-700 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Adjust Serving Count
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically recalculates ingredient quantities & nutritional values
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateServings(Math.max(1, servings - 1))}
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white flex items-center justify-center font-bold hover:bg-slate-100"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-base font-extrabold text-slate-900 dark:text-white min-w-[60px] text-center">
                {servings} {servings === 1 ? 'Serving' : 'Servings'}
              </span>

              <button
                onClick={() => updateServings(servings + 1)}
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white flex items-center justify-center font-bold hover:bg-slate-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons: Favourites and Shopping List */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleSaveFavorite}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                isSaved
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isSaved ? 'Saved in Favourites' : 'Save to Favourites'}</span>
            </button>

            <button
              onClick={handleAddToShoppingList}
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add Ingredients to Shopping List</span>
            </button>
          </div>

          {actionNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* Recalculated Nutrition Cards */}
          <NutritionCards data={activeNutrition} servingWeight={recipe.serving_weight_g * servings} />

          {/* Ingredients Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-brand-500" />
              <span>Ingredients List ({servings} {servings === 1 ? 'Serving' : 'Servings'})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                  <span>{ing} {servings > 1 ? `(scaled x${servings})` : ''}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Step by Step */}
          {instructions.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Step-by-Step Cooking Instructions
              </h3>
              <div className="space-y-2.5">
                {instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cooking Tips & Budget Substitutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {recipe.cooking_tips && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Chef Cooking Tip</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {recipe.cooking_tips}
                </p>
              </div>
            )}

            {substitutions.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Budget Substitutions</span>
                </div>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {substitutions.map((sub, idx) => (
                    <li key={idx}>{sub}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

