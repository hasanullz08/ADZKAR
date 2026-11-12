import React from 'react';
import { Home, BookOpen, BookMarked, CircleDot, CheckSquare, User, ScrollText } from 'lucide-react';
import { sound } from '../utils/sound';

export type NavTab = 'home' | 'adzkar' | 'quran' | 'arbain' | 'tasbih' | 'tracker' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  uncompletedMissionsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  uncompletedMissionsCount,
}) => {
  const tabs = [
    {
      id: 'home' as NavTab,
      label: 'HOME',
      sublabel: 'OVERVIEW',
      icon: Home,
    },
    {
      id: 'adzkar' as NavTab,
      label: 'ADZKAR',
      sublabel: 'READING',
      icon: BookOpen,
      badge: uncompletedMissionsCount > 0 ? uncompletedMissionsCount : undefined,
    },
    {
      id: 'quran' as NavTab,
      label: "QUR'AN",
      sublabel: '604 HAL',
      icon: BookMarked,
    },
    {
      id: 'arbain' as NavTab,
      label: "ARBA'IN",
      sublabel: '42 HADITS',
      icon: ScrollText,
    },
    {
      id: 'tasbih' as NavTab,
      label: 'TASBIH',
      sublabel: 'COUNTER',
      icon: CircleDot,
    },
    {
      id: 'tracker' as NavTab,
      label: 'TRACKER',
      sublabel: 'PRAYERS',
      icon: CheckSquare,
    },
    {
      id: 'profile' as NavTab,
      label: 'PROFILE',
      sublabel: 'SETTINGS',
      icon: User,
    },
  ];

  const handleTabClick = (tab: NavTab) => {
    sound.playClick();
    onSelectTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#101114]/95 backdrop-blur-lg border-t border-[#202129] px-2 py-1.5 sm:px-4">
      <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-between gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 px-0.5 h-[52px] shrink-0 transition-colors group active:scale-95 ${
                isActive ? 'text-[#101114]' : 'text-[#A5A6AC] hover:text-[#F3F0E8]'
              }`}
            >
              {/* Active Tab Background Pill / Polygon inspired by ZZZ */}
              {isActive ? (
                <div className="absolute inset-0 bg-[#D7FF3F] cut-corner-tr-sm shadow-md shadow-[#D7FF3F]/20">
                  {/* Subtle hazard accent tab strip */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#101114]/30" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-transparent group-hover:bg-[#1A1B22]/60 rounded-xs transition-colors" />
              )}

              {/* Icon and Badge Container */}
              <div className="relative z-10 flex items-center justify-center">
                <Icon
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${
                    isActive ? 'scale-105 text-[#101114] stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2 px-1 min-w-[13px] h-[13px] text-[8px] font-tech font-bold flex items-center justify-center rounded-full leading-none ${
                      isActive
                        ? 'bg-[#101114] text-[#D7FF3F]'
                        : 'bg-[#D7FF3F] text-[#101114]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Text Label */}
              <span
                className={`relative z-10 text-[9px] sm:text-[10px] font-tech tracking-tight mt-1 leading-none font-bold uppercase whitespace-nowrap truncate max-w-full px-0.5 ${
                  isActive ? 'text-[#101114]' : 'text-[#A5A6AC] group-hover:text-[#F3F0E8]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
