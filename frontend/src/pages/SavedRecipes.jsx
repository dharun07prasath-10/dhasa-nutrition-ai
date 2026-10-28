import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Bookmark,
  Trash2,
  ChefHat,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function SavedRecipes({ onSelectRecipe, setActiveTab }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await api.getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (recipeId) => {
    try {
      await api.removeFavorite(recipeId);
      setFavorites(prev => prev.filter(f => f.recipe.id !== recipeId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Personal Recipe Collection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Saved Favourite Recipes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Quickly access your top chosen high-protein dishes and cook them again.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading your saved recipes...</div>
      ) : favorites.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">No Saved Recipes Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse the Protein & Recipe Explorer or AI Recommendations and click "Save to Favourites" to bookmark dishes here.
          </p>
          <button
            onClick={() => setActiveTab('explorer')}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs"
          >
            Explore 100 Recipes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav) => {
            const recipe = fav.recipe;
            return (
              <div
                key={fav.saved_id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-brand-500 transition-all hover:-translate-y-1"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                      {recipe.dietary_type}
                    </span>
                    <span className="text-slate-400">{recipe.cuisine}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">
                    {recipe.name}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {recipe.prep_time_minutes + recipe.cooking_time_minutes} mins
                    </span>
                    <span>•</span>
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                      {recipe.protein}g Protein
                    </span>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                      ₹{recipe.cost_per_serving_inr} / serving
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemove(recipe.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Remove from favourites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (onSelectRecipe) onSelectRecipe(recipe.id);
                        setActiveTab('recipe_detail');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-brand-500/20"
                    >
                      <span>Cook</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

