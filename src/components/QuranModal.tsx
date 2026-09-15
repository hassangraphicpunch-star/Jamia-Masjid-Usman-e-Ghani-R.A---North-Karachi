import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  BookOpen,
  Play,
  Pause,
  Volume2,
  Search,
  Check,
  Copy,
  Download,
  Share2,
  ExternalLink,
  Sparkles,
  Heart,
  Globe,
  Headphones,
  Info,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ListFilter,
  Layers,
  Sliders,
} from 'lucide-react';
import { Language, QuranReciter, QuranSurahItem, QuranAyah } from '../types';
import {
  QURAN_SERVICE_INFO,
  QURAN_RECITERS,
  getSurahAudioUrl,
} from '../data/quranServiceData';
import { ALL_114_SURAHS } from '../data/allSurahsData';
import {
  QURAN_TRANSLATIONS,
  fetchSurahVersesAndTranslation,
} from '../services/quranApiService';

interface QuranModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const QuranModal: React.FC<QuranModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isUrdu = language === 'ur';

  // Active Surah & Reciter & Translation
  const [selectedSurah, setSelectedSurah] = useState<QuranSurahItem>(ALL_114_SURAHS[0]);
  const [selectedReciter, setSelectedReciter] = useState<QuranReciter>(QURAN_RECITERS[0]);
  const [selectedTranslationId, setSelectedTranslationId] = useState<string>('ur.maududi');

  // Active View Mode: 'reader' (Ayahs with translation) | 'directory' (114 Surahs grid)
  const [activeTab, setActiveTab] = useState<'reader' | 'directory'>('reader');

  // Verses state
  const [ayahs, setAyahs] = useState<QuranAyah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(false);
  const [fontSizeClass, setFontSizeClass] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [surahFilter, setSurahFilter] = useState<'all' | 'meccan' | 'medinan' | 'juz1_10' | 'juz11_20' | 'juz21_30'>('all');
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);

  // Load verses when selectedSurah or selectedTranslation changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingAyahs(true);

    fetchSurahVersesAndTranslation(selectedSurah.number, selectedTranslationId)
      .then((res) => {
        if (isMounted) {
          setAyahs(res.ayahs);
          setIsLoadingAyahs(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoadingAyahs(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSurah.number, selectedTranslationId]);

  // Audio URL for current surah & reciter
  const audioUrl = useMemo(
    () => getSurahAudioUrl(selectedSurah.number, selectedReciter.id),
    [selectedSurah.number, selectedReciter.id]
  );

  // Handle Play/Pause
  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Playback notice:', e);
      });
    }
  };

  // Reset audio when surah or reciter changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setAudioProgress(0);
    }
  }, [selectedSurah.number, selectedReciter.id]);

  // Switch to next or previous Surah
  const handleNavigateSurah = (direction: 'prev' | 'next') => {
    const currentIndex = ALL_114_SURAHS.findIndex((s) => s.number === selectedSurah.number);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedSurah(ALL_114_SURAHS[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < ALL_114_SURAHS.length - 1) {
      setSelectedSurah(ALL_114_SURAHS[currentIndex + 1]);
    }
  };

  // Filter 114 Surahs list
  const filteredSurahs = useMemo(() => {
    return ALL_114_SURAHS.filter((s) => {
      // Type / Juz Filter
      if (surahFilter === 'meccan' && s.revelationType !== 'Meccan') return false;
      if (surahFilter === 'medinan' && s.revelationType !== 'Medinan') return false;
      if (surahFilter === 'juz1_10' && (s.juzNumber < 1 || s.juzNumber > 10)) return false;
      if (surahFilter === 'juz11_20' && (s.juzNumber < 11 || s.juzNumber > 20)) return false;
      if (surahFilter === 'juz21_30' && (s.juzNumber < 21 || s.juzNumber > 30)) return false;

      // Search Query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        s.nameEn.toLowerCase().includes(q) ||
        s.nameUr.includes(q) ||
        s.nameAr.includes(q) ||
        s.englishMeaning.toLowerCase().includes(q) ||
        s.number.toString() === q
      );
    });
  }, [searchQuery, surahFilter]);

  // Copy Ayah with translation
  const handleCopyAyah = async (ayah: QuranAyah) => {
    const currentTranslation = QURAN_TRANSLATIONS.find((t) => t.id === selectedTranslationId);
    const text = `📖 ${selectedSurah.nameUr} (${selectedSurah.nameAr}) - آیت #${ayah.numberInSurah}\n\n${ayah.textArabic}\n\nترجمہ (${currentTranslation?.name}):\n${ayah.translation}\n\n(جامع مسجد عثمانِ غنی نارتھ کراچی - قرآن پورٹل)`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedAyahNumber(ayah.numberInSurah);
        setTimeout(() => setCopiedAyahNumber(null), 2500);
      }
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  // Font size styling
  const arabicTextSizeClass =
    fontSizeClass === 'xlarge'
      ? 'text-2xl sm:text-3xl leading-[2.6]'
      : fontSizeClass === 'large'
      ? 'text-xl sm:text-2xl leading-[2.4]'
      : 'text-lg sm:text-xl leading-[2.2]';

  const transTextSizeClass =
    fontSizeClass === 'xlarge'
      ? 'text-base sm:text-lg'
      : fontSizeClass === 'large'
      ? 'text-sm sm:text-base'
      : 'text-xs sm:text-sm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden text-stone-100 ${
          isUrdu ? 'dir-rtl' : 'dir-ltr'
        }`}
      >
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setAudioProgress(audioRef.current.currentTime);
              setAudioDuration(audioRef.current.duration || 0);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Modal Top Header */}
        <div className="p-3.5 sm:p-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner shadow-emerald-900/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {isUrdu ? 'القرآن الکریم - مکمل 114 سورتیں و تمام تراجم' : 'The Holy Quran - All 114 Surahs & Translations'}
                </h3>
                <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 border border-amber-700 text-amber-300">
                  {isUrdu ? 'صدقۂ جاریہ' : 'Sadaqah Jariah'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
                {isUrdu
                  ? 'مکمل 114 سورتیں، 6236 آیات، 30 پارے، 10 مستند تراجم اور 13 قراء کرام کی صوتی تلاوت'
                  : 'Complete 114 Surahs, 6236 Verses, 30 Juz, 10 Authentic Translations & 13 Reciters'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar: Reader View vs 114 Surahs Directory */}
        <div className="bg-stone-950/80 border-b border-stone-800 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('reader')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'reader'
                  ? 'bg-emerald-600 text-stone-950 shadow-md shadow-emerald-950/50'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'تلاوت و ترجمہ (آیات)' : 'Read Verses & Translation'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'directory'
                  ? 'bg-emerald-600 text-stone-950 shadow-md shadow-emerald-950/50'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>
                {isUrdu ? 'فہرست تمام 114 سورتیں' : 'Browse All 114 Surahs'}
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-300 font-mono border border-emerald-800">
                114
              </span>
            </button>
          </div>

          {/* Quick Surah Selector Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 hidden md:inline">
              {isUrdu ? 'سورۃ بدلیں:' : 'Surah:'}
            </span>
            <select
              value={selectedSurah.number}
              onChange={(e) => {
                const s = ALL_114_SURAHS.find((item) => item.number === parseInt(e.target.value));
                if (s) {
                  setSelectedSurah(s);
                  setActiveTab('reader');
                }
              }}
              className="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-medium max-w-[200px]"
            >
              {ALL_114_SURAHS.map((s) => (
                <option key={s.number} value={s.number}>
                  #{s.number} - {s.nameUr} ({s.nameAr})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Audio Recitation Player Showcase Strip */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-emerald-900/40 p-3 sm:p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Surah Info & Prev/Next */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleNavigateSurah('prev')}
                disabled={selectedSurah.number === 1}
                className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 disabled:opacity-30 disabled:pointer-events-none"
                title="Previous Surah"
              >
                {isUrdu ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all shrink-0 shadow-lg ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-950/50'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-950/50 scale-105'
                }`}
                title={isPlaying ? 'Pause Recitation' : 'Play Recitation'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSurah('next')}
                disabled={selectedSurah.number === 114}
                className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 disabled:opacity-30 disabled:pointer-events-none"
                title="Next Surah"
              >
                {isUrdu ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-bold text-white">
                    {isUrdu ? selectedSurah.nameUr : selectedSurah.nameEn}
                  </span>
                  <span className="text-base font-bold font-arabic text-amber-300">
                    {selectedSurah.nameAr}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {selectedSurah.numberOfAyahs} {isUrdu ? 'آیات' : 'Verses'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-900 text-stone-400 border border-stone-800 hidden sm:inline">
                    {selectedSurah.revelationTypeUr} ({isUrdu ? `پارہ ${selectedSurah.juzNumber}` : `Juz ${selectedSurah.juzNumber}`})
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                  <Headphones className="w-3 h-3 text-emerald-400" />
                  <span>{selectedReciter.name} ({selectedReciter.style})</span>
                  {isPlaying && (
                    <span className="text-emerald-400 font-medium">
                      • {isUrdu ? 'تلاوت جاری ہے...' : 'Playing...'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Reciter Selector Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-xs text-stone-400 hidden sm:inline">
                {isUrdu ? 'قاری:' : 'Reciter:'}
              </div>
              <select
                value={selectedReciter.id}
                onChange={(e) => {
                  const r = QURAN_RECITERS.find((item) => item.id === parseInt(e.target.value));
                  if (r) setSelectedReciter(r);
                }}
                className="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                {QURAN_RECITERS.map((reciter) => (
                  <option key={reciter.id} value={reciter.id}>
                    {reciter.name} ({reciter.style})
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Tab 1: READER VIEW (Ayahs with Real Translation) */}
        {activeTab === 'reader' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col space-y-4">
            
            {/* Translation & Typography Controls Bar */}
            <div className="bg-stone-950/90 border border-stone-800/80 rounded-xl p-3 flex flex-col gap-2.5 shadow-inner">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Translation Selector Dropdown */}
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-stone-300">
                    {isUrdu ? 'مستند ترجمہ:' : 'Translation:'}
                  </span>
                  <select
                    value={selectedTranslationId}
                    onChange={(e) => setSelectedTranslationId(e.target.value)}
                    className="bg-stone-900 border border-emerald-600/60 text-stone-100 text-xs rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-amber-500"
                  >
                    {QURAN_TRANSLATIONS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size Selector */}
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-xs text-stone-400 mr-1">{isUrdu ? 'سائز:' : 'Size:'}</span>
                  <button
                    type="button"
                    onClick={() => setFontSizeClass('normal')}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      fontSizeClass === 'normal'
                        ? 'bg-emerald-600 text-stone-950 font-bold'
                        : 'bg-stone-900 text-stone-300 border border-stone-800'
                    }`}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSizeClass('large')}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      fontSizeClass === 'large'
                        ? 'bg-emerald-600 text-stone-950 font-bold'
                        : 'bg-stone-900 text-stone-300 border border-stone-800'
                    }`}
                  >
                    A+
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSizeClass('xlarge')}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      fontSizeClass === 'xlarge'
                        ? 'bg-emerald-600 text-stone-950 font-bold'
                        : 'bg-stone-900 text-stone-300 border border-stone-800'
                    }`}
                  >
                    A++
                  </button>
                </div>
              </div>

              {/* Quick Select Scholars Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin pt-1 border-t border-stone-800/60">
                <span className="text-[11px] text-stone-400 shrink-0 mr-1">
                  {isUrdu ? 'فوری انتخاب:' : 'Quick Select:'}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedTranslationId('ur.maududi')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    selectedTranslationId === 'ur.maududi'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm shadow-amber-950'
                      : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  <span>سید ابو الاعلیٰ مودودی (تفہیم القرآن)</span>
                  {selectedTranslationId === 'ur.maududi' && <Check className="w-3 h-3" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTranslationId('ur.jalandhry')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    selectedTranslationId === 'ur.jalandhry'
                      ? 'bg-emerald-600 text-stone-950 font-bold shadow-sm shadow-emerald-950'
                      : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  <span>مولانا فتح محمد جالندھری</span>
                  {selectedTranslationId === 'ur.jalandhry' && <Check className="w-3 h-3" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTranslationId('ur.qadri')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    selectedTranslationId === 'ur.qadri'
                      ? 'bg-emerald-600 text-stone-950 font-bold shadow-sm shadow-emerald-950'
                      : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  <span>عرفان القرآن (طاہر القادری)</span>
                  {selectedTranslationId === 'ur.qadri' && <Check className="w-3 h-3" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTranslationId('ur.ahmedali')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    selectedTranslationId === 'ur.ahmedali'
                      ? 'bg-emerald-600 text-stone-950 font-bold shadow-sm shadow-emerald-950'
                      : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  <span>مولانا احمد علی لاہوری</span>
                  {selectedTranslationId === 'ur.ahmedali' && <Check className="w-3 h-3" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTranslationId('en.sahih')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    selectedTranslationId === 'en.sahih'
                      ? 'bg-emerald-600 text-stone-950 font-bold shadow-sm shadow-emerald-950'
                      : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  <span>English (Saheeh)</span>
                  {selectedTranslationId === 'en.sahih' && <Check className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Bismillah Header (Shown for every Surah except Surah At-Tawbah #9) */}
            {selectedSurah.number !== 9 && (
              <div className="py-4 px-6 rounded-2xl bg-gradient-to-b from-stone-950 to-stone-900/60 border border-amber-500/30 text-center shadow-lg">
                <p className="text-2xl sm:text-3xl font-bold font-arabic text-amber-300 leading-loose">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-xs font-urdu text-stone-400 mt-1">
                  {isUrdu
                    ? 'شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے'
                    : 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'}
                </p>
              </div>
            )}

            {/* Ayahs List */}
            {isLoadingAyahs ? (
              <div className="flex flex-col items-center justify-center py-16 text-stone-400 space-y-3">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                <p className="text-sm font-semibold text-stone-300">
                  {isUrdu
                    ? `سورۃ ${selectedSurah.nameUr} کی آیات و ترجمہ لوڈ ہو رہے ہیں...`
                    : `Loading verses and translation for ${selectedSurah.nameEn}...`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ayahs.map((ayah) => {
                  const isCopied = copiedAyahNumber === ayah.numberInSurah;
                  return (
                    <div
                      key={ayah.numberInSurah}
                      className="p-4 sm:p-5 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-emerald-700/60 transition-all space-y-3 shadow-md"
                    >
                      {/* Ayah Top Header */}
                      <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center text-[11px] font-mono font-bold">
                            {ayah.numberInSurah}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {selectedSurah.nameUr} : {ayah.numberInSurah}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyAyah(ayah)}
                          className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white text-[11px] font-medium border border-stone-800 flex items-center gap-1.5 transition-colors"
                          title="Copy Ayah with Translation"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">{isUrdu ? 'کاپی ہو گئی' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{isUrdu ? 'کاپی' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Arabic Ayah Text */}
                      <div className="text-right py-1">
                        <p className={`font-arabic text-amber-100 font-bold ${arabicTextSizeClass}`}>
                          {ayah.textArabic}
                          <span className="inline-block mx-2 px-1.5 py-0.5 rounded-full text-xs font-mono font-bold text-amber-400 border border-amber-600/40 bg-stone-900">
                            ۝{ayah.numberInSurah}
                          </span>
                        </p>
                      </div>

                      {/* Translation Text */}
                      <div className="pt-2 border-t border-stone-800/60 text-stone-200">
                        <p className={`leading-relaxed ${transTextSizeClass} ${selectedTranslationId.startsWith('ur.') ? 'font-urdu text-amber-50/90 text-right' : 'text-left text-stone-300'}`}>
                          {ayah.translation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Next/Prev Surah Controls */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleNavigateSurah('prev')}
                disabled={selectedSurah.number === 1}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30"
              >
                {isUrdu ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{isUrdu ? 'پچھلی سورت' : 'Previous Surah'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('directory')}
                className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-semibold"
              >
                {isUrdu ? 'تمام 114 سورتیں دیکھیں' : 'View All 114 Surahs'}
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSurah('next')}
                disabled={selectedSurah.number === 114}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30"
              >
                <span>{isUrdu ? 'اگلی سورت' : 'Next Surah'}</span>
                {isUrdu ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

          </div>
        )}

        {/* Tab 2: FULL 114 SURAHS DIRECTORY GRID */}
        {activeTab === 'directory' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col space-y-4">
            
            {/* Search & Filter Header */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isUrdu
                        ? '114 سورتوں میں تلاش کریں (نام، نمبر، یا مفہوم)...'
                        : 'Search 114 surahs by name, number, or meaning...'
                    }
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <span className="text-xs text-stone-400 font-mono self-center shrink-0">
                  {filteredSurahs.length} / 114 {isUrdu ? 'سورتیں' : 'Surahs'}
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setSurahFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    surahFilter === 'all'
                      ? 'bg-emerald-600 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {isUrdu ? 'تمام 114 سورتیں' : 'All 114 Surahs'}
                </button>
                <button
                  type="button"
                  onClick={() => setSurahFilter('meccan')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    surahFilter === 'meccan'
                      ? 'bg-emerald-600 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {isUrdu ? 'مکی سورتیں (86)' : 'Meccan (86)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSurahFilter('medinan')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    surahFilter === 'medinan'
                      ? 'bg-emerald-600 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {isUrdu ? 'مدنی سورتیں (28)' : 'Medinan (28)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSurahFilter('juz1_10')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    surahFilter === 'juz1_10'
                      ? 'bg-emerald-600 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {isUrdu ? 'پارہ ۱ تا ۱۰' : 'Juz 1-10'}
                </button>
                <button
                  type="button"
                  onClick={() => setSurahFilter('juz11_20')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    surahFilter === 'juz11_20'
                      ? 'bg-emerald-600 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {isUrdu ? 'پارہ ۱۱ تا ۲۰' : 'Juz 11-20'}
                </button>
                <button
                  type="button"
                  onClick={() => setSurahFilter('juz21_30')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    surahFilter === 'juz21_30'
                      ? 'bg-emerald-600 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {isUrdu ? 'پارہ ۲۱ تا ۳۰' : 'Juz 21-30'}
                </button>
              </div>
            </div>

            {/* Grid of All 114 Surahs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {filteredSurahs.map((surah) => {
                const isSelected = selectedSurah.number === surah.number;
                return (
                  <button
                    key={surah.number}
                    type="button"
                    onClick={() => {
                      setSelectedSurah(surah);
                      setActiveTab('reader');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                        : 'bg-stone-950/60 hover:bg-stone-900 border-stone-800/80 hover:border-emerald-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-stone-950'
                            : 'bg-stone-900 text-stone-300 border border-stone-800 group-hover:bg-emerald-950 group-hover:text-emerald-300'
                        }`}
                      >
                        {surah.number}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {isUrdu ? surah.nameUr : surah.nameEn}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {surah.numberOfAyahs} {isUrdu ? 'آیات' : 'Ayahs'} • {surah.revelationTypeUr} • {isUrdu ? `پارہ ${surah.juzNumber}` : `Juz ${surah.juzNumber}`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold font-arabic text-amber-300">
                        {surah.nameAr}
                      </div>
                      <div className="text-[9px] text-stone-500">
                        {surah.englishMeaning}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-stone-800 bg-stone-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-stone-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isUrdu
                ? 'جامع مسجد عثمانِ غنی نارتھ کراچی - شعبہ دارالقرآن الکریم (صدقۂ جاریہ)'
                : 'Jamia Masjid Usman-e-Ghani North Karachi - Dar-ul-Quran Department'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold transition-colors"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
