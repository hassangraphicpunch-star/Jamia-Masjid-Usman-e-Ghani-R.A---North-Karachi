import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Printer,
  Share2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  Building2,
  FileText,
  BadgeCheck,
  HeartHandshake,
  QrCode,
  Check,
  Home,
  AlertTriangle,
} from 'lucide-react';
import { Language, QurbaniBookingRecord, QurbaniStatusStage } from '../types';
import {
  ALKHIDMAT_QURBANI_INFO,
  QURBANI_RATES,
  ALKHIDMAT_COLLECTION_CENTERS,
  QURBANI_FAQS,
} from '../data/qurbaniData';
import {
  searchQurbaniBooking,
  getStoredQurbaniBookings,
  advanceBookingStage,
  createNewBookingInquiry,
} from '../services/qurbaniService';
import { QurbaniSlipModal } from './QurbaniSlipModal';

interface AlkhidmatQurbaniPageProps {
  language: Language;
  onBackToHome?: () => void;
}

export const AlkhidmatQurbaniPage: React.FC<AlkhidmatQurbaniPageProps> = ({
  language,
  onBackToHome,
}) => {
  const isUrdu = language === 'ur';

  // Search state
  const [searchQuery, setSearchQuery] = useState('AK-10291');
  const [activeBooking, setActiveBooking] = useState<QurbaniBookingRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // New Booking Inquiry Form State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newBookerName, setNewBookerName] = useState('');
  const [newBookerPhone, setNewBookerPhone] = useState('');
  const [newBookerCnic, setNewBookerCnic] = useState('');
  const [newSharesCount, setNewSharesCount] = useState(1);
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // Share Calculator State (Cow Share Only: Rs. 24,000 per share)
  const [calcQuantity, setCalcQuantity] = useState(1);

  // FAQs Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Initial load
  useEffect(() => {
    const defaultBooking = searchQurbaniBooking('AK-10291');
    if (defaultBooking) {
      setActiveBooking(defaultBooking);
      setHasSearched(true);
    }
  }, []);

  const handleSearch = (queryToUse?: string) => {
    const q = queryToUse !== undefined ? queryToUse : searchQuery;
    setSearchError('');
    if (!q || !q.trim()) {
      setSearchError(
        isUrdu
          ? 'براہ کرم رسید نمبر، ٹوکن، موبائل نمبر یا شناختی کارڈ درج کریں۔'
          : 'Please enter a Receipt No, Token, Phone or CNIC.'
      );
      return;
    }

    const res = searchQurbaniBooking(q);
    setHasSearched(true);
    if (res) {
      setActiveBooking(res);
      setSearchError('');
      setTimeout(() => {
        const el = document.getElementById('qurbani-status-result');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } else {
      setActiveBooking(null);
      setSearchError(
        isUrdu
          ? `کوئی ریکارڈ نہیں ملا: "${q}"۔ برائے مہربانی نیچے دیے گئے نمونہ ٹوکن چیک کریں یا 1023 ہیلپ لائن پر رابطہ کریں۔`
          : `No record found for "${q}". Try one of the sample tokens below or call 1023.`
      );
    }
  };

  const handleAdvanceSimulation = () => {
    if (!activeBooking) return;
    const updated = advanceBookingStage(activeBooking.receiptNo);
    if (updated) {
      setActiveBooking(updated);
    }
  };

  const handleCopyLink = () => {
    if (!activeBooking) return;
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleNewBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookerName || !newBookerPhone) {
      alert(isUrdu ? 'براہِ کرم نام اور موبائل نمبر درج فرمائیں۔' : 'Please provide name and phone number.');
      return;
    }

    const created = createNewBookingInquiry({
      bookerNameEn: newBookerName,
      bookerNameUr: newBookerName,
      phone: newBookerPhone,
      cnic: newBookerCnic,
      sharesCount: Number(newSharesCount),
    });

    setActiveBooking(created);
    setSearchQuery(created.receiptNo);
    setHasSearched(true);
    setFormSuccessMessage(
      isUrdu
        ? `مبارک ہو! آپ کی بکنگ عید کے پہلے دن (30 گائے کوٹہ) میں کامیابی سے درج ہو گئی ہے۔ رسید نمبر ${created.receiptNo} ہے۔ خود وصولی: جامع مسجد عثمان غنی۔`
        : `Booking submitted for Day 1! Your receipt number is ${created.receiptNo}. Self-collection at Jamia Masjid Usman-e-Ghani.`
    );
    setShowBookingForm(false);
    setNewBookerName('');
    setNewBookerPhone('');
    setNewBookerCnic('');

    setTimeout(() => {
      const el = document.getElementById('qurbani-status-result');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const getStagePercent = (stage: QurbaniStatusStage): number => {
    switch (stage) {
      case 'booked':
        return 14;
      case 'animal_allocated':
        return 30;
      case 'scheduled':
        return 45;
      case 'slaughtered':
        return 65;
      case 'butchering_packing':
        return 80;
      case 'ready_pickup':
        return 92;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const getStageColorBadge = (stage: QurbaniStatusStage) => {
    switch (stage) {
      case 'ready_pickup':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-pulse';
      case 'completed':
        return 'bg-emerald-600/30 text-emerald-200 border-emerald-500/60';
      case 'butchering_packing':
      case 'slaughtered':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  const getStageTitleUr = (stage: QurbaniStatusStage) => {
    switch (stage) {
      case 'booked':
        return 'بکنگ تصدیق شدہ (عید کا پہلا دن - 30 گائے کوٹہ)';
      case 'animal_allocated':
        return 'گائے مختص و ٹیگ نمبر جاری';
      case 'scheduled':
        return 'قربانی شیڈول طے شدہ (عید کا پہلا دن)';
      case 'slaughtered':
        return 'شرعی ذبح مکمل';
      case 'butchering_packing':
        return 'کٹائی، ڈی بوننگ و چلر پیکنگ جاری';
      case 'ready_pickup':
        return 'جامع مسجد عثمانِ غنی کے کاؤنٹر پر خود وصولی کیلئے تیار!';
      case 'completed':
        return 'جامع مسجد عثمان غنی سے خود وصولی مکمل الحمد للہ';
      default:
        return stage;
    }
  };

  const sampleTokens = [
    { code: 'AK-10291', labelUr: '10291 (گائے # 04 - وصولی کیلئے تیار)', labelEn: '10291 (Ready for Pickup)' },
    { code: 'AK-10340', labelUr: '10340 (گائے # 11 - کٹائی و پیکنگ)', labelEn: '10340 (Dressing & Packing)' },
    { code: 'AK-10115', labelUr: '10115 (گائے # 01 - خود وصولی مکمل)', labelEn: '10115 (Collected at Mosque)' },
    { code: 'AK-10488', labelUr: '10488 (گائے # 18 - شرعی ذبح مکمل)', labelEn: '10488 (Slaughter Completed)' },
    { code: 'AK-10650', labelUr: '10650 (گائے # 24 - سلاٹ 12:00 PM)', labelEn: '10650 (Scheduled Slot)' },
    { code: 'AK-10720', labelUr: '10720 (گائے # 30 - بکنگ تصدیق)', labelEn: '10720 (Booking Verified)' },
  ];

  return (
    <div className="w-full bg-stone-950 text-stone-100 min-h-screen">
      {/* Top Banner Navigation & Breadcrumbs */}
      <div className="bg-stone-900 border-b border-emerald-900/40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/60 font-semibold transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'مرکزی مسجد ویب سائٹ' : 'Back to Mosque Portal'}</span>
              </button>
            )}
            <span className="text-stone-500 hidden sm:inline">/</span>
            <span className="text-stone-300 font-medium">
              {isUrdu ? 'الخدمت اجتماعی قربانی پورٹل (صرف 30 گائے - عید کا پہلا دن)' : 'Alkhidmat Ijtemai Qurbani Portal'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-400 hidden md:inline">
              {isUrdu ? 'نارتھ کراچی ہیلپ لائن:' : 'Helpline:'}{' '}
              <strong className="text-amber-400 font-mono">0323-3469424</strong> / <strong className="text-emerald-400 font-mono">1023</strong>
            </span>
            <a
              href={`https://wa.me/92${ALKHIDMAT_QURBANI_INFO.whatsappNumber.replace(/^0/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/50 font-medium text-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Prominent Mandatory Constraints Notice Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900/90 to-amber-950 border-b border-amber-600/50 px-4 py-2.5 text-xs text-amber-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-black text-[10px] uppercase tracking-wider">
              اہم شرائط
            </span>
            <span>
              {isUrdu
                ? 'صرف گائے کا حصہ (روپے 24,000) • کل کوٹہ: 30 گائے • صرف عید کا پہلا دن (10 ذوالحجہ) • گوشت کی خود وصولی صرف جامع مسجد عثمانِ غنی (نارتھ کراچی)'
                : 'Cow Share Only (Rs. 24,000) • 30 Cows Quota • Eid Day 1 Only • Meat Self-Collection strictly at Jamia Masjid Usman-e-Ghani'}
            </span>
          </div>
          <span className="font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
            {isUrdu ? '3 گائے (21 حصے) باقی' : '3 Cows Remaining'}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-stone-950 to-stone-950 pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-emerald-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          
          {/* Top Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-600/40 text-emerald-300 text-xs sm:text-sm font-semibold shadow-inner">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isUrdu ? 'الخدمت اجتماعی قربانی ۱۴۴۷ھ' : 'Alkhidmat Foundation Karachi'}</span>
            <span className="text-emerald-500">·</span>
            <span className="text-amber-300 font-bold">
              {isUrdu ? 'صرف 30 گائے (عید کا پہلا دن)' : 'Strictly 30 Cows Day 1'}
            </span>
            <span className="text-emerald-500">·</span>
            <span className="text-emerald-200">
              {isUrdu ? 'خود وصولی: جامع مسجد عثمانِ غنی ST-11 نارتھ کراچی' : 'Self Collection: Masjid Usman-e-Ghani'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {isUrdu
              ? 'الخدمت اجتماعی قربانی - لائیو اسٹیٹس ٹریکر'
              : 'Alkhidmat Ijtemai Qurbani - Live Status Tracker'}
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-stone-300 max-w-3xl mx-auto leading-relaxed">
            {isUrdu
              ? 'عید کے پہلے دن (10 ذوالحجہ) کل 30 گائے کی اجتماعی قربانی کے تحت اپنے گائے کے حصے کا لائیو اسٹیٹس، شرعی ذبح و کٹائی کا مرحلہ اور جامع مسجد عثمانِ غنی سے خود وصولی کا کاؤنٹر نمبر معلوم کریں۔'
              : 'Track the live progress of your Cow Share. Sacrifice strictly on Eid Day 1 for 30 cows only, with hygienic vacuum-sealed packing and self-collection exclusively at Jamia Masjid Usman-e-Ghani.'}
          </p>

          {/* Quick Metrics Badge Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 max-w-3xl mx-auto text-left">
            <div className="bg-stone-900/90 p-3 rounded-xl border border-amber-600/40 text-center">
              <div className="text-lg sm:text-xl font-black text-amber-300 font-mono">30 گائے</div>
              <div className="text-[11px] text-stone-400">{isUrdu ? 'محدود کوٹہ (210 حصے)' : '30 Cows Quota'}</div>
            </div>
            <div className="bg-stone-900/90 p-3 rounded-xl border border-emerald-900/40 text-center">
              <div className="text-lg sm:text-xl font-black text-emerald-300 font-mono">{isUrdu ? 'صرف پہلا دن' : 'Day 1 Only'}</div>
              <div className="text-[11px] text-stone-400">{isUrdu ? '10 ذوالحجہ' : '10 Dhul Hijjah'}</div>
            </div>
            <div className="bg-stone-900/90 p-3 rounded-xl border border-emerald-900/40 text-center">
              <div className="text-lg sm:text-xl font-black text-amber-400 font-mono">24,000 روپے</div>
              <div className="text-[11px] text-stone-400">{isUrdu ? 'گائے کا حصہ (صرف)' : 'Cow Share Only'}</div>
            </div>
            <div className="bg-stone-900/90 p-3 rounded-xl border border-amber-600/40 text-center">
              <div className="text-lg sm:text-xl font-black text-amber-300 font-mono">{isUrdu ? 'صرف خود وصولی' : 'Self Collect'}</div>
              <div className="text-[11px] text-stone-400">{isUrdu ? 'جامع مسجد عثمان غنی' : 'Masjid Usman-e-Ghani'}</div>
            </div>
          </div>

          {/* Live Quota Progress Bar */}
          <div className="max-w-2xl mx-auto bg-stone-900/90 p-3.5 rounded-xl border border-amber-600/30 text-xs text-left space-y-2">
            <div className="flex items-center justify-between text-stone-300 font-medium">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isUrdu ? '30 گائے کوٹہ کی لائیو بکنگ صورتحال:' : 'Live 30 Cows Quota Status:'}</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                27 / 30 گائے بک (189 / 210 حصے)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full" style={{ width: '90%' }} />
            </div>
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>{isUrdu ? '90% کوٹہ مکمل' : '90% Filled'}</span>
              <span className="text-amber-400 font-bold">{isUrdu ? 'صرف 3 گائے (21 حصے) باقی ہیں' : 'Only 3 Cows (21 Shares) Available'}</span>
            </div>
          </div>

          {/* Tracker Search Box */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="bg-stone-900 p-2 sm:p-2.5 rounded-2xl border-2 border-emerald-600/70 shadow-2xl shadow-emerald-950/60 focus-within:border-emerald-400 transition-all">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-emerald-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isUrdu
                        ? 'رسید نمبر (مثلاً AK-10291)، ٹوکن یا CNIC درج کریں...'
                        : 'Enter Receipt No (e.g. AK-10291), Token or CNIC...'
                    }
                    className="w-full bg-stone-950 text-white pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none border border-stone-800 focus:border-emerald-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all shrink-0 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{isUrdu ? 'اسٹیٹس معلوم کریں' : 'Track Status'}</span>
                </button>
              </form>
            </div>

            {/* Error notice if any */}
            {searchError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-950/70 border border-rose-700/60 text-rose-200 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {/* Form Success Message */}
            {formSuccessMessage && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/70 border border-emerald-600/70 text-emerald-200 text-xs flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{formSuccessMessage}</span>
              </div>
            )}

            {/* Quick Demo Sample Tokens (30 Cows Day 1) */}
            <div className="pt-4 text-left">
              <div className="text-xs text-stone-400 mb-2 flex items-center justify-between">
                <span>{isUrdu ? '30 گائے مہم کے نمونہ ٹوکن چیک کریں:' : 'Click 30-cows sample tokens:'}</span>
                <span className="text-[11px] text-amber-400 font-mono">Day 1 / Self-Collect ST-11</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleTokens.map((st) => (
                  <button
                    key={st.code}
                    onClick={() => {
                      setSearchQuery(st.code);
                      handleSearch(st.code);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      searchQuery.toUpperCase() === st.code
                        ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500 shadow-sm'
                        : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800'
                    }`}
                  >
                    <span className="font-mono font-bold text-amber-300">{st.code}</span>
                    <span className="text-stone-400 ml-1.5 hidden sm:inline">
                      {isUrdu ? st.labelUr : st.labelEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* ============================================================== */}
        {/* TRACKER RESULT SECTION (When a booking is active) */}
        {/* ============================================================== */}
        {activeBooking && (
          <section id="qurbani-status-result" className="space-y-6">
            
            {/* Header with Title and Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                    {activeBooking.receiptNo}
                  </span>
                  <span className="text-stone-500">•</span>
                  <span className="text-xs text-stone-400">
                    {isUrdu ? 'ٹوکن کوڈ:' : 'Token Code:'}{' '}
                    <strong className="text-amber-300 font-mono">{activeBooking.tokenCode}</strong>
                  </span>
                  <span className="text-stone-500">•</span>
                  <span className="text-xs text-amber-400 font-bold">
                    {activeBooking.animalTagNo}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {isUrdu ? 'قربانی کی موجودہ لائیو صورتحال (صرف عید کا پہلا دن)' : 'Sacrifice Real-Time Progress (Day 1 Only)'}
                </h2>
              </div>

              {/* Action Buttons: Print Slip, Advance Stage Simulator, Copy Link */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSlipModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all hover:scale-105"
                  title="Print or Download Digital Token Slip"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isUrdu ? 'پرنٹ / ڈاؤن لوڈ رسید' : 'Print Slip'}</span>
                </button>

                <button
                  onClick={handleAdvanceSimulation}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-800/60 text-xs font-semibold transition-colors"
                  title="Simulate Next Progress Stage"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isUrdu ? 'اگلا مرحلہ سمیلیٹ کریں' : 'Next Stage Demo'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs transition-colors"
                  title="Copy Tracking Link"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Current Stage Highlight Alert Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border ${getStageColorBadge(activeBooking.currentStage)} bg-stone-900/90 relative overflow-hidden shadow-lg`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
                      {isUrdu ? 'موجودہ مرحلہ' : 'Current Status'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {getStageTitleUr(activeBooking.currentStage)}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300">
                    {activeBooking.timeline.find((t) => t.current)?.noteUr ||
                      'قربانی کے عمل کی شرعی نگرانی مفتیانِ کرام دارالعلوم کراچی و جامعۃ الرشید کر رہے ہیں۔'}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-stone-950/60 p-3 rounded-xl border border-stone-800 shrink-0">
                  <div className="text-center">
                    <div className="text-[10px] text-stone-400 uppercase">{isUrdu ? 'قربانی دن' : 'Day'}</div>
                    <div className="text-xs font-bold text-amber-300 font-mono">صرف پہلا دن (10 ذوالحجہ)</div>
                  </div>
                  <div className="h-6 w-px bg-stone-800" />
                  <div className="text-center">
                    <div className="text-[10px] text-stone-400 uppercase">{isUrdu ? 'مقررہ وقت' : 'Time'}</div>
                    <div className="text-xs font-bold text-emerald-300">{activeBooking.timeSlotUr}</div>
                  </div>
                  <div className="h-6 w-px bg-stone-800" />
                  <div className="text-center">
                    <div className="text-[10px] text-stone-400 uppercase">{isUrdu ? 'کاؤنٹر نمبر' : 'Counter'}</div>
                    <div className="text-xs font-black text-white">{activeBooking.pickupLocation.counterNo}</div>
                  </div>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>{isUrdu ? 'مجموعی پیشرفت' : 'Overall Completion'}</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {getStagePercent(activeBooking.currentStage)}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-stone-950 overflow-hidden p-0.5 border border-stone-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-400 transition-all duration-700 shadow-sm"
                    style={{ width: `${getStagePercent(activeBooking.currentStage)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Visual Stepper / 7-Stage Timeline */}
            <div className="bg-stone-900/80 rounded-2xl p-5 border border-stone-800/80 space-y-4">
              <h4 className="text-sm font-bold text-stone-300 flex items-center justify-between">
                <span>{isUrdu ? 'قربانی کے مراحل کی تفصیل (30 گائے کوٹہ)' : 'Detailed Stage Timeline'}</span>
                <span className="text-xs text-stone-500 font-normal">
                  {isUrdu ? 'شرعی نگرانی: ' + activeBooking.shariahSupervisorUr : activeBooking.shariahSupervisorUr}
                </span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-2 pt-2">
                {activeBooking.timeline.map((step, idx) => {
                  const isDone = step.completed;
                  const isCurrent = step.current;
                  return (
                    <div
                      key={step.stage}
                      className={`relative p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-emerald-950/80 border-emerald-500 shadow-md shadow-emerald-950/50'
                          : isDone
                          ? 'bg-stone-950/90 border-emerald-900/60'
                          : 'bg-stone-950/40 border-stone-800/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-amber-400 text-stone-950 animate-pulse'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </span>
                        {step.time && (
                          <span className="text-[10px] text-stone-400 font-mono">{step.time}</span>
                        )}
                      </div>

                      <div>
                        <div
                          className={`text-xs font-bold leading-tight ${
                            isCurrent
                              ? 'text-amber-300'
                              : isDone
                              ? 'text-emerald-300'
                              : 'text-stone-400'
                          }`}
                        >
                          {isUrdu ? step.labelUr : step.labelEn}
                        </div>
                        {step.noteUr && (
                          <p className="text-[10px] text-stone-400 mt-1 line-clamp-2">
                            {isUrdu ? step.noteUr : step.noteEn}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Two-Column Specification Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Booker & Animal Specification */}
              <div className="bg-stone-900/90 rounded-2xl p-5 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>{isUrdu ? 'بکنگ و جانور کی تفصیلات' : 'Booking & Animal Specs'}</span>
                  </h4>
                  <span className="text-xs text-amber-400 font-mono font-bold">
                    {activeBooking.animalTagNo}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800/80">
                    <div className="text-stone-500 text-[10px]">{isUrdu ? 'صاحبِ قربانی کا نام' : 'Booker Name'}</div>
                    <div className="font-bold text-stone-200 mt-0.5">{activeBooking.bookerNameUr}</div>
                    <div className="text-[10px] text-stone-400">{activeBooking.bookerNameEn}</div>
                  </div>

                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800/80">
                    <div className="text-stone-500 text-[10px]">{isUrdu ? 'شناختی کارڈ (CNIC)' : 'CNIC'}</div>
                    <div className="font-mono font-bold text-stone-200 mt-0.5">{activeBooking.cnic}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{activeBooking.phone}</div>
                  </div>

                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800/80">
                    <div className="text-stone-500 text-[10px]">{isUrdu ? 'قربانی کی قسم' : 'Sacrifice Type'}</div>
                    <div className="font-bold text-emerald-300 mt-0.5">
                      گائے کا حصہ ({activeBooking.sharesCount}) · صرف پہلا دن
                    </div>
                  </div>

                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800/80">
                    <div className="text-stone-500 text-[10px]">{isUrdu ? 'ادائیگی صورتحال' : 'Payment Status'}</div>
                    <div className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span>روپے {activeBooking.payment.amountPaid.toLocaleString()} (مکمل ادا شدہ)</span>
                    </div>
                  </div>
                </div>

                {/* Meat Package Breakdown */}
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-300">
                      {isUrdu ? 'گوشت پیکٹ کی تفصیلات (تخمینہ وزن)' : 'Meat Packaging Specifications'}
                    </span>
                    <span className="text-amber-300 font-mono font-bold text-sm">
                      ~{activeBooking.meatDetails.netWeightKg} KG Net
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-stone-900 p-2 rounded-lg border border-stone-800">
                      <div className="text-[10px] text-stone-400">{isUrdu ? 'بون لیس' : 'Boneless'}</div>
                      <div className="font-bold text-stone-200 mt-0.5">~{activeBooking.meatDetails.bonelessKg} KG</div>
                    </div>
                    <div className="bg-stone-900 p-2 rounded-lg border border-stone-800">
                      <div className="text-[10px] text-stone-400">{isUrdu ? 'ہڈی مکس' : 'With Bone'}</div>
                      <div className="font-bold text-stone-200 mt-0.5">~{activeBooking.meatDetails.boneKg} KG</div>
                    </div>
                    <div className="bg-stone-900 p-2 rounded-lg border border-stone-800">
                      <div className="text-[10px] text-stone-400">{isUrdu ? 'کلیجی' : 'Liver'}</div>
                      <div className="font-bold text-stone-200 mt-0.5">~{activeBooking.meatDetails.liverKg} KG</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-400 pt-1">
                    {isUrdu ? 'پیکنگ:' : 'Packaging:'} <strong>{activeBooking.meatDetails.packagingTypeUr}</strong>
                  </p>
                </div>
              </div>

              {/* Right Column: Meat Pickup Location & Counter Directions (Strictly Masjid Usman-e-Ghani) */}
              <div className="bg-stone-900/90 rounded-2xl p-5 border border-amber-600/40 space-y-4 flex flex-col justify-between shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <h4 className="font-bold text-amber-300 flex items-center gap-2 text-sm sm:text-base">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>{isUrdu ? 'گوشت کی خود وصولی کا مرکز (واحد مرکز)' : 'Sole Self-Collection Center'}</span>
                    </h4>
                    <span className="px-3 py-1 rounded-lg bg-amber-500 text-stone-950 font-black text-xs">
                      {activeBooking.pickupLocation.counterNo}
                    </span>
                  </div>

                  {/* Center Address Box */}
                  <div className="bg-stone-950 p-4 rounded-xl border border-emerald-900/60 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <Building2 className="w-4 h-4" />
                      <span>صرف خود وصولی (Self-Collection Only)</span>
                    </div>
                    <h5 className="font-black text-white text-sm sm:text-base">
                      {isUrdu ? activeBooking.pickupLocation.ur : activeBooking.pickupLocation.en}
                    </h5>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {isUrdu ? activeBooking.pickupLocation.addressUr : activeBooking.pickupLocation.addressEn}
                    </p>
                    <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
                      <span>
                        {isUrdu ? 'نگران و فوکل پرسن:' : 'Focal Person:'}{' '}
                        <strong className="text-stone-200">{activeBooking.pickupLocation.contactPerson}</strong>
                      </span>
                      <a
                        href={`tel:${activeBooking.pickupLocation.contactPhone.replace(/[^0-9+]/g, '')}`}
                        className="font-mono text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{activeBooking.pickupLocation.contactPhone}</span>
                      </a>
                    </div>
                  </div>

                  {/* Pickup Instructions Callout */}
                  <div className="bg-amber-950/40 p-3.5 rounded-xl border border-amber-600/40 text-xs text-amber-200 space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <Clock className="w-4 h-4" />
                      <span>{isUrdu ? 'خود وصولی کی اہم ہدایات:' : 'Self-Collection Instructions:'}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-stone-300 text-[11px]">
                      <li>
                        <strong className="text-amber-300">{isUrdu ? 'صرف جامع مسجد عثمانِ غنی:' : 'Masjid Usman-e-Ghani Only:'}</strong>{' '}
                        {isUrdu ? 'گوشت کی وصولی صرف مسجد کے کاؤنٹر سے ہوگی، کوئی ہوم ڈیلیوری نہیں ہے۔' : 'Meat must be self-collected on site; no home delivery.'}
                      </li>
                      <li>{isUrdu ? 'وصولی کیلئے اصلی شناختی کارڈ یا رسید کا پرنٹ / ڈیجیٹل ٹوکن موبائل میں ہمراہ لائیں۔' : 'Bring original CNIC or digital slip token on your phone.'}</li>
                      <li>{isUrdu ? 'عید کے پہلے دن اپنے مقررہ وقت پر تشریف لا کر کاؤنٹر سے پیکٹ وصول فرمائیں۔' : 'Please arrive during your designated slot on Day 1.'}</li>
                    </ul>
                  </div>
                </div>

                {/* Shariah Officer Stamp */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{isUrdu ? 'شریعہ تصدیق:' : 'Shariah Verified:'} {activeBooking.shariahSupervisorUr}</span>
                  </div>
                  <button
                    onClick={() => setSlipModalOpen(true)}
                    className="text-amber-400 hover:text-amber-300 underline font-semibold"
                  >
                    {isUrdu ? 'مکمل سلپ دیکھیں' : 'View Full Slip'}
                  </button>
                </div>

              </div>

            </div>

          </section>
        )}

        {/* ============================================================== */}
        {/* OFFICIAL RATE (ONLY COW SHARE) & SHARE CALCULATOR */}
        {/* ============================================================== */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-xs font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUrdu ? 'صرف گائے کا حصہ • عید کا پہلا دن • خود وصولی' : 'Cow Share Only · Day 1 · Self Collect'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isUrdu ? 'الخدمت اجتماعی قربانی - مقررہ نرخ (صرف گائے کا حصہ)' : 'Alkhidmat Cow Share Rate 2026'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              {isUrdu
                ? 'کل گنجائش صرف 30 گائے (210 حصے) رکھی گئی ہے۔ قربانی صرف عید کے پہلے دن (10 ذوالحجہ) ہوگی اور گوشت کی خود وصولی صرف جامع مسجد عثمان غنی سے ہوگی۔'
                : 'Limited to 30 Cows (210 shares). Day 1 slaughter only, with self-collection exclusively at Jamia Masjid Usman-e-Ghani.'}
            </p>
          </div>

          {/* Single Cow Share Card */}
          <div className="max-w-xl mx-auto">
            {QURBANI_RATES.map((rate) => (
              <div
                key={rate.id}
                className="bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-500/80 shadow-2xl shadow-amber-950/30 relative overflow-hidden space-y-5"
              >
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-black uppercase tracking-wider text-stone-950 bg-amber-400 rounded-full px-3 py-1">
                    {isUrdu ? 'صرف گائے کا حصہ' : 'Cow Share Only'}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-white text-lg sm:text-xl">
                    {isUrdu ? rate.titleUr : rate.titleEn}
                  </h4>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono my-2 flex items-baseline gap-2">
                    <span>{rate.priceFormatted}</span>
                    <span className="text-xs text-stone-400 font-normal">/ فی حصہ</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {isUrdu ? rate.descriptionUr : rate.descriptionEn}
                  </p>
                </div>

                {/* Key Inclusions List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-stone-800 text-xs">
                  <div className="flex items-center gap-2 text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isUrdu ? 'تخمینہ وزن: ~14.8 کلو گرام خالص' : '~14.8 KG Net Packaged Meat'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isUrdu ? 'بون لیس (~6 کلو) + ہڈی مکس + کلیجی' : 'Boneless (~6kg) + Bone cuts + Liver'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isUrdu ? 'صرف عید کا پہلا دن (10 ذوالحجہ)' : 'Eid Day 1 Slaughter Only'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isUrdu ? 'صرف خود وصولی: جامع مسجد عثمانِ غنی' : 'Self-Collection at Masjid Usman-e-Ghani'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowBookingForm(true);
                      window.scrollTo({ top: 750, behavior: 'smooth' });
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{isUrdu ? 'آن لائن بکنگ درج کریں (صرف گائے کا حصہ)' : 'Book Cow Share Online'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Share & Meat Calculator (Dedicated for Cow Shares) */}
          <div className="bg-stone-900/80 rounded-2xl p-5 border border-stone-800 max-w-2xl mx-auto space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isUrdu ? 'گائے کے حصوں کا فوری رقم و وزن کیلکولیٹر' : 'Cow Share Cost & Meat Calculator'}</span>
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">
                روپے 24,000 فی حصہ
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  {isUrdu ? 'گائے کے حصوں کی تعداد:' : 'Number of Cow Shares:'}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCalcQuantity(Math.max(1, calcQuantity - 1))}
                    className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-base transition-colors"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-white text-base w-12 text-center bg-stone-950 py-1.5 rounded-lg border border-stone-800">
                    {calcQuantity}
                  </span>
                  <button
                    onClick={() => setCalcQuantity(Math.min(7, calcQuantity + 1))}
                    className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-base transition-colors"
                  >
                    +
                  </button>
                  <span className="text-xs text-stone-400">
                    {calcQuantity === 7 ? (isUrdu ? '(مکمل گائے کے تمام 7 حصے)' : '(Full Cow - 7 Shares)') : (isUrdu ? 'حصے' : 'shares')}
                  </span>
                </div>

                {/* Quick preset buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {[1, 2, 3, 7].map((num) => (
                    <button
                      key={num}
                      onClick={() => setCalcQuantity(num)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border transition-colors ${
                        calcQuantity === num
                          ? 'bg-amber-500 text-stone-950 border-amber-400'
                          : 'bg-stone-950 text-stone-300 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      {num === 7 ? (isUrdu ? '7 (مکمل گائے)' : '7 (Full Cow)') : `${num} ${isUrdu ? 'حصہ' : 'Share'}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-emerald-900/40 text-center space-y-1">
                <div className="text-[11px] text-stone-400">{isUrdu ? 'کل واجب الادا رقم' : 'Total Amount'}</div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  روپے {(24000 * calcQuantity).toLocaleString()}
                </div>
                <div className="text-xs text-emerald-400 font-medium">
                  تخمینہ گوشت: ~{Math.round(14.8 * calcQuantity * 10) / 10} KG خالص
                </div>
                <div className="text-[10px] text-stone-500 pt-0.5">
                  صرف عید کا پہلا دن • خود وصولی جامع مسجد عثمان غنی
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* NEW BOOKING INQUIRY & RESERVATION SECTION */}
        {/* ============================================================== */}
        <section className="bg-gradient-to-r from-emerald-950/60 to-stone-900 rounded-3xl p-6 sm:p-8 border border-emerald-800/40 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'آن لائن بکنگ و استفسار (30 گائے کوٹہ)' : 'Online Booking (30 Cows Quota)'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isUrdu ? 'کیا آپ گائے کا حصہ بک کروانا چاہتے ہیں؟' : 'Book Your Cow Share Online'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
                {isUrdu
                  ? 'عید کے پہلے دن (10 ذوالحجہ) کے لیے کل 30 گائے کا محدود کوٹہ دستیاب ہے۔ فوری آن لائن بکنگ فارم پر کریں اور کمپیوٹرائزڈ ٹوکن حاصل کریں۔'
                  : 'Limited quota of 30 Cows for Eid Day 1. Instant computerized receipt issued upon booking.'}
              </p>
            </div>

            <button
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-lg shrink-0 flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{showBookingForm ? (isUrdu ? 'فارم بند کریں' : 'Close Form') : (isUrdu ? 'نئی بکنگ درج کریں' : 'Open Booking Form')}</span>
            </button>
          </div>

          {/* Collapsible Booking Form */}
          {showBookingForm && (
            <form
              onSubmit={handleNewBookingSubmit}
              className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4 animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h4 className="font-bold text-white text-sm">
                  {isUrdu ? 'صاحبِ قربانی کی معلومات درج فرمائیں:' : 'Enter Booker Details:'}
                </h4>
                <span className="text-xs text-amber-400 font-bold">
                  {isUrdu ? 'کوٹہ: صرف پہلا دن • 30 گائے' : 'Quota: Day 1 • 30 Cows'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    {isUrdu ? 'مکمل نام *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newBookerName}
                    onChange={(e) => setNewBookerName(e.target.value)}
                    placeholder={isUrdu ? 'مثلاً: محمد طارق صدیقی' : 'e.g. Muhammad Tariq'}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    {isUrdu ? 'موبائل نمبر *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={newBookerPhone}
                    onChange={(e) => setNewBookerPhone(e.target.value)}
                    placeholder="0323-1234567"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    {isUrdu ? 'شناختی کارڈ (CNIC)' : 'CNIC Number'}
                  </label>
                  <input
                    type="text"
                    value={newBookerCnic}
                    onChange={(e) => setNewBookerCnic(e.target.value)}
                    placeholder="42101-1234567-1"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    {isUrdu ? 'قربانی کی نوعیت (مقررہ)' : 'Sacrifice Type (Fixed)'}
                  </label>
                  <div className="w-full bg-stone-900/80 border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-bold flex items-center justify-between">
                    <span>{isUrdu ? 'گائے کا حصہ (روپے 24,000)' : 'Cow Share (Rs. 24,000)'}</span>
                    <span className="text-[10px] text-emerald-400 uppercase">صرف یہ آپشن</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    {isUrdu ? 'تعدادِ حصے (1 تا 7)' : 'Number of Shares (1 to 7)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={newSharesCount}
                    onChange={(e) => setNewSharesCount(Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    {isUrdu ? 'قربانی کا دن (مقررہ)' : 'Sacrifice Day (Fixed)'}
                  </label>
                  <div className="w-full bg-stone-900/80 border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 font-bold flex items-center justify-between">
                    <span>{isUrdu ? 'صرف پہلا دن (10 ذوالحجہ)' : 'Eid Day 1 Only'}</span>
                    <span className="text-[10px] text-amber-400">30 گائے کوٹہ</span>
                  </div>
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 flex flex-wrap items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-stone-400">{isUrdu ? 'گوشت وصولی کا طریقہ:' : 'Collection Method:'} </span>
                  <strong className="text-amber-300">
                    {isUrdu ? 'صرف خود وصولی - مرکز جامع مسجد عثمانِ غنی رضی اللہ عنہ (ST-11 نارتھ کراچی)' : 'Self-Collection Only at Jamia Masjid Usman-e-Ghani'}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400">{isUrdu ? 'کل رقم:' : 'Total Amount:'} </span>
                  <strong className="text-emerald-400 font-mono text-sm">
                    روپے {(24000 * newSharesCount).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-stone-400">
                  {isUrdu
                    ? 'نوٹ: فارم جمع کروانے کے بعد آپ کو فوری ڈیجیٹل ٹوکن الاٹ کر دیا جائے گا۔'
                    : 'Note: Instant computerized digital token will be issued upon submission.'}
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors w-full sm:w-auto"
                >
                  {isUrdu ? 'بکنگ درج کریں اور ٹوکن حاصل کریں' : 'Submit & Generate Token'}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* ============================================================== */}
        {/* SOLE SELF-COLLECTION CENTER: JAMIA MASJID USMAN-E-GHANI */}
        {/* ============================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold mb-1 border border-amber-500/40">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'صرف خود وصولی (Self-Collection Only)' : 'Self-Collection Only'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isUrdu ? 'گوشت وصولی مرکز: جامع مسجد عثمانِ غنی رضی اللہ عنہ' : 'Sole Collection Point: Jamia Masjid Usman-e-Ghani'}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {isUrdu
                  ? 'برائے مہربانی نوٹ فرمائیں کہ اس مہم کا تمام گوشت صرف جامع مسجد عثمان غنی سے خود وصول کیا جائے گا۔ کوئی ہوم ڈیلیوری یا دیگر مراکز نہیں ہیں۔'
                  : 'All meat must be self-collected on site at Jamia Masjid Usman-e-Ghani North Karachi.'}
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>{isUrdu ? '4 کاؤنٹرز فعال' : '4 Dedicated Counters Active'}</span>
            </div>
          </div>

          {/* Detailed Center Card */}
          {ALKHIDMAT_COLLECTION_CENTERS.map((c) => (
            <div
              key={c.id}
              className="bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-700/60 shadow-xl space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950">
                      {isUrdu ? 'واحد مجاز وصولی مرکز' : 'Sole Authorized Collection Point'}
                    </span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">
                      {c.zoneUr}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    {isUrdu ? c.nameUr : c.nameEn}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isUrdu ? c.addressUr : c.addressEn}</span>
                  </p>
                </div>

                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-1.5 text-xs shrink-0 min-w-[240px]">
                  <div className="flex justify-between text-stone-300">
                    <span className="text-stone-500">{isUrdu ? 'فوکل پرسن:' : 'Focal Person:'}</span>
                    <span className="font-bold text-white">{c.focalPersonUr}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span className="text-stone-500">{isUrdu ? 'وصولی کا دن:' : 'Day:'}</span>
                    <span className="font-bold text-amber-300">صرف پہلا دن (10 ذوالحجہ)</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span className="text-stone-500">{isUrdu ? 'اوقاتِ کار:' : 'Timings:'}</span>
                    <span className="font-bold text-emerald-400">{c.timingsUr}</span>
                  </div>
                  <div className="flex justify-between text-stone-300 pt-1 border-t border-stone-800">
                    <span className="text-stone-500">{isUrdu ? 'ہیلپ لائن رابطہ:' : 'Helpline:'}</span>
                    <a href="tel:03233469424" className="font-mono text-emerald-400 font-bold hover:underline">
                      0323-3469424
                    </a>
                  </div>
                </div>
              </div>

              {/* 4 Dedicated Mosque Counters Breakdown */}
              <div className="space-y-3">
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>{isUrdu ? 'جامع مسجد عثمان غنی کے صحن میں قائم 4 خصوصی کاؤنٹرز:' : '4 Dedicated Mosque Courtyard Counters:'}</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {c.countersBreakdown?.map((ctr, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1 hover:border-emerald-600/60 transition-colors"
                    >
                      <div className="text-xs font-black text-amber-400 font-mono">
                        {ctr.no}
                      </div>
                      <div className="text-xs font-semibold text-stone-200">
                        {ctr.titleUr}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {ctr.titleEn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities tags */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-800">
                {c.facilitiesUr.map((fac, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-stone-950 text-stone-300 border border-stone-800 flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ============================================================== */}
        {/* SHARIAH & HEALTH GUIDELINES */}
        {/* ============================================================== */}
        <section className="bg-stone-900/60 rounded-3xl p-6 sm:p-8 border border-stone-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {isUrdu ? 'شرعی رہنمائی و حفظانِ صحت کے اصول' : 'Shariah Compliance & Hygiene Standards'}
              </h3>
              <p className="text-xs text-stone-400">
                {ALKHIDMAT_QURBANI_INFO.shariahBoardUr}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-stone-300">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1.5">
              <h5 className="font-bold text-emerald-300 text-sm">{isUrdu ? '۱. شرعی عمر و تندرستی' : '1. Shariah Vetted Age'}</h5>
              <p className="leading-relaxed text-stone-400">
                {isUrdu
                  ? 'تمام 30 گائے کی عمر کم از کم 2 سال، دو دانت اور ہر عیب سے پاک ہونے کی تصدیق دارالعلوم کراچی کے مفتیانِ کرام اور ویٹرنری ڈاکٹرز کی ٹیم کرتی ہے۔'
                  : 'Cattle aged at least 2 full years, physically vetted by scholars and veterinarians for zero defects.'}
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1.5">
              <h5 className="font-bold text-emerald-300 text-sm">{isUrdu ? '۲. حفظانِ صحت اور کولڈ چین' : '2. Food Safety & Cold Chain'}</h5>
              <p className="leading-relaxed text-stone-400">
                {isUrdu
                  ? 'گوشت کو گرد و غبار اور مکھیوں سے پاک جدید چِلر گاڑیوں میں منتقل کیا جاتا ہے تاکہ گوشت کی غذائیت اور تازگی مسجد عثمان غنی تک برقرار رہے۔'
                  : 'Processed hygienically with cold-chain transport to ensure maximum freshness at Masjid Usman-e-Ghani.'}
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1.5">
              <h5 className="font-bold text-emerald-300 text-sm">{isUrdu ? '۳. کھالوں کی شفافیت' : '3. Hide Proceeds to Charity'}</h5>
              <p className="leading-relaxed text-stone-400">
                {isUrdu
                  ? 'قربانی کی کھالوں سے حاصل شدہ تمام آمدنی 10,000 سے زائد یتیم بچوں کی کفالت، فری ڈسپنسریوں اور ایمبولینس نیٹ ورک پر خرچ ہوتی ہے۔'
                  : '100% hide proceeds fund orphan education, free clinics, and emergency ambulance operations.'}
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* FREQUENTLY ASKED QUESTIONS (FAQS) */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-white text-center">
            {isUrdu ? 'اکثر پوچھے گئے سوالات (FAQs)' : 'Frequently Asked Questions'}
          </h3>

          <div className="max-w-3xl mx-auto space-y-2.5">
            {QURBANI_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-stone-200 hover:text-white font-semibold text-xs sm:text-sm"
                  >
                    <span>{isUrdu ? faq.qUr : faq.qEn}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-stone-300 leading-relaxed border-t border-stone-800/60 pt-3">
                      {isUrdu ? faq.aUr : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* Official Printable Slip Modal */}
      <QurbaniSlipModal
        isOpen={slipModalOpen}
        onClose={() => setSlipModalOpen(false)}
        booking={activeBooking}
        language={language}
      />
    </div>
  );
};
