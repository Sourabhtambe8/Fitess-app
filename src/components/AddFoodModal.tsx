import React, { useState } from 'react';
import { X, Search, Plus, Utensils, Sparkles, Check } from 'lucide-react';
import { FoodItem, LoggedMeal } from '../types';
import { COMMON_FOODS } from '../data/foodLibrary';

interface AddFoodModalProps {
  initialMealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  onAddMeal: (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => void;
  onClose: () => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  initialMealType = 'Breakfast',
  onAddMeal,
  onClose,
}) => {
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>(initialMealType);
  const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Custom food fields
  const [customName, setCustomName] = useState('');
  const [customServing, setCustomServing] = useState('1 serving');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

  const categories = ['All', 'Protein', 'Dairy', 'Carbs', 'Indian Staples', 'Snacks'];

  const filteredFoods = COMMON_FOODS.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectPreset = (food: FoodItem) => {
    onAddMeal({
      mealType,
      foodName: food.name,
      serving: food.serving,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    });
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    onAddMeal({
      mealType,
      foodName: customName.trim(),
      serving: customServing.trim() || '1 serving',
      calories: Math.max(0, parseInt(customCalories) || 0),
      protein: Math.max(0, parseFloat(customProtein) || 0),
      carbs: Math.max(0, parseFloat(customCarbs) || 0),
      fat: Math.max(0, parseFloat(customFat) || 0),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>Log Food & Nutrition</span>
            </h2>
            <p className="text-xs text-slate-400">Track protein & calorie surplus</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Meal Type Selector */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/60">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Log to Meal:
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMealType(type)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  mealType === type
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Library vs Custom Food Tabs */}
          <div className="flex gap-2 mt-3 pt-2 border-t border-slate-800/60">
            <button
              onClick={() => setActiveTab('library')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'library'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Food Database
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'custom'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              + Custom Food
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'library' ? (
          <div className="flex-1 flex flex-col overflow-hidden p-4">
            {/* Search Input */}
            <div className="relative mb-2.5">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search eggs, paneer, oats, roti, chicken..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                    selectedCategory === cat
                      ? 'bg-brand-600 border-brand-400 text-white'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Food List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 mt-1">
              {filteredFoods.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <p>No foods matching "{searchQuery}".</p>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className="mt-2 text-emerald-400 font-bold underline"
                  >
                    Add custom food entry
                  </button>
                </div>
              ) : (
                filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => handleSelectPreset(food)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                          {food.name}
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                          {food.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{food.serving}</p>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <p className="text-xs font-black text-white font-mono">
                          {food.calories} <span className="text-[10px] font-normal text-slate-400">kcal</span>
                        </p>
                        <p className="text-[11px] font-bold text-emerald-400 font-mono">
                          {food.protein}g <span className="text-[10px] font-normal text-slate-400">protein</span>
                        </p>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Custom Food Form */
          <form onSubmit={handleCustomSubmit} className="p-4 space-y-3 overflow-y-auto flex-1">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Food Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sattu Drink or Whey Smoothie"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Serving Size
              </label>
              <input
                type="text"
                placeholder="e.g. 1 glass (300ml) or 1 bowl"
                value={customServing}
                onChange={(e) => setCustomServing(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Calories (kcal) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 250"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-400 mb-1">
                  Protein (grams) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  placeholder="e.g. 20"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-300 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Carbs (grams)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 30"
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Fat (grams)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 8"
                  value={customFat}
                  onChange={(e) => setCustomFat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md shadow-emerald-600/30"
              >
                Add to {mealType}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
