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
