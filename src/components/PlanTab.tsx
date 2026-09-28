import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Edit3, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { WorkoutDay, Exercise } from '../types';
import { EditExerciseModal } from './EditExerciseModal';

interface PlanTabProps {
  workoutPlan: WorkoutDay[];
  onUpdatePlan: (updatedPlan: WorkoutDay[]) => void;
  onResetPlan: () => void;
  onStartWorkout: (day: WorkoutDay) => void;
}

export const PlanTab: React.FC<PlanTabProps> = ({
  workoutPlan,
  onUpdatePlan,
  onResetPlan,
  onStartWorkout,
}) => {
  const [selectedDayId, setSelectedDayId] = useState<string>(workoutPlan[0]?.id || 'day-1');
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  const selectedDay = workoutPlan.find(d => d.id === selectedDayId) || workoutPlan[0];

  // Helper to update a specific day in the plan
  const updateCurrentDay = (modifier: (day: WorkoutDay) => WorkoutDay) => {
    const updated = workoutPlan.map(d => d.id === selectedDay.id ? modifier(d) : d);
    onUpdatePlan(updated);
  };

  // Reorder exercise up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    updateCurrentDay(day => {
      const list = [...day.exercises];
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      return { ...day, exercises: list };
    });
  };

  // Reorder exercise down
  const handleMoveDown = (index: number) => {
    if (index === selectedDay.exercises.length - 1) return;
    updateCurrentDay(day => {
      const list = [...day.exercises];
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      return { ...day, exercises: list };
    });
  };

  // Delete exercise
  const handleDeleteExercise = (exId: string) => {
    updateCurrentDay(day => ({
      ...day,
      exercises: day.exercises.filter(ex => ex.id !== exId)
    }));
    setEditingExercise(null);
  };

  // Save edited or new exercise
  const handleSaveExercise = (exercise: Exercise) => {
    updateCurrentDay(day => {
      const exists = day.exercises.some(ex => ex.id === exercise.id);
      if (exists) {
        return {
          ...day,
          exercises: day.exercises.map(ex => ex.id === exercise.id ? exercise : ex)
        };
      } else {
        return {
          ...day,
          exercises: [...day.exercises, exercise]
        };
      }
    });
    setEditingExercise(null);
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Header and Reset Control */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Hybrid Workout Plan
          </h1>
          <p className="text-xs text-slate-400">
            Customizable 4-Week Strength, Running & Posture Architecture
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset entire plan to the default Sourabh 4-Week Hybrid Plan?')) {
              onResetPlan();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          title="Reset to default program"
        >
          <RotateCcw className="w-3.5 h-3.5 text-brand-400" />
          <span className="hidden sm:inline">Reset Default</span>
        </button>
      </div>

      {/* Day Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {workoutPlan.map((d) => {
          const isSelected = d.id === selectedDay.id;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDayId(d.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-left transition-all border ${
                isSelected
                  ? 'bg-brand-600 border-brand-400 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                {d.dayOfWeek}
              </p>
              <p className="text-xs font-extrabold whitespace-nowrap">
                {d.isRestDay ? 'Rest & Recovery' : d.code}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Day Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {selectedDay.code} • {selectedDay.dayOfWeek}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {selectedDay.durationMinutes}
              </span>
            </div>
            <h2 className="text-xl font-black text-white">{selectedDay.title}</h2>
            <p className="text-xs text-slate-400">{selectedDay.subtitle}</p>
          </div>

          {!selectedDay.isRestDay && (
            <button
              onClick={() => onStartWorkout(selectedDay)}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-coral hover:from-brand-500 hover:to-accent-coral text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Workout</span>
            </button>
          )}
        </div>

        {/* Warmup Section */}
        {selectedDay.warmup.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
              <span>1. Warm Up & Mobility</span>
              <span className="text-[10px] text-slate-500 font-normal">({selectedDay.warmup.length} drills)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedDay.warmup.map((w, idx) => (
                <div 
                  key={w.id} 
                  className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-800/40 border border-slate-800/80 text-xs"
                >
                  <span className="w-5 h-5 rounded-md bg-brand-500/20 text-brand-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-200">{w.name}</p>
                    <p className="text-[11px] font-mono text-brand-400">{w.prescription}</p>
                    {w.tip && <p className="text-[10px] text-slate-400 mt-0.5">{w.tip}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Workout Exercises & Customizer */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-coral flex items-center gap-1.5">
              <span>2. Main Workout Exercises</span>
              <span className="text-[10px] text-slate-500 font-normal">
                ({selectedDay.exercises.length} movements)
              </span>
            </h3>

            <button
              onClick={() => {
                setEditingExercise(null);
                setIsAddingNew(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/30 text-brand-300 text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Exercise</span>
            </button>
          </div>

          {selectedDay.exercises.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-slate-800/30 border border-dashed border-slate-800 text-slate-400 text-xs">
              <p>No exercises listed for this day.</p>
              <button
                onClick={() => setIsAddingNew(true)}
                className="mt-2 text-brand-400 font-semibold underline"
              >
                Add the first exercise
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedDay.exercises.map((ex, index) => (
                <div
                  key={ex.id}
                  className="group relative p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-extrabold text-white">{ex.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/80 text-slate-300">
                            {ex.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-slate-300 font-medium mt-1">
                          <span className="font-mono text-brand-300">
                            <strong>{ex.targetSets}</strong> sets × <strong>{ex.targetReps}</strong> reps
                          </span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">
                            Target: {ex.defaultWeightKg > 0 ? `${ex.defaultWeightKg} kg` : 'Bodyweight'}
                          </span>
                          <span>•</span>
                          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3" />
                            {ex.restSeconds}s rest
                          </span>
                        </div>

                        {ex.techniqueTip && (
                          <p className="text-[11px] text-slate-400 mt-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                            💡 <span className="font-medium">{ex.techniqueTip}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Reorder and Edit Action Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className="flex flex-col">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveUp(index)}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 transition-opacity"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === selectedDay.exercises.length - 1}
                          onClick={() => handleMoveDown(index)}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 transition-opacity"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => setEditingExercise(ex)}
                        className="p-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Exercise"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Core & Posture Section */}
        {selectedDay.corePosture.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              3. Core & Posture Stability
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedDay.corePosture.map((cp, idx) => (
                <div key={cp.id} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-200">{cp.name}</p>
                    <span className="font-mono text-emerald-400 font-bold text-[11px]">{cp.prescription}</span>
                  </div>
                  {cp.focus && <p className="text-[10px] text-slate-400 mt-0.5">Focus: {cp.focus}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cool Down */}
        {selectedDay.coolDown.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              4. Cool Down & Flexibility
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedDay.coolDown.map((cd) => (
                <div key={cd.id} className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-800 text-xs text-slate-300">
                  <span className="font-medium text-slate-200">{cd.name}</span>
                  <span className="text-cyan-400 font-mono text-[11px] ml-1.5">({cd.prescription})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Important Tips */}
        {selectedDay.importantTips.length > 0 && (
          <div className="p-3.5 rounded-xl bg-accent-amber/5 border border-accent-amber/20 text-xs text-slate-300 space-y-1">
            <p className="font-bold text-accent-amber flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Coaching Notes for {selectedDay.dayOfWeek}:</span>
            </p>
            {selectedDay.importantTips.map((tip, i) => (
              <p key={i} className="text-[11px] text-slate-300 pl-4 relative before:content-['✓'] before:absolute before:left-0 before:text-accent-amber">
                {tip}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Edit / Add Modal */}
      {(editingExercise || isAddingNew) && (
        <EditExerciseModal
          exercise={editingExercise}
          dayTitle={selectedDay.title}
          onSave={handleSaveExercise}
          onDelete={editingExercise ? handleDeleteExercise : undefined}
          onClose={() => {
            setEditingExercise(null);
            setIsAddingNew(false);
          }}
        />
      )}
    </div>
  );
};
