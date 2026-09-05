import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Calendar,
  AlertCircle,
  Moon,
  Clock,
  Sparkles,
  Volume2,
  Trash2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { Language, AppNotification } from '../types';
import {
  getStoredNotifications,
  getReadNotificationIds,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/notificationService';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isUrdu = language === 'ur';
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const loadData = () => {
    setNotifications(getStoredNotifications().filter((n) => n.isActive));
    setReadIds(getReadNotificationIds());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => loadData();
    window.addEventListener('mosque_notifications_updated', handleUpdate);
    window.addEventListener('mosque_notifications_read_updated', handleUpdate);
    return () => {
      window.removeEventListener('mosque_notifications_updated', handleUpdate);
      window.removeEventListener('mosque_notifications_read_updated', handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(notifications.map((n) => n.id));
    setReadIds(notifications.map((n) => n.id));
  };

  const handleItemClick = (id: string) => {
    markNotificationAsRead(id);
    if (!readIds.includes(id)) {
      setReadIds([...readIds, id]);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ramadan':
        return <Moon className="w-4 h-4 text-amber-300" />;
      case 'prayer':
        return <Clock className="w-4 h-4 text-emerald-400" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-sky-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div
      id="notification-center-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/50 flex items-center justify-center text-emerald-300 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{isUrdu ? 'اعلانات و نوٹیفیکیشن سینٹر' : 'Notifications & Mosque Alerts'}</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold">
                    {unreadCount} {isUrdu ? 'نئے' : 'New'}
                  </span>
                )}
              </h3>
              <p className="text-xs text-stone-400">
                {isUrdu ? 'نماز کے اوقات، اہم اعلانات اور نوٹسز' : 'Live updates, prayer timings, and urgent announcements'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-2 py-1 rounded bg-stone-950/70 border border-stone-800"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isUrdu ? 'سب پڑھ لیں' : 'Read All'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-3 border-b border-stone-800/80 bg-stone-950/40 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'all', labelEn: 'All', labelUr: 'تمام' },
            { id: 'prayer', labelEn: 'Prayer Times', labelUr: 'اوقاتِ نماز' },
            { id: 'ramadan', labelEn: 'Ramadan', labelUr: 'رمضان المبارک' },
            { id: 'announcement', labelEn: 'Notices', labelUr: 'اہم اعلانات' },
            { id: 'event', labelEn: 'Community', labelUr: 'کمیونٹی سروسز' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {isUrdu ? tab.labelUr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-stone-400 space-y-2">
              <Bell className="w-10 h-10 text-stone-600 mx-auto" />
              <p className="text-xs">
                {isUrdu ? 'اس شعبے میں کوئی نیا اعلان نہیں ہے۔' : 'No notifications in this category.'}
              </p>
            </div>
          ) : (
            filteredNotifs.map((item) => {
              const isRead = readIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isRead
                      ? 'bg-stone-950/60 border-stone-800 hover:border-stone-700 opacity-80'
                      : 'bg-stone-950 border-emerald-500/50 hover:border-emerald-400 shadow-md ring-1 ring-emerald-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center">
                        {getCategoryIcon(item.category)}
                      </div>
                      <h4 className={`text-xs sm:text-sm font-bold ${isRead ? 'text-stone-300' : 'text-white'}`}>
                        {isUrdu ? item.titleUr : item.titleEn}
                      </h4>
                    </div>

                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1 animate-pulse" />
                    )}
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed pl-8">
                    {isUrdu ? item.messageUr : item.messageEn}
                  </p>

                  <div className="mt-2.5 pl-8 pt-2 border-t border-stone-900 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="capitalize font-mono">
                      {item.category} • {item.priority} priority
                    </span>
                    <a
                      href="https://wa.me/923233469424"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WA: 03233469424</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>{isUrdu ? 'مسجد عثمان غنی سیکٹر 5-اے/1' : 'Jamia Masjid Usman-e-Ghani'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
