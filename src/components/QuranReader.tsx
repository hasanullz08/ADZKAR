import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Bookmark, BookMarked, Moon, Sun,
  Search, X, Play, Hash,
} from 'lucide-react';
import {
  SURAHS, JUZ_START_PAGES, QURAN_TOTAL_PAGES,
  quranPageSrc, getJuzByPage, getSurahByPage,
} from '../data/quranData';
import {
  loadQuranLastPage, saveQuranLastPage, loadQuranBookmarks, saveQuranBookmarks,
  loadQuranNightMode, saveQuranNightMode, loadQuranReadToday, markQuranPageRead,
} from '../utils/quranStorage';
import { sound } from '../utils/sound';

interface QuranReaderProps {
  onBackToHome?: () => void;
}

type ListTab = 'surah' | 'juz' | 'bookmark';

const normalize = (s: string) => s.toLowerCase().replace(/['’`\-\s]/g, '');

export const QuranReader: React.FC<QuranReaderProps> = ({ onBackToHome }) => {
  const [view, setView] = useState<'list' | 'reader'>('list');
  const [tab, setTab] = useState<ListTab>('surah');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState<number>(() => loadQuranLastPage() ?? 1);
  const [lastPage, setLastPage] = useState<number | null>(() => loadQuranLastPage());
  const [bookmarks, setBookmarks] = useState<number[]>(loadQuranBookmarks);
  const [night, setNight] = useState<boolean>(loadQuranNightMode);
  const [readToday, setReadToday] = useState<number>(() => loadQuranReadToday().length);
  const [jumpValue, setJumpValue] = useState('');
  const [imgLoaded, setImgLoaded] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  // ---- Navigasi halaman ----
  const goToPage = useCallback((target: number) => {
    const next = Math.min(QURAN_TOTAL_PAGES, Math.max(1, Math.round(target) || 1));
    setPage(next);
    setImgLoaded(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const openReaderAt = useCallback((target: number) => {
    sound.playClick();
    goToPage(target);
    setView('reader');
  }, [goToPage]);

  const nextPage = useCallback(() => {
    if (page < QURAN_TOTAL_PAGES) { sound.playClick(); goToPage(page + 1); }
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    if (page > 1) { sound.playClick(); goToPage(page - 1); }
  }, [page, goToPage]);

  // Simpan halaman terakhir saat membaca
  useEffect(() => {
    if (view !== 'reader') return;
    saveQuranLastPage(page);
    setLastPage(page);
  }, [view, page]);

  // Tandai "dibaca hari ini" jika halaman dibuka >= 4 detik
  useEffect(() => {
    if (view !== 'reader') return;
    const t = setTimeout(() => setReadToday(markQuranPageRead(page)), 4000);
    return () => clearTimeout(t);
  }, [view, page]);

  // Preload halaman sebelum & sesudahnya
  useEffect(() => {
    if (view !== 'reader') return;
    [page + 1, page - 1].forEach((p) => {
      if (p >= 1 && p <= QURAN_TOTAL_PAGES) {
        const img = new Image();
        img.src = quranPageSrc(p);
      }
    });
  }, [view, page]);

  // Keyboard: mushaf dibaca dari kanan ke kiri -> panah kiri = halaman berikutnya
  useEffect(() => {
    if (view !== 'reader') return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') nextPage();
      else if (e.key === 'ArrowRight') prevPage();
      else if (e.key === 'Escape') setView('list');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, nextPage, prevPage]);

  // Swipe: geser jari ke kanan = halaman berikutnya (seperti membalik mushaf)
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8) {
      if (dx > 0) nextPage();
      else prevPage();
    }
  };

  const toggleBookmark = () => {
    sound.playClick();
    setBookmarks((prev) => {
      const next = prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page].sort((a, b) => a - b);
      saveQuranBookmarks(next);
      return next;
    });
  };

  const removeBookmark = (p: number) => {
    sound.playClick();
    setBookmarks((prev) => {
      const next = prev.filter((x) => x !== p);
      saveQuranBookmarks(next);
      return next;
    });
  };

  const toggleNight = () => {
    sound.playClick();
    setNight((n) => { saveQuranNightMode(!n); return !n; });
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(jumpValue, 10);
    if (!Number.isNaN(n)) goToPage(n);
    setJumpValue('');
  };

  // ---- Daftar surah terfilter ----
  const filteredSurahs = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return SURAHS;
    return SURAHS.filter((s) =>
      String(s.number) === q ||
      normalize(s.latin).includes(q) ||
      normalize(s.meaning).includes(q) ||
      s.arabic.includes(query.trim())
    );
  }, [query]);

  const currentSurah = getSurahByPage(page);
  const currentJuz = getJuzByPage(page);
  const lastSurah = lastPage ? getSurahByPage(lastPage) : null;

  // =========================== READER ===========================
  if (view === 'reader') {
    const isBookmarked = bookmarkSet.has(page);
    return (
      <div className="space-y-3 pb-28">
        {/* Top bar */}
        <div className="bg-[#1A1B22] border-2 border-[#2E303B] rounded-xs p-2.5 flex items-center justify-between gap-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D7FF3F] via-[#A3E635] to-transparent" />
          <button
            onClick={() => { sound.playClick(); setView('list'); }}
            className="flex items-center gap-1.5 text-xs font-tech font-bold text-[#D7FF3F] uppercase shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">DAFTAR</span>
          </button>

          <div className="flex-1 min-w-0 text-center">
            <div className="font-tech text-sm font-bold text-[#F3F0E8] uppercase truncate">
              {currentSurah.latin} <span className="font-arabic text-base leading-none align-middle text-[#D7FF3F]">{currentSurah.arabic}</span>
            </div>
            <div className="font-tech text-[10px] text-[#A5A6AC] uppercase tracking-wider">
              JUZ {currentJuz} • HAL {page} / {QURAN_TOTAL_PAGES}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleNight}
              className="p-2 rounded-xs border border-[#2E303B] text-[#A5A6AC] hover:text-[#F3F0E8] active:scale-95"
              title={night ? 'Mode terang' : 'Mode malam'}
            >
              {night ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-xs border active:scale-95 transition-colors ${
                isBookmarked
                  ? 'bg-[#D7FF3F] border-[#D7FF3F] text-[#101114]'
                  : 'border-[#2E303B] text-[#A5A6AC] hover:text-[#F3F0E8]'
              }`}
              title="Bookmark halaman"
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Page image */}
        <div
          className="max-w-md mx-auto border border-[#2E303B] rounded-xs overflow-hidden select-none"
          style={{ aspectRatio: '725 / 1112', background: night ? '#0b0c0f' : '#ffffff' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={page}
            src={quranPageSrc(page)}
            alt={`Al-Qur'an halaman ${page}`}
            draggable={false}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-contain transition-opacity duration-150 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={night ? { filter: 'invert(1) brightness(0.88)' } : undefined}
          />
        </div>

        {/* Controls */}
        <div className="max-w-md mx-auto space-y-2.5">
          <div className="flex items-center gap-2">
            {/* Mushaf RTL: tombol kiri = halaman berikutnya */}
            <button
              onClick={nextPage}
              disabled={page >= QURAN_TOTAL_PAGES}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#1A1B22] border border-[#2E303B] hover:border-[#D7FF3F] text-xs font-tech font-bold uppercase text-[#F3F0E8] disabled:opacity-30 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 text-[#D7FF3F]" />
              <span>BERIKUTNYA</span>
            </button>
            <button
              onClick={prevPage}
              disabled={page <= 1}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#1A1B22] border border-[#2E303B] hover:border-[#D7FF3F] text-xs font-tech font-bold uppercase text-[#F3F0E8] disabled:opacity-30 active:scale-95"
            >
              <span>SEBELUMNYA</span>
              <ChevronRight className="w-4 h-4 text-[#D7FF3F]" />
            </button>
          </div>

          <input
            type="range"
            dir="rtl"
            min={1}
            max={QURAN_TOTAL_PAGES}
            value={page}
            onChange={(e) => goToPage(parseInt(e.target.value, 10))}
            className="w-full accent-[#D7FF3F]"
            aria-label="Geser untuk pindah halaman"
          />

          <form onSubmit={handleJump} className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#1A1B22] border border-[#2E303B] px-3 py-2">
              <Hash className="w-4 h-4 text-[#A5A6AC]" />
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={QURAN_TOTAL_PAGES}
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
                placeholder={`Loncat ke halaman (1-${QURAN_TOTAL_PAGES})`}
                className="w-full bg-transparent text-sm text-[#F3F0E8] placeholder:text-[#6B6C73] outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#D7FF3F] text-[#101114] font-tech font-bold text-xs uppercase cut-corner-tr-sm active:scale-95"
            >
              GO
            </button>
          </form>
          <p className="text-center text-[10px] font-tech text-[#6B6C73] uppercase tracking-wider">
            GESER KE KANAN = HALAMAN BERIKUTNYA • PANAH ← / → DI KEYBOARD
          </p>
        </div>
      </div>
    );
  }

  // ============================ LIST ============================
  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="bg-[#1A1B22] border-2 border-[#2E303B] rounded-xs p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D7FF3F] via-[#A3E635] to-transparent" />
        <div className="flex items-center gap-2 mb-1.5">
          {onBackToHome && (
            <button
              onClick={() => { sound.playClick(); onBackToHome(); }}
              className="p-1 text-[#A5A6AC] hover:text-[#F3F0E8] transition-colors"
              title="Kembali ke Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="font-tech text-xs font-bold uppercase tracking-widest text-[#D7FF3F] bg-[#101114] border border-[#2E303B] px-2 py-0.5">
            MUSHAF // 604 HALAMAN • RIWAYAT HAFS
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F3F0E8] uppercase tracking-tight">
          AL-QUR'AN AL-KARIM
        </h1>
        <p className="text-xs text-[#A5A6AC] mt-0.5">
          Baca mushaf per halaman, lompat per surah atau juz, dan simpan bookmark.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 font-tech text-[11px] font-bold uppercase text-[#F3F0E8] bg-[#101114] border border-[#2E303B] px-2.5 py-1">
          <BookMarked className="w-3.5 h-3.5 text-[#D7FF3F]" />
          HARI INI: {readToday} HALAMAN DIBACA
        </div>
      </div>

      {/* Continue reading */}
      <button
        onClick={() => openReaderAt(lastPage ?? 1)}
        className="w-full text-left bg-gradient-to-r from-[#181A22] via-[#1A1C26] to-[#14151C] border-2 border-[#2E303B] hover:border-[#D7FF3F] cut-corner-card p-4 flex items-center justify-between gap-3 group transition-all active:scale-[0.99]"
      >
        <div className="min-w-0">
          <div className="font-tech text-[10px] font-bold uppercase tracking-widest text-[#D7FF3F]">
            {lastPage ? 'LANJUTKAN MEMBACA' : 'MULAI MEMBACA'}
          </div>
          <div className="font-display text-lg font-bold text-[#F3F0E8] uppercase truncate">
            {lastPage && lastSurah ? `${lastSurah.latin} • HAL ${lastPage}` : 'AL-FATIHAH • HAL 1'}
          </div>
        </div>
        <span className="shrink-0 w-10 h-10 bg-[#D7FF3F] text-[#101114] flex items-center justify-center cut-corner-tr-sm">
          <Play className="w-4 h-4" fill="currentColor" />
        </span>
      </button>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5">
        {([
          ['surah', 'SURAH'],
          ['juz', 'JUZ'],
          ['bookmark', `BOOKMARK${bookmarks.length ? ` (${bookmarks.length})` : ''}`],
        ] as Array<[ListTab, string]>).map(([id, label]) => (
          <button
            key={id}
            onClick={() => { sound.playClick(); setTab(id); }}
            className={`py-2 font-tech text-xs font-bold uppercase tracking-wider border transition-colors active:scale-95 ${
              tab === id
                ? 'bg-[#D7FF3F] text-[#101114] border-[#D7FF3F]'
                : 'bg-[#1A1B22] text-[#A5A6AC] border-[#2E303B] hover:text-[#F3F0E8]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* SURAH tab */}
      {tab === 'surah' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-[#1A1B22] border border-[#2E303B] px-3 py-2.5">
            <Search className="w-4 h-4 text-[#A5A6AC]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari surah (nama, arti, atau nomor)…"
              className="w-full bg-transparent text-sm text-[#F3F0E8] placeholder:text-[#6B6C73] outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-[#A5A6AC] hover:text-[#F3F0E8]" title="Hapus">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid gap-1.5 sm:grid-cols-2">
            {filteredSurahs.map((s) => (
              <button
                key={s.number}
                onClick={() => openReaderAt(s.page)}
                className="flex items-center gap-3 bg-[#16171E] hover:bg-[#1A1B22] border border-[#2E303B] hover:border-[#D7FF3F] px-3 py-2.5 text-left transition-colors active:scale-[0.99]"
              >
                <span className="shrink-0 w-9 h-9 flex items-center justify-center bg-[#101114] border border-[#2E303B] cut-corner-tr-sm font-tech text-sm font-bold text-[#D7FF3F]">
                  {s.number}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-tech text-sm font-bold text-[#F3F0E8] uppercase truncate">{s.latin}</span>
                  <span className="block text-[11px] text-[#A5A6AC] truncate">
                    {s.meaning} • {s.ayahs} ayat • hal {s.page}
                  </span>
                </span>
                <span className="font-arabic text-xl leading-none text-[#F3F0E8] shrink-0">{s.arabic}</span>
              </button>
            ))}
            {filteredSurahs.length === 0 && (
              <div className="sm:col-span-2 text-center text-xs text-[#A5A6AC] py-8 border border-dashed border-[#2E303B]">
                Surah tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      )}

      {/* JUZ tab */}
      {tab === 'juz' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {JUZ_START_PAGES.map((startPage, i) => {
            const s = getSurahByPage(startPage);
            return (
              <button
                key={i}
                onClick={() => openReaderAt(startPage)}
                className="bg-[#16171E] hover:bg-[#1A1B22] border border-[#2E303B] hover:border-[#D7FF3F] px-3 py-3 text-left transition-colors active:scale-[0.99]"
              >
                <span className="block font-tech text-base font-bold text-[#D7FF3F] uppercase">JUZ {i + 1}</span>
                <span className="block text-[11px] text-[#A5A6AC] truncate">{s.latin} • hal {startPage}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* BOOKMARK tab */}
      {tab === 'bookmark' && (
        <div className="space-y-1.5">
          {bookmarks.length === 0 ? (
            <div className="text-center text-xs text-[#A5A6AC] py-10 border border-dashed border-[#2E303B]">
              Belum ada bookmark. Tekan ikon bookmark saat membaca untuk menyimpan halaman.
            </div>
          ) : (
            bookmarks.map((p) => {
              const s = getSurahByPage(p);
              return (
                <div key={p} className="flex items-center gap-2 bg-[#16171E] border border-[#2E303B] hover:border-[#D7FF3F] transition-colors">
                  <button onClick={() => openReaderAt(p)} className="flex-1 min-w-0 text-left px-3 py-2.5">
                    <span className="block font-tech text-sm font-bold text-[#F3F0E8] uppercase truncate">
                      HAL {p} • {s.latin}
                    </span>
                    <span className="block text-[11px] text-[#A5A6AC]">Juz {getJuzByPage(p)}</span>
                  </button>
                  <button
                    onClick={() => removeBookmark(p)}
                    className="p-3 text-[#A5A6AC] hover:text-[#F04438]"
                    title="Hapus bookmark"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
