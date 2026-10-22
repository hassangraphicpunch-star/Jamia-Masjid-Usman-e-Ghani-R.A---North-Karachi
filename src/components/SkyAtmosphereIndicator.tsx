import React, { useState, useEffect, useRef } from 'react';
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ChevronDown,
  Clock,
  Check,
  RotateCcw,
  Info,
} from 'lucide-react';
import {
  SkyThemeId,
  SkyThemeMode,
  SKY_THEMES_CONFIG,
  getKarachiCurrentTime,
  getAutoSkyTheme,
  getStoredSkyThemeMode,
  setStoredSkyThemeMode,
  resolveCurrentSkyTheme,
} from '../services/skyThemeService';

interface SkyAtmosphereIndicatorProps {
  language?: 'ur' | 'en';
  isCompact?: boolean;
  className?: string;
}

export const SkyAtmosphereIndicator: React.FC<SkyAtmosphereIndicatorProps> = ({
  language = 'ur',
  isCompact = false,
  className = '',
}) => {
  const isUrdu = language === 'ur';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Current theme mode ('auto' or specific theme) and active resolved theme
  const [themeMode, setThemeMode] = useState<SkyThemeMode>(() => getStoredSkyThemeMode());
  const [activeTheme, setActiveTheme] = useState<SkyThemeId>(() => resolveCurrentSkyTheme());
  const [karachiTime, setKarachiTime] = useState(() => getKarachiCurrentTime());

  // Listen for storage or internal theme changes
  useEffect(() => {
    const handleThemeChange = (e: any) => {
      const mode = getStoredSkyThemeMode();
      setThemeMode(mode);
      setActiveTheme(resolveCurrentSkyTheme(mode));
    };

    window.addEventListener('jamia_sky_theme_changed', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener('jamia_sky_theme_changed', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  // Update Karachi time & auto theme every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const kt = getKarachiCurrentTime();
      setKarachiTime(kt);
      if (themeMode === 'auto') {
        const auto = getAutoSkyTheme();
        if (auto !== activeTheme) {
          setActiveTheme(auto);
          // Apply attribute if changed
          document.documentElement.setAttribute('data-theme', auto);
          document.body.setAttribute('data-theme', auto);
        }
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [themeMode, activeTheme]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleSelectMode = (newMode: SkyThemeMode) => {
    setThemeMode(newMode);
    setStoredSkyThemeMode(newMode);
    const resolved = resolveCurrentSkyTheme(newMode);
    setActiveTheme(resolved);
  };

  const currentConfig = SKY_THEMES_CONFIG[activeTheme];

  const renderIcon = (iconName: string, classNameStr: string) => {
    switch (iconName) {
      case 'Sunrise':
        return <Sunrise className={classNameStr} />;
      case 'Sun':
        return <Sun className={classNameStr} />;
      case 'Sunset':
        return <Sunset className={classNameStr} />;
      case 'Moon':
      default:
        return <Moon className={classNameStr} />;
    }
  };

  // Atmosphere pill colors based on active theme
  const getAtmosphereBadgeStyles = () => {
    switch (activeTheme) {
      case 'morning':
        return 'bg-amber-100/90 hover:bg-amber-200/90 text-amber-900 border-amber-300/80 shadow-amber-900/10';
      case 'afternoon':
        return 'bg-sky-100/90 hover:bg-sky-200/90 text-sky-950 border-sky-300/80 shadow-sky-900/10';
      case 'evening':
        return 'bg-orange-950/80 hover:bg-orange-900/80 text-orange-200 border-orange-500/60 shadow-orange-950/30';
      case 'night':
      default:
        return 'bg-slate-900/80 hover:bg-slate-800 text-sky-200 border-sky-800/60 shadow-sky-950/30';
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-300 shadow-sm group min-h-[38px] ${getAtmosphereBadgeStyles()}`}
        title={
          isUrdu
            ? `موسمی تھیم: ${currentConfig.atmosphereLabelUr} (${karachiTime.formatted12h})`
            : `Atmosphere: ${currentConfig.atmosphereLabelEn} (${karachiTime.formatted12h})`
        }
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center justify-center shrink-0">
          {renderIcon(currentConfig.iconName, 'w-3.5 h-3.5 transition-transform group-hover:scale-110')}
        </span>

        {/* Atmosphere Label */}
        <span className="font-bold text-[11px] truncate max-w-[130px] sm:max-w-[160px]">
          {isUrdu ? currentConfig.atmosphereLabelUr : currentConfig.atmosphereLabelEn}
        </span>

        {/* Karachi Time Tag */}
        <span className="hidden xl:inline-block text-[10px] font-mono opacity-80 px-1 py-0.2 rounded bg-black/10 dark:bg-white/10">
          {karachiTime.formatted12h}
        </span>

        {/* Auto indicator dot */}
        {themeMode === 'auto' && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"
            title={isUrdu ? 'خودکار کراچی وقت کے مطابق' : 'Auto-synced with Karachi Time'}
          />
        )}

        <ChevronDown
          className={`w-3 h-3 opacity-70 transition-transform duration-200 shrink-0 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-3.5 rounded-2xl bg-stone-900/98 backdrop-blur-2xl border border-stone-700/80 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3 text-stone-100"
          dir={isUrdu ? 'rtl' : 'ltr'}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <h5 className="font-bold text-xs sm:text-sm text-white">
                {isUrdu ? 'قدرتی فلکیاتی و موسمی تھیم' : 'Sky & Time-of-Day Atmosphere'}
              </h5>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3" />
              <span>{karachiTime.formatted12h}</span>
            </div>
          </div>

          <p className="text-[11px] text-stone-300 leading-relaxed">
            {isUrdu
              ? 'کراچی کے حقیقی فلکیاتی وقت کے مطابق مسجد کا رنگ و منظر صبح، دوپہر، شام اور رات میں خودکار تبدیل ہوتا ہے۔'
              : 'The website automatically shifts its atmosphere to reflect the natural Karachi sky, from soft dawn to peaceful night.'}
          </p>

          {/* Mode Switch: Auto (Karachi Real-Time) Button */}
          <button
            type="button"
            onClick={() => handleSelectMode('auto')}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
              themeMode === 'auto'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50 shadow-md'
                : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  themeMode === 'auto' ? 'bg-emerald-400 animate-pulse' : 'bg-stone-600'
                }`}
              />
              <div className={isUrdu ? 'text-right' : 'text-left'}>
                <span className="block">{isUrdu ? 'خودکار موڈ (کراچی وقت)' : 'Auto (Karachi Time)'}</span>
                <span className="text-[10px] font-normal text-stone-400 font-mono block">
                  {isUrdu ? `فی الوقت: ${currentConfig.nameUr}` : `Currently: ${currentConfig.nameEn}`}
                </span>
              </div>
            </div>
            {themeMode === 'auto' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
          </button>

          {/* 4 Atmospheres Grid */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              {isUrdu ? 'چاروں اوقات کا براہ راست پیش نظارہ:' : 'Preview 4 Sky Atmospheres:'}
            </span>

            <div className="grid grid-cols-1 gap-1.5">
              {(Object.keys(SKY_THEMES_CONFIG) as SkyThemeId[]).map((themeKey) => {
                const conf = SKY_THEMES_CONFIG[themeKey];
                const isCurrentActive = activeTheme === themeKey;
                const isSelectedManual = themeMode === themeKey;

                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => handleSelectMode(themeKey)}
                    className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelectedManual
                        ? 'bg-amber-950/40 border-amber-500/80 text-amber-200 ring-1 ring-amber-500/50'
                        : isCurrentActive && themeMode === 'auto'
                        ? 'bg-stone-800/80 border-emerald-600/70 text-white'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Theme Preview Dot Box */}
                      <div
                        className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-sm"
                        style={{
                          backgroundColor: conf.previewColors.sky,
                          borderColor: conf.previewColors.border,
                          color: conf.previewColors.accent,
                        }}
                      >
                        {renderIcon(conf.iconName, 'w-3.5 h-3.5')}
                      </div>

                      <div className={isUrdu ? 'text-right' : 'text-left'}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">
                            {isUrdu ? conf.nameUr : conf.nameEn}
                          </span>
                          {isCurrentActive && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300">
                              {isUrdu ? 'فعال' : 'Active'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono block">
                          {isUrdu ? conf.timeRangeUr : conf.timeRangeEn}
                        </span>
                      </div>
                    </div>

                    {isSelectedManual && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset / Info Footer */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-stone-500 shrink-0" />
              <span>{isUrdu ? 'ہموار تبدیلی 1.5 سیکنڈ' : 'Smooth 1.5s transition'}</span>
            </span>

            {themeMode !== 'auto' && (
              <button
                type="button"
                onClick={() => handleSelectMode('auto')}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isUrdu ? 'خودکار پر واپس جائیں' : 'Reset to Auto'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
