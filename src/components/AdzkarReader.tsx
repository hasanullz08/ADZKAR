import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, RotateCcw, Check, Sparkles, 
  ListFilter, Volume2, Shield, Info, ArrowLeft, CheckCircle2 
} from 'lucide-react';
import { DAILY_ADZKAR, ADZKAR_CATEGORIES, AdzkarItem } from '../data/adzkarData';
import { sound } from '../utils/sound';
import { UserSettings } from '../utils/storage';

interface AdzkarReaderProps {
  initialCategoryId?: 'morning' | 'evening' | 'after_prayer' | 'sleep';
  settings: UserSettings;
  onCompleteCategory: (categoryId: 'morning' | 'evening' | 'after_prayer' | 'sleep') => void;
  onBackToHome?: () => void;
}

export const AdzkarReader: React.FC<AdzkarReaderProps> = ({
  initialCategoryId = 'morning',
  settings,
  onCompleteCategory,
  onBackToHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'morning' | 'evening' | 'after_prayer' | 'sleep'>(initialCategoryId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemProgress, setItemProgress] = useState<Record<string, number>>({});
  const [showDrawer, setShowDrawer] = useState(false);

  // Sync when initialCategoryId changes
  useEffect(() => {
    setSelectedCategory(initialCategoryId);
    setCurrentIndex(0);
  }, [initialCategoryId]);

  const items = DAILY_ADZKAR.filter((item) => item.category === selectedCategory);
  const currentItem: AdzkarItem | undefined = items[currentIndex] || items[0];
  const currentCategoryMeta = ADZKAR_CATEGORIES.find((c) => c.id === selectedCategory)!;

  const currentCount = currentItem ? (itemProgress[currentItem.id] || 0) : 0;
  const isItemComplete = currentItem ? currentCount >= currentItem.repeatTarget : false;

  // Handle counter tap
  const handleCountTap = () => {
    if (!currentItem) return;
    if (currentCount >= currentItem.repeatTarget) {
      sound.playMilestone();
      return;
    }

    const nextCount = currentCount + 1;
    setItemProgress((prev) => ({
      ...prev,
      [currentItem.id]: nextCount,
    }));

    if (nextCount >= currentItem.repeatTarget) {
      sound.playMilestone();
      // Check if all items in category are completed
      const allDone = items.every((itm) => {
        if (itm.id === currentItem.id) return nextCount >= itm.repeatTarget;
        return (itemProgress[itm.id] || 0) >= itm.repeatTarget;
      });
      if (allDone) {
        onCompleteCategory(selectedCategory);
      }
    } else {
      sound.playClick();
      sound.vibrate(25);
    }
  };

  const handleResetCurrent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentItem) return;
    sound.playClick();
    setItemProgress((prev) => ({
      ...prev,
      [currentItem.id]: 0,
    }));
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      sound.playClick();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      sound.playClick();
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Font size calculation for Arabic
  const arabicSizeClass = 
    settings.arabicFontSize === 'xlarge'
      ? 'text-3xl sm:text-4xl leading-[2.6]'
      : settings.arabicFontSize === 'large'
      ? 'text-2xl sm:text-3xl leading-[2.4]'
      : 'text-xl sm:text-2xl leading-[2.2]';

  // Overall category progress
  const completedItemsCount = items.filter(
    (i) => (itemProgress[i.id] || 0) >= i.repeatTarget
  ).length;
  const categoryProgressPercent = Math.round((completedItemsCount / items.length) * 100);

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Category Switcher Tabs (Urban ZZZ Style) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {ADZKAR_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat.id);
                setCurrentIndex(0);
              }}
              className={`shrink-0 px-3 py-2 text-xs font-tech font-bold uppercase tracking-wider transition-all cut-corner-tr-sm border ${
                isActive
                  ? 'bg-[#D7FF3F] text-[#101114] border-[#D7FF3F] shadow-md shadow-[#D7FF3F]/20'
                  : 'bg-[#1A1B22] text-[#A5A6AC] border-[#2E303B] hover:text-[#F3F0E8] hover:border-[#3E404E]'
              }`}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* 2. Top Navigation & Progress Bar */}
      <div className="bg-[#1A1B22] border border-[#2E303B] cut-corner-tr p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onBackToHome && (
            <button
              onClick={() => {
                sound.playClick();
                onBackToHome();
              }}
              className="p-1 text-[#A5A6AC] hover:text-[#F3F0E8] transition-colors"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-tech text-[#D7FF3F] font-bold uppercase tracking-widest">
                {currentCategoryMeta.codeName}
              </span>
              <span className="text-[10px] font-mono text-[#A5A6AC]">
                [{currentIndex + 1}/{items.length}]
              </span>
            </div>
            <h2 className="font-display text-sm sm:text-base font-bold text-[#F3F0E8] truncate max-w-[200px] sm:max-w-xs">
              {currentItem?.title}
            </h2>
          </div>
        </div>

        {/* Quick Index List Drawer Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowDrawer(!showDrawer);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#14151B] border border-[#2E303B] text-xs font-tech font-bold text-[#F3F0E8] cut-corner-tr-sm hover:border-[#D7FF3F] transition-colors"
          >
            <ListFilter className="w-3.5 h-3.5 text-[#D7FF3F]" />
            <span className="hidden sm:inline">DAFTAR BACAAN</span>
          </button>
        </div>
      </div>

      {/* Category Progress Micro-Bar */}
      <div className="w-full h-1 bg-[#1A1B22] overflow-hidden">
        <div
          className="h-full bg-[#D7FF3F] transition-all duration-300"
          style={{ width: `${categoryProgressPercent}%` }}
        />
      </div>

      {/* 3. Main Reading Card */}
      {currentItem && (
        <div className="bg-[#16171E] border-2 border-[#2E303B] cut-corner-card p-5 sm:p-7 relative space-y-6">
          {/* Top metadata tags */}
          <div className="flex items-center justify-between border-b border-[#24262E] pb-3 text-xs">
            <span className="font-tech text-[#A5A6AC] uppercase tracking-wider">
              SUMBER: <strong className="text-[#F3F0E8]">{currentItem.source}</strong>
            </span>
            <span className="font-tech font-bold px-2 py-0.5 bg-[#101114] border border-[#2E303B] text-[#D7FF3F] cut-corner-tr-sm">
              TARGET: {currentItem.repeatTarget}X
            </span>
          </div>

          {/* Clean, crystal-clear Arabic Typography with Diacritics (No distortion) */}
          <div className="py-2">
            <p className={`font-arabic text-[#F3F0E8] text-right font-normal tracking-wide select-text ${arabicSizeClass}`}>
              {currentItem.arabic}
            </p>
          </div>

          {/* Latin Transliteration */}
          {settings.showTransliteration && (
            <div className="bg-[#101114]/80 border-l-2 border-[#D7FF3F] p-3 text-xs sm:text-sm text-[#A5A6AC] font-sans leading-relaxed">
              <span className="block font-tech text-[10px] text-[#D7FF3F] uppercase tracking-wider mb-1">
                TRANSLITERASI LATIN
              </span>
              {currentItem.transliteration}
            </div>
          )}

          {/* Indonesian Translation */}
          {settings.showTranslation && (
            <div className="p-3 bg-[#1A1B22]/50 border border-[#24262E] text-xs sm:text-sm text-[#F3F0E8]/90 leading-relaxed">
              <span className="block font-tech text-[10px] text-[#A5A6AC] uppercase tracking-wider mb-1">
                ARTI BAHASA INDONESIA
              </span>
              {currentItem.translation}
            </div>
          )}

          {/* Virtue / Keutamaan */}
          {currentItem.virtue && (
            <div className="flex items-start gap-2 text-xs text-[#A5A6AC] bg-[#14151B] p-2.5 border border-[#202129]">
              <Info className="w-4 h-4 text-[#D7FF3F] shrink-0 mt-0.5" />
              <span>{currentItem.virtue}</span>
            </div>
          )}

          {/* 4. Large Interactive Repetition Counter Button */}
          <div className="pt-2 flex flex-col items-center justify-center space-y-3">
            <button
              onClick={handleCountTap}
              className={`relative w-full max-w-sm py-4 px-6 cut-corner-card border-2 flex items-center justify-between transition-all select-none active:scale-[0.98] ${
                isItemComplete
                  ? 'bg-[#1F2519] border-[#D7FF3F] text-[#D7FF3F] shadow-lg shadow-[#D7FF3F]/15'
                  : 'bg-[#101114] border-[#2E303B] hover:border-[#D7FF3F] text-[#F3F0E8]'
              }`}
            >
              {/* Circular Mini Progress Ring inside button */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#202129"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#D7FF3F"
                    strokeWidth="3.5"
                    fill="none"
                    strokeDasharray={125.6}
                    strokeDashoffset={125.6 - (125.6 * currentCount) / currentItem.repeatTarget}
                    strokeLinecap="round"
                    className="transition-all duration-200"
                  />
                </svg>
                <span className="absolute font-mono text-xs font-bold text-[#D7FF3F]">
                  {Math.round((currentCount / currentItem.repeatTarget) * 100)}%
                </span>
              </div>

              {/* Text Prompt */}
              <div className="text-center flex-1 px-4">
                <span className="block text-[11px] font-tech uppercase tracking-widest text-[#A5A6AC]">
                  {isItemComplete ? 'SELESAI BACAAN' : 'KETUK UNTUK MENGHITUNG'}
                </span>
                <span className="font-display font-bold text-lg sm:text-xl text-[#F3F0E8]">
                  {isItemComplete ? 'BACAAN TUNTAS' : 'TEKAN DISINI'}
                </span>
              </div>

              {/* Big Numerals */}
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#D7FF3F] tabular-nums">
                {currentCount}/{currentItem.repeatTarget}
              </div>
            </button>

            {/* Reset count action */}
            {currentCount > 0 && (
              <button
                onClick={handleResetCurrent}
                className="flex items-center gap-1 text-[11px] font-tech uppercase tracking-wider text-[#A5A6AC] hover:text-[#F3F0E8] transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET HITUNGAN</span>
              </button>
            )}
          </div>

          {/* 5. Navigation Controls (Previous / Next) */}
          <div className="flex items-center justify-between border-t border-[#24262E] pt-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2 font-tech text-xs font-bold uppercase cut-corner-tr-sm border transition-all ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed border-transparent text-[#A5A6AC]'
                  : 'bg-[#1A1B22] border-[#2E303B] text-[#F3F0E8] hover:border-[#D7FF3F] active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>SEBELUMNYA</span>
            </button>

            <span className="text-xs font-mono text-[#A5A6AC]">
              {currentIndex + 1} of {items.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === items.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2 font-tech text-xs font-bold uppercase cut-corner-tr-sm border transition-all ${
                currentIndex === items.length - 1
                  ? 'opacity-40 cursor-not-allowed border-transparent text-[#A5A6AC]'
                  : 'bg-[#D7FF3F] border-[#D7FF3F] text-[#101114] hover:bg-[#c9f032] active:scale-95'
              }`}
            >
              <span>SELANJUTNYA</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Quick Index Drawer Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1A1B22] border-2 border-[#2E303B] cut-corner-card p-5 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#24262E] pb-3 mb-3">
              <span className="font-tech text-xs font-bold uppercase tracking-wider text-[#D7FF3F]">
                INDEX BACAAN // {currentCategoryMeta.title}
              </span>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-xs font-tech text-[#A5A6AC] hover:text-[#F3F0E8]"
              >
                TUTUP
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {items.map((item, idx) => {
                const count = itemProgress[item.id] || 0;
                const done = count >= item.repeatTarget;
                const isSelected = idx === currentIndex;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      setCurrentIndex(idx);
                      setShowDrawer(false);
                    }}
                    className={`w-full text-left p-3 cut-corner-tr-sm border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#D7FF3F] text-[#101114] border-[#D7FF3F] font-bold'
                        : 'bg-[#101114] text-[#F3F0E8] border-[#262832] hover:border-[#3E404E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="font-mono text-xs opacity-70">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono opacity-80">
                        {count}/{item.repeatTarget}x
                      </span>
                      {done && (
                        <CheckCircle2 className="w-4 h-4 text-[#101114]" />
                      )}
                    </div>
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
