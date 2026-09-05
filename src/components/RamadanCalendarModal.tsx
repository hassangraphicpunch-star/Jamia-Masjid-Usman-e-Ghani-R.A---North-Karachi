import React, { useState } from 'react';
import {
  X,
  Printer,
  Moon,
  Sun,
  Calendar,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  MapPin,
  Volume2,
  Bookmark,
  ChevronRight,
  Clock,
  Heart,
  Star,
} from 'lucide-react';
import { Language, AdminPrayerSettings } from '../types';
import { MOSQUE_INFO } from '../data/mockData';
import {
  RAMADAN_2027_CALENDAR,
  RAMADAN_DUAS,
  RamadanDaySchedule,
} from '../data/ramadan2027Data';
import { azanAudioEngine } from '../services/azanAudioService';

interface RamadanCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  adminSettings?: AdminPrayerSettings;
  onSelectRozaDemo?: (rozaNo: number) => void;
}

export const RamadanCalendarModal: React.FC<RamadanCalendarModalProps> = ({
  isOpen,
  onClose,
  language,
  adminSettings,
  onSelectRozaDemo,
}) => {
  const [selectedAshra, setSelectedAshra] = useState<0 | 1 | 2 | 3>(0); // 0 = all
  const [selectedDuaTab, setSelectedDuaTab] = useState<'sehri' | 'iftar' | 'ashra' | 'qadr'>('iftar');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const isUrdu = language === 'ur';

  if (!isOpen) return null;

  const filteredDays =
    selectedAshra === 0
      ? RAMADAN_2027_CALENDAR
      : RAMADAN_2027_CALENDAR.filter((d) => d.ashra === selectedAshra);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `🌙 Ramadan 2027 (1448 AH) Calendar - Jamia Masjid Usman-e-Ghani (R.A)\nSector 5-A/1 North Karachi • Verified Hanafi Schedule\n\nDaily Sehri, Iftar, Taraweeh & Prayer Timetable\nOfficial Mosque Desk: 03233469424`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div
      id="ramadan-2027-calendar-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
    >
      <div className="bg-stone-900 border border-emerald-600/60 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 border-b border-emerald-700/50 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-600 p-0.5 shadow-lg shadow-emerald-950/80">
              <div className="w-full h-full rounded-[14px] bg-stone-950 flex items-center justify-center text-amber-300">
                <Moon className="w-6 h-6 fill-amber-300/30" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {isUrdu
                    ? 'ماہِ رمضان المبارک 1448ھ / 2027ء - مکمل یومیہ کلینڈر'
                    : 'Ramadan 2027 (1448 AH) Official Calendar & Timetable'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold font-mono">
                  1448 AH • کراچی حنفی
                </span>
              </div>
              <p className="text-xs text-stone-300 flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="font-semibold text-emerald-300">
                  {isUrdu ? MOSQUE_INFO.nameUr : MOSQUE_INFO.nameEn}
                </span>
                <span className="text-stone-500">•</span>
                <span className="text-stone-300">
                  {isUrdu ? 'سیکٹر 5-اے/1 نارتھ کراچی' : 'Sector 5-A/1 North Karachi'}
                </span>
                <span className="text-stone-500">•</span>
                <span className="text-amber-400 font-mono text-[11px]">
                  08 Feb 2027 - 09 Mar 2027
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => azanAudioEngine.playIftarSiren()}
              className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/60 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Test Authentic Ramadan Iftar Siren"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isUrdu ? 'سائرن سنیں' : 'Ramadan Siren'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">
                {copiedNotification ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'شیئر' : 'Share')}
              </span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950"
              title="Print Ramadan 2027 Timetable for Home"
            >
              <Printer className="w-4 h-4" />
              <span>{isUrdu ? 'پرنٹ کلینڈر' : 'Print Calendar'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ashra Filter Tabs & Ramadan Stats */}
        <div className="px-4 py-3 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-400 hidden sm:inline">
              {isUrdu ? 'عشرہ منتخب کریں:' : 'Filter by Ashra:'}
            </span>
            <div className="inline-flex rounded-xl bg-stone-900 p-1 border border-stone-800">
              <button
                onClick={() => setSelectedAshra(0)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAshra === 0
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {isUrdu ? 'تمام 30 روزے' : 'All 30 Days'}
              </button>
              <button
                onClick={() => setSelectedAshra(1)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAshra === 1
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {isUrdu ? '1 تا 10: رحمت' : '1st: Mercy (1-10)'}
              </button>
              <button
                onClick={() => setSelectedAshra(2)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAshra === 2
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {isUrdu ? '11 تا 20: مغفرت' : '2nd: Forgiveness (11-20)'}
              </button>
              <button
                onClick={() => setSelectedAshra(3)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAshra === 3
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {isUrdu ? '21 تا 30: نجات و شب قدر' : '3rd: Deliverance (21-30)'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400">
              {isUrdu ? 'تراویح:' : 'Taraweeh:'}{' '}
              <strong className="text-amber-300 font-mono">08:00 PM</strong> (20 رکعات ختمِ قرآن)
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-emerald-400 font-semibold">
              {isUrdu ? 'سحر و افطار سائرن فعال ہے' : 'Siren Audio Alerts Active'}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* MASNOON RAMADAN DUAS CARD */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950/80 via-stone-900 to-teal-950/80 border border-emerald-700/50 p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  {isUrdu ? 'رمضان المبارک کی مسنون دعائیں' : 'Masnoon Ramadan Supplications (Duas)'}
                </h4>
              </div>

              {/* Dua tabs */}
              <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
                <button
                  onClick={() => setSelectedDuaTab('iftar')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    selectedDuaTab === 'iftar'
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {isUrdu ? 'افطار کی دعا' : 'Iftar Dua'}
                </button>
                <button
                  onClick={() => setSelectedDuaTab('sehri')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    selectedDuaTab === 'sehri'
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {isUrdu ? 'سحری نیت' : 'Sehri Niyyat'}
                </button>
                <button
                  onClick={() => setSelectedDuaTab('ashra')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    selectedDuaTab === 'ashra'
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {isUrdu ? 'تینوں عشروں کی دعائیں' : 'Ashra Duas'}
                </button>
                <button
                  onClick={() => setSelectedDuaTab('qadr')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    selectedDuaTab === 'qadr'
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {isUrdu ? 'شبِ قدر دعا' : 'Laylatul Qadr'}
                </button>
              </div>
            </div>

            {/* Selected Dua Display */}
            {selectedDuaTab === 'iftar' && (
              <div className="text-center py-2 space-y-2">
                <span className="text-xs text-amber-400 font-semibold block uppercase">
                  {RAMADAN_DUAS.iftarDua.titleUr}
                </span>
                <p className="text-xl sm:text-2xl font-arabic font-bold text-amber-300 leading-relaxed">
                  {RAMADAN_DUAS.iftarDua.arabic}
                </p>
                <p className="text-xs text-stone-300 max-w-2xl mx-auto italic">
                  "{RAMADAN_DUAS.iftarDua.translationUr}"
                </p>
                <p className="text-[11px] text-stone-400 font-mono">
                  {RAMADAN_DUAS.iftarDua.reference}
                </p>
              </div>
            )}

            {selectedDuaTab === 'sehri' && (
              <div className="text-center py-2 space-y-2">
                <span className="text-xs text-amber-400 font-semibold block uppercase">
                  {RAMADAN_DUAS.sehriNiyyat.titleUr}
                </span>
                <p className="text-xl sm:text-2xl font-arabic font-bold text-amber-300 leading-relaxed">
                  {RAMADAN_DUAS.sehriNiyyat.arabic}
                </p>
                <p className="text-xs text-stone-300 max-w-2xl mx-auto italic">
                  "{RAMADAN_DUAS.sehriNiyyat.translationUr}"
                </p>
                <p className="text-[11px] text-stone-400 font-mono">
                  {RAMADAN_DUAS.sehriNiyyat.reference}
                </p>
              </div>
            )}

            {selectedDuaTab === 'ashra' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-center">
                <div className="p-3 rounded-xl bg-stone-950/70 border border-sky-800/50">
                  <span className="text-xs text-sky-300 font-bold block mb-1">
                    {RAMADAN_DUAS.ashra1.titleUr}
                  </span>
                  <p className="text-base font-arabic font-bold text-white mb-1">
                    {RAMADAN_DUAS.ashra1.arabic}
                  </p>
                  <p className="text-[11px] text-stone-300 line-clamp-2">
                    {RAMADAN_DUAS.ashra1.translationUr}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-stone-950/70 border border-amber-800/50">
                  <span className="text-xs text-amber-300 font-bold block mb-1">
                    {RAMADAN_DUAS.ashra2.titleUr}
                  </span>
                  <p className="text-base font-arabic font-bold text-white mb-1">
                    {RAMADAN_DUAS.ashra2.arabic}
                  </p>
                  <p className="text-[11px] text-stone-300 line-clamp-2">
                    {RAMADAN_DUAS.ashra2.translationUr}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-stone-950/70 border border-emerald-800/50">
                  <span className="text-xs text-emerald-300 font-bold block mb-1">
                    {RAMADAN_DUAS.ashra3.titleUr}
                  </span>
                  <p className="text-base font-arabic font-bold text-white mb-1">
                    {RAMADAN_DUAS.ashra3.arabic}
                  </p>
                  <p className="text-[11px] text-stone-300 line-clamp-2">
                    {RAMADAN_DUAS.ashra3.translationUr}
                  </p>
                </div>
              </div>
            )}

            {selectedDuaTab === 'qadr' && (
              <div className="text-center py-2 space-y-2">
                <span className="text-xs text-amber-400 font-semibold block uppercase">
                  {RAMADAN_DUAS.laylatulQadr.titleUr}
                </span>
                <p className="text-xl sm:text-2xl font-arabic font-bold text-amber-300 leading-relaxed">
                  {RAMADAN_DUAS.laylatulQadr.arabic}
                </p>
                <p className="text-xs text-stone-300 max-w-2xl mx-auto italic">
                  "{RAMADAN_DUAS.laylatulQadr.translationUr}"
                </p>
                <p className="text-[11px] text-stone-400 font-mono">
                  {RAMADAN_DUAS.laylatulQadr.reference}
                </p>
              </div>
            )}
          </div>

          {/* COMPLETE 30 DAYS RAMADAN TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-stone-800 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-950 text-stone-300 border-b border-stone-800 text-center">
                  <th className="p-3 font-bold text-stone-200">
                    {isUrdu ? 'روزہ #' : 'Roza #'}
                  </th>
                  <th className="p-3 font-bold text-stone-200">
                    {isUrdu ? 'تاریخ و دن' : 'Date & Day'}
                  </th>
                  <th className="p-3 font-bold text-stone-200">
                    {isUrdu ? 'ہجری تاریخ' : 'Hijri Date'}
                  </th>
                  <th className="p-3 font-bold text-amber-300 bg-amber-950/40">
                    {isUrdu ? 'اختتام سحری' : 'Sehri Ends'}
                  </th>
                  <th className="p-3 font-bold text-sky-300">
                    {isUrdu ? 'فجر اذان / جماعت' : 'Fajr (Azan/Jamaat)'}
                  </th>
                  <th className="p-3 font-bold text-yellow-400">
                    {isUrdu ? 'طلوع آفتاب' : 'Sunrise'}
                  </th>
                  <th className="p-3 font-bold text-teal-300">
                    {isUrdu ? 'چاشت' : 'Chasht'}
                  </th>
                  <th className="p-3 font-bold text-rose-400/90">
                    {isUrdu ? 'زوال (مکروہ)' : 'Zawal (Makruh)'}
                  </th>
                  <th className="p-3 font-bold text-emerald-300">
                    {isUrdu ? 'ظہر' : 'Dhuhr'}
                  </th>
                  <th className="p-3 font-bold text-orange-300">
                    {isUrdu ? 'عصر (حنفی)' : 'Asr (Hanafi)'}
                  </th>
                  <th className="p-3 font-bold text-amber-400 bg-rose-950/40">
                    {isUrdu ? 'وقتِ افطار' : 'Iftar Time'}
                  </th>
                  <th className="p-3 font-bold text-blue-300">
                    {isUrdu ? 'عشاء و تراویح' : 'Isha & Taraweeh'}
                  </th>
                  <th className="p-3 font-bold text-stone-400">
                    {isUrdu ? 'ڈیمو میں دیکھیں' : 'Demo Mode'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 font-mono text-center">
                {filteredDays.map((row) => {
                  const isSpecialNight = row.isLaylatulQadrCandidate;
                  const isAshraStart = row.rozaNo === 1 || row.rozaNo === 11 || row.rozaNo === 21;

                  return (
                    <tr
                      key={row.rozaNo}
                      className={`hover:bg-emerald-950/40 transition-colors ${
                        isSpecialNight
                          ? 'bg-amber-950/25 border-l-4 border-l-amber-400'
                          : row.rozaNo % 2 === 0
                          ? 'bg-stone-900/50'
                          : 'bg-stone-900/20'
                      }`}
                    >
                      {/* Roza Number */}
                      <td className="p-3 font-bold text-white">
                        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-900/80 text-amber-300 border border-emerald-600/60 font-mono text-xs">
                          {row.rozaNo}
                        </div>
                      </td>

                      {/* Gregorian Date */}
                      <td className="p-3 font-sans text-stone-200 whitespace-nowrap">
                        <span className="font-semibold">{row.dateGregorian}</span>
                        <span className="text-[11px] text-stone-400 block font-normal">
                          {isUrdu ? row.dayNameUr : row.dayNameEn}
                        </span>
                      </td>

                      {/* Hijri Date */}
                      <td className="p-3 font-arabic text-amber-200 text-xs whitespace-nowrap">
                        {row.hijriDateUr}
                        {isSpecialNight && (
                          <span className="inline-block ml-1 text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/40 font-sans">
                            ⭐ شب قدر
                          </span>
                        )}
                      </td>

                      {/* Sehri End */}
                      <td className="p-3 text-amber-300 font-bold bg-amber-950/20 whitespace-nowrap">
                        {row.sehriEnd}
                      </td>

                      {/* Fajr */}
                      <td className="p-3 text-sky-200 whitespace-nowrap">
                        {row.fajrAzan} / <span className="font-bold text-white">{row.fajrJamaat}</span>
                      </td>

                      {/* Sunrise */}
                      <td className="p-3 text-yellow-300/80 whitespace-nowrap">
                        {row.sunrise}
                      </td>

                      {/* Chasht */}
                      <td className="p-3 text-teal-300 text-[11px] whitespace-nowrap">
                        {row.chashtTime}
                      </td>

                      {/* Zawal */}
                      <td className="p-3 text-rose-300 text-[11px] whitespace-nowrap">
                        {row.zawalTime}
                      </td>

                      {/* Dhuhr */}
                      <td className="p-3 text-emerald-200 whitespace-nowrap">
                        {row.dhuhrJamaat}
                      </td>

                      {/* Asr */}
                      <td className="p-3 text-orange-200 whitespace-nowrap">
                        {row.asrJamaat}
                      </td>

                      {/* Iftar Time */}
                      <td className="p-3 text-amber-300 font-black text-sm bg-rose-950/20 whitespace-nowrap">
                        {row.iftarTime}
                      </td>

                      {/* Isha & Taraweeh */}
                      <td className="p-3 text-blue-200 whitespace-nowrap">
                        {row.taraweehJamaat}
                      </td>

                      {/* Select in Demo Mode button */}
                      <td className="p-3 font-sans">
                        <button
                          onClick={() => {
                            if (onSelectRozaDemo) {
                              onSelectRozaDemo(row.rozaNo);
                              onClose();
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 hover:text-white text-[11px] font-semibold transition-all whitespace-nowrap"
                          title="Apply this Roza day timings in Ramadan Demo Mode"
                        >
                          {isUrdu ? 'ڈیمو دیکھیں' : 'Test Demo'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legal / Islamic Authority Certification Strip */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between flex-wrap gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-stone-200 font-semibold">
                  {isUrdu
                    ? 'اوقاتِ کار جامعہ علوم اسلامیہ بنوری ٹاؤن و دارالعلوم کراچی کے حنفی معیارات کے مطابق تصدیق شدہ ہیں۔'
                    : 'Timetable strictly verified according to Jamia Uloom-ul-Islamia Allama Banuri Town & Darul Uloom Karachi Hanafi standards.'}
                </p>
                <p className="text-stone-400 text-[11px]">
                  جامع مسجد عثمانِ غنی (رضی اللہ عنہ)، ST-11، سیکٹر 5-اے/1، نارتھ کراچی • واٹس ایپ رابطہ: 03233469424
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition-all shadow-md flex items-center gap-2 text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>{isUrdu ? 'پرنٹ نکالیں' : 'Print Timetable'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-between items-center text-xs">
          <span className="text-stone-400">
            {isUrdu ? 'ماہِ رمضان المبارک 1448ھ بمطابق 2027ء' : 'Ramadan 1448 AH / 2027 CE Timetable'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition-colors"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
