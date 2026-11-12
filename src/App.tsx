/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { AdzkarReader } from './components/AdzkarReader';
import { DigitalTasbih } from './components/DigitalTasbih';
import { WorshipTracker } from './components/WorshipTracker';
import { ProfileView } from './components/ProfileView';
import { PrayerAlertModal } from './components/PrayerAlertModal';
import { ArbainReader } from './components/ArbainReader';
import { QuranReader } from './components/QuranReader';

import { 
  getPrayerTimeline, getHijriDate, CITIES, CityLocation, PrayerTimeSlot 
} from './utils/prayerTimes';
import { 
  loadSettings, saveSettings, loadDailyRecord, saveDailyRecord, 
  loadLifetimeTasbih, getStreakData, UserSettings, DailyWorshipRecord 
} from './utils/storage';
import { sound } from './utils/sound';
import { 
  getNotificationPermission, requestNotificationPermission, 
  sendPrayerNotification, sendTestNotification, NotificationPermissionStatus 
} from './utils/notifications';

interface ActiveAlert {
  prayerName: string;
  arabicName: string;
  timeString: string;
  prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedAdzkarCategory, setSelectedAdzkarCategory] = useState<'morning' | 'evening' | 'after_prayer' | 'sleep'>('morning');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [dailyRecord, setDailyRecord] = useState<DailyWorshipRecord>(loadDailyRecord);
  const [lifetimeTasbih, setLifetimeTasbih] = useState<number>(loadLifetimeTasbih);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermissionStatus>(getNotificationPermission);
  const [activeAlert, setActiveAlert] = useState<ActiveAlert | null>(null);

  // Reset window scroll when switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentTab]);

  // Keep track of triggered prayer IDs for today to prevent repeated alerts in the same minute
  const triggeredPrayersRef = useRef<Set<string>>(new Set());

  // Clock tick every 1000ms for live countdown and prayer time matching
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);

      // Check current time against prayer schedule
      const currentCity = CITIES.find((c) => c.id === settings.cityId) || CITIES[0];
      const timeline = getPrayerTimeline(now, currentCity);

      const hoursStr = String(now.getHours()).padStart(2, '0');
      const minutesStr = String(now.getMinutes()).padStart(2, '0');
      const currentHHMM = `${hoursStr}:${minutesStr}`;

      const fardhuKeys: Array<'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'> = [
        'fajr', 'dhuhr', 'asr', 'maghrib', 'isha'
      ];

      for (const slot of timeline.slots) {
        if (slot.id === 'sunrise') continue;
        const pKey = slot.id as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

        if (slot.timeString === currentHHMM) {
          const triggerKey = `${now.toDateString()}_${pKey}_${slot.timeString}`;
          if (!triggeredPrayersRef.current.has(triggerKey)) {
            triggeredPrayersRef.current.add(triggerKey);

            const isEnabledForThisPrayer = settings.prayerNotifications?.[pKey] ?? true;
            if (settings.notificationsEnabled && isEnabledForThisPrayer) {
              // 1. Send Browser Notification
              sendPrayerNotification(slot.name, slot.timeString);

              // 2. Play Adzan Audio / Melodic Chime
              if (settings.adzanSoundEnabled) {
                sound.playAdzanTone();
              }

              // 3. Show In-App Cyber HUD Alert Modal
              setActiveAlert({
                prayerName: slot.name,
                arabicName: slot.arabicName,
                timeString: slot.timeString,
                prayerKey: pKey,
              });
            }
          }
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [settings]);

  // Request browser notification permission
  const handleRequestNotificationPermission = async () => {
    sound.playClick();
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      sendTestNotification();
      sound.playMilestone();
    }
  };

  // Test Notification & Adzan sound
  const handleTestNotificationAndAdzan = async () => {
    sound.playClick();
    if (notificationPermission !== 'granted') {
      const perm = await requestNotificationPermission();
      setNotificationPermission(perm);
    }
    sendTestNotification();
    sound.playAdzanTone();
    setActiveAlert({
      prayerName: 'Dzuhur (Uji Coba)',
      arabicName: 'الظُّهْر',
      timeString: `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`,
      prayerKey: 'dhuhr',
    });
  };

  // Sync settings updates
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  // Sync daily record updates
  const updateDailyRecord = (updater: (prev: DailyWorshipRecord) => DailyWorshipRecord) => {
    setDailyRecord((prev) => {
      const next = updater(prev);
      saveDailyRecord(next);
      return next;
    });
  };

  // Toggle obligatory prayer
  const handleTogglePrayer = (prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
    updateDailyRecord((prev) => ({
      ...prev,
      prayers: {
        ...prev.prayers,
        [prayerKey]: !prev.prayers[prayerKey],
      },
    }));
  };

  // Toggle sunnah prayer
  const handleToggleSunnah = (sunnahKey: 'tahajjud' | 'dhuha' | 'rawatib' | 'witir') => {
    updateDailyRecord((prev) => ({
      ...prev,
      sunnah: {
        ...prev.sunnah,
        [sunnahKey]: !prev.sunnah[sunnahKey],
      },
    }));
  };

  // Complete adzkar routine
  const handleCompleteCategory = (categoryId: 'morning' | 'evening' | 'after_prayer' | 'sleep') => {
    updateDailyRecord((prev) => ({
      ...prev,
      adzkarCompleted: {
        ...prev.adzkarCompleted,
        [categoryId]: true,
      },
    }));
  };

  // Increment Tasbih count
  const handleIncrementTasbihToday = (amount: number = 1) => {
    updateDailyRecord((prev) => ({
      ...prev,
      tasbihCountToday: prev.tasbihCountToday + amount,
    }));
    setLifetimeTasbih((curr) => curr + amount);
  };

  // Reset today's checklist
  const handleResetToday = () => {
    updateDailyRecord((prev) => ({
      ...prev,
      prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
      sunnah: { tahajjud: false, dhuha: false, rawatib: false, witir: false },
      adzkarCompleted: { morning: false, evening: false, after_prayer: false, sleep: false },
    }));
  };

  // Open Adzkar from Home
  const handleOpenAdzkarCategory = (categoryId: 'morning' | 'evening' | 'after_prayer' | 'sleep') => {
    setSelectedAdzkarCategory(categoryId);
    setCurrentTab('adzkar');
  };

  // Calculations
  const currentCity = CITIES.find((c) => c.id === settings.cityId) || CITIES[0];
  const prayerTimeline = getPrayerTimeline(currentDate, currentCity);
  const hijri = getHijriDate(currentDate);

  const completedPrayersCount = Object.values(dailyRecord.prayers).filter(Boolean).length;
  const uncompletedMissionsCount = Object.values(dailyRecord.adzkarCompleted).filter((v) => !v).length;
  const streakInfo = getStreakData();

  // Stable tab navigation callbacks for optimal performance
  const handleBackToHome = useCallback(() => setCurrentTab('home'), []);
  const handleOpenArbain = useCallback(() => setCurrentTab('arbain'), []);
  const handleOpenQuran = useCallback(() => setCurrentTab('quran'), []);
  const handleOpenTasbih = useCallback(() => setCurrentTab('tasbih'), []);
  const handleOpenTracker = useCallback(() => setCurrentTab('tracker'), []);

  return (
    <div className="min-h-screen bg-[#101114] text-[#F3F0E8] flex flex-col font-sans selection:bg-[#D7FF3F] selection:text-[#101114]">
      {/* Background Graphic Grid */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-30 z-0" />

      {/* Top Header */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        hijriFormatted={hijri.formatted}
        nextPrayerName={prayerTimeline.nextPrayer.name}
        nextPrayerRemaining={prayerTimeline.timeRemaining.formatted}
        todayPrayersCount={completedPrayersCount}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {currentTab === 'home' && (
          <HomeDashboard
            settings={settings}
            currentDate={currentDate}
            hijriFormatted={hijri.formatted}
            prayerTimeline={prayerTimeline}
            dailyRecord={dailyRecord}
            notificationPermission={notificationPermission}
            onRequestNotificationPermission={handleRequestNotificationPermission}
            onTestNotificationAndAdzan={handleTestNotificationAndAdzan}
            onOpenAdzkarCategory={handleOpenAdzkarCategory}
            onOpenArbain={handleOpenArbain}
            onOpenQuran={handleOpenQuran}
            onOpenTasbih={handleOpenTasbih}
            onOpenTracker={handleOpenTracker}
            onTogglePrayer={handleTogglePrayer}
          />
        )}

        {currentTab === 'adzkar' && (
          <AdzkarReader
            initialCategoryId={selectedAdzkarCategory}
            settings={settings}
            onCompleteCategory={handleCompleteCategory}
            onBackToHome={handleBackToHome}
          />
        )}

        {currentTab === 'quran' && (
          <QuranReader onBackToHome={handleBackToHome} />
        )}

        {currentTab === 'arbain' && (
          <ArbainReader
            settings={settings}
            onBackToHome={handleBackToHome}
          />
        )}

        {currentTab === 'tasbih' && (
          <DigitalTasbih
            onIncrementToday={handleIncrementTasbihToday}
            todayCount={dailyRecord.tasbihCountToday}
          />
        )}

        {currentTab === 'tracker' && (
          <WorshipTracker
            dailyRecord={dailyRecord}
            prayerSlots={prayerTimeline.slots}
            onTogglePrayer={handleTogglePrayer}
            onToggleSunnah={handleToggleSunnah}
            onResetToday={handleResetToday}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            lifetimeTasbih={lifetimeTasbih}
            currentStreak={streakInfo.currentStreak}
            notificationPermission={notificationPermission}
            onRequestNotificationPermission={handleRequestNotificationPermission}
            onTestNotificationAndAdzan={handleTestNotificationAndAdzan}
          />
        )}
      </main>

      {/* In-App Prayer Alert HUD Modal */}
      {activeAlert && (
        <PrayerAlertModal
          prayerName={activeAlert.prayerName}
          arabicName={activeAlert.arabicName}
          timeString={activeAlert.timeString}
          onDismiss={() => setActiveAlert(null)}
          onMarkPrayerDone={() => {
            handleTogglePrayer(activeAlert.prayerKey);
            setActiveAlert(null);
          }}
        />
      )}

      {/* Bottom Game Navigation */}
      <BottomNav
        activeTab={currentTab}
        onSelectTab={setCurrentTab}
        uncompletedMissionsCount={uncompletedMissionsCount}
      />
    </div>
  );
}
