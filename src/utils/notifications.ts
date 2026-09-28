import { WorkoutDay } from '../types';
import { playSuccessChime, playTimerDoneAlert } from './sound';

export interface ReminderSettings {
  enabled: boolean;
  time: string; // "HH:MM" 24-hour format, e.g. "08:00" or "18:00"
  lastNotifiedDate: string; // YYYY-MM-DD
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: true,
  time: '08:00',
  lastNotifiedDate: '',
};

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (e) {
    console.warn('Error requesting notification permission:', e);
    return 'denied';
  }
}

export function generateWorkoutReminderContent(day: WorkoutDay): { title: string; body: string } {
  if (day.isRestDay) {
    return {
      title: `🛌 Rest & Recovery Day — FORM`,
      body: `Today is your scheduled recovery day. Prioritize protein intake (95–120g), hydrate, and do your 5-min posture reset!`
    };
  }

  const exerciseCount = day.exercises?.length || 0;
  return {
    title: `⚡ Workout Reminder: ${day.code} — ${day.title}`,
    body: `Today's session: ${day.subtitle}. ${exerciseCount} movements planned (${day.durationMinutes}). Let's get it done!`
  };
}

export function sendLocalNotification(
  day: WorkoutDay,
  onInAppFallback?: (title: string, body: string) => void
): boolean {
  const { title, body } = generateWorkoutReminderContent(day);

  // Play audio cue
  try {
    playSuccessChime();
  } catch {
    // ignore
  }

  // Try standard Web Notification if permission granted
  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'workout-reminder-' + day.id,
        silent: false,
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };

      return true;
    } catch (e) {
      console.warn('Error sending web notification, falling back to in-app alert:', e);
    }
  }

  // Trigger fallback in-app alert
  if (onInAppFallback) {
    onInAppFallback(title, body);
  }

  return false;
}
