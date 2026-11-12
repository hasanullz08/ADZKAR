import React, { useState } from 'react';
import { 
  Clock, ArrowUpRight, CheckCircle2, Circle, Flame, 
  Sparkles, Compass, ChevronRight, Copy, Check, ShieldCheck, Play,
  Bell, BellRing, ScrollText, BookMarked
} from 'lucide-react';
import { PrayerTimeSlot, PrayerSchedule } from '../utils/prayerTimes';
import { ADZKAR_CATEGORIES, DAILY_REMINDERS, DailyReminder } from '../data/adzkarData';
import { DailyWorshipRecord, UserSettings } from '../utils/storage';
import { sound } from '../utils/sound';

interface HomeDashboardProps {
  settings: UserSettings;
  currentDate: Date;
  hijriFormatted: string;
  prayerTimeline: {
    slots: PrayerTimeSlot[];
    nextPrayer: PrayerTimeSlot;
    currentPrayer: PrayerTimeSlot;
    timeRemaining: {
      hours: number;
      minutes: number;
      seconds: number;
      formatted: string;
    };
    progressPercent: number;
  };
  dailyRecord: DailyWorshipRecord;
  notificationPermission: 'granted' | 'denied' | 'default' | 'unsupported';
  onRequestNotificationPermission: () => void;
  onTestNotificationAndAdzan: () => void;
  onOpenAdzkarCategory: (categoryId: 'morning' | 'evening' | 'after_prayer' | 'sleep') => void;
  onOpenArbain: () => void;
  onOpenQuran: () => void;
  onOpenTasbih: () => void;
  onOpenTracker: () => void;
  onTogglePrayer: (prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  settings,
  currentDate,
  hijriFormatted,
  prayerTimeline,
  dailyRecord,
  notificationPermission,
  onRequestNotificationPermission,
  onTestNotificationAndAdzan,
  onOpenAdzkarCategory,
  onOpenArbain,
  onOpenQuran,
  onOpenTasbih,
  onOpenTracker,
  onTogglePrayer,
}) => {
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Time of day greeting
  const hour = currentDate.getHours();
  let timeGreeting = 'SELAMAT PAGI';
  let timeProtocol = 'FAJR PROTOCOL';

  if (hour >= 4 && hour < 11) {
    timeGreeting = 'SELAMAT PAGI';
    timeProtocol = 'MORNING ROTATION';
  } else if (hour >= 11 && hour < 15) {
    timeGreeting = 'SELAMAT SIANG';
    timeProtocol = 'MIDDAY ROTATION';
  } else if (hour >= 15 && hour < 18) {
    timeGreeting = 'SELAMAT SORE';
    timeProtocol = 'AFTERNOON ROTATION';
  } else {
    timeGreeting = 'SELAMAT MALAM';
    timeProtocol = 'NIGHT PROTOCOL';
  }

  // Pick daily reminder based on day of month
  const reminderIndex = currentDate.getDate() % DAILY_REMINDERS.length;
  const todayReminder: DailyReminder = DAILY_REMINDERS[reminderIndex];

  // Calculate overall worship progress
  const completedPrayers = Object.values(dailyRecord.prayers).filter(Boolean).length;
  const completedAdzkar = Object.values(dailyRecord.adzkarCompleted).filter(Boolean).length;
  const overallScore = Math.round((completedPrayers / 5) * 60 + (completedAdzkar / 4) * 40);

  const handleCopyQuote = () => {
    sound.playClick();
    const text = `"${todayReminder.arabic}"\n${todayReminder.translation}\n(${todayReminder.source}) — via ADZKAR`;
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const gregorianFormatted = currentDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Large Editorial Greeting & Date Header */}
      <section className="relative overflow-hidden pt-2">
        {/* Subtle background tech line decal */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#24262E] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-tech text-xs uppercase tracking-widest text-[#D7FF3F] bg-[#1A1B22] border border-[#2E303B] px-2 py-0.5 cut-corner-tr-sm">
                {timeProtocol}
              </span>
              <span className="text-xs text-[#A5A6AC] font-mono">
                AGENT: <strong className="text-[#F3F0E8]">{settings.userName}</strong>
              </span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F3F0E8] uppercase leading-none">
              {timeGreeting},
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D7FF3F] to-[#A3E635]">
                {settings.userName}
              </span>
            </h1>
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-tech uppercase tracking-wider text-[#A5A6AC]">
              {gregorianFormatted}
            </p>
            <p className="font-tech text-base sm:text-lg font-bold text-[#F3F0E8] tracking-wide">
              {hijriFormatted}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Large Featured Next Prayer Countdown Card */}
      <section>
        <div className="relative bg-[#1A1B22] border-2 border-[#2E303B] cut-corner-card p-5 sm:p-7 overflow-hidden group">
          {/* Top-Right Hazard Stripe Decal */}
          <div className="absolute top-0 right-0 w-32 h-3 hazard-stripes-lime" />

          {/* Background Tech Watermark Lines */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full border-8 border-white/5 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-tech font-bold uppercase tracking-widest px-2 py-0.5 bg-[#D7FF3F] text-[#101114] cut-corner-tr-sm">
                  COUNTDOWN PROTOCOL
                </span>
                <span className="text-xs font-tech text-[#A5A6AC] uppercase tracking-wider">
                  STATUS: MENJELANG SHALAT
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F3F0E8] uppercase">
                  MENUJU {prayerTimeline.nextPrayer.name}
                </h2>
                <span className="font-arabic text-xl text-[#A5A6AC]">
                  {prayerTimeline.nextPrayer.arabicName}
                </span>
              </div>

              <p className="text-xs text-[#A5A6AC] max-w-md">
                Waktu adzan {prayerTimeline.nextPrayer.name} dijadwalkan pada pukul{' '}
                <strong className="text-[#D7FF3F] font-mono">{prayerTimeline.nextPrayer.timeString}</strong>.
                Persiapkan wudhu dan sambut seruan shalat.
              </p>
            </div>

            {/* Countdown Clock HUD */}
            <div className="flex flex-col items-start md:items-end justify-center bg-[#101114] border border-[#2E303B] p-4 sm:p-5 cut-corner-tr min-w-[240px]">
              <span className="text-[10px] font-tech uppercase tracking-widest text-[#A5A6AC]">
                SISA WAKTU MENUJU ADZAN
              </span>

              <div className="font-tech text-4xl sm:text-5xl font-bold tracking-tight text-[#D7FF3F] font-mono tabular-nums leading-tight">
                {prayerTimeline.timeRemaining.formatted}
              </div>

              {/* Progress bar toward prayer */}
              <div className="w-full mt-2.5 space-y-1">
                <div className="w-full h-1.5 bg-[#202129] overflow-hidden">
                  <div
                    className="h-full bg-[#D7FF3F] transition-all duration-1000"
                    style={{ width: `${Math.max(5, prayerTimeline.progressPercent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#A5A6AC]">
                  <span>{prayerTimeline.currentPrayer.name} ({prayerTimeline.currentPrayer.timeString})</span>
                  <span>{prayerTimeline.nextPrayer.name} ({prayerTimeline.nextPrayer.timeString})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Status Banner */}
        <div className="mt-2.5">
          {notificationPermission !== 'granted' ? (
            <div className="bg-[#1A1B22] border border-[#D7FF3F]/40 cut-corner-tr p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-[#D7FF3F]/10 border border-[#D7FF3F] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-[#D7FF3F] animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-xs font-bold text-[#F3F0E8] uppercase tracking-wide">
                      NOTIFIKASI PENGINGAT ADZAN SHALAT 5 WAKTU
                    </span>
                    <span className="text-[9px] font-tech font-bold uppercase px-1.5 py-0.2 bg-[#F04438] text-white cut-corner-tr-sm">
                      NONAKTIF
                    </span>
                  </div>
                  <p className="text-xs text-[#A5A6AC]">
                    Dapatkan peringatan notifikasi browser & seruan adzan otomatis saat masuk waktu Subuh, Dzuhur, Ashar, Maghrib, dan Isya.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onRequestNotificationPermission();
                }}
                className="shrink-0 px-4 py-2 bg-[#D7FF3F] hover:bg-[#cbf534] text-[#101114] font-tech font-bold text-xs uppercase tracking-wider cut-corner-tr-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>AKTIFKAN PENGINGAT SHALAT</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#16171E] border border-[#262832] cut-corner-tr px-3 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <BellRing className="w-3.5 h-3.5 text-[#D7FF3F]" />
                <span className="font-tech font-bold text-[#F3F0E8] uppercase tracking-wider">
                  PENGINGAT ADZAN AKTIF:
                </span>
                <span className="text-[#A5A6AC] font-mono hidden sm:inline">
                  Subuh · Dzuhur · Ashar · Maghrib · Isya
                </span>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onTestNotificationAndAdzan();
                }}
                className="text-[11px] font-tech text-[#D7FF3F] hover:underline uppercase flex items-center gap-1"
              >
                <span>UJI NOTIFIKASI & ADZAN</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Prayer Schedule in Horizontal Panels */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D7FF3F]" />
            <h3 className="font-tech text-sm font-bold uppercase tracking-wider text-[#F3F0E8]">
              JADWAL 5 WAKTU & TERBIT
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onOpenTracker();
            }}
            className="text-xs font-tech font-semibold text-[#D7FF3F] hover:underline flex items-center gap-1 uppercase"
          >
            <span>BUKA TRACKER</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Schedule Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {prayerTimeline.slots.map((slot) => {
            const isFardhu = slot.id !== 'sunrise';
            const prayerKey = slot.id as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
            const isCompleted = isFardhu ? dailyRecord.prayers[prayerKey] : false;

            return (
              <div
                key={slot.id}
                className={`relative p-3 transition-all border rounded-xs flex flex-col justify-between ${
                  slot.isNext
                    ? 'bg-[#1C2018] border-[#D7FF3F] ring-1 ring-[#D7FF3F]/30 shadow-md shadow-[#D7FF3F]/10'
                    : slot.isCurrent
                    ? 'bg-[#1C1E26] border-[#A5A6AC]'
                    : 'bg-[#16171E] border-[#262832] hover:border-[#353846]'
                }`}
              >
                {/* Top Row: Name and Arabic Name */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-tech text-xs font-bold text-[#A5A6AC] uppercase tracking-wide">
                      {slot.name}
                    </span>
                    <span className="font-arabic text-xs text-[#A5A6AC] shrink-0 leading-none">
                      {slot.arabicName}
                    </span>
                  </div>

                  {/* Dedicated Status Badge Row (No Collision, No Clipping) */}
                  {slot.isNext && (
                    <div className="mb-1.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-tech font-bold uppercase tracking-wider bg-[#D7FF3F] text-[#101114] rounded-2xs leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#101114] animate-pulse" />
                        <span>BERIKUTNYA</span>
                      </span>
                    </div>
                  )}

                  {slot.isCurrent && (
                    <div className="mb-1.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-tech font-bold uppercase tracking-wider bg-[#F3F0E8] text-[#101114] rounded-2xs leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#101114]" />
                        <span>SEKARANG</span>
                      </span>
                    </div>
                  )}

                  {/* Time String */}
                  <div className="font-mono text-xl font-bold tracking-tight text-[#F3F0E8]">
                    {slot.timeString}
                  </div>
                </div>

                {/* Quick Checkbox for Obligatory Prayer */}
                {isFardhu && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onTogglePrayer(prayerKey);
                    }}
                    className={`mt-2.5 w-full py-1.5 px-1.5 text-[10px] font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-1 border transition-colors rounded-2xs ${
                      isCompleted
                        ? 'bg-[#D7FF3F]/15 border-[#D7FF3F] text-[#D7FF3F]'
                        : 'bg-[#101114] border-[#2A2C37] text-[#A5A6AC] hover:text-[#F3F0E8]'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-[#D7FF3F]" />
                        <span>SUDAH SHALAT</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3 h-3" />
                        <span>TANDAI SELESAI</span>
                      </>
                    )}
                  </button>
                )}

                {!isFardhu && (
                  <div className="mt-2.5 text-center text-[10px] font-tech text-[#A5A6AC] py-1 border border-dashed border-[#262832]">
                    BATAS SUBUH
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Worship Progress HUD & Quick Tasbih Launcher */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Progress Card */}
        <div className="md:col-span-2 bg-[#1A1B22] border border-[#2E303B] cut-corner-tr p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D7FF3F]" />
              <h3 className="font-tech text-sm font-bold uppercase tracking-wider text-[#F3F0E8]">
                PROGRESS IBADAH HARI INI
              </h3>
            </div>
            <span className="font-tech text-xs text-[#D7FF3F] font-bold">
              RANK: {overallScore >= 80 ? 'S-TIER' : overallScore >= 50 ? 'A-TIER' : 'RECRUIT'}
            </span>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#101114] border border-[#262832] p-3 cut-corner-tr-sm">
              <span className="text-[10px] font-tech text-[#A5A6AC] uppercase tracking-wider block">
                SHALAT FARDHU
              </span>
              <div className="text-2xl font-tech font-bold text-[#F3F0E8] mt-0.5">
                {completedPrayers}<span className="text-[#A5A6AC] text-sm">/5</span>
              </div>
              <div className="w-full h-1 bg-[#202129] mt-2">
                <div
                  className="h-full bg-[#D7FF3F]"
                  style={{ width: `${(completedPrayers / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#101114] border border-[#262832] p-3 cut-corner-tr-sm">
              <span className="text-[10px] font-tech text-[#A5A6AC] uppercase tracking-wider block">
                ROUTINE ADZKAR
              </span>
              <div className="text-2xl font-tech font-bold text-[#F3F0E8] mt-0.5">
                {completedAdzkar}<span className="text-[#A5A6AC] text-sm">/4</span>
              </div>
              <div className="w-full h-1 bg-[#202129] mt-2">
                <div
                  className="h-full bg-[#38BDF8]"
                  style={{ width: `${(completedAdzkar / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#101114] border border-[#262832] p-3 cut-corner-tr-sm">
              <span className="text-[10px] font-tech text-[#A5A6AC] uppercase tracking-wider block">
                DZIKIR TASBIH
              </span>
              <div className="text-2xl font-tech font-bold text-[#D7FF3F] mt-0.5 font-mono">
                {dailyRecord.tasbihCountToday}
              </div>
              <div className="w-full h-1 bg-[#202129] mt-2">
                <div
                  className="h-full bg-[#D7FF3F]"
                  style={{ width: `${Math.min(100, (dailyRecord.tasbihCountToday / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch Tasbih Card */}
        <div 
          onClick={() => {
            sound.playClick();
            onOpenTasbih();
          }}
          className="bg-gradient-to-br from-[#1A1B22] to-[#121319] border border-[#2E303B] hover:border-[#D7FF3F] cut-corner-tr p-5 flex flex-col justify-between cursor-pointer group transition-all"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-tech uppercase tracking-widest text-[#D7FF3F] px-1.5 py-0.5 bg-[#D7FF3F]/10 border border-[#D7FF3F]/30">
                INTERACTIVE DEVICE
              </span>
              <Play className="w-4 h-4 text-[#D7FF3F] group-hover:translate-x-1 transition-transform" />
            </div>

            <h4 className="font-display text-xl font-bold text-[#F3F0E8] mt-3 uppercase tracking-tight">
              DIGITAL TASBIH
            </h4>
            <p className="text-xs text-[#A5A6AC] mt-1">
              Berdzikir Subhanallah, Tahmid, Takbir dengan umpan balik haptic & audio cyber.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#262832] flex items-center justify-between">
            <span className="text-xs font-tech text-[#A5A6AC]">TOTAL HARI INI:</span>
            <span className="font-mono text-lg font-bold text-[#D7FF3F]">
              {dailyRecord.tasbihCountToday}x
            </span>
          </div>
        </div>
      </section>

      {/* 5. Daily Adzkar Interactive Mission Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D7FF3F]" />
            <h3 className="font-tech text-sm font-bold uppercase tracking-wider text-[#F3F0E8]">
              DAILY ADZKAR MISSIONS
            </h3>
          </div>
          <span className="text-xs font-mono text-[#A5A6AC]">
            {completedAdzkar} DARI 4 SELESAI
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ADZKAR_CATEGORIES.map((cat) => {
            const isDone = dailyRecord.adzkarCompleted[cat.id];

            return (
              <div
                key={cat.id}
                className={`relative bg-[#1A1B22] border transition-all cut-corner-tr p-4 flex flex-col justify-between group ${
                  isDone
                    ? 'border-[#2E303B] opacity-90'
                    : 'border-[#2E303B] hover:border-[#D7FF3F]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-tech text-xs font-bold tracking-wider text-[#A5A6AC] uppercase">
                      {cat.codeName}
                    </span>
                    <span
                      className={`text-[10px] font-tech font-bold uppercase px-1.5 py-0.5 cut-corner-tr-sm ${
                        isDone
                          ? 'bg-[#D7FF3F] text-[#101114]'
                          : 'bg-[#262832] text-[#F3F0E8]'
                      }`}
                    >
                      {isDone ? 'COMPLETED' : cat.badge}
                    </span>
                  </div>

                  <h4 className="font-display text-lg font-bold text-[#F3F0E8] group-hover:text-[#D7FF3F] transition-colors">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-[#A5A6AC] mt-1 line-clamp-1">
                    {cat.subtitle}
                  </p>
                  <p className="text-[11px] font-tech text-[#A5A6AC] mt-2">
                    WAKTU: <span className="text-[#F3F0E8]">{cat.timeWindow}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#24262E] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A5A6AC]">
                    {cat.totalItems} BACAAN
                  </span>
                  
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenAdzkarCategory(cat.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D7FF3F] hover:bg-[#c9f032] text-[#101114] text-xs font-tech font-bold uppercase cut-corner-tr-sm transition-transform active:scale-95"
                  >
                    <span>{isDone ? 'BACA ULANG' : 'MULAI DZIKIR'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5a. Al-Qur'an Mushaf Spotlight Card */}
      <section>
        <div
          onClick={() => {
            sound.playClick();
            onOpenQuran();
          }}
          className="relative bg-gradient-to-r from-[#181A22] via-[#1A1C26] to-[#14151C] border-2 border-[#2E303B] hover:border-[#D7FF3F] cut-corner-card p-5 sm:p-6 cursor-pointer group transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-2.5 hazard-stripes-lime" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-[#D7FF3F]" />
                <span className="font-tech text-xs font-bold uppercase tracking-widest text-[#D7FF3F]">
                  MUSHAF // AL-QUR'AN 604 HALAMAN
                </span>
                <span className="text-[9px] font-tech font-bold uppercase px-1.5 py-0.2 bg-[#2E303B] text-[#F3F0E8] cut-corner-tr-sm">
                  RIWAYAT HAFS
                </span>
              </div>

              <h4 className="font-display text-xl sm:text-2xl font-bold text-[#F3F0E8] group-hover:text-[#D7FF3F] transition-colors uppercase tracking-tight">
                BACA AL-QUR'AN
              </h4>

              <p className="text-xs text-[#A5A6AC] max-w-xl">
                Mushaf lengkap 114 surah & 30 juz. Lanjutkan dari halaman terakhir, simpan bookmark, dan baca dengan mode malam.
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onOpenQuran();
              }}
              className="shrink-0 px-4 py-2.5 bg-[#D7FF3F] hover:bg-[#cbf534] text-[#101114] font-tech font-bold text-xs uppercase tracking-wider cut-corner-tr-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>BUKA MUSHAF</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5b. Hadits Arbain Nawawi Spotlight Card */}
      <section>
        <div 
          onClick={() => {
            sound.playClick();
            onOpenArbain();
          }}
          className="relative bg-gradient-to-r from-[#181A22] via-[#1A1C26] to-[#14151C] border-2 border-[#2E303B] hover:border-[#D7FF3F] cut-corner-card p-5 sm:p-6 cursor-pointer group transition-all overflow-hidden"
        >
          {/* Top-Right Hazard Accent */}
          <div className="absolute top-0 right-0 w-24 h-2.5 hazard-stripes-lime" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-[#D7FF3F]" />
                <span className="font-tech text-xs font-bold uppercase tracking-widest text-[#D7FF3F]">
                  SPECIAL ARCHIVE // 42 HADITS ARBA'IN AN-NAWAWI
                </span>
                <span className="text-[9px] font-tech font-bold uppercase px-1.5 py-0.2 bg-[#2E303B] text-[#F3F0E8] cut-corner-tr-sm">
                  MATAN & TERJEMAH
                </span>
              </div>

              <h4 className="font-display text-xl sm:text-2xl font-bold text-[#F3F0E8] group-hover:text-[#D7FF3F] transition-colors uppercase tracking-tight">
                PELAJARI POKOK-POKOK AGAMA ISLAM
              </h4>

              <p className="text-xs text-[#A5A6AC] max-w-xl">
                Kumpulan 42 hadits pilihan karya Al-Hafizh An-Nawawi lengkap dengan matan Arab, terjemahan Indonesia, serta takhrij hadits terpercaya.
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onOpenArbain();
              }}
              className="shrink-0 px-4 py-2.5 bg-[#D7FF3F] hover:bg-[#cbf534] text-[#101114] font-tech font-bold text-xs uppercase tracking-wider cut-corner-tr-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>BUKA 42 HADITS</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Islamic Daily Reminder Editorial Quote Panel */}
      <section>
        <div className="relative bg-[#16171E] border-2 border-[#2E303B] cut-corner-card p-5 sm:p-6 overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#24262E] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#D7FF3F]" />
              <span className="font-tech text-xs font-bold uppercase tracking-wider text-[#D7FF3F]">
                MUTIARA DZIKIR HARIAN // {todayReminder.theme}
              </span>
            </div>
            
            <button
              onClick={handleCopyQuote}
              className="flex items-center gap-1 text-xs font-tech text-[#A5A6AC] hover:text-[#F3F0E8] transition-colors"
              title="Salin Nasihat"
            >
              {copiedQuote ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#D7FF3F]" />
                  <span className="text-[#D7FF3F]">TERSALIN</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>SALIN</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <p className="font-arabic text-xl sm:text-2xl text-right leading-loose text-[#F3F0E8]">
              {todayReminder.arabic}
            </p>

            <blockquote className="text-sm sm:text-base text-[#F3F0E8]/90 italic border-l-2 border-[#D7FF3F] pl-3 py-0.5">
              "{todayReminder.translation}"
            </blockquote>

            <div className="flex justify-between items-center text-xs font-tech text-[#A5A6AC]">
              <span>SUMBER: <strong className="text-[#F3F0E8]">{todayReminder.source}</strong></span>
              <span className="font-mono">ADZKAR COMPANION</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
