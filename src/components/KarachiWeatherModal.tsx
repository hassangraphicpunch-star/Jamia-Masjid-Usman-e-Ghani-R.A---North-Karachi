import React, { useState } from 'react';
import {
  X,
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  RefreshCw,
  MapPin,
  Sunrise,
  Sunset,
  Sparkles,
  BookOpen,
  Check,
} from 'lucide-react';
import { Language } from '../types';
import { KarachiWeatherData, fetchKarachiWeather } from '../services/weatherService';

interface KarachiWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  weatherData: KarachiWeatherData | null;
  onRefreshWeather?: () => void;
  isRefreshing?: boolean;
}

export const KarachiWeatherModal: React.FC<KarachiWeatherModalProps> = ({
  isOpen,
  onClose,
  language,
  weatherData,
  onRefreshWeather,
  isRefreshing = false,
}) => {
  const isUrdu = language === 'ur';
  const [copiedDua, setCopiedDua] = useState(false);

  if (!isOpen || !weatherData) return null;

  const renderWeatherIcon = (
    iconName: KarachiWeatherData['current']['iconName'],
    className = 'w-8 h-8'
  ) => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${className} text-amber-400 animate-spin-slow`} />;
      case 'moon':
        return <Moon className={`${className} text-indigo-300`} />;
      case 'cloud-sun':
        return <CloudSun className={`${className} text-amber-300`} />;
      case 'cloud-moon':
        return <CloudMoon className={`${className} text-indigo-300`} />;
      case 'cloud':
        return <Cloud className={`${className} text-stone-300`} />;
      case 'cloud-rain':
        return <CloudRain className={`${className} text-sky-400`} />;
      case 'cloud-lightning':
        return <CloudLightning className={`${className} text-yellow-400`} />;
      case 'cloud-fog':
        return <CloudFog className={`${className} text-stone-400`} />;
      default:
        return <Sun className={`${className} text-amber-400`} />;
    }
  };

  const handleCopyDua = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDua(true);
    setTimeout(() => setCopiedDua(false), 2000);
  };

  const current = weatherData.current;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-stone-900 border border-emerald-700/60 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-emerald-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-900/60 border border-emerald-600/50 flex items-center justify-center text-amber-400">
              {renderWeatherIcon(current.iconName, 'w-5 h-5')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base sm:text-lg">
                  {isUrdu ? 'کراچی کا لائیو موسم و پیش گوئی' : 'Karachi Live Weather & Forecast'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {isUrdu ? 'نارتھ کراچی زون' : 'North Karachi Zone'}
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{isUrdu ? 'جامع مسجد عثمانِ غنی رضی اللہ عنہ اور مضافات' : 'Jamia Masjid Usman-e-Ghani & Surroundings'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshWeather && (
              <button
                onClick={onRefreshWeather}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-semibold transition-colors disabled:opacity-50"
                title="Refresh Weather Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
                <span className="hidden sm:inline">{isUrdu ? 'تازہ کریں' : 'Refresh'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Main Hero Weather Card */}
          <div className="bg-gradient-to-br from-emerald-950/80 via-stone-900 to-stone-950 p-6 rounded-2xl border border-emerald-700/50 shadow-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Left Temperature Display */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{isUrdu ? 'براہِ راست موسمی کیفیت' : 'Live Karachi Conditions'}</span>
                  <span className="text-stone-500">•</span>
                  <span className="text-stone-400 font-mono font-normal">
                    {weatherData.lastUpdated}
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                    {current.temperature}°
                  </span>
                  <span className="text-2xl text-stone-400 font-semibold font-mono">C</span>
                  <div className="border-l border-stone-800 pl-3 space-y-0.5">
                    <div className="text-xs text-stone-400">
                      {isUrdu ? 'محسوس درجہ حرارت' : 'Feels like'}
                    </div>
                    <div className="text-base font-bold text-amber-300 font-mono">
                      ~{current.apparentTemperature}°C
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-emerald-200 flex items-center gap-2 pt-1">
                  {renderWeatherIcon(current.iconName, 'w-6 h-6')}
                  <span>{isUrdu ? current.conditionUr : current.conditionEn}</span>
                </h4>
              </div>

              {/* Right Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-stone-950/70 p-4 rounded-xl border border-stone-800/80 shrink-0">
                <div className="space-y-0.5 text-center">
                  <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span>{isUrdu ? 'ہوا میں نمی' : 'Humidity'}</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono">
                    {current.relativeHumidity}%
                  </div>
                </div>

                <div className="space-y-0.5 text-center">
                  <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isUrdu ? 'ہوا کی رفتار' : 'Wind Speed'}</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono">
                    {current.windSpeed} km/h
                  </div>
                </div>

                <div className="space-y-0.5 text-center">
                  <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isUrdu ? 'زیادہ / کم' : 'High / Low'}</span>
                  </div>
                  <div className="text-sm font-bold text-amber-300 font-mono">
                    {weatherData.daily[0]?.tempMax ?? 32}° / {weatherData.daily[0]?.tempMin ?? 24}°
                  </div>
                </div>

                <div className="space-y-0.5 text-center">
                  <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
                    <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isUrdu ? 'طلوع آفتاب' : 'Sunrise'}</span>
                  </div>
                  <div className="text-xs font-bold text-stone-200 font-mono">
                    {weatherData.daily[0]?.sunrise || '06:23 AM'}
                  </div>
                </div>

                <div className="space-y-0.5 text-center">
                  <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
                    <Sunset className="w-3.5 h-3.5 text-orange-400" />
                    <span>{isUrdu ? 'غروب آفتاب' : 'Sunset'}</span>
                  </div>
                  <div className="text-xs font-bold text-stone-200 font-mono">
                    {weatherData.daily[0]?.sunset || '06:19 PM'}
                  </div>
                </div>

                <div className="space-y-0.5 text-center">
                  <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isUrdu ? 'سمندری ہوا' : 'Breeze'}</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-300">
                    جنوب مغربی (SW)
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 5-Day Karachi Forecast Section */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isUrdu ? 'آئندہ چند روز کی پیش گوئی (کراچی)' : '5-Day Karachi Weather Forecast'}</span>
              </span>
              <span className="text-xs text-stone-500 font-normal">
                {isUrdu ? 'ماخذ: اوپن میٹیو کراچی اسٹیشن' : 'Source: Open-Meteo Karachi Station'}
              </span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {weatherData.daily.slice(0, 5).map((d, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between ${
                    idx === 4 ? 'col-span-2 sm:col-span-1 md:col-span-1' : ''
                  } ${
                    idx === 0
                      ? 'bg-emerald-950/60 border-emerald-600/70 shadow-md'
                      : 'bg-stone-950 p-3 rounded-xl border-stone-800 hover:border-emerald-700/50'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-200 mb-1">
                    {isUrdu ? d.dayNameUr : d.dayNameEn}
                  </div>

                  <div className="flex justify-center my-2">
                    {renderWeatherIcon(d.iconName, 'w-7 h-7')}
                  </div>

                  <div className="text-xs font-bold text-white font-mono">
                    <span className="text-amber-300">{d.tempMax}°</span>
                    <span className="text-stone-500 mx-1">/</span>
                    <span className="text-stone-400">{d.tempMin}°</span>
                  </div>

                  <div className="text-[10px] text-stone-400 mt-1 line-clamp-1">
                    {isUrdu ? d.conditionUr : d.conditionEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Islamic Sunnah Weather Guidance & Duas */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-amber-600/40 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h5 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{isUrdu ? weatherData.islamicWeatherNotes.titleUr : weatherData.islamicWeatherNotes.titleEn}</span>
              </h5>
              <button
                onClick={() => handleCopyDua(weatherData.islamicWeatherNotes.duaArabic)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                title="Copy Dua"
              >
                {copiedDua ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{copiedDua ? (isUrdu ? 'کاپی ہو گئی' : 'Copied!') : (isUrdu ? 'دعا کاپی کریں' : 'Copy Dua')}</span>
              </button>
            </div>

            {/* Arabic Dua */}
            <div className="p-3.5 rounded-xl bg-stone-900 border border-emerald-900/40 text-center space-y-1.5">
              <div className="font-arabic text-base sm:text-lg font-bold text-emerald-300 leading-relaxed">
                {weatherData.islamicWeatherNotes.duaArabic}
              </div>
              <div className="text-xs text-stone-300">
                {isUrdu
                  ? weatherData.islamicWeatherNotes.duaTranslationUr
                  : weatherData.islamicWeatherNotes.duaTranslationEn}
              </div>
            </div>

            {/* Hadith / Fiqh Note */}
            <p className="text-xs text-stone-400 leading-relaxed italic">
              {isUrdu
                ? weatherData.islamicWeatherNotes.hadithNoteUr
                : weatherData.islamicWeatherNotes.hadithNoteEn}
            </p>
          </div>

          {/* Mosque Arrival Advice based on Karachi Heat / Weather */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-stone-300 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 block mb-0.5">
                {isUrdu ? 'نمازی حضرات کے لیے مسجدی رہنمائی:' : 'Guidance for Mosque Attendees:'}
              </strong>
              <span>
                {isUrdu
                  ? 'جامع مسجد عثمانِ غنی میں ایئر کنڈیشنڈ ہالز، ٹھنڈے پینے کے پانی کا فلٹریشن پلانٹ اور وسیع وضو خانہ دستیاب ہے۔ شدید دھوپ کے اوقات (ظہر و جمعہ) میں سر ڈھانپ کر اور وضو کا خاص اہتمام فرما کر تشریف لائیں۔'
                  : 'Jamia Masjid Usman-e-Ghani is equipped with air-conditioned main halls, cold drinking water filtration, and spacious ablution facilities.'}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <span>{isUrdu ? 'کراچی کوآرڈینیٹس: 24.9961° N, 67.0673° E' : 'Coordinates: 24.9961° N, 67.0673° E'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold transition-colors"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
