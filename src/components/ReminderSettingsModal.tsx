import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  Clock, 
  Check, 
  AlertCircle, 
  Send, 
  Sparkles, 
  ShieldCheck,
  Dumbbell
} from 'lucide-react';
import { WorkoutDay } from '../types';
import { 
  ReminderSettings, 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendLocalNotification, 
  generateWorkoutReminderContent,
  isNotificationSupported 
} from '../utils/notifications';

interface ReminderSettingsModalProps {
  currentDay: WorkoutDay;
  settings: ReminderSettings;
  onSaveSettings: (settings: ReminderSettings) => void;
  onClose: () => void;
  onTriggerInAppToast: (title: string, body: string) => void;
}

const PRESET_TIMES = [
  { label: 'Morning', time: '07:00' },
  { label: 'Midday', time: '12:30' },
  { label: 'Evening', time: '18:00' },
  { label: 'Night', time: '20:00' },
];

export const ReminderSettingsModal: React.FC<ReminderSettingsModalProps> = ({
  currentDay,
  settings,
  onSaveSettings,
  onClose,
  onTriggerInAppToast,
}) => {
  const [enabled, setEnabled] = useState<boolean>(settings.enabled);
  const [time, setTime] = useState<string>(settings.time || '08:00');
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [testSent, setTestSent] = useState<boolean>(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setPermission(perm);
  };

  const handleSendTestNotification = () => {
    sendLocalNotification(currentDay, (title, body) => {
      onTriggerInAppToast(title, body);
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      enabled,
      time,
    });
    onClose();
  };

  const reminderPreview = generateWorkoutReminderContent(currentDay);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Workout Reminders
              </h2>
              <p className="text-xs text-slate-400">Daily plan-based notifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Permission Status Box */}
          {isNotificationSupported() ? (
            permission === 'granted' ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>System notifications are active and ready!</span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-brand-950/40 border border-brand-500/30 space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <AlertCircle className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Grant notification permission so FORM can alert you at your scheduled workout hour.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/20"
                >
                  Enable System Notifications
                </button>
              </div>
            )
          ) : (
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-400">
              Web Notifications API not directly available in this browser window. In-app popups and audio chimes will be used automatically.
            </div>
          )}

          {/* Toggle Reminder */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <p className="text-xs font-extrabold text-white">Daily Workout Reminder</p>
              <p className="text-[11px] text-slate-400">Receive alerts tailored to today's routine</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          {/* Reminder Time Picker & Presets */}
          {enabled && (
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Reminder Time</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </label>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {PRESET_TIMES.map((preset) => (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => setTime(preset.time)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      time === preset.time
                        ? 'bg-brand-600 border-brand-400 text-white shadow-md shadow-brand-600/30'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>{preset.label}</div>
                    <div className="text-[10px] font-mono opacity-80">{preset.time}</div>
                  </button>
                ))}
              </div>

              {/* Direct Time Input */}
              <div className="pt-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-bold font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {/* Today's Notification Preview Box */}
          <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Preview for Today ({currentDay.dayOfWeek})</span>
            </span>
            <p className="text-xs font-bold text-slate-200">{reminderPreview.title}</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">{reminderPreview.body}</p>
          </div>

          {/* Test Notification Button */}
          <button
            type="button"
            onClick={handleSendTestNotification}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {testSent ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span className="text-emerald-400">Notification & Chime Triggered!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-brand-400" />
                <span>Send Test Reminder Now</span>
              </>
            )}
          </button>

          {/* Footer Save Button */}
          <div className="flex gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold shadow-md shadow-brand-600/30 transition-all"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
