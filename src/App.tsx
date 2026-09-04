import React, { useState, useEffect, useCallback } from 'react';
import {
  Language,
  PrayerTimesApiResponse,
  AdminPrayerSettings,
  IqamahCountdownState,
} from './types';
import {
  fetchPrayerTimes,
  getLocalKarachiPrayerTimes,
  computeNextPrayer,
  calculateJamaatTimes,
  getStoredAdminSettings,
} from './services/prayerService';
import { azanAudioEngine } from './services/azanAudioService';
import { Navbar } from './components/Navbar';
import { HeroPrayerTimes } from './components/HeroPrayerTimes';
import { MosqueVideoSection } from './components/MosqueVideoSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { ServicesFacilities } from './components/ServicesFacilities';
import { DailyWisdomAndTasbih } from './components/DailyWisdomAndTasbih';
import { QiblaAndLocation } from './components/QiblaAndLocation';
import { DonationAndBank } from './components/DonationAndBank';
import { Footer } from './components/Footer';
import { MonthlyTimetableModal } from './components/MonthlyTimetableModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { AzanPlayerModal } from './components/AzanPlayerModal';
import { AzanPlayingBanner } from './components/AzanPlayingBanner';
import { IqamahAlertBanner } from './components/IqamahAlertBanner';

export default function App() {
  const [language, setLanguage] = useState<Language>('ur');
  const [prayerData, setPrayerData] = useState<PrayerTimesApiResponse>(() =>
    getLocalKarachiPrayerTimes(new Date())
  );
  const [adminSettings, setAdminSettings] = useState<AdminPrayerSettings>(() =>
    getStoredAdminSettings()
  );
  const [apiSource, setApiSource] = useState<'ummah_api' | 'aladhan_api' | 'karachi_offline'>('ummah_api');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [monthlyModalOpen, setMonthlyModalOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [azanModalOpen, setAzanModalOpen] = useState<boolean>(false);
  const [selectedAzanPrayer, setSelectedAzanPrayer] = useState<
    'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'
  >('fajr');
  const [activeSection, setActiveSection] = useState<string>('prayer-times');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [simulatedIqamah, setSimulatedIqamah] = useState<IqamahCountdownState | null>(null);

  // Load Prayer Times from Ummah API (with graceful fallback)
  const loadTimings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchPrayerTimes();
      setPrayerData(res.data);
      setApiSource(res.source);
    } catch (err) {
      console.warn('Error loading prayer times, using Karachi local calculation:', err);
      setPrayerData(getLocalKarachiPrayerTimes(new Date()));
      setApiSource('karachi_offline');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTimings();
  }, [loadTimings]);

  // Live timer tick every second for precision countdown & simulated countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());

      setSimulatedIqamah((prev) => {
        if (!prev) return null;
        const newSecs = Math.max(0, prev.secondsRemaining - 1);
        const isTimeForIqamah = newSecs === 0;
        const elapsed = prev.totalDurationSeconds - newSecs;
        const progressPercent = Math.min(
          100,
          Math.max(0, Math.round((elapsed / prev.totalDurationSeconds) * 100))
        );

        return {
          ...prev,
          secondsRemaining: newSecs,
          minutesRemaining: Math.floor(newSecs / 60),
          secondsPart: newSecs % 60,
          isTimeForIqamah,
          elapsedSeconds: elapsed,
          progressPercent,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute next prayer & countdown with admin settings overrides
  const jamaatTimes = calculateJamaatTimes(prayerData, adminSettings);
  const nextPrayer = computeNextPrayer(prayerData, jamaatTimes, currentTime, adminSettings);

  // Determine active effective Iqamah state
  const effectiveIqamah =
    simulatedIqamah !== null
      ? simulatedIqamah
      : nextPrayer.iqamahCountdown || null;

  // Format countdown string for navbar
  const formatCountdownPill = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const navbarCountdownStr = effectiveIqamah?.isIqamahPeriod
    ? effectiveIqamah.isTimeForIqamah
      ? language === 'ur'
        ? 'باجماعت اقامت!'
        : 'Iqamah Time!'
      : language === 'ur'
      ? `اقامت: ${effectiveIqamah.minutesRemaining}m ${effectiveIqamah.secondsPart.toString().padStart(2, '0')}s`
      : `Iqamah: ${effectiveIqamah.minutesRemaining}m ${effectiveIqamah.secondsPart.toString().padStart(2, '0')}s`
    : formatCountdownPill(nextPrayer.secondsRemaining);

  const navbarPrayerName = effectiveIqamah?.isIqamahPeriod
    ? {
        en: effectiveIqamah.prayerNameEn,
        ur: effectiveIqamah.prayerNameUr,
      }
    : {
        en: nextPrayer.nextPrayerNameEn,
        ur: nextPrayer.nextPrayerNameUr,
      };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      const yOffset = -70;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleOpenAzanModal = (
    prayerId?: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'
  ) => {
    if (prayerId) {
      setSelectedAzanPrayer(prayerId);
    }
    setAzanModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans ${language === 'ur' ? 'dir-rtl' : 'dir-ltr'}`}>
      
      {/* Live Floating Azan Banner (Appears when Adhan is actively playing) */}
      <AzanPlayingBanner
        language={language}
        onOpenDetails={() => setAzanModalOpen(true)}
      />

      {/* Live Floating Iqamah Banner (Appears when Iqamah is pending or zero-state reached) */}
      <IqamahAlertBanner
        language={language}
        iqamahState={effectiveIqamah}
        onScrollToPrayerTimes={() => handleNavigate('hero')}
      />

      {/* Navigation Header */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        nextPrayerInfo={{
          nameEn: navbarPrayerName.en,
          nameUr: navbarPrayerName.ur,
          countdownStr: navbarCountdownStr,
        }}
        audioMuted={audioMuted}
        setAudioMuted={setAudioMuted}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        onOpenAzanModal={() => handleOpenAzanModal()}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* 1. Hero & Prominent Prayer Schedule (Requested API integration for Karachi) */}
        <HeroPrayerTimes
          language={language}
          prayerData={prayerData}
          apiSource={apiSource}
          isLoading={isLoading}
          onRefresh={loadTimings}
          onOpenMonthlyModal={() => setMonthlyModalOpen(true)}
          onOpenAdminModal={() => setAdminModalOpen(true)}
          onOpenAzanModal={handleOpenAzanModal}
          adminSettings={adminSettings}
          nextPrayer={nextPrayer}
          audioMuted={audioMuted}
          setAudioMuted={setAudioMuted}
          simulatedIqamah={simulatedIqamah}
          onSetSimulatedIqamah={setSimulatedIqamah}
        />

        {/* 2. Announcements & Notice Board (Requested feature) */}
        <AnnouncementsSection
          language={language}
          adminSettings={adminSettings}
        />

        {/* 3. Mosque Video Portal & Friday Sermon Stream (Requested video option) */}
        <MosqueVideoSection
          language={language}
          adminSettings={adminSettings}
          onOpenAdminPortal={() => setAdminModalOpen(true)}
        />

        {/* 4. Mosque Facilities & Dar-ul-Quran Maktab */}
        <ServicesFacilities
          language={language}
        />

        {/* 5. Daily Quran/Hadith Wisdom & Interactive Digital Tasbih */}
        <DailyWisdomAndTasbih
          language={language}
        />

        {/* 6. Location ST-11 Sector 5-A/1 North Karachi, Directions & Qibla Bearing */}
        <QiblaAndLocation
          language={language}
        />

        {/* 7. Transparent Donation & Mosque Leadership Committee */}
        <DonationAndBank
          language={language}
        />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={handleNavigate}
        onOpenAdminModal={() => setAdminModalOpen(true)}
      />

      {/* Monthly Printable Timetable Modal */}
      <MonthlyTimetableModal
        isOpen={monthlyModalOpen}
        onClose={() => setMonthlyModalOpen(false)}
        language={language}
        adminSettings={adminSettings}
      />

      {/* Admin Namaz & Notice Portal Modal */}
      <AdminPortalModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        language={language}
        onSettingsSaved={(newSettings) => setAdminSettings({ ...newSettings })}
      />

      {/* Azan Voice Player & Post-Azan Dua Modal */}
      <AzanPlayerModal
        isOpen={azanModalOpen}
        onClose={() => setAzanModalOpen(false)}
        language={language}
        initialPrayerId={selectedAzanPrayer}
      />

    </div>
  );
}
