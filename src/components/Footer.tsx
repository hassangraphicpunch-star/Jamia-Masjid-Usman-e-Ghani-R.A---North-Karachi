import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Heart,
  Clock,
  ExternalLink,
  ChevronUp,
} from 'lucide-react';
import { Language } from '../types';
import { MOSQUE_INFO } from '../data/mockData';

interface FooterProps {
  language: Language;
  onNavigate: (sectionId: string) => void;
  onOpenAdminModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate, onOpenAdminModal }) => {
  const isUrdu = language === 'ur';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 relative">
      {/* Top green accent strip */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-teal-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Mosque Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-500/50 shadow-md shadow-emerald-950/60 bg-stone-900 shrink-0">
                <img
                  src="/images/masjid_logo.jpg"
                  alt="Jamia Masjid Usman-e-Ghani Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {isUrdu ? MOSQUE_INFO.nameUr : MOSQUE_INFO.nameEn}
                </h3>
                <span className="text-[11px] text-amber-300 font-semibold">
                  ST-11 Sector 5-A/1 North Karachi
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              {isUrdu
                ? 'مرکزی جامع مسجد عثمانِ غنی رضی اللہ عنہ، نارتھ کراچی۔ پنج وقتہ باجماعت نماز، اسلامی کتب خانہ اور فلاحی خدمات کا مرکز۔'
                : 'Center for Islamic worship, authentic Islamic library research, and welfare activities for the residents of Sector 5-A/1 North Karachi, Sindh.'}
            </p>

            <div className="pt-1 text-xs text-emerald-400 flex items-center gap-1.5">
              <span>Established {MOSQUE_INFO.establishedYear}</span>
              <span>•</span>
              <span>Capacity {MOSQUE_INFO.capacity}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-amber-300">
              {isUrdu ? 'اہم روابط' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('prayer-times')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isUrdu ? 'اوقاتِ نماز (حنفی)' : 'Prayer Timings (Hanafi)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('announcements')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isUrdu ? 'اعلانات و خطبہ جمعہ' : 'Notices & Friday Khutbah'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('qibla-location')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isUrdu ? 'گوگل نقشہ و قبلہ رخ' : 'Google Map & Qibla'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('facilities')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isUrdu ? 'سہولیات و اسلامی کتب خانہ' : 'Facilities & Islamic Library'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wisdom-tasbih')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isUrdu ? 'ڈیجیٹل تسبیح و اذکار' : 'Digital Tasbih & Hadith'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('donate')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isUrdu ? 'مسجد فنڈ اکاؤنٹ' : 'Bank & EasyPaisa Donation'}
                </button>
              </li>
              {onOpenAdminModal && (
                <li className="pt-1">
                  <button
                    onClick={onOpenAdminModal}
                    className="text-amber-400/90 hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
                  >
                    <span>⚙️</span>
                    <span>{isUrdu ? 'انتظامیہ پورٹل (اوقات میں ترمیم)' : 'Admin Portal (Edit Namaz Times)'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Contact & Helplines */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-amber-300">
              {isUrdu ? 'رابطہ و ایمرجنسی' : 'Contact & Helpline'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{MOSQUE_INFO.addressEn}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`tel:${MOSQUE_INFO.phone}`} className="hover:text-white font-mono">
                  {MOSQUE_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">WA:</span>
                <a
                  href={`https://wa.me/${MOSQUE_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-mono"
                >
                  {MOSQUE_INFO.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{MOSQUE_INFO.email}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Islamic Hadith Tribute */}
          <div className="space-y-3 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <h4 className="font-bold text-amber-300 text-xs uppercase">
              {isUrdu ? 'حدیثِ رسول ﷺ' : 'Saying of Prophet Muhammad ﷺ'}
            </h4>
            <p className="font-arabic text-sm text-stone-200 leading-relaxed text-right">
              خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
            </p>
            <p className="text-[11px] text-stone-400 italic">
              {isUrdu
                ? '“تم میں سے بہترین وہ ہے جس نے قرآن سیکھا اور سکھایا۔” [صحیح بخاری]'
                : '“The best among you are those who learn the Quran and teach it.” [Sahih al-Bukhari]'}
            </p>
            <div className="pt-2 text-[10px] text-emerald-400 font-medium border-t border-stone-800">
              {isUrdu ? 'جامعہ دارالعلوم کراچی نصاب' : 'Affiliated with Jamia Darul Uloom Karachi syllabus'}
            </div>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Scroll to Top */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            © {new Date().getFullYear()} {MOSQUE_INFO.nameEn}. ST-11 Sector 5-A/1 North Karachi. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-stone-400">
              Built with devotion for the North Karachi community
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
              title="Back to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
