import React, { useState, useMemo } from 'react';
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
  FileSpreadsheet,
  FileText,
  ArrowDownToLine,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Language, AdminPrayerSettings } from '../types';
import { MOSQUE_INFO } from '../data/mockData';
import {
  RAMADAN_2027_CALENDAR,
  RAMADAN_DUAS,
  RAMADAN_LOCATIONS,
  RamadanDaySchedule,
  adjustTimeByMinutes,
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
  const [selectedAshra, setSelectedAshra] = useState<0 | 1 | 2 | 3 | 4>(0); // 0=all, 1=1st, 2=2nd, 3=3rd, 4=Qadr nights
  const [selectedLocationId, setSelectedLocationId] = useState<string>('north_karachi');
  const [searchRozaQuery, setSearchRozaQuery] = useState<string>('');
  const [selectedDuaTab, setSelectedDuaTab] = useState<'sehri' | 'iftar' | 'ashra' | 'qadr'>('iftar');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'table' | 'cards'>('table');

  const isUrdu = language === 'ur';

  // Get active location config
  const activeLocation = useMemo(() => {
    return RAMADAN_LOCATIONS.find((loc) => loc.id === selectedLocationId) || RAMADAN_LOCATIONS[0];
  }, [selectedLocationId]);

  // Apply location offsets to day timings if needed
  const processedCalendar = useMemo(() => {
    const offset = activeLocation.offsetMinutes;
    return RAMADAN_2027_CALENDAR.map((day) => {
      const sunriseTime = offset === 0 ? day.sunrise : adjustTimeByMinutes(day.sunrise, offset);
      // Ishraq is 12 mins after sunrise
      const ishraqTime = adjustTimeByMinutes(sunriseTime, 12);
      const isFriday = day.dayNameEn === 'Friday';

      return {
        ...day,
        sehriEnd: offset === 0 ? day.sehriEnd : adjustTimeByMinutes(day.sehriEnd, offset),
        fajrAzan: offset === 0 ? day.fajrAzan : adjustTimeByMinutes(day.fajrAzan, offset),
        fajrJamaat: offset === 0 ? day.fajrJamaat : adjustTimeByMinutes(day.fajrJamaat, offset),
        sunrise: sunriseTime,
        ishraqTime,
        dhuhrAzan: offset === 0 ? day.dhuhrAzan : adjustTimeByMinutes(day.dhuhrAzan, offset),
        dhuhrJamaat: isFriday ? (adminSettings?.jummaJamaat || '01:50 PM') : (adminSettings?.dhuhrJamaat || day.dhuhrJamaat),
        asrAzan: offset === 0 ? day.asrAzan : adjustTimeByMinutes(day.asrAzan, offset),
        asrJamaat: adminSettings?.asrJamaat || day.asrJamaat,
        iftarTime: offset === 0 ? day.iftarTime : adjustTimeByMinutes(day.iftarTime, offset),
        maghribJamaat: offset === 0 ? day.maghribJamaat : adjustTimeByMinutes(day.maghribJamaat, offset),
        ishaAzan: offset === 0 ? day.ishaAzan : adjustTimeByMinutes(day.ishaAzan, offset),
        taraweehJamaat: day.taraweehJamaat,
        isFriday,
      };
    });
  }, [activeLocation, adminSettings]);

  // Filtered rows by ashra and search query
  const filteredDays = useMemo(() => {
    let list = processedCalendar;

    if (selectedAshra === 1) {
      list = list.filter((d) => d.ashra === 1);
    } else if (selectedAshra === 2) {
      list = list.filter((d) => d.ashra === 2);
    } else if (selectedAshra === 3) {
      list = list.filter((d) => d.ashra === 3);
    } else if (selectedAshra === 4) {
      list = list.filter((d) => d.isLaylatulQadrCandidate);
    }

    if (searchRozaQuery.trim()) {
      const q = searchRozaQuery.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.rozaNo.toString() === q ||
          d.dateGregorian.toLowerCase().includes(q) ||
          d.dayNameEn.toLowerCase().includes(q) ||
          d.dayNameUr.includes(q) ||
          d.hijriDateUr.includes(q)
      );
    }

    return list;
  }, [processedCalendar, selectedAshra, searchRozaQuery]);

  if (!isOpen) return null;

  // Generic File Downloader
  const triggerBrowserDownload = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(filename);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  // 1. Download CSV for Microsoft Excel / Google Sheets
  const handleDownloadCSV = () => {
    const headers = [
      'Roza # (روزہ)',
      'Date (عیسوی تاریخ)',
      'Day (دن)',
      'Hijri Date (ہجری تاریخ)',
      'Ashra (عشرہ)',
      'Sehri End (اختتام سحری)',
      'Fajr Azan (فجر اذان)',
      'Fajr Jamaat (فجر جماعت)',
      'Sunrise (طلوع آفتاب)',
      'Ishraq (اشراق)',
      'Chasht (چاشت)',
      'Zawal Makruh (وقت زوال)',
      'Dhuhr Azan (ظہر اذان)',
      'Dhuhr/Jumma Jamaat (ظہر/جمعہ جماعت)',
      'Asr Azan (عصر اذان)',
      'Asr Jamaat Hanafi (عصر جماعت حنفی)',
      'Iftar Time (وقت افطار / غروب)',
      'Maghrib Jamaat (مغرب جماعت)',
      'Isha Azan (عشاء اذان)',
      'Taraweeh 20 Rakat (نمازِ تراویح)',
      'Special Note (خصوصی فضیلت)',
    ];

    const rows = processedCalendar.map((d) => [
      d.rozaNo,
      `"${d.dateGregorian}"`,
      `"${d.dayNameUr} (${d.dayNameEn})"`,
      `"${d.hijriDateUr}"`,
      `"${d.ashraNameUr}"`,
      `"${d.sehriEnd}"`,
      `"${d.fajrAzan}"`,
      `"${d.fajrJamaat}"`,
      `"${d.sunrise}"`,
      `"${d.ishraqTime}"`,
      `"${d.chashtTime}"`,
      `"${d.zawalTime}"`,
      `"${d.dhuhrAzan}"`,
      `"${d.dhuhrJamaat}${d.isFriday ? ' (نماز جمعہ)' : ''}"`,
      `"${d.asrAzan}"`,
      `"${d.asrJamaat}"`,
      `"${d.iftarTime}"`,
      `"${d.maghribJamaat}"`,
      `"${d.ishaAzan}"`,
      `"${d.taraweehJamaat} (20 رکعات ختم قرآن)"`,
      `"${d.isLaylatulQadrCandidate ? 'شبِ قدر کی ممکنہ طاق رات' : ''}"`,
    ]);

    // Prepend UTF-8 BOM so Excel natively recognizes Urdu and Arabic script
    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    triggerBrowserDownload(
      `Taqweem_Ramadan_1448_Jamia_Masjid_Usman_Ghani.csv`,
      csvContent,
      'text/csv;charset=utf-8;'
    );
  };

  // 2. Download Standalone Offline Printable HTML
  const handleDownloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تقویمِ رمضان المبارک 1448ھ - جامع مسجد عثمان غنی (رضی اللہ عنہ)</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #111; margin: 20px; direction: rtl; text-align: right; }
    .header { text-align: center; border-bottom: 3px double #047857; padding-bottom: 15px; margin-bottom: 15px; }
    .title { font-size: 24px; font-weight: bold; color: #064e3b; margin: 5px 0; }
    .subtitle { font-size: 14px; color: #4b5563; }
    .duas { display: flex; justify-content: space-around; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 10px; margin-bottom: 15px; font-size: 12px; }
    .dua-box { text-align: center; max-width: 45%; }
    .arabic { font-size: 16px; font-weight: bold; color: #047857; margin: 4px 0; direction: rtl; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; text-align: center; }
    th { background: #064e3b; color: white; border: 1px solid #064e3b; padding: 6px 3px; font-weight: bold; }
    td { border: 1px solid #d1d5db; padding: 5px 3px; }
    tr:nth-child(even) { background-color: #f9fafb; }
    .roza-no { font-weight: bold; background: #ecfdf5; color: #064e3b; }
    .sehri { font-weight: bold; color: #b45309; background: #fffbeb; }
    .iftar { font-weight: bold; color: #047857; background: #ecfdf5; font-size: 12px; }
    .friday { background: #fef3c7 !important; font-weight: bold; }
    .qadr { background: #fef9c3 !important; }
    .footer { margin-top: 15px; text-align: center; font-size: 11px; color: #4b5563; border-top: 1px solid #e5e7eb; padding-top: 10px; }
    @media print {
      body { margin: 5mm; }
      @page { size: A4 landscape; margin: 8mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size: 16px; color: #047857; font-weight: bold;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
    <div class="title">تقویمِ رمضان المبارک 1448ھ / 2027ء (مکمل ۳۰ یومیہ اوقاتِ نماز)</div>
    <div class="subtitle"><strong>جامع مسجد عثمانِ غنی (رضی اللہ عنہ)</strong> - ST-11، سیکٹر 5-اے/1، نارتھ کراچی • رابطہ: 03233469424</div>
    <div style="font-size: 11px; color: #059669; margin-top: 4px;">مستند حنفی اوقات بمطابق جامعہ علوم اسلامیہ علامہ بنوری ٹاؤن و دارالعلوم کراچی</div>
  </div>

  <div class="duas">
    <div class="dua-box">
      <strong>روزہ رکھنے کی نیت (سحری):</strong>
      <div class="arabic">وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ</div>
      <div>اور میں نے ماہِ رمضان کے کل کے روزے کی نیت کی۔</div>
    </div>
    <div class="dua-box">
      <strong>افطار کرنے کی دعا:</strong>
      <div class="arabic">اللَّهُمَّ إِنِّي لَكَ صُمْتُ، وَبِكَ آمَنْتُ، وَعَلَيْكَ تَوَكَّلْتُ، وَعَلَىٰ رِزْقِكَ أَفْطَرْتُ</div>
      <div>اے اللہ! میں نے تیرے ہی لیے روزہ رکھا اور تیرے ہی دیے ہوئے رزق سے افطار کیا۔</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>روزہ #</th>
        <th>عیسوی تاریخ</th>
        <th>دن</th>
        <th>ہجری</th>
        <th>اختتام سحری</th>
        <th>فجر اذان</th>
        <th>فجر جماعت</th>
        <th>طلوع آفتاب</th>
        <th>اشراق</th>
        <th>چاشت</th>
        <th>وقت زوال</th>
        <th>ظہر اذان</th>
        <th>ظہر / جمعہ</th>
        <th>عصر اذان</th>
        <th>عصر جماعت</th>
        <th>وقتِ افطار</th>
        <th>مغرب جماعت</th>
        <th>عشاء اذان</th>
        <th>تراویح (۲۰ رکعات)</th>
      </tr>
    </thead>
    <tbody>
      ${processedCalendar
        .map(
          (d) => `
        <tr class="${d.isFriday ? 'friday' : ''} ${d.isLaylatulQadrCandidate ? 'qadr' : ''}">
          <td class="roza-no">${d.rozaNo}</td>
          <td>${d.dateGregorian}</td>
          <td>${d.dayNameUr}</td>
          <td>${d.hijriDateUr}</td>
          <td class="sehri">${d.sehriEnd}</td>
          <td>${d.fajrAzan}</td>
          <td><strong>${d.fajrJamaat}</strong></td>
          <td>${d.sunrise}</td>
          <td>${d.ishraqTime}</td>
          <td>${d.chashtTime}</td>
          <td>${d.zawalTime}</td>
          <td>${d.dhuhrAzan}</td>
          <td><strong>${d.dhuhrJamaat}</strong></td>
          <td>${d.asrAzan}</td>
          <td><strong>${d.asrJamaat}</strong></td>
          <td class="iftar">${d.iftarTime}</td>
          <td><strong>${d.maghribJamaat}</strong></td>
          <td>${d.ishaAzan}</td>
          <td><strong>${d.taraweehJamaat}</strong></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    نوٹ: نمازِ تراویح روزانہ رات 08:00 بجے ۲۰ رکعات باجماعت مع ختمِ قرآن مجید شروع ہوگی۔ • 
    سحر و افطار کے وقت مسجد سے سائرن بجایا جاتا ہے۔ • 
    جامع مسجد عثمان غنی (رضی اللہ عنہ) نارتھ کراچی
  </div>
</body>
</html>`;

    triggerBrowserDownload(
      `Taqweem_e_Ramadan_1448_Usman_Ghani.html`,
      htmlContent,
      'text/html;charset=utf-8;'
    );
  };

  // 3. Download Formatted Plain Text
  const handleDownloadText = () => {
    let txt = `========================================================================\n`;
    txt += `  تقویمِ رمضان المبارک 1448ھ / 2027ء - جامع مسجد عثمان غنی (رضی اللہ عنہ)\n`;
    txt += `  ST-11 Sector 5-A/1 North Karachi • رابطہ: 03233469424\n`;
    txt += `  مستند حنفی اوقات - جامعہ بنوری ٹاؤن و دارالعلوم کراچی\n`;
    txt += `========================================================================\n\n`;
    txt += `دعائے سحری: وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ\n`;
    txt += `دعائے افطار: اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَىٰ رِزْقِكَ أَفْطَرْتُ\n\n`;
    txt += `تراویح: روزانہ رات 08:00 بجے (۲۰ رکعات باجماعت ختمِ قرآن مجید)\n\n`;
    txt += `------------------------------------------------------------------------------------------------------------------------\n`;
    txt += `روزہ | تاریخ      | دن   | ہجری    | سحر ختم | فجر جمع | اشراق   | ظہر جمع | عصر جمع | افطار    | مغرب جمع | تراویح \n`;
    txt += `------------------------------------------------------------------------------------------------------------------------\n`;

    processedCalendar.forEach((d) => {
      const rozaStr = d.rozaNo.toString().padEnd(4, ' ');
      const dateStr = d.dateGregorian.padEnd(11, ' ');
      const dayStr = d.dayNameUr.padEnd(5, ' ');
      const hijriStr = d.hijriDateUr.padEnd(9, ' ');
      txt += `${rozaStr} | ${dateStr} | ${dayStr} | ${hijriStr} | ${d.sehriEnd} | ${d.fajrJamaat} | ${d.ishraqTime} | ${d.dhuhrJamaat} | ${d.asrJamaat} | ${d.iftarTime} | ${d.maghribJamaat} | ${d.taraweehJamaat}\n`;
    });

    txt += `------------------------------------------------------------------------------------------------------------------------\n`;
    txt += `جمعہ مبارک: اذان اول 12:50 PM | درس و بیان 01:10 PM | اذان ثانی 01:40 PM | خطبہ 01:45 PM | جماعت جمعہ 01:50 PM\n`;

    triggerBrowserDownload(
      `Taqweem_Ramadan_1448_Text.txt`,
      txt,
      'text/plain;charset=utf-8;'
    );
  };

  // 4. Save as PDF / High Quality Print
  const handlePrint = () => {
    document.body.classList.add('printing-ramadan-calendar');
    window.print();
    const handleAfterPrint = () => {
      document.body.classList.remove('printing-ramadan-calendar');
      window.removeEventListener('afterprint', handleAfterPrint);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    setTimeout(() => {
      document.body.classList.remove('printing-ramadan-calendar');
    }, 2000);
  };

  // 5. Share via WhatsApp or Clipboard
  const handleShare = () => {
    const text = `🌙 تقویمِ رمضان المبارک 1448ھ (2027ء)\nجامع مسجد عثمانِ غنی (رضی اللہ عنہ) - نارتھ کراچی\n\nمکمل ۳۰ یومیہ سحری، افطار، تمام ۵ نمازیں، اور ۲۰ رکعات تراویح کا مستند شیڈول۔\nمقام: ST-11 سیکٹر 5-A/1 نارتھ کراچی\nرابطہ: 03233469424\n\nشیڈول آن لائن دیکھیں اور ڈاؤن لوڈ کریں:\n${window.location.href}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      id="ramadan-2027-calendar-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-1 sm:p-4"
    >
      <div
        id="ramadan-printable-area"
        className="bg-stone-900 border border-emerald-600/60 rounded-3xl w-full max-w-7xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 border-b border-emerald-700/50 flex items-center justify-between flex-wrap gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-950/80 shrink-0">
              <div className="w-full h-full rounded-[14px] bg-stone-950 flex items-center justify-center text-amber-300">
                <Moon className="w-6 h-6 fill-amber-300/30" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {isUrdu
                    ? 'تقویمِ رمضان المبارک ۱۴۴۸ھ / 2027ء (مکمل ۳۰ دن تمام نمازیں)'
                    : 'Ramadan 2027 (1448 AH) Complete Timetable & Prayers'}
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
                  {isUrdu ? 'ST-11 سیکٹر 5-اے/1 نارتھ کراچی' : 'ST-11 Sector 5-A/1 North Karachi'}
                </span>
                <span className="text-stone-500">•</span>
                <span className="text-amber-400 font-mono text-[11px]">
                  08 Feb 2027 - 09 Mar 2027
                </span>
              </p>
            </div>
          </div>

          {/* Quick Header Actions: Audio Siren, Share & Close */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => azanAudioEngine.playIftarSiren()}
              className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/60 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Test Authentic Ramadan Iftar Siren"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUrdu ? 'سائرن سنیں' : 'Ramadan Siren'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {copiedNotification ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'واٹس ایپ شیئر' : 'WhatsApp')}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE HEADER FOR PHYSICAL PRINTING / PDF SAVE ONLY */}
        <div className="hidden print-only p-4 text-center border-b border-black mb-4">
          <div className="text-sm font-bold text-emerald-800">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <h2 className="text-xl font-extrabold text-stone-900">
            تقویمِ رمضان المبارک 1448ھ / 2027ء - مکمل ۳۰ یومیہ اوقاتِ نماز
          </h2>
          <p className="text-xs text-stone-700">
            <strong>جامع مسجد عثمانِ غنی (رضی اللہ عنہ)</strong> - ST-11، سیکٹر 5-اے/1، نارتھ کراچی • رابطہ: 03233469424
          </p>
          <p className="text-[10px] text-stone-600">
            مستند حنفی اوقات بمطابق جامعہ علوم اسلامیہ علامہ بنوری ٹاؤن و دارالعلوم کراچی • تراویح: 20 رکعات ختم قرآن رات 08:00 بجے
          </p>
        </div>

        {/* DEDICATED DOWNLOAD HUB BAR */}
        <div className="px-4 py-3 bg-gradient-to-r from-amber-950/90 via-stone-900 to-emerald-950/90 border-b border-amber-600/40 flex items-center justify-between gap-3 flex-wrap no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ArrowDownToLine className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 block">
                {isUrdu ? 'ڈاؤن لوڈ سنٹر (مختلف فارمیٹس میں ڈاؤن لوڈ کریں):' : 'Download Timetable Hub (All Formats):'}
              </span>
              <span className="text-[11px] text-stone-400">
                {isUrdu ? 'پی ڈی ایف، پرنٹ، ایکسل شیٹ (CSV)، اور مکمل آف لائن فائل' : 'Save as PDF, Print, Excel (CSV), or Offline File'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            {/* Button: PDF / Print */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950 ring-1 ring-emerald-400"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>{isUrdu ? 'پی ڈی ایف / پرنٹ' : 'PDF / Print'}</span>
            </button>

            {/* Button: Excel CSV */}
            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-teal-100 border border-teal-500 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Download CSV spreadsheet for Excel & Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>{isUrdu ? 'ایکسل (CSV)' : 'Excel (CSV)'}</span>
            </button>

            {/* Button: Standalone HTML */}
            <button
              onClick={handleDownloadHTML}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Download Standalone Printable HTML Webpage"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUrdu ? 'آف لائن فائل' : 'Offline HTML'}</span>
            </button>

            {/* Button: Formatted Plain Text */}
            <button
              onClick={handleDownloadText}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Download formatted text file"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>{isUrdu ? 'ٹیکسٹ (.txt)' : 'Text (.txt)'}</span>
            </button>
          </div>
        </div>

        {/* NOTIFICATION TOAST WHEN DOWNLOAD OCCURS */}
        {downloadNotice && (
          <div className="px-4 py-2 bg-emerald-900/90 text-white text-xs font-semibold flex items-center justify-between border-b border-emerald-500 animate-in fade-in no-print">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>
                {isUrdu
                  ? `فائل "${downloadNotice}" کامیابی سے ڈاؤن لوڈ ہو گئی۔`
                  : `File "${downloadNotice}" downloaded successfully.`}
              </span>
            </span>
            <span className="text-[11px] text-emerald-200">
              {isUrdu ? 'اپنے ڈیوائس کے Downloads فولڈر میں چیک کریں۔' : 'Saved to your Downloads folder.'}
            </span>
          </div>
        )}

        {/* ASHRA FILTER TABS, LOCATION SELECTOR & SEARCH BAR */}
        <div className="px-4 py-3 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between gap-3 flex-wrap no-print">
          {/* Ashra tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-stone-400 hidden lg:inline">
              {isUrdu ? 'عشرہ منتخب کریں:' : 'Ashra Filter:'}
            </span>
            <div className="inline-flex rounded-xl bg-stone-900 p-1 border border-stone-800 flex-wrap gap-1">
              <button
                onClick={() => setSelectedAshra(0)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAshra === 0
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {isUrdu ? 'تمام ۳۰ روزے' : 'All 30 Days'}
              </button>
              <button
                onClick={() => setSelectedAshra(1)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAshra === 1
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {isUrdu ? 'عشرۂ رحمت (1 تا 10)' : '1st: Mercy (1-10)'}
              </button>
              <button
                onClick={() => setSelectedAshra(2)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAshra === 2
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {isUrdu ? 'عشرۂ مغفرت (11 تا 20)' : '2nd: Forgiveness (11-20)'}
              </button>
              <button
                onClick={() => setSelectedAshra(3)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAshra === 3
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {isUrdu ? 'عشرۂ نجات (21 تا 30)' : '3rd: Deliverance (21-30)'}
              </button>
              <button
                onClick={() => setSelectedAshra(4)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAshra === 4
                    ? 'bg-purple-700 text-white shadow-md'
                    : 'text-purple-300 hover:text-white bg-purple-950/40 border border-purple-800/60'
                }`}
              >
                ⭐ {isUrdu ? 'شبِ قدر کی طاق راتیں' : 'Odd Nights (Qadr)'}
              </button>
            </div>
          </div>

          {/* Location adjustment & Quick Search */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Roza */}
            <div className="relative">
              <input
                type="text"
                value={searchRozaQuery}
                onChange={(e) => setSearchRozaQuery(e.target.value)}
                placeholder={isUrdu ? 'روزہ یا تاریخ تلاش کریں...' : 'Search day...'}
                className="pl-7 pr-3 py-1 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs w-36 sm:w-44 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2 top-2" />
            </div>

            {/* Location selector */}
            <div className="flex items-center gap-1.5 bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-xs">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="bg-transparent text-stone-200 font-semibold text-xs focus:outline-none cursor-pointer"
              >
                {RAMADAN_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-stone-900 text-white">
                    {isUrdu ? loc.nameUr : loc.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* MAIN MODAL SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6">
          
          {/* MASNOON RAMADAN DUAS CARD */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950/80 via-stone-900 to-teal-950/80 border border-emerald-700/50 p-4 sm:p-5 shadow-lg no-print">
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
                  <p className="text-[11px] text-stone-300">
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
                  <p className="text-[11px] text-stone-300">
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
                  <p className="text-[11px] text-stone-300">
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

          {/* SUMMARY STATS STRIP: ALL 5 PRAYERS INCLUDED */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-center text-xs no-print">
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase font-semibold">
                {isUrdu ? 'سحری کا اختتام' : 'Sehri Ends'}
              </span>
              <span className="font-bold text-amber-400 font-mono text-sm">
                05:48 AM - 05:22 AM
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase font-semibold">
                {isUrdu ? 'فجر جماعت' : 'Fajr Jamaat'}
              </span>
              <span className="font-bold text-sky-300 font-mono text-sm">
                06:15 AM - 05:45 AM
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase font-semibold">
                {isUrdu ? 'ظہر جماعت' : 'Dhuhr Jamaat'}
              </span>
              <span className="font-bold text-emerald-300 font-mono text-sm">
                {adminSettings?.dhuhrJamaat || '01:30 PM'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase font-semibold">
                {isUrdu ? 'عصر جماعت (حنفی)' : 'Asr Jamaat'}
              </span>
              <span className="font-bold text-amber-300 font-mono text-sm">
                {adminSettings?.asrJamaat || '05:15 PM'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase font-semibold">
                {isUrdu ? 'وقتِ افطار' : 'Iftar Sunset'}
              </span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                06:22 PM - 06:38 PM
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase font-semibold">
                {isUrdu ? 'نمازِ تراویح' : 'Taraweeh'}
              </span>
              <span className="font-bold text-blue-300 font-mono text-sm">
                08:00 PM (20 رکعات)
              </span>
            </div>
          </div>

          {/* COMPLETE 30 DAYS RAMADAN TABLE: FULL SHOW TAMAM NAMAZ */}
          <div className="rounded-2xl border border-stone-800 shadow-2xl overflow-hidden bg-stone-950">
            <div className="p-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-200">
                  {isUrdu
                    ? `مکمل ۳۰ یومیہ جدول (${filteredDays.length} روزے ظاہر ہیں)`
                    : `Complete 30-Day Ramadan Timetable (${filteredDays.length} days shown)`}
                </span>
                {/* View Mode Toggle: Table vs Cards (Ideal for Mobile Devices) */}
                <div className="inline-flex rounded-lg bg-stone-950 p-0.5 border border-stone-800 text-xs">
                  <button
                    onClick={() => setDisplayMode('table')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      displayMode === 'table'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {isUrdu ? 'جدول (Table)' : 'Table'}
                  </button>
                  <button
                    onClick={() => setDisplayMode('cards')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      displayMode === 'cards'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {isUrdu ? 'کارڈز (Cards)' : 'Cards'}
                  </button>
                </div>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold hidden sm:inline">
                {isUrdu
                  ? 'تمام ۵ نمازیں، سحر و افطار، اشراق، زوال اور تراویح'
                  : 'All 5 Daily Prayers + Sehri, Iftar, Ishraq & Taraweeh'}
              </span>
            </div>

            {displayMode === 'table' ? (
              <div className="overflow-x-auto max-h-[58vh]">
                <table className="w-full text-center text-xs border-collapse font-sans">
                  <thead className="sticky top-0 bg-stone-950 z-10 text-stone-300 border-b border-stone-800 shadow">
                    <tr className="divide-x divide-stone-800 text-[11px]">
                      <th className="p-2.5 font-bold text-stone-200 bg-stone-900 sticky left-0 z-20 shadow-md">
                        {isUrdu ? 'روزہ #' : 'Roza #'}
                      </th>
                    <th className="p-2.5 font-bold text-stone-200 whitespace-nowrap bg-stone-900">
                      {isUrdu ? 'عیسوی تاریخ' : 'Gregorian'}
                    </th>
                    <th className="p-2.5 font-bold text-stone-200 whitespace-nowrap bg-stone-900">
                      {isUrdu ? 'دن' : 'Day'}
                    </th>
                    <th className="p-2.5 font-bold text-amber-200 whitespace-nowrap bg-stone-900">
                      {isUrdu ? 'ہجری' : 'Hijri'}
                    </th>
                    <th className="p-2.5 font-bold text-amber-300 bg-amber-950/60 whitespace-nowrap">
                      {isUrdu ? 'سحری ختم' : 'Sehri End'}
                    </th>
                    <th className="p-2.5 font-bold text-sky-300 whitespace-nowrap">
                      {isUrdu ? 'فجر اذان' : 'Fajr Azan'}
                    </th>
                    <th className="p-2.5 font-bold text-white bg-sky-950/40 whitespace-nowrap">
                      {isUrdu ? 'فجر جماعت' : 'Fajr Jamaat'}
                    </th>
                    <th className="p-2.5 font-bold text-yellow-300/90 whitespace-nowrap">
                      {isUrdu ? 'طلوع آفتاب' : 'Sunrise'}
                    </th>
                    <th className="p-2.5 font-bold text-teal-300 whitespace-nowrap">
                      {isUrdu ? 'اشراق' : 'Ishraq'}
                    </th>
                    <th className="p-2.5 font-bold text-rose-300/80 whitespace-nowrap">
                      {isUrdu ? 'زوال (مکروہ)' : 'Zawal'}
                    </th>
                    <th className="p-2.5 font-bold text-emerald-300 whitespace-nowrap">
                      {isUrdu ? 'ظہر اذان' : 'Dhuhr Azan'}
                    </th>
                    <th className="p-2.5 font-bold text-white bg-emerald-950/40 whitespace-nowrap">
                      {isUrdu ? 'ظہر / جمعہ جماعت' : 'Dhuhr/Jumma'}
                    </th>
                    <th className="p-2.5 font-bold text-orange-300 whitespace-nowrap">
                      {isUrdu ? 'عصر اذان' : 'Asr Azan'}
                    </th>
                    <th className="p-2.5 font-bold text-white bg-orange-950/40 whitespace-nowrap">
                      {isUrdu ? 'عصر جماعت (حنفی)' : 'Asr Jamaat'}
                    </th>
                    <th className="p-2.5 font-bold text-amber-300 bg-rose-950/60 whitespace-nowrap">
                      {isUrdu ? 'وقتِ افطار' : 'Iftar Time'}
                    </th>
                    <th className="p-2.5 font-bold text-white bg-emerald-950/60 whitespace-nowrap">
                      {isUrdu ? 'مغرب جماعت' : 'Maghrib Jamaat'}
                    </th>
                    <th className="p-2.5 font-bold text-blue-300 whitespace-nowrap">
                      {isUrdu ? 'عشاء اذان' : 'Isha Azan'}
                    </th>
                    <th className="p-2.5 font-bold text-white bg-blue-950/60 whitespace-nowrap">
                      {isUrdu ? 'تراویح (۲۰ رکعات)' : 'Taraweeh'}
                    </th>
                    <th className="p-2.5 font-bold text-stone-400 no-print">
                      {isUrdu ? 'ڈیمو' : 'Demo'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono text-[11px]">
                  {filteredDays.map((row) => {
                    const isSpecialNight = row.isLaylatulQadrCandidate;
                    const isFriday = row.isFriday;

                    return (
                      <tr
                        key={row.rozaNo}
                        className={`hover:bg-emerald-950/40 transition-colors ${
                          isFriday
                            ? 'bg-amber-950/30 font-semibold'
                            : isSpecialNight
                            ? 'bg-purple-950/30 border-l-4 border-l-purple-400'
                            : row.rozaNo % 2 === 0
                            ? 'bg-stone-900/40'
                            : 'bg-stone-900/10'
                        }`}
                      >
                        {/* Roza Number - Sticky on horizontal scroll */}
                        <td className="p-2.5 font-bold text-white sticky left-0 bg-stone-950 z-10 shadow-md">
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-900/80 text-amber-300 border border-emerald-600/60 font-mono text-[10px]">
                            {row.rozaNo}
                          </div>
                        </td>

                        {/* Gregorian Date */}
                        <td className="p-2.5 font-sans text-stone-200 whitespace-nowrap">
                          {row.dateGregorian}
                        </td>

                        {/* Day Name */}
                        <td className="p-2.5 font-sans whitespace-nowrap">
                          <span
                            className={
                              isFriday
                                ? 'px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                                : 'text-stone-300'
                            }
                          >
                            {isUrdu ? row.dayNameUr : row.dayNameEn}
                          </span>
                        </td>

                        {/* Hijri Date */}
                        <td className="p-2.5 font-arabic text-amber-200 text-xs whitespace-nowrap">
                          {row.hijriDateUr}
                          {isSpecialNight && (
                            <span className="inline-block ml-1 text-[9px] bg-purple-500/30 text-purple-200 px-1 rounded font-sans">
                              ⭐ قدر
                            </span>
                          )}
                        </td>

                        {/* Sehri End */}
                        <td className="p-2.5 text-amber-300 font-bold bg-amber-950/30 whitespace-nowrap">
                          {row.sehriEnd}
                        </td>

                        {/* Fajr Azan */}
                        <td className="p-2.5 text-sky-200 whitespace-nowrap">
                          {row.fajrAzan}
                        </td>

                        {/* Fajr Jamaat */}
                        <td className="p-2.5 text-white font-bold bg-sky-950/20 whitespace-nowrap">
                          {row.fajrJamaat}
                        </td>

                        {/* Sunrise */}
                        <td className="p-2.5 text-yellow-300/80 whitespace-nowrap">
                          {row.sunrise}
                        </td>

                        {/* Ishraq */}
                        <td className="p-2.5 text-teal-300 whitespace-nowrap">
                          {row.ishraqTime}
                        </td>

                        {/* Zawal */}
                        <td className="p-2.5 text-rose-300 text-[10px] whitespace-nowrap">
                          {row.zawalTime}
                        </td>

                        {/* Dhuhr Azan */}
                        <td className="p-2.5 text-emerald-200 whitespace-nowrap">
                          {row.dhuhrAzan}
                        </td>

                        {/* Dhuhr / Jumma Jamaat */}
                        <td className="p-2.5 text-white font-bold bg-emerald-950/20 whitespace-nowrap">
                          {row.dhuhrJamaat}
                          {isFriday && (
                            <span className="block text-[9px] text-amber-300 font-sans">
                              (جمعہ)
                            </span>
                          )}
                        </td>

                        {/* Asr Azan */}
                        <td className="p-2.5 text-orange-200 whitespace-nowrap">
                          {row.asrAzan}
                        </td>

                        {/* Asr Jamaat */}
                        <td className="p-2.5 text-white font-bold bg-orange-950/20 whitespace-nowrap">
                          {row.asrJamaat}
                        </td>

                        {/* Iftar Time */}
                        <td className="p-2.5 text-amber-300 font-black text-xs bg-rose-950/30 whitespace-nowrap">
                          {row.iftarTime}
                        </td>

                        {/* Maghrib Jamaat */}
                        <td className="p-2.5 text-emerald-300 font-bold bg-emerald-950/30 whitespace-nowrap">
                          {row.maghribJamaat}
                        </td>

                        {/* Isha Azan */}
                        <td className="p-2.5 text-blue-200 whitespace-nowrap">
                          {row.ishaAzan}
                        </td>

                        {/* Taraweeh Jamaat */}
                        <td className="p-2.5 text-white font-bold bg-blue-950/30 whitespace-nowrap">
                          {row.taraweehJamaat}
                          <span className="block text-[9px] text-blue-300 font-sans">
                            20 رکعات
                          </span>
                        </td>

                        {/* Select in Demo Mode button */}
                        <td className="p-2.5 font-sans no-print">
                          <button
                            onClick={() => {
                              if (onSelectRozaDemo) {
                                onSelectRozaDemo(row.rozaNo);
                                onClose();
                              }
                            }}
                            className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-[10px] font-semibold transition-all whitespace-nowrap"
                            title="Test this Roza in live demo"
                          >
                            {isUrdu ? 'ڈیمو' : 'Demo'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Mobile & Tablet Friendly Day Cards View */
            <div className="p-3 sm:p-4 max-h-[60vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDays.map((row) => {
                const isSpecialNight = row.isLaylatulQadrCandidate;
                const isFriday = row.isFriday;

                return (
                  <div
                    key={row.rozaNo}
                    className={`rounded-xl p-3.5 border transition-all ${
                      isFriday
                        ? 'bg-amber-950/40 border-amber-500/50 shadow-md'
                        : isSpecialNight
                        ? 'bg-purple-950/40 border-purple-500/50 shadow-md'
                        : 'bg-stone-900/80 border-stone-800 hover:border-emerald-700/60'
                    }`}
                  >
                    {/* Card Header: Roza #, Date, Day */}
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-stone-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-900/80 text-amber-300 border border-emerald-600/60 font-mono text-xs font-bold flex items-center justify-center">
                          {row.rozaNo}
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">
                            {isUrdu ? `روزہ ${row.rozaNo}` : `Roza #${row.rozaNo}`}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {row.dateGregorian} • {isUrdu ? row.dayNameUr : row.dayNameEn}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-arabic text-amber-300 font-bold block">
                          {row.hijriDateUr}
                        </span>
                        {isSpecialNight && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-200 border border-purple-600 font-semibold">
                            ⭐ شبِ قدر
                          </span>
                        )}
                        {isFriday && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200 border border-amber-600 font-semibold">
                            جمعہ مبارک
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Key Highlights: Sehri End & Iftar Time */}
                    <div className="grid grid-cols-2 gap-2 mb-2.5 text-center">
                      <div className="p-2 rounded-lg bg-amber-950/50 border border-amber-700/50">
                        <span className="text-[10px] text-amber-300/80 uppercase font-semibold block">
                          {isUrdu ? 'سحری ختم' : 'Sehri End'}
                        </span>
                        <span className="text-sm font-bold text-amber-300 font-mono">
                          {row.sehriEnd}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-rose-950/50 border border-rose-700/50">
                        <span className="text-[10px] text-rose-300/80 uppercase font-semibold block">
                          {isUrdu ? 'وقتِ افطار' : 'Iftar Time'}
                        </span>
                        <span className="text-sm font-bold text-rose-300 font-mono">
                          {row.iftarTime}
                        </span>
                      </div>
                    </div>

                    {/* Jamaat Timings Grid */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] bg-stone-950/60 p-2 rounded-lg border border-stone-800/80">
                      <div>
                        <span className="text-stone-400 block">{isUrdu ? 'فجر' : 'Fajr'}</span>
                        <span className="font-mono font-bold text-white">{row.fajrJamaat}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">{isUrdu ? 'ظہر/جمعہ' : 'Dhuhr'}</span>
                        <span className="font-mono font-bold text-white">{row.dhuhrJamaat}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">{isUrdu ? 'عصر' : 'Asr'}</span>
                        <span className="font-mono font-bold text-white">{row.asrJamaat}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">{isUrdu ? 'مغرب' : 'Maghrib'}</span>
                        <span className="font-mono font-bold text-white">{row.maghribJamaat}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-stone-400 block">{isUrdu ? 'تراویح (۲۰ رکعات)' : 'Taraweeh'}</span>
                        <span className="font-mono font-bold text-blue-300">{row.taraweehJamaat}</span>
                      </div>
                    </div>

                    {/* Action Demo Button */}
                    {onSelectRozaDemo && (
                      <button
                        onClick={() => {
                          onSelectRozaDemo(row.rozaNo);
                          onClose();
                        }}
                        className="mt-2 w-full py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>{isUrdu ? 'اس دن کا ٹیسٹ ڈیمو چلائیں' : 'Test This Day in Live Demo'}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          </div>

          {/* JUMMAH & TARAWEEH SPECIAL NOTICE STRIP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-stone-900 border border-amber-600/50">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white uppercase">
                  {isUrdu ? 'ماہِ رمضان میں جمعۃ المبارک کے اوقات' : 'Friday (Jumma) Timetable in Ramadan'}
                </span>
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                اذانِ اول: <strong>{adminSettings?.jummaAzan || '12:50 PM'}</strong> • 
                درس و بیان: <strong>{adminSettings?.jummaBayan || '01:10 PM'}</strong> • 
                اذانِ ثانی: <strong>{adminSettings?.jummaAzan2 || '01:40 PM'}</strong> • 
                عربی خطبہ: <strong>{adminSettings?.jummaKhutbah || '01:45 PM'}</strong> • 
                جماعتِ جمعہ: <strong className="text-amber-300">{adminSettings?.jummaJamaat || '01:50 PM'}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-stone-900 border border-emerald-600/50">
              <div className="flex items-center gap-2 mb-1.5">
                <Moon className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white uppercase">
                  {isUrdu ? 'نمازِ تراویح و ختمِ قرآن مجید' : 'Taraweeh & Khatam-ul-Quran'}
                </span>
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                روزانہ بعد نمازِ عشاء رات <strong>08:00 بجے</strong> ۲۰ رکعات باجماعت تراویح مع ختمِ قرآنِ پاک۔ 
                خواتین و معذورین کے لیے مسجد کے مائیک و ساؤنڈ کا باقاعدہ اہتمام ہے۔
              </p>
            </div>
          </div>

          {/* LEGAL / ISLAMIC AUTHORITY CERTIFICATION STRIP */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between flex-wrap gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-stone-200 font-semibold">
                  {isUrdu
                    ? 'اوقاتِ سحر و افطار و نماز جامعہ علوم اسلامیہ علامہ بنوری ٹاؤن و دارالعلوم کراچی کے حنفی معیارات کے مطابق تصدیق شدہ ہیں۔'
                    : 'Timetable strictly verified according to Jamia Uloom-ul-Islamia Allama Banuri Town & Darul Uloom Karachi Hanafi standards.'}
                </p>
                <p className="text-stone-400 text-[11px]">
                  جامع مسجد عثمانِ غنی (رضی اللہ عنہ)، ST-11، سیکٹر 5-اے/1، نارتھ کراچی • واٹس ایپ رابطہ: 03233469424
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition-all shadow-md flex items-center gap-2 text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>{isUrdu ? 'پی ڈی ایف / پرنٹ' : 'Print / Save PDF'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-between items-center text-xs no-print">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">
              {isUrdu ? 'ماہِ رمضان المبارک 1448ھ بمطابق 2027ء' : 'Ramadan 1448 AH / 2027 CE Timetable'}
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-emerald-400 font-semibold">
              {isUrdu ? 'جامع مسجد عثمان غنی' : 'Jamia Masjid Usman-e-Ghani'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
              <span>{isUrdu ? 'ایکسل ڈاؤن لوڈ' : 'Excel'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition-colors"
            >
              {isUrdu ? 'بند کریں' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
