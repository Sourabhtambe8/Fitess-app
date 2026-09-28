import React, { useState } from 'react';
import { 
  Utensils, 
  Droplet, 
  Plus, 
  Trash2, 
  Settings2, 
  Info, 
  Activity, 
  Check, 
  Flame,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { DailyNutrition, LoggedMeal } from '../types';
import { AddFoodModal } from './AddFoodModal';

interface NutritionTabProps {
  dailyNutrition: DailyNutrition;
  onUpdateNutrition: (updated: DailyNutrition) => void;
  onAddWater: (amountMl: number) => void;
  onResetWater: () => void;
}

export const NutritionTab: React.FC<NutritionTabProps> = ({
  dailyNutrition,
  onUpdateNutrition,
  onAddWater,
  onResetWater,
}) => {
  const [activeAddModal, setActiveAddModal] = useState<boolean>(false);
  const [selectedMealType, setSelectedMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');
  const [showTargetModal, setShowTargetModal] = useState<boolean>(false);

  // Edit targets state
  const [targetCals, setTargetCals] = useState<number>(dailyNutrition.targetCalories);
  const [targetProt, setTargetProt] = useState<number>(dailyNutrition.targetProtein);
  const [targetCarb, setTargetCarb] = useState<number>(dailyNutrition.targetCarbs);
  const [targetFatVal, setTargetFatVal] = useState<number>(dailyNutrition.targetFat);

  // Calculations
  const totalCalories = dailyNutrition.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = dailyNutrition.meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = dailyNutrition.meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = dailyNutrition.meals.reduce((sum, m) => sum + m.fat, 0);

  const caloriesRemaining = Math.max(0, dailyNutrition.targetCalories - totalCalories);
  const calPercent = Math.min(100, Math.round((totalCalories / dailyNutrition.targetCalories) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProtein / dailyNutrition.targetProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / dailyNutrition.targetCarbs) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / dailyNutrition.targetFat) * 100));
  const waterPercent = Math.min(100, Math.round((dailyNutrition.waterMl / dailyNutrition.targetWaterMl) * 100));

  const mealCategories: ('Breakfast' | 'Lunch' | 'Dinner' | 'Snacks')[] = [
    'Breakfast', 'Lunch', 'Dinner', 'Snacks'
  ];

  const handleAddMealItem = (mealData: Omit<LoggedMeal, 'id' | 'timestamp'>) => {
    const newMeal: LoggedMeal = {
      ...mealData,
      id: `meal-${Date.now()}`,
      timestamp: Date.now(),
    };
    onUpdateNutrition({
      ...dailyNutrition,
      meals: [...dailyNutrition.meals, newMeal]
    });
  };

  const handleDeleteMealItem = (mealId: string) => {
    onUpdateNutrition({
      ...dailyNutrition,
      meals: dailyNutrition.meals.filter(m => m.id !== mealId)
    });
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateNutrition({
      ...dailyNutrition,
      targetCalories: targetCals,
      targetProtein: targetProt,
      targetCarbs: targetCarb,
      targetFat: targetFatVal,
    });
    setShowTargetModal(false);
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Nutritional Tracking
          </h1>
          <p className="text-xs text-slate-400">
            Fuel for muscle growth, strength progression, and recovery.
          </p>
        </div>
        <button
          onClick={() => setShowTargetModal(true)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          title="Customize macro goals"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Calorie & Macro Dashboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Today's Calorie Balance
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-white font-mono">
                {totalCalories}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / {dailyNutrition.targetCalories} kcal
              </span>
            </div>
            <p className="text-xs text-brand-300 font-medium mt-1">
              {caloriesRemaining > 0 ? `${caloriesRemaining} kcal remaining for growth` : 'Calorie target reached!'}
            </p>
          </div>

          <div className="w-full sm:w-48 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Goal Strategy</span>
            <p className="text-xs font-extrabold text-emerald-400 mt-0.5">Lean Muscle Building</p>
            <p className="text-[10px] text-slate-400">Sourabh 60 kg baseline</p>
          </div>
        </div>

        {/* Macro Progress Bars */}
        <div className="grid grid-cols-3 gap-3">
          {/* Protein */}
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-emerald-400">Protein</span>
              <span className="font-mono text-white">{totalProtein.toFixed(0)}g</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Goal: {dailyNutrition.targetProtein}g</p>
          </div>

          {/* Carbs */}
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-amber-400">Carbs</span>
              <span className="font-mono text-white">{totalCarbs.toFixed(0)}g</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Goal: {dailyNutrition.targetCarbs}g</p>
          </div>

          {/* Fats */}
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-brand-300">Fats</span>
              <span className="font-mono text-white">{totalFat.toFixed(0)}g</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-brand-500 h-full rounded-full transition-all"
                style={{ width: `${fatPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Goal: {dailyNutrition.targetFat}g</p>
          </div>
        </div>

        {/* Muscle Building Rule from user's plan */}
        <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center gap-2 text-xs text-slate-300">
          <Info className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Training Rule:</strong> For 60kg body weight, aim for <strong>95–120g protein/day</strong> with a protein source at each meal!
          </span>
        </div>
      </div>

      {/* Hydration Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Daily Water Intake</h3>
              <p className="text-xs text-slate-400 font-mono">
                {dailyNutrition.waterMl} ml / {dailyNutrition.targetWaterMl} ml ({waterPercent}%)
              </p>
            </div>
          </div>

          <button
            onClick={onResetWater}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-300"
          >
            Reset
          </button>
        </div>

        {/* Water Level Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${waterPercent}%` }}
          />
        </div>

        {/* Quick Water Stepper Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddWater(250)}
            className="flex-1 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+250 ml (1 Glass)</span>
          </button>
          <button
            onClick={() => onAddWater(500)}
            className="flex-1 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+500 ml (1 Bottle)</span>
          </button>
        </div>
      </div>

      {/* Meals Log Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Utensils className="w-4 h-4 text-brand-400" />
            <span>Today's Meals</span>
          </h2>
          <button
            onClick={() => {
              setSelectedMealType('Breakfast');
              setActiveAddModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Food</span>
          </button>
        </div>

        {mealCategories.map((type) => {
          const mealsOfType = dailyNutrition.meals.filter((m) => m.mealType === type);
          const calsInMeal = mealsOfType.reduce((sum, m) => sum + m.calories, 0);
          const protInMeal = mealsOfType.reduce((sum, m) => sum + m.protein, 0);

          return (
            <div key={type} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white">{type}</h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {calsInMeal} kcal • <strong className="text-emerald-400">{protInMeal.toFixed(1)}g</strong> protein
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedMealType(type);
                    setActiveAddModal(true);
                  }}
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-0.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {mealsOfType.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-1">No items logged yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {mealsOfType.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-slate-200">{item.foodName}</p>
                        <p className="text-[10px] text-slate-400">
                          {item.serving} • C: {item.carbs}g • F: {item.fat}g
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-mono font-bold text-white text-xs">{item.calories} kcal</p>
                          <p className="font-mono font-bold text-emerald-400 text-[11px]">{item.protein}g protein</p>
                        </div>
                        <button
                          onClick={() => handleDeleteMealItem(item.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Remove item"
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

      {/* Add Food Modal */}
      {activeAddModal && (
        <AddFoodModal
          initialMealType={selectedMealType}
          onAddMeal={handleAddMealItem}
          onClose={() => setActiveAddModal(false)}
        />
      )}

      {/* Edit Targets Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-brand-400" />
                <span>Customize Daily Targets</span>
              </h3>
              <button onClick={() => setShowTargetModal(false)} className="text-slate-400 hover:text-white">
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSaveTargets} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Daily Calorie Target (kcal)
                </label>
                <input
                  type="number"
                  required
                  value={targetCals}
                  onChange={(e) => setTargetCals(parseInt(e.target.value) || 2000)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-400 mb-1">
                  Daily Protein Target (grams)
                </label>
                <input
                  type="number"
                  required
                  value={targetProt}
                  onChange={(e) => setTargetProt(parseInt(e.target.value) || 110)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-300 font-mono font-bold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={targetCarb}
                    onChange={(e) => setTargetCarb(parseInt(e.target.value) || 240)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    value={targetFatVal}
                    onChange={(e) => setTargetFatVal(parseInt(e.target.value) || 55)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTargetModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-md shadow-brand-600/30"
                >
                  Save Targets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
