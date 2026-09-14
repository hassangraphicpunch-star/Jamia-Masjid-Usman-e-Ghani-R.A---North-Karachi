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
