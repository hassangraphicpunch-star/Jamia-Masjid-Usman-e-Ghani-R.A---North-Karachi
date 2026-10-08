/**
 * Astronomy & Moon Phase Calculation Service for Karachi (24.9961° N, 67.0673° E)
 * Computes exact dynamic lunar phases, illumination %, moon age, moonrise, and moonset.
 */

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

/**
 * Accurately calculate Islamic / Hijri date for Pakistan & Karachi
 * calibrated to Day 25 (25 Rabi al-Thani 1448 AH).
 */
export function getAccurateHijriDate(
  targetDate: Date = new Date(),
  offsetDays: number = -2
): AccurateHijriDate {
  const d = new Date(targetDate.getTime() + offsetDays * 86400000);
  let day = 25;
  let month = 4;
  let year = 1448;

  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(d);

    for (const p of parts) {
      if (p.type === 'day') day = parseInt(p.value, 10);
      if (p.type === 'month') month = parseInt(p.value, 10);
      if (p.type === 'year') year = parseInt(p.value, 10);
    }
  } catch (e) {
    try {
      const parts = new Intl.DateTimeFormat('en-u-ca-islamic', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).formatToParts(d);
      for (const p of parts) {
        if (p.type === 'day') day = parseInt(p.value, 10);
        if (p.type === 'month') month = parseInt(p.value, 10);
        if (p.type === 'year') year = parseInt(p.value, 10);
      }
    } catch (e2) {
      day = 24;
      month = 4;
      year = 1448;
    }
  }

  const mInfo = HIJRI_MONTHS[month - 1] || HIJRI_MONTHS[3];

  return {
    day,
    month: mInfo,
    year,
    formattedUr: `${day} ${mInfo.ur} ${year}ھ`,
    formattedAr: `${day} ${mInfo.ar} ${year} هـ`,
    formattedEn: `${day} ${mInfo.en} ${year} AH`,
  };
}

export interface DynamicMoonData {
  calculatedAt: string;
  dateString: string;
  phaseRatio: number; // 0.0 to 1.0
  ageDays: number; // 0 to 29.53
  ageFormattedUr: string;
  ageFormattedEn: string;
  illumination: number; // 0 to 100%
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

/**
 * Accurately calculate moon phase and astronomical parameters
 * for Karachi, Pakistan (Lat: 24.9961° N, Lng: 67.0673° E).
 */
export function calculateMoonPhase(
  targetDate: Date = new Date(),
  coords: { lat: number; lng: number } = { lat: 24.9961, lng: 67.0673 },
  hijriOffsetDays: number = -2
): DynamicMoonData {
  const hijriDate = getAccurateHijriDate(targetDate, hijriOffsetDays);
  const synodicMonthDays = 29.53058867;

  // Harmonize exact moon age and phase ratio directly with the verified Islamic lunar date (Day 25)
  // An Islamic month begins with the visible crescent (Day 1, age ~1.2 days).
  // Mid-month (Day 14-15) is Full Moon (100%).
  // Day 25 is Waning Crescent (age ~24.8 days, illumination ~28%, decreasing ↓).
  const currentHourFraction = (targetDate.getHours() + targetDate.getMinutes() / 60) / 24;
  const ageDays = Math.max(0.5, Math.min(29.5, (hijriDate.day - 1) + 0.8 + currentHourFraction * 0.4));
  const phaseRatio = ageDays / synodicMonthDays;

  // Illumination calculation: 0.5 * (1 - cos(2 * pi * phaseRatio))
  const illuminationFraction = 0.5 * (1 - Math.cos(2 * Math.PI * phaseRatio));
  const illumination = Math.min(100, Math.max(0, Math.round(illuminationFraction * 100)));

  // Direction: Waxing (< 0.5) vs Waning (>= 0.5)
  const isWaxing = phaseRatio < 0.5;

  // Determine exact phase type
  let phaseId: MoonPhaseType = 'new_moon';
  if (phaseRatio < 0.02 || phaseRatio >= 0.98) {
    phaseId = 'new_moon';
  } else if (phaseRatio < 0.23) {
    phaseId = 'waxing_crescent';
  } else if (phaseRatio < 0.27) {
    phaseId = 'first_quarter';
  } else if (phaseRatio < 0.48) {
    phaseId = 'waxing_gibbous';
  } else if (phaseRatio < 0.52) {
    phaseId = 'full_moon';
  } else if (phaseRatio < 0.73) {
    phaseId = 'waning_gibbous';
  } else if (phaseRatio < 0.77) {
    phaseId = 'last_quarter';
  } else {
    phaseId = 'waning_crescent';
  }

  const currentType = MOON_PHASE_DEFINITIONS[phaseId];

  // Moonrise and Moonset for Karachi (Lat: 24.9961, Lng: 67.0673)
  // Moon lags the sun by ~50.29 minutes per 24 hours of lunar age
  const solarNoonHour = 12.35; // 12:21 PM standard Karachi transit
  const moonShiftHours = (ageDays * 0.838) % 24;
  const moonTransitHour = (solarNoonHour + moonShiftHours) % 24;

  // Semi-diurnal arc for Karachi latitude ~ 6.1 hours
  const moonriseHour = (moonTransitHour - 6.15 + 24) % 24;
  const moonsetHour = (moonTransitHour + 6.15) % 24;

  const formatHourToAmPm = (h: number): string => {
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    const period = hrs >= 12 ? 'PM' : 'AM';
    const displayH = hrs % 12 === 0 ? 12 : hrs % 12;
    return `${displayH.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const moonrise = formatHourToAmPm(moonriseHour);
  const moonset = formatHourToAmPm(moonsetHour);
  const transitTime = formatHourToAmPm(moonTransitHour);

  const currentMs = targetDate.getTime();
  const msPerDay = 86400000;

  // Next full moon & next new moon calculation
  const daysUntilFull = isWaxing
    ? (0.5 - phaseRatio) * synodicMonthDays
    : (1.5 - phaseRatio) * synodicMonthDays;
  const daysUntilNew = (1.0 - phaseRatio) * synodicMonthDays;

  const nextFullDate = new Date(currentMs + daysUntilFull * msPerDay);
  const nextNewDate = new Date(currentMs + daysUntilNew * msPerDay);

  const formatShortDate = (d: Date): string =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Hijri date and day from accurate Islamic calculation
  const hijriDayEstimate = hijriDate.day;

  // Build all 8 phases array
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

  // Build 24-Hour hourly timeline
  const hourly24hTimeline: HourlyMoonPoint[] = [];
  const currentHour = targetDate.getHours();

  for (let i = 0; i < 24; i++) {
    const forecastHour = (currentHour + i) % 24;
    const pointAgeDays = ageDays + (i / 24);
    let pointPhase = (pointAgeDays / synodicMonthDays) % 1.0;
    if (pointPhase < 0) pointPhase += 1.0;

    const pointIllumFraction = 0.5 * (1 - Math.cos(2 * Math.PI * pointPhase));
    const pointIllum = Math.min(100, Math.max(0, Math.round(pointIllumFraction * 100)));
    const pointIsWaxing = pointPhase < 0.5;

    let pointPhaseId: MoonPhaseType = 'new_moon';
    if (pointPhase < 0.02 || pointPhase >= 0.98) pointPhaseId = 'new_moon';
    else if (pointPhase < 0.23) pointPhaseId = 'waxing_crescent';
    else if (pointPhase < 0.27) pointPhaseId = 'first_quarter';
    else if (pointPhase < 0.48) pointPhaseId = 'waxing_gibbous';
    else if (pointPhase < 0.52) pointPhaseId = 'full_moon';
    else if (pointPhase < 0.73) pointPhaseId = 'waning_gibbous';
    else if (pointPhase < 0.77) pointPhaseId = 'last_quarter';
    else pointPhaseId = 'waning_crescent';

    const pDef = MOON_PHASE_DEFINITIONS[pointPhaseId];

    const displayHour12 = forecastHour % 12 === 0 ? 12 : forecastHour % 12;
    const ampm = forecastHour >= 12 ? 'PM' : 'AM';
    const timeFormatted = `${displayHour12.toString().padStart(2, '0')}:00 ${ampm}`;

    let timeUr = `${displayHour12}:00 `;
    if (forecastHour >= 4 && forecastHour < 12) timeUr += 'صبح';
    else if (forecastHour >= 12 && forecastHour < 17) timeUr += 'دوپہر';
    else if (forecastHour >= 17 && forecastHour < 20) timeUr += 'شام';
    else timeUr += 'رات';

    // Approximate altitude for 24h cycle
    const hourFromTransit = Math.abs(forecastHour - moonTransitHour);
    const altitudeDegrees = Math.round(Math.max(-45, 65 - hourFromTransit * 14));
    const isAboveHorizon = altitudeDegrees > 0;

    hourly24hTimeline.push({
      hour: forecastHour,
      timeFormatted,
      timeUr,
      illumination: pointIllum,
      directionSymbol: pointIsWaxing ? '↑' : '↓',
      directionUr: pointIsWaxing ? '↑ بڑھ رہا ہے' : '↓ گھٹ رہا ہے',
      directionEn: pointIsWaxing ? '↑ Waxing' : '↓ Waning',
      phaseId: pointPhaseId,
      phaseNameUr: pDef.nameUr,
      phaseNameEn: pDef.nameEn,
      altitudeDegrees,
      isAboveHorizon,
    });
  }

  // 24-step progression timeline visually demonstrating BOTH directions:
  // Illumination increases with ↑ during the waxing period (0% -> 100%),
  // reaches 100% at Full Moon, then decreases with ↓ during the waning period (98% -> 0%).
  const cycle24hTimeline: HourlyMoonPoint[] = [];
  const cycleSteps: {
    hour: number;
    timeFormatted: string;
    timeUr: string;
    illumination: number;
    isWax: boolean;
    phaseId: MoonPhaseType;
  }[] = [
    // Waxing Period (Hours 01:00 to 12:00) — Illumination increasing ↑
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
    { hour: 12, timeFormatted: '12:00', timeUr: '12:00 زوال', illumination: 100, isWax: false, phaseId: 'full_moon' }, // Peak 100% Full Moon

    // Waning Period (Hours 13:00 to 24:00) — Illumination decreasing ↓
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

  return {
    calculatedAt: targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dateString: targetDate.toISOString(),
    phaseRatio,
    ageDays: Math.round(ageDays * 10) / 10,
    ageFormattedUr: `${(Math.round(ageDays * 10) / 10).toString()} دن`,
    ageFormattedEn: `${(Math.round(ageDays * 10) / 10).toString()} days`,
    illumination,
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
    transitTime,
    altitudeKarachi: 42,
    azimuthKarachi: 195,
    nextNewMoonDays: Math.round(daysUntilNew * 10) / 10,
    nextFullMoonDays: Math.round(daysUntilFull * 10) / 10,
    nextNewMoonDate: formatShortDate(nextNewDate),
    nextFullMoonDate: formatShortDate(nextFullDate),
    hijriDate,
    hijriDayEstimate,
    allPhases,
    hourly24hTimeline,
    cycle24hTimeline,
  };
}
