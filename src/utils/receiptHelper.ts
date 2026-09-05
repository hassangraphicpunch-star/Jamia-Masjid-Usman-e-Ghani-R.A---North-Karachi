// Utility to convert numbers to Urdu and English words for official mosque receipts

const ONES_EN = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS_EN = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

export function amountToWordsEn(amount: number): string {
  if (amount === 0) return 'Zero Rupees Only';
  if (amount < 0) return 'Negative Amount';

  function convertChunk(num: number): string {
    let str = '';
    if (num >= 100) {
      str += ONES_EN[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    if (num >= 20) {
      str += TENS_EN[Math.floor(num / 10)] + ' ';
      num %= 10;
    }
    if (num > 0) {
      str += ONES_EN[num] + ' ';
    }
    return str.trim();
  }

  let result = '';
  // Millions / Crores
  if (amount >= 10000000) {
    const crores = Math.floor(amount / 10000000);
    result += convertChunk(crores) + ' Crore ';
    amount %= 10000000;
  }
  // Lakhs (100,000)
  if (amount >= 100000) {
    const lakhs = Math.floor(amount / 100000);
    result += convertChunk(lakhs) + ' Lakh ';
    amount %= 100000;
  }
  // Thousands
  if (amount >= 1000) {
    const thousands = Math.floor(amount / 1000);
    result += convertChunk(thousands) + ' Thousand ';
    amount %= 1000;
  }
  if (amount > 0) {
    result += convertChunk(amount);
  }

  return result.trim() + ' Rupees Only';
}

export function amountToWordsUr(amount: number): string {
  if (amount <= 0) return 'صفر روپے فقط';

  if (amount === 500) return 'پانچ سو روپے فقط';
  if (amount === 1000) return 'ایک ہزار روپے فقط';
  if (amount === 2000) return 'دو ہزار روپے فقط';
  if (amount === 2500) return 'پچیس سو روپے فقط';
  if (amount === 5000) return 'پانچ ہزار روپے فقط';
  if (amount === 10000) return 'دس ہزار روپے فقط';
  if (amount === 20000) return 'بیس ہزار روپے فقط';
  if (amount === 25000) return 'پچیس ہزار روپے فقط';
  if (amount === 50000) return 'پچاس ہزار روپے فقط';
  if (amount === 100000) return 'ایک لاکھ روپے فقط';

  // Fallback composed string
  if (amount >= 100000) {
    const lakh = Math.floor(amount / 100000);
    const rem = amount % 100000;
    return `${lakh} لاکھ ${rem > 0 ? rem + ' ' : ''}روپے فقط`;
  }
  if (amount >= 1000) {
    const hazar = Math.floor(amount / 1000);
    const rem = amount % 1000;
    return `${hazar} ہزار ${rem > 0 ? rem + ' ' : ''}روپے فقط`;
  }
  return `${amount} روپے فقط`;
}
