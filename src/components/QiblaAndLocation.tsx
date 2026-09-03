import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Car,
  Clock,
  Building,
  Copy,
  Check,
  Layers,
} from 'lucide-react';
import { Language } from '../types';
import { MOSQUE_INFO } from '../data/mockData';
import { MOSQUE_COORDINATES } from '../services/prayerService';

interface QiblaAndLocationProps {
  language: Language;
}

export const QiblaAndLocation: React.FC<QiblaAndLocationProps> = ({
  language,
}) => {
  const [inquirySent, setInquirySent] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  const isUrdu = language === 'ur';

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setFormData({ name: '', phone: '', subject: 'general', message: '' });
    }, 3000);
  };

  const googleMapsUrl =
    MOSQUE_COORDINATES.mapsUrl ||
    `https://www.google.com/maps/place/Usman+Ghani+(R.A)+Masjid,+5-A%2F1,+North+Karachi/@25.0048211,67.0574599,18z`;
  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent('Usman Ghani (R.A) Masjid, 5-A/1, North Karachi, Karachi')}&t=&z=17&ie=UTF8&iwloc=&output=embed`;

  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${MOSQUE_COORDINATES.latDecimal}, ${MOSQUE_COORDINATES.lngDecimal}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  return (
    <section
      id="qibla-location"
      className="py-16 bg-stone-950 border-b border-stone-800/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'مقام، نقشہ و قبلہ رخ' : 'Mosque Location & Qibla Direction'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isUrdu ? (
              <span className="font-urdu text-3xl sm:text-5xl text-amber-300">
                جامع مسجد کا پتہ، رہنمائی اور سمتِ قبلہ
              </span>
            ) : (
              <span>Location, Directions & Qibla Compass</span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 mt-2">
            {isUrdu
              ? 'ایس ٹی 11، سیکٹر 5-اے/1، نارتھ کراچی - قریب 4-کے چورنگی و پاور ہاؤس'
              : 'ST-11 Sector 5-A/1, North Karachi, Karachi. Easy access from 4-K Chowrangi, Powerhouse, and Surjani Link.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Col: Interactive Qibla Compass & Location Coordinates */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Qibla Direction Visual Card */}
            <div className="rounded-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border border-emerald-600/40 p-6 shadow-xl relative overflow-hidden text-center">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-700 text-emerald-300 text-[11px] font-bold uppercase flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'سمتِ قبلہ برائے نارتھ کراچی' : 'Qibla Bearing'}</span>
                </span>
                <span className="font-mono text-xs text-amber-300 font-bold">
                  261.5° WNW
                </span>
              </div>

              {/* Graphical Compass Dial */}
              <div className="relative w-44 h-44 mx-auto my-3 flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30 animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-2 rounded-full border border-stone-700 bg-stone-950/80 shadow-inner" />
                
                {/* Cardinal Points */}
                <span className="absolute top-3 font-bold text-stone-400 text-xs">N</span>
                <span className="absolute bottom-3 font-bold text-stone-400 text-xs">S</span>
                <span className="absolute right-3 font-bold text-stone-400 text-xs">E</span>
                <span className="absolute left-3 font-bold text-stone-400 text-xs">W</span>

                {/* Kaaba Direction Indicator Arrow (261.5 deg) */}
                <div
                  className="absolute w-full h-full flex items-center justify-center pointer-events-none"
                  style={{ transform: 'rotate(261.5deg)' }}
                >
                  <div className="flex flex-col items-center -translate-y-8">
                    <div className="w-6 h-6 rounded-md bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center shadow-lg shadow-amber-900/50">
                      🕋
                    </div>
                    <div className="w-0.5 h-10 bg-gradient-to-b from-amber-400 to-transparent" />
                  </div>
                </div>

                {/* Center Core */}
                <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md z-10" />
              </div>

              <p className="text-xs text-stone-300 font-medium">
                {isUrdu
                  ? 'سیکٹر 5-اے/1 نارتھ کراچی سے خانہ کعبہ کی سمت 261.5 درجے مغرب-شمال-مغرب ہے۔'
                  : 'From Sector 5-A/1 North Karachi, the Holy Ka’aba in Makkah is at bearing 261.5° (West-North-West).'}
              </p>
            </div>

            {/* Landmark Entrance Gate Card */}
            <div className="rounded-2xl bg-stone-900/90 border border-amber-500/30 overflow-hidden shadow-xl">
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                  src="/images/masjid_gate.jpg"
                  alt="Jamia Masjid Usman Ghani Entrance Gate"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-stone-950/80 backdrop-blur-md border border-amber-500/40 text-[10px] font-bold text-amber-300">
                  {isUrdu ? 'مرکزی گیٹ' : 'Main Gate'}
                </div>
                <div className="absolute bottom-2.5 left-3 right-3">
                  <p className="text-[11px] font-arabic text-amber-300 font-bold">
                    اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ
                  </p>
                  <p className="text-xs font-bold text-white">
                    {isUrdu ? 'جامع مسجد عثمانِ غنی کا سرخ محرابی بابِ داخلہ' : 'Main Entrance Archway - ST-11 Sector 5-A/1'}
                  </p>
                </div>
              </div>
            </div>

            {/* Address & Nearby Routes */}
            <div className="rounded-2xl bg-stone-900/90 border border-stone-800 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>{isUrdu ? 'رسائی کے راستے و نشانیاں' : 'Directions & Routes'}</span>
              </h3>

              <ul className="space-y-2.5 text-xs text-stone-300">
                <li className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>From 4-K Chowrangi:</strong> Head 2 minutes south on Main Sector 5-A road towards ST-11.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>From Power House Chowrangi:</strong> Take Godhra Road North onto Sector 5-A/1 street.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>From Nagan Chowrangi:</strong> 10 mins drive via Andalib / North Karachi Expressway.
                  </span>
                </li>
              </ul>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'گوگل میپس پر کھولیں' : 'Open in Google Maps'}</span>
                </a>

                <span className="font-mono text-[11px] text-stone-400">
                  {MOSQUE_COORDINATES.lat} | {MOSQUE_COORDINATES.lng}
                </span>
              </div>
            </div>

          </div>

          {/* Right Col: Interactive Visual Map Preview & Contact / Dua Request Form */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Embedded Live Google Map Container */}
            <div className="rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shadow-2xl flex flex-col">
              
              {/* Map Header Bar */}
              <div className="p-3.5 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isUrdu ? 'گوگل لائیو میپ (سیکٹر 5-اے/1 نارتھ کراچی)' : 'Live Google Map (Sector 5-A/1, North Karachi)'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyCoordinates}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                    title="Copy GPS coordinates"
                  >
                    {copiedCoords ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">{isUrdu ? 'کاپی ہوگیا' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-400" />
                        <span>{isUrdu ? 'GPS کوآرڈینیٹس' : 'GPS Coordinates'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Google Maps Iframe */}
              <div className="relative w-full h-80 sm:h-96 bg-stone-950">
                <iframe
                  title="Jamia Masjid Usman-e-Ghani Google Map"
                  src={embedMapUrl}
                  className="w-full h-full border-0 filter contrast-105"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Floating Mosque Location Badge on Map */}
                <div className="absolute top-3 left-3 pointer-events-none bg-stone-950/90 backdrop-blur-md border border-emerald-500/40 rounded-xl px-3 py-2 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🕌</span>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">
                        {isUrdu ? 'جامع مسجد عثمانِ غنی (رضی اللہ عنہ)' : 'Jamia Masjid Usman-e-Ghani'}
                      </p>
                      <p className="text-[10px] text-amber-300">
                        ST-11, Sector 5-A/1, North Karachi
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Footer Bar with Navigation Direct Actions */}
              <div className="p-3.5 bg-stone-950 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-400">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {isUrdu
                      ? '4-کے چورنگی اور پاور ہاؤس کے قریب باآسانی قابل رسائی'
                      : 'Accessible via 4-K Chowrangi & Powerhouse'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <span>{isUrdu ? 'گوگل میپس پر راستہ دیکھیں' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Community Inquiry / Dua Request Form */}
            <div className="rounded-2xl bg-stone-900/90 border border-stone-800 p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{isUrdu ? 'مسجد انتظامیہ کو پیغام / دعا کی درخواست' : 'Contact Mosque Office / Dua Request'}</span>
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                {isUrdu
                  ? 'مسجد کے امور، نکاح، جنازہ یا کسی بھی شرعی رہنمائی کے لیے پیغام بھیجیں'
                  : 'Have a question for the Imam or wish to request special Duas during Friday Khutbah?'}
              </p>

              {inquirySent ? (
                <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-700 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">
                    {isUrdu ? 'آپ کا پیغام کامیابی سے موصول ہو گیا!' : 'Message Sent Successfully!'}
                  </h4>
                  <p className="text-xs text-stone-300">
                    {isUrdu
                      ? 'مسجد انتظامیہ جلد آپ کے نمبر پر رابطہ کرے گی۔ جزاکم اللہ۔'
                      : 'The mosque office will review your note and respond as needed.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-semibold mb-1">
                        {isUrdu ? 'آپ کا نام' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Muhammad Aslam"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 font-semibold mb-1">
                        {isUrdu ? 'فون یا واٹس ایپ نمبر' : 'Phone / WhatsApp'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0300-XXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      {isUrdu ? 'موضوع' : 'Subject'}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="general">{isUrdu ? 'عمومی سوال / معلومات' : 'General Inquiry'}</option>
                      <option value="dua">{isUrdu ? 'خصوصی دعا کی درخواست (جمعہ)' : 'Dua Request for Friday Bayan'}</option>
                      <option value="nikah">{isUrdu ? 'نکاح خوانی کا انتظام' : 'Nikah Ceremony Booking'}</option>
                      <option value="madrasah">{isUrdu ? 'تعلیمی معلومات' : 'Madrasah Admissions'}</option>
                      <option value="solar">{isUrdu ? 'تعمیرات و سولر تعاون' : 'Construction / Solar Support'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      {isUrdu ? 'پیغام' : 'Message Details'} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={isUrdu ? 'اپنا پیغام یہاں لکھیں...' : 'Write your message or Dua request...'}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'پیغام ارسال کریں' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
