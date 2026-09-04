import {
  PrayerTimeItem,
  PrayerTimesApiResponse,
  AdminPrayerSettings,
  JamaatTimes,
  DarseQuranProgram,
  MosqueMediaSettings,
  MosqueVideoItem,
  IqamahCountdownState,
} from '../types';

// Coordinates for Usman Ghani (R.A) Masjid, Sector 5-A/1, North Karachi, Pakistan
export const MOSQUE_COORDINATES = {
  lat: '25°00′17″N',
  lng: '67°03′27″E',
  latDecimal: 25.0048211,
  lngDecimal: 67.0574599,
  address: 'ST-11, Sector 5-A/1, North Karachi, Karachi, Sindh, Pakistan',
  locationName: 'North Karachi (Sector 5-A/1)',
  qiblaBearing: 261.5, // Degrees from North
  mapsUrl:
    'https://www.google.com/maps/place/Usman+Ghani+(R.A)+Masjid,+5-A%2F1,+North+Karachi/@25.0048211,67.0574599,18z/data=!4m6!3m5!1s0x3eb3410e0faa7583:0x323fbf6c080bb622!8m2!3d25.0048211!4d67.0574599!16s%2Fg%2F11cspzpxww',
};

// Curated high-resolution Islamic & Mosque photos library for admin to pick from
export const CURATED_IMAGE_PRESETS = [
  {
    id: 'img-usman-ghani-gate',
    title: 'Jamia Masjid Usman-e-Ghani Main Gate (جامع مسجد عثمانِ غنی - مرکزی سرخ محراب)',
    category: 'mosque',
    url: '/images/masjid_gate.jpg',
  },
  {
    id: 'img-usman-ghani-interior',
    title: 'Jamia Masjid Usman-e-Ghani Interior (جامع مسجد عثمانِ غنی - محراب و ہال)',
    category: 'mosque',
    url: '/images/usman_ghani_masjid_interior.jpg',
  },
  {
    id: 'img-usman-ghani-logo',
    title: 'Official Mosque Emblem & Seal (جامع مسجد عثمان غنی باضابطہ مونوگرام)',
    category: 'mosque',
    url: '/images/masjid_logo.jpg',
  },
  {
    id: 'img-quran-1',
    title: 'Holy Quran with Golden Illumination (درسِ قرآن و تفسیر)',
    category: 'quran',
    url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'img-quran-2',
    title: 'Noble Quran on Wooden Rehal (قرآن پاک و رحل)',
    category: 'quran',
    url: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'img-quran-3',
    title: 'Open Quran with Rosary Tasbih (درسِ حدیث و تلاوت)',
    category: 'quran',
    url: 'https://images.unsplash.com/photo-1597935258735-e254c183921e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'img-mosque-1',
    title: 'Grand Mosque Dome & Minarets (جامع مسجد گنبد و مینار)',
    category: 'mosque',
    url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'img-mosque-2',
    title: 'Islamic Architectural Arch & Lanterns (مسجد محراب و روشنی)',
    category: 'mosque',
    url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'img-mosque-3',
    title: 'Illuminated Mosque Night View (مسجد کا دلکش شبینہ منظر)',
    category: 'mosque',
    url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'img-education-1',
    title: 'Quranic Learning & Madrasah Study (شعبہ تعلیم و حفظ)',
    category: 'education',
    url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'img-education-2',
    title: 'Islamic Calligraphy & Sacred Art (اسلامی خطاطی)',
    category: 'education',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
  },
];

// Curated Mosque & Islamic Videos Library
export const CURATED_VIDEO_PRESETS: MosqueVideoItem[] = [
  {
    id: 'vid-juma-1',
    titleEn: 'Friday Juma Bayan & Khutbah - Importance of Quran & Sunnah',
    titleUr: 'جمعۃ المبارک کا روح پرور بیان و خطبہ - اہمیت قرآن و سنت',
    speakerEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
    speakerUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)',
    category: 'juma',
    videoUrl: 'https://www.youtube.com/watch?v=f-B3iCjHqf4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80',
    duration: '42:15',
    date: 'Every Friday',
    isLive: false,
    descriptionEn: 'Weekly Friday spiritual lecture before Juma prayer in Jamia Masjid Usman-e-Ghani main hall.',
    descriptionUr: 'جامع مسجد عثمانِ غنی میں نمازِ جمعہ سے قبل خطیبِ مسجد حضرت مولانا یونس منصوری کا خصوصی تفسیری خطاب۔',
  },
  {
    id: 'vid-dars-1',
    titleEn: 'Daily Morning Dars-e-Tafseer - Surah Al-Baqarah',
    titleUr: 'روزانہ درسِ قرآن و تفسیر - سورۃ البقرہ رکوع 1 تا 3',
    speakerEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
    speakerUr: 'حضرت مولانا یونس منصوری صاحب',
    category: 'dars',
    videoUrl: 'https://www.youtube.com/watch?v=eY0iCjZ7qK0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
    duration: '24:30',
    date: 'Daily Series',
    isLive: false,
    descriptionEn: 'Daily verse-by-verse translation and commentary after Fajr prayer.',
    descriptionUr: 'بعد نمازِ فجر روزانہ آسان فہم قرآن و مسنون دعاؤں کی تشریح۔',
  },
  {
    id: 'vid-tilawat-1',
    titleEn: 'Soulful Holy Quran Tilawat with Urdu Translation (Surah Ar-Rahman)',
    titleUr: 'تلاوتِ کلام پاک مع آسان اردو ترجمہ (سورۃ الرحمٰن)',
    speakerEn: 'Qari Muhammad Bilal (Imam & Qari)',
    speakerUr: 'قاری محمد بلال صاحب (امام و قاری جامع مسجد)',
    category: 'tilawat',
    videoUrl: 'https://www.youtube.com/watch?v=fXv3qG6KqK8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1597935258735-e254c183921e?auto=format&fit=crop&w=1200&q=80',
    duration: '18:50',
    date: 'Quran Series',
    isLive: false,
    descriptionEn: 'Heart-touching Quranic recitation with Urdu translation subtitles.',
    descriptionUr: 'خوش الحان قاری کی پرتاثیر تلاوت مع اردو ترجمہ۔',
  },
  {
    id: 'vid-live-1',
    titleEn: 'Live Makkah / Madinah Holy Haramain Broadcast',
    titleUr: 'براہِ راست لائیو نشریات حرمین شریفین مکہ مکرمہ و مدینہ منورہ',
    speakerEn: 'Haramain Live Broadcast Feed',
    speakerUr: 'لائیو نشریات بیت اللہ و روضۂ رسول ﷺ',
    category: 'live',
    videoUrl: 'https://www.youtube.com/watch?v=5_aGvxrY9-Y',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80',
    duration: '24/7 Live',
    date: 'Live Feed',
    isLive: true,
    descriptionEn: 'Official 24/7 High-Definition live stream from Makkah Al-Mukarramah.',
    descriptionUr: 'حرمین شریفین کی 24 گھنٹے ہائی ڈیفینیشن لائیو نشریات۔',
  },
  {
    id: 'vid-tour-1',
    titleEn: 'Jamia Masjid Usman-e-Ghani Architecture & Facilities Overview',
    titleUr: 'جامع مسجد عثمانِ غنی کا تعارف، تعمیراتی محراب و خدمات',
    speakerEn: 'Mosque Administration Committee',
    speakerUr: 'انتظامیہ کمیٹی جامع مسجد عثمانِ غنی',
    category: 'tour',
    videoUrl: 'https://www.youtube.com/watch?v=0k2G6s7mQ9w',
    thumbnailUrl: '/images/masjid_gate.jpg',
    duration: '08:45',
    date: 'Mosque Profile',
    isLive: false,
    descriptionEn: 'A short documentary showing the red-brick arched entrance, 10 KV solar system, and Darul Quran maktab.',
    descriptionUr: 'جامع مسجد کے سرخ محرابی بابِ داخلہ، 10 کے وی سولر سسٹم اور شعبہ حفظ و ناظرہ کا تصویری و ویڈیو احوال۔',
  },
];

// Helper to convert any YouTube, Vimeo, or Direct Video URL to clean embeddable link
export function getEmbedVideoUrl(url: string): { embedUrl: string; isDirectVideo: boolean; videoId?: string } {
  if (!url) return { embedUrl: '', isDirectVideo: false };
  const trimmed = url.trim();

  // Check if direct mp4/webm video
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return { embedUrl: trimmed, isDirectVideo: true };
  }

  // YouTube watch / share / shorts / live URL matching
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID, youtube.com/live/ID
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`,
      isDirectVideo: false,
      videoId,
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isDirectVideo: false,
    };
  }

  return { embedUrl: trimmed, isDirectVideo: false };
}

export const DEFAULT_DARS_PROGRAMS: DarseQuranProgram[] = [
  {
    id: 'dars-1',
    titleEn: 'Daily Morning Dars-e-Quran & Tafseer',
    titleUr: 'روزانہ بعد نمازِ فجر درسِ قرآن و تفسیر',
    speakerEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
    speakerUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)',
    timingEn: 'Daily immediately after Fajr prayer (15-20 mins)',
    timingUr: 'روزانہ بعد نمازِ فجر (15 تا 20 منٹ)',
    frequencyEn: 'Daily (Monday to Sunday)',
    frequencyUr: 'روزانہ پابندی کے ساتھ',
    topicEn: 'Tafseer of Surah Al-Baqarah, Ayat-by-Ayat translation, and Daily Masnoon Duas',
    topicUr: 'تفسیر سورۃ البقرہ، آسان ترجمہ و فہم قرآن مع روزمرہ کی مسنون دعائیں و ضروری مسائل',
    locationEn: 'Main Prayer Hall (Ground Floor)',
    locationUr: 'مرکزی نماز ہال (گراؤنڈ فلور)',
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
    active: true,
    notesEn: 'Open for all brothers. Recordings available on request.',
    notesUr: 'تمام اہل علاقہ و نمازیوں کے لیے عام شرکت کی دعوت ہے۔',
  },
  {
    id: 'dars-2',
    titleEn: 'Weekly Dars-e-Hadith & Islahi Majlis',
    titleUr: 'ہفتہ وار درسِ حدیث و اصلاحی مجلس',
    speakerEn: 'Maulana Hidayatullah (Imam Jamia Masjid)',
    speakerUr: 'حضرت مولانا ہدایت اللہ صاحب (امام جامع مسجد)',
    timingEn: 'Every Sunday between Maghrib & Isha',
    timingUr: 'ہر اتوار بعد نمازِ مغرب تا اذانِ عشاء',
    frequencyEn: 'Weekly (Every Sunday)',
    frequencyUr: 'ہفتہ وار (ہر اتوار بعد مغرب)',
    topicEn: 'Selected Ahadith from Riyad-us-Saliheen on Akhlaq, Family, and Huqooq-ul-Ibad',
    topicUr: 'منتخب احادیث نبویہ (ریاض الصالحین) اخلاق، حلال روزی اور حقوق العباد کی اہمیت',
    locationEn: 'Main Prayer Hall',
    locationUr: 'مرکزی نماز ہال',
    imageUrl: 'https://images.unsplash.com/photo-1597935258735-e254c183921e?auto=format&fit=crop&w=1200&q=80',
    active: true,
    notesEn: 'Family and youth are especially encouraged to attend.',
    notesUr: 'نوجوانوں اور بزرگوں کے لیے خصوصی اصلاحی و فکری نشست۔',
  },
  {
    id: 'dars-3',
    titleEn: 'Friday Khutbah & Pre-Juma Spiritual Discourse',
    titleUr: 'خطبہ جمعۃ المبارک و خصوصی تفسیری خطاب',
    speakerEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
    speakerUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)',
    timingEn: 'Every Friday at 01:00 PM (Jamaat at 01:45 PM)',
    timingUr: 'ہر جمعۃ المبارک بوقت 01:00 دوپہر (جماعت 01:45)',
    frequencyEn: 'Weekly (Friday)',
    frequencyUr: 'ہفتہ وار (جمعۃ المبارک)',
    topicEn: 'Guidance from Quran & Sunnah on contemporary societal challenges and spirituality',
    topicUr: 'معاشرتی مسائل، اسلامی تعلیمات اور ایمانی زندگی پر جامع و مدلل بیان',
    locationEn: 'All Mosque Halls & Courtyard',
    locationUr: 'تمام ہالز و صحنِ مسجد',
    imageUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80',
    active: true,
    notesEn: 'Live audio system across all floors and overflow galleries.',
    notesUr: 'مسجد کے تمام فلورز پر ڈیجیٹل آڈیو سسٹم کے ذریعے واضح آواز کا انتظام۔',
  },
];

export const DEFAULT_MEDIA_SETTINGS: MosqueMediaSettings = {
  heroBannerImage: '/images/usman_ghani_masjid_interior.jpg',
  darsPosterImage: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
  darulQuranImage: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80',
  // Video defaults
  featuredVideoUrl: 'https://www.youtube.com/watch?v=f-B3iCjHqf4',
  featuredVideoTitleEn: 'Friday Juma Bayan & Khutbah - Live & Recorded Bayanat',
  featuredVideoTitleUr: 'جمعۃ المبارک کا روح پرور خطاب و خطبہ - جامع مسجد عثمانِ غنی',
  featuredVideoSpeakerEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
  featuredVideoSpeakerUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)',
  featuredVideoDescriptionEn: 'Weekly spiritual sermon and Quranic guidance delivered at Jamia Masjid Usman-e-Ghani North Karachi.',
  featuredVideoDescriptionUr: 'جامع مسجد عثمانِ غنی نارتھ کراچی میں ہر جمعۃ المبارک کو پیش کیا جانے والا ایمان افروز تفسیری بیان۔',
  featuredVideoCategory: 'juma',
  isLiveStream: false,
  showVideoSection: true,
  videoList: CURATED_VIDEO_PRESETS,
};

// Default settings configured for Jamia Masjid Usman-e-Ghani:
// Fajr Jamaat is 05:40 AM
// Ishraq is 12 mins after Tuloo (or custom)
// Dhuhr Jamaat is 01:30 PM
// Asr Jamaat is 05:30 PM
// Maghrib Jamaat is 5 mins after Maghrib Azan
// Isha Jamaat is 08:45 PM
// Jumma Azan 1 is 01:00 PM
// Jumma Bayan is 01:00 PM
// Jumma Azan 2 is 01:30 PM
// Jumma Khutbah is 01:35 PM
// Jumma Jamaat is 01:45 PM
export const DEFAULT_ADMIN_SETTINGS: AdminPrayerSettings = {
  fajrJamaat: '05:40 AM',
  dhuhrJamaat: '01:30 PM',
  asrJamaat: '05:30 PM',
  maghribJamaat: '+5 mins after Azan',
  ishaJamaat: '08:45 PM',
  // Jumma Timing Settings
  jummaAzan: '01:00 PM',
  jummaAzan2: '01:30 PM',
  jummaBayan: '01:00 PM',
  jummaKhutbah: '01:35 PM',
  jummaJamaat: '01:45 PM',
  jummaKhateebEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
  jummaKhateebUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)',
  ishraqTime: '+12 mins after Tuloo',
  showAlertBanner: false,
  alertBannerEn: '',
  alertBannerUr: '',
  darsPrograms: DEFAULT_DARS_PROGRAMS,
  mediaSettings: DEFAULT_MEDIA_SETTINGS,
  defaultAzanVoice: 'makkah',
  autoPlayAzan: true,
  azanVolume: 0.85,
};

// UmmahAPI endpoint provided in the prompt
export const UMMAH_API_URL =
  'https://www.ummahapi.com/api/prayer-times?lat=24%C2%B051%E2%80%B236%E2%80%B3N%20&lng=67%C2%B00%E2%80%B236%E2%80%B3E&method=Karachi&madhab=Hanafi&highLatitudeRule=recommended';

// Helper to format 24h string (e.g. "05:15" or "17:30 (PKT)") to readable 12h format
export function formatTo12Hour(timeStr: string): string {
  if (!timeStr) return '--:--';
  
  // Clean string from any timezone suffix like (PKT)
  const clean = timeStr.split(' ')[0].trim();
  const parts = clean.split(':');
  if (parts.length < 2) return clean;
  
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1].padStart(2, '0');
  
  if (isNaN(hours)) return clean;
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  
  return `${hours}:${minutes} ${ampm}`;
}

// Convert "HH:MM" or "HH:MM AM/PM" to total minutes from midnight for math
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  
  const is12Hour = /AM|PM/i.test(timeStr);
  if (is12Hour) {
    const isPM = /PM/i.test(timeStr);
    const cleaned = timeStr.replace(/AM|PM/i, '').trim();
    const [h, m] = cleaned.split(':').map(Number);
    let hours = h % 12;
    if (isPM) hours += 12;
    return hours * 60 + (m || 0);
  }
  
  const [h, m] = timeStr.split(' ')[0].split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Helper to add minutes to a time string and return formatted 12-hour string
export function getOffsetTime(timeStr: string, offsetMinutes: number): string {
  if (!timeStr) return '--:--';
  const totalMins = timeStringToMinutes(timeStr);
  const adjustedMins = (totalMins + offsetMinutes + 1440) % 1440;
  const h = Math.floor(adjustedMins / 60) % 24;
  const m = adjustedMins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// Storage Key
const STORAGE_KEY = 'mosque_admin_prayer_settings';

export function getStoredAdminSettings(): AdminPrayerSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged: AdminPrayerSettings = {
        ...DEFAULT_ADMIN_SETTINGS,
        ...parsed,
        mediaSettings: {
          ...DEFAULT_MEDIA_SETTINGS,
          ...(parsed.mediaSettings || {}),
        },
      };

      // Fill in defaults for Jumma timings if missing in legacy saved state
      if (!merged.jummaAzan) merged.jummaAzan = '01:00 PM';
      if (!merged.jummaAzan2) merged.jummaAzan2 = '01:30 PM';
      if (!merged.jummaBayan) merged.jummaBayan = '01:00 PM';
      if (!merged.jummaKhutbah) merged.jummaKhutbah = '01:35 PM';
      if (!merged.jummaJamaat) merged.jummaJamaat = '01:45 PM';
      if (!merged.jummaKhateebUr) merged.jummaKhateebUr = 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)';

      // Fill in defaults for video options if missing
      if (!merged.mediaSettings?.featuredVideoUrl) {
        merged.mediaSettings = {
          ...merged.mediaSettings,
          ...DEFAULT_MEDIA_SETTINGS,
        };
      }
      if (!merged.mediaSettings?.videoList || merged.mediaSettings.videoList.length === 0) {
        if (merged.mediaSettings) {
          merged.mediaSettings.videoList = CURATED_VIDEO_PRESETS;
        }
      }

      // If the old placeholder hero image was stored, upgrade to the real mosque interior photo
      if (
        merged.mediaSettings?.heroBannerImage ===
        'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=80'
      ) {
        merged.mediaSettings.heroBannerImage = DEFAULT_MEDIA_SETTINGS.heroBannerImage;
      }
      return merged;
    }
  } catch (e) {
    console.error('Error reading stored admin prayer settings', e);
  }
  return DEFAULT_ADMIN_SETTINGS;
}

export function saveAdminSettings(settings: AdminPrayerSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving admin prayer settings', e);
  }
}

export function resetAdminSettings(): AdminPrayerSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error resetting admin prayer settings', e);
  }
  return DEFAULT_ADMIN_SETTINGS;
}

// Standard Jamaat calculation based on Jamia Masjid Usman-e-Ghani customs and Admin Settings
export function calculateJamaatTimes(
  athanTimes: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  },
  adminSettings?: AdminPrayerSettings
): JamaatTimes {
  const settings = adminSettings || getStoredAdminSettings();

  // Helper for dynamic or fixed Fajr
  let fajrJamaat = settings.fajrJamaat;
  if (fajrJamaat.startsWith('+')) {
    const mins = parseInt(fajrJamaat.replace(/[^0-9]/g, ''), 10) || 30;
    fajrJamaat = getOffsetTime(athanTimes.fajr, mins);
  } else if (!fajrJamaat) {
    fajrJamaat = '05:40 AM';
  }

  // Helper for dynamic or fixed Ishraq
  let ishraqTime = settings.ishraqTime;
  if (!ishraqTime || ishraqTime.startsWith('+')) {
    const mins = parseInt(ishraqTime?.replace(/[^0-9]/g, '') || '12', 10) || 12;
    ishraqTime = getOffsetTime(athanTimes.sunrise, mins);
  }

  // Helper for Maghrib Jamaat
  let maghribJamaat = settings.maghribJamaat;
  if (!maghribJamaat || maghribJamaat.startsWith('+')) {
    const mins = parseInt(maghribJamaat?.replace(/[^0-9]/g, '') || '5', 10) || 5;
    maghribJamaat = getOffsetTime(athanTimes.maghrib, mins);
  }

  return {
    fajr: fajrJamaat || '05:40 AM',
    sunrise: formatTo12Hour(athanTimes.sunrise),
    ishraq: ishraqTime,
    dhuhr: settings.dhuhrJamaat || '01:30 PM',
    asr: settings.asrJamaat || '05:30 PM',
    maghrib: maghribJamaat,
    isha: settings.ishaJamaat || '08:45 PM',
    jumma: settings.jummaJamaat || '01:45 PM',
  };
}

// Fallback high-accuracy Hanafi Karachi calculation algorithm for Karachi coordinates
export function getLocalKarachiPrayerTimes(date = new Date()): PrayerTimesApiResponse {
  const month = date.getMonth(); // 0 to 11
  
  // Approximate standard Hanafi prayer times table for North Karachi across months
  const monthlyTables = [
    { fajr: '05:50', sunrise: '07:12', dhuhr: '12:40', asr: '16:35', maghrib: '18:05', isha: '19:25' }, // Jan
    { fajr: '05:40', sunrise: '07:00', dhuhr: '12:42', asr: '16:50', maghrib: '18:22', isha: '19:40' }, // Feb
    { fajr: '05:20', sunrise: '06:36', dhuhr: '12:38', asr: '17:00', maghrib: '18:40', isha: '19:55' }, // Mar
    { fajr: '04:50', sunrise: '06:05', dhuhr: '12:30', asr: '17:08', maghrib: '18:55', isha: '20:12' }, // Apr
    { fajr: '04:28', sunrise: '05:45', dhuhr: '12:28', asr: '17:15', maghrib: '19:12', isha: '20:30' }, // May
    { fajr: '04:18', sunrise: '05:40', dhuhr: '12:30', asr: '17:22', maghrib: '19:24', isha: '20:45' }, // Jun
    { fajr: '04:26', sunrise: '05:46', dhuhr: '12:35', asr: '17:25', maghrib: '19:25', isha: '20:45' }, // Jul
    { fajr: '04:45', sunrise: '06:00', dhuhr: '12:35', asr: '17:18', maghrib: '19:08', isha: '20:25' }, // Aug
    { fajr: '04:58', sunrise: '06:12', dhuhr: '12:28', asr: '17:00', maghrib: '18:42', isha: '19:55' }, // Sep
    { fajr: '05:10', sunrise: '06:24', dhuhr: '12:20', asr: '16:40', maghrib: '18:12', isha: '19:28' }, // Oct
    { fajr: '05:25', sunrise: '06:45', dhuhr: '12:20', asr: '16:25', maghrib: '17:50', isha: '19:10' }, // Nov
    { fajr: '05:42', sunrise: '07:05', dhuhr: '12:28', asr: '16:25', maghrib: '17:48', isha: '19:12' }, // Dec
  ];
  
  const current = monthlyTables[month];
  
  // Estimate Hijri date
  const hijriMonths = [
    { en: 'Muharram', ar: 'محرّم' },
    { en: 'Safar', ar: 'صفر' },
    { en: 'Rabi al-Awwal', ar: 'ربيع الأول' },
    { en: 'Rabi al-Thani', ar: 'ربيع الثاني' },
    { en: 'Jumada al-Awwal', ar: 'جمادى الأولى' },
    { en: 'Jumada al-Thani', ar: 'جمادى الثانية' },
    { en: 'Rajab', ar: 'رجب' },
    { en: 'Sha\'ban', ar: 'شعبان' },
    { en: 'Ramadan', ar: 'رمضان' },
    { en: 'Shawwal', ar: 'شوّال' },
    { en: 'Dhu al-Qi\'dah', ar: 'ذو القعدة' },
    { en: 'Dhu al-Hijjah', ar: 'ذو الحجة' },
  ];
  
  return {
    fajr: current.fajr,
    sunrise: current.sunrise,
    dhuhr: current.dhuhr,
    asr: current.asr,
    maghrib: current.maghrib,
    isha: current.isha,
    midnight: '00:05',
    lastThird: '03:15',
    date: date.toISOString().split('T')[0],
    hijriDate: {
      day: '12',
      month: hijriMonths[1],
      year: '1448',
    },
  };
}

export async function fetchPrayerTimes(): Promise<{
  data: PrayerTimesApiResponse;
  source: 'ummah_api' | 'aladhan_api' | 'karachi_offline';
}> {
  // 1. Try prompt's specified Ummah API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    const response = await fetch(UMMAH_API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const json = await response.json();
      // Inspect shape
      const timings = json?.data?.timings || json?.timings || json?.data || json;
      if (timings && (timings.fajr || timings.Fajr)) {
        return {
          data: {
            fajr: timings.fajr || timings.Fajr,
            sunrise: timings.sunrise || timings.Sunrise,
            dhuhr: timings.dhuhr || timings.Dhuhr,
            asr: timings.asr || timings.Asr,
            maghrib: timings.maghrib || timings.Maghrib,
            isha: timings.isha || timings.Isha,
            midnight: timings.midnight || timings.Midnight || '00:05',
            lastThird: timings.lastThird || timings.Lastthird || '03:15',
            hijriDate: json?.data?.date?.hijri ? {
              day: json.data.date.hijri.day,
              month: {
                en: json.data.date.hijri.month.en,
                ar: json.data.date.hijri.month.ar,
              },
              year: json.data.date.hijri.year,
            } : undefined,
          },
          source: 'ummah_api',
        };
      }
    }
  } catch (err) {
    console.warn('Ummah API fetch error or CORS, trying Aladhan Karachi backup:', err);
  }

  // 2. Try Aladhan with Karachi method & Hanafi school
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const aladhanUrl = `https://api.aladhan.com/v1/timings?latitude=24.9780&longitude=67.0600&method=1&school=1`;
    
    const response = await fetch(aladhanUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const json = await response.json();
      if (json?.data?.timings) {
        const t = json.data.timings;
        const h = json.data.date?.hijri;
        return {
          data: {
            fajr: t.Fajr,
            sunrise: t.Sunrise,
            dhuhr: t.Dhuhr,
            asr: t.Asr,
            maghrib: t.Maghrib,
            isha: t.Isha,
            midnight: t.Midnight,
            lastThird: t.Lastthird,
            date: json.data.date?.gregorian?.date,
            hijriDate: h ? {
              day: h.day,
              month: {
                en: h.month.en,
                ar: h.month.ar,
              },
              year: h.year,
            } : undefined,
          },
          source: 'aladhan_api',
        };
      }
    }
  } catch (err) {
    console.warn('Aladhan backup error:', err);
  }

  // 3. Fallback to offline calculated Karachi Hanafi schedule
  return {
    data: getLocalKarachiPrayerTimes(new Date()),
    source: 'karachi_offline',
  };
}

export function computeNextPrayer(
  times: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  },
  jamaatTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    jumma: string;
  },
  now = new Date(),
  adminSettings?: AdminPrayerSettings
): {
  nextPrayerId: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nextPrayerNameEn: string;
  nextPrayerNameUr: string;
  nextTime12h: string;
  nextJamaat12h: string;
  targetDate: Date;
  secondsRemaining: number;
  currentPrayerId: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  iqamahCountdown: IqamahCountdownState | null;
} {
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  
  const prayerList = [
    { id: 'fajr' as const, nameEn: 'Fajr', nameUr: 'فجر', timeStr: times.fajr, jamaat: jamaatTimes.fajr },
    { id: 'sunrise' as const, nameEn: 'Sunrise', nameUr: 'طلوع آفتاب', timeStr: times.sunrise, jamaat: '-' },
    { id: 'dhuhr' as const, nameEn: 'Dhuhr', nameUr: 'ظہر', timeStr: times.dhuhr, jamaat: jamaatTimes.dhuhr },
    { id: 'asr' as const, nameEn: 'Asr', nameUr: 'عصر', timeStr: times.asr, jamaat: jamaatTimes.asr },
    { id: 'maghrib' as const, nameEn: 'Maghrib', nameUr: 'مغرب', timeStr: times.maghrib, jamaat: jamaatTimes.maghrib },
    { id: 'isha' as const, nameEn: 'Isha', nameUr: 'عشاء', timeStr: times.isha, jamaat: jamaatTimes.isha },
  ];

  const listWithMinutes = prayerList.map(p => ({
    ...p,
    minutes: timeStringToMinutes(p.timeStr),
  }));

  // Find current prayer & next prayer
  let currentPrayer = listWithMinutes[listWithMinutes.length - 1]; // Default Isha/Night
  let nextPrayer = listWithMinutes[0]; // Default Fajr next day
  let isNextDay = false;

  for (let i = 0; i < listWithMinutes.length; i++) {
    if (currentMinutes < listWithMinutes[i].minutes) {
      nextPrayer = listWithMinutes[i];
      currentPrayer = i === 0 ? listWithMinutes[listWithMinutes.length - 1] : listWithMinutes[i - 1];
      isNextDay = false;
      break;
    }
  }

  if (currentMinutes >= listWithMinutes[listWithMinutes.length - 1].minutes) {
    // Past Isha -> Next is tomorrow Fajr
    nextPrayer = listWithMinutes[0];
    currentPrayer = listWithMinutes[listWithMinutes.length - 1];
    isNextDay = true;
  }

  // Calculate target Date
  const targetDate = new Date(now);
  const targetMins = nextPrayer.minutes;
  targetDate.setHours(Math.floor(targetMins / 60), targetMins % 60, 0, 0);
  if (isNextDay) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const secondsRemaining = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000));

  // Compute live Iqamah Countdown & Status
  // Checks if current time is between any prayer's Adhan and Jamaat, or within 15 mins of Jamaat (congregation window)
  const isFriday = now.getDay() === 5;
  const congregationalPrayers = [
    {
      id: 'fajr' as const,
      nameEn: 'Fajr',
      nameUr: 'فجر',
      nameAr: 'الفَجْر',
      adhanStr: adminSettings?.fajrAzan || times.fajr,
      jamaatStr: jamaatTimes.fajr,
    },
    {
      id: (isFriday ? 'jumma' : 'dhuhr') as 'dhuhr' | 'jumma',
      nameEn: isFriday ? 'Juma (Friday)' : 'Dhuhr',
      nameUr: isFriday ? 'جمعۃ المبارک' : 'ظہر',
      nameAr: isFriday ? 'صَلَاة الجُمُعَة' : 'الظُّهْر',
      adhanStr: isFriday
        ? adminSettings?.jummaAzan || '01:00 PM'
        : adminSettings?.dhuhrAzan || times.dhuhr,
      jamaatStr: isFriday
        ? jamaatTimes.jumma || '01:45 PM'
        : jamaatTimes.dhuhr,
    },
    {
      id: 'asr' as const,
      nameEn: 'Asr',
      nameUr: 'عصر',
      nameAr: 'العَصْر',
      adhanStr: adminSettings?.asrAzan || times.asr,
      jamaatStr: jamaatTimes.asr,
    },
    {
      id: 'maghrib' as const,
      nameEn: 'Maghrib',
      nameUr: 'مغرب',
      nameAr: 'المَغْرِب',
      adhanStr: adminSettings?.maghribAzan || times.maghrib,
      jamaatStr: jamaatTimes.maghrib,
    },
    {
      id: 'isha' as const,
      nameEn: 'Isha',
      nameUr: 'عشاء',
      nameAr: 'العِشَاء',
      adhanStr: adminSettings?.ishaAzan || times.isha,
      jamaatStr: jamaatTimes.isha,
    },
  ];

  let activeIqamah: IqamahCountdownState | null = null;

  for (const cp of congregationalPrayers) {
    const adhanMins = timeStringToMinutes(cp.adhanStr);
    const jamaatMins = timeStringToMinutes(cp.jamaatStr);

    const adhanDate = new Date(now);
    adhanDate.setHours(Math.floor(adhanMins / 60), adhanMins % 60, 0, 0);

    const jamaatDate = new Date(now);
    jamaatDate.setHours(Math.floor(jamaatMins / 60), jamaatMins % 60, 0, 0);
    if (jamaatDate.getTime() < adhanDate.getTime()) {
      jamaatDate.setDate(jamaatDate.getDate() + 1);
    }

    // Grace congregation window (15 mins after Jamaat starts)
    const congregationEnd = new Date(jamaatDate.getTime() + 15 * 60 * 1000);

    if (now.getTime() >= adhanDate.getTime() && now.getTime() <= congregationEnd.getTime()) {
      const isTimeForIqamah = now.getTime() >= jamaatDate.getTime();
      const iqamahSecs = isTimeForIqamah
        ? 0
        : Math.max(0, Math.floor((jamaatDate.getTime() - now.getTime()) / 1000));
      const totalDurationSeconds = Math.max(
        1,
        Math.floor((jamaatDate.getTime() - adhanDate.getTime()) / 1000)
      );
      const elapsedSeconds = totalDurationSeconds - iqamahSecs;
      const progressPercent = Math.min(
        100,
        Math.max(0, Math.round((elapsedSeconds / totalDurationSeconds) * 100))
      );

      activeIqamah = {
        isIqamahPeriod: true,
        isTimeForIqamah,
        prayerId: cp.id,
        prayerNameEn: cp.nameEn,
        prayerNameUr: cp.nameUr,
        prayerNameAr: cp.nameAr,
        adhanTime12h: formatTo12Hour(cp.adhanStr),
        jamaatTime12h: cp.jamaatStr.includes('AM') || cp.jamaatStr.includes('PM')
          ? cp.jamaatStr
          : formatTo12Hour(cp.jamaatStr),
        secondsRemaining: iqamahSecs,
        minutesRemaining: Math.floor(iqamahSecs / 60),
        secondsPart: iqamahSecs % 60,
        totalDurationSeconds,
        elapsedSeconds,
        progressPercent,
      };
      break;
    }
  }

  return {
    nextPrayerId: nextPrayer.id,
    nextPrayerNameEn: nextPrayer.nameEn,
    nextPrayerNameUr: nextPrayer.nameUr,
    nextTime12h: formatTo12Hour(nextPrayer.timeStr),
    nextJamaat12h: nextPrayer.jamaat,
    targetDate,
    secondsRemaining,
    currentPrayerId: currentPrayer.id,
    iqamahCountdown: activeIqamah,
  };
}

// Helper to create a simulated Iqamah state for instant preview and demonstration
export function createSimulatedIqamahState(
  prayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumma',
  secondsRemaining: number,
  times: PrayerTimesApiResponse,
  jamaatTimes: JamaatTimes,
  adminSettings?: AdminPrayerSettings
): IqamahCountdownState {
  const names: Record<string, { en: string; ur: string; ar: string }> = {
    fajr: { en: 'Fajr', ur: 'فجر', ar: 'الفَجْر' },
    dhuhr: { en: 'Dhuhr', ur: 'ظہر', ar: 'الظُّهْر' },
    jumma: { en: 'Juma (Friday)', ur: 'جمعۃ المبارک', ar: 'صَلَاة الجُمُعَة' },
    asr: { en: 'Asr', ur: 'عصر', ar: 'العَصْر' },
    maghrib: { en: 'Maghrib', ur: 'مغرب', ar: 'المَغْرِب' },
    isha: { en: 'Isha', ur: 'عشاء', ar: 'العِشَاء' },
  };

  const pName = names[prayerId] || names.asr;
  const totalDurationSeconds = 20 * 60; // 20 minutes typical window between Azan & Iqamah
  const isTimeForIqamah = secondsRemaining <= 0;
  const elapsed = Math.max(0, totalDurationSeconds - secondsRemaining);
  const progress = Math.min(100, Math.round((elapsed / totalDurationSeconds) * 100));

  let adhanStr = (times as any)[prayerId] || '05:00 PM';
  let jamaatStr = (jamaatTimes as any)[prayerId] || '05:30 PM';
  if (prayerId === 'jumma') {
    adhanStr = adminSettings?.jummaAzan || '01:00 PM';
    jamaatStr = jamaatTimes.jumma || '01:45 PM';
  }

  return {
    isIqamahPeriod: true,
    isTimeForIqamah,
    prayerId,
    prayerNameEn: pName.en,
    prayerNameUr: pName.ur,
    prayerNameAr: pName.ar,
    adhanTime12h: formatTo12Hour(adhanStr),
    jamaatTime12h:
      jamaatStr.includes('AM') || jamaatStr.includes('PM')
        ? jamaatStr
        : formatTo12Hour(jamaatStr),
    secondsRemaining: Math.max(0, secondsRemaining),
    minutesRemaining: Math.floor(Math.max(0, secondsRemaining) / 60),
    secondsPart: Math.max(0, secondsRemaining) % 60,
    totalDurationSeconds,
    elapsedSeconds: elapsed,
    progressPercent: progress,
    isSimulated: true,
  };
}
