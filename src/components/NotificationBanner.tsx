import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight, X, AlertTriangle, Sparkles, MessageCircle } from 'lucide-react';
import { Language, AppNotification } from '../types';
import { getStoredNotifications } from '../services/notificationService';

interface NotificationBannerProps {
  language: Language;
  onOpenNotifications: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  language,
  onOpenNotifications,
}) => {
  const isUrdu = language === 'ur';
  const [activeNotif, setActiveNotif] = useState<AppNotification | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const loadTopNotification = () => {
    const list = getStoredNotifications().filter((n) => n.isActive);
    const urgent = list.find((n) => n.priority === 'high') || list[0] || null;
    setActiveNotif(urgent);
  };

  useEffect(() => {
    loadTopNotification();
    const handleUpdate = () => loadTopNotification();
    window.addEventListener('mosque_notifications_updated', handleUpdate);
    return () => window.removeEventListener('mosque_notifications_updated', handleUpdate);
  }, []);

  if (isDismissed || !activeNotif) return null;

  return (
    <div
      id="mosque-live-notification-banner"
      role="region"
      aria-label="Mosque Announcements and Alerts"
      className="bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950/90 border-b border-amber-500/40 px-2.5 sm:px-4 lg:px-8 py-1.5 sm:py-2 text-xs text-stone-200 transition-all duration-300 w-full overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Clickable Announcement Text Area */}
        <div
          onClick={onOpenNotifications}
          className="flex items-center gap-1.5 sm:gap-2.5 flex-1 min-w-0 cursor-pointer hover:opacity-95 transition-opacity"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenNotifications();
            }
          }}
          aria-label="Open Announcement Details"
        >
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>

          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px] sm:text-[10px] md:text-xs uppercase border border-amber-500/40 shrink-0">
            {isUrdu ? 'اہم اطلاع' : 'Important Notice'}
          </span>

          <p className="truncate text-[11px] sm:text-xs md:text-sm font-medium text-stone-100 min-w-0 flex-1">
            <span className="font-bold text-amber-200">
              {isUrdu ? activeNotif.titleUr : activeNotif.titleEn}:
            </span>{' '}
            <span className="text-stone-300">
              {isUrdu ? activeNotif.messageUr : activeNotif.messageEn}
            </span>
          </p>

          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold shrink-0 hover:text-emerald-300 transition-colors">
            <span>{isUrdu ? 'تفصیلات دیکھیں' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Action Buttons: Contact & Close */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <a
            href="https://wa.me/923233469424"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white text-[10px] sm:text-xs font-bold border border-emerald-600/50 shadow-sm transition-colors shrink-0 touch-manipulation min-h-[32px] sm:min-h-[36px]"
            title={isUrdu ? 'واٹس ایپ / رابطہ 03233469424' : 'WhatsApp / Helpline: 03233469424'}
            aria-label="WhatsApp Contact"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="hidden sm:inline font-mono">03233469424</span>
            <span className="sm:hidden text-[10px]">{isUrdu ? 'رابطہ' : 'Help'}</span>
          </a>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors shrink-0 touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center"
            title={isUrdu ? 'اطلاع بند کریں' : 'Dismiss notice'}
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
