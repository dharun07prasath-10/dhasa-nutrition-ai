import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Dumbbell, User, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ onMenuToggle, isMobileOpen, activeTab, setActiveTab }) {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">DHASA Nutrition AI</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  AI AGENT
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Food Scanner & Nutrition System
              </p>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Daily Goals Pill */}
          {user && (
            <div className="hidden md:flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Dumbbell className="w-3.5 h-3.5" />
                Target: {user.daily_protein_target}g Protein
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-amber-600 dark:text-amber-400">
                ₹{user.daily_budget_inr}/day
              </span>
            </div>
          )}

          {/* Quick AI CTA */}
          <button
            onClick={() => setActiveTab('recommendations')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-xs font-bold border border-brand-200 dark:border-brand-800/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>AI Recipes</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Profile Button */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`p-1.5 pl-2.5 pr-3 rounded-xl flex items-center gap-2 border transition-all ${
              activeTab === 'profile'
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center text-xs font-bold">
              {user?.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:block text-xs font-bold truncate max-w-[100px]">
              {user?.full_name?.split(' ')[0] || user?.username || 'User'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

