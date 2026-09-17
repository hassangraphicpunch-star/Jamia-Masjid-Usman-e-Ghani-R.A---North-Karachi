import React, { useState } from 'react';
import {
  Building2,
  Volume2,
  Layers,
  Sparkles,
  Paintbrush,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  FileCheck,
  HelpCircle,
  ChevronRight,
  Info,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../types';
import { MOSQUE_INFO } from '../data/mockData';

interface DonationAndBankProps {
  language: Language;
}

export interface DonationCategoryInfo {
  id: string;
  nameEn: string;
  nameUr: string;
  subtitleEn: string;
  subtitleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeEn: string;
  badgeUr: string;
  scopeItemsEn: string[];
  scopeItemsUr: string[];
}

const DONATION_CATEGORIES: DonationCategoryInfo[] = [
  {
    id: 'new-sound-system',
    nameEn: 'New Sound System',
    nameUr: 'نیا ساؤنڈ سسٹم',
    subtitleEn: 'Acoustic Clarity for Azan, Khutbah & Namaz',
    subtitleUr: 'اذان، خطبہ جمعہ و باجماعت نماز کی واضح آواز',
    descriptionEn:
      'Replacement and upgrade of the main prayer hall and exterior sound system. This project covers high-definition digital amplifiers, wireless microphone units for Imams and Khateeb, heavy-duty outdoor minaret horn speakers for crisp Azan reach, and synchronized indoor acoustic columns to eliminate echo across all floors.',
    descriptionUr:
      'مسجد کے مرکزی ہال اور بیرونی میناروں کے ساؤنڈ سسٹم کی مکمل تجدید۔ اس شعبہ میں اعلیٰ معیار کے ڈیجیٹل ایمپلی فائرز، امام و خطیب صاحب کے لیے وائرلیس مائیکروفونز، بیرونی میناروں کے لیے طاقتور ہورن اسپیکرز اور اندرونی ہالز میں بغیر گونج کے شفاف آواز کے کالم اسپیکرز کی تنصیب شامل ہے۔',
    icon: Volume2,
    accentColor: 'from-amber-500/20 to-amber-950/40 border-amber-500/40 text-amber-400',
    badgeEn: 'Active Project',
    badgeUr: 'جاری منصوبہ',
    scopeItemsEn: [
      'Multi-channel digital audio mixer & feedback suppressor',
      'Dual wireless cordless mics & lapel mics for Imams',
      'Exterior waterproof high-output minaret horn speakers',
      'Balanced column speakers across ground & mezzanine prayer halls',
    ],
    scopeItemsUr: [
      'ملٹی چینل ڈیجیٹل آڈیو مکسر اور فیڈ بیک کنٹرول یونٹ',
      'ائمہ کرام اور خطیب کے لیے اعلیٰ کوالٹی کے وائرلیس اور کالر مائیکس',
      'بیرونی میناروں کے لیے واٹر پروف طاقتور لاؤڈ اسپیکرز',
      'مرکزی و بالائی ہالز میں متوازن آواز کے کالم اسپیکرز',
    ],
  },
  {
    id: 'roof-construction',
    nameEn: 'Masjid Roof Construction',
    nameUr: 'مسجد چھت تعمیراتی فنڈ',
    subtitleEn: 'Structural Reinforcement & Weatherproofing',
    subtitleUr: 'بالائی چھت کی توسیع، واٹر پروفنگ و تعمیر',
    descriptionEn:
      'Structural construction, reinforcement, and multi-layer weatherproofing of the Masjid roof. This critical project prevents rainwater seepage into the main ceiling during monsoon rains, provides heat insulation tiles to lower indoor hall temperatures, and builds secure boundary railings for worshippers during packed congregations.',
    descriptionUr:
      'مسجد کی بالائی چھت کی مضبوط تعمیر، کنکریٹ ری انفورسمنٹ اور معیاری واٹر پروفنگ۔ یہ پراجیکٹ برسات کے موسم میں چھت سے پانی کے رساؤ کو مستقل طور پر روکنے، گرمیوں میں ہال کو ٹھنڈا رکھنے کے لیے ہیٹ پروفنگ ٹائلز اور بڑے اجتماعات میں نمازیوں کے تحفظ کے لیے حفاظتی گرلز کی تنصیب پر مشتمل ہے۔',
    icon: Layers,
    accentColor: 'from-blue-500/20 to-blue-950/40 border-blue-500/40 text-blue-400',
    badgeEn: 'Priority Construction',
    badgeUr: 'اہم تعمیراتی شعبہ',
    scopeItemsEn: [
      'Multi-layer Bitumen chemical waterproofing against monsoon rains',
      'High-grade white heat-reflective weather tiles for summer relief',
      'Safety perimeter parapet wall & reinforced boundary railing',
      'Upper canopy foundation for future Juma & Taraweeh overflow prayer rows',
    ],
    scopeItemsUr: [
      'بارش کے پانی سے مکمل حفاظت کے لیے کیمیکل واٹر پروفنگ کوٹنگ',
      'شدید گرمی سے بچاؤ کے لیے سفید ہیٹ ریفلیکٹو ویدر ٹائلز',
      'چھت کے اطراف مضبوط پیراپیٹ وال اور حفاظتی جنگلہ',
      'جمعہ و تراویح میں اضافی نمازیوں کے لیے چھت کے شیڈ کی بنیادیں',
    ],
  },
  {
    id: 'misc-expenses',
    nameEn: 'Masjid Miscellaneous Expenses',
    nameUr: 'مسجد متفرق اخراجات',
    subtitleEn: 'Daily Operations, Utilities & Emergency Needs',
    subtitleUr: 'روزمرہ دفتری، سیکیورٹی، بجلی و ہنگامی ضروریات',
    descriptionEn:
      'Dedicated fund for urgent and unplanned mosque operations. Covers routine electrical replacements (LED tubes, wiring, capacitors), municipal water tanker supplies during shortages, gas and power backups, sound backup battery maintenance, security hardware, and unforeseen administrative emergencies.',
    descriptionUr:
      'مسجد کے روزمرہ بلاتعطل نظام کے لیے ہنگامی و متفرق اخراجات۔ اس میں بجلی کے فوری سامان (ایل ای ڈی لائٹس، تاریں، کیپیسیٹرز)، پانی کی قلت کے دوران واٹر ٹینکرز، یو پی ایس اور سولر بیک اپ بیٹریاں، سیکیورٹی انتظامات اور دفتری انتظامیہ کے ناگزیر متفرق اخراجات شامل ہیں۔',
    icon: Receipt,
    accentColor: 'from-emerald-500/20 to-emerald-950/40 border-emerald-500/40 text-emerald-400',
    badgeEn: 'Operational Essential',
    badgeUr: 'روزمرہ ناگزیر فنڈ',
    scopeItemsEn: [
      'Emergency water tanker deliveries during municipal pipeline shortages',
      'Electrical switchgear, energy-saving LED lighting & wire replacements',
      'Solar battery fluid, maintenance & inverter tune-ups',
      'Security cameras, audio accessories & administrative supplies',
    ],
    scopeItemsUr: [
      'شہری لائن میں پانی نہ آنے کی صورت میں فوری واٹر ٹینکرز کی فراہمی',
      'سوئچ گیئر، انرجی سیور ایل ای ڈی لائٹس اور برقی وائرنگ کی تبدیلی',
      'سولر انورٹر اور بیٹریوں کی ماہانہ مرمت و دیکھ بھال',
      'سیکیورٹی کیمرے، آڈیو کیبلز اور دفتری انتظامی لوازمات',
    ],
  },
  {
    id: 'painting-coloring',
    nameEn: 'Masjid Painting & Coloring',
    nameUr: 'مسجد رنگ و روغن',
    subtitleEn: 'Aesthetic Restoration & Protective Coatings',
    subtitleUr: 'محراب، اندرونی ہالز و بیرونی فصیل کی خوبصورتی',
    descriptionEn:
      'Comprehensive painting, weather-shield coating, and decorative Islamic preservation of Jamia Masjid Usman-e-Ghani. Includes premium anti-fungal emulsion on internal prayer halls, decorative calligraphy highlighting along the Mihrab and arches, durable weather-guard on the exterior facade, and enamel on metal gates and grills.',
    descriptionUr:
      'جامع مسجد عثمان غنی کے تمام اندرونی و بیرونی حصوں کا مکمل رنگ و روغن اور پینٹ ورک۔ اس میں نماز ہالز پر اینٹی فنگل معیاری ڈسٹروپر، محراب اور محرابی پٹیوں پر قرآنی خطاطی کی تزئین، بیرونی دیواروں پر ویدر شیلڈ کی حفاظتی تہہ اور لوہے کے مرکزی دروازوں و گرلز کا پائیدار اینامل پینٹ شامل ہے۔',
    icon: Paintbrush,
    accentColor: 'from-purple-500/20 to-purple-950/40 border-purple-500/40 text-purple-400',
    badgeEn: 'Aesthetic & Protection',
    badgeUr: 'حفاظت و تزئین',
    scopeItemsEn: [
      'Anti-fungal, moisture-resistant washable emulsion for main prayer halls',
      'Artistic gold-accented calligraphic touch-ups along the Mihrab arch',
      'Weather-resistant exterior paint protecting brickwork from humidity',
      'Enamel paint protection for main iron gates, window frames, and stairs',
    ],
    scopeItemsUr: [
      'مرکزی ہالز کے لیے اینٹی فنگل اور نم سے محفوظ واش ایبل ایمولشن پینٹ',
      'محراب اور منبر کی قرآنی خطاطی کی گولڈن قلمی تزئین و آرائش',
      'بیرونی سرخ اینٹوں اور دیواروں کو نمی سے بچانے والا ویدر شیلڈ',
      'مرکزی آہنی دروازوں، کھڑکیوں اور سیڑھیوں کے جنگلوں کا اینامل پینٹ',
    ],
  },
  {
    id: 'cleaning-maintenance',
    nameEn: 'Masjid Cleaning & Maintenance',
    nameUr: 'مسجد صفائی و مرمت',
    subtitleEn: 'Hygiene, Deep Carpet Wash & Wudhu Sanitation',
    subtitleUr: 'قالینوں کی دھلائی، وضو خانے کی صفائی و طہارت',
    descriptionEn:
      'Sustaining impeccable cleanliness and sanctity across every square foot of the House of Allah. Covers deep industrial shampooing of prayer carpets, motorized vacuum machines, daily fragrance and sanitization of Wudhu areas, cleaning chemicals, air conditioner servicing and filter cleanups, and trash disposal logistics.',
    descriptionUr:
      'اللہ کے گھر کی مکمل طہارت، صفائی اور پاکیزگی کا مستقل نظام۔ اس شعبہ میں نماز کی صفوں اور قالینوں کی مشین سے دھلائی، پاور ویکیوم کلینرز، وضو خانے اور واش رومز کی روزانہ جراثیم کش اسپرے و صفائی، ایئر کنڈیشنرز کی سروسنگ، اور خوشبو و عطر کے انتظامات شامل ہیں۔',
    icon: Sparkles,
    accentColor: 'from-teal-500/20 to-teal-950/40 border-teal-500/40 text-teal-400',
    badgeEn: 'Daily Sanctity',
    badgeUr: 'طہارت و روزمرہ صفائی',
    scopeItemsEn: [
      'Periodic deep extraction shampooing of 2,000+ yards of prayer carpets',
      'High-grade germicidal cleaners and fragrant sprays for prayer halls',
      '24/7 continuous sanitation supplies for the Wudhu and ablution areas',
      'Regular cleaning and filter maintenance of all AC units and ceiling fans',
    ],
    scopeItemsUr: [
      'دو ہزار گز سے زائد قالینوں کی وقتاً فوقتاً کیمیکل واش اور ویکیوم کلیننگ',
      'نماز ہالز کے لیے اعلیٰ معیار کے جراثیم کش کلینرز اور عطر و خوشبو',
      'وضو خانے اور طہارت خانوں کے لیے 24 گھنٹے معیاری صفائی کی اشیاء',
      'تمام ایئر کنڈیشنرز اور پنکھوں کی باقاعدہ دھلائی و سروسنگ',
    ],
  },
];

export const DonationAndBank: React.FC<DonationAndBankProps> = ({ language }) => {
  const isUrdu = language === 'ur';
  const [selectedCategory, setSelectedCategory] = useState<string>('new-sound-system');

  const activeCategory =
    DONATION_CATEGORIES.find((c) => c.id === selectedCategory) || DONATION_CATEGORIES[0];

  return (
    <section
      id="donate"
      className="py-16 sm:py-20 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800/80 relative overflow-hidden"
    >
      {/* Background Subtle Geometric Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* TOP SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>{isUrdu ? 'مسجد عطیات معلوماتی نظام' : 'Masjid Donation Information System'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {isUrdu ? (
              <span className="font-urdu text-3xl sm:text-5xl text-amber-300 leading-normal">
                جامع مسجد عثمانِ غنی کے پراجیکٹس اور عطیات کی تفصیلات
              </span>
            ) : (
              <span>Mosque Projects & Official Donation Categories</span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 mt-3 leading-relaxed max-w-2xl mx-auto">
            {isUrdu
              ? 'جامع مسجد عثمان غنی (رضی اللہ عنہ) کے زیرِ انتظام تمام تعمیری، تنصیبی اور انتظامی شعبہ جات کی معلومات۔ تمام عطیات و تعاون باضابطہ طور پر صرف مسجد کے دفتر میں وصول کیے جاتے ہیں۔'
              : 'Detailed information regarding the current construction, audio, maintenance, and operational projects of Jamia Masjid Usman-e-Ghani. All donations must be made directly in person at the Masjid Office.'}
          </p>
        </div>

        {/* STRICT POLICY BANNER - NO ONLINE PAYMENTS */}
        <div className="mb-10 sm:mb-12 rounded-2xl bg-gradient-to-r from-red-950/80 via-stone-900/90 to-amber-950/80 border-2 border-red-500/60 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
              <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-red-900/80 border border-red-500/70 text-red-200 text-[11px] font-extrabold uppercase tracking-wide">
                  {isUrdu ? 'باضابطہ پالیسی و ہدایات' : 'Strict Official Policy'}
                </span>
                <span className="text-xs font-bold text-amber-300">
                  {isUrdu ? 'صرف مسجد دفتر میں براہِ راست ادائیگی' : 'In-Person Masjid Office Payment Only'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white">
                {isUrdu
                  ? 'ویب سائٹ پر آن لائن فنڈز یا رقم وصول نہیں کی جاتی'
                  : 'No Online Payment Gateway, Card, or Online Collection on This Website'}
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {isUrdu ? (
                  <span>
                    جامع مسجد عثمان غنی کی انتظامیہ کی پالیسی کے مطابق، <strong>کوئی بھی آن لائن پیمنٹ گیٹ وے، بینک ٹرانسفر، یا کارڈ پیمنٹ اس ویب سائٹ پر موجود نہیں ہے</strong>۔ 
                    تمام حضرات سے گزارش ہے کہ اپنا عطیہ صرف اور صرف <strong>مسجد دفتر میں خود تشریف لا کر جمع کروائیں</strong> اور موقع پر ہی <strong>مسجد کمیٹی کی باضابطہ مہر و دستخط شدہ کمپیوٹرائزڈ / دستی رسید</strong> حاصل فرمائیں۔
                  </span>
                ) : (
                  <span>
                    In strict accordance with the Mosque Trust policy, <strong>no online payment gateway, online transfer, or card collection is accepted on this website</strong>. 
                    All donors are requested to hand over their contributions <strong>directly in person at the Masjid Office</strong> and <strong>collect the official printed donation receipt directly from the office counter</strong> upon payment.
                  </span>
                )}
              </p>
            </div>

            {/* Quick Incharge Badge */}
            <div className="w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-red-800/60 md:pl-4 flex flex-row md:flex-col items-center md:items-end justify-between gap-2">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-stone-400 block uppercase">
                  {isUrdu ? 'صرف عطیات کے لیے رابطہ:' : 'Donation Inquiries Only:'}
                </span>
                <span className="font-mono text-sm font-bold text-amber-300 block tracking-wide">
                  0323 2456480
                </span>
              </div>
              <a
                href="https://wa.me/923232456480?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%DB%8C%DA%A9%D9%85%D8%8C%20%D9%85%DB%8C%DA%BA%20%D8%AC%D8%A7%D9%85%D8%B9%20%D9%85%D8%B3%D8%AC%D8%AF%20%D8%B9%D8%AB%D9%85%D8%A7%D9%86%20%D8%BA%D9%86%DB%8C%20%DA%A9%DB%92%20%D8%AF%D9%81%D8%AA%D8%B1%20%D9%85%DB%8C%DA%BA%20%D8%B9%D8%B7%DB%8C%DB%81%20%D8%AC%D9%85%D8%B9%20%DA%A9%D8%B1%D9%88%D8%A7%D9%86%DB%92%20%DA%A9%DB%92%20%D8%AD%D9%88%D8%A7%D9%84%DB%92%20%D8%B3%DB%92%20%D8%B1%D8%A7%D8%A8%D8%B7%DB%81%20%DA%A9%D8%B1%20%D8%B1%DB%81%D8%A7%20%DB%81%D9%88%DA%BA%DB%94"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'عطیات واٹس ایپ' : 'Donations WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4-STEP TRANSPARENT DONATION PROCESS (HOW IT WORKS) */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {isUrdu ? 'طریقہ کار (کوئی الجھن نہیں)' : 'Clear & Transparent Process'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {isUrdu
                ? 'عطیہ جمع کروانے اور رسید حاصل کرنے کے 4 آسان مراحل'
                : '4-Step In-Person Donation & Receipt Process'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-600/60 text-emerald-400 font-mono text-sm font-bold flex items-center justify-center">
                    01
                  </span>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">
                    {isUrdu ? 'مرحلہ اول' : 'Step One'}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {isUrdu ? 'شعبہ و فنڈ کا انتخاب' : 'Select Category'}
                </h4>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  {isUrdu
                    ? 'دیے گئے 5 شعبہ جات (ساؤنڈ سسٹم، چھت، متفرق، رنگ و روغن، یا صفائی) میں سے اپنی نیت کے مطابق شعبہ منتخب فرمائیں۔'
                    : 'Choose from the 5 designated mosque causes: Sound System, Roof, Misc, Painting, or Cleaning.'}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'مخصوص نیت و تصدیق' : 'Dedicated intention'}</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-600/60 text-emerald-400 font-mono text-sm font-bold flex items-center justify-center">
                    02
                  </span>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">
                    {isUrdu ? 'مرحلہ دوم' : 'Step Two'}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {isUrdu ? 'مسجد دفتر تشریف لائیں' : 'Visit Masjid Office'}
                </h4>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  {isUrdu
                    ? 'جامع مسجد عثمان غنی، سیکٹر 5-اے/1 نارتھ کراچی کے گراؤنڈ فلور پر واقع مرکزی دفتری کاؤنٹر پر تشریف لائیں۔'
                    : 'Visit the authorized Mosque Administration Office counter located at ST-11 Sector 5-A/1 North Karachi.'}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-800/80 flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'روزانہ صبح 9 تا رات 9' : 'Daily 9:00 AM - 9:00 PM'}</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-600/60 text-emerald-400 font-mono text-sm font-bold flex items-center justify-center">
                    03
                  </span>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">
                    {isUrdu ? 'مرحلہ سوم' : 'Step Three'}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {isUrdu ? 'رقم کاؤنٹر پر جمع کروائیں' : 'Hand Over Payment'}
                </h4>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  {isUrdu
                    ? 'رقم نقد (Cash) یا جامع مسجد عثمان غنی ٹرسٹ کے نام کراس چیک کے ذریعے باضابطہ انچارج کے پاس جمع کروائیں۔'
                    : 'Submit your donation via cash or crossed cheque issued to Jamia Masjid Usman-e-Ghani Trust at the counter.'}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'محفوظ و شرعی انتظام' : 'Secure & Shariah compliant'}</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-stone-900 border-2 border-amber-500/60 hover:border-amber-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-mono text-sm font-black flex items-center justify-center shadow-md">
                    04
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold uppercase">
                    {isUrdu ? 'لازمی مرحلہ' : 'Final & Mandatory'}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {isUrdu ? 'باضابطہ دفتری رسید حاصل کریں' : 'Collect Official Receipt'}
                </h4>
                <p className="text-xs text-stone-200 mt-1 leading-relaxed">
                  {isUrdu
                    ? 'رقم جمع ہوتے ہی مسجد انتظامیہ کی باضابطہ مہر و دستخط شدہ پرنٹڈ رسید فوری طور پر موقع پر ہی وصول فرمائیں۔'
                    : 'Collect the official serialized, committee-stamped, and signed printed paper receipt directly from the office counter.'}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-800/80 flex items-center gap-1.5 text-[11px] text-amber-300 font-bold">
                <FileCheck className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'موقع پر پرنٹڈ رسید' : 'Instant physical receipt'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DONATION CATEGORIES SELECTOR & DETAILS */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {isUrdu ? 'تفصیلاتِ شعبہ جات' : 'Designated Projects'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {isUrdu
                  ? 'پانچ باضابطہ فنڈز و شعبہ جات کی مکمل تفصیلات'
                  : 'The 5 Official Mosque Donation Categories'}
              </h3>
            </div>
            <span className="text-xs text-stone-400">
              {isUrdu
                ? 'تفصیل دیکھنے کے لیے کسی بھی شعبہ پر کلک فرمائیں'
                : 'Click any project card to view its scope and instructions'}
            </span>
          </div>

          {/* 5 CATEGORY PILLS (MOBILE / TABLET / DESKTOP RESPONSIVE SELECTOR) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mb-6">
            {DONATION_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.id;
              const IconComp = category.icon;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  type="button"
                  className={`p-3.5 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-950/90 border-amber-400 text-white shadow-xl shadow-emerald-950/80 ring-1 ring-amber-400/50 scale-[1.02]'
                      : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                          : 'bg-stone-950 text-stone-400 border-stone-800'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSelected
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                          : 'bg-stone-950 text-stone-500'
                      }`}
                    >
                      {isUrdu ? category.badgeUr : category.badgeEn}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1">
                      {isUrdu ? category.nameUr : category.nameEn}
                    </h4>
                    <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                      {isUrdu ? category.subtitleUr : category.subtitleEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE CATEGORY EXPANDED DETAIL VIEW */}
          <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/95 to-stone-950 border-2 border-stone-700/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left 7 cols: Category Details, Significance, Scope */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
                    {React.createElement(activeCategory.icon, { className: 'w-7 h-7 sm:w-8 sm:h-8' })}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-600/70 text-emerald-300 text-[11px] font-bold uppercase">
                        {isUrdu ? activeCategory.badgeUr : activeCategory.badgeEn}
                      </span>
                      <span className="text-xs font-semibold text-amber-300">
                        {isUrdu ? 'جامع مسجد عثمان غنی پراجیکٹ' : 'Jamia Masjid Project'}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-3xl font-extrabold text-white mt-1">
                      {isUrdu ? activeCategory.nameUr : activeCategory.nameEn}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-stone-400 mt-0.5">
                      {isUrdu ? activeCategory.subtitleUr : activeCategory.subtitleEn}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>{isUrdu ? 'منصوبہ کا تعارف و ضرورت:' : 'Project Purpose & Need:'}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {isUrdu ? activeCategory.descriptionUr : activeCategory.descriptionEn}
                  </p>
                </div>

                {/* Scope Items */}
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                    {isUrdu
                      ? 'اس فنڈ کے تحت انجام پانے والے اہم امور:'
                      : 'Key Scope Covered by this Fund:'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(isUrdu ? activeCategory.scopeItemsUr : activeCategory.scopeItemsEn).map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-start gap-2.5 text-xs text-stone-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

              </div>

              {/* Right 5 cols: In-Person Office Handover Instructions Card */}
              <div className="lg:col-span-5 bg-stone-950/90 border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-5 text-stone-200">
                
                <div className="border-b border-stone-800 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                      {isUrdu ? 'براہِ راست دفتری کارروائی' : 'In-Person Action'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                      {isUrdu ? 'صرف کاؤنٹر' : 'Office Counter Only'}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {isUrdu
                      ? `${activeCategory.nameUr} کے لیے عطیہ کا طریقہ`
                      : `How to Donate for ${activeCategory.nameEn}`}
                  </h4>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/60 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <span className="font-bold text-white block">
                        {isUrdu ? 'مسجد کے مرکزی دفتر تشریف لائیں' : 'Visit the Masjid Main Office'}
                      </span>
                      <span className="text-stone-400 text-[11px] leading-relaxed block mt-0.5">
                        {isUrdu
                          ? 'پتہ: جامع مسجد عثمان غنی، پلاٹ ST-11، سیکٹر 5-اے/1، نارتھ کراچی'
                          : 'Location: ST-11 Sector 5-A/1 North Karachi (Ground Floor Office)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/60 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <span className="font-bold text-white block">
                        {isUrdu ? 'کاؤنٹر انچارج سے رجوع کریں' : 'Approach the Counter Incharge'}
                      </span>
                      <span className="text-stone-400 text-[11px] leading-relaxed block mt-0.5">
                        {isUrdu
                          ? `انچارج کو بتائیں کہ آپ کا عطیہ برائے "${activeCategory.nameUr}" ہے۔`
                          : `Specify to the staff that your contribution is for "${activeCategory.nameEn}".`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/60 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <span className="font-bold text-white block">
                        {isUrdu ? 'رقم جمع کروائیں اور رسید وصول کریں' : 'Make Payment & Take Receipt'}
                      </span>
                      <span className="text-stone-400 text-[11px] leading-relaxed block mt-0.5">
                        {isUrdu
                          ? 'نقد یا چیک جمع کرواتے ہی باضابطہ تصدیق شدہ مہر والی پرنٹڈ رسید لازمی حاصل فرمائیں۔'
                          : 'Hand over cash or cheque and collect your stamped official trust receipt immediately.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Office Timings & Incharge Box */}
                <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isUrdu ? 'دفتری اوقات:' : 'Office Hours:'}</span>
                    </span>
                    <span className="font-semibold text-white">
                      {isUrdu ? 'صبح 9:00 تا رات 9:00 (روزانہ)' : '9:00 AM – 9:00 PM (Daily)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isUrdu ? 'دفتر انچارج:' : 'Incharge:'}</span>
                    </span>
                    <span className="font-semibold text-amber-300">
                      {isUrdu ? 'مولانا ہدایت اللہ صاحب' : 'Maulana Hidayatullah'}
                    </span>
                  </div>
                </div>

                {/* Direct WhatsApp Pre-filled Inquiry */}
                <a
                  href={`https://wa.me/923232456480?text=${encodeURIComponent(
                    isUrdu
                      ? `السلام علیکم! میں جامع مسجد عثمان غنی کے دفتر میں "${activeCategory.nameUr}" کے حوالے سے عطیہ جمع کروانے کے لیے رہنمائی چاہتا ہوں۔ برائے مہربانی دفتر کے اوقات اور طریقہ کار کی تصدیق فرما دیں۔`
                      : `Assalamu Alaikum! I would like to inquire about making an in-person donation at the Masjid Office for "${activeCategory.nameEn}". Please share the office visiting details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>
                    {isUrdu
                      ? `عطیات ہیلپ لائن (0323 2456480)`
                      : `Donation Inquiries (0323 2456480)`}
                  </span>
                </a>

              </div>

            </div>

          </div>
        </div>

        {/* MASJID OFFICE PHYSICAL LOCATION & RECEIPT VERIFICATION SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left 6 cols: Official Mosque Office Desk Card */}
          <div className="lg:col-span-6 rounded-2xl bg-stone-900/80 border border-stone-800 p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                  {isUrdu ? 'مقام و پتہ برائے ادائیگی' : 'Physical Location for Payment'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {isUrdu ? 'جامع مسجد عثمانِ غنی کا باضابطہ دفتر' : 'Jamia Masjid Usman-e-Ghani Office'}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">
                    {isUrdu ? 'مکمل پتہ:' : 'Full Address:'}
                  </span>
                  <span className="text-stone-300">
                    ST-11, Sector 5-A/1, Usman Ghani Chowk, North Karachi, Karachi, Sindh, Pakistan.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">
                    {isUrdu ? 'اوقاتِ کار:' : 'Visiting Hours:'}
                  </span>
                  <span className="text-stone-300">
                    {isUrdu
                      ? 'روزانہ صبح 9:00 بجے تا رات 9:00 بجے (تمام پانچوں نمازوں کے بعد عملہ موجود رہتا ہے)'
                      : 'Daily 9:00 AM to 9:00 PM (Staff is available after all 5 daily congregational prayers)'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">
                    {isUrdu ? 'صرف عطیات و معاونت کے لیے مخصوص رابطہ نمبر:' : 'Dedicated Donation Inquiries & Contributions Number:'}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="font-mono text-amber-300 font-bold text-sm">
                      0323 2456480
                    </span>
                    <span className="text-[11px] text-stone-400">
                      (+92 323 2456480)
                    </span>
                    <a
                      href="https://wa.me/923232456480"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                  <span className="text-[10px] text-amber-400/90 block mt-1">
                    {isUrdu
                      ? 'نوٹ: یہ نمبر صرف اور صرف عطیات، فنڈز اور رسید کی معلومات کے لیے مخصوص ہے۔'
                      : 'Note: This contact is strictly designated for donation inquiries and receipts.'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=24.9961,67.0673"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-stone-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{isUrdu ? 'گوگل میپس پر لوکیشن دیکھیں' : 'View Location on Google Maps'}</span>
              </a>
            </div>
          </div>

          {/* Right 6 cols: Official Physical Receipt Sample Guide */}
          <div className="lg:col-span-6 rounded-2xl bg-stone-900/80 border border-amber-500/40 p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  {isUrdu ? 'شفافیت و تصدیق' : 'Transparency & Accountability'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {isUrdu ? 'مسجد دفتر کی باضابطہ رسید کی پہچان' : 'Official Masjid Office Receipt Guide'}
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {isUrdu
                ? 'جب آپ مسجد کے دفتر میں نقد یا چیک جمع کروائیں گے، تو آپ کو مسجد کی باضابطہ رسید فراہم کی جائے گی جس پر درج ذیل تمام نشانیاں موجود ہونی چاہییں:'
                : 'When donating at the Masjid Office, you will be handed the official Masjid Trust printed receipt. Always verify that your receipt contains the following features:'}
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isUrdu
                    ? 'مسجد عثمان غنی ٹرسٹ کا مونوگرام اور تصدیقی مہر (Official Stamp)'
                    : 'Official embossed seal & monogram of Jamia Masjid Usman-e-Ghani Trust'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isUrdu
                    ? 'سیریل شدہ بک نمبر اور رسید نمبر (Serial Receipt Number)'
                    : 'Pre-printed unique serial number & book reference'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isUrdu
                    ? 'منتخب کردہ فنڈ کا نام، تاریخ اور جمع کنندہ کے دستخط (Authorized Signatures)'
                    : 'Designated category name, exact amount in words, date & authorized sign'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isUrdu
                    ? 'شریعت کے قواعد کے مطابق آڈٹ شدہ ریکارڈ بک میں فوری اندراج'
                    : 'Immediate ledger logging for independent annual community audit'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40 text-[11px] text-amber-200 leading-relaxed">
              <strong>{isUrdu ? 'ضروری نوٹ:' : 'Crucial Notice:'}</strong>{' '}
              {isUrdu
                ? 'مسجد کے باہر کسی بھی غیر مجاز شخص کو ہرگز عطیہ نہ دیں۔ صرف دفتر کے باضابطہ کاؤنٹر پر ہی رقم جمع کروائیں اور اپنی رسید لازماً وصول فرمائیں۔'
                : 'Never hand over donations to unauthorized persons outside the office. Only contribute at the official counter and always collect your stamped receipt.'}
            </div>
          </div>

        </div>

        {/* FREQUENTLY ASKED QUESTIONS REGARDING IN-PERSON DONATIONS */}
        <div className="rounded-2xl bg-stone-900/60 border border-stone-800 p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {isUrdu ? 'عام پوچھے جانے والے سوالات و وضاحتیں' : 'Frequently Asked Questions & Clarifications'}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {isUrdu
                ? 'آن لائن ادائیگی نہ ہونے اور دفتری نظام سے متعلق عام سوالات کے جوابات'
                : 'Understanding why payments are handled strictly through the Masjid Office'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {isUrdu
                    ? 'ویب سائٹ پر آن لائن پیمنٹ گیٹ وے کیوں نہیں ہے؟'
                    : 'Why is there no online payment gateway on the website?'}
                </span>
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {isUrdu
                  ? 'آن لائن ٹرانزیکشن فیس کے کٹوتیوں سے بچنے، ڈیجیٹل فراڈ کے خطرات کی مکمل روک تھام، اور سو فیصد شفافیت کے پیشِ نظر مسجد کمیٹی نے فیصلہ کیا ہے کہ تمام فنڈز براہِ راست دفتر میں وصول کیے جائیں گے تاکہ نمازی کے ہاتھ میں باضابطہ تصدیق شدہ مہر لگی رسید ہو۔'
                  : 'To avoid third-party transaction fee deductions, prevent digital errors, and maintain 100% financial transparency with immediate physical paper receipts, the Mosque Committee receives all contributions directly at the office desk.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {isUrdu
                    ? 'کیا میں کسی خاص منصوبے کے لیے سامان براہِ راست دے سکتا ہوں؟'
                    : 'Can I donate physical materials (e.g. paint, speakers) directly?'}
                </span>
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {isUrdu
                  ? 'جی ہاں! رنگ و روغن کے لیے ویدر شیلڈ بالٹیاں، ساؤنڈ سسٹم کے اسپیکرز یا چھت کے لیے ٹائلز وغیرہ عطیہ کرنے کے لیے آپ دفتر تشریف لا کر تکنیکی وضاحتیں (Specifications) معلوم کر سکتے ہیں۔'
                  : 'Yes! Donors wishing to supply paint buckets, acoustic cables, or roof weather-tiles directly are encouraged to consult the Masjid Office for exact technical specifications beforehand.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {isUrdu
                    ? 'اگر میں کراچی سے باہر یا دور ہوں تو کیا طریقہ ہے؟'
                    : 'What if I am outside North Karachi or unable to visit?'}
                </span>
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {isUrdu
                  ? 'آپ اپنے کسی معتمد عزیز یا نمائندے کو مسجد کے دفتر بھیج سکتے ہیں، یا مسجد کی عطیات ہیلپ لائن (0323 2456480) پر رابطہ فرما کر دفتری طریقہ کار سے متعلق رہنمائی حاصل کر سکتے ہیں۔'
                  : 'You may send a trusted family representative to the office counter, or contact the dedicated Donation Helpline on WhatsApp (+92 323 2456480 / 0323 2456480) for authorized guidance.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {isUrdu
                    ? 'کیا عطیہ کی رسید کو خفیہ (فاعلِ خیر) رکھا جا سکتا ہے؟'
                    : 'Can my donation receipt remain Anonymous (خفیہ صدقہ)?'}
                </span>
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {isUrdu
                  ? 'بالکل! اگر آپ نام ظاہر نہیں کرنا چاہتے تو دفتر کاؤنٹر پر بتانے پر آپ کی رسید پر "فاعلِ خیر" درج کیا جائے گا، لیکن رسید کا نمبر اور آڈٹ اندراج لازماً کیا جائے گا۔'
                  : 'Certainly. Donors preferring complete anonymity can request the receipt to be marked as "فاعلِ خیر" (Anonymous Well-wisher) while retaining official serial accounting.'}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
