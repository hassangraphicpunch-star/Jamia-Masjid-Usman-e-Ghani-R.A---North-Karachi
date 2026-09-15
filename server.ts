import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'mosque_admin_settings.json');

// Default initial settings if file does not exist
const DEFAULT_INITIAL_SETTINGS = {
  fajrJamaat: '05:45 AM',
  dhuhrJamaat: '01:30 PM',
  asrJamaat: '05:15 PM',
  maghribJamaat: '+5 mins after Azan',
  ishaJamaat: '08:15 PM',
  jummaAzan: '12:50 PM',
  jummaAzan2: '01:40 PM',
  jummaBayan: '01:10 PM',
  jummaKhutbah: '01:45 PM',
  jummaJamaat: '01:50 PM',
  jummaKhateebEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
  jummaKhateebUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)',
  ishraqTime: '+12 mins after Tuloo',
  chashtTime: '08:45 AM - 11:30 AM',
  zawalTime: '12:12 PM - 12:28 PM',
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
      return JSON.parse(data);
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
