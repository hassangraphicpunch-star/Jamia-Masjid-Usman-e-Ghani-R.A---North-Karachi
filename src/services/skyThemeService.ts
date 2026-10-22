/**
 * Sky Theme Service for Jamia Masjid Usman-e-Ghani R.A.
 * 
 * Provides a dynamic, real-world inspired color experience that reflects
 * the natural passage of time in Karachi, Pakistan (Asia/Karachi).
 * 
 * Four Central Atmospheres:
 * 1. Morning (5:00 AM – 10:59 AM PKT) — Soft Sunrise, warm cream & golden glow
 * 2. Afternoon (11:00 AM – 3:59 PM PKT) — Natural Daylight, crisp sky blue & emerald
 * 3. Evening (4:00 PM – 6:59 PM PKT) — Sunset and Maghrib, warm amber & dusky indigo
 * 4. Night (7:00 PM – 4:59 AM PKT) — Peaceful Islamic Night, deep midnight blue & moonlight silver
 */

export type SkyThemeId = 'morning' | 'afternoon' | 'evening' | 'night';
export type SkyThemeMode = 'auto' | SkyThemeId;

export interface SkyThemeConfig {
  id: SkyThemeId;
  nameEn: string;
  nameUr: string;
  timeRangeEn: string;
  timeRangeUr: string;
  atmosphereLabelEn: string;
  atmosphereLabelUr: string;
  taglineEn: string;
  taglineUr: string;
  startHour: number; // 24-hour Karachi time
  startMinute: number;
  endHour: number;
  endMinute: number;
  iconName: 'Sunrise' | 'Sun' | 'Sunset' | 'Moon';
  themeColorMeta: string; // Color for mobile browser top bar
  previewColors: {
    sky: string;
    card: string;
    accent: string;
    border: string;
  };
}

export const SKY_THEMES_CONFIG: Record<SkyThemeId, SkyThemeConfig> = {
  morning: {
    id: 'morning',
    nameEn: 'Soft Sunrise',
    nameUr: 'طلوعِ صبح و فجر',
    timeRangeEn: '5:00 AM – 10:59 AM PKT',
    timeRangeUr: 'صبح 5:00 تا 10:59 بجے',
    atmosphereLabelEn: 'Morning Atmosphere',
    atmosphereLabelUr: 'صبح کا روح پرور سماں',
    taglineEn: 'Warm sunrise gradients with soft golden dawn and pale peach accents',
    taglineUr: 'صبح کی دلکش سنہری روشنی، ملائم سفیدی اور تازہ روحانی فضا',
    startHour: 5,
    startMinute: 0,
    endHour: 10,
    endMinute: 59,
    iconName: 'Sunrise',
    themeColorMeta: '#fbf4ea',
    previewColors: {
      sky: '#fbf4ea',
      card: '#ffffff',
      accent: '#d97706',
      border: '#eddcc8',
    },
  },
  afternoon: {
    id: 'afternoon',
    nameEn: 'Natural Daylight',
    nameUr: 'روشن دوپہر و ظہر',
    timeRangeEn: '11:00 AM – 3:59 PM PKT',
    timeRangeUr: 'دوپہر 11:00 تا 3:59 بجے',
    atmosphereLabelEn: 'Daylight Atmosphere',
    atmosphereLabelUr: 'کھلی دوپہر کا روشن سماں',
    taglineEn: 'Clean sky blue, fresh neutral surfaces and traditional Islamic emerald accents',
    taglineUr: 'آسمانی نیلاہٹ، اجلی سفید سطوح اور روایتی اسلامی زمردی رنگ',
    startHour: 11,
    startMinute: 0,
    endHour: 15,
    endMinute: 59,
    iconName: 'Sun',
    themeColorMeta: '#eaf3fb',
    previewColors: {
      sky: '#eaf3fb',
      card: '#ffffff',
      accent: '#059669',
      border: '#dbe4ee',
    },
  },
  evening: {
    id: 'evening',
    nameEn: 'Sunset & Maghrib',
    nameUr: 'شام، غروب و مغرب',
    timeRangeEn: '4:00 PM – 6:59 PM PKT',
    timeRangeUr: 'شام 4:00 تا 6:59 بجے',
    atmosphereLabelEn: 'Sunset Atmosphere',
    atmosphereLabelUr: 'غروب و شفق کا پرسکون سماں',
    taglineEn: 'Warm amber, muted coral and twilight gradients around Maghrib',
    taglineUr: 'شامِ شفق، گرم عنبری و نارنجی رنگ اور مغرب کی پرسکون فضا',
    startHour: 16,
    startMinute: 0,
    endHour: 18,
    endMinute: 59,
    iconName: 'Sunset',
    themeColorMeta: '#1b1226',
    previewColors: {
      sky: '#1b1226',
      card: '#241935',
      accent: '#f97316',
      border: '#6e3952',
    },
  },
  night: {
    id: 'night',
    nameEn: 'Peaceful Islamic Night',
    nameUr: 'پرامن اسلامی رات و عشاء',
    timeRangeEn: '7:00 PM – 4:59 AM PKT',
    timeRangeUr: 'رات 7:00 تا 4:59 بجے صبح',
    atmosphereLabelEn: 'Night Atmosphere',
    atmosphereLabelUr: 'شب کا پرسکون روحانی سماں',
    taglineEn: 'Deep midnight blue, calm indigo, soft moonlight silver and restrained gold',
    taglineUr: 'گہرا نیلا شبینہ آسمان، چاندنی کی سلور چمک اور پرسکون اسلامی رات',
    startHour: 19,
    startMinute: 0,
    endHour: 4,
    endMinute: 59,
    iconName: 'Moon',
    themeColorMeta: '#060913',
    previewColors: {
      sky: '#060913',
      card: '#0c1427',
      accent: '#38bdf8',
      border: '#1e293b',
    },
  },
};

const STORAGE_KEY = 'jamia_sky_theme_mode_v1';

/**
 * Get the current time parts in Karachi, Pakistan (Asia/Karachi)
 */
export function getKarachiCurrentTime(date: Date = new Date()): {
  hour24: number;
  minute: number;
  formatted12h: string;
  formatted24h: string;
} {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  let hour24 = date.getHours();
  let minute = date.getMinutes();

  for (const part of parts) {
    if (part.type === 'hour') hour24 = parseInt(part.value, 10);
    if (part.type === 'minute') minute = parseInt(part.value, 10);
  }

  // Format 12h for display
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  const formatted12h = `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm} PKT`;
  const formatted24h = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} PKT`;

  return { hour24, minute, formatted12h, formatted24h };
}

/**
 * Determine which sky atmosphere is active based on Karachi local time
 */
export function getAutoSkyTheme(date: Date = new Date()): SkyThemeId {
  const { hour24 } = getKarachiCurrentTime(date);

  // Morning: 5:00 AM – 10:59 AM (hours 5 to 10)
  if (hour24 >= 5 && hour24 < 11) {
    return 'morning';
  }
  // Afternoon: 11:00 AM – 3:59 PM (hours 11 to 15)
  if (hour24 >= 11 && hour24 < 16) {
    return 'afternoon';
  }
  // Evening: 4:00 PM – 6:59 PM (hours 16 to 18)
  if (hour24 >= 16 && hour24 < 19) {
    return 'evening';
  }
  // Night: 7:00 PM – 4:59 AM (hours 19 to 23, and 0 to 4)
  return 'night';
}

/**
 * Read saved user preference ('auto' or specific theme)
 */
export function getStoredSkyThemeMode(): SkyThemeMode {
  if (typeof window === 'undefined') return 'auto';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'morning' || saved === 'afternoon' || saved === 'evening' || saved === 'night') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'auto';
}

/**
 * Save user preference
 */
export function setStoredSkyThemeMode(mode: SkyThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    if (mode === 'auto') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  } catch {
    // ignore
  }
  applySkyThemeToDOM();
  window.dispatchEvent(new CustomEvent('jamia_sky_theme_changed', { detail: mode }));
}

/**
 * Calculate the currently resolved theme id (accounting for 'auto' vs manual)
 */
export function resolveCurrentSkyTheme(mode: SkyThemeMode = getStoredSkyThemeMode()): SkyThemeId {
  if (mode === 'auto') {
    return getAutoSkyTheme();
  }
  return mode;
}

/**
 * Apply the theme attribute to document elements and update meta theme-color
 */
export function applySkyThemeToDOM(): SkyThemeId {
  if (typeof document === 'undefined') return 'night';

  const mode = getStoredSkyThemeMode();
  const themeId = resolveCurrentSkyTheme(mode);
  const config = SKY_THEMES_CONFIG[themeId];

  // Set on html element
  document.documentElement.setAttribute('data-theme', themeId);
  document.documentElement.setAttribute('data-theme-mode', mode);

  // Also set on body for maximum selector compatibility
  document.body.setAttribute('data-theme', themeId);

  // Update theme-color meta tag for mobile browser address bar
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', config.themeColorMeta);

  return themeId;
}
