import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Clock,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Bell,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  Info,
  BookOpen,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Upload,
  ExternalLink,
  Check,
  User,
  MapPin,
  Tag,
  Video,
  Tv,
  PlayCircle,
  Radio,
  Film,
  Play,
} from 'lucide-react';
import {
  Language,
  AdminPrayerSettings,
  DarseQuranProgram,
  AnnouncementItem,
  MosqueMediaSettings,
  MosqueVideoItem,
} from '../types';
import {
  DEFAULT_ADMIN_SETTINGS,
  DEFAULT_DARS_PROGRAMS,
  DEFAULT_MEDIA_SETTINGS,
  CURATED_IMAGE_PRESETS,
  CURATED_VIDEO_PRESETS,
  getEmbedVideoUrl,
  getStoredAdminSettings,
  saveAdminSettings,
  resetAdminSettings,
} from '../services/prayerService';
import { ANNOUNCEMENTS } from '../data/mockData';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSettingsSaved: (newSettings: AdminPrayerSettings) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  language,
  onSettingsSaved,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [settings, setSettings] = useState<AdminPrayerSettings>(DEFAULT_ADMIN_SETTINGS);
  const [savedToast, setSavedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'timings' | 'video' | 'dars' | 'announcements' | 'media' | 'presets' | 'banner'
  >('timings');

  // Video editing sub-state
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState<Partial<MosqueVideoItem>>({});
  const [isAddingNewVideo, setIsAddingNewVideo] = useState(false);

  // Dars-e-Quran editing sub-state
  const [editingDarsId, setEditingDarsId] = useState<string | null>(null);
  const [darsForm, setDarsForm] = useState<Partial<DarseQuranProgram>>({});
  const [isAddingNewDars, setIsAddingNewDars] = useState(false);

  // Announcement editing sub-state
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [annForm, setAnnForm] = useState<Partial<AnnouncementItem>>({});
  const [isAddingNewAnn, setIsAddingNewAnn] = useState(false);

  // Image Picker target state
  const [imagePickerTarget, setImagePickerTarget] = useState<{
    type: 'hero' | 'dars_poster' | 'darulquran' | 'dars_item' | 'ann_item';
    darsId?: string;
    annId?: string;
  } | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const isUrdu = language === 'ur';

  // Load stored settings on open
  useEffect(() => {
    if (isOpen) {
      const current = getStoredAdminSettings();
      // Ensure arrays exist
      if (!current.darsPrograms || current.darsPrograms.length === 0) {
        current.darsPrograms = DEFAULT_DARS_PROGRAMS;
      }
      if (!current.mediaSettings) {
        current.mediaSettings = DEFAULT_MEDIA_SETTINGS;
      }
      if (!current.customAnnouncements || current.customAnnouncements.length === 0) {
        current.customAnnouncements = ANNOUNCEMENTS;
      }
      setSettings(current);
      setSavedToast(false);
      setPinError(false);
    } else {
      setPinInput('');
      setPinError(false);
      setShowPassword(false);
      setEditingDarsId(null);
      setIsAddingNewDars(false);
      setEditingAnnId(null);
      setIsAddingNewAnn(false);
      setImagePickerTarget(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'Pak123@#') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSave = () => {
    saveAdminSettings(settings);
    onSettingsSaved(settings);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
    }, 3500);
  };

  const handleReset = () => {
    if (
      window.confirm(
        isUrdu
          ? 'کیا آپ واقعی اوقات اور ترتیبات کو فیکٹری ڈیفالٹ پر ری سیٹ کرنا چاہتے ہیں؟'
          : 'Are you sure you want to reset all timings and settings to factory defaults?'
      )
    ) {
      const def = resetAdminSettings();
      setSettings(def);
      onSettingsSaved(def);
      setSavedToast(true);
      setTimeout(() => {
        setSavedToast(false);
      }, 3500);
    }
  };

  // Preset Applier
  const applyPreset = (presetName: 'current' | 'winter' | 'summer' | 'ramadan') => {
    let preset: Partial<AdminPrayerSettings> = {};
    if (presetName === 'current') {
      preset = {
        fajrJamaat: '05:40 AM',
        dhuhrJamaat: '01:30 PM',
        asrJamaat: '05:30 PM',
        maghribJamaat: '+5 mins after Azan',
        ishaJamaat: '08:45 PM',
        jummaAzan: '01:00 PM',
        jummaAzan2: '01:30 PM',
        jummaBayan: '01:00 PM',
        jummaKhutbah: '01:35 PM',
        jummaJamaat: '01:45 PM',
        jummaKhateebUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)',
        jummaKhateebEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
        ishraqTime: '+12 mins after Tuloo',
      };
    } else if (presetName === 'winter') {
      preset = {
        fajrJamaat: '06:00 AM',
        dhuhrJamaat: '01:15 PM',
        asrJamaat: '04:45 PM',
        maghribJamaat: '+5 mins after Azan',
        ishaJamaat: '08:00 PM',
        jummaAzan: '12:45 PM',
        jummaAzan2: '01:15 PM',
        jummaBayan: '12:45 PM',
        jummaKhutbah: '01:20 PM',
        jummaJamaat: '01:30 PM',
        jummaKhateebUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)',
        jummaKhateebEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
        ishraqTime: '+15 mins after Tuloo',
      };
    } else if (presetName === 'summer') {
      preset = {
        fajrJamaat: '05:15 AM',
        dhuhrJamaat: '01:30 PM',
        asrJamaat: '05:30 PM',
        maghribJamaat: '+5 mins after Azan',
        ishaJamaat: '09:00 PM',
        jummaAzan: '01:00 PM',
        jummaAzan2: '01:30 PM',
        jummaBayan: '01:00 PM',
        jummaKhutbah: '01:35 PM',
        jummaJamaat: '01:45 PM',
        jummaKhateebUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)',
        jummaKhateebEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
        ishraqTime: '+12 mins after Tuloo',
      };
    } else if (presetName === 'ramadan') {
      preset = {
        fajrJamaat: '05:10 AM',
        dhuhrJamaat: '01:30 PM',
        asrJamaat: '05:15 PM',
        maghribJamaat: '+5 mins after Iftar',
        ishaJamaat: '08:45 PM (Taraweeh 09:00 PM)',
        jummaAzan: '01:00 PM',
        jummaAzan2: '01:30 PM',
        jummaBayan: '01:00 PM',
        jummaKhutbah: '01:35 PM',
        jummaJamaat: '01:45 PM',
        jummaKhateebUr: 'حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)',
        jummaKhateebEn: 'Maulana Younus Mansori (Khateeb-e-Masjid)',
        ishraqTime: '+12 mins after Tuloo',
        showAlertBanner: true,
        alertBannerEn:
          'Ramadan Mubarak: Daily Taraweeh starts after Isha 8:45 PM. Sehri ends 10 mins before Fajr.',
        alertBannerUr:
          'رمضان المبارک: روزانہ نماز تراویح بعد نماز عشاء 8:45 پر ادا کی جائے گی۔',
      };
    }

    const updated = { ...settings, ...preset };
    setSettings(updated);
    saveAdminSettings(updated);
    onSettingsSaved(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  // Image Selection Handler
  const handleSelectImagePreset = (url: string) => {
    if (!imagePickerTarget) return;

    if (imagePickerTarget.type === 'hero') {
      setSettings((prev) => ({
        ...prev,
        mediaSettings: {
          ...prev.mediaSettings,
          heroBannerImage: url,
        },
      }));
    } else if (imagePickerTarget.type === 'dars_poster') {
      setSettings((prev) => ({
        ...prev,
        mediaSettings: {
          ...prev.mediaSettings,
          darsPosterImage: url,
        },
      }));
    } else if (imagePickerTarget.type === 'darulquran') {
      setSettings((prev) => ({
        ...prev,
        mediaSettings: {
          ...prev.mediaSettings,
          darulQuranImage: url,
        },
      }));
    } else if (imagePickerTarget.type === 'dars_item') {
      setDarsForm((prev) => ({ ...prev, imageUrl: url }));
      if (imagePickerTarget.darsId) {
        setSettings((prev) => ({
          ...prev,
          darsPrograms: (prev.darsPrograms || []).map((item) =>
            item.id === imagePickerTarget.darsId ? { ...item, imageUrl: url } : item
          ),
        }));
      }
    } else if (imagePickerTarget.type === 'ann_item') {
      setAnnForm((prev) => ({ ...prev, imageUrl: url }));
      if (imagePickerTarget.annId) {
        setSettings((prev) => ({
          ...prev,
          customAnnouncements: (prev.customAnnouncements || []).map((item) =>
            item.id === imagePickerTarget.annId ? { ...item, imageUrl: url } : item
          ),
        }));
      }
    }

    setImagePickerTarget(null);
    setCustomImageUrl('');
  };

  // Local File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleSelectImagePreset(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Dars-e-Quran management
  const handleSaveDars = () => {
    if (!darsForm.titleUr && !darsForm.titleEn) return;

    if (isAddingNewDars) {
      const newDars: DarseQuranProgram = {
        id: `dars-${Date.now()}`,
        titleEn: darsForm.titleEn || 'Special Dars-e-Quran',
        titleUr: darsForm.titleUr || 'درسِ قرآن و فہم دین',
        speakerEn: darsForm.speakerEn || 'Maulana Younus Mansori',
        speakerUr: darsForm.speakerUr || 'مولانا یونس منصوری صاحب',
        timingEn: darsForm.timingEn || 'After Fajr (15-20 mins)',
        timingUr: darsForm.timingUr || 'بعد نمازِ فجر (15 منٹ)',
        frequencyEn: darsForm.frequencyEn || 'Daily',
        frequencyUr: darsForm.frequencyUr || 'روزانہ',
        topicEn: darsForm.topicEn || 'Tafseer & Masnoon Duas',
        topicUr: darsForm.topicUr || 'تفسیر قرآن و احادیث مبارکہ',
        locationEn: darsForm.locationEn || 'Main Prayer Hall',
        locationUr: darsForm.locationUr || 'مرکزی نماز ہال',
        imageUrl:
          darsForm.imageUrl ||
          'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
        active: true,
        notesEn: darsForm.notesEn || '',
        notesUr: darsForm.notesUr || '',
      };
      setSettings((prev) => ({
        ...prev,
        darsPrograms: [...(prev.darsPrograms || []), newDars],
      }));
    } else if (editingDarsId) {
      setSettings((prev) => ({
        ...prev,
        darsPrograms: (prev.darsPrograms || []).map((item) =>
          item.id === editingDarsId ? ({ ...item, ...darsForm } as DarseQuranProgram) : item
        ),
      }));
    }

    setEditingDarsId(null);
    setIsAddingNewDars(false);
    setDarsForm({});
  };

  const handleDeleteDars = (id: string) => {
    if (window.confirm(isUrdu ? 'کیا آپ اس درس پروگرام کو ڈیلیٹ کرنا چاہتے ہیں؟' : 'Delete this Dars program?')) {
      setSettings((prev) => ({
        ...prev,
        darsPrograms: (prev.darsPrograms || []).filter((item) => item.id !== id),
      }));
    }
  };

  const handleToggleDarsActive = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      darsPrograms: (prev.darsPrograms || []).map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      ),
    }));
  };

  // Announcements management
  const handleSaveAnn = () => {
    if (!annForm.titleUr && !annForm.titleEn) return;

    if (isAddingNewAnn) {
      const newAnn: AnnouncementItem = {
        id: `ann-${Date.now()}`,
        titleEn: annForm.titleEn || 'New Mosque Announcement',
        titleUr: annForm.titleUr || 'جامع مسجد کا نیا اعلان',
        category: annForm.category || 'general',
        date: annForm.date || new Date().toISOString().split('T')[0],
        hijriDate: annForm.hijriDate || '1448 AH',
        contentEn: annForm.contentEn || '',
        contentUr: annForm.contentUr || '',
        speakerEn: annForm.speakerEn || '',
        speakerUr: annForm.speakerUr || '',
        time: annForm.time || '',
        badgeEn: annForm.badgeEn || 'Notice',
        badgeUr: annForm.badgeUr || 'اہم اعلان',
        imageUrl: annForm.imageUrl,
        important: annForm.important || false,
      };
      setSettings((prev) => ({
        ...prev,
        customAnnouncements: [newAnn, ...(prev.customAnnouncements || [])],
      }));
    } else if (editingAnnId) {
      setSettings((prev) => ({
        ...prev,
        customAnnouncements: (prev.customAnnouncements || []).map((item) =>
          item.id === editingAnnId ? ({ ...item, ...annForm } as AnnouncementItem) : item
        ),
      }));
    }

    setEditingAnnId(null);
    setIsAddingNewAnn(false);
    setAnnForm({});
  };

  const handleDeleteAnn = (id: string) => {
    if (window.confirm(isUrdu ? 'کیا آپ اس اعلان کو ڈیلیٹ کرنا چاہتے ہیں؟' : 'Delete this announcement?')) {
      setSettings((prev) => ({
        ...prev,
        customAnnouncements: (prev.customAnnouncements || []).filter((item) => item.id !== id),
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="admin-portal-modal"
        className="relative w-full max-w-4xl bg-stone-900 border border-emerald-700/50 rounded-2xl shadow-2xl shadow-emerald-950/60 overflow-hidden my-auto"
      >
        {/* Header bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-emerald-800/40 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {isUrdu ? 'انتظامی کنٹرول پورٹل - جامع مسجد عثمانِ غنی' : 'Mosque Admin Portal - Management'}
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {isUrdu ? 'سیکٹر 5-اے/1' : 'Sector 5-A/1'}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {isUrdu
                  ? 'اوقاتِ نماز، درسِ قرآن، تصاویر، اعلانات و الرٹ بینر میں لائیو تبدیلی'
                  : 'Manage Namaz timings, Dars-e-Quran, pictures, announcements & live notices'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authentication screen if locked */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  {isUrdu ? 'انتظامیہ پاس ورڈ درج کریں' : 'Mosque Committee Access Required'}
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  {isUrdu
                    ? 'اوقات، درسِ قرآن اور تصاویر میں رد و بدل صرف انتظامی کمیٹی کے مجاز اراکین کے لیے مخصوص ہے۔'
                    : 'To change Jamaat timings, Dars-e-Quran, or pictures, please enter the admin password.'}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    placeholder={isUrdu ? 'پاس ورڈ درج کریں' : 'Enter Admin Password'}
                    className="w-full text-center px-10 py-3 bg-stone-950 border border-stone-700 rounded-xl text-white font-mono text-base tracking-wider focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1.5 text-stone-400 hover:text-stone-200 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {pinError && (
                  <p className="text-xs text-rose-400 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isUrdu
                        ? 'غلط پاس ورڈ! درست پاس ورڈ درج کریں۔'
                        : 'Incorrect password! Please try again.'}
                    </span>
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>{isUrdu ? 'پورٹل کھولیں' : 'Unlock Portal'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Management Tabs */
          <div className="p-4 sm:p-6 space-y-5">
            {/* Notification Toast */}
            {savedToast && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-emerald-200 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {isUrdu
                      ? 'تمام تبدیلیاں کامیابی کے ساتھ محفوظ ہو گئیں اور لائیو نشر ہو گئیں!'
                      : 'All changes saved successfully & published live across the portal!'}
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded text-white font-mono font-bold">
                  LIVE
                </span>
              </div>
            )}

            {/* Navigation Tabs Bar */}
            <div className="flex border-b border-stone-800 gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveTab('timings')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'timings'
                    ? 'border-emerald-400 text-emerald-300'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{isUrdu ? 'اوقاتِ نماز و جمعہ' : 'Namaz & Jumma'}</span>
              </button>

              <button
                onClick={() => setActiveTab('video')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'video'
                    ? 'border-rose-400 text-rose-300'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>{isUrdu ? 'ویڈیوز و لائیو نشریات' : 'Videos & Live'}</span>
              </button>

              <button
                onClick={() => setActiveTab('dars')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'dars'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{isUrdu ? 'درسِ قرآن و بیانات' : 'Dars-e-Quran'}</span>
              </button>

              <button
                onClick={() => setActiveTab('media')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'media'
                    ? 'border-sky-400 text-sky-300'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>{isUrdu ? 'تصاویر و پوسٹرز' : 'Pictures & Media'}</span>
              </button>

              <button
                onClick={() => setActiveTab('announcements')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'announcements'
                    ? 'border-emerald-400 text-emerald-300'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>{isUrdu ? 'اعلانات و نوٹسز' : 'Announcements'}</span>
              </button>

              <button
                onClick={() => setActiveTab('presets')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'presets'
                    ? 'border-emerald-400 text-emerald-300'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{isUrdu ? 'موسمی پری سیٹس' : 'Seasonal Presets'}</span>
              </button>

              <button
                onClick={() => setActiveTab('banner')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'banner'
                    ? 'border-emerald-400 text-emerald-300'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isUrdu ? 'الرٹ بینر' : 'Alert Banner'}</span>
              </button>
            </div>

            {/* TAB 1: ALL NAMAZ & JUMMA EDIT FORM */}
            {activeTab === 'timings' && (
              <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-stone-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    {isUrdu
                      ? 'تمام نمازوں کے اوقات اور جمعۃ المبارک کی اذانِ اول، اذانِ ثانی، بیان اور خطبہ و جماعت کے اوقات یہاں سے تبدیل کریں۔'
                      : 'Edit prayer and Friday Jumma timings (1st Azan, Bayan, 2nd Azan, Khutbah & Jamaat). Updates immediately across the website.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Fajr Card */}
                  <div className="p-3.5 rounded-xl bg-stone-950/90 border border-sky-900/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-300 uppercase tracking-wide">
                        {isUrdu ? 'نمازِ فجر' : 'Fajr Prayer'}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                        {isUrdu ? 'صبح' : 'Morning'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-400 mb-1">
                        {isUrdu ? 'فجر جماعت کا وقت (Jamaat Time)' : 'Fajr Jamaat Time:'}
                      </label>
                      <input
                        type="text"
                        value={settings.fajrJamaat}
                        onChange={(e) => setSettings({ ...settings, fajrJamaat: e.target.value })}
                        placeholder="05:40 AM"
                        className="w-full px-3 py-2 bg-stone-900 border border-sky-700/60 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  {/* Sunrise & Ishraq Card */}
                  <div className="p-3.5 rounded-xl bg-stone-950/90 border border-amber-900/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                        {isUrdu ? 'طلوع آفتاب و اشراق' : 'Sunrise & Ishraq'}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                        {isUrdu ? 'اشراق' : 'Ishraq'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-400 mb-1">
                        {isUrdu ? 'اشراق کا وقت (Ishraq Time / Offset):' : 'Ishraq Time / Offset:'}
                      </label>
                      <input
                        type="text"
                        value={settings.ishraqTime}
                        onChange={(e) => setSettings({ ...settings, ishraqTime: e.target.value })}
                        placeholder="+12 mins after Tuloo"
                        className="w-full px-3 py-2 bg-stone-900 border border-amber-700/60 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Dhuhr Card */}
                  <div className="p-3.5 rounded-xl bg-stone-950/90 border border-emerald-900/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                        {isUrdu ? 'نمازِ ظہر' : 'Dhuhr Prayer'}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {isUrdu ? 'دوپہر' : 'Noon'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-400 mb-1">
                        {isUrdu ? 'ظہر جماعت کا وقت (Jamaat Time):' : 'Dhuhr Jamaat Time:'}
                      </label>
                      <input
                        type="text"
                        value={settings.dhuhrJamaat}
                        onChange={(e) => setSettings({ ...settings, dhuhrJamaat: e.target.value })}
                        placeholder="01:30 PM"
                        className="w-full px-3 py-2 bg-stone-900 border border-emerald-700/60 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Asr Card */}
                  <div className="p-3.5 rounded-xl bg-stone-950/90 border border-orange-900/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-300 uppercase tracking-wide">
                        {isUrdu ? 'نمازِ عصر (حنفی)' : 'Asr Prayer (Hanafi)'}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800">
                        {isUrdu ? 'شام' : 'Afternoon'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-400 mb-1">
                        {isUrdu ? 'عصر جماعت کا وقت (Jamaat Time):' : 'Asr Jamaat Time:'}
                      </label>
                      <input
                        type="text"
                        value={settings.asrJamaat}
                        onChange={(e) => setSettings({ ...settings, asrJamaat: e.target.value })}
                        placeholder="05:30 PM"
                        className="w-full px-3 py-2 bg-stone-900 border border-orange-700/60 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>

                  {/* Maghrib Card */}
                  <div className="p-3.5 rounded-xl bg-stone-950/90 border border-rose-900/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                        {isUrdu ? 'نمازِ مغرب / افطار' : 'Maghrib & Iftar'}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                        {isUrdu ? 'غروب' : 'Sunset'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-400 mb-1">
                        {isUrdu ? 'مغرب جماعت کا وقت (Jamaat Time / Offset):' : 'Maghrib Jamaat:'}
                      </label>
                      <input
                        type="text"
                        value={settings.maghribJamaat}
                        onChange={(e) => setSettings({ ...settings, maghribJamaat: e.target.value })}
                        placeholder="+5 mins after Azan"
                        className="w-full px-3 py-2 bg-stone-900 border border-rose-700/60 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>

                  {/* Isha Card */}
                  <div className="p-3.5 rounded-xl bg-stone-950/90 border border-indigo-900/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                        {isUrdu ? 'نمازِ عشاء' : 'Isha Prayer'}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                        {isUrdu ? 'رات' : 'Night'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-400 mb-1">
                        {isUrdu ? 'عشاء جماعت کا وقت (Jamaat Time):' : 'Isha Jamaat Time:'}
                      </label>
                      <input
                        type="text"
                        value={settings.ishaJamaat}
                        onChange={(e) => setSettings({ ...settings, ishaJamaat: e.target.value })}
                        placeholder="08:45 PM"
                        className="w-full px-3 py-2 bg-stone-900 border border-indigo-700/60 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  {/* Jumma Card with 1st Azan, Bayan, 2nd Azan, Khutbah, Jamaat & Khateeb */}
                  <div className="p-4 rounded-xl bg-stone-950/90 border border-teal-800/70 space-y-3 sm:col-span-2 shadow-sm">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                        <span className="text-xs font-bold text-teal-300 uppercase tracking-wide">
                          {isUrdu ? 'نمازِ جمعۃ المبارک کا مکمل شیڈول' : 'Friday Jumma Congregation Full Schedule'}
                        </span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                        {isUrdu ? 'جمعہ اذان و جماعت سیٹنگز' : 'Jumma Azan & Jamaat Settings'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Jumma 1st Azan Timing Setting */}
                      <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                        <label className="block text-[11px] font-bold text-teal-300 mb-1 flex items-center justify-between">
                          <span>{isUrdu ? '1. اذانِ اول کا وقت (1st Azan):' : '1. 1st Azan Time:'}</span>
                          <span className="text-[10px] text-stone-400 font-normal">Azan 1</span>
                        </label>
                        <input
                          type="text"
                          value={settings.jummaAzan || '01:00 PM'}
                          onChange={(e) => setSettings({ ...settings, jummaAzan: e.target.value })}
                          placeholder="01:00 PM"
                          className="w-full px-3 py-2 bg-stone-950 border border-teal-700/80 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-teal-400 ring-1 ring-teal-900/40"
                        />
                      </div>

                      {/* Jumma Bayan Timing Setting */}
                      <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                        <label className="block text-[11px] font-medium text-stone-300 mb-1 flex items-center justify-between">
                          <span>{isUrdu ? '2. اردو بیان کا وقت (Urdu Bayan):' : '2. Urdu Bayan Time:'}</span>
                          <span className="text-[10px] text-amber-400 font-normal">Bayan</span>
                        </label>
                        <input
                          type="text"
                          value={settings.jummaBayan || '01:00 PM'}
                          onChange={(e) => setSettings({ ...settings, jummaBayan: e.target.value })}
                          placeholder="01:00 PM"
                          className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-teal-400"
                        />
                      </div>

                      {/* Jumma 2nd Azan Timing Setting */}
                      <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                        <label className="block text-[11px] font-bold text-amber-300 mb-1 flex items-center justify-between">
                          <span>{isUrdu ? '3. اذانِ ثانی کا وقت (2nd Azan):' : '3. 2nd Azan Time:'}</span>
                          <span className="text-[10px] text-stone-400 font-normal">Azan 2</span>
                        </label>
                        <input
                          type="text"
                          value={settings.jummaAzan2 || '01:30 PM'}
                          onChange={(e) => setSettings({ ...settings, jummaAzan2: e.target.value })}
                          placeholder="01:30 PM"
                          className="w-full px-3 py-2 bg-stone-950 border border-amber-700/80 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-400 ring-1 ring-amber-900/40"
                        />
                      </div>

                      {/* Jumma Arabic Khutbah Timing */}
                      <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                        <label className="block text-[11px] font-medium text-stone-300 mb-1 flex items-center justify-between">
                          <span>{isUrdu ? '4. عربی خطبہ کا وقت (Khutbah):' : '4. Arabic Khutbah:'}</span>
                          <span className="text-[10px] text-stone-400 font-normal">Khutbah</span>
                        </label>
                        <input
                          type="text"
                          value={settings.jummaKhutbah || '01:35 PM'}
                          onChange={(e) => setSettings({ ...settings, jummaKhutbah: e.target.value })}
                          placeholder="01:35 PM"
                          className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-teal-400"
                        />
                      </div>

                      {/* Jumma Jamaat Timing Setting */}
                      <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60">
                        <label className="block text-[11px] font-extrabold text-emerald-300 mb-1 flex items-center justify-between">
                          <span>{isUrdu ? '5. جمعہ جماعت کا وقت (Jamaat):' : '5. Friday Jamaat Time:'}</span>
                          <span className="text-[10px] text-emerald-400 font-bold">Iqamah</span>
                        </label>
                        <input
                          type="text"
                          value={settings.jummaJamaat || '01:45 PM'}
                          onChange={(e) => setSettings({ ...settings, jummaJamaat: e.target.value })}
                          placeholder="01:45 PM"
                          className="w-full px-3 py-2 bg-stone-950 border border-emerald-500 rounded-lg text-white font-mono text-sm font-bold focus:outline-none focus:border-emerald-400 ring-1 ring-emerald-500/50"
                        />
                      </div>

                      {/* Khateeb Name */}
                      <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                        <label className="block text-[11px] font-medium text-stone-300 mb-1 flex items-center justify-between">
                          <span>{isUrdu ? '6. خطیبِ مسجد کا نام (Khateeb):' : '6. Khateeb Name:'}</span>
                          <span className="text-[10px] text-stone-400 font-normal">Scholar</span>
                        </label>
                        <input
                          type="text"
                          value={settings.jummaKhateebUr || ''}
                          onChange={(e) => setSettings({ ...settings, jummaKhateebUr: e.target.value, jummaKhateebEn: e.target.value })}
                          placeholder="حضرت مولانا یونس منصوری صاحب"
                          className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-white text-sm focus:outline-none focus:border-teal-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VIDEOS & LIVE STREAM PORTAL SETTINGS ("add portal vedio video option") */}
            {activeTab === 'video' && (
              <div className="space-y-5 max-h-[58vh] overflow-y-auto pr-1">
                {/* Intro banner */}
                <div className="p-3.5 rounded-xl bg-stone-950/90 border border-rose-900/40 text-xs text-stone-300 flex items-start gap-2.5">
                  <Tv className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">
                      {isUrdu ? 'جامع مسجد عثمانِ غنی ویڈیو پورٹل و لائیو نشریات' : 'Mosque Video Portal & Live Stream Settings'}
                    </span>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      {isUrdu
                        ? 'جمعۃ المبارک کے خطبات، درسِ قرآن کے ویڈیو لنکس، یوٹیوب لائیو نشریات اور مسجد کی ویڈیو گیلری کا مکمل انتظام کریں۔'
                        : 'Configure Friday sermons, daily Dars-e-Quran YouTube/MP4 videos, 24/7 live streams, and manage the mosque video playlist.'}
                    </p>
                  </div>
                </div>

                {/* Section Visibility & Live Mode Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {isUrdu ? 'ہوم پیج پر ویڈیو سیکشن دکھائیں' : 'Show Video Section on Home Page'}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {isUrdu ? 'پورٹل پر ویڈیو سیکشن کو آن یا آف کریں' : 'Enable / disable video player on homepage'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.mediaSettings?.showVideoSection !== false}
                        onChange={(e) => {
                          setSettings((prev) => ({
                            ...prev,
                            mediaSettings: {
                              ...prev.mediaSettings,
                              showVideoSection: e.target.checked,
                            },
                          }));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-xs font-bold text-white block">
                          {isUrdu ? 'براہِ راست لائیو نشریات موڈ (Live Stream)' : 'Live Broadcast Stream Mode'}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {isUrdu ? 'ویڈیو پر "🔴 LIVE" لائیو کا سرخ بیج دکھائے گا' : 'Displays pulsing red LIVE badge on portal'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(settings.mediaSettings?.isLiveStream)}
                        onChange={(e) => {
                          setSettings((prev) => ({
                            ...prev,
                            mediaSettings: {
                              ...prev.mediaSettings,
                              isLiveStream: e.target.checked,
                            },
                          }));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>

                {/* FEATURED VIDEO URL & DETAILS */}
                <div className="p-4 rounded-xl bg-stone-950 border border-rose-800/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-bold text-white">
                        {isUrdu ? 'مرکزی نمایاں ویڈیو کی ترتیبات (Featured Video)' : 'Featured Video Settings'}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                      Main Video Player
                    </span>
                  </div>

                  {/* Video URL Input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-300 mb-1">
                      {isUrdu ? 'ویڈیو یا یوٹیوب لنک (YouTube / Video URL):' : 'YouTube / Video Stream URL:'}
                    </label>
                    <input
                      type="text"
                      value={settings.mediaSettings?.featuredVideoUrl || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        setSettings((prev) => ({
                          ...prev,
                          mediaSettings: {
                            ...prev.mediaSettings,
                            featuredVideoUrl: url,
                          },
                        }));
                      }}
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      className="w-full px-3 py-2 bg-stone-900 border border-rose-700/60 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-rose-400"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      {isUrdu
                        ? 'یوٹیوب، لائیو اسٹریم، یا ڈائریکٹ MP4 ویڈیو کا کوئی بھی لنک درج کریں'
                        : 'Supports YouTube watch links, youtu.be, shorts, YouTube Live, or direct MP4 files.'}
                    </span>
                  </div>

                  {/* Metadata fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-400 mb-1">
                        {isUrdu ? 'ویڈیو کا عنوان اردو (Title Urdu):' : 'Video Title (Urdu):'}
                      </label>
                      <input
                        type="text"
                        value={settings.mediaSettings?.featuredVideoTitleUr || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettings((prev) => ({
                            ...prev,
                            mediaSettings: {
                              ...prev.mediaSettings,
                              featuredVideoTitleUr: val,
                            },
                          }));
                        }}
                        placeholder="جمعۃ المبارک کا روح پرور خطاب"
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:outline-none focus:border-rose-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-400 mb-1">
                        {isUrdu ? 'ویڈیو کا عنوان انگریزی (Title English):' : 'Video Title (English):'}
                      </label>
                      <input
                        type="text"
                        value={settings.mediaSettings?.featuredVideoTitleEn || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettings((prev) => ({
                            ...prev,
                            mediaSettings: {
                              ...prev.mediaSettings,
                              featuredVideoTitleEn: val,
                            },
                          }));
                        }}
                        placeholder="Friday Juma Bayan & Khutbah"
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:outline-none focus:border-rose-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-400 mb-1">
                        {isUrdu ? 'مقرر / خطیب کا نام (Speaker / Scholar):' : 'Speaker / Scholar:'}
                      </label>
                      <input
                        type="text"
                        value={settings.mediaSettings?.featuredVideoSpeakerUr || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettings((prev) => ({
                            ...prev,
                            mediaSettings: {
                              ...prev.mediaSettings,
                              featuredVideoSpeakerUr: val,
                              featuredVideoSpeakerEn: val,
                            },
                          }));
                        }}
                        placeholder="حضرت مولانا یونس منصوری صاحب (خطیب جامع مسجد)"
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:outline-none focus:border-rose-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-400 mb-1">
                        {isUrdu ? 'ویڈیو کیٹیگری (Category):' : 'Video Category:'}
                      </label>
                      <select
                        value={settings.mediaSettings?.featuredVideoCategory || 'juma'}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setSettings((prev) => ({
                            ...prev,
                            mediaSettings: {
                              ...prev.mediaSettings,
                              featuredVideoCategory: val,
                            },
                          }));
                        }}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:outline-none focus:border-rose-400"
                      >
                        <option value="juma">جمعۃ المبارک کے بیانات (Friday Sermons)</option>
                        <option value="dars">درسِ قرآن و حدیث (Dars-e-Quran)</option>
                        <option value="tilawat">تلاوتِ کلام پاک (Quran Recitation)</option>
                        <option value="live">براہِ راست نشریات (Live Broadcast)</option>
                        <option value="tour">مسجد کا تعارف و خدمات (Mosque Profile)</option>
                      </select>
                    </div>
                  </div>

                  {/* Instant Video Test Preview Box */}
                  {settings.mediaSettings?.featuredVideoUrl && (
                    <div className="space-y-2 pt-2 border-t border-stone-800">
                      <span className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                        <Play className="w-3 h-3 text-emerald-400" />
                        <span>{isUrdu ? 'فوری ویڈیو لائیو پری ویو (Instant Preview Test):' : 'Instant Video Player Preview:'}</span>
                      </span>
                      <div className="relative aspect-video max-w-md rounded-xl overflow-hidden bg-black border border-stone-800 shadow-lg">
                        {getEmbedVideoUrl(settings.mediaSettings.featuredVideoUrl).embedUrl ? (
                          getEmbedVideoUrl(settings.mediaSettings.featuredVideoUrl).isDirectVideo ? (
                            <video
                              src={getEmbedVideoUrl(settings.mediaSettings.featuredVideoUrl).embedUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <iframe
                              src={getEmbedVideoUrl(settings.mediaSettings.featuredVideoUrl).embedUrl}
                              title="Preview"
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-stone-500">
                            Invalid URL
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 1-CLICK CURATED ISLAMIC VIDEO PRESETS */}
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{isUrdu ? 'اسلامی و مسجد ویڈیو پری سیٹس (1-Click Ready Presets)' : 'Curated Islamic Video Presets'}</span>
                    </h5>
                    <span className="text-[10px] text-stone-400">Click to set instantly</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    {isUrdu
                      ? 'کسی بھی ویڈیو پر کلک کر کے فوری طور پر مرکزی نمایاں ویڈیو بنا دیں:'
                      : 'Click any ready video below to immediately set as Featured Video:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {CURATED_VIDEO_PRESETS.map((vid) => (
                      <div
                        key={vid.id}
                        onClick={() => {
                          setSettings((prev) => ({
                            ...prev,
                            mediaSettings: {
                              ...prev.mediaSettings,
                              featuredVideoUrl: vid.videoUrl,
                              featuredVideoTitleUr: vid.titleUr,
                              featuredVideoTitleEn: vid.titleEn,
                              featuredVideoSpeakerUr: vid.speakerUr,
                              featuredVideoSpeakerEn: vid.speakerEn,
                              featuredVideoCategory: vid.category,
                              isLiveStream: Boolean(vid.isLive),
                            },
                          }));
                          setSavedToast(true);
                          setTimeout(() => setSavedToast(false), 2500);
                        }}
                        className="group cursor-pointer p-2 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/60 transition-all flex flex-col justify-between"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-2">
                          <img
                            src={vid.thumbnailUrl || '/images/usman_ghani_masjid_interior.jpg'}
                            alt={vid.titleEn}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white/90 fill-current" />
                          </div>
                          {vid.duration && (
                            <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] text-white font-mono">
                              {vid.duration}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-800 text-amber-300 font-bold uppercase mb-1 inline-block">
                            {vid.category}
                          </span>
                          <h6 className="text-[11px] font-bold text-stone-200 line-clamp-2 group-hover:text-white">
                            {isUrdu ? vid.titleUr : vid.titleEn}
                          </h6>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VIDEO PLAYLIST MANAGER (ADD / EDIT / DELETE) */}
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>{isUrdu ? 'مسجد ویڈیو پلے لسٹ مینیجر (Video Playlist Manager)' : 'Mosque Video Playlist Manager'}</span>
                    </h5>

                    {!isAddingNewVideo && !editingVideoId && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewVideo(true);
                          setVideoForm({
                            titleUr: '',
                            titleEn: '',
                            speakerUr: 'حضرت مولانا یونس منصوری صاحب',
                            speakerEn: 'Maulana Younus Mansori',
                            category: 'juma',
                            videoUrl: '',
                            duration: '30:00',
                            date: new Date().toLocaleDateString(),
                            isLive: false,
                            thumbnailUrl: '/images/usman_ghani_masjid_interior.jpg',
                          });
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'نئی ویڈیو شامل کریں' : 'Add Video'}</span>
                      </button>
                    )}
                  </div>

                  {/* Add / Edit Video Inline Form */}
                  {(isAddingNewVideo || editingVideoId) && (
                    <div className="p-3.5 rounded-xl bg-stone-900 border border-emerald-600/60 space-y-3 animate-in fade-in">
                      <span className="text-xs font-bold text-emerald-300 block border-b border-stone-800 pb-1.5">
                        {isAddingNewVideo
                          ? (isUrdu ? 'نئی ویڈیو شامل کریں' : 'Add New Video to Playlist')
                          : (isUrdu ? 'ویڈیو میں ترمیم کریں' : 'Edit Video Item')}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-stone-300 mb-1">
                            {isUrdu ? 'ویڈیو یا یوٹیوب لنک (Video URL):' : 'Video URL:'}
                          </label>
                          <input
                            type="text"
                            value={videoForm.videoUrl || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-white text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-medium text-stone-400 mb-1">
                            {isUrdu ? 'عنوان اردو (Title Urdu):' : 'Title (Urdu):'}
                          </label>
                          <input
                            type="text"
                            value={videoForm.titleUr || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, titleUr: e.target.value })}
                            placeholder="جمعہ کا تفسیری خطاب"
                            className="w-full px-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-medium text-stone-400 mb-1">
                            {isUrdu ? 'عنوان انگریزی (Title English):' : 'Title (English):'}
                          </label>
                          <input
                            type="text"
                            value={videoForm.titleEn || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, titleEn: e.target.value })}
                            placeholder="Friday Sermon Topic"
                            className="w-full px-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-medium text-stone-400 mb-1">
                            {isUrdu ? 'مقرر / خطیب (Speaker):' : 'Speaker:'}
                          </label>
                          <input
                            type="text"
                            value={videoForm.speakerUr || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, speakerUr: e.target.value, speakerEn: e.target.value })}
                            placeholder="حضرت مولانا یونس منصوری صاحب"
                            className="w-full px-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-medium text-stone-400 mb-1">
                            {isUrdu ? 'کیٹیگری (Category):' : 'Category:'}
                          </label>
                          <select
                            value={videoForm.category || 'juma'}
                            onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value as any })}
                            className="w-full px-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-white text-xs"
                          >
                            <option value="juma">جمعۃ المبارک کے بیانات</option>
                            <option value="dars">درسِ قرآن و حدیث</option>
                            <option value="tilawat">تلاوتِ کلام پاک</option>
                            <option value="live">براہِ راست نشریات</option>
                            <option value="tour">مسجد تعارف</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingNewVideo(false);
                            setEditingVideoId(null);
                            setVideoForm({});
                          }}
                          className="px-3 py-1 rounded text-stone-400 hover:text-white text-xs"
                        >
                          {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!videoForm.titleUr && !videoForm.titleEn) return;
                            const currentList = settings.mediaSettings?.videoList || CURATED_VIDEO_PRESETS;
                            let updatedList: MosqueVideoItem[];

                            if (isAddingNewVideo) {
                              const newItem: MosqueVideoItem = {
                                id: `vid-${Date.now()}`,
                                titleUr: videoForm.titleUr || videoForm.titleEn || 'ویڈیو',
                                titleEn: videoForm.titleEn || videoForm.titleUr || 'Video',
                                speakerUr: videoForm.speakerUr,
                                speakerEn: videoForm.speakerEn,
                                category: videoForm.category || 'juma',
                                videoUrl: videoForm.videoUrl || '',
                                duration: videoForm.duration || '25:00',
                                date: videoForm.date || 'Recent',
                                isLive: Boolean(videoForm.isLive),
                                thumbnailUrl: videoForm.thumbnailUrl || '/images/usman_ghani_masjid_interior.jpg',
                              };
                              updatedList = [newItem, ...currentList];
                            } else {
                              updatedList = currentList.map((item) =>
                                item.id === editingVideoId
                                  ? ({ ...item, ...videoForm } as MosqueVideoItem)
                                  : item
                              );
                            }

                            setSettings((prev) => ({
                              ...prev,
                              mediaSettings: {
                                ...prev.mediaSettings,
                                videoList: updatedList,
                              },
                            }));
                            setIsAddingNewVideo(false);
                            setEditingVideoId(null);
                            setVideoForm({});
                            setSavedToast(true);
                            setTimeout(() => setSavedToast(false), 2500);
                          }}
                          className="px-3 py-1 rounded bg-emerald-600 text-stone-950 font-bold text-xs"
                        >
                          {isUrdu ? 'محفوظ کریں' : 'Save Video'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* List of current videos */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {(settings.mediaSettings?.videoList || CURATED_VIDEO_PRESETS).map((video) => (
                      <div
                        key={video.id}
                        className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-7 rounded overflow-hidden bg-black shrink-0">
                            <img
                              src={video.thumbnailUrl || '/images/usman_ghani_masjid_interior.jpg'}
                              alt={video.titleEn}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-stone-200 block truncate">
                              {isUrdu ? video.titleUr : video.titleEn}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {video.category} • {video.duration || 'Video'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingVideoId(video.id);
                              setVideoForm({ ...video });
                              setIsAddingNewVideo(false);
                            }}
                            className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const currentList = settings.mediaSettings?.videoList || CURATED_VIDEO_PRESETS;
                              const updatedList = currentList.filter((v) => v.id !== video.id);
                              setSettings((prev) => ({
                                ...prev,
                                mediaSettings: {
                                  ...prev.mediaSettings,
                                  videoList: updatedList,
                                },
                              }));
                            }}
                            className="p-1.5 rounded hover:bg-red-950 text-stone-400 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DARS-E-QURAN & PROGRAMS MANAGEMENT */}
            {activeTab === 'dars' && (
              <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>{isUrdu ? 'درسِ قرآن و بیانات کا انتظام' : 'Dars-e-Quran & Weekly Programs'}</span>
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {isUrdu
                        ? 'روزانہ درس، ہفتہ وار مجالس، خطیب و قاری کا نام، اوقات، اور پوسٹر تصاویر تبدیل کریں'
                        : 'Manage daily Tafseer, weekly lectures, speakers, topics, and poster pictures'}
                    </p>
                  </div>

                  {!isAddingNewDars && !editingDarsId && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewDars(true);
                        setDarsForm({
                          titleUr: '',
                          titleEn: '',
                          speakerUr: 'حضرت مولانا یونس منصوری صاحب',
                          speakerEn: 'Maulana Younus Mansori',
                          timingUr: 'روزانہ بعد نمازِ فجر',
                          timingEn: 'Daily after Fajr',
                          topicUr: 'تفسیر قرآن و مسنون دعائیں',
                          topicEn: 'Tafseer-ul-Quran & Masnoon Duas',
                          locationUr: 'مرکزی نماز ہال',
                          locationEn: 'Main Prayer Hall',
                          imageUrl: CURATED_IMAGE_PRESETS[0].url,
                          active: true,
                        });
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'نیا درس پروگرام شامل کریں' : 'Add New Dars'}</span>
                    </button>
                  )}
                </div>

                {/* Form to Add or Edit Dars */}
                {(isAddingNewDars || editingDarsId) && (
                  <div className="p-4 rounded-xl bg-stone-950 border border-amber-700/60 space-y-3.5 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <span className="text-xs font-bold text-amber-300">
                        {isAddingNewDars
                          ? isUrdu ? 'نیا درس پروگرام' : 'New Dars Program'
                          : isUrdu ? 'درس پروگرام میں ترمیم' : 'Edit Dars Program'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewDars(false);
                          setEditingDarsId(null);
                          setDarsForm({});
                        }}
                        className="text-stone-400 hover:text-white text-xs"
                      >
                        ✕ {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'عنوان (اردو):' : 'Title (Urdu):'}
                        </label>
                        <input
                          type="text"
                          value={darsForm.titleUr || ''}
                          onChange={(e) => setDarsForm({ ...darsForm, titleUr: e.target.value })}
                          placeholder="روزانہ بعد نماز فجر درسِ قرآن و تفسیر"
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs font-urdu text-right focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'عنوان (English):' : 'Title (English):'}
                        </label>
                        <input
                          type="text"
                          value={darsForm.titleEn || ''}
                          onChange={(e) => setDarsForm({ ...darsForm, titleEn: e.target.value })}
                          placeholder="Daily Morning Dars-e-Quran & Tafseer"
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'مقرر / استاد (اردو):' : 'Speaker / Scholar (Urdu):'}
                        </label>
                        <input
                          type="text"
                          value={darsForm.speakerUr || ''}
                          onChange={(e) => setDarsForm({ ...darsForm, speakerUr: e.target.value })}
                          placeholder="حضرت مولانا یونس منصوری صاحب"
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs font-urdu text-right focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'مقرر / استاد (English):' : 'Speaker / Scholar (English):'}
                        </label>
                        <input
                          type="text"
                          value={darsForm.speakerEn || ''}
                          onChange={(e) => setDarsForm({ ...darsForm, speakerEn: e.target.value })}
                          placeholder="Maulana Younus Mansori (Khateeb)"
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'اوقات و دن (اردو):' : 'Timing & Days (Urdu):'}
                        </label>
                        <input
                          type="text"
                          value={darsForm.timingUr || ''}
                          onChange={(e) => setDarsForm({ ...darsForm, timingUr: e.target.value })}
                          placeholder="روزانہ بعد نمازِ فجر (15 منٹ)"
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs font-urdu text-right focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'اوقات و دن (English):' : 'Timing & Days (English):'}
                        </label>
                        <input
                          type="text"
                          value={darsForm.timingEn || ''}
                          onChange={(e) => setDarsForm({ ...darsForm, timingEn: e.target.value })}
                          placeholder="Daily immediately after Fajr (15 mins)"
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'موضوع و تفصیل (اردو):' : 'Topic / Surah Subject (Urdu):'}
                        </label>
                        <input
                          type="text"
                          value={darsForm.topicUr || ''}
                          onChange={(e) => setDarsForm({ ...darsForm, topicUr: e.target.value })}
                          placeholder="تفسیر سورۃ البقرہ، آسان ترجمہ و فہم قرآن مع روزمرہ کی مسنون دعائیں"
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs font-urdu text-right focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      {/* Picture & Poster Selector */}
                      <div className="sm:col-span-2 p-3 rounded-xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <img
                            src={darsForm.imageUrl || CURATED_IMAGE_PRESETS[0].url}
                            alt="Poster Preview"
                            className="w-14 h-14 rounded-lg object-cover border border-amber-500/50 shadow-md shrink-0"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {isUrdu ? 'درسِ قرآن کا پوسٹر / تصویر' : 'Dars Poster Picture'}
                            </span>
                            <span className="text-[10px] text-stone-400 line-clamp-1 max-w-xs">
                              {darsForm.imageUrl || 'Default Islamic Quran Image'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setImagePickerTarget({
                              type: 'dars_item',
                              darsId: editingDarsId || undefined,
                            });
                          }}
                          className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>{isUrdu ? 'تصویر منتخب کریں' : 'Change Picture'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewDars(false);
                          setEditingDarsId(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs"
                      >
                        {isUrdu ? 'منسوخ' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveDars}
                        className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs"
                      >
                        {isUrdu ? 'محفوظ کریں' : 'Save Program'}
                      </button>
                    </div>
                  </div>
                )}

                {/* List of active Dars programs */}
                <div className="space-y-3">
                  {(settings.darsPrograms || []).map((prog) => (
                    <div
                      key={prog.id}
                      className="p-3.5 rounded-xl bg-stone-950/90 border border-stone-800 hover:border-amber-700/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={prog.imageUrl || CURATED_IMAGE_PRESETS[0].url}
                          alt={prog.titleEn}
                          className="w-14 h-14 rounded-xl object-cover border border-stone-700 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-white">
                              {isUrdu ? prog.titleUr : prog.titleEn}
                            </h5>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                prog.active
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-stone-800 text-stone-500'
                              }`}
                            >
                              {prog.active ? (isUrdu ? 'فعال' : 'Active') : isUrdu ? 'غیر فعال' : 'Inactive'}
                            </span>
                          </div>

                          <p className="text-xs text-amber-300 font-medium mt-0.5">
                            {isUrdu ? prog.speakerUr : prog.speakerEn}
                          </p>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            ⏰ {isUrdu ? prog.timingUr : prog.timingEn} | 📍 {isUrdu ? prog.locationUr : prog.locationEn}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800">
                        <button
                          type="button"
                          onClick={() => handleToggleDarsActive(prog.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                            prog.active
                              ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                              : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {prog.active ? (isUrdu ? 'بند کریں' : 'Disable') : isUrdu ? 'فعال کریں' : 'Enable'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingDarsId(prog.id);
                            setIsAddingNewDars(false);
                            setDarsForm(prog);
                          }}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-amber-950 hover:text-amber-300 text-stone-300 transition-colors"
                          title="Edit Dars"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDars(prog.id)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 hover:text-rose-300 text-stone-300 transition-colors"
                          title="Delete Dars"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PICTURES & MEDIA CHANGER ("picture change and get more") */}
            {activeTab === 'media' && (
              <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-stone-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <p>
                    {isUrdu
                      ? 'یہاں سے آپ ہوم پیج وال پیپر، درسِ قرآن کے پوسٹرز، اور دارالقرآن کی تصاویر تبدیل کر سکتے ہیں یا نئی تصاویر منتخب کر سکتے ہیں۔'
                      : 'Customize background photos, Dars-e-Quran posters, and education pictures. Choose from presets, paste URL, or upload.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hero Wallpaper Card */}
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {isUrdu ? '1. ہوم پیج مرکزی تصویر (Hero Mosque Photo)' : '1. Hero Mosque Photo'}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">Main Wallpaper</span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden aspect-video border border-stone-800 group">
                      <img
                        src={settings.mediaSettings?.heroBannerImage || DEFAULT_MEDIA_SETTINGS.heroBannerImage}
                        alt="Hero Wallpaper"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setImagePickerTarget({ type: 'hero' })}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-lg"
                        >
                          {isUrdu ? 'تصویر تبدیل کریں' : 'Change Image'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setImagePickerTarget({ type: 'hero' })}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white rounded-lg text-xs font-semibold border border-stone-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isUrdu ? 'ہوم پیج تصویر تبدیل کریں' : 'Change Hero Picture'}</span>
                    </button>
                  </div>

                  {/* Dars-e-Quran Poster Card */}
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {isUrdu ? '2. درسِ قرآن و تفسیر پوسٹر (Dars Poster)' : '2. Dars-e-Quran Poster'}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">Quran Lecture</span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden aspect-video border border-stone-800 group">
                      <img
                        src={settings.mediaSettings?.darsPosterImage || DEFAULT_MEDIA_SETTINGS.darsPosterImage}
                        alt="Dars Poster"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setImagePickerTarget({ type: 'dars_poster' })}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold shadow-lg"
                        >
                          {isUrdu ? 'پوسٹر تبدیل کریں' : 'Change Poster'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setImagePickerTarget({ type: 'dars_poster' })}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white rounded-lg text-xs font-semibold border border-stone-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isUrdu ? 'درسِ قرآن پوسٹر تبدیل کریں' : 'Change Dars Poster'}</span>
                    </button>
                  </div>
                </div>

                {/* Islamic Photo Presets Quick Preview Gallery */}
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                  <h5 className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isUrdu ? 'اسلامی و مساجد تصاویر کا ذخیرہ (Curated Islamic Library)' : 'Curated Islamic & Mosque Library'}</span>
                  </h5>
                  <p className="text-[11px] text-stone-400">
                    {isUrdu
                      ? 'کسی بھی تصویر پر کلک کر کے فوری طور پر ہوم وال پیپر یا درس کے پوسٹر کے لیے منتخب کریں:'
                      : 'Click any photo below to instantly set as Hero Wallpaper or Dars Poster:'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {CURATED_IMAGE_PRESETS.map((item) => (
                      <div
                        key={item.id}
                        className="group relative rounded-xl overflow-hidden border border-stone-800 bg-stone-900 aspect-video"
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-center">
                          <span className="text-[10px] text-white font-medium line-clamp-2">
                            {item.title}
                          </span>
                          <div className="flex gap-1 justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSettings((prev) => ({
                                  ...prev,
                                  mediaSettings: { ...prev.mediaSettings, heroBannerImage: item.url },
                                }));
                                setSavedToast(true);
                                setTimeout(() => setSavedToast(false), 2500);
                              }}
                              className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold"
                              title="Set as Hero Wallpaper"
                            >
                              Set Hero
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSettings((prev) => ({
                                  ...prev,
                                  mediaSettings: { ...prev.mediaSettings, darsPosterImage: item.url },
                                }));
                                setSavedToast(true);
                                setTimeout(() => setSavedToast(false), 2500);
                              }}
                              className="px-1.5 py-0.5 rounded bg-amber-600 text-white text-[9px] font-bold"
                              title="Set as Dars Poster"
                            >
                              Set Dars
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ANNOUNCEMENTS MANAGEMENT */}
            {activeTab === 'announcements' && (
              <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <span>{isUrdu ? 'اعلانات و نوٹس بورڈ کا انتظام' : 'Notice Board & Announcements'}</span>
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {isUrdu
                        ? 'جمعہ کے بیانات، تعلیمی داخلے، فلاحی کیمپ یا نمازِ جنازہ کے اعلانات شامل و ایڈٹ کریں'
                        : 'Add or edit Friday topics, madrasah admissions, and community welfare notices'}
                    </p>
                  </div>

                  {!isAddingNewAnn && !editingAnnId && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewAnn(true);
                        setAnnForm({
                          titleUr: '',
                          titleEn: '',
                          category: 'general',
                          date: new Date().toISOString().split('T')[0],
                          hijriDate: 'Safar 1448 AH',
                          contentUr: '',
                          contentEn: '',
                          badgeUr: 'اہم اعلان',
                          badgeEn: 'Notice',
                          important: false,
                        });
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'نیا اعلان شامل کریں' : 'Add Notice'}</span>
                    </button>
                  )}
                </div>

                {/* Form to Add / Edit Announcement */}
                {(isAddingNewAnn || editingAnnId) && (
                  <div className="p-4 rounded-xl bg-stone-950 border border-emerald-700/60 space-y-3.5 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <span className="text-xs font-bold text-emerald-300">
                        {isAddingNewAnn
                          ? isUrdu ? 'نیا اعلان' : 'New Notice'
                          : isUrdu ? 'اعلان میں ترمیم' : 'Edit Notice'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewAnn(false);
                          setEditingAnnId(null);
                          setAnnForm({});
                        }}
                        className="text-stone-400 hover:text-white text-xs"
                      >
                        ✕ {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'اعلان کا عنوان (اردو):' : 'Title (Urdu):'}
                        </label>
                        <input
                          type="text"
                          value={annForm.titleUr || ''}
                          onChange={(e) => setAnnForm({ ...annForm, titleUr: e.target.value })}
                          placeholder="عنوان اردو میں درج کریں"
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs font-urdu text-right focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'اعلان کا عنوان (English):' : 'Title (English):'}
                        </label>
                        <input
                          type="text"
                          value={annForm.titleEn || ''}
                          onChange={(e) => setAnnForm({ ...annForm, titleEn: e.target.value })}
                          placeholder="Notice title in English"
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'کیٹیگری:' : 'Category:'}
                        </label>
                        <select
                          value={annForm.category || 'general'}
                          onChange={(e) =>
                            setAnnForm({ ...annForm, category: e.target.value as any })
                          }
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:border-emerald-400 focus:outline-none"
                        >
                          <option value="juma">Juma Khutbah (خطبات جمعہ)</option>
                          <option value="education">Education & Quran (تعلیم و حفظ)</option>
                          <option value="construction">Solar & Masjid (مسجد منصوبے)</option>
                          <option value="welfare">Welfare Camp (فلاحی کیمپ)</option>
                          <option value="janazah">Janazah Services (نمازِ جنازہ)</option>
                          <option value="general">General (عام اعلان)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'تاریخ:' : 'Date:'}
                        </label>
                        <input
                          type="date"
                          value={annForm.date || ''}
                          onChange={(e) => setAnnForm({ ...annForm, date: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'اعلان کی تفصیل (اردو):' : 'Full Content (Urdu):'}
                        </label>
                        <textarea
                          rows={2}
                          value={annForm.contentUr || ''}
                          onChange={(e) => setAnnForm({ ...annForm, contentUr: e.target.value })}
                          placeholder="مکمل تفصیلات اردو میں..."
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs font-urdu text-right focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-stone-300 mb-1">
                          {isUrdu ? 'اعلان کی تفصیل (English):' : 'Full Content (English):'}
                        </label>
                        <textarea
                          rows={2}
                          value={annForm.contentEn || ''}
                          onChange={(e) => setAnnForm({ ...annForm, contentEn: e.target.value })}
                          placeholder="Full details in English..."
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewAnn(false);
                          setEditingAnnId(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs"
                      >
                        {isUrdu ? 'منسوخ' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAnn}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs"
                      >
                        {isUrdu ? 'محفوظ کریں' : 'Save Notice'}
                      </button>
                    </div>
                  </div>
                )}

                {/* List of custom announcements */}
                <div className="space-y-2.5">
                  {(settings.customAnnouncements || []).map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3 rounded-xl bg-stone-950/90 border border-stone-800 hover:border-emerald-700/50 transition-all flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {isUrdu ? ann.titleUr : ann.titleEn}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-amber-300">
                            {ann.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                          {isUrdu ? ann.contentUr : ann.contentEn}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAnnId(ann.id);
                            setIsAddingNewAnn(false);
                            setAnnForm(ann);
                          }}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-emerald-950 hover:text-emerald-300 text-stone-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAnn(ann.id)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 hover:text-rose-300 text-stone-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: SEASONAL PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-3.5 max-h-[58vh] overflow-y-auto pr-1">
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isUrdu ? 'ایک کلک سے شیڈول تبدیل کریں' : 'One-Click Seasonal Timetable Presets'}</span>
                  </h4>
                  <p className="text-xs text-stone-400">
                    {isUrdu
                      ? 'موسم یا خاص مواقع کے مطابق ایک کلک سے تمام اوقات خودکار طور پر سیٹ کریں۔'
                      : 'Instantly apply pre-configured schedules for seasonal time changes or Ramadan.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Current Standard */}
                    <div className="p-3.5 rounded-xl bg-stone-900/90 border border-emerald-700/60 hover:border-emerald-500 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-emerald-300">
                            {isUrdu ? 'موجودہ شیڈول (نارتھ کراچی)' : 'Current Standard (North Karachi)'}
                          </span>
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">
                            Active
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">
                          Fajr 05:40 AM • Dhuhr 01:30 PM • Asr 05:30 PM • Isha 08:45 PM • Jumma 01:45 PM
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => applyPreset('current')}
                        className="mt-3 w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-lg text-xs transition-colors"
                      >
                        {isUrdu ? 'یہ شیڈول لاگو کریں' : 'Apply Standard'}
                      </button>
                    </div>

                    {/* Winter Standard */}
                    <div className="p-3.5 rounded-xl bg-stone-900/90 border border-sky-700/60 hover:border-sky-500 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-sky-300">
                            {isUrdu ? 'موسم سرما شیڈول (Winter)' : 'Winter Schedule'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">
                          Fajr 06:00 AM • Dhuhr 01:15 PM • Asr 04:45 PM • Isha 08:00 PM • Jumma 01:30 PM
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => applyPreset('winter')}
                        className="mt-3 w-full py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-stone-950 font-bold rounded-lg text-xs transition-colors"
                      >
                        {isUrdu ? 'موسم سرما شیڈول لگائیں' : 'Apply Winter'}
                      </button>
                    </div>

                    {/* Summer Standard */}
                    <div className="p-3.5 rounded-xl bg-stone-900/90 border border-amber-700/60 hover:border-amber-500 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-amber-300">
                            {isUrdu ? 'موسم گرما شیڈول (Summer)' : 'Summer Schedule'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">
                          Fajr 05:15 AM • Dhuhr 01:30 PM • Asr 05:30 PM • Isha 09:00 PM • Jumma 01:45 PM
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => applyPreset('summer')}
                        className="mt-3 w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors"
                      >
                        {isUrdu ? 'موسم گرما شیڈول لگائیں' : 'Apply Summer'}
                      </button>
                    </div>

                    {/* Ramadan Special */}
                    <div className="p-3.5 rounded-xl bg-stone-900/90 border border-teal-700/60 hover:border-teal-500 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-teal-300">
                            {isUrdu ? 'رمضان المبارک و تراویح' : 'Ramadan & Taraweeh'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">
                          Fajr 05:10 AM • Asr 05:15 PM • Isha 08:45 PM • Taraweeh 09:00 PM
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => applyPreset('ramadan')}
                        className="mt-3 w-full py-1.5 px-3 bg-teal-600 hover:bg-teal-500 text-stone-950 font-bold rounded-lg text-xs transition-colors"
                      >
                        {isUrdu ? 'رمضان شیڈول لگائیں' : 'Apply Ramadan'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: NOTICE & ALERT BANNER */}
            {activeTab === 'banner' && (
              <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {isUrdu ? 'ہوم پیج الرٹ بینر دکھائیں' : 'Show Live Announcement Banner'}
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {isUrdu
                          ? 'نمازیوں کے لیے اہم اعلان (جیسے نمازِ جنازہ، وقت میں تبدیلی یا رمضان کا پیغام)'
                          : 'Displays a prominent header notice across the top of the mosque application'}
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showAlertBanner || false}
                        onChange={(e) =>
                          setSettings({ ...settings, showAlertBanner: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        {isUrdu ? 'اعلان کا متن (English):' : 'Notice Text (English):'}
                      </label>
                      <input
                        type="text"
                        value={settings.alertBannerEn || ''}
                        onChange={(e) =>
                          setSettings({ ...settings, alertBannerEn: e.target.value })
                        }
                        placeholder="e.g. Fajr Jamaat is now at 05:40 AM. Please arrive on time."
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        {isUrdu ? 'اعلان کا متن (Urdu):' : 'Notice Text (Urdu):'}
                      </label>
                      <input
                        type="text"
                        value={settings.alertBannerUr || ''}
                        onChange={(e) =>
                          setSettings({ ...settings, alertBannerUr: e.target.value })
                        }
                        placeholder="مثال: فجر کی نماز باجماعت اب 05:40 پر ادا کی جائے گی۔"
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-xs font-urdu text-right focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-800">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2 bg-stone-800 hover:bg-rose-950/80 hover:text-rose-300 text-stone-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-stone-700 hover:border-rose-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ڈیفالٹ پر ری سیٹ کریں' : 'Reset to Defaults'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  {isUrdu ? 'بند کریں' : 'Close'}
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-initial px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-950/40 transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUrdu ? 'تبدیلیاں محفوظ کریں' : 'Save & Publish Live'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* POPUP IMAGE SELECTOR DIALOG (For picking presets, pasting URL, or uploading) */}
      {imagePickerTarget && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-stone-900 border border-amber-500/60 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <h4 className="text-base font-bold text-white">
                  {isUrdu ? 'تصویر تبدیل کریں یا منتخب کریں' : 'Select or Change Picture'}
                </h4>
              </div>
              <button
                onClick={() => setImagePickerTarget(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Option A: Paste Image URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-300">
                {isUrdu ? 'طریقہ 1: انٹرنیٹ سے تصویر کا لنک (Image URL) درج کریں:' : 'Option 1: Enter direct Image URL:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or any image URL"
                  className="flex-1 px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={!customImageUrl.trim()}
                  onClick={() => handleSelectImagePreset(customImageUrl.trim())}
                  className="px-4 py-2 bg-emerald-600 disabled:bg-stone-800 disabled:text-stone-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-lg text-xs transition-colors"
                >
                  {isUrdu ? 'لاگو کریں' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Option B: Local File Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-300">
                {isUrdu ? 'طریقہ 2: موبائل یا کمپیوٹر سے تصویر منتخب کریں:' : 'Option 2: Upload picture from device:'}
              </label>
              <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-stone-700 hover:border-amber-400 rounded-xl bg-stone-950/60 cursor-pointer text-stone-300 hover:text-white text-xs transition-colors">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>{isUrdu ? 'ڈیوائس سے تصویر منتخب کریں (Click to browse)' : 'Click to browse & upload image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Option C: Curated Library */}
            <div className="space-y-2 pt-2 border-t border-stone-800">
              <label className="block text-xs font-semibold text-stone-300">
                {isUrdu ? 'طریقہ 3: ہمارے اسلامی ذخیرے سے تصویر منتخب کریں (ایک کلک):' : 'Option 3: Choose from Curated Islamic Library:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {CURATED_IMAGE_PRESETS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectImagePreset(item.url)}
                    className="group relative rounded-xl overflow-hidden border border-stone-700 hover:border-amber-400 aspect-video text-left transition-all"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-2 py-1 bg-amber-600 text-stone-950 font-bold text-[10px] rounded shadow">
                        {isUrdu ? 'منتخب کریں' : 'Select'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setImagePickerTarget(null)}
                className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 hover:text-white text-xs"
              >
                {isUrdu ? 'بند کریں' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
