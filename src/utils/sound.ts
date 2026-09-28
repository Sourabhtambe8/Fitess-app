let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('Web Audio not supported', e);
    return null;
  }
}

export function playShortBeep(freq: number = 880, durationMs: number = 100) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

export function playTimerDoneAlert() {
  playShortBeep(659.25, 120); // E5
  setTimeout(() => playShortBeep(880, 150), 140); // A5
  setTimeout(() => playShortBeep(1174.66, 300), 300); // D6
  
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([150, 100, 200, 100, 300]);
    } catch {
      // ignore
    }
  }
}

export function playSuccessChime() {
  playShortBeep(523.25, 100); // C5
  setTimeout(() => playShortBeep(659.25, 100), 120); // E5
  setTimeout(() => playShortBeep(783.99, 150), 240); // G5
  setTimeout(() => playShortBeep(1046.50, 250), 380); // C6

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([80, 50, 120]);
    } catch {
      // ignore
    }
  }
}
