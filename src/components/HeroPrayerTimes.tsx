import React, { useState } from 'react';
import {
  Clock,
  Sunrise,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Sparkles,
  Calendar,
  RefreshCw,
  Printer,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Share2,
  ChevronRight,
  Info,
  ShieldCheck,
  Bell,
  Radio,
  Users,
  Smartphone,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  Language,
  PrayerTimesApiResponse,
  AdminPrayerSettings,
  IqamahCountdownState,
} from '../types';
import {
  formatTo12Hour,
  calculateJamaatTimes,
  MOSQUE_COORDINATES,
  createSimulatedIqamahState,
} from '../services/prayerService';
import {
  azanAudioEngine,
  AzanPlaybackState,
} from '../services/azanAudioService';
import { MOSQUE_INFO, DAILY_WISDOM } from '../data/mockData';

interface HeroPrayerTimesProps {
  language: Language;
  prayerData: PrayerTimesApiResponse;
  apiSource: 'ummah_api' | 'aladhan_api' | 'karachi_offline';
  isLoading: boolean;
  onRefresh: () => void;
  onOpenMonthlyModal: () => void;
  onOpenAdminModal?: () => void;
  onOpenAzanModal: (prayerId?: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => void;
  adminSettings?: AdminPrayerSettings;
  nextPrayer: {
    nextPrayerId: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    nextPrayerNameEn: string;
    nextPrayerNameUr: string;
    nextTime12h: string;
    nextJamaat12h: string;
    secondsRemaining: number;
    currentPrayerId: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    iqamahCountdown?: IqamahCountdownState | null;
  };
  audioMuted: boolean;
  setAudioMuted: (muted: boolean) => void;
  simulatedIqamah?: IqamahCountdownState | null;
  onSetSimulatedIqamah?: (sim: IqamahCountdownState | null) => void;
}

export const HeroPrayerTimes: React.FC<HeroPrayerTimesProps> = ({
  language,
  prayerData,
  apiSource,
  isLoading,
  onRefresh,
  onOpenMonthlyModal,
  onOpenAdminModal,
  onOpenAzanModal,
  adminSettings,
  nextPrayer,
  audioMuted,
  setAudioMuted,
  simulatedIqamah,
  onSetSimulatedIqamah,
}) => {
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [playbackState, setPlaybackState] = useState<AzanPlaybackState>(() =>
    azanAudioEngine.getState()
  );
  const [showDemoControls, setShowDemoControls] = useState(false);
  const isUrdu = language === 'ur';

  // Determine effective Iqamah state (simulation overrides real live clock for demonstration)
  const effectiveIqamah =
    simulatedIqamah !== undefined
      ? simulatedIqamah
      : nextPrayer.iqamahCountdown || null;
  const isIqamahActive = !!effectiveIqamah && effectiveIqamah.isIqamahPeriod;

  // Listen to audio engine state
  React.useEffect(() => {
    const unsub = azanAudioEngine.subscribe((st) => setPlaybackState(st));
    return unsub;
  }, []);

  // Auto-trigger chime when Iqamah countdown hits zero
  const previousZeroRef = React.useRef(false);
  React.useEffect(() => {
    const isZero = effectiveIqamah?.isTimeForIqamah || false;
    if (isZero && !previousZeroRef.current && !audioMuted) {
      azanAudioEngine.playIqamahChime();
    }
    previousZeroRef.current = isZero;
  }, [effectiveIqamah?.isTimeForIqamah, audioMuted]);

  // Auto-trigger Azan when countdown reaches 0
  React.useEffect(() => {
    if (
      nextPrayer.secondsRemaining === 0 &&
      playbackState.autoPlayEnabled &&
      !audioMuted &&
      !playbackState.isPlaying &&
      nextPrayer.nextPrayerId !== 'sunrise'
    ) {
      azanAudioEngine.playPrayerAzan(
        nextPrayer.nextPrayerId as any,
        nextPrayer.nextPrayerNameEn,
        nextPrayer.nextPrayerNameUr
      );
    }
  }, [nextPrayer.secondsRemaining, playbackState.autoPlayEnabled, audioMuted, playbackState.isPlaying, nextPrayer.nextPrayerId]);

  // Calculate formatted times with custom admin settings overrides
  const jamaatTimes = calculateJamaatTimes(prayerData, adminSettings);

  // Time format helper
  const formatSeconds = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const countdown = formatSeconds(nextPrayer.secondsRemaining);

  const handleTestIqamah = (seconds: number) => {
    if (onSetSimulatedIqamah) {
      const activeId =
        nextPrayer.nextPrayerId === 'sunrise' ? 'fajr' : nextPrayer.nextPrayerId;
      const sim = createSimulatedIqamahState(
        activeId as any,
        seconds,
        prayerData,
        jamaatTimes,
        adminSettings
      );
      onSetSimulatedIqamah(sim);
    }
  };

  const handleResetLive = () => {
    if (onSetSimulatedIqamah) {
      onSetSimulatedIqamah(null);
    }
  };

  // Prayer Cards Definitions
  const prayerCards = [
    {
      id: 'fajr' as const,
      nameEn: 'Fajr',
      nameUr: 'فجر',
      nameAr: 'الفَجْر',
      athan: formatTo12Hour(prayerData.fajr),
      jamaat: jamaatTimes.fajr,
      icon: Sunrise,
      color: 'from-sky-900/40 to-indigo-950/60',
      borderColor: 'border-sky-700/40',
      badgeColor: 'text-sky-300 bg-sky-950 border-sky-800',
      noteEn: 'Jamaat time: ' + jamaatTimes.fajr,
      noteUr: 'جماعت کا وقت: ' + jamaatTimes.fajr,
    },
    {
      id: 'sunrise' as const,
      nameEn: 'Sunrise (Ishraq)',
      nameUr: 'طلوع آفتاب / اشراق',
      nameAr: 'الشُّرُوق',
      athan: formatTo12Hour(prayerData.sunrise),
      jamaat: 'Ishraq: ' + jamaatTimes.ishraq,
      icon: Sparkles,
      color: 'from-amber-950/40 to-yellow-950/50',
      borderColor: 'border-amber-700/40',
      badgeColor: 'text-amber-300 bg-amber-950 border-amber-800',
      noteEn: 'Ishraq: ' + jamaatTimes.ishraq,
      noteUr: 'اشراق کا وقت: ' + jamaatTimes.ishraq,
    },
    {
      id: 'dhuhr' as const,
      nameEn: 'Dhuhr',
      nameUr: 'ظہر',
      nameAr: 'الظُّهْر',
      athan: formatTo12Hour(prayerData.dhuhr),
      jamaat: jamaatTimes.dhuhr,
      icon: Sun,
      color: 'from-emerald-950/50 to-teal-950/60',
      borderColor: 'border-emerald-700/40',
      badgeColor: 'text-emerald-300 bg-emerald-950 border-emerald-800',
      noteEn: 'Jamaat time: ' + jamaatTimes.dhuhr,
      noteUr: 'جماعت کا وقت: ' + jamaatTimes.dhuhr,
    },
    {
      id: 'asr' as const,
      nameEn: 'Asr (Hanafi)',
      nameUr: 'عصر (حنفی)',
      nameAr: 'العَصْر',
      athan: formatTo12Hour(prayerData.asr),
      jamaat: jamaatTimes.asr,
      icon: SunMedium,
      color: 'from-orange-950/40 to-amber-950/60',
      borderColor: 'border-orange-700/40',
      badgeColor: 'text-orange-300 bg-orange-950 border-orange-800',
      noteEn: 'Jamaat time: ' + jamaatTimes.asr + ' (Hanafi)',
      noteUr: 'جماعت کا وقت: ' + jamaatTimes.asr,
    },
    {
      id: 'maghrib' as const,
      nameEn: 'Maghrib',
      nameUr: 'مغرب (افطار)',
      nameAr: 'المَغْرِب',
      athan: formatTo12Hour(prayerData.maghrib),
      jamaat: jamaatTimes.maghrib,
      icon: Sunset,
      color: 'from-rose-950/40 to-purple-950/60',
      borderColor: 'border-rose-700/40',
      badgeColor: 'text-rose-300 bg-rose-950 border-rose-800',
      noteEn: 'Jamaat: ' + jamaatTimes.maghrib,
      noteUr: 'جماعت: ' + jamaatTimes.maghrib,
    },
    {
      id: 'isha' as const,
      nameEn: 'Isha',
      nameUr: 'عشاء',
      nameAr: 'العِشَاء',
      athan: formatTo12Hour(prayerData.isha),
      jamaat: jamaatTimes.isha,
      icon: Moon,
      color: 'from-blue-950/40 to-slate-950/60',
      borderColor: 'border-blue-700/40',
      badgeColor: 'text-blue-300 bg-blue-950 border-blue-800',
      noteEn: 'Jamaat time: ' + jamaatTimes.isha,
      noteUr: 'جماعت کا وقت: ' + jamaatTimes.isha,
    },
  ];

  const handleShareSchedule = () => {
    const shareText = `🕌 Prayer Timetable - Jamia Masjid Usman-e-Ghani (R.A)\nST-11 Sector 5-A/1 North Karachi\n\nFajr: Athan ${formatTo12Hour(prayerData.fajr)} | Jamaat ${jamaatTimes.fajr}\nDhuhr: Athan ${formatTo12Hour(prayerData.dhuhr)} | Jamaat ${jamaatTimes.dhuhr}\nAsr: Athan ${formatTo12Hour(prayerData.asr)} | Jamaat ${jamaatTimes.asr}\nMaghrib: Athan ${formatTo12Hour(prayerData.maghrib)} | Jamaat ${jamaatTimes.maghrib}\nIsha: Athan ${formatTo12Hour(prayerData.isha)} | Jamaat ${jamaatTimes.isha}\nJumma: Bayan ${adminSettings?.jummaBayan || '01:00 PM'} | Jamaat ${jamaatTimes.jumma}\n\nVerified Hanafi Karachi`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  return (
    <section
      id="prayer-times"
      className="relative pt-6 pb-16 overflow-hidden bg-islamic-pattern border-b border-stone-800/80"
    >
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-600/10 via-emerald-950/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Optional Live Announcement Banner Configured via Admin Portal */}
        {adminSettings?.showAlertBanner && (
          <div className="mb-6 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-amber-950/90 via-emerald-950 to-amber-950/90 border border-amber-500/50 shadow-lg text-amber-200 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase bg-amber-900/60 px-2 py-0.5 rounded text-amber-300 font-bold border border-amber-700/60 mr-2">
                  {isUrdu ? 'اہم اعلان' : 'MOSQUE NOTICE'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {isUrdu
                    ? adminSettings.alertBannerUr || adminSettings.alertBannerEn
                    : adminSettings.alertBannerEn || adminSettings.alertBannerUr}
                </span>
              </div>
            </div>
            {onOpenAdminModal && (
              <button
                onClick={onOpenAdminModal}
                className="text-[11px] font-bold text-amber-400 hover:text-white underline shrink-0"
              >
                {isUrdu ? 'تبدیل کریں' : 'Edit Notice'}
              </button>
            )}
          </div>
        )}

        {/* Top Islamic Calligraphy & Welcome Banner with Mosque Logo */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          {/* Mosque Logo with glowing gold/emerald border */}
          <div className="flex justify-center mb-3">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-br from-amber-400 via-emerald-600 to-amber-500 shadow-xl shadow-emerald-950/80">
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-stone-950 flex items-center justify-center">
                <img
                  src="/images/masjid_logo.jpg"
                  alt="Jamia Masjid Usman-e-Ghani Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 mb-2 px-4 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 shadow-inner">
            <span className="text-sm sm:text-base font-arabic text-amber-300 tracking-wider">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
          </div>

          {/* Mosque Entrance Dua from the Gate Archway */}
          <div className="mb-3">
            <span className="text-xs sm:text-sm font-arabic font-bold text-emerald-300/90 tracking-wide bg-stone-950/70 px-3.5 py-1 rounded-full border border-emerald-800/60 inline-block">
              اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2">
            {isUrdu ? (
              <span className="font-urdu text-amber-300 block text-3xl sm:text-5xl py-1">
                {MOSQUE_INFO.nameUr}
              </span>
            ) : (
              <span>{MOSQUE_INFO.nameEn}</span>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 flex items-center justify-center gap-1.5 flex-wrap">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-300">
              {isUrdu ? MOSQUE_INFO.addressUr : MOSQUE_INFO.addressEn}
            </span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="text-amber-400/90 text-xs">
              {isUrdu ? 'فقہ حنفی (کراچی وقت)' : 'Hanafi Schedule (Karachi Method)'}
            </span>
          </p>
        </div>

        {/* HERO LIVE COUNTDOWN & NEXT PRAYER SPOTLIGHT CARD */}
        <div
          id="hero-next-prayer-banner"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(6, 44, 30, 0.82), rgba(28, 25, 23, 0.90)), url(${
              adminSettings?.mediaSettings?.heroBannerImage || '/images/usman_ghani_masjid_interior.jpg'
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-950/90 border border-emerald-600/40 p-5 sm:p-7 shadow-2xl shadow-emerald-950/50 relative overflow-hidden"
        >
          {/* Subtle Islamic Arch background decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Col: Next Prayer Name & Jamaat Schedule / Iqamah Status */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-2">
              {isIqamahActive ? (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider shadow-md ${
                  effectiveIqamah.isTimeForIqamah
                    ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 animate-pulse'
                    : 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                }`}>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      effectiveIqamah.isTimeForIqamah
                        ? 'bg-amber-400 animate-ping'
                        : 'bg-emerald-400 animate-ping'
                    }`}
                  />
                  <span>
                    {effectiveIqamah.isTimeForIqamah
                      ? isUrdu
                        ? 'باجماعت اقامت کا وقت!'
                        : 'Time for Iqamah (Congregation)!'
                      : isUrdu
                      ? 'اذان مکمل • وقتِ اقامت'
                      : 'Adhan Delivered • Iqamah Pending'}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {isUrdu ? 'اگلی نماز کا وقت' : 'Next Prayer Schedule'}
                </div>
              )}

              <div className="flex items-center justify-center lg:justify-start gap-4 pt-1">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">
                    {isIqamahActive
                      ? isUrdu
                        ? `نمازِ ${effectiveIqamah.prayerNameUr}`
                        : `${effectiveIqamah.prayerNameEn} Prayer`
                      : isUrdu
                      ? nextPrayer.nextPrayerNameUr
                      : nextPrayer.nextPrayerNameEn}
                  </h2>
                  <p className="text-xs text-stone-400">
                    {isUrdu ? 'جامع مسجد عثمان غنی میں باجماعت نماز' : 'Jamia Masjid Usman-e-Ghani Jamaat'}
                  </p>
                </div>
              </div>

              {/* Azan vs Jamaat comparison badge */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                <div className="px-3.5 py-2 rounded-xl bg-stone-900/80 border border-stone-700 text-center">
                  <span className="text-[11px] text-stone-400 block uppercase">
                    {isUrdu ? 'وقت اذان' : 'Athan Time'}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-amber-300 font-mono">
                    {isIqamahActive ? effectiveIqamah.adhanTime12h : nextPrayer.nextTime12h}
                  </span>
                </div>

                {/* Jamaat Time Display */}
                <div
                  className={`px-3.5 py-2 rounded-xl text-center shadow-lg transition-all ${
                    isIqamahActive
                      ? 'bg-emerald-900/80 border-2 border-amber-400 ring-2 ring-amber-400/40 scale-105'
                      : 'bg-emerald-900/50 border border-emerald-600/60'
                  }`}
                >
                  <span className="text-[11px] text-emerald-300 block uppercase font-bold">
                    {isUrdu ? 'وقت جماعت (اقامت)' : 'Jamaat Time (Iqamah)'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
                    {isIqamahActive ? effectiveIqamah.jamaatTime12h : nextPrayer.nextJamaat12h}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Col: Live Seconds-Precision Countdown Timer or Iqamah Banner */}
            {isIqamahActive ? (
              effectiveIqamah.isTimeForIqamah ? (
                /* ZERO STATE: Time for Iqamah Notice */
                <div className="lg:col-span-4 flex flex-col items-center justify-center py-3 lg:border-x lg:border-stone-800/80 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-950/60 animate-bounce">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-200">
                    {isUrdu ? 'باجماعت نماز کا وقت ہو چکا ہے!' : 'IT IS TIME FOR IQAMAH!'}
                  </div>
                  <div className="text-sm font-arabic font-bold text-amber-300 tracking-wide">
                    « اسْتَوُوا وَاعْتَدِلُوا وَتَرَاصُّوا »
                  </div>
                  <div className="text-xs text-stone-300 max-w-xs leading-relaxed">
                    {isUrdu
                      ? 'برائے کرم صفیں سیدھی و برابر فرما لیں، خلا پُر کریں اور موبائل فون خاموش یا بند کر لیں۔'
                      : 'Straighten your rows, fill the gaps, and silence or switch off mobile phones.'}
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 text-xs font-bold animate-pulse">
                    <Users className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'جماعت کھڑی ہو رہی ہے' : 'Jamaat is Standing Now'}</span>
                  </div>
                </div>
              ) : (
                /* LIVE COUNTDOWN TO IQAMAH */
                <div className="lg:col-span-4 flex flex-col items-center justify-center py-2 lg:border-x lg:border-stone-800/80">
                  <span className="text-xs text-amber-300 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {isUrdu ? 'باقی ماندہ وقت برائے اقامت (جماعت)' : 'Live Countdown to Iqamah'}
                  </span>

                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Minutes */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-stone-950/90 border border-amber-500/50 flex items-center justify-center text-2xl sm:text-3xl font-black text-amber-300 font-mono shadow-inner">
                        {effectiveIqamah.minutesRemaining.toString().padStart(2, '0')}
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 uppercase font-semibold">
                        {isUrdu ? 'منٹ' : 'Minutes'}
                      </span>
                    </div>

                    <span className="text-2xl font-bold text-amber-400 mb-4 animate-pulse">:</span>

                    {/* Seconds */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-stone-950/90 border border-amber-500/50 flex items-center justify-center text-2xl sm:text-3xl font-black text-emerald-400 font-mono shadow-inner">
                        {effectiveIqamah.secondsPart.toString().padStart(2, '0')}
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 uppercase font-semibold">
                        {isUrdu ? 'سیکنڈ' : 'Seconds'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar between Adhan and Iqamah */}
                  <div className="w-full max-w-xs mt-3 px-2">
                    <div className="w-full bg-stone-900/90 h-2 rounded-full overflow-hidden border border-emerald-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-1000"
                        style={{ width: `${effectiveIqamah.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-stone-400 mt-1">
                      <span>{isUrdu ? 'اذان' : 'Adhan'}</span>
                      <span className="text-amber-300 font-bold">
                        {effectiveIqamah.progressPercent}% {isUrdu ? 'مکمل' : 'elapsed'}
                      </span>
                      <span>{isUrdu ? 'اقامت' : 'Iqamah'}</span>
                    </div>
                  </div>
                </div>
              )
            ) : (
              /* STANDARD COUNTDOWN TO ATHAN */
              <div className="lg:col-span-4 flex flex-col items-center justify-center py-2 lg:border-x lg:border-stone-800/80">
                <span className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-2">
                  {isUrdu ? 'باقی ماندہ وقت برائے اذان' : 'Countdown to Athan'}
                </span>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-stone-950/90 border border-emerald-500/40 flex items-center justify-center text-xl sm:text-2xl font-black text-amber-300 font-mono shadow-inner">
                      {countdown.hours}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 uppercase font-semibold">
                      {isUrdu ? 'گھنٹے' : 'Hours'}
                    </span>
                  </div>

                  <span className="text-2xl font-bold text-emerald-500 mb-4 animate-pulse">:</span>

                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-stone-950/90 border border-emerald-500/40 flex items-center justify-center text-xl sm:text-2xl font-black text-amber-300 font-mono shadow-inner">
                      {countdown.minutes}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 uppercase font-semibold">
                      {isUrdu ? 'منٹ' : 'Minutes'}
                    </span>
                  </div>

                  <span className="text-2xl font-bold text-emerald-500 mb-4 animate-pulse">:</span>

                  {/* Seconds */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-stone-950/90 border border-emerald-500/40 flex items-center justify-center text-xl sm:text-2xl font-black text-emerald-400 font-mono shadow-inner">
                      {countdown.seconds}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 uppercase font-semibold">
                      {isUrdu ? 'سیکنڈ' : 'Seconds'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Right Col: Current Time & Date & API Sync details */}
            <div className="lg:col-span-3 text-center lg:text-right space-y-2">
              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                <div className="flex items-center justify-center lg:justify-end gap-1.5 text-xs text-stone-400 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {new Date().toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="text-amber-300 font-arabic text-base sm:text-lg font-semibold">
                  {prayerData.hijriDate
                    ? `${prayerData.hijriDate.day} ${prayerData.hijriDate.month.ar} ${prayerData.hijriDate.year}ھ`
                    : '12 صفر 1448ھ'}
                </div>
              </div>

              {/* API status badge & Azan Controls */}
              <div className="flex items-center justify-center lg:justify-end gap-2 text-[11px] flex-wrap">
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/80">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {apiSource === 'ummah_api'
                    ? 'Ummah API Live'
                    : apiSource === 'aladhan_api'
                    ? 'Aladhan Karachi Synced'
                    : 'Karachi Hanafi Offline Engine'}
                </span>
                
                <button
                  id="btn-refresh-prayer-times"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                  title="Refresh timings from API"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>

              {/* Azan Player Quick Action in Banner */}
              <div className="pt-2 flex items-center justify-center lg:justify-end gap-2">
                <button
                  id="hero-play-azan-btn"
                  onClick={() => {
                    if (playbackState.isPlaying) {
                      azanAudioEngine.stop();
                    } else {
                      azanAudioEngine.playPrayerAzan(
                        nextPrayer.nextPrayerId === 'sunrise' ? 'fajr' : nextPrayer.nextPrayerId,
                        nextPrayer.nextPrayerNameEn,
                        nextPrayer.nextPrayerNameUr
                      );
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                    playbackState.isPlaying
                      ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>
                    {playbackState.isPlaying
                      ? isUrdu
                        ? 'اذان روکیں (Stop)'
                        : 'Stop Adhan'
                      : isUrdu
                      ? 'صدائے اذان سنیں'
                      : 'Listen to Adhan'}
                  </span>
                </button>

                <button
                  id="hero-open-azan-modal-btn"
                  onClick={() =>
                    onOpenAzanModal(
                      nextPrayer.nextPrayerId === 'sunrise' ? 'fajr' : nextPrayer.nextPrayerId
                    )
                  }
                  className="p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-emerald-700/60 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Open Azan & Voice Options"
                >
                  <Radio className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* IQAMAH COUNTDOWN INTERACTIVE TEST & PREVIEW TOOLBAR */}
          <div className="mt-3 pt-3 border-t border-emerald-800/40 flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-amber-300/90 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{isUrdu ? 'اقامت کاؤنٹ ڈاؤن سسٹم:' : 'Iqamah Countdown System:'}</span>
              </span>
              {simulatedIqamah ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-600/80 text-amber-300 text-[10px] font-bold">
                  {isUrdu ? 'ڈیمو موڈ فعال ہے' : 'Demo Mode Active'}
                </span>
              ) : isIqamahActive ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600/80 text-emerald-300 text-[10px] font-bold">
                  {isUrdu ? 'لائیو کلاک فعال ہے' : 'Live Clock Active'}
                </span>
              ) : (
                <span className="text-[11px] text-stone-400">
                  {isUrdu
                    ? 'اذان کے بعد خودکار طور پر لائیو کاؤنٹ ڈاؤن شروع ہوتا ہے'
                    : 'Automatically activates after Adhan until Jamaat'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                id="btn-test-iqamah-5m"
                onClick={() => handleTestIqamah(5 * 60)}
                className="px-2.5 py-1 rounded-lg bg-stone-900/90 hover:bg-emerald-900/60 border border-stone-700 hover:border-emerald-500 text-stone-300 hover:text-white transition-all text-[11px] font-medium"
                title="Simulate 5 minutes until Iqamah"
              >
                {isUrdu ? '5 منٹ کاؤنٹ ڈاؤن' : '5m Demo'}
              </button>

              <button
                id="btn-test-iqamah-1m"
                onClick={() => handleTestIqamah(60)}
                className="px-2.5 py-1 rounded-lg bg-stone-900/90 hover:bg-emerald-900/60 border border-stone-700 hover:border-emerald-500 text-stone-300 hover:text-white transition-all text-[11px] font-medium"
                title="Simulate 1 minute until Iqamah"
              >
                {isUrdu ? '1 منٹ' : '1m Demo'}
              </button>

              <button
                id="btn-test-iqamah-10s"
                onClick={() => handleTestIqamah(10)}
                className="px-2.5 py-1 rounded-lg bg-stone-900/90 hover:bg-amber-900/60 border border-stone-700 hover:border-amber-500 text-stone-300 hover:text-white transition-all text-[11px] font-medium"
                title="Simulate 10 seconds countdown to zero"
              >
                {isUrdu ? '10 سیکنڈ' : '10s Demo'}
              </button>

              <button
                id="btn-test-iqamah-zero"
                onClick={() => handleTestIqamah(0)}
                className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-600 text-amber-200 transition-all text-[11px] font-bold flex items-center gap-1 shadow-sm"
                title="Simulate countdown reaching zero (Time for Iqamah)"
              >
                <Bell className="w-3 h-3 text-amber-300 animate-bounce" />
                <span>{isUrdu ? 'اقامت کا وقت (0:00)' : 'Time for Iqamah (0:00)'}</span>
              </button>

              <button
                id="btn-test-iqamah-chime"
                onClick={() => azanAudioEngine.playIqamahChime()}
                className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                title="Test Iqamah Chime Audio"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              </button>

              {simulatedIqamah && (
                <button
                  id="btn-reset-iqamah-live"
                  onClick={handleResetLive}
                  className="px-2 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-200 transition-all text-[11px] font-bold flex items-center gap-1"
                  title="Return to real-time clock"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isUrdu ? 'لائیو وقت پر واپس' : 'Live Clock'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PRIMARY PRAYER TIMETABLE 6-CARD GRID */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span>{isUrdu ? 'آج کے نماز کے اوقات و باجماعت شیڈول' : 'Today’s Prayer Timings & Jamaat Schedule'}</span>
              </h3>
              <p className="text-xs text-stone-400">
                {isUrdu
                  ? 'جامع مسجد عثمان غنی، سیکٹر 5-اے/1 نارتھ کراچی'
                  : 'ST-11 Sector 5-A/1 North Karachi (Karachi Hanafi Standard)'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Azan Voice Modal Button */}
              <button
                id="btn-open-azan-modal-hero"
                onClick={() => onOpenAzanModal()}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/50 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                title="Play Adhan & View Post-Adhan Dua"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>{isUrdu ? 'صدائے اذان و دعا' : 'Adhan Voice & Dua'}</span>
              </button>

              {/* Admin Portal Edit Button */}
              {onOpenAdminModal && (
                <button
                  id="btn-open-admin-portal-hero"
                  onClick={onOpenAdminModal}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Edit Namaz & Jamaat Times"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isUrdu ? 'اوقات ایڈٹ کریں (Admin)' : 'Edit Namaz Times'}</span>
                </button>
              )}

              <button
                id="btn-share-prayer-times"
                onClick={handleShareSchedule}
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{copiedNotification ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'شیڈول شیئر کریں' : 'Share Timings')}</span>
              </button>

              <button
                id="btn-open-monthly-schedule"
                onClick={onOpenMonthlyModal}
                className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ماہانہ ٹائم ٹیبل' : 'Monthly Table'}</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {prayerCards.map((p) => {
              const isIqamahThis = isIqamahActive && effectiveIqamah?.prayerId === p.id;
              const isNext = nextPrayer.nextPrayerId === p.id && !isIqamahThis;
              const isCurrent = nextPrayer.currentPrayerId === p.id && !isNext && !isIqamahThis;
              const IconComp = p.icon;
              const isThisPlaying =
                playbackState.isPlaying && playbackState.activePrayerId === p.id;

              return (
                <div
                  key={p.id}
                  id={`prayer-card-${p.id}`}
                  className={`relative rounded-2xl p-4 transition-all duration-300 bg-gradient-to-b ${p.color} border ${
                    isIqamahThis
                      ? 'border-amber-400 ring-2 ring-amber-400/60 scale-[1.03] shadow-2xl shadow-amber-950/50'
                      : isNext
                      ? 'border-amber-400 ring-2 ring-amber-400/30 scale-[1.02] shadow-xl shadow-amber-950/30'
                      : isCurrent
                      ? 'border-emerald-500/70 ring-1 ring-emerald-500/30'
                      : `${p.borderColor} hover:border-emerald-500/50`
                  }`}
                >
                  {/* Status Indicator Pill */}
                  {isIqamahThis ? (
                    <div
                      className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider shadow-md ${
                        effectiveIqamah.isTimeForIqamah
                          ? 'bg-amber-400 text-stone-950 animate-bounce'
                          : 'bg-emerald-400 text-stone-950 animate-pulse'
                      }`}
                    >
                      {effectiveIqamah.isTimeForIqamah
                        ? isUrdu
                          ? 'وقتِ جماعت!'
                          : 'Time for Iqamah!'
                        : isUrdu
                        ? `اقامت: ${effectiveIqamah.minutesRemaining}:${effectiveIqamah.secondsPart.toString().padStart(2, '0')}`
                        : `Iqamah: ${effectiveIqamah.minutesRemaining}:${effectiveIqamah.secondsPart.toString().padStart(2, '0')}`}
                    </div>
                  ) : isNext ? (
                    <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-extrabold text-[10px] uppercase tracking-wider shadow-md animate-bounce">
                      {isUrdu ? 'اگلی نماز' : 'Next Prayer'}
                    </div>
                  ) : null}

                  {/* Header: Icon, Arabic Calligraphy & Quick Play Azan */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-stone-900/80 border border-stone-700/60 flex items-center justify-center">
                      <IconComp className="w-5 h-5 text-amber-300" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {p.id !== 'sunrise' && (
                        <button
                          onClick={() => {
                            if (isThisPlaying) {
                              azanAudioEngine.stop();
                            } else {
                              azanAudioEngine.playPrayerAzan(
                                p.id,
                                p.nameEn + ' Azan',
                                'اذانِ ' + p.nameUr
                              );
                            }
                          }}
                          className={`p-1 rounded-md transition-colors ${
                            isThisPlaying
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-stone-900/80 hover:bg-emerald-700 text-stone-300 hover:text-white border border-stone-700/50'
                          }`}
                          title={isThisPlaying ? 'Stop Azan' : 'Play Azan'}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span className="font-arabic text-stone-300 text-sm font-semibold">
                        {p.nameAr}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white mb-0.5">
                      {isUrdu ? p.nameUr : p.nameEn}
                    </h4>
                  </div>

                  {/* Athan Time */}
                  <div className="mt-3 pt-2.5 border-t border-stone-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">{isUrdu ? 'اذان:' : 'Athan:'}</span>
                      <span className="font-bold text-white font-mono">{p.athan}</span>
                    </div>

                    {/* Jamaat Time */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-semibold">{isUrdu ? 'جماعت:' : 'Jamaat:'}</span>
                      <span className="font-extrabold text-amber-300 font-mono bg-stone-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                        {p.jamaat}
                      </span>
                    </div>
                  </div>

                  {/* Micro Note */}
                  <div className="mt-2.5 pt-2 border-t border-stone-800/40 text-[10px] text-stone-400 line-clamp-1">
                    {isUrdu ? p.noteUr : p.noteEn}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FRIDAY JUMMA SPECIAL BANNER */}
        <div
          id="jumma-special-schedule"
          className="rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 border border-amber-500/40 p-4 sm:p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <span className="text-2xl font-arabic text-amber-300 font-bold">ج</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {isUrdu ? 'جمعۃ المبارک باجماعت شیڈول' : 'Friday Juma’ah Congregation Schedule'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase">
                    Weekly Special
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  {isUrdu
                    ? (adminSettings?.jummaKhateebUr
                        ? `خطیب: ${adminSettings.jummaKhateebUr} | امام: حضرت مولانا ہدایت اللہ صاحب`
                        : 'خطیب: حضرت مولانا یونس منصوری صاحب | امام: حضرت مولانا ہدایت اللہ صاحب')
                    : (adminSettings?.jummaKhateebEn
                        ? `Khatib: ${adminSettings.jummaKhateebEn} | Imam: Maulana Hidayatullah`
                        : 'Khatib: Maulana Younus Mansori | Imam: Maulana Hidayatullah')}
                </p>
              </div>
            </div>

            {/* Friday Timetable Badges (Azan 1, Bayan, Azan 2, Khutbah & Jamaat) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-stone-950/80 border border-stone-800">
                <span className="block text-[10px] text-stone-400 uppercase">
                  {isUrdu ? 'اذانِ اول' : '1st Athan'}
                </span>
                <span className="font-bold text-stone-200 font-mono">
                  {adminSettings?.jummaAzan || '01:00 PM'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-stone-950/80 border border-stone-800">
                <span className="block text-[10px] text-stone-400 uppercase">
                  {isUrdu ? 'درس / بیان' : 'Urdu Bayan'}
                </span>
                <span className="font-bold text-amber-300 font-mono">
                  {adminSettings?.jummaBayan || '01:00 PM'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-stone-950/80 border border-stone-800">
                <span className="block text-[10px] text-stone-400 uppercase">
                  {isUrdu ? 'اذانِ ثانی' : '2nd Athan'}
                </span>
                <span className="font-bold text-amber-200 font-mono">
                  {adminSettings?.jummaAzan2 || '01:30 PM'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-emerald-900/60 border border-emerald-600 shadow-sm">
                <span className="block text-[10px] text-emerald-300 uppercase font-semibold">
                  {isUrdu ? 'خطبہ و جماعت' : 'Khutbah & Jamaat'}
                </span>
                <span className="font-extrabold text-white font-mono">
                  {adminSettings?.jummaJamaat || '01:45 PM'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Community Quick Facilities Strip */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-stone-300">
              {isUrdu ? '10 KV سولر (16 پلیٹس)' : '10 KV Solar (16 Plates)'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-stone-300">
              {isUrdu ? 'کشادہ و ہوا دار ہالز' : 'Spacious Prayer Halls'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-stone-300">
              {isUrdu ? 'کشادہ و صاف وضو خانہ' : 'Spacious Wudu Khana'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-stone-300">
              {isUrdu ? 'دارالقرآن حفظ و ناظرہ' : 'Madrasah Hifz & Nazra'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
