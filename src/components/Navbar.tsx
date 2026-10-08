import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock,
  Volume2,
  VolumeX,
  Menu,
  X,
  Heart,
  Globe,
  Bell,
  MapPin,
  Calendar,
  ShieldCheck,
  Moon,
  BookOpen,
  CloudSun,
  Droplets,
  Wind,
  Sun,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { MOSQUE_INFO } from '../data/mockData';
import { getStoredNotifications, getReadNotificationIds } from '../services/notificationService';
import { KarachiWeatherData } from '../services/weatherService';
import { calculateMoonPhase } from '../services/astronomyService';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  nextPrayerInfo?: {
    nameEn: string;
    nameUr: string;
    countdownStr: string;
  };
  audioMuted: boolean;
  setAudioMuted: (muted: boolean) => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAdminModal?: () => void;
  onOpenAzanModal?: () => void;
  onOpenNotifications?: () => void;
  onOpenRamadanModal?: () => void;
  onOpenQuranModal?: () => void;
  onOpenDuasModal?: () => void;
  onOpenWeatherModal?: () => void;
  weatherData?: KarachiWeatherData | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  nextPrayerInfo,
  audioMuted,
  setAudioMuted,
  onNavigate,
  activeSection,
  onOpenAdminModal,
  onOpenAzanModal,
  onOpenNotifications,
  onOpenRamadanModal,
  onOpenQuranModal,
  onOpenDuasModal,
  onOpenWeatherModal,
  weatherData,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [weatherDropdownOpen, setWeatherDropdownOpen] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0);

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const weatherDropdownRef = useRef<HTMLDivElement>(null);

  // Accurate moon phase and verified Islamic Date (Day 25)
  const liveMoon = useMemo(() => {
    return calculateMoonPhase(new Date(), { lat: 24.9961, lng: 67.0673 });
  }, []);

  // Check unread notifications count
  const checkUnread = () => {
    try {
      const all = getStoredNotifications().filter((n) => n.isActive);
      const read = getReadNotificationIds();
      const count = all.filter((n) => !read.includes(n.id)).length;
      setUnreadNotifsCount(count);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    checkUnread();
    const handleUpd = () => checkUnread();
    window.addEventListener('mosque_notifications_updated', handleUpd);
    window.addEventListener('mosque_notifications_read_updated', handleUpd);
    return () => {
      window.removeEventListener('mosque_notifications_updated', handleUpd);
      window.removeEventListener('mosque_notifications_read_updated', handleUpd);
    };
  }, []);

  // Sticky navbar scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Click outside and ESC listeners for dropdowns and mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target as Node)
      ) {
        setMoreDropdownOpen(false);
      }
      if (
        weatherDropdownRef.current &&
        !weatherDropdownRef.current.contains(event.target as Node)
      ) {
        setWeatherDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreDropdownOpen(false);
        setMobileMenuOpen(false);
        setWeatherDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navItems = [
    { id: 'prayer-times', labelEn: 'Prayer Timings', labelUr: 'اوقات نماز' },
    { id: 'video-gallery', labelEn: 'Videos & Live', labelUr: 'ویڈیوز و بیانات' },
    { id: 'announcements', labelEn: 'Announcements', labelUr: 'تازہ اعلانات' },
    { id: 'facilities', labelEn: 'Facilities', labelUr: 'خدمات و شعبہ جات' },
    { id: 'wisdom-tasbih', labelEn: 'Wisdom & Tasbih', labelUr: 'تسبیح و حکمت' },
    { id: 'qibla-location', labelEn: 'Qibla & Location', labelUr: 'سمتِ قبلہ و مقام' },
    { id: 'donate', labelEn: 'Donations', labelUr: 'مسجد عطیات' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  const isUrdu = language === 'ur';

  return (
    <header
      id="main-mosque-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 w-full select-none ${
        isScrolled
          ? 'bg-stone-950/95 backdrop-blur-md shadow-xl shadow-emerald-950/30 border-b border-emerald-900/40 py-2 sm:py-2.5'
          : 'bg-stone-950/90 backdrop-blur-sm border-b border-stone-800/80 py-2.5 sm:py-3.5'
      }`}
    >
      {/* Container: Max width with auto margin, responsive padding across all breakpoints */}
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-3.5 2xl:gap-5">
          
          {/* ==================================================
              1. MASJID LOGO + BRANDING (Left, Visible All Screens)
              ================================================== */}
          <div
            onClick={() => handleItemClick('hero')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-h-[44px]"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleItemClick('hero');
              }
            }}
            aria-label="Go to Home"
          >
            {/* Mosque Logo & Emblem */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl overflow-hidden shadow-md shadow-emerald-950/60 border border-amber-500/60 group-hover:scale-105 transition-transform bg-stone-950 flex items-center justify-center shrink-0">
              <img
                src="/images/masjid_logo.jpg"
                alt="Jamia Masjid Usman-e-Ghani Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="shrink-0 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                  {isUrdu ? MOSQUE_INFO.nameUr : MOSQUE_INFO.nameEn}
                </span>
                <span className="hidden xl:inline-flex text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 shrink-0">
                  ST-11 Sector 5-A/1
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-400 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                <span>{isUrdu ? 'نارتھ کراچی، کراچی' : 'North Karachi, Karachi'}</span>
                <span className="text-stone-600 hidden xs:inline">•</span>
                <span className="text-amber-400/90 font-medium hidden xs:inline">Hanafi</span>
              </p>
            </div>
          </div>

          {/* ==================================================
              2. DESKTOP & TABLET NAVBAR ITEMS (>= 768px)
              ================================================== */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2 xl:gap-2.5 2xl:gap-3 shrink-0">

            {/* [Location / Prayer] - Tablet & Desktop (>= 768px) */}
            <button
              id="btn-nav-prayer-info"
              onClick={() => handleItemClick('prayer-times')}
              className="inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-emerald-800/70 hover:border-emerald-600 text-xs font-semibold transition-all shadow-sm shrink-0 min-h-[38px]"
              title={isUrdu ? 'آج کے نماز کے اوقات و باجماعت شیڈول' : 'View Today’s Prayer Timings & Jamaat Schedule'}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-stone-300 font-medium hidden xl:inline">
                {isUrdu ? 'اگلی نماز:' : 'Next:'}
              </span>
              <span className="font-bold text-amber-300">
                {nextPrayerInfo ? (isUrdu ? nextPrayerInfo.nameUr : nextPrayerInfo.nameEn) : (isUrdu ? 'اوقاتِ نماز' : 'Prayer Times')}
              </span>
              {nextPrayerInfo && (
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/80 font-bold">
                  {nextPrayerInfo.countdownStr}
                </span>
              )}
            </button>

            {/* [Date / Weather] Combined Button for Tablet (768px - 1024px) */}
            {onOpenWeatherModal && (
              <button
                id="btn-nav-date-weather-tablet"
                type="button"
                onClick={onOpenWeatherModal}
                className="hidden md:inline-flex lg:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-emerald-800/70 hover:border-amber-400 text-xs font-semibold transition-all shadow-sm shrink-0 min-h-[38px]"
                title={isUrdu ? `مصدقہ اسلامی تاریخ (${liveMoon.hijriDate.formattedUr}) اور کراچی کا موسم` : 'Verified Islamic Date & Karachi Weather'}
              >
                <Moon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-amber-300 font-urdu font-bold text-xs">
                  {liveMoon.hijriDate.formattedUr}
                </span>
                <span className="text-stone-600">•</span>
                <CloudSun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono font-bold text-white text-xs">
                  {weatherData ? `${weatherData.current.temperature}°C` : '27°C'}
                </span>
              </button>
            )}

            {/* [Date] - Separate for Desktop (>= 1025px) */}
            {onOpenWeatherModal && (
              <button
                id="btn-nav-date-desktop"
                type="button"
                onClick={onOpenWeatherModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-emerald-800/70 hover:border-amber-400 text-xs font-semibold transition-all shadow-sm group shrink-0 min-h-[38px]"
                title={isUrdu ? `مصدقہ اسلامی تاریخ و چاند کی صورتحال (${liveMoon.hijriDate.formattedUr})` : 'Verified Islamic Date & Moon Phase'}
              >
                <Moon className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-amber-300 font-urdu font-bold text-xs">
                  {liveMoon.hijriDate.formattedUr}
                </span>
                <span className="text-stone-400 text-[10px] font-mono hidden xl:inline">
                  • {liveMoon.currentType.nameUr} {liveMoon.illumination}% {liveMoon.directionSymbol}
                </span>
              </button>
            )}

            {/* [Weather] - Separate for Desktop (>= 1025px) with Hover Card */}
            {onOpenWeatherModal && (
              <div
                ref={weatherDropdownRef}
                className="relative hidden lg:inline-block shrink-0"
                onMouseEnter={() => setWeatherDropdownOpen(true)}
                onMouseLeave={() => setWeatherDropdownOpen(false)}
              >
                <button
                  id="btn-nav-weather-desktop"
                  onClick={onOpenWeatherModal}
                  className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-emerald-800/70 hover:border-amber-400 text-xs font-semibold transition-all shadow-sm group min-h-[38px]"
                  title={isUrdu ? 'کراچی کا موسم، ہوا کا معیار اور مکمل تفصیلات' : 'View Karachi Weather & Forecast'}
                >
                  <CloudSun className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="font-mono font-bold text-white text-xs">
                    {weatherData ? `${weatherData.current.temperature}°C` : '27°C'}
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    {isUrdu ? 'کراچی' : 'Khi'}
                  </span>
                  {weatherData && (
                    <span className="text-amber-300 hidden 2xl:inline text-[11px] font-medium truncate max-w-[85px]">
                      • {isUrdu ? weatherData.current.conditionUr : weatherData.current.conditionEn}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-amber-400 transition-colors" />
                </button>

                {/* Floating Rich Weather Hover Card */}
                {weatherDropdownOpen && weatherData && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-3.5 bg-stone-900/98 backdrop-blur-2xl border border-emerald-600/60 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2.5 text-xs select-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'نارتھ کراچی (سیکٹر 5-A/1)' : 'North Karachi Sector 5-A/1'}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-950 border border-emerald-700/60 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                        LIVE
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black font-mono text-white">
                            {weatherData.current.temperature}°C
                          </span>
                          <span className="text-stone-400 text-[11px] font-mono">
                            ({isUrdu ? 'محسوس' : 'Feels'} ~{weatherData.current.apparentTemperature}°C)
                          </span>
                        </div>
                        <span className="text-amber-300 font-medium text-xs block mt-0.5">
                          {isUrdu ? weatherData.current.conditionUr : weatherData.current.conditionEn}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center">
                        <CloudSun className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 space-y-0.5">
                        <span className="text-stone-400 text-[10px] block flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-sky-400" />
                          {isUrdu ? 'ہوا میں نمی' : 'Humidity'}
                        </span>
                        <strong className="text-white font-mono">{weatherData.current.relativeHumidity}%</strong>
                      </div>

                      <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 space-y-0.5">
                        <span className="text-stone-400 text-[10px] block flex items-center gap-1">
                          <Wind className="w-3 h-3 text-teal-400" />
                          {isUrdu ? 'سمندری ہوا' : 'Sea Breeze'}
                        </span>
                        <strong className="text-teal-300 font-mono">{weatherData.current.windSpeed} km/h</strong>
                      </div>

                      <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 space-y-0.5">
                        <span className="text-stone-400 text-[10px] block flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          {isUrdu ? 'ہوا کا معیار' : 'Air Quality'}
                        </span>
                        <strong className="text-amber-300 font-mono">
                          {weatherData.airQuality?.aqi ?? 86} ({isUrdu ? weatherData.airQuality?.statusUr ?? 'معتدل' : weatherData.airQuality?.statusEn ?? 'Moderate'})
                        </strong>
                      </div>

                      <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 space-y-0.5">
                        <span className="text-stone-400 text-[10px] block flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-yellow-400" />
                          {isUrdu ? 'دھوپ کی شدت' : 'UV Index'}
                        </span>
                        <strong className="text-yellow-400 font-mono">{weatherData.current.uvIndex} / 11</strong>
                      </div>
                    </div>

                    {/* Moon Phase & Islamic Date Quick Banner */}
                    <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{isUrdu ? 'اسلامی تاریخ:' : 'Islamic Date:'}</span>
                          <strong className="text-amber-300 font-urdu">{liveMoon.hijriDate.formattedUr}</strong>
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-stone-800/60">
                        <span className="text-stone-400 flex items-center gap-1.5">
                          <Moon className="w-3.5 h-3.5 text-amber-300" />
                          <span>{isUrdu ? 'موجودہ چاند:' : 'Moon Type:'}</span>
                          <strong className="text-white">{liveMoon.currentType.nameUr}</strong>
                        </span>
                        <span className={`font-mono font-bold ${liveMoon.isWaxing ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {liveMoon.illumination}% {liveMoon.directionSymbol}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setWeatherDropdownOpen(false);
                        onOpenWeatherModal();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'مکمل موسمیات و 7 روزہ پیش گوئی ›' : 'View Full Forecast & Duas ›'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* [English] - Tablet & Desktop (>= 768px) */}
            <button
              id="btn-language-toggle"
              onClick={() => setLanguage(isUrdu ? 'en' : 'ur')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 text-xs font-semibold transition-colors shrink-0 min-h-[38px]"
              title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* [Azan / Sound] - Desktop Only (>= 1025px) */}
            {onOpenAzanModal && (
              <button
                id="btn-nav-azan-sound-desktop"
                onClick={onOpenAzanModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/70 text-xs font-semibold transition-colors shrink-0 min-h-[38px]"
                title={isUrdu ? 'اذان کی آواز و دعا' : 'Play Adhan & Prayer Voice'}
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
                <span>{isUrdu ? 'صدائے اذان' : 'Adhan'}</span>
              </button>
            )}

            {/* ==================================================
                3. MORE ▼ DROPDOWN BUTTON & PANEL (Tablet & Desktop >= 768px)
                ================================================== */}
            <div className="relative inline-block shrink-0" ref={moreDropdownRef}>
              <button
                id="btn-nav-more-dropdown"
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm min-h-[38px] ${
                  moreDropdownOpen
                    ? 'bg-emerald-900/90 text-amber-300 border border-amber-400 shadow-emerald-950/60'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-200 border border-emerald-800/80 hover:border-amber-400'
                }`}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
                aria-label="More navigation options"
              >
                <span>{isUrdu ? 'مزید' : 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                {unreadNotifsCount > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </button>

              {/* Premium More Dropdown Menu Panel */}
              {moreDropdownOpen && (
                <div
                  role="menu"
                  aria-label="More Navigation Menu"
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-stone-900/98 backdrop-blur-2xl border border-emerald-600/60 rounded-2xl p-2.5 shadow-2xl shadow-black/90 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1"
                >
                  {/* Tablet only: Azan / Sound */}
                  {onOpenAzanModal && (
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onOpenAzanModal();
                      }}
                      className="lg:hidden w-full text-left p-2.5 rounded-xl hover:bg-emerald-950/80 border border-transparent hover:border-emerald-700/60 transition-all flex items-center justify-between group min-h-[44px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950/90 border border-emerald-700/70 flex items-center justify-center shrink-0">
                          <Volume2 className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform animate-pulse" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white group-hover:text-emerald-300 block">
                            {isUrdu ? 'صدائے اذان و دعا' : 'Adhan Voice & Dua'}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            {isUrdu ? 'اذان کی آواز و بعد کی دعا' : 'Play Adhan audio'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
                    </button>
                  )}

                  {/* 1. 📖 Quran */}
                  {onOpenQuranModal && (
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onOpenQuranModal();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-950/80 border border-transparent hover:border-emerald-700/60 transition-all flex items-center justify-between group min-h-[44px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950/90 border border-emerald-700/70 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white group-hover:text-emerald-300 block">
                            {isUrdu ? 'القرآن الکریم' : 'Holy Quran'}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            {isUrdu ? '114 سورتیں و تلاوت قراء' : '114 Surahs & Recitations'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                        114
                      </span>
                    </button>
                  )}

                  {/* 2. 🤲 Duas */}
                  {onOpenDuasModal && (
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onOpenDuasModal();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-amber-950/70 border border-transparent hover:border-amber-600/60 transition-all flex items-center justify-between group min-h-[44px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-950/90 border border-amber-600/60 flex items-center justify-center shrink-0">
                          <Heart className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white group-hover:text-amber-300 block">
                            {isUrdu ? 'مسنون دعائیں' : 'Masnoon Duas'}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            {isUrdu ? '126 روزمرہ دعائیں و اذکار' : '126 Daily Supplications'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                        126
                      </span>
                    </button>
                  )}

                  {/* 3. 🌙 Ramadan Calendar */}
                  {onOpenRamadanModal && (
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onOpenRamadanModal();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-amber-950/70 border border-transparent hover:border-amber-500/60 transition-all flex items-center justify-between group min-h-[44px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-950/90 border border-amber-500/60 flex items-center justify-center shrink-0">
                          <Moon className="w-4 h-4 text-amber-400 fill-amber-400/20 group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white group-hover:text-amber-300 block">
                            {isUrdu ? 'تقویمِ رمضان' : 'Ramadan Calendar'}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            {isUrdu ? '30 روزہ سحر و افطار ٹائم ٹیبل' : '30-Day Sehar & Iftar Schedule'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/60">
                        1448ھ
                      </span>
                    </button>
                  )}

                  {/* 4. 🔔 Notifications */}
                  {onOpenNotifications && (
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onOpenNotifications();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-stone-800/80 border border-transparent hover:border-stone-700 transition-all flex items-center justify-between group min-h-[44px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-center shrink-0 relative">
                          <Bell className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                          {unreadNotifsCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white group-hover:text-amber-200 block">
                            {isUrdu ? 'اعلانات و الرٹس' : 'Notifications & Alerts'}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            {isUrdu ? 'مسجد کے تازہ ترین نوٹسز' : 'Official Mosque Announcements'}
                          </span>
                        </div>
                      </div>
                      {unreadNotifsCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                          {unreadNotifsCount} New
                        </span>
                      )}
                    </button>
                  )}

                  {/* Subtle separator */}
                  <div className="border-t border-stone-800/80 my-1.5 pt-1.5">
                    {/* 5. 🛡 Admin Portal (Visually separate from normal visitor navigation) */}
                    {onOpenAdminModal && (
                      <button
                        role="menuitem"
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          onOpenAdminModal();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-stone-950/60 hover:bg-stone-950 border border-amber-500/20 hover:border-amber-500/50 transition-all flex items-center justify-between group mb-1.5 min-h-[44px]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-stone-900 border border-amber-500/40 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-amber-300 block">
                                {isUrdu ? 'انتظامیہ پورٹل' : 'Admin Portal'}
                              </span>
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-700/60">
                                OFFICE
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-400 block">
                              {isUrdu ? 'اوقاتِ نماز ایڈیٹر و سیٹنگز' : 'Prayer Times & Settings'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
                      </button>
                    )}

                    {/* 6. ❤️ Donate (Visually highlighted with gold/gradient accent) */}
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        handleItemClick('donate');
                      }}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs flex items-center justify-between shadow-lg shadow-amber-950/40 transition-all group min-h-[44px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-stone-950/20 flex items-center justify-center shrink-0">
                          <Heart className="w-4 h-4 fill-current text-stone-950" />
                        </div>
                        <div className="text-left">
                          <span className="block text-xs font-black text-stone-950">
                            {isUrdu ? 'مسجد فنڈ میں تعاون' : 'Donate to Mosque'}
                          </span>
                          <span className="block text-[10px] font-semibold text-stone-900/80">
                            {isUrdu ? 'صدقہ جاریہ' : 'Sadaqah Jariyah'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black bg-stone-950 text-amber-300 px-2 py-1 rounded-md">
                        {isUrdu ? 'تعاون' : 'Give'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              4. MOBILE HEADER (320px - 767px)
              Shows ONLY Mosque Logo + Hamburger [☰]
              ================================================== */}
          <div className="flex md:hidden items-center shrink-0">
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 hover:text-white hover:border-emerald-600/60 transition-colors shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px] touch-manipulation"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-amber-400" />
              ) : (
                <Menu className="w-5 h-5 text-stone-200" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Centered Section Navigation Links (>= 1025px) */}
        <nav className="hidden lg:flex items-center justify-center gap-1.5 mt-2.5 pt-2 border-t border-stone-800/40">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900/60'
                } ${isUrdu ? 'font-urdu text-sm' : ''}`}
              >
                {isUrdu ? item.labelUr : item.labelEn}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ==================================================
          5. MOBILE NAVIGATION DRAWER & BACKDROP (< 768px)
          Smooth slide-down animation, locked body scroll
          ================================================== */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-Down Mobile Drawer Menu */}
          <div
            id="mobile-drawer-menu"
            className="fixed top-[58px] sm:top-[66px] left-0 right-0 max-h-[calc(100vh-58px)] sm:max-h-[calc(100vh-66px)] overflow-y-auto bg-stone-950/98 backdrop-blur-2xl border-b border-emerald-900/40 px-3.5 sm:px-6 py-4 space-y-3 z-50 md:hidden shadow-2xl animate-in slide-in-from-top-2 duration-200"
          >
            {/* 1. 📍 Location / Prayer Card */}
            {nextPrayerInfo && (
              <div
                onClick={() => handleItemClick('prayer-times')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-700/60 text-xs cursor-pointer hover:bg-emerald-900/50 transition-colors shadow-inner min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      ST-11 Sector 5-A/1 North Karachi
                    </span>
                    <span className="text-white font-bold text-xs">
                      {isUrdu ? 'اگلی نماز:' : 'Next Prayer:'}{' '}
                      <strong className="text-amber-300">
                        {isUrdu ? nextPrayerInfo.nameUr : nextPrayerInfo.nameEn}
                      </strong>
                    </span>
                  </div>
                </div>
                <span className="text-emerald-300 font-mono font-bold bg-stone-900/90 px-2.5 py-1 rounded-lg border border-emerald-800 text-xs">
                  {nextPrayerInfo.countdownStr}
                </span>
              </div>
            )}

            {/* 2. 📅 Date (Verified Hijri Date & Moon Status) */}
            {onOpenWeatherModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenWeatherModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-stone-900/90 border border-emerald-800/80 hover:border-amber-400 transition-colors flex items-center justify-between shadow-sm min-h-[44px] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center shrink-0">
                    <Moon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-emerald-400">
                        {isUrdu ? 'مصدقہ اسلامی تاریخ' : 'Verified Hijri Date'}
                      </span>
                    </div>
                    <strong className="text-amber-300 font-urdu text-sm block">
                      {liveMoon.hijriDate.formattedUr}
                    </strong>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-stone-300 text-xs block font-medium">
                    {liveMoon.currentType.nameUr}
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${liveMoon.isWaxing ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {liveMoon.illumination}% {liveMoon.directionSymbol}
                  </span>
                </div>
              </button>
            )}

            {/* 3. 🌤 Weather (Karachi Weather Card) */}
            {onOpenWeatherModal && (
              <button
                onClick={() => {
                  onOpenWeatherModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-3.5 rounded-2xl text-sm font-semibold text-emerald-300 bg-stone-900/90 border border-stone-800 hover:border-amber-400 flex flex-col gap-2 transition-all shadow-sm min-h-[44px]"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {isUrdu ? 'کراچی لائیو موسم (نارتھ کراچی)' : 'Karachi Weather (Sector 5-A/1)'}
                    </span>
                  </div>
                  <span className="text-amber-300 font-mono font-bold text-sm">
                    {weatherData ? `${weatherData.current.temperature}°C` : '27°C'} ›
                  </span>
                </div>

                {weatherData && (
                  <div className="flex items-center gap-2 text-[11px] text-stone-300 font-mono flex-wrap pt-1.5 border-t border-stone-800 w-full">
                    <span className="text-emerald-300 font-sans font-medium">
                      {isUrdu ? weatherData.current.conditionUr : weatherData.current.conditionEn}
                    </span>
                    <span className="text-stone-600">•</span>
                    <span className="text-stone-400">
                      {isUrdu ? 'محسوس' : 'Feels'} ~{weatherData.current.apparentTemperature}°C
                    </span>
                    <span className="text-stone-600">•</span>
                    <span className="text-sky-300 flex items-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5" />
                      {weatherData.current.relativeHumidity}%
                    </span>
                    <span className="text-stone-600">•</span>
                    <span className="text-teal-300 flex items-center gap-0.5">
                      <Wind className="w-2.5 h-2.5" />
                      {weatherData.current.windSpeed} km/h
                    </span>
                    <span className="text-stone-600">•</span>
                    <span className="text-amber-400">
                      AQI {weatherData.airQuality?.aqi ?? 86}
                    </span>
                  </div>
                )}
              </button>
            )}

            {/* 4. 🌐 English / Language Switcher */}
            <button
              onClick={() => {
                setLanguage(isUrdu ? 'en' : 'ur');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-3 rounded-2xl text-xs font-semibold text-stone-200 bg-stone-900 border border-stone-800 hover:border-emerald-700/60 flex items-center justify-between transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">
                  {isUrdu ? 'زبان تبدیل کریں (Switch to English)' : 'Change Language to Urdu (اردو)'}
                </span>
              </div>
              <span className="text-amber-300 font-bold text-xs">
                {isUrdu ? 'English ›' : 'اردو ›'}
              </span>
            </button>

            {/* 5. 🔊 Azan / Sound Player & Mute Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {onOpenAzanModal && (
                <button
                  onClick={() => {
                    onOpenAzanModal();
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-2xl text-left bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center gap-2.5 transition-colors min-h-[44px]"
                >
                  <Volume2 className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
                  <div>
                    <span className="block text-white">{isUrdu ? 'صدائے اذان و دعا' : 'Adhan Voice'}</span>
                    <span className="text-[10px] text-stone-400 font-normal">{isUrdu ? 'اذان کا آڈیو پلیئر' : 'Audio player'}</span>
                  </div>
                </button>
              )}

              <button
                onClick={() => setAudioMuted(!audioMuted)}
                className="p-3 rounded-2xl text-left bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-semibold flex items-center justify-between transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  {audioMuted ? (
                    <VolumeX className="w-4 h-4 text-stone-400 shrink-0" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span>{isUrdu ? 'آڈیو الرٹس' : 'Audio Alerts'}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${audioMuted ? 'bg-stone-800 text-stone-400' : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'}`}>
                  {audioMuted ? 'OFF' : 'ON'}
                </span>
              </button>
            </div>

            {/* Quick Action Grid (Quran, Duas, Ramadan, Notifications, Admin) */}
            <div className="grid grid-cols-2 gap-2">
              {/* 6. 📖 Quran */}
              {onOpenQuranModal && (
                <button
                  onClick={() => {
                    onOpenQuranModal();
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-2xl text-left bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 text-xs font-bold flex items-center gap-2.5 transition-colors min-h-[44px]"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{isUrdu ? 'القرآن الکریم' : 'Holy Quran'}</span>
                </button>
              )}

              {/* 7. 🤲 Duas */}
              {onOpenDuasModal && (
                <button
                  onClick={() => {
                    onOpenDuasModal();
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-2xl text-left bg-amber-950/50 hover:bg-amber-900/60 border border-amber-600/50 text-amber-300 text-xs font-bold flex items-center gap-2.5 transition-colors min-h-[44px]"
                >
                  <Heart className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{isUrdu ? 'مسنون دعائیں' : '126 Duas'}</span>
                </button>
              )}

              {/* 8. 🌙 Ramadan Calendar */}
              {onOpenRamadanModal && (
                <button
                  onClick={() => {
                    onOpenRamadanModal();
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-2xl text-left bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-2.5 transition-colors min-h-[44px]"
                >
                  <Moon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{isUrdu ? 'تقویمِ رمضان' : 'Ramadan 2027'}</span>
                </button>
              )}

              {/* 9. 🔔 Notifications */}
              {onOpenNotifications && (
                <button
                  onClick={() => {
                    onOpenNotifications();
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-2xl text-left bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-200 text-xs font-bold flex items-center justify-between transition-colors min-h-[44px]"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Bell className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="truncate">{isUrdu ? 'اعلانات' : 'Notices'}</span>
                  </div>
                  {unreadNotifsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* 10. 🛡 Admin Portal */}
            {onOpenAdminModal && (
              <button
                onClick={() => {
                  onOpenAdminModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isUrdu ? 'انتظامیہ پورٹل (نماز اوقات ایڈیٹر)' : 'Admin Portal (Prayer Timings Editor)'}</span>
                </div>
                <span className="text-[9px] font-mono bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-700/60">
                  OFFICE
                </span>
              </button>
            )}

            {/* 11. ❤️ Donate (Large highlighted button at the bottom) */}
            <button
              onClick={() => handleItemClick('donate')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/50 min-h-[48px] transition-transform active:scale-[0.99]"
            >
              <Heart className="w-4 h-4 fill-current text-stone-950 shrink-0" />
              <span>{isUrdu ? 'مسجد فنڈ میں تعاون کریں (Donate)' : 'Donate to Mosque Fund'}</span>
            </button>

            {/* 12. Mosque Section Navigation Links */}
            <div className="pt-2 border-t border-stone-800/80 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block px-1 mb-1">
                {isUrdu ? 'مسجد سیکشنز' : 'Mosque Sections'}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between min-h-[40px] ${
                        isActive
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-800/80'
                          : 'text-stone-300 bg-stone-900/60 hover:bg-stone-900 hover:text-white border border-stone-800/60'
                      } ${isUrdu ? 'font-urdu text-right' : ''}`}
                    >
                      <span className="truncate">{isUrdu ? item.labelUr : item.labelEn}</span>
                      <ChevronRight className="w-3 h-3 text-stone-600 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
