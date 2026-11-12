import React, { useState } from 'react';
import { 
  RotateCcw, Sparkles, Volume2, VolumeX, Smartphone, 
  Settings2, ChevronDown, Check, Award, History 
} from 'lucide-react';
import { TASBIH_PRESETS, TasbihPreset } from '../data/adzkarData';
import { sound } from '../utils/sound';
import { incrementLifetimeTasbih, loadLifetimeTasbih } from '../utils/storage';

interface DigitalTasbihProps {
  onIncrementToday: (amount: number) => void;
  todayCount: number;
}

export const DigitalTasbih: React.FC<DigitalTasbihProps> = ({
  onIncrementToday,
  todayCount,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<TasbihPreset>(TASBIH_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [round, setRound] = useState<number>(0);
  const [target, setTarget] = useState<number>(33);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [showPresetModal, setShowPresetModal] = useState<boolean>(false);
  const [showTargetModal, setShowTargetModal] = useState<boolean>(false);
  const [customTargetInput, setCustomTargetInput] = useState<string>('33');

  const lifetimeCount = loadLifetimeTasbih();

  // Primary Tasbih Tap Action
  const handleTap = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    const nextCount = count + 1;
    onIncrementToday(1);
    incrementLifetimeTasbih(1);

    if (target > 0 && nextCount >= target) {
      // Milestone reached!
      sound.playMilestone();
      setRound((r) => r + 1);
      setCount(0);
    } else {
      sound.playClick();
      sound.vibrate(30);
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setCount(0);
    setRound(0);
  };

  const handleSelectPreset = (preset: TasbihPreset) => {
    sound.playClick();
    setSelectedPreset(preset);
    setTarget(preset.defaultTarget);
    setCount(0);
    setRound(0);
    setShowPresetModal(false);
  };

  const handleSetTarget = (newTarget: number) => {
    sound.playClick();
    setTarget(newTarget);
    setCount(0);
    setShowTargetModal(false);
  };

  // Progress percentage (0 if infinite target)
  const progressPercent = target > 0 ? Math.min(100, (count / target) * 100) : 0;
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = target > 0 ? circumference - (circumference * progressPercent) / 100 : 0;

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-20">
      {/* 1. Device Header Frame */}
      <div className="bg-[#1A1B22] border-2 border-[#2E303B] cut-corner-tr p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-tech text-[#D7FF3F] font-bold uppercase tracking-widest block">
            DEVICE MODEL: TASBIH-TECH MK.IV
          </span>
          <h2 className="font-display text-lg font-bold text-[#F3F0E8] uppercase tracking-tight">
            DIGITAL TASBIH INTERFACE
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Target Mode Badge Button */}
          <button
            onClick={() => {
              sound.playClick();
              setShowTargetModal(true);
            }}
            className="px-2.5 py-1 bg-[#101114] border border-[#2E303B] hover:border-[#D7FF3F] text-xs font-tech font-bold text-[#D7FF3F] cut-corner-tr-sm transition-colors"
          >
            TARGET: {target === 0 ? 'FREE' : `${target}X`}
          </button>
        </div>
      </div>

      {/* 2. Active Dhikr Phrase Card */}
      <div
        onClick={() => {
          sound.playClick();
          setShowPresetModal(true);
        }}
        className="bg-[#16171E] border border-[#2E303B] hover:border-[#D7FF3F] cut-corner-tr p-4 cursor-pointer transition-colors group relative"
      >
        <div className="flex items-center justify-between border-b border-[#24262E] pb-2 mb-3">
          <span className="text-[10px] font-tech uppercase tracking-widest text-[#A5A6AC]">
            ACTIVE SACRED FORMULA
          </span>
          <span className="text-[11px] font-tech text-[#D7FF3F] flex items-center gap-1 group-hover:underline">
            <span>GANTI BACAAN</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="text-center space-y-1">
          <p className="font-arabic text-2xl sm:text-3xl text-[#F3F0E8] leading-relaxed">
            {selectedPreset.arabic}
          </p>
          <p className="font-tech text-base font-bold text-[#D7FF3F] tracking-wide">
            {selectedPreset.transliteration}
          </p>
          <p className="text-xs text-[#A5A6AC] italic">
            "{selectedPreset.translation}"
          </p>
        </div>
      </div>

      {/* 3. Central Futuristic Interactive Dial Button */}
      <div className="flex flex-col items-center justify-center py-2 select-none">
        <div
          onClick={handleTap}
          className={`relative w-72 h-72 sm:w-80 sm:h-80 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-100 ${
            isPressing ? 'scale-95' : 'hover:scale-[1.02]'
          }`}
          title="Ketuk lingkaran untuk menghitung tasbih"
        >
          {/* Outer Cybernetic Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#262832] bg-tech-dots" />

          {/* SVG Circular Progress Meter */}
          <svg className="w-full h-full -rotate-90 relative z-10 pointer-events-none">
            {/* Background Track */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="#202129"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Dynamic Electric Lime Progress Arc */}
            {target > 0 && (
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#D7FF3F"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-150"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(215, 255, 63, 0.5))',
                }}
              />
            )}
          </svg>

          {/* Inner Touch Core Button */}
          <div
            className={`absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full border-2 flex flex-col items-center justify-center z-20 transition-all ${
              isPressing
                ? 'bg-[#1F2519] border-[#D7FF3F] glow-lime'
                : 'bg-gradient-to-b from-[#1C1E26] to-[#121319] border-[#2E303B] shadow-2xl'
            }`}
          >
            {/* Round info tag */}
            {round > 0 && (
              <span className="font-tech text-xs font-bold text-[#101114] bg-[#D7FF3F] px-2 py-0.5 rounded-full mb-1">
                ROUND {round + 1}
              </span>
            )}

            {/* Massive Digital Counter */}
            <span className="font-mono text-6xl sm:text-7xl font-extrabold tracking-tight text-[#F3F0E8] tabular-nums">
              {count}
            </span>

            {/* Target reminder */}
            <span className="font-tech text-xs uppercase tracking-widest text-[#A5A6AC] mt-1">
              {target > 0 ? `TARGET: ${target}` : 'FREE COUNT'}
            </span>

            {/* Tap instruction */}
            <span className="text-[10px] font-tech text-[#D7FF3F] font-bold mt-2 uppercase tracking-wider">
              TAP TO COUNT
            </span>
          </div>
        </div>

        {/* Tactile hint */}
        <p className="text-xs font-tech text-[#A5A6AC] uppercase tracking-wider mt-4">
          SENTUH LINGKARAN BESAR UNTUK MENGHITUNG
        </p>
      </div>

      {/* 4. Controls & Device Metrics Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#1A1B22] border border-[#2E303B] cut-corner-tr-sm p-3 text-center">
          <span className="text-[10px] font-tech text-[#A5A6AC] uppercase block">
            PUTARAN (ROUNDS)
          </span>
          <span className="font-mono text-xl font-bold text-[#F3F0E8]">
            {round}
          </span>
        </div>

        <div className="bg-[#1A1B22] border border-[#2E303B] cut-corner-tr-sm p-3 text-center">
          <span className="text-[10px] font-tech text-[#A5A6AC] uppercase block">
            TOTAL HARI INI
          </span>
          <span className="font-mono text-xl font-bold text-[#D7FF3F]">
            {todayCount}
          </span>
        </div>

        <button
          onClick={handleReset}
          className="bg-[#1A1B22] hover:bg-[#252733] border border-[#2E303B] hover:border-[#F04438] text-[#F04438] cut-corner-tr-sm p-3 flex flex-col items-center justify-center transition-colors active:scale-95"
          title="Reset Hitungan"
        >
          <RotateCcw className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-tech uppercase font-bold tracking-wider">
            RESET
          </span>
        </button>
      </div>

      {/* 5. Target Selection Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1A1B22] border-2 border-[#2E303B] cut-corner-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#24262E] pb-2">
              <span className="font-tech text-xs font-bold uppercase tracking-wider text-[#D7FF3F]">
                SET TARGET BACAAN
              </span>
              <button
                onClick={() => setShowTargetModal(false)}
                className="text-xs font-tech text-[#A5A6AC] hover:text-[#F3F0E8]"
              >
                BATAL
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[33, 99, 100, 1000, 0].map((tVal) => (
                <button
                  key={tVal}
                  onClick={() => handleSetTarget(tVal)}
                  className={`p-3 cut-corner-tr-sm border text-center font-tech font-bold uppercase transition-all ${
                    target === tVal
                      ? 'bg-[#D7FF3F] text-[#101114] border-[#D7FF3F]'
                      : 'bg-[#101114] text-[#F3F0E8] border-[#2E303B] hover:border-[#3E404E]'
                  }`}
                >
                  <span className="text-base">{tVal === 0 ? 'FREE / ∞' : `${tVal}x`}</span>
                  <span className="text-[10px] block opacity-75 font-normal">
                    {tVal === 33
                      ? 'Sunnah Shalat'
                      : tVal === 100
                      ? 'Standar Harian'
                      : tVal === 0
                      ? 'Tanpa Batas'
                      : 'Khatam Target'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Preset Selection Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1A1B22] border-2 border-[#2E303B] cut-corner-card p-5 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#24262E] pb-3 mb-3">
              <span className="font-tech text-xs font-bold uppercase tracking-wider text-[#D7FF3F]">
                PILIH KALIMAT DZIKIR
              </span>
              <button
                onClick={() => setShowPresetModal(false)}
                className="text-xs font-tech text-[#A5A6AC] hover:text-[#F3F0E8]"
              >
                TUTUP
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {TASBIH_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left p-3.5 cut-corner-tr-sm border transition-all ${
                      isSelected
                        ? 'bg-[#1F2519] border-[#D7FF3F]'
                        : 'bg-[#101114] border-[#262832] hover:border-[#3E404E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-sm font-bold text-[#D7FF3F]">
                        {preset.transliteration}
                      </span>
                      <span className="font-arabic text-xl text-[#F3F0E8]">
                        {preset.arabic}
                      </span>
                    </div>
                    <p className="text-xs text-[#A5A6AC] mt-1">
                      "{preset.translation}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
