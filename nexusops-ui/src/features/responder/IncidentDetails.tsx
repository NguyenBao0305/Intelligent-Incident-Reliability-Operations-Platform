import { useEffect, useRef, useState } from 'react';
import { Activity, Check, CheckCheck, Clock3, MessageSquare, Send, Server, ShieldCheck, X } from 'lucide-react';
import type { Incident } from './model';
import { statusLabels } from './model';

interface Props {
  incident: Incident;
  onClose: () => void;
  onAcknowledge: () => void;
  onResolve: (reason: string) => void;
  onNote: (content: string) => void;
}
const timestamp = (at: number) => new Date(at).toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export function IncidentDetails({ incident, onClose, onAcknowledge, onResolve, onNote }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState('');
  const [reason, setReason] = useState('');
  const [resolving, setResolving] = useState(false);
  const [reasonError, setReasonError] = useState('');
  useEffect(() => { if (!dialog.current?.open) dialog.current?.showModal(); }, []);

  return <dialog ref={dialog} className="ws-drawer" aria-labelledby="incident-detail-title" onClose={onClose}
    onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
    <div className="ws-drawer-surface">
      <div className="ws-drawer-top"><span><Activity size={16} /> INCIDENT #{incident.id}</span><button className="ws-icon-button" onClick={() => dialog.current?.close()} aria-label="Close incident details"><X size={20} /></button></div>
      <div className="ws-drawer-content">
        <div className="ws-badges"><span className={`ws-status ws-status-${incident.status.toLowerCase()}`}>{statusLabels[incident.status]}</span><span className={`ws-priority ws-${incident.priority.toLowerCase()}`}>{incident.priority}</span><span className="ws-muted">Demo incident</span></div>
        <h2 id="incident-detail-title">{incident.title}</h2>
        <div className="ws-detail-meta"><span><Server size={15} />{incident.service}</span><span><span className="ws-avatar ws-avatar-small">LN</span>Linh Nguyen · You</span></div>
        <div className="ws-detail-actions">
          {incident.status === 'TRIGGERED' && <button className="ws-button ws-button-primary" onClick={onAcknowledge}><Check size={16} />Acknowledge incident</button>}
          {incident.status === 'ACKNOWLEDGED' && <button className="ws-button ws-button-primary" onClick={() => setResolving(!resolving)} aria-expanded={resolving} aria-controls="resolve-form"><CheckCheck size={16} />Resolve incident</button>}
          {incident.status === 'RESOLVED' && <span className="ws-resolved-note"><CheckCheck size={17} /> All linked alerts are closed.</span>}
        </div>
        {incident.status === 'TRIGGERED' && <p className="ws-field-hint">Acknowledge before manually resolving this incident.</p>}
        {resolving && incident.status === 'ACKNOWLEDGED' && <form id="resolve-form" className="ws-resolve-form" onSubmit={event => {
          event.preventDefault();
          if (!reason.trim()) { setReasonError('Add a resolution reason before continuing.'); return; }
          onResolve(reason); setResolving(false); setReason(''); setReasonError('');
        }}>
          <label htmlFor="resolution-reason">Resolution reason <span>Required</span></label>
          <textarea id="resolution-reason" value={reason} onChange={event => { setReason(event.target.value); setReasonError(''); }} maxLength={1000} rows={3} placeholder="What was done, and how was recovery confirmed?" aria-invalid={!!reasonError} aria-describedby={reasonError ? 'resolve-error' : 'resolve-hint'} />
          <p id="resolve-hint" className="ws-field-hint">This closes the incident and all linked alerts in the demo.</p>
          {reasonError && <p id="resolve-error" className="ws-error" role="alert">{reasonError}</p>}
          <div className="ws-form-buttons"><button type="button" className="ws-button" onClick={() => setResolving(false)}>Cancel</button><button className="ws-button ws-button-primary" type="submit">Confirm resolution</button></div>
        </form>}
        <div className="ws-detail-facts">
          <div><span>Created</span><strong>{timestamp(incident.createdAt)}</strong></div>
          <div><span>Escalation</span><strong>{incident.escalationLevel ? `Level ${incident.escalationLevel} of 2` : 'Stopped'}</strong></div>
          <div><span>Acknowledged</span><strong>{incident.acknowledgedAt ? timestamp(incident.acknowledgedAt) : 'Awaiting ACK'}</strong></div>
          <div><span>Resolved</span><strong>{incident.resolvedAt ? timestamp(incident.resolvedAt) : 'Not resolved'}</strong></div>
        </div>
        <section className="ws-detail-section"><h3><Activity size={16} /> Linked alerts <span>{incident.alerts.length}</span></h3>
          {incident.alerts.map(alert => <div className="ws-alert-item" key={alert.id}><span className={`ws-alert-dot ${alert.status === 'OPEN' ? 'is-open' : ''}`} /><div><strong>{alert.summary}</strong><small>{alert.id} · Monitoring simulator · {alert.status === 'OPEN' ? 'Open' : 'Resolved'}</small></div></div>)}
        </section>
        <section className="ws-detail-section"><h3><Clock3 size={16} /> Timeline & notes</h3>
          <ol className="ws-timeline">{incident.timeline.map(entry => <li key={entry.id}><span className={`ws-timeline-icon is-${entry.kind}`}>{entry.kind === 'note' ? <MessageSquare size={13} /> : <Check size={13} />}</span><div><p>{entry.text}</p><time dateTime={new Date(entry.at).toISOString()}>{timestamp(entry.at)}{entry.kind === 'note' ? ' · Linh Nguyen' : ''}</time></div></li>)}</ol>
          <form className="ws-note-form" onSubmit={event => { event.preventDefault(); if (note.trim()) { onNote(note); setNote(''); } }}>
            <label htmlFor="incident-note">Add a team note</label><textarea id="incident-note" value={note} onChange={event => setNote(event.target.value)} maxLength={1000} rows={3} placeholder="Share findings, evidence or next steps…" />
            <div className="ws-form-buttons"><span className="ws-field-hint">{note.length}/1000</span><button className="ws-button" type="submit" disabled={!note.trim()}><Send size={14} />Add note</button></div>
          </form>
        </section>
        <p className="ws-detail-footnote"><ShieldCheck size={16} /> Demo changes are local. AI investigation, automation and backend processing are not connected.</p>
      </div>
    </div>
  </dialog>;
}
