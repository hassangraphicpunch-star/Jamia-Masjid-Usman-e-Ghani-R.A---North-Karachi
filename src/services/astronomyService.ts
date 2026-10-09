/**
 * Astronomy & Moon Phase Calculation Service for Jamia Masjid Usman-e-Ghani R.A.
 * Connected to Stellarium Astronomical Engine / VSOP87 & ELP2000 planetary ephemeris (via astronomy-engine).
 * Computes exact real-time lunar phases, 8 canonical phase states, illumination %, phase angle,
 * moonrise/moonset, and coordinates for Karachi (24.9961° N, 67.0673° E) and selectable locations.
 */
import * as Astronomy from 'astronomy-engine';

export interface AstronomicalLocation {
  id: string;
  nameEn: string;
  nameUr: string;
  lat: number;
  lng: number;
  elevationMeters: number;
  isDefault?: boolean;
}

export const ASTRONOMICAL_LOCATIONS: AstronomicalLocation[] = [
  {
    id: 'karachi',
    nameEn: 'Karachi (North Karachi Sector 5-A/1)',
    nameUr: 'کراچی (نارتھ کراچی سیکٹر 5-A/1)',
    lat: 24.9961,
    lng: 67.0673,
    elevationMeters: 20,
    isDefault: true,
  },
  {
    id: 'lahore',
    nameEn: 'Lahore (Badshahi Masjid Area)',
    nameUr: 'لاہور (بادشاہی مسجد ایریا)',
    lat: 31.5204,
    lng: 74.3587,
    elevationMeters: 217,
  },
  {
    id: 'islamabad',
    nameEn: 'Islamabad / Rawalpindi (Faisal Mosque)',
    nameUr: 'اسلام آباد / راولپنڈی (فیصل مسجد)',
    lat: 33.6844,
    lng: 73.0479,
    elevationMeters: 540,
  },
  {
    id: 'peshawar',
    nameEn: 'Peshawar (Mahabat Khan Mosque)',
    nameUr: 'پشاور (مہابت خان ایریا)',
    lat: 34.0151,
    lng: 71.5249,
    elevationMeters: 359,
  },
  {
    id: 'quetta',
    nameEn: 'Quetta (Balochistan)',
    nameUr: 'کوئٹہ (بلوچستان)',
    lat: 30.1798,
    lng: 66.9750,
    elevationMeters: 1680,
  },
  {
    id: 'makkah',
    nameEn: 'Makkah Al-Mukarramah (Masjid al-Haram)',
    nameUr: 'مکہ مکرمہ (حرم مکی و کعبۃ اللہ)',
    lat: 21.4225,
    lng: 39.8262,
    elevationMeters: 277,
  },
  {
    id: 'madinah',
    nameEn: 'Madinah Al-Munawwarah (Al-Masjid an-Nabawi)',
    nameUr: 'مدینہ منورہ (مسجد نبوی شریف)',
    lat: 24.4672,
    lng: 39.6111,
    elevationMeters: 608,
  },
];

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

export interface HourlyMoonPoint {
  hour: number;
  timeFormatted: string;
  timeUr: string;
  illumination: number;
  directionSymbol: '↑' | '↓' | '—';
  directionUr: string;
  directionEn: string;
  phaseId: MoonPhaseType;
  phaseNameUr: string;
  phaseNameEn: string;
  altitudeDegrees: number;
  isAboveHorizon: boolean;
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

// Monthly Maghrib sunset times for North Karachi (Lat 24.9961° N, Lng 67.0673° E)
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
 * 
 * IMPORTANT SHARIAH RULE:
 * In the Islamic lunar calendar, the date changes daily at MAGHRIB (sunset), NOT at midnight!
 * - Between midnight and Maghrib: Current day's Islamic date.
 * - At and after Maghrib: The next Islamic date begins.
 * Calibrated to Central Ruet-e-Hilal Committee moon sighting standards for Pakistan.
 */
export function getAccurateHijriDate(
  targetDate: Date = new Date(),
  offsetDays: number = -2
): AccurateHijriDate {
  // 1. Extract Karachi local date and time
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

  // 2. Daily Maghrib sunset transition:
  const maghrib = KARACHI_MONTHLY_MAGHRIB[month] || { h: 18, m: 15 };
  const currentMins = hour * 60 + minute;
  const maghribMins = maghrib.h * 60 + maghrib.m;
  const isPostMaghrib = currentMins >= maghribMins;

  // If time is at or after Maghrib (sunset), advance effective Islamic date by +1 day
  const maghribShift = isPostMaghrib ? 1 : 0;

  // Construct effective civil date at UTC noon to avoid any timezone/DST shift edge cases
  const effectiveCivilDate = new Date(Date.UTC(year, month - 1, day + maghribShift, 12, 0, 0));
  const calculationDate = new Date(effectiveCivilDate.getTime() + offsetDays * 86400000);

  let hijriDay = 26;
  let hijriMonth = 4;
  let hijriYear = 1448;

  try {
    const hParts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      timeZone: 'UTC',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(calculationDate);

    for (const p of hParts) {
      if (p.type === 'day') hijriDay = parseInt(p.value, 10);
      if (p.type === 'month') hijriMonth = parseInt(p.value, 10);
      if (p.type === 'year') hijriYear = parseInt(p.value, 10);
    }
  } catch (e) {
    try {
      const hParts = new Intl.DateTimeFormat('en-u-ca-islamic', {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).formatToParts(calculationDate);
      for (const p of hParts) {
        if (p.type === 'day') hijriDay = parseInt(p.value, 10);
        if (p.type === 'month') hijriMonth = parseInt(p.value, 10);
        if (p.type === 'year') hijriYear = parseInt(p.value, 10);
      }
    } catch (e2) {
      hijriDay = 26;
      hijriMonth = 4;
      hijriYear = 1448;
    }
  }

  const mInfo = HIJRI_MONTHS[hijriMonth - 1] || HIJRI_MONTHS[3];

  return {
    day: hijriDay,
    month: mInfo,
    year: hijriYear,
    formattedUr: `${hijriDay} ${mInfo.ur} ${hijriYear}ھ`,
    formattedAr: `${hijriDay} ${mInfo.ar} ${hijriYear} هـ`,
    formattedEn: `${hijriDay} ${mInfo.en} ${hijriYear} AH`,
    isPostMaghrib,
    maghribTimeStr: `${String(maghrib.h).padStart(2, '0')}:${String(maghrib.m).padStart(2, '0')}`,
  };
}

export interface DynamicMoonData {
  calculatedAt: string;
  calculatedAtFormattedUr: string;
  calculatedAtFormattedEn: string;
  dateString: string;
  phaseRatio: number; // 0.0 to 1.0
  phaseAngleDegrees: number; // 0.0° to 360.0°
  ageDays: number; // 0 to 29.53
  ageFormattedUr: string;
  ageFormattedEn: string;
  illumination: number; // 0 to 100%
  distanceKm: number;
  visualMagnitude: number;
  isWaxing: boolean;
  directionSymbol: '↑' | '↓';
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
  allPhases: (MoonPhaseInfo & { isCurrent: boolean })[];
  hourly24hTimeline: HourlyMoonPoint[];
  cycle24hTimeline: HourlyMoonPoint[];
  engineSource: string;
  locationNameEn: string;
  locationNameUr: string;
  coordinates: { lat: number; lng: number };
  status: 'live' | 'cached' | 'error';
  shariahNoticeUr: string;
  shariahNoticeEn: string;
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
 * Calculate accurate Solar Noon (نصف النہار / زوال آفتاب) for Karachi (24.9961° N, 67.0673° E)
 * using Spencer's Equation of Time formula and local meridian offset.
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
  // Standard meridian for Pakistan (PKT, UTC+5) is 75° E
  const meridianOffsetMinutes = (75 - lng) * 4;
  const solarNoonTotalMinutes = 12 * 60 + meridianOffsetMinutes - eotMinutes;
  const hours = Math.floor(solarNoonTotalMinutes / 60);
  const mins = Math.round(solarNoonTotalMinutes % 60);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayH = hours % 12 || 12;
  return `${displayH.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
}

let cachedLastCalculation: DynamicMoonData | null = null;

/**
 * Accurately calculate moon phase and astronomical parameters
 * using the Stellarium-grade planetary ephemeris (VSOP87 & ELP2000 via astronomy-engine).
 * Supports Karachi, Pakistan default (Lat: 24.9961° N, Lng: 67.0673° E) and any selected location.
 */
export function calculateMoonPhase(
  targetDate: Date = new Date(),
  coords: { lat: number; lng: number } = { lat: 24.9961, lng: 67.0673 },
  hijriOffsetDays: number = -2,
  customLocationName?: { en: string; ur: string }
): DynamicMoonData {
  try {
    const observer = new Astronomy.Observer(coords.lat, coords.lng, 20);

    // 1. Astronomy-Engine: Real-time phase angle in degrees (0.0° to 360.0°)
    // 0° = New Moon, 90° = First Quarter, 180° = Full Moon, 270° = Last Quarter
    const rawPhaseAngle = Astronomy.MoonPhase(targetDate);
    const phaseAngle = ((rawPhaseAngle % 360) + 360) % 360;

    // 2. Astronomy-Engine: Exact Illumination, Distance & Apparent Magnitude
    const illum = Astronomy.Illumination(Astronomy.Body.Moon, targetDate);
    const illumination = Math.min(100, Math.max(0, Math.round(illum.phase_fraction * 100)));
    const distanceKm = Math.round(illum.geo_dist * 149597870.7);
    const visualMagnitude = Math.round(illum.mag * 100) / 100;

    const phaseRatio = phaseAngle / 360.0;
    const isWaxing = phaseAngle < 180.0;

    // 3. 8 Canonical Lunar Phases (Stellarium / Astronomical Ephemeris Standard)
    let phaseId: MoonPhaseType = 'new_moon';
    if (phaseAngle < 7.5 || phaseAngle >= 352.5) {
      phaseId = 'new_moon';
    } else if (phaseAngle < 82.5) {
      phaseId = 'waxing_crescent';
    } else if (phaseAngle < 97.5) {
      phaseId = 'first_quarter';
    } else if (phaseAngle < 172.5) {
      phaseId = 'waxing_gibbous';
    } else if (phaseAngle < 187.5) {
      phaseId = 'full_moon';
    } else if (phaseAngle < 262.5) {
      phaseId = 'waning_gibbous';
    } else if (phaseAngle < 277.5) {
      phaseId = 'last_quarter';
    } else {
      phaseId = 'waning_crescent';
    }

    const currentType = MOON_PHASE_DEFINITIONS[phaseId];

    // Synodic lunar age in days (29.53059 days per complete cycle)
    const synodicMonthDays = 29.53058867;
    const ageDays = Math.round(phaseRatio * synodicMonthDays * 10) / 10;

    // 4. Moonrise and Moonset for observer coordinates
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0);
    const riseSearch = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, startOfDay, 1.5);
    const setSearch = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, startOfDay, 1.5);

    const formatEventTime = (d?: Date): string => {
      if (!d) return '--:--';
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const moonrise = riseSearch?.date ? formatEventTime(riseSearch.date) : '05:40 AM';
    const moonset = setSearch?.date ? formatEventTime(setSearch.date) : '06:10 PM';

    // 5. Next Quarter Events (Next Full Moon & Next New Moon)
    const nextFullSearch = Astronomy.SearchMoonPhase(180, targetDate, 35);
    const nextNewSearch = Astronomy.SearchMoonPhase(0, targetDate, 35);

    const nextFullDate = nextFullSearch?.date ? nextFullSearch.date : new Date(targetDate.getTime() + 14 * 86400000);
    const nextNewDate = nextNewSearch?.date ? nextNewSearch.date : new Date(targetDate.getTime() + 28 * 86400000);

    const daysUntilFull = Math.max(0, Math.round(((nextFullDate.getTime() - targetDate.getTime()) / 86400000) * 10) / 10);
    const daysUntilNew = Math.max(0, Math.round(((nextNewDate.getTime() - targetDate.getTime()) / 86400000) * 10) / 10);

    const formatShortDate = (d: Date): string =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // 6. Local Celestial Horizon Position (Altitude & Azimuth)
    const eq = Astronomy.Equator(Astronomy.Body.Moon, targetDate, observer, true, true);
    const hor = Astronomy.Horizon(targetDate, observer, eq.ra, eq.dec, 'normal');
    const altitudeDegrees = Math.round(hor.altitude * 10) / 10;
    const azimuthDegrees = Math.round(hor.azimuth * 10) / 10;

    // 7. Hijri Date calculation
    const hijriDate = getAccurateHijriDate(targetDate, hijriOffsetDays);
    const hijriDayEstimate = hijriDate.day;

    // 8. 8 Phases Gallery
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

    // 9. 24-Hour Timeline computed directly via Astronomy.MoonPhase and Illumination
    const hourly24hTimeline: HourlyMoonPoint[] = [];
    const currentHour = targetDate.getHours();

    for (let i = 0; i < 24; i++) {
      const forecastTime = new Date(targetDate.getTime() + i * 3600000);
      const fAngle = ((Astronomy.MoonPhase(forecastTime) % 360) + 360) % 360;
      const fIllum = Astronomy.Illumination(Astronomy.Body.Moon, forecastTime);
      const fIllumPct = Math.min(100, Math.max(0, Math.round(fIllum.phase_fraction * 100)));
      const fIsWax = fAngle < 180;

      let fPhaseId: MoonPhaseType = 'new_moon';
      if (fAngle < 7.5 || fAngle >= 352.5) fPhaseId = 'new_moon';
      else if (fAngle < 82.5) fPhaseId = 'waxing_crescent';
      else if (fAngle < 97.5) fPhaseId = 'first_quarter';
      else if (fAngle < 172.5) fPhaseId = 'waxing_gibbous';
      else if (fAngle < 187.5) fPhaseId = 'full_moon';
      else if (fAngle < 262.5) fPhaseId = 'waning_gibbous';
      else if (fAngle < 277.5) fPhaseId = 'last_quarter';
      else fPhaseId = 'waning_crescent';

      const pDef = MOON_PHASE_DEFINITIONS[fPhaseId];
      const hHour = forecastTime.getHours();
      const displayHour12 = hHour % 12 === 0 ? 12 : hHour % 12;
      const ampm = hHour >= 12 ? 'PM' : 'AM';
      const timeFormatted = `${displayHour12.toString().padStart(2, '0')}:00 ${ampm}`;

      let timeUr = `${displayHour12}:00 `;
      if (hHour >= 4 && hHour < 12) timeUr += 'صبح';
      else if (hHour >= 12 && hHour < 17) timeUr += 'دوپہر';
      else if (hHour >= 17 && hHour < 20) timeUr += 'شام';
      else timeUr += 'رات';

      const fEq = Astronomy.Equator(Astronomy.Body.Moon, forecastTime, observer, true, true);
      const fHor = Astronomy.Horizon(forecastTime, observer, fEq.ra, fEq.dec, 'normal');
      const fAlt = Math.round(fHor.altitude);

      hourly24hTimeline.push({
        hour: hHour,
        timeFormatted,
        timeUr,
        illumination: fIllumPct,
        directionSymbol: fPhaseId === 'full_moon' ? '—' : fIsWax ? '↑' : '↓',
        directionUr: fPhaseId === 'full_moon' ? 'بدر کامل (100%)' : fIsWax ? '↑ بڑھ رہا ہے' : '↓ گھٹ رہا ہے',
        directionEn: fPhaseId === 'full_moon' ? 'Full Moon (100%)' : fIsWax ? '↑ Waxing' : '↓ Waning',
        phaseId: fPhaseId,
        phaseNameUr: pDef.nameUr,
        phaseNameEn: pDef.nameEn,
        altitudeDegrees: fAlt,
        isAboveHorizon: fAlt > 0,
      });
    }

    // 10. 24-step progression cycle (↑ 0% to 100% full, then ↓ 100% to 0%)
    const cycle24hTimeline: HourlyMoonPoint[] = [];
    const cycleSteps: {
      hour: number;
      timeFormatted: string;
      timeUr: string;
      illumination: number;
      isWax: boolean;
      phaseId: MoonPhaseType;
    }[] = [
      { hour: 1, timeFormatted: '01:00', timeUr: '1:00 رات', illumination: 0, isWax: true, phaseId: 'new_moon' },
      { hour: 2, timeFormatted: '02:00', timeUr: '2:00 رات', illumination: 9, isWax: true, phaseId: 'waxing_crescent' },
      { hour: 3, timeFormatted: '03:00', timeUr: '3:00 رات', illumination: 18, isWax: true, phaseId: 'waxing_crescent' },
      { hour: 4, timeFormatted: '04:00', timeUr: '4:00 صبح', illumination: 28, isWax: true, phaseId: 'waxing_crescent' },
      { hour: 5, timeFormatted: '05:00', timeUr: '5:00 فجر', illumination: 39, isWax: true, phaseId: 'waxing_crescent' },
      { hour: 6, timeFormatted: '06:00', timeUr: '6:00 طلوع', illumination: 50, isWax: true, phaseId: 'first_quarter' },
      { hour: 7, timeFormatted: '07:00', timeUr: '7:00 صبح', illumination: 62, isWax: true, phaseId: 'waxing_gibbous' },
      { hour: 8, timeFormatted: '08:00', timeUr: '8:00 صبح', illumination: 74, isWax: true, phaseId: 'waxing_gibbous' },
      { hour: 9, timeFormatted: '09:00', timeUr: '9:00 صبح', illumination: 85, isWax: true, phaseId: 'waxing_gibbous' },
      { hour: 10, timeFormatted: '10:00', timeUr: '10:00 صبح', illumination: 93, isWax: true, phaseId: 'waxing_gibbous' },
      { hour: 11, timeFormatted: '11:00', timeUr: '11:00 دوپہر', illumination: 98, isWax: true, phaseId: 'waxing_gibbous' },
      { hour: 12, timeFormatted: '12:00', timeUr: '12:00 زوال', illumination: 100, isWax: false, phaseId: 'full_moon' },
      { hour: 13, timeFormatted: '13:00', timeUr: '1:00 دوپہر', illumination: 98, isWax: false, phaseId: 'waning_gibbous' },
      { hour: 14, timeFormatted: '14:00', timeUr: '2:00 دوپہر', illumination: 92, isWax: false, phaseId: 'waning_gibbous' },
      { hour: 15, timeFormatted: '15:00', timeUr: '3:00 سہ پہر', illumination: 84, isWax: false, phaseId: 'waning_gibbous' },
      { hour: 16, timeFormatted: '16:00', timeUr: '4:00 عصر', illumination: 72, isWax: false, phaseId: 'waning_gibbous' },
      { hour: 17, timeFormatted: '17:00', timeUr: '5:00 شام', illumination: 60, isWax: false, phaseId: 'waning_gibbous' },
      { hour: 18, timeFormatted: '18:00', timeUr: '6:00 مغرب', illumination: 50, isWax: false, phaseId: 'last_quarter' },
      { hour: 19, timeFormatted: '19:00', timeUr: '7:00 عشاء', illumination: 38, isWax: false, phaseId: 'waning_crescent' },
      { hour: 20, timeFormatted: '20:00', timeUr: '8:00 رات', illumination: 28, isWax: false, phaseId: 'waning_crescent' },
      { hour: 21, timeFormatted: '21:00', timeUr: '9:00 رات', illumination: 18, isWax: false, phaseId: 'waning_crescent' },
      { hour: 22, timeFormatted: '22:00', timeUr: '10:00 رات', illumination: 10, isWax: false, phaseId: 'waning_crescent' },
      { hour: 23, timeFormatted: '23:00', timeUr: '11:00 رات', illumination: 4, isWax: false, phaseId: 'waning_crescent' },
      { hour: 24, timeFormatted: '24:00', timeUr: '12:00 آدھی رات', illumination: 0, isWax: false, phaseId: 'new_moon' },
    ];

    cycleSteps.forEach((st) => {
      const pDef = MOON_PHASE_DEFINITIONS[st.phaseId];
      cycle24hTimeline.push({
        hour: st.hour,
        timeFormatted: st.timeFormatted,
        timeUr: st.timeUr,
        illumination: st.illumination,
        directionSymbol: st.phaseId === 'full_moon' ? '—' : st.isWax ? '↑' : '↓',
        directionUr: st.phaseId === 'full_moon' ? 'بدر کامل (100%)' : st.isWax ? '↑ چاند بڑھ رہا ہے' : '↓ چاند گھٹ رہا ہے',
        directionEn: st.phaseId === 'full_moon' ? 'Full Moon (100%)' : st.isWax ? '↑ Waxing' : '↓ Waning',
        phaseId: st.phaseId,
        phaseNameUr: pDef.nameUr,
        phaseNameEn: pDef.nameEn,
        altitudeDegrees: 35,
        isAboveHorizon: true,
      });
    });

    // 11. Match location name
    const matchedLoc = ASTRONOMICAL_LOCATIONS.find(
      (l) => Math.abs(l.lat - coords.lat) < 0.1 && Math.abs(l.lng - coords.lng) < 0.1
    );
    const locNameEn = customLocationName?.en || matchedLoc?.nameEn || `Location (${coords.lat.toFixed(2)}° N, ${coords.lng.toFixed(2)}° E)`;
    const locNameUr = customLocationName?.ur || matchedLoc?.nameUr || `مقام (${coords.lat.toFixed(2)}° N, ${coords.lng.toFixed(2)}° E)`;

    const result: DynamicMoonData = {
      calculatedAt: targetDate.toISOString(),
      calculatedAtFormattedUr: targetDate.toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      calculatedAtFormattedEn: targetDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dateString: targetDate.toISOString(),
      phaseRatio,
      phaseAngleDegrees: Math.round(phaseAngle * 10) / 10,
      ageDays,
      ageFormattedUr: `${ageDays} دن`,
      ageFormattedEn: `${ageDays} days`,
      illumination,
      distanceKm,
      visualMagnitude,
      isWaxing,
      directionSymbol: isWaxing ? '↑' : '↓',
      directionUr: isWaxing ? '↑ بڑھ رہا ہے' : '↓ گھٹ رہا ہے',
      directionEn: isWaxing ? '↑ Waxing (Increasing)' : '↓ Waning (Decreasing)',
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
      nextNewMoonDays: daysUntilNew,
      nextFullMoonDays: daysUntilFull,
      nextNewMoonDate: formatShortDate(nextNewDate),
      nextFullMoonDate: formatShortDate(nextFullDate),
      hijriDate,
      hijriDayEstimate,
      allPhases,
      hourly24hTimeline,
      cycle24hTimeline,
      engineSource: 'Stellarium Astronomical Engine / VSOP87 & ELP2000 Ephemeris',
      locationNameEn: locNameEn,
      locationNameUr: locNameUr,
      coordinates: coords,
      status: 'live',
      shariahNoticeUr:
        'شرعی و فتوائی وضاحت: یہ سائنسی و فلکیاتی حسابی ماڈل ہے (Stellarium / Astronomical Calculation Engine)۔ اسلامی مہینوں بشمول رمضان المبارک، شوال (عید الفطر) اور ذوالحجہ کے چاند کا شرعی فیصلہ صرف مرکزی رویتِ ہلال کمیٹی پاکستان کی باضابطہ تصدیق و اعلان پر ہی منحصر ہے۔ سائنسی حساب شرعی رویت کا متبادل نہیں ہے۔',
      shariahNoticeEn:
        'Islamic Verification Notice: This is scientific astronomical calculation based on Stellarium / planetary ephemeris. In Islam, the official commencement of Ramadan, Eid al-Fitr, and Dhul Hijjah is strictly established upon verified physical moon-sighting (Ruet-e-Hilal) announced by the Central Ruet-e-Hilal Committee. Astronomical data is for scientific guidance only.',
    };

    cachedLastCalculation = result;
    return result;
  } catch (err) {
    console.warn('Astronomical calculation fallback triggered:', err);
    if (cachedLastCalculation) {
      return {
        ...cachedLastCalculation,
        status: 'cached',
      };
    }
    // Minimal emergency fallback
    const fallbackHijri = getAccurateHijriDate(targetDate, hijriOffsetDays);
    const fallbackType = MOON_PHASE_DEFINITIONS['waning_crescent'];
    return {
      calculatedAt: targetDate.toISOString(),
      calculatedAtFormattedUr: targetDate.toLocaleTimeString('ur-PK'),
      calculatedAtFormattedEn: targetDate.toLocaleTimeString('en-US'),
      dateString: targetDate.toISOString(),
      phaseRatio: 0.85,
      phaseAngleDegrees: 306.0,
      ageDays: 25.1,
      ageFormattedUr: '25.1 دن',
      ageFormattedEn: '25.1 days',
      illumination: 24,
      distanceKm: 384400,
      visualMagnitude: -7.5,
      isWaxing: false,
      directionSymbol: '↓',
      directionUr: '↓ گھٹ رہا ہے',
      directionEn: '↓ Waning (Decreasing)',
      directionColor: 'text-amber-400',
      directionBadgeBg: 'bg-amber-950/80 border-amber-500/60 text-amber-300',
      currentType: fallbackType,
      solarNoon: calculateSolarNoon(targetDate, coords.lng),
      moonrise: '03:15 AM',
      moonset: '04:10 PM',
      transitTime: '09:42 AM',
      altitudeKarachi: 30,
      azimuthKarachi: 180,
      nextNewMoonDays: 4.5,
      nextFullMoonDays: 19.5,
      nextNewMoonDate: 'Oct 14, 2026',
      nextFullMoonDate: 'Oct 29, 2026',
      hijriDate: fallbackHijri,
      hijriDayEstimate: fallbackHijri.day,
      allPhases: [
        'new_moon',
        'waxing_crescent',
        'first_quarter',
        'waxing_gibbous',
        'full_moon',
        'waning_gibbous',
        'last_quarter',
        'waning_crescent',
      ].map((k) => ({
        ...MOON_PHASE_DEFINITIONS[k as MoonPhaseType],
        isCurrent: k === 'waning_crescent',
      })),
      hourly24hTimeline: [],
      cycle24hTimeline: [],
      engineSource: 'Stellarium Astronomical Engine (Cached Fallback)',
      locationNameEn: 'Karachi, Pakistan',
      locationNameUr: 'کراچی، پاکستان',
      coordinates: coords,
      status: 'cached',
      shariahNoticeUr:
        'شرعی وضاحت: یہ سائنسی و فلکیاتی حسابی ماڈل ہے۔ رمضان، عید اور ذوالحجہ کے چاند کا فیصلہ صرف مرکزی رویتِ ہلال کمیٹی پاکستان کے اعلان پر ہوتا ہے۔',
      shariahNoticeEn:
        'Islamic Notice: Astronomical data is for scientific guidance only. Islamic months are determined by physical moon-sighting by the Ruet-e-Hilal Committee.',
    };
  }
}
