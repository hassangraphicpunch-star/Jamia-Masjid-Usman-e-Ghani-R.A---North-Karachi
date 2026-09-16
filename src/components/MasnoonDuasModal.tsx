import React, { useState } from 'react';
import {
  X,
  Heart,
  Search,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Share2,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Language, MasnoonDuaItem } from '../types';
import { DUA_CATEGORIES, MASNOON_DUAS_COLLECTION } from '../data/duasData';

interface MasnoonDuasModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const MasnoonDuasModal: React.FC<MasnoonDuasModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isUrdu = language === 'ur';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [counters, setCounters] = useState<Record<number, number>>({});

  // Filter duas
  const filteredDuas = MASNOON_DUAS_COLLECTION.filter((dua) => {
    if (selectedCategory !== 'all' && dua.category !== selectedCategory) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      dua.title.toLowerCase().includes(q) ||
      (dua.titleUr && dua.titleUr.includes(q)) ||
      dua.arabic.includes(q) ||
      dua.transliteration.toLowerCase().includes(q) ||
      dua.translation.toLowerCase().includes(q) ||
      (dua.translationUr && dua.translationUr.includes(q)) ||
      dua.source.toLowerCase().includes(q)
    );
  });

  // Handle counter increment
  const handleIncrement = (id: number, maxRepeat: number) => {
    setCounters((prev) => {
      const current = prev[id] || 0;
      const next = current + 1;
      return { ...prev, [id]: next > maxRepeat ? 1 : next };
    });
  };

  // Reset counter
  const handleResetCounter = (id: number) => {
    setCounters((prev) => ({ ...prev, [id]: 0 }));
  };

  // Copy dua to clipboard
  const handleCopy = async (dua: MasnoonDuaItem) => {
    const text = `🤲 ${dua.titleUr || dua.title}\n\n${dua.arabic}\n\nتلفظ / Transliteration:\n${dua.transliteration}\n\nترجمہ / Translation:\n${dua.translationUr || dua.translation}\n\nحوالہ / Reference: ${dua.source}\n(جامع مسجد عثمانِ غنی - مسنون دعائیں)`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedId(dua.id);
        setTimeout(() => setCopiedId(null), 2500);
      }
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-stone-100 ${
          isUrdu ? 'dir-rtl' : 'dir-ltr'
        }`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-xl font-extrabold text-white">
                  {isUrdu ? 'حصن المسلم: 126 مسنون دعائیں و اذکار' : 'Hisn-ul-Muslim: 126 Masnoon Duas'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                  {isUrdu ? '27 زمرہ جات' : '27 Categories'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 border border-amber-700 text-amber-300">
                  {isUrdu ? 'صدقۂ جاریہ' : 'Sadaqah Jariah'}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {isUrdu
                  ? 'صبح و شام، نماز، استغفار، سفر، بیماری، پریشانی و حفاظت کی تمام مستند مسنون دعائیں مع عربی، ترجمہ اور تسبیح'
                  : 'Authentic daily supplications with Arabic, Urdu & English translations, Hadith sources and interactive counters'}
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

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-stone-950/70 border-b border-stone-800 space-y-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isUrdu
                  ? 'کوئی بھی دعا تلاش کریں (عربی، اردو، عنوان، سفر، استغفار، بیماری، والدین)...'
                  : 'Search any dua (e.g. morning, istighfar, travel, illness, parents, debt)...'
              }
              className="w-full bg-stone-900 border border-stone-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Pills (Horizontal Scroll) */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {DUA_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-950/50'
                      : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  <span>{isUrdu ? cat.nameUr : cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Duas List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {filteredDuas.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <Heart className="w-10 h-10 mx-auto text-stone-600 mb-2" />
              <p className="text-sm font-semibold text-stone-300">
                {isUrdu ? 'اس تلاش کے مطابق کوئی دعا نہیں ملی' : 'No supplication found matching your search'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs text-amber-400 hover:underline"
              >
                {isUrdu ? 'تمام دعائیں دکھائیں' : 'Show all supplications'}
              </button>
            </div>
          ) : (
            filteredDuas.map((dua) => {
              const currentCount = counters[dua.id] || 0;
              const isCompleted = dua.repeat > 1 && currentCount >= dua.repeat;
              const isCopied = copiedId === dua.id;

              return (
                <div
                  key={dua.id}
                  className="p-4 sm:p-5 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-amber-900/60 transition-all space-y-3 shadow-lg"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 border border-amber-800 text-amber-400">
                          {dua.category.replace('_', ' ')}
                        </span>
                        {dua.repeat > 1 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-900 text-emerald-400 border border-stone-800">
                            {dua.repeat}x {isUrdu ? 'مرتبہ' : 'Repeat'}
                          </span>
                        )}
                        <span className="text-[11px] text-stone-400">
                          • {dua.source}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {isUrdu ? dua.titleUr || dua.title : dua.title}
                      </h4>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(dua)}
                        className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold border border-stone-800 flex items-center gap-1.5 transition-colors"
                        title="Copy Dua"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">{isUrdu ? 'کاپی ہو گئی' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-stone-400" />
                            <span>{isUrdu ? 'کاپی کریں' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/70 text-right">
                    <p className="text-xl sm:text-2xl font-bold text-amber-200 leading-loose font-arabic">
                      {dua.arabic}
                    </p>
                  </div>

                  {/* Transliteration */}
                  <div className="text-xs text-stone-400 italic">
                    <strong className="text-stone-300 not-italic">{isUrdu ? 'تلفظ: ' : 'Pronunciation: '}</strong>
                    {dua.transliteration}
                  </div>

                  {/* Translations */}
                  <div className="text-xs text-stone-200 space-y-1.5">
                    {dua.translationUr && (
                      <p className="font-urdu leading-relaxed text-amber-100/90 text-sm">
                        <strong className="text-amber-400">اردو ترجمہ: </strong>
                        {dua.translationUr}
                      </p>
                    )}
                    <p className="text-stone-300 leading-relaxed">
                      <strong className="text-emerald-400">English: </strong>
                      {dua.translation}
                    </p>
                  </div>

                  {/* Counter Bar (if repeat > 1) */}
                  {dua.repeat > 1 && (
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-stone-800/60">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleIncrement(dua.id, dua.repeat)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                          }`}
                        >
                          {isCompleted
                            ? (isUrdu ? '✓ مکمل ہو گیا' : '✓ Completed!')
                            : `${isUrdu ? 'تسبیح گنیں' : 'Count'}: ${currentCount} / ${dua.repeat}`}
                        </button>
                        {currentCount > 0 && (
                          <button
                            type="button"
                            onClick={() => handleResetCounter(dua.id)}
                            className="p-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-white"
                            title="Reset"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {isUrdu ? `مسنون تعداد: ${dua.repeat} مرتبہ` : `Sunnah Count: ${dua.repeat}x`}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-800 bg-stone-950 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-xs text-stone-400 text-center sm:text-left">
            <span>{isUrdu ? 'جامع مسجد عثمانِ غنی نارتھ کراچی' : 'Jamia Masjid Usman-e-Ghani North Karachi'}</span>
            <span className="mx-2 text-stone-600">•</span>
            <span className="text-amber-400">{isUrdu ? 'صدقۂ جاریہ' : 'Sadaqah Jariah'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
