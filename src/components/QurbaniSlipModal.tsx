import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, Phone, Calendar, Clock, MapPin, QrCode } from 'lucide-react';
import { QurbaniBookingRecord, Language } from '../types';
import { ALKHIDMAT_QURBANI_INFO } from '../data/qurbaniData';

interface QurbaniSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: QurbaniBookingRecord | null;
  language: Language;
}

export const QurbaniSlipModal: React.FC<QurbaniSlipModalProps> = ({
  isOpen,
  onClose,
  booking,
  language,
}) => {
  if (!isOpen || !booking) return null;
  const isUrdu = language === 'ur';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white text-stone-900 rounded-2xl shadow-2xl overflow-hidden my-6 border-4 border-emerald-700 print:m-0 print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
        id="printable-qurbani-slip"
      >
        {/* Top Action Bar (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-3 bg-emerald-800 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-sm">
              {isUrdu ? 'الخدمت اجتماعی قربانی - باضابطہ ڈیجیٹل رسید' : 'Alkhidmat Ijtemai Qurbani - Official Digital Slip'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors shadow"
            >
              <Printer className="w-4 h-4" />
              <span>{isUrdu ? 'پرنٹ کریں' : 'Print Slip'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-950 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div className="p-6 sm:p-8 space-y-6 bg-amber-50/30">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-emerald-700 pb-5 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-xl bg-emerald-700 text-white flex flex-col items-center justify-center font-bold text-center shadow-md p-1">
                <span className="text-xs uppercase tracking-wider">Alkhidmat</span>
                <span className="text-[10px] text-emerald-200">الخدمت</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-emerald-900 tracking-tight">
                  الخدمت فاؤنڈیشن پاکستان
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-stone-600">
                  ALKHIDMAT IJTEMAI QURBANI 2026 / 1447 AH
                </p>
                <p className="text-xs text-emerald-700 font-medium">
                  {ALKHIDMAT_QURBANI_INFO.shariahBoardUr}
                </p>
              </div>
            </div>

            {/* Token Badge */}
            <div className="text-center sm:text-right border-2 border-emerald-600 rounded-xl p-2.5 bg-emerald-50">
              <div className="text-[11px] font-bold text-stone-500 uppercase">
                {isUrdu ? 'بکنگ رسید نمبر' : 'Receipt No'}
              </div>
              <div className="text-xl font-black text-emerald-800 font-mono tracking-wider">
                {booking.receiptNo}
              </div>
              <div className="text-xs font-bold text-amber-700 bg-amber-100 rounded px-2 py-0.5 mt-1 inline-block">
                ٹوکن: {booking.tokenCode}
              </div>
            </div>
          </div>

          {/* Booker & Animal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
              <div className="font-bold text-emerald-900 border-b border-stone-200 pb-1 flex items-center justify-between">
                <span>{isUrdu ? 'صاحبِ قربانی کی تفصیل' : 'Booker Information'}</span>
                <span className="text-stone-400 font-normal">#{booking.tokenCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isUrdu ? 'نام:' : 'Name:'}</span>
                <span className="font-bold text-stone-900">{booking.bookerNameUr} ({booking.bookerNameEn})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isUrdu ? 'شناختی کارڈ:' : 'CNIC:'}</span>
                <span className="font-mono font-semibold text-stone-800">{booking.cnic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isUrdu ? 'رابطہ فون:' : 'Phone:'}</span>
                <span className="font-mono font-semibold text-stone-800">{booking.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isUrdu ? 'تاریخِ بکنگ:' : 'Booking Date:'}</span>
                <span className="font-mono text-stone-700">{booking.bookingDate}</span>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
              <div className="font-bold text-emerald-900 border-b border-stone-200 pb-1 flex items-center justify-between">
                <span>{isUrdu ? 'قربانی و جانور کی تفصیل' : 'Sacrifice Specifications'}</span>
                <span className="text-emerald-700 font-bold">1447 AH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isUrdu ? 'نوعیت:' : 'Type:'}</span>
                <span className="font-bold text-stone-900">
                  {booking.qurbaniType === 'cow_share'
                    ? `گائے کا حصہ (${booking.sharesCount})`
                    : booking.qurbaniType === 'full_cow'
                    ? 'مکمل گائے (7 حصے)'
                    : booking.qurbaniType === 'goat'
                    ? 'بکرا / دنبہ'
                    : 'وقف برائے خیرات'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isUrdu ? 'جانور ٹیگ نمبر:' : 'Animal Tag No:'}</span>
                <span className="font-mono font-bold text-emerald-800">{booking.animalTagNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isUrdu ? 'مقررہ دن:' : 'Slaughter Day:'}</span>
                <span className="font-bold text-stone-900">{booking.dayUr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isUrdu ? 'سلاٹ وقت:' : 'Time Slot:'}</span>
                <span className="font-semibold text-stone-800">{booking.timeSlotUr}</span>
              </div>
            </div>
          </div>

          {/* Collection / Pickup Details Callout */}
          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-dashed border-emerald-600 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-emerald-950 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                {isUrdu ? 'گوشت وصولی مرکز و کاؤنٹر' : 'Collection Center & Counter'}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-700 text-white font-bold text-xs">
                {booking.pickupLocation.counterNo}
              </span>
            </div>
            <p className="font-bold text-stone-900 text-xs sm:text-sm">
              {booking.pickupLocation.ur}
            </p>
            <p className="text-xs text-stone-600">
              {booking.pickupLocation.addressUr}
            </p>
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-emerald-200/80 text-xs text-stone-700">
              <span>{isUrdu ? 'نگران رابطہ:' : 'Contact:'} <strong>{booking.pickupLocation.contactPerson}</strong> ({booking.pickupLocation.contactPhone})</span>
              <span className="text-emerald-800 font-bold">حفظانِ صحت کولڈ چین ترسیل</span>
            </div>
          </div>

          {/* Meat Package Specification */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs">
            <div className="font-bold text-stone-800 mb-2 border-b border-stone-200 pb-1">
              {isUrdu ? 'موصول ہونے والے گوشت کی مقدار و تقسیم (تخمینہ)' : 'Estimated Meat Package Breakdown'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-white p-2 rounded border border-stone-200">
                <div className="text-stone-500 text-[10px]">{isUrdu ? 'کل وزن' : 'Net Weight'}</div>
                <div className="text-sm font-black text-emerald-800 font-mono">~{booking.meatDetails.netWeightKg} KG</div>
              </div>
              <div className="bg-white p-2 rounded border border-stone-200">
                <div className="text-stone-500 text-[10px]">{isUrdu ? 'بون لیس گوشت' : 'Boneless'}</div>
                <div className="text-sm font-black text-stone-800 font-mono">~{booking.meatDetails.bonelessKg} KG</div>
              </div>
              <div className="bg-white p-2 rounded border border-stone-200">
                <div className="text-stone-500 text-[10px]">{isUrdu ? 'ہڈی مکس گوشت' : 'Mixed Meat'}</div>
                <div className="text-sm font-black text-stone-800 font-mono">~{booking.meatDetails.boneKg} KG</div>
              </div>
              <div className="bg-white p-2 rounded border border-stone-200">
                <div className="text-stone-500 text-[10px]">{isUrdu ? 'کلیجی' : 'Liver'}</div>
                <div className="text-sm font-black text-stone-800 font-mono">~{booking.meatDetails.liverKg} KG</div>
              </div>
            </div>
          </div>

          {/* Shariah & Operational Stamp */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-stone-300 text-xs text-stone-600 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg border border-dashed border-stone-400 flex items-center justify-center text-stone-400">
                <QrCode className="w-8 h-8 text-emerald-800" />
              </div>
              <div>
                <p className="font-semibold text-stone-800">الخدمت ویریفائیڈ کیو آر کوڈ</p>
                <p className="text-[11px] text-stone-500">موبائل اسکرین یا پرنٹ پر یہ ٹوکن کاؤنٹر پر دکھائیں</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="inline-block border-2 border-emerald-700 rounded-lg px-3 py-1 bg-emerald-50 text-emerald-900 font-bold text-xs">
                ✓ شریعہ و ویٹرنری تصدیق شدہ
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                ہیلپ لائن: 1023 | 021-111-503-504
              </p>
            </div>
          </div>

          {/* Note footer */}
          <p className="text-[10px] text-stone-400 text-center border-t border-stone-200 pt-2">
            یہ رسید الخدمت فاؤنڈیشن کی جانب سے خودکار کمپیوٹرائزڈ سسٹم کے تحت جاری کی گئی ہے۔ برائے مہربانی مقررہ وقت پر تشریف لا کر تعاون فرمائیں۔
          </p>

        </div>
      </div>
    </div>
  );
};
