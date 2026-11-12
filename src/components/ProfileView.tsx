import React, { useState } from 'react';
import { 
  User, Volume2, VolumeX, Smartphone, MapPin, 
  Type, Check, RotateCcw, Shield, ExternalLink, Sparkles,
  Bell, BellRing, Play
} from 'lucide-react';
import { UserSettings, saveSettings } from '../utils/storage';
import { CITIES, CityLocation } from '../utils/prayerTimes';
import { sound } from '../utils/sound';

interface ProfileViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  lifetimeTasbih: number;
  currentStreak: number;
  notificationPermission: 'granted' | 'denied' | 'default' | 'unsupported';
  onRequestNotificationPermission: () => void;
  onTestNotificationAndAdzan: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  settings,
  onUpdateSettings,
  lifetimeTasbih,
  currentStreak,
  notificationPermission,
  onRequestNotificationPermission,
  onTestNotificationAndAdzan,
}) => {
  const [nameInput, setNameInput] = useState(settings.userName);
  const [isEditingName, setIsEditingName] = useState(false);

  const currentCity = CITIES.find((c) => c.id === settings.cityId) || CITIES[0];

  const handleSaveName = () => {
    sound.playClick();
    onUpdateSettings({ userName: nameInput.trim() || 'TRAVELER' });
    setIsEditingName(false);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-24">
      {/* 1. Futuristic Profile Identification Card */}
      <div className="bg-[#1A1B22] border-2 border-[#2E303B] cut-corner-card p-5 sm:p-6 relative overflow-hidden">
        {/* Top-Right Hazard Decal */}
        <div className="absolute top-0 right-0 w-28 h-2.5 hazard-stripes-lime" />

        <div className="flex items-center gap-4">
          {/* Avatar Polygon */}
          <div className="relative w-16 h-16 bg-[#101114] border-2 border-[#D7FF3F] cut-corner-tr flex items-center justify-center glow-lime-sm">
            <span className="font-tech text-2xl font-bold text-[#D7FF3F]">
              {settings.userName.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-[#101114] bg-[#D7FF3F] px-1.5 py-0.2">
                VERIFIED USER
              </span>
              <span className="text-xs font-mono text-[#A5A6AC]">
                ID: AZ-{Math.abs(settings.userName.length * 37 + 109)}
              </span>
            </div>

            {isEditingName ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-[#101114] border border-[#D7FF3F] px-2 py-1 text-sm font-tech font-bold text-[#F3F0E8] w-40"
                  maxLength={18}
                />
                <button
                  onClick={handleSaveName}
                  className="px-2 py-1 bg-[#D7FF3F] text-[#101114] text-xs font-tech font-bold cut-corner-tr-sm"
                >
                  SIMPAN
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="font-display text-xl font-bold text-[#F3F0E8] truncate">
                  {settings.userName}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-[11px] font-tech text-[#A5A6AC] hover:text-[#D7FF3F] underline uppercase"
                >
                  EDIT
                </button>
              </div>
            )}

            <p className="text-xs text-[#A5A6AC] mt-0.5">
              Lokasi Aktif: <strong className="text-[#F3F0E8]">{currentCity.name}</strong> ({currentCity.country})
            </p>
          </div>
        </div>

        {/* Stats summary banner */}
        <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-[#24262E]">
          <div className="bg-[#101114] p-3 cut-corner-tr-sm border border-[#262832]">
            <span className="text-[10px] font-tech text-[#A5A6AC] uppercase block">
              TOTAL TASBIH SEUMUR HIDUP
            </span>
            <span className="font-mono text-xl font-bold text-[#D7FF3F]">
              {lifetimeTasbih}x
            </span>
          </div>

          <div className="bg-[#101114] p-3 cut-corner-tr-sm border border-[#262832]">
            <span className="text-[10px] font-tech text-[#A5A6AC] uppercase block">
              STREAK ISTIQAMAH
            </span>
            <span className="font-mono text-xl font-bold text-[#F3F0E8]">
              {currentStreak} Hari
            </span>
          </div>
        </div>
      </div>

      {/* 2. Audio & Feedback Preferences */}
      <div className="bg-[#1A1B22] border border-[#2E303B] cut-corner-tr p-4 space-y-3">
        <h3 className="font-tech text-xs font-bold uppercase tracking-wider text-[#D7FF3F] border-b border-[#24262E] pb-2">
          PENGATURAN FEEDBACK AUDIO & HAPTIC
        </h3>

        {/* Sound FX Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-[#D7FF3F]" />
            ) : (
              <VolumeX className="w-5 h-5 text-[#A5A6AC]" />
            )}
            <div>
              <span className="text-sm font-tech font-bold text-[#F3F0E8] block">
                EFEK SUARA CYBER
              </span>
              <span className="text-xs text-[#A5A6AC]">
                Suara klik taktil tasbih dan nada milestone penyelesaian
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              const next = !settings.soundEnabled;
              sound.toggleMute();
              onUpdateSettings({ soundEnabled: next });
              if (next) sound.playClick();
            }}
            className={`w-12 h-6 cut-corner-tr-sm border transition-colors relative flex items-center p-0.5 ${
              settings.soundEnabled
                ? 'bg-[#D7FF3F] border-[#D7FF3F]'
                : 'bg-[#101114] border-[#2E303B]'
            }`}
          >
            <div
              className={`w-5 h-5 transition-transform ${
                settings.soundEnabled
                  ? 'translate-x-6 bg-[#101114]'
                  : 'translate-x-0 bg-[#A5A6AC]'
              }`}
            />
          </button>
        </div>

        {/* Haptic Vibration Toggle */}
        <div className="flex items-center justify-between py-1 border-t border-[#24262E] pt-3">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-[#D7FF3F]" />
            <div>
              <span className="text-sm font-tech font-bold text-[#F3F0E8] block">
                GETARAN TAKTIL (HAPTICS)
              </span>
              <span className="text-xs text-[#A5A6AC]">
                Getaran mikro smartphone saat menekan tombol hitung
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              sound.vibrate(40);
              onUpdateSettings({ hapticEnabled: !settings.hapticEnabled });
            }}
            className={`w-12 h-6 cut-corner-tr-sm border transition-colors relative flex items-center p-0.5 ${
              settings.hapticEnabled
                ? 'bg-[#D7FF3F] border-[#D7FF3F]'
                : 'bg-[#101114] border-[#2E303B]'
            }`}
          >
            <div
              className={`w-5 h-5 transition-transform ${
                settings.hapticEnabled
                  ? 'translate-x-6 bg-[#101114]'
                  : 'translate-x-0 bg-[#A5A6AC]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2b. Prayer Notifications Settings (Shalat 5 Waktu) */}
      <div className="bg-[#1A1B22] border-2 border-[#2E303B] cut-corner-tr p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-[#24262E] pb-2">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-[#D7FF3F]" />
            <h3 className="font-tech text-xs font-bold uppercase tracking-wider text-[#D7FF3F]">
              NOTIFIKASI PENGINGAT SHALAT (5 WAKTU)
            </h3>
          </div>
          <span className={`text-[10px] font-tech font-bold uppercase px-1.5 py-0.2 cut-corner-tr-sm ${
            notificationPermission === 'granted'
              ? 'bg-[#D7FF3F] text-[#101114]'
              : 'bg-[#2E303B] text-[#A5A6AC]'
          }`}>
            IZIN: {notificationPermission.toUpperCase()}
          </span>
        </div>

        {/* Master Notification Toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-sm font-tech font-bold text-[#F3F0E8] block">
              NOTIFIKASI SISTEM BROWSER
            </span>
            <span className="text-xs text-[#A5A6AC]">
              Memunculkan notifikasi pop-up saat masuk waktu shalat fardhu
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              if (notificationPermission !== 'granted') {
                onRequestNotificationPermission();
              }
              onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled });
            }}
            className={`w-12 h-6 cut-corner-tr-sm border transition-colors relative flex items-center p-0.5 ${
              settings.notificationsEnabled
                ? 'bg-[#D7FF3F] border-[#D7FF3F]'
                : 'bg-[#101114] border-[#2E303B]'
            }`}
          >
            <div
              className={`w-5 h-5 transition-transform ${
                settings.notificationsEnabled
                  ? 'translate-x-6 bg-[#101114]'
                  : 'translate-x-0 bg-[#A5A6AC]'
              }`}
            />
          </button>
        </div>

        {/* Adzan Audio Alarm Toggle */}
        <div className="flex items-center justify-between py-1 border-t border-[#24262E] pt-3">
          <div>
            <span className="text-sm font-tech font-bold text-[#F3F0E8] block">
              SUARA SERUAN ADZAN
            </span>
            <span className="text-xs text-[#A5A6AC]">
              Bunyikan nada seruan adzan takbir harmonik otomatis
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onUpdateSettings({ adzanSoundEnabled: !settings.adzanSoundEnabled });
            }}
            className={`w-12 h-6 cut-corner-tr-sm border transition-colors relative flex items-center p-0.5 ${
              settings.adzanSoundEnabled
                ? 'bg-[#D7FF3F] border-[#D7FF3F]'
                : 'bg-[#101114] border-[#2E303B]'
            }`}
          >
            <div
              className={`w-5 h-5 transition-transform ${
                settings.adzanSoundEnabled
                  ? 'translate-x-6 bg-[#101114]'
                  : 'translate-x-0 bg-[#A5A6AC]'
              }`}
            />
          </button>
        </div>

        {/* Individual 5 Prayers Toggle */}
        <div className="border-t border-[#24262E] pt-3 space-y-2">
          <span className="text-xs font-tech font-bold text-[#A5A6AC] uppercase block">
            JADWAL SHALAT YANG DIBUNYIKAN:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { key: 'fajr' as const, label: 'Subuh' },
              { key: 'dhuhr' as const, label: 'Dzuhur' },
              { key: 'asr' as const, label: 'Ashar' },
              { key: 'maghrib' as const, label: 'Maghrib' },
              { key: 'isha' as const, label: 'Isya' },
            ].map((p) => {
              const isEnabled = settings.prayerNotifications?.[p.key] ?? true;
              return (
                <button
                  key={p.key}
                  onClick={() => {
                    sound.playClick();
                    onUpdateSettings({
                      prayerNotifications: {
                        ...(settings.prayerNotifications || {
                          fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true
                        }),
                        [p.key]: !isEnabled,
                      },
                    });
                  }}
                  className={`py-2 px-2.5 text-xs font-tech font-bold uppercase cut-corner-tr-sm border flex items-center justify-between transition-colors ${
                    isEnabled
                      ? 'bg-[#1F2519] border-[#D7FF3F] text-[#D7FF3F]'
                      : 'bg-[#101114] border-[#24262E] text-[#A5A6AC]'
                  }`}
                >
                  <span>{p.label}</span>
                  <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-[#D7FF3F]' : 'bg-[#3A3C4A]'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Test Notification and Adzan Button */}
        <div className="border-t border-[#24262E] pt-3">
          <button
            onClick={() => {
              sound.playClick();
              onTestNotificationAndAdzan();
            }}
            className="w-full py-2.5 px-3 bg-[#101114] hover:bg-[#202129] border border-[#2E303B] hover:border-[#D7FF3F] text-[#F3F0E8] hover:text-[#D7FF3F] font-tech font-bold text-xs uppercase tracking-wider cut-corner-tr-sm flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Play className="w-3.5 h-3.5 text-[#D7FF3F]" />
            <span>UJI NOTIFIKASI & SERUAN ADZAN SEKARANG</span>
          </button>
        </div>
      </div>

      {/* 3. Typography & Display Customization */}
      <div className="bg-[#1A1B22] border border-[#2E303B] cut-corner-tr p-4 space-y-3">
        <h3 className="font-tech text-xs font-bold uppercase tracking-wider text-[#D7FF3F] border-b border-[#24262E] pb-2">
          TAMPILAN & TIPOGRAFI ARAB
        </h3>

        {/* Arabic Font Size */}
        <div>
          <span className="text-xs font-tech font-bold text-[#F3F0E8] block mb-2">
            UKURAN TEKS ARAB
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'medium', label: 'SEDANG' },
              { id: 'large', label: 'BESAR' },
              { id: 'xlarge', label: 'EKSTRA BESAR' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  sound.playClick();
                  onUpdateSettings({ arabicFontSize: opt.id as 'medium' | 'large' | 'xlarge' });
                }}
                className={`py-2 text-xs font-tech font-bold uppercase cut-corner-tr-sm border transition-all ${
                  settings.arabicFontSize === opt.id
                    ? 'bg-[#D7FF3F] text-[#101114] border-[#D7FF3F]'
                    : 'bg-[#101114] text-[#A5A6AC] border-[#262832] hover:border-[#3E404E]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transliteration Toggle */}
        <div className="flex items-center justify-between border-t border-[#24262E] pt-3">
          <div>
            <span className="text-sm font-tech font-bold text-[#F3F0E8] block">
              TAMPILKAN TRANSLITERASI LATIN
            </span>
            <span className="text-xs text-[#A5A6AC]">
              Panduan bacaan fonetik alfabet latin
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onUpdateSettings({ showTransliteration: !settings.showTransliteration });
            }}
            className={`w-12 h-6 cut-corner-tr-sm border transition-colors relative flex items-center p-0.5 ${
              settings.showTransliteration
                ? 'bg-[#D7FF3F] border-[#D7FF3F]'
                : 'bg-[#101114] border-[#2E303B]'
            }`}
          >
            <div
              className={`w-5 h-5 transition-transform ${
                settings.showTransliteration
                  ? 'translate-x-6 bg-[#101114]'
                  : 'translate-x-0 bg-[#A5A6AC]'
              }`}
            />
          </button>
        </div>

        {/* Translation Toggle */}
        <div className="flex items-center justify-between border-t border-[#24262E] pt-3">
          <div>
            <span className="text-sm font-tech font-bold text-[#F3F0E8] block">
              TAMPILKAN TERJEMAHAN INDONESIA
            </span>
            <span className="text-xs text-[#A5A6AC]">
              Makna dan arti ayat dzikir dalam bahasa Indonesia
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onUpdateSettings({ showTranslation: !settings.showTranslation });
            }}
            className={`w-12 h-6 cut-corner-tr-sm border transition-colors relative flex items-center p-0.5 ${
              settings.showTranslation
                ? 'bg-[#D7FF3F] border-[#D7FF3F]'
                : 'bg-[#101114] border-[#2E303B]'
            }`}
          >
            <div
              className={`w-5 h-5 transition-transform ${
                settings.showTranslation
                  ? 'translate-x-6 bg-[#101114]'
                  : 'translate-x-0 bg-[#A5A6AC]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. Brand & Spiritual Mission Info */}
      <div className="bg-[#14151B] border border-[#24262E] cut-corner-card p-5 space-y-3 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-[#1A1B22] border border-[#D7FF3F] cut-corner-tr mb-1">
          <span className="font-tech text-lg font-bold text-[#D7FF3F]">AZ</span>
        </div>

        <h4 className="font-display text-lg font-bold text-[#F3F0E8] uppercase tracking-wide">
          ADZKAR
        </h4>
        <p className="text-xs font-tech text-[#D7FF3F] uppercase tracking-widest font-bold">
          YOUR DAILY ISLAMIC COMPANION.
        </p>
        <p className="text-xs text-[#A5A6AC] max-w-sm mx-auto italic">
          "Remember Allah, Every Day."
        </p>
        <p className="text-[11px] text-[#A5A6AC] max-w-md mx-auto pt-2 border-t border-[#202129]">
          Didesain dengan inspirasi antarmuka urban futuristik Zenless Zone Zero tanpa mengorbankan kesucian, adab, dan keotentikan bacaan dzikir bersumber hadits shahih.
        </p>
      </div>
    </div>
  );
};
