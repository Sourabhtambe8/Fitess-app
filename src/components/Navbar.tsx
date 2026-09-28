import React from 'react';
import { Dumbbell, Calendar, BarChart3, Utensils, Flame, Sparkles, Bell } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'plan' | 'progress' | 'nutrition';
  setCurrentTab: (tab: 'home' | 'plan' | 'progress' | 'nutrition') => void;
  userProfile: UserProfile;
  onStartTodayWorkout: () => void;
  activeWorkoutRunning: boolean;
  onOpenActiveWorkout: () => void;
  onOpenReminderSettings: () => void;
  reminderEnabled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userProfile,
  onStartTodayWorkout,
  activeWorkoutRunning,
  onOpenActiveWorkout,
  onOpenReminderSettings,
  reminderEnabled,
}) => {
  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-coral flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-lg">FORM</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Hybrid
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Strength • Posture • Nutrition</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeWorkoutRunning ? (
              <button
                onClick={onOpenActiveWorkout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-coral text-white text-xs font-semibold animate-pulse shadow-lg shadow-accent-coral/30"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Live Workout</span>
              </button>
            ) : (
              <button
                onClick={onStartTodayWorkout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-md shadow-brand-600/30"
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Start Workout</span>
              </button>
            )}

            {/* Reminder Bell Button */}
            <button
              onClick={onOpenReminderSettings}
              className="relative p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              title="Daily Workout Reminders"
            >
              <Bell className="w-4 h-4" />
              {reminderEnabled && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-400 ring-2 ring-slate-900" />
              )}
            </button>

            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-full px-2.5 py-1">
              <div className="w-6 h-6 rounded-full bg-brand-700 text-brand-100 flex items-center justify-center text-xs font-bold">
                {userProfile.name.charAt(0)}
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-200 leading-none">{userProfile.name}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{userProfile.weightKg} kg • Wk {userProfile.programWeek}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile / Tablet */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-1.5">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              currentTab === 'home'
                ? 'text-brand-400 font-semibold bg-brand-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Today</span>
          </button>

          <button
            onClick={() => setCurrentTab('plan')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              currentTab === 'plan'
                ? 'text-brand-400 font-semibold bg-brand-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Plan</span>
          </button>

          <button
            onClick={() => setCurrentTab('progress')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              currentTab === 'progress'
                ? 'text-brand-400 font-semibold bg-brand-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Progress</span>
          </button>

          <button
            onClick={() => setCurrentTab('nutrition')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              currentTab === 'nutrition'
                ? 'text-brand-400 font-semibold bg-brand-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Utensils className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Nutrition</span>
          </button>
        </div>
      </nav>
    </>
  );
};
