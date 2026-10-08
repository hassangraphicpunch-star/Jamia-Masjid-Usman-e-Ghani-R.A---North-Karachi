import React, { useState, useMemo } from 'react';
import {
  Moon,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Clock,
  Compass,
  Sunrise,
  Sunset,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Language } from '../types';
import {
  calculateMoonPhase,
  MoonPhaseType,
  MOON_PHASE_DEFINITIONS,
  DynamicMoonData,
} from '../services/astronomyService';
import { RealisticMoon } from './RealisticMoon';

interface CurrentMoonSectionProps {
  language: Language;
  selectedDate?: Date;
  onRefresh?: () => void;
  className?: string;
  isCompact?: boolean;
}

export const CurrentMoonSection: React.FC<CurrentMoonSectionProps> = ({
  language,
  selectedDate,
  onRefresh,
  className = '',
  isCompact = false,
}) => {
  const isUrdu = language === 'ur';
  const [activeDate, setActiveDate] = useState<Date>(selectedDate || new Date());
  const [selectedPhasePreview, setSelectedPhasePreview] = useState<MoonPhaseType | null>(null);
  const [timelineMode, setTimelineMode] = useState<'cycle' | 'live'>('cycle');

  // Dynamic astronomical calculation
  const moonData: DynamicMoonData = useMemo(() => {
    return calculateMoonPhase(activeDate, { lat: 24.9961, lng: 67.0673 });
  }, [activeDate]);

  // Display phase (either user previewed or actual dynamic current)
  const displayPhase = selectedPhasePreview
    ? MOON_PHASE_DEFINITIONS[selectedPhasePreview]
    : moonData.currentType;

  const displayIllumination = selectedPhasePreview
    ? displayPhase.typicalIllumination
    : moonData.illumination;

  const displayIsWaxing = selectedPhasePreview
    ? displayPhase.isWaxing
    : moonData.isWaxing;

  const displayDirectionArrow = displayPhase.id === 'full_moon' || displayPhase.id === 'new_moon'
    ? (displayPhase.id === 'full_moon' ? '—' : '↑')
    : displayIsWaxing
    ? '↑'
    : '↓';

  const displayDirectionUr = displayPhase.id === 'full_moon'
    ? 'بدرِ کامل (100% چاندنی)'
    : displayPhase.id === 'new_moon'
    ? 'نیا چاند (0% محاق)'
    : displayIsWaxing
    ? '↑ چاند بڑھ رہا ہے (Waxing)'
    : '↓ چاند گھٹ رہا ہے (Waning)';

  const displayDirectionColor = displayIsWaxing ? 'text-emerald-400' : 'text-amber-400';
  const displayDirectionBg = displayIsWaxing
    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
    : 'bg-amber-950/80 border-amber-500/50 text-amber-300';

  // Find closest cycle step to live calculation
  const activeCycleHour = useMemo(() => {
    const isWax = moonData.isWaxing;
    const list = (moonData.cycle24hTimeline || []).filter((item) =>
      isWax
        ? item.directionSymbol === '↑' || item.phaseId === 'full_moon'
        : item.directionSymbol === '↓' || item.phaseId === 'full_moon'
    );
    if (!list || list.length === 0) return 1;
    let closest = list[0];
    let minDiff = 999;
    for (const item of list) {
      const diff = Math.abs(item.illumination - moonData.illumination);
      if (diff < minDiff) {
        minDiff = diff;
        closest = item;
      }
    }
    return closest.hour;
  }, [moonData]);

  const resetToCurrent = () => {
    setSelectedPhasePreview(null);
    setActiveDate(new Date());
    if (onRefresh) onRefresh();
  };

  return (
    <div
      id="current-moon-type-section"
      className={`rounded-3xl bg-gradient-to-b from-stone-900/95 via-stone-950 to-stone-900 border border-emerald-600/40 p-4 sm:p-7 shadow-2xl shadow-emerald-950/50 relative overflow-hidden ${className}`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Background Celestial Atmosphere Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* SECTION TOP HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 shadow-md">
            <Moon className="w-5 h-5 text-amber-300 fill-amber-300/20" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/50">
                {isUrdu ? 'فلکیاتی و قمری حساب' : 'ASTRONOMICAL TELEMETRY'}
              </span>
              <span className="text-xs font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/50 font-arabic">
                {moonData.hijriDate.formattedUr}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {isUrdu ? 'کراچی (24.99° N, 67.06° E)' : 'Karachi (24.99° N, 67.06° E)'}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">
              {isUrdu ? 'موجودہ چاند کی حالت (Current Moon Type)' : 'Current Moon Type & Lunar Phases'}
            </h3>
          </div>
        </div>

        {/* Live Calculation Indicator & Reset */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {selectedPhasePreview && (
            <button
              type="button"
              onClick={resetToCurrent}
              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold transition-all flex items-center gap-1 shadow-md"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isUrdu ? 'آج کی لائیو حالت' : 'Back to Live'}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isUrdu ? 'خودکار فلکیاتی حساب' : 'Live Auto-Computed'}</span>
          </div>
        </div>
      </div>

      {/* HERO CURRENT MOON CARD */}
      <div className="rounded-2xl bg-gradient-to-br from-stone-950 via-stone-900 to-indigo-950/30 border border-emerald-500/30 p-5 sm:p-7 mb-6 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Col Left (5 Cols): Realistic Moon Illustration & Primary Titles */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center text-center sm:text-right lg:text-center gap-5">
            {/* Realistic Moon Graphic */}
            <div className="relative group cursor-pointer transition-transform hover:scale-105">
              <RealisticMoon
                phaseId={displayPhase.id}
                illumination={displayIllumination}
                size={isCompact ? 90 : 120}
                showGlow={true}
              />
              <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-stone-950/90 border border-stone-700 text-[10px] font-mono font-bold text-amber-300 shadow-md">
                {displayPhase.emoji} {displayIllumination}%
              </span>
            </div>

            {/* Phase Names */}
            <div className="space-y-1.5 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-600/70 text-emerald-300 text-xs font-bold shadow-sm">
                <span className="text-amber-300 text-sm">🌘</span>
                <span>{isUrdu ? 'موجودہ چاند کی حالت (Current Moon Type)' : 'Current Moon Type'}</span>
              </span>

              <h4 className="text-2xl sm:text-3xl font-black text-amber-300 font-urdu leading-normal">
                {displayPhase.nameUr}
              </h4>

              <div className="flex items-center justify-center sm:justify-start lg:justify-center gap-2 text-xs font-semibold text-stone-300">
                <span className="font-mono text-white text-sm">{displayPhase.nameEn}</span>
                <span className="text-stone-500">•</span>
                <span className="font-arabic text-amber-200/90 text-sm">{displayPhase.arabicName}</span>
              </div>
            </div>
          </div>

          {/* Col Right (7 Cols): Dynamic Metrics & Moon Telemetry */}
          <div className="lg:col-span-7 space-y-3">
            {/* Direction & Status Highlight Banner */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${displayDirectionBg}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-stone-950/80 flex items-center justify-center font-black text-lg">
                  {displayDirectionArrow === '↑' ? (
                    <ArrowUp className="w-5 h-5 text-emerald-400 animate-bounce" />
                  ) : displayDirectionArrow === '↓' ? (
                    <ArrowDown className="w-5 h-5 text-amber-400 animate-bounce" />
                  ) : (
                    <span className="text-amber-300 font-mono text-base">●</span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-extrabold block">
                    {displayDirectionUr}
                  </span>
                  <span className="text-[11px] text-stone-300 font-mono opacity-90 block">
                    Direction: {displayPhase.rangeEn}
                  </span>
                </div>
              </div>

              <div className="text-right sm:text-left font-mono">
                <span className="text-2xl font-black text-white block">
                  {displayIllumination}%
                </span>
                <span className="text-[10px] text-stone-300 block uppercase font-sans">
                  {isUrdu ? 'روشن فیصد' : 'Illumination'}
                </span>
              </div>
            </div>

            {/* 4 Telemetry Metrics Grid (Moon Age, Moonrise, Moonset, Hijri Estimate) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 1. Moon Age */}
              <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{isUrdu ? 'چاند کی عمر' : 'Moon Age'}</span>
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-white block">
                  {moonData.ageFormattedUr}
                </span>
                <span className="text-[10px] text-stone-500 block truncate font-mono">
                  {moonData.ageFormattedEn}
                </span>
              </div>

              {/* 2. Moonrise */}
              <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Sunrise className="w-3 h-3 text-amber-400" />
                  <span>{isUrdu ? 'طلوعِ قمر' : 'Moonrise'}</span>
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-amber-300 block">
                  {moonData.moonrise}
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  {isUrdu ? 'کراچی افق' : 'Karachi East'}
                </span>
              </div>

              {/* 3. Moonset */}
              <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Sunset className="w-3 h-3 text-orange-400" />
                  <span>{isUrdu ? 'غروبِ قمر' : 'Moonset'}</span>
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-orange-300 block">
                  {moonData.moonset}
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  {isUrdu ? 'مغربی افق' : 'Karachi West'}
                </span>
              </div>

              {/* 4. Hijri Day Alignment */}
              <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  <span>{isUrdu ? 'قمری تاریخ' : 'Hijri Date'}</span>
                </span>
                <span className="text-sm sm:text-base font-black font-urdu text-indigo-300 block truncate">
                  {moonData.hijriDate ? moonData.hijriDate.formattedUr : `${moonData.hijriDayEstimate} ربیع الثانی`}
                </span>
                <span className="text-[10px] text-stone-400 block truncate font-mono">
                  {moonData.hijriDate ? moonData.hijriDate.formattedEn : `Day ${moonData.hijriDayEstimate} AH`}
                </span>
              </div>
            </div>

            {/* Description & Islamic Reference Card */}
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-xs space-y-1">
              <p className="text-stone-300 leading-relaxed font-urdu">
                {displayPhase.descriptionUr}
              </p>
              <div className="pt-1.5 border-t border-stone-800/60 flex items-start gap-1.5 text-stone-400 text-[11px]">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong className="text-emerald-300">{isUrdu ? 'اسلامی اہمیت: ' : 'Significance: '}</strong>
                  {isUrdu ? displayPhase.islamicSignificanceUr : displayPhase.islamicSignificanceEn}
                </span>
              </div>
              <div className="pt-1.5 border-t border-stone-800/60 text-[11px] text-amber-200/90 font-arabic text-center">
                <span>وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ (سورة يس: 39)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO DIRECTION STATUS CARDS (WAXING & WANING) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6" dir={isUrdu ? 'rtl' : 'ltr'}>
        {/* Status Card 1: Waxing Moon (چاند بڑھ رہا ہے) */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            moonData.isWaxing
              ? 'bg-gradient-to-r from-emerald-950/80 to-stone-950 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
              : 'bg-stone-950/60 border-stone-800 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-600/70 flex items-center justify-center text-emerald-400 font-bold">
                <ArrowUp className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h5 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                  <span>{isUrdu ? 'چاند بڑھ رہا ہے' : 'Waxing Moon'}</span>
                  <span className="text-emerald-400 font-mono font-bold">↑</span>
                </h5>
                <span className="text-[11px] text-stone-400 font-mono">
                  Waxing Phase (Increasing Illumination)
                </span>
              </div>
            </div>

            {moonData.isWaxing && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-900 border border-emerald-500 text-emerald-200 text-[10px] font-bold animate-pulse">
                {isUrdu ? 'فی الوقت فعال' : 'Active Period'}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-urdu">
            {isUrdu
              ? 'نئے چاند (0%) سے لے کر بدرِ کامل (100%) تک چاندنی کا تناسب روز بروز بڑھتا ہے (سبز انڈیکیٹر ↑)۔'
              : 'From New Moon (0%) to Full Moon (100%), the illuminated fraction grows day by day with green upward arrow ↑.'}
          </p>
        </div>

        {/* Status Card 2: Waning Moon (چاند گھٹ رہا ہے) */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            !moonData.isWaxing
              ? 'bg-gradient-to-r from-amber-950/80 to-stone-950 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
              : 'bg-stone-950/60 border-stone-800 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-950 border border-amber-600/70 flex items-center justify-center text-amber-400 font-bold">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h5 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                  <span>{isUrdu ? 'چاند گھٹ رہا ہے' : 'Waning Moon'}</span>
                  <span className="text-amber-400 font-mono font-bold">↓</span>
                </h5>
                <span className="text-[11px] text-stone-400 font-mono">
                  Waning Phase (Decreasing Illumination)
                </span>
              </div>
            </div>

            {!moonData.isWaxing && (
              <span className="px-2 py-0.5 rounded-full bg-amber-900 border border-amber-500 text-amber-200 text-[10px] font-bold animate-pulse">
                {isUrdu ? 'فی الوقت فعال' : 'Active Period'}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-urdu">
            {isUrdu
              ? 'بدرِ کامل (100%) کے بعد سے لے کر اگلے محاق (0%) تک چاندنی گھٹتی ہے (اورنج/پیلا انڈیکیٹر ↓)۔'
              : 'From Full Moon (100%) to the next New Moon (0%), illumination shrinks steadily with orange/yellow downward arrow ↓.'}
          </p>
        </div>
      </div>

      {/* COMPLETE MOON PHASE PROGRESSION TIMELINE (8 PHASES GALLERY) */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h5 className="font-bold text-white text-xs sm:text-sm">
              {isUrdu ? 'قمری مراحل کا مکمل دورانیہ (تمام 8 اشکال):' : 'Complete 8 Lunar Phases Progression Timeline:'}
            </h5>
          </div>
          <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
            {isUrdu ? 'کسی بھی فیز پر کلک کر کے معائنہ کریں' : 'Click any phase to inspect'}
          </span>
        </div>

        <div className="grid grid-cols-2 min-[480px]:grid-cols-4 lg:grid-cols-8 gap-2.5" dir={isUrdu ? 'rtl' : 'ltr'}>
          {moonData.allPhases.map((phase) => {
            const isSelected = selectedPhasePreview === phase.id || (!selectedPhasePreview && phase.isCurrent);
            return (
              <div
                key={phase.id}
                onClick={() => setSelectedPhasePreview(phase.id)}
                className={`p-3 rounded-2xl border text-center flex flex-col justify-between items-center transition-all cursor-pointer group select-none ${
                  isSelected
                    ? 'bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-amber-400 ring-2 ring-amber-400/50 shadow-xl scale-[1.03]'
                    : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                }`}
              >
                {/* Active Tag */}
                <div className="h-4 flex items-center justify-center">
                  {phase.isCurrent ? (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-[9px] font-bold">
                      {isUrdu ? 'آج' : 'Live'}
                    </span>
                  ) : null}
                </div>

                {/* Moon Graphic */}
                <div className="my-1.5 group-hover:scale-110 transition-transform">
                  <RealisticMoon
                    phaseId={phase.id}
                    illumination={phase.typicalIllumination}
                    size={46}
                    showGlow={isSelected}
                  />
                </div>

                {/* Names & Illumination */}
                <div className="space-y-0.5 w-full">
                  <span className="text-xs font-bold text-white block font-urdu truncate">
                    {phase.nameUr}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono block truncate">
                    {phase.nameEn}
                  </span>
                  <span className={`text-[10px] font-mono font-bold block pt-1 border-t border-stone-800/80 ${phase.directionColor}`}>
                    {phase.rangeEn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 24-HOUR MOON TIMELINE (HOUR-BY-HOUR ILLUMINATION CHANGING) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h5 className="font-bold text-white text-xs sm:text-base">
                {isUrdu ? '24 گھنٹے کا فلکیاتی ٹائم لائن (گھنٹہ بہ گھنٹہ چاندنی و سمت):' : '24-Hour Moon Hourly Timeline (Hour-by-Hour Illumination):'}
              </h5>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              {isUrdu
                ? 'روشنی کی دونوں سمتیں: ↑ بڑھ رہا ہے (Waxing) 100% بدر تک، پھر ↓ گھٹ رہا ہے (Waning) محاق تک'
                : 'Demonstrating both directions: increases with ↑ during waxing to 100% Full Moon, then decreases with ↓ during waning.'}
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setTimelineMode('cycle')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timelineMode === 'cycle'
                  ? 'bg-emerald-600 text-stone-950 shadow-md font-black'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {isUrdu ? '24 مرحلہ وار چکر (↑ و ↓ دونوں)' : '24h Cycle (↑ & ↓)'}
            </button>
            <button
              type="button"
              onClick={() => setTimelineMode('live')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timelineMode === 'live'
                  ? 'bg-emerald-600 text-stone-950 shadow-md font-black'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {isUrdu ? '24 گھنٹے لائیو کراچی' : '24h Live Karachi'}
            </button>
          </div>
        </div>

        {/* Direction Key Indicator */}
        <div className="flex items-center gap-3 text-[11px] font-mono border-t border-stone-800/60 pt-2 flex-wrap">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span>↑</span>
            <span>{isUrdu ? 'سبز تیر = چاندنی بڑھ رہی ہے (0% تا 100% بدر)' : 'Green ↑ = Illumination Increasing (Waxing)'}</span>
          </span>
          <span className="text-stone-600">•</span>
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <span>↓</span>
            <span>{isUrdu ? 'پیلا/اورنج تیر = چاندنی گھٹ رہی ہے (100% تا 0% محاق)' : 'Yellow/Orange ↓ = Illumination Decreasing (Waning)'}</span>
          </span>
        </div>

        {/* Horizontal Smooth Scroll Bar */}
        <div
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-900 pb-2"
          dir={isUrdu ? 'rtl' : 'ltr'}
        >
          <div className="flex items-stretch gap-2.5 min-w-max" dir={isUrdu ? 'rtl' : 'ltr'}>
            {(timelineMode === 'cycle'
              ? moonData.cycle24hTimeline || moonData.hourly24hTimeline
              : moonData.hourly24hTimeline
            ).map((h, idx) => {
              const isItemActive = timelineMode === 'cycle' ? h.hour === activeCycleHour : idx === 0;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex flex-col justify-between items-center text-center space-y-2 w-28 shrink-0 transition-all ${
                    isItemActive
                      ? 'bg-gradient-to-b from-emerald-950 via-stone-900 to-stone-950 border-emerald-400 ring-2 ring-emerald-500/50 shadow-xl scale-[1.03]'
                      : 'bg-stone-900/60 border-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  {/* Hour & Active Badge */}
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-mono font-bold text-white block">
                        {h.timeFormatted}
                      </span>
                      {isItemActive && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-stone-950 text-[8px] font-black uppercase">
                          {isUrdu ? 'آج' : 'Live'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 font-urdu block">
                      {h.timeUr}
                    </span>
                  </div>

                  {/* Realistic Moon Graphic for this hour */}
                  <div className="my-1">
                    <RealisticMoon
                      phaseId={h.phaseId}
                      illumination={h.illumination}
                      size={36}
                      showGlow={isItemActive}
                    />
                  </div>

                  {/* Illumination & Direction Arrow */}
                  <div>
                    <div className="flex items-center justify-center gap-1 font-mono">
                      <span className="text-sm font-black text-white">
                        {h.illumination}%
                      </span>
                      <span
                        className={`text-xs font-black ${
                          h.directionSymbol === '↑'
                            ? 'text-emerald-400'
                            : h.directionSymbol === '↓'
                            ? 'text-amber-400'
                            : 'text-amber-300'
                        }`}
                      >
                        {h.directionSymbol}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-bold block ${
                        h.directionSymbol === '↑'
                          ? 'text-emerald-400'
                          : h.directionSymbol === '↓'
                          ? 'text-amber-400'
                          : 'text-amber-300'
                      }`}
                    >
                      {h.directionSymbol === '↑'
                        ? isUrdu
                          ? 'بڑھ رہا ہے'
                          : 'Waxing'
                        : h.directionSymbol === '↓'
                        ? isUrdu
                          ? 'گھٹ رہا ہے'
                          : 'Waning'
                        : isUrdu
                        ? 'بدرِ کامل'
                        : 'Full Moon'}
                    </span>
                  </div>

                  {/* Phase name in Urdu */}
                  <div className="pt-1.5 border-t border-stone-800/80 w-full text-[10px] font-urdu text-stone-300 truncate">
                    {h.phaseNameUr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
