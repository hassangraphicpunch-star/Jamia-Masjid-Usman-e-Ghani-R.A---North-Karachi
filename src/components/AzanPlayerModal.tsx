import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Clock,
  Radio,
  Sparkles,
  CheckCircle2,
  X,
  Music,
  BookOpen,
  Headphones,
  Sliders,
  BellRing,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Language } from '../types';
import {
  azanAudioEngine,
  AZAN_VOICE_PRESETS,
  AzanPlaybackState,
  DUA_AFTER_AZAN,
} from '../services/azanAudioService';

interface AzanPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialPrayerId?: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | null;
}

export const AzanPlayerModal: React.FC<AzanPlayerModalProps> = ({
  isOpen,
  onClose,
  language,
  initialPrayerId,
}) => {
  const [playbackState, setPlaybackState] = useState<AzanPlaybackState>(() =>
    azanAudioEngine.getState()
  );
  const [activeTab, setActiveTab] = useState<'player' | 'dua' | 'voices'>('player');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const isUrdu = language === 'ur';

  useEffect(() => {
    const unsubscribe = azanAudioEngine.subscribe((state) => {
      setPlaybackState(state);
    });
    return unsubscribe;
  }, []);

  // If opened with initial prayer ID and not currently playing, start playing
  useEffect(() => {
    if (isOpen && initialPrayerId && !playbackState.isPlaying) {
      azanAudioEngine.playPrayerAzan(initialPrayerId);
    }
  }, [isOpen, initialPrayerId]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyDua = () => {
    navigator.clipboard.writeText(
      `${DUA_AFTER_AZAN.arabicText}\n\n${DUA_AFTER_AZAN.urduTranslation}\n\n${DUA_AFTER_AZAN.englishTranslation}`
    );
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const prayerQuickList: {
    id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    nameEn: string;
    nameUr: string;
    iconColor: string;
  }[] = [
    { id: 'fajr', nameEn: 'Fajr', nameUr: 'فجر', iconColor: 'text-sky-400' },
    { id: 'dhuhr', nameEn: 'Dhuhr', nameUr: 'ظہر', iconColor: 'text-emerald-400' },
    { id: 'asr', nameEn: 'Asr', nameUr: 'عصر', iconColor: 'text-amber-400' },
    { id: 'maghrib', nameEn: 'Maghrib', nameUr: 'مغرب', iconColor: 'text-rose-400' },
    { id: 'isha', nameEn: 'Isha', nameUr: 'عشاء', iconColor: 'text-indigo-400' },
  ];

  return (
    <div
      id="azan-player-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div
        id="azan-player-modal-card"
        className="relative w-full max-w-2xl bg-stone-900 border border-emerald-700/50 rounded-2xl shadow-2xl shadow-emerald-950/60 overflow-hidden text-stone-100 my-8"
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-stone-900 p-5 sm:p-6 border-b border-emerald-800/40 relative">
          <button
            id="azan-modal-close-btn"
            onClick={onClose}
            className="absolute top-5 ltr:right-5 rtl:left-5 w-9 h-9 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/50 border border-emerald-400/40">
              <Radio className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {isUrdu ? 'صدائے اذان و دعائے بعد اذان' : 'Proper Adhan MP3 Audio Player'}
                </h3>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {isUrdu ? 'جامع مسجد عثمانِ غنی' : 'Usman Ghani Mosque'}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-700/60">
                  Pure Voice MP3
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                {isUrdu
                  ? 'فجر کے لیے خصوصی اذان (TvQuran) اور ظہر، عصر، مغرب، عشاء و جمعہ کے لیے اصل صدائے اذان (azan1.mp3)'
                  : 'Authentic pure voice Adhan: Fajr (TvQuran) & Zuhar, Asr, Magrib, Isha, Jumma (azan1.mp3)'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-t border-emerald-800/30 pt-3">
            <button
              id="tab-azan-player"
              onClick={() => setActiveTab('player')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'player'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>{isUrdu ? 'اذان پلیئر (Player)' : 'Adhan Player'}</span>
            </button>

            <button
              id="tab-azan-dua"
              onClick={() => setActiveTab('dua')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'dua'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>{isUrdu ? 'دعائے بعد اذان' : 'Dua After Adhan'}</span>
            </button>

            <button
              id="tab-azan-voices"
              onClick={() => setActiveTab('voices')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'voices'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{isUrdu ? 'صدائے اذان منتخب کریں' : 'Adhan Audio Files'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* TAB 1: PLAYER */}
          {activeTab === 'player' && (
            <div className="space-y-6">
              {/* Currently Playing Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-stone-800/90 to-stone-900 border border-emerald-800/40 shadow-inner">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-start">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                        {playbackState.isPlaying
                          ? playbackState.isPaused
                            ? isUrdu
                              ? '⏸ اذان موقوف ہے (Paused)'
                              : '⏸ Adhan Paused'
                            : isUrdu
                            ? '● آوازِ اذان جاری ہے (Playing MP3)'
                            : '● Now Playing Authentic MP3'
                          : isUrdu
                          ? 'اذان منتخب کریں'
                          : 'Ready to Play Adhan'}
                      </span>
                      {playbackState.activePrayerNameUr && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700">
                          {isUrdu
                            ? playbackState.activePrayerNameUr
                            : playbackState.activePrayerNameEn}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-white">
                      {isUrdu
                        ? playbackState.currentTrack.nameUr
                        : playbackState.currentTrack.nameEn}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                      <span className="text-amber-200">
                        {isUrdu
                          ? playbackState.currentTrack.reciterUr
                          : playbackState.currentTrack.reciterEn}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400">
                        {isUrdu
                          ? playbackState.currentTrack.locationUr
                          : playbackState.currentTrack.locationEn}
                      </span>
                    </p>
                  </div>

                  {/* Sound Wave Animation */}
                  <div className="flex items-center gap-1.5 h-10 px-3 py-1 bg-stone-950/80 rounded-xl border border-stone-700">
                    {[6, 14, 24, 18, 28, 12, 22, 16, 26, 8, 20, 10].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          playbackState.isPlaying && !playbackState.isPaused
                            ? 'bg-gradient-to-t from-emerald-500 to-amber-300 animate-pulse'
                            : 'bg-stone-700 h-2'
                        }`}
                        style={{
                          height:
                            playbackState.isPlaying && !playbackState.isPaused
                              ? `${Math.max(6, ((h * ((i % 3) + 1)) % 32))}px`
                              : '4px',
                          animationDelay: `${i * 100}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Progress Bar & Interactive Scrubbing Slider */}
                <div className="mt-5 space-y-2">
                  <div className="relative flex items-center">
                    <input
                      id="azan-scrubber-slider"
                      type="range"
                      min="0"
                      max={playbackState.duration || 100}
                      step="1"
                      value={playbackState.currentTime}
                      onChange={(e) => azanAudioEngine.seek(parseFloat(e.target.value))}
                      className="w-full h-2.5 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none border border-stone-800"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400 px-0.5">
                    <span className="text-emerald-300 font-semibold">
                      {formatTime(playbackState.currentTime)}
                    </span>
                    <span className="text-stone-400">
                      {formatTime(playbackState.duration)}
                    </span>
                  </div>
                </div>

                {/* Audio Master Controls */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-700/50">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Play / Pause Toggle Button */}
                    <button
                      id="azan-toggle-play-btn"
                      onClick={() => {
                        if (playbackState.isPlaying) {
                          azanAudioEngine.togglePauseResume();
                        } else {
                          azanAudioEngine.playPrayerAzan(
                            playbackState.activePrayerId || 'fajr'
                          );
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-transform active:scale-95 text-xs sm:text-sm"
                    >
                      {playbackState.isPlaying && !playbackState.isPaused ? (
                        <>
                          <Pause className="w-4 h-4 fill-current text-amber-300" />
                          <span>{isUrdu ? 'وقفہ (Pause)' : 'Pause Adhan'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current text-amber-300" />
                          <span>
                            {playbackState.isPaused
                              ? isUrdu
                                ? 'جاری رکھیں (Resume)'
                                : 'Resume Adhan'
                              : isUrdu
                              ? 'ابھی اذان سنیں'
                              : 'Play Adhan MP3'}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Stop Button */}
                    {playbackState.isPlaying && (
                      <button
                        id="azan-stop-btn"
                        onClick={() => azanAudioEngine.stop()}
                        className="p-2.5 rounded-xl bg-stone-800 hover:bg-rose-950/80 border border-stone-700 hover:border-rose-700 text-stone-300 hover:text-rose-300 transition-colors"
                        title="Stop Adhan"
                      >
                        <Square className="w-4 h-4 fill-current" />
                      </button>
                    )}

                    {/* Replay Button */}
                    <button
                      id="azan-replay-btn"
                      onClick={() => {
                        azanAudioEngine.seek(0);
                        if (!playbackState.isPlaying) {
                          azanAudioEngine.playPrayerAzan(
                            playbackState.activePrayerId || 'fajr'
                          );
                        }
                      }}
                      className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 hover:text-white transition-colors"
                      title="Replay from Beginning"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Play Dua Button */}
                    <button
                      id="azan-play-dua-btn"
                      onClick={() => azanAudioEngine.playDuaAfterAzan()}
                      className="px-3.5 py-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-600/50 text-amber-200 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>{isUrdu ? 'دعائے بعد اذان' : 'Play Dua'}</span>
                    </button>
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2.5">
                    <button
                      id="azan-modal-mute-toggle"
                      onClick={() => azanAudioEngine.setMuted(!playbackState.isMuted)}
                      className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                      title={playbackState.isMuted ? 'Unmute' : 'Mute'}
                    >
                      {playbackState.isMuted || playbackState.volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                    <input
                      id="azan-volume-slider"
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={playbackState.isMuted ? 0 : playbackState.volume}
                      onChange={(e) =>
                        azanAudioEngine.setVolume(parseFloat(e.target.value))
                      }
                      className="w-20 sm:w-28 accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-stone-400 w-8 text-end">
                      {playbackState.isMuted ? '0%' : `${Math.round(playbackState.volume * 100)}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Select by Prayer Time (پنج وقتہ نماز اذان) */}
              <div>
                <h5 className="text-xs uppercase font-semibold text-stone-400 mb-2.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {isUrdu
                      ? 'پنج وقتہ نماز کی مخصوص اذان چلائیں (Play by Prayer)'
                      : 'Play Adhan For Specific Prayer Time'}
                  </span>
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
                  {prayerQuickList.map((p) => {
                    const isCurrentPlaying =
                      playbackState.isPlaying && playbackState.activePrayerId === p.id;
                    return (
                      <button
                        key={p.id}
                        id={`quick-play-${p.id}`}
                        onClick={() => azanAudioEngine.playPrayerAzan(p.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                          isCurrentPlaying
                            ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md shadow-emerald-950'
                            : 'bg-stone-800/60 hover:bg-stone-800 border-stone-700/60 text-stone-200 hover:border-emerald-700/50'
                        }`}
                      >
                        <span className={`text-base sm:text-lg font-bold ${p.iconColor}`}>
                          {isUrdu ? p.nameUr : p.nameEn}
                        </span>
                        <span className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                          {isCurrentPlaying ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <Radio className="w-3 h-3 animate-spin" />
                              {isUrdu ? 'جاری ہے' : 'Playing'}
                            </span>
                          ) : (
                            <span>{isUrdu ? 'اذان سنیں' : 'Play MP3'}</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Auto-Play Toggle Settings Box */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <BellRing className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-white">
                      {isUrdu
                        ? 'نماز کے اوقات پر خودکار اذان (Auto-play Adhan MP3)'
                        : 'Auto-play Adhan on Prayer Times'}
                    </h5>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {isUrdu
                        ? 'جب کاؤنٹ ڈاؤن ٹائمر 00:00:00 پر پہنچے گا تو خودکار طور پر اصل اذان MP3 بجے گی'
                        : 'Automatically plays authentic Adhan MP3 when the countdown timer reaches 00:00:00'}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="azan-auto-play-toggle"
                    type="checkbox"
                    checked={playbackState.autoPlayEnabled}
                    onChange={(e) => azanAudioEngine.setAutoPlay(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: DUA AFTER AZAN */}
          {activeTab === 'dua' && (
            <div className="space-y-5">
              {/* Arabic Dua Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-emerald-950/60 to-stone-900 border border-amber-600/40 text-center shadow-lg">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-700/50 mb-3">
                  {isUrdu ? 'دعائے بعد اذان (مسنون دعا)' : 'Supplication After the Call to Prayer'}
                </span>

                <p className="text-xl sm:text-2xl font-serif text-amber-200 leading-loose py-2 dir-rtl">
                  {DUA_AFTER_AZAN.arabicText}
                </p>

                {/* Dua Audio Player */}
                <div className="mt-4 pt-4 border-t border-emerald-900/40 flex items-center justify-center gap-3">
                  <button
                    id="dua-play-audio-btn"
                    onClick={() => azanAudioEngine.playDuaAfterAzan()}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-950/50 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isUrdu ? 'دعا کی تلاوت سنیں' : 'Listen to Dua Recitation'}</span>
                  </button>

                  <button
                    id="dua-copy-btn"
                    onClick={handleCopyDua}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {copiedNotification ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{isUrdu ? 'کاپی ہو گئی' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isUrdu ? 'دعا کاپی کریں' : 'Copy Dua'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Transliteration & Translations */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-stone-800/70 border border-stone-700">
                  <h6 className="text-xs uppercase font-semibold text-amber-400 mb-1">
                    {isUrdu ? 'اردو ترجمہ' : 'Urdu Translation'}
                  </h6>
                  <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans">
                    {DUA_AFTER_AZAN.urduTranslation}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-800/70 border border-stone-700">
                  <h6 className="text-xs uppercase font-semibold text-emerald-400 mb-1">
                    {isUrdu ? 'انگریزی ترجمہ (English Translation)' : 'English Translation'}
                  </h6>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    {DUA_AFTER_AZAN.englishTranslation}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-400 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-300">
                      {isUrdu ? 'فضیلت و حدیث مبارکہ: ' : 'Virtue & Hadith: '}
                    </span>
                    <span>
                      {isUrdu
                        ? DUA_AFTER_AZAN.hadithReferenceUr
                        : DUA_AFTER_AZAN.hadithReferenceEn}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VOICE RECITERS / FILES */}
          {activeTab === 'voices' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-400 mb-2">
                {isUrdu
                  ? 'مخصوص نماز کے لیے صدائے اذان آڈیو فائل:'
                  : 'Authentic Azan voice audio recordings for prayers:'}
              </p>

              <div className="space-y-2.5">
                {AZAN_VOICE_PRESETS.map((preset) => {
                  const isSelected = playbackState.currentTrack.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      id={`voice-preset-${preset.id}`}
                      onClick={() => {
                        azanAudioEngine.setVoiceTrack(preset.id);
                        azanAudioEngine.playPrayerAzan(preset.id === 'fajr' ? 'fajr' : 'dhuhr');
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                          : 'bg-stone-800/60 hover:bg-stone-800 border-stone-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-stone-700 text-stone-300'
                          }`}
                        >
                          <Radio className="w-5 h-5 text-amber-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h6 className="text-sm font-semibold text-white">
                              {isUrdu ? preset.nameUr : preset.nameEn}
                            </h6>
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                              MP3 Voice
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {isUrdu ? preset.reciterUr : preset.reciterEn}
                          </p>
                          <p className="text-[11px] text-emerald-400/90 mt-0.5 font-medium">
                            {preset.url}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && playbackState.isPlaying && !playbackState.isPaused ? (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-600 font-medium flex items-center gap-1">
                            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                            {isUrdu ? 'جاری ہے' : 'Playing'}
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              azanAudioEngine.setVoiceTrack(preset.id);
                              azanAudioEngine.playPrayerAzan(preset.id === 'fajr' ? 'fajr' : 'dhuhr');
                            }}
                            className="p-2 rounded-lg bg-stone-700 hover:bg-emerald-600 text-stone-200 hover:text-white transition-colors"
                            title="Play Azan"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isUrdu
                ? 'حسبِ سنت مؤذن کا جواب دینا مستحب ہے'
                : 'Repeating after the Moazzin is Sunnah'}
            </span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium transition-colors"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
