import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isToday } from 'date-fns';

export function getTodayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatRelativeDate(dateString: string): string {
  try {
    const d = parseISO(dateString);
    if (isToday(d)) return `Today, ${format(d, 'MMM d')}`;
    return format(d, 'EEE, MMM d');
  } catch {
    return dateString;
  }
}

export function formatFullDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function getMonthDays(currentDate: Date): Date[] {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: startDate, end: endDate });
}

export function generateDynamicDate(daysOffset: number): string {
  return format(addDays(new Date(), daysOffset), 'yyyy-MM-dd');
}
