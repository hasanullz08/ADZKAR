import React from 'react';
import { 
  CheckCircle2, Circle, Flame, Award, ShieldCheck, 
  Calendar, RotateCcw, TrendingUp, Sparkles, Check, Bell 
} from 'lucide-react';
import { DailyWorshipRecord, getStreakData } from '../utils/storage';
import { PrayerTimeSlot } from '../utils/prayerTimes';
import { sound } from '../utils/sound';

interface WorshipTrackerProps {
  dailyRecord: DailyWorshipRecord;
  prayerSlots: PrayerTimeSlot[];
  onTogglePrayer: (prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => void;
  onToggleSunnah: (sunnahKey: 'tahajjud' | 'dhuha' | 'rawatib' | 'witir') => void;
  onResetToday: () => void;
}

export const WorshipTracker: React.FC<WorshipTrackerProps> = ({
  dailyRecord,
  prayerSlots,
  onTogglePrayer,
  onToggleSunnah,
  onResetToday,
}) => {
  const streakInfo = getStreakData();

  // Fardhu prayers definition
  const fardhuList = [
    { key: 'fajr' as const, name: 'Subuh', slotId: 'fajr', rakah: '2 Rakaat' },
    { key: 'dhuhr' as const, name: 'Dzuhur', slotId: 'dhuhr', rakah: '4 Rakaat' },
    { key: 'asr' as const, name: 'Ashar', slotId: 'asr', rakah: '4 Rakaat' },
    { key: 'maghrib' as const, name: 'Maghrib', slotId: 'maghrib', rakah: '3 Rakaat' },
    { key: 'isha' as const, name: 'Isya', slotId: 'isha', rakah: '4 Rakaat' },
  ];

  // Sunnah prayers definition
  const sunnahList = [
    { key: 'tahajjud' as const, name: 'Shalat Tahajjud', virtue: 'Qiyamul Lail di sepertiga malam' },
    { key: 'dhuha' as const, name: 'Shalat Dhuha', virtue: 'Sedekah untuk 360 persendian tubuh' },
    { key: 'rawatib' as const, name: 'Shalat Sunnah Rawatib', virtue: 'Qabliyah & Ba’diyah pelengkap fardhu' },
    { key: 'witir' as const, name: 'Shalat Witir', virtue: 'Penutup shalat malam' },
  ];

  const fardhuDoneCount = Object.values(dailyRecord.prayers).filter(Boolean).length;
  const sunnahDoneCount = Object.values(dailyRecord.sunnah).filter(Boolean).length;
  const adzkarDoneCount = Object.values(dailyRecord.adzkarCompleted).filter(Boolean).length;

  const totalScore = Math.min(100, Math.round(
    (fardhuDoneCount / 5) * 60 + (sunnahDoneCount / 4) * 20 + (adzkarDoneCount / 4) * 20
  ));

  let rankBadge = 'RANK: RECRUIT';
  let rankColor = 'text-[#A5A6AC]';
  if (totalScore >= 90) {
    rankBadge = 'RANK: S-TIER (MUTTAQIN)';
    rankColor = 'text-[#D7FF3F]';
  } else if (totalScore >= 70) {
    rankBadge = 'RANK: A-TIER (MUHSIN)';
    rankColor = 'text-[#38BDF8]';
  } else if (totalScore >= 40) {
    rankBadge = 'RANK: B-TIER (MUJAHID)';
    rankColor = 'text-[#F3F0E8]';
  }

  // Generate 7-day visual consistency matrix (game heatmap)
  const daysOfWeek = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];
  const todayIndex = (new Date().getDay() + 6) % 7; // 0 for Monday

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header Banner & Rank Card */}
      <div className="bg-[#1A1B22] border-2 border-[#2E303B] cut-corner-card p-5 sm:p-6 relative overflow-hidden">
        {/* Top-Right Hazard Decal */}
        <div className="absolute top-0 right-0 w-28 h-2.5 hazard-stripes-lime" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-tech text-xs font-bold uppercase tracking-widest ${rankColor}`}>
                {rankBadge}
              </span>
              <span className="text-xs text-[#A5A6AC] font-mono">
                SCORE: {totalScore}%
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F3F0E8] uppercase tracking-tight">
              WORSHIP TRACKER
            </h2>
            <p className="text-xs text-[#A5A6AC] mt-1 max-w-md">
              Evaluasi kepatuhan ibadah shalat fardhu, sunnah rawatib, dan konsistensi dzikir harian.
            </p>
          </div>

          {/* Streaks Widget */}
          <div className="flex items-center gap-3 bg-[#101114] border border-[#2E303B] p-3 cut-corner-tr min-w-[170px]">
            <Flame className="w-8 h-8 text-[#D7FF3F] animate-pulse" />
            <div>
              <span className="text-[10px] font-tech uppercase text-[#A5A6AC] tracking-wider block">
                ISTIQAMAH STREAK
              </span>
              <span className="font-mono text-2xl font-bold text-[#F3F0E8]">
                {streakInfo.currentStreak} <span className="text-xs text-[#D7FF3F]">HARI</span>
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Consistency Grid */}
        <div className="mt-5 pt-4 border-t border-[#24262E]">
          <span className="text-[10px] font-tech uppercase text-[#A5A6AC] tracking-wider block mb-2">
            KONSISTENSI PEKAN INI (HEATMAP)
          </span>
          <div className="grid grid-cols-7 gap-1.5">
            {daysOfWeek.map((dayName, idx) => {
              const isToday = idx === todayIndex;
              const isPast = idx < todayIndex;

              return (
                <div
                  key={dayName}
                  className={`p-2 text-center cut-corner-tr-sm border ${
                    isToday
                      ? 'bg-[#1F2519] border-[#D7FF3F] text-[#D7FF3F]'
                      : isPast
                      ? 'bg-[#16171E] border-[#2A2C37] text-[#A5A6AC]'
                      : 'bg-[#101114] border-[#1E2028] text-[#555660]'
                  }`}
                >
                  <span className="text-[10px] font-tech font-bold block">{dayName}</span>
                  <div
                    className={`w-full h-1.5 mt-1.5 ${
                      isToday
                        ? fardhuDoneCount === 5 ? 'bg-[#D7FF3F]' : 'bg-[#D7FF3F]/40'
                        : isPast ? 'bg-[#D7FF3F]/60' : 'bg-[#202129]'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Shalat Fardhu 5 Waktu Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D7FF3F]" />
            <h3 className="font-tech text-sm font-bold uppercase tracking-wider text-[#F3F0E8]">
              SHALAT FARDHU 5 WAKTU ({fardhuDoneCount}/5)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#D7FF3F]">
            {Math.round((fardhuDoneCount / 5) * 100)}% SELESAI
          </span>
        </div>

        <div className="space-y-2">
          {fardhuList.map((item) => {
            const isDone = dailyRecord.prayers[item.key];
            const slot = prayerSlots.find((s) => s.id === item.slotId);

            return (
              <div
                key={item.key}
                onClick={() => {
                  sound.playClick();
                  onTogglePrayer(item.key);
                }}
                className={`p-3.5 sm:p-4 cut-corner-tr border flex items-center justify-between cursor-pointer transition-all select-none active:scale-[0.99] ${
                  isDone
                    ? 'bg-[#182015] border-[#D7FF3F]/80 text-[#F3F0E8]'
                    : 'bg-[#16171E] border-[#2E303B] hover:border-[#3E404E] text-[#A5A6AC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-sm border flex items-center justify-center transition-colors ${
                      isDone
                        ? 'bg-[#D7FF3F] border-[#D7FF3F] text-[#101114]'
                        : 'border-[#3E404E] bg-[#101114]'
                    }`}
                  >
                    {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm sm:text-base text-[#F3F0E8]">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-tech text-[#A5A6AC]">
                        {item.rakah}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#A5A6AC]">
                      <Bell className="w-3 h-3 text-[#D7FF3F]" />
                      <span>ADZAN: <strong className="text-[#D7FF3F]">{slot?.timeString || '--:--'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="font-tech text-xs uppercase font-bold px-2 py-1 cut-corner-tr-sm border">
                  {isDone ? (
                    <span className="text-[#D7FF3F] border-[#D7FF3F]">TERLAKSANA</span>
                  ) : (
                    <span className="text-[#A5A6AC] border-[#2E303B]">BELUM</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Shalat Sunnah Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="font-tech text-sm font-bold uppercase tracking-wider text-[#F3F0E8]">
              AMALAN SUNNAH PELENGKAP ({sunnahDoneCount}/4)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#38BDF8]">
            BONUS REWARD
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sunnahList.map((item) => {
            const isDone = dailyRecord.sunnah[item.key];

            return (
              <div
                key={item.key}
                onClick={() => {
                  sound.playClick();
                  onToggleSunnah(item.key);
                }}
                className={`p-3.5 cut-corner-tr border flex items-center justify-between cursor-pointer transition-all select-none active:scale-[0.99] ${
                  isDone
                    ? 'bg-[#151F26] border-[#38BDF8] text-[#F3F0E8]'
                    : 'bg-[#16171E] border-[#2E303B] hover:border-[#3E404E] text-[#A5A6AC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${
                      isDone
                        ? 'bg-[#38BDF8] border-[#38BDF8] text-[#101114]'
                        : 'border-[#3E404E] bg-[#101114]'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <span className="font-tech font-bold text-sm text-[#F3F0E8] block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#A5A6AC] line-clamp-1">
                      {item.virtue}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Reset Action Bar */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => {
            if (window.confirm('Reset status checklist ibadah hari ini ke awal?')) {
              sound.playClick();
              onResetToday();
            }
          }}
          className="flex items-center gap-1.5 text-xs font-tech text-[#A5A6AC] hover:text-[#F04438] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET STATUS HARI INI</span>
        </button>
      </div>
    </div>
  );
};
