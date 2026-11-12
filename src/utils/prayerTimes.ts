/**
 * Astronomical Prayer Times & Hijri Calendar calculations.
 * Accurate solar position equations with configurable calculation methods.
 */

export interface CityLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number; // UTC offset in hours
}

export const CITIES: CityLocation[] = [
  { id: 'jkt', name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, timezone: 7 },
  { id: 'sby', name: 'Surabaya', country: 'Indonesia', lat: -7.2575, lng: 112.7521, timezone: 7 },
  { id: 'bdg', name: 'Bandung', country: 'Indonesia', lat: -6.9175, lng: 107.6191, timezone: 7 },
  { id: 'mdn', name: 'Medan', country: 'Indonesia', lat: 3.5952, lng: 98.6722, timezone: 7 },
  { id: 'jog', name: 'Yogyakarta', country: 'Indonesia', lat: -7.7956, lng: 110.3695, timezone: 7 },
  { id: 'mks', name: 'Makassar', country: 'Indonesia', lat: -5.1477, lng: 119.4327, timezone: 8 },
  { id: 'bjm', name: 'Banjarmasin', country: 'Indonesia', lat: -3.3194, lng: 114.5908, timezone: 8 },
  { id: 'dps', name: 'Denpasar (Bali)', country: 'Indonesia', lat: -8.6705, lng: 115.2126, timezone: 8 },
  { id: 'jay', name: 'Jayapura', country: 'Indonesia', lat: -2.5337, lng: 140.7181, timezone: 9 },
  { id: 'mkk', name: 'Makkah', country: 'Saudi Arabia', lat: 21.3891, lng: 39.8579, timezone: 3 },
  { id: 'mdh', name: 'Madinah', country: 'Saudi Arabia', lat: 24.5247, lng: 39.5692, timezone: 3 },
  { id: 'kl', name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, timezone: 8 },
  { id: 'sg', name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 8 },
  { id: 'tko', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, timezone: 9 },
  { id: 'ldn', name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, timezone: 0 },
];

export interface PrayerSchedule {
  fajr: string;      // Subuh
  sunrise: string;   // Terbit
  dhuhr: string;     // Dzuhur
  asr: string;       // Ashar
  maghrib: string;   // Maghrib
  isha: string;      // Isya
}

export interface PrayerTimeSlot {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name: string;
  arabicName: string;
  timeString: string;
  dateObj: Date;
  isPassed: boolean;
  isNext: boolean;
  isCurrent: boolean;
}

// Convert degrees to radians and back
const d2r = (d: number) => (d * Math.PI) / 180.0;
const r2d = (r: number) => (r * 180.0) / Math.PI;

function formatHHMM(hoursFloat: number): string {
  let totalMinutes = Math.round(hoursFloat * 60);
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  totalMinutes = totalMinutes % (24 * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Standard Solar Calculation for Islamic Prayer Times
 */
export function calculatePrayerTimes(date: Date, city: CityLocation): PrayerSchedule {
  // Day of year
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Sun's declination
  const declination = 23.45 * Math.sin(d2r((360 / 365) * (dayOfYear - 81)));

  // Equation of time (approximate minutes)
  const b = (360 / 365) * (dayOfYear - 81);
  const eot = 9.87 * Math.sin(d2r(2 * b)) - 7.53 * Math.cos(d2r(b)) - 1.5 * Math.sin(d2r(b));

  // Solar noon in hours UTC
  const solarNoonUTC = 12 - (city.lng / 15) - (eot / 60);
  const localSolarNoon = (solarNoonUTC + city.timezone + 24) % 24;

  const latRad = d2r(city.lat);
  const decRad = d2r(declination);

  // Hour angle helper
  const hourAngle = (angle: number): number => {
    const val = (Math.sin(d2r(angle)) - Math.sin(latRad) * Math.sin(decRad)) /
                (Math.cos(latRad) * Math.cos(decRad));
    if (val > 1 || val < -1) return 0;
    return r2d(Math.acos(val)) / 15;
  };

  // Fajr: Sun at 20 degrees below horizon (Standard Kemenag / MWL)
  const fajrHA = hourAngle(-20);
  const fajr = localSolarNoon - fajrHA;

  // Sunrise: Sun at 0.833 degrees below horizon (atmospheric refraction)
  const sunriseHA = hourAngle(-0.833);
  const sunrise = localSolarNoon - sunriseHA;

  // Dhuhr: Solar noon + slight safety buffer (2 min)
  const dhuhr = localSolarNoon + 2 / 60;

  // Asr: Shadow length = object + noon shadow (Shafi'i / Standard)
  const noonShadowLength = Math.tan(Math.abs(latRad - decRad));
  const asrAlt = r2d(Math.atan(1 / (1 + noonShadowLength)));
  const asrHA = hourAngle(asrAlt);
  const asr = localSolarNoon + asrHA;

  // Maghrib: Sunset (-0.833 deg) + 2 min buffer
  const maghrib = localSolarNoon + sunriseHA + 2 / 60;

  // Isha: Sun at 18 degrees below horizon
  const ishaHA = hourAngle(-18);
  const isha = localSolarNoon + ishaHA;

  return {
    fajr: formatHHMM(fajr),
    sunrise: formatHHMM(sunrise),
    dhuhr: formatHHMM(dhuhr),
    asr: formatHHMM(asr),
    maghrib: formatHHMM(maghrib),
    isha: formatHHMM(isha),
  };
}

/**
 * Returns prayer schedule items with status (passed, current, next)
 */
export function getPrayerTimeline(date: Date, city: CityLocation) {
  const schedule = calculatePrayerTimes(date, city);
  const now = date.getTime();

  const parseToDate = (timeStr: string, offsetDay: number = 0) => {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(date);
    d.setDate(d.getDate() + offsetDay);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const prayersRaw = [
    { id: 'fajr' as const, name: 'Subuh', arabicName: 'الفَجْر', time: schedule.fajr },
    { id: 'sunrise' as const, name: 'Terbit', arabicName: 'الشُّرُوق', time: schedule.sunrise },
    { id: 'dhuhr' as const, name: 'Dzuhur', arabicName: 'الظُّهْر', time: schedule.dhuhr },
    { id: 'asr' as const, name: 'Ashar', arabicName: 'العَصْر', time: schedule.asr },
    { id: 'maghrib' as const, name: 'Maghrib', arabicName: 'المَغْرِب', time: schedule.maghrib },
    { id: 'isha' as const, name: 'Isya', arabicName: 'العِشَاء', time: schedule.isha },
  ];

  const slots = prayersRaw.map((p) => {
    const d = parseToDate(p.time);
    return {
      id: p.id,
      name: p.name,
      arabicName: p.arabicName,
      timeString: p.time,
      dateObj: d,
      isPassed: d.getTime() <= now,
      isNext: false,
      isCurrent: false,
    };
  });

  // Determine current and next prayer
  let nextIdx = slots.findIndex(s => !s.isPassed);
  let currentIdx = -1;

  if (nextIdx === -1) {
    // All prayers passed today, next is Fajr tomorrow
    nextIdx = 0;
    currentIdx = slots.length - 1; // Isha
  } else if (nextIdx === 0) {
    currentIdx = slots.length - 1; // Isha of previous night
  } else {
    currentIdx = nextIdx - 1;
  }

  slots.forEach((s, idx) => {
    if (idx === nextIdx) s.isNext = true;
    if (idx === currentIdx) s.isCurrent = true;
  });

  const nextPrayerSlot = slots[nextIdx];
  const nextPrayerTarget = new Date(nextPrayerSlot.dateObj);
  if (nextIdx === 0 && slots.every(s => s.isPassed)) {
    nextPrayerTarget.setDate(nextPrayerTarget.getDate() + 1);
  }

  const currentPrayerSlot = slots[currentIdx];
  const currentPrayerStart = new Date(currentPrayerSlot.dateObj);
  if (currentIdx === slots.length - 1 && nextIdx === 0 && !slots.every(s => s.isPassed)) {
    currentPrayerStart.setDate(currentPrayerStart.getDate() - 1);
  }

  const remainingMs = Math.max(0, nextPrayerTarget.getTime() - now);
  const totalDurationMs = Math.max(1000, nextPrayerTarget.getTime() - currentPrayerStart.getTime());
  const elapsedMs = Math.max(0, now - currentPrayerStart.getTime());
  const progressPercent = Math.min(100, Math.max(0, (elapsedMs / totalDurationMs) * 100));

  const totalSec = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return {
    slots,
    nextPrayer: nextPrayerSlot,
    currentPrayer: currentPrayerSlot,
    timeRemaining: {
      hours,
      minutes,
      seconds,
      totalSeconds: totalSec,
      formatted: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    },
    progressPercent,
  };
}

/**
 * Calculate accurate Hijri date from Gregorian date (Kuwaiti algorithm)
 */
export function getHijriDate(date: Date = new Date()): {
  day: number;
  monthName: string;
  monthNumber: number;
  year: number;
  formatted: string;
} {
  const hijriMonths = [
    'Muharram', 'Safar', "Rabi'ul Awwal", "Rabi'uts Tsani",
    'Jumadal Ula', 'Jumadats Tsaniyah', 'Rajab', "Sya'ban",
    'Ramadhan', 'Syawwal', "Dzulqa'dah", 'Dzulhijjah'
  ];

  // Modified Julian Day calculation
  const m = date.getMonth();
  const y = date.getFullYear();
  let d = date.getDate();

  let jd = Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4) +
           Math.floor((367 * (m - 2 - 12 * (Math.floor((m - 14) / 12)))) / 12) -
           Math.floor((3 * (Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100))) / 4) +
           d - 32075;

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l1 = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l1) / 5316)) * (Math.floor((50 * l1) / 17719)) +
            (Math.floor(l1 / 5670)) * (Math.floor((43 * l1) / 15238));
  const l2 = l1 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
             (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const mH = Math.floor((24 * l2) / 709);
  const dH = l2 - Math.floor((709 * mH) / 24);
  const yH = 30 * n + j - 30;

  const safeMonth = Math.max(0, Math.min(11, mH - 1));
  const monthName = hijriMonths[safeMonth] || 'Bulan Hijriyah';

  return {
    day: dH,
    monthNumber: mH,
    monthName,
    year: yH,
    formatted: `${dH} ${monthName} ${yH} H`,
  };
}
