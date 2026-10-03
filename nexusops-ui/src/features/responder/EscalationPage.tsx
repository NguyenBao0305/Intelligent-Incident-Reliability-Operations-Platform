import { useState } from 'react';
import { ArrowLeft, ArrowRight, Bell, Check, Clock3, GitBranch, Play, RotateCcw, Save, ShieldCheck, Users } from 'lucide-react';
import { DEMO_ACCOUNT } from '../../demo/auth';
import { escalationEvents, escalationMembers, validatePolicy } from './escalation';
import type { EscalationPolicy, EscalationRule } from './escalation';
import type { Profile, WorkspaceView } from './workspace-types';
import type { Shift } from './schedule';
import './escalation.css';

interface Simulation { snapshot: EscalationPolicy; cursor: number; acknowledged: boolean }
export function EscalationPage({ policies, onSave, profile, shifts, now, onView, onReviewed }: {
  policies: EscalationPolicy[]; onSave: (policy: EscalationPolicy) => void; profile: Profile; shifts: Shift[]; now: number;
  onView: (view: WorkspaceView) => void; onReviewed: () => void;
}) {
  const [draft, setDraft] = useState(() => structuredClone(policies[0]));
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [message, setMessage] = useState('');
  const saved = policies.find(policy => policy.service === draft.service)!;
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const error = validatePolicy(draft);
  const names: Record<string, string> = { 'responder-demo': profile.name, 'responder-quang': 'Quang Tran', 'responder-mai': 'Mai Pham' };
  const events = escalationEvents(simulation?.snapshot ?? saved);
  const current = simulation ? events[simulation.cursor] : null;
  const exhausted = current?.level === 'backstop';
  const finished = simulation && (simulation.acknowledged || exhausted);
  const currentVersion = simulation?.snapshot.version === saved.version && simulation?.snapshot.service === saved.service;
  const next = simulation ? events[simulation.cursor + 1] : null;
  const upcomingShifts = shifts.filter(shift => shift.service === draft.service && shift.end > now);
  function updateRule(index: number, update: Partial<EscalationRule>) {
    setDraft(value => ({ ...value, rules: value.rules.map((rule, position) => position === index ? { ...rule, ...update } : rule) as EscalationPolicy['rules'] }));
    setMessage('');
  }
  function start() { setSimulation({ snapshot: structuredClone(saved), cursor: 0, acknowledged: false }); setMessage('Simulation started. Level 1 receives the first notification at T+0.'); }

  return <div className="ep-page">
    <div className="ep-topline"><button className="ws-text-button" onClick={() => onView('team')}><ArrowLeft size={15} />People & teams</button><span className="ep-pill"><GitBranch size={14} />Two levels · bounded reminders</span></div>
    <div className="ep-banner"><span className="ep-symbol"><GitBranch size={27} /></span><div><span className="ws-kicker">THE RIGHT PEOPLE, IN THE RIGHT ORDER</span><h2>Give every incident a clear next step.</h2><p>Notify responders, allow time to acknowledge, then move to the next level.</p></div><span className="ep-pill">Local policy designer</span></div>
    <p className="ep-access"><ShieldCheck size={16} /><span>Your account is a Responder. This editor saves practice policies for this session; production policy changes require service-management permission. Existing incidents keep their original policy.</span></p>
    <div className="ep-layout"><form className="ep-editor" onSubmit={event => {
      event.preventDefault(); if (error) { setMessage(error); return; }
      if (!dirty) return;
      const policy = { ...structuredClone(draft), name: draft.name.trim(), version: saved.version + 1 };
      onSave(policy); setDraft(policy); setMessage(`Practice policy saved as version ${policy.version}. Start a new simulation to review it.`);
    }}>
      <section className="ws-panel ep-card"><div className="ep-section-heading"><h3>Policy details</h3><span className="ep-pill">{dirty ? 'Unsaved changes' : `Saved · v${saved.version}`}</span></div>
        <div className="ep-fields"><label>Service<select disabled={dirty} value={draft.service} onChange={event => { setDraft(structuredClone(policies.find(policy => policy.service === event.target.value)!)); setSimulation(null); setMessage(''); }}>{policies.map(policy => <option key={policy.service}>{policy.service}</option>)}</select></label><label>Team<span className="ep-readonly"><Users size={15} />{DEMO_ACCOUNT.team}</span></label>
        <label className="ep-wide">Policy name<input required maxLength={80} value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /></label><label className="ep-wide">Description <small>Optional</small><textarea rows={2} maxLength={400} placeholder="When is this response path used?" value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} /></label></div>
        {dirty && <p className="ep-hint">Save or discard changes before switching services.</p>}
      </section>
      <div className="ep-trigger"><Bell size={17} /><strong>Immediately when an incident is triggered</strong><span>Start level 1</span></div>
      {draft.rules.map((rule, index) => <section className="ws-panel ep-card ep-level" key={index}><div className="ep-section-heading"><div className="ep-level-heading"><span className="ep-level-number">{index + 1}</span><div><h3>{index === 0 ? 'Primary response' : 'Secondary response'}</h3><p>{index === 0 ? 'Notify every selected responder immediately.' : 'Notify when level 1 has used its waiting and reminder budget.'}</p></div></div><span className="ep-pill">Level {index + 1}</span></div>
        <fieldset className="ep-targets"><legend>Notify these team members</legend>{escalationMembers.map(id => <label key={id} className={rule.targets.includes(id) ? 'is-selected' : ''}><input type="checkbox" checked={rule.targets.includes(id)} onChange={event => updateRule(index, { targets: event.target.checked ? [...rule.targets, id] : rule.targets.filter(target => target !== id) })} /><span className="ep-avatar">{names[id].split(/\s+/).map(part => part[0]).slice(0, 2).join('')}</span><span>{names[id]}{id === 'responder-demo' && <small>You</small>}</span>{rule.targets.includes(id) && <Check size={14} />}</label>)}</fieldset>
        <div className="ep-fields ep-timing"><label>Wait for ACK <small>minutes</small><input type="number" min={1} max={60} required value={rule.timeoutMinutes} onChange={event => updateRule(index, { timeoutMinutes: Number(event.target.value) })} /></label><label>Additional reminders<input type="number" min={0} max={5} required value={rule.repeatCount} onChange={event => updateRule(index, { repeatCount: Number(event.target.value) })} /></label><label>Reminder interval <small>minutes</small><input type="number" min={1} max={60} required disabled={rule.repeatCount === 0} value={rule.repeatMinutes} onChange={event => updateRule(index, { repeatMinutes: Number(event.target.value) })} /></label></div>
        <p className="ep-hint"><Clock3 size={14} />{rule.repeatCount ? `After ${rule.timeoutMinutes} min without ACK, send ${rule.repeatCount} additional reminder(s), allowing ${rule.repeatMinutes} min after each.` : `After ${rule.timeoutMinutes} min without ACK, advance without reminders.`}</p>
      </section>)}
      <section className="ws-panel ep-card ep-backstop"><div className="ep-section-heading"><div><span className="ws-kicker">FINAL SAFETY NET</span><h3>One backstop. No endless paging.</h3></div><ShieldCheck size={24} /></div><label className="ep-field">Backstop responder<select value={draft.backstop} onChange={event => setDraft({ ...draft, backstop: event.target.value })}>{escalationMembers.map(id => <option key={id} value={id}>{names[id]}</option>)}</select></label><p className="ep-hint">After both levels are exhausted, notify this person once and stop escalation. The incident remains Triggered until acknowledged or resolved.</p></section>
      <div className="ep-save"><span>{error || (dirty ? 'Changes apply to new practice simulations.' : 'Saved policy ready for review.')}</span><button type="button" className="ws-button" disabled={!dirty} onClick={() => { setDraft(structuredClone(saved)); setMessage('Unsaved changes discarded.'); }}>Discard</button><button type="submit" className="ws-button ws-button-primary" disabled={!dirty || !!error}><Save size={16} />Save practice policy</button></div>
    </form>
    <aside className="ep-aside"><section className="ws-panel ep-card ep-preview"><div className="ep-section-heading"><h3>Response preview</h3><span className="ep-pill">Virtual clock</span></div><p className="ep-hint">Advance time manually to see notifications and deadlines. No messages are sent.</p>
      <div className="ep-clock"><span>{simulation ? simulation.acknowledged ? 'ACKNOWLEDGED' : exhausted ? 'ESCALATION EXHAUSTED' : 'WAITING FOR ACK' : 'READY TO SIMULATE'}</span><strong>T+{current?.minute ?? 0}<small> min</small></strong><p>{simulation ? `${simulation.snapshot.name} · snapshot v${simulation.snapshot.version}` : `${saved.name} · v${saved.version}`}</p></div>
      <ol className="ep-timeline">{events.map((event, index) => <li key={index} className={simulation && index <= simulation.cursor ? 'is-reached' : ''}><span className="ep-timeline-dot" /><div><small>T+{event.minute} min</small><strong>{event.label}</strong><p>{event.targets.map(id => names[id]).join(', ')}</p></div>{simulation && index <= simulation.cursor && <Check size={14} />}</li>)}</ol>
      {simulation?.acknowledged && <p className="ep-success"><Check size={16} />ACK recorded. Remaining notifications cancelled.</p>}
      {exhausted && !simulation?.acknowledged && <p className="ep-hint">Backstop notified once. No further deadline; incident remains open.</p>}
      {simulation && !currentVersion && <p className="ep-hint">This run retains the previous policy snapshot. Restart to use the saved version.</p>}
      <div className="ep-preview-actions"><button className="ws-button ws-button-primary" disabled={dirty || !!error} onClick={start}>{simulation ? <RotateCcw size={15} /> : <Play size={15} />}{simulation ? 'Restart simulation' : 'Trigger demo incident'}</button>
      {simulation && !finished && <button className="ws-button" onClick={() => setSimulation({ ...simulation, cursor: Math.min(simulation.cursor + 1, events.length - 1) })}>No ACK · advance to T+{next?.minute} <ArrowRight size={14} /></button>}
      {simulation && !simulation.acknowledged && <button className="ws-button" onClick={() => { setSimulation({ ...simulation, acknowledged: true }); setMessage('Demo ACK stops future escalation. Reading a notification alone would not stop it.'); }}><Check size={15} />Simulate ACK</button>}
      <button className="ws-text-button" disabled={!finished || dirty || !currentVersion} onClick={() => { onReviewed(); setMessage('Saved policy reviewed. Your escalation onboarding step is complete.'); }}>Confirm escalation review <ArrowRight size={14} /></button></div>
    </section><section className="ws-panel ep-card"><h3>On-call context</h3><p className="ep-hint">{upcomingShifts.length} current or upcoming shifts for {draft.service}. This MVP policy uses explicit user targets; schedule rotations do not change them automatically.</p><button className="ws-text-button" onClick={() => onView('schedule')}>Open on-call schedule <ArrowRight size={14} /></button><button className="ws-text-button" onClick={() => onView('setup')}>Return to onboarding <ArrowRight size={14} /></button></section></aside></div>
    {message && <div className="ep-message" role="status"><ShieldCheck size={17} />{message}</div>}
  </div>;
}
