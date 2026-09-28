import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Award, 
  Plus, 
  Scale, 
  Dumbbell, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { CompletedWorkoutSession, WeightEntry, UserProfile } from '../types';

interface ProgressTabProps {
  sessions: CompletedWorkoutSession[];
  weightLogs: WeightEntry[];
  onAddWeightLog: (weight: number, note?: string) => void;
  userProfile: UserProfile;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  sessions,
  weightLogs,
  onAddWeightLog,
  userProfile,
}) => {
  // Available exercises to track in max weight chart
  const trackedExercises = [
    'Goblet Squat / Box Squat',
    'Dumbbell Romanian Deadlift',
    'Romanian Deadlift (Barbell / DB)',
    'Incline Dumbbell Chest Press',
    'Neutral-Grip Dumbbell Row',
    'Barbell / DB Hip Thrust (Glutes Focus)',
    'Assisted Pull Up / Lat Pulldown',
    'Seated Dumbbell Shoulder Press'
  ];

  const [selectedExercise, setSelectedExercise] = useState<string>(trackedExercises[0]);
  const [showWeightModal, setShowWeightModal] = useState<boolean>(false);
  const [newWeightInput, setNewWeightInput] = useState<string>('60.5');
  const [newWeightNote, setNewWeightNote] = useState<string>('');

  // Extract exercise data points across sessions
  const exerciseDataPoints: { date: string; maxWeight: number; reps: number }[] = [];
  
  // Sort sessions chronologically
  const sortedSessions = [...sessions].sort((a, b) => a.timestamp - b.timestamp);

  sortedSessions.forEach((sess) => {
    sess.exercises?.forEach((ex) => {
      if (ex.exerciseName.toLowerCase().includes(selectedExercise.toLowerCase()) || 
          selectedExercise.toLowerCase().includes(ex.exerciseName.toLowerCase())) {
        let maxW = 0;
        let bestReps = 0;
        ex.sets?.forEach((s) => {
          if (s.isCompleted && s.weightKg >= maxW) {
            maxW = s.weightKg;
            bestReps = s.reps;
          }
        });
        if (maxW > 0) {
          exerciseDataPoints.push({
            date: sess.dateStr.slice(5), // MM-DD
            maxWeight: maxW,
            reps: bestReps
          });
        }
      }
    });
  });

  // Calculate Personal Record (PR) for selected exercise
  const currentPR = exerciseDataPoints.reduce((max, pt) => Math.max(max, pt.maxWeight), 0);

  // Volume history data
  const volumeData = sortedSessions.map((s) => ({
    date: s.dateStr.slice(5),
    volume: s.totalVolumeKg || 1200,
    title: s.dayTitle
  }));

  const maxVolume = volumeData.reduce((max, v) => Math.max(max, v.volume), 4000);

  // Handle adding weight
  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 30 && val < 250) {
      onAddWeightLog(val, newWeightNote.trim() || undefined);
      setShowWeightModal(false);
      setNewWeightNote('');
    }
  };

  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weightKg : userProfile.weightKg;

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Performance & Metrics
        </h1>
        <p className="text-xs text-slate-400">
          Visualize strength progression, weekly volume, and body composition.
        </p>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto mb-1.5">
            <Flame className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Consistency</p>
          <p className="text-lg font-black text-white">{sessions.length} days</p>
          <p className="text-[10px] text-emerald-400 font-medium">Active Streak</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <div className="w-8 h-8 rounded-xl bg-accent-coral/10 text-accent-coral flex items-center justify-center mx-auto mb-1.5">
            <Dumbbell className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Total Tonnage</p>
          <p className="text-lg font-black text-white">
            {Math.round(sessions.reduce((acc, s) => acc + (s.totalVolumeKg || 0), 0) / 1000)}k
          </p>
          <p className="text-[10px] text-slate-400 font-medium">kg moved</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-1.5">
            <Scale className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Body Weight</p>
          <p className="text-lg font-black text-cyan-300">{latestWeight} kg</p>
          <p className="text-[10px] text-slate-400 font-medium">Target: {userProfile.targetWeightKg} kg</p>
        </div>
      </div>

      {/* Chart 1: Workout Volume Progression */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400">
              Workload Progression
            </span>
            <h3 className="text-base font-extrabold text-white">
              Total Volume Lifted per Session
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">kg × reps</span>
        </div>

        {/* Custom SVG Bar Chart */}
        <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-slate-800">
          {volumeData.map((item, idx) => {
            const heightPercent = Math.max(15, Math.round((item.volume / maxVolume) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded font-mono border border-slate-700 pointer-events-none whitespace-nowrap z-10">
                  {item.volume} kg
                </div>
                {/* Bar */}
                <div className="w-full max-w-[36px] bg-slate-800 rounded-t-lg relative flex items-end justify-center overflow-hidden h-36">
                  <div
                    className="w-full bg-gradient-to-t from-brand-700 to-accent-coral rounded-t-lg transition-all duration-700 group-hover:brightness-110"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-500 mt-2 text-center">
          Gradual overload without sharp spikes protects joints while driving hypertrophy.
        </p>
      </div>

      {/* Chart 2: Exercise Max Weight Progression & PRs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-accent-coral">
              Exercise Progression
            </span>
            <h3 className="text-base font-extrabold text-white">
              Strength & Max Weight Over Time
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {currentPR > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-accent-amber border border-amber-500/30 text-xs font-black flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>PR: {currentPR} kg</span>
              </span>
            )}
          </div>
        </div>

        {/* Exercise Selector Dropdown */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-slate-400 mb-1">
            Select Movement to Analyze:
          </label>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
          >
            {trackedExercises.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Exercise Progression Display */}
        {exerciseDataPoints.length === 0 ? (
          <div className="py-8 text-center bg-slate-850/50 rounded-xl border border-dashed border-slate-800 text-xs text-slate-400">
            <Dumbbell className="w-6 h-6 mx-auto mb-1 text-slate-600" />
            <p>No logged sets yet for {selectedExercise}.</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Complete sets in your live workout to automatically plot your strength curve.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-40 flex items-end gap-3 pt-6 pb-2 border-b border-slate-800">
              {exerciseDataPoints.map((pt, idx) => {
                const maxWeightVal = Math.max(...exerciseDataPoints.map((p) => p.maxWeight), 20);
                const heightPercent = Math.max(20, Math.round((pt.maxWeight / maxWeightVal) * 100));
                const isPR = pt.maxWeight === currentPR;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded font-mono border border-slate-700 whitespace-nowrap z-10">
                      {pt.maxWeight} kg × {pt.reps} reps
                    </div>
                    <div className="w-full max-w-[40px] bg-slate-800 rounded-t-lg relative flex items-end justify-center h-32">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-700 flex items-center justify-center ${
                          isPR
                            ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                            : 'bg-gradient-to-t from-brand-600 to-brand-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        <span className="text-[9px] font-black text-white font-mono">
                          {pt.maxWeight}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{pt.date}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Baseline: {exerciseDataPoints[0]?.maxWeight} kg</span>
              <span className="text-emerald-400 font-bold">
                +{parseFloat((currentPR - exerciseDataPoints[0]?.maxWeight).toFixed(1))} kg strength gain
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Body Weight Tracker Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
              Body Composition
            </span>
            <h3 className="text-base font-extrabold text-white">
              Body Weight Tracking (Goal: 64 kg)
            </h3>
          </div>
          <button
            onClick={() => setShowWeightModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Weight</span>
          </button>
        </div>

        {/* Weight history items */}
        <div className="space-y-2">
          {weightLogs.slice(-4).reverse().map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="font-extrabold text-white text-sm font-mono">
                    {entry.weightKg} kg
                  </span>
                  {entry.note && (
                    <span className="text-[10px] text-slate-400 ml-2">({entry.note})</span>
                  )}
                </div>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">{entry.dateStr}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to Log Body Weight */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Log Body Weight</span>
            </h3>

            <form onSubmit={handleWeightSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Weight (in kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeightInput}
                  onChange={(e) => setNewWeightInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-bold font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Note (e.g. Morning fasting)
                </label>
                <input
                  type="text"
                  value={newWeightNote}
                  onChange={(e) => setNewWeightNote(e.target.value)}
                  placeholder="Optional note"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md shadow-cyan-600/30"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
