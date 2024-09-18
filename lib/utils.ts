import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

export function generatePastMonths(count: number = 12): string[] {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  console.log(`Current Date: ${currentDate.toISOString()}`);
  console.log(`Current Month: ${currentMonth}, Current Year: ${currentYear}`);

  const result = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const monthString = `${months[date.getMonth()]} '${date.getFullYear().toString().slice(-2)}`;
    result.push(monthString);
    console.log(`Generated month: ${monthString}`);
  }
  return result;
}
