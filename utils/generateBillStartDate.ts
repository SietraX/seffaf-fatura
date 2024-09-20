export function generateBillStartDate(month: number): Date {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear();

  let year = currentYear;
  if (month > currentMonth) {
    year -= 1;
  }

  return new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
}