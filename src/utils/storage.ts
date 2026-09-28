import { 
  WorkoutDay, 
  UserProfile, 
  CompletedWorkoutSession, 
  DailyNutrition, 
  WeightEntry, 
  PostureHabitItem 
} from '../types';
import { 
  DEFAULT_WORKOUT_PLAN, 
  DEFAULT_USER_PROFILE, 
  DEFAULT_POSTURE_HABITS, 
  SAMPLE_HISTORICAL_SESSIONS, 
  INITIAL_WEIGHT_LOGS 
} from '../data/defaultPlan';
import { ReminderSettings, DEFAULT_REMINDER_SETTINGS } from './notifications';

const KEYS = {
  PLAN: 'form_workout_plan_v1',
  PROFILE: 'form_user_profile_v1',
  HISTORY: 'form_workout_history_v1',
  NUTRITION_PREFIX: 'form_nutrition_',
  WEIGHT_LOGS: 'form_weight_logs_v1',
  HABITS: 'form_posture_habits_v1',
  REMINDERS: 'form_reminder_settings_v1',
};

export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Workout Plan
export function loadWorkoutPlan(): WorkoutDay[] {
  try {
    const raw = localStorage.getItem(KEYS.PLAN);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading plan from storage', e);
  }
  return DEFAULT_WORKOUT_PLAN;
}

export function saveWorkoutPlan(plan: WorkoutDay[]) {
  try {
    localStorage.setItem(KEYS.PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Error saving plan to storage', e);
  }
}

export function resetWorkoutPlanToDefault(): WorkoutDay[] {
  try {
    localStorage.removeItem(KEYS.PLAN);
  } catch (e) {
    // ignore
  }
  return DEFAULT_WORKOUT_PLAN;
}

// User Profile
export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading profile', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile) {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile', e);
  }
}

// Workout History
export function loadWorkoutHistory(): CompletedWorkoutSession[] {
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading history', e);
  }
  return SAMPLE_HISTORICAL_SESSIONS;
}

export function saveWorkoutSession(session: CompletedWorkoutSession): CompletedWorkoutSession[] {
  const current = loadWorkoutHistory();
  const updated = [session, ...current];
  try {
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving session', e);
  }
  return updated;
}

// Nutrition for specific date
export function loadDailyNutrition(dateStr: string = getTodayDateStr()): DailyNutrition {
  try {
    const raw = localStorage.getItem(KEYS.NUTRITION_PREFIX + dateStr);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading nutrition', e);
  }
  
  // Default values based on 60kg body weight & Sourabh's target plan (95-120g protein)
  return {
    dateStr,
    targetCalories: 2150,
    targetProtein: 110,
    targetCarbs: 240,
    targetFat: 55,
    waterMl: 1250,
    targetWaterMl: 3000,
    meals: [
      {
        id: 'init-m-1',
        mealType: 'Breakfast',
        foodName: 'Rolled Oats with Water / Milk',
        serving: '50g oats dry',
        calories: 190,
        protein: 6.5,
        carbs: 34,
        fat: 3.5,
        timestamp: Date.now() - 4 * 60 * 60 * 1000,
      },
      {
        id: 'init-m-2',
        mealType: 'Breakfast',
        foodName: 'Boiled Whole Eggs (2 eggs)',
        serving: '2 large eggs',
        calories: 144,
        protein: 12.6,
        carbs: 0.8,
        fat: 9.8,
        timestamp: Date.now() - 4 * 60 * 60 * 1000,
      },
      {
        id: 'init-m-3',
        mealType: 'Lunch',
        foodName: 'Wheat Roti / Chapati (Without Ghee)',
        serving: '2 rotis',
        calories: 170,
        protein: 6.2,
        carbs: 35,
        fat: 1.0,
        timestamp: Date.now() - 1 * 60 * 60 * 1000,
      },
      {
        id: 'init-m-4',
        mealType: 'Lunch',
        foodName: 'Yellow Moong / Toor Dal (Cooked)',
        serving: '1 large bowl',
        calories: 180,
        protein: 11.0,
        carbs: 28,
        fat: 2.5,
        timestamp: Date.now() - 1 * 60 * 60 * 1000,
      },
      {
        id: 'init-m-5',
        mealType: 'Lunch',
        foodName: 'Raw Paneer (Cottage Cheese)',
        serving: '80g',
        calories: 212,
        protein: 14.6,
        carbs: 2.8,
        fat: 16.6,
        timestamp: Date.now() - 1 * 60 * 60 * 1000,
      }
    ]
  };
}

export function saveDailyNutrition(nutrition: DailyNutrition) {
  try {
    localStorage.setItem(KEYS.NUTRITION_PREFIX + nutrition.dateStr, JSON.stringify(nutrition));
  } catch (e) {
    console.error('Error saving nutrition', e);
  }
}

// Weight Entries
export function loadWeightLogs(): WeightEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.WEIGHT_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading weight logs', e);
  }
  return INITIAL_WEIGHT_LOGS;
}

export function saveWeightLogs(logs: WeightEntry[]) {
  try {
    localStorage.setItem(KEYS.WEIGHT_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving weight logs', e);
  }
}

// Habits
export function loadPostureHabits(): PostureHabitItem[] {
  try {
    const raw = localStorage.getItem(KEYS.HABITS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading habits', e);
  }
  return DEFAULT_POSTURE_HABITS;
}

export function savePostureHabits(habits: PostureHabitItem[]) {
  try {
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
  } catch (e) {
    console.error('Error saving habits', e);
  }
}

// Workout Reminders
export function loadReminderSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(KEYS.REMINDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading reminder settings', e);
  }
  return DEFAULT_REMINDER_SETTINGS;
}

export function saveReminderSettings(settings: ReminderSettings) {
  try {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving reminder settings', e);
  }
}
