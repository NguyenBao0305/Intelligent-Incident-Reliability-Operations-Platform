import { useState } from 'react';
import { ArrowRight, Server, Users, Sparkles, ShieldCheck, Play, Camera, Trash2 } from 'lucide-react';
import { DEMO_ACCOUNT } from '../../demo/auth';
import type { Incident } from './model';
import { RESPONDER_ID, statusLabels } from './model';
import type { Profile, WorkspaceView } from './workspace-types';
import './workspace-pages.css';

const catalog = [
  { name: 'payments-api', description: 'Payment authorization and transaction processing.', criticality: 'CRITICAL', dependency: 'auth-service', runbook: 'Collect payment diagnostics' },
  { name: 'order-worker', description: 'Background order processing and retry queues.', criticality: 'HIGH', dependency: 'payments-api', runbook: 'Inspect queue snapshot' },
  { name: 'auth-service', description: 'Authentication and token validation for applications.', criticality: 'NORMAL', dependency: 'None in demo', runbook: 'Collect authentication diagnostics' },
];
interface Investigation { id: string; incidentId: number; title: string; evidence: { id: string; text: string }[]; at: string }
interface Action { id: string; incidentId: number; service: string; runbook: string; risk: string; evidence: string; status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUCCEEDED'; history: string[] }
export function WorkspacePages({ view, incidents, profile, onProfile, onIncident, onService, onView }: {
  view: WorkspaceView; incidents: Incident[]; profile: Profile; onProfile: (profile: Profile) => void;
  onIncident: (id: number) => void; onService: (name: string) => void; onView: (view: WorkspaceView) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedService, setSelectedService] = useState('payments-api');
  const [incidentId, setIncidentId] = useState(incidents[0]?.id ?? 0);
  const [runs, setRuns] = useState<Investigation[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [draft, setDraft] = useState(profile);
  const [message, setMessage] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const assigned = incidents.filter(item => item.assignedTo === RESPONDER_ID);
  const incident = assigned.find(item => item.id === incidentId);
  const service = catalog.find(item => item.name === selectedService)!;
  function propose(run?: Investigation) {
    const target = run ? assigned.find(item => item.id === run.incidentId) : incident;
    if (!target || target.status === 'RESOLVED') return;
    const definition = catalog.find(item => item.name === target.service)!;
    const stamp = new Date().toLocaleTimeString();
    setActions(previous => [{ id: crypto.randomUUID(), incidentId: target.id, service: target.service, runbook: definition.runbook,
      risk: definition.criticality === 'CRITICAL' ? 'HIGH' : 'LOW', evidence: run ? `${run.id}: ${run.evidence.map(item => item.id).join(', ')}` : `Incident #${target.id}; ${target.alerts.map(item => item.id).join(', ')}`,
      status: 'PENDING_APPROVAL', history: [`${stamp} · Requested by ${profile.name}; snapshot created.`] }, ...previous]);
    onView('automation');
  }
  function transition(id: string, next: Action['status']) {
    setActions(previous => previous.map(action => {
      const target = assigned.find(item => item.id === action.incidentId);
      if (action.id !== id || !target || target.status === 'RESOLVED') return action;
      const allowed = action.status === 'PENDING_APPROVAL' && (next === 'APPROVED' || next === 'REJECTED') || action.status === 'APPROVED' && next === 'SUCCEEDED';
      if (!allowed) return action;
      return { ...action, status: next, history: [...action.history, `${new Date().toLocaleTimeString()} · ${next === 'SUCCEEDED' ? 'Simulated diagnostic output generated. No command executed.' : `${next} by ${profile.name}.`}`] };
    }));
  }
  const picker = <label className="wp-field">Incident context<select value={incidentId} onChange={event => setIncidentId(Number(event.target.value))}>{assigned.map(item => <option key={item.id} value={item.id}>#{item.id} · {item.service} · {statusLabels[item.status]}</option>)}</select></label>;
  return <div className="wp-pages" hidden={view === 'incidents' || view === 'inbox'}>
    {view === 'services' && <>
      <div className="wp-intro"><Server /><div><h2>Services you respond to</h2><p>Ownership, dependencies and your assigned incidents. Configuration is managed by authorized service managers.</p></div></div>
      <input className="wp-search" aria-label="Search services" placeholder="Search services…" value={query} onChange={event => setQuery(event.target.value)} />
      <div className="wp-grid">{catalog.filter(item => `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())).map(item => <button className="ws-panel wp-card wp-service" key={item.name} aria-pressed={selectedService === item.name} onClick={() => setSelectedService(item.name)}><Server size={22} /><span className="wp-tag">{item.criticality}</span><h3>{item.name}</h3><p>{item.description}</p><strong>{assigned.filter(i => i.service === item.name && i.status !== 'RESOLVED').length} assigned open incidents</strong><span className="wp-link">View service <ArrowRight size={15} /></span></button>)}</div>
      {!catalog.some(item => `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())) && <p className="wp-callout">No services match your search.</p>}
      <section className="ws-panel wp-card"><h2>{service.name}</h2><div className="wp-facts"><div><span>Owner</span><strong>{DEMO_ACCOUNT.team}</strong></div><div><span>Depends on</span><strong>{service.dependency}</strong></div><div><span>Integration</span><strong>Monitoring simulator · demo</strong></div><div><span>Escalation</span><strong>2 levels + backstop · static</strong></div></div><button className="ws-button" onClick={() => onService(service.name)}>View assigned incidents <ArrowRight size={15} /></button></section>
    </>}
    {view === 'team' && <>
      <div className="wp-intro"><Users /><div><h2>{DEMO_ACCOUNT.team}</h2><p>One team, shared response context. This demo directory is read-only for Responders.</p></div></div>
      <div className="wp-grid">{[{ name: profile.name, role: 'Responder', duty: 'Primary · escalation level 1', initials: 'LN', avatar: profile.avatar }, { name: 'Quang Tran', role: 'Responder', duty: 'Secondary · escalation level 2', initials: 'QT', avatar: '' }, { name: 'Mai Pham', role: 'Account Admin', duty: 'Backstop · after retry limits', initials: 'MP', avatar: '' }].map(member => <article className="ws-panel wp-card" key={member.initials}>{member.avatar ? <img className="ws-avatar" src={member.avatar} alt="" /> : <span className="ws-avatar">{member.initials}</span>}<h3>{member.name}{member.initials === 'LN' ? ' · You' : ''}</h3><span className="wp-tag">{member.role}</span><p>{member.duty}</p>{member.initials === 'LN' && <button className="wp-link" onClick={() => onView('profile')}>View your profile <ArrowRight size={15} /></button>}</article>)}</div>
      <section className="ws-panel wp-card"><h2>How your team responds</h2><ol className="wp-steps"><li>Monitoring events create incidents and notify the assigned responder.</li><li>Acknowledgement stops escalation; investigation and notes build shared context.</li><li>Unacknowledged incidents follow two escalation levels, bounded retries and a backstop.</li></ol><p className="wp-callout">Assignments are static in this MVP. Team membership, roles and service policies cannot be edited here. Incident Commander is a per-incident assignment.</p></section>
    </>}
    {view === 'ai' && <>
      <div className="wp-intro"><Sparkles /><div><h2>Investigate with evidence</h2><p>Review facts, unknowns and a proposed diagnostic action before deciding what to do.</p></div><span className="wp-tag">Simulated AI</span></div>
      <section className="ws-panel wp-card">{picker}<button className="ws-button ws-button-primary" disabled={!incident || incident.status === 'RESOLVED'} onClick={() => {
        if (!incident || incident.status === 'RESOLVED') return;
        setRuns(previous => [{ id: `RUN-${crypto.randomUUID().slice(0, 8)}`, incidentId: incident.id, title: incident.title, at: new Date().toLocaleString(), evidence: incident.alerts.map(alert => ({ id: alert.id, text: alert.summary })) }, ...previous]);
      }}><Sparkles size={16} />Generate demo investigation</button><p className="wp-callout">Uses only the selected incident’s sample alerts. No model, RAG search or external tools are called. Resolved incidents are read-only in this demo.</p></section>
      {runs.length === 0 && <div className="ws-empty"><Sparkles /><h3>Your investigation starts here</h3><p>Select an open incident to generate a sample evidence report.</p></div>}
      {runs.map(run => <section className="ws-panel wp-card" key={run.id}><span className="wp-tag">{run.id} · {run.at}</span><h2>{run.title}</h2><button className="wp-link" onClick={() => onIncident(run.incidentId)}>Open incident #{run.incidentId} <ArrowRight size={14} /></button><h3>Observed evidence</h3>{run.evidence.map(item => <p className="wp-evidence" key={item.id}><strong>{item.id}</strong>{item.text}</p>)}<div className="wp-grid wp-two"><div><h3>Hypothesis · unconfirmed</h3><p>Resource pressure or a downstream dependency may be contributing. The alert evidence alone does not establish root cause.</p></div><div><h3>Missing information</h3><p>Deployment history, logs, traces and resource metrics are not available in this demo. Collect them before choosing remediation.</p></div></div><button className="ws-button" disabled={assigned.find(item => item.id === run.incidentId)?.status === 'RESOLVED'} onClick={() => propose(run)}>Propose diagnostic action <ArrowRight size={15} /></button></section>)}
    </>}
    {view === 'automation' && <>
      <div className="wp-intro"><Play /><div><h2>Review before execution</h2><p>Service-scoped diagnostic runbooks with explicit decisions and a local action history.</p></div><span className="wp-tag">Simulation only</span></div>
      <section className="ws-panel wp-card">{picker}<h3>{catalog.find(item => item.name === incident?.service)?.runbook ?? 'No runbook available'} · v1</h3><p>Target: {incident?.service ?? '—'} · Environment: sandbox · Parameters: read-only diagnostic snapshot.</p><button className="ws-button" disabled={!incident || incident.status === 'RESOLVED'} onClick={() => propose()}>Request demo action</button><p className="wp-callout">All demo runbooks require approval, including LOW risk. CRITICAL services raise effective risk to HIGH. Approval and execution are separate simulated steps; server quota, circuit breaker and snapshot validation are not implemented.</p></section>
      {!actions.length && <div className="ws-empty"><ShieldCheck /><h3>No action requests yet</h3><p>Request a diagnostic runbook or propose one from an investigation.</p></div>}
      {actions.map(action => { const closed = assigned.find(item => item.id === action.incidentId)?.status === 'RESOLVED'; return <section className="ws-panel wp-card" key={action.id}><div className="wp-action-heading"><span className="wp-tag">{action.status.replaceAll('_', ' ')}</span><span className="wp-tag">{action.risk} risk</span></div><h2>{action.runbook} · v1</h2><p>#{action.incidentId} · {action.service} · sandbox</p><details><summary>Action snapshot & evidence</summary><p className="wp-evidence">Action ID: {action.id}<br />Parameters: diagnostic snapshot only<br />Evidence: {action.evidence}</p></details><div className="wp-actions">{action.status === 'PENDING_APPROVAL' && <><button className="ws-button ws-button-primary" disabled={closed} onClick={() => transition(action.id, 'APPROVED')}>Approve demo action</button><button className="ws-button" disabled={closed} onClick={() => transition(action.id, 'REJECTED')}>Reject</button></>}{action.status === 'APPROVED' && <button className="ws-button ws-button-primary" disabled={closed} onClick={() => transition(action.id, 'SUCCEEDED')}><Play size={14} />Simulate sandbox execution</button>}</div>{closed && <p className="wp-callout">Incident resolved. Further approval or execution is disabled.</p>}<ol className="wp-steps">{action.history.map((entry, index) => <li key={index}>{entry}</li>)}</ol>{action.status === 'SUCCEEDED' && <p className="wp-callout">Demo result: diagnostic snapshot collected. No infrastructure was accessed and the incident remains unchanged.</p>}</section>; })}
    </>}
    {view === 'profile' && <>
      <div className="wp-profile-layout"><form className="ws-panel wp-card wp-profile-form" onSubmit={event => { event.preventDefault(); if (!draft.name.trim()) { setMessage('Enter a display name.'); return; } onProfile({ ...draft, name: draft.name.trim() }); setMessage('Profile saved for this demo session.'); }}>
        <h2>Personal information</h2><div className="wp-avatar-editor">{draft.avatar ? <img src={draft.avatar} alt="Profile preview" /> : <span className="ws-avatar wp-avatar-large">{draft.name.split(/\s+/).map(part => part[0]).slice(0, 2).join('')}</span>}<div><strong>Profile photo</strong><p>Choose a JPG, PNG or WebP image, up to 2 MB.</p><label className="wp-upload"><Camera size={15} />Change photo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => { const file = event.target.files?.[0]; setAvatarError(''); if (!file) return; if (!file.type.match(/^image\/(png|jpeg|webp)$/)) { setAvatarError('Choose a PNG, JPG or WebP image.'); return; } if (file.size > 2 * 1024 * 1024) { setAvatarError('The photo must be 2 MB or smaller.'); return; } const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === 'string') setDraft(previous => ({ ...previous, avatar: reader.result as string })); }; reader.readAsDataURL(file); event.currentTarget.value = ''; }} /></label>{draft.avatar && <button type="button" className="wp-remove-photo" onClick={() => setDraft({ ...draft, avatar: '' })}><Trash2 size={14} />Remove photo</button>}{avatarError && <p className="wp-form-error" role="alert">{avatarError}</p>}</div></div>
        <div className="wp-profile-fields"><label className="wp-field">Display name<input required maxLength={80} value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /></label><label className="wp-field">Job title<input maxLength={100} value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} /></label><label className="wp-field">Department<input maxLength={100} value={draft.department} onChange={event => setDraft({ ...draft, department: event.target.value })} /></label><label className="wp-field">Phone number<input type="tel" maxLength={32} value={draft.phone} onChange={event => setDraft({ ...draft, phone: event.target.value })} placeholder="Add a contact number" /></label><label className="wp-field">Location<input maxLength={100} value={draft.location} onChange={event => setDraft({ ...draft, location: event.target.value })} placeholder="City or region" /></label><label className="wp-field">Preferred timezone<select value={draft.timezone} onChange={event => setDraft({ ...draft, timezone: event.target.value })}><option>Asia/Ho_Chi_Minh</option><option>UTC</option><option>Asia/Singapore</option></select></label></div>
        <p>Timezone is a saved demo preference; incident timestamps currently use your browser timezone.</p><button className="ws-button ws-button-primary" type="submit">Save profile</button><p role="status">{message}</p>
      </form><div className="wp-profile-side"><section className="ws-panel wp-card"><h2>Team & assignment</h2><div className="wp-team-identity"><Users size={18} /><div><strong>{DEMO_ACCOUNT.team}</strong><span>One team · Responder</span></div></div><div className="wp-facts"><div><span>Current assignment</span><strong>Primary responder · Level 1</strong></div><div><span>Escalation backup</span><strong>Quang Tran · Level 2</strong></div><div><span>Backstop</span><strong>Mai Pham</strong></div><div><span>Assigned services</span><strong>{[...new Set(assigned.map(item => item.service))].join(', ')}</strong></div></div><button className="wp-link" onClick={() => onView('team')}>Open team directory <ArrowRight size={15} /></button></section><section className="ws-panel wp-card"><h2>Account & access</h2><div className="wp-facts"><div><span>Work email · managed</span><strong>{DEMO_ACCOUNT.email}</strong></div><div><span>Role · assigned</span><strong>RESPONDER</strong></div></div><h3>Your MVP permissions</h3><div className="wp-permissions">{['INCIDENT_ACK', 'INCIDENT_RESOLVE', 'AI_RUN', 'AUTOMATION_EXECUTE'].map(permission => <span className="wp-tag" key={permission}>{permission}</span>)}</div><p>Actions also require incident assignment and the appropriate state. Role and email changes are managed by your administrator.</p><p className="wp-callout">This is a public demo account. Password changes, real sessions and notification delivery preferences require backend integration.</p></section></div></div>
    </>}
  </div>;
}
