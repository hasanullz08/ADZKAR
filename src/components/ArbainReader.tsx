import React, { useState, useMemo, useRef, useCallback, memo } from 'react';
import { 
  Search, BookOpen, ChevronLeft, ChevronRight, Bookmark, 
  Copy, Check, ArrowLeft, Download, FileText, 
  Sparkles, X, ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import { ARBAIN_HADITHS, ARBAIN_PDF_PATH, ArbainHadith } from '../data/arbainData';
import { sound } from '../utils/sound';
import { UserSettings } from '../utils/storage';

interface ArbainReaderProps {
  settings: UserSettings;
  onBackToHome?: () => void;
}

export const ArbainReader: React.FC<ArbainReaderProps> = memo(({
  settings,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('ALL');
  const [activeBatch, setActiveBatch] = useState<'1-10' | '11-20' | '21-30' | '31-42' | 'all'>('all');
  const [activeHadithIndex, setActiveHadithIndex] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Store last list scroll position to restore when returning from detail view
  const listScrollPosRef = useRef<number>(0);

  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('adzkar_arbain_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const bookmarkSet = useMemo(() => new Set(bookmarkedIds), [bookmarkedIds]);

  // Extract unique themes once
  const themes = useMemo(() => {
    const list = Array.from(new Set(ARBAIN_HADITHS.map((h) => h.theme)));
    return ['ALL', ...list];
  }, []);

  // Filtered hadiths based on batch, search query, and theme
  const filteredHadiths = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return ARBAIN_HADITHS.filter((h) => {
      // Batch check (only if not searching)
      if (q === '') {
        if (activeBatch === '1-10' && (h.number < 1 || h.number > 10)) return false;
        if (activeBatch === '11-20' && (h.number < 11 || h.number > 20)) return false;
        if (activeBatch === '21-30' && (h.number < 21 || h.number > 30)) return false;
        if (activeBatch === '31-42' && (h.number < 31 || h.number > 42)) return false;
      }

      // Theme check
      if (selectedTheme !== 'ALL' && h.theme !== selectedTheme) return false;

      // Search query check
      if (q !== '') {
        const matches = 
          h.number.toString() === q ||
          h.title.toLowerCase().includes(q) ||
          h.narrator.toLowerCase().includes(q) ||
          h.translation.toLowerCase().includes(q) ||
          h.theme.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [searchQuery, selectedTheme, activeBatch]);

  // Handle open detailed hadith
  const handleOpenDetail = useCallback((index: number) => {
    sound.playClick();
    listScrollPosRef.current = window.scrollY;
    setActiveHadithIndex(index);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Handle close detailed hadith
  const handleCloseDetail = useCallback(() => {
    sound.playClick();
    setActiveHadithIndex(null);
    // Smoothly restore scroll position without jarring flash
    requestAnimationFrame(() => {
      window.scrollTo({ top: listScrollPosRef.current, behavior: 'instant' });
    });
  }, []);

  // Toggle card in-place expansion for fast browsing
  const handleToggleExpand = useCallback((num: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setExpandedCards((prev) => ({ ...prev, [num]: !prev[num] }));
  }, []);

  const toggleBookmark = useCallback((num: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    setBookmarkedIds((prev) => {
      const next = prev.includes(num) ? prev.filter((id) => id !== num) : [...prev, num];
      if (typeof window !== 'undefined') {
        localStorage.setItem('adzkar_arbain_bookmarks', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const handleCopyHadith = useCallback((hadith: ArbainHadith, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    const text = `[Hadits ke-${hadith.number}: ${hadith.title}]\n\n${hadith.arabic}\n\nArtinya:\n"${hadith.translation}"\n\n(Takhrij: ${hadith.takhrij}) — via ADZKAR`;
    navigator.clipboard.writeText(text);
    setCopiedId(hadith.number);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const activeHadith = activeHadithIndex !== null ? ARBAIN_HADITHS[activeHadithIndex] : null;

  // Font size calculation for Arabic
  const arabicSizeClass = 
    settings.arabicFontSize === 'xlarge'
      ? 'text-2xl sm:text-3xl leading-[2.6]'
      : settings.arabicFontSize === 'large'
      ? 'text-xl sm:text-2xl leading-[2.4]'
      : 'text-lg sm:text-xl leading-[2.2]';

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Header Protocol Frame */}
      <div className="bg-[#1A1B22] border-2 border-[#2E303B] rounded-xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D7FF3F] via-[#A3E635] to-transparent" />

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {onBackToHome && (
              <button
                onClick={() => {
                  sound.playClick();
                  onBackToHome();
                }}
                className="p-1 text-[#A5A6AC] hover:text-[#F3F0E8] transition-colors"
                title="Kembali ke Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="font-tech text-xs font-bold uppercase tracking-widest text-[#D7FF3F] bg-[#101114] border border-[#2E303B] px-2 py-0.5">
              SPECIAL ARCHIVE // 42 HADITS ARBA'IN NAWAWI
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F3F0E8] uppercase tracking-tight">
            ARBA'IN AN-NAWAWI
          </h1>
          <p className="text-xs text-[#A5A6AC] mt-0.5">
            Matan Arab Berharakat Lengkap, Terjemahan Bahasa Indonesia & Takhrij Terpercaya.
          </p>
        </div>

        {/* View PDF In-App Button */}
        <button
          onClick={() => {
            sound.playClick();
            setShowPdfModal(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#101114] hover:bg-[#202129] border border-[#2E303B] hover:border-[#D7FF3F] text-xs font-tech font-bold text-[#F3F0E8] rounded-xs transition-colors shrink-0 active:scale-95"
        >
          <FileText className="w-4 h-4 text-[#D7FF3F]" />
          <span>LIHAT DOKUMEN PDF ASLI</span>
        </button>
      </div>

      {/* 2. Focused Reader Mode vs Grid List View */}
      {activeHadith ? (
        /* Detailed Focused Reader View */
        <div className="space-y-4">
          {/* Top Reader Bar */}
          <div className="flex items-center justify-between bg-[#1A1B22] border border-[#2E303B] rounded-xs p-3">
            <button
              onClick={handleCloseDetail}
              className="flex items-center gap-1.5 text-xs font-tech font-bold text-[#D7FF3F] hover:underline uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>KEMBALI KE DAFTAR HADITS</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleBookmark(activeHadith.number, e)}
                className={`p-2 rounded-xs border transition-colors ${
                  bookmarkSet.has(activeHadith.number)
                    ? 'bg-[#D7FF3F] text-[#101114] border-[#D7FF3F]'
                    : 'bg-[#101114] text-[#A5A6AC] border-[#2E303B] hover:text-[#F3F0E8]'
                }`}
                title="Tandai Hadits Favorit"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => handleCopyHadith(activeHadith, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#101114] border border-[#2E303B] hover:border-[#D7FF3F] text-xs font-tech font-bold text-[#F3F0E8] rounded-xs transition-colors"
                title="Salin Teks Hadits"
              >
                {copiedId === activeHadith.number ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#D7FF3F]" />
                    <span className="text-[#D7FF3F]">TERSALIN</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>SALIN HADITS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Reading Card */}
          <div className="bg-[#16171E] border-2 border-[#2E303B] rounded-xs p-5 sm:p-7 space-y-5 relative">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#24262E] pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-tech text-base font-bold text-[#D7FF3F] bg-[#101114] border border-[#2E303B] px-2 py-0.5">
                  HADITS KE-{activeHadith.number}
                </span>
                <span className="font-tech text-[#A5A6AC] uppercase tracking-wider">
                  TEMA: <strong className="text-[#F3F0E8]">{activeHadith.theme}</strong>
                </span>
              </div>

              <span className="text-xs text-[#A5A6AC]">
                Perawi: <strong className="text-[#F3F0E8]">{activeHadith.narrator}</strong>
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F3F0E8]">
              {activeHadith.title}
            </h2>

            {/* Arabic Matan with diacritics */}
            <div className="py-4 bg-[#101114] p-4 sm:p-6 border border-[#262832] rounded-xs">
              <p className={`font-arabic text-[#F3F0E8] text-right font-normal tracking-wide select-text ${arabicSizeClass}`}>
                {activeHadith.arabic}
              </p>
            </div>

            {/* Indonesian Translation */}
            <div className="p-4 bg-[#1A1B22] border-l-2 border-[#D7FF3F] text-sm sm:text-base text-[#F3F0E8]/90 leading-relaxed font-sans space-y-1 rounded-r-xs">
              <span className="block font-tech text-xs text-[#D7FF3F] uppercase tracking-wider font-bold mb-1">
                TERJEMAHAN BAHASA INDONESIA:
              </span>
              <p>"{activeHadith.translation}"</p>
            </div>

            {/* Takhrij / Sumber Riwayat */}
            <div className="bg-[#101114] p-3 text-xs text-[#A5A6AC] border border-[#24262E] space-y-1 rounded-xs">
              <span className="font-tech text-[10px] text-[#A5A6AC] uppercase tracking-wider block font-bold">
                TAKHRIJ & DERAJAT HADITS:
              </span>
              <p className="font-mono text-[#F3F0E8]">{activeHadith.takhrij}</p>
            </div>

            {/* Hadith Benefits */}
            {activeHadith.benefits && (
              <div className="flex items-start gap-2 bg-[#1A1B22] p-3 text-xs text-[#A5A6AC] border border-[#2E303B] rounded-xs">
                <Sparkles className="w-4 h-4 text-[#D7FF3F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F3F0E8] block mb-0.5">Faedah Hadits:</strong>
                  <span>{activeHadith.benefits}</span>
                </div>
              </div>
            )}

            {/* Next / Previous Navigation */}
            <div className="flex items-center justify-between border-t border-[#24262E] pt-4">
              <button
                onClick={() => {
                  if (activeHadithIndex === null) return;
                  sound.playClick();
                  setActiveHadithIndex(Math.max(0, activeHadithIndex - 1));
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                disabled={activeHadithIndex === 0}
                className={`flex items-center gap-1.5 px-4 py-2 font-tech text-xs font-bold uppercase rounded-xs border transition-all ${
                  activeHadithIndex === 0
                    ? 'opacity-40 cursor-not-allowed border-transparent text-[#A5A6AC]'
                    : 'bg-[#1A1B22] border-[#2E303B] text-[#F3F0E8] hover:border-[#D7FF3F]'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>HADITS SEBELUMNYA</span>
              </button>

              <span className="font-mono text-xs text-[#A5A6AC]">
                {activeHadith.number} / 42
              </span>

              <button
                onClick={() => {
                  if (activeHadithIndex === null) return;
                  sound.playClick();
                  setActiveHadithIndex(Math.min(ARBAIN_HADITHS.length - 1, activeHadithIndex + 1));
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                disabled={activeHadithIndex === ARBAIN_HADITHS.length - 1}
                className={`flex items-center gap-1.5 px-4 py-2 font-tech text-xs font-bold uppercase rounded-xs border transition-all ${
                  activeHadithIndex === ARBAIN_HADITHS.length - 1
                    ? 'opacity-40 cursor-not-allowed border-transparent text-[#A5A6AC]'
                    : 'bg-[#D7FF3F] border-[#D7FF3F] text-[#101114] hover:bg-[#cbf534]'
                }`}
              >
                <span>HADITS SELANJUTNYA</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid / Search List View */
        <div className="space-y-4">
          {/* Search & Batch Filter Controls */}
          <div className="bg-[#1A1B22] border border-[#2E303B] rounded-xs p-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A5A6AC]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor hadits (1-42), judul, atau kata kunci..."
                className="w-full bg-[#101114] border border-[#2E303B] focus:border-[#D7FF3F] pl-9 pr-4 py-2 text-xs font-tech text-[#F3F0E8] placeholder:text-[#6A6C77] rounded-xs outline-none transition-colors"
              />
            </div>

            {/* Batch Navigation Tabs */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-[#24262E] pb-2 text-xs">
              <span className="font-tech text-[10px] text-[#A5A6AC] uppercase tracking-wider shrink-0">
                PILIH BAGIAN:
              </span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'all', label: 'SEMUA (42)' },
                  { id: '1-10', label: '1 - 10' },
                  { id: '11-20', label: '11 - 20' },
                  { id: '21-30', label: '21 - 30' },
                  { id: '31-42', label: '31 - 42' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveBatch(b.id as typeof activeBatch);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-tech font-bold uppercase rounded-xs border transition-colors shrink-0 ${
                      activeBatch === b.id
                        ? 'bg-[#D7FF3F] text-[#101114] border-[#D7FF3F]'
                        : 'bg-[#101114] text-[#A5A6AC] border-[#262832] hover:text-[#F3F0E8]'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Horizontal Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {themes.map((t) => {
                const isActive = selectedTheme === t;
                return (
                  <button
                    key={t}
                    onClick={() => {
                      sound.playClick();
                      setSelectedTheme(t);
                    }}
                    className={`shrink-0 px-2 py-0.5 text-[10px] font-tech font-bold uppercase rounded-xs border transition-colors ${
                      isActive
                        ? 'bg-[#F3F0E8] text-[#101114] border-[#F3F0E8]'
                        : 'bg-[#14151B] text-[#A5A6AC] border-[#262832] hover:text-[#F3F0E8]'
                    }`}
                  >
                    {t === 'ALL' ? 'SEMUA TEMA' : t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bookmarked Filter Quick Tag */}
          {bookmarkedIds.length > 0 && (
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-tech text-[#D7FF3F]">
                ★ {bookmarkedIds.length} HADITS DITANDAI FAVORIT
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  setSearchQuery('');
                  setSelectedTheme('ALL');
                  setActiveBatch('all');
                }}
                className="text-[11px] font-tech text-[#A5A6AC] hover:underline"
              >
                RESET FILTER
              </button>
            </div>
          )}

          {/* Hadith Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredHadiths.map((h) => {
              const originalIndex = h.number - 1; // Since hadiths are 1-indexed and in sequential order
              const isFav = bookmarkSet.has(h.number);
              const isExpanded = !!expandedCards[h.number];

              return (
                <div
                  key={h.number}
                  className="bg-[#1A1B22] border border-[#2E303B] hover:border-[#D7FF3F] p-4 flex flex-col justify-between transition-colors rounded-xs relative group"
                >
                  {/* Top row */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#D7FF3F] bg-[#101114] px-2 py-0.5 border border-[#2E303B] rounded-2xs">
                          NO. {String(h.number).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-tech text-[#A5A6AC] uppercase truncate max-w-[150px]">
                          {h.theme}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleCopyHadith(h, e)}
                          className="p-1 text-xs text-[#6A6C77] hover:text-[#F3F0E8] transition-colors"
                          title="Salin Hadits"
                        >
                          {copiedId === h.number ? (
                            <Check className="w-3.5 h-3.5 text-[#D7FF3F]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => toggleBookmark(h.number, e)}
                          className={`p-1 text-xs transition-colors ${
                            isFav ? 'text-[#D7FF3F]' : 'text-[#6A6C77] hover:text-[#F3F0E8]'
                          }`}
                          title="Simpan Hadits"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 
                      onClick={() => handleOpenDetail(originalIndex)}
                      className="font-display text-base font-bold text-[#F3F0E8] group-hover:text-[#D7FF3F] transition-colors cursor-pointer"
                    >
                      {h.title}
                    </h3>
                    
                    {/* Perawi subtitle */}
                    <p className="text-[11px] font-tech text-[#A5A6AC] mt-0.5">
                      Perawi: <span className="text-[#F3F0E8]">{h.narrator.split(' radhiyallahu')[0]}</span>
                    </p>

                    {/* Preview Translation or Full In-place Expansion */}
                    {isExpanded ? (
                      <div className="mt-3 pt-3 border-t border-[#262832] space-y-3">
                        <div className="bg-[#101114] p-3 border border-[#262832] rounded-xs">
                          <p className={`font-arabic text-[#F3F0E8] text-right ${arabicSizeClass}`}>
                            {h.arabic}
                          </p>
                        </div>
                        <p className="text-xs text-[#F3F0E8]/90 italic leading-relaxed">
                          "{h.translation}"
                        </p>
                        <p className="text-[10px] font-mono text-[#A5A6AC]">
                          {h.takhrij}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#A5A6AC] mt-2 line-clamp-2 leading-relaxed">
                        "{h.translation}"
                      </p>
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="mt-3 pt-2.5 border-t border-[#24262E] flex items-center justify-between text-xs font-tech">
                    {/* Quick Peek In-place button */}
                    <button
                      onClick={(e) => handleToggleExpand(h.number, e)}
                      className="text-[#A5A6AC] hover:text-[#F3F0E8] flex items-center gap-1 uppercase transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5 text-[#D7FF3F]" />
                          <span>TUTUP MATAN</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-[#D7FF3F]" />
                          <span>INTIP MATAN</span>
                        </>
                      )}
                    </button>

                    {/* Full Reader Mode button */}
                    <button
                      onClick={() => handleOpenDetail(originalIndex)}
                      className="px-2.5 py-1 bg-[#D7FF3F] hover:bg-[#cbf534] text-[#101114] font-bold font-tech uppercase rounded-2xs flex items-center gap-1 transition-transform active:scale-95"
                    >
                      <span>BACA LENGKAP</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredHadiths.length === 0 && (
            <div className="p-8 text-center bg-[#1A1B22] border border-[#2E303B] rounded-xs space-y-2">
              <p className="font-tech text-sm text-[#A5A6AC] uppercase">
                TIDAK DITEMUKAN HADITS YANG SESUAI FILTER
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTheme('ALL');
                  setActiveBatch('all');
                }}
                className="text-xs font-tech text-[#D7FF3F] uppercase underline"
              >
                RESET FILTER PENCARIAN
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. In-App PDF Viewer Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-4xl h-[88vh] bg-[#16171E] border-2 border-[#D7FF3F] rounded-xs flex flex-col overflow-hidden">
            <div className="bg-[#1A1B22] border-b border-[#2E303B] p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D7FF3F]" />
                <span className="font-tech text-xs font-bold uppercase text-[#F3F0E8] tracking-wider">
                  DOKUMEN PDF // HADITS ARBA'IN NAWAWI (PUSTAKA SYABAB)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={ARBAIN_PDF_PATH}
                  download="Hadits_Arbain_Nawawi_Pustaka_Syabab.pdf"
                  className="px-2.5 py-1 bg-[#D7FF3F] text-[#101114] text-[11px] font-tech font-bold uppercase rounded-2xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>UNDUH PDF</span>
                </a>

                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-1 text-[#A5A6AC] hover:text-[#F3F0E8] transition-colors"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF iframe with direct download banner */}
            <div className="flex-1 w-full bg-[#101114] relative flex flex-col">
              <div className="bg-[#1A1B22]/90 px-3 py-1.5 text-[11px] text-[#A5A6AC] font-tech flex items-center justify-between border-b border-[#262832]">
                <span>TIPS: Seluruh 42 Hadits sudah terintegrasi lengkap di aplikasi ini tanpa harus membuka PDF.</span>
                <a 
                  href={ARBAIN_PDF_PATH} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#D7FF3F] hover:underline"
                >
                  Buka Tab Baru ↗
                </a>
              </div>
              <iframe
                src={`${ARBAIN_PDF_PATH}#toolbar=1`}
                className="flex-1 w-full border-none"
                title="Hadits Arbain Nawawi PDF"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ArbainReader.displayName = 'ArbainReader';
