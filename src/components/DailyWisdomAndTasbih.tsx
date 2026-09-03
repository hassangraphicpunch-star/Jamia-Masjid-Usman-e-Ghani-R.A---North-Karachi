import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  CheckCircle2,
  Award,
  Share2,
} from 'lucide-react';
import { Language, ZikrItem } from '../types';
import { DAILY_WISDOM, ZIKR_ITEMS } from '../data/mockData';

interface DailyWisdomAndTasbihProps {
  language: Language;
}

export const DailyWisdomAndTasbih: React.FC<DailyWisdomAndTasbihProps> = ({
  language,
}) => {
  const [selectedZikr, setSelectedZikr] = useState<ZikrItem>(ZIKR_ITEMS[0]);
  const [count, setCount] = useState<number>(0);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [copiedAyah, setCopiedAyah] = useState(false);

  const isUrdu = language === 'ur';

  // Load saved count from localStorage
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
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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

  const handleShareAyah = () => {
    const text = `📖 ${DAILY_WISDOM.ayah.arabic}\n\n"${DAILY_WISDOM.ayah.translationUr}"\n[${DAILY_WISDOM.ayah.surahUr}]\n\n🕌 Jamia Masjid Usman-e-Ghani (R.A) North Karachi`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAyah(true);
      setTimeout(() => setCopiedAyah(false), 3000);
    }
  };

  const progressPercent = Math.min(100, Math.round((count / selectedZikr.targetCount) * 100));

  return (
    <section
      id="wisdom-tasbih"
      className="py-16 bg-islamic-pattern border-b border-stone-800/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'روزمرہ اذکار و قرآنی حکمت' : 'Daily Quran, Hadith & Digital Tasbih'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isUrdu ? (
              <span className="font-urdu text-3xl sm:text-5xl text-amber-300">
                فرمانِ الٰہی، حدیثِ مبارکہ اور ڈیجیٹل تسبیح
              </span>
            ) : (
              <span>Daily Wisdom & Digital Tasbih Counter</span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 mt-2">
            {isUrdu
              ? 'نماز کے بعد کے مسنون اذکار، تسبیح فاطمی اور سیدنا عثمان غنی رضی اللہ عنہ کی روایات کا خوبصورت مجموعہ'
              : 'Enrich your day with Quranic verses, authentic sayings of Prophet Muhammad ﷺ, and an interactive Tasbih counter.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Col (7 Cols): Daily Ayah & Hadith & Virtue of Usman (R.A) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Daily Ayah Card */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950/90 via-stone-900 to-emerald-950/60 border border-emerald-600/40 p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-md bg-emerald-900/80 border border-emerald-700 text-emerald-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'آج کی قرآنی آیت' : 'Ayah of the Day'}</span>
                </span>

                <button
                  onClick={handleShareAyah}
                  className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs flex items-center gap-1.5 border border-stone-800 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{copiedAyah ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'شیئر کریں' : 'Share')}</span>
                </button>
              </div>

              {/* Arabic Calligraphy Verse */}
              <div className="text-center py-4 px-2">
                <p className="font-arabic text-xl sm:text-2xl lg:text-3xl text-amber-200 font-bold leading-loose tracking-wide">
                  {DAILY_WISDOM.ayah.arabic}
                </p>
              </div>

              {/* Translation in Urdu and English */}
              <div className="pt-4 border-t border-emerald-900/60 space-y-2">
                <p className="text-sm sm:text-base font-urdu text-white text-right leading-relaxed">
                  {DAILY_WISDOM.ayah.translationUr}
                </p>
                <p className="text-xs text-stone-300 italic">
                  "{DAILY_WISDOM.ayah.translationEn}"
                </p>
                <div className="text-right text-[11px] font-semibold text-emerald-400 pt-1">
                  — {isUrdu ? DAILY_WISDOM.ayah.surahUr : DAILY_WISDOM.ayah.surahEn}
                </div>
              </div>
            </div>

            {/* 2. Hadith on Building Mosques narrated by Hazrat Usman (R.A) */}
            <div className="rounded-2xl bg-stone-900/90 border border-stone-800 p-6 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold uppercase">
                  {isUrdu ? 'حدیثِ مبارکہ (مسجد کی فضیلت)' : 'Hadith: Virtues of the Mosque'}
                </span>
              </div>

              <p className="font-arabic text-lg sm:text-xl text-stone-100 font-semibold text-center py-2">
                {DAILY_WISDOM.hadith.arabic}
              </p>

              <div className="pt-2 border-t border-stone-800 space-y-1.5 text-xs sm:text-sm">
                <p className="font-urdu text-stone-200 text-right leading-relaxed">
                  {DAILY_WISDOM.hadith.translationUr}
                </p>
                <p className="text-stone-400 italic">
                  "{DAILY_WISDOM.hadith.translationEn}"
                </p>
                <p className="text-amber-400/90 font-medium text-[11px] pt-1">
                  {isUrdu ? DAILY_WISDOM.hadith.narratorUr : DAILY_WISDOM.hadith.narratorEn}
                </p>
              </div>
            </div>

            {/* 3. Special tribute to Hazrat Usman-e-Ghani (R.A) */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-stone-300 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/80 border border-emerald-700 flex items-center justify-center shrink-0 text-amber-300 font-bold font-arabic">
                ع
              </div>
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">
                  {isUrdu ? 'شانِ سیدنا عثمانِ غنی رضی اللہ عنہ' : 'Virtue of Hazrat Usman-e-Ghani (R.A)'}
                </span>
                <p className="text-stone-300 leading-relaxed">
                  {isUrdu ? DAILY_WISDOM.virtueOfUsman.quoteUr : DAILY_WISDOM.virtueOfUsman.quoteEn}
                </p>
              </div>
            </div>

          </div>

          {/* Right Col (5 Cols): Interactive Digital Tasbih Counter (سبحہ) */}
          <div className="lg:col-span-5">
            <div
              id="digital-tasbih-container"
              className="rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/40 p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Header of Tasbih */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
                    📿
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      {isUrdu ? 'ڈیجیٹل تسبیح فاطمی' : 'Digital Tasbih Counter'}
                    </h3>
                    <p className="text-[10px] text-stone-400">
                      {isUrdu ? 'روزانہ اذکار شمار کریں' : 'Count your daily remembrances'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Sound Feedback Toggle */}
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white transition-colors"
                    title={soundEnabled ? 'Sound active' : 'Sound muted'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
                  </button>

                  {/* Reset count */}
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-rose-400 transition-colors"
                    title="Reset current round"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Zikr Selector Dropdown */}
              <div className="mb-5">
                <label className="block text-[11px] text-stone-400 font-semibold mb-1">
                  {isUrdu ? 'ذکر منتخب کریں:' : 'Select Azkar / Dhikr:'}
                </label>
                <select
                  value={selectedZikr.id}
                  onChange={(e) => {
                    const found = ZIKR_ITEMS.find((z) => z.id === e.target.value);
                    if (found) {
                      setSelectedZikr(found);
                      setCount(0);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-medium text-xs focus:outline-none focus:border-amber-400"
                >
                  {ZIKR_ITEMS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.arabic} — {item.transliteration} ({item.targetCount}x)
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Dhikr Display */}
              <div className="text-center p-4 rounded-2xl bg-stone-950/80 border border-stone-800/80 mb-5">
                <p className="font-arabic text-2xl sm:text-3xl text-amber-300 font-bold mb-1">
                  {selectedZikr.arabic}
                </p>
                <p className="text-xs font-semibold text-emerald-400">
                  {selectedZikr.transliteration}
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  {isUrdu ? selectedZikr.translationUr : selectedZikr.translationEn}
                </p>
              </div>

              {/* Large Interactive Touch Clicker Button */}
              <div className="flex flex-col items-center justify-center my-4">
                <button
                  id="btn-tasbih-clicker"
                  onClick={handleIncrement}
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 border-4 border-amber-400/80 flex flex-col items-center justify-center shadow-2xl shadow-emerald-950 active:scale-95 transition-all cursor-pointer group"
                >
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono group-hover:scale-110 transition-transform">
                    {count}
                  </span>
                  <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider mt-0.5">
                    / {selectedZikr.targetCount}
                  </span>
                  <span className="text-[9px] text-emerald-200 font-semibold uppercase mt-1">
                    {isUrdu ? 'دبائیں' : 'TAP'}
                  </span>
                </button>
              </div>

              {/* Progress Bar towards Target */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>{isUrdu ? 'مرحلہ مکمل:' : 'Round Progress:'}</span>
                  <span className="font-mono font-bold text-amber-300">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Total Completed Rounds stats */}
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-stone-300">
                    {isUrdu ? 'کل مکمل تسبیحات:' : 'Completed Rounds:'}
                  </span>
                </div>
                <span className="font-bold text-amber-300 font-mono text-sm">
                  {totalCompleted}
                </span>
              </div>

              {/* Virtue snippet */}
              <p className="text-[10px] text-stone-400 text-center mt-3 italic">
                {isUrdu ? selectedZikr.virtueUr : selectedZikr.virtueEn}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
