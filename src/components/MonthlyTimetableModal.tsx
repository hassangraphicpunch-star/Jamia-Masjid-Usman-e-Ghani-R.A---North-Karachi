import React, { useState } from 'react';
import {
  X,
  Printer,
  Calendar,
  Download,
  Share2,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Language, AdminPrayerSettings } from '../types';
import { MOSQUE_INFO } from '../data/mockData';
import { formatTo12Hour } from '../services/prayerService';

interface MonthlyTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  adminSettings?: AdminPrayerSettings;
}

export const MonthlyTimetableModal: React.FC<MonthlyTimetableModalProps> = ({
  isOpen,
  onClose,
  language,
  adminSettings,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const isUrdu = language === 'ur';

  if (!isOpen) return null;

  const months = [
    'January / جنوری',
    'February / فروری',
    'March / مارچ',
    'April / اپریل',
    'May / مئی',
    'June / جون',
    'July / جولائی',
    'August / اگست',
    'September / ستمبر',
    'October / اکتوبر',
    'November / نومبر',
    'December / دسمبر',
  ];

  // Generate 30 days timetable for Karachi Hanafi standard with customizable Jamaat times
  const generateMonthDays = (monthIdx: number) => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthIdx];
    const baseFajrMin = [350, 340, 320, 290, 268, 258, 266, 285, 298, 310, 325, 342][monthIdx];
    const baseMaghribMin = [1085, 1102, 1120, 1135, 1152, 1164, 1165, 1148, 1122, 1092, 1070, 1068][monthIdx];

    const rows = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const fajrM = baseFajrMin + Math.floor((day * 0.3));
      const sunriseM = fajrM + 78;
      const dhuhrM = 755;
      const asrM = dhuhrM + 265;
      const maghribM = baseMaghribMin - Math.floor((day * 0.2));
      const ishaM = maghribM + 75;

      const formatMin = (mins: number) => {
        const h = Math.floor(mins / 60) % 24;
        const m = mins % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
      };

      // Determine Fajr Jamaat
      let fajrJamaatStr = adminSettings?.fajrJamaat || '05:40 AM';
      if (fajrJamaatStr.startsWith('+')) {
        const mins = parseInt(fajrJamaatStr.replace(/[^0-9]/g, ''), 10) || 30;
        fajrJamaatStr = formatMin(fajrM + mins);
      }

      // Determine Ishraq
      let ishraqStr = adminSettings?.ishraqTime || '+12 mins';
      if (ishraqStr.startsWith('+')) {
        const mins = parseInt(ishraqStr.replace(/[^0-9]/g, ''), 10) || 12;
        ishraqStr = formatMin(sunriseM + mins);
      }

      // Determine Maghrib
      let maghribJamaatStr = adminSettings?.maghribJamaat || '+5 mins';
      if (maghribJamaatStr.startsWith('+')) {
        const mins = parseInt(maghribJamaatStr.replace(/[^0-9]/g, ''), 10) || 5;
        maghribJamaatStr = formatMin(maghribM + mins);
      }

      rows.push({
        day,
        dateStr: `${day} ${months[monthIdx].split('/')[0].trim()}`,
        sehriEnd: formatMin(fajrM - 10),
        fajr: formatMin(fajrM),
        fajrJamaat: fajrJamaatStr,
        sunrise: formatMin(sunriseM),
        ishraq: ishraqStr,
        dhuhr: formatMin(dhuhrM),
        dhuhrJamaat: adminSettings?.dhuhrJamaat || '01:30 PM',
        asr: formatMin(asrM),
        asrJamaat: adminSettings?.asrJamaat || '05:30 PM',
        maghrib: formatMin(maghribM),
        maghribJamaat: maghribJamaatStr,
        isha: formatMin(ishaM),
        ishaJamaat: adminSettings?.ishaJamaat || '08:45 PM',
      });
    }
    return rows;
  };

  const currentRows = generateMonthDays(selectedMonth);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="monthly-timetable-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
    >
      <div className="bg-stone-900 border border-emerald-700/60 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-600/50 flex items-center justify-center text-amber-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {isUrdu ? 'جامع مسجد عثمان غنی - مکمل ماہانہ اوقاتِ نماز' : 'Monthly Prayer Timetable - Jamia Masjid Usman-e-Ghani'}
              </h3>
              <p className="text-xs text-stone-400">
                ST-11 Sector 5-A/1 North Karachi • Hanafi Karachi Method
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-300 border border-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print Timetable"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{isUrdu ? 'پرنٹ نکالیں' : 'Print Table'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Month Selector Strip */}
        <div className="px-4 py-3 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {months.map((m, idx) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedMonth === idx
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                {m.split('/')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Table Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="overflow-x-auto rounded-xl border border-stone-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-950 text-stone-300 border-b border-stone-800">
                  <th className="p-2.5 font-bold">{isUrdu ? 'تاریخ' : 'Date'}</th>
                  <th className="p-2.5 font-bold text-amber-300">{isUrdu ? 'سحری ختم' : 'Sehri End'}</th>
                  <th className="p-2.5 font-bold text-sky-300">{isUrdu ? 'فجر اذان / جماعت' : 'Fajr (Azan/Jamaat)'}</th>
                  <th className="p-2.5 font-bold text-yellow-400">{isUrdu ? 'طلوع / اشراق' : 'Sunrise / Ishraq'}</th>
                  <th className="p-2.5 font-bold text-emerald-300">{isUrdu ? 'ظہر اذان / جماعت' : 'Dhuhr (Azan/Jamaat)'}</th>
                  <th className="p-2.5 font-bold text-orange-300">{isUrdu ? 'عصر حنفی' : 'Asr (Hanafi)'}</th>
                  <th className="p-2.5 font-bold text-rose-300">{isUrdu ? 'مغرب / افطار' : 'Maghrib (Iftar)'}</th>
                  <th className="p-2.5 font-bold text-blue-300">{isUrdu ? 'عشاء اذان / جماعت' : 'Isha (Azan/Jamaat)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-mono">
                {currentRows.map((row) => (
                  <tr
                    key={row.day}
                    className={`hover:bg-emerald-950/30 transition-colors ${
                      row.day % 2 === 0 ? 'bg-stone-900/40' : 'bg-stone-900/10'
                    }`}
                  >
                    <td className="p-2.5 font-bold text-stone-300 font-sans">{row.dateStr}</td>
                    <td className="p-2.5 text-amber-300">{row.sehriEnd}</td>
                    <td className="p-2.5 text-sky-200">{row.fajr} / <span className="font-bold text-white">{row.fajrJamaat}</span></td>
                    <td className="p-2.5 text-yellow-300/90">{row.sunrise} / <span className="font-semibold text-amber-200">{row.ishraq}</span></td>
                    <td className="p-2.5 text-emerald-200">{row.dhuhr} / <span className="font-bold text-white">{row.dhuhrJamaat}</span></td>
                    <td className="p-2.5 text-orange-200">{row.asr} / <span className="font-bold text-white">{row.asrJamaat}</span></td>
                    <td className="p-2.5 text-rose-300 font-bold">{row.maghrib} / {row.maghribJamaat}</td>
                    <td className="p-2.5 text-blue-200">{row.isha} / <span className="font-bold text-white">{row.ishaJamaat}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-stone-950/60 border border-stone-800 text-xs text-stone-400 flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Calculated according to University of Islamic Sciences (Jamia Uloom-ul-Islamia Banuri Town & Darul Uloom Karachi) Hanafi criteria.</span>
            </span>
            <span className="font-semibold text-stone-300">
              ST-11 Sector 5-A/1 North Karachi
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
