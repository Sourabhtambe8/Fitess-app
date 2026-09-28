import React from 'react';
import { 
  Play, 
  Dumbbell, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Droplet, 
  Plus, 
  Activity, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  Info,
  Bell
} from 'lucide-react';
import { 
  WorkoutDay, 
  DailyNutrition, 
  PostureHabitItem, 
  CompletedWorkoutSession 
} from '../types';
import { ReminderSettings } from '../utils/notifications';

interface HomeTabProps {
  workoutPlan: WorkoutDay[];
  currentDay: WorkoutDay;
  onSelectDay: (day: WorkoutDay) => void;
  onStartWorkout: (day: WorkoutDay) => void;
  dailyNutrition: DailyNutrition;
  onQuickAddWater: () => void;
  postureHabits: PostureHabitItem[];
  onToggleHabit: (habitId: string) => void;
  recentSessions: CompletedWorkoutSession[];
  onNavigateToPlan: () => void;
  onNavigateToNutrition: () => void;
  onNavigateToProgress: () => void;
  onOpenReminderSettings: () => void;
  reminderSettings: ReminderSettings;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  workoutPlan,
  currentDay,
  onSelectDay,
  onStartWorkout,
  dailyNutrition,
  onQuickAddWater,
  postureHabits,
  onToggleHabit,
  recentSessions,
  onNavigateToPlan,
  onNavigateToNutrition,
  onNavigateToProgress,
  onOpenReminderSettings,
  reminderSettings,
}) => {
  // Nutrition totals
  const totalCalories = dailyNutrition.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = dailyNutrition.meals.reduce((sum, m) => sum + m.protein, 0);
  const caloriesRemaining = Math.max(0, dailyNutrition.targetCalories - totalCalories);
  const proteinPercent = Math.min(100, Math.round((totalProtein / dailyNutrition.targetProtein) * 100));

  // Habits completed
  const completedHabitsCount = postureHabits.filter(h => h.isCompleted).length;

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Welcome & Day Banner */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-400">
            {currentDay.dayOfWeek} Routine
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Today's Training
          </h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-300">
          <Flame className="w-3.5 h-3.5 text-accent-coral" />
          <span>{recentSessions.length} Workouts Done</span>
        </div>
      </div>

      {/* Week Day Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {workoutPlan.map((d) => {
          const isSelected = d.id === currentDay.id;
          const isRest = d.isRestDay;
          return (
            <button
              key={d.id}
              onClick={() => onSelectDay(d)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-left transition-all border ${
                isSelected
                  ? 'bg-brand-600 border-brand-400 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                {d.dayOfWeek.slice(0, 3)}
              </p>
              <p className="text-xs font-extrabold whitespace-nowrap">
                {isRest ? 'Rest' : d.code}
              </p>
            </button>
          );
        })}
      </div>

      {/* Daily Workout Reminder Banner */}
      <div 
        onClick={onOpenReminderSettings}
        className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all shadow-md group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            reminderSettings.enabled 
              ? 'bg-brand-500/10 text-brand-400 group-hover:bg-brand-500/20' 
              : 'bg-slate-800 text-slate-500'
          } transition-colors`}>
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                {reminderSettings.enabled 
                  ? `Daily Reminder active at ${reminderSettings.time}` 
                  : 'Workout Reminders disabled'}
              </p>
              {reminderSettings.enabled && (
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {reminderSettings.enabled 
                ? `Personalized alert for ${currentDay.title}` 
                : 'Tap to configure reminder time & sound alerts'}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="text-xs font-bold text-brand-400 group-hover:text-brand-300 flex items-center gap-1"
        >
          <span>{reminderSettings.enabled ? 'Settings' : 'Enable'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Workout Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 border border-brand-500/30 p-5 shadow-xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-black tracking-wider uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {currentDay.code}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {currentDay.durationMinutes}
              </span>
            </div>
            <h2 className="text-xl font-black text-white leading-tight">
              {currentDay.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {currentDay.subtitle}
            </p>
          </div>
        </div>

        {/* Exercises Preview */}
        {!currentDay.isRestDay && (
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">
                {currentDay.exercises.length} Exercises Planned
              </span>
              <button 
                onClick={onNavigateToPlan}
                className="text-brand-400 hover:text-brand-300 flex items-center text-[11px] font-medium"
              >
                Customize Plan <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
            
            <div className="space-y-1.5">
              {currentDay.exercises.slice(0, 4).map((ex, idx) => (
                <div 
                  key={ex.id}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-800/50 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-200 truncate max-w-[180px] sm:max-w-xs">
                      {ex.name}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {ex.targetSets} × {ex.targetReps}
                  </span>
                </div>
              ))}
              {currentDay.exercises.length > 4 && (
                <p className="text-[11px] text-slate-500 pl-2">
                  +{currentDay.exercises.length - 4} more exercises (including core & posture)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 flex gap-2">
          {currentDay.isRestDay ? (
            <div className="w-full py-3 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <p className="text-xs text-emerald-400 font-semibold">Active Recovery Day</p>
              <p className="text-[11px] text-slate-400">Focus on protein, 8hr sleep, and mobility habit below.</p>
            </div>
          ) : (
            <button
              onClick={() => onStartWorkout(currentDay)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-coral hover:from-brand-500 hover:to-accent-coral text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Workout Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Daily Nutrition & Hydration Glance */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Daily Fuel & Macros</h3>
              <p className="text-[11px] text-slate-400">Target for 60kg body weight</p>
            </div>
          </div>
          <button
            onClick={onNavigateToNutrition}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center"
          >
            Log Food <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Calories Progress */}
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Calories</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-black text-white">{totalCalories}</span>
              <span className="text-[11px] text-slate-400">/ {dailyNutrition.targetCalories} kcal</span>
            </div>
            <div className="w-full bg-slate-700/60 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-brand-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalCalories / dailyNutrition.targetCalories) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">{caloriesRemaining} kcal remaining</p>
          </div>

          {/* Protein Progress */}
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Protein Goal</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-black text-emerald-400">{totalProtein}g</span>
              <span className="text-[11px] text-slate-400">/ {dailyNutrition.targetProtein}g</span>
            </div>
            <div className="w-full bg-slate-700/60 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-emerald-400/90 mt-1 font-medium">{proteinPercent}% achieved</p>
          </div>
        </div>

        {/* Water Quick Log Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300">
              Hydration: <strong className="text-cyan-300 font-bold">{dailyNutrition.waterMl} ml</strong> / {dailyNutrition.targetWaterMl} ml
            </span>
          </div>
          <button
            onClick={onQuickAddWater}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-all active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>+250 ml</span>
          </button>
        </div>
      </div>

      {/* Daily Posture Habit (From Plan PDF) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-amber/10 text-accent-amber flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Daily 5-Min Posture Habit</h3>
              <p className="text-[11px] text-slate-400">Desk reset from your training plan</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
            {completedHabitsCount}/{postureHabits.length} Done
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-3">
          Perform once during workday to prevent forward-head posture and pelvic tilt:
        </p>

        <div className="space-y-2">
          {postureHabits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => onToggleHabit(habit.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                habit.isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {habit.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
                <div>
                  <p className={`text-xs font-semibold ${habit.isCompleted ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                    {habit.title}
                  </p>
                  <p className="text-[10px] text-slate-500">{habit.detail}</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                {habit.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Training Rules Golden Tips Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs space-y-1">
        <div className="flex items-center gap-1.5 text-brand-400 font-bold mb-1">
          <Info className="w-4 h-4" />
          <span>Training Rule of Thumb:</span>
        </div>
        <p className="text-[11px] text-slate-300">
          • <strong>Effort:</strong> Start at RPE 6/10. Finish every set with 2–4 clean reps still in reserve.
        </p>
        <p className="text-[11px] text-slate-300">
          • <strong>Progression:</strong> When all sets reach the top rep range cleanly, add the smallest weight next time.
        </p>
      </div>
    </div>
  );
};
