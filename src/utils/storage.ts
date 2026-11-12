/**
 * Local storage persistence helper for ADZKAR companion app.
 * Keeps track of daily prayer completions, adzkar mission states, tasbih stats, and streak records.
 */

export interface DailyWorshipRecord {
  dateStr: string; // YYYY-MM-DD
  prayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  sunnah: {
    tahajjud: boolean;
    dhuha: boolean;
    rawatib: boolean;
    witir: boolean;
  };
  adzkarCompleted: {
    morning: boolean;
    evening: boolean;
    after_prayer: boolean;
    sleep: boolean;
  };
  adzkarItemProgress: Record<string, number>; // id -> count
  tasbihCountToday: number;
}

export interface UserSettings {
  userName: string;
  cityId: string;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  arabicFontSize: 'medium' | 'large' | 'xlarge';
  showTransliteration: boolean;
  showTranslation: boolean;
  notificationsEnabled: boolean;
  adzanSoundEnabled: boolean;
  prayerNotifications: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  userName: 'TRAVELER',
  cityId: 'jkt',
  soundEnabled: true,
  hapticEnabled: true,
  arabicFontSize: 'large',
  showTransliteration: true,
  showTranslation: true,
  notificationsEnabled: true,
  adzanSoundEnabled: true,
  prayerNotifications: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
};

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem('adzkar_settings');
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('adzkar_settings', JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadDailyRecord(dateStr: string = getTodayKey()): DailyWorshipRecord {
  const defaultRecord: DailyWorshipRecord = {
    dateStr,
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
    sunnah: { tahajjud: false, dhuha: false, rawatib: false, witir: false },
    adzkarCompleted: { morning: false, evening: false, after_prayer: false, sleep: false },
    adzkarItemProgress: {},
    tasbihCountToday: 0,
  };

  if (typeof window === 'undefined') return defaultRecord;
  try {
    const raw = localStorage.getItem(`adzkar_day_${dateStr}`);
    if (!raw) return defaultRecord;
    return { ...defaultRecord, ...JSON.parse(raw) };
  } catch {
    return defaultRecord;
  }
}

export function saveDailyRecord(record: DailyWorshipRecord): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`adzkar_day_${record.dateStr}`, JSON.stringify(record));
    updateStreak();
  } catch {
    // ignore
  }
}

export function loadLifetimeTasbih(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem('adzkar_tasbih_lifetime');
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function incrementLifetimeTasbih(amount: number = 1): number {
  if (typeof window === 'undefined') return 0;
  try {
    const current = loadLifetimeTasbih();
    const next = current + amount;
    localStorage.setItem('adzkar_tasbih_lifetime', String(next));
    return next;
  } catch {
    return 0;
  }
}

export function getStreakData(): { currentStreak: number; bestStreak: number } {
  if (typeof window === 'undefined') return { currentStreak: 3, bestStreak: 7 };
  try {
    const raw = localStorage.getItem('adzkar_streak_info');
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return { currentStreak: 3, bestStreak: 7 };
}

function updateStreak(): void {
  // Simple streak recalculation
  if (typeof window === 'undefined') return;
  try {
    let current = 0;
    const today = new Date();
    
    // Check backwards up to 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const rec = localStorage.getItem(`adzkar_day_${k}`);
      if (rec) {
        const parsed = JSON.parse(rec);
        const hasActivity = 
          Object.values(parsed.prayers || {}).some(Boolean) ||
          Object.values(parsed.adzkarCompleted || {}).some(Boolean) ||
          (parsed.tasbihCountToday || 0) > 0;
        
        if (hasActivity) {
          current++;
        } else if (i > 0) {
          break;
        }
      } else if (i > 0) {
        break;
      }
    }

    const prev = getStreakData();
    const bestStreak = Math.max(prev.bestStreak, Math.max(current, 1));
    const streakInfo = { currentStreak: Math.max(current, 1), bestStreak };
    localStorage.setItem('adzkar_streak_info', JSON.stringify(streakInfo));
  } catch {
    // ignore
  }
}
