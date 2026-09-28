import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeTab } from './components/HomeTab';
import { PlanTab } from './components/PlanTab';
import { ProgressTab } from './components/ProgressTab';
import { NutritionTab } from './components/NutritionTab';
import { WorkoutActiveModal } from './components/WorkoutActiveModal';
import { ReminderSettingsModal } from './components/ReminderSettingsModal';
import { NotificationToast } from './components/NotificationToast';
import { 
  WorkoutDay, 
  UserProfile, 
  DailyNutrition, 
  PostureHabitItem, 
  WeightEntry, 
  CompletedWorkoutSession 
} from './types';
import { 
  loadWorkoutPlan, 
  saveWorkoutPlan, 
  resetWorkoutPlanToDefault,
  loadUserProfile, 
  saveUserProfile,
  loadDailyNutrition, 
  saveDailyNutrition, 
  loadPostureHabits, 
  savePostureHabits, 
  loadWeightLogs, 
  saveWeightLogs, 
  loadWorkoutHistory, 
  saveWorkoutSession,
  loadReminderSettings,
  saveReminderSettings
} from './utils/storage';
import { 
  ReminderSettings, 
  sendLocalNotification 
} from './utils/notifications';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'plan' | 'progress' | 'nutrition'>('home');
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>(loadWorkoutPlan);
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile);
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition>(loadDailyNutrition);
  const [postureHabits, setPostureHabits] = useState<PostureHabitItem[]>(loadPostureHabits);
  const [weightLogs, setWeightLogs] = useState<WeightEntry[]>(loadWeightLogs);
  const [sessions, setSessions] = useState<CompletedWorkoutSession[]>(loadWorkoutHistory);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(loadReminderSettings);

  // Active workout state
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<WorkoutDay | null>(null);

  // Reminder modal & toast state
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<{ title: string; body: string } | null>(null);

  // Determine current day from weekday (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const getTodayDayOfWeekIndex = (): number => {
    const day = new Date().getDay();
    // Monday = 0, Tuesday = 1, ... Sunday = 6
    return day === 0 ? 6 : day - 1;
  };

  const [selectedDay, setSelectedDay] = useState<WorkoutDay>(() => {
    const idx = getTodayDayOfWeekIndex();
    return workoutPlan[idx] || workoutPlan[0];
  });

  // Keep selectedDay updated if workoutPlan changes
  useEffect(() => {
    const found = workoutPlan.find(d => d.id === selectedDay.id);
    if (found) {
      setSelectedDay(found);
    }
  }, [workoutPlan, selectedDay.id]);

  // Scheduled reminder background checker
  useEffect(() => {
    const checkReminder = () => {
      if (!reminderSettings.enabled) return;

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      // Check if reminder is due and hasn't been fired today
      if (reminderSettings.lastNotifiedDate !== todayStr && currentTimeStr >= reminderSettings.time) {
        sendLocalNotification(selectedDay, (title, body) => {
          setActiveToast({ title, body });
        });

        const updatedSettings: ReminderSettings = {
          ...reminderSettings,
          lastNotifiedDate: todayStr
        };
        setReminderSettings(updatedSettings);
        saveReminderSettings(updatedSettings);
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 30000);
    return () => clearInterval(interval);
  }, [reminderSettings, selectedDay]);

  // Auto-dismiss toast after 8 seconds
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  // Plan actions
  const handleUpdatePlan = (newPlan: WorkoutDay[]) => {
    setWorkoutPlan(newPlan);
    saveWorkoutPlan(newPlan);
  };

  const handleResetPlan = () => {
    const defaults = resetWorkoutPlanToDefault();
    setWorkoutPlan(defaults);
    saveWorkoutPlan(defaults);
  };

  // Workout actions
  const handleStartWorkout = (day: WorkoutDay) => {
    setActiveWorkoutDay(day);
  };

  const handleFinishWorkout = (session: CompletedWorkoutSession) => {
    const updated = saveWorkoutSession(session);
    setSessions(updated);
    setActiveWorkoutDay(null);
    setCurrentTab('progress');
  };

  // Reminder settings action
  const handleSaveReminderSettings = (settings: ReminderSettings) => {
    setReminderSettings(settings);
    saveReminderSettings(settings);
  };

  // Nutrition actions
  const handleUpdateNutrition = (updated: DailyNutrition) => {
    setDailyNutrition(updated);
    saveDailyNutrition(updated);
  };

  const handleAddWater = (amountMl: number) => {
    const updated: DailyNutrition = {
      ...dailyNutrition,
      waterMl: Math.max(0, dailyNutrition.waterMl + amountMl)
    };
    handleUpdateNutrition(updated);
  };

  const handleResetWater = () => {
    const updated: DailyNutrition = {
      ...dailyNutrition,
      waterMl: 0
    };
    handleUpdateNutrition(updated);
  };

  // Habit action
  const handleToggleHabit = (habitId: string) => {
    const updated = postureHabits.map(h => 
      h.id === habitId ? { ...h, isCompleted: !h.isCompleted } : h
    );
    setPostureHabits(updated);
    savePostureHabits(updated);
  };

  // Weight action
  const handleAddWeightLog = (weightKg: number, note?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: WeightEntry = {
      id: `w-${Date.now()}`,
      dateStr: todayStr,
      weightKg,
      note
    };
    const updated = [...weightLogs, newEntry];
    setWeightLogs(updated);
    saveWeightLogs(updated);

    const updatedProfile = { ...userProfile, weightKg };
    setUserProfile(updatedProfile);
    saveUserProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Toast Alert */}
      {activeToast && (
        <NotificationToast
          title={activeToast.title}
          body={activeToast.body}
          onStartWorkout={() => {
            handleStartWorkout(selectedDay);
            setActiveToast(null);
          }}
          onDismiss={() => setActiveToast(null)}
        />
      )}

      {/* Top and Bottom Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userProfile={userProfile}
        onStartTodayWorkout={() => handleStartWorkout(selectedDay)}
        activeWorkoutRunning={activeWorkoutDay !== null}
        onOpenActiveWorkout={() => {
          if (activeWorkoutDay) {
            // Already active
          }
        }}
        onOpenReminderSettings={() => setShowReminderModal(true)}
        reminderEnabled={reminderSettings.enabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-3">
        {currentTab === 'home' && (
          <HomeTab
            workoutPlan={workoutPlan}
            currentDay={selectedDay}
            onSelectDay={setSelectedDay}
            onStartWorkout={handleStartWorkout}
            dailyNutrition={dailyNutrition}
            onQuickAddWater={() => handleAddWater(250)}
            postureHabits={postureHabits}
            onToggleHabit={handleToggleHabit}
            recentSessions={sessions}
            onNavigateToPlan={() => setCurrentTab('plan')}
            onNavigateToNutrition={() => setCurrentTab('nutrition')}
            onNavigateToProgress={() => setCurrentTab('progress')}
            onOpenReminderSettings={() => setShowReminderModal(true)}
            reminderSettings={reminderSettings}
          />
        )}

        {currentTab === 'plan' && (
          <PlanTab
            workoutPlan={workoutPlan}
            onUpdatePlan={handleUpdatePlan}
            onResetPlan={handleResetPlan}
            onStartWorkout={handleStartWorkout}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressTab
            sessions={sessions}
            weightLogs={weightLogs}
            onAddWeightLog={handleAddWeightLog}
            userProfile={userProfile}
          />
        )}

        {currentTab === 'nutrition' && (
          <NutritionTab
            dailyNutrition={dailyNutrition}
            onUpdateNutrition={handleUpdateNutrition}
            onAddWater={handleAddWater}
            onResetWater={handleResetWater}
          />
        )}
      </main>

      {/* Active Workout Modal */}
      {activeWorkoutDay && (
        <WorkoutActiveModal
          day={activeWorkoutDay}
          onFinishWorkout={handleFinishWorkout}
          onClose={() => setActiveWorkoutDay(null)}
        />
      )}

      {/* Reminder Settings Modal */}
      {showReminderModal && (
        <ReminderSettingsModal
          currentDay={selectedDay}
          settings={reminderSettings}
          onSaveSettings={handleSaveReminderSettings}
          onClose={() => setShowReminderModal(false)}
          onTriggerInAppToast={(title, body) => setActiveToast({ title, body })}
        />
      )}
    </div>
  );
};

export default App;
