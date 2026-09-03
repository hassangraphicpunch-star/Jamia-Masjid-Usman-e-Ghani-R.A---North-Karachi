export type Language = 'en' | 'ur';

export interface JamaatTimes {
  fajr: string;
  sunrise: string;
  ishraq: string;
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
