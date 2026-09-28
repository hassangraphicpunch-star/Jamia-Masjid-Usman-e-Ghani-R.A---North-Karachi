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
  const [newQurbaniType, setNewQurbaniType] = useState<
    'cow_share' | 'full_cow' | 'goat' | 'waqf_deserving' | 'waqf_gaza'
  >('cow_share');
  const [newSharesCount, setNewSharesCount] = useState(1);
  const [newDay, setNewDay] = useState<'day1' | 'day2' | 'day3'>('day1');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // Share Calculator State
  const [calcType, setCalcType] = useState<'cow_share' | 'full_cow' | 'goat' | 'waqf_gaza'>('cow_share');
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
      // Scroll to tracker result if needed
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
    const text = `Alkhidmat Ijtemai Qurbani Status: Token ${activeBooking.receiptNo} - Status: ${activeBooking.currentStage}`;
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
      qurbaniType: newQurbaniType,
      sharesCount: Number(newSharesCount),
      day: newDay,
    });

    setActiveBooking(created);
    setSearchQuery(created.receiptNo);
    setHasSearched(true);
    setFormSuccessMessage(
      isUrdu
        ? `مبارک ہو! آپ کی بکنگ کامیابی سے درج ہو گئی ہے۔ آپ کا رسید نمبر ${created.receiptNo} ہے۔`
        : `Booking submitted successfully! Your receipt number is ${created.receiptNo}.`
    );
    setShowBookingForm(false);
    // Reset form
    setNewBookerName('');
    setNewBookerPhone('');
    setNewBookerCnic('');

    setTimeout(() => {
      const el = document.getElementById('qurbani-status-result');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  // Helper for status progress percentage
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
        return 'بکنگ تصدیق شدہ';
      case 'animal_allocated':
        return 'جانور مختص و ٹیگ نمبر جاری';
      case 'scheduled':
        return 'قربانی شیڈول طے شدہ';
      case 'slaughtered':
        return 'شرعی ذبح مکمل';
      case 'butchering_packing':
        return 'کٹائی، ڈی بوننگ و پیکنگ جاری';
      case 'ready_pickup':
        return 'گوشت وصولی کے لیے کاؤنٹر پر تیار!';
      case 'completed':
        return 'گوشت وصولی / تقسیم مکمل الحمد للہ';
      default:
        return stage;
    }
  };

  const sampleTokens = [
    { code: 'AK-10291', labelUr: '10291 (وصولی کیلئے تیار - ST-11 مرکز)', labelEn: '10291 (Ready for Pickup - ST-11)' },
    { code: 'AK-10482', labelUr: '10482 (ذبح و کٹائی جاری - گلشن کیمپ)', labelEn: '10482 (Butchering in Progress)' },
    { code: 'AK-10515', labelUr: '10515 (مکمل گائے - موصول ہو چکا)', labelEn: '10515 (Full Cow - Collected)' },
    { code: 'AK-10620', labelUr: '10620 (بکرا - سلاٹ 11:30 بجے)', labelEn: '10620 (Goat - Scheduled Slot)' },
    { code: 'AK-10834', labelUr: '10834 (تیسرا دن - بکنگ کنفرم)', labelEn: '10834 (Day 3 Booking)' },
    { code: 'AK-10999', labelUr: '10999 (وقف برائے غزہ و فلسطین)', labelEn: '10999 (Waqf for Gaza Relief)' },
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
              {isUrdu ? 'الخدمت اجتماعی قربانی پورٹل' : 'Alkhidmat Ijtemai Qurbani Portal'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-400 hidden md:inline">
              {isUrdu ? 'الخدمت ہیلپ لائن:' : 'Helpline:'}{' '}
              <strong className="text-amber-400 font-mono">1023</strong> / <strong className="text-emerald-400 font-mono">021-111-503-504</strong>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-stone-950 to-stone-950 pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-emerald-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          
          {/* Top Organization Header */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-600/40 text-emerald-300 text-xs sm:text-sm font-semibold shadow-inner">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isUrdu ? 'الخدمت فاؤنڈیشن کراچی' : 'Alkhidmat Foundation Karachi'}</span>
            <span className="text-emerald-500">·</span>
            <span className="text-amber-300 font-normal">
              {isUrdu ? 'جامع مسجد عثمانِ غنی ST-11 نارتھ کراچی برانچ' : 'Jamia Masjid Usman-e-Ghani Center'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {isUrdu ? 'الخدمت اجتماعی قربانی - لائیو اسٹیٹس ٹریکر' : 'Alkhidmat Ijtemai Qurbani - Live Status Tracker'}
          </h1>
          
          <p className="text-sm sm:text-base text-stone-300 max-w-3xl mx-auto leading-relaxed">
            {isUrdu
              ? 'اپنے گائے کے حصے، مکمل گائے، بکرے یا وقف قربانی کا موجودہ لائیو مرحلہ، سلاٹ کا وقت، اور گوشت وصولی کا کاؤنٹر معلوم کریں۔ دیانت و شرعی اصولوں کے عین مطابق۔'
              : 'Track the live progress of your cow share, full cow, goat, or waqf sacrifice. View slaughter schedule, hygienic cutting status, and meat pickup counter details.'}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 max-w-3xl mx-auto text-left">
            {ALKHIDMAT_QURBANI_INFO.stats.map((st, i) => (
              <div key={i} className="bg-stone-900/80 p-3 rounded-xl border border-emerald-900/40 text-center">
                <div className="text-lg sm:text-xl font-black text-amber-300 font-mono">{st.val}</div>
                <div className="text-[11px] text-stone-400">{isUrdu ? st.labelUr : st.labelEn}</div>
              </div>
            ))}
          </div>

          {/* Tracker Search Box */}
          <div className="pt-6 max-w-2xl mx-auto">
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

            {/* Quick Demo Sample Tokens */}
            <div className="pt-4 text-left">
              <div className="text-xs text-stone-400 mb-2 flex items-center justify-between">
                <span>{isUrdu ? 'فوری ٹیسٹ کے لیے نمونہ ٹوکن پر کلک کریں:' : 'Click sample tokens for quick preview:'}</span>
                <span className="text-[11px] text-amber-400">Live Simulation</span>
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
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {isUrdu ? 'قربانی کی موجودہ لائیو صورتحال' : 'Sacrifice Real-Time Progress'}
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
                      'قربانی کے عمل کی نگرانی الخدمت شریعہ ٹیم کر رہی ہے۔'}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-stone-950/60 p-3 rounded-xl border border-stone-800 shrink-0">
                  <div className="text-center">
                    <div className="text-[10px] text-stone-400 uppercase">{isUrdu ? 'سلاٹ دن' : 'Day'}</div>
                    <div className="text-xs font-bold text-white">{activeBooking.dayUr}</div>
                  </div>
                  <div className="h-6 w-px bg-stone-800" />
                  <div className="text-center">
                    <div className="text-[10px] text-stone-400 uppercase">{isUrdu ? 'مقررہ وقت' : 'Time'}</div>
                    <div className="text-xs font-bold text-amber-300">{activeBooking.timeSlotUr}</div>
                  </div>
                  <div className="h-6 w-px bg-stone-800" />
                  <div className="text-center">
                    <div className="text-[10px] text-stone-400 uppercase">{isUrdu ? 'کاؤنٹر نمبر' : 'Counter'}</div>
                    <div className="text-xs font-black text-emerald-300">{activeBooking.pickupLocation.counterNo}</div>
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
                <span>{isUrdu ? 'قربانی کے مراحل کی تفصیل (ورک فلو)' : 'Detailed Stage Timeline'}</span>
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
                      {activeBooking.qurbaniType === 'cow_share'
                        ? `گائے کا حصہ (${activeBooking.sharesCount})`
                        : activeBooking.qurbaniType === 'full_cow'
                        ? 'مکمل گائے (7 حصے)'
                        : activeBooking.qurbaniType === 'goat'
                        ? 'بکرا / دنبہ'
                        : 'وقف برائے خیرات'}
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

              {/* Right Column: Meat Pickup Location & Counter Directions */}
              <div className="bg-stone-900/90 rounded-2xl p-5 border border-stone-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>{isUrdu ? 'گوشت وصولی مرکز و کاؤنٹر' : 'Pickup Center & Counter'}</span>
                    </h4>
                    <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-bold text-xs border border-emerald-700/60">
                      {activeBooking.pickupLocation.counterNo}
                    </span>
                  </div>

                  {/* Center Address Box */}
                  <div className="bg-stone-950 p-4 rounded-xl border border-emerald-900/40 space-y-2">
                    <h5 className="font-bold text-emerald-300 text-sm">
                      {isUrdu ? activeBooking.pickupLocation.ur : activeBooking.pickupLocation.en}
                    </h5>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {isUrdu ? activeBooking.pickupLocation.addressUr : activeBooking.pickupLocation.addressEn}
                    </p>
                    <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
                      <span>
                        {isUrdu ? 'فوکل پرسن:' : 'Focal Person:'}{' '}
                        <strong className="text-stone-200">{activeBooking.pickupLocation.contactPerson}</strong>
                      </span>
                      <a
                        href={`tel:${activeBooking.pickupLocation.contactPhone.replace(/[^0-9+]/g, '')}`}
                        className="font-mono text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{activeBooking.pickupLocation.contactPhone}</span>
                      </a>
                    </div>
                  </div>

                  {/* Pickup Instructions Callout */}
                  <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-600/30 text-xs text-amber-200 space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <Clock className="w-4 h-4" />
                      <span>{isUrdu ? 'وصولی کے اہم ہدایات:' : 'Important Pickup Instructions:'}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-stone-300 text-[11px]">
                      <li>{isUrdu ? 'وصولی کیلئے اصلی شناختی کارڈ یا بکنگ رسید کا پرنٹ / میسج ہمراہ لائیں۔' : 'Bring original CNIC or digital slip token.'}</li>
                      <li>{isUrdu ? 'مقررہ سلاٹ کے اندر تشریف لائیں تاکہ ہجوم سے بچا جا سکے۔' : 'Arrive within your allotted slot to avoid queue.'}</li>
                      <li>{isUrdu ? 'گوشت کو کولڈ چین میں محفوظ رکھا گیا ہے، گھر لے جاتے ہی فوری فریزر میں رکھیں۔' : 'Store in freezer immediately upon arriving home.'}</li>
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
        {/* NEW BOOKING INQUIRY & RESERVATION SECTION */}
        {/* ============================================================== */}
        <section className="bg-gradient-to-r from-emerald-950/60 to-stone-900 rounded-3xl p-6 sm:p-8 border border-emerald-800/40 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'آن لائن بکنگ و استفسار' : 'Online Booking & Reservation'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isUrdu ? 'کیا آپ نئی قربانی یا حصہ بک کروانا چاہتے ہیں؟' : 'Book a New Qurbani Share or Animal'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
                {isUrdu
                  ? 'الخدمت کراچی کے تحت گائے کے حصے، مکمل گائے، بکرے یا غزہ ریلیف کے لیے آن لائن بکنگ فارم پر کریں۔ فوری ڈیجیٹل ٹوکن جاری کیا جائے گا۔'
                  : 'Reserve your cow share, full cow, goat, or Gaza relief share. Instant computerized token issued.'}
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
              <h4 className="font-bold text-white text-sm border-b border-stone-800 pb-2">
                {isUrdu ? 'صاحبِ قربانی کی معلومات درج فرمائیں:' : 'Enter Booker Details:'}
              </h4>

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
                    {isUrdu ? 'قربانی کی نوعیت *' : 'Sacrifice Type *'}
                  </label>
                  <select
                    value={newQurbaniType}
                    onChange={(e: any) => setNewQurbaniType(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="cow_share">{isUrdu ? 'گائے کا حصہ (روپے 24,000)' : 'Cow Share (Rs. 24,000)'}</option>
                    <option value="full_cow">{isUrdu ? 'مکمل گائے 7 حصے (روپے 1,68,000)' : 'Full Cow 7 Shares (Rs. 168,000)'}</option>
                    <option value="goat">{isUrdu ? 'بکرا / دنبہ (روپے 38,000)' : 'Goat (Rs. 38,000)'}</option>
                    <option value="waqf_gaza">{isUrdu ? 'وقف برائے غزہ و فلسطین (روپے 24,000)' : 'Waqf for Gaza Relief (Rs. 24,000)'}</option>
                    <option value="waqf_deserving">{isUrdu ? 'وقف برائے مستحقین تھر و بلوچستان (روپے 22,000)' : 'Waqf for Destitute (Rs. 22,000)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    {isUrdu ? 'تعدادِ حصے' : 'Number of Shares'}
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
                    {isUrdu ? 'ترجیحی دن' : 'Preferred Day'}
                  </label>
                  <select
                    value={newDay}
                    onChange={(e: any) => setNewDay(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="day1">{isUrdu ? 'پہلا دن (10 ذوالحجہ)' : 'Day 1 (10 Dhul Hijjah)'}</option>
                    <option value="day2">{isUrdu ? 'دوسرا دن (11 ذوالحجہ)' : 'Day 2 (11 Dhul Hijjah)'}</option>
                    <option value="day3">{isUrdu ? 'تیسرا دن (12 ذوالحجہ)' : 'Day 3 (12 Dhul Hijjah)'}</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  {isUrdu
                    ? 'وصولی مرکز: جامع مسجد عثمانِ غنی ST-11 نارتھ کراچی برانچ'
                    : 'Collection Center: Jamia Masjid Usman-e-Ghani ST-11 Center'}
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  {isUrdu ? 'بکنگ درج کریں اور ٹوکن حاصل کریں' : 'Submit & Generate Token'}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* ============================================================== */}
        {/* OFFICIAL RATE LIST & SHARE CALCULATOR */}
        {/* ============================================================== */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isUrdu ? 'الخدمت اجتماعی قربانی - باضابطہ ریٹ لسٹ' : 'Alkhidmat Official Qurbani Rates 2026'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              {isUrdu
                ? 'تمام اخراجات بشمول چارہ، طبی جانچ، ذبح، کٹائی، صفائی اور حفظانِ صحت کولڈ چین پیکنگ شامل ہیں۔'
                : 'All inclusive: Vetted healthy animals, slaughter, deboning, hygienic vacuum packaging & cold chain storage.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {QURBANI_RATES.map((rate) => (
              <div
                key={rate.id}
                className={`bg-stone-900 rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  rate.popular
                    ? 'border-amber-500/70 bg-stone-900/90 shadow-lg shadow-amber-950/20'
                    : 'border-stone-800'
                }`}
              >
                <div>
                  {rate.popular && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-600/40 rounded px-2 py-0.5 inline-block mb-2">
                      {isUrdu ? 'زیادہ ترجیح' : 'Popular Choice'}
                    </span>
                  )}
                  <h4 className="font-bold text-white text-sm leading-snug">
                    {isUrdu ? rate.titleUr : rate.titleEn}
                  </h4>
                  <div className="text-lg font-black text-amber-400 font-mono my-2">
                    {rate.priceFormatted}
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    {isUrdu ? rate.descriptionUr : rate.descriptionEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800 mt-4">
                  <button
                    onClick={() => {
                      setShowBookingForm(true);
                      setNewQurbaniType(rate.type as any);
                      window.scrollTo({ top: 600, behavior: 'smooth' });
                    }}
                    className="w-full py-2 rounded-xl bg-stone-800 hover:bg-emerald-900 text-stone-200 hover:text-white font-bold text-xs border border-stone-700 transition-colors"
                  >
                    {isUrdu ? 'بکنگ کا انتخاب' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Share Calculator */}
          <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 max-w-3xl mx-auto">
            <h4 className="font-bold text-white text-sm flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isUrdu ? 'فوری حصہ و رقم کیلکولیٹر' : 'Interactive Share & Meat Calculator'}</span>
              </span>
              <span className="text-xs text-stone-400 font-normal">
                {isUrdu ? 'تخمینہ رقم و وزن' : 'Estimated Cost & Yield'}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 items-center">
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">{isUrdu ? 'نوعیت منتخب کریں' : 'Select Type'}</label>
                <select
                  value={calcType}
                  onChange={(e: any) => setCalcType(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="cow_share">{isUrdu ? 'گائے کا حصہ (Rs. 24,000)' : 'Cow Share (Rs. 24,000)'}</option>
                  <option value="full_cow">{isUrdu ? 'مکمل گائے (Rs. 1,68,000)' : 'Full Cow (Rs. 1,68,000)'}</option>
                  <option value="goat">{isUrdu ? 'بکرا (Rs. 38,000)' : 'Goat (Rs. 38,000)'}</option>
                  <option value="waqf_gaza">{isUrdu ? 'غزہ ریلیف وقف (Rs. 24,000)' : 'Gaza Relief Waqf (Rs. 24,000)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">
                  {calcType === 'full_cow'
                    ? (isUrdu ? 'تعدادِ جانور' : 'Animals')
                    : (isUrdu ? 'تعدادِ حصے' : 'Shares')}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCalcQuantity(Math.max(1, calcQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-white text-sm w-8 text-center">{calcQuantity}</span>
                  <button
                    onClick={() => setCalcQuantity(Math.min(14, calcQuantity + 1))}
                    className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-emerald-900/40 text-center">
                <div className="text-[10px] text-stone-400">{isUrdu ? 'کل رقم' : 'Total Amount'}</div>
                <div className="text-lg font-black text-amber-400 font-mono">
                  روپے{' '}
                  {(
                    (calcType === 'cow_share'
                      ? 24000
                      : calcType === 'full_cow'
                      ? 168000
                      : calcType === 'goat'
                      ? 38000
                      : 24000) * calcQuantity
                  ).toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400">
                  ~
                  {calcType === 'cow_share'
                    ? 14.5 * calcQuantity
                    : calcType === 'full_cow'
                    ? 105 * calcQuantity
                    : calcType === 'goat'
                    ? 18 * calcQuantity
                    : 15 * calcQuantity}{' '}
                  KG گوشت
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* ALKHIDMAT KARACHI COLLECTION CENTERS DIRECTORY */}
        {/* ============================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isUrdu ? 'الخدمت کراچی گوشت وصولی مراکز' : 'Alkhidmat Karachi Distribution Centers'}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {isUrdu
                  ? 'اپنے قریبی مرکز کا پتہ اور فوکل پرسن کی تفصیلات معلوم کریں'
                  : 'Locate your nearest collection center, contact focal person and directions.'}
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>{isUrdu ? '45+ شہری کیمپس فعال' : '45+ Centers Active'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALKHIDMAT_COLLECTION_CENTERS.map((c) => (
              <div
                key={c.id}
                className="bg-stone-900 rounded-2xl p-5 border border-stone-800 hover:border-emerald-700/60 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white text-sm leading-snug">
                    {isUrdu ? c.nameUr : c.nameEn}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                    {c.zoneUr}
                  </span>
                </div>

                <p className="text-xs text-stone-400 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isUrdu ? c.addressUr : c.addressEn}</span>
                </p>

                <div className="pt-2 border-t border-stone-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-300">
                    <span className="text-stone-500">{isUrdu ? 'فوکل پرسن:' : 'Focal Person:'}</span>
                    <span className="font-medium">{c.focalPersonUr}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span className="text-stone-500">{isUrdu ? 'اوقاتِ کار:' : 'Timings:'}</span>
                    <span className="font-medium text-amber-300">{c.timingsUr}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span className="text-stone-500">{isUrdu ? 'رابطہ:' : 'Contact:'}</span>
                    <a href={`tel:${c.phone.split('/')[0].trim()}`} className="font-mono text-emerald-400 hover:underline">
                      {c.phone}
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {c.facilitiesUr.map((fac, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-stone-950 text-stone-400 border border-stone-800">
                      {fac}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
                  ? 'گائے کی عمر کم از کم 2 سال اور بکرے کی 1 سال ہونا لازمی ہے۔ تمام جانور دانت اور عیب سے پاک ہونے کے سرٹیفکیٹ کے بعد ذبح کیے جاتے ہیں۔'
                  : 'Cattle aged at least 2 full years, goats 1 year. Vetted by qualified veterinarians and religious scholars.'}
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1.5">
              <h5 className="font-bold text-emerald-300 text-sm">{isUrdu ? '۲. حفظانِ صحت اور کولڈ چین' : '2. Food Safety & Cold Chain'}</h5>
              <p className="leading-relaxed text-stone-400">
                {isUrdu
                  ? 'گوشت کو گرد و غبار اور مکھیوں سے پاک جدید چِلر گاڑیوں میں منتقل کیا جاتا ہے تاکہ گوشت کی غذائیت اور تازگی برقرار رہے۔'
                  : 'Hygienic processing in temperature-controlled transport preventing bacteria and preserving freshness.'}
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
