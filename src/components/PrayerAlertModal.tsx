import React from 'react';
import { Bell, Check, Volume2, X, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface PrayerAlertModalProps {
  prayerName: string;
  arabicName: string;
  timeString: string;
  onDismiss: () => void;
  onMarkPrayerDone: () => void;
}

export const PrayerAlertModal: React.FC<PrayerAlertModalProps> = ({
  prayerName,
  arabicName,
  timeString,
  onDismiss,
  onMarkPrayerDone,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#16171E] border-2 border-[#D7FF3F] cut-corner-card p-6 sm:p-8 overflow-hidden glow-lime">
        {/* Top Hazard Caution Stripe Decal */}
        <div className="absolute top-0 left-0 right-0 h-3 hazard-stripes-lime" />

        {/* Close Icon */}
        <button
          onClick={() => {
            sound.playClick();
            onDismiss();
          }}
          className="absolute top-5 right-5 text-[#A5A6AC] hover:text-[#F3F0E8] p-1 transition-colors"
          title="Tutup Peringatan"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mt-2 space-y-4">
          {/* Header Protocol Tag */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#D7FF3F] animate-ping" />
            <span className="font-tech text-xs font-bold uppercase tracking-widest text-[#D7FF3F] bg-[#101114] border border-[#2E303B] px-2 py-0.5 cut-corner-tr-sm">
              ADZAN PROTOCOL // INCOMING PRAYER
            </span>
            <span className="font-mono text-xs text-[#A5A6AC]">
              {timeString}
            </span>
          </div>

          {/* Main Title & Arabic */}
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#F3F0E8]">
              WAKTU SHALAT {prayerName} TELAH TIBA
            </h2>
            <p className="font-arabic text-2xl sm:text-3xl text-[#D7FF3F] text-right mt-1 leading-relaxed">
              {arabicName} · حَيَّ عَلَى الصَّلَاةِ
            </p>
          </div>

          {/* Body Prose */}
          <div className="bg-[#101114] border-l-2 border-[#D7FF3F] p-4 text-xs sm:text-sm text-[#A5A6AC] space-y-1">
            <p className="font-tech text-[#F3F0E8] font-bold text-sm">
              SERUAN ADZAN BERKUMANDANG
            </p>
            <p>
              "Mari sejenak rehat dari segala urusan duniawi, bersuci dengan wudhu sempurna, dan menegakkan shalat {prayerName} tepat waktu."
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                sound.vibrate(50);
                onMarkPrayerDone();
              }}
              className="py-3 px-4 bg-[#D7FF3F] hover:bg-[#cbf534] text-[#101114] font-tech font-bold text-xs uppercase tracking-wider cut-corner-tr-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>SAYA SUDAH WUDHU / SHALAT</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                sound.playAdzanTone();
              }}
              className="py-3 px-4 bg-[#1A1B22] hover:bg-[#252733] border border-[#2E303B] text-[#F3F0E8] font-tech font-bold text-xs uppercase tracking-wider cut-corner-tr-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-[#D7FF3F]" />
              <span>PUTAR NADA ADZAN</span>
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              onClick={() => {
                sound.playClick();
                onDismiss();
              }}
              className="text-xs font-tech text-[#A5A6AC] hover:text-[#F3F0E8] underline tracking-wider uppercase"
            >
              TUTUP PENGINGAT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
