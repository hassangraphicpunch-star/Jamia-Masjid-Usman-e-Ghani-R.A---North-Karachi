import { QuranAyah, QuranTranslationOption } from '../types';

export const QURAN_TRANSLATIONS: QuranTranslationOption[] = [
  {
    id: 'ur.maududi',
    name: 'اردو - سید ابو الاعلیٰ مودودی (تفہیم القرآن)',
    language: 'Urdu',
    direction: 'rtl',
    author: 'Syed Abul A\'la Maududi',
  },
  {
    id: 'ur.jalandhry',
    name: 'اردو - مولانا فتح محمد جالندھری',
    language: 'Urdu',
    direction: 'rtl',
    author: 'Fateh Muhammad Jalandhry',
  },
  {
    id: 'ur.qadri',
    name: 'اردو - عرفان القرآن (ڈاکٹر طاہر القادری)',
    language: 'Urdu',
    direction: 'rtl',
    author: 'Dr. Muhammad Tahir-ul-Qadri',
  },
  {
    id: 'ur.ahmedali',
    name: 'اردو - مولانا احمد علی لاہوری',
    language: 'Urdu',
    direction: 'rtl',
    author: 'Ahmed Ali Lahori',
  },
  {
    id: 'en.sahih',
    name: 'English - Saheeh International',
    language: 'English',
    direction: 'ltr',
    author: 'Saheeh International',
  },
  {
    id: 'en.yusufali',
    name: 'English - Abdullah Yusuf Ali',
    language: 'English',
    direction: 'ltr',
    author: 'Abdullah Yusuf Ali',
  },
  {
    id: 'en.pickthall',
    name: 'English - Marmaduke Pickthall',
    language: 'English',
    direction: 'ltr',
    author: 'Marmaduke Pickthall',
  },
  {
    id: 'tr.diyanet',
    name: 'Türkçe - Diyanet İşleri',
    language: 'Turkish',
    direction: 'ltr',
    author: 'Diyanet Isleri',
  },
  {
    id: 'id.indonesian',
    name: 'Bahasa Indonesia - Kemenag',
    language: 'Indonesian',
    direction: 'ltr',
    author: 'Indonesian Ministry of Religious Affairs',
  },
  {
    id: 'fr.hamidullah',
    name: 'Français - Muhammad Hamidullah',
    language: 'French',
    direction: 'ltr',
    author: 'Muhammad Hamidullah',
  },
  {
    id: 'de.bubenheim',
    name: 'Deutsch - Bubenheim & Elyas',
    language: 'German',
    direction: 'ltr',
    author: 'Frank Bubenheim & Nadeem Elyas',
  },
];

// In-memory cache for loaded surah verses
const surahCache: Record<string, QuranAyah[]> = {};

// Built-in offline curated verses for instant display
const BUILT_IN_SURAHS: Record<
  number,
  { arabic: string[]; urdu: string[]; maududi?: string[]; english: string[] }
> = {
  1: {
    arabic: [
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      'الرَّحْمَٰنِ الرَّحِيمِ',
      'مَالِكِ يَوْمِ الدِّينِ',
      'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    ],
    urdu: [
      'شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے',
      'سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے',
      'بڑا مہربان نہایت رحم فرمانے والا ہے',
      'روزِ جزا کا مالک ہے',
      'ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں',
      'ہمیں سیدھے راستے پر چلا',
      'ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ کہ ان کا جن پر غضب کیا گیا اور نہ گمراہوں کا',
    ],
    maududi: [
      'اللہ کے نام سے جو رحمان اور رحیم ہے',
      'تعریف اللہ ہی کے لیے ہے جو تمام کائنات کا رب ہے',
      'رحمان اور رحیم ہے',
      'روزِ جزا کا مالک ہے',
      'ہم تیری ہی عبادت کرتے ہیں اور تجھی سے مدد مانگتے ہیں',
      'ہمیں سیدھا راستہ دکھا',
      'ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، جو معتوب نہیں ہوئے، جو بھٹکے ہوئے نہیں ہیں',
    ],
    english: [
      'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      '[All] praise is [due] to Allah, Lord of the worlds -',
      'The Entirely Merciful, the Especially Merciful,',
      'Sovereign of the Day of Recompense.',
      'It is You we worship and You we ask for help.',
      'Guide us to the straight path -',
      'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
    ],
  },
  103: {
    arabic: [
      'وَالْعَصْرِ',
      'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
      'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
    ],
    urdu: [
      'قسم ہے زمانے کی!',
      'بے شک انسان خسارے میں ہے',
      'سوائے ان لوگوں کے جو ایمان لائے اور نیک عمل کیے اور ایک دوسرے کو حق کی وصیت کی اور صبر کی تلقین کی',
    ],
    maududi: [
      'زمانے کی قسم!',
      'انسان درحقیقت بڑے خسارے میں ہے',
      'سوائے اُن لوگوں کے جو ایمان لائے، اور جنہوں نے نیک عمل کیے، اور ایک دوسرے کو حق کی نصیحت اور صبر کی تلقین کرتے رہے',
    ],
    english: [
      'By time,',
      'Indeed, mankind is in loss,',
      'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.',
    ],
  },
  108: {
    arabic: [
      'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
      'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
      'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
    ],
    urdu: [
      'اے حبیب! بے شک ہم نے آپ کو کوثر (بے انتہا خیر و بھلائی) عطا فرمائی',
      'پس آپ اپنے رب کے لیے نماز پڑھیے اور قربانی کیجیے',
      'بے شک آپ کا دشمن ہی بے نام و نشاں رہے گا',
    ],
    maududi: [
      '(اے نبیؐ) ہم نے تمہیں کوثر عطا کر دیا',
      'پس تم اپنے رب ہی کے لیے نماز پڑھو اور قربانی کرو',
      'تمہارا دشمن ہی جڑ کٹا ہے',
    ],
    english: [
      'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
      'So pray to your Lord and sacrifice [to Him alone].',
      'Indeed, your enemy is the one cut off.',
    ],
  },
  112: {
    arabic: [
      'قُلْ هُوَ اللَّهُ أَحَدٌ',
      'اللَّهُ الصَّمَدُ',
      'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    ],
    urdu: [
      'آپ فرما دیجیے: وہ اللہ ایک ہے',
      'اللہ بے نیاز اور سب کا سہارا ہے',
      'نہ اس کی کوئی اولاد ہے اور نہ وہ کسی سے پیدا ہوا ہے',
      'اور نہ ہی کوئی اس کا ہمسر و برابر ہے',
    ],
    maududi: [
      'کہو، وہ اللہ ہے، یکتا',
      'اللہ سب سے بے نیاز ہے اور سب اس کے محتاج ہیں',
      'نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے',
      'اور کوئی اس کا ہمسر نہیں ہے',
    ],
    english: [
      'Say, "He is Allah, [who is] One,',
      'Allah, the Eternal Refuge.',
      'He neither begets nor is born,',
      'Nor is there to Him any equivalent."',
    ],
  },
  113: {
    arabic: [
      'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      'مِن شَرِّ مَا خَلَقَ',
      'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    ],
    urdu: [
      'آپ کہہ دیجیے کہ میں صبح کے رب کی پناہ مانگتا ہوں',
      'ہر اس چیز کے شر سے جو اس نے پیدا فرمائی',
      'اور اندھیری رات کے شر سے جب وہ چھا جائے',
      'اور گرہوں میں پھونکنے والیوں کے شر سے',
      'اور حسد کرنے والے کے شر سے جب وہ حسد کرے',
    ],
    maududi: [
      'کہو، میں پناہ مانگتا ہوں صبح کے رب کی',
      'ہر اُس چیز کے شر سے جو اس نے پیدا کی ہے',
      'اور رات کی تاریکی کے شر سے جب کہ وہ چھا جائے',
      'اور گرہوں میں پھونکنے والوں (یا والیوں) کے شر سے',
      'اور حاسد کے شر سے جب کہ وہ حسد کرے',
    ],
    english: [
      'Say, "I seek refuge in the Lord of daybreak',
      'From the evil of that which He created',
      'And from the evil of darkness when it settles',
      'And from the evil of the blowers in knots',
      'And from the evil of an envier when he envies."',
    ],
  },
  114: {
    arabic: [
      'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      'مَلِكِ النَّاسِ',
      'إِلَٰهِ النَّاسِ',
      'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
      'مِنَ الْجِنَّةِ وَالنَّاسِ',
    ],
    urdu: [
      'آپ کہہ دیجیے کہ میں انسانوں کے پروردگار کی پناہ میں آتا ہوں',
      'جو انسانوں کا حقیقی بادشاہ ہے',
      'جو انسانوں کا معبودِ برحق ہے',
      'وسوسہ ڈالنے والے، پیچھے ہٹ جانے والے شیطان کے شر سے',
      'جو لوگوں کے دلوں میں وسوسے ڈالتا ہے',
      'خواہ وہ جنات میں سے ہو یا انسانوں میں سے',
    ],
    maududi: [
      'کہو، میں پناہ مانگتا ہوں انسانوں کے رب کی',
      'انسانوں کے بادشاہ کی',
      'انسانوں کے معبودِ برحق کی',
      'اُس وسوسہ انداز کے شر سے جو بار بار پلٹ کر آتا ہے',
      'جو لوگوں کے دلوں میں وسوسے ڈالتا ہے',
      'خواہ وہ جنوں میں سے ہو یا انسانوں میں سے',
    ],
    english: [
      'Say, "I seek refuge in the Lord of mankind,',
      'The Sovereign of mankind,',
      'The God of mankind,',
      'From the evil of the retreating whisperer -',
      'Who whispers into the breasts of mankind -',
      'From among the jinn and mankind."',
    ],
  },
};

/**
 * Fetches the full Quran Arabic verses and selected translation for ANY of the 114 Surahs.
 */
export async function fetchSurahVersesAndTranslation(
  surahNumber: number,
  translationId: string = 'ur.jalandhry'
): Promise<{ ayahs: QuranAyah[]; isFallback?: boolean }> {
  const cacheKey = `${surahNumber}_${translationId}`;
  if (surahCache[cacheKey]) {
    return { ayahs: surahCache[cacheKey] };
  }

  // 1. Try fetching from the high-speed AlQuran Cloud API with Uthmani script + chosen translation
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,${translationId}`,
      { headers: { Accept: 'application/json' } }
    );

    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.length >= 2) {
        const arabicData = json.data[0];
        const translationData = json.data[1];

        const ayahs: QuranAyah[] = arabicData.ayahs.map((ayah: any, index: number) => {
          const transAyah = translationData.ayahs[index];
          let textArabic = ayah.text;

          // If not Surah 1 (Al-Fatiha) and not Surah 9 (At-Tawbah), remove Bismillah from first verse if prepended
          if (surahNumber !== 1 && surahNumber !== 9 && index === 0) {
            const bismillahPrefix = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ';
            if (textArabic.startsWith(bismillahPrefix)) {
              textArabic = textArabic.replace(bismillahPrefix, '').trim();
            }
          }

          return {
            numberInSurah: ayah.numberInSurah,
            textArabic: textArabic,
            translation: transAyah ? transAyah.text : '',
            juz: ayah.juz,
            page: ayah.page,
          };
        });

        surahCache[cacheKey] = ayahs;
        return { ayahs };
      }
    }
  } catch (err) {
    console.warn(`[QuranService] Cloud API failed for Surah ${surahNumber}, trying internal/fallback:`, err);
  }

  // 2. Try proxy endpoint on local server if available
  try {
    const res = await fetch(`/api/quran/surah/${surahNumber}?edition=${translationId}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ayahs && Array.isArray(data.ayahs)) {
        surahCache[cacheKey] = data.ayahs;
        return { ayahs: data.ayahs };
      }
    }
  } catch (err) {
    // ignore
  }

  // 3. Fallback to built-in curated Surah data if available
  if (BUILT_IN_SURAHS[surahNumber]) {
    const builtIn = BUILT_IN_SURAHS[surahNumber];
    let selectedTrans = builtIn.urdu;
    if (translationId === 'ur.maududi' && builtIn.maududi) {
      selectedTrans = builtIn.maududi;
    } else if (translationId.startsWith('en.')) {
      selectedTrans = builtIn.english;
    }

    const ayahs: QuranAyah[] = builtIn.arabic.map((ar, i) => ({
      numberInSurah: i + 1,
      textArabic: ar,
      translation: selectedTrans[i] || '',
    }));

    surahCache[cacheKey] = ayahs;
    return { ayahs, isFallback: true };
  }

  // 4. Graceful generation for offline or pending connection
  return {
    ayahs: [
      {
        numberInSurah: 1,
        textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translation: translationId.startsWith('ur.')
          ? 'شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے (انٹرنیٹ کنکشن کے ساتھ مکمل تلاوت و آیات لوڈ ہو رہی ہیں...)'
          : 'In the name of Allah, the Entirely Merciful, the Especially Merciful. (Loading full verses and translation...)',
      },
    ],
    isFallback: true,
  };
}
