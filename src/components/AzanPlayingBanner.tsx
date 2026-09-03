import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Radio,
  BookOpen,
  X,
} from 'lucide-react';
import { Language } from '../types';
import {
  azanAudioEngine,
  AzanPlaybackState,
} from '../services/azanAudioService';

interface AzanPlayingBannerProps {
  language: Language;
  onOpenDetails: () => void;
}

export const AzanPlayingBanner: React.FC<AzanPlayingBannerProps> = ({
  language,
  onOpenDetails,
}) => {
  const [playbackState, setPlaybackState] = useState<AzanPlaybackState>(() =>
    azanAudioEngine.getState()
  );

  const isUrdu = language === 'ur';

  useEffect(() => {
    const unsubscribe = azanAudioEngine.subscribe((state) => {
      setPlaybackState(state);
    });
    return unsubscribe;
  }, []);

  if (!playbackState.isPlaying) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="azan-playing-live-banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fadeIn"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 border-2 border-emerald-500/80 rounded-2xl shadow-2xl shadow-black/80 p-4 text-stone-100 backdrop-blur-lg">
        <div className="flex items-center justify-between gap-3 mb-2">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {playbackState.isPlayingDua
                ? isUrdu
                  ? 'تلاوتِ دعائے بعد اذان'
                  : 'Reciting Post-Adhan Dua'
                : playbackState.isPaused
                ? isUrdu
                  ? '⏸ اذان موقوف ہے'
                  : '⏸ Adhan Paused'
                : isUrdu
                ? 'صدائے اذان جاری ہے'
                : 'Live Adhan Call'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenDetails}
              className="px-2.5 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-xs font-semibold text-white flex items-center gap-1 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>{isUrdu ? 'دعا و تفصیل' : 'Dua & View'}</span>
            </button>
            <button
              onClick={() => azanAudioEngine.stop()}
              className="p-1 rounded-lg bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-white transition-colors"
              title="Stop Adhan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Reciter */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">
              {playbackState.isPlayingDua
                ? isUrdu
                  ? 'اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ'
                  : 'Dua After Adhan'
                : isUrdu
                ? `${playbackState.activePrayerNameUr} - ${playbackState.currentTrack.nameUr}`
                : `${playbackState.activePrayerNameEn} - ${playbackState.currentTrack.nameEn}`}
            </h4>
            <p className="text-xs text-stone-400 mt-0.5">
              {isUrdu ? playbackState.currentTrack.reciterUr : playbackState.currentTrack.reciterEn}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Pause / Resume Button */}
            <button
              onClick={() => azanAudioEngine.togglePauseResume()}
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white shadow-md transition-transform active:scale-95"
              title={playbackState.isPaused ? 'Resume' : 'Pause'}
            >
              {playbackState.isPaused ? (
                <Play className="w-4 h-4 fill-current text-amber-300" />
              ) : (
                <Pause className="w-4 h-4 fill-current text-amber-300" />
              )}
            </button>

            <button
              onClick={() => azanAudioEngine.stop()}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-transform active:scale-95"
              title="Stop"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => azanAudioEngine.setMuted(!playbackState.isMuted)}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200"
              title={playbackState.isMuted ? 'Unmute' : 'Mute'}
            >
              {playbackState.isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="mt-3 space-y-1">
          <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
              style={{
                width: `${
                  playbackState.duration > 0
                    ? (playbackState.currentTime / playbackState.duration) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
            <span>{formatTime(playbackState.currentTime)}</span>
            <span>{formatTime(playbackState.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
