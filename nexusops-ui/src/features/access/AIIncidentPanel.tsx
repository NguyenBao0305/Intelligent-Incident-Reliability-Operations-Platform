import { useState } from 'react';
import { Activity, ArrowUpRight, Check, ChevronRight, FileSearch, History, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { canRespond } from './policy';
import type { Data, ScopedIncident, User } from './store';
import type { Run } from './PeopleAccess';
import './ai-panel.css';

export function AIIncidentPanel({ data, user, incident, run, onOpenIncident, message }: { message: string; data: Data; user: User; incident: ScopedIncident; run: Run; onOpenIncident: (id: number) => void }) {
  const [tab, setTab] = useState<'investigation' | 'actions'>('investigation');
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const active = incident.status !== 'RESOLVED';
  const canInvestigate = active && canRespond(user, incident, 'AI_RUN');
  const canExecute = active && canRespond(user, incident, 'AUTOMATION_EXECUTE');
  const actions = data.actions.filter(action => action.incidentId === incident.id);
  const pending = actions.some(action => ['PENDING_APPROVAL', 'APPROVED'].includes(action.state));
  const related = data.incidents.filter(item => item.teamId === user.teamId && item.service === incident.service && item.id !== incident.id).sort((a, b) => b.createdAt - a.createdAt);
  const generated = incident.timeline.filter(event => event.text.includes(': investigate')).at(-1);
  const alerts = incident.alerts;

  return <aside className="ai-panel" aria-label={`AI investigation for incident ${incident.id}`}>
    <header className="ai-panel-header">
      <div className="ai-orb"><Sparkles size={22}/></div>
      <div><span className="ai-eyebrow">NEXUSOPS ASSIST</span><h2>Investigation</h2></div>
      <span className="ai-demo">DEMO</span>
    </header>
    <div className="ai-context"><Activity size={15}/><span>#{incident.id} · {incident.service}</span></div>
    <div className="ai-tabs" role="group" aria-label="AI panel sections">
      <button aria-pressed={tab === 'investigation'} onClick={() => setTab('investigation')}><FileSearch size={16}/>Insights</button>
      <button aria-pressed={tab === 'actions'} onClick={() => setTab('actions')}><ShieldCheck size={16}/>Actions <span>{actions.length}</span></button>
    </div>
    <div className="ai-panel-body">
      <p className="ai-demo-note">Sample data · AI and executor are not connected</p>
      {tab === 'investigation' ? <>
        <section className="ai-summary">
          <span className="ai-eyebrow">INVESTIGATION</span>
          <h3>{incident.investigation ? 'Root cause not confirmed' : 'Review incident signals'}</h3>
          <p>{incident.investigation ? `${alerts.length} alert${alerts.length === 1 ? '' : 's'} linked to this incident. Verify service health and recent changes.` : 'Generate a sample investigation from the linked incident evidence.'}</p>
          <div className="ai-summary-meta"><span>{alerts.length} signals</span>{generated && <span>Updated {new Date(generated.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}</div>
          <button className="ws-button ws-button-primary" disabled={!canInvestigate} onClick={() => { if (run({ type: 'incident', id: incident.id, operation: 'investigate' })) setFeedback('Sample investigation updated.'); }}><Sparkles size={15}/>{incident.investigation ? 'Refresh insights' : 'Generate insights'}</button>
          {!canInvestigate && <small className="ai-permission-note"><LockKeyhole size={13}/>{active ? 'AI analysis requires incident assignment and permission.' : 'Incident resolved · analysis is read only.'}</small>}
        </section>

        <section className="ai-section ai-key-signals">
          <div className="ai-section-heading"><h3>Key signals</h3><span className="ai-tag">{alerts.length}</span></div>
          {alerts.slice(0, 2).map(alert => <div className="ai-signal" key={alert.id}><span className={`ai-signal-dot ${alert.status === 'OPEN' ? 'is-open' : ''}`}/><span>{alert.summary}<small>{alert.id} · {alert.status.toLowerCase()}</small></span></div>)}
          {alerts.length > 2 && <details className="ai-more"><summary>View {alerts.length - 2} more alerts</summary>{alerts.slice(2).map(alert => <div className="ai-signal" key={alert.id}><span className={`ai-signal-dot ${alert.status === 'OPEN' ? 'is-open' : ''}`}/><span>{alert.summary}<small>{alert.id} · {alert.status.toLowerCase()}</small></span></div>)}</details>}
          {!alerts.length && <p className="ai-muted">No linked alerts.</p>}
        </section>

        {incident.investigation && <section className="ai-section ai-next-steps"><h3>Recommended checks</h3><ul><li>Verify current service health and alert trend.</li><li>Compare with recent deployments before assigning a cause.</li></ul><span className="ai-muted">Guidance only · nothing has been run</span></section>}

        <section className="ai-section ai-related-section">
          <div className="ai-section-heading"><h3><History size={16}/>Related incidents</h3><span className="ai-muted">{related.length}</span></div>
          {related.length ? <details className="ai-more"><summary>Same service · {related.length} earlier</summary>{related.slice(0, 4).map(item => <button className="ai-related" key={item.id} onClick={() => onOpenIncident(item.id)}><span>#{item.id} · {item.title}<small>{item.status} · {new Date(item.createdAt).toLocaleDateString()}</small></span><ArrowUpRight size={15}/></button>)}</details> : <p className="ai-muted">No earlier incidents for this service.</p>}
        </section>
      </> : <>
        <section className="ai-summary">
          <span className="ai-eyebrow">PROPOSED RUNBOOK</span><h3>Inspect service health</h3>
          <p>Read only · local sandbox · no external changes</p>
          <dl className="ai-snapshot"><div><dt>Target</dt><dd>{incident.service}</dd></div><div><dt>Mode</dt><dd>Simulation</dd></div></dl>
          <button className="ws-button ws-button-primary" disabled={!canExecute || pending} onClick={() => { if (run({ type: 'incident', id: incident.id, operation: 'propose' })) setFeedback('Action proposed for review.'); }}>Propose action <ChevronRight size={15}/></button>
          {pending && <p className="ai-muted">An action is already in progress.</p>}
          {!canExecute && <p className="ai-muted">{active ? 'Requires incident assignment and automation permission.' : 'Resolved incidents cannot start actions.'}</p>}
        </section>
        {actions.map(action => <section className="ai-action" key={action.id}>
          <div className="ai-section-heading"><h3>Health inspection</h3><span className="ai-tag">{action.state.replaceAll('_', ' ')}</span></div>
          <dl className="ai-snapshot"><div><dt>Requested by</dt><dd>{data.users.find(person => person.id === action.requestedBy)?.name ?? 'Unknown'}</dd></div><div><dt>Target</dt><dd>{incident.service}</dd></div><div><dt>Effect</dt><dd>No external changes</dd></div>{action.decidedBy && <div><dt>Reviewed by</dt><dd>{data.users.find(person => person.id === action.decidedBy)?.name ?? 'Unknown'}</dd></div>}</dl>
          {action.state === 'PENDING_APPROVAL' && canExecute && <><label className="ai-confirm"><input type="checkbox" checked={reviewed.includes(action.id)} onChange={event => setReviewed(event.target.checked ? [...reviewed, action.id] : reviewed.filter(id => id !== action.id))}/>I reviewed the action</label><div className="ai-action-buttons"><button className="ws-button ws-button-primary" disabled={!reviewed.includes(action.id)} onClick={() => run({ type: 'action', id: action.id, operation: 'approve' })}><Check size={15}/>Approve</button><button className="ws-button" onClick={() => run({ type: 'action', id: action.id, operation: 'reject' })}>Reject</button></div></>}
          {action.state === 'APPROVED' && canExecute && <button className="ws-button ws-button-primary" onClick={() => run({ type: 'action', id: action.id, operation: 'execute' })}>Run simulation</button>}
          {action.state === 'SUCCEEDED' && <p className="ai-outcome"><Check size={15}/>Simulation complete{action.executedAt ? ` · ${new Date(action.executedAt).toLocaleString()}` : ''}</p>}
          {action.state === 'CANCELLED' && <p className="ai-muted">Cancelled when incident was resolved.</p>}
        </section>)}
        {!actions.length && <p className="ai-muted ai-empty-actions">No proposed actions.</p>}
      </>}
      <p className="ai-feedback" role="status">{message || feedback}</p>
      <footer className="ai-panel-footer"><ShieldCheck size={14}/>Human reviewed</footer>
    </div>
  </aside>;
}
