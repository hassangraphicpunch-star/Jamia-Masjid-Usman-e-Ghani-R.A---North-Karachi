import { QurbaniBookingRecord, QurbaniStatusStage } from '../types';
import { INITIAL_QURBANI_BOOKINGS } from '../data/qurbaniData';

const STORAGE_KEY = 'alkhidmat_qurbani_bookings_v2';

export function getStoredQurbaniBookings(): QurbaniBookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading Qurbani bookings from localStorage:', err);
  }
  // Default seed
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_QURBANI_BOOKINGS));
  } catch {
    // ignore
  }
  return INITIAL_QURBANI_BOOKINGS;
}

export function saveQurbaniBookings(bookings: QurbaniBookingRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent('alkhidmat_qurbani_updated'));
  } catch (err) {
    console.error('Error saving Qurbani bookings:', err);
  }
}

export function searchQurbaniBooking(query: string): QurbaniBookingRecord | null {
  if (!query || !query.trim()) return null;
  const qClean = query.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const all = getStoredQurbaniBookings();

  // 1. Exact or partial match on receiptNo
  for (const b of all) {
    const rClean = b.receiptNo.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (rClean === qClean || rClean.includes(qClean) || qClean.includes(rClean)) {
      return b;
    }
  }

  // 2. Token Code match
  for (const b of all) {
    const tClean = b.tokenCode.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (tClean === qClean || tClean.includes(qClean)) {
      return b;
    }
  }

  // 3. CNIC match (digits only)
  const qDigits = query.replace(/\D/g, '');
  if (qDigits.length >= 5) {
    for (const b of all) {
      const cDigits = b.cnic.replace(/\D/g, '');
      if (cDigits.includes(qDigits) || qDigits.includes(cDigits)) {
        return b;
      }
    }
  }

  // 4. Phone number match (digits only)
  if (qDigits.length >= 6) {
    for (const b of all) {
      const pDigits = b.phone.replace(/\D/g, '');
      if (pDigits.includes(qDigits) || qDigits.includes(pDigits)) {
        return b;
      }
    }
  }

  // 5. Name match
  const qName = query.trim().toLowerCase();
  for (const b of all) {
    if (
      b.bookerNameEn.toLowerCase().includes(qName) ||
      b.bookerNameUr.includes(query.trim())
    ) {
      return b;
    }
  }

  return null;
}

export function advanceBookingStage(receiptNo: string): QurbaniBookingRecord | null {
  const all = getStoredQurbaniBookings();
  const idx = all.findIndex((b) => b.receiptNo === receiptNo);
  if (idx === -1) return null;

  const current = all[idx];
  const stages: QurbaniStatusStage[] = [
    'booked',
    'animal_allocated',
    'scheduled',
    'slaughtered',
    'butchering_packing',
    'ready_pickup',
    'completed',
  ];

  const currentStageIndex = stages.indexOf(current.currentStage);
  const nextStageIndex = (currentStageIndex + 1) % stages.length;
  const nextStage = stages[nextStageIndex];

  const nowTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const updatedTimeline = current.timeline.map((step) => {
    const stepIdx = stages.indexOf(step.stage);
    if (stepIdx < nextStageIndex) {
      return { ...step, completed: true, current: false };
    } else if (stepIdx === nextStageIndex) {
      return {
        ...step,
        completed: nextStage === 'completed',
        current: true,
        time: step.time || nowTime,
      };
    } else {
      return { ...step, completed: false, current: false };
    }
  });

  const updatedBooking: QurbaniBookingRecord = {
    ...current,
    currentStage: nextStage,
    timeline: updatedTimeline,
  };

  all[idx] = updatedBooking;
  saveQurbaniBookings(all);
  return updatedBooking;
}

export function createNewBookingInquiry(data: {
  bookerNameEn: string;
  bookerNameUr: string;
  phone: string;
  cnic: string;
  sharesCount: number;
}): QurbaniBookingRecord {
  const all = getStoredQurbaniBookings();
  const randomNum = Math.floor(10800 + Math.random() * 89000);
  const receiptNo = `AK-${randomNum}`;
  const tokenCode = `TK-${Math.floor(10 + Math.random() * 89)}`;
  const cowNumber = Math.min(30, Math.floor(1 + Math.random() * 30));

  const shares = Math.max(1, Math.min(7, data.sharesCount || 1));
  const amountPaid = 24000 * shares;
  const netWeightKg = Math.round(14.8 * shares * 10) / 10;
  const bonelessKg = Math.round(6.0 * shares * 10) / 10;
  const boneKg = Math.round(7.3 * shares * 10) / 10;
  const liverKg = Math.round(1.5 * shares * 10) / 10;

  const newRecord: QurbaniBookingRecord = {
    receiptNo,
    tokenCode,
    bookerNameEn: data.bookerNameEn || 'Valued Donor',
    bookerNameUr: data.bookerNameUr || 'معزز صاحبِ قربانی',
    phone: data.phone,
    cnic: data.cnic || '42101-*******-*',
    bookingDate: new Date().toISOString().split('T')[0],
    qurbaniType: 'cow_share',
    sharesCount: shares,
    shareHolderNames: [data.bookerNameUr || data.bookerNameEn || 'صاحبِ قربانی'],
    day: 'day1',
    dayUr: 'پہلا دن (10 ذوالحجہ)',
    timeSlot: '11:00 AM - 12:30 PM',
    timeSlotUr: 'صبح 11:00 بجے تا 12:30 بجے',
    currentStage: 'booked',
    animalTagNo: `گائے # ${cowNumber} / حصہ (کل 30 گائے کوٹہ - پہلا دن)`,
    slaughterLocation: {
      en: 'Alkhidmat Mega Slaughtering Hub, Super Highway, Karachi',
      ur: 'الخدمت میگا سلاٹر ہب، سپر ہائی وے، کراچی',
    },
    pickupLocation: {
      en: 'ST-11 Jamia Masjid Usman-e-Ghani Center, Sector 5-A/1 North Karachi (Self Collection Only)',
      ur: 'مرکز جامع مسجد عثمانِ غنی رضی اللہ عنہ، ST-11 سیکٹر 5-A/1 نارتھ کراچی (صرف خود وصولی)',
      addressUr: 'نزد 4-کے چورنگی و پاور ہاؤس، نارتھ کراچی، کراچی (صحن مسجد، کاؤنٹر نمبر 02)',
      addressEn: 'Near 4-K Chowrangi & Power House, Sector 5-A/1, North Karachi (Courtyard Counter # 02)',
      counterNo: 'Counter # 02 (Masjid Usman-e-Ghani Courtyard)',
      contactPerson: 'مولانا یونس منصوری / برادر ارسلان',
      contactPhone: '0323-3469424',
    },
    meatDetails: {
      netWeightKg,
      bonelessKg,
      boneKg,
      liverKg,
      siriPayaIncluded: false,
      packagingTypeUr: 'ہائیجینک فوڈ گریڈ تھیلوں و باکس میں کولڈ پیکنگ',
    },
    payment: {
      amountPaid,
      paymentMethod: 'Online Booking Reservation (Verification in Progress)',
      paymentStatus: 'paid',
    },
    timeline: [
      {
        stage: 'booked',
        labelEn: 'Booking Confirmed (Day 1)',
        labelUr: 'بکنگ تصدیق شدہ (عید کا پہلا دن)',
        completed: true,
        current: true,
        time: 'آج بذریعہ آن لائن پورٹل',
        noteUr: `گائے نمبر ${cowNumber} میں ${shares} حصہ کامیابی سے بک ہو گیا۔ عید کے پہلے دن جامع مسجد عثمان غنی سے خود وصولی کریں۔`,
        noteEn: `Booking of ${shares} cow share(s) confirmed for Day 1. Self collection at Jamia Masjid Usman-e-Ghani.`,
      },
      {
        stage: 'animal_allocated',
        labelEn: 'Cow Tag Allocated',
        labelUr: 'گائے مختص',
        completed: false,
        current: false,
      },
      {
        stage: 'scheduled',
        labelEn: 'Slaughter Slot',
        labelUr: 'سلاٹ مقرر (پہلا دن)',
        completed: false,
        current: false,
      },
      {
        stage: 'slaughtered',
        labelEn: 'Slaughter',
        labelUr: 'شرعی ذبح',
        completed: false,
        current: false,
      },
      {
        stage: 'butchering_packing',
        labelEn: 'Packing',
        labelUr: 'کٹائی و پیکنگ',
        completed: false,
        current: false,
      },
      {
        stage: 'ready_pickup',
        labelEn: 'Ready for Self-Collection',
        labelUr: 'جامع مسجد عثمان غنی خود وصولی',
        completed: false,
        current: false,
      },
      {
        stage: 'completed',
        labelEn: 'Handover Completed',
        labelUr: 'حوالگی مکمل',
        completed: false,
        current: false,
      },
    ],
    shariahSupervisorUr: 'مفتی طارق محمود صاحب (دارالعلوم کراچی)',
  };

  const updated = [newRecord, ...all];
  saveQurbaniBookings(updated);
  return newRecord;
}
