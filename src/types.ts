export type Language = 'en' | 'ur';

export interface JamaatTimes {
  fajr: string;
  sunrise: string;
  ishraq: string;
  chasht?: string;
  zawal?: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumma: string;
}

export interface DarseQuranProgram {
  id: string;
  titleEn: string;
  titleUr: string;
  speakerEn: string;
  speakerUr: string;
  timingEn: string;
  timingUr: string;
  frequencyEn: string;
  frequencyUr: string;
  topicEn: string;
  topicUr: string;
  locationEn: string;
  locationUr: string;
  imageUrl?: string;
  active: boolean;
  notesEn?: string;
  notesUr?: string;
}

export interface MosqueVideoItem {
  id: string;
  titleEn: string;
  titleUr: string;
  speakerEn?: string;
  speakerUr?: string;
  category: 'juma' | 'dars' | 'tilawat' | 'tour' | 'live';
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  date?: string;
  isLive?: boolean;
  descriptionEn?: string;
  descriptionUr?: string;
}

export interface MosqueMediaSettings {
  heroBannerImage?: string;
  darsPosterImage?: string;
  darulQuranImage?: string;
  // Video options
  featuredVideoUrl?: string;
  featuredVideoTitleEn?: string;
  featuredVideoTitleUr?: string;
  featuredVideoSpeakerEn?: string;
  featuredVideoSpeakerUr?: string;
  featuredVideoDescriptionEn?: string;
  featuredVideoDescriptionUr?: string;
  featuredVideoCategory?: 'juma' | 'dars' | 'tilawat' | 'tour' | 'live';
  isLiveStream?: boolean;
  showVideoSection?: boolean;
  videoList?: MosqueVideoItem[];
}

export interface IqamahCountdownState {
  isIqamahPeriod: boolean;        // true when between Adhan and Jamaat (+ 15 mins congregation window)
  isTimeForIqamah: boolean;       // true when countdown reaches 0 (Iqamah start)
  prayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumma';
  prayerNameEn: string;
  prayerNameUr: string;
  prayerNameAr: string;
  adhanTime12h: string;
  jamaatTime12h: string;
  secondsRemaining: number;
  minutesRemaining: number;
  secondsPart: number;
  totalDurationSeconds: number;
  elapsedSeconds: number;
  progressPercent: number;        // 0% at Adhan -> 100% at Iqamah
  isSimulated?: boolean;
}

export interface AdminPrayerSettings {
  fajrJamaat: string;
  dhuhrJamaat: string;
  asrJamaat: string;
  maghribJamaat: string; // or offset
  ishaJamaat: string;
  // Friday / Jumma timings
  jummaAzan?: string;       // 1st Azan (e.g. 01:00 PM)
  jummaAzan2?: string;      // 2nd Azan / Khutbah Azan (e.g. 01:30 PM)
  jummaBayan: string;       // Urdu Bayan (e.g. 01:00 PM)
  jummaKhutbah?: string;    // Arabic Khutbah (e.g. 01:35 PM)
  jummaJamaat: string;      // Friday Prayer / Iqamah (e.g. 01:45 PM)
  jummaKhateebEn?: string;
  jummaKhateebUr?: string;
  ishraqTime: string;
  // Chasht (Duha) and Zawal Time Settings
  chashtTime?: string;      // Daily Chasht (Salat al-Duha) Time (e.g. '08:45 AM - 11:30 AM')
  zawalTime?: string;       // Daily Zawal (Makruh) Time (e.g. '12:12 PM - 12:28 PM')
  // Ramadan Timing and Demo Settings
  ramadanDemoMode?: boolean;      // Toggle Ramadan demo mode
  ramadanSehriTime?: string;     // Sehri ends / Subh Sadiq (e.g. '05:00 AM')
  ramadanIftarTime?: string;     // Iftar time / Maghrib (e.g. '06:45 PM')
  ramadanRozaNo?: number;        // Roza / Fast number (e.g. 1)
  ramadanSirenSound?: boolean;   // Sehri/Iftar sound siren alert enabled
  // WhatsApp & Contact settings
  whatsappNumber?: string;       // e.g. '03233469424'
  lastSavedTimestamp?: string;   // ISO timestamp of last permanent live portal save
  // Azan overrides (optional, empty means use API / astronomical Karachi calculations)
  fajrAzan?: string;
  sunriseTime?: string;
  dhuhrAzan?: string;
  asrAzan?: string;
  maghribAzan?: string;
  ishaAzan?: string;
  // Emergency / announcement banner
  alertBannerEn?: string;
  alertBannerUr?: string;
  showAlertBanner?: boolean;
  // Dynamic Dars-e-Quran programs and custom announcements & media
  darsPrograms?: DarseQuranProgram[];
  customAnnouncements?: AnnouncementItem[];
  mediaSettings?: MosqueMediaSettings;
  // Azan Voice & Audio Configuration
  defaultAzanVoice?: string;
  autoPlayAzan?: boolean;
  azanVolume?: number;
  // Iqamah Countdown Settings
  iqamahAlertSound?: boolean;
}

export interface PrayerTimeItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumma';
  nameEn: string;
  nameUr: string;
  nameAr: string;
  athanTime: string;      // Start / Athan time
  jamaatTime: string;     // Iqamah / Jamaat time in Masjid Usman-e-Ghani
  iconName: string;
  descriptionEn?: string;
  descriptionUr?: string;
  isNext?: boolean;
  isCurrent?: boolean;
}

export interface PrayerTimesApiResponse {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  midnight?: string;
  lastThird?: string;
  date?: string;
  hijriDate?: {
    day: string;
    month: {
      en: string;
      ar: string;
    };
    year: string;
  };
}

export interface AnnouncementItem {
  id: string;
  titleEn: string;
  titleUr: string;
  category: 'juma' | 'education' | 'welfare' | 'construction' | 'general' | 'janazah';
  date: string;
  hijriDate: string;
  contentEn: string;
  contentUr: string;
  important?: boolean;
  speakerEn?: string;
  speakerUr?: string;
  time?: string;
  badgeEn?: string;
  badgeUr?: string;
  imageUrl?: string;
}

export interface GalleryPhoto {
  url: string;
  captionEn: string;
  captionUr: string;
}

export interface GalleryEventItem {
  id: string;
  titleEn: string;
  titleUr: string;
  date: string;
  category: 'events' | 'education' | 'welfare' | 'renovation' | 'ramadan';
  coverImage: string;
  images: GalleryPhoto[];
  descriptionEn: string;
  descriptionUr: string;
  locationEn: string;
  locationUr: string;
  attendees?: string;
}

export interface FacilityItem {
  id: string;
  titleEn: string;
  titleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  icon: string;
  tagEn: string;
  tagUr: string;
  detailsEn: string[];
  detailsUr: string[];
}

export interface CommitteePerson {
  nameEn: string;
  nameUr: string;
  roleEn: string;
  roleUr: string;
  qualificationEn?: string;
  qualificationUr?: string;
  contact?: string;
  image?: string;
}

export interface ZikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translationEn: string;
  translationUr: string;
  virtueEn: string;
  virtueUr: string;
  targetCount: number;
}

export interface DonationReceipt {
  receiptNo: string;              // e.g. "JMUG-REC-2026-7842"
  donorName: string;
  donorPhone: string;
  donorEmail?: string;
  fundCategoryEn: string;
  fundCategoryUr: string;
  amount: number;
  amountInWordsEn: string;
  amountInWordsUr: string;
  paymentMethodEn: string;
  paymentMethodUr: string;
  transactionRef: string;
  date: string;
  time: string;
  notes?: string;
  status: 'completed' | 'verified';
  whatsappShared?: boolean;
}

export interface AppNotification {
  id: string;
  titleEn: string;
  titleUr: string;
  messageEn: string;
  messageUr: string;
  type: 'prayer' | 'iqamah' | 'ramadan' | 'announcement' | 'general' | 'janazah';
  category?: string;
  timestamp: string;
  timeAgoUr: string;
  timeAgoEn: string;
  isRead: boolean;
  isActive?: boolean;
  priority?: 'high' | 'normal' | 'medium' | 'low';
  linkTarget?: string;
}

export interface QuranHadithItem {
  id: string;
  type: 'ayah' | 'hadith';
  category: 'prayer' | 'sadaqah' | 'patience' | 'parents' | 'character' | 'zikr' | 'quran' | 'virtue_usman';
  categoryLabelEn: string;
  categoryLabelUr: string;
  arabic: string;
  translationUr: string;
  translationEn: string;
  referenceUr: string;
  referenceEn: string;
  narratorUr?: string;
  narratorEn?: string;
  themeBadgeUr: string;
  themeBadgeEn: string;
}

