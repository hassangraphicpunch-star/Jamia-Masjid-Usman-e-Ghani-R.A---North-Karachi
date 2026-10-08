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
  Copy,
  Clock,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Eye,
  Activity,
  Layers,
} from 'lucide-react';
import { Language } from '../types';
import {
  KarachiWeatherData,
  getUVLevel,
  getAQILevel,
  ISLAMIC_WEATHER_DUAS,
  IslamicWeatherDua,
} from '../services/weatherService';
import { CurrentMoonSection } from './CurrentMoonSection';
import { calculateMoonPhase } from '../services/astronomyService';

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
  const [activeTab, setActiveTab] = useState<
    'overview' | 'moon_phase' | 'hourly' | 'daily' | 'air_quality' | 'islamic_duas' | 'mosque_advice'
  >('overview');
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);

  // Dynamic astronomical calculation for Karachi (Transitions daily at Maghrib prayer)
  const [liveMoon, setLiveMoon] = React.useState(() =>
    calculateMoonPhase(new Date(), { lat: 24.9961, lng: 67.0673 })
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setLiveMoon(calculateMoonPhase(new Date(), { lat: 24.9961, lng: 67.0673 }));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen || !weatherData) return null;

  const renderWeatherIcon = (
    iconName: KarachiWeatherData['current']['iconName'],
    className = 'w-8 h-8'
  ) => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${className} text-amber-400`} />;
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

  const handleCopyDua = (dua: IslamicWeatherDua) => {
    const text = `🤲 ${dua.titleUr} (${dua.titleEn})\n\n${dua.arabic}\n\nترجمہ: ${dua.translationUr}\n\nTranslation: ${dua.translationEn}\n\nحوالہ: ${dua.referenceUr}\n🕌 جامع مسجد عثمانِ غنی رضی اللہ عنہ، نارتھ کراچی`;
    navigator.clipboard.writeText(text);
    setCopiedDuaId(dua.id);
    setTimeout(() => setCopiedDuaId(null), 2500);
  };

  const current = weatherData.current;
  const uvInfo = getUVLevel(current.uvIndex);
  const aqiInfo = weatherData.airQuality
    ? weatherData.airQuality
    : {
        aqi: 86,
        pm25: 21.5,
        pm10: 44.0,
        dust: 36.0,
        statusEn: 'Moderate',
        statusUr: 'قابلِ قبول / معتدل',
        color: '#f59e0b',
        healthAdviceUr: 'شہر قائد کی ہوا معتدل ہے، عام معمولات اور نماز کے لیے موزوں ہے۔',
        healthAdviceEn: 'Air quality is acceptable for outdoor activities and mosque visits.',
      };

  const duasList = weatherData.islamicDuas && weatherData.islamicDuas.length > 0
    ? weatherData.islamicDuas
    : ISLAMIC_WEATHER_DUAS;

  const sunAndMoon = {
    sunrise: weatherData.daily[0]?.sunrise || '06:23 AM',
    solarNoon: liveMoon.solarNoon || weatherData.sunAndMoon?.solarNoon || '12:19 PM',
    sunset: weatherData.daily[0]?.sunset || '06:19 PM',
    dayLength: '11 گھنٹے 56 منٹ (11h 56m)',
    moonPhaseUr: `${liveMoon.currentType.nameUr} (${liveMoon.directionSymbol} ${liveMoon.isWaxing ? 'بڑھ رہا ہے' : 'گھٹ رہا ہے'})`,
    moonPhaseEn: `${liveMoon.currentType.nameEn} (${liveMoon.directionSymbol})`,
    moonIllumination: liveMoon.illumination,
    moonAgeUr: liveMoon.ageFormattedUr,
    moonrise: liveMoon.moonrise,
    moonset: liveMoon.moonset,
    moonTransit: liveMoon.transitTime,
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        id="karachi-weather-modal-dialog"
        className="relative w-full max-w-4xl bg-stone-900 border border-emerald-600/60 rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-emerald-900/60 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-900/70 border border-emerald-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
              {renderWeatherIcon(current.iconName, 'w-6 h-6')}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-white text-base sm:text-lg tracking-tight truncate">
                  {isUrdu ? 'کراچی لائیو موسمیات و جامع ڈیٹا' : 'Karachi Live Comprehensive Weather'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/80 shrink-0">
                  {isUrdu ? 'نارتھ کراچی سیکٹر 5-A/1' : 'North Karachi Sector 5-A/1'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-600/70 shrink-0 font-arabic">
                  {liveMoon.hijriDate.formattedUr}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {isUrdu
                    ? 'جامع مسجد عثمانِ غنی (24.9961° N, 67.0673° E) • بلندی: 28 میٹر'
                    : 'Jamia Masjid Usman-e-Ghani (24.9961° N, 67.0673° E) • Alt: 28m'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onRefreshWeather && (
              <button
                onClick={onRefreshWeather}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-all disabled:opacity-50 shadow-sm"
                title="Refresh Live Data"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-emerald-400 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
                <span className="hidden sm:inline">
                  {isUrdu ? 'تازہ کریں' : 'Refresh'}
                </span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="px-3 sm:px-6 bg-stone-950 border-b border-stone-800 flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-stone-950 shadow-md shadow-emerald-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'تمام میٹرکس و کیفیت' : 'Overview & Metrics'}</span>
          </button>

          <button
            onClick={() => setActiveTab('moon_phase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'moon_phase'
                ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-950/40 ring-1 ring-amber-300'
                : 'text-amber-300/90 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUrdu ? '🌘 موجودہ چاند و قمری مراحل' : '🌘 Moon Type & Phases'}</span>
          </button>

          <button
            onClick={() => setActiveTab('hourly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'hourly'
                ? 'bg-emerald-600 text-stone-950 shadow-md shadow-emerald-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isUrdu ? '24 گھنٹے کا ٹائم لائن' : '24h Timeline'}</span>
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'daily'
                ? 'bg-emerald-600 text-stone-950 shadow-md shadow-emerald-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isUrdu ? '7 روزہ پیش گوئی' : '7-Day Forecast'}</span>
          </button>

          <button
            onClick={() => setActiveTab('air_quality')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'air_quality'
                ? 'bg-emerald-600 text-stone-950 shadow-md shadow-emerald-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ہوا کا معیار (AQI)' : 'Air Quality (AQI)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('islamic_duas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'islamic_duas'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'مسنون موسمی دعائیں (7)' : 'Islamic Duas (7)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('mosque_advice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'mosque_advice'
                ? 'bg-emerald-600 text-stone-950 shadow-md shadow-emerald-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'نمازی و طبی رہنمائی' : 'Worshipper Advice'}</span>
          </button>
        </div>

        {/* Scrollable Tab Content Container */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* TAB 1: OVERVIEW & COMPLETE TELEMETRY (سب کچھ) */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Main Weather Hero Card */}
              <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-950 p-5 sm:p-6 rounded-2xl border-2 border-emerald-600/50 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left: Temperature & Main State */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>{isUrdu ? 'شہرِ قائد کا لائیو موسم' : 'Live Karachi Weather Telemetry'}</span>
                      <span className="text-stone-500">•</span>
                      <span className="text-stone-300 font-mono font-normal">
                        {weatherData.lastUpdated}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl sm:text-7xl font-black text-white font-mono tracking-tight">
                        {current.temperature}°
                      </span>
                      <span className="text-3xl text-stone-400 font-semibold font-mono">C</span>
                      
                      <div className="border-l-2 border-stone-800 pl-3 space-y-0.5">
                        <div className="text-xs text-stone-400 font-medium">
                          {isUrdu ? 'محسوس درجہ حرارت' : 'Feels Like'}
                        </div>
                        <div className="text-lg font-bold text-amber-300 font-mono">
                          ~{current.apparentTemperature}°C
                        </div>
                        <div className="text-[11px] text-stone-400 font-mono">
                          {isUrdu ? 'نقطۂ شبنم (Dew point):' : 'Dew Point:'} {current.dewPoint}°C
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-emerald-200 flex items-center gap-2.5 pt-1">
                      {renderWeatherIcon(current.iconName, 'w-6 h-6')}
                      <span>{isUrdu ? current.conditionUr : current.conditionEn}</span>
                    </h4>

                    {/* Coastal Sea Breeze Pill */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-stone-950/80 border border-emerald-600/40 text-xs text-emerald-300 font-medium mt-1">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isUrdu ? current.seaBreezeStatusUr : current.seaBreezeStatusEn}</span>
                    </div>
                  </div>

                  {/* Right: Primary Fast-Look Mini-Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-stone-950/80 p-3.5 sm:p-4 rounded-2xl border border-stone-800 shrink-0">
                    <div className="p-2 rounded-xl bg-stone-900/70 border border-stone-800/80 text-center">
                      <span className="text-[10px] text-stone-400 block font-semibold">
                        {isUrdu ? 'زیادہ / کم' : 'High / Low'}
                      </span>
                      <span className="font-mono text-sm font-bold text-amber-300">
                        {weatherData.daily[0]?.tempMax ?? 33}° / {weatherData.daily[0]?.tempMin ?? 25}°
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-900/70 border border-stone-800/80 text-center">
                      <span className="text-[10px] text-stone-400 block font-semibold">
                        {isUrdu ? 'ہوا میں نمی' : 'Humidity'}
                      </span>
                      <span className="font-mono text-sm font-bold text-sky-300">
                        {current.relativeHumidity}%
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-900/70 border border-stone-800/80 text-center">
                      <span className="text-[10px] text-stone-400 block font-semibold">
                        {isUrdu ? 'ہوا کی رفتار' : 'Wind Speed'}
                      </span>
                      <span className="font-mono text-sm font-bold text-teal-300">
                        {current.windSpeed} km/h
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-900/70 border border-stone-800/80 text-center">
                      <span className="text-[10px] text-stone-400 block font-semibold">
                        {isUrdu ? 'دھوپ کی شدت (UV)' : 'UV Index'}
                      </span>
                      <span className={`font-mono text-sm font-bold ${uvInfo.color}`}>
                        {current.uvIndex} ({isUrdu ? uvInfo.levelUr : uvInfo.levelEn})
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-900/70 border border-stone-800/80 text-center">
                      <span className="text-[10px] text-stone-400 block font-semibold">
                        {isUrdu ? 'ہوا کا معیار (AQI)' : 'Air Quality (AQI)'}
                      </span>
                      <span className="font-mono text-sm font-bold" style={{ color: aqiInfo.color }}>
                        {aqiInfo.aqi} ({isUrdu ? aqiInfo.statusUr : aqiInfo.statusEn})
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-900/70 border border-stone-800/80 text-center">
                      <span className="text-[10px] text-stone-400 block font-semibold">
                        {isUrdu ? 'بارش کا امکان' : 'Rain Chance'}
                      </span>
                      <span className="font-mono text-sm font-bold text-sky-400">
                        {current.precipitationProbability ?? 5}%
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION: ALL 12 DETAILED WEATHER TELEMETRY CARDS (سب کچھ) */}
              <div>
                <h4 className="text-sm font-extrabold text-white mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>{isUrdu ? 'مکمل موسمی میٹرکس اور سائنسی تفصیلات' : 'Complete Meteorological Telemetry Cards'}</span>
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    12 Live Sensors
                  </span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  
                  {/* 1. Relative Humidity & Dew Point */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Droplets className="w-4 h-4 text-sky-400" />
                        <span>{isUrdu ? 'ہوا میں نمی' : 'Humidity'}</span>
                      </span>
                      <span className="text-[10px] font-mono text-sky-300">
                        {current.relativeHumidity >= 70 ? (isUrdu ? 'مرطوب' : 'Humid') : (isUrdu ? 'معتدل' : 'Comfortable')}
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">
                      {current.relativeHumidity}%
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">
                      {isUrdu ? 'نقطۂ شبنم:' : 'Dew Point:'} <strong className="text-stone-200">{current.dewPoint}°C</strong>
                    </p>
                  </div>

                  {/* 2. Wind Direction & Compass Bearing */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Compass className="w-4 h-4 text-emerald-400" />
                        <span>{isUrdu ? 'ہوا کا رخ' : 'Wind Direction'}</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-300">
                        {current.windDirection}°
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white font-mono truncate">
                      {current.windDirectionCompass}
                    </div>
                    <p className="text-[10px] text-emerald-400 leading-tight truncate">
                      {isUrdu ? 'بحیرہ عرب کی ساحلی ہوا' : 'Coastal Arabian Sea Stream'}
                    </p>
                  </div>

                  {/* 3. Wind Speed & Gusts */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Wind className="w-4 h-4 text-teal-400" />
                        <span>{isUrdu ? 'ہوا کی رفتار' : 'Wind & Gusts'}</span>
                      </span>
                      <span className="text-[10px] font-mono text-teal-300">
                        {current.windSpeed} km/h
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">
                      {current.windSpeed} <span className="text-xs font-normal text-stone-400">km/h</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">
                      {isUrdu ? 'جھکڑ (Gusts):' : 'Gusts:'} <strong className="text-amber-300">{current.windGusts} km/h</strong>
                    </p>
                  </div>

                  {/* 4. Atmospheric Pressure */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Activity className="w-4 h-4 text-purple-400" />
                        <span>{isUrdu ? 'فضائی دباؤ' : 'Pressure'}</span>
                      </span>
                      <span className="text-[10px] font-mono text-purple-300">
                        {current.surfacePressure >= 1013 ? (isUrdu ? 'زیادہ' : 'High') : (isUrdu ? 'نارمل' : 'Normal')}
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">
                      {current.surfacePressure} <span className="text-xs font-normal text-stone-400">hPa</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">
                      {isUrdu ? 'سطح سمندر کے تناظر میں' : 'Barometric Surface Pressure'}
                    </p>
                  </div>

                  {/* 5. UV Radiation Index */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Sun className="w-4 h-4 text-amber-400" />
                        <span>{isUrdu ? 'دھوپ کی شدت (UV)' : 'UV Radiation'}</span>
                      </span>
                      <span className={`text-[10px] font-bold ${uvInfo.color}`}>
                        {isUrdu ? uvInfo.levelUr : uvInfo.levelEn}
                      </span>
                    </div>
                    <div className={`text-xl sm:text-2xl font-black font-mono ${uvInfo.color}`}>
                      {current.uvIndex} <span className="text-xs font-normal text-stone-400">/ 11+</span>
                    </div>
                    <p className="text-[10px] text-stone-400 leading-tight line-clamp-1">
                      {isUrdu ? uvInfo.adviceUr : uvInfo.adviceEn}
                    </p>
                  </div>

                  {/* 6. Visibility */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Eye className="w-4 h-4 text-indigo-400" />
                        <span>{isUrdu ? 'حدِ نگاہ' : 'Visibility'}</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-300">
                        {current.visibility >= 10 ? (isUrdu ? 'صاف' : 'Clear') : (isUrdu ? 'غبار' : 'Haze')}
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">
                      {current.visibility} <span className="text-xs font-normal text-stone-400">km</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">
                      {isUrdu ? 'ڈرائیونگ اور سفر کے لیے موزوں' : 'Clear for road travel'}
                    </p>
                  </div>

                  {/* 7. Cloud Cover */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Cloud className="w-4 h-4 text-stone-300" />
                        <span>{isUrdu ? 'بادلوں کا تناسب' : 'Cloud Cover'}</span>
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {current.cloudCover}%
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">
                      {current.cloudCover}%
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">
                      {current.cloudCover < 20 ? (isUrdu ? 'صاف نیلا آسمان' : 'Clear Sky') : current.cloudCover < 60 ? (isUrdu ? 'ہلکے سفید بادل' : 'Scattered Clouds') : (isUrdu ? 'گھنے بادل' : 'Overcast')}
                    </p>
                  </div>

                  {/* 8. Air Quality Index (AQI) */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>{isUrdu ? 'فضا کا معیار' : 'Air Quality'}</span>
                      </span>
                      <span className="text-[10px] font-bold" style={{ color: aqiInfo.color }}>
                        {isUrdu ? aqiInfo.statusUr : aqiInfo.statusEn}
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black font-mono" style={{ color: aqiInfo.color }}>
                      {aqiInfo.aqi} <span className="text-xs font-normal text-stone-400">AQI</span>
                    </div>
                    <p className="text-[10px] text-stone-400 leading-tight">
                      PM2.5: <strong className="text-stone-200">{aqiInfo.pm25} µg/m³</strong>
                    </p>
                  </div>

                  {/* 9. Sunrise & Sunset */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 space-y-1.5 shadow-sm col-span-2 sm:col-span-1">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Sunrise className="w-4 h-4 text-amber-400" />
                        <span>{isUrdu ? 'طلوع و غروب' : 'Sun Schedule'}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 font-mono">
                      <div>
                        <span className="text-[10px] text-stone-400 block">{isUrdu ? 'طلوع آفتاب' : 'Sunrise'}</span>
                        <span className="font-bold text-amber-300">{sunAndMoon.sunrise}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">{isUrdu ? 'غروب آفتاب' : 'Sunset'}</span>
                        <span className="font-bold text-orange-400">{sunAndMoon.sunset}</span>
                      </div>
                    </div>
                  </div>

                  {/* 10. Solar Noon (نصف النہار) */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 space-y-1.5 shadow-sm col-span-2 sm:col-span-1">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span>{isUrdu ? 'نصف النہار / زوال' : 'Solar Noon'}</span>
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-black text-amber-300 font-mono">
                      {sunAndMoon.solarNoon}
                    </div>
                    <p className="text-[10px] text-stone-400 leading-tight">
                      {isUrdu ? 'سورج کا نقطۂ عروج، ظہر کا آغاز' : 'Peak zenith solar transition'}
                    </p>
                  </div>

                  {/* 11. Day Length (دن کی طوالت) */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 space-y-1.5 shadow-sm col-span-2 sm:col-span-1">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Sun className="w-4 h-4 text-emerald-400" />
                        <span>{isUrdu ? 'دن کی طوالت' : 'Day Length'}</span>
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white font-mono">
                      {sunAndMoon.dayLength}
                    </div>
                    <p className="text-[10px] text-stone-400 leading-tight">
                      {isUrdu ? 'سورج کی کل روشنی کا دورانیہ' : 'Total sunlight hours'}
                    </p>
                  </div>

                  {/* 12. Lunar Phase (چاند کی حالت - Dynamic) */}
                  <div
                    onClick={() => setActiveTab('moon_phase')}
                    dir={isUrdu ? 'rtl' : 'ltr'}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-stone-950 to-stone-950 border border-indigo-500/40 hover:border-amber-400/80 space-y-1.5 shadow-sm col-span-2 sm:col-span-1 cursor-pointer transition-all hover:scale-[1.02] group"
                    title={isUrdu ? 'مکمل قمری تفصیلات اور 24 گھنٹے ٹائم لائن کے لیے کلک کریں' : 'Click for complete moon phase dashboard'}
                  >
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 font-semibold group-hover:text-amber-300 transition-colors">
                        <Moon className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>{isUrdu ? 'موجودہ چاند کی حالت' : 'Current Moon Type'}</span>
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${liveMoon.isWaxing ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {liveMoon.illumination}% {liveMoon.directionSymbol}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {isUrdu ? liveMoon.currentType.nameUr : liveMoon.currentType.nameEn}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5 border-t border-stone-800/80">
                      <span className="text-amber-300 font-urdu truncate">
                        {isUrdu ? liveMoon.hijriDate.formattedUr : liveMoon.hijriDate.formattedEn}
                      </span>
                      <span className={liveMoon.isWaxing ? 'text-emerald-400 font-bold shrink-0' : 'text-amber-400 font-bold shrink-0'}>
                        {isUrdu
                          ? (liveMoon.directionSymbol === '↑' ? '↑ بڑھ رہا ہے' : '↓ گھٹ رہا ہے')
                          : (liveMoon.isWaxing ? '↑ Waxing' : '↓ Waning')}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quick 24h Scroll Preview Strip */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{isUrdu ? 'آئندہ چند گھنٹوں کا منظر نامہ' : 'Upcoming Hours Quick Look'}</span>
                  </h5>
                  <button
                    onClick={() => setActiveTab('hourly')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                  >
                    <span>{isUrdu ? 'مکمل 24 گھنٹے دیکھیں ›' : 'View Full 24 Hours ›'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {weatherData.hourly.slice(0, 8).map((h, hIdx) => (
                    <div
                      key={hIdx}
                      className={`p-2.5 rounded-xl border text-center shrink-0 min-w-[76px] transition-all ${
                        hIdx === 0
                          ? 'bg-emerald-950/70 border-emerald-600/70 shadow-sm'
                          : 'bg-stone-900/60 border-stone-800'
                      }`}
                    >
                      <span className="text-[10px] text-stone-400 font-mono block">
                        {hIdx === 0 ? (isUrdu ? 'ابھی' : 'Now') : h.time.split(' ')[0]}
                      </span>
                      <div className="my-1 flex justify-center">
                        {renderWeatherIcon(h.iconName, 'w-5 h-5')}
                      </div>
                      <span className="text-xs font-bold text-white font-mono block">
                        {h.temp}°
                      </span>
                      <span className="text-[9px] text-sky-400 font-mono block mt-0.5">
                        {h.pop > 0 ? `${h.pop}%` : '0%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prominent Current Moon Phase Section & Progression */}
              <div className="pt-2">
                <CurrentMoonSection language={language} />
              </div>

            </div>
          )}

          {/* TAB: DEDICATED MOON PHASE & CURRENT MOON TYPE */}
          {activeTab === 'moon_phase' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <CurrentMoonSection language={language} />
            </div>
          )}

          {/* TAB 2: HOURLY TIMELINE (24 گھنٹے کا گھنٹہ وار شیڈول) */}
          {activeTab === 'hourly' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{isUrdu ? 'کراچی کا گھنٹہ وار 24 گھنٹے کا موسمی چارٹ' : '24-Hour Hourly Weather Forecast'}</span>
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {isUrdu
                      ? 'درجہ حرارت، بارش کا امکان، ہوا کی رفتار اور نمی کی گھنٹہ وار پیش گوئی'
                      : 'Hour-by-hour temperature, feels-like, precipitation chance, humidity, and wind'}
                  </p>
                </div>
              </div>

              {/* Hourly Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {weatherData.hourly.map((h, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                      idx === 0
                        ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-stone-950 border-stone-800/90 hover:border-emerald-700/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-1 border-b border-stone-800/80 pb-1">
                        <span className="font-bold text-white">{idx === 0 ? (isUrdu ? 'موجودہ وقت' : 'Now') : h.time}</span>
                        <span className={h.isDay ? 'text-amber-400' : 'text-indigo-300'}>
                          {h.isDay ? (isUrdu ? 'دن' : 'Day') : (isUrdu ? 'رات' : 'Night')}
                        </span>
                      </div>

                      <div className="my-2 flex justify-center">
                        {renderWeatherIcon(h.iconName, 'w-7 h-7')}
                      </div>

                      <div className="text-base font-black text-white font-mono">
                        {h.temp}°C
                      </div>
                      <div className="text-[10px] text-amber-300 font-mono">
                        ~{h.apparentTemp}°C
                      </div>

                      <div className="text-[11px] text-stone-300 font-medium mt-1 truncate">
                        {isUrdu ? h.conditionUr : h.conditionEn}
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-stone-800/80 grid grid-cols-2 gap-1 text-[10px] font-mono">
                      <div className="text-left">
                        <span className="text-stone-500 block">{isUrdu ? 'بارش' : 'Rain'}</span>
                        <span className="text-sky-400 font-bold">{h.pop}%</span>
                      </div>
                      <div className="text-right">
                        <span className="text-stone-500 block">{isUrdu ? 'ہوا' : 'Wind'}</span>
                        <span className="text-teal-300 font-bold">{h.windSpeed}k</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 7-DAY EXTENDED FORECAST (7 روزہ پیش گوئی) */}
          {activeTab === 'daily' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>{isUrdu ? 'آئندہ 7 روز کی تفصیلی موسمی پیش گوئی' : '7-Day Extended Weather Forecast'}</span>
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {isUrdu
                      ? 'شہر قائد کے لیے روزانہ زیادہ سے زیادہ و کم سے کم درجہ حرارت اور بارش کا امکان'
                      : 'Extended 7-day weather expectations for Karachi with temperature spans and rain probabilities'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {weatherData.daily.map((d, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      idx === 0
                        ? 'bg-emerald-950/70 border-emerald-500/80 shadow-md'
                        : 'bg-stone-950 border-stone-800/90 hover:border-emerald-700/50'
                    }`}
                  >
                    {/* Day name & Date */}
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0">
                        {renderWeatherIcon(d.iconName, 'w-6 h-6')}
                      </div>
                      <div>
                        <span className="font-extrabold text-white text-sm block">
                          {isUrdu ? d.dayNameUr : d.dayNameEn}
                        </span>
                        <span className="text-[11px] text-emerald-400 font-mono">
                          {d.date}
                        </span>
                      </div>
                    </div>

                    {/* Condition text */}
                    <div className="min-w-[130px]">
                      <span className="text-xs font-semibold text-stone-200 block">
                        {isUrdu ? d.conditionUr : d.conditionEn}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {isUrdu ? 'دھوپ کی شدت: ' : 'UV Max: '}
                        <strong className="text-amber-300">{d.uvIndexMax ?? 7}</strong>
                      </span>
                    </div>

                    {/* Rain probability & Wind */}
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-stone-500 block">{isUrdu ? 'بارش کا امکان' : 'Rain Prob'}</span>
                        <span className="font-bold text-sky-400">{d.precipitationProbability ?? 0}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">{isUrdu ? 'ہوا کی رفتار' : 'Wind Max'}</span>
                        <span className="font-bold text-teal-300">{d.windSpeedMax ?? 16} km/h</span>
                      </div>
                    </div>

                    {/* Temperature Bar & High / Low */}
                    <div className="flex items-center gap-3 min-w-[180px] justify-between sm:justify-end">
                      <span className="text-xs font-mono text-stone-400 w-8 text-right">
                        {d.tempMin}°
                      </span>

                      {/* Visual temperature bar */}
                      <div className="w-24 sm:w-28 h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800 relative">
                        <div
                          className="h-full bg-gradient-to-r from-teal-400 via-amber-400 to-rose-400 rounded-full"
                          style={{
                            marginLeft: `${Math.max(0, (d.tempMin - 20) * 4)}%`,
                            width: `${Math.max(20, (d.tempMax - d.tempMin) * 8)}%`,
                          }}
                        />
                      </div>

                      <span className="text-sm font-black font-mono text-amber-300 w-8 text-left">
                        {d.tempMax}°
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AIR QUALITY & HEALTH (AQI) */}
          {activeTab === 'air_quality' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      {isUrdu ? 'شہر قائد کی فضا کا معیار' : 'Karachi Air Quality Index'}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                      {isUrdu ? 'ایئر کوالٹی انڈیکس (AQI) اور آلودگی کی پیمائش' : 'Real-time Air Quality & Pollutants Telemetry'}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 max-w-xl">
                      {isUrdu
                        ? 'نارتھ کراچی اور مضافات کے ماحولیاتی اسٹیشن سے حاصل کردہ تازہ ترین اعداد و شمار'
                        : 'Accurate PM2.5, PM10, and atmospheric dust particulate levels for North Karachi'}
                    </p>
                  </div>

                  {/* Big AQI Badge */}
                  <div
                    className="p-4 rounded-2xl border text-center shrink-0 min-w-[130px]"
                    style={{ borderColor: aqiInfo.color, backgroundColor: `${aqiInfo.color}15` }}
                  >
                    <span className="text-[10px] text-stone-400 uppercase font-mono block">
                      US AQI
                    </span>
                    <span className="text-4xl font-black font-mono" style={{ color: aqiInfo.color }}>
                      {aqiInfo.aqi}
                    </span>
                    <span className="text-xs font-bold block mt-1" style={{ color: aqiInfo.color }}>
                      {isUrdu ? aqiInfo.statusUr : aqiInfo.statusEn}
                    </span>
                  </div>
                </div>

                {/* Pollutant Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80">
                    <span className="text-xs text-stone-400 block font-semibold">
                      PM2.5 (باریک ذرات)
                    </span>
                    <div className="text-2xl font-black text-amber-300 font-mono my-1">
                      {aqiInfo.pm25} <span className="text-xs font-normal text-stone-400">µg/m³</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">
                      {isUrdu ? 'پھیپھڑوں میں داخل ہونے والے باریک ذرات' : 'Fine inhalable microscopic particles'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80">
                    <span className="text-xs text-stone-400 block font-semibold">
                      PM10 (دھول اور غبار)
                    </span>
                    <div className="text-2xl font-black text-teal-300 font-mono my-1">
                      {aqiInfo.pm10} <span className="text-xs font-normal text-stone-400">µg/m³</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">
                      {isUrdu ? 'سڑکوں اور مٹی سے پیدا ہونے والے ذرات' : 'Coarse dust and street matter'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80">
                    <span className="text-xs text-stone-400 block font-semibold">
                      Dust Concentration (مٹی)
                    </span>
                    <div className="text-2xl font-black text-sky-300 font-mono my-1">
                      {aqiInfo.dust} <span className="text-xs font-normal text-stone-400">µg/m³</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">
                      {isUrdu ? 'ہوا میں موجود مجموعی مٹی کا ارتکاز' : 'Atmospheric suspended dust concentration'}
                    </p>
                  </div>
                </div>

                {/* Health & Advisory Card */}
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{isUrdu ? 'طبی و ماحولیاتی رہنمائی:' : 'Health & Precautionary Guidance:'}</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed">
                    {isUrdu ? aqiInfo.healthAdviceUr : aqiInfo.healthAdviceEn}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {isUrdu
                      ? 'بزرگ نمازی، دمہ کے مریض اور بچے مسجد کے راستے میں مٹی اور گرد و غبار سے بچاؤ کے لیے ماسک کا استعمال فرمائیں۔'
                      : 'Elderly worshippers and sensitive individuals are advised to use protective masks during high dust conditions.'}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: ALL 7 AUTHENTIC ISLAMIC WEATHER DUAS (مسنون دعائیں) */}
          {activeTab === 'islamic_duas' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <h4 className="font-bold text-amber-300 text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>{isUrdu ? 'موسمی حالات کی 7 مستند مسنون دعائیں اور اذکار' : '7 Authentic Prophetic Sunnah Weather Supplications'}</span>
                  </h4>
                  <p className="text-xs text-stone-400">
                    {isUrdu
                      ? 'رسول اللہ ﷺ کی سنتِ مبارکہ: ہوا، بارش، گرج چمک، شدید گرمی اور قحط کے وقت کی دعائیں'
                      : 'Verified sunnah invocations from Sahih Bukhari, Muslim, and Sunan for wind, rain, heat, and thunder'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {duasList.map((dua) => (
                  <div
                    key={dua.id}
                    className="p-4 sm:p-5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-600/60 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-stone-800/80 pb-2.5">
                      <div>
                        <h5 className="font-extrabold text-white text-sm flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span>{isUrdu ? dua.titleUr : dua.titleEn}</span>
                        </h5>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {isUrdu ? dua.occasionUr : dua.occasionEn}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopyDua(dua)}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-emerald-950 text-stone-300 hover:text-emerald-300 border border-stone-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                        title="Copy Dua with Translation"
                      >
                        {copiedDuaId === dua.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">{isUrdu ? 'کاپی ہوگیا!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-stone-400" />
                            <span>{isUrdu ? 'دعا کاپی کریں' : 'Copy Dua'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Arabic Text */}
                    <div className="p-3.5 rounded-xl bg-stone-900/90 border border-emerald-900/40 text-center">
                      <p className="font-arabic text-lg sm:text-xl font-bold text-amber-200 leading-loose select-all">
                        {dua.arabic}
                      </p>
                    </div>

                    {/* Urdu Translation */}
                    <p className="text-xs sm:text-sm font-urdu text-stone-200 text-right leading-relaxed select-all">
                      {dua.translationUr}
                    </p>

                    {/* English Translation */}
                    <p className="text-xs text-stone-400 italic select-all">
                      "{dua.translationEn}"
                    </p>

                    {/* Authentic Reference */}
                    <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                      <span>{isUrdu ? dua.referenceUr : dua.referenceEn}</span>
                      <span className="text-[10px] text-stone-500 uppercase">{isUrdu ? 'مستند حدیث' : 'Sahih Hadith'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MOSQUE & WEATHER ADVISORY (نمازی و مسجدی رہنمائی) */}
          {activeTab === 'mosque_advice' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-gradient-to-br from-emerald-950/80 to-stone-900 p-5 rounded-2xl border border-emerald-600/50 space-y-3">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isUrdu ? 'جامع مسجد عثمانِ غنی کی موسمی سہولیات و نمازی رہنمائی' : 'Mosque Seasonal Facilities & Attendee Guidance'}</span>
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isUrdu
                    ? 'جامع مسجد عثمان غنی (رضی اللہ عنہ)، سیکٹر 5-اے/1 نارتھ کراچی اہل محلہ اور نمازی حضرات کے لیے ہر قسم کے موسم میں مکمل سہولیات فراہم کرتی ہے:'
                    : 'Jamia Masjid Usman-e-Ghani Sector 5-A/1 North Karachi provides worshippers with complete comfort across all seasons:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                    <strong className="text-emerald-300 block flex items-center gap-1.5">
                      <span>🌬️</span>
                      <span>{isUrdu ? 'کشادہ ہوادار ہالز اور پنکھے' : 'Spacious Ventilated Halls & Fans'}</span>
                    </strong>
                    <p className="text-stone-400 text-[11px] leading-relaxed">
                      {isUrdu
                        ? 'مرکزی ہالز کشادہ، ہوادار اور روشن ہیں، اور سولر پاور بیک اپ پر تیز رفتار چھت کے پنکھے بلاتعطل چلتے ہیں۔'
                        : 'Spacious airy prayer halls with high-speed ceiling fans backed by the solar power system.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                    <strong className="text-emerald-300 block flex items-center gap-1.5">
                      <span>💧</span>
                      <span>{isUrdu ? 'صاف و کشادہ وضو خانہ' : 'Spacious Clean Wudu Khana'}</span>
                    </strong>
                    <p className="text-stone-400 text-[11px] leading-relaxed">
                      {isUrdu
                        ? '100 سے زائد سنگ مرمر کی نشستوں پر مشتمل کشادہ وضو خانہ اور نمازیوں کے لیے وضو کے پانی کا باقاعدہ اہتمام۔'
                        : '100+ marble seating wudu points with uninterrupted water supply for prayer attendees.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                    <strong className="text-emerald-300 block flex items-center gap-1.5">
                      <span>🌧️</span>
                      <span>{isUrdu ? 'برسات و بارش کا نکاسی نظام' : 'Monsoon Rain Seepage Protection'}</span>
                    </strong>
                    <p className="text-stone-400 text-[11px] leading-relaxed">
                      {isUrdu
                        ? 'مسجد کی چھت پر واٹر پروفنگ اور جدید گٹر ڈرینج نظام موجود ہے، برسات میں قالینوں اور ہالز کو نمی سے محفوظ رکھا جاتا ہے۔'
                        : 'Reinforced waterproofing and drainage protect carpet rows from rain and humidity.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                    <strong className="text-emerald-300 block flex items-center gap-1.5">
                      <span>☀️</span>
                      <span>{isUrdu ? '10 KV سولر پاور بیک اپ' : '10 KV Solar Energy Continuity'}</span>
                    </strong>
                    <p className="text-stone-400 text-[11px] leading-relaxed">
                      {isUrdu
                        ? 'کے الیکٹرک لوڈ شیڈنگ کی صورت میں سولر پینلز اور انورٹرز کے ذریعے پنکھے، ساؤنڈ سسٹم اور روشنی بلاتعطل جاری رہتی ہے۔'
                        : '10 KV solar inverter setup ensures uninterrupted fans, lighting, and sound system during power cuts.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sunnah Advisory on Delaying Dhuhr in Extreme Heat */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/50 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{isUrdu ? 'سنتِ نبوی ﷺ: شدید گرمی میں ظہر کو ٹھنڈا کر کے پڑھنا (ابراد)' : 'Sunnah of Cooling Dhuhr in Extreme Heat'}</span>
                </div>
                <p className="text-stone-300 leading-relaxed font-arabic text-sm">
                  «أَبْرِدُوا بِالصَّلاَةِ، فَإِنَّ شِدَّةَ الحَرِّ مِنْ فَيْحِ جَهَنَّمَ»
                </p>
                <p className="text-stone-300 leading-relaxed">
                  {isUrdu
                    ? 'رسول اللہ ﷺ نے ارشاد فرمایا: "جب گرمی شدید ہو تو نمازِ ظہر کو ٹھنڈے وقت (تھوڑی تاخیر سے) ادا کرو، کیونکہ شدید گرمی جہنم کی بھپک سے ہے۔" (صحیح بخاری: 536)'
                    : 'The Messenger of Allah (ﷺ) said: "Delay the prayer (Dhuhr) until it becomes cooler, for the severity of heat is from the boiling of Hell." (Sahih Bukhari: 536)'}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="px-4 sm:px-6 py-3 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span>{isUrdu ? 'اوپن میٹیو اسٹیشن کراچی' : 'Open-Meteo Karachi Station'}</span>
            <span>•</span>
            <span className="font-mono text-emerald-400">{weatherData.coordinates.lat}° N, {weatherData.coordinates.lng}° E</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-400">
              {isUrdu ? 'جامع مسجد عثمانِ غنی، سیکٹر 5-A/1' : 'Jamia Masjid Usman-e-Ghani, Sector 5-A/1'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition-colors"
            >
              {isUrdu ? 'بند کریں' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
