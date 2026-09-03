import React, { useState, useMemo } from 'react';
import {
  Play,
  Tv,
  Radio,
  Share2,
  Check,
  Video,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Film,
  Layers,
} from 'lucide-react';
import { Language, AdminPrayerSettings, MosqueVideoItem } from '../types';
import { getEmbedVideoUrl } from '../services/prayerService';

interface MosqueVideoSectionProps {
  language: Language;
  adminSettings: AdminPrayerSettings;
  onOpenAdminModal?: () => void;
}

export const MosqueVideoSection: React.FC<MosqueVideoSectionProps> = ({
  language,
  adminSettings,
  onOpenAdminModal,
}) => {
  const isUrdu = language === 'ur';
  const mediaSettings = adminSettings.mediaSettings;

  // If video section is hidden by admin setting, do not render
  if (mediaSettings?.showVideoSection === false) {
    return null;
  }

  const allVideos: MosqueVideoItem[] = useMemo(() => {
    const list = mediaSettings?.videoList && mediaSettings.videoList.length > 0
      ? mediaSettings.videoList
      : [];

    // Ensure featured video is represented or in the list
    if (mediaSettings?.featuredVideoUrl) {
      const exists = list.some((v) => v.videoUrl === mediaSettings.featuredVideoUrl);
      if (!exists) {
        const featuredItem: MosqueVideoItem = {
          id: 'featured-item',
          titleEn: mediaSettings.featuredVideoTitleEn || 'Featured Mosque Video',
          titleUr: mediaSettings.featuredVideoTitleUr || 'جامع مسجد عثمانِ غنی کا خصوصی خطاب',
          speakerEn: mediaSettings.featuredVideoSpeakerEn || 'Maulana Younus Mansori',
          speakerUr: mediaSettings.featuredVideoSpeakerUr || 'حضرت مولانا یونس منصوری صاحب',
          descriptionEn: mediaSettings.featuredVideoDescriptionEn,
          descriptionUr: mediaSettings.featuredVideoDescriptionUr,
          category: mediaSettings.featuredVideoCategory || 'juma',
          videoUrl: mediaSettings.featuredVideoUrl,
          isLive: mediaSettings.isLiveStream,
          date: 'Featured',
        };
        return [featuredItem, ...list];
      }
    }
    return list;
  }, [mediaSettings]);

  const [selectedVideo, setSelectedVideo] = useState<MosqueVideoItem | null>(() => {
    if (allVideos.length > 0) return allVideos[0];
    return null;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Sync selected video if list changes or initial state was null
  React.useEffect(() => {
    if (allVideos.length > 0 && !selectedVideo) {
      setSelectedVideo(allVideos[0]);
    }
  }, [allVideos, selectedVideo]);

  const currentVideo = selectedVideo || allVideos[0];

  const filteredVideos = useMemo(() => {
    if (activeCategory === 'all') return allVideos;
    return allVideos.filter((v) => v.category === activeCategory);
  }, [allVideos, activeCategory]);

  const embedInfo = useMemo(() => {
    if (!currentVideo?.videoUrl) {
      return { embedUrl: '', isDirectVideo: false };
    }
    return getEmbedVideoUrl(currentVideo.videoUrl);
  }, [currentVideo]);

  const handleShare = async () => {
    if (!currentVideo?.videoUrl) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentVideo.videoUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const categories = [
    { id: 'all', labelEn: 'All Videos', labelUr: 'تمام ویڈیوز' },
    { id: 'juma', labelEn: 'Friday Sermons', labelUr: 'جمعۃ المبارک کے بیانات' },
    { id: 'dars', labelEn: 'Dars-e-Quran', labelUr: 'درسِ قرآن و حدیث' },
    { id: 'tilawat', labelEn: 'Quran Recitation', labelUr: 'تلاوتِ کلام پاک' },
    { id: 'live', labelEn: 'Live Broadcast', labelUr: 'لائیو نشریات' },
    { id: 'tour', labelEn: 'Mosque Profile', labelUr: 'مسجد تعارف و خدمات' },
  ];

  return (
    <section
      id="mosque-videos"
      className="py-14 sm:py-18 bg-stone-900/50 border-t border-stone-800 relative overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold mb-3">
              <Tv className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isUrdu
                  ? 'جامع مسجد عثمانِ غنی ویڈیو پورٹل و لائیو بیانات'
                  : 'Mosque Video Portal & Islamic Sermons'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isUrdu
                ? 'بیانات، درسِ قرآن و اسلامی ویڈیو نشریات'
                : 'Islamic Lectures, Friday Khutbah & Video Stream'}
            </h2>
            <p className="text-sm text-stone-400 mt-1.5 max-w-2xl">
              {isUrdu
                ? 'جامع مسجد عثمانِ غنی نارتھ کراچی کے خطیب حضرت مولانا یونس منصوری کے جمعہ بیانات، روزانہ درسِ قرآن اور مسجد کی خدمات کی ویڈیو گیلری۔'
                : 'Watch Friday Khutbahs by Maulana Younus Mansori, daily Tafseer series, and Islamic educational videos from North Karachi.'}
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-stone-950 font-bold shadow-md shadow-emerald-900/30'
                      : 'bg-stone-950/80 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {isUrdu ? cat.labelUr : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Video Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Active Video Player Screen (8 Cols on Desktop) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden shadow-2xl relative">
              
              {/* Top Live Bar if live stream */}
              {(currentVideo?.isLive || mediaSettings?.isLiveStream) && (
                <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-800 px-4 py-1.5 flex items-center justify-between text-white text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span>{isUrdu ? '🔴 براہِ راست نشریات (LIVE BROADCAST)' : '🔴 LIVE BROADCAST STREAM'}</span>
                  </div>
                  <span className="text-[11px] font-normal opacity-90">
                    {isUrdu ? 'جامع مسجد عثمانِ غنی' : 'Jamia Masjid Usman-e-Ghani'}
                  </span>
                </div>
              )}

              {/* 16:9 Aspect Ratio Video Frame */}
              <div className="relative aspect-video w-full bg-black">
                {embedInfo.embedUrl ? (
                  embedInfo.isDirectVideo ? (
                    <video
                      src={embedInfo.embedUrl}
                      controls
                      autoPlay={false}
                      className="w-full h-full object-cover"
                      poster={currentVideo?.thumbnailUrl}
                    />
                  ) : (
                    <iframe
                      src={embedInfo.embedUrl}
                      title={isUrdu ? currentVideo?.titleUr || 'Video' : currentVideo?.titleEn || 'Video'}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-400">
                    <Film className="w-12 h-12 text-stone-600 mb-2" />
                    <p className="text-sm font-medium text-stone-300">
                      {isUrdu ? 'کوئی ویڈیو لنک درج نہیں ہے' : 'No video URL configured yet'}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      {isUrdu ? 'ایڈمن پورٹل میں یوٹیوب یا ویڈیو لنک شامل کریں' : 'Add YouTube or video URL in Admin Portal'}
                    </p>
                  </div>
                )}
              </div>

              {/* Video Details & Meta Bar */}
              {currentVideo && (
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-3.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {currentVideo.category}
                        </span>
                        {currentVideo.duration && (
                          <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-stone-500" />
                            {currentVideo.duration}
                          </span>
                        )}
                        {currentVideo.date && (
                          <span className="text-[11px] text-stone-500">
                            • {currentVideo.date}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                        {isUrdu ? currentVideo.titleUr : currentVideo.titleEn}
                      </h3>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 flex items-center gap-1.5 transition-colors"
                        title="Share Video Link"
                      >
                        {copiedUrl ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">{isUrdu ? 'کاپی ہو گیا' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-stone-400" />
                            <span>{isUrdu ? 'شیئر کریں' : 'Share'}</span>
                          </>
                        )}
                      </button>

                      {currentVideo.videoUrl && (
                        <a
                          href={currentVideo.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                          <span>{isUrdu ? 'یوٹیوب پر دیکھیں' : 'YouTube'}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Speaker and Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {(currentVideo.speakerUr || currentVideo.speakerEn) && (
                      <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800/80">
                        <span className="text-[10px] text-stone-400 block uppercase">
                          {isUrdu ? 'مقرر / خطیب' : 'Speaker / Scholar'}
                        </span>
                        <span className="font-bold text-amber-300">
                          {isUrdu ? currentVideo.speakerUr || currentVideo.speakerEn : currentVideo.speakerEn || currentVideo.speakerUr}
                        </span>
                      </div>
                    )}

                    <div className={`${(currentVideo.speakerUr || currentVideo.speakerEn) ? 'sm:col-span-2' : 'sm:col-span-3'} p-2.5 rounded-xl bg-stone-900/40 border border-stone-800/50 text-stone-300 text-xs`}>
                      <p>
                        {isUrdu
                          ? currentVideo.descriptionUr || 'جامع مسجد عثمانِ غنی نارتھ کراچی - دینی تعلیمات و بیانات کا سلسلہ'
                          : currentVideo.descriptionEn || 'Islamic education, Tafseer, and Friday sermons from Jamia Masjid Usman-e-Ghani.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Playlist & Additional Video Cards (4 Cols on Desktop) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">
                  {isUrdu ? 'ویڈیو فہرست (Playlist)' : 'Mosque Video Playlist'}
                </h4>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">
                {filteredVideos.length} {isUrdu ? 'ویڈیوز' : 'Videos'}
              </span>
            </div>

            {/* Scrollable playlist column */}
            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredVideos.map((video) => {
                const isCurrent = currentVideo?.id === video.id || currentVideo?.videoUrl === video.videoUrl;
                return (
                  <div
                    key={video.id}
                    onClick={() => {
                      setSelectedVideo(video);
                    }}
                    className={`group cursor-pointer p-2.5 rounded-xl border transition-all flex gap-3 items-start ${
                      isCurrent
                        ? 'bg-emerald-950/60 border-emerald-600/80 shadow-md shadow-emerald-950/40'
                        : 'bg-stone-950/80 hover:bg-stone-900 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {/* Video Thumbnail Box */}
                    <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden bg-stone-900 shrink-0 border border-stone-800">
                      <img
                        src={video.thumbnailUrl || '/images/usman_ghani_masjid_interior.jpg'}
                        alt={isUrdu ? video.titleUr : video.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/usman_ghani_masjid_interior.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isCurrent ? 'bg-emerald-500 text-stone-950' : 'bg-stone-950/70 text-white'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                      {video.duration && (
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-white text-[9px] font-mono font-medium">
                          {video.duration}
                        </span>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-stone-900 text-amber-300 border border-stone-800">
                          {video.category}
                        </span>
                        {video.isLive && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-red-600 text-white animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>
                      <h5
                        className={`text-xs font-bold line-clamp-2 leading-snug transition-colors ${
                          isCurrent ? 'text-emerald-300' : 'text-stone-200 group-hover:text-white'
                        }`}
                      >
                        {isUrdu ? video.titleUr : video.titleEn}
                      </h5>
                      {(video.speakerUr || video.speakerEn) && (
                        <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                          {isUrdu ? video.speakerUr || video.speakerEn : video.speakerEn || video.speakerUr}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Admin shortcut info strip */}
            {onOpenAdminModal && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  className="w-full p-2.5 rounded-xl bg-stone-950/90 hover:bg-stone-900 border border-stone-800 hover:border-emerald-800/80 text-stone-400 hover:text-stone-200 text-xs flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {isUrdu ? 'ایڈمن پورٹل سے نئی ویڈیو شامل یا تبدیل کریں' : 'Manage / Add videos via Admin Portal'}
                    </span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
