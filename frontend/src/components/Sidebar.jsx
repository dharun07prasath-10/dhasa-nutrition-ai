import React from 'react';
import {
  LayoutDashboard,
  Camera,
  UtensilsCrossed,
  Sparkles,
  CalendarDays,
  Scale,
  ShoppingCart,
  Bookmark,
  Activity,
  Bot,
  Settings,
  Flame,
  ChefHat
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
  const navSections = [
    {
      title: 'Core Tracking',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'scanner', label: 'DHASA Food Scanner', icon: Camera, badge: 'AI Vision' },
        { id: 'tracker', label: 'Daily Nutrition Log', icon: Activity },
      ],
    },
    {
      title: 'Protein & Recipes System',
      items: [
        { id: 'explorer', label: 'Protein & Recipe Explorer', icon: UtensilsCrossed, badge: '100 Foods' },
        { id: 'recipe_detail', label: 'Recipe Details', icon: ChefHat },
        { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles, badge: 'Smart' },
        { id: 'meal_planner', label: 'Budget Meal Planner', icon: CalendarDays },
        { id: 'cost_comparison', label: 'Protein & Cost Matrix', icon: Scale },
        { id: 'shopping_list', label: 'Grocery Shopping List', icon: ShoppingCart },
        { id: 'saved_recipes', label: 'Saved Favourites', icon: Bookmark },
      ],
    },
    {
      title: 'Fitness Intelligence',
      items: [
        { id: 'assistant', label: 'DHASA AI Assistant', icon: Bot },
        { id: 'profile', label: 'Dietary Targets & Goals', icon: Settings },
      ],
    },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Info Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800/60 border border-brand-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-400">
              <Flame className="w-4 h-4" />
              <span>Budget Fitness Rule</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Prioritize Soya chunks (₹2.3/10g protein) and Eggs (₹10/10g protein) to hit high targets under ₹150/day.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

