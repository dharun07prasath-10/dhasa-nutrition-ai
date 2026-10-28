import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FoodScanner from './pages/FoodScanner';
import ProteinExplorer from './pages/ProteinExplorer';
import RecipeDetail from './pages/RecipeDetail';
import Recommendations from './pages/Recommendations';
import MealPlanner from './pages/MealPlanner';
import CostComparison from './pages/CostComparison';
import ShoppingList from './pages/ShoppingList';
import SavedRecipes from './pages/SavedRecipes';
import DailyTracker from './pages/DailyTracker';
import AIAssistant from './pages/AIAssistant';
import UserProfile from './pages/UserProfile';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRecipeId, setSelectedRecipeId] = useState(83); // Soya Chunks Poriyal as default active recipe
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSelectRecipe = (id) => {
    setSelectedRecipeId(id);
    setActiveTab('recipe_detail');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Navbar */}
      <Navbar
        onMenuToggle={() => setIsMobileOpen(prev => !prev)}
        isMobileOpen={isMobileOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard setActiveTab={setActiveTab} onSelectRecipe={handleSelectRecipe} />
          )}

          {activeTab === 'scanner' && (
            <FoodScanner setActiveTab={setActiveTab} onSelectRecipe={handleSelectRecipe} />
          )}

          {activeTab === 'explorer' && (
            <ProteinExplorer onSelectRecipe={handleSelectRecipe} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'recipe_detail' && (
            <RecipeDetail
              recipeId={selectedRecipeId}
              onBack={() => setActiveTab('explorer')}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'recommendations' && (
            <Recommendations onSelectRecipe={handleSelectRecipe} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'meal_planner' && (
            <MealPlanner onSelectRecipe={handleSelectRecipe} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'cost_comparison' && (
            <CostComparison onSelectRecipe={handleSelectRecipe} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'shopping_list' && (
            <ShoppingList />
          )}

          {activeTab === 'saved_recipes' && (
            <SavedRecipes onSelectRecipe={handleSelectRecipe} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'tracker' && (
            <DailyTracker />
          )}

          {activeTab === 'assistant' && (
            <AIAssistant />
          )}

          {activeTab === 'profile' && (
            <UserProfile />
          )}
        </main>
      </div>
    </div>
  );
}

