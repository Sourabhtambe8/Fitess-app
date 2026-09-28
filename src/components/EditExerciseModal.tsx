import React, { useState } from 'react';
import { X, Save, Trash2, Dumbbell, Clock, Target, Sparkles } from 'lucide-react';
import { Exercise, MuscleCategory } from '../types';

interface EditExerciseModalProps {
  exercise: Exercise | null; // null if creating a new one
  dayTitle: string;
  onSave: (updated: Exercise) => void;
  onDelete?: (exerciseId: string) => void;
  onClose: () => void;
}

const CATEGORIES: MuscleCategory[] = [
  'Chest', 'Back', 'Legs', 'Glutes', 'Shoulders', 'Arms', 'Core', 'Posture', 'Cardio', 'Mobility'
];

export const EditExerciseModal: React.FC<EditExerciseModalProps> = ({
  exercise,
  dayTitle,
  onSave,
  onDelete,
  onClose,
}) => {
  const [name, setName] = useState(exercise?.name || '');
  const [category, setCategory] = useState<MuscleCategory>(exercise?.category || 'Legs');
  const [targetSets, setTargetSets] = useState(exercise?.targetSets || 3);
  const [targetReps, setTargetReps] = useState(exercise?.targetReps || '8–12');
  const [defaultWeightKg, setDefaultWeightKg] = useState(exercise?.defaultWeightKg ?? 16);
  const [restSeconds, setRestSeconds] = useState(exercise?.restSeconds || 90);
  const [techniqueTip, setTechniqueTip] = useState(exercise?.techniqueTip || '');
  const [targetsMuscle, setTargetsMuscle] = useState(exercise?.targetsMuscle || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: Exercise = {
      id: exercise?.id || `custom-ex-${Date.now()}`,
      name: name.trim(),
      category,
      targetSets: Number(targetSets),
      targetReps: targetReps.trim(),
      defaultWeightKg: Number(defaultWeightKg),
      restSeconds: Number(restSeconds),
      techniqueTip: techniqueTip.trim(),
      targetsMuscle: targetsMuscle.trim() || undefined
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-brand-400" />
              {exercise ? 'Customize Exercise' : 'Add New Exercise'}
            </h2>
            <p className="text-xs text-slate-400">For {dayTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Exercise Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Exercise Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Incline Dumbbell Bench Press"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500 placeholder-slate-500"
            />
          </div>

          {/* Muscle Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Target Muscle Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    category === cat
                      ? 'bg-brand-600 border-brand-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sets & Reps Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Target Sets
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={targetSets}
                  onChange={(e) => setTargetSets(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Target Reps (or Time)
              </label>
              <input
                type="text"
                value={targetReps}
                onChange={(e) => setTargetReps(e.target.value)}
                placeholder="e.g. 8–10 or 12 each leg"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Default Weight & Rest Seconds */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Target Weight (kg)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={defaultWeightKg}
                onChange={(e) => setDefaultWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Rest Timer (sec)</span>
                <Clock className="w-3 h-3 text-slate-400" />
              </label>
              <select
                value={restSeconds}
                onChange={(e) => setRestSeconds(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-brand-500"
              >
                <option value={30}>30 sec (Quick)</option>
                <option value={45}>45 sec (Core/Mobility)</option>
                <option value={60}>60 sec (Standard)</option>
                <option value={90}>90 sec (Recommended)</option>
                <option value={120}>120 sec (Heavy Compound)</option>
                <option value={180}>180 sec (Max Strength)</option>
              </select>
            </div>
          </div>

          {/* Muscle Focus Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Muscle Groups Targeted (Optional)
            </label>
            <input
              type="text"
              value={targetsMuscle}
              onChange={(e) => setTargetsMuscle(e.target.value)}
              placeholder="e.g. Hamstrings, Glutes, Lower Back"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500 placeholder-slate-500"
            />
          </div>

          {/* Technique Cues & Form Tip */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Technique & Form Cue
            </label>
            <textarea
              rows={2}
              value={techniqueTip}
              onChange={(e) => setTechniqueTip(e.target.value)}
              placeholder="e.g. Neutral spine throughout; push hips straight backward until hamstrings stretch."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500 placeholder-slate-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
            {exercise && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove "${exercise.name}" from this workout?`)) {
                    onDelete(exercise.id);
                  }
                }}
                className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-brand-600/30 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Exercise</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
