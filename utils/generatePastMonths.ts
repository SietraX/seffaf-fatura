
export const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

export function generatePastMonths(count: number = 12): string[] {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const result = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const monthString = `${months[date.getMonth()]} '${date.getFullYear().toString().slice(-2)}`;
    result.push(monthString);
  }
  return result;
}
