import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Layers, Plus, Sparkles, Trash2, X } from 'lucide-react';
import type { Profile } from './workspace-types';
import { addDays, fromWall, scheduleServices, scheduleZones, validateShift, wallDate, wallTime, weekStart } from './schedule';
import type { ScheduleZone, Shift } from './schedule';
import './schedule.css';

const dayLabel = (date: string, options: Intl.DateTimeFormatOptions) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { ...options, timeZone: 'UTC' });
export function SchedulePage({ profile, shifts, onShifts, onBack, now }: { profile: Profile; shifts: Shift[]; onShifts: (shifts: Shift[]) => void; onBack: () => void; now: number }) {
  const [zone, setZone] = useState<ScheduleZone>('Asia/Ho_Chi_Minh');
  const [week, setWeek] = useState(() => weekStart(wallDate(now, 'Asia/Ho_Chi_Minh')));
  const [service, setService] = useState('payments-api');
  const [layer, setLayer] = useState('all');
  const [editing, setEditing] = useState<Shift | null>(null);
  const [message, setMessage] = useState('');
  const members = [{ id: 'responder-demo', name: profile.name }, { id: 'responder-quang', name: 'Quang Tran' }, { id: 'responder-mai', name: 'Mai Pham' }];
  const days = Array.from({ length: 7 }, (_, index) => addDays(week, index));
  const visible = shifts.filter(shift => shift.service === service && (layer === 'all' || shift.layer === layer));
  const start = fromWall(week, '00:00', zone);
  const end = fromWall(addDays(week, 7), '00:00', zone);
  const weekShifts = visible.filter(shift => shift.start < end && shift.end > start);
  const primaryHours = weekShifts.filter(shift => shift.layer === 'Primary').reduce((sum, shift) => sum + (Math.min(end, shift.end) - Math.max(start, shift.start)) / 3600000, 0);
  function create(at = Math.ceil((now + 60000) / 3600000) * 3600000) { setEditing({ id: crypto.randomUUID(), person: 'responder-demo', service, layer: layer === 'Secondary' ? 'Secondary' : 'Primary', start: at, end: at + 8 * 3600000 }); }

  return <div className="sc-page">
    <button className="ws-text-button" onClick={onBack}><ArrowLeft size={15} />Back to onboarding</button>
    <section className="sc-hero"><div><span className="sc-eyebrow"><Sparkles size={14} /> A LITTLE CLARITY, EVERY SHIFT</span><h2>Good coverage.<br /><em>Calmer handovers.</em></h2><p>Give every service a clear window of care.<br />Plan your team's on-call hours in one shared view.</p><button className="sc-create" onClick={() => create()}><Plus size={17} />Create a shift</button></div><div className="sc-art" aria-hidden="true"><div className="sc-art-shadow" /><div className="sc-art-card sc-art-back" /><div className="sc-art-card sc-art-front"><span>NEXUSOPS / ON CALL</span><CalendarDays size={30} /><strong>Your next shift,<br />beautifully in view.</strong><div className="sc-art-bars"><i /><i /><i /><i /><i /></div><small><span /> Clarity across every timezone</small></div><span className="sc-art-badge"><Check size={17} />Ready for handover</span></div></section>
    <div className="sc-summary"><div><CalendarDays size={18} /><span><strong>{weekShifts.length}</strong> shifts this week</span></div><div><Clock3 size={18} /><span><strong>{primaryHours.toFixed(1)} / 168 h</strong> primary coverage in this view</span></div><div><Layers size={18} /><span><strong>One-off shifts</strong> · no automatic rotation</span></div></div>
    <p className="sc-demo">Schedule planning preview · This shared draft is local to the demo. Saving a shift does not change live paging, existing assignments or escalation policies.</p>
    <section className="sc-calendar" aria-label="Weekly on-call schedule">
      <div className="sc-toolbar"><div className="sc-week-nav"><button aria-label="Previous week" onClick={() => setWeek(addDays(week, -7))}><ChevronLeft size={19} /></button><h3>{dayLabel(week, { day: 'numeric', month: 'short' })} – {dayLabel(days[6], { day: 'numeric', month: 'short', year: 'numeric' })}</h3><button aria-label="Next week" onClick={() => setWeek(addDays(week, 7))}><ChevronRight size={19} /></button><button onClick={() => setWeek(weekStart(wallDate(now, zone)))}>Today</button></div><button className="ws-button" onClick={() => create()}><Plus size={15} />New shift</button></div>
      <div className="sc-filters"><label>Service<select value={service} onChange={event => setService(event.target.value)}>{scheduleServices.map(value => <option key={value}>{value}</option>)}</select></label><label>Coverage<select value={layer} onChange={event => setLayer(event.target.value)}><option value="all">All layers</option><option>Primary</option><option>Secondary</option></select></label><label>Display timezone<select value={zone} onChange={event => setZone(event.target.value as ScheduleZone)}>{Object.keys(scheduleZones).map(value => <option key={value}>{value}</option>)}</select></label><span className="sc-legend"><i />Primary <i />Secondary</span></div>
      <div className="sc-scroll"><div className="sc-grid"><div className="sc-day-head sc-time-head">24h</div>{days.map(day => <div key={day} className={`sc-day-head ${day === wallDate(now, zone) ? 'is-today' : ''}`}><span>{dayLabel(day, { weekday: 'short' })}</span><strong>{dayLabel(day, { day: 'numeric' })}</strong></div>)}<div className="sc-time-axis">{Array.from({ length: 24 }, (_, hour) => <span key={hour}>{String(hour).padStart(2, '0')}:00</span>)}</div>{days.map(day => {
        const dayStart = fromWall(day, '00:00', zone);
        const dayEnd = dayStart + 86400000;
        return <div key={day} className={`sc-day ${day === wallDate(now, zone) ? 'is-today' : ''}`}>
          {Array.from({ length: 24 }, (_, hour) => <button className="sc-slot" key={hour} aria-label={`Create shift ${day} at ${hour}:00 ${zone}`} onClick={() => create(dayStart + hour * 3600000)} />)}
          {visible.filter(shift => shift.start < dayEnd && shift.end > dayStart).map(shift => <button className={`sc-shift sc-shift-${shift.layer.toLowerCase()}`} key={shift.id} style={{ top: `${(Math.max(dayStart, shift.start) - dayStart) / 864000}%`, height: `${(Math.min(dayEnd, shift.end) - Math.max(dayStart, shift.start)) / 864000}%` }} onClick={() => setEditing(shift)} title={`${members.find(member => member.id === shift.person)?.name} · ${wallTime(shift.start, zone)}–${wallTime(shift.end, zone)} · ${shift.layer}`}><span>{shift.layer}</span><strong>{members.find(member => member.id === shift.person)?.name}</strong><small>{shift.start < dayStart ? '00:00' : wallTime(shift.start, zone)}–{shift.end >= dayEnd ? '24:00' : wallTime(shift.end, zone)}</small></button>)}
          {now >= dayStart && now < dayEnd && <div className="sc-now" style={{ top: `${(now - dayStart) / 864000}%` }}><span /></div>}
        </div>;
      })}</div></div>
      <div className="sc-calendar-foot"><span>Click an hour to create a shift. Click a shift to edit it.</span><span>Unfilled hours have no coverage in this draft.</span></div>
    </section>
    <section className="sc-agenda"><div><h3>Shifts in this view</h3><p>Exact times, including overnight handovers.</p></div>{!weekShifts.length ? <div className="sc-empty"><CalendarDays size={25} /><h4>Your week is a blank canvas.</h4><p>Add a shift for {service} to start planning coverage.</p><button className="ws-button" onClick={() => create(fromWall(week, '09:00', zone) > now ? fromWall(week, '09:00', zone) : undefined)}>Create first shift <ArrowRight size={14} /></button></div> : <div className="sc-agenda-list">{[...weekShifts].sort((a, b) => a.start - b.start).map(shift => <button key={shift.id} onClick={() => setEditing(shift)}><span className={`sc-layer sc-layer-${shift.layer.toLowerCase()}`}>{shift.layer}</span><strong>{members.find(member => member.id === shift.person)?.name}</strong><span>{wallDate(shift.start, zone)} {wallTime(shift.start, zone)} → {wallDate(shift.end, zone)} {wallTime(shift.end, zone)}</span><ChevronRight size={16} /></button>)}</div>}</section>
    <p role="status" className="sc-message">{message}</p>
    <button className="ws-button ws-button-primary" onClick={onBack}>Return to account setup <ArrowRight size={15} /></button>
    {editing && <ShiftEditor key={editing.id} shift={editing} shifts={shifts} members={members} zone={zone} onClose={() => setEditing(null)} onSave={shift => { onShifts([...shifts.filter(item => item.id !== shift.id), shift]); setWeek(weekStart(wallDate(shift.start, zone))); setService(shift.service); setLayer('all'); setEditing(null); setMessage('Shift saved to your schedule draft.'); }} onDelete={() => { onShifts(shifts.filter(item => item.id !== editing.id)); setEditing(null); setMessage('Shift removed. Onboarding progress has been recalculated.'); }} />}
  </div>;
}

function ShiftEditor({ shift, shifts, members, zone, onSave, onClose, onDelete }: { shift: Shift; shifts: Shift[]; members: { id: string; name: string }[]; zone: ScheduleZone; onSave: (shift: Shift) => void; onClose: () => void; onDelete: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(shift);
  const [startDate, setStartDate] = useState(wallDate(shift.start, zone));
  const [startTime, setStartTime] = useState(wallTime(shift.start, zone));
  const [endDate, setEndDate] = useState(wallDate(shift.end, zone));
  const [endTime, setEndTime] = useState(wallTime(shift.end, zone));
  const [error, setError] = useState('');
  useEffect(() => { dialog.current?.showModal(); }, []);
  const exists = shifts.some(item => item.id === shift.id);
  return <dialog ref={dialog} className="sc-editor" aria-labelledby="sc-editor-title" onClose={onClose}><form onSubmit={event => { event.preventDefault(); const value = { ...draft, start: fromWall(startDate, startTime, zone), end: fromWall(endDate, endTime, zone) }; const validation = validateShift(value, shifts, Date.now()); if (validation) { setError(validation); return; } onSave(value); }}><div className="sc-editor-heading"><div><span className="sc-eyebrow">MAKE ROOM FOR RELIABILITY</span><h2 id="sc-editor-title">{exists ? 'Edit your shift' : 'Plan a new shift'}</h2></div><button type="button" aria-label="Close shift editor" onClick={onClose}><X size={20} /></button></div><p>Times are entered in <strong>{zone}</strong>. Use the following date for overnight shifts.</p><div className="sc-form-grid"><label>Responder<select value={draft.person} onChange={event => setDraft({ ...draft, person: event.target.value })}>{members.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label><label>Coverage layer<select value={draft.layer} onChange={event => setDraft({ ...draft, layer: event.target.value as Shift['layer'] })}><option>Primary</option><option>Secondary</option></select></label><label className="sc-full">Service<select value={draft.service} onChange={event => setDraft({ ...draft, service: event.target.value })}>{scheduleServices.map(service => <option key={service}>{service}</option>)}</select></label><label>Start date<input type="date" required value={startDate} onChange={event => setStartDate(event.target.value)} /></label><label>Start time<input type="time" required value={startTime} onChange={event => setStartTime(event.target.value)} /></label><label>End date<input type="date" required value={endDate} onChange={event => setEndDate(event.target.value)} /></label><label>End time<input type="time" required value={endTime} onChange={event => setEndTime(event.target.value)} /></label></div><p className="sc-error" role="alert">{error}</p><div className="sc-editor-actions">{exists && <button type="button" className="sc-delete" onClick={onDelete}><Trash2 size={15} />Delete shift</button>}<button type="button" className="ws-button" onClick={onClose}>Cancel</button><button type="submit" className="ws-button ws-button-primary">Save shift <Check size={15} /></button></div></form></dialog>;
}
