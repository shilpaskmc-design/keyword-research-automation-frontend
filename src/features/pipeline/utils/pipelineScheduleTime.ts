const IST_OFFSET = '+05:30';
const MINIMUM_LEAD_TIME_MS = 5 * 60 * 1_000;
const CANCELLATION_CUTOFF_MS = 60 * 1_000;

interface ScheduleFormDateTime {
  date: string;
  time: string;
}

function getDateTimeParts(value: string): ScheduleFormDateTime | null {
  const instant = new Date(value);
  if (Number.isNaN(instant.getTime())) return null;

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(instant);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((candidate) => candidate.type === type)?.value;
  const year = part('year');
  const month = part('month');
  const day = part('day');
  const hour = part('hour');
  const minute = part('minute');

  return year && month && day && hour && minute
    ? { date: `${year}-${month}-${day}`, time: `${hour}:${minute}` }
    : null;
}

export function buildIstScheduleTimestamp(date: string, time: string): string | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!dateMatch || !timeMatch) return null;

  const [, yearText, monthText, dayText] = dateMatch;
  const [, hourText, minuteText] = timeMatch;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (hour > 23 || minute > 59) return null;

  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) return null;

  const timestamp = `${date}T${time}:00${IST_OFFSET}`;
  return Number.isNaN(new Date(timestamp).getTime()) ? null : timestamp;
}

export function isAtLeastFiveMinutesAhead(timestamp: string, now = Date.now()) {
  return new Date(timestamp).getTime() >= now + MINIMUM_LEAD_TIME_MS;
}

export function isInsideScheduleCutoff(timestamp: string, now = Date.now()) {
  const scheduledTime = new Date(timestamp).getTime();
  return Number.isFinite(scheduledTime) && now >= scheduledTime - CANCELLATION_CUTOFF_MS;
}

export function getIstScheduleFormValues(timestamp: string): ScheduleFormDateTime | null {
  return getDateTimeParts(timestamp);
}

export function formatPipelineScheduleTime(timestamp: string) {
  const instant = new Date(timestamp);
  if (Number.isNaN(instant.getTime())) return 'Schedule time unavailable';

  const date = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(instant);
  const time = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(instant);

  return `${date} • ${time.toUpperCase()} IST`;
}
