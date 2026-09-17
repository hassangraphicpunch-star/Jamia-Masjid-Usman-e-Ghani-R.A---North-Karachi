import React, { useState } from 'react';
import {
  X,
  Compass,
  CheckCircle2,
  Globe2,
  Info,
  Search,
  Sliders,
  Sparkles,
  ExternalLink,
  Code2,
  Check,
} from 'lucide-react';
import { Language } from '../types';
import {
  PRAYER_CALCULATION_METHODS,
  MethodDetails,
} from '../data/prayerMethodsData';

interface PrayerMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentMethod: string;
  onSelectMethod: (methodId: string) => void;
}

export const PrayerMethodsModal: React.FC<PrayerMethodsModalProps> = ({
  isOpen,
  onClose,
  language,
  currentMethod,
  onSelectMethod,
}) => {
  const isUrdu = language === 'ur';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'popular' | 'regional'>('all');
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  if (!isOpen) return null;

  const methodsList = Object.values(PRAYER_CALCULATION_METHODS);

  const filteredMethods = methodsList.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(term) ||
      m.nameUr.includes(term) ||
      m.description.toLowerCase().includes(term) ||
      m.region.toLowerCase().includes(term) ||
      m.id.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (selectedTab === 'popular') {
      return ['Karachi', 'MuslimWorldLeague', 'UmmAlQura', 'Egyptian', 'Dubai', 'NorthAmerica', 'Turkey'].includes(m.id);
    }
    if (selectedTab === 'regional') {
      return ['Karachi', 'Kuwait', 'Qatar', 'Singapore', 'JAKIM', 'Morocco', 'Algeria', 'Tunisia', 'Jordan', 'Palestine'].includes(m.id);
    }
    return true;
  });

  const handleCopyEndpoint = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  return (
    <div
      id="modal-prayer-methods"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-stone-900 via-emerald-950/40 to-stone-900 border-b border-stone-800 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {isUrdu
                    ? 'طریقہ ہائے حساب اوقاتِ نماز و فقہی معیارات'
                    : 'Prayer Calculation Methods & Fiqh Standards'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {methodsList.length} {isUrdu ? 'معیارات' : 'Methods'}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {isUrdu
                  ? 'مختلف ممالک اور فقہی مکاتب فکر کے مطابق فجر، عشاء کے زاویے اور عصر کی شرائط'
                  : 'Astronomical twilight angles (Fajr & Isha) and Asr shadow multipliers worldwide'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-prayer-methods-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Mosque Banner */}
        <div className="px-4 sm:px-6 py-3 bg-emerald-950/70 border-b border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shrink-0">
          <div className="flex items-center gap-2 text-emerald-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-white font-semibold">
                {isUrdu ? 'مسجد کا باضابطہ معیار:' : 'Official Mosque Standard:'}
              </strong>{' '}
              {isUrdu
                ? 'جامعہ علوم اسلامیہ علامہ بنوری ٹاؤن، کراچی (فجر 18° / عشاء 18° / عصر مثلین فقہ حنفی)'
                : 'University of Islamic Sciences, Karachi (Fajr 18°, Isha 18°, Asr 2x Hanafi Shadow)'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-mono text-[11px] font-bold shrink-0">
            ST-11 Sector 5-A/1 North Karachi
          </span>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-stone-800/80 bg-stone-950/60 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isUrdu
                  ? 'طریقہ، ادارہ یا ملک تلاش کریں (مثلاً: کراچی، مکہ، دیانت، مصر...)'
                  : 'Search by method, institution or region (e.g. Karachi, Umm Al-Qura, ISNA)...'
              }
              className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 shrink-0 text-xs">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedTab === 'all'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {isUrdu ? 'تمام' : 'All'} ({methodsList.length})
            </button>
            <button
              onClick={() => setSelectedTab('popular')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedTab === 'popular'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {isUrdu ? 'معروف' : 'Major'}
            </button>
            <button
              onClick={() => setSelectedTab('regional')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedTab === 'regional'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {isUrdu ? 'علاقائی' : 'Regional'}
            </button>
          </div>
        </div>

        {/* Methods Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5 custom-scrollbar">
          {filteredMethods.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-sm">
              {isUrdu
                ? 'کوئی طریقہ کار تلاش کے مطابق نہیں ملا۔'
                : 'No prayer calculation method matched your search.'}
            </div>
          ) : (
            filteredMethods.map((m) => {
              const isSelected = currentMethod.toLowerCase() === m.id.toLowerCase();
              return (
                <div
                  key={m.id}
                  id={`method-card-${m.id}`}
                  className={`p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/40'
                      : m.isOfficialForMasjid
                      ? 'bg-stone-900/90 border-amber-500/40 hover:border-amber-400/60'
                      : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">
                          {isUrdu ? m.nameUr : m.name}
                        </span>
                        {isUrdu && (
                          <span className="text-xs text-stone-400 font-sans">
                            ({m.name})
                          </span>
                        )}
                        {m.isOfficialForMasjid && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            {isUrdu ? 'جامع مسجد کا معیار' : 'Mosque Official'}
                          </span>
                        )}
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            {isUrdu ? 'فعال ہے' : 'Active'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        {isUrdu ? m.descriptionUr : m.description}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-stone-400">
                          <Globe2 className="w-3 h-3 text-blue-400" />
                          <span>{isUrdu ? m.regionUr : m.region}</span>
                        </span>
                      </div>
                    </div>

                    {/* Astronomical Parameters Chips */}
                    <div className="flex items-center gap-2 flex-wrap md:flex-nowrap shrink-0">
                      {m.fajr_angle && (
                        <div className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-center">
                          <span className="text-[10px] text-stone-400 block">
                            {isUrdu ? 'فجر زاویہ' : 'Fajr Angle'}
                          </span>
                          <span className="font-mono text-xs font-bold text-amber-300">
                            {m.fajr_angle}
                          </span>
                        </div>
                      )}

                      {(m.isha_angle || m.isha_description) && (
                        <div className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-center">
                          <span className="text-[10px] text-stone-400 block">
                            {isUrdu ? 'عشاء قاعدہ' : 'Isha Rule'}
                          </span>
                          <span className="font-mono text-xs font-bold text-sky-300">
                            {m.isha_angle || '90m'}
                          </span>
                        </div>
                      )}

                      {m.asr_calculation && (
                        <div className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-center">
                          <span className="text-[10px] text-stone-400 block">
                            {isUrdu ? 'عصر ضابطہ' : 'Asr'}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-emerald-300">
                            {m.madhab === 'Hanafi' ? '2x Shadow' : '1x Shadow'}
                          </span>
                        </div>
                      )}

                      <button
                        id={`btn-select-method-${m.id}`}
                        onClick={() => {
                          onSelectMethod(m.id);
                          onClose();
                        }}
                        disabled={isSelected}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          isSelected
                            ? 'bg-emerald-700/50 text-emerald-300 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        }`}
                      >
                        {isSelected
                          ? isUrdu
                            ? 'منتخب شدہ'
                            : 'Selected'
                          : isUrdu
                          ? 'یہ معیار نافذ کریں'
                          : 'Apply Method'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Developer API Endpoint Guide */}
          <div className="mt-6 p-4 rounded-xl bg-stone-950 border border-stone-800/80">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {isUrdu
                    ? 'ڈویلپر API انضمام (Developer Prayer Times API)'
                    : 'Developer API Integration & Endpoint'}
                </span>
              </div>
              <button
                onClick={() =>
                  handleCopyEndpoint(
                    `/api/prayer-times?method=${currentMethod}&madhab=Hanafi`
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-[11px] font-medium flex items-center gap-1 border border-stone-800"
              >
                {copiedEndpoint ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3 h-3" />
                    <span>Copy API URL</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {isUrdu
                ? 'تمام 28 طریقہ ہائے حساب کے اوقات حاصل کرنے کے لیے درج ذیل اینڈ پوائنٹ استعمال فرمائیں:'
                : 'Query the server prayer calculation API for any supported method directly:'}
            </p>
            <div className="mt-2 p-2.5 rounded-lg bg-stone-900 font-mono text-xs text-amber-300 border border-stone-800 flex items-center justify-between gap-2 overflow-x-auto">
              <code>
                GET /api/prayer-times?method={currentMethod}&madhab=Hanafi
              </code>
            </div>
            <div className="mt-1.5 text-[10px] text-stone-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>
                {isUrdu
                  ? 'تمام طریقے دیکھنے کا اینڈ پوائنٹ: GET /api/prayer-methods'
                  : 'Explore all methods via GET /api/prayer-methods'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <span>
            {isUrdu
              ? `موجودہ فعال طریقہ: ${PRAYER_CALCULATION_METHODS[currentMethod]?.nameUr || currentMethod}`
              : `Current Active Method: ${PRAYER_CALCULATION_METHODS[currentMethod]?.name || currentMethod}`}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold transition-colors"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
