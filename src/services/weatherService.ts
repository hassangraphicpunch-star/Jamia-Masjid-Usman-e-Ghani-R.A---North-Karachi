import { calculateMoonPhase } from './astronomyService';

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  dewPoint: number;
  isDay: boolean;
  precipitation: number;
  precipitationProbability?: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windDirectionCompass: string;
  windGusts: number;
  surfacePressure: number;
  uvIndex: number;
  visibility: number;
  cloudCover: number;
  time: string;
  conditionUr: string;
  conditionEn: string;
  iconName: 'sun' | 'moon' | 'cloud-sun' | 'cloud-moon' | 'cloud' | 'cloud-rain' | 'cloud-lightning' | 'cloud-fog';
  seaBreezeStatusUr: string;
  seaBreezeStatusEn: string;
}

export interface HourlyForecast {
  time: string;
  timeUr: string;
  hour: number;
  temp: number;
  apparentTemp: number;
  weatherCode: number;
  conditionUr: string;
  conditionEn: string;
  iconName: CurrentWeather['iconName'];
  pop: number; // probability of precipitation %
  humidity: number;
  windSpeed: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  dayNameEn: string;
  dayNameUr: string;
  tempMax: number;
  tempMin: number;
  apparentMax?: number;
  apparentMin?: number;
  precipitationProbability?: number;
  precipitationSum?: number;
  uvIndexMax?: number;
  windSpeedMax?: number;
  windDirection?: string;
  weatherCode: number;
  conditionUr: string;
  conditionEn: string;
  sunrise: string;
  sunset: string;
  dayLength?: string;
  iconName: CurrentWeather['iconName'];
}

export interface IslamicWeatherDua {
  id: string;
  titleUr: string;
  titleEn: string;
  occasionUr: string;
  occasionEn: string;
  arabic: string;
  translationUr: string;
  translationEn: string;
  referenceUr: string;
  referenceEn: string;
}

export interface KarachiWeatherData {
  locationEn: string;
  locationUr: string;
  areaEn: string;
  areaUr: string;
  coordinates: { lat: number; lng: number };
  elevation: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  airQuality: {
    aqi: number;
    pm25: number;
    pm10: number;
    dust: number;
    statusEn: string;
    statusUr: string;
    color: string;
    healthAdviceUr: string;
    healthAdviceEn: string;
  };
  sunAndMoon: {
    sunrise: string;
    solarNoon: string;
    sunset: string;
    dayLength: string;
    moonPhaseUr: string;
    moonPhaseEn: string;
    moonIllumination: number;
  };
  islamicDuas?: IslamicWeatherDua[];
  lastUpdated: string;
  islamicWeatherNotes: {
    titleUr: string;
    titleEn: string;
    duaArabic: string;
    duaTranslationUr: string;
    duaTranslationEn: string;
    hadithNoteUr: string;
    hadithNoteEn: string;
  };
}

export const ISLAMIC_WEATHER_DUAS: IslamicWeatherDua[] = [
  {
    id: 'dua-wind',
    titleUr: 'تیز ہوا اور آندھی کی دعا',
    titleEn: 'Dua When Strong Winds Blow',
    occasionUr: 'جب تیز آندھی یا ہوا کے تیز جھکڑ چلیں',
    occasionEn: 'Recited during dust storms, strong coastal gales, or harsh winds',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا فِيهَا وَخَيْرَ مَا أُرْسِلَتْ بِهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا فِيهَا وَشَرِّ مَا أُرْسِلَتْ بِهِ',
    translationUr: 'اے اللہ! میں تجھ سے اس ہوا کی خیر، اس میں جو کچھ خیر ہے اس کی بھلائی، اور جس مقصد کے ساتھ یہ بھیجی گئی ہے اس کی بہتری مانگتا ہوں؛ اور میں اس کے شر، اس کے اندر کے شر، اور جس مقصد سے یہ بھیجی گئی ہے اس کے شر سے تیری پناہ چاہتا ہوں۔',
    translationEn: 'O Allah, I ask You for its good, the good that it contains, and the good of that with which it was sent. I seek refuge in You from its evil, the evil that it contains, and the evil of that with which it was sent.',
    referenceUr: 'صحیح مسلم: 899 (روایت: حضرت عائشہ صدیقہ رضی اللہ عنہا)',
    referenceEn: 'Sahih Muslim: 899 (Narrated by Aisha R.A)',
  },
  {
    id: 'dua-rain-start',
    titleUr: 'بارش شروع ہوتے وقت کی دعا',
    titleEn: 'Dua When Rain Begins (Beneficial Rain)',
    occasionUr: 'جب پہلی بوندیں گریں یا ابرِ رحمت برسنا شروع ہو',
    occasionEn: 'Recited upon the first drops and throughout peaceful rain',
    arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
    translationUr: 'اے اللہ! اس بارش کو نفع بخش اور خوب برسنے والی بنا دے۔',
    translationEn: 'O Allah, make it a beneficial, fruitful, and blessed downpour.',
    referenceUr: 'صحیح بخاری: 1032 (روایت: ام المومنین حضرت عائشہ رضی اللہ عنہا)',
    referenceEn: 'Sahih Bukhari: 1032 (Narrated by Aisha R.A)',
  },
  {
    id: 'dua-thunder',
    titleUr: 'گرج چمک اور کڑک سنتے وقت کی دعا',
    titleEn: 'Dua Upon Hearing Thunder & Lightning',
    occasionUr: 'جب بادلوں کی گرج یا آسمانی بجلی کی کڑک سنائی دے',
    occasionEn: 'Recited with reverence upon hearing thunder or seeing bolts',
    arabic: 'سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلاَئِكَةُ مِنْ خِيفَتِهِ',
    translationUr: 'پاک ہے وہ ذات جس کی حمد و ثناء کے ساتھ گرج تسبیح کرتی ہے، اور فرشتے اس کے رعب و جلال سے لرزاں ہیں۔',
    translationEn: 'Glory be to Him Whom the thunder glorifies with His praise, and the angels out of fear of Him.',
    referenceUr: 'موطأ امام مالک: 1801، الادب المفرد للبخاری (صحیح الاسناد)',
    referenceEn: 'Muwatta Imam Malik: 1801, Al-Adab Al-Mufrad (Sahih)',
  },
  {
    id: 'dua-heavy-rain',
    titleUr: 'شدید بارش اور سیلاب کے خدشے کی دعا',
    titleEn: 'Dua to Divert Harmful Torrential Rain',
    occasionUr: 'جب بارش اتنی شدید ہو کہ نقصانات یا نکاسی کے مسائل کا اندیشہ ہو',
    occasionEn: 'Recited when rain becomes excessively heavy or poses flooding risk',
    arabic: 'اللَّهُمَّ حَوَالَيْنَا وَلاَ عَلَيْنَا، اللَّهُمَّ عَلَى الآكَامِ وَالظِّرَابِ وَبُطُونِ الأَوْدِيَةِ وَمَنَابِتِ الشَّجَرِ',
    translationUr: 'اے اللہ! ہمارے ارد گرد برسا، ہمارے اوپر (نقصان کی صورت میں) نہ برسا؛ اے اللہ! ٹیلوں، پہاڑیوں، وادیوں کے پیٹوں اور درخت اگنے کے مقامات پر برسا۔',
    translationEn: 'O Allah, let it fall around us and not upon us. O Allah, let it fall on plateaus, hillocks, valleys, and forest basins.',
    referenceUr: 'صحیح بخاری: 1014، صحیح مسلم: 897 (حدیثِ استسقاء)',
    referenceEn: 'Sahih Bukhari: 1014, Sahih Muslim: 897',
  },
  {
    id: 'dua-after-rain',
    titleUr: 'بارش تھمنے کے بعد شکر گزاری کی دعا',
    titleEn: 'Dua After Rainfall Ceases (Gratitude)',
    occasionUr: 'بارش کے اختتام پر اللہ کی رحمت کا اعتراف',
    occasionEn: 'Sunnah remembrance recognizing that rain was pure divine mercy',
    arabic: 'مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ',
    translationUr: 'ہم پر اللہ تعالیٰ کے فضل اور اس کی رحمت سے بارش نازل ہوئی۔',
    translationEn: 'We have been given rain by the grace and mercy of Allah.',
    referenceUr: 'صحیح بخاری: 846، صحیح مسلم: 71',
    referenceEn: 'Sahih Bukhari: 846, Sahih Muslim: 71',
  },
  {
    id: 'dua-extreme-heat',
    titleUr: 'شدید گرمی، حبس اور لو کی دعا و سنت',
    titleEn: 'Dua & Sunnah in Extreme Heat / Heatwave',
    occasionUr: 'شہر قائد میں سخت دھوپ، حبس اور گرمی کی لہر کے دوران',
    occasionEn: 'Observing the Prophetic instruction to cool prayer in intense heat',
    arabic: 'لاَ إِلَهَ إِلاَّ اللَّهُ، مَا أَشَدَّ حَرَّ هَذَا الْيَوْمِ، اللَّهُمَّ أَجِرْنِي مِنْ حَرِّ جَهَنَّمَ',
    translationUr: 'اللہ کے سوا کوئی معبود نہیں، آج کے دن کیسی شدید گرمی ہے! اے اللہ! مجھے جہنم کی گرمی اور بھپک سے پناہ عطا فرما۔',
    translationEn: 'There is no god but Allah; how intense is the heat of this day! O Allah, protect me from the scorching heat of Hell.',
    referenceUr: 'ابن السنی: عمل الیوم واللیلہ، صحیح بخاری: 536 (سنتِ ابراد: ظہر ٹھنڈی کر کے پڑھنا)',
    referenceEn: 'Ibn As-Sunni (Amal Al-Yawm), Sahih Bukhari: 536 (Sunnah of Cooling Dhuhr)',
  },
  {
    id: 'dua-istisqa',
    titleUr: 'بارش طلب کرنے کی دعا (دعائے استسقاء)',
    titleEn: 'Dua for Rain During Dry Spells (Istisqa)',
    occasionUr: 'خشک سالی اور بارش کی تاخیر پر اللہ کے حضور التجاء',
    occasionEn: 'Supplication asking Allah to bless the land with refreshing showers',
    arabic: 'اللَّهُمَّ اسْقِ عِبَادَكَ وَبَهَائِمَكَ، وَانْشُرْ رَحْمَتَكَ، وَأَحْيِ بَلَدَكَ الْمَيِّتَ',
    translationUr: 'اے اللہ! اپنے بندوں اور اپنے چوپایوں کو سیراب فرما، اپنی رحمت کو پھیلا دے اور اپنے مردہ شہر کو زندگی بخش دے۔',
    translationEn: 'O Allah, give water to Your servants and beasts, spread Your mercy, and revive Your dead land.',
    referenceUr: 'سنن ابی داؤد: 1176، حسن درجہ کی روایت',
    referenceEn: 'Sunan Abi Dawud: 1176 (Hasan)',
  },
];

export function getWeatherConditionInfo(code: number, isDay: boolean): {
  conditionUr: string;
  conditionEn: string;
  iconName: CurrentWeather['iconName'];
} {
  switch (code) {
    case 0:
      return {
        conditionUr: isDay ? 'صاف و روشن دھوپ' : 'صاف و پرسکون رات',
        conditionEn: isDay ? 'Clear Sky / Sunny' : 'Clear Sky / Night',
        iconName: isDay ? 'sun' : 'moon',
      };
    case 1:
      return {
        conditionUr: isDay ? 'زیادہ تر صاف دھوپ' : 'زیادہ تر صاف رات',
        conditionEn: isDay ? 'Mainly Sunny' : 'Mainly Clear Night',
        iconName: isDay ? 'cloud-sun' : 'cloud-moon',
      };
    case 2:
      return {
        conditionUr: 'جزوی ابر آلود',
        conditionEn: 'Partly Cloudy',
        iconName: isDay ? 'cloud-sun' : 'cloud-moon',
      };
    case 3:
      return {
        conditionUr: 'مکمل ابر آلود',
        conditionEn: 'Overcast',
        iconName: 'cloud',
      };
    case 45:
    case 48:
      return {
        conditionUr: 'دھند / کہر (Haze)',
        conditionEn: 'Fog / Haze',
        iconName: 'cloud-fog',
      };
    case 51:
    case 53:
    case 55:
      return {
        conditionUr: 'ہلکی بوندا باندی',
        conditionEn: 'Light Drizzle',
        iconName: 'cloud-rain',
      };
    case 61:
    case 63:
    case 65:
      return {
        conditionUr: 'بارش / بارانِ رحمت',
        conditionEn: 'Rain Showers',
        iconName: 'cloud-rain',
      };
    case 80:
    case 81:
    case 82:
      return {
        conditionUr: 'تیز بارش کی پھوار',
        conditionEn: 'Heavy Showers',
        iconName: 'cloud-rain',
      };
    case 95:
    case 96:
    case 99:
      return {
        conditionUr: 'گرج چمک و طوفانی بارش',
        conditionEn: 'Thunderstorm',
        iconName: 'cloud-lightning',
      };
    default:
      return {
        conditionUr: isDay ? 'معتدل موسم' : 'پرسکون رات',
        conditionEn: isDay ? 'Moderate Weather' : 'Pleasant Night',
        iconName: isDay ? 'sun' : 'moon',
      };
  }
}

export function getWindCompass(deg: number): { en: string; ur: string } {
  const directions = [
    { en: 'N (North)', ur: 'شمالی (North)' },
    { en: 'NNE', ur: 'شمال شمال مشرقی' },
    { en: 'NE (Northeast)', ur: 'شمال مشرقی' },
    { en: 'ENE', ur: 'مشرق شمال مشرقی' },
    { en: 'E (East)', ur: 'مشرقی (East)' },
    { en: 'ESE', ur: 'مشرق جنوب مشرقی' },
    { en: 'SE (Southeast)', ur: 'جنوب مشرقی' },
    { en: 'SSE', ur: 'جنوب جنوب مشرقی' },
    { en: 'S (South)', ur: 'جنوبی (South)' },
    { en: 'SSW', ur: 'جنوب جنوب مغربی' },
    { en: 'SW (Arabian Sea Coastal Breeze)', ur: 'جنوب مغربی (بحیرہ عرب کی سمندری ہوا)' },
    { en: 'WSW (Coastal Breeze)', ur: 'مغرب جنوب مغربی (سمندری ہوا)' },
    { en: 'W (West)', ur: 'مغربی (West)' },
    { en: 'WNW', ur: 'مغرب شمال مغربی' },
    { en: 'NW (Northwest)', ur: 'شمال مغربی' },
    { en: 'NNW', ur: 'شمال شمال مغربی' },
  ];
  const idx = Math.round(deg / 22.5) % 16;
  return directions[idx];
}

export function getUVLevel(uv: number): {
  levelEn: string;
  levelUr: string;
  color: string;
  adviceUr: string;
  adviceEn: string;
} {
  if (uv <= 2) {
    return {
      levelEn: 'Low (0-2)',
      levelUr: 'کم (محفوظ)',
      color: 'text-emerald-400',
      adviceUr: 'دھوپ کی شدت کم ہے، بلا خوف باہر نکلا جا سکتا ہے۔',
      adviceEn: 'Low UV danger, safe for outdoor activities.',
    };
  }
  if (uv <= 5) {
    return {
      levelEn: 'Moderate (3-5)',
      levelUr: 'معتدل (درمیانہ)',
      color: 'text-yellow-400',
      adviceUr: 'دھوپ معتدل ہے، چشمہ اور ٹوپی کا استعمال مفید ہے۔',
      adviceEn: 'Moderate UV, wear sunglasses and a cap outdoors.',
    };
  }
  if (uv <= 7) {
    return {
      levelEn: 'High (6-7)',
      levelUr: 'زیادہ (حفاظت ضروری)',
      color: 'text-amber-400',
      adviceUr: 'دھوپ تیز ہے، دوپہر میں سایہ دار جگہ اختیار فرمائیں۔',
      adviceEn: 'High UV, seek shade during peak midday hours.',
    };
  }
  if (uv <= 10) {
    return {
      levelEn: 'Very High (8-10)',
      levelUr: 'بہت زیادہ (احتیاط)',
      color: 'text-rose-400',
      adviceUr: 'دھوپ کی شدت خطرناک ہے، سر اور آنکھیں ڈھانپیں۔',
      adviceEn: 'Very high UV danger, avoid prolonged direct sun exposure.',
    };
  }
  return {
    levelEn: 'Extreme (11+)',
    levelUr: 'شدید خطرناک (الرٹ)',
    color: 'text-purple-400',
    adviceUr: 'انتہائی شدید شعاعیں، غیر ضروری باہر نکلنے سے گریز کریں۔',
    adviceEn: 'Extreme UV index, stay indoors during peak sunshine hours.',
  };
}

export function getAQILevel(aqi: number): {
  statusEn: string;
  statusUr: string;
  color: string;
  adviceUr: string;
  adviceEn: string;
} {
  if (aqi <= 50) {
    return {
      statusEn: 'Good (0-50)',
      statusUr: 'عمدہ و صاف فضا',
      color: 'text-emerald-400',
      adviceUr: 'ہوا کا معیار بہترین ہے، ہر عمر کے لیے محفوظ ہے۔',
      adviceEn: 'Air quality is satisfactory and poses little or no risk.',
    };
  }
  if (aqi <= 100) {
    return {
      statusEn: 'Moderate (51-100)',
      statusUr: 'قابلِ قبول / معتدل',
      color: 'text-yellow-400',
      adviceUr: 'ہوا کا معیار قابل قبول ہے، الرجک افراد معمولی احتیاط کریں۔',
      adviceEn: 'Acceptable air quality; sensitive people should be cautious.',
    };
  }
  if (aqi <= 150) {
    return {
      statusEn: 'Sensitive Warning (101-150)',
      statusUr: 'حساس افراد کے لیے مضر',
      color: 'text-amber-400',
      adviceUr: 'دمہ اور سانس کے مریض ماسک کا استعمال فرمائیں۔',
      adviceEn: 'Members of sensitive groups may experience health effects.',
    };
  }
  if (aqi <= 200) {
    return {
      statusEn: 'Unhealthy (151-200)',
      statusUr: 'مضرِ صحت فضا',
      color: 'text-rose-400',
      adviceUr: 'فضا میں آلودگی زیادہ ہے، ماسک کا استعمال تجویز کیا جاتا ہے۔',
      adviceEn: 'Everyone may begin to experience health effects; wear mask.',
    };
  }
  return {
    statusEn: 'Hazardous (201+)',
    statusUr: 'شدید مضرِ صحت (الرٹ)',
    color: 'text-purple-400',
    adviceUr: 'انتہائی آلودہ فضا، باہر جانے سے پرہیز کریں۔',
    adviceEn: 'Health alert: emergency conditions, avoid outdoor exposure.',
  };
}

// Fallback Karachi data in case of offline network
export function getFallbackKarachiWeather(): KarachiWeatherData {
  const now = new Date();
  const hour = now.getHours();
  const isDay = hour >= 6 && hour < 18;

  // Generate 24 hours timeline
  const fallbackHourly: HourlyForecast[] = [];
  for (let i = 0; i < 24; i++) {
    const h = (hour + i) % 24;
    const hIsDay = h >= 6 && h < 18;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const temp = Math.round(27 + Math.sin(((h - 6) / 12) * Math.PI) * 6);
    fallbackHourly.push({
      time: `${h12}:00 ${ampm}`,
      timeUr: `${h12}:00 ${ampm === 'PM' ? 'شام' : 'صبح'}`,
      hour: h,
      temp,
      apparentTemp: temp + 3,
      weatherCode: 1,
      conditionUr: hIsDay ? 'صاف دھوپ' : 'پرسکون رات',
      conditionEn: hIsDay ? 'Mainly Sunny' : 'Clear Night',
      iconName: hIsDay ? 'sun' : 'moon',
      pop: 5,
      humidity: Math.round(65 + Math.cos((h / 24) * 2 * Math.PI) * 15),
      windSpeed: Math.round(14 + Math.sin((h / 24) * 2 * Math.PI) * 6),
      isDay: hIsDay,
    });
  }

  const dynamicMoon = calculateMoonPhase(now);

  return {
    locationEn: 'Karachi, Pakistan',
    locationUr: 'کراچی، پاکستان',
    areaEn: 'North Karachi (Sector 5-A/1)',
    areaUr: 'نارتھ کراچی (سیکٹر 5-A/1)',
    coordinates: { lat: 24.9961, lng: 67.0673 },
    elevation: '28m above sea level',
    current: {
      temperature: 28,
      apparentTemperature: 32,
      relativeHumidity: 72,
      dewPoint: 22,
      isDay,
      precipitation: 0,
      precipitationProbability: 5,
      weatherCode: 1,
      windSpeed: 14,
      windDirection: 240,
      windDirectionCompass: 'SW (بحیرہ عرب کی سمندری ہوا)',
      windGusts: 22,
      surfacePressure: 1010,
      uvIndex: isDay ? 6.5 : 0,
      visibility: 10,
      cloudCover: 25,
      time: now.toISOString(),
      conditionUr: isDay ? 'صاف دھوپ، خوشگوار سمندری ہوا' : 'صاف و پرسکون رات',
      conditionEn: isDay ? 'Sunny with Coastal Breeze' : 'Clear & Pleasant Night',
      iconName: isDay ? 'sun' : 'moon',
      seaBreezeStatusUr: 'بحیرہ عرب کی سمندری ہوا فعال ہے (خوشگوار اثر)',
      seaBreezeStatusEn: 'Arabian Sea coastal breeze active',
    },
    hourly: fallbackHourly,
    daily: [
      {
        date: 'آج (Today)',
        dayNameEn: 'Today',
        dayNameUr: 'آج',
        tempMax: 33,
        tempMin: 25,
        apparentMax: 36,
        apparentMin: 27,
        precipitationProbability: 5,
        precipitationSum: 0,
        uvIndexMax: 7,
        windSpeedMax: 18,
        windDirection: 'SW (سمندری ہوا)',
        weatherCode: 1,
        conditionUr: 'دھوپ و صاف آسمان',
        conditionEn: 'Mainly Sunny',
        sunrise: '06:23 AM',
        sunset: '06:19 PM',
        dayLength: '11h 56m',
        iconName: 'sun',
      },
      {
        date: 'کل (Tomorrow)',
        dayNameEn: 'Tomorrow',
        dayNameUr: 'کل',
        tempMax: 32,
        tempMin: 25,
        apparentMax: 35,
        apparentMin: 26,
        precipitationProbability: 10,
        precipitationSum: 0,
        uvIndexMax: 7,
        windSpeedMax: 17,
        windDirection: 'SW (سمندری ہوا)',
        weatherCode: 2,
        conditionUr: 'جزوی ابر آلود',
        conditionEn: 'Partly Cloudy',
        sunrise: '06:23 AM',
        sunset: '06:18 PM',
        dayLength: '11h 55m',
        iconName: 'cloud-sun',
      },
      {
        date: 'جمعرات',
        dayNameEn: 'Thu',
        dayNameUr: 'جمعرات',
        tempMax: 32,
        tempMin: 26,
        apparentMax: 35,
        apparentMin: 27,
        precipitationProbability: 5,
        precipitationSum: 0,
        uvIndexMax: 8,
        windSpeedMax: 16,
        windDirection: 'SW (سمندری ہوا)',
        weatherCode: 1,
        conditionUr: 'صاف آسمان',
        conditionEn: 'Sunny',
        sunrise: '06:24 AM',
        sunset: '06:17 PM',
        dayLength: '11h 53m',
        iconName: 'sun',
      },
      {
        date: 'جمعہ',
        dayNameEn: 'Fri',
        dayNameUr: 'جمعۃ المبارک',
        tempMax: 33,
        tempMin: 26,
        apparentMax: 36,
        apparentMin: 27,
        precipitationProbability: 5,
        precipitationSum: 0,
        uvIndexMax: 8,
        windSpeedMax: 15,
        windDirection: 'SW (سمندری ہوا)',
        weatherCode: 2,
        conditionUr: 'خوشگوار معتدل',
        conditionEn: 'Partly Cloudy',
        sunrise: '06:24 AM',
        sunset: '06:16 PM',
        dayLength: '11h 52m',
        iconName: 'cloud-sun',
      },
      {
        date: 'ہفتہ',
        dayNameEn: 'Sat',
        dayNameUr: 'ہفتہ',
        tempMax: 34,
        tempMin: 26,
        apparentMax: 37,
        apparentMin: 28,
        precipitationProbability: 0,
        precipitationSum: 0,
        uvIndexMax: 8,
        windSpeedMax: 14,
        windDirection: 'W (مغربی ہوا)',
        weatherCode: 0,
        conditionUr: 'صاف و روشن',
        conditionEn: 'Clear Sky',
        sunrise: '06:25 AM',
        sunset: '06:15 PM',
        dayLength: '11h 50m',
        iconName: 'sun',
      },
      {
        date: 'اتوار',
        dayNameEn: 'Sun',
        dayNameUr: 'اتوار',
        tempMax: 33,
        tempMin: 25,
        apparentMax: 36,
        apparentMin: 27,
        precipitationProbability: 5,
        precipitationSum: 0,
        uvIndexMax: 7,
        windSpeedMax: 16,
        windDirection: 'SW (سمندری ہوا)',
        weatherCode: 1,
        conditionUr: 'صاف و معتدل',
        conditionEn: 'Sunny & Pleasant',
        sunrise: '06:25 AM',
        sunset: '06:14 PM',
        dayLength: '11h 49m',
        iconName: 'sun',
      },
      {
        date: 'پیر',
        dayNameEn: 'Mon',
        dayNameUr: 'پیر',
        tempMax: 32,
        tempMin: 25,
        apparentMax: 35,
        apparentMin: 26,
        precipitationProbability: 5,
        precipitationSum: 0,
        uvIndexMax: 7,
        windSpeedMax: 17,
        windDirection: 'SW (سمندری ہوا)',
        weatherCode: 2,
        conditionUr: 'ہلکے بادل',
        conditionEn: 'Partly Cloudy',
        sunrise: '06:26 AM',
        sunset: '06:13 PM',
        dayLength: '11h 47m',
        iconName: 'cloud-sun',
      },
    ],
    airQuality: {
      aqi: 86,
      pm25: 21.5,
      pm10: 44.0,
      dust: 36.0,
      statusEn: 'Moderate',
      statusUr: 'قابلِ قبول / معتدل',
      color: '#f59e0b',
      healthAdviceUr: 'شہر قائد کی ہوا معتدل ہے، عام معمولات اور نماز کے لیے موزوں ہے۔ دمہ کے مریض معمولی احتیاط کریں۔',
      healthAdviceEn: 'Air quality is acceptable for outdoor activities and mosque visits; sensitive individuals should take routine precautions.',
    },
    sunAndMoon: {
      sunrise: '06:23 AM',
      solarNoon: '12:21 PM',
      sunset: '06:19 PM',
      dayLength: '11 گھنٹے 56 منٹ (11h 56m)',
      moonPhaseUr: `${dynamicMoon.currentType.nameUr} (${dynamicMoon.directionUr})`,
      moonPhaseEn: `${dynamicMoon.currentType.nameEn} (${dynamicMoon.directionEn})`,
      moonIllumination: dynamicMoon.illumination,
    },
    islamicDuas: ISLAMIC_WEATHER_DUAS,
    lastUpdated: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    islamicWeatherNotes: {
      titleUr: 'موسمی تغیرات اور سنتِ نبوی ﷺ',
      titleEn: 'Weather & Prophetic Traditions (Sunnah)',
      duaArabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا فِيهَا وَأَعُوذُ بِكَ مِنْ شَرِّهَا',
      duaTranslationUr: 'اے اللہ! میں تجھ سے اس ہوا کی خیر اور بھلائی کا سوال کرتا ہوں اور اس کے شر سے تیری پناہ چاہتا ہوں۔',
      duaTranslationEn: 'O Allah, I ask You for its goodness and the good within it, and I seek refuge in You from its evil.',
      hadithNoteUr: 'رسول اللہ ﷺ نے فرمایا: "جب شدید گرمی ہو تو نمازِ ظہر کو ٹھنڈا کر کے پڑھو، کیونکہ شدید گرمی جہنم کی بھپک سے ہے۔" (صحیح بخاری)',
      hadithNoteEn: 'The Prophet (ﷺ) said: "When it is very hot, delay the Dhuhr prayer until it cools down, for extreme heat is from the breath of Hell." (Sahih Bukhari)',
    },
  };
}

let cachedWeatherData: KarachiWeatherData | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function fetchKarachiWeather(): Promise<KarachiWeatherData> {
  const now = Date.now();
  if (cachedWeatherData && now - lastFetchTimestamp < CACHE_TTL_MS) {
    return cachedWeatherData;
  }

  // 1. Try local server endpoint first
  try {
    const res = await fetch('/api/weather');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.weather) {
        const enriched: KarachiWeatherData = {
          ...data.weather,
          islamicDuas: ISLAMIC_WEATHER_DUAS,
        };
        cachedWeatherData = enriched;
        lastFetchTimestamp = now;
        return enriched;
      }
    }
  } catch (err) {
    // continue to direct Open-Meteo
  }

  // 2. Direct Open-Meteo API (Free, no key required)
  try {
    const weatherUrl =
      'https://api.open-meteo.com/v1/forecast?latitude=24.9961&longitude=67.0673&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,cloud_cover,uv_index,visibility&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=Asia%2FKarachi';
    const airQualityUrl =
      'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=24.9961&longitude=67.0673&current=us_aqi,pm2_5,pm10,dust';

    const [wRes, aqRes] = await Promise.allSettled([
      fetch(weatherUrl),
      fetch(airQualityUrl),
    ]);

    if (wRes.status === 'fulfilled' && wRes.value.ok) {
      const raw: any = await wRes.value.json();
      const cur = raw.current;
      const isDay = cur.is_day === 1;
      const conditionInfo = getWeatherConditionInfo(cur.weather_code, isDay);

      let aqiData = { aqi: 86, pm25: 21.5, pm10: 44.0, dust: 36.0 };
      if (aqRes.status === 'fulfilled' && aqRes.value.ok) {
        try {
          const aqRaw: any = await aqRes.value.json();
          if (aqRaw.current) {
            aqiData = {
              aqi: Math.round(aqRaw.current.us_aqi ?? 86),
              pm25: Math.round((aqRaw.current.pm2_5 ?? 21.5) * 10) / 10,
              pm10: Math.round((aqRaw.current.pm10 ?? 44.0) * 10) / 10,
              dust: Math.round((aqRaw.current.dust ?? 36.0) * 10) / 10,
            };
          }
        } catch (_) {}
      }

      const daysUr = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
      const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const dailyList: DailyForecast[] = [];
      if (raw.daily && Array.isArray(raw.daily.time)) {
        for (let i = 0; i < Math.min(raw.daily.time.length, 7); i++) {
          const dateStr = raw.daily.time[i];
          const dObj = new Date(dateStr);
          const dayIdx = dObj.getDay();
          const wCode = raw.daily.weather_code?.[i] ?? 0;
          const cond = getWeatherConditionInfo(wCode, true);
          const compass = getWindCompass(raw.daily.wind_direction_10m_dominant?.[i] ?? 240);

          dailyList.push({
            date: i === 0 ? 'آج' : i === 1 ? 'کل' : daysUr[dayIdx],
            dayNameEn: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysEn[dayIdx],
            dayNameUr: i === 0 ? 'آج' : i === 1 ? 'کل' : daysUr[dayIdx],
            tempMax: Math.round(raw.daily.temperature_2m_max?.[i] ?? 32),
            tempMin: Math.round(raw.daily.temperature_2m_min?.[i] ?? 24),
            apparentMax: Math.round(raw.daily.apparent_temperature_max?.[i] ?? 34),
            apparentMin: Math.round(raw.daily.apparent_temperature_min?.[i] ?? 25),
            precipitationProbability: raw.daily.precipitation_probability_max?.[i] ?? 0,
            precipitationSum: Math.round((raw.daily.precipitation_sum?.[i] ?? 0) * 10) / 10,
            uvIndexMax: Math.round(raw.daily.uv_index_max?.[i] ?? 7),
            windSpeedMax: Math.round(raw.daily.wind_speed_10m_max?.[i] ?? 18),
            windDirection: `${compass.ur} (${compass.en})`,
            weatherCode: wCode,
            conditionUr: cond.conditionUr,
            conditionEn: cond.conditionEn,
            sunrise: raw.daily.sunrise?.[i]?.split('T')[1] || '06:23 AM',
            sunset: raw.daily.sunset?.[i]?.split('T')[1] || '06:19 PM',
            dayLength: '11h 56m',
            iconName: cond.iconName,
          });
        }
      }

      const hourlyList: HourlyForecast[] = [];
      if (raw.hourly && Array.isArray(raw.hourly.time)) {
        const currentHourStr = new Date().toISOString().slice(0, 13);
        let startIdx = raw.hourly.time.findIndex((t: string) => t.startsWith(currentHourStr));
        if (startIdx === -1) startIdx = 0;

        for (let h = startIdx; h < Math.min(startIdx + 24, raw.hourly.time.length); h++) {
          const hTime = raw.hourly.time[h];
          const hourNum = new Date(hTime).getHours();
          const hIsDay = raw.hourly.is_day?.[h] === 1;
          const hCode = raw.hourly.weather_code?.[h] ?? 0;
          const hCond = getWeatherConditionInfo(hCode, hIsDay);
          const ampm = hourNum >= 12 ? 'PM' : 'AM';
          const h12 = hourNum % 12 || 12;

          hourlyList.push({
            time: `${h12}:00 ${ampm}`,
            timeUr: `${h12}:00 ${ampm === 'PM' ? 'شام/دوپہر' : 'صبح'}`,
            hour: hourNum,
            temp: Math.round(raw.hourly.temperature_2m?.[h] ?? 28),
            apparentTemp: Math.round(raw.hourly.apparent_temperature?.[h] ?? 30),
            weatherCode: hCode,
            conditionUr: hCond.conditionUr,
            conditionEn: hCond.conditionEn,
            iconName: hCond.iconName,
            pop: raw.hourly.precipitation_probability?.[h] ?? 0,
            humidity: Math.round(raw.hourly.relative_humidity_2m?.[h] ?? 70),
            windSpeed: Math.round(raw.hourly.wind_speed_10m?.[h] ?? 12),
            isDay: hIsDay,
          });
        }
      }

      const dewPoint = Math.round(
        cur.temperature_2m - (100 - cur.relative_humidity_2m) / 5
      );

      const compass = getWindCompass(cur.wind_direction_10m ?? 240);
      const aqiInfo = getAQILevel(aqiData.aqi);

      const formatted: KarachiWeatherData = {
        locationEn: 'Karachi, Pakistan',
        locationUr: 'کراچی، پاکستان',
        areaEn: 'North Karachi (Sector 5-A/1)',
        areaUr: 'نارتھ کراچی (سیکٹر 5-A/1)',
        coordinates: { lat: 24.9961, lng: 67.0673 },
        elevation: '28m above sea level',
        current: {
          temperature: Math.round(cur.temperature_2m),
          apparentTemperature: Math.round(cur.apparent_temperature),
          relativeHumidity: Math.round(cur.relative_humidity_2m),
          dewPoint,
          isDay,
          precipitation: cur.precipitation || 0,
          precipitationProbability: dailyList[0]?.precipitationProbability ?? 0,
          weatherCode: cur.weather_code,
          windSpeed: Math.round(cur.wind_speed_10m),
          windDirection: Math.round(cur.wind_direction_10m ?? 240),
          windDirectionCompass: `${compass.ur} (${compass.en})`,
          windGusts: Math.round(cur.wind_gusts_10m ?? 18),
          surfacePressure: Math.round(cur.surface_pressure ?? 1010),
          uvIndex: Math.round((cur.uv_index ?? 0) * 10) / 10,
          visibility: Math.round(((cur.visibility ?? 10000) / 1000) * 10) / 10,
          cloudCover: Math.round(cur.cloud_cover ?? 20),
          time: cur.time,
          conditionUr: conditionInfo.conditionUr,
          conditionEn: conditionInfo.conditionEn,
          iconName: conditionInfo.iconName,
          seaBreezeStatusUr:
            (cur.wind_direction_10m ?? 240) >= 180 && (cur.wind_direction_10m ?? 240) <= 280
              ? 'بحیرہ عرب کی سمندری ہوا فعال ہے (خوشگوار اثر)'
              : 'خشک برّی ہوا (سمندری ہوا دھیمی ہے)',
          seaBreezeStatusEn:
            (cur.wind_direction_10m ?? 240) >= 180 && (cur.wind_direction_10m ?? 240) <= 280
              ? 'Arabian Sea coastal breeze active'
              : 'Continental dry breeze',
        },
        hourly: hourlyList,
        daily: dailyList.length > 0 ? dailyList : getFallbackKarachiWeather().daily,
        airQuality: {
          aqi: aqiData.aqi,
          pm25: aqiData.pm25,
          pm10: aqiData.pm10,
          dust: aqiData.dust,
          statusEn: aqiInfo.statusEn,
          statusUr: aqiInfo.statusUr,
          color: aqiInfo.color,
          healthAdviceUr: aqiInfo.adviceUr,
          healthAdviceEn: aqiInfo.adviceEn,
        },
        sunAndMoon: {
          sunrise: dailyList[0]?.sunrise || '06:23 AM',
          solarNoon: '12:21 PM',
          sunset: dailyList[0]?.sunset || '06:19 PM',
          dayLength: '11 گھنٹے 56 منٹ (11h 56m)',
          moonPhaseUr: `${calculateMoonPhase().currentType.nameUr} (${calculateMoonPhase().directionUr})`,
          moonPhaseEn: `${calculateMoonPhase().currentType.nameEn} (${calculateMoonPhase().directionEn})`,
          moonIllumination: calculateMoonPhase().illumination,
        },
        islamicDuas: ISLAMIC_WEATHER_DUAS,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        islamicWeatherNotes: getFallbackKarachiWeather().islamicWeatherNotes,
      };

      cachedWeatherData = formatted;
      lastFetchTimestamp = now;
      return formatted;
    }
  } catch (e) {
    console.warn('Direct weather fetch error:', e);
  }

  // 3. Fallback to resilient realistic Karachi model
  const fallback = getFallbackKarachiWeather();
  cachedWeatherData = fallback;
  return fallback;
}
