import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  MapPin,
  Clock,
  Printer,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Phone,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { Language, QurbaniBookingRecord } from '../types';
import { ALKHIDMAT_QURBANI_INFO } from '../data/qurbaniData';
import { searchQurbaniBooking } from '../services/qurbaniService';

interface AlkhidmatQurbaniSectionProps {
  language: Language;
  onOpenFullPage: () => void;
  onSelectBooking?: (booking: QurbaniBookingRecord) => void;
}

export const AlkhidmatQurbaniSection: React.FC<AlkhidmatQurbaniSectionProps> = ({
  language,
  onOpenFullPage,
}) => {
  const isUrdu = language === 'ur';
  const [tokenInput, setTokenInput] = useState('AK-10291');
  const [quickResult, setQuickResult] = useState<QurbaniBookingRecord | null>(() =>
    searchQurbaniBooking('AK-10291')
  );
  const [searchErr, setSearchErr] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const res = searchQurbaniBooking(tokenInput);
    if (res) {
      setQuickResult(res);
      setSearchErr('');
    } else {
      setQuickResult(null);
      setSearchErr(
        isUrdu
          ? `کوئی ریکارڈ نہیں ملا۔ برائے کرم ٹوکن AK-10291 آزمائیں یا 0323-3469424 پر رابطہ کریں۔`
          : `No record found. Try AK-10291 or call 0323-3469424.`
      );
    }
  };

  return (
    <section
      id="ijtemai-qurbani"
      className="relative py-12 sm:py-16 bg-gradient-to-b from-stone-950 via-emerald-950/20 to-stone-950 border-t border-stone-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUrdu ? 'الخدمت اجتماعی قربانی ۱۴۴۷ھ' : 'Alkhidmat Foundation Karachi'}</span>
              <span className="text-emerald-500">·</span>
              <span className="text-amber-300 font-bold">{isUrdu ? 'صرف 30 گائے (پہلا دن)' : 'Strictly 30 Cows Day 1'}</span>
              <span className="text-emerald-500">·</span>
              <span className="text-emerald-200">{isUrdu ? 'خود وصولی: جامع مسجد عثمان غنی' : 'Self-Collection Only'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {isUrdu ? 'الخدمت اجتماعی قربانی - لائیو اسٹیٹس پورٹل' : 'Alkhidmat Ijtemai Qurbani - Live Tracking'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
              {isUrdu
                ? 'صرف گائے کا حصہ (روپے 24,000) • عید کے پہلے دن 30 گائے کی محدود گنجائش • گوشت کی خود وصولی صرف جامع مسجد عثمانِ غنی رضی اللہ عنہ سے ہوگی۔'
                : 'Cow Share Only (Rs. 24,000). Limited to 30 cows on Eid Day 1, with self-collection exclusively at Jamia Masjid Usman-e-Ghani.'}
            </p>
          </div>

          <button
            onClick={onOpenFullPage}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 shrink-0 self-start md:self-auto"
          >
            <span>{isUrdu ? 'مکمل قربانی پیج و بکنگ کھولیں' : 'Open Full Qurbani Page'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Constraint Alert Bar */}
        <div className="bg-amber-950/40 rounded-xl p-3 border border-amber-600/30 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              <strong>{isUrdu ? 'کوٹہ الرٹ:' : 'Quota Alert:'}</strong>{' '}
              {isUrdu
                ? 'کل 30 گائے (210 حصے) • 27 گائے بک شدہ • صرف عید کے پہلے دن (10 ذوالحجہ) ذبح و ترسیل'
                : 'Total 30 Cows (210 Shares) • 27 Booked • Eid Day 1 Slaughter Only'}
            </span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">
            {isUrdu ? 'گوشت: صرف خود وصولی مسجد کے کاؤنٹر سے' : 'Self-Collection at Masjid Usman-e-Ghani'}
          </span>
        </div>

        {/* Quick Tracker Interactive Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left search card (5 cols) */}
          <div className="lg:col-span-5 bg-stone-900/90 rounded-2xl p-6 border border-stone-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {isUrdu ? 'فوری اسٹیٹس تلاش کریں' : 'Quick Tracker'}
                </span>
                <span className="text-[11px] text-stone-400 font-mono">Day 1 Quota</span>
              </div>

              <form onSubmit={handleQuickSearch} className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder={isUrdu ? 'رسید نمبر (مثلاً AK-10291) یا CNIC...' : 'Receipt No or CNIC...'}
                    className="w-full bg-stone-950 text-white pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono border border-stone-800 focus:border-emerald-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'اسٹیٹس معلوم کریں' : 'Check Status'}</span>
                </button>
              </form>

              {searchErr && (
                <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
                  {searchErr}
                </p>
              )}

              {/* Sample test buttons */}
              <div className="pt-2">
                <span className="text-[11px] text-stone-400 block mb-1.5">
                  {isUrdu ? '30 گائے کوٹہ کے نمونہ ٹوکن:' : 'Try 30-cows Day 1 tokens:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['AK-10291', 'AK-10340', 'AK-10115', 'AK-10488'].map((tk) => (
                    <button
                      key={tk}
                      type="button"
                      onClick={() => {
                        setTokenInput(tk);
                        const r = searchQurbaniBooking(tk);
                        if (r) setQuickResult(r);
                      }}
                      className="px-2 py-1 rounded bg-stone-950 hover:bg-stone-800 text-amber-300 font-mono text-[11px] border border-stone-800 transition-colors"
                    >
                      {tk}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>{isUrdu ? 'جامع مسجد عثمان غنی ہیلپ ڈیسک:' : 'Masjid Desk:'}</span>
              <span className="font-mono text-emerald-400 font-bold">0323-3469424</span>
            </div>
          </div>

          {/* Right Live Status Preview (7 cols) */}
          <div className="lg:col-span-7 bg-stone-900/90 rounded-2xl p-6 border border-emerald-900/40 space-y-4 flex flex-col justify-between">
            {quickResult ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-xs text-stone-400">
                      {isUrdu ? 'صاحبِ قربانی:' : 'Booker:'}{' '}
                      <strong className="text-white">{quickResult.bookerNameUr}</strong>
                    </span>
                    <div className="text-[11px] text-emerald-400 font-mono">
                      رسید #{quickResult.receiptNo} · ٹوکن {quickResult.tokenCode}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      صرف پہلا دن (10 ذوالحجہ)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {quickResult.animalTagNo}
                    </span>
                  </div>
                </div>

                {/* Status Callout */}
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-300">
                      {isUrdu ? 'موجودہ لائیو مرحلہ:' : 'Current Status:'}
                    </span>
                    <span className="font-mono text-amber-300 font-bold">
                      {quickResult.timeSlotUr}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {quickResult.timeline.find((t) => t.current)?.labelUr || quickResult.currentStage}
                  </p>
                  <p className="text-xs text-stone-400">
                    {quickResult.timeline.find((t) => t.current)?.noteUr}
                  </p>
                </div>

                {/* Pickup details (Strictly Masjid Usman-e-Ghani) */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-stone-950 p-2.5 rounded-xl border border-amber-600/30">
                    <div className="text-[10px] text-amber-400 font-semibold">{isUrdu ? 'صرف خود وصولی مرکز' : 'Self-Collection Only'}</div>
                    <div className="font-bold text-stone-200 truncate mt-0.5">
                      مرکز جامع مسجد عثمانِ غنی
                    </div>
                    <div className="text-[10px] text-stone-400 truncate">ST-11 سیکٹر 5-A/1 نارتھ کراچی</div>
                  </div>
                  <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                    <div className="text-[10px] text-stone-500">{isUrdu ? 'مسجد کاؤنٹر نمبر' : 'Counter #'}</div>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      {quickResult.pickupLocation.counterNo}
                    </div>
                    <div className="text-[10px] text-stone-400">صحن مسجد / کولڈ چین زون</div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-stone-400">
                    تخمینہ وزن: <strong className="text-white">~{quickResult.meatDetails.netWeightKg} KG</strong> (بون لیس + مکس + کلیجی)
                  </span>
                  <button
                    onClick={onOpenFullPage}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    <span>{isUrdu ? 'مکمل تفصیل و رسید دیکھیں' : 'View Full Details & Slip'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <Search className="w-8 h-8 text-stone-600 mb-2" />
                <p className="text-xs">
                  {isUrdu ? 'رسید نمبر یا ٹوکن درج کر کے تلاش کریں۔' : 'Enter a receipt number to check status.'}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
