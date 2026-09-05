import {
  AnnouncementItem,
  GalleryEventItem,
  FacilityItem,
  CommitteePerson,
  ZikrItem,
} from '../types';

export const MOSQUE_INFO = {
  nameEn: 'Jamia Masjid Usman-e-Ghani (R.A)',
  nameUr: 'جامع مسجد عثمانِ غنی رضی اللہ عنہ',
  titleUr: 'مرکزی جامع مسجد و دارالقرآن عثمانِ غنی (رضی اللہ عنہ)',
  addressEn: 'ST-11, Sector 5-A/1, North Karachi, Karachi, Sindh, Pakistan',
  addressUr: 'ایس ٹی 11، سیکٹر 5-اے/1، نارتھ کراچی، کراچی، سندھ، پاکستان',
  landmarkEn: 'Near 4-K Chowrangi & Power House, Sector 5-A/1',
  landmarkUr: 'قریب 4-کے چورنگی و پاور ہاؤس، سیکٹر 5-اے/1',
  phone: '+92 21 36984211',
  whatsapp: '03233469424',
  whatsappDisplay: '0323-3469424',
  email: 'info@masjid-usman-e-ghani.pk',
  establishedYear: '1988',
  capacity: '3,500+ Namazis',
  jurisdiction: 'Hanafi (جامعہ دارالعلوم کراچی نصاب)',
};

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    titleEn: 'Friday Khutbah & Special Dars by Maulana Younus Mansori',
    titleUr: 'خطبہ جمعۃ المبارک و خصوصی درس از مولانا یونس منصوری',
    category: 'juma',
    date: '2026-08-28',
    hijriDate: '15 Safar 1448 AH',
    important: true,
    time: 'Bayan 01:00 PM | Azan 01:40 PM | Jamaat 01:45 PM',
    speakerEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
    speakerUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد عثمان غنی)',
    badgeEn: 'This Friday',
    badgeUr: 'اس جمعہ',
    contentEn:
      'This Friday’s Bayan will cover the virtues and life of Hazrat Usman-e-Ghani (R.A) and guidelines on financial integrity and charitable community support in contemporary times. Led by our Khateeb Maulana Younus Mansori, followed by prayer led by Imam Maulana Hidayatullah. All brothers from North Karachi are warmly welcomed to attend early.',
    contentUr:
      'اس جمعۃ المبارک کے موقع پر خلیفہ سوم حضرت سیدنا عثمانِ غنی رضی اللہ عنہ کی سخاوت، حیاء اور موجودہ معاشی حالات میں حقوق العباد کے موضوع پر خطیب مسجد حضرت مولانا یونس منصوری کا خصوصی بیان ہوگا۔ تمام اہل علاقہ سے قبل از وقت تشریف لانے کی گزارش ہے۔',
  },
  {
    id: 'ann-2',
    titleEn: 'Community Clean Drinking Water RO Plant 24/7 Service',
    titleUr: 'اہل علاقہ کے لیے 24 گھنٹے مفت صاف پینے کے پانی کی فراہمی (RO پلانٹ)',
    category: 'welfare',
    date: '2026-08-26',
    hijriDate: '13 Safar 1448 AH',
    important: true,
    time: 'Available 24 Hours Daily',
    badgeEn: 'Public Welfare',
    badgeUr: 'فلاحِ عامہ',
    contentEn:
      'The modern RO filtration plant installed at Jamia Masjid Usman-e-Ghani provides 100% clean, mineral-balanced sweet drinking water freely to all residents of Sector 5-A/1 North Karachi round the clock.',
    contentUr:
      'جامع مسجد عثمان غنی کے زیر اہتمام جدید ریورس اوسموسس (RO) واٹر فلٹریشن پلانٹ 24 گھنٹے بلا تعطل تمام اہل محلہ اور نمازیوں کو مفت اور صاف پینے کا پانی فراہم کر رہا ہے۔ اہل علاقہ مستفید ہو سکتے ہیں۔',
  },
  {
    id: 'ann-3',
    titleEn: 'Installation of 10 KV Solar Power Backup System (16 Plates)',
    titleUr: 'الحمدللہ! 10 کے وی سولر پاور سسٹم (16 پلیٹس) کی تنصیب',
    category: 'construction',
    date: '2026-08-20',
    hijriDate: '7 Safar 1448 AH',
    badgeEn: 'Masjid Project',
    badgeUr: 'مسجد منصوبہ',
    contentEn:
      'By the grace of Allah and generous donations from the community, the 10 KV hybrid solar power setup with 16 solar plates is now fully operational, ensuring continuous fans, lighting, and water pumps during load shedding.',
    contentUr:
      'اہل محلہ اور مخیر حضرات کے تعاون سے مسجد کا 10 KV جدید سولر سسٹم مع 16 سولر پلیٹس مکمل ہو چکا ہے۔ جس کی بدولت تمام نمازوں میں بلاتعطل پنکھے، لائٹس اور واٹر پمپس فعال رہتے ہیں۔ جزاکم اللہ خیرا۔',
  },
  {
    id: 'ann-4',
    titleEn: 'Free Community Medical & Sugar Testing Camp',
    titleUr: 'مفت میڈیکل و شوگر/بلڈ پریشر چیک اپ کیمپ برائے اہل علاقہ',
    category: 'welfare',
    date: '2026-08-30',
    hijriDate: '17 Safar 1448 AH',
    time: 'Sunday 09:30 AM - 02:00 PM',
    badgeEn: 'Welfare Camp',
    badgeUr: 'فلاحی کیمپ',
    contentEn:
      'Free general health examination, diabetes glucose screening, BP monitoring, and basic medicine distribution for the residents of Sector 5-A/1 North Karachi in the mosque basement hall. Qualified doctors in attendance.',
    contentUr:
      'مسجد کمیٹی اور الخدمت میڈیکل کے اشتراک سے اتوار کے روز مسجد کے نچلے ہال میں مفت میڈیکل چیک اپ، شوگر ٹیسٹ اور مفت ادویات کی فراہمی کا انتظام کیا گیا ہے۔ تمام اہل علاقہ اس سہولت سے مستفید ہوں۔',
  },
  {
    id: 'ann-5',
    titleEn: 'Janazah Prayer Arrangement & Coordination',
    titleUr: 'نمازِ جنازہ کا اہتمام و بروقت رابطہ',
    category: 'janazah',
    date: '2026-08-15',
    hijriDate: '2 Safar 1448 AH',
    badgeEn: 'Janazah Service',
    badgeUr: 'نمازِ جنازہ',
    contentEn:
      'Jamia Masjid Usman-e-Ghani provides spacious open courtyard facilities and imam arrangements for congregational Janazah prayers for Sector 5-A/1 residents.',
    contentUr:
      'مسجد میں نمازِ جنازہ کی باوقار ادائیگی کے لیے کشادہ صحن، صف بندی اور امامت کے انتظامات موجود ہیں۔ جنازہ کے وقت اور اعلان کے لیے مسجد دفتر سے رابطہ کریں۔',
  },
];

export const GALLERY_EVENTS: GalleryEventItem[] = [
  {
    id: 'gal-entrance',
    titleEn: 'Main Entrance Gate & Archway (Jamia Masjid Usman Ghani)',
    titleUr: 'مرکزی بابِ داخلہ و محراب (جامع مسجد عثمانِ غنی رضی اللہ عنہ)',
    date: 'Official Mosque Photo',
    category: 'renovation',
    coverImage: '/images/masjid_gate.jpg',
    locationEn: 'Main Entrance Gate, ST-11 Sector 5-A/1',
    locationUr: 'مرکزی گیٹ، ایس ٹی 11 سیکٹر 5-اے/1 نارتھ کراچی',
    attendees: 'All Namazis & Visitors',
    descriptionEn:
      'The prominent red-brick Islamic arched entrance of Jamia Masjid Usman-e-Ghani, inscribed with "جامع مسجد عثمان غنی" and the blessed entrance supplication "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ".',
    descriptionUr:
      'جامع مسجد عثمان غنی کا پرشکوہ سرخ اینٹوں سے بنا مرکزی بابِ داخلہ، جس کے محراب پر "جامع مسجد عثمان غنی" اور بالائی تختی پر مسنون دعا "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ" کندہ ہے۔',
    images: [
      {
        url: '/images/masjid_gate.jpg',
        captionEn: 'Main Entrance Arch with Arabic Calligraphy & Dua Plaque',
        captionUr: 'مرکزی گیٹ کا پرشکوہ منظر مع دعائے داخلۂ مسجد اور قرآنی خطاطی',
      },
      {
        url: '/images/masjid_logo.jpg',
        captionEn: 'Official Logo & Seal of Jamia Masjid Usman-e-Ghani',
        captionUr: 'جامع مسجد عثمان غنی کا باضابطہ مونوگرام و مہر',
      },
    ],
  },
  {
    id: 'gal-1',
    titleEn: 'Grand Juma-tul-Mubarak Congregation & Weekly Bayan',
    titleUr: 'روح پرور اجتماع جمعۃ المبارک و خطاب',
    date: 'August 2026',
    category: 'events',
    coverImage:
      'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80',
    locationEn: 'Main Prayer Hall & Courtyard',
    locationUr: 'مرکزی نماز ہال و بیرونی صحن',
    attendees: '2,800+ Namazis',
    descriptionEn:
      'Over 2,800 faithful attended the blessed Friday prayers and spiritual discourse at Jamia Masjid Usman-e-Ghani, Sector 5-A/1.',
    descriptionUr:
      'سیکٹر 5-اے/1 نارتھ کراچی میں جمعۃ المبارک کا پرشکوہ اجتماع جس میں 2800 سے زائد نمازیوں نے شرکت فرما کر خطبہ سنا اور نماز ادا کی۔',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80',
        captionEn: 'Main Prayer Hall during Friday Congregation',
        captionUr: 'خطبہ جمعہ کے دوران مرکزی ہال کا دلکش منظر',
      },
      {
        url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
        captionEn: 'Sujud and congregational unity during Friday prayer',
        captionUr: 'باجماعت نماز کا روح پرور سجدہ ریز منظر',
      },
      {
        url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
        captionEn: 'Dua and supplication after Juma prayer',
        captionUr: 'نمازِ جمعہ کے بعد ملک و ملت کی سلامتی کے لیے رقت آمیز دعا',
      },
    ],
  },
  {
    id: 'gal-2',
    titleEn: 'Annual Khatam-e-Quran & Dastar-e-Fazeelat Ceremony',
    titleUr: 'سالانہ دستارِ فضیلت و تکمیل حفظِ قرآن تقریب',
    date: 'July 2026',
    category: 'education',
    coverImage:
      'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80',
    locationEn: 'Madrasah Usman-e-Ghani Hall',
    locationUr: 'ہال مدرسہ عثمانِ غنی',
    attendees: '24 Huffaz Graduated',
    descriptionEn:
      'Ceremony honoring 24 young students who completed the memorization of the Holy Quran under the guidance of our esteemed Qari teachers.',
    descriptionUr:
      '24 ہونہار طلبہ کرام کی حفظِ قرآن کی تکمیل پر پروقار دستار بندی اور انعامات کی تقسیم۔',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80',
        captionEn: 'The Holy Quran recitation session by Huffaz',
        captionUr: 'حفاظ کرام کی خوش الحانی کے ساتھ تلاوتِ قرآن',
      },
      {
        url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
        captionEn: 'Scholars awarding certificates and honorary turbans',
        captionUr: 'جید علمائے کرام کے ہاتھوں طلبہ کی دستار بندی',
      },
    ],
  },
  {
    id: 'gal-3',
    titleEn: 'Modern Wudu Khana & 10 KV Solar System (16 Plates)',
    titleUr: 'جدید وضو خانہ اور 10 کے وی سولر پروجیکٹ (16 پلیٹس)',
    date: 'June 2026',
    category: 'renovation',
    coverImage:
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    locationEn: 'Mosque Rooftop & Ground Facilities',
    locationUr: 'مسجد کی چھت و گراؤنڈ فلور وضو ایریا',
    descriptionEn:
      'Inauguration of the renovated marble wudu area equipped with automated water-saving taps and 10 KV solar panel generation.',
    descriptionUr:
      'مسجد کے سنگ مرمر سے آراستہ کشادہ وضو خانے کی تزئین و آرائش اور 16 سولر پلیٹس کے 10 KV سسٹم کی تنصیب۔',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
        captionEn: 'Clean, hygienic, and well-ventilated wudu facilities',
        captionUr: 'صاف ستھرا، کشادہ اور جدید سہولیات سے آراستہ وضو خانہ',
      },
      {
        url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
        captionEn: 'Evening illumination of Jamia Masjid Usman-e-Ghani minarets',
        captionUr: 'مسجد کے گنبد و مینار کا پرنور شام کا نظارہ',
      },
    ],
  },
  {
    id: 'gal-4',
    titleEn: 'Community Ration & Iftar Dastarkhwan Distribution',
    titleUr: 'رمضان المبارک اجتماعی افطار دسترخوان و راشن پیکجز',
    date: 'Ramadan 1447 / 2026',
    category: 'ramadan',
    coverImage:
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    locationEn: 'Community Courtyard ST-11',
    locationUr: 'مسجد کا مرکزی صحن',
    attendees: '500+ daily Iftar & 300+ Families Ration',
    descriptionEn:
      'Serving daily freshly prepared Iftar to over 500 fasting Muslims and distributing monthly dry food rations to deserving North Karachi families.',
    descriptionUr:
      'روزانہ 500 سے زائد روزہ داروں کے لیے باوقار افطار اور مستحق خاندانوں میں شفافیت کے ساتھ راشن بیگز کی تقسیم۔',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
        captionEn: 'Community members preparing Iftar dates and water',
        captionUr: 'روزہ داروں کے لیے افطار اور کھجوروں کا اہتمام',
      },
      {
        url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
        captionEn: 'Night Taraweeh prayer gathering in peaceful ambiance',
        captionUr: 'نمازِ تراویح میں نمازیوں کی پرخلوص حاضری',
      },
    ],
  },
  {
    id: 'gal-5',
    titleEn: 'Free Eye & General Medical Checkup Camp',
    titleUr: 'مفت آئی و جنرل میڈیکل کیمپ سیکٹر 5-اے/1',
    date: 'May 2026',
    category: 'welfare',
    coverImage:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    locationEn: 'Basement Welfare Hall',
    locationUr: 'بیسمنٹ ویلفیئر ہال',
    attendees: '650+ Patients Served',
    descriptionEn:
      'Free eye examinations, spectacle distribution, and diabetic consultations organized for the North Karachi community.',
    descriptionUr:
      'اہل محلہ کے لیے آنکھوں کے معائنے، مفت نظر کے چشموں اور ذیابیطس چیک اپ کا کامیاب کیمپ۔',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        captionEn: 'Doctors performing eye and vision screenings',
        captionUr: 'ماہر ڈاکٹرز کی زیر نگرانی مریضوں کا معائنہ',
      },
    ],
  },
];

export const FACILITIES: FacilityItem[] = [
  {
    id: 'fac-1',
    titleEn: 'Spacious Main Prayer Hall',
    titleUr: 'مرکزی نماز ہال',
    descriptionEn:
      'Three spacious floors with carpeted prayer areas accommodating over 3,500 worshippers with high-fidelity acoustics and ample ventilation.',
    descriptionUr:
      'تین منزلوں پر مشتمل کشادہ ہال جس میں 3500 سے زائد نمازیوں کے لیے نرم قالین، روشن ماحول اور اعلی ساؤنڈ سسٹم موجود ہے۔',
    icon: 'Building2',
    tagEn: 'Capacity 3500+',
    tagUr: 'گنجائش 3500+',
    detailsEn: [
      'Spacious well-ventilated halls with hybrid solar inverter backup',
      'Dedicated sound proofing for crystal clear Khutbah audio',
      'Comfortable seating chairs for elderly and special needs',
      'Separate women prayer gallery during Eid & Tarawih',
    ],
    detailsUr: [
      'سولر بیک اپ پر فعال پنکھے اور روشن ہوادار ماحول',
      'خطبات کے لیے واضح ڈیجیٹل آڈیو سسٹم',
      'معمر نمازیوں کے لیے مخصوص کرسیاں اور ٹیک',
      'عیدین و تراویح میں خواتین کے لیے پردے کا انتظام',
    ],
  },
  {
    id: 'fac-2',
    titleEn: 'Islamic Library & Research Center',
    titleUr: 'اسلامی دارالمطالعہ و کتب خانہ',
    descriptionEn:
      'A rich collection of authentic Tafseer, Hadith, Fiqh, Islamic jurisprudence, and Seerah literature for reading and spiritual guidance.',
    descriptionUr:
      'معتبر تفاسیر، کتبِ احادیث، سیرتِ طیبہ اور فقہی کتب پر مشتمل پرسکون اسلامی کتب خانہ برائے مطالعہ و دینی رہنمائی۔',
    icon: 'BookOpen',
    tagEn: 'Daily Open',
    tagUr: 'روزانہ کھلا ہے',
    detailsEn: [
      'Comprehensive collections of Sahih Bukhari, Muslim, and Sunan',
      'Classical Quranic exegesis (Tafseer Ibn Kathir, Maarif-ul-Quran)',
      'Comfortable study desks with peaceful reading atmosphere',
      'Resident scholars available for authentic Masail guidance',
    ],
    detailsUr: [
      'صحاح ستہ، تفاسیر (معارف القرآن، ابن کثیر) کے معتبر نسخے',
      'علمائے کرام کی زیر نگرانی مستند دینی و فقہی مسائل کی رہنمائی',
      'مطالعہ کے لیے پرسکون ماحول اور کتب بینی کا انتظام',
      'نمازیوں اور نوجوانوں کے لیے مفت مطالعہ کی سہولت',
    ],
  },
  {
    id: 'fac-3',
    titleEn: 'Modern Wudu Khana',
    titleUr: 'جدید وضو خانہ',
    descriptionEn:
      'Spacious hygienic wudu stations with continuous water supply, dedicated marble seating, and clean sanitization.',
    descriptionUr:
      'صاف ستھرا اور کشادہ وضو خانہ جس میں نمازیوں کے لیے ہمہ وقت پانی اور پاکیزہ ماحول کا انتظام ہے۔',
    icon: 'Droplets',
    tagEn: '100+ Wudu Points',
    tagUr: '100+ وضو نشستیں',
    detailsEn: [
      '100+ individual marble seating wudu points',
      'Clean washrooms with continuous sanitation upkeep',
      'Continuous uninterrupted water supply for ablution',
      'Solar-powered submersible pumps for uninterrupted water',
    ],
    detailsUr: [
      '100 سے زائد سنگ مرمر کی وضو نشستیں',
      'ہمہ وقت صفائی عملے کی موجودگی',
      'نمازیوں کے لیے وضو کے پانی کی بلاتعطل فراہمی',
      'سولر سے منسلک سبمرسیبل واٹر پمپس',
    ],
  },
  {
    id: 'fac-4',
    titleEn: 'Janazah Prayer Facility',
    titleUr: 'نمازِ جنازہ سہولت',
    descriptionEn:
      'Designated spacious courtyard and peaceful environment for holding congregational Janazah prayers with timely coordination.',
    descriptionUr:
      'نمازِ جنازہ کی باوقار ادائیگی کے لیے وسیع و کشادہ صحن، صفوں کی بہترین ترتیب اور فوری اعلانات کی سہولت۔',
    icon: 'HeartHandshake',
    tagEn: 'Available',
    tagUr: 'سہولت دستیاب',
    detailsEn: [
      'Spacious open courtyard for large Janazah prayers',
      'Proper row alignment and peaceful, respectful atmosphere',
      'Timely announcements across mosque speakers and portal',
      'Convenient vehicle accessibility and parking on ST-11',
    ],
    detailsUr: [
      'بڑے جنازوں کے لیے کھلا اور باحجاب صحن',
      'صفوں کی منظم ترتیب اور پرسکون ماحول',
      'نمازِ جنازہ کے اوقات کی بروقت اطلاع و اعلانات',
      'نمازیوں کی آمد و رفت کے لیے کشادہ راستے',
    ],
  },
  {
    id: 'fac-5',
    titleEn: 'Islamic Library & Research Section',
    titleUr: 'اسلامی دارالمطالعہ و کتب خانہ',
    descriptionEn:
      'Curated Islamic library containing classical Tafseer, Hadith collections (Sihah Sittah), Fatawa, Seerah, and contemporary Islamic research books.',
    descriptionUr:
      'تفاسیر، کتبِ احادیث (صحاح ستہ)، فتاویٰ، سیرت النبی ﷺ اور فکری کتب پر مشتمل پرسکون لائبریری۔',
    icon: 'Library',
    tagEn: '2,500+ Books',
    tagUr: '2500+ کتب',
    detailsEn: [
      'Tafseer-e-Usmani, Maariful Quran, and Ibn Kathir',
      'Complete Hadith encyclopedias with Urdu translations',
      'Quiet study atmosphere open between Dhuhr and Isha',
      'Islamic books for youth and moral development',
    ],
    detailsUr: [
      'تفسیر عثمانی، معارف القرآن اور تفسیر ابن کثیر',
      'صحاح ستہ مع مستند اردو تراجم و شروحات',
      'ظہر تا عشاء مطالعے کے لیے پرسکون ماحول',
      'نوجوانوں کے لیے اخلاقی و معلوماتی لٹریچر',
    ],
  },
  {
    id: 'fac-6',
    titleEn: '10 KV Solar Power System (16 Solar Plates)',
    titleUr: '10 کے وی خودکار سولر سسٹم (16 پلیٹس)',
    descriptionEn:
      '16 high-efficiency solar plates generating 10 KV clean solar power ensuring uninterrupted fans, lighting, and sound system during outages.',
    descriptionUr:
      'مسجد کی چھت پر نصب 16 سولر پلیٹس اور 10 KV ہائبرڈ سسٹم جس سے بجلی کی لوڈ شیڈنگ کے دوران عبادت میں کوئی خلل نہیں آتا۔',
    icon: 'SunMedium',
    tagEn: '16 Plates | 10 KV',
    tagUr: '16 پلیٹس | 10 KV',
    detailsEn: [
      '16 Tier-1 solar plates installed on rooftop',
      '10 KV heavy-duty hybrid inverter with battery backup',
      'Supplies uninterrupted power to all hall fans and lights',
      'Significant reduction in electricity expenses',
    ],
    detailsUr: [
      'مسجد کی چھت پر نصب 16 عدد معیاری سولر پلیٹس',
      '10 KV جدید ہائبرڈ انورٹر اور بیٹری بیک اپ',
      'تمام ہالز کے پنکھوں، لائٹس اور ساؤنڈ سسٹم کا بلاتعطل چلنا',
      'بجلی کے اخراجات میں کمی اور 100 فیصد ماحول دوست نظام',
    ],
  },
];

export const COMMITTEE_MEMBERS: CommitteePerson[] = [
  {
    nameEn: 'Hazrat Maulana Younus Mansori',
    nameUr: 'حضرت مولانا یونس منصوری صاحب',
    roleEn: 'Khateeb-e-Masjid',
    roleUr: 'خطیب مسجد',
    qualificationEn: 'Senior Scholar & Khateeb, Jamia Masjid Usman-e-Ghani',
    qualificationUr: 'فاضل درس نظامی و خطیب جامع مسجد',
    contact: '+92 300 2489110',
  },
  {
    nameEn: 'Hazrat Maulana Hidayatullah',
    nameUr: 'حضرت مولانا ہدایت اللہ صاحب',
    roleEn: 'Imam-e-Masjid',
    roleUr: 'امام مسجد',
    qualificationEn: 'Imam & Head of Prayers, Jamia Masjid Usman-e-Ghani',
    qualificationUr: 'فاضل درس نظامی، امام جامع مسجد',
    contact: '+92 312 9845120',
  },
  {
    nameEn: 'Qari Kamal ud Din',
    nameUr: 'قاری کمال الدین صاحب',
    roleEn: 'Moazzin & Caretaker',
    roleUr: 'مؤذن و نگران مسجد',
    qualificationEn: 'Moazzin & Tajweed Teacher',
    qualificationUr: 'قاری و مؤذنِ جامع مسجد',
    contact: '+92 333 5124870',
  },
  {
    nameEn: 'Haji Moin ud Din',
    nameUr: 'معین الدین صاحب',
    roleEn: 'President Masjid Committee',
    roleUr: 'صدر انتظامی کمیٹی',
    qualificationEn: 'President & Senior Community Trustee',
    qualificationUr: 'صدر جامع مسجد عثمانِ غنی ٹرسٹ',
    contact: '+92 300 9245118',
  },
  {
    nameEn: 'Ahmer Khan',
    nameUr: 'احمر خان صاحب',
    roleEn: 'Vice President',
    roleUr: 'نائب صدر انتظامی کمیٹی',
    qualificationEn: 'Vice President & Operations Incharge',
    qualificationUr: 'نائب صدر مسجد کمیٹی',
    contact: '+92 321 8294101',
  },
  {
    nameEn: 'Absar',
    nameUr: 'ابصار صاحب',
    roleEn: 'Committee Member',
    roleUr: 'رکن انتظامی کمیٹی',
    qualificationEn: 'Executive Member & Community Relations',
    qualificationUr: 'رکن مسجد کمیٹی، سیکٹر 5-اے/1',
    contact: '+92 302 4412099',
  },
  {
    nameEn: 'Salahudin',
    nameUr: 'صلاح الدین صاحب',
    roleEn: 'Committee Member',
    roleUr: 'رکن انتظامی کمیٹی',
    qualificationEn: 'Executive Member & Services Oversight',
    qualificationUr: 'رکن مسجد کمیٹی، سیکٹر 5-اے/1',
    contact: '+92 345 7812903',
  },
  {
    nameEn: 'Muhammad Hassan Ali',
    nameUr: 'محمد حسن علی صاحب',
    roleEn: 'Committee Member',
    roleUr: 'رکن انتظامی کمیٹی',
    qualificationEn: 'Executive Member & Welfare Coordinator',
    qualificationUr: 'رکن مسجد کمیٹی و ناظم فلاحی امور',
    contact: '+92 313 6529410',
  },
];

export const DAILY_WISDOM = {
  ayah: {
    arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
    translationEn: 'Indeed, prayer has been decreed upon the believers a decree of specified times.',
    translationUr: 'بے شک نماز مومنوں پر مقررہ اوقات میں فرض کی گئی ہے۔',
    surahEn: 'Surah An-Nisa (4:103)',
    surahUr: 'سورۃ النساء، آیت 103',
  },
  hadith: {
    arabic: 'مَنْ بَنَى مَسْجِدًا لِلَّهِ بَنَى اللَّهُ لَهُ فِي الْجَنَّةِ مِثْلَهُ',
    translationEn: 'Whoever builds a mosque for the sake of Allah, Allah will build for him a house like it in Paradise.',
    translationUr: 'جس نے اللہ کی رضا کی خاطر مسجد بنائی، اللہ تعالیٰ اس کے لیے جنت میں ویسا ہی گھر بنائے گا۔',
    narratorEn: 'Hazrat Usman ibn Affan (R.A) in Sahih al-Bukhari & Muslim',
    narratorUr: 'روایت: سیدنا عثمان بن عفان رضی اللہ عنہ (صحیح بخاری و مسلم)',
  },
  virtueOfUsman: {
    arabic: 'أَلَا أَسْتَحِي مِنْ رَجُلٍ تَسْتَحِي مِنْهُ الْمَلَائِكَةُ',
    quoteEn: '“Shall I not feel shy of a man from whom even the angels feel shy?” — Prophet Muhammad ﷺ about Hazrat Usman-e-Ghani (R.A) [Sahih Muslim]',
    quoteUr: '“کیا میں اس شخص سے حیا نہ کروں جس سے فرشتے بھی حیا کرتے ہیں؟” — رسول اللہ ﷺ کا ارشادِ مبارک حضرت عثمان غنی رضی اللہ عنہ کی شان میں [صحیح مسلم]',
  },
};

export const ZIKR_ITEMS: ZikrItem[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    translationEn: 'Glory be to Allah',
    translationUr: 'اللہ پاک ہے ہر عیب سے',
    virtueEn: 'Planting a palm tree in Jannah for every recitation.',
    virtueUr: 'ہر مرتبہ پڑھنے پر جنت میں کھجور کا ایک درخت لگایا جاتا ہے۔',
    targetCount: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translationEn: 'All praise is due to Allah',
    translationUr: 'تمام تعریفیں اللہ ہی کے لیے ہیں',
    virtueEn: 'Fills the heavenly scales of good deeds.',
    virtueUr: 'میزانِ عمل کو نیکیوں سے بھر دیتا ہے۔',
    targetCount: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translationEn: 'Allah is the Greatest',
    translationUr: 'اللہ سب سے بڑا ہے',
    virtueEn: 'Light on the tongue, heavy on the Scales, beloved to the Most Merciful.',
    virtueUr: 'زبان پر ہلکا، ترازو میں بھاری اور رحمن کو محبوب ترین۔',
    targetCount: 34,
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullah wa Atoobu Ilayh',
    translationEn: 'I seek forgiveness from Allah and turn to Him in repentance',
    translationUr: 'میں اللہ سے بخشش مانگتا ہوں اور اسی کی طرف رجوع کرتا ہوں',
    virtueEn: 'Opens doors of sustenance, relief from hardships and peace of heart.',
    virtueUr: 'رزق میں برکت اور پریشانیوں سے نجات کا مجرب ترین نسخہ۔',
    targetCount: 100,
  },
  {
    id: 'durood',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliteration: 'Allahumma Salli Ala Muhammadin wa Ala Aali Muhammad',
    translationEn: 'O Allah, bestow peace and blessings upon Muhammad and the family of Muhammad',
    translationUr: 'اے اللہ! رحمتیں نازل فرما محمد ﷺ پر اور آلِ محمد پر',
    virtueEn: 'Allah sends 10 blessings, removes 10 sins, and elevates 10 ranks for one Durood.',
    virtueUr: 'ایک بار پڑھنے پر دس رحمتیں، دس گناہ معاف اور دس درجات بلند ہوتے ہیں۔',
    targetCount: 100,
  },
  {
    id: 'la_ilaha_illallah',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'La Ilaha Illallah Wahdahu La Shareeka Lah',
    translationEn: 'There is no god but Allah alone, without partner',
    translationUr: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں',
    virtueEn: 'The most superior dhikr in the sight of Allah.',
    virtueUr: 'سب سے افضل اور وزنی ذکر۔',
    targetCount: 100,
  },
];

export const DONATION_INFO = {
  accountTitle: 'Jamia Masjid Usman-e-Ghani Welfare Trust',
  bankName: 'Meezan Bank Ltd (Islamic Banking)',
  branch: 'North Karachi Sector 5-A/1 Branch (Code: 0142)',
  accountNumber: '0142-0105893321',
  iban: 'PK45MEZN0001420105893321',
  easypaisa: '0300-2489110',
  jazzcash: '0321-8294101',
  noteEn: 'Donations are accepted for Masjid General Maintenance, Solar Energy, Madrasah Students Sponsorship, and Poor Family Ration.',
  noteUr: 'عطیات مسجد کے عمومی اخراجات، سولر پروجیکٹ، طلبہ دینیہ کے تعلیمی اخراجات اور غرباء کے راشن کے لیے استعمال کیے جاتے ہیں۔ رسید مسجد دفتر سے ضرور حاصل کریں۔',
};
