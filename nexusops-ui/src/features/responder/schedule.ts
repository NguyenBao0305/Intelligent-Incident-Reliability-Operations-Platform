export const scheduleZones = { 'Asia/Ho_Chi_Minh': 420, 'Asia/Singapore': 480, UTC: 0 } as const;
export type ScheduleZone = keyof typeof scheduleZones;
export interface Shift { id: string; person: string; service: string; layer: 'Primary' | 'Secondary'; start: number; end: number }
export const scheduleServices = ['payments-api', 'order-worker', 'auth-service'];
export function wallDate(at: number, zone: ScheduleZone) { return new Date(at + scheduleZones[zone] * 60000).toISOString().slice(0, 10); }
export function wallTime(at: number, zone: ScheduleZone) { return new Date(at + scheduleZones[zone] * 60000).toISOString().slice(11, 16); }
export function fromWall(date: string, time: string, zone: ScheduleZone) { return Date.parse(`${date}T${time}:00Z`) - scheduleZones[zone] * 60000; }
export function addDays(date: string, days: number) { return new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10); }
export function weekStart(date: string) { const day = new Date(`${date}T12:00:00Z`).getUTCDay(); return addDays(date, -(day === 0 ? 6 : day - 1)); }
export function validateShift(shift: Shift, shifts: Shift[], now: number) {
  if (!Number.isFinite(shift.start) || !Number.isFinite(shift.end)) return 'Enter a valid start and end date/time.';
  if (!scheduleServices.includes(shift.service) || !['responder-demo', 'responder-quang', 'responder-mai'].includes(shift.person) || !['Primary', 'Secondary'].includes(shift.layer)) return 'Choose a valid service, member and coverage layer.';
  if (shift.end - shift.start < 30 * 60000) return 'A shift must last at least 30 minutes. Check the end date for overnight shifts.';
  if (shift.end - shift.start > 7 * 86400000) return 'Each shift can cover up to seven days.';
  if (shift.end <= now) return 'The shift must end in the future.';
  if (shifts.some(other => other.id !== shift.id && other.service === shift.service && other.layer === shift.layer && shift.start < other.end && shift.end > other.start)) return 'This service already has overlapping coverage in the same layer. Adjust the time or choose another layer.';
  return '';
}
export function hasPersonalCoverage(shifts: Shift[], now: number) { return shifts.some(shift => shift.person === 'responder-demo' && !validateShift(shift, shifts, now)); }

export interface ScheduleInfo { name: string; description: string; zone: ScheduleZone }
export const initialScheduleInfo: ScheduleInfo = { name: 'Platform Engineering on-call', description: '', zone: 'Asia/Ho_Chi_Minh' };
export interface RotationRule {
  people: string[]; service: string; layer: Shift['layer']; startDate: string;
  days: number; cadence: 1 | 7; weekdays: number[]; startTime: string; endTime: string; zone: ScheduleZone;
}
export function previewRotation(rule: RotationRule, existing: Shift[], now: number): { shifts: Shift[]; error: string } {
  const fail = (error: string) => ({ shifts: [], error });
  if (!rule.people.length || new Set(rule.people).size !== rule.people.length || rule.people.some(person => !['responder-demo', 'responder-quang', 'responder-mai'].includes(person))) return fail('Choose at least one unique team member.');
  if (![1, 7].includes(rule.cadence) || !Number.isInteger(rule.days) || rule.days < 1 || rule.days > 28) return fail('Choose a daily or weekly rotation over 1–28 days.');
  if (!rule.weekdays.length || rule.weekdays.some(day => !Number.isInteger(day) || day < 0 || day > 6)) return fail('Choose at least one valid day of the week.');
  if (!Object.hasOwn(scheduleZones, rule.zone) || !/^\d{4}-\d{2}-\d{2}$/.test(rule.startDate) || ![rule.startTime, rule.endTime].every(time => /^([01]\d|2[0-3]):[0-5]\d$/.test(time))) return fail('Enter valid dates, hours and timezone.');
  const anchor = fromWall(rule.startDate, rule.startTime, rule.zone);
  if (!Number.isFinite(anchor) || wallDate(anchor, rule.zone) !== rule.startDate) return fail('Enter a valid start date.');
  const shifts: Shift[] = [];
  for (let day = 0; day < rule.days; day++) {
    const date = addDays(rule.startDate, day);
    if (!rule.weekdays.includes(new Date(`${date}T12:00:00Z`).getUTCDay())) continue;
    const start = fromWall(date, rule.startTime, rule.zone);
    const endDate = rule.endTime <= rule.startTime ? addDays(date, 1) : date;
    const shift: Shift = { id: `rotation-preview-${day}`, person: rule.people[Math.floor(day / rule.cadence) % rule.people.length], service: rule.service, layer: rule.layer, start, end: fromWall(endDate, rule.endTime, rule.zone) };
    const error = validateShift(shift, [...existing, ...shifts], now);
    if (error) return fail(`${date}: ${error}`);
    shifts.push(shift);
  }
  return shifts.length ? { shifts, error: '' } : fail('No selected weekdays occur in this date range.');
}
