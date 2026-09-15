import { QuranReciter, QuranSurahItem } from '../types';

export const QURAN_SERVICE_INFO = {
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
  attribution: 'Quran text from Tanzil.net (CC BY 3.0). Translations via quran.com.',
  sadaqah_jariah: 'This API is provided as sadaqah jariah for the Muslim ummah',
};

export const QURAN_RECITERS: QuranReciter[] = [
  { id: 1, name: 'Mishary Rashid Alafasy', style: 'Murattal', audioServerSubpath: 'Alafasy_128kbps' },
  { id: 2, name: 'Abdul Rahman Al-Sudais', style: 'Murattal', audioServerSubpath: 'Abdurrahmaan_As-Sudais_192kbps' },
  { id: 3, name: 'Abdul Basit Abdul Samad', style: 'Murattal', audioServerSubpath: 'Abdul_Basit_Murattal_192kbps' },
  { id: 4, name: 'Abdul Basit Abdul Samad (Mujawwad)', style: 'Mujawwad', audioServerSubpath: 'AbdulBasit_Mujawwad_128kbps' },
  { id: 5, name: 'Maher Al Muaiqly', style: 'Murattal', audioServerSubpath: 'Maher_AlMuaiqly_64kbps' },
  { id: 6, name: 'Saad Al-Ghamdi', style: 'Murattal', audioServerSubpath: 'Ghamadi_40kbps' },
  { id: 7, name: 'Hani Ar-Rifai', style: 'Murattal', audioServerSubpath: 'Hani_Rifai_192kbps' },
  { id: 8, name: 'Abu Bakr Al Shatri', style: 'Murattal', audioServerSubpath: 'Abu_Bakr_Ash-Shaatree_128kbps' },
  { id: 9, name: 'Yasser Al-Dosari', style: 'Murattal', audioServerSubpath: 'Yasser_Ad-Dussary_128kbps' },
  { id: 10, name: 'Saud Al-Shuraim', style: 'Murattal', audioServerSubpath: 'Saood_ash-Shuraym_128kbps' },
  { id: 11, name: 'Abdullah Al-Juhany', style: 'Murattal', audioServerSubpath: 'Abdullaah_3awwaad_Al-Juhaynee_128kbps' },
  { id: 12, name: 'Bandar Baleela', style: 'Murattal', audioServerSubpath: 'Bandar_Baleela_128kbps' },
  { id: 13, name: 'Abdullah Al-Buajan', style: 'Murattal', audioServerSubpath: 'Abdullah_Buajan_128kbps' },
];

export const POPULAR_SURAHS: QuranSurahItem[] = [
  { number: 1, nameAr: 'الفاتحة', nameEn: 'Al-Fatiha', nameUr: 'سورۃ الفاتحہ', englishMeaning: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan', revelationTypeUr: 'مکی', juzNumber: 1, pageNumber: 1 },
  { number: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', nameUr: 'سورۃ البقرہ', englishMeaning: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan', revelationTypeUr: 'مدنی', juzNumber: 1, pageNumber: 2 },
  { number: 3, nameAr: 'آل عمران', nameEn: 'Ali \'Imran', nameUr: 'سورۃ آل عمران', englishMeaning: 'Family of Imran', numberOfAyahs: 200, revelationType: 'Medinan', revelationTypeUr: 'مدنی', juzNumber: 3, pageNumber: 50 },
  { number: 18, nameAr: 'الكهف', nameEn: 'Al-Kahf', nameUr: 'سورۃ الکہف', englishMeaning: 'The Cave', numberOfAyahs: 110, revelationType: 'Meccan', revelationTypeUr: 'مکی', juzNumber: 15, pageNumber: 293 },
  { number: 36, nameAr: 'يس', nameEn: 'Ya-Sin', nameUr: 'سورۃ یٰسٓ', englishMeaning: 'Ya-Sin', numberOfAyahs: 83, revelationType: 'Meccan', revelationTypeUr: 'مکی', juzNumber: 22, pageNumber: 440 },
  { number: 55, nameAr: 'الرحمن', nameEn: 'Ar-Rahman', nameUr: 'سورۃ الرحمٰن', englishMeaning: 'The Beneficent', numberOfAyahs: 78, revelationType: 'Medinan', revelationTypeUr: 'مدنی', juzNumber: 27, pageNumber: 531 },
  { number: 56, nameAr: 'الواقعة', nameEn: 'Al-Waqi\'ah', nameUr: 'سورۃ الواقعہ', englishMeaning: 'The Inevitable', numberOfAyahs: 96, revelationType: 'Meccan', revelationTypeUr: 'مکی', juzNumber: 27, pageNumber: 534 },
  { number: 67, nameAr: 'الملك', nameEn: 'Al-Mulk', nameUr: 'سورۃ الملک', englishMeaning: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'Meccan', revelationTypeUr: 'مکی', juzNumber: 29, pageNumber: 562 },
  { number: 112, nameAr: 'الإخلاص', nameEn: 'Al-Ikhlas', nameUr: 'سورۃ الإخلاص', englishMeaning: 'The Sincerity', numberOfAyahs: 4, revelationType: 'Meccan', revelationTypeUr: 'مکی', juzNumber: 30, pageNumber: 604 },
  { number: 113, nameAr: 'الفلق', nameEn: 'Al-Falaq', nameUr: 'سورۃ الفلق', englishMeaning: 'The Daybreak', numberOfAyahs: 5, revelationType: 'Meccan', revelationTypeUr: 'مکی', juzNumber: 30, pageNumber: 604 },
  { number: 114, nameAr: 'الناس', nameEn: 'An-Nas', nameUr: 'سورۃ الناس', englishMeaning: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan', revelationTypeUr: 'مکی', juzNumber: 30, pageNumber: 604 },
];

export function getSurahAudioUrl(surahNumber: number, reciterId: number): string {
  const pad = surahNumber.toString().padStart(3, '0');
  // High availability Islamic CDN for the 13 reciters
  switch (reciterId) {
    case 1: return `https://server8.mp3quran.net/afs/${pad}.mp3`; // Mishary Alafasy
    case 2: return `https://server11.mp3quran.net/sds/${pad}.mp3`; // Sudais
    case 3: return `https://server7.mp3quran.net/basit/${pad}.mp3`; // Abdul Basit Murattal
    case 4: return `https://server7.mp3quran.net/basit_mjwd/${pad}.mp3`; // Abdul Basit Mujawwad
    case 5: return `https://server12.mp3quran.net/maher/${pad}.mp3`; // Maher Al Muaiqly
    case 6: return `https://server7.mp3quran.net/s_gmd/${pad}.mp3`; // Saad Al Ghamdi
    case 7: return `https://server8.mp3quran.net/hani/${pad}.mp3`; // Hani Ar-Rifai
    case 8: return `https://server7.mp3quran.net/shatri/${pad}.mp3`; // Abu Bakr Shatri
    case 9: return `https://server11.mp3quran.net/yasser/${pad}.mp3`; // Yasser Al-Dosari
    case 10: return `https://server7.mp3quran.net/shur/${pad}.mp3`; // Saud Al-Shuraim
    case 11: return `https://server13.mp3quran.net/jhn/${pad}.mp3`; // Abdullah Al-Juhany
    case 12: return `https://server6.mp3quran.net/balila/${pad}.mp3`; // Bandar Baleela
    case 13: return `https://server6.mp3quran.net/buajan/${pad}.mp3`; // Abdullah Al-Buajan
    default: return `https://server8.mp3quran.net/afs/${pad}.mp3`;
  }
}
