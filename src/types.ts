export type MuscleCategory = 
  | 'Chest' 
  | 'Back' 
  | 'Legs' 
  | 'Glutes' 
  | 'Shoulders' 
  | 'Arms' 
  | 'Core' 
  | 'Posture' 
  | 'Cardio' 
  | 'Mobility';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleCategory;
  targetSets: number;
  targetReps: string;
  defaultWeightKg: number;
  restSeconds: number;
  techniqueTip: string;
  targetsMuscle?: string;
}

export interface WarmupItem {
  id: string;
  name: string;
  prescription: string;
  tip?: string;
}

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  code: string; // e.g. "DAY 01"
  title: string;
  subtitle: string;
  durationMinutes: string;
  level: string;
  goal: string;
  isRestDay?: boolean;
  isCardioOrMobilityOnly?: boolean;
  warmup: WarmupItem[];
  exercises: Exercise[];
  corePosture: WarmupItem[];
  coolDown: WarmupItem[];
  importantTips: string[];
}

export interface ActiveSetLog {
  setNumber: number;
  weightKg: number;
  reps: number;
  isCompleted: boolean;
  prevWeightKg?: number;
  prevReps?: number;
}

export interface ActiveExerciseLog {
  exerciseId: string;
  exerciseName: string;
  category: MuscleCategory;
  restSeconds: number;
  techniqueTip: string;
  sets: ActiveSetLog[];
  notes?: string;
}

export interface CompletedWorkoutSession {
  id: string;
  dayId: string;
  dayTitle: string;
  timestamp: number;
  dateStr: string; // YYYY-MM-DD
  durationSeconds: number;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  exercises: ActiveExerciseLog[];
  notes?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Protein' | 'Dairy' | 'Carbs' | 'Snacks' | 'Meals' | 'Indian Staples';
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface LoggedMeal {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  foodName: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
}

export interface DailyNutrition {
  dateStr: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  waterMl: number;
  targetWaterMl: number;
  meals: LoggedMeal[];
}

export interface PostureHabitItem {
  id: string;
  title: string;
  count: string;
  detail: string;
  isCompleted: boolean;
}

export interface WeightEntry {
  id: string;
  dateStr: string;
  weightKg: number;
  note?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  height: string;
  weightKg: number;
  targetWeightKg: number;
  programWeek: number;
  totalWeeks: number;
}
