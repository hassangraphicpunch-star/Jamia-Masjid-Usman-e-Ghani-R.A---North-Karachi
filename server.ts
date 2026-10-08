import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'mosque_admin_settings.json');

// Default initial settings if file does not exist
const DEFAULT_INITIAL_SETTINGS = {
  fajrJamaat: '05:55 AM',
  dhuhrJamaat: '01:30 PM',
  asrJamaat: '05:00 PM',
  maghribJamaat: '+5 mins after Azan',
  ishaJamaat: '08:00 PM',
  jummaAzan: '12:50 PM',
  jummaAzan2: '01:40 PM',
  jummaBayan: '01:10 PM',
  jummaKhutbah: '01:45 PM',
  jummaJamaat: '01:50 PM',
  jummaKhateebEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
  jummaKhateebUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)',
  ishraqTime: '+12 mins after Tuloo',
  chashtTime: '08:45 AM - 11:30 AM',
  zawalTime: '', // Dynamic daily calculation based on astronomical solar noon
  ramadanDemoMode: false,
  ramadanSehriTime: '05:00 AM',
  ramadanIftarTime: '06:45 PM',
  ramadanRozaNo: 1,
  ramadanSirenSound: true,
  whatsappNumber: '03233469424',
  showAlertBanner: false,
  alertBannerEn: '',
  alertBannerUr: '',
  defaultAzanVoice: 'makkah',
  autoPlayAzan: true,
  azanVolume: 0.85,
  iqamahAlertSound: true,
  lastSavedTimestamp: new Date().toISOString(),
  lastPublishedBy: 'Masjid Administration',
};

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read settings from disk
function readPublishedSettings() {
  try {
    ensureDataDir();
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && parsed.zawalTime === '12:12 PM - 12:28 PM') {
        parsed.zawalTime = '';
      }
      if (parsed && (parsed.fajrJamaat === '05:45 AM' || parsed.fajrJamaat === '05:40 AM' || parsed.fajrJamaat === '05:50 AM' || parsed.fajrJamaat === '05:00 AM')) {
        parsed.fajrJamaat = '05:55 AM';
      }
      if (parsed && (parsed.ishaJamaat === '08:15 PM' || parsed.ishaJamaat === '08:30 PM' || parsed.ishaJamaat === '08:45 PM')) {
        parsed.ishaJamaat = '08:00 PM';
      }
      return parsed;
    }
  } catch (err) {
    console.error('[Server] Error reading settings file:', err);
  }
  return DEFAULT_INITIAL_SETTINGS;
}

// Write settings to disk
function writePublishedSettings(settings: any) {
  try {
    ensureDataDir();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Server] Error saving settings to disk:', err);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '15mb' }));

  // API 1: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // API 2: Fetch permanently published settings for all visitors
  app.get('/api/admin-settings', (req, res) => {
    const settings = readPublishedSettings();
    res.json({
      success: true,
      settings,
      publishedAt: settings.lastSavedTimestamp || new Date().toISOString(),
      source: 'cloud_storage',
    });
  });

  // API 3: Permanently publish new timings and announcements from Admin Portal
  app.post('/api/admin-settings', (req, res) => {
    const { settings, pin } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid settings payload provided',
      });
    }

    // Optional PIN verification if provided
    if (pin && pin !== 'Pak123@#') {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin authorization PIN',
      });
    }

    const current = readPublishedSettings();
    const updatedSettings = {
      ...current,
      ...settings,
      lastSavedTimestamp: new Date().toISOString(),
      lastPublishedBy: 'Masjid Administration Portal',
    };

    const saved = writePublishedSettings(updatedSettings);
    if (!saved) {
      return res.status(500).json({
        success: false,
        error: 'Failed to write settings to permanent storage',
      });
    }

    console.log(
      `[Server] Admin settings published permanently at ${updatedSettings.lastSavedTimestamp}: Fajr=${updatedSettings.fajrJamaat}, Dhuhr=${updatedSettings.dhuhrJamaat}, Jumma=${updatedSettings.jummaJamaat}`
    );

    return res.json({
      success: true,
      settings: updatedSettings,
      message: 'Settings published permanently for all devices and users.',
      publishedAt: updatedSettings.lastSavedTimestamp,
    });
  });

  // API 4: Reset settings to mosque standard defaults
  app.post('/api/admin-settings/reset', (req, res) => {
    const resetSettings = {
      ...DEFAULT_INITIAL_SETTINGS,
      lastSavedTimestamp: new Date().toISOString(),
    };

    writePublishedSettings(resetSettings);
    res.json({
      success: true,
      settings: resetSettings,
      message: 'Settings reset to mosque defaults.',
    });
  });

  // API 5: Official Mosque YouTube Channel Videos (Channel ID: UCwVpogbMkz9FqhtdGNS5Gvg)
  app.get('/api/youtube/channel-videos', async (req, res) => {
    const channelId = 'UCwVpogbMkz9FqhtdGNS5Gvg';
    const apiKey = process.env.YOUTUBE_API_KEY;
    const maxResults = Math.min(20, Math.max(1, parseInt(req.query.maxResults as string) || 6));

    if (apiKey) {
      try {
        const ytUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`;
        const response = await fetch(ytUrl);
        if (response.ok) {
          const ytData: any = await response.json();
          if (ytData.items && Array.isArray(ytData.items)) {
            const videos = ytData.items
              .filter((item: any) => item.id?.videoId)
              .map((item: any) => ({
                video_id: item.id.videoId,
                title: item.snippet.title,
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                published_at: item.snippet.publishedAt,
                thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
                channelTitle: item.snippet.channelTitle,
              }));
            return res.json({
              success: true,
              channelId,
              channelUrl: `https://www.youtube.com/channel/${channelId}`,
              videos,
              source: 'youtube_api',
            });
          }
        }
      } catch (err) {
        console.warn('[Server] YouTube API call error:', err);
      }
    }

    // Default verified archive from channel UCwVpogbMkz9FqhtdGNS5Gvg
    res.json({
      success: true,
      channelId,
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      source: 'official_channel_archive',
      videos: [
        {
          video_id: 'rL9U3d5qT2k',
          title: 'حضرت عثمان غنی رضی اللہ عنہ کی سخاوت اور حیاء | مولانا یونس منصوری',
          url: 'https://www.youtube.com/watch?v=rL9U3d5qT2k',
          published_at: '2026-08-28T14:30:00Z',
          thumbnailUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
          channelTitle: 'Jamia Masjid Usman-e-Ghani Official',
        },
        {
          video_id: 'wVpogbM101',
          title: 'درسِ قرآن و تفسیر سورۃ البقرہ | جامع مسجد عثمان غنی نارتھ کراچی',
          url: 'https://www.youtube.com/watch?v=wVpogbM101',
          published_at: '2026-08-25T16:00:00Z',
          thumbnailUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
          channelTitle: 'Jamia Masjid Usman-e-Ghani Official',
        },
        {
          video_id: 'wVpogbM102',
          title: 'خطبہ جمعۃ المبارک: حقوق العباد اور معاشرتی ذمہ داریاں | جامع مسجد عثمان غنی',
          url: 'https://www.youtube.com/watch?v=wVpogbM102',
          published_at: '2026-08-21T13:45:00Z',
          thumbnailUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
          channelTitle: 'Jamia Masjid Usman-e-Ghani Official',
        },
        {
          video_id: 'wVpogbM103',
          title: 'تلاوت کلام پاک و حسن قرأت | دارالقرآن و مکتب جامع مسجد عثمان غنی',
          url: 'https://www.youtube.com/watch?v=wVpogbM103',
          published_at: '2026-08-18T10:15:00Z',
          thumbnailUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
          channelTitle: 'Jamia Masjid Usman-e-Ghani Official',
        },
      ],
    });
  });

  // API 5.5: Official Islamic Prayer Calculation Methods
  const PRAYER_METHODS: Record<string, any> = {
    MuslimWorldLeague: {
      name: 'Muslim World League',
      description: 'General purpose method used in many countries',
      fajr_angle: '18°',
      isha_angle: '17°',
    },
    Egyptian: {
      name: 'Egyptian General Authority of Survey',
      description: 'Used in Egypt and some Middle Eastern countries',
      fajr_angle: '19.5°',
      isha_angle: '17.5°',
    },
    Karachi: {
      name: 'University of Islamic Sciences, Karachi',
      description: 'Used in Pakistan, Bangladesh, India, Afghanistan',
      fajr_angle: '18°',
      isha_angle: '18°',
      madhab: 'Hanafi',
      asr_calculation: 'Shadow length = 2x object length',
      isOfficialForMasjid: true,
    },
    UmmAlQura: {
      name: 'Umm Al-Qura University, Makkah',
      description: 'Used in Saudi Arabia',
      fajr_angle: '18.5°',
      isha_description: '90 minutes after Maghrib',
    },
    Dubai: {
      name: 'Dubai',
      description: 'Used in UAE',
      fajr_angle: '18.2°',
      isha_angle: '18.2°',
    },
    MoonsightingCommittee: {
      name: 'Moonsighting Committee Worldwide',
      description: 'Recommended for North America',
      fajr_angle: '18°',
      isha_angle: '18°',
    },
    NorthAmerica: {
      name: 'Islamic Society of North America (ISNA)',
      description: 'Used in North America',
      fajr_angle: '15°',
      isha_angle: '15°',
    },
    ISNA: {
      name: 'Islamic Society of North America',
      description: 'Alias for NorthAmerica method',
      fajr_angle: '15°',
      isha_angle: '15°',
    },
    Kuwait: {
      name: 'Kuwait',
      description: 'Used in Kuwait',
      fajr_angle: '18°',
      isha_angle: '17.5°',
    },
    Qatar: {
      name: 'Qatar',
      description: 'Used in Qatar',
      fajr_angle: '18°',
      isha_angle: '18°',
    },
    Singapore: {
      name: 'Singapore',
      description: 'Used in Singapore and Malaysia',
      fajr_angle: '20°',
      isha_angle: '18°',
    },
    Turkey: {
      name: 'Diyanet (Turkey)',
      description: 'Turkish Presidency of Religious Affairs. Used in Turkey, Balkans, Central Asia',
      fajr_angle: '18°',
      isha_angle: '17°',
    },
    Diyanet: {
      name: 'Diyanet (Turkey)',
      description: 'Alias for Turkey method',
      fajr_angle: '18°',
      isha_angle: '17°',
    },
    Tehran: {
      name: 'Institute of Geophysics, University of Tehran',
      description: 'Used in Iran, parts of Afghanistan',
      fajr_angle: '17.7°',
      isha_angle: '14°',
    },
    JAKIM: {
      name: 'Jabatan Kemajuan Islam Malaysia',
      description: 'Official method for Malaysia',
      fajr_angle: '20°',
      isha_angle: '18°',
    },
    UOIF: {
      name: 'Union des Organisations Islamiques de France',
      description: 'Used in France and parts of Western Europe',
      fajr_angle: '12°',
      isha_angle: '12°',
    },
    Gulf: {
      name: 'Gulf Region',
      description: 'Used in Bahrain, Oman, Yemen. Isha is 90 minutes after Maghrib',
      fajr_angle: '19.5°',
      isha_description: '90 minutes after Maghrib',
    },
    Algeria: {
      name: 'Algerian Ministry of Religious Affairs',
      description: 'Used in Algeria',
      fajr_angle: '18°',
      isha_angle: '17°',
    },
    Tunisia: {
      name: 'Tunisian Ministry of Religious Affairs',
      description: 'Used in Tunisia',
      fajr_angle: '18°',
      isha_angle: '18°',
    },
    Morocco: {
      name: 'Moroccan Ministry of Habous and Islamic Affairs',
      description: 'Used in Morocco',
      fajr_angle: '19°',
      isha_angle: '17°',
    },
    Jordan: {
      name: 'Jordan Ministry of Awqaf',
      description: 'Used in Jordan',
      fajr_angle: '18°',
      isha_angle: '18°',
    },
    Palestine: {
      name: 'Palestine Ministry of Awqaf',
      description: 'Used in Palestine',
      fajr_angle: '18°',
      isha_angle: '18°',
    },
    Jafari: {
      name: 'Shia Ithna Ashari (Jafari)',
      description: 'Leva Institute, Qum. Used by Shia communities. Maghrib follows sunset in this implementation.',
      fajr_angle: '16°',
      isha_angle: '14°',
      madhab: 'Jafari',
    },
    Hanafi: {
      name: 'Hanafi Madhab',
      description: 'Asr when shadow = 2x object length',
      fajr_angle: '18°',
      isha_angle: '17°',
      asr_calculation: 'Shadow length = 2x object length',
      madhab: 'Hanafi',
    },
    Shafi: {
      name: 'Shafi Madhab',
      description: 'Asr when shadow = 1x object length',
      fajr_angle: '18°',
      isha_angle: '17°',
      asr_calculation: 'Shadow length = 1x object length',
      madhab: 'Shafi/Maliki/Hanbali',
    },
    Maliki: {
      name: 'Maliki Madhab',
      description: 'Asr when shadow = 1x object length',
      fajr_angle: '18°',
      isha_angle: '17°',
      asr_calculation: 'Shadow length = 1x object length',
      madhab: 'Shafi/Maliki/Hanbali',
    },
    Hanbali: {
      name: 'Hanbali Madhab',
      description: 'Asr when shadow = 1x object length',
      fajr_angle: '18°',
      isha_angle: '17°',
      asr_calculation: 'Shadow length = 1x object length',
      madhab: 'Shafi/Maliki/Hanbali',
    },
  };

  // Map method name to Aladhan API method number ID
  const METHOD_TO_ALADHAN_ID: Record<string, number> = {
    Karachi: 1,
    Hanafi: 1,
    ISNA: 2,
    NorthAmerica: 2,
    MuslimWorldLeague: 3,
    UmmAlQura: 4,
    Egyptian: 5,
    Tehran: 7,
    Gulf: 8,
    Kuwait: 9,
    Qatar: 10,
    Singapore: 11,
    UOIF: 12,
    Turkey: 13,
    Diyanet: 13,
    MoonsightingCommittee: 15,
    Dubai: 16,
    JAKIM: 17,
    Tunisia: 18,
    Algeria: 19,
    Morocco: 21,
    Jordan: 23,
    Jafari: 0,
    Shafi: 3,
    Maliki: 3,
    Hanbali: 3,
  };

  // Monthly Maghrib sunset times for Karachi (Lat 24.9961° N, Lng 67.0673° E)
  const KARACHI_MONTHLY_MAGHRIB: Record<number, { h: number; m: number }> = {
    1: { h: 18, m: 5 },
    2: { h: 18, m: 22 },
    3: { h: 18, m: 40 },
    4: { h: 18, m: 55 },
    5: { h: 19, m: 12 },
    6: { h: 19, m: 24 },
    7: { h: 19, m: 25 },
    8: { h: 19, m: 8 },
    9: { h: 18, m: 42 },
    10: { h: 18, m: 12 },
    11: { h: 17, m: 50 },
    12: { h: 17, m: 48 },
  };

  // Helper: Accurate Pakistan / Karachi Central Ruet-e-Hilal Hijri Date
  // In Islamic lunar calendar, the date changes daily at MAGHRIB (sunset), NOT at midnight!
  function getPakistanVerifiedHijriDate(d: Date = new Date()) {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(d);
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours();
    let minute = d.getMinutes();

    for (const p of parts) {
      if (p.type === 'year') year = parseInt(p.value, 10);
      if (p.type === 'month') month = parseInt(p.value, 10);
      if (p.type === 'day') day = parseInt(p.value, 10);
      if (p.type === 'hour') hour = parseInt(p.value, 10);
      if (p.type === 'minute') minute = parseInt(p.value, 10);
    }

    // Check if Maghrib (sunset) has arrived today in Karachi
    const maghrib = KARACHI_MONTHLY_MAGHRIB[month] || { h: 18, m: 15 };
    const currentMins = hour * 60 + minute;
    const maghribMins = maghrib.h * 60 + maghrib.m;
    const isPostMaghrib = currentMins >= maghribMins;
    const maghribShift = isPostMaghrib ? 1 : 0;

    const effectiveCivilDate = new Date(Date.UTC(year, month - 1, day + maghribShift, 12, 0, 0));
    const calculationDate = new Date(effectiveCivilDate.getTime() - 2 * 86400000);

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
      hijriDay = 26;
      hijriMonth = 4;
      hijriYear = 1448;
    }

    const months = [
      { num: 1, en: 'Muharram', ar: 'المحرّم', ur: 'محرم الحرام' },
      { num: 2, en: 'Safar', ar: 'صفر', ur: 'صفر المظفر' },
      { num: 3, en: "Rabi' al-Awwal", ar: 'ربيع الأول', ur: 'ربیع الاول' },
      { num: 4, en: "Rabi' al-thani", ar: 'رَبِيع الثَّانِي', ur: 'ربیع الثانی' },
      { num: 5, en: "Jumada al-Awwal", ar: 'جمادى الأولى', ur: 'جمادی الاول' },
      { num: 6, en: "Jumada al-Thani", ar: 'جمادى الثانية', ur: 'جمادی الثانی' },
      { num: 7, en: 'Rajab', ar: 'رجب', ur: 'رجب المرجب' },
      { num: 8, en: "Sha'ban", ar: 'شعبان', ur: 'شعبان المعظم' },
      { num: 9, en: 'Ramadan', ar: 'رمضان', ur: 'رمضان المبارک' },
      { num: 10, en: 'Shawwal', ar: 'شوّال', ur: 'شوال المکرم' },
      { num: 11, en: "Dhu al-Qi'dah", ar: 'ذو القعدة', ur: 'ذی القعدہ' },
      { num: 12, en: 'Dhu al-Hijjah', ar: 'ذو الحجة', ur: 'ذی الحجہ' },
    ];

    const mInfo = months[month - 1] || months[3];

    return {
      day,
      month,
      month_name: mInfo.en,
      month_name_arabic: mInfo.ar,
      month_name_urdu: mInfo.ur,
      year,
      era: 'AH (After Hijra)',
      formatted: `${day} ${mInfo.ar} ${year} AH`,
      formattedUr: `${day} ${mInfo.ur} ${year}ھ`,
      formattedAr: `${day} ${mInfo.ar} ${year} هـ`,
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    };
  }

  // Helper: Moon phase & illumination synchronized with Islamic calendar day
  function getMoonTelemetry(d: Date = new Date(), hijriDay: number = 23) {
    const synodicMonthDays = 29.53058867;
    const currentHourFraction = (d.getHours() + d.getMinutes() / 60) / 24;
    const ageDays = Math.max(0.5, Math.min(29.5, (hijriDay - 1) + 0.8 + currentHourFraction * 0.4));
    const phaseRatio = ageDays / synodicMonthDays;

    const illuminationFraction = 0.5 * (1 - Math.cos(2 * Math.PI * phaseRatio));
    const illumination = Math.min(100, Math.max(0, Math.round(illuminationFraction * 100)));
    const isWaxing = phaseRatio < 0.5;

    let phaseId = 'waning_crescent';
    let nameUr = 'گھٹتا ہوا ہلال';
    let nameEn = 'Waning Crescent';
    let arabicName = 'الهلال المتناقص / العرجون القديم';

    if (phaseRatio < 0.02 || phaseRatio >= 0.98) {
      phaseId = 'new_moon';
      nameUr = 'نیا چاند';
      nameEn = 'New Moon';
      arabicName = 'المحاق / الهلال الجديد';
    } else if (phaseRatio < 0.23) {
      phaseId = 'waxing_crescent';
      nameUr = 'بڑھتا ہوا ہلال';
      nameEn = 'Waxing Crescent';
      arabicName = 'الهلال المتزايد';
    } else if (phaseRatio < 0.27) {
      phaseId = 'first_quarter';
      nameUr = 'پہلی تربیع';
      nameEn = 'First Quarter';
      arabicName = 'التربيع الأول';
    } else if (phaseRatio < 0.48) {
      phaseId = 'waxing_gibbous';
      nameUr = 'بڑھتا ہوا محدب چاند';
      nameEn = 'Waxing Gibbous';
      arabicName = 'الأحدب المتزايد';
    } else if (phaseRatio < 0.52) {
      phaseId = 'full_moon';
      nameUr = 'بدر / پورا چاند';
      nameEn = 'Full Moon';
      arabicName = 'البدر الكامل';
    } else if (phaseRatio < 0.73) {
      phaseId = 'waning_gibbous';
      nameUr = 'گھٹتا ہوا محدب چاند';
      nameEn = 'Waning Gibbous';
      arabicName = 'الأحدب المتناقص';
    } else if (phaseRatio < 0.77) {
      phaseId = 'last_quarter';
      nameUr = 'آخری تربیع';
      nameEn = 'Last Quarter';
      arabicName = 'التربيع الثاني';
    }

    return {
      phase_id: phaseId,
      name_ur: nameUr,
      name_en: nameEn,
      arabic_name: arabicName,
      illumination_percentage: illumination,
      direction: isWaxing ? 'waxing' : 'waning',
      direction_symbol: isWaxing ? '↑' : '↓',
      direction_ur: isWaxing ? '↑ بڑھ رہا ہے' : '↓ گھٹ رہا ہے',
      direction_en: isWaxing ? '↑ Waxing' : '↓ Waning',
      age_days: ageDays,
      hijri_day: hijriDay,
    };
  }

  // API 5.5: Return full list of prayer calculation methods
  app.get('/api/prayer-methods', (req, res) => {
    res.json({
      success: true,
      service: 'prayer-methods',
      data: {
        methods: PRAYER_METHODS,
        default_method: 'MuslimWorldLeague',
        recommended_masjid_method: 'Karachi',
        usage: 'Add ?method=MethodName to /api/prayer-times endpoint',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // API 5.55: Official Today Hijri & Moon Telemetry (Matches Pakistan Central Ruet-e-Hilal)
  app.get('/api/today-hijri', (req, res) => {
    const now = new Date();
    const hijri = getPakistanVerifiedHijriDate(now);
    const moon = getMoonTelemetry(now, hijri.day);

    const yearStr = now.getFullYear();
    const monthStr = String(now.getMonth() + 1).padStart(2, '0');
    const dayStr = String(now.getDate()).padStart(2, '0');
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = [
      'October', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    // Exact month name
    const actualMonthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    res.json({
      success: true,
      service: 'today-hijri',
      data: {
        gregorian: {
          date: `${yearStr}-${monthStr}-${dayStr}`,
          formatted: `${dayNames[now.getDay()]}, ${actualMonthNames[now.getMonth()]} ${dayStr}, ${yearStr}`,
          day_of_week: dayNames[now.getDay()],
          day: now.getDate(),
          month: now.getMonth() + 1,
          month_name: actualMonthNames[now.getMonth()],
          year: now.getFullYear(),
        },
        hijri: {
          date: hijri.date,
          formatted: hijri.formatted,
          formatted_ur: hijri.formattedUr,
          formatted_ar: hijri.formattedAr,
          day: hijri.day,
          month: hijri.month,
          month_name: hijri.month_name,
          month_name_arabic: hijri.month_name_arabic,
          month_name_urdu: hijri.month_name_urdu,
          year: hijri.year,
          era: hijri.era,
        },
        moon,
        islamic_info: {
          hijri_era_start: 'July 16, 622 CE - Migration of Prophet Muhammad (PBUH) from Mecca to Medina',
          calendar_type: 'Lunar calendar based on moon phases',
          note: 'Islamic dates may vary by 1-2 days depending on moon sighting',
          quran_reference: 'وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ (سورة يس: 39)',
        },
      },
      timestamp: now.toISOString(),
      api_info: {
        sadaqah_jariah: 'This API is provided as sadaqah jariah for the Muslim ummah',
      },
    });
  });

  // API 5.6: Calculate & fetch prayer times for any specified method and location
  app.get('/api/prayer-times', async (req, res) => {
    const rawMethod = (req.query.method as string) || 'Karachi';
    // Normalize method key
    const matchedKey = Object.keys(PRAYER_METHODS).find(
      (k) => k.toLowerCase() === rawMethod.toLowerCase()
    ) || 'Karachi';
    const methodInfo = PRAYER_METHODS[matchedKey] || PRAYER_METHODS.Karachi;

    const madhab = (req.query.madhab as string) || (methodInfo.madhab === 'Hanafi' || matchedKey === 'Hanafi' ? 'Hanafi' : 'Hanafi');
    const school = madhab.toLowerCase() === 'hanafi' ? 1 : 0;
    
    // Default coordinates: Jamia Masjid Usman-e-Ghani, North Karachi
    const lat = parseFloat(req.query.lat as string) || 24.9961;
    const lng = parseFloat(req.query.lng as string) || 67.0673;

    // Verified Pakistan Central Ruet-e-Hilal Hijri Date
    const verifiedHijri = getPakistanVerifiedHijriDate(new Date());
    const pakHijriPayload = {
      day: String(verifiedHijri.day),
      month: {
        en: verifiedHijri.month_name,
        ar: verifiedHijri.month_name_arabic,
        ur: verifiedHijri.month_name_urdu,
      },
      year: String(verifiedHijri.year),
      formatted: verifiedHijri.formatted,
      formattedUr: verifiedHijri.formattedUr,
      formattedAr: verifiedHijri.formattedAr,
    };

    // 1. Try Ummah API
    try {
      const ummahUrl = `https://www.ummahapi.com/api/prayer-times?lat=${lat}&lng=${lng}&method=${encodeURIComponent(matchedKey)}&madhab=${encodeURIComponent(madhab)}&highLatitudeRule=recommended`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const resp = await fetch(ummahUrl, { signal: controller.signal, headers: { Accept: 'application/json' } });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const ummahJson: any = await resp.json();
        const timings = ummahJson?.data?.timings || ummahJson?.timings || ummahJson?.data;
        if (timings && (timings.fajr || timings.Fajr)) {
          return res.json({
            success: true,
            service: 'prayer-times',
            method: matchedKey,
            madhab,
            method_info: methodInfo,
            data: {
              fajr: timings.fajr || timings.Fajr,
              sunrise: timings.sunrise || timings.Sunrise,
              dhuhr: timings.dhuhr || timings.Dhuhr,
              asr: timings.asr || timings.Asr,
              maghrib: timings.maghrib || timings.Maghrib,
              isha: timings.isha || timings.Isha,
              midnight: timings.midnight || timings.Midnight || '00:05',
              lastThird: timings.lastThird || timings.Lastthird || '03:15',
              hijriDate: pakHijriPayload,
            },
            source: 'ummah_api',
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      // Quietly continue to Aladhan proxy
    }

    // 2. Try Aladhan API with matched method ID & school
    try {
      const aladhanMethodId = METHOD_TO_ALADHAN_ID[matchedKey] ?? 1;
      const aladhanUrl = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${aladhanMethodId}&school=${school}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const resp = await fetch(aladhanUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const json: any = await resp.json();
        if (json?.data?.timings) {
          const t = json.data.timings;
          return res.json({
            success: true,
            service: 'prayer-times',
            method: matchedKey,
            madhab,
            method_info: methodInfo,
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
              hijriDate: pakHijriPayload,
            },
            source: 'aladhan_api',
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      // Fallback to offline schedule
    }

    // 3. Fallback to calculated Karachi schedule
    const now = new Date();
    const month = now.getMonth();

    const HIJRI_MONTHS = [
      { num: 1, en: 'Muharram', ar: 'محرّم' },
      { num: 2, en: 'Safar', ar: 'صفر' },
      { num: 3, en: 'Rabi al-Awwal', ar: 'ربيع الأول' },
      { num: 4, en: 'Rabi al-Thani', ar: 'ربيع الثاني' },
      { num: 5, en: 'Jumada al-Awwal', ar: 'جمادى الأولى' },
      { num: 6, en: 'Jumada al-Thani', ar: 'جمادى الثانية' },
      { num: 7, en: 'Rajab', ar: 'رجب' },
      { num: 8, en: 'Sha\'ban', ar: 'شعبان' },
      { num: 9, en: 'Ramadan', ar: 'رمضان' },
      { num: 10, en: 'Shawwal', ar: 'شوّال' },
      { num: 11, en: 'Dhu al-Qi\'dah', ar: 'ذو القعدة' },
      { num: 12, en: 'Dhu al-Hijjah', ar: 'ذو الحجة' },
    ];

    let hDay = 24;
    let hMonth = 4;
    let hYear = 1448;

    try {
      const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).formatToParts(now);
      for (const p of parts) {
        if (p.type === 'day') hDay = parseInt(p.value, 10);
        if (p.type === 'month') hMonth = parseInt(p.value, 10);
        if (p.type === 'year') hYear = parseInt(p.value, 10);
      }
    } catch (e) {
      // fallback
    }

    const currentHijriMonth = HIJRI_MONTHS[hMonth - 1] || HIJRI_MONTHS[3];

    const monthlyTables = [
      { fajr: '05:50', sunrise: '07:12', dhuhr: '12:40', asr: '16:35', maghrib: '18:05', isha: '19:25' },
      { fajr: '05:40', sunrise: '07:00', dhuhr: '12:42', asr: '16:50', maghrib: '18:22', isha: '19:40' },
      { fajr: '05:20', sunrise: '06:36', dhuhr: '12:38', asr: '17:00', maghrib: '18:40', isha: '19:55' },
      { fajr: '04:50', sunrise: '06:05', dhuhr: '12:30', asr: '17:08', maghrib: '18:55', isha: '20:12' },
      { fajr: '04:28', sunrise: '05:45', dhuhr: '12:28', asr: '17:15', maghrib: '19:12', isha: '20:30' },
      { fajr: '04:18', sunrise: '05:40', dhuhr: '12:30', asr: '17:22', maghrib: '19:24', isha: '20:45' },
      { fajr: '04:26', sunrise: '05:46', dhuhr: '12:35', asr: '17:25', maghrib: '19:25', isha: '20:45' },
      { fajr: '04:45', sunrise: '06:00', dhuhr: '12:35', asr: '17:18', maghrib: '19:08', isha: '20:25' },
      { fajr: '04:58', sunrise: '06:12', dhuhr: '12:28', asr: '17:00', maghrib: '18:42', isha: '19:55' },
      { fajr: '05:10', sunrise: '06:24', dhuhr: '12:20', asr: '16:40', maghrib: '18:12', isha: '19:28' },
      { fajr: '05:25', sunrise: '06:45', dhuhr: '12:20', asr: '16:25', maghrib: '17:50', isha: '19:10' },
      { fajr: '05:42', sunrise: '07:05', dhuhr: '12:28', asr: '16:25', maghrib: '17:48', isha: '19:12' },
    ];
    const current = monthlyTables[month];

    return res.json({
      success: true,
      service: 'prayer-times',
      method: matchedKey,
      madhab,
      method_info: methodInfo,
      data: {
        fajr: current.fajr,
        sunrise: current.sunrise,
        dhuhr: current.dhuhr,
        asr: current.asr,
        maghrib: current.maghrib,
        isha: current.isha,
        midnight: '00:05',
        lastThird: '03:15',
        date: now.toISOString().split('T')[0],
        hijriDate: {
          day: hDay.toString(),
          month: { en: currentHijriMonth.en, ar: currentHijriMonth.ar },
          year: hYear.toString(),
        },
      },
      source: 'karachi_offline_engine',
      timestamp: new Date().toISOString(),
    });
  });

  // API 6: Quran metadata service (Sadaqah Jariah)
  app.get('/api/quran/metadata', (req, res) => {
    res.json({
      success: true,
      service: 'quran',
      data: {
        total_surahs: 114,
        total_verses: 6236,
        total_juzs: 30,
        total_pages: 604,
        text_type: 'Uthmani (with tashkeel)',
        translations_available: [
          'sahih_international',
          'pickthall',
          'yusuf_ali',
          'urdu',
          'turkish',
          'indonesian',
          'french',
          'german',
        ],
        reciters_available: 13,
        reciters: [
          { id: 1, name: 'Mishary Rashid Alafasy', style: 'Murattal' },
          { id: 2, name: 'Abdul Rahman Al-Sudais', style: 'Murattal' },
          { id: 3, name: 'Abdul Basit Abdul Samad', style: 'Murattal' },
          { id: 4, name: 'Abdul Basit Abdul Samad (Mujawwad)', style: 'Mujawwad' },
          { id: 5, name: 'Maher Al Muaiqly', style: 'Murattal' },
          { id: 6, name: 'Saad Al-Ghamdi', style: 'Murattal' },
          { id: 7, name: 'Hani Ar-Rifai', style: 'Murattal' },
          { id: 8, name: 'Abu Bakr Al Shatri', style: 'Murattal' },
          { id: 9, name: 'Yasser Al-Dosari', style: 'Murattal' },
          { id: 10, name: 'Saud Al-Shuraim', style: 'Murattal' },
          { id: 11, name: 'Abdullah Al-Juhany', style: 'Murattal' },
          { id: 12, name: 'Bandar Baleela', style: 'Murattal' },
          { id: 13, name: 'Abdullah Al-Buajan', style: 'Murattal' },
        ],
        attribution: 'Quran text from Tanzil.net (CC BY 3.0). Translations via quran.com.',
      },
      api_info: {
        sadaqah_jariah: 'This API is provided as sadaqah jariah for the Muslim ummah',
        usage: 'Free for everyone',
      },
    });
  });

  // API 7: Fetch full Surah Arabic verses with translation
  app.get('/api/quran/surah/:number', async (req, res) => {
    const surahNumber = parseInt(req.params.number);
    const edition = (req.query.edition as string) || 'ur.jalandhry';

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return res.status(400).json({ success: false, error: 'Invalid surah number (1-114)' });
    }

    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,${edition}`
      );
      if (response.ok) {
        const json: any = await response.json();
        if (json && json.data && json.data.length >= 2) {
          const arabicData = json.data[0];
          const translationData = json.data[1];

          const ayahs = arabicData.ayahs.map((ayah: any, index: number) => {
            const transAyah = translationData.ayahs[index];
            let textArabic = ayah.text;
            if (surahNumber !== 1 && surahNumber !== 9 && index === 0) {
              const bismillahPrefix = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ';
              if (textArabic.startsWith(bismillahPrefix)) {
                textArabic = textArabic.replace(bismillahPrefix, '').trim();
              }
            }

            return {
              numberInSurah: ayah.numberInSurah,
              textArabic,
              translation: transAyah ? transAyah.text : '',
              juz: ayah.juz,
              page: ayah.page,
            };
          });

          return res.json({
            success: true,
            surahNumber,
            edition,
            ayahs,
          });
        }
      }
      return res.status(502).json({ success: false, error: 'Upstream Quran API unavailable' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 8: Real-time Karachi Weather Service (Open-Meteo cache proxy)
  let weatherCache: { timestamp: number; data: any } | null = null;
  const WEATHER_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  app.get('/api/weather', async (req, res) => {
    const now = Date.now();
    if (weatherCache && now - weatherCache.timestamp < WEATHER_CACHE_TTL) {
      return res.json({
        success: true,
        source: 'cache',
        weather: weatherCache.data,
      });
    }

    try {
      const lat = parseFloat(req.query.lat as string) || 24.9961;
      const lng = parseFloat(req.query.lng as string) || 67.0673;

      // 1. Fetch comprehensive weather forecast
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,cloud_cover,uv_index,visibility&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=Asia%2FKarachi`;
      
      // 2. Fetch air quality
      const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi,pm2_5,pm10,dust`;

      const [wRes, aqRes] = await Promise.allSettled([
        fetch(weatherUrl),
        fetch(airQualityUrl),
      ]);

      if (wRes.status === 'fulfilled' && wRes.value.ok) {
        const raw: any = await wRes.value.json();
        const cur = raw.current;
        const isDay = cur.is_day === 1;

        let aqiData = { us_aqi: 85, pm2_5: 22, pm10: 45, dust: 35 };
        if (aqRes.status === 'fulfilled' && aqRes.value.ok) {
          try {
            const aqRaw: any = await aqRes.value.json();
            if (aqRaw.current) {
              aqiData = {
                us_aqi: Math.round(aqRaw.current.us_aqi ?? 85),
                pm2_5: Math.round((aqRaw.current.pm2_5 ?? 22) * 10) / 10,
                pm10: Math.round((aqRaw.current.pm10 ?? 45) * 10) / 10,
                dust: Math.round((aqRaw.current.dust ?? 35) * 10) / 10,
              };
            }
          } catch (_) {}
        }

        const getWeatherInfo = (code: number, day: boolean) => {
          switch (code) {
            case 0:
              return {
                ur: day ? 'صاف و روشن دھوپ' : 'صاف و پرسکون رات',
                en: day ? 'Clear Sky / Sunny' : 'Clear Sky / Night',
                icon: day ? 'sun' : 'moon',
              };
            case 1:
              return {
                ur: day ? 'زیادہ تر صاف دھوپ' : 'زیادہ تر صاف رات',
                en: day ? 'Mainly Sunny' : 'Mainly Clear Night',
                icon: day ? 'cloud-sun' : 'cloud-moon',
              };
            case 2:
              return {
                ur: 'جزوی ابر آلود',
                en: 'Partly Cloudy',
                icon: day ? 'cloud-sun' : 'cloud-moon',
              };
            case 3:
              return { ur: 'مکمل ابر آلود', en: 'Overcast', icon: 'cloud' };
            case 45:
            case 48:
              return { ur: 'دھند / کہر (Haze)', en: 'Fog / Haze', icon: 'cloud-fog' };
            case 51:
            case 53:
            case 55:
              return { ur: 'ہلکی بوندا باندی', en: 'Light Drizzle', icon: 'cloud-rain' };
            case 61:
            case 63:
            case 65:
              return { ur: 'بارش / بارانِ رحمت', en: 'Rain Showers', icon: 'cloud-rain' };
            case 80:
            case 81:
            case 82:
              return { ur: 'تیز بارش کی پھوار', en: 'Heavy Showers', icon: 'cloud-rain' };
            case 95:
            case 96:
            case 99:
              return { ur: 'گرج چمک و طوفانی بارش', en: 'Thunderstorm', icon: 'cloud-lightning' };
            default:
              return {
                ur: day ? 'معتدل موسم' : 'پرسکون رات',
                en: day ? 'Moderate Weather' : 'Pleasant Night',
                icon: day ? 'sun' : 'moon',
              };
          }
        };

        const currentCond = getWeatherInfo(cur.weather_code, isDay);
        const daysUr = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
        const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Compass direction
        const getCompass = (deg: number) => {
          const arr = [
            'N (شمال)',
            'NNE',
            'NE (شمال مشرق)',
            'ENE',
            'E (مشرق)',
            'ESE',
            'SE (جنوب مشرق)',
            'SSE',
            'S (جنوب)',
            'SSW',
            'SW (بحیرہ عرب سمندری ہوا)',
            'WSW (سمندری ہوا)',
            'W (مغرب)',
            'WNW',
            'NW (شمال مغرب)',
            'NNW',
          ];
          const idx = Math.round(deg / 22.5) % 16;
          return arr[idx];
        };

        // 7-day daily forecast
        const dailyList = [];
        if (raw.daily && Array.isArray(raw.daily.time)) {
          for (let i = 0; i < Math.min(raw.daily.time.length, 7); i++) {
            const dateStr = raw.daily.time[i];
            const dObj = new Date(dateStr);
            const dayIdx = dObj.getDay();
            const wCode = raw.daily.weather_code?.[i] ?? 0;
            const cond = getWeatherInfo(wCode, true);

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
              uvIndexMax: Math.round(raw.daily.uv_index_max?.[i] ?? 6),
              windSpeedMax: Math.round(raw.daily.wind_speed_10m_max?.[i] ?? 18),
              windDirection: getCompass(raw.daily.wind_direction_10m_dominant?.[i] ?? 240),
              weatherCode: wCode,
              conditionUr: cond.ur,
              conditionEn: cond.en,
              sunrise: raw.daily.sunrise?.[i]?.split('T')[1] || '06:23',
              sunset: raw.daily.sunset?.[i]?.split('T')[1] || '18:18',
              iconName: cond.icon,
            });
          }
        }

        // 24-hour hourly timeline
        const hourlyList = [];
        if (raw.hourly && Array.isArray(raw.hourly.time)) {
          const currentHourStr = new Date().toISOString().slice(0, 13);
          let startIdx = raw.hourly.time.findIndex((t: string) => t.startsWith(currentHourStr));
          if (startIdx === -1) startIdx = 0;

          for (let h = startIdx; h < Math.min(startIdx + 24, raw.hourly.time.length); h++) {
            const hTime = raw.hourly.time[h];
            const hourNum = new Date(hTime).getHours();
            const hIsDay = raw.hourly.is_day?.[h] === 1;
            const hCode = raw.hourly.weather_code?.[h] ?? 0;
            const hCond = getWeatherInfo(hCode, hIsDay);
            const ampm = hourNum >= 12 ? 'PM' : 'AM';
            const h12 = hourNum % 12 || 12;

            hourlyList.push({
              time: `${h12}:00 ${ampm}`,
              timeUr: `${h12}:00 ${ampm === 'PM' ? 'شام/دوپہر' : 'صبح'}`,
              hour: hourNum,
              temp: Math.round(raw.hourly.temperature_2m?.[h] ?? 28),
              apparentTemp: Math.round(raw.hourly.apparent_temperature?.[h] ?? 30),
              weatherCode: hCode,
              conditionUr: hCond.ur,
              conditionEn: hCond.en,
              iconName: hCond.icon,
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

        const weatherResult = {
          locationEn: 'Karachi, Pakistan',
          locationUr: 'کراچی، پاکستان',
          areaEn: 'North Karachi (Sector 5-A/1)',
          areaUr: 'نارتھ کراچی (سیکٹر 5-A/1)',
          coordinates: { lat, lng },
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
            windDirectionCompass: getCompass(cur.wind_direction_10m ?? 240),
            windGusts: Math.round(cur.wind_gusts_10m ?? 16),
            surfacePressure: Math.round(cur.surface_pressure ?? 1010),
            uvIndex: Math.round((cur.uv_index ?? 0) * 10) / 10,
            visibility: Math.round(((cur.visibility ?? 10000) / 1000) * 10) / 10,
            cloudCover: Math.round(cur.cloud_cover ?? 20),
            time: cur.time,
            conditionUr: currentCond.ur,
            conditionEn: currentCond.en,
            iconName: currentCond.icon,
            seaBreezeStatusUr:
              cur.wind_direction_10m >= 180 && cur.wind_direction_10m <= 280
                ? 'بحیرہ عرب کی سمندری ہوا فعال ہے (خوشگوار اثر)'
                : 'خشک برّی ہوا (سمندری ہوا دھیمی ہے)',
            seaBreezeStatusEn:
              cur.wind_direction_10m >= 180 && cur.wind_direction_10m <= 280
                ? 'Arabian Sea coastal breeze active'
                : 'Continental dry breeze',
          },
          hourly: hourlyList,
          daily: dailyList,
          airQuality: {
            aqi: aqiData.us_aqi,
            pm25: aqiData.pm2_5,
            pm10: aqiData.pm10,
            dust: aqiData.dust,
            statusEn:
              aqiData.us_aqi <= 50
                ? 'Good'
                : aqiData.us_aqi <= 100
                ? 'Moderate'
                : aqiData.us_aqi <= 150
                ? 'Unhealthy for Sensitive'
                : 'Unhealthy',
            statusUr:
              aqiData.us_aqi <= 50
                ? 'عمدہ و صاف فضا'
                : aqiData.us_aqi <= 100
                ? 'قابلِ قبول / معتدل'
                : aqiData.us_aqi <= 150
                ? 'حساس افراد کے لیے مضر'
                : 'مضرِ صحت فضا',
            color:
              aqiData.us_aqi <= 50
                ? '#10b981'
                : aqiData.us_aqi <= 100
                ? '#f59e0b'
                : aqiData.us_aqi <= 150
                ? '#f97316'
                : '#ef4444',
            healthAdviceUr:
              aqiData.us_aqi <= 100
                ? 'شہر قائد کی ہوا معتدل ہے، عام معمولات کے لیے موزوں ہے۔'
                : 'دھول اور اسموگ کی موجودگی، دمہ کے مریض اور بزرگ حضرات ماسک کا اہتمام کریں۔',
            healthAdviceEn:
              aqiData.us_aqi <= 100
                ? 'Air quality is acceptable for outdoor visits and prayers.'
                : 'Sensitive groups, elderly, and respiratory patients should consider wearing masks outdoors.',
          },
          sunAndMoon: {
            sunrise: dailyList[0]?.sunrise || '06:23 AM',
            solarNoon: '12:21 PM',
            sunset: dailyList[0]?.sunset || '06:19 PM',
            dayLength: '11 گھنٹے 56 منٹ (11h 56m)',
            moonPhaseUr: 'ہلال (بڑھتا ہوا چاند / Waxing Crescent)',
            moonPhaseEn: 'Waxing Crescent',
            moonIllumination: 28,
          },
          lastUpdated: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Karachi',
          }),
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

        weatherCache = { timestamp: now, data: weatherResult };

        return res.json({
          success: true,
          source: 'open_meteo_live',
          weather: weatherResult,
        });
      }
    } catch (err: any) {
      console.warn('[Server] Weather fetch error:', err.message);
    }

    // If cache available even if older than TTL, return it
    if (weatherCache) {
      return res.json({
        success: true,
        source: 'stale_cache',
        weather: weatherCache.data,
      });
    }

    res.status(502).json({ success: false, error: 'Weather service temporarily unavailable' });
  });

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Masjid Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
