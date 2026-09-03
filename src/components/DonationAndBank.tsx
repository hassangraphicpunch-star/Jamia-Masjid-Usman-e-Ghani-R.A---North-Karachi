import React, { useState } from 'react';
import {
  Heart,
  CreditCard,
  Copy,
  Check,
  Building,
  Users,
  ShieldCheck,
  Phone,
  Sparkles,
  Award,
  Sun,
  BookOpen,
} from 'lucide-react';
import { Language } from '../types';
import { DONATION_INFO, COMMITTEE_MEMBERS, MOSQUE_INFO } from '../data/mockData';

interface DonationAndBankProps {
  language: Language;
}

export const DonationAndBank: React.FC<DonationAndBankProps> = ({
  language,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const isUrdu = language === 'ur';

  const copyToClipboard = (text: string, fieldKey: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  return (
    <section
      id="donate"
      className="py-16 bg-islamic-pattern border-b border-stone-800/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{isUrdu ? 'مسجد فنڈ و تعاون' : 'Mosque Maintenance & Charitable Trust'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isUrdu ? (
              <span className="font-urdu text-3xl sm:text-5xl text-amber-300">
                صدقہ جاریہ، تعمیراتی و فلاحی تعاون
              </span>
            ) : (
              <span>Support Jamia Masjid Usman-e-Ghani</span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 mt-2">
            {isUrdu
              ? 'اللہ کے گھر کی تعمیر، سولر بجلی کے منصوبوں، طلبہ حفظِ قرآن اور مستحقین کے راشن میں اپنا حصہ ڈالیں'
              : 'Participate in Sadaqah Jariyah for mosque utilities, Quran student sponsorships, solar green energy, and local welfare.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          {/* Left Col (6 Cols): Transparent Bank & Mobile Payment Details */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Meezan Bank Islamic Account Card */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-950/80 border-2 border-emerald-500/60 p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900 border border-emerald-600 flex items-center justify-center text-amber-300">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {DONATION_INFO.bankName}
                    </h3>
                    <p className="text-xs text-emerald-400">
                      {DONATION_INFO.branch}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-600 text-[10px] font-bold">
                  Official Account
                </span>
              </div>

              {/* Account Details Box */}
              <div className="space-y-3 pt-2">
                {/* Account Title */}
                <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">
                      {isUrdu ? 'اکاؤنٹ کا عنوان' : 'Account Title'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {DONATION_INFO.accountTitle}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(DONATION_INFO.accountTitle, 'title')}
                    className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white"
                  >
                    {copiedField === 'title' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Account Number */}
                <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">
                      {isUrdu ? 'اکاؤنٹ نمبر' : 'Account Number'}
                    </span>
                    <span className="text-sm sm:text-base font-black text-amber-300 font-mono">
                      {DONATION_INFO.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(DONATION_INFO.accountNumber, 'acc')}
                    className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white"
                  >
                    {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* IBAN */}
                <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] text-stone-400 block uppercase">
                      {isUrdu ? 'بین الاقوامی IBAN نمبر' : 'IBAN Number (Online Transfer)'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-300 font-mono truncate block">
                      {DONATION_INFO.iban}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(DONATION_INFO.iban, 'iban')}
                    className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white shrink-0"
                  >
                    {copiedField === 'iban' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mobile Wallets EasyPaisa & JazzCash */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-stone-800">
                {/* EasyPaisa */}
                <div className="p-3 rounded-xl bg-stone-950/90 border border-emerald-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 block">EasyPaisa</span>
                    <span className="text-xs font-mono font-bold text-white">{DONATION_INFO.easypaisa}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(DONATION_INFO.easypaisa, 'easy')}
                    className="p-1 rounded-md bg-stone-900 text-stone-300 hover:text-white"
                  >
                    {copiedField === 'easy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* JazzCash */}
                <div className="p-3 rounded-xl bg-stone-950/90 border border-rose-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-rose-400 block">JazzCash</span>
                    <span className="text-xs font-mono font-bold text-white">{DONATION_INFO.jazzcash}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(DONATION_INFO.jazzcash, 'jazz')}
                    className="p-1 rounded-md bg-stone-900 text-stone-300 hover:text-white"
                  >
                    {copiedField === 'jazz' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-stone-300 mt-4 leading-relaxed bg-stone-950/40 p-2.5 rounded-lg border border-stone-800">
                {isUrdu ? DONATION_INFO.noteUr : DONATION_INFO.noteEn}
              </p>
            </div>

          </div>

          {/* Right Col (6 Cols): Where Your Donation Goes (Transparent Impact) */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{isUrdu ? 'عطیات کا شفاف استعمال و شعبہ جات' : 'Transparent Fund Allocation'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Box 1 */}
              <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  <Sun className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {isUrdu ? 'مسجد سولر و بجلی بلز' : 'Solar & Energy Fund'}
                </h4>
                <p className="text-xs text-stone-400">
                  {isUrdu
                    ? 'نمازیوں کے لیے 24 گھنٹے پنکھے، ائیرکنڈیشننگ اور واٹر پلانٹ چلانے کا انتظام'
                    : 'Maintaining continuous solar generation, battery upkeep, and zero-interruption power.'}
                </p>
              </div>

              {/* Box 2 */}
              <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {isUrdu ? 'طلبہ حفظِ قرآن کفالت' : 'Hifz Student Sponsorship'}
                </h4>
                <p className="text-xs text-stone-400">
                  {isUrdu
                    ? 'مستحق حفاظ و طلبہ کرام کی کتب، یونیفارم اور اساتذہ کرام کے اعزازی وظائف'
                    : 'Providing tuition, holy books, and stipends for deserving Quran memorization students.'}
                </p>
              </div>

              {/* Box 3 */}
              <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {isUrdu ? 'راشن و فلاحی امداد' : 'Needy Family Ration'}
                </h4>
                <p className="text-xs text-stone-400">
                  {isUrdu
                    ? 'سیکٹر 5-اے/1 نارتھ کراچی کے سفید پوش اور بیوہ خاندانوں میں راشن کی تقسیم'
                    : 'Monthly dry food packages and medical relief for verified vulnerable local families.'}
                </p>
              </div>

              {/* Box 4 */}
              <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                  <Building className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {isUrdu ? 'مسجد مرمت و وضو خانہ' : 'Maintenance & Hygiene'}
                </h4>
                <p className="text-xs text-stone-400">
                  {isUrdu
                    ? 'مسجد کے فرش، قالین، وضو خانے کی روزانہ صفائی اور ساؤنڈ سسٹم کی نگہداشت'
                    : 'Sanitation supplies, acoustics maintenance, marble wash upkeep, and filtration.'}
                </p>
              </div>
            </div>

            {/* In-Person Cash Desk Note */}
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
              <div>
                <strong className="text-amber-300 block mb-0.5">
                  {isUrdu ? 'دستی نقد عطیہ برائے مسجد' : 'In-Person Cash Desk'}
                </strong>
                <span>
                  {isUrdu
                    ? 'مسجد کے دفتر سے باضابطہ کمپیوٹرائزڈ رسید حاصل کریں'
                    : 'Visit the mosque office after any prayer to receive an official stamped receipt.'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* MOSQUE COMMITTEE & IMAMS DIRECTORY */}
        <div id="committee" className="pt-8 border-t border-stone-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {isUrdu ? 'انتظامی کمیٹی و ائمہ کرام' : 'Mosque Leadership & Administration'}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {isUrdu
                ? 'جامع مسجد عثمان غنی (رضی اللہ عنہ) سیکٹر 5-اے/1 کے ائمہ و منتظمین'
                : 'Dedicated scholars, teachers, and trustees serving the mosque and Sector 5-A/1 community.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMITTEE_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 hover:border-emerald-700/60 transition-all flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-amber-300 shrink-0 font-bold font-arabic">
                  {member.nameUr ? member.nameUr.charAt(0) : 'ع'}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">
                    {isUrdu ? member.nameUr : member.nameEn}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-400">
                    {isUrdu ? member.roleUr : member.roleEn}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                    {isUrdu ? member.qualificationUr : member.qualificationEn}
                  </p>
                  {member.contact && (
                    <a
                      href={`tel:${member.contact}`}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-300/90 font-mono mt-1 hover:underline"
                    >
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{member.contact}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
