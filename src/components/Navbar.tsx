import React, { useState, useEffect } from 'react';
import {
  Clock,
  Compass,
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
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0);
  const [weatherDropdownOpen, setWeatherDropdownOpen] = useState(false);

  const liveMoon = React.useMemo(() => {
    return calculateMoonPhase(new Date(), { lat: 24.9961, lng: 67.0673 });
  }, []);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
  };

  const isUrdu = language === 'ur';

  return (
    <header
      id="main-mosque-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-stone-950/95 backdrop-blur-md shadow-lg shadow-emerald-950/20 border-b border-emerald-900/30 py-2.5'
          : 'bg-stone-950/80 backdrop-blur-sm border-b border-stone-800/60 py-3.5'
      }`}
    >
      {/* Top micro banner with address and quick status */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Mosque Logo & Full Brand Identity (Left, Never squished) */}
          <div
            onClick={() => handleItemClick('hero')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            {/* Mosque Logo & Emblem */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md shadow-emerald-950/60 border border-amber-500/60 group-hover:scale-105 transition-transform bg-stone-950 flex items-center justify-center shrink-0">
              <img
                src="/images/masjid_logo.jpg"
                alt="Jamia Masjid Usman-e-Ghani Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                  {isUrdu ? MOSQUE_INFO.nameUr : MOSQUE_INFO.nameEn}
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 shrink-0">
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

          {/* Centered Live Badges: Hijri Date & Moon + Karachi Weather (Center) */}
          <div className="hidden lg:flex items-center justify-center gap-2 flex-1 mx-2">
            {/* Live Islamic Date & Moon Quick Badge */}
            {onOpenWeatherModal && (
              <button
                type="button"
                onClick={onOpenWeatherModal}
                className="flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-emerald-800/70 hover:border-amber-400 text-xs font-semibold transition-all shadow-sm group shrink-0"
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
            
            {/* Single Karachi Weather Quick Pill with Dropdown */}
            {onOpenWeatherModal && (
              <div
                className="relative shrink-0"
                onMouseEnter={() => setWeatherDropdownOpen(true)}
                onMouseLeave={() => setWeatherDropdownOpen(false)}
              >
                <button
                  id="btn-nav-weather"
                  onClick={onOpenWeatherModal}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-emerald-800/70 hover:border-amber-400 text-xs font-semibold transition-all shadow-sm group"
                  title={isUrdu ? 'کراچی کا موسم، ہوا کا معیار اور مکمل تفصیلات' : 'View Karachi Weather & Forecast'}
                >
                  <CloudSun className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                  
                  {/* Temperature */}
                  <span className="font-mono font-bold text-white text-xs">
                    {weatherData ? `${weatherData.current.temperature}°C` : '27°C'}
                  </span>

                  {/* City Label */}
                  <span className="text-emerald-400 font-bold text-[11px]">
                    {isUrdu ? 'کراچی' : 'Khi'}
                  </span>

                  {/* Condition Text */}
                  {weatherData && (
                    <span className="text-amber-300 hidden xl:inline text-[11px] font-medium truncate max-w-[85px]">
                      • {isUrdu ? weatherData.current.conditionUr : weatherData.current.conditionEn}
                    </span>
                  )}

                  <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-amber-400 transition-colors" />
                </button>

                {/* Floating Rich Hover Card Dropdown */}
                {weatherDropdownOpen && weatherData && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-3.5 bg-stone-900 border border-emerald-600/60 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2.5 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'نارتھ کراچی (سیکٹر 5-A/1)' : 'North Karachi Sector 5-A/1'}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-950 border border-emerald-700/60 text-emerald-300 px-1.5 py-0.5 rounded">
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
                      <span>{isUrdu ? 'مکمل موسمیات و 7 روزہ پیش گوئی (سب کچھ) ›' : 'View Full Forecast & Duas ›'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Controls: Quick buttons on desktop, compact essentials on mobile */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">

            {/* Language Switcher - Accessible on all viewports */}
            <button
              id="btn-language-toggle"
              onClick={() => setLanguage(isUrdu ? 'en' : 'ur')}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 text-xs font-semibold transition-colors shrink-0"
              title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* Azan Voice & Player Modal Button (Desktop >= 1025px) */}
            {onOpenAzanModal && (
              <button
                id="btn-nav-azan-player"
                onClick={onOpenAzanModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs font-semibold transition-colors shrink-0"
                title="Play Adhan & Prayer Voice"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
                <span>{isUrdu ? 'صدائے اذان' : 'Adhan'}</span>
              </button>
            )}

            {/* Quran Reader Modal Button (Desktop >= 1025px) */}
            {onOpenQuranModal && (
              <button
                id="btn-nav-quran"
                onClick={onOpenQuranModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-600/50 text-xs font-bold transition-all shadow-sm shrink-0"
                title="The Holy Quran - 114 Surahs & 13 Reciters"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isUrdu ? 'القرآن' : 'Quran'}</span>
              </button>
            )}

            {/* Masnoon Duas 126 Supplications Modal Button (Desktop >= 1025px) */}
            {onOpenDuasModal && (
              <button
                id="btn-nav-duas"
                onClick={onOpenDuasModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-600/50 text-xs font-bold transition-all shadow-sm shrink-0"
                title="126 Masnoon Duas (27 Categories)"
              >
                <Heart className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{isUrdu ? 'دعائیں' : 'Duas'}</span>
              </button>
            )}

            {/* Ramadan 2027 Quick Calendar Button (Tablet & Desktop) */}
            {onOpenRamadanModal && (
              <button
                id="btn-nav-ramadan-calendar"
                onClick={onOpenRamadanModal}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-500/50 text-xs font-bold transition-all shadow-sm ring-1 ring-amber-500/30 shrink-0"
                title="Ramadan Calendar & Timetable (30 Days)"
              >
                <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                <span>{isUrdu ? 'تقویمِ رمضان' : 'Ramadan'}</span>
              </button>
            )}

            {/* Notifications Bell Button - Accessible on all viewports */}
            {onOpenNotifications && (
              <button
                id="btn-nav-notifications"
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors shrink-0 flex items-center justify-center"
                title={isUrdu ? 'اعلانات و الرٹس' : 'Notifications & Alerts'}
              >
                <Bell className="w-4 h-4 text-amber-300" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
            )}

            {/* Admin Portal Button */}
            {onOpenAdminModal && (
              <button
                id="btn-nav-admin-portal"
                onClick={onOpenAdminModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors shrink-0"
                title="Admin Namaz Timetable Editor"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{isUrdu ? 'انتظامیہ پورٹل' : 'Admin Portal'}</span>
              </button>
            )}

            {/* Quick Donate Button */}
            <button
              id="btn-nav-donate"
              onClick={() => handleItemClick('donate')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs shadow-md shadow-amber-900/30 transition-all hover:scale-105 shrink-0"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-stone-950 shrink-0" />
              <span>{isUrdu ? 'تعاون کریں' : 'Donate'}</span>
            </button>

            {/* Mobile & Tablet Hamburger Toggle */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-stone-900 text-stone-300 border border-stone-800 hover:text-white hover:border-emerald-700/60 transition-colors shrink-0 flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Centered Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center gap-1 mt-3 pt-2.5 border-t border-stone-800/40">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900/60'
                } ${isUrdu ? 'font-urdu text-sm' : ''}`}
              >
                {isUrdu ? item.labelUr : item.labelEn}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="lg:hidden bg-stone-950/98 backdrop-blur-xl border-b border-stone-800 px-3.5 sm:px-5 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto w-full shadow-2xl"
        >
          {/* Card 1: Next Prayer Status */}
          {nextPrayerInfo && (
            <div
              onClick={() => handleItemClick('prayer-times')}
              className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-xs cursor-pointer hover:bg-emerald-900/50 transition-colors shadow-inner"
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-stone-300 font-medium">
                  {isUrdu ? 'اگلی نماز:' : 'Next Prayer:'}{' '}
                  <strong className="text-amber-300 font-bold">
                    {isUrdu ? nextPrayerInfo.nameUr : nextPrayerInfo.nameEn}
                  </strong>
                </span>
              </div>
              <span className="text-emerald-300 font-mono font-bold bg-stone-900/80 px-2 py-0.5 rounded border border-emerald-800">
                {nextPrayerInfo.countdownStr}
              </span>
            </div>
          )}

          {/* Card 2: Verified Islamic Hijri Date & Moon Status */}
          {onOpenWeatherModal && (
            <button
              type="button"
              onClick={() => {
                onOpenWeatherModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left p-3 rounded-xl bg-stone-900/90 border border-emerald-800/80 hover:border-amber-400 transition-colors flex items-center justify-between shadow-sm group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-center shrink-0">
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

          {/* Card 3: Live Karachi Weather Card */}
          {onOpenWeatherModal && (
            <button
              onClick={() => {
                onOpenWeatherModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left p-3 rounded-xl text-sm font-semibold text-emerald-300 bg-stone-900 border border-stone-800 hover:border-amber-400 flex flex-col gap-2 transition-all shadow-sm"
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
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-stone-300 font-mono flex-wrap pt-1.5 border-t border-stone-800 w-full">
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

          {/* Quick Action Grid (2 columns on mobile) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {onOpenQuranModal && (
              <button
                onClick={() => {
                  onOpenQuranModal();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 text-xs font-bold flex items-center gap-2 transition-colors min-h-[44px]"
              >
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{isUrdu ? 'القرآن الکریم' : 'Holy Quran'}</span>
              </button>
            )}

            {onOpenDuasModal && (
              <button
                onClick={() => {
                  onOpenDuasModal();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left bg-amber-950/60 hover:bg-amber-900 border border-amber-600/50 text-amber-300 text-xs font-bold flex items-center gap-2 transition-colors min-h-[44px]"
              >
                <Heart className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{isUrdu ? 'مسنون دعائیں' : '126 Duas'}</span>
              </button>
            )}

            {onOpenRamadanModal && (
              <button
                onClick={() => {
                  onOpenRamadanModal();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-2 transition-colors min-h-[44px]"
              >
                <Moon className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{isUrdu ? 'تقویمِ رمضان' : 'Ramadan 2027'}</span>
              </button>
            )}

            {onOpenAzanModal && (
              <button
                onClick={() => {
                  onOpenAzanModal();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-bold flex items-center gap-2 transition-colors min-h-[44px]"
              >
                <Volume2 className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
                <span className="truncate">{isUrdu ? 'صدائے اذان' : 'Adhan Voice'}</span>
              </button>
            )}

            {onOpenNotifications && (
              <button
                onClick={() => {
                  onOpenNotifications();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-200 text-xs font-bold flex items-center justify-between transition-colors min-h-[44px]"
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

            {onOpenAdminModal && (
              <button
                onClick={() => {
                  onOpenAdminModal();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 transition-colors min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{isUrdu ? 'انتظامیہ پورٹل' : 'Admin Portal'}</span>
              </button>
            )}
          </div>

          {/* Audio Toggle in Mobile Drawer */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-200 bg-stone-900 border border-stone-800 flex items-center justify-between transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-2">
              {audioMuted ? (
                <VolumeX className="w-4 h-4 text-stone-400 shrink-0" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>
                {isUrdu
                  ? audioMuted
                    ? 'اذان آڈیو الرٹس: بند (Muted)'
                    : 'اذان آڈیو الرٹس: فعال (Active)'
                  : audioMuted
                  ? 'Adhan Audio Alerts: Muted'
                  : 'Adhan Audio Alerts: Active'}
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${audioMuted ? 'bg-stone-800 text-stone-400' : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'}`}>
              {audioMuted ? 'OFF' : 'ON'}
            </span>
          </button>

          {/* Donate Button */}
          <button
            onClick={() => handleItemClick('donate')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg min-h-[44px] transition-transform active:scale-[0.99]"
          >
            <Heart className="w-4 h-4 fill-current shrink-0" />
            <span>{isUrdu ? 'مسجد فنڈ میں تعاون کریں' : 'Donate to Mosque Fund'}</span>
          </button>

          {/* Navigation Section Links */}
          <div className="pt-2 border-t border-stone-800/80 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block px-1 mb-1">
              {isUrdu ? 'مسجد سیکشنز' : 'Mosque Sections'}
            </span>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between min-h-[40px] ${
                    isActive
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-800/80'
                      : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                  } ${isUrdu ? 'font-urdu text-right' : ''}`}
                >
                  <span>{isUrdu ? item.labelUr : item.labelEn}</span>
                  <span className="text-stone-600 text-xs">›</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
