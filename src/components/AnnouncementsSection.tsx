import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  User,
  Search,
  Tag,
  AlertTriangle,
  ChevronRight,
  Share2,
  X,
  ExternalLink,
  BookOpen,
  Heart,
  Sun,
  ShieldCheck,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Language, AnnouncementItem, AdminPrayerSettings, DarseQuranProgram } from '../types';
import { ANNOUNCEMENTS } from '../data/mockData';
import { DEFAULT_DARS_PROGRAMS } from '../services/prayerService';

interface AnnouncementsSectionProps {
  language: Language;
  adminSettings?: AdminPrayerSettings;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  language,
  adminSettings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<AnnouncementItem | null>(null);
  const [activeDarsModal, setActiveDarsModal] = useState<DarseQuranProgram | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isUrdu = language === 'ur';

  // Extract custom or default announcements and Dars programs
  const allAnnouncements = adminSettings?.customAnnouncements && adminSettings.customAnnouncements.length > 0
    ? adminSettings.customAnnouncements
    : ANNOUNCEMENTS;

  const darsPrograms = (adminSettings?.darsPrograms && adminSettings.darsPrograms.length > 0
    ? adminSettings.darsPrograms
    : DEFAULT_DARS_PROGRAMS
  ).filter((d) => d.active);

  const categories = [
    { id: 'all', labelEn: 'All Notices', labelUr: 'تمام اعلانات' },
    { id: 'juma', labelEn: 'Juma Khutbah', labelUr: 'خطباتِ جمعہ' },
    { id: 'education', labelEn: 'Madrasah Admissions', labelUr: 'تعلیم و حفظ' },
    { id: 'construction', labelEn: 'Solar & Projects', labelUr: 'مسجد منصوبے' },
    { id: 'welfare', labelEn: 'Community Welfare', labelUr: 'فلاحی کیمپ' },
    { id: 'janazah', labelEn: 'Janazah Services', labelUr: 'جنازہ سروس' },
  ];

  const filteredAnnouncements = allAnnouncements.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.titleEn.toLowerCase().includes(q) ||
      item.titleUr.includes(q) ||
      item.contentEn.toLowerCase().includes(q) ||
      item.contentUr.includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleShare = (item: AnnouncementItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `📢 ${item.titleEn} (${item.titleUr})\n🕌 Jamia Masjid Usman-e-Ghani (R.A), ST-11 Sector 5-A/1 North Karachi\n📅 ${item.date} (${item.hijriDate})\n\n${item.contentEn}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  const handleShareDars = (dars: DarseQuranProgram, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `📖 ${dars.titleUr} (${dars.titleEn})\n👤 ${dars.speakerUr} (${dars.speakerEn})\n⏰ ${dars.timingUr}\n🕌 جامع مسجد عثمانِ غنی (رضی اللہ عنہ)، ST-11 سیکٹر 5-A/1 نارتھ کراچی\n\n${dars.topicUr}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(dars.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'juma':
        return <User className="w-4 h-4 text-amber-300" />;
      case 'education':
        return <BookOpen className="w-4 h-4 text-sky-400" />;
      case 'construction':
        return <Sun className="w-4 h-4 text-emerald-400" />;
      case 'welfare':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'janazah':
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section
      id="announcements"
      className="py-16 bg-stone-950 border-b border-stone-800/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION 1: PROMINENT DARS-E-QURAN & ISLAMIC DISCOURSE SPOTLIGHT */}
        {darsPrograms.length > 0 && (
          <div className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'درسِ قرآن، حدیث و بیانات' : 'Dars-e-Quran & Spiritual Lectures'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {isUrdu ? (
                    <span className="font-urdu text-3xl text-amber-300">
                      روزانہ و ہفتہ وار دروسِ قرآن و فہمِ دین
                    </span>
                  ) : (
                    <span>Regular Dars-e-Quran & Weekly Programs</span>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
                  {isUrdu
                    ? 'حضرت مولانا یونس منصوری و ائمہ مسجد کی زیرِ نگرانی روزانہ بعد فجر و ہفتہ وار مجالس'
                    : 'Daily Tafseer-ul-Quran after Fajr and weekly Hadith sessions led by respected scholars.'}
                </p>
              </div>
            </div>

            {/* Dars Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {darsPrograms.map((dars) => (
                <div
                  key={dars.id}
                  id={`dars-card-${dars.id}`}
                  onClick={() => setActiveDarsModal(dars)}
                  className="rounded-2xl bg-gradient-to-b from-stone-900 via-stone-900/90 to-stone-950 border border-amber-700/40 hover:border-amber-500/80 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden shadow-xl shadow-amber-950/20 flex flex-col justify-between group"
                >
                  <div>
                    {/* Poster Photo Header */}
                    {dars.imageUrl && (
                      <div className="relative aspect-video w-full overflow-hidden bg-stone-950">
                        <img
                          src={dars.imageUrl}
                          alt={dars.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-md bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                            {isUrdu ? dars.frequencyUr : dars.frequencyEn}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-amber-300 text-[10px] font-mono border border-amber-500/40">
                            Masjid ST-11
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      {/* Dars Title */}
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2 line-clamp-2">
                        {isUrdu ? dars.titleUr : dars.titleEn}
                      </h3>

                      {/* Speaker & Timing */}
                      <div className="space-y-2 mb-3 bg-stone-950/70 p-3 rounded-xl border border-stone-800">
                        <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                          <User className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="line-clamp-1">{isUrdu ? dars.speakerUr : dars.speakerEn}</span>
                        </div>
                        <div className="flex items-center gap-2 text-stone-300 text-xs font-mono">
                          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{isUrdu ? dars.timingUr : dars.timingEn}</span>
                        </div>
                        <div className="flex items-center gap-2 text-stone-400 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                          <span>{isUrdu ? dars.locationUr : dars.locationEn}</span>
                        </div>
                      </div>

                      {/* Topic Preview */}
                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {isUrdu ? dars.topicUr : dars.topicEn}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 pt-3 mx-5 border-t border-stone-800/80 flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      {isUrdu ? 'تفصیلات دیکھیں' : 'View Details'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleShareDars(dars, e)}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                      title="Share Dars"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: COMMUNITY NOTICE BOARD & ANNOUNCEMENTS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pt-4 border-t border-stone-800/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'جامع مسجد کا نوٹس بورڈ' : 'Notice Board & Updates'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              {isUrdu ? (
                <span className="font-urdu text-3xl sm:text-4xl text-amber-300">
                  تازہ ترین اعلانات و ضروری پیغامات
                </span>
              ) : (
                <span>Community Announcements</span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
              {isUrdu
                ? 'سیکٹر 5-اے/1 نارتھ کراچی کے باسیوں کے لیے خطباتِ جمعہ، تعلیمی داخلوں اور فلاحی سرگرمیوں کی تازہ معلومات'
                : 'Stay informed on upcoming Friday topics, Quran academy admissions, community welfare camps, and development projects.'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? 'اعلانات تلاش کریں...' : 'Search notices...'}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-700/80 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-400'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <span>{isUrdu ? cat.labelUr : cat.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Announcements List Grid */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-stone-900/40 border border-stone-800">
            <Bell className="w-10 h-10 text-stone-600 mx-auto mb-2" />
            <p className="text-stone-400 text-sm">
              {isUrdu ? 'کوئی اعلان نہیں ملا۔' : 'No announcements found matching your criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                id={`announcement-card-${item.id}`}
                onClick={() => setActiveModalItem(item)}
                className={`rounded-2xl bg-gradient-to-b from-stone-900/90 to-stone-900/40 border transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group shadow-lg overflow-hidden ${
                  item.important
                    ? 'border-amber-500/50 shadow-amber-950/20'
                    : 'border-stone-800 hover:border-emerald-700/60'
                }`}
              >
                <div>
                  {/* Card Poster Image if available */}
                  {item.imageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden bg-stone-950">
                      <img
                        src={item.imageUrl}
                        alt={item.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Top Badges & Meta */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 rounded-lg bg-stone-800 border border-stone-700">
                          {getCategoryIcon(item.category)}
                        </span>
                        {item.badgeEn && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                            {isUrdu ? item.badgeUr : item.badgeEn}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-stone-400 font-mono">
                        {item.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 line-clamp-2">
                      {isUrdu ? item.titleUr : item.titleEn}
                    </h3>

                    {/* Speaker / Time if available */}
                    {(item.speakerEn || item.time) && (
                      <div className="space-y-1 mb-3 text-xs text-stone-300 bg-stone-950/60 p-2 rounded-lg border border-stone-800/80">
                        {item.speakerEn && (
                          <p className="flex items-center gap-1.5 text-amber-200/90 font-medium">
                            <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="line-clamp-1">
                              {isUrdu ? item.speakerUr : item.speakerEn}
                            </span>
                          </p>
                        )}
                        {item.time && (
                          <p className="flex items-center gap-1.5 text-stone-400">
                            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{item.time}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Description excerpt */}
                    <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed mb-4">
                      {isUrdu ? item.contentUr : item.contentEn}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-3 mx-5 border-t border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {isUrdu ? 'تفصیلات دیکھیں' : 'Read Full Notice'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                  <button
                    onClick={(e) => handleShare(item, e)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                    title="Share notice"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* DARS-E-QURAN DETAIL MODAL */}
      {activeDarsModal && (
        <div
          id="dars-detail-modal"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-stone-900 border border-amber-600/60 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {activeDarsModal.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={activeDarsModal.imageUrl}
                  alt={activeDarsModal.titleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                <button
                  onClick={() => setActiveDarsModal(null)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-black/70 hover:bg-black text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                  {isUrdu ? activeDarsModal.frequencyUr : activeDarsModal.frequencyEn}
                </span>
                <span className="text-xs text-stone-400">
                  Jamia Masjid Usman-e-Ghani
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {isUrdu ? activeDarsModal.titleUr : activeDarsModal.titleEn}
              </h3>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>{isUrdu ? activeDarsModal.speakerUr : activeDarsModal.speakerEn}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 font-mono">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{isUrdu ? activeDarsModal.timingUr : activeDarsModal.timingEn}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <MapPin className="w-4 h-4 text-stone-400" />
                  <span>{isUrdu ? activeDarsModal.locationUr : activeDarsModal.locationEn}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                  {isUrdu ? 'موضوع و تفصیلات:' : 'Topic & Subject:'}
                </h4>
                <p className="text-sm text-stone-200 leading-relaxed bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80">
                  {isUrdu ? activeDarsModal.topicUr : activeDarsModal.topicEn}
                </p>
              </div>

              {activeDarsModal.notesUr && (
                <p className="text-xs text-amber-200/80 italic">
                  ℹ️ {isUrdu ? activeDarsModal.notesUr : activeDarsModal.notesEn}
                </p>
              )}
            </div>

            <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => handleShareDars(activeDarsModal, e)}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>{copiedId === activeDarsModal.id ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'واٹس ایپ پر شیئر کریں' : 'Share Dars')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDarsModal(null)}
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors"
              >
                {isUrdu ? 'بند کریں' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT DETAIL MODAL */}
      {activeModalItem && (
        <div
          id="announcement-detail-modal"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-stone-900 border border-emerald-700/60 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {activeModalItem.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={activeModalItem.imageUrl}
                  alt={activeModalItem.titleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
              </div>
            )}

            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-stone-800 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                    {isUrdu ? activeModalItem.badgeUr : activeModalItem.badgeEn}
                  </span>
                  <span className="text-xs text-stone-400">
                    {activeModalItem.hijriDate}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {isUrdu ? activeModalItem.titleUr : activeModalItem.titleEn}
                </h3>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Speaker / Time info */}
              {(activeModalItem.speakerEn || activeModalItem.time) && (
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2 text-xs sm:text-sm">
                  {activeModalItem.speakerEn && (
                    <div className="flex items-center gap-2 text-amber-300 font-semibold">
                      <User className="w-4 h-4" />
                      <span>{isUrdu ? activeModalItem.speakerUr : activeModalItem.speakerEn}</span>
                    </div>
                  )}
                  {activeModalItem.time && (
                    <div className="flex items-center gap-2 text-stone-300 font-mono">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>{activeModalItem.time}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="text-sm text-stone-200 leading-relaxed whitespace-pre-line">
                {isUrdu ? activeModalItem.contentUr : activeModalItem.contentEn}
              </div>

              {/* Both languages reference */}
              <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 text-xs text-stone-400">
                <span className="block font-bold text-stone-300 mb-1">
                  {isUrdu ? 'English Summary:' : 'خلاصہ برائے اردو دان:'}
                </span>
                <p className="italic">
                  {isUrdu ? activeModalItem.contentEn : activeModalItem.contentUr}
                </p>
              </div>

              {/* Location Reference */}
              <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
                <span>ST-11 Sector 5-A/1 North Karachi</span>
                <span className="font-semibold text-emerald-400">
                  جامع مسجد عثمانِ غنی (رضی اللہ عنہ)
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
              <button
                onClick={(e) => handleShare(activeModalItem, e)}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>{copiedId === activeModalItem.id ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'دوستوں سے شیئر کریں' : 'Share Notice')}</span>
              </button>

              <button
                onClick={() => setActiveModalItem(null)}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                {isUrdu ? 'بند کریں' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
