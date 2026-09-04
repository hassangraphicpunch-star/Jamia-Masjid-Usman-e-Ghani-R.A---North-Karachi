import React, { useState } from 'react';
import {
  Clock,
  Volume2,
  VolumeX,
  Bell,
  CheckCircle2,
  Users,
  Smartphone,
  ChevronUp,
  X,
  Sparkles,
} from 'lucide-react';
import { Language, IqamahCountdownState } from '../types';
import { azanAudioEngine } from '../services/azanAudioService';

interface IqamahAlertBannerProps {
  language: Language;
  iqamahState: IqamahCountdownState | null;
  onScrollToPrayerTimes: () => void;
  onDismiss?: () => void;
}

export const IqamahAlertBanner: React.FC<IqamahAlertBannerProps> = ({
  language,
  iqamahState,
  onScrollToPrayerTimes,
  onDismiss,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [dismissedForId, setDismissedForId] = useState<string | null>(null);

  if (!iqamahState) return null;

  // If user explicitly dismissed for this prayer instance
  const currentKey = `${iqamahState.prayerId}-${iqamahState.isTimeForIqamah ? 'zero' : 'countdown'}`;
  if (dismissedForId === currentKey) return null;

  const isUrdu = language === 'ur';

  const formatDigits = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedForId(currentKey);
    if (onDismiss) onDismiss();
  };

  // Minimized Floating Pill
  if (isMinimized) {
    return (
      <div
        id="iqamah-minimized-pill"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 left-4 z-40 cursor-pointer animate-in fade-in"
      >
        <div className={`px-4 py-2 rounded-full border shadow-2xl flex items-center gap-2.5 backdrop-blur-md transition-all hover:scale-105 ${
          iqamahState.isTimeForIqamah
            ? 'bg-amber-950/95 border-amber-500/80 text-amber-200 animate-pulse'
            : 'bg-stone-900/95 border-emerald-500/70 text-emerald-200'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${iqamahState.isTimeForIqamah ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-ping'}`} />
          <span className="text-xs font-bold">
            {iqamahState.isTimeForIqamah
              ? isUrdu
                ? `وقتِ اقامت: ${iqamahState.prayerNameUr}`
                : `Time for Iqamah: ${iqamahState.prayerNameEn}`
              : isUrdu
              ? `${iqamahState.prayerNameUr} اقامت: ${formatDigits(iqamahState.minutesRemaining, iqamahState.secondsPart)}`
              : `${iqamahState.prayerNameEn} Iqamah: ${formatDigits(iqamahState.minutesRemaining, iqamahState.secondsPart)}`}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
        </div>
      </div>
    );
  }

  return (
    <div
      id="iqamah-live-banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div
        className={`rounded-2xl border-2 shadow-2xl backdrop-blur-xl p-4 transition-all ${
          iqamahState.isTimeForIqamah
            ? 'bg-gradient-to-br from-amber-950/95 via-stone-900/95 to-amber-950/95 border-amber-500/90 shadow-amber-950/80 text-amber-100'
            : 'bg-gradient-to-br from-emerald-950/95 via-stone-900/95 to-stone-950/95 border-emerald-500/80 shadow-emerald-950/80 text-emerald-100'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-stone-700/50">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full shrink-0 ${
                iqamahState.isTimeForIqamah
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-emerald-400 animate-ping'
              }`}
            />
            <span className="text-xs font-black uppercase tracking-wider">
              {iqamahState.isTimeForIqamah
                ? isUrdu
                  ? 'باجماعت نماز کا وقت!'
                  : 'Time for Iqamah (Congregation)!'
                : isUrdu
                ? 'اذان مکمل • وقتِ اقامت کاؤنٹ ڈاؤن'
                : 'Adhan Delivered • Countdown to Iqamah'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Minimize"
            >
              <ChevronUp className="w-3.5 h-3.5 rotate-180" />
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-rose-900/60 transition-colors"
              title="Close Banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {iqamahState.isTimeForIqamah ? (
          /* Zero State: Time for Iqamah Notice */
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-black text-amber-200">
                  {isUrdu
                    ? `نمازِ ${iqamahState.prayerNameUr} کی جماعت کا وقت ہو چکا ہے`
                    : `It is Time for ${iqamahState.prayerNameEn} Iqamah`}
                </h4>
                <p className="text-xs font-mono text-stone-300">
                  {isUrdu ? 'جامع مسجد عثمانِ غنی میں جماعت شروع ہے' : 'Jamaat has commenced in the main hall'}
                </p>
              </div>
            </div>

            {/* Sunnah Reminders for Congregation */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-semibold font-arabic text-sm">
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <span>« اسْتَوُوا وَاعْتَدِلُوا وَتَرَاصُّوا »</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {isUrdu
                  ? 'برائے کرم صفیں سیدھی فرما لیں، خلا پُر کریں اور موبائل فون خاموش یا بند کر لیں۔'
                  : 'Straighten your rows, fill the gaps, and silence or switch off mobile phones.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-amber-400/90 font-mono">
                {isUrdu ? `وقتِ جماعت: ${iqamahState.jamaatTime12h}` : `Jamaat: ${iqamahState.jamaatTime12h}`}
              </span>
              <button
                onClick={onScrollToPrayerTimes}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 transition-all shadow"
              >
                <span>{isUrdu ? 'اوقات دیکھیں' : 'View Timetable'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Live Countdown State: Remaining Time until Iqamah */
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-stone-400 block font-medium">
                  {isUrdu ? 'نماز باجماعت' : 'Congregation Prayer'}
                </span>
                <span className="text-lg font-black text-white">
                  {isUrdu ? iqamahState.prayerNameUr : iqamahState.prayerNameEn}
                </span>
              </div>

              {/* Jamaat Time Display (Prompt: "the system should display the Jamaat time along with a live countdown") */}
              <div className="text-right px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-500/50">
                <span className="text-[10px] text-emerald-300 block uppercase font-bold">
                  {isUrdu ? 'وقتِ جماعت' : 'Jamaat Time'}
                </span>
                <span className="text-sm font-bold text-amber-300 font-mono">
                  {iqamahState.jamaatTime12h}
                </span>
              </div>
            </div>

            {/* Big Countdown Timer */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-emerald-600/40">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase font-semibold">
                  {isUrdu ? 'اقامت میں باقی وقت' : 'Remaining to Iqamah'}
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-amber-300 tracking-wider">
                  {formatDigits(iqamahState.minutesRemaining, iqamahState.secondsPart)}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700/60 font-medium">
                  {isUrdu ? `اذان: ${iqamahState.adhanTime12h}` : `Adhan: ${iqamahState.adhanTime12h}`}
                </span>
                <span className="text-[10px] text-stone-400">
                  {iqamahState.progressPercent}% {isUrdu ? 'مکمل' : 'elapsed'}
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden border border-emerald-900/60">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${iqamahState.progressPercent}%` }}
              />
            </div>

            {/* Mobile phone silence reminder */}
            <div className="flex items-center justify-between text-[11px] text-stone-300 pt-1">
              <span className="flex items-center gap-1 text-stone-400">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                {isUrdu ? 'موبائل سائلنٹ فرما لیں' : 'Please silence phones'}
              </span>
              <button
                onClick={onScrollToPrayerTimes}
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline text-xs"
              >
                {isUrdu ? 'مکمل اوقات' : 'Timetable'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
