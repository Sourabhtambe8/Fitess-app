import React from 'react';
import { Bell, X, Play, Sparkles } from 'lucide-react';

interface NotificationToastProps {
  title: string;
  body: string;
  onStartWorkout?: () => void;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  title,
  body,
  onStartWorkout,
  onDismiss,
}) => {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto animate-in slide-in-from-top duration-300">
      <div className="bg-slate-900/95 border border-brand-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-white pulse-glow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-coral flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/30">
              <Bell className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] uppercase font-black text-brand-300 tracking-wider">
                  Workout Alert
                </span>
                <span className="text-[10px] text-slate-400">• Just now</span>
              </div>
              <h4 className="text-sm font-black text-white">{title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-snug">{body}</p>

              {onStartWorkout && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onStartWorkout();
                      onDismiss();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-coral hover:from-brand-500 hover:to-accent-coral text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-brand-600/30 transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Workout Now</span>
                  </button>

                  <button
                    onClick={onDismiss}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold transition-colors"
                  >
                    Later
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
