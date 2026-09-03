// Azan Audio Service for Jamia Masjid Usman-e-Ghani
// Handles authentic Islamic Azan MP3 audio playback:
// 1) azan1.mp3 for Zuhar, Asr, Magrib, Isha, and Jumma
// 2) TvQuran.com__01.athan.mp3 for Fajr (Assalatu Khairum Minan Naum)
// Also handles volume controls, seek/scrubbing, prayer countdown auto-trigger, and Post-Azan Masnoon Dua.

export interface AzanVoiceTrack {
  id: string;
  nameEn: string;
  nameUr: string;
  reciterEn: string;
  reciterUr: string;
  locationEn: string;
  locationUr: string;
  durationSec: number;
  url: string;
  isFajrSpecial?: boolean;
}

export const AZAN_VOICE_PRESETS: AzanVoiceTrack[] = [
  {
    id: 'azan1',
    nameEn: 'Authentic Adhan (Zuhar, Asr, Magrib, Isha, Jumma)',
    nameUr: 'صدائے اذان (ظہر، عصر، مغرب، عشاء اور جمعہ مبارک)',
    reciterEn: 'Pure Voice Moazzin Call (azan1.mp3)',
    reciterUr: 'اصل صدائے مؤذنِ باوقار (آڈیو ریکارڈنگ)',
    locationEn: 'Jamia Masjid Usman-e-Ghani',
    locationUr: 'جامع مسجد عثمانِ غنی',
    durationSec: 133,
    url: '/audio/azan1.mp3',
  },
  {
    id: 'fajr',
    nameEn: 'Fajr Special Adhan (TvQuran.com - Assalatu Khairum Minan Naum)',
    nameUr: 'اذانِ فجر (مع الصلاۃ خیر من النوم - TvQuran)',
    reciterEn: 'TvQuran Authentic Fajr Moazzin (01.athan.mp3)',
    reciterUr: 'صدائے اذانِ فجر مخصوص (مع الصلاۃ خیر من النوم)',
    locationEn: 'Fajr Prayer Call',
    locationUr: 'اذانِ فجر',
    durationSec: 191,
    url: '/audio/TvQuran.com__01.athan.mp3',
    isFajrSpecial: true,
  },
];

export interface AzanPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  activePrayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'custom' | null;
  activePrayerNameEn: string;
  activePrayerNameUr: string;
  currentTrack: AzanVoiceTrack;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 1
  isMuted: boolean;
  autoPlayEnabled: boolean;
  isPlayingDua: boolean;
}

export interface DuaAfterAzanData {
  arabicText: string;
  transliteration: string;
  urduTranslation: string;
  englishTranslation: string;
  hadithReferenceUr: string;
  hadithReferenceEn: string;
}

export const DUA_AFTER_AZAN: DuaAfterAzanData = {
  arabicText:
    'اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ، [إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ]',
  transliteration:
    'Allahumma Rabba hadhihid-da\'watit-tammah, was-salatil-qa\'imah, ati Muhammadanil-wasilata wal-fadilah, wab\'ath-hu maqamam-mahmudanil-ladhi wa\'adtah, [innaka la tukhliful-mi\'ad].',
  urduTranslation:
    'اے اللہ! اس کامل پکار اور ہمیشہ قائم رہنے والی نماز کے رب! ہمارے آقا حضرت محمد مصطفیٰ ﷺ کو وسیلہ اور فضیلت عطا فرما اور انہیں اس مقامِ محمود پر فائز فرما جس کا تو نے ان سے وعدہ فرمایا ہے، بے شک تو وعدہ کے خلاف نہیں کرتا۔',
  englishTranslation:
    'O Allah, Lord of this perfect call and the established prayer! Grant Muhammad the status of Wasilah and excellence, and resurrect him to the praised status which You have promised him. Truly, You never break Your promise.',
  hadithReferenceUr:
    'صحیح بخاری، حدیث: 614 - رسول اللہ ﷺ نے فرمایا: جو شخص اذان سن کر یہ دعا پڑھے اس کے لیے قیامت کے دن میری شفاعت واجب ہو جائے گی۔',
  hadithReferenceEn:
    'Sahih Bukhari, Hadith: 614 - The Prophet (ﷺ) said: Whoever says this supplication after hearing the Adhan, my intercession will be guaranteed for him on the Day of Resurrection.',
};

// Storage Keys
const AZAN_AUTO_PLAY_KEY = 'mosque_azan_auto_play_enabled';
const AZAN_SELECTED_VOICE_KEY = 'mosque_azan_selected_voice_id';
const AZAN_VOLUME_KEY = 'mosque_azan_volume_level';

// Azan Audio Engine with Full MP3 Playback
class AzanAudioEngine {
  private htmlAudio: HTMLAudioElement | null = null;
  private duaInterval: number | null = null;
  private listeners: ((state: AzanPlaybackState) => void)[] = [];

  private state: AzanPlaybackState = {
    isPlaying: false,
    isPaused: false,
    activePrayerId: null,
    activePrayerNameEn: '',
    activePrayerNameUr: '',
    currentTrack: AZAN_VOICE_PRESETS[0],
    currentTime: 0,
    duration: AZAN_VOICE_PRESETS[0].durationSec,
    volume: 0.9,
    isMuted: false,
    autoPlayEnabled: true,
    isPlayingDua: false,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const storedAuto = localStorage.getItem(AZAN_AUTO_PLAY_KEY);
        if (storedAuto !== null) {
          this.state.autoPlayEnabled = storedAuto === 'true';
        }
        const storedVoice = localStorage.getItem(AZAN_SELECTED_VOICE_KEY);
        if (storedVoice) {
          const found = AZAN_VOICE_PRESETS.find((v) => v.id === storedVoice);
          if (found) {
            this.state.currentTrack = found;
            this.state.duration = found.durationSec;
          }
        }
        const storedVol = localStorage.getItem(AZAN_VOLUME_KEY);
        if (storedVol !== null) {
          const v = parseFloat(storedVol);
          if (!isNaN(v) && v >= 0 && v <= 1) this.state.volume = v;
        }
      } catch (e) {
        console.warn('Could not read Azan audio localStorage:', e);
      }
    }
  }

  public subscribe(cb: (state: AzanPlaybackState) => void) {
    this.listeners.push(cb);
    cb({ ...this.state });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l({ ...this.state }));
  }

  public getState(): AzanPlaybackState {
    return { ...this.state };
  }

  public setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    this.state.volume = clamped;
    if (this.htmlAudio) {
      this.htmlAudio.volume = this.state.isMuted ? 0 : clamped;
    }
    try {
      localStorage.setItem(AZAN_VOLUME_KEY, clamped.toString());
    } catch (e) {
      // ignore
    }
    this.notify();
  }

  public setMuted(muted: boolean) {
    this.state.isMuted = muted;
    if (this.htmlAudio) {
      this.htmlAudio.muted = muted;
      this.htmlAudio.volume = muted ? 0 : this.state.volume;
    }
    this.notify();
  }

  public setAutoPlay(enabled: boolean) {
    this.state.autoPlayEnabled = enabled;
    try {
      localStorage.setItem(AZAN_AUTO_PLAY_KEY, enabled.toString());
    } catch (e) {
      // ignore
    }
    this.notify();
  }

  public setVoiceTrack(trackId: string) {
    const track = AZAN_VOICE_PRESETS.find((t) => t.id === trackId) || AZAN_VOICE_PRESETS[0];
    const wasPlaying = this.state.isPlaying;
    const currentPrayerId = this.state.activePrayerId;

    this.state.currentTrack = track;
    this.state.duration = track.durationSec;
    try {
      localStorage.setItem(AZAN_SELECTED_VOICE_KEY, track.id);
    } catch (e) {
      // ignore
    }

    if (wasPlaying && currentPrayerId) {
      this.playPrayerAzan(currentPrayerId);
    } else {
      this.notify();
    }
  }

  // Play Azan for a specific prayer:
  // - 'fajr' -> TvQuran.com__01.athan.mp3 (with Assalatu Khairum Minan Naum)
  // - 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'custom' / Jumma -> azan1.mp3
  public playPrayerAzan(
    prayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'custom',
    prayerNameEn?: string,
    prayerNameUr?: string
  ) {
    this.stop();

    const namesEn: Record<string, string> = {
      fajr: 'Fajr Azan',
      dhuhr: 'Dhuhr Azan',
      asr: 'Asr Azan',
      maghrib: 'Maghrib Azan',
      isha: 'Isha Azan',
      custom: 'Special Azan Call',
    };
    const namesUr: Record<string, string> = {
      fajr: 'اذانِ فجر',
      dhuhr: 'اذانِ ظہر',
      asr: 'اذانِ عصر',
      maghrib: 'اذانِ مغرب',
      isha: 'اذانِ عشاء',
      custom: 'صدائے اذان',
    };

    // Determine the exact audio file: Fajr -> TvQuran.com__01.athan.mp3, others -> azan1.mp3
    let trackToPlay: AzanVoiceTrack;
    if (prayerId === 'fajr') {
      trackToPlay = AZAN_VOICE_PRESETS.find((t) => t.id === 'fajr') || AZAN_VOICE_PRESETS[1];
    } else {
      trackToPlay = AZAN_VOICE_PRESETS.find((t) => t.id === 'azan1') || AZAN_VOICE_PRESETS[0];
    }

    this.state.currentTrack = trackToPlay;
    this.state.isPlaying = true;
    this.state.isPaused = false;
    this.state.isPlayingDua = false;
    this.state.activePrayerId = prayerId;
    this.state.activePrayerNameEn = prayerNameEn || namesEn[prayerId] || 'Adhan Call';
    this.state.activePrayerNameUr = prayerNameUr || namesUr[prayerId] || 'صدائے اذان';
    this.state.currentTime = 0;
    this.state.duration = trackToPlay.durationSec;
    this.notify();

    this.playMp3Audio(trackToPlay.url, trackToPlay);
  }

  // Play MP3 file with HTML5 Audio
  private playMp3Audio(url: string, track: AzanVoiceTrack) {
    if (typeof window === 'undefined') return;

    try {
      if (this.htmlAudio) {
        this.htmlAudio.pause();
        this.htmlAudio.src = '';
        this.htmlAudio = null;
      }

      const audio = new Audio(url);
      this.htmlAudio = audio;
      audio.volume = this.state.isMuted ? 0 : this.state.volume;
      audio.muted = this.state.isMuted;

      audio.addEventListener('loadedmetadata', () => {
        if (!isNaN(audio.duration) && audio.duration > 0) {
          this.state.duration = audio.duration;
          this.notify();
        }
      });

      audio.addEventListener('timeupdate', () => {
        if (!this.state.isPaused && this.state.isPlaying) {
          this.state.currentTime = audio.currentTime;
          if (!isNaN(audio.duration) && audio.duration > 0) {
            this.state.duration = audio.duration;
          }
          this.notify();
        }
      });

      audio.addEventListener('ended', () => {
        this.stop();
      });

      audio.addEventListener('error', (err) => {
        console.warn('Audio MP3 play error for url:', url, err);
      });

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('HTML5 Audio play restricted or user interaction required:', err);
        });
      }
    } catch (e) {
      console.warn('Failed to initialize HTML5 Audio:', e);
    }
  }

  // Seek to position in seconds
  public seek(seconds: number) {
    const clamped = Math.max(0, Math.min(this.state.duration, seconds));
    this.state.currentTime = clamped;
    if (this.htmlAudio) {
      try {
        this.htmlAudio.currentTime = clamped;
      } catch (e) {
        // ignore
      }
    }
    this.notify();
  }

  // Pause / Resume toggle
  public togglePauseResume() {
    if (!this.state.isPlaying) {
      this.playPrayerAzan(this.state.activePrayerId || 'fajr');
      return;
    }

    if (this.state.isPaused) {
      // Resume
      this.state.isPaused = false;
      if (this.htmlAudio) {
        this.htmlAudio.play().catch(() => {});
      }
      this.notify();
    } else {
      // Pause
      this.state.isPaused = true;
      if (this.htmlAudio) {
        this.htmlAudio.pause();
      }
      this.notify();
    }
  }

  // Play Dua After Azan
  public playDuaAfterAzan() {
    this.stop();
    this.state.isPlaying = true;
    this.state.isPaused = false;
    this.state.isPlayingDua = true;
    this.state.activePrayerId = 'custom';
    this.state.activePrayerNameEn = 'Dua After Adhan';
    this.state.activePrayerNameUr = 'دعائے بعد اذان';
    this.state.currentTime = 0;
    this.state.duration = 45;
    this.notify();

    this.startDuaSpeechStream();
  }

  private startDuaSpeechStream() {
    if (typeof window === 'undefined') return;

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(DUA_AFTER_AZAN.arabicText);
        utterance.rate = 0.85;
        utterance.pitch = 1.05;
        utterance.volume = this.state.volume;

        const voices = window.speechSynthesis.getVoices();
        const arVoice = voices.find(
          (v) => v.lang.startsWith('ar') || v.name.includes('Arabic') || v.name.includes('ar-')
        );
        if (arVoice) {
          utterance.voice = arVoice;
        }

        utterance.onend = () => {
          this.stop();
        };
        utterance.onerror = () => {
          this.stop();
        };

        window.speechSynthesis.speak(utterance);
      }

      this.duaInterval = window.setInterval(() => {
        if (!this.state.isPlaying) {
          clearInterval(this.duaInterval!);
          return;
        }
        this.state.currentTime += 1;
        if (this.state.currentTime >= this.state.duration) {
          this.stop();
        } else {
          this.notify();
        }
      }, 1000);
    } catch (e) {
      console.warn('Speech synthesis Dua error:', e);
      this.stop();
    }
  }

  // Stop playback immediately
  public stop() {
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.isPlayingDua = false;
    this.state.activePrayerId = null;
    this.state.currentTime = 0;

    if (this.duaInterval) {
      clearInterval(this.duaInterval);
      this.duaInterval = null;
    }

    if (this.htmlAudio) {
      try {
        this.htmlAudio.pause();
        this.htmlAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }

    this.notify();
  }

  public pause() {
    if (this.state.isPlaying) {
      this.togglePauseResume();
    }
  }

  public togglePlay(prayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'custom' = 'dhuhr') {
    if (this.state.isPlaying) {
      this.stop();
    } else {
      this.playPrayerAzan(prayerId);
    }
  }
}

// Global Singleton
export const azanAudioEngine = new AzanAudioEngine();
