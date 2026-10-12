import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Info,
  MapPin,
  RotateCcw,
  Sunrise,
  Sunset,
  Sparkles,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Moon,
  CalendarDays,
} from 'lucide-react';
import {
  calculateMoonPhase,
  getMonthMoonCalendar,
  DailyCalendarDay,
  DynamicMoonData,
  formatKarachiDate,
  MOON_PHASE_DEFINITIONS,
  MoonPhaseType,
} from '../services/astronomyService';
import {
  calculatePakistanVerifiedHijri,
  getSyncedMoonAndHijriData,
  SyncedMoonAndHijriData,
  PAKISTAN_RUET_REGISTRY,
} from '../services/ruetHilalSyncService';
import { RealisticMoon } from './RealisticMoon';

interface MoonPhaseSectionProps {
  language?: 'ur' | 'en';
  onDateChange?: (date: Date) => void;
  className?: string;
  isCompact?: boolean;
}

/**
 * Professional, accurate, and interactive Moon Phase feature for Jamia Masjid Usman-e-Ghani R.A.
 * 
 * Synchronizes:
 * 1. Pakistan Officially Observed Hijri Calendar (Central Ruet-e-Hilal Committee / Ministry of Religious Affairs)
 *    - 1 Jumada al-Awwal 1448 AH on Tuesday, 13 October 2026
 *    - Advances daily at Maghrib (sunset in Karachi) as required by Shariah
 *    - Automatic background refresh every 6 hours and on demand
 * 2. High-precision Astronomical Moon Phase Calculations for Karachi, Pakistan (Timeanddate & USNO standards)
 *    - Accurate illumination percentage (e.g. Moon: 5.4%)
 *    - Realistic circular moon illustration with exact elliptical terminator math
 *    - 8 canonical phases and upcoming primary phases (New Moon, 1st Quarter, Full Moon, 3rd Quarter)
 *    - Monthly date-wise calendar with day inspection
 */
export const MoonPhaseSection: React.FC<MoonPhaseSectionProps> = ({
  language = 'ur',
  className = '',
  isCompact = false,
}) => {
  const isUrdu = language === 'ur';

  // Live current date in Pakistan
  const [currentNow, setCurrentNow] = useState<Date>(() => new Date());

  // Currently selected date for detailed inspection (defaults to today)
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  // Selected calendar view month and year
  const [calendarYear, setCalendarYear] = useState<number>(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(() => new Date().getMonth() + 1); // 1-12

  // View mode for the monthly calendar: 'grid' or 'table'
  const [calendarView, setCalendarView] = useState<'grid' | 'table'>('grid');

  // Automatic synchronization state
  const [syncedData, setSyncedData] = useState<SyncedMoonAndHijriData | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTimeFormatted, setLastSyncTimeFormatted] = useState<string>('');

  // Auto-update live time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Synchronize on mount and set up 6-hour refresh interval
  useEffect(() => {
    let isMounted = true;

    const performSync = async (force: boolean = false) => {
      try {
        const data = await getSyncedMoonAndHijriData(force, currentNow);
        if (isMounted) {
          setSyncedData(data);
          const syncDate = new Date(data.lastSyncedAt);
          setLastSyncTimeFormatted(
            syncDate.toLocaleTimeString(isUrdu ? 'ur-PK' : 'en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          );
        }
      } catch (err) {
        console.error('Failed to sync Ruet-e-Hilal data:', err);
      }
    };

    performSync(false);

    // 6-hour auto refresh interval
    const sixHourTimer = setInterval(() => {
      performSync(true);
    }, 6 * 60 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(sixHourTimer);
    };
  }, [currentNow, isUrdu]);

  // Manual refresh handler
  const handleManualRefresh = async () => {
    setIsSyncing(true);
    try {
      const data = await getSyncedMoonAndHijriData(true, selectedDate);
      setSyncedData(data);
      const syncDate = new Date(data.lastSyncedAt);
      setLastSyncTimeFormatted(
        syncDate.toLocaleTimeString(isUrdu ? 'ur-PK' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    } catch (e) {
      console.error('Manual sync error:', e);
    } finally {
      setTimeout(() => setIsSyncing(false), 600);
    }
  };

  // Compute detailed moon data for the selected date
  const activeMoonData: DynamicMoonData = useMemo(() => {
    return calculateMoonPhase(selectedDate, { lat: 24.9961, lng: 67.0673 });
  }, [selectedDate]);

  // Compute verified Pakistan Hijri status for the selected date
  const activeHijriStatus = useMemo(() => {
    return calculatePakistanVerifiedHijri(selectedDate);
  }, [selectedDate]);

  // Compute monthly calendar data
  const monthData = useMemo(() => {
    return getMonthMoonCalendar(calendarYear, calendarMonth, { lat: 24.9961, lng: 67.0673 });
  }, [calendarYear, calendarMonth]);

  // Check if viewing today
  const isViewingToday = useMemo(() => {
    const kNowStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(currentNow);

    const kSelectedStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(selectedDate);

    return kNowStr === kSelectedStr;
  }, [currentNow, selectedDate]);

  // Handlers for month navigation
  const handlePrevMonth = () => {
    if (calendarMonth === 1) {
      setCalendarYear((y) => y - 1);
      setCalendarMonth(12);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 12) {
      setCalendarYear((y) => y + 1);
      setCalendarMonth(1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const handleResetToToday = () => {
    const now = new Date();
    setSelectedDate(now);
    setCalendarYear(now.getFullYear());
    setCalendarMonth(now.getMonth() + 1);
  };

  const handleSelectDay = (day: DailyCalendarDay) => {
    setSelectedDate(day.date);
  };

  const weekdayHeadersEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdayHeadersUr = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

  return (
    <div
      className={`rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 border border-emerald-600/40 p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6 text-stone-100 ${className}`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* 1. TOP HEADER & LOCATION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{isUrdu ? 'مصدقہ اسلامی تقویم و فلکیاتی چاند' : 'Verified Hijri Calendar & Astronomical Moon'}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-stone-400 bg-stone-900/80 px-2 py-0.5 rounded-md border border-stone-800">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{isUrdu ? 'کراچی، پاکستان (Asia/Karachi)' : 'Karachi, Pakistan (Asia/Karachi)'}</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>{isUrdu ? 'چاند کے مراحل و باضابطہ پاکستانی ہجری تاریخ' : 'Moon Phase & Official Pakistan Hijri Date'}</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            {isUrdu
              ? 'مرکزی رویتِ ہلال کمیٹی پاکستان کے مصدقہ اعلانات اور امریکی رصد گاہ (USNO) / Timeanddate کے سائنسی معیارات کے مطابق ہم آہنگ'
              : 'Synchronized with official Central Ruet-e-Hilal Committee Pakistan declarations & USNO/Timeanddate astronomical standards'}
          </p>
        </div>

        {/* Action Controls: Reset to Today & Sync Button */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-emerald-700/60 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title={isUrdu ? 'رویتِ ہلال اور فلکیاتی ڈیٹا ریفریش کریں' : 'Refresh Ruet-e-Hilal and moon data'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isSyncing ? (isUrdu ? 'ہم آہنگ کیا جا رہا ہے...' : 'Syncing...') : (isUrdu ? 'تازہ ڈیٹا سنک کریں' : 'Sync Fresh Data')}</span>
          </button>

          {!isViewingToday && (
            <button
              type="button"
              onClick={handleResetToToday}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title={isUrdu ? 'آج کے موجودہ وقت پر واپس جائیں' : 'Reset to current live time'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'آج پر واپس جائیں' : 'Reset to Today'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 1.5 PROMINENT OFFICIAL PAKISTAN HIJRI DATE & RUET-E-HILAL SYNCHRONIZATION CARD */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/70 via-stone-900 to-amber-950/40 border-2 border-emerald-500/50 p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Prominent Hijri Date Display */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/60 text-emerald-200 text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isUrdu ? 'مصدقہ مرکزی رویتِ ہلال کمیٹی پاکستان' : 'Officially Confirmed: Central Ruet-e-Hilal Committee'}</span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-medium bg-amber-950/60 border border-amber-600/50 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-amber-400" />
                <span>{isUrdu ? 'وزارتِ مذہبی امور، حکومتِ پاکستان' : 'Ministry of Religious Affairs, Govt of Pakistan'}</span>
              </span>
            </div>

            {/* Prominent Hijri Date Text (e.g. 1 جمادی الاول 1448ھ / 1 Jumada al-Awwal 1448 AH) */}
            <div className="pt-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-emerald-200 tracking-tight font-arabic">
                {activeHijriStatus.formattedUr}
              </h2>
              <div className="text-sm sm:text-base font-bold text-stone-300 font-mono mt-0.5 flex items-center gap-2">
                <span>{activeHijriStatus.formattedEn}</span>
                <span className="text-stone-500">•</span>
                <span className="text-xs text-emerald-400 font-sans font-medium">
                  {isUrdu ? 'پاکستان میں باضابطہ نافذ العمل تاریخ' : 'Official Calendar for Pakistan'}
                </span>
              </div>
            </div>

            {/* Official Announcement Details */}
            {activeHijriStatus.officialAnnouncement && (
              <p className={`text-xs text-stone-300/90 leading-relaxed pt-1 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                {isUrdu
                  ? activeHijriStatus.officialAnnouncement.notesUr || activeHijriStatus.officialAnnouncement.announcementTitleUr
                  : activeHijriStatus.officialAnnouncement.notesEn || activeHijriStatus.officialAnnouncement.announcementTitleEn}
              </p>
            )}
          </div>

          {/* Right: Sunset Boundary & Live Synchronization Telemetry */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 bg-stone-950/80 border border-stone-800 p-3.5 rounded-xl text-xs md:min-w-[280px]">
            {/* Sunset Transition Status */}
            <div className="flex items-start gap-2">
              <Sunset className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">
                  {isUrdu ? `غروبِ آفتاب (مغرب): ${activeHijriStatus.maghribTimeStr} PKT` : `Karachi Maghrib: ${activeHijriStatus.maghribTimeStr} PKT`}
                </span>
                <span className="text-[11px] text-stone-400 block leading-tight">
                  {activeHijriStatus.isPostMaghrib
                    ? (isUrdu ? 'غروب کے بعد اگلی اسلامی تاریخ شروع ہو چکی ہے' : 'Post-Maghrib: Advanced to next Islamic night/day')
                    : (isUrdu ? `غروب (${activeHijriStatus.maghribTimeStr}) تک یکم جمادی الاول جاری رہے گی` : `Remains 1st Jumada al-Awwal until Maghrib`)}
                </span>
              </div>
            </div>

            {/* Sync Telemetry */}
            <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono">{isUrdu ? 'خودکار ریفریش: ہر 6 گھنٹے' : 'Auto-sync: Every 6 hours'}</span>
              </div>
              <span className="text-stone-400 font-mono">
                {lastSyncTimeFormatted ? `${isUrdu ? 'آخری تصدیق:' : 'Synced:'} ${lastSyncTimeFormatted}` : 'Live Engine'}
              </span>
            </div>

            {/* Next Expected Meeting */}
            <div className="pt-1 text-[11px] text-amber-300/90 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {isUrdu
                  ? 'اگلا رویتِ ہلال اجلاس: 29 جمادی الاول (10 نومبر 2026ء)'
                  : 'Next Moon Sighting: 29 Jumada al-Awwal (10 Nov 2026)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. COMPACT HERO MOON PHASE CARD (Inspired by Timeanddate Reference Image) */}
      <div className="rounded-2xl bg-gradient-to-br from-stone-950 via-stone-900/90 to-emerald-950/20 border border-emerald-500/30 p-5 sm:p-7 shadow-xl relative overflow-hidden">
        {/* Active Date Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-stone-800/80">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-sm sm:text-base text-white">
              {isUrdu ? activeMoonData.dateFormattedUr : activeMoonData.dateFormattedEn}
            </span>
            {isViewingToday ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 text-[10px] font-bold text-emerald-300">
                {isUrdu ? 'آج کا دن (Live)' : 'Today (Live)'}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-600 text-[10px] font-bold text-amber-300">
                {isUrdu ? 'منتخب تاریخ' : 'Selected Date'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-amber-300 font-arabic font-bold text-sm">
              {activeMoonData.hijriDate.formattedUr}
            </span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-300 font-mono text-[11px]">
              {activeMoonData.hijriDate.formattedEn}
            </span>
          </div>
        </div>

        {/* Central Display: Moon Illustration, Bold Illumination %, Phase Name */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column (5 Cols on LG): Moon Graphic & Bold Percentage */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-3">
            {/* Realistic Circular Moon Illustration */}
            <div className="relative group transition-transform hover:scale-105 duration-300">
              <RealisticMoon
                illumination={activeMoonData.illumination}
                isWaxing={activeMoonData.isWaxing}
                phaseId={activeMoonData.currentType.id}
                size={isCompact ? 100 : 130}
                showGlow={true}
                showOutline={true}
              />
            </div>

            {/* BOLD ILLUMINATION PERCENTAGE (e.g. Moon: 5.4%) */}
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight flex items-center justify-center gap-2">
                <span>{isUrdu ? `چاند: ${activeMoonData.illuminationPctStr}` : `Moon: ${activeMoonData.illuminationPctStr}`}</span>
              </div>

              {/* Phase Name underneath */}
              <div className="flex items-center justify-center gap-2 flex-wrap pt-0.5">
                <span className={`text-base sm:text-lg font-extrabold text-amber-300 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? activeMoonData.currentType.nameUr : activeMoonData.currentType.nameEn}
                </span>
                <span className="text-stone-500">•</span>
                <span className="text-xs text-stone-300 font-arabic font-medium">
                  {activeMoonData.currentType.arabicName}
                </span>
              </div>

              {/* Waxing / Waning direction badge */}
              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${activeMoonData.directionBadgeBg}`}
                >
                  {activeMoonData.directionSymbol === '↑' ? (
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  ) : activeMoonData.directionSymbol === '↓' ? (
                    <ArrowDown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  ) : (
                    <span className="text-amber-300 font-mono">●</span>
                  )}
                  <span>{isUrdu ? activeMoonData.directionUr : activeMoonData.directionEn}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols on LG): Telemetry & Detailed Metrics */}
          <div className="lg:col-span-7 space-y-3">
            {/* 4 Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 1. Moon Age */}
              <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{isUrdu ? 'چاند کی عمر' : 'Moon Age'}</span>
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-white block">
                  {isUrdu ? activeMoonData.ageFormattedUr : activeMoonData.ageFormattedEn}
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  {isUrdu ? 'قمری چکر میں' : 'Synodic Cycle'}
                </span>
              </div>

              {/* 2. Moonrise */}
              <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Sunrise className="w-3 h-3 text-amber-400" />
                  <span>{isUrdu ? 'طلوعِ قمر' : 'Moonrise'}</span>
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-amber-300 block">
                  {activeMoonData.moonrise}
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  {isUrdu ? 'مشرقی افق' : 'East Horizon'}
                </span>
              </div>

              {/* 3. Moonset */}
              <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Sunset className="w-3 h-3 text-orange-400" />
                  <span>{isUrdu ? 'غروبِ قمر' : 'Moonset'}</span>
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-orange-300 block">
                  {activeMoonData.moonset}
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  {isUrdu ? 'مغربی افق' : 'West Horizon'}
                </span>
              </div>

              {/* 4. Distance */}
              <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-cyan-400" />
                  <span>{isUrdu ? 'زمین سے فاصلہ' : 'Distance'}</span>
                </span>
                <span className="text-xs sm:text-sm font-black font-mono text-cyan-300 block truncate">
                  {activeMoonData.distanceKm.toLocaleString()} km
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  {isUrdu ? 'فلکیاتی پیمائش' : 'Geocentric'}
                </span>
              </div>
            </div>

            {/* Description & Significance Card */}
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-xs space-y-1.5">
              <p className={`text-stone-300 leading-relaxed ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                {isUrdu ? activeMoonData.currentType.descriptionUr : activeMoonData.currentType.descriptionEn}
              </p>
              <div className="pt-1.5 border-t border-stone-800/60 flex items-start gap-1.5 text-stone-400 text-[11px]">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong className="text-emerald-300">{isUrdu ? 'اسلامی اہمیت: ' : 'Significance: '}</strong>
                  {isUrdu
                    ? activeMoonData.currentType.islamicSignificanceUr
                    : activeMoonData.currentType.islamicSignificanceEn}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. UPCOMING PRIMARY MOON PHASES (Timeanddate Style 4-Phase Bar) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
            <span>{isUrdu ? 'آئندہ بنیادی قمری مراحل (Primary Phases)' : 'Upcoming Primary Moon Phases'}</span>
          </h4>
          <span className="text-[11px] text-stone-400 font-mono">
            {isUrdu ? 'پاکستان معیاری وقت (PKT)' : 'Pakistan Standard Time (PKT)'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {activeMoonData.nextPrimaryPhases.map((phase) => (
            <div
              key={phase.id}
              className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-emerald-600/50 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl">{phase.emoji}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-900 border border-stone-700 text-stone-300">
                  {phase.daysRemaining === 0
                    ? isUrdu
                      ? 'آج'
                      : 'Today'
                    : isUrdu
                    ? `${phase.daysRemaining} دن بعد`
                    : `In ${phase.daysRemaining}d`}
                </span>
              </div>

              <div>
                <h5 className={`font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? phase.nameUr : phase.nameEn}
                </h5>
                <div className="text-[11px] font-mono text-emerald-300 font-semibold mt-0.5">
                  {isUrdu ? phase.dateFormattedUr : phase.dateFormattedEn}
                </div>
                <div className="text-[10px] font-mono text-stone-400">
                  {phase.timeFormattedPkt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DAILY MOON PHASE CALENDAR (Date-wise for Selected Month) */}
      <div className="rounded-2xl bg-stone-950/90 border border-stone-800 p-4 sm:p-6 space-y-4">
        {/* Calendar Navigation & Month Selector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-white">
                {isUrdu
                  ? `${monthData.monthNameUr} ${monthData.year} - ماہانہ قمری تقویم`
                  : `${monthData.monthNameEn} ${monthData.year} - Moon Phase Calendar`}
              </h4>
              <p className="text-[11px] text-stone-400">
                {isUrdu
                  ? 'ہر تاریخ پر کلک کر کے چاند کی درست روشنی، مرحلہ اور ہجری تاریخ ملاحظہ فرمائیں'
                  : 'Click any day to view accurate illumination, phase, and Islamic date for Karachi'}
              </p>
            </div>
          </div>

          {/* Month Controls & Grid/Table Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* View switcher */}
            <div className="flex items-center rounded-xl bg-stone-900 border border-stone-800 p-0.5">
              <button
                type="button"
                onClick={() => setCalendarView('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  calendarView === 'grid'
                    ? 'bg-emerald-600 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
                title={isUrdu ? 'گرڈ منظر' : 'Grid view'}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCalendarView('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  calendarView === 'table'
                    ? 'bg-emerald-600 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
                title={isUrdu ? 'فہرست جدول' : 'Table view'}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1 rounded-xl bg-stone-900 border border-stone-800 p-0.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
                title={isUrdu ? 'پچھلا مہینہ' : 'Previous month'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono font-bold text-amber-300">
                {monthData.monthNameEn.slice(0, 3)} {calendarYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
                title={isUrdu ? 'اگلا مہینہ' : 'Next month'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CALENDAR VIEW: GRID */}
        {calendarView === 'grid' && (
          <div className="space-y-2">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] sm:text-xs text-stone-400 border-b border-stone-800/60 pb-1.5">
              {(isUrdu ? weekdayHeadersUr : weekdayHeadersEn).map((dayName, idx) => (
                <div key={idx} className="py-1">
                  {dayName}
                </div>
              ))}
            </div>

            {/* Calendar day cells */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Empty offset pads for start weekday */}
              {Array.from({ length: monthData.startWeekdayIndex }).map((_, padIdx) => (
                <div
                  key={`pad-${padIdx}`}
                  className="min-h-[70px] sm:min-h-[85px] rounded-xl bg-stone-950/20 border border-dashed border-stone-900/40 opacity-30"
                />
              ))}

              {/* Day cells */}
              {monthData.days.map((day) => {
                const isSelected =
                  day.dateKey ===
                  `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
                    selectedDate.getDate()
                  ).padStart(2, '0')}`;

                return (
                  <button
                    key={day.dayNumber}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`min-h-[70px] sm:min-h-[85px] p-1.5 rounded-xl border text-center flex flex-col justify-between items-center transition-all group relative ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/40 ring-2 ring-amber-400 shadow-lg'
                        : day.isToday
                        ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500'
                        : 'border-stone-800/80 bg-stone-900/50 hover:bg-stone-800/60 hover:border-emerald-600/50'
                    }`}
                  >
                    {/* Top Row: Day Number & Indicator */}
                    <div className="w-full flex items-center justify-between text-[10px] sm:text-xs">
                      <span
                        className={`font-mono font-bold ${
                          day.isToday ? 'text-emerald-400' : isSelected ? 'text-amber-300' : 'text-stone-300'
                        }`}
                      >
                        {day.dayNumber}
                      </span>

                      {/* Primary phase indicator dot */}
                      {day.isPrimaryPhase && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Primary Lunar Phase" />
                      )}

                      {/* Today pill */}
                      {day.isToday && (
                        <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-emerald-900/90 text-emerald-300">
                          {isUrdu ? 'آج' : 'Live'}
                        </span>
                      )}
                    </div>

                    {/* Middle: Realistic Moon Phase Illustration */}
                    <div className="my-0.5">
                      <RealisticMoon
                        illumination={day.illumination}
                        isWaxing={day.isWaxing}
                        phaseId={day.phaseId}
                        size={28}
                        showGlow={false}
                        showOutline={true}
                      />
                    </div>

                    {/* Bottom: Illumination Percentage & Phase Name */}
                    <div className="w-full">
                      <span
                        className={`text-[10px] sm:text-[11px] font-mono font-extrabold block truncate ${
                          day.isWaxing ? 'text-emerald-300' : 'text-amber-300'
                        }`}
                      >
                        {day.illuminationPctStr}
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-stone-400 block truncate leading-tight">
                        {isUrdu ? day.phaseNameUr : day.phaseNameEn}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CALENDAR VIEW: TABLE LIST */}
        {calendarView === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300 border-collapse">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px] font-mono">
                  <th className="py-2.5 px-3">{isUrdu ? 'تاریخ' : 'Date'}</th>
                  <th className="py-2.5 px-3 text-center">{isUrdu ? 'شبیہ' : 'Moon'}</th>
                  <th className="py-2.5 px-3">{isUrdu ? 'قمری مرحلہ' : 'Phase Name'}</th>
                  <th className="py-2.5 px-3">{isUrdu ? 'روشن فیصد' : 'Illumination'}</th>
                  <th className="py-2.5 px-3">{isUrdu ? 'طلوع' : 'Moonrise'}</th>
                  <th className="py-2.5 px-3">{isUrdu ? 'غروب' : 'Moonset'}</th>
                  <th className="py-2.5 px-3">{isUrdu ? 'فاصلہ' : 'Distance'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-900 font-mono">
                {monthData.days.map((day) => {
                  const isSelected =
                    day.dateKey ===
                    `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
                      selectedDate.getDate()
                    ).padStart(2, '0')}`;

                  return (
                    <tr
                      key={day.dayNumber}
                      onClick={() => handleSelectDay(day)}
                      className={`hover:bg-stone-900/80 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-950/30 text-amber-200'
                          : day.isToday
                          ? 'bg-emerald-950/20 text-emerald-200'
                          : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold">
                        <span>
                          {day.dayNumber} {monthData.monthNameEn} ({day.weekdayEn})
                        </span>
                        {day.isToday && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-600">
                            {isUrdu ? 'آج' : 'Today'}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <RealisticMoon
                          illumination={day.illumination}
                          isWaxing={day.isWaxing}
                          phaseId={day.phaseId}
                          size={24}
                          showGlow={false}
                          showOutline={true}
                        />
                      </td>
                      <td className={`py-2.5 px-3 font-sans font-bold ${isUrdu ? 'font-urdu' : ''}`}>
                        {isUrdu ? day.phaseNameUr : day.phaseNameEn}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-white">
                        {day.illuminationPctStr}
                      </td>
                      <td className="py-2.5 px-3 text-amber-300">{day.moonrise}</td>
                      <td className="py-2.5 px-3 text-orange-400">{day.moonset}</td>
                      <td className="py-2.5 px-3 text-stone-400">
                        {day.distanceKm.toLocaleString()} km
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. 8 CANONICAL PHASES QUICK GUIDE */}
      <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
        <h5 className="font-bold text-xs sm:text-sm text-stone-300 flex items-center gap-2">
          <span>{isUrdu ? 'چاند کے 8 بنیادی مراحل کی ترتیب (8 Lunar Phases):' : 'The 8 Lunar Phases Reference:'}</span>
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {Object.values(MOON_PHASE_DEFINITIONS).map((p) => (
            <div
              key={p.id}
              className={`p-2 rounded-xl bg-stone-900/60 border text-center space-y-1 transition-all ${
                activeMoonData.currentType.id === p.id
                  ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400'
                  : 'border-stone-800/80'
              }`}
            >
              <div className="flex justify-center">
                <RealisticMoon
                  illumination={p.typicalIllumination}
                  isWaxing={p.isWaxing}
                  phaseId={p.id}
                  size={32}
                  showGlow={false}
                  showOutline={true}
                />
              </div>
              <span className={`text-[10px] font-bold block truncate text-white ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? p.nameUr : p.nameEn}
              </span>
              <span className="text-[9px] font-mono text-stone-400 block truncate">
                {isUrdu ? p.rangeUr : p.rangeEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. SHARIAH & ASTRONOMICAL DISTINCTION NOTICE */}
      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-600/30 text-xs text-stone-300 space-y-2">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h6 className="font-bold text-emerald-200">
              {isUrdu ? 'شرعی رویت اور سائنسی فلکیاتی حساب میں اصولی فرق:' : 'Crucial Distinction: Shariah Ruet-e-Hilal vs Astronomical Computation'}
            </h6>
            <p className="leading-relaxed font-urdu text-emerald-200/90">
              {isUrdu
                ? 'فلکیاتی حسابی ماڈل چاند کی سائنسی پوزیشن، چاندنی کا تناسب (5.4%) اور طلوع و غروب کا درست وقت بتاتا ہے۔ جبکہ اسلامی قمری مہینے (رمضان، عیدین، اور تمام اسلامی مہینوں) کے آغاز کا مدار فلکیاتی محاق (New Moon) پر نہیں بلکہ رویتِ ہلال کی شرعی گواہی اور مرکزی رویتِ ہلال کمیٹی پاکستان کے باضابطہ اعلان پر ہے۔'
                : 'Astronomical calculations provide physical lunar position, illuminated percentage (5.4%), and rise/set times based on ephemerides. However, in Islamic jurisprudence, the official beginning of each lunar month across Pakistan is determined exclusively through verified moon-sighting testimony confirmed by the Central Ruet-e-Hilal Committee.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
