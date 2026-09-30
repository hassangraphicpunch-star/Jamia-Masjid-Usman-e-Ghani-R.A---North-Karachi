import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Clock,
  MapPin,
  Building2,
  BookOpen,
  Calendar,
  CloudSun,
  ChevronDown,
  Phone,
  RotateCcw,
} from 'lucide-react';
import { Language, AdminPrayerSettings, PrayerTimesApiResponse } from '../types';
import { MOSQUE_INFO } from '../data/mockData';
import { KarachiWeatherData } from '../services/weatherService';

interface MosqueChatbotProps {
  language: Language;
  adminSettings?: AdminPrayerSettings;
  prayerData?: PrayerTimesApiResponse;
  weatherData?: KarachiWeatherData | null;
  onOpenMonthlyModal?: () => void;
  onOpenWeatherModal?: () => void;
  onOpenRamadanModal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  textUr: string;
  textEn: string;
  actionButtons?: {
    labelUr: string;
    labelEn: string;
    onClick?: () => void;
    query?: string;
  }[];
  timestamp: string;
}

export const MosqueChatbot: React.FC<MosqueChatbotProps> = ({
  language,
  adminSettings,
  prayerData,
  weatherData,
  onOpenMonthlyModal,
  onOpenWeatherModal,
  onOpenRamadanModal,
}) => {
  const isUrdu = language === 'ur';
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-welcome',
      sender: 'bot',
      textUr:
        'السلام علیکم ورحمۃ اللہ! جامع مسجد عثمانِ غنی (رضی اللہ عنہ)، سیکٹر 5-اے/1 نارتھ کراچی کے ڈیجیٹل ڈیسک میں خوش آمدید۔ آپ اوقاتِ نماز، جمعہ، مسجد لوکیشن، عطیات یا مدارس سے متعلق سوال پوچھ سکتے ہیں۔',
      textEn:
        'Assalamu Alaikum! Welcome to Jamia Masjid Usman-e-Ghani (R.A) North Karachi inquiry desk. How may I assist you with prayer times, Friday prayers, office donations, or facilities today?',
      actionButtons: [
        { labelUr: '🕌 نمازوں کے اوقات', labelEn: '🕌 Prayer Timings', query: 'prayer_times' },
        { labelUr: '👥 جمعہ کا شیڈول', labelEn: '👥 Friday Schedule', query: 'jumma' },
        { labelUr: '💰 مسجد عطیات', labelEn: '💰 Donations Policy', query: 'donations' },
        { labelUr: '📍 پتہ و لوکیشن', labelEn: '📍 Location & Map', query: 'location' },
        { labelUr: '📖 دارالقرآن حفظ', labelEn: '📖 Madrasah Hifz', query: 'madrasah' },
        { labelUr: '🌤️ کراچی موسم', labelEn: '🌤️ Karachi Weather', query: 'weather' },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages]);

  const generateResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase().trim();
    const fajr = adminSettings?.fajrJamaat || '05:50 AM';
    const dhuhr = adminSettings?.dhuhrJamaat || '01:30 PM';
    const asr = adminSettings?.asrJamaat || '05:00 PM';
    const maghrib = adminSettings?.maghribJamaat || '+5 mins after Azan';
    const isha = adminSettings?.ishaJamaat || '08:00 PM';
    const jumma = adminSettings?.jummaJamaat || '01:50 PM';
    const jummaKhateeb = isUrdu
      ? (adminSettings?.jummaKhateebUr || 'حضرت مولانا یونس منصوری صاحب')
      : (adminSettings?.jummaKhateebEn || 'Maulana Younus Mansori');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Prayer Times Query
    if (
      q.includes('prayer') ||
      q.includes('namaz') ||
      q.includes('نماز') ||
      q.includes('اوقات') ||
      q.includes('timing') ||
      q.includes('prayer_times') ||
      q.includes('fajr') ||
      q.includes('asr') ||
      q.includes('isha')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        textUr: `جامع مسجد عثمانِ غنی کے باجماعت اوقات درج ذیل ہیں:\n\n• فجر جماعت: ${fajr}\n• ظہر جماعت: ${dhuhr}\n• عصر جماعت: ${asr}\n• مغرب جماعت: ${maghrib}\n• عشاء جماعت: ${isha}\n• جمعہ جماعت: ${jumma} (خطیب: ${jummaKhateeb})\n\nنصف النہار شرعی اور زوال کے اوقات کے لیے ہوم پیج دیکھیں۔`,
        textEn: `Today's official congregation timings at Jamia Masjid Usman-e-Ghani:\n\n• Fajr Jamaat: ${fajr}\n• Dhuhr Jamaat: ${dhuhr}\n• Asr Jamaat: ${asr}\n• Maghrib: ${maghrib}\n• Isha Jamaat: ${isha}\n• Friday Jumma: ${jumma} (Khatib: ${jummaKhateeb})\n\nCheck the home screen for live countdowns & Zawal intervals.`,
        actionButtons: [
          { labelUr: 'ماہانہ ٹائم ٹیبل دیکھیں', labelEn: 'View Monthly Table', onClick: onOpenMonthlyModal },
          { labelUr: 'تقویمِ رمضان', labelEn: 'Ramadan 2027', onClick: onOpenRamadanModal },
        ],
        timestamp: now,
      };
    }

    // Jumma Query
    if (q.includes('jumma') || q.includes('juma') || q.includes('جمعہ') || q.includes('khutbah') || q.includes('خطبہ')) {
      const azan1 = adminSettings?.jummaAzan || '12:50 PM';
      const bayan = adminSettings?.jummaBayan || '01:10 PM';
      const azan2 = adminSettings?.jummaAzan2 || '01:40 PM';
      const khutbah = adminSettings?.jummaKhutbah || '01:45 PM';

      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        textUr: `جمعۃ المبارک کا مکمل شیڈول:\n\n• اذانِ اول: ${azan1}\n• درس و بیان: ${bayan}\n• اذانِ ثانی: ${azan2}\n• عربی خطبہ: ${khutbah}\n• جمعہ جماعت: ${jumma}\n\nخطیب: ${jummaKhateeb}\nامام: حضرت مولانا ہدایت اللہ صاحب`,
        textEn: `Friday Juma'ah congregation details:\n\n• 1st Azan: ${azan1}\n• Urdu Bayan: ${bayan}\n• 2nd Azan: ${azan2}\n• Arabic Khutbah: ${khutbah}\n• Jumma Jamaat: ${jumma}\n\nKhatib: ${jummaKhateeb}\nImam: Maulana Hidayatullah`,
        timestamp: now,
      };
    }

    // Donations & Funds Query
    if (
      q.includes('donate') ||
      q.includes('donation') ||
      q.includes('عطیہ') ||
      q.includes('عطیات') ||
      q.includes('فنڈ') ||
      q.includes('چندہ') ||
      q.includes('sound') ||
      q.includes('roof') ||
      q.includes('donations')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        textUr: `مسجد عطیات پالیسی:\n\n• جامع مسجد عثمان غنی کی ویب سائٹ پر کوئی آن لائن پیمنٹ گیٹ وے موجود نہیں ہے۔\n• تمام عطیات صرف اور صرف مسجد کے دفتر میں بالمشافہ وصول کیے جاتے ہیں۔\n• رقم جمع کرواتے ہی باضابطہ مہر و دستخط شدہ پرنٹڈ رسید لازماً وصول فرمائیں۔\n• دفتری اوقات: روزانہ صبح 9 تا رات 9 بجے\n• عطیات ہیلپ لائن: 03232456480`,
        textEn: `Mosque Donations Policy:\n\n• No online payment gateway is accepted on this website.\n• All contributions must be made directly in person at the Masjid Office.\n• A verified stamped physical receipt is provided immediately upon payment.\n• Office hours: Daily 9:00 AM – 9:00 PM\n• Donation Helpline: 03232456480`,
        actionButtons: [
          {
            labelUr: 'واٹس ایپ پر رابطہ (03232456480)',
            labelEn: 'WhatsApp (03232456480)',
            onClick: () => window.open('https://wa.me/923232456480', '_blank'),
          },
        ],
        timestamp: now,
      };
    }

    // Location & Directions Query
    if (
      q.includes('location') ||
      q.includes('address') ||
      q.includes('map') ||
      q.includes('پتہ') ||
      q.includes('مقام') ||
      q.includes('راستہ') ||
      q.includes('نارتھ کراچی') ||
      q.includes('khi')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        textUr: `جامع مسجد عثمانِ غنی (رضی اللہ عنہ) کا پتہ:\n\nپلاٹ نمبر ST-11، سیکٹر 5-اے/1، عثمان غنی چوک، نارتھ کراچی، کراچی۔\n\n• 4-K چورنگی سے: 2 منٹ جنوبی راستہ\n• پاور ہاؤس چورنگی سے: گودھرا روڈ کے ذریعے سیدھا راستہ\n• ناگن چورنگی سے: تقریباً 10 منٹ کی ڈرائیو`,
        textEn: `Jamia Masjid Usman-e-Ghani (R.A) Address:\n\nPlot ST-11, Sector 5-A/1, Usman Ghani Chowk, North Karachi, Karachi.\n\n• From 4-K Chowrangi: 2 minutes south on Main 5-A Road\n• From Power House Chowrangi: Via Godhra Road\n• From Nagan Chowrangi: ~10 minutes drive`,
        actionButtons: [
          {
            labelUr: 'گوگل میپس پر کھولیں',
            labelEn: 'Open Google Maps',
            onClick: () => window.open('https://maps.google.com/?q=24.9961,67.0673', '_blank'),
          },
        ],
        timestamp: now,
      };
    }

    // Madrasah Query
    if (q.includes('madrasah') || q.includes('madrasa') || q.includes('حفظ') || q.includes('ناظرہ') || q.includes('مدرسہ') || q.includes('quran')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        textUr: `دارالقرآن و مدرسہ حفظ و ناظرہ:\n\n• صبح کا وقت: 08:00 AM تا 11:30 AM (قاعدہ و ناظرہ قرآن کریم)\n• بعد ظہر تا مغرب: 02:30 PM تا 06:00 PM (حفظِ قرآن مجید مع تجوید)\n• بعد مغرب: روزانہ تجوید القرآن کلاس برائے نوخیز نوجوان و بالغان\n\nداخلہ معلومات کے لیے مسجد دفتر تشریف لائیں۔`,
        textEn: `Dar-ul-Quran Madrasah (Hifz & Nazra):\n\n• Morning Shift: 08:00 AM – 11:30 AM (Qaida & Nazra Quran)\n• Afternoon Shift: 02:30 PM – 06:00 PM (Full Hifz-ul-Quran with Tajweed)\n• Post-Maghrib: Adult Tajweed & Quran reading classes\n\nVisit the Masjid Office for admissions.`,
        timestamp: now,
      };
    }

    // Weather Query
    if (q.includes('weather') || q.includes('موسم') || q.includes('forecast') || q.includes('بارش') || q.includes('temp')) {
      const temp = weatherData ? `${weatherData.current.temperature}°C` : '28°C';
      const condUr = weatherData?.current.conditionUr || 'صاف موسم';
      const condEn = weatherData?.current.conditionEn || 'Clear Sky';
      const humidity = weatherData ? `${weatherData.current.relativeHumidity}%` : '55%';

      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        textUr: `کراچی کا لائیو موسم:\n\n• درجہ حرارت: ${temp}\n• کیفیت: ${condUr}\n• ہوا میں نمی: ${humidity}\n\nمسجد میں ائیر کنڈیشنڈ ہالز اور ٹھنڈے پینے کے پانی کا فلٹریشن پلانٹ موجود ہے۔`,
        textEn: `Karachi Live Weather:\n\n• Temperature: ${temp}\n• Condition: ${condEn}\n• Humidity: ${humidity}\n\nAir-conditioned prayer halls and cold filtered water are available at the mosque.`,
        actionButtons: [
          { labelUr: 'تفصیلی موسم و ۵ روزہ پیش گوئی', labelEn: 'View Full Weather Forecast', onClick: onOpenWeatherModal },
        ],
        timestamp: now,
      };
    }

    // Default polite response
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      textUr: `آپ کا پیغام موصول ہوا۔ جامع مسجد عثمانِ غنی (ST-11 سیکٹر 5-اے/1 نارتھ کراچی) سے متعلق کسی بھی سوال، نماز کے اوقات یا فنڈز کے لیے آپ نیچے دیے گئے بٹنز استعمال کر سکتے ہیں یا دفتری ہیلپ لائن 03232456480 پر رابطہ فرما سکتے ہیں۔`,
      textEn: `Thank you for your inquiry. For specific information regarding Jamia Masjid Usman-e-Ghani, prayer times, or in-person office contributions, feel free to use the quick buttons below or reach the office on 03232456480.`,
      actionButtons: [
        { labelUr: '🕌 اوقاتِ نماز', labelEn: '🕌 Prayer Timings', query: 'prayer_times' },
        { labelUr: '👥 خطبہ جمعہ', labelEn: '👥 Jumma Khutbah', query: 'jumma' },
        { labelUr: '💰 مسجد فنڈ و عطیات', labelEn: '💰 Donations', query: 'donations' },
        { labelUr: '📍 مسجد لوکیشن', labelEn: '📍 Location', query: 'location' },
      ],
      timestamp: now,
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      textUr: text,
      textEn: text,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const botResponse = generateResponse(text);
      setMessages((prev) => [...prev, botResponse]);
    }, 400);
  };

  const handleQuickQuery = (query: string) => {
    handleSend(query);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          id="btn-open-mosque-chatbot"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-950/80 border border-emerald-400/50 flex items-center gap-2 group transition-all duration-300 hover:scale-105"
          aria-label="Open Mosque Assistant Chat"
          title={isUrdu ? 'مسجد معاون / سوال پوچھیں' : 'Mosque Inquiry Assistant'}
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <span className="hidden sm:inline">
            {isUrdu ? 'مسجد معاون' : 'Mosque Help'}
          </span>
        </button>
      )}

      {/* Chat Window: Desktop Floating Card vs Mobile Bottom-Sheet Widget */}
      {isOpen && (
        <div
          id="mosque-chatbot-widget"
          className="fixed z-50 transition-all duration-300
            /* Mobile View (< 640px): Bottom Sheet */
            inset-x-0 bottom-0 max-h-[75vh] rounded-t-3xl border-t border-emerald-500/60 bg-stone-950/98 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-full
            /* Tablet & Desktop (>= 640px): Floating Bottom-Right Card */
            sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96 sm:max-h-[580px] sm:rounded-2xl sm:border sm:border-emerald-600/50"
          role="dialog"
          aria-label="Mosque Inquiry Chatbot"
        >
          {/* Mobile Top Drag Indicator */}
          <div className="sm:hidden pt-2 pb-1 flex justify-center bg-stone-950/90">
            <div className="w-12 h-1 bg-stone-700 rounded-full" />
          </div>

          {/* Header Bar */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-emerald-800/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {isUrdu ? 'جامع مسجد عثمانِ غنی معاون' : 'Mosque Assistant'}
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </div>
                <p className="text-[10px] text-stone-400 truncate">
                  {isUrdu ? 'ST-11 سیکٹر 5-اے/1 نارتھ کراچی' : 'ST-11 Sector 5-A/1 North Karachi'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setMessages(initialMessages)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title={isUrdu ? 'گفتگو دوبارہ شروع کریں' : 'Reset Conversation'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 text-xs leading-relaxed max-w-full">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[88%] sm:max-w-[85%] whitespace-pre-line break-words ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                      : 'bg-stone-900 text-stone-200 border border-stone-800 rounded-bl-none shadow-sm'
                  } ${isUrdu ? 'font-urdu' : ''}`}
                >
                  {isUrdu ? m.textUr : m.textEn}
                </div>

                {/* Message Action Buttons / Quick Chips */}
                {m.actionButtons && m.actionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {m.actionButtons.map((btn, bIdx) => (
                      <button
                        key={bIdx}
                        onClick={() => {
                          if (btn.onClick) {
                            btn.onClick();
                          } else if (btn.query) {
                            handleQuickQuery(btn.query);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-900/90 hover:bg-emerald-950 text-stone-300 hover:text-emerald-300 border border-stone-800 hover:border-emerald-600/60 text-[11px] font-medium transition-all"
                      >
                        {isUrdu ? btn.labelUr : btn.labelEn}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-stone-500 mt-1 font-mono px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 sm:p-3 bg-stone-900/90 border-t border-stone-800/80 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isUrdu
                  ? 'سوال لکھیں (مثلاً: نماز کا وقت، جمعہ، پتہ)...'
                  : 'Type a question (e.g. prayer times, jumma, address)...'
              }
              className="flex-1 px-3 py-2 rounded-xl bg-stone-950 border border-stone-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 placeholder:text-stone-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center transition-colors shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
