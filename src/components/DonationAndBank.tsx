import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  CreditCard,
  Building,
  CheckCircle2,
  Printer,
  Share2,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Phone,
  MessageCircle,
  ShieldCheck,
  Receipt,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  Send,
  Lock,
} from 'lucide-react';
import { Language, DonationReceipt } from '../types';
import { MOSQUE_INFO } from '../data/mockData';
import { amountToWordsEn, amountToWordsUr } from '../utils/receiptHelper';
import { addNotification } from '../services/notificationService';

interface DonationAndBankProps {
  language: Language;
}

interface FundOption {
  id: string;
  nameEn: string;
  nameUr: string;
  descEn: string;
  descUr: string;
}

const FUND_CATEGORIES: FundOption[] = [
  {
    id: 'mosque_maintenance',
    nameEn: 'Mosque Maintenance & Construction',
    nameUr: 'تعمیر و مرمت و رنگ و روغن مسجد',
    descEn: 'Paints, lighting, acoustics, carpets, and structural repairs.',
    descUr: 'مسجد کی عمومی دیکھ بھال، فرش، صفیں اور بجلی کے آلات کی دیکھ بھال۔',
  },
  {
    id: 'solar_utilities',
    nameEn: '10 KV Solar Energy & Electricity Bills',
    nameUr: '10 KV سولر پاور و بجلی بلز فنڈ',
    descEn: 'Solar battery replacements, maintenance, and utility bills.',
    descUr: 'سولر پلیٹس کی دیکھ بھال اور کے الیکٹرک کے بلوں کی ادائیگی۔',
  },
  {
    id: 'water_ro_plant',
    nameEn: 'Clean RO Water Filtration Plant 24/7',
    nameUr: 'صاف پینے کا پانی (RO واٹر پلانٹ فنڈ)',
    descEn: 'Free sweet drinking water for Sector 5-A/1 North Karachi community.',
    descUr: 'اہل علاقہ اور نمازیوں کے لیے 24 گھنٹے مفت میٹھے پانی کے فلٹرز و پلانٹ کی سروس۔',
  },
  {
    id: 'staff_honorarium',
    nameEn: 'Imams, Muazzins & Staff Honorarium',
    nameUr: 'ائمہ کرام، مؤذنین اور خدام اکرام کا مشاہرہ',
    descEn: 'Monthly salaries and welfare for resident scholars and staff.',
    descUr: 'مسجد کے خطیب، امام، مؤذن اور صفائی عملے کا ماہانہ اعزازیہ۔',
  },
  {
    id: 'deserving_ration',
    nameEn: 'Deserving Families Ration & Welfare',
    nameUr: 'مستحقین کے لیے راشن و فلاحی امداد',
    descEn: 'Monthly ration hampers and medicine aid for impoverished families.',
    descUr: 'سیکٹر 5-اے/1 کے ضرورت مند اور سفید پوش گھرانوں کے لیے ماہانہ راشن امداد۔',
  },
  {
    id: 'general_sadaqah',
    nameEn: 'General Sadaqah & Zakat Fund',
    nameUr: 'عام صدقات، خیرات و زکوٰۃ فنڈ',
    descEn: 'Distributed strictly according to Hanafi Shariah guidelines.',
    descUr: 'شریعت کے احکام کے عین مطابق مستحقین تک رسائی۔',
  },
];

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

const PAYMENT_METHODS = [
  {
    id: 'meezan',
    nameEn: 'Meezan Bank (Islamic)',
    nameUr: 'میزان بینک لمیٹڈ (اسلامک بینکنگ)',
    accountNo: '0108-0104829301',
    iban: 'PK65MEZN0001080104829301',
    title: 'Jamia Masjid Usman-e-Ghani Trust',
    branch: 'North Karachi Sector 5-C Branch',
  },
  {
    id: 'easypaisa',
    nameEn: 'EasyPaisa Wallet',
    nameUr: 'ایزی پیسہ اکاؤنٹ',
    accountNo: '03233469424',
    title: 'Masjid Usman-e-Ghani Welfare',
    branch: 'Official Mobile Account',
  },
  {
    id: 'jazzcash',
    nameEn: 'JazzCash Wallet',
    nameUr: 'جاز کیش اکاؤنٹ',
    accountNo: '03233469424',
    title: 'Masjid Usman-e-Ghani Welfare',
    branch: 'Official Mobile Account',
  },
  {
    id: 'counter_cash',
    nameEn: 'Cash at Mosque Office Counter',
    nameUr: 'مسجد دفتر / کمیٹی کاؤنٹر پر نقد جمع کروائیں',
    accountNo: 'Office ST-11 Sector 5-A/1',
    title: 'Office Incharge: Maulana Hidayatullah',
    branch: 'Main Office Counter',
  },
];

const RECEIPTS_STORAGE_KEY = 'mosque_donation_receipts';

export const DonationAndBank: React.FC<DonationAndBankProps> = ({ language }) => {
  const isUrdu = language === 'ur';

  // Form states
  const [selectedCategory, setSelectedCategory] = useState<string>(FUND_CATEGORIES[0].id);
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('meezan');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [dedicationNotes, setDedicationNotes] = useState<string>('');
  
  // Generated active receipt
  const [activeReceipt, setActiveReceipt] = useState<DonationReceipt | null>(null);
  const [pastReceipts, setPastReceipts] = useState<DonationReceipt[]>([]);
  const [copiedReceipt, setCopiedReceipt] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const receiptRef = useRef<HTMLDivElement>(null);

  // Load saved receipts on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECEIPTS_STORAGE_KEY);
      if (saved) {
        setPastReceipts(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load past donation receipts', e);
    }
  }, []);

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) {
      setAmount(parseInt(val, 10));
    }
  };

  // Generate Receipt
  const handleGenerateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const chosenCategory = FUND_CATEGORIES.find((c) => c.id === selectedCategory) || FUND_CATEGORIES[0];
      const chosenMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod) || PAYMENT_METHODS[0];

      const randomSeq = Math.floor(10000 + Math.random() * 90000);
      const receiptNumber = `JMUG-REC-${now.getFullYear()}-${randomSeq}`;

      const generatedRef = transactionRef.trim()
        ? transactionRef.trim()
        : `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const effectiveDonor = isAnonymous
        ? (isUrdu ? 'فاعلِ خیر (نامعلوم)' : 'Anonymous Well-wisher')
        : (donorName.trim() || (isUrdu ? 'محترم عطیہ دہندہ' : 'Respected Donor'));

      const newReceipt: DonationReceipt = {
        receiptNo: receiptNumber,
        donorName: effectiveDonor,
        donorPhone: donorPhone.trim() || '0323-3469424',
        donorEmail: donorEmail.trim() || undefined,
        fundCategoryEn: chosenCategory.nameEn,
        fundCategoryUr: chosenCategory.nameUr,
        amount: amount,
        amountInWordsEn: amountToWordsEn(amount),
        amountInWordsUr: amountToWordsUr(amount),
        paymentMethodEn: chosenMethod.nameEn,
        paymentMethodUr: chosenMethod.nameUr,
        transactionRef: generatedRef,
        date: dateStr,
        time: timeStr,
        notes: dedicationNotes.trim() || undefined,
        status: 'completed',
      };

      // Save to state and localStorage
      const updatedList = [newReceipt, ...pastReceipts.slice(0, 19)];
      setPastReceipts(updatedList);
      try {
        localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (err) {
        console.warn('Failed saving donation receipt to storage', err);
      }

      // Add automated notification in app notification center
      try {
        addNotification({
          titleEn: `Donation Receipt #${receiptNumber} Generated`,
          titleUr: `عطیہ کی کمپیوٹرائزڈ رسید #${receiptNumber} جاری`,
          messageEn: `Alhamdulillah, donation of PKR ${amount.toLocaleString()} for ${chosenCategory.nameEn} confirmed. Receipt generated.`,
          messageUr: `الحمدللہ! ${chosenCategory.nameUr} کے لیے PKR ${amount.toLocaleString()} کا عطیہ موصول ہوا۔ کمپیوٹرائزڈ رسید جاری ہو گئی۔`,
          type: 'donation',
          category: 'donation',
          priority: 'medium',
          isActive: true,
        });
      } catch (e) {
        console.warn('Failed to add donation notification', e);
      }

      setActiveReceipt(newReceipt);
      setIsProcessing(false);

      // Scroll to receipt
      setTimeout(() => {
        receiptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 600);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareWhatsApp = (receipt: DonationReceipt) => {
    const text = isUrdu
      ? `*جامع مسجد عثمانِ غنی رضی اللہ عنہ - کمپیوٹرائزڈ رسید عطیہ*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `*رسید نمبر:* ${receipt.receiptNo}\n` +
        `*نام عطیہ دہندہ:* ${receipt.donorName}\n` +
        `*رقم:* PKR ${receipt.amount.toLocaleString()} (${receipt.amountInWordsUr})\n` +
        `*شعبہ / فنڈ:* ${receipt.fundCategoryUr}\n` +
        `*طریقۂ ادائیگی:* ${receipt.paymentMethodUr}\n` +
        `*ٹرانزیکشن ریفرنس:* ${receipt.transactionRef}\n` +
        `*تاریخ و وقت:* ${receipt.date} (${receipt.time})\n` +
        (receipt.notes ? `*دعا / ایصالِ ثواب:* ${receipt.notes}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `اللہ تعالیٰ آپ کے اس صدقہ کو اپنی بارگاہ میں قبول فرمائے اور دارین میں اجرِ عظیم عطا فرمائے۔ آمین۔\n` +
        `جامع مسجد عثمان غنی، سیکٹر 5-اے/1 نارتھ کراچی • واٹس ایپ: 03233469424`
      : `*JAMIA MASJID USMAN-E-GHANI - OFFICIAL DONATION RECEIPT*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `*Receipt No:* ${receipt.receiptNo}\n` +
        `*Donor:* ${receipt.donorName}\n` +
        `*Amount:* PKR ${receipt.amount.toLocaleString()} (${receipt.amountInWordsEn})\n` +
        `*Category:* ${receipt.fundCategoryEn}\n` +
        `*Payment Method:* ${receipt.paymentMethodEn}\n` +
        `*Ref / Txn ID:* ${receipt.transactionRef}\n` +
        `*Date:* ${receipt.date} at ${receipt.time}\n` +
        (receipt.notes ? `*Dedication:* ${receipt.notes}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `May Allah accept this noble Sadaqah and reward you abundantly. Ameen.\n` +
        `Jamia Masjid Usman-e-Ghani, ST-11 Sector 5-A/1 North Karachi • WhatsApp: 03233469424`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/923233469424?text=${encoded}`, '_blank');
  };

  const handleCopyReceiptText = (receipt: DonationReceipt) => {
    const text = `JAMIA MASJID USMAN-E-GHANI (R.A)
Official Donation Receipt #${receipt.receiptNo}
Donor: ${receipt.donorName}
Amount: PKR ${receipt.amount.toLocaleString()} (${receipt.amountInWordsEn})
Fund: ${receipt.fundCategoryEn} (${receipt.fundCategoryUr})
Method: ${receipt.paymentMethodEn}
Txn Ref: ${receipt.transactionRef}
Date: ${receipt.date} ${receipt.time}
Status: Verified & Completed
Masjid WhatsApp: 03233469424`;

    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  return (
    <section
      id="donate"
      className="py-16 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
            <span>{isUrdu ? 'خودکار ڈیجیٹل سسٹم برائے عطیات و رسید' : 'Automated Donation & Receipt System'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isUrdu ? (
              <span className="font-urdu text-3xl sm:text-5xl text-amber-300">
                آن لائن عطیہ جمع کروائیں اور فوری کمپیوٹرائزڈ رسید حاصل کریں
              </span>
            ) : (
              <span>Automated Donation & Instant Official Receipt</span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 mt-2">
            {isUrdu
              ? 'اپنا مطلوبہ فنڈ منتخب کریں، رقم درج کریں اور فوری طور پر جامع مسجد عثمان غنی کی مصدقہ الیکٹرانک رسید حاصل کریں۔'
              : 'Select your preferred fund category, choose the amount, and instantly generate an official, verified digital receipt for your donation.'}
          </p>
        </div>

        {/* TOP TOGGLE: MAKE DONATION VS VIEW PAST RECEIPTS */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setShowHistory(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              !showHistory
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'نیا عطیہ و خودکار رسید' : 'Make Donation & Get Receipt'}</span>
          </button>

          {pastReceipts.length > 0 && (
            <button
              onClick={() => setShowHistory(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                showHistory
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>
                {isUrdu ? `گزشتہ رسیدیں (${pastReceipts.length})` : `Recent Receipts (${pastReceipts.length})`}
              </span>
            </button>
          )}
        </div>

        {/* VIEW PAST RECEIPTS LIST (IF USER SELECTED HISTORY) */}
        {showHistory ? (
          <div className="rounded-2xl bg-stone-900/90 border border-stone-800 p-6 shadow-2xl mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-300" />
                <h3 className="text-lg font-bold text-white">
                  {isUrdu ? 'محفوظ شدہ ڈیجیٹل رسیدیں' : 'Generated Donation Receipts History'}
                </h3>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{isUrdu ? 'نیا عطیہ فارم' : 'Back to Donation Form'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {pastReceipts.map((rec) => (
                <div
                  key={rec.receiptNo}
                  className="p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-300">
                        {rec.receiptNo}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/60 text-emerald-300 text-[10px] font-bold uppercase">
                        {rec.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      {rec.donorName} • <span className="text-emerald-400 font-mono">PKR {rec.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {rec.fundCategoryUr} ({rec.fundCategoryEn}) • {rec.date} {rec.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveReceipt(rec);
                        setShowHistory(false);
                        setTimeout(() => {
                          receiptRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-700"
                    >
                      {isUrdu ? 'رسید دیکھیں' : 'View Receipt'}
                    </button>
                    <button
                      onClick={() => handleShareWhatsApp(rec)}
                      className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60"
                      title="Share to WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ACTIVE INTERACTIVE DONATION FORM & RECEIPT WORKFLOW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            
            {/* LEFT 7 COLS: INTERACTIVE DONATION BUILDER */}
            <div className="lg:col-span-7 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
              
              <form onSubmit={handleGenerateReceipt} className="space-y-6">
                
                {/* 1. SELECT FUND CATEGORY */}
                <div>
                  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5">
                    {isUrdu ? '1. عطیہ کا شعبہ یا فنڈ منتخب کریں:' : '1. Select Donation Fund Category:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {FUND_CATEGORIES.map((fund) => {
                      const isSelected = selectedCategory === fund.id;
                      return (
                        <button
                          type="button"
                          key={fund.id}
                          onClick={() => setSelectedCategory(fund.id)}
                          className={`p-3 rounded-xl text-left transition-all border ${
                            isSelected
                              ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-500/50 text-white'
                              : 'bg-stone-950/70 border-stone-800 hover:border-stone-700 text-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-bold text-white">
                              {isUrdu ? fund.nameUr : fund.nameEn}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-stone-400 line-clamp-1">
                            {isUrdu ? fund.descUr : fund.descEn}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. SELECT OR ENTER AMOUNT */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      {isUrdu ? '2. رقم کا انتخاب کریں (پاکستانی روپے):' : '2. Select or Enter Amount (PKR):'}
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      PKR {amount.toLocaleString()}
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                    {PRESET_AMOUNTS.map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => handleAmountSelect(val)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold font-mono transition-all border ${
                          amount === val && !customAmount
                            ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md scale-105'
                            : 'bg-stone-950/80 text-stone-300 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        Rs. {val.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 font-mono">
                      PKR
                    </span>
                    <input
                      type="text"
                      placeholder={isUrdu ? 'یا اپنی مرضی کی رقم درج کریں...' : 'Or enter custom amount in PKR...'}
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-mono text-sm"
                    />
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1 italic">
                    {isUrdu ? amountToWordsUr(amount) : amountToWordsEn(amount)}
                  </div>
                </div>

                {/* 3. DONOR DETAILS */}
                <div className="pt-2 border-t border-stone-800/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      {isUrdu ? '3. عطیہ دہندہ کی تفصیلات:' : '3. Donor Information:'}
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-stone-300">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-stone-700 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>{isUrdu ? 'فاعلِ خیر (نام خفیہ رکھیں)' : 'Keep Anonymous'}</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {!isAnonymous && (
                      <div>
                        <span className="block text-[11px] text-stone-400 mb-1">
                          {isUrdu ? 'آپ کا مکمل نام:' : 'Full Name:'}
                        </span>
                        <input
                          type="text"
                          required={!isAnonymous}
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder={isUrdu ? 'جیسے: محمد احمد' : 'e.g. Muhammad Ahmed'}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}

                    <div className={isAnonymous ? 'sm:col-span-2' : ''}>
                      <span className="block text-[11px] text-stone-400 mb-1">
                        {isUrdu ? 'واٹس ایپ یا موبائل نمبر (برائے رسید):' : 'WhatsApp / Mobile Number (for receipt):'}
                      </span>
                      <input
                        type="tel"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        placeholder="0323-XXXXXXX"
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] text-stone-400 mb-1">
                      {isUrdu ? 'خصوصی نیت یا ایصالِ ثواب (اختیاری):' : 'Dedication / Dua Request (Optional):'}
                    </span>
                    <input
                      type="text"
                      value={dedicationNotes}
                      onChange={(e) => setDedicationNotes(e.target.value)}
                      placeholder={isUrdu ? 'برائے ایصالِ ثواب والدین، یا برائے ترقی و عافیت' : 'e.g. For Isal-e-Sawab of late parents'}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* 4. PAYMENT METHOD */}
                <div className="pt-2 border-t border-stone-800/80">
                  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                    {isUrdu ? '4. ادائیگی کا طریقہ منتخب کریں:' : '4. Select Payment Channel:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((m) => {
                      const isSel = selectedMethod === m.id;
                      return (
                        <button
                          type="button"
                          key={m.id}
                          onClick={() => setSelectedMethod(m.id)}
                          className={`p-3 rounded-xl text-left border transition-all ${
                            isSel
                              ? 'bg-emerald-950/80 border-amber-400 text-white ring-1 ring-amber-400/40'
                              : 'bg-stone-950/70 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span>{isUrdu ? m.nameUr : m.nameEn}</span>
                            {isSel && <Check className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <div className="text-[11px] font-mono text-emerald-400 mt-1">
                            {m.accountNo}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {m.title}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Transaction Ref Optional */}
                  <div className="mt-3">
                    <span className="block text-[11px] text-stone-400 mb-1">
                      {isUrdu ? 'ٹرانزیکشن / ٹریکنگ آئی ڈی (اختیاری):' : 'Transaction ID / Reference (Optional):'}
                    </span>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder={isUrdu ? 'بینک یا ایزی پیسہ ٹرانزیکشن آئی ڈی درج کریں یا خالی چھوڑ دیں' : 'Leave blank to auto-generate official reference'}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  id="btn-complete-donation-receipt"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/70 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                >
                  <Receipt className="w-4 h-4 text-amber-300" />
                  <span>
                    {isProcessing
                      ? (isUrdu ? 'رسید تیار کی جا رہی ہے...' : 'Generating Official Receipt...')
                      : (isUrdu
                          ? `عطیہ مکمل کریں اور رسید حاصل کریں (PKR ${amount.toLocaleString()})`
                          : `Complete Donation & Generate Receipt (PKR ${amount.toLocaleString()})`)}
                  </span>
                </button>

                <p className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {isUrdu
                      ? 'تمام عطیات جامع مسجد عثمان غنی ٹرسٹ اکاؤنٹ میں شریعت کے مطابق محفوظ ہوتے ہیں'
                      : 'All funds securely recorded under Jamia Masjid Usman-e-Ghani Trust Shariah governance'}
                  </span>
                </p>

              </form>
            </div>

            {/* RIGHT 5 COLS: OFFICIAL DIGITAL RECEIPT CARD (LIVE PREVIEW OR ACTIVE GENERATED RECEIPT) */}
            <div className="lg:col-span-5" ref={receiptRef}>
              
              <div className="rounded-2xl bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/60 p-6 shadow-2xl relative overflow-hidden text-stone-100">
                
                {/* Watermark Logo in Receipt background */}
                <div className="absolute right-2 bottom-2 w-48 h-48 opacity-5 pointer-events-none">
                  <img
                    src="/images/masjid_logo.jpg"
                    alt="Mosque Seal"
                    className="w-full h-full object-contain filter grayscale"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Receipt Header */}
                <div className="border-b border-stone-800 pb-4 mb-4 text-center relative">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-400/60 mx-auto mb-2 shadow-md bg-stone-950">
                    <img
                      src="/images/masjid_logo.jpg"
                      alt="Jamia Masjid Logo"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h3 className="font-bold text-white text-base">
                    {isUrdu ? MOSQUE_INFO.nameUr : MOSQUE_INFO.nameEn}
                  </h3>
                  <p className="text-[11px] text-amber-300 font-semibold">
                    ST-11 Sector 5-A/1 North Karachi, Sindh
                  </p>
                  <p className="text-[10px] text-stone-400">
                    {isUrdu ? 'الیکٹرانک تصدیق شدہ رسید برائے صدقات و مسجد فنڈ' : 'Official Electronic Donation Receipt Slip'}
                  </p>
                </div>

                {/* Receipt Numbers and Meta */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
                    <span className="text-stone-400">{isUrdu ? 'رسید نمبر:' : 'Receipt No:'}</span>
                    <span className="font-mono font-bold text-amber-300">
                      {activeReceipt ? activeReceipt.receiptNo : 'JMUG-REC-PREVIEW'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">{isUrdu ? 'تاریخ و وقت:' : 'Date & Time:'}</span>
                    <span className="font-mono text-stone-200">
                      {activeReceipt ? `${activeReceipt.date} • ${activeReceipt.time}` : 'Live Timestamp on Submit'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">{isUrdu ? 'عطیہ دہندہ:' : 'Donor Name:'}</span>
                    <span className="font-bold text-white">
                      {activeReceipt
                        ? activeReceipt.donorName
                        : isAnonymous
                        ? (isUrdu ? 'فاعلِ خیر' : 'Anonymous')
                        : donorName.trim() || (isUrdu ? 'محترم عطیہ دہندہ' : 'Donor')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">{isUrdu ? 'شعبہ / فنڈ:' : 'Fund Cause:'}</span>
                    <span className="font-semibold text-emerald-300 text-right max-w-[200px] truncate">
                      {activeReceipt
                        ? (isUrdu ? activeReceipt.fundCategoryUr : activeReceipt.fundCategoryEn)
                        : (FUND_CATEGORIES.find((f) => f.id === selectedCategory)?.nameUr || '')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">{isUrdu ? 'طریقۂ ادائیگی:' : 'Payment Channel:'}</span>
                    <span className="text-stone-200 text-right">
                      {activeReceipt
                        ? activeReceipt.paymentMethodUr
                        : (PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.nameUr || '')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">{isUrdu ? 'ریفرنس نمبر:' : 'Reference ID:'}</span>
                    <span className="font-mono text-[11px] text-stone-300">
                      {activeReceipt ? activeReceipt.transactionRef : (transactionRef || 'AUTOGENERATED')}
                    </span>
                  </div>

                  {/* Amount Highlight Box */}
                  <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-600/60 text-center shadow-inner">
                    <span className="text-[10px] text-emerald-300 block uppercase font-bold tracking-wider">
                      {isUrdu ? 'کل موصول شدہ رقم' : 'Total Amount Donated'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono py-1">
                      PKR {(activeReceipt ? activeReceipt.amount : amount).toLocaleString()}
                    </div>
                    <span className="text-[11px] text-stone-300 block italic">
                      {isUrdu
                        ? amountToWordsUr(activeReceipt ? activeReceipt.amount : amount)
                        : amountToWordsEn(activeReceipt ? activeReceipt.amount : amount)}
                    </span>
                  </div>

                  {/* Dedication note if any */}
                  {(activeReceipt?.notes || dedicationNotes) && (
                    <div className="p-2.5 rounded-lg bg-stone-950/70 border border-stone-800 text-[11px] text-amber-200/90 text-center">
                      <span className="font-semibold">{isUrdu ? 'نیت / دعا: ' : 'Dedication: '}</span>
                      <span>{activeReceipt?.notes || dedicationNotes}</span>
                    </div>
                  )}

                  {/* Official Mosque Digital Verification Stamp */}
                  <div className="mt-4 pt-3 border-t border-dashed border-stone-700 flex items-center justify-between">
                    <div className="text-[10px] text-stone-400 leading-tight">
                      <span className="text-emerald-400 font-bold block">✓ VERIFIED & RECORDED</span>
                      <span>Jamia Masjid Usman-e-Ghani</span>
                      <span className="block font-mono text-[9px] text-stone-500">WA: 03233469424</span>
                    </div>

                    <div className="w-16 h-16 rounded-full border-2 border-emerald-500/80 flex flex-col items-center justify-center text-center p-1 transform rotate-[-8deg] bg-emerald-950/40">
                      <span className="text-[8px] font-bold text-amber-300 uppercase">OFFICIAL</span>
                      <span className="text-[7px] font-extrabold text-white">MASJID SEAL</span>
                      <span className="text-[6px] text-emerald-300">NORTH KARACHI</span>
                    </div>
                  </div>
                </div>

                {/* Receipt Actions if generated */}
                {activeReceipt ? (
                  <div className="mt-6 pt-4 border-t border-stone-800 grid grid-cols-3 gap-2">
                    <button
                      id="btn-print-donation-receipt"
                      onClick={handlePrintReceipt}
                      className="py-2 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="Print Official Slip"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'پرنٹ' : 'Print'}</span>
                    </button>

                    <button
                      id="btn-share-receipt-whatsapp"
                      onClick={() => handleShareWhatsApp(activeReceipt)}
                      className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md transition-colors"
                      title="Share to WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>{isUrdu ? 'واٹس ایپ' : 'WhatsApp'}</span>
                    </button>

                    <button
                      id="btn-copy-receipt-details"
                      onClick={() => handleCopyReceiptText(activeReceipt)}
                      className="py-2 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      {copiedReceipt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedReceipt ? (isUrdu ? 'کاپی ہوا' : 'Copied') : (isUrdu ? 'کاپی' : 'Copy')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t border-stone-800 text-center">
                    <p className="text-[11px] text-stone-400">
                      {isUrdu
                        ? 'فارم مکمل کر کے بٹن دبائیں، آپ کی باضابطہ رسید فوری تیار ہو جائے گی۔'
                        : 'Submit the form to generate and print your official verifiable receipt.'}
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* TRUST & TRANSPARENCY STRIP */}
        <div className="rounded-2xl bg-stone-900/60 border border-stone-800 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block">
                {isUrdu ? 'شفافیت و شریعت کی پابندی' : 'Transparency & Shariah Governance'}
              </span>
              <span className="text-stone-400 text-[11px]">
                {isUrdu
                  ? 'جامع مسجد عثمان غنی کے تمام مالیاتی معاملات مستند آڈٹ اور معزز کمیٹی کی زیرِ نگرانی انجام پاتے ہیں'
                  : 'Managed under the supervision of Jamia Masjid Usman-e-Ghani Executive Committee & resident Imams.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-emerald-400 font-bold">
              WA: 0323-3469424
            </span>
            <a
              href="https://wa.me/923233469424"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/40 transition-colors font-semibold"
            >
              {isUrdu ? 'اکاؤنٹ تصدیق' : 'Verify Account'}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
