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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Mosque Logo & Title */}
          <div
            onClick={() => handleItemClick('hero')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0 flex-1"
          >
            {/* Mosque Logo & Emblem */}
            <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md shadow-emerald-950/60 border border-amber-500/50 group-hover:scale-105 transition-transform bg-stone-950 flex items-center justify-center shrink-0">
              <img
                src="/images/masjid_logo.jpg"
                alt="Jamia Masjid Usman-e-Ghani Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-base md:text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors truncate max-w-[120px] min-[360px]:max-w-[160px] min-[420px]:max-w-[220px] sm:max-w-none">
                  {isUrdu ? MOSQUE_INFO.nameUr : MOSQUE_INFO.nameEn}
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 shrink-0">
                  ST-11 Sector 5-A/1
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-400 flex items-center gap-1 sm:gap-1.5 truncate">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{isUrdu ? 'نارتھ کراچی، کراچی' : 'North Karachi, Karachi'}</span>
                <span className="text-stone-600 hidden xs:inline">•</span>
                <span className="text-amber-400/90 font-medium hidden xs:inline">Hanafi</span>
              </p>
            </div>
          </div>

          {/* Desktop Next Prayer Live Pill */}
          {nextPrayerInfo && (
            <div
              onClick={() => handleItemClick('prayer-times')}
              className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/40 hover:border-emerald-500/60 transition-colors cursor-pointer shadow-inner shadow-black/40"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-xs flex items-center gap-1.5">
                <span className="text-stone-400">
                  {isUrdu ? 'اگلی نماز:' : 'Next Prayer:'}
                </span>
                <span className="font-bold text-amber-300">
                  {isUrdu ? nextPrayerInfo.nameUr : nextPrayerInfo.nameEn}
                </span>
                <span className="text-stone-500">|</span>
                <span className="text-emerald-300 font-mono font-semibold">
                  {nextPrayerInfo.countdownStr}
                </span>
              </div>
            </div>
          )}

          {/* Right Action Controls: Lang Toggle, Audio Mute, Admin Portal, Donate & Mobile Menu */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            
            {/* Karachi Weather Quick Pill with Rich Metrics & Hover Preview */}
            {onOpenWeatherModal && (
              <div
                className="relative"
                onMouseEnter={() => setWeatherDropdownOpen(true)}
                onMouseLeave={() => setWeatherDropdownOpen(false)}
              >
                <button
                  id="btn-nav-weather"
                  onClick={onOpenWeatherModal}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-emerald-800/70 hover:border-amber-400 text-xs font-semibold transition-all shadow-sm group"
                  title={isUrdu ? 'کراچی کا موسم، ہوا کا معیار اور مکمل تفصیلات' : 'View Karachi Weather & Forecast'}
                >
                  <CloudSun className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                  
                  {/* Temperature */}
                  <span className="font-mono font-bold text-white text-[11px] sm:text-xs">
                    {weatherData ? `${weatherData.current.temperature}°C` : '27°C'}
                  </span>

                  {/* City Label */}
                  <span className="text-emerald-400 font-bold text-[11px]">
                    {isUrdu ? 'کراچی' : 'Khi'}
                  </span>

                  {/* Condition Text (md+) */}
                  {weatherData && (
                    <span className="text-amber-300 hidden md:inline text-[11px] font-medium truncate max-w-[95px]">
                      • {isUrdu ? weatherData.current.conditionUr : weatherData.current.conditionEn}
                    </span>
                  )}

                  {/* Feels Like (lg+) */}
                  {weatherData && (
                    <span className="text-stone-400 hidden lg:inline text-[10px] font-mono">
                      ({isUrdu ? 'محسوس' : 'Feels'} ~{weatherData.current.apparentTemperature}°C)
                    </span>
                  )}

                  {/* Humidity (lg+) */}
                  {weatherData && (
                    <span className="text-sky-300 hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono">
                      <Droplets className="w-2.5 h-2.5 text-sky-400" />
                      {weatherData.current.relativeHumidity}%
                    </span>
                  )}

                  {/* Wind (xl+) */}
                  {weatherData && (
                    <span className="text-teal-300 hidden xl:inline-flex items-center gap-0.5 text-[10px] font-mono">
                      <Wind className="w-2.5 h-2.5 text-teal-400" />
                      {weatherData.current.windSpeed}k
                    </span>
                  )}

                  {/* AQI Badge (xl+) */}
                  {weatherData && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-600/50 text-amber-300 text-[9px] font-mono font-bold hidden xl:inline">
                      AQI {weatherData.airQuality?.aqi ?? 86}
                    </span>
                  )}

                  <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-amber-400 transition-colors hidden sm:inline" />
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
                          <ShieldCheck className="w-3 h-3 text-amber-400" />
                          {isUrdu ? 'ہوا کا معیار' : 'Air Quality'}
                        </span>
                        <strong className="text-amber-300 font-mono">
                          {weatherData.airQuality?.aqi ?? 86} ({isUrdu ? weatherData.airQuality?.statusUr ?? 'معتدل' : weatherData.airQuality?.statusEn ?? 'Moderate'})
                        </strong>
                      </div>

                      <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 space-y-0.5">
                        <span className="text-stone-400 text-[10px] block flex items-center gap-1">
                          <Sun className="w-3 h-3 text-yellow-400" />
                          {isUrdu ? 'دھوپ کی شدت' : 'UV Index'}
                        </span>
                        <strong className="text-yellow-400 font-mono">{weatherData.current.uvIndex} / 11</strong>
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

            {/* Language Switcher */}
            <button
              id="btn-language-toggle"
              onClick={() => setLanguage(isUrdu ? 'en' : 'ur')}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 text-[11px] sm:text-xs font-semibold transition-colors"
              title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* Azan Voice & Player Modal Button */}
            {onOpenAzanModal && (
              <button
                id="btn-nav-azan-player"
                onClick={onOpenAzanModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs font-semibold transition-colors"
                title="Play Adhan & Prayer Voice"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="hidden md:inline">{isUrdu ? 'صدائے اذان' : 'Adhan'}</span>
              </button>
            )}

            {/* Azan Notification Sound Toggle */}
            <button
              id="btn-azan-sound-toggle"
              onClick={() => setAudioMuted(!audioMuted)}
              className={`p-1.5 sm:p-2 rounded-lg text-xs font-medium transition-colors border ${
                audioMuted
                  ? 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900'
              }`}
              title={audioMuted ? 'Adhan notifications muted' : 'Adhan audio active'}
            >
              {audioMuted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              )}
            </button>

            {/* Quran Reader & Audio Modal Button */}
            {onOpenQuranModal && (
              <button
                id="btn-nav-quran"
                onClick={onOpenQuranModal}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-600/50 text-xs font-bold transition-all shadow-sm"
                title="The Holy Quran - 114 Surahs & 13 Reciters"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isUrdu ? 'القرآن' : 'Quran'}</span>
              </button>
            )}

            {/* Masnoon Duas 126 Supplications Modal Button */}
            {onOpenDuasModal && (
              <button
                id="btn-nav-duas"
                onClick={onOpenDuasModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-600/50 text-xs font-bold transition-all shadow-sm"
                title="126 Masnoon Duas (27 Categories)"
              >
                <Heart className="w-3.5 h-3.5 text-amber-400" />
                <span>{isUrdu ? 'مسنون دعائیں' : 'Duas'}</span>
              </button>
            )}

            {/* Ramadan 2027 Quick Calendar Button */}
            {onOpenRamadanModal && (
              <button
                id="btn-nav-ramadan-calendar"
                onClick={onOpenRamadanModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-500/50 text-xs font-bold transition-all shadow-sm ring-1 ring-amber-500/30"
                title="Ramadan Calendar & Timetable (30 Days)"
              >
                <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span>{isUrdu ? 'تقویمِ رمضان' : 'Ramadan'}</span>
              </button>
            )}

            {/* Notifications Bell Button */}
            {onOpenNotifications && (
              <button
                id="btn-nav-notifications"
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
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
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
                title="Admin Namaz Timetable Editor"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xl:inline">{isUrdu ? 'انتظامیہ پورٹل' : 'Admin Portal'}</span>
              </button>
            )}

            {/* Quick Donate Button */}
            <button
              id="btn-nav-donate"
              onClick={() => handleItemClick('donate')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs shadow-md shadow-amber-900/30 transition-all hover:scale-105"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-stone-950" />
              <span>{isUrdu ? 'تعاون کریں' : 'Donate'}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-stone-900 text-stone-300 border border-stone-800 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto"
        >
          {nextPrayerInfo && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/70 border border-emerald-800/60 text-xs">
              <span className="text-stone-300 font-medium">
                {isUrdu ? 'اگلی نماز:' : 'Next Prayer:'}{' '}
                <strong className="text-amber-300">
                  {isUrdu ? nextPrayerInfo.nameUr : nextPrayerInfo.nameEn}
                </strong>
              </span>
              <span className="text-emerald-300 font-mono font-bold">
                {nextPrayerInfo.countdownStr}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1 pt-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
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

            {onOpenQuranModal && (
              <button
                onClick={() => {
                  onOpenQuranModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-600/50 flex items-center justify-between mt-1"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>{isUrdu ? 'القرآن الکریم (تلاوت، 13 قراء و تراجم)' : 'The Holy Quran (Recitations & Translations)'}</span>
                </div>
                <span className="text-emerald-400 text-xs">Open ›</span>
              </button>
            )}

            {onOpenWeatherModal && (
              <button
                onClick={() => {
                  onOpenWeatherModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold text-emerald-300 bg-stone-900 border border-emerald-800/70 hover:border-amber-400 flex flex-col gap-1.5 mt-1 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white">
                      {isUrdu ? 'کراچی لائیو موسم (نارتھ کراچی)' : 'Karachi Live Weather (Sector 5-A/1)'}
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

            {onOpenDuasModal && (
              <button
                onClick={() => {
                  onOpenDuasModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold text-amber-300 bg-amber-950/50 border border-amber-600/50 flex items-center justify-between mt-1"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-400" />
                  <span>{isUrdu ? 'حصن المسلم: 126 مسنون دعائیں و اذکار' : '126 Masnoon Duas (27 Categories)'}</span>
                </div>
                <span className="text-amber-400 text-xs">View ›</span>
              </button>
            )}

            {onOpenRamadanModal && (
              <button
                onClick={() => {
                  onOpenRamadanModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold text-amber-300 bg-amber-950/40 border border-amber-600/40 flex items-center justify-between mt-1"
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-amber-400" />
                  <span>{isUrdu ? 'رمضان المبارک ۲۰۲۷ء (۱۴۴۸ھ) تقویم' : 'Ramadan 2027 (1448 AH) Calendar'}</span>
                </div>
                <span className="text-amber-400 text-xs">View ›</span>
              </button>
            )}

            {onOpenAzanModal && (
              <button
                onClick={() => {
                  onOpenAzanModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-700/50 flex items-center justify-between mt-1"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{isUrdu ? 'صدائے اذان و دعائے بعد اذان' : 'Adhan Voice & Dua'}</span>
                </div>
                <span className="text-emerald-400 text-xs">Play ›</span>
              </button>
            )}

            {onOpenNotifications && (
              <button
                onClick={() => {
                  onOpenNotifications();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold text-amber-200 bg-stone-900 border border-stone-800 flex items-center justify-between mt-1"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-300" />
                  <span>{isUrdu ? 'اعلانات و الرٹس' : 'Notifications & Alerts'}</span>
                </div>
                {unreadNotifsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
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
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold text-amber-300 bg-amber-950/30 border border-amber-500/30 flex items-center justify-between mt-1"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{isUrdu ? 'انتظامیہ نماز پورٹل' : 'Admin Namaz Portal'}</span>
                </div>
                <span className="text-stone-500 text-xs">›</span>
              </button>
            )}

            <button
              onClick={() => handleItemClick('donate')}
              className="w-full mt-2 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{isUrdu ? 'مسجد فنڈ میں تعاون کریں' : 'Donate to Mosque Fund'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
