const turkishMonths: string[] = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export function translateMonthToTurkish(month: number): string {
  if (month < 1 || month > 12) {
    return 'Geçersiz Ay';
  }
  return turkishMonths[month - 1];
}