export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  time: string;
  conditionUr: string;
  conditionEn: string;
  iconName: 'sun' | 'moon' | 'cloud-sun' | 'cloud-moon' | 'cloud' | 'cloud-rain' | 'cloud-lightning' | 'cloud-fog';
}

export interface DailyForecast {
  date: string;
  dayNameEn: string;
  dayNameUr: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  conditionUr: string;
  conditionEn: string;
  sunrise: string;
  sunset: string;
  iconName: 'sun' | 'moon' | 'cloud-sun' | 'cloud-moon' | 'cloud' | 'cloud-rain' | 'cloud-lightning' | 'cloud-fog';
}

export interface KarachiWeatherData {
  locationEn: string;
  locationUr: string;
  areaEn: string;
  areaUr: string;
  coordinates: { lat: number; lng: number };
  current: CurrentWeather;
  daily: DailyForecast[];
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

export function getWeatherConditionInfo(code: number, isDay: boolean): {
  conditionUr: string;
  conditionEn: string;
  iconName: CurrentWeather['iconName'];
} {
  switch (code) {
    case 0:
      return {
        conditionUr: isDay ? 'صاف و روشن آسمان' : 'صاف و پرسکون رات',
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
        conditionUr: 'دھند / کہر',
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
        conditionUr: 'گرج چمک و بارش',
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

// Fallback Karachi data in case of offline network
export function getFallbackKarachiWeather(): KarachiWeatherData {
  const now = new Date();
  const hour = now.getHours();
  const isDay = hour >= 6 && hour < 18;

  return {
    locationEn: 'Karachi, Pakistan',
    locationUr: 'کراچی، پاکستان',
    areaEn: 'North Karachi (Sector 5-A/1)',
    areaUr: 'نارتھ کراچی (سیکٹر 5-A/1)',
    coordinates: { lat: 24.9961, lng: 67.0673 },
    current: {
      temperature: 28,
      apparentTemperature: 32,
      relativeHumidity: 72,
      isDay,
      precipitation: 0,
      weatherCode: 1,
      windSpeed: 14,
      time: now.toISOString(),
      conditionUr: isDay ? 'صاف دھوپ، خوشگوار سمندری ہوا' : 'صاف و پرسکون رات',
      conditionEn: isDay ? 'Sunny with Coastal Breeze' : 'Clear & Pleasant Night',
      iconName: isDay ? 'sun' : 'moon',
    },
    daily: [
      {
        date: 'آج (Today)',
        dayNameEn: 'Today',
        dayNameUr: 'آج',
        tempMax: 32,
        tempMin: 25,
        weatherCode: 1,
        conditionUr: 'دھوپ و صاف آسمان',
        conditionEn: 'Mainly Sunny',
        sunrise: '06:23 AM',
        sunset: '06:19 PM',
        iconName: 'sun',
      },
      {
        date: 'کل (Tomorrow)',
        dayNameEn: 'Tomorrow',
        dayNameUr: 'کل',
        tempMax: 31,
        tempMin: 25,
        weatherCode: 2,
        conditionUr: 'جزوی ابر آلود',
        conditionEn: 'Partly Cloudy',
        sunrise: '06:23 AM',
        sunset: '06:18 PM',
        iconName: 'cloud-sun',
      },
      {
        date: 'جمعرات',
        dayNameEn: 'Thu',
        dayNameUr: 'جمعرات',
        tempMax: 31,
        tempMin: 26,
        weatherCode: 1,
        conditionUr: 'صاف آسمان',
        conditionEn: 'Sunny',
        sunrise: '06:24 AM',
        sunset: '06:17 PM',
        iconName: 'sun',
      },
      {
        date: 'جمعہ',
        dayNameEn: 'Fri',
        dayNameUr: 'جمعۃ المبارک',
        tempMax: 32,
        tempMin: 26,
        weatherCode: 2,
        conditionUr: 'خوشگوار معتدل',
        conditionEn: 'Partly Cloudy',
        sunrise: '06:24 AM',
        sunset: '06:16 PM',
        iconName: 'cloud-sun',
      },
      {
        date: 'ہفتہ',
        dayNameEn: 'Sat',
        dayNameUr: 'ہفتہ',
        tempMax: 33,
        tempMin: 26,
        weatherCode: 0,
        conditionUr: 'صاف و گرم',
        conditionEn: 'Clear Sky',
        sunrise: '06:25 AM',
        sunset: '06:15 PM',
        iconName: 'sun',
      },
    ],
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
        cachedWeatherData = data.weather;
        lastFetchTimestamp = now;
        return data.weather;
      }
    }
  } catch (err) {
    // continue to Open-Meteo direct
  }

  // 2. Direct Open-Meteo API (Free, no key required)
  try {
    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=24.8607&longitude=67.0011&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Asia%2FKarachi';
    const res = await fetch(url);
    if (res.ok) {
      const raw = await res.json();
      if (raw && raw.current) {
        const cur = raw.current;
        const isDay = cur.is_day === 1;
        const conditionInfo = getWeatherConditionInfo(cur.weather_code, isDay);

        const daysUr = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
        const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const dailyList: DailyForecast[] = [];
        if (raw.daily && Array.isArray(raw.daily.time)) {
          for (let i = 0; i < Math.min(raw.daily.time.length, 6); i++) {
            const dateStr = raw.daily.time[i];
            const dObj = new Date(dateStr);
            const dayIdx = dObj.getDay();
            const wCode = raw.daily.weather_code?.[i] ?? 0;
            const cond = getWeatherConditionInfo(wCode, true);

            dailyList.push({
              date: i === 0 ? 'آج' : i === 1 ? 'کل' : daysUr[dayIdx],
              dayNameEn: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysEn[dayIdx],
              dayNameUr: i === 0 ? 'آج' : i === 1 ? 'کل' : daysUr[dayIdx],
              tempMax: Math.round(raw.daily.temperature_2m_max?.[i] ?? 32),
              tempMin: Math.round(raw.daily.temperature_2m_min?.[i] ?? 24),
              weatherCode: wCode,
              conditionUr: cond.conditionUr,
              conditionEn: cond.conditionEn,
              sunrise: raw.daily.sunrise?.[i]?.split('T')[1] || '06:23',
              sunset: raw.daily.sunset?.[i]?.split('T')[1] || '18:18',
              iconName: cond.iconName,
            });
          }
        }

        const formatted: KarachiWeatherData = {
          locationEn: 'Karachi, Pakistan',
          locationUr: 'کراچی، پاکستان',
          areaEn: 'North Karachi (Sector 5-A/1)',
          areaUr: 'نارتھ کراچی (سیکٹر 5-A/1)',
          coordinates: { lat: 24.9961, lng: 67.0673 },
          current: {
            temperature: Math.round(cur.temperature_2m),
            apparentTemperature: Math.round(cur.apparent_temperature),
            relativeHumidity: Math.round(cur.relative_humidity_2m),
            isDay,
            precipitation: cur.precipitation || 0,
            weatherCode: cur.weather_code,
            windSpeed: Math.round(cur.wind_speed_10m),
            time: cur.time,
            conditionUr: conditionInfo.conditionUr,
            conditionEn: conditionInfo.conditionEn,
            iconName: conditionInfo.iconName,
          },
          daily: dailyList.length > 0 ? dailyList : getFallbackKarachiWeather().daily,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          islamicWeatherNotes: getFallbackKarachiWeather().islamicWeatherNotes,
        };

        cachedWeatherData = formatted;
        lastFetchTimestamp = now;
        return formatted;
      }
    }
  } catch (e) {
    console.warn('Weather fetch error:', e);
  }

  // 3. Fallback to resilient realistic Karachi model
  const fallback = getFallbackKarachiWeather();
  cachedWeatherData = fallback;
  return fallback;
}
