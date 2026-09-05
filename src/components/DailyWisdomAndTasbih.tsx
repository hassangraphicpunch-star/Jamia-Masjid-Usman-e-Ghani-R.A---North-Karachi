import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  CheckCircle2,
  Share2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Copy,
  Check,
  Clock,
  Bookmark,
  Calendar,
} from 'lucide-react';
import { Language, ZikrItem, QuranHadithItem } from '../types';
import { ZIKR_ITEMS, MOSQUE_INFO } from '../data/mockData';
import { QURAN_HADITH_COLLECTION } from '../data/quranHadithData';

interface DailyWisdomAndTasbihProps {
  language: Language;
}

const ROTATION_INTERVAL_SECONDS = 25;

export const DailyWisdomAndTasbih: React.FC<DailyWisdomAndTasbihProps> = ({
  language,
}) => {
  const isUrdu = language === 'ur';

  // Quran & Hadith Scheduled System State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(ROTATION_INTERVAL_SECONDS);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  // Tasbih state
  const [selectedZikr, setSelectedZikr] = useState<ZikrItem>(ZIKR_ITEMS[0]);
  const [count, setCount] = useState<number>(0);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Filter items based on selected category tab
  const filteredItems: QuranHadithItem[] = React.useMemo(() => {
    if (selectedFilter === 'all') return QURAN_HADITH_COLLECTION;
    if (selectedFilter === 'ayah') return QURAN_HADITH_COLLECTION.filter((i) => i.type === 'ayah');
    if (selectedFilter === 'hadith') return QURAN_HADITH_COLLECTION.filter((i) => i.type === 'hadith');
    if (selectedFilter === 'prayer') return QURAN_HADITH_COLLECTION.filter((i) => i.category === 'prayer');
    if (selectedFilter === 'usman') return QURAN_HADITH_COLLECTION.filter((i) => i.category === 'virtue_usman');
    return QURAN_HADITH_COLLECTION;
  }, [selectedFilter]);

  // Safe index within filtered items
  const activeItem = filteredItems[currentIndex % Math.max(1, filteredItems.length)] || QURAN_HADITH_COLLECTION[0];

  // Automatic Scheduling and Progress Timer
  useEffect(() => {
    if (!isAutoPlaying || filteredItems.length <= 1) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setCurrentIndex((curr) => (curr + 1) % filteredItems.length);
          return ROTATION_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, filteredItems.length]);

  // Handle manual navigation
  const handlePrev = () => {
    setCurrentIndex((curr) => (curr - 1 + filteredItems.length) % filteredItems.length);
    setSecondsRemaining(ROTATION_INTERVAL_SECONDS);
  };

  const handleNext = () => {
    setCurrentIndex((curr) => (curr + 1) % filteredItems.length);
    setSecondsRemaining(ROTATION_INTERVAL_SECONDS);
  };

  // Load saved Tasbih count from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mosque_tasbih_total');
      if (saved) setTotalCompleted(parseInt(saved, 10));
    } catch {
      // ignore
    }
  }, []);

  const playClickFeedback = () => {
    if (soundEnabled && typeof window !== 'undefined' && window.AudioContext) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 pleasant chime
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.09);
      } catch {
        // audio context fail safe
      }
    }
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const handleIncrement = () => {
    playClickFeedback();
    const next = count + 1;
    if (next >= selectedZikr.targetCount) {
      setCount(0);
      const newTotal = totalCompleted + 1;
      setTotalCompleted(newTotal);
      try {
        localStorage.setItem('mosque_tasbih_total', newTotal.toString());
      } catch {
        // ignore
      }
    } else {
      setCount(next);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleShareQuote = () => {
    const text = isUrdu
      ? `${activeItem.type === 'ayah' ? '📖 فرمانِ باری تعالیٰ:' : '✨ حدیثِ رسول ﷺ:'}\n\n` +
        `${activeItem.arabic}\n\n` +
        `"${activeItem.translationUr}"\n\n` +
        `حوالہ: ${activeItem.referenceUr}\n` +
        (activeItem.narratorUr ? `${activeItem.narratorUr}\n` : '') +
        `\n🕌 جامع مسجد عثمان غنی رضی اللہ عنہ، نارتھ کراچی • واٹس ایپ: 03233469424`
      : `${activeItem.type === 'ayah' ? '📖 Holy Quran:' : '✨ Noble Hadith:'}\n\n` +
        `${activeItem.arabic}\n\n` +
        `"${activeItem.translationEn}"\n\n` +
        `Reference: ${activeItem.referenceEn}\n` +
        (activeItem.narratorEn ? `${activeItem.narratorEn}\n` : '') +
        `\n🕌 Jamia Masjid Usman-e-Ghani (R.A) North Karachi • WhatsApp: 03233469424`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = isUrdu
      ? `*${activeItem.type === 'ayah' ? 'قرآنی آیت' : 'حدیثِ مبارکہ'}*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `${activeItem.arabic}\n\n` +
        `"${activeItem.translationUr}"\n\n` +
        `*حوالہ:* ${activeItem.referenceUr}\n` +
        (activeItem.narratorUr ? `*روایت:* ${activeItem.narratorUr}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `جامع مسجد عثمان غنی، سیکٹر 5-اے/1 نارتھ کراچی • واٹس ایپ: 03233469424`
      : `*${activeItem.type === 'ayah' ? 'Quranic Ayah' : 'Prophetic Hadith'}*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `${activeItem.arabic}\n\n` +
        `"${activeItem.translationEn}"\n\n` +
        `*Reference:* ${activeItem.referenceEn}\n` +
        (activeItem.narratorEn ? `*Narrator:* ${activeItem.narratorEn}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `Jamia Masjid Usman-e-Ghani, ST-11 Sector 5-A/1 North Karachi • WhatsApp: 03233469424`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/923233469424?text=${encoded}`, '_blank');
  };

  const progressPercent = Math.min(100, Math.round((count / selectedZikr.targetCount) * 100));

  return (
    <section
      id="wisdom-tasbih"
      className="py-16 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'خودکار شیڈولڈ قرآنی آیات و احادیث' : 'Scheduled Quran, Hadith & Tasbih System'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isUrdu ? (
              <span className="font-urdu text-3xl sm:text-5xl text-amber-300">
                فرمانِ الٰہی، احادیثِ نبویہ ﷺ اور ڈیجیٹل تسبیح
              </span>
            ) : (
              <span>Automated Quranic Verses, Hadiths & Digital Tasbih</span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 mt-2">
            {isUrdu
              ? 'قرآن کریم کی آیات، مسنون احادیثِ رسول ﷺ کا خودکار شیڈولڈ ڈسپلے اور نماز کے بعد کے مسنون اذکار کے لیے ڈیجیٹل کاؤنٹر'
              : 'Regularly updated authentic Quranic Ayat and Hadiths with live rotation, citations, and an interactive digital Tasbih counter.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: SCHEDULED QURAN & HADITH DISPLAY SYSTEM */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Category Filter Tabs & Auto-rotation Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-stone-900/90 border border-stone-800">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => { setSelectedFilter('all'); setCurrentIndex(0); setSecondsRemaining(ROTATION_INTERVAL_SECONDS); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-950/60 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  {isUrdu ? 'تمام' : 'All'}
                </button>
                <button
                  onClick={() => { setSelectedFilter('ayah'); setCurrentIndex(0); setSecondsRemaining(ROTATION_INTERVAL_SECONDS); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedFilter === 'ayah'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-950/60 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  {isUrdu ? 'قرآنی آیات' : 'Quranic Ayat'}
                </button>
                <button
                  onClick={() => { setSelectedFilter('hadith'); setCurrentIndex(0); setSecondsRemaining(ROTATION_INTERVAL_SECONDS); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedFilter === 'hadith'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-950/60 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  {isUrdu ? 'احادیث مبارکہ' : 'Hadiths'}
                </button>
                <button
                  onClick={() => { setSelectedFilter('prayer'); setCurrentIndex(0); setSecondsRemaining(ROTATION_INTERVAL_SECONDS); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedFilter === 'prayer'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-950/60 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  {isUrdu ? 'نماز' : 'Salah'}
                </button>
                <button
                  onClick={() => { setSelectedFilter('usman'); setCurrentIndex(0); setSecondsRemaining(ROTATION_INTERVAL_SECONDS); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedFilter === 'usman'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-950/60 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  {isUrdu ? 'فضائلِ عثمان غنی' : 'Usman (R.A)'}
                </button>
              </div>

              {/* Pause / Play Timer Toggle */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isAutoPlaying
                      ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                  title={isAutoPlaying ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
                >
                  {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                {isAutoPlaying && (
                  <span className="font-mono text-[11px] text-amber-300 font-semibold px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800">
                    {secondsRemaining}s
                  </span>
                )}
              </div>
            </div>

            {/* MAIN DISPLAY CARD FOR CURRENT AYAH / HADITH */}
            <div
              id="scheduled-quran-hadith-card"
              className="rounded-2xl bg-gradient-to-br from-emerald-950/90 via-stone-900 to-emerald-950/70 border-2 border-emerald-600/50 p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300"
            >
              {/* Progress bar line showing countdown to next auto update */}
              {isAutoPlaying && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-stone-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-1000 ease-linear"
                    style={{
                      width: `${((ROTATION_INTERVAL_SECONDS - secondsRemaining) / ROTATION_INTERVAL_SECONDS) * 100}%`,
                    }}
                  />
                </div>
              )}

              {/* Card Meta Header */}
              <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                    activeItem.type === 'ayah'
                      ? 'bg-emerald-900 border border-emerald-500 text-emerald-200'
                      : 'bg-amber-950 border border-amber-500 text-amber-300'
                  }`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isUrdu ? (activeItem.type === 'ayah' ? 'قرآنِ کریم' : 'حدیثِ مبارکہ') : (activeItem.type === 'ayah' ? 'Holy Quran' : 'Prophetic Hadith')}</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-stone-950/80 border border-stone-800 text-stone-300 text-[10px] font-semibold">
                    {isUrdu ? activeItem.themeBadgeUr : activeItem.themeBadgeEn}
                  </span>
                </div>

                {/* Direct Action Buttons: Copy & WhatsApp Share */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleShareWhatsApp}
                    className="p-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60 transition-colors"
                    title="Share to WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleShareQuote}
                    className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
                    title="Copy Text"
                  >
                    {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* ARABIC TEXT */}
              <div className="py-4 px-2 text-center my-2">
                <p className="font-arabic text-xl sm:text-2xl lg:text-3xl text-amber-200 font-bold leading-loose tracking-wide select-all">
                  {activeItem.arabic}
                </p>
              </div>

              {/* TRANSLATIONS */}
              <div className="pt-4 border-t border-emerald-900/60 space-y-2.5">
                <p className="text-sm sm:text-base font-urdu text-white text-right leading-relaxed font-semibold select-all">
                  {activeItem.translationUr}
                </p>
                <p className="text-xs sm:text-sm text-stone-300 italic select-all">
                  "{activeItem.translationEn}"
                </p>

                {/* References & Narrator */}
                <div className="pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <div className="text-emerald-400 font-bold font-mono">
                    {isUrdu ? activeItem.referenceUr : activeItem.referenceEn}
                  </div>
                  {(activeItem.narratorUr || activeItem.narratorEn) && (
                    <div className="text-stone-400 italic">
                      {isUrdu ? activeItem.narratorUr : activeItem.narratorEn}
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM NAVIGATION CONTROLS */}
              <div className="mt-6 pt-4 border-t border-stone-800/60 flex items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isUrdu ? 'پچھلا' : 'Previous'}</span>
                </button>

                {/* Item Counter Dots / Indicator */}
                <div className="text-center">
                  <span className="font-mono text-xs text-stone-400">
                    {currentIndex + 1} / {filteredItems.length}
                  </span>
                  <div className="text-[10px] text-stone-500">
                    {isUrdu ? 'خودکار شیڈول' : 'Auto-Scheduled'}
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>{isUrdu ? 'اگلا' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Quick Hadith & Quran Benefit Banner */}
            <div className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isUrdu
                    ? 'یہ نظام خودکار طریقے سے ہر تھوڑی دیر بعد نیا قرآنی پیغام اور حدیث پیش کرتا ہے'
                    : 'This display rotates authentic Quranic guidance automatically throughout the day.'}
                </span>
              </span>
              <span className="font-mono text-emerald-400 text-[11px] shrink-0 font-bold">
                12 Verified Sources
              </span>
            </div>

          </div>

          {/* RIGHT 5 COLS: INTERACTIVE DIGITAL TASBIH COUNTER */}
          <div className="lg:col-span-5 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-300 fill-current" />
                  <span>{isUrdu ? 'ڈیجیٹل تسبیح کاؤنٹر' : 'Digital Tasbih Counter'}</span>
                </h3>
                <p className="text-xs text-stone-400">
                  {isUrdu ? 'نماز کے بعد کے مسنون اذکار و دعائیں' : 'Post-Salah Sunnah Tasbih & Azkar'}
                </p>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl text-xs transition-colors border ${
                  soundEnabled
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-stone-950 text-stone-500 border-stone-800'
                }`}
                title={soundEnabled ? 'Chime sound enabled' : 'Sound muted'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Zikr Preset Selector Pills */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                {isUrdu ? 'ذکر کا انتخاب کریں:' : 'Select Zikr / Tasbih:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ZIKR_ITEMS.map((item) => {
                  const isSel = selectedZikr.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedZikr(item);
                        setCount(0);
                      }}
                      className={`p-2.5 rounded-xl text-left transition-all border ${
                        isSel
                          ? 'bg-emerald-950/80 border-emerald-500 text-white ring-1 ring-emerald-500/40'
                          : 'bg-stone-950/70 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="font-arabic text-sm font-bold text-amber-200 truncate">
                        {item.arabic}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5 flex items-center justify-between">
                        <span>{item.targetCount}x Target</span>
                        {isSel && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Zikr Arabic & Meaning */}
            <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 text-center space-y-2">
              <p className="font-arabic text-2xl font-bold text-amber-300">
                {selectedZikr.arabic}
              </p>
              <p className="text-xs font-urdu text-stone-200">
                {selectedZikr.translationUr}
              </p>
              <p className="text-[11px] text-emerald-400">
                {isUrdu ? selectedZikr.virtueUr : selectedZikr.virtueEn}
              </p>
            </div>

            {/* Big Interactive Clicker Area */}
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <button
                  id="tasbih-tap-button"
                  onClick={handleIncrement}
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-emerald-700 via-teal-600 to-emerald-500 text-white shadow-2xl shadow-emerald-950/80 border-4 border-amber-400/70 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 active:shadow-inner select-none group"
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-200 mb-1">
                    TAP
                  </span>
                  <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white group-hover:scale-105 transition-transform">
                    {count}
                  </span>
                  <span className="text-xs text-amber-200 font-mono mt-1">
                    / {selectedZikr.targetCount}
                  </span>
                </button>
              </div>

              {/* Progress Bar towards Target */}
              <div className="max-w-xs mx-auto space-y-1">
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>{isUrdu ? 'پیشرفت' : 'Progress'}</span>
                  <span className="font-mono">{progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-200 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions: Reset and Lifetime Count */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ری سیٹ' : 'Reset'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-[11px]">
                <span>{isUrdu ? 'مکمل تسبیحات:' : 'Completed Sets:'}</span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {totalCompleted}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
