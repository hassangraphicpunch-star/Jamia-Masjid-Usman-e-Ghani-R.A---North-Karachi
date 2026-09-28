import { QurbaniBookingRecord, QurbaniStatusStage } from '../types';
import { INITIAL_QURBANI_BOOKINGS } from '../data/qurbaniData';

const STORAGE_KEY = 'alkhidmat_qurbani_bookings_v1';

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
  qurbaniType: 'cow_share' | 'full_cow' | 'goat' | 'waqf_deserving' | 'waqf_gaza';
  sharesCount: number;
  day: 'day1' | 'day2' | 'day3';
  preferredCenterId?: string;
}): QurbaniBookingRecord {
  const all = getStoredQurbaniBookings();
  const randomNum = Math.floor(11000 + Math.random() * 88000);
  const receiptNo = `AK-${randomNum}`;
  const tokenCode = `TK-${Math.floor(10 + Math.random() * 89)}`;

  const dayMapUr: Record<string, string> = {
    day1: 'پہلا دن (10 ذوالحجہ)',
    day2: 'دوسرا دن (11 ذوالحجہ)',
    day3: 'تیسرا دن (12 ذوالحجہ)',
  };

  const amountMap: Record<string, number> = {
    cow_share: 24000,
    full_cow: 168000,
    goat: 38000,
    waqf_deserving: 22000,
    waqf_gaza: 24000,
  };

  const netWeightMap: Record<string, number> = {
    cow_share: 14.5 * data.sharesCount,
    full_cow: 105,
    goat: 18,
    waqf_deserving: 14.5 * data.sharesCount,
    waqf_gaza: 15 * data.sharesCount,
  };

  const newRecord: QurbaniBookingRecord = {
    receiptNo,
    tokenCode,
    bookerNameEn: data.bookerNameEn || 'Valued Donor',
    bookerNameUr: data.bookerNameUr || 'معزز صاحبِ قربانی',
    phone: data.phone,
    cnic: data.cnic || '42101-*******-*',
    bookingDate: new Date().toISOString().split('T')[0],
    qurbaniType: data.qurbaniType,
    sharesCount: data.sharesCount,
    shareHolderNames: [data.bookerNameUr || data.bookerNameEn || 'صاحبِ قربانی'],
    day: data.day,
    dayUr: dayMapUr[data.day] || 'پہلا دن',
    timeSlot: '10:00 AM - 11:30 AM',
    timeSlotUr: 'صبح 10:00 بجے تا 11:30 بجے',
    currentStage: 'booked',
    animalTagNo: `TAG-KHI-${Math.floor(3000 + Math.random() * 6000)} (مختص کیا جا رہا ہے)`,
    slaughterLocation: {
      en: 'Alkhidmat Mega Slaughtering Hub, Super Highway, Karachi',
      ur: 'الخدمت میگا سلاٹر ہب، سپر ہائی وے، کراچی',
    },
    pickupLocation: {
      en: 'ST-11 Jamia Masjid Usman-e-Ghani Center, Sector 5-A/1 North Karachi',
      ur: 'مرکز جامع مسجد عثمانِ غنی رضی اللہ عنہ، ST-11 سیکٹر 5-A/1 نارتھ کراچی',
      addressUr: 'نزد 4-کے چورنگی و پاور ہاؤس، نارتھ کراچی، کراچی',
      addressEn: 'Near 4-K Chowrangi & Power House, Sector 5-A/1, North Karachi',
      counterNo: 'Counter # 02',
      contactPerson: 'مولانا یونس منصوری / برادر ارسلان',
      contactPhone: '0323-3469424',
    },
    meatDetails: {
      netWeightKg: netWeightMap[data.qurbaniType] || 14.5,
      bonelessKg: Math.round((netWeightMap[data.qurbaniType] || 14.5) * 0.45 * 10) / 10,
      boneKg: Math.round((netWeightMap[data.qurbaniType] || 14.5) * 0.45 * 10) / 10,
      liverKg: Math.round((netWeightMap[data.qurbaniType] || 14.5) * 0.1 * 10) / 10,
      siriPayaIncluded: data.qurbaniType === 'full_cow' || data.qurbaniType === 'goat',
      packagingTypeUr: 'ہائیجینک فوڈ گریڈ تھیلوں و باکس میں پیکنگ',
    },
    payment: {
      amountPaid: (amountMap[data.qurbaniType] || 24000) * (data.qurbaniType === 'cow_share' || data.qurbaniType === 'waqf_deserving' || data.qurbaniType === 'waqf_gaza' ? data.sharesCount : 1),
      paymentMethod: 'Online Booking Reservation (Verification in Progress)',
      paymentStatus: 'paid',
    },
    timeline: [
      {
        stage: 'booked',
        labelEn: 'Booking Confirmed',
        labelUr: 'بکنگ تصدیق شدہ',
        completed: true,
        current: true,
        time: 'آج بذریعہ آن لائن پورٹل',
        noteUr: 'آپ کی بکنگ کامیابی سے درج ہو گئی ہے۔ رسید نمبر محفوظ رکھیں۔',
        noteEn: 'Online reservation confirmed. Please save receipt number.',
      },
      {
        stage: 'animal_allocated',
        labelEn: 'Animal Allocation',
        labelUr: 'جانور مختص',
        completed: false,
        current: false,
      },
      {
        stage: 'scheduled',
        labelEn: 'Slot Schedule',
        labelUr: 'سلاٹ مقرر',
        completed: false,
        current: false,
      },
      {
        stage: 'slaughtered',
        labelEn: 'Slaughter',
        labelUr: 'ذبح شرعی',
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
        labelEn: 'Pickup',
        labelUr: 'وصولی کیلئے تیار',
        completed: false,
        current: false,
      },
      {
        stage: 'completed',
        labelEn: 'Handover',
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
