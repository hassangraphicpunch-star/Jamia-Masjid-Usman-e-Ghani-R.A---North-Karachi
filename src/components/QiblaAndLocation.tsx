import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Car,
  Clock,
  Building,
  Copy,
  Check,
  Layers,
  Smartphone,
  RotateCw,
  Sparkles,
  Info,
  Globe,
  Share2,
} from 'lucide-react';
import { Language } from '../types';
import { MOSQUE_INFO } from '../data/mockData';
import { MOSQUE_COORDINATES } from '../services/prayerService';

interface QiblaAndLocationProps {
  language: Language;
}

export const QiblaAndLocation: React.FC<QiblaAndLocationProps> = ({
  language,
}) => {
  const [inquirySent, setInquirySent] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedQibla, setCopiedQibla] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  // Mobile Device Orientation Sensor / Interactive Simulator State
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [isCompassActive, setIsCompassActive] = useState(false);
  const [sensorSupported, setSensorSupported] = useState<boolean | null>(null);
  const [manualAngle, setManualAngle] = useState(267.5);
  const [useSimulator, setUseSimulator] = useState(false);

  const isUrdu = language === 'ur';

  // Target Qibla Bearing: 267.49° True North
  const QIBLA_BEARING = MOSQUE_COORDINATES.qiblaBearing || 267.49;
  const currentHeading = useSimulator ? manualAngle : (deviceHeading ?? QIBLA_BEARING);

  // Compute angle difference to Kaaba
  const angleDiff = Math.abs(currentHeading - QIBLA_BEARING);
  const isAligned = angleDiff <= 4 || angleDiff >= 356;

  // Attempt to activate Device Compass Sensor on mobile
  const startCompassSensor = async () => {
    if (typeof window === 'undefined') return;

    if (
      typeof (DeviceOrientationEvent as any) !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const res = await (DeviceOrientationEvent as any).requestPermission();
        if (res !== 'granted') {
          setSensorSupported(false);
          setUseSimulator(true);
          return;
        }
      } catch {
        setSensorSupported(false);
        setUseSimulator(true);
        return;
      }
    }

    setIsCompassActive(true);
    setUseSimulator(false);
  };

  useEffect(() => {
    if (!isCompassActive) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;
      if ((e as any).webkitCompassHeading !== undefined) {
        // iOS Safari webkitCompassHeading is degrees clockwise from magnetic north
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Standard Android / Chrome
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null) {
        setDeviceHeading(Math.round(heading * 10) / 10);
        setSensorSupported(true);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isCompassActive]);

  // Haptic feedback when aligned
  useEffect(() => {
    if (isAligned && (isCompassActive || useSimulator)) {
      try {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(40);
        }
      } catch (_) {}
    }
  }, [isAligned, isCompassActive, useSimulator]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setFormData({ name: '', phone: '', subject: 'general', message: '' });
    }, 3000);
  };

  const googleMapsUrl =
    MOSQUE_COORDINATES.mapsUrl ||
    `https://www.google.com/maps/place/Usman+Ghani+(R.A)+Masjid,+5-A%2F1,+North+Karachi/@25.0048211,67.0574599,18z`;
  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent('Usman Ghani (R.A) Masjid, 5-A/1, North Karachi, Karachi')}&t=&z=17&ie=UTF8&iwloc=&output=embed`;

  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${MOSQUE_COORDINATES.latDecimal}, ${MOSQUE_COORDINATES.lngDecimal}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  const copyQiblaDetails = () => {
    const text = `🕋 جامع مسجد عثمانِ غنی (سیکٹر 5-اے/1، نارتھ کراچی):
• سمتِ قبلہ (Qibla Direction): 267.49° W (مغرب)
• حقیقی شمال سے زاویہ: 267.49° (True North)
• فاصلہ تا خانہ کعبہ: 2,807.34 کلومیٹر (1,744.4 میل)
• مقامِ مسجد (Mosque GPS): 24.9961° N, 67.0673° E
• خانہ کعبہ (Kaaba GPS): 21.4225° N, 39.8262° E
(صدقہ جاریہ برائے امتِ مسلمہ)`;
    navigator.clipboard.writeText(text);
    setCopiedQibla(true);
    setTimeout(() => setCopiedQibla(false), 2500);
  };

  return (
    <section
      id="qibla-location"
      className="py-16 bg-stone-950 border-b border-stone-800/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'مقام، نقشہ و سمتِ قبلہ (267.49° W)' : 'Mosque Location & Qibla Direction (267.49° W)'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isUrdu ? (
              <span className="font-urdu text-3xl sm:text-5xl text-amber-300">
                جامع مسجد کا پتہ، رہنمائی اور سمتِ قبلہ
              </span>
            ) : (
              <span>Location, Directions & Qibla Compass</span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 mt-2">
            {isUrdu
              ? 'ایس ٹی 11، سیکٹر 5-اے/1، نارتھ کراچی - قریب 4-کے چورنگی و پاور ہاؤس'
              : 'ST-11 Sector 5-A/1, North Karachi, Karachi. Easy access from 4-K Chowrangi, Powerhouse, and Surjani Link.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Col: Interactive Qibla Compass & Location Coordinates */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Qibla Direction & Interactive Precision Compass Card */}
            <div
              className={`rounded-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all duration-300 ${
                isAligned && (isCompassActive || useSimulator)
                  ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : 'border-emerald-600/40'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-700/80 text-emerald-300 text-[11px] font-bold uppercase flex items-center gap-1.5 shadow-sm">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isUrdu ? 'سمتِ قبلہ برائے نارتھ کراچی' : 'Qibla Direction (North Karachi)'}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm sm:text-base text-amber-300 font-extrabold bg-stone-900 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                    267.49° W
                  </span>
                </div>
              </div>

              {/* Graphical Interactive Compass Dial */}
              <div className="relative w-48 h-48 sm:w-52 sm:h-52 mx-auto my-2 flex items-center justify-center">
                {/* Outer Calibration Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30 animate-[spin_120s_linear_infinite]" />
                <div
                  className={`absolute inset-2 rounded-full border bg-stone-950/90 transition-all duration-500 ${
                    isAligned && (isCompassActive || useSimulator)
                      ? 'border-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.4)]'
                      : 'border-stone-700 shadow-inner'
                  }`}
                />

                {/* Fixed Compass Markings Dial (Rotates in sensor mode to reflect device rotation) */}
                <div
                  className="absolute inset-3 rounded-full flex items-center justify-center transition-transform duration-200"
                  style={{
                    transform: isCompassActive || useSimulator ? `rotate(${-currentHeading}deg)` : 'rotate(0deg)',
                  }}
                >
                  {/* Cardinal Points */}
                  <span className="absolute top-2 font-mono font-bold text-red-400 text-xs">N 0°</span>
                  <span className="absolute bottom-2 font-mono font-bold text-stone-400 text-xs">S 180°</span>
                  <span className="absolute right-2 font-mono font-bold text-stone-400 text-xs">E 90°</span>
                  <span className="absolute left-2 font-mono font-bold text-amber-300 text-xs">W 270°</span>

                  {/* Degree ticks */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                      <div
                        key={deg}
                        className="absolute w-full h-0.5 bg-stone-500"
                        style={{ transform: `rotate(${deg}deg)` }}
                      />
                    ))}
                  </div>

                  {/* Holy Ka'aba Vector Arrow pointing at exact 267.49° */}
                  <div
                    className="absolute w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-200"
                    style={{ transform: `rotate(${QIBLA_BEARING}deg)` }}
                  >
                    <div className="flex flex-col items-center -translate-y-10 sm:-translate-y-12">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center shadow-lg shadow-amber-950/80 border border-amber-200">
                        🕋
                      </div>
                      <div className="w-1 h-12 bg-gradient-to-b from-amber-400 via-emerald-400 to-transparent rounded-full shadow-sm" />
                      <span className="text-[9px] font-mono font-bold text-amber-300 bg-stone-950/90 px-1 rounded -mt-2">
                        267.49°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center Core Hub */}
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white z-10 transition-colors shadow-md flex items-center justify-center ${
                    isAligned && (isCompassActive || useSimulator)
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-emerald-600'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Live Alignment Notification Glow Badge */}
                {isAligned && (isCompassActive || useSimulator) && (
                  <div className="absolute -bottom-2 z-20 bg-emerald-950 border border-emerald-400 text-emerald-200 px-3 py-0.5 rounded-full text-[10px] font-bold shadow-lg animate-bounce flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>{isUrdu ? 'خانہ کعبہ کی سیدھ درست ہے!' : 'Facing Holy Kaaba!'}</span>
                  </div>
                )}
              </div>

              {/* Subtitle description */}
              <div className="text-center mt-2 mb-3">
                <p className="text-xs text-stone-300 font-medium">
                  {isUrdu
                    ? 'جامع مسجد عثمانِ غنی (نارتھ کراچی) سے خانہ کعبہ کا رخ 267.49 درجے (مغرب / West) ہے۔'
                    : 'From Jamia Masjid Usman-e-Ghani, the Holy Ka’aba in Makkah is at bearing 267.49° (West).'}
                </p>
                <p className="text-[11px] text-amber-300/90 font-mono mt-0.5">
                  {isUrdu
                    ? 'فاصلہ تا کعبہ شریف: 2,807.34 کلومیٹر (1,744.4 میل)'
                    : 'Direct Distance to Kaaba: 2,807.34 km (1,744.4 miles)'}
                </p>
              </div>

              {/* Interactive Compass Sensor & Simulator Controls */}
              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800/80 mb-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isUrdu ? 'سمارٹ فون سینسر / ٹیسٹ ڈائل' : 'Live Compass / Test Dial'}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {!isCompassActive ? (
                      <button
                        type="button"
                        onClick={startCompassSensor}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Compass className="w-3 h-3" />
                        <span>{isUrdu ? 'سینسر فعال کریں' : 'Start Sensor'}</span>
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {Math.round(currentHeading)}°
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setUseSimulator(!useSimulator)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                        useSimulator
                          ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                          : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-white'
                      }`}
                    >
                      {isUrdu ? 'سلائیڈر ٹیسٹ' : 'Simulator'}
                    </button>
                  </div>
                </div>

                {useSimulator && (
                  <div className="pt-2 border-t border-stone-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                      <span>{isUrdu ? 'زاویہ گھمائیں:' : 'Rotate angle:'}</span>
                      <span className="text-amber-300 font-bold">{Math.round(manualAngle)}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      step={0.5}
                      value={manualAngle}
                      onChange={(e) => setManualAngle(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                      <span>N (0°)</span>
                      <span>E (90°)</span>
                      <span>S (180°)</span>
                      <span className="text-amber-400 font-bold">Qibla (267.5°)</span>
                      <span>N (360°)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Precision Geodetic Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-left mb-3">
                <div className="p-2.5 rounded-xl bg-stone-950/90 border border-stone-800/80">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">
                    {isUrdu ? 'سمت و رخ' : 'Qibla Bearing'}
                  </p>
                  <p className="text-xs font-bold text-amber-300 font-mono mt-0.5">
                    267.49° (West)
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">True North</p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-950/90 border border-stone-800/80">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">
                    {isUrdu ? 'فاصلہ تا کعبہ' : 'Kaaba Distance'}
                  </p>
                  <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                    2,807.34 km
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">1,744.4 miles</p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-950/90 border border-stone-800/80">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">
                    {isUrdu ? 'مسجد کوآرڈینیٹس' : 'Mosque GPS'}
                  </p>
                  <p className="text-[11px] font-bold text-white font-mono mt-0.5">
                    24.9961° N
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">67.0673° E</p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-950/90 border border-stone-800/80">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">
                    {isUrdu ? 'خانہ کعبہ (مکہ)' : 'Kaaba (Makkah)'}
                  </p>
                  <p className="text-[11px] font-bold text-white font-mono mt-0.5">
                    21.4225° N
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">39.8262° E</p>
                </div>
              </div>

              {/* Shariah / Scientific Calculation Note */}
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-700/30 text-stone-300 text-[11px] mb-3 text-left">
                <div className="flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {isUrdu ? (
                      <span>
                        <strong>شرعی و سائنسی حساب:</strong> یہ زاویہ حقیقی جغرافیائی شمال (True North) کے مطابق 267.49° مغرب ہے۔ عام موبائل مقناطیسی کمپاس ایپس میں مقناطیسی میلان (Declination) کی وجہ سے معمولی فرق نظر آ سکتا ہے۔
                      </span>
                    ) : (
                      <span>
                        <strong>True North Bearing:</strong> Calculated as true geographic north (267.49° W). Standard phone magnetic compasses may show slight variance due to local magnetic declination.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Google Qibla AR + Copy Data */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href="https://qiblafinder.withgoogle.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-700/90 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{isUrdu ? 'گوگل کیمرہ قبلہ فائنڈر (AR)' : 'Google Qibla AR Finder'}</span>
                  <ExternalLink className="w-3 h-3 text-emerald-300" />
                </a>

                <button
                  type="button"
                  onClick={copyQiblaDetails}
                  className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all border border-stone-700"
                  title="Copy Qibla coordinates and details"
                >
                  {copiedQibla ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">{isUrdu ? 'کاپی ہوگیا' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                      <span>{isUrdu ? 'قبلہ ڈیٹا کاپی' : 'Copy Qibla'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sadaqah Jariah Tag */}
              <div className="mt-2.5 pt-2 border-t border-stone-800/60 flex items-center justify-center gap-1.5 text-[10px] text-emerald-400/80 font-mono">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{isUrdu ? 'صدقہ جاریہ برائے امتِ مسلمہ' : 'Sadaqah Jariah for the Muslim Ummah'}</span>
              </div>
            </div>

            {/* Landmark Entrance Gate Card */}
            <div className="rounded-2xl bg-stone-900/90 border border-amber-500/30 overflow-hidden shadow-xl">
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                  src="/images/masjid_gate.jpg"
                  alt="Jamia Masjid Usman Ghani Entrance Gate"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-stone-950/80 backdrop-blur-md border border-amber-500/40 text-[10px] font-bold text-amber-300">
                  {isUrdu ? 'مرکزی گیٹ' : 'Main Gate'}
                </div>
                <div className="absolute bottom-2.5 left-3 right-3">
                  <p className="text-[11px] font-arabic text-amber-300 font-bold">
                    اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ
                  </p>
                  <p className="text-xs font-bold text-white">
                    {isUrdu ? 'جامع مسجد عثمانِ غنی کا سرخ محرابی بابِ داخلہ' : 'Main Entrance Archway - ST-11 Sector 5-A/1'}
                  </p>
                </div>
              </div>
            </div>

            {/* Address & Nearby Routes */}
            <div className="rounded-2xl bg-stone-900/90 border border-stone-800 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>{isUrdu ? 'رسائی کے راستے و نشانیاں' : 'Directions & Routes'}</span>
              </h3>

              <ul className="space-y-2.5 text-xs text-stone-300">
                <li className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>From 4-K Chowrangi:</strong> Head 2 minutes south on Main Sector 5-A road towards ST-11.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>From Power House Chowrangi:</strong> Take Godhra Road North onto Sector 5-A/1 street.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>From Nagan Chowrangi:</strong> 10 mins drive via Andalib / North Karachi Expressway.
                  </span>
                </li>
              </ul>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'گوگل میپس پر کھولیں' : 'Open in Google Maps'}</span>
                </a>

                <span className="font-mono text-[11px] text-stone-400">
                  {MOSQUE_COORDINATES.lat} | {MOSQUE_COORDINATES.lng}
                </span>
              </div>
            </div>

          </div>

          {/* Right Col: Interactive Visual Map Preview & Contact / Dua Request Form */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Embedded Live Google Map Container */}
            <div className="rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shadow-2xl flex flex-col">
              
              {/* Map Header Bar */}
              <div className="p-3.5 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isUrdu ? 'گوگل لائیو میپ (سیکٹر 5-اے/1 نارتھ کراچی)' : 'Live Google Map (Sector 5-A/1, North Karachi)'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyCoordinates}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                    title="Copy GPS coordinates"
                  >
                    {copiedCoords ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">{isUrdu ? 'کاپی ہوگیا' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-400" />
                        <span>{isUrdu ? 'GPS کوآرڈینیٹس' : 'GPS Coordinates'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Google Maps Iframe */}
              <div className="relative w-full h-80 sm:h-96 bg-stone-950">
                <iframe
                  title="Jamia Masjid Usman-e-Ghani Google Map"
                  src={embedMapUrl}
                  className="w-full h-full border-0 filter contrast-105"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Floating Mosque Location Badge on Map */}
                <div className="absolute top-3 left-3 pointer-events-none bg-stone-950/90 backdrop-blur-md border border-emerald-500/40 rounded-xl px-3 py-2 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🕌</span>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">
                        {isUrdu ? 'جامع مسجد عثمانِ غنی (رضی اللہ عنہ)' : 'Jamia Masjid Usman-e-Ghani'}
                      </p>
                      <p className="text-[10px] text-amber-300">
                        ST-11, Sector 5-A/1, North Karachi
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Footer Bar with Navigation Direct Actions */}
              <div className="p-3.5 bg-stone-950 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-400">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {isUrdu
                      ? '4-کے چورنگی اور پاور ہاؤس کے قریب باآسانی قابل رسائی'
                      : 'Accessible via 4-K Chowrangi & Powerhouse'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <span>{isUrdu ? 'گوگل میپس پر راستہ دیکھیں' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Community Inquiry / Dua Request Form */}
            <div className="rounded-2xl bg-stone-900/90 border border-stone-800 p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{isUrdu ? 'مسجد انتظامیہ کو پیغام / دعا کی درخواست' : 'Contact Mosque Office / Dua Request'}</span>
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                {isUrdu
                  ? 'مسجد کے امور، نکاح، جنازہ یا کسی بھی شرعی رہنمائی کے لیے پیغام بھیجیں'
                  : 'Have a question for the Imam or wish to request special Duas during Friday Khutbah?'}
              </p>

              {inquirySent ? (
                <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-700 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">
                    {isUrdu ? 'آپ کا پیغام کامیابی سے موصول ہو گیا!' : 'Message Sent Successfully!'}
                  </h4>
                  <p className="text-xs text-stone-300">
                    {isUrdu
                      ? 'مسجد انتظامیہ جلد آپ کے نمبر پر رابطہ کرے گی۔ جزاکم اللہ۔'
                      : 'The mosque office will review your note and respond as needed.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-semibold mb-1">
                        {isUrdu ? 'آپ کا نام' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Muhammad Aslam"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 font-semibold mb-1">
                        {isUrdu ? 'فون یا واٹس ایپ نمبر' : 'Phone / WhatsApp'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0300-XXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      {isUrdu ? 'موضوع' : 'Subject'}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="general">{isUrdu ? 'عمومی سوال / معلومات' : 'General Inquiry'}</option>
                      <option value="dua">{isUrdu ? 'خصوصی دعا کی درخواست (جمعہ)' : 'Dua Request for Friday Bayan'}</option>
                      <option value="nikah">{isUrdu ? 'نکاح خوانی کا انتظام' : 'Nikah Ceremony Booking'}</option>
                      <option value="madrasah">{isUrdu ? 'تعلیمی معلومات' : 'Madrasah Admissions'}</option>
                      <option value="solar">{isUrdu ? 'تعمیرات و سولر تعاون' : 'Construction / Solar Support'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      {isUrdu ? 'پیغام' : 'Message Details'} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={isUrdu ? 'اپنا پیغام یہاں لکھیں...' : 'Write your message or Dua request...'}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'پیغام ارسال کریں' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
