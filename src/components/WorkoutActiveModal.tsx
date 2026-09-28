import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Check, 
  Clock, 
  Plus, 
  Minus, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Flame, 
  Trophy, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  WorkoutDay, 
  ActiveExerciseLog, 
  CompletedWorkoutSession, 
  ActiveSetLog 
} from '../types';
import { playShortBeep, playTimerDoneAlert, playSuccessChime } from '../utils/sound';

interface WorkoutActiveModalProps {
  day: WorkoutDay;
  onFinishWorkout: (session: CompletedWorkoutSession) => void;
  onClose: () => void;
}

export const WorkoutActiveModal: React.FC<WorkoutActiveModalProps> = ({
  day,
  onFinishWorkout,
  onClose,
}) => {
  // Workout elapsed timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Rest Timer State
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(0);
  const [totalRestTarget, setTotalRestTarget] = useState<number>(90);
  const [isRestTimerActive, setIsRestTimerActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Summary completion modal
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

  // Active exercises data
  const [exerciseLogs, setExerciseLogs] = useState<ActiveExerciseLog[]>(() => {
    return day.exercises.map((ex) => {
      const parsedReps = parseInt(ex.targetReps) || 10;
      const sets: ActiveSetLog[] = Array.from({ length: ex.targetSets }).map((_, i) => ({
        setNumber: i + 1,
        weightKg: ex.defaultWeightKg,
        reps: parsedReps,
        isCompleted: false,
        prevWeightKg: ex.defaultWeightKg,
        prevReps: parsedReps
      }));

      return {
        exerciseId: ex.id,
        exerciseName: ex.name,
        category: ex.category,
        restSeconds: ex.restSeconds,
        techniqueTip: ex.techniqueTip,
        sets
      };
    });
  });

  // Elapsed time counter
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused && !showSummaryModal) {
        setElapsedSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, showSummaryModal]);

  // Rest timer countdown
  useEffect(() => {
    let restInterval: NodeJS.Timeout | null = null;
    if (isRestTimerActive && restSecondsRemaining > 0) {
      restInterval = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRestTimerActive(false);
            if (soundEnabled) {
              playTimerDoneAlert();
            }
            return 0;
          }
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playShortBeep(600, 80);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [isRestTimerActive, restSecondsRemaining, soundEnabled]);

  // Start rest timer helper
  const triggerRestTimer = (seconds: number) => {
    setTotalRestTarget(seconds);
    setRestSecondsRemaining(seconds);
    setIsRestTimerActive(true);
  };

  // Toggle set completion
  const handleToggleSetComplete = (exIdx: number, setIdx: number) => {
    const currentCompleted = exerciseLogs[exIdx].sets[setIdx].isCompleted;
    const newStatus = !currentCompleted;

    setExerciseLogs((prev) => {
      const next = [...prev];
      const ex = { ...next[exIdx] };
      const sets = [...ex.sets];
      sets[setIdx] = { ...sets[setIdx], isCompleted: newStatus };
      ex.sets = sets;
      next[exIdx] = ex;
      return next;
    });

    if (newStatus) {
      if (soundEnabled) playSuccessChime();
      // Auto-trigger rest timer for this exercise's prescribed rest time
      const restSec = exerciseLogs[exIdx].restSeconds || 90;
      triggerRestTimer(restSec);
    }
  };

  // Adjust weight for set
  const handleUpdateWeight = (exIdx: number, setIdx: number, delta: number) => {
    setExerciseLogs((prev) => {
      const next = [...prev];
      const ex = { ...next[exIdx] };
      const sets = [...ex.sets];
      const current = sets[setIdx].weightKg;
      const updated = Math.max(0, parseFloat((current + delta).toFixed(1)));
      sets[setIdx] = { ...sets[setIdx], weightKg: updated };
      ex.sets = sets;
      next[exIdx] = ex;
      return next;
    });
  };

  // Set direct weight
  const handleSetDirectWeight = (exIdx: number, setIdx: number, val: number) => {
    setExerciseLogs((prev) => {
      const next = [...prev];
      const ex = { ...next[exIdx] };
      const sets = [...ex.sets];
      sets[setIdx] = { ...sets[setIdx], weightKg: Math.max(0, val) };
      ex.sets = sets;
      next[exIdx] = ex;
      return next;
    });
  };

  // Adjust reps for set
  const handleUpdateReps = (exIdx: number, setIdx: number, delta: number) => {
    setExerciseLogs((prev) => {
      const next = [...prev];
      const ex = { ...next[exIdx] };
      const sets = [...ex.sets];
      const current = sets[setIdx].reps;
      sets[setIdx] = { ...sets[setIdx], reps: Math.max(1, current + delta) };
      ex.sets = sets;
      next[exIdx] = ex;
      return next;
    });
  };

  // Add set to exercise
  const handleAddSet = (exIdx: number) => {
    setExerciseLogs((prev) => {
      const next = [...prev];
      const ex = { ...next[exIdx] };
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet: ActiveSetLog = {
        setNumber: ex.sets.length + 1,
        weightKg: lastSet ? lastSet.weightKg : 10,
        reps: lastSet ? lastSet.reps : 10,
        isCompleted: false,
        prevWeightKg: lastSet ? lastSet.weightKg : 10,
        prevReps: lastSet ? lastSet.reps : 10,
      };
      ex.sets = [...ex.sets, newSet];
      next[exIdx] = ex;
      return next;
    });
  };

  // Remove set from exercise
  const handleRemoveSet = (exIdx: number) => {
    setExerciseLogs((prev) => {
      const next = [...prev];
      const ex = { ...next[exIdx] };
      if (ex.sets.length <= 1) return prev;
      ex.sets = ex.sets.slice(0, -1);
      next[exIdx] = ex;
      return next;
    });
  };

  // Calculate live volume and sets
  let totalVolumeKg = 0;
  let totalSetsCompleted = 0;
  let totalSetsPlanned = 0;

  exerciseLogs.forEach((ex) => {
    ex.sets.forEach((s) => {
      totalSetsPlanned++;
      if (s.isCompleted) {
        totalSetsCompleted++;
        totalVolumeKg += s.weightKg * s.reps;
      }
    });
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Handle final finish
  const handleFinishConfirm = () => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const session: CompletedWorkoutSession = {
      id: `session-${Date.now()}`,
      dayId: day.id,
      dayTitle: day.title,
      timestamp: Date.now(),
      dateStr: todayStr,
      durationSeconds: elapsedSeconds,
      totalVolumeKg: Math.round(totalVolumeKg),
      totalSetsCompleted,
      exercises: exerciseLogs,
      notes: `${day.code} finished with ${totalSetsCompleted} sets logged.`
    };

    onFinishWorkout(session);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden animate-in fade-in">
      {/* Top Workout Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Exit workout? Progress will be saved once you finish.')) {
                onClose();
              }
            }}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300">
                {day.code}
              </span>
              <h2 className="text-sm font-extrabold text-white truncate max-w-[160px] sm:max-w-xs">
                {day.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              <span className="font-bold text-slate-200">{formatTime(elapsedSeconds)}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{totalSetsCompleted}/{totalSetsPlanned} sets</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-slate-800/40 border-slate-800 text-slate-600'
            }`}
            title={soundEnabled ? 'Mute audio cues' : 'Enable audio cues'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowSummaryModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Finish</span>
          </button>
        </div>
      </div>

      {/* Floating Rest Timer Bar (Sticky when active) */}
      {isRestTimerActive && (
        <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 border-b border-brand-500/40 px-4 py-2.5 flex items-center justify-between text-white shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="13"
                  className="stroke-slate-700/60"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="13"
                  className="stroke-brand-400 transition-all duration-1000"
                  strokeWidth="3"
                  strokeDasharray={81.68}
                  strokeDashoffset={81.68 * (1 - restSecondsRemaining / totalRestTarget)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[11px] font-black font-mono">
                {restSecondsRemaining}
              </span>
            </div>

            <div>
              <p className="text-xs font-black tracking-wide text-brand-200">REST TIMER</p>
              <p className="text-[10px] text-slate-300">Target: {totalRestTarget}s</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setRestSecondsRemaining((p) => Math.max(0, p - 15))}
              className="px-2 py-1 rounded bg-slate-800 text-[11px] font-bold text-slate-300 hover:bg-slate-700"
            >
              -15s
            </button>
            <button
              onClick={() => setRestSecondsRemaining((p) => p + 15)}
              className="px-2 py-1 rounded bg-slate-800 text-[11px] font-bold text-slate-300 hover:bg-slate-700"
            >
              +15s
            </button>
            <button
              onClick={() => setIsRestTimerActive(false)}
              className="px-2.5 py-1 rounded bg-brand-600 hover:bg-brand-500 text-[11px] font-extrabold text-white"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Main Exercise & Sets Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-2xl mx-auto w-full pb-20">
        {exerciseLogs.map((ex, exIdx) => {
          const completedCount = ex.sets.filter((s) => s.isCompleted).length;
          const isAllCompleted = completedCount === ex.sets.length;

          return (
            <div
              key={ex.exerciseId}
              className={`rounded-2xl border transition-all ${
                isAllCompleted
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900 border-slate-800 shadow-md'
              }`}
            >
              {/* Exercise Header */}
              <div className="p-4 border-b border-slate-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center">
                      {exIdx + 1}
                    </span>
                    <h3 className="text-base font-black text-white">{ex.exerciseName}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                      {ex.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {ex.restSeconds}s rest
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-full ${
                    isAllCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {completedCount}/{ex.sets.length} SETS
                  </span>
                </div>
              </div>

              {/* Technique Tip */}
              {ex.techniqueTip && (
                <div className="px-4 py-2 bg-slate-850/60 text-[11px] text-slate-400 border-b border-slate-800/80 flex items-center gap-1.5">
                  <span>💡</span>
                  <span className="truncate">{ex.techniqueTip}</span>
                </div>
              )}

              {/* Set Table */}
              <div className="p-3">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-extrabold text-slate-400 px-2 pb-2">
                  <div className="col-span-2">Set</div>
                  <div className="col-span-2 text-center">Previous</div>
                  <div className="col-span-4 text-center">Weight (kg)</div>
                  <div className="col-span-3 text-center">Reps</div>
                  <div className="col-span-1 text-center">Done</div>
                </div>

                {/* Set Rows */}
                <div className="space-y-2">
                  {ex.sets.map((set, setIdx) => (
                    <div
                      key={set.setNumber}
                      className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl border transition-all ${
                        set.isCompleted
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                      }`}
                    >
                      {/* Set Number */}
                      <div className="col-span-2 flex items-center gap-1">
                        <span className="font-extrabold text-xs text-white">
                          #{set.setNumber}
                        </span>
                      </div>

                      {/* Previous Benchmark */}
                      <div className="col-span-2 text-center text-[10px] text-slate-400 font-mono">
                        {set.prevWeightKg || 0}kg × {set.prevReps || 10}
                      </div>

                      {/* Weight Stepper & Input */}
                      <div className="col-span-4 flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleUpdateWeight(exIdx, setIdx, -2.5)}
                          className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={set.weightKg}
                          onChange={(e) => handleSetDirectWeight(exIdx, setIdx, parseFloat(e.target.value) || 0)}
                          className="w-12 text-center py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-black text-white focus:outline-none focus:border-brand-500"
                        />
                        <button
                          onClick={() => handleUpdateWeight(exIdx, setIdx, 2.5)}
                          className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Reps Stepper */}
                      <div className="col-span-3 flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleUpdateReps(exIdx, setIdx, -1)}
                          className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-black font-mono text-white">
                          {set.reps}
                        </span>
                        <button
                          onClick={() => handleUpdateReps(exIdx, setIdx, 1)}
                          className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Checkmark Complete Button */}
                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            set.isCompleted
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                              : 'bg-slate-700/80 hover:bg-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add / Remove Set Row */}
                <div className="flex items-center justify-between pt-3 text-xs">
                  <button
                    onClick={() => handleAddSet(exIdx)}
                    className="flex items-center gap-1 text-brand-400 hover:text-brand-300 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Set</span>
                  </button>

                  {ex.sets.length > 1 && (
                    <button
                      onClick={() => handleRemoveSet(exIdx)}
                      className="text-slate-500 hover:text-red-400 text-[11px]"
                    >
                      Remove Set
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Summary Modal Before Final Exit */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-coral mx-auto flex items-center justify-center shadow-xl shadow-brand-500/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-black text-brand-400 tracking-wider">
                Workout Summary
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                Awesome Work, Sourabh!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {day.title} completed.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Time</p>
                <p className="text-base font-black text-white font-mono mt-0.5">
                  {formatTime(elapsedSeconds)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Volume</p>
                <p className="text-base font-black text-brand-400 font-mono mt-0.5">
                  {Math.round(totalVolumeKg)} <span className="text-[10px]">kg</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Sets</p>
                <p className="text-base font-black text-emerald-400 font-mono mt-0.5">
                  {totalSetsCompleted}
                </p>
              </div>
            </div>

            {totalSetsCompleted < totalSetsPlanned && (
              <p className="text-xs text-amber-400/90 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>You have {totalSetsPlanned - totalSetsCompleted} unfinished sets.</span>
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Resume
              </button>
              <button
                onClick={handleFinishConfirm}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30"
              >
                Log & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
