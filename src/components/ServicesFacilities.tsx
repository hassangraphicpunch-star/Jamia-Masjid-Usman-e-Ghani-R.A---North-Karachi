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
  ArrowRight,
  Shield,
  X,
  Send,
} from 'lucide-react';
import { Language, FacilityItem } from '../types';
import { FACILITIES, MOSQUE_INFO } from '../data/mockData';

interface ServicesFacilitiesProps {
  language: Language;
}

export const ServicesFacilities: React.FC<ServicesFacilitiesProps> = ({
  language,
}) => {
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [submittedForm, setSubmittedForm] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    course: 'hifz',
    shift: 'evening',
    notes: '',
  });

  const isUrdu = language === 'ur';

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedForm(true);
    setTimeout(() => {
      setSubmittedForm(false);
      setAdmissionModalOpen(false);
      setFormData({
        studentName: '',
        parentName: '',
        phone: '',
        course: 'hifz',
        shift: 'evening',
        notes: '',
      });
    }, 2500);
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
            <span>{isUrdu ? 'جامع مسجد کے اہم شعبہ جات' : 'Mosque Facilities & Services'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isUrdu ? (
              <span className="font-urdu text-3xl sm:text-5xl text-amber-300">
                خدمات، سہولیات و دارالقرآن اکیڈمی
              </span>
            ) : (
              <span>Community Services & Facilities</span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 mt-2">
            {isUrdu
              ? 'نمازیوں اور نارتھ کراچی کے باسیوں کے لیے کشادہ ہالز، دارالقرآن، وضو خانہ، نمازِ جنازہ کا اہتمام اور 10 KV سولر پاور'
              : 'Serving the Sector 5-A/1 community with spacious worship spaces, certified Quranic education, clean wudu facilities, and 10 KV solar power backup.'}
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

              {/* Action Button for specific services */}
              {facility.id === 'fac-2' ? (
                <button
                  id="btn-apply-madrasah"
                  onClick={() => setAdmissionModalOpen(true)}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 fill-current" />
                  <span>{isUrdu ? 'داخلہ فارم پر کریں' : 'Apply for Madrasah Admission'}</span>
                </button>
              ) : (
                <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>{MOSQUE_INFO.addressEn.split(',')[0]}</span>
                  <span className="text-emerald-400 font-semibold">
                    {isUrdu ? 'سہولت دستیاب ہے' : 'Active Facility'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Emergency & Janazah Contact Help Strip */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-stone-900 via-emerald-950/60 to-stone-900 border border-emerald-700/40 p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {isUrdu ? 'نمازِ جنازہ کا اہتمام و رابطہ' : 'Janazah Prayer Arrangement & Mosque Contact'}
              </h4>
              <p className="text-xs text-stone-400">
                {isUrdu
                  ? 'نمازِ جنازہ کے وقت اور اعلان کے لیے نگران مسجد یا دفتر سے فوری رابطہ کریں'
                  : 'For Janazah prayer scheduling, announcements, and coordination in Sector 5-A/1'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${MOSQUE_INFO.phone}`}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-bold font-mono flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{MOSQUE_INFO.phone}</span>
            </a>

            <a
              href={`https://wa.me/${MOSQUE_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50"
            >
              <span>{isUrdu ? 'واٹس ایپ رابطہ' : 'WhatsApp Desk'}</span>
            </a>
          </div>
        </div>

      </div>

      {/* MADRASAH ADMISSION FORM MODAL */}
      {admissionModalOpen && (
        <div
          id="madrasah-admission-modal"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-stone-900 border border-amber-500/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-950 to-stone-900 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {isUrdu ? 'مدرسہ عثمان غنی - آن لائن رجسٹریشن' : 'Madrasah Usman-e-Ghani Online Admission'}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Hifz-ul-Quran & Nazra Tajweed Session 2026
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAdmissionModalOpen(false)}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            {submittedForm ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-900/60 border border-emerald-500 text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">
                  {isUrdu ? 'درخواست کامیابی سے موصول ہو گئی!' : 'Application Submitted Successfully!'}
                </h4>
                <p className="text-xs text-stone-300">
                  {isUrdu
                    ? 'مسجد کا شعبہ تعلیم جلد آپ سے رابطہ کرے گا اور انٹرویو کا وقت طے ہوگا۔ جزاکم اللہ۔'
                    : 'The Maktab administration will contact you shortly to schedule an introductory Tajweed assessment.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    {isUrdu ? 'طالب علم / طالبہ کا نام' : 'Student Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder={isUrdu ? 'نام درج کریں...' : 'Enter student name...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    {isUrdu ? 'والد / سرپرست کا نام' : 'Father / Guardian Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder={isUrdu ? 'والد کا نام...' : 'Father / Guardian name...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    {isUrdu ? 'واٹس ایپ یا موبائل نمبر' : 'WhatsApp / Mobile Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0300-XXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      {isUrdu ? 'شعبہ منتخب کریں' : 'Program'}
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="hifz">{isUrdu ? 'حفظ القرآن الکریم' : 'Hifz-ul-Quran'}</option>
                      <option value="nazra">{isUrdu ? 'ناظرہ مع تجوید' : 'Nazra with Tajweed'}</option>
                      <option value="qaida">{isUrdu ? 'نورانی قاعدہ و بنیادی دینیات' : 'Noorani Qaida & Basics'}</option>
                      <option value="adults">{isUrdu ? 'بالغان تجوید کلاس' : 'Adult Quran Class'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      {isUrdu ? 'اوقات / شفٹ' : 'Shift'}
                    </label>
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="morning">{isUrdu ? 'صبح (8:00 تا 11:30)' : 'Morning (8:00 - 11:30 AM)'}</option>
                      <option value="evening">{isUrdu ? 'شام (4:30 تا 7:30)' : 'Evening (4:30 - 7:30 PM)'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    {isUrdu ? 'علاقہ / ایڈریس نارتھ کراچی' : 'Address / Sector in North Karachi'}
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Sector 5-A/1 or nearby area"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'درخواست جمع کروائیں' : 'Submit Admission Application'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
