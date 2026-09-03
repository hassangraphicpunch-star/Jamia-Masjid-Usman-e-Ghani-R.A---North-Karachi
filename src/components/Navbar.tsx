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
} from 'lucide-react';
import { Language } from '../types';
import { MOSQUE_INFO } from '../data/mockData';

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
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { id: 'qibla-location', labelEn: 'Location & Map', labelUr: 'گوگل نقشہ و مقام' },
    { id: 'donate', labelEn: 'Donate', labelUr: 'تعاون و صدقات' },
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
        <div className="flex items-center justify-between gap-4">
          
          {/* Mosque Logo & Title */}
          <div
            onClick={() => handleItemClick('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Mosque Logo & Emblem */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md shadow-emerald-950/60 border border-amber-500/50 group-hover:scale-105 transition-transform bg-stone-950 flex items-center justify-center">
              <img
                src="/images/masjid_logo.jpg"
                alt="Jamia Masjid Usman-e-Ghani Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  {isUrdu ? MOSQUE_INFO.nameUr : MOSQUE_INFO.nameEn}
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  ST-11 Sector 5-A/1
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{isUrdu ? 'نارتھ کراچی، کراچی' : 'North Karachi, Karachi'}</span>
                <span className="text-stone-600">•</span>
                <span className="text-amber-400/90 font-medium">Hanafi (حنفی)</span>
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
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              id="btn-language-toggle"
              onClick={() => setLanguage(isUrdu ? 'en' : 'ur')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 text-xs font-semibold transition-colors"
              title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
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
              className={`p-2 rounded-lg text-xs font-medium transition-colors border ${
                audioMuted
                  ? 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900'
              }`}
              title={audioMuted ? 'Adhan notifications muted' : 'Adhan audio active'}
            >
              {audioMuted ? (
                <VolumeX className="w-4 h-4 text-stone-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

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
          className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200"
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
