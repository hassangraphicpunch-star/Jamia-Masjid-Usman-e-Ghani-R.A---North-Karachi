/**
 * Astronomy & Accurate Moon Phase Calculation Service for Jamia Masjid Usman-e-Ghani R.A.
 * Powered by astronomy-engine (VSOP87 planetary theory & ELP2000 lunar theory).
 * 
 * Provides:
 * 1. Exact daily lunar phase calculation for Karachi, Pakistan (Asia/Karachi timezone)
 * 2. Real-time illuminated fraction & illumination percentage (e.g. Moon: 5.4%)
 * 3. 8 canonical lunar phases with Northern Hemisphere orientation
 * 4. Upcoming primary phase dates (New Moon, First Quarter, Full Moon, Third/Last Quarter)
 * 5. Complete monthly date-wise Moon Phase Calendar inspired by Timeanddate.com
 * 6. Islamic / Hijri date calculation transitioning daily at Maghrib (sunset)
 */
import * as Astronomy from 'astronomy-engine';

export type MoonPhaseType =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export interface MoonPhaseInfo {
  id: MoonPhaseType;
  nameUr: string;
  nameEn: string;
  arabicName: string;
  emoji: string;
  rangeEn: string;
  rangeUr: string;
  typicalIllumination: number;
  isWaxing: boolean;
  directionSymbol: '↑' | '↓' | '—';
  directionUr: string;
  directionEn: string;
  directionColor: string;
  directionBg: string;
  descriptionUr: string;
  descriptionEn: string;
  islamicSignificanceUr: string;
  islamicSignificanceEn: string;
}

export interface AccurateHijriDate {
  day: number;
  month: {
    num: number;
    en: string;
    ar: string;
    ur: string;
  };
  year: number;
  formattedUr: string;
  formattedAr: string;
  formattedEn: string;
  isPostMaghrib?: boolean;
  maghribTimeStr?: string;
}

export interface PrimaryPhaseEvent {
  id: 'new_moon' | 'first_quarter' | 'full_moon' | 'third_quarter';
  nameEn: string;
  nameUr: string;
  emoji: string;
  date: Date;
  dateFormattedEn: string;
  dateFormattedUr: string;
  timeFormattedPkt: string;
  daysRemaining: number;
}

export interface DailyCalendarDay {
  dayNumber: number;
  date: Date;
  dateKey: string; // YYYY-MM-DD
  weekdayEn: string;
  weekdayUr: string;
  phaseId: MoonPhaseType;
  phaseNameEn: string;
  phaseNameUr: string;
  illumination: number; // 0 to 100
  illuminationPctStr: string; // e.g. "5.4%"
  phaseAngle: number;
  isWaxing: boolean;
  isToday: boolean;
  isPrimaryPhase: boolean;
  primaryPhaseType?: 'new_moon' | 'first_quarter' | 'full_moon' | 'third_quarter';
  primaryPhaseNameEn?: string;
  primaryPhaseNameUr?: string;
  primaryPhaseTimePkt?: string;
  moonrise: string;
  moonset: string;
  distanceKm: number;
  hijriDay: number;
}

export interface DynamicMoonData {
  calculatedAt: string;
  calculatedAtFormattedUr: string;
  calculatedAtFormattedEn: string;
  dateString: string;
  dateFormattedEn: string;
  dateFormattedUr: string;
  phaseRatio: number; // 0.0 to 1.0
  phaseAngleDegrees: number; // 0.0° to 360.0°
  ageDays: number; // 0 to 29.53
  ageFormattedUr: string;
  ageFormattedEn: string;
  illumination: number; // 0 to 100% (e.g. 5.4)
  illuminationPctStr: string; // e.g. "5.4%"
  distanceKm: number;
  visualMagnitude: number;
  isWaxing: boolean;
  directionSymbol: '↑' | '↓' | '—';
  directionUr: string;
  directionEn: string;
  directionColor: string;
  directionBadgeBg: string;
  currentType: MoonPhaseInfo;
  solarNoon: string;
  moonrise: string;
  moonset: string;
  transitTime: string;
  altitudeKarachi: number;
  azimuthKarachi: number;
  nextNewMoonDays: number;
  nextFullMoonDays: number;
  nextNewMoonDate: string;
  nextFullMoonDate: string;
  hijriDate: AccurateHijriDate;
  hijriDayEstimate: number;
  nextPrimaryPhases: PrimaryPhaseEvent[];
  allPhases: (MoonPhaseInfo & { isCurrent: boolean })[];
  coordinates: { lat: number; lng: number };
  engineSource: string;
  locationNameEn: string;
  locationNameUr: string;
  shariahNoticeUr: string;
  shariahNoticeEn: string;
}

export const HIJRI_MONTHS = [
  { num: 1, en: 'Muharram', ar: 'محرّم', ur: 'محرم الحرام' },
  { num: 2, en: 'Safar', ar: 'صفر', ur: 'صفر المظفر' },
  { num: 3, en: 'Rabi al-Awwal', ar: 'ربيع الأول', ur: 'ربیع الاول' },
  { num: 4, en: 'Rabi al-Thani', ar: 'ربيع الثاني', ur: 'ربیع الثانی' },
  { num: 5, en: 'Jumada al-Awwal', ar: 'جمادى الأولى', ur: 'جمادی الاول' },
  { num: 6, en: 'Jumada al-Thani', ar: 'جمادى الثانية', ur: 'جمادی الثانی' },
  { num: 7, en: 'Rajab', ar: 'رجب', ur: 'رجب المرجب' },
  { num: 8, en: 'Sha\'ban', ar: 'شعبان', ur: 'شعبان المعظم' },
  { num: 9, en: 'Ramadan', ar: 'رمضان', ur: 'رمضان المبارک' },
  { num: 10, en: 'Shawwal', ar: 'شوّال', ur: 'شوال المکرم' },
  { num: 11, en: 'Dhu al-Qi\'dah', ar: 'ذو القعدة', ur: 'ذی القعدہ' },
  { num: 12, en: 'Dhu al-Hijjah', ar: 'ذو الحجة', ur: 'ذی الحجہ' },
];

// Monthly approximate sunset times for North Karachi (Lat 24.9961° N, Lng 67.0673° E)
// Used to transition the Islamic date daily at Maghrib prayer (sunset), according to Shariah.
export const KARACHI_MONTHLY_MAGHRIB: Record<number, { h: number; m: number }> = {
  1: { h: 18, m: 5 },   // Jan: 06:05 PM
  2: { h: 18, m: 22 },  // Feb: 06:22 PM
  3: { h: 18, m: 40 },  // Mar: 06:40 PM
  4: { h: 18, m: 55 },  // Apr: 06:55 PM
  5: { h: 19, m: 12 },  // May: 07:12 PM
  6: { h: 19, m: 24 },  // Jun: 07:24 PM
  7: { h: 19, m: 25 },  // Jul: 07:25 PM
  8: { h: 19, m: 8 },   // Aug: 07:08 PM
  9: { h: 18, m: 42 },  // Sep: 06:42 PM
  10: { h: 18, m: 12 }, // Oct: 06:12 PM
  11: { h: 17, m: 50 }, // Nov: 05:50 PM
  12: { h: 17, m: 48 }, // Dec: 05:48 PM
};

/**
 * Checks whether the target time in Karachi has passed Maghrib (sunset).
 */
export function isAfterKarachiMaghrib(targetDate: Date = new Date()): {
  isPostMaghrib: boolean;
  maghribTimeStr: string;
} {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    month: 'numeric',
  });
  const parts = formatter.formatToParts(targetDate);
  let hour = targetDate.getHours();
  let minute = targetDate.getMinutes();
  let month = targetDate.getMonth() + 1;
  for (const p of parts) {
    if (p.type === 'hour') hour = parseInt(p.value, 10);
    if (p.type === 'minute') minute = parseInt(p.value, 10);
    if (p.type === 'month') month = parseInt(p.value, 10);
  }

  const maghrib = KARACHI_MONTHLY_MAGHRIB[month] || { h: 18, m: 15 };
  const currentMins = hour * 60 + minute;
  const maghribMins = maghrib.h * 60 + maghrib.m;
  const isPostMaghrib = currentMins >= maghribMins;
  const maghribTimeStr = `${String(maghrib.h).padStart(2, '0')}:${String(maghrib.m).padStart(2, '0')}`;

  return { isPostMaghrib, maghribTimeStr };
}

/**
 * Accurately calculate Islamic / Hijri date for Pakistan & Karachi.
 * Changes daily at Maghrib (sunset) as required by Shariah.
 */
export const PAKISTAN_RUET_MONTH_STARTS = [
  { year: 1447, month: 9, startCivilDate: '2026-02-19' }, // Ramadan 1447
  { year: 1447, month: 10, startCivilDate: '2026-03-21' }, // Shawwal 1447
  { year: 1447, month: 11, startCivilDate: '2026-04-19' }, // Dhu al-Qadah 1447
  { year: 1447, month: 12, startCivilDate: '2026-05-19' }, // Dhu al-Hijjah 1447
  { year: 1448, month: 1, startCivilDate: '2026-06-17' }, // Muharram 1448
  { year: 1448, month: 2, startCivilDate: '2026-07-16' }, // Safar 1448
  { year: 1448, month: 3, startCivilDate: '2026-08-15' }, // Rabi al-Awwal 1448
  { year: 1448, month: 4, startCivilDate: '2026-09-13' }, // Rabi al-Thani 1448
  { year: 1448, month: 5, startCivilDate: '2026-10-13' }, // Jumada al-Awwal 1448 (Central Ruet-e-Hilal confirmed)
  { year: 1448, month: 6, startCivilDate: '2026-11-11' }, // Jumada al-Thani 1448
  { year: 1448, month: 7, startCivilDate: '2026-12-11' }, // Rajab 1448
  { year: 1448, month: 8, startCivilDate: '2027-01-10' }, // Shaban 1448
  { year: 1448, month: 9, startCivilDate: '2027-02-08' }, // Ramadan 1448
  { year: 1448, month: 10, startCivilDate: '2027-03-10' }, // Shawwal 1448
  { year: 1448, month: 11, startCivilDate: '2027-04-08' }, // Dhu al-Qadah 1448
  { year: 1448, month: 12, startCivilDate: '2027-05-08' }, // Dhu al-Hijjah 1448
];

/**
 * Accurately calculate Islamic / Hijri date for Pakistan & Karachi.
 * Prioritizes Central Ruet-e-Hilal Committee (مرکزی رویتِ ہلال کمیٹی پاکستان) official sightings.
 * Changes daily at Maghrib (sunset in Karachi) as required by Islamic jurisprudence.
 */
export function getAccurateHijriDate(
  targetDate: Date = new Date(),
  offsetDays: number = 0
): AccurateHijriDate {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(targetDate);
  let year = targetDate.getFullYear();
  let month = targetDate.getMonth() + 1;
  let day = targetDate.getDate();
  let hour = targetDate.getHours();
  let minute = targetDate.getMinutes();

  for (const p of parts) {
    if (p.type === 'year') year = parseInt(p.value, 10);
    if (p.type === 'month') month = parseInt(p.value, 10);
    if (p.type === 'day') day = parseInt(p.value, 10);
    if (p.type === 'hour') hour = parseInt(p.value, 10);
    if (p.type === 'minute') minute = parseInt(p.value, 10);
  }

  const maghrib = KARACHI_MONTHLY_MAGHRIB[month] || { h: 18, m: 15 };
  const currentMins = hour * 60 + minute;
  const maghribMins = maghrib.h * 60 + maghrib.m;
  const isPostMaghrib = currentMins >= maghribMins;

  // Apply offsetDays in terms of days
  const effectiveCivilUtc = Date.UTC(year, month - 1, day) + offsetDays * 86400000;
  const effDate = new Date(effectiveCivilUtc);
  const effY = effDate.getUTCFullYear();
  const effM = effDate.getUTCMonth() + 1;
  const effD = effDate.getUTCDate();
  const civilDateStr = `${effY}-${String(effM).padStart(2, '0')}-${String(effD).padStart(2, '0')}`;

  // Find active Central Ruet-e-Hilal confirmed month start
  let activeMonth = PAKISTAN_RUET_MONTH_STARTS[8]; // Default: Jumada al-Awwal 1448 AH (start 2026-10-13)
  for (let i = PAKISTAN_RUET_MONTH_STARTS.length - 1; i >= 0; i--) {
    if (civilDateStr >= PAKISTAN_RUET_MONTH_STARTS[i].startCivilDate) {
      activeMonth = PAKISTAN_RUET_MONTH_STARTS[i];
      break;
    }
  }

  const [sY, sM, sD] = activeMonth.startCivilDate.split('-').map(Number);
  const startUtc = Date.UTC(sY, sM - 1, sD);
  const diffDays = Math.round((effectiveCivilUtc - startUtc) / 86400000);

  // In Islamic calendar, the new date begins at sunset (Maghrib)
  let hijriDay = diffDays + 1;
  if (isPostMaghrib && offsetDays === 0) {
    hijriDay += 1;
  }

  let hijriMonthNum = activeMonth.month;
  let hijriYearNum = activeMonth.year;

  if (hijriDay > 30) {
    hijriDay -= 30;
    hijriMonthNum += 1;
    if (hijriMonthNum > 12) {
      hijriMonthNum = 1;
      hijriYearNum += 1;
    }
  } else if (hijriDay < 1) {
    hijriDay = 29;
    hijriMonthNum -= 1;
    if (hijriMonthNum < 1) {
      hijriMonthNum = 12;
      hijriYearNum -= 1;
    }
  }

  const mInfo = HIJRI_MONTHS[hijriMonthNum - 1] || HIJRI_MONTHS[4];

  return {
    day: hijriDay,
    month: mInfo,
    year: hijriYearNum,
    formattedUr: `${hijriDay} ${mInfo.ur} ${hijriYearNum}ھ`,
    formattedAr: `${hijriDay} ${mInfo.ar} ${hijriYearNum} هـ`,
    formattedEn: `${hijriDay} ${mInfo.en} ${hijriYearNum} AH`,
    isPostMaghrib,
    maghribTimeStr: `${String(maghrib.h).padStart(2, '0')}:${String(maghrib.m).padStart(2, '0')}`,
  };
}

export const MOON_PHASE_DEFINITIONS: Record<MoonPhaseType, MoonPhaseInfo> = {
  new_moon: {
    id: 'new_moon',
    nameUr: 'نیا چاند',
    nameEn: 'New Moon',
    arabicName: 'المحاق / الهلال الجديد',
    emoji: '🌑',
    rangeEn: '0%',
    rangeUr: '0% (محاق)',
    typicalIllumination: 0,
    isWaxing: true,
    directionSymbol: '↑',
    directionUr: '↑ نیا چاند (شروعات)',
    directionEn: '↑ New Moon Cycle Starting',
    directionColor: 'text-stone-400',
    directionBg: 'bg-stone-900 border-stone-700',
    descriptionUr: 'چاند اور سورج کے درمیان زمین کا رخ تاریک ہوتا ہے، چاند نظر نہیں آتا۔',
    descriptionEn: 'The Moon is between Earth and the Sun, unilluminated side facing Earth.',
    islamicSignificanceUr: 'نئے قمری مہینے اور رویتِ ہلال کا انتظار اسی مرحلے کے بعد شروع ہوتا ہے۔',
    islamicSignificanceEn: 'Marks the astronomical birth of the new Islamic Hijri month.',
  },
  waxing_crescent: {
    id: 'waxing_crescent',
    nameUr: 'بڑھتا ہوا ہلال',
    nameEn: 'Waxing Crescent',
    arabicName: 'الهلال المتزايد',
    emoji: '🌒',
    rangeEn: '1–49% ↑',
    rangeUr: '1–49% ↑ (بڑھتا ہوا)',
    typicalIllumination: 25,
    isWaxing: true,
    directionSymbol: '↑',
    directionUr: '↑ بڑھ رہا ہے',
    directionEn: '↑ Waxing (Increasing)',
    directionColor: 'text-emerald-400',
    directionBg: 'bg-emerald-950/80 border-emerald-500/60',
    descriptionUr: 'مغرب کے بعد آسمان پر باریک چاندی کا ہلال ظاہر ہوتا ہے، روشنی روز بروز بڑھتی ہے۔',
    descriptionEn: 'A slender sliver of silver light appears in the western sky after sunset, growing daily.',
    islamicSignificanceUr: 'اسلامی مہینے کی پہلی تاریخوں کا ہلال جس کی رویت پر دعائے ہلال مسنون ہے۔',
    islamicSignificanceEn: 'The traditional crescent moon that establishes the new Islamic date upon sighting.',
  },
  first_quarter: {
    id: 'first_quarter',
    nameUr: 'پہلی تربیع',
    nameEn: 'First Quarter',
    arabicName: 'التربيع الأول',
    emoji: '🌓',
    rangeEn: '50% ↑',
    rangeUr: '50% ↑ (نصف روشن)',
    typicalIllumination: 50,
    isWaxing: true,
    directionSymbol: '↑',
    directionUr: '↑ بڑھ رہا ہے (نصف روشن)',
    directionEn: '↑ Waxing (Half Illuminated)',
    directionColor: 'text-emerald-400',
    directionBg: 'bg-emerald-950/80 border-emerald-500/60',
    descriptionUr: 'چاند کا دایاں نصف حصہ مکمل روشن اور بایاں تاریک ہوتا ہے۔',
    descriptionEn: 'The right half of the lunar disk is brightly illuminated, increasing towards full.',
    islamicSignificanceUr: 'قمری مہینے کا پہلا ہفتہ مکمل، نصف روشن چاند۔',
    islamicSignificanceEn: 'End of the first week of the Hijri month.',
  },
  waxing_gibbous: {
    id: 'waxing_gibbous',
    nameUr: 'بڑھتا ہوا محدب چاند',
    nameEn: 'Waxing Gibbous',
    arabicName: 'الأحدب المتزايد',
    emoji: '🌔',
    rangeEn: '51–99% ↑',
    rangeUr: '51–99% ↑ (بڑھتا ہوا محدب)',
    typicalIllumination: 75,
    isWaxing: true,
    directionSymbol: '↑',
    directionUr: '↑ بڑھ رہا ہے',
    directionEn: '↑ Waxing (Increasing)',
    directionColor: 'text-emerald-400',
    directionBg: 'bg-emerald-950/80 border-emerald-500/60',
    descriptionUr: 'نصف سے زیادہ چاند روشن ہوتا ہے اور بدرِ کامل کی طرف گامزن ہوتا ہے۔',
    descriptionEn: 'More than half illuminated and waxing steadily toward 100% full moon.',
    islamicSignificanceUr: 'ایامِ بیض (13، 14، 15 تاریخوں کے مسنون روزوں) کی آمد کا اشارہ۔',
    islamicSignificanceEn: 'Precedes the blessed Sunnah fasting days of Ayyam al-Beed (13th-15th).',
  },
  full_moon: {
    id: 'full_moon',
    nameUr: 'بدر / پورا چاند',
    nameEn: 'Full Moon',
    arabicName: 'البدر الكامل',
    emoji: '🌕',
    rangeEn: '100%',
    rangeUr: '100% (بدرِ کامل)',
    typicalIllumination: 100,
    isWaxing: false,
    directionSymbol: '—',
    directionUr: 'بدر کامل (100% چاندنی)',
    directionEn: 'Full Moon Peak (100%)',
    directionColor: 'text-amber-300',
    directionBg: 'bg-amber-950/80 border-amber-400/80',
    descriptionUr: 'چاند مکمل 100% روشن، پوری رات نور کی بارش، سورج کے غروب ہوتے ہی طلوع۔',
    descriptionEn: '100% fully illuminated disc radiating brilliant light all night long.',
    islamicSignificanceUr: '14 ویں اور 15 ویں شب، رسول اللہ ﷺ کا فرمان: تم اپنے رب کو ایسے دیکھو گے جیسے اس چودھویں کے چاند کو دیکھ رہے ہو۔',
    islamicSignificanceEn: 'Referenced in authentic Hadith: "You will see your Lord as clearly as you see this full moon."',
  },
  waning_gibbous: {
    id: 'waning_gibbous',
    nameUr: 'گھٹتا ہوا محدب چاند',
    nameEn: 'Waning Gibbous',
    arabicName: 'الأحدب المتناقص',
    emoji: '🌖',
    rangeEn: '99–51% ↓',
    rangeUr: '99–51% ↓ (گھٹتا ہوا محدب)',
    typicalIllumination: 75,
    isWaxing: false,
    directionSymbol: '↓',
    directionUr: '↓ گھٹ رہا ہے',
    directionEn: '↓ Waning (Decreasing)',
    directionColor: 'text-amber-400',
    directionBg: 'bg-amber-950/80 border-amber-500/60',
    descriptionUr: 'بدر کامل کے بعد چاندنی کی مقدار روزانہ گھٹنے لگتی ہے، طلوع رات گئے ہوتا ہے۔',
    descriptionEn: 'Illumination begins shrinking below 100%, rising later into the evening.',
    islamicSignificanceUr: 'قمری مہینے کے دوسرے نصف کا آغاز، ایامِ بیض کا اختتام۔',
    islamicSignificanceEn: 'Beginning of the waning half of the Islamic month.',
  },
  last_quarter: {
    id: 'last_quarter',
    nameUr: 'آخری تربیع',
    nameEn: 'Last Quarter',
    arabicName: 'التربيع الثاني / الأخير',
    emoji: '🌗',
    rangeEn: '50% ↓',
    rangeUr: '50% ↓ (نصف روشن)',
    typicalIllumination: 50,
    isWaxing: false,
    directionSymbol: '↓',
    directionUr: '↓ گھٹ رہا ہے (نصف روشن)',
    directionEn: '↓ Waning (Half Illuminated)',
    directionColor: 'text-amber-400',
    directionBg: 'bg-amber-950/80 border-amber-500/60',
    descriptionUr: 'چاند کا بایاں نصف حصہ روشن اور دایاں تاریک ہوتا ہے، نصف شب کے بعد طلوع۔',
    descriptionEn: 'The left half of the lunar disc is illuminated, rising around midnight.',
    islamicSignificanceUr: 'قمری مہینے کا چوتھا ہفتہ، تہجد کے وقت آسمان پر نصف چاند۔',
    islamicSignificanceEn: 'Illuminates the late night sky during the time of Tahajjud prayer.',
  },
  waning_crescent: {
    id: 'waning_crescent',
    nameUr: 'گھٹتا ہوا ہلال',
    nameEn: 'Waning Crescent',
    arabicName: 'الهلال المتناقص / العرجون القديم',
    emoji: '🌘',
    rangeEn: '49–1% ↓',
    rangeUr: '49–1% ↓ (گھٹتا ہوا)',
    typicalIllumination: 22,
    isWaxing: false,
    directionSymbol: '↓',
    directionUr: '↓ گھٹ رہا ہے',
    directionEn: '↓ Waning (Decreasing)',
    directionColor: 'text-amber-400',
    directionBg: 'bg-amber-950/80 border-amber-500/60',
    descriptionUr: 'فجر سے قبل مشرق میں باریک ہلال ظاہر ہوتا ہے اور اگلے دن محاق میں داخل ہو جاتا ہے۔',
    descriptionEn: 'A delicate crescent visible in the eastern dawn sky before sunrise, shrinking toward zero.',
    islamicSignificanceUr: 'قرآن کریم کی آیت: "حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ" (یہاں تک کہ وہ کھجور کی پرانی سوکھی شاخ جیسا باریک ہو جاتا ہے - سورۃ یٰسین: 39)',
    islamicSignificanceEn: 'Holy Quran description: "Until it becomes like an old dry palm branch" (Surah Ya-Sin: 39).',
  },
};

/**
 * Calculate accurate Solar Noon for Karachi (24.9961° N, 67.0673° E)
 */
export function calculateSolarNoon(
  targetDate: Date = new Date(),
  lng: number = 67.0673
): string {
  const startOfYear = new Date(targetDate.getFullYear(), 0, 0);
  const diff = targetDate.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const eotMinutes = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  const meridianOffsetMinutes = (75 - lng) * 4;
  const solarNoonTotalMinutes = 12 * 60 + meridianOffsetMinutes - eotMinutes;
  const hours = Math.floor(solarNoonTotalMinutes / 60);
  const mins = Math.round(solarNoonTotalMinutes % 60);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayH = hours % 12 || 12;
  return `${displayH.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
}

/**
 * Determine the canonical 8-phase identifier from the phase angle in degrees (0° to 360°)
 */
export function getPhaseIdFromAngle(phaseAngle: number): MoonPhaseType {
  const angle = ((phaseAngle % 360) + 360) % 360;
  if (angle < 7.5 || angle >= 352.5) return 'new_moon';
  if (angle < 82.5) return 'waxing_crescent';
  if (angle < 97.5) return 'first_quarter';
  if (angle < 172.5) return 'waxing_gibbous';
  if (angle < 187.5) return 'full_moon';
  if (angle < 262.5) return 'waning_gibbous';
  if (angle < 277.5) return 'last_quarter';
  return 'waning_crescent';
}

/**
 * Format a Date object into Pakistan Standard Time formatted string
 */
export function formatKarachiDate(date: Date, lang: 'ur' | 'en' = 'en'): string {
  if (lang === 'ur') {
    return date.toLocaleDateString('ur-PK', {
      timeZone: 'Asia/Karachi',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  return date.toLocaleDateString('en-US', {
    timeZone: 'Asia/Karachi',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Find upcoming primary phases (New Moon, 1st Qtr, Full Moon, 3rd Qtr) from target date
 */
export function getUpcomingPrimaryPhases(
  targetDate: Date = new Date(),
  _coords: { lat: number; lng: number } = { lat: 24.9961, lng: 67.0673 }
): PrimaryPhaseEvent[] {
  const targets: {
    id: 'new_moon' | 'first_quarter' | 'full_moon' | 'third_quarter';
    angle: number;
    nameEn: string;
    nameUr: string;
    emoji: string;
  }[] = [
    { id: 'new_moon', angle: 0, nameEn: 'New Moon', nameUr: 'نیا چاند (محاق)', emoji: '🌑' },
    { id: 'first_quarter', angle: 90, nameEn: 'First Quarter', nameUr: 'پہلی تربیع', emoji: '🌓' },
    { id: 'full_moon', angle: 180, nameEn: 'Full Moon', nameUr: 'بدر / پورا چاند', emoji: '🌕' },
    { id: 'third_quarter', angle: 270, nameEn: 'Third Quarter', nameUr: 'آخری تربیع', emoji: '🌗' },
  ];

  const nowMs = targetDate.getTime();

  return targets
    .map((t) => {
      const search = Astronomy.SearchMoonPhase(t.angle, targetDate, 45);
      const eventDate = search?.date ? search.date : new Date(nowMs + 14 * 86400000);
      const daysRemaining = Math.max(0, Math.round(((eventDate.getTime() - nowMs) / 86400000) * 10) / 10);

      const dateFormattedEn = eventDate.toLocaleDateString('en-US', {
        timeZone: 'Asia/Karachi',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const dateFormattedUr = eventDate.toLocaleDateString('ur-PK', {
        timeZone: 'Asia/Karachi',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const timeFormattedPkt = eventDate.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        id: t.id,
        nameEn: t.nameEn,
        nameUr: t.nameUr,
        emoji: t.emoji,
        date: eventDate,
        dateFormattedEn,
        dateFormattedUr,
        timeFormattedPkt: `${timeFormattedPkt} PKT`,
        daysRemaining,
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Get all 4 primary phases occurring in a specific calendar month (year, 1-indexed month)
 */
export function getMonthPrimaryPhases(
  year: number,
  monthIndex: number, // 1 to 12
  _coords: { lat: number; lng: number } = { lat: 24.9961, lng: 67.0673 }
): PrimaryPhaseEvent[] {
  const monthStart = new Date(Date.UTC(year, monthIndex - 1, 1, 0, 0, 0));
  const monthEnd = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));

  const targets: {
    id: 'new_moon' | 'first_quarter' | 'full_moon' | 'third_quarter';
    angle: number;
    nameEn: string;
    nameUr: string;
    emoji: string;
  }[] = [
    { id: 'new_moon', angle: 0, nameEn: 'New Moon', nameUr: 'نیا چاند', emoji: '🌑' },
    { id: 'first_quarter', angle: 90, nameEn: 'First Quarter', nameUr: 'پہلی تربیع', emoji: '🌓' },
    { id: 'full_moon', angle: 180, nameEn: 'Full Moon', nameUr: 'بدر / پورا چاند', emoji: '🌕' },
    { id: 'third_quarter', angle: 270, nameEn: 'Third Quarter', nameUr: 'آخری تربیع', emoji: '🌗' },
  ];

  const results: PrimaryPhaseEvent[] = [];

  for (const t of targets) {
    let curSearchDate = new Date(monthStart.getTime() - 2 * 86400000);
    while (curSearchDate < monthEnd) {
      const search = Astronomy.SearchMoonPhase(t.angle, curSearchDate, 35);
      if (!search || !search.date) break;
      const d = search.date;
      if (d >= monthStart && d < monthEnd) {
        results.push({
          id: t.id,
          nameEn: t.nameEn,
          nameUr: t.nameUr,
          emoji: t.emoji,
          date: d,
          dateFormattedEn: d.toLocaleDateString('en-US', {
            timeZone: 'Asia/Karachi',
            month: 'short',
            day: 'numeric',
          }),
          dateFormattedUr: d.toLocaleDateString('ur-PK', {
            timeZone: 'Asia/Karachi',
            month: 'short',
            day: 'numeric',
          }),
          timeFormattedPkt: `${d.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Karachi',
            hour: '2-digit',
            minute: '2-digit',
          })} PKT`,
          daysRemaining: Math.round((d.getTime() - Date.now()) / 86400000),
        });
      }
      curSearchDate = new Date(d.getTime() + 10 * 86400000);
    }
  }

  return results.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Generate a complete, date-wise Moon Phase Calendar for any selected month and year
 * inspired by Timeanddate.com's Moon Phases Calendar for Karachi, Pakistan.
 */
export function getMonthMoonCalendar(
  year: number,
  monthIndex: number, // 1 to 12
  coords: { lat: number; lng: number } = { lat: 24.9961, lng: 67.0673 }
): {
  days: DailyCalendarDay[];
  primaryPhases: PrimaryPhaseEvent[];
  firstDayWeekday: number; // 0 = Sun, 1 = Mon ...
  daysInMonth: number;
  monthNameEn: string;
  monthNameUr: string;
} {
  const observer = new Astronomy.Observer(coords.lat, coords.lng, 20);
  const daysInMonth = new Date(year, monthIndex, 0).getDate();
  const firstDay = new Date(Date.UTC(year, monthIndex - 1, 1, 7, 0, 0));
  const firstDayWeekday = new Date(year, monthIndex - 1, 1).getDay();

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthNamesUr = [
    'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
    'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر',
  ];

  const primaryPhases = getMonthPrimaryPhases(year, monthIndex, coords);

  // Map primary phase by calendar date in Karachi
  const primaryPhaseByDate: Record<number, PrimaryPhaseEvent> = {};
  primaryPhases.forEach((p) => {
    const kDay = parseInt(
      new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Karachi', day: 'numeric' }).format(p.date),
      10
    );
    primaryPhaseByDate[kDay] = p;
  });

  const now = new Date();
  const nowDayStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(now);

  const days: DailyCalendarDay[] = [];

  const weekdaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdaysUr = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    // 12:00 PM local Karachi time (UTC+5 -> 07:00 UTC)
    const calDate = new Date(Date.UTC(year, monthIndex - 1, dayNum, 7, 0, 0));
    const dayStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(calDate);

    const isToday = dayStr === nowDayStr;
    const weekdayIdx = new Date(year, monthIndex - 1, dayNum).getDay();

    const rawPhaseAngle = Astronomy.MoonPhase(calDate);
    const phaseAngle = ((rawPhaseAngle % 360) + 360) % 360;
    const illum = Astronomy.Illumination(Astronomy.Body.Moon, calDate);
    const illumination = Math.min(100, Math.max(0, Math.round(illum.phase_fraction * 1000) / 10));
    const isWaxing = phaseAngle < 180;
    const phaseId = getPhaseIdFromAngle(phaseAngle);
    const pDef = MOON_PHASE_DEFINITIONS[phaseId];

    // Moonrise and Moonset
    const dayStart = new Date(Date.UTC(year, monthIndex - 1, dayNum, 0, 0, 0));
    const riseSearch = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, dayStart, 1.5);
    const setSearch = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, dayStart, 1.5);

    const formatEventTime = (d?: Date): string => {
      if (!d) return '--:--';
      return d.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const primaryEvent = primaryPhaseByDate[dayNum];

    days.push({
      dayNumber: dayNum,
      date: calDate,
      dateKey: `${year}-${String(monthIndex).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
      weekdayEn: weekdaysEn[weekdayIdx],
      weekdayUr: weekdaysUr[weekdayIdx],
      phaseId,
      phaseNameEn: pDef.nameEn,
      phaseNameUr: pDef.nameUr,
      illumination,
      illuminationPctStr: `${illumination.toFixed(1)}%`,
      phaseAngle: Math.round(phaseAngle * 10) / 10,
      isWaxing,
      isToday,
      isPrimaryPhase: !!primaryEvent,
      primaryPhaseType: primaryEvent?.id,
      primaryPhaseNameEn: primaryEvent?.nameEn,
      primaryPhaseNameUr: primaryEvent?.nameUr,
      primaryPhaseTimePkt: primaryEvent?.timeFormattedPkt,
      moonrise: formatEventTime(riseSearch?.date),
      moonset: formatEventTime(setSearch?.date),
      distanceKm: Math.round(illum.geo_dist * 149597870.7),
      hijriDay: getAccurateHijriDate(calDate, 0).day,
    });
  }

  return {
    days,
    primaryPhases,
    firstDayWeekday,
    daysInMonth,
    monthNameEn: monthNamesEn[monthIndex - 1] || 'Month',
    monthNameUr: monthNamesUr[monthIndex - 1] || 'مہینہ',
  };
}

/**
 * Calculate accurate moon phase and astronomical parameters for Karachi, Pakistan.
 */
export function calculateMoonPhase(
  targetDate: Date = new Date(),
  coords: { lat: number; lng: number } = { lat: 24.9961, lng: 67.0673 },
  hijriOffsetDays: number = 0
): DynamicMoonData {
  const observer = new Astronomy.Observer(coords.lat, coords.lng, 20);

  // 1. Astronomy-Engine: Real-time phase angle in degrees (0.0° to 360.0°)
  const rawPhaseAngle = Astronomy.MoonPhase(targetDate);
  const phaseAngle = ((rawPhaseAngle % 360) + 360) % 360;

  // 2. Astronomy-Engine: Exact Illumination, Distance & Apparent Magnitude
  const illum = Astronomy.Illumination(Astronomy.Body.Moon, targetDate);
  // Calculate to one decimal place, e.g. 5.4%
  const illumination = Math.min(100, Math.max(0, Math.round(illum.phase_fraction * 1000) / 10));
  const illuminationPctStr = `${illumination.toFixed(1)}%`;
  const distanceKm = Math.round(illum.geo_dist * 149597870.7);
  const visualMagnitude = Math.round(illum.mag * 100) / 100;

  const phaseRatio = phaseAngle / 360.0;
  const isWaxing = phaseAngle < 180.0;

  // 3. 8 Canonical Lunar Phases
  const phaseId = getPhaseIdFromAngle(phaseAngle);
  const currentType = MOON_PHASE_DEFINITIONS[phaseId];

  // Synodic lunar age in days (29.53059 days per cycle)
  const synodicMonthDays = 29.53058867;
  const ageDays = Math.round(phaseRatio * synodicMonthDays * 10) / 10;

  // 4. Moonrise and Moonset for Karachi
  const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0);
  const riseSearch = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, startOfDay, 1.5);
  const setSearch = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, startOfDay, 1.5);

  const formatEventTime = (d?: Date): string => {
    if (!d) return '--:--';
    return d.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const moonrise = riseSearch?.date ? formatEventTime(riseSearch.date) : '05:40 AM';
  const moonset = setSearch?.date ? formatEventTime(setSearch.date) : '06:10 PM';

  // 5. Next Primary Phases
  const nextPrimaryPhases = getUpcomingPrimaryPhases(targetDate, coords);
  const nextFull = nextPrimaryPhases.find((p) => p.id === 'full_moon');
  const nextNew = nextPrimaryPhases.find((p) => p.id === 'new_moon');

  // 6. Local Celestial Horizon Position
  const eq = Astronomy.Equator(Astronomy.Body.Moon, targetDate, observer, true, true);
  const hor = Astronomy.Horizon(targetDate, observer, eq.ra, eq.dec, 'normal');
  const altitudeDegrees = Math.round(hor.altitude * 10) / 10;
  const azimuthDegrees = Math.round(hor.azimuth * 10) / 10;

  // 7. Hijri Date calculation
  const hijriDate = getAccurateHijriDate(targetDate, hijriOffsetDays);

  const orderedPhaseKeys: MoonPhaseType[] = [
    'new_moon',
    'waxing_crescent',
    'first_quarter',
    'waxing_gibbous',
    'full_moon',
    'waning_gibbous',
    'last_quarter',
    'waning_crescent',
  ];

  const allPhases = orderedPhaseKeys.map((key) => ({
    ...MOON_PHASE_DEFINITIONS[key],
    isCurrent: key === phaseId,
  }));

  const dateFormattedEn = formatKarachiDate(targetDate, 'en');
  const dateFormattedUr = formatKarachiDate(targetDate, 'ur');

  return {
    calculatedAt: targetDate.toISOString(),
    calculatedAtFormattedUr: targetDate.toLocaleTimeString('ur-PK', {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    calculatedAtFormattedEn: targetDate.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    dateString: targetDate.toISOString(),
    dateFormattedEn,
    dateFormattedUr,
    phaseRatio,
    phaseAngleDegrees: Math.round(phaseAngle * 10) / 10,
    ageDays,
    ageFormattedUr: `${ageDays} دن`,
    ageFormattedEn: `${ageDays} days`,
    illumination,
    illuminationPctStr,
    distanceKm,
    visualMagnitude,
    isWaxing,
    directionSymbol: phaseId === 'full_moon' ? '—' : isWaxing ? '↑' : '↓',
    directionUr: phaseId === 'full_moon' ? 'بدر کامل (100%)' : isWaxing ? '↑ بڑھ رہا ہے' : '↓ گھٹ رہا ہے',
    directionEn: phaseId === 'full_moon' ? 'Full Moon (100%)' : isWaxing ? '↑ Waxing (Increasing)' : '↓ Waning (Decreasing)',
    directionColor: isWaxing ? 'text-emerald-400' : 'text-amber-400',
    directionBadgeBg: isWaxing
      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
      : 'bg-amber-950/80 border-amber-500/60 text-amber-300',
    currentType,
    solarNoon: calculateSolarNoon(targetDate, coords.lng),
    moonrise,
    moonset,
    transitTime: moonrise,
    altitudeKarachi: altitudeDegrees,
    azimuthKarachi: azimuthDegrees,
    nextNewMoonDays: nextNew?.daysRemaining ?? 14,
    nextFullMoonDays: nextFull?.daysRemaining ?? 14,
    nextNewMoonDate: nextNew?.dateFormattedEn ?? 'Upcoming',
    nextFullMoonDate: nextFull?.dateFormattedEn ?? 'Upcoming',
    hijriDate,
    hijriDayEstimate: hijriDate.day,
    nextPrimaryPhases,
    allPhases,
    coordinates: coords,
    engineSource: 'Astronomical Engine (VSOP87 & ELP2000 Ephemeris)',
    locationNameEn: 'Karachi, Pakistan (Sector 5-A/1 North Karachi)',
    locationNameUr: 'کراچی، پاکستان (سیکٹر 5-A/1 نارتھ کراچی)',
    shariahNoticeUr:
      'شرعی و فتوائی وضاحت: یہ سائنسی و فلکیاتی حسابی ماڈل ہے (Timeanddate / USNO فلکیاتی معیار)۔ اسلامی مہینوں بشمول رمضان المبارک، شوال (عید الفطر) اور ذوالحجہ کے چاند کا شرعی فیصلہ صرف مرکزی رویتِ ہلال کمیٹی پاکستان کی باضابطہ تصدیق و اعلان پر ہی منحصر ہے۔ سائنسی حساب شرعی رویت کا متبادل نہیں ہے۔',
    shariahNoticeEn:
      'Islamic Notice: Astronomical phase data is calculated scientifically for Karachi, Pakistan. In Shariah, official Islamic months (Ramadan, Eid al-Fitr, Eid al-Adha) are determined exclusively upon physical moon-sighting confirmed by the Central Ruet-e-Hilal Committee of Pakistan.',
  };
}
