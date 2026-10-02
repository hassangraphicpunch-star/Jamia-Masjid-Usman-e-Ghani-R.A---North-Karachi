import { AppNotification } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'mosque_app_notifications_v2';
const NOTIFICATIONS_READ_KEY = 'mosque_app_read_notifications';

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    titleEn: 'Ramadan 2027 (1448 AH) Calendar & Timetable Live',
    titleUr: 'ماہِ رمضان المبارک 1448ھ / 2027ء کا مکمل کلینڈر و سحر و افطار ٹائمنگز',
    messageEn:
      'Official verified Ramadan 2027 Hanafi timetable for Karachi is live with accurate daily Sehri & Iftar timings and interactive siren sound alerts in Demo Mode.',
    messageUr:
      'رمضان المبارک 2027ء (1448ھ) کا مصدقہ حنفی کلینڈر، یومیہ سحر و افطار کے اوقات اور ڈیمو موڈ میں سائرن ساؤنڈ الرٹ فعال ہے۔',
    type: 'ramadan',
    category: 'ramadan',
    priority: 'high',
    timestamp: new Date().toISOString(),
    timeAgoEn: 'Just now',
    timeAgoUr: 'ابھی',
    isRead: false,
    isActive: true,
  },
  {
    id: 'notif-2',
    titleEn: 'Live Countdown to Iqamah Active',
    titleUr: 'اقامت سے قبل لائیو کاؤنٹ ڈاؤن ٹائمر فعال',
    messageEn:
      'After the Adhan, a live countdown timer displays remaining minutes and seconds until Jamaat starts across all screens.',
    messageUr:
      'اذان کے فوراً بعد تمام اسکرینز پر جماعت اور اقامت شروع ہونے تک کا لائیو ریورس کاؤنٹ ڈاؤن ٹائمر شروع ہو جاتا ہے۔',
    type: 'iqamah',
    category: 'prayer',
    priority: 'medium',
    timestamp: new Date().toISOString(),
    timeAgoEn: '5m ago',
    timeAgoUr: '5 منٹ قبل',
    isRead: false,
    isActive: true,
  },
  {
    id: 'notif-3',
    titleEn: 'Chasht (Duha) & Zawal Timings Added',
    titleUr: 'چاشت اور یومیہ زوال کے اوقات کا باقاعدہ ڈسپلے',
    messageEn:
      'Daily Chasht prayer time and Makrooh Zawal timings are now calculated and updated on the main prayer board.',
    messageUr:
      'نمازیوں کی آسانی کے لیے روزانہ صلوٰۃ الضحیٰ (چاشت) اور مکروہ وقتِ زوال کا لائیو وقت شامل کر دیا گیا ہے۔',
    type: 'prayer',
    category: 'prayer',
    priority: 'medium',
    timestamp: new Date().toISOString(),
    timeAgoEn: '10m ago',
    timeAgoUr: '10 منٹ قبل',
    isRead: false,
    isActive: true,
  },
  {
    id: 'notif-4',
    titleEn: '10 KV Solar Power Backup (16 Plates)',
    titleUr: '10 کے وی خودکار سولر سسٹم اور پنکھوں کی بلاتعطل فراہمی',
    messageEn:
      '16 high-efficiency solar plates and hybrid inverter keep all prayer hall fans and lights running smoothly during power cuts.',
    messageUr:
      'مسجد کی چھت پر نصب 16 سولر پلیٹس اور ہائبرڈ انورٹر سے تمام ہالز کے پنکھے اور لائٹس لوڈ شیڈنگ میں بلاتعطل فعال رہتے ہیں۔',
    type: 'general',
    category: 'event',
    priority: 'low',
    timestamp: new Date().toISOString(),
    timeAgoEn: '1h ago',
    timeAgoUr: '1 گھنٹہ قبل',
    isRead: false,
    isActive: true,
  },
  {
    id: 'notif-5',
    titleEn: 'Official Mosque WhatsApp Desk: 03233469424',
    titleUr: 'مسجد کا باضابطہ واٹس ایپ رابطہ نمبر: 03233469424',
    messageEn:
      'For Janazah announcements, queries, and donation confirmations, contact through official WhatsApp: 03233469424.',
    messageUr:
      'جنازہ اعلانات، دعاؤں اور مسجد معاملات کے لیے باضابطہ واٹس ایپ نمبر 03233469424 پر رابطہ کریں۔',
    type: 'announcement',
    category: 'announcement',
    priority: 'medium',
    timestamp: new Date().toISOString(),
    timeAgoEn: '2h ago',
    timeAgoUr: '2 گھنٹے قبل',
    isRead: false,
    isActive: true,
  },
];

export function getStoredNotifications(): AppNotification[] {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sanitized = parsed
          .map((n) => {
            if (n.id === 'notif-4' && (n.titleUr?.includes('پانی') || n.titleEn?.includes('RO Water'))) {
              return DEFAULT_NOTIFICATIONS.find((d) => d.id === 'notif-4') || n;
            }
            return n;
          })
          .filter(
            (n) =>
              !n.titleUr?.includes('میڈیکل') &&
              !n.titleUr?.includes('شوگر') &&
              !n.titleUr?.includes('بلڈ پریشر')
          );
        return sanitized;
      }
    }
  } catch (e) {
    console.warn('Failed to load notifications from storage', e);
  }
  return DEFAULT_NOTIFICATIONS;
}

export function saveStoredNotifications(notifs: AppNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
    // Dispatch custom event for reactive update across components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mosque_notifications_updated', { detail: notifs }));
    }
  } catch (e) {
    console.warn('Failed to save notifications', e);
  }
}

export function getReadNotificationIds(): string[] {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_READ_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [];
}

export function markNotificationAsRead(id: string): void {
  try {
    const read = getReadNotificationIds();
    if (!read.includes(id)) {
      read.push(id);
      localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(read));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mosque_notifications_read_updated', { detail: read }));
      }
    }
  } catch {
    // ignore
  }
}

export function markAllNotificationsAsRead(ids: string[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(ids));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mosque_notifications_read_updated', { detail: ids }));
    }
  } catch {
    // ignore
  }
}

export function addNotification(
  notif: Omit<AppNotification, 'id' | 'timestamp' | 'timeAgoEn' | 'timeAgoUr' | 'isRead'>
): AppNotification {
  const current = getStoredNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: `notif-${Date.now()}`,
    timestamp: new Date().toISOString(),
    timeAgoEn: 'Just now',
    timeAgoUr: 'ابھی',
    isRead: false,
  };
  const updated = [newNotif, ...current.slice(0, 24)];
  saveStoredNotifications(updated);
  return newNotif;
}
