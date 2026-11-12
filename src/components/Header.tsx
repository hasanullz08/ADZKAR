import React, { useState } from 'react';
import { Volume2, VolumeX, MapPin, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';
import { CITIES, CityLocation } from '../utils/prayerTimes';
import { UserSettings } from '../utils/storage';

interface HeaderProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  hijriFormatted: string;
  nextPrayerName: string;
  nextPrayerRemaining: string;
  todayPrayersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  hijriFormatted,
  nextPrayerName,
  nextPrayerRemaining,
  todayPrayersCount,
}) => {
  const [showCityPicker, setShowCityPicker] = useState(false);
  const currentCity = CITIES.find((c) => c.id === settings.cityId) || CITIES[0];

  const handleToggleSound = () => {
    const isMuted = sound.toggleMute();
    onUpdateSettings({ soundEnabled: !isMuted });
    if (!isMuted) sound.playClick();
  };

  const handleSelectCity = (c: CityLocation) => {
    sound.playClick();
    onUpdateSettings({ cityId: c.id });
    setShowCityPicker(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#101114]/95 backdrop-blur-md border-b border-[#202129] px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          {/* Logo badge with ZZZ-style chamfer & electric lime accent */}
          <div className="relative flex items-center justify-center w-10 h-10 bg-[#1A1B22] border border-[#2E303B] cut-corner-tr group">
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#D7FF3F]" />
            <span className="font-tech text-xl font-bold tracking-wider text-[#D7FF3F]">
              AZ
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-tight text-[#F3F0E8]">
                ADZKAR
              </span>
              <span className="hidden sm:inline-block text-[10px] font-tech uppercase tracking-widest px-1.5 py-0.5 bg-[#D7FF3F] text-[#101114] font-bold rounded-xs">
                DAILY COMPANION
              </span>
            </div>
            <p className="text-[11px] text-[#A5A6AC] font-mono tracking-tight hidden xs:block">
              {hijriFormatted}
            </p>
          </div>
        </div>

        {/* Center / Right Action Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Next Prayer Pill HUD */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1A1B22] border border-[#2E303B] cut-corner-tr-sm">
            <div className="w-2 h-2 rounded-full bg-[#D7FF3F] animate-pulse" />
            <span className="text-xs font-tech font-semibold text-[#A5A6AC] uppercase">
              NEXT: <span className="text-[#F3F0E8]">{nextPrayerName}</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#D7FF3F]">
              -{nextPrayerRemaining}
            </span>
          </div>

          {/* Daily Prayers Quick Counter */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#14151B] border border-[#24262E] text-xs font-tech text-[#A5A6AC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D7FF3F]" />
            <span>SHALAT:</span>
            <span className="font-bold text-[#F3F0E8]">{todayPrayersCount}/5</span>
          </div>

          {/* City Selector Button */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowCityPicker(!showCityPicker);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1A1B22] hover:bg-[#24262E] border border-[#2E303B] text-xs font-tech font-medium text-[#F3F0E8] transition-colors cut-corner-tr-sm active:scale-95"
              title="Pilih Kota Lokasi Waktu Shalat"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D7FF3F]" />
              <span className="truncate max-w-[85px] sm:max-w-[120px]">{currentCity.name}</span>
            </button>

            {/* City Dropdown Menu */}
            {showCityPicker && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/40"
                  onClick={() => setShowCityPicker(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-[#1A1B22] border border-[#2E303B] shadow-2xl z-50 cut-corner-bl overflow-hidden">
                  <div className="p-2 border-b border-[#2E303B] bg-[#14151B] flex items-center justify-between">
                    <span className="text-[11px] font-tech uppercase tracking-wider text-[#A5A6AC]">
                      LOKASI WAKTU SHALAT
                    </span>
                    <Compass className="w-3 h-3 text-[#D7FF3F]" />
                  </div>
                  <div className="max-h-60 overflow-y-auto p-1 divide-y divide-[#202129]">
                    {CITIES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCity(c)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                          c.id === settings.cityId
                            ? 'bg-[#D7FF3F] text-[#101114] font-bold'
                            : 'text-[#F3F0E8] hover:bg-[#24262E]'
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] opacity-75 font-mono">{c.country}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sound FX Toggle Button */}
          <button
            onClick={handleToggleSound}
            aria-label={settings.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="flex items-center justify-center w-8 h-8 bg-[#1A1B22] hover:bg-[#24262E] border border-[#2E303B] text-[#F3F0E8] transition-colors cut-corner-tr-sm active:scale-90"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#D7FF3F]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#A5A6AC]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
