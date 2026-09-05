import React, { useState } from 'react';
import {
  Building2,
  BookOpen,
  Droplets,
  HeartHandshake,
  Library,
  SunMedium,
  CheckCircle2,
  Phone,
  MessageCircle,
  Copy,
  Check,
  MapPin,
} from 'lucide-react';
import { Language } from '../types';
import { FACILITIES, MOSQUE_INFO } from '../data/mockData';

interface ServicesFacilitiesProps {
  language: Language;
}

export const ServicesFacilities: React.FC<ServicesFacilitiesProps> = ({
  language,
}) => {
  const [copiedWA, setCopiedWA] = useState(false);

  const isUrdu = language === 'ur';
  const whatsappNumber = '03233469424';
  const whatsappLink = 'https://wa.me/923233469424';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-6 h-6 text-emerald-400" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-amber-300" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-sky-400" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-rose-400" />;
      case 'Library':
        return <Library className="w-6 h-6 text-indigo-400" />;
      case 'SunMedium':
        return <SunMedium className="w-6 h-6 text-yellow-400" />;
      default:
        return <Building2 className="w-6 h-6 text-emerald-400" />;
    }
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappNumber);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  return (
    <section
      id="facilities"
      className="py-16 bg-stone-950 border-b border-stone-800/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'جامع مسجد کے اہم شعبہ جات و خدمات' : 'Mosque Facilities & Services'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isUrdu ? (
              <span className="font-urdu text-3xl sm:text-5xl text-amber-300">
                خدمات، سہولیات و کمیونٹی فلاحی نظام
              </span>
            ) : (
              <span>Community Services & Facilities</span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 mt-2">
            {isUrdu
              ? 'اہل علاقہ اور نمازیوں کے لیے کشادہ ہالز، وضو خانہ، اسلامی کتب خانہ، فلٹریشن واٹر پلانٹ، نمازِ جنازہ کا اہتمام اور 10 KV سولر پاور'
              : 'Serving the Sector 5-A/1 North Karachi community with spacious prayer halls, clean wudu facilities, Islamic research library, RO water plant, and 10 KV solar energy setup.'}
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACILITIES.map((facility) => (
            <div
              key={facility.id}
              id={`facility-card-${facility.id}`}
              className="rounded-2xl p-6 bg-gradient-to-b from-stone-900/90 to-stone-900/40 border border-stone-800 hover:border-emerald-500/60 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Header Icon & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-700/80 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {getIcon(facility.icon)}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold">
                    {isUrdu ? facility.tagUr : facility.tagEn}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {isUrdu ? facility.titleUr : facility.titleEn}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-4">
                  {isUrdu ? facility.descriptionUr : facility.descriptionEn}
                </p>

                {/* Bullet Points */}
                <ul className="space-y-2 mb-4 pt-3 border-t border-stone-800/80">
                  {(isUrdu ? facility.detailsUr : facility.detailsEn).map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-stone-800/60 text-[11px] text-stone-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>ST-11 Sector 5-A/1</span>
                </span>
                <span className="text-emerald-400 font-semibold">
                  {isUrdu ? 'فعال و دستیاب' : 'Active Facility'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* OFFICIAL WHATSAPP & MOSQUE CONTACT BANNER */}
        <div
          id="mosque-whatsapp-contact-card"
          className="mt-10 rounded-2xl bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 border border-emerald-500/50 p-6 sm:p-7 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center lg:text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0 shadow-lg">
                <MessageCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {isUrdu ? 'مسجد عثمانِ غنی کا باضابطہ واٹس ایپ نمبر' : 'Official Mosque WhatsApp Desk'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[11px] font-bold">
                    {isUrdu ? '24/7 فعال' : 'Active 24/7'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  {isUrdu
                    ? 'نماز کے اوقات، اعلانات، نمازِ جنازہ، مسائل یا فلاحی تعاون کے لیے براہ راست واٹس ایپ پر رابطہ کریں:'
                    : 'For prayer schedules, notices, Janazah coordination, questions, or charitable donations, connect via WhatsApp:'}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 bg-stone-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-700/60 font-mono text-base font-black text-amber-300">
                  <span>{whatsappNumber}</span>
                  <span className="text-xs text-stone-400">({MOSQUE_INFO.phone})</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Chat on WhatsApp & Copy Number */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a
                id="btn-open-whatsapp-chat"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-950/60 transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{isUrdu ? 'واٹس ایپ پر میسج بھیجیں' : 'Chat on WhatsApp'}</span>
              </a>

              <button
                id="btn-copy-whatsapp-number"
                onClick={handleCopyWhatsApp}
                className="px-4 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
                title="Copy WhatsApp number"
              >
                {copiedWA ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">{isUrdu ? 'کاپی ہو گیا!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-400" />
                    <span>{isUrdu ? 'نمبر کاپی کریں' : 'Copy Number'}</span>
                  </>
                )}
              </button>

              <a
                id="btn-call-phone-masjid"
                href={`tel:${MOSQUE_INFO.phone}`}
                className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs transition-colors"
                title="Call Mosque Landline"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
