import { useEffect, useReducer, useRef, useState } from 'react';
import { Activity, ArrowDownLeft, ArrowRight, Bell, Check, CheckCheck, ChevronRight, CircleCheck, Clock3, Filter, Inbox, LogOut, RotateCcw, Search, Server, ShieldCheck, SlidersHorizontal, Users, X } from 'lucide-react';
import { DEMO_ACCOUNT } from '../../demo/auth';
import { createDemoWorkspace, relativeTime, RESPONDER_ID, statusLabels, workspaceReducer } from './model';
import type { IncidentStatus, Priority } from './model';
import { IncidentDetails } from './IncidentDetails';
import './responder.css';
import { WorkspacePages } from './WorkspacePages';
import { pageTitles } from './workspace-types';
import type { WorkspaceView, Profile } from './workspace-types';

type StatusFilter = 'OPEN' | IncidentStatus | 'ALL';
const filters: { value: StatusFilter; label: string }[] = [
  { value: 'OPEN', label: 'Open' }, { value: 'TRIGGERED', label: 'Triggered' },
  { value: 'ACKNOWLEDGED', label: 'Acknowledged' }, { value: 'RESOLVED', label: 'Resolved' }, { value: 'ALL', label: 'All incidents' },
];

export function ResponderDashboard({ onLogout }: { onLogout: () => void }) {
  const [state, dispatch] = useReducer(workspaceReducer, undefined, () => createDemoWorkspace());
  const [view, setView] = useState<WorkspaceView>('incidents');
  const [profile, setProfile] = useState<Profile>({ name: DEMO_ACCOUNT.name, title: 'Incident responder', department: 'Platform Engineering', phone: '', location: '', timezone: 'Asia/Ho_Chi_Minh', avatar: '' });
  const [status, setStatus] = useState<StatusFilter>('OPEN');
  const [search, setSearch] = useState('');
  const [service, setService] = useState('ALL');
  const [priority, setPriority] = useState<Priority | 'ALL'>('ALL');
  const [sort, setSort] = useState('newest');
  const [selection, setSelection] = useState<number[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [notice, setNotice] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const selectAll = useRef<HTMLInputElement>(null);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 30_000); return () => clearInterval(timer); }, []);

  // The demo exposes only incidents assigned to this responder; no team-wide read grant is implied.
  const assigned = state.incidents.filter(item => item.assignedTo === RESPONDER_ID);
  const counts = {
    ALL: assigned.length,
    OPEN: assigned.filter(item => item.status !== 'RESOLVED').length,
    TRIGGERED: assigned.filter(item => item.status === 'TRIGGERED').length,
    ACKNOWLEDGED: assigned.filter(item => item.status === 'ACKNOWLEDGED').length,
    RESOLVED: assigned.filter(item => item.status === 'RESOLVED').length,
  };
  const visible = assigned.filter(item =>
    (status === 'ALL' || (status === 'OPEN' ? item.status !== 'RESOLVED' : item.status === status)) &&
    (service === 'ALL' || item.service === service) && (priority === 'ALL' || item.priority === priority) &&
    `${item.id} ${item.title} ${item.service}`.toLowerCase().includes(search.trim().toLowerCase())
  ).sort((a, b) => sort === 'priority' ? a.priority.localeCompare(b.priority) || b.createdAt - a.createdAt : sort === 'oldest' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt);
  const eligible = visible.filter(item => item.status === 'TRIGGERED');
  const selected = eligible.filter(item => selection.includes(item.id));
  const selectedIncident = assigned.find(item => item.id === selectedId);
  const unread = state.notifications.filter(item => !item.read).length;
  const notifications = [...state.notifications].filter(item => !unreadOnly || !item.read).sort((a, b) => b.at - a.at);
  const services = [...new Set(assigned.map(item => item.service))];
  useEffect(() => { if (selectAll.current) selectAll.current.indeterminate = selected.length > 0 && selected.length < eligible.length; }, [selected.length, eligible.length]);

  function chooseStatus(value: StatusFilter) { setStatus(value); setSelection([]); setView('incidents'); }
  function acknowledge(ids: number[]) {
    dispatch({ type: 'ack', ids, at: Date.now() }); setSelection([]);
    setNotice(`${ids.length === 1 ? 'Incident acknowledged' : `${ids.length} incidents acknowledged`}. Escalation stopped in this demo.`);
  }
  function resetFilters() { setSearch(''); setService('ALL'); setPriority('ALL'); setSelection([]); setStatus('OPEN'); }

  return <div className="ws-app">
    <div className="ws-demo-bar"><span><span className="ws-demo-dot" /> DEMO WORKSPACE</span><p>Sample data · changes reset when you leave or refresh</p><span className="ws-demo-role">Responder access</span></div>
    <header className="ws-header">
      <a href="#" className="ws-brand" aria-label="NexusOps public home">Nexus<span>Ops</span></a>
      <nav aria-label="Workspace navigation">
        <button aria-current={view === 'incidents' ? 'page' : undefined} onClick={() => setView('incidents')}><Activity size={17} />Incidents</button>
        <button aria-current={view === 'inbox' ? 'page' : undefined} onClick={() => setView('inbox')}><Inbox size={17} />Inbox{unread > 0 && <span className="ws-nav-count">{unread}</span>}</button>
        {(['services', 'team', 'ai', 'automation'] as const).map(item => <button key={item} aria-current={view === item ? 'page' : undefined} onClick={() => setView(item)}>{({services: 'Services', team: 'Team', ai: 'AI Investigation', automation: 'Automation'})[item]}</button>)}
      </nav>
      <div className="ws-header-account"><span className="ws-team-label"><Users size={15} />{DEMO_ACCOUNT.team}</span><button className="ws-icon-button ws-bell" aria-label={`Open inbox, ${unread} unread notifications`} onClick={() => setView('inbox')}><Bell size={19} />{unread > 0 && <i />}</button><button className="ws-user" onClick={() => setView('profile')} aria-label="Open your profile" title="Open your profile" aria-current={view === 'profile' ? 'page' : undefined}>{profile.avatar ? <img className="ws-avatar ws-avatar-photo" src={profile.avatar} alt="" /> : <span className="ws-avatar">{profile.name.split(/\s+/).map(part => part[0]).slice(0, 2).join('')}</span>}<div><strong>{profile.name}</strong><small>Responder</small></div></button><button className="ws-icon-button" onClick={onLogout} aria-label="Log out" title="Log out"><LogOut size={18} /></button></div>
    </header>

    <main className="ws-main">
      <div className="ws-breadcrumb">Workspace <ChevronRight size={13} /><span>{pageTitles[view]}</span></div>
      <div className="ws-heading"><div><div className="ws-kicker">YOUR RESPONSE WORKSPACE</div><h1>{pageTitles[view]}</h1><p>{view === 'incidents' ? 'A clear view of what needs your attention, and what’s already in progress.' : view === 'inbox' ? 'Updates for your incidents. Reading a notification does not acknowledge an incident.' : 'Your services, people and response tools, connected in one workspace.'}</p></div><span className="ws-scope"><ShieldCheck size={15} />Assigned to you</span></div>
      <div className="ws-notice" role="status" aria-live="polite">{notice && <><CircleCheck size={17} /><span>{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={15} /></button></>}</div>

      {(view === 'incidents' || view === 'inbox') && <><div className="ws-stats">
        {([
          { key: 'OPEN', label: 'Your open incidents', helper: 'Across your assigned services', icon: Activity, tone: 'green' },
          { key: 'TRIGGERED', label: 'Awaiting acknowledgement', helper: 'Review and take ownership', icon: Bell, tone: 'red' },
          { key: 'ACKNOWLEDGED', label: 'Acknowledged', helper: 'Investigation in progress', icon: Clock3, tone: 'amber' },
          { key: 'RESOLVED', label: 'Resolved', helper: 'In this sample dataset', icon: CircleCheck, tone: 'muted' },
        ] as const).map(stat => <button className={`ws-stat ws-stat-${stat.tone}`} key={stat.key} onClick={() => { resetFilters(); chooseStatus(stat.key); }}><div><span>{stat.label}</span><stat.icon size={18} /></div><strong>{counts[stat.key]}</strong><small>{stat.helper}<ArrowRight size={14} /></small></button>)}
      </div>

      <div className="ws-layout">
        <div className="ws-primary-column">
          {view === 'incidents' ? <section className="ws-panel ws-incident-panel" aria-label="Assigned incidents">
            <div className="ws-panel-heading"><div><span className="ws-heading-icon"><Activity size={17} /></span><h2>Your incidents</h2><span className="ws-total">{assigned.length}</span></div><span className="ws-muted">One team · {services.length} services</span></div>
            <div className="ws-status-filters" aria-label="Filter by incident status">{filters.map(filter => <button key={filter.value} aria-pressed={status === filter.value} onClick={() => chooseStatus(filter.value)}>{filter.label}<span>{counts[filter.value]}</span></button>)}</div>
            <div className="ws-filters">
              <label className="ws-search"><Search size={17} /><input type="search" aria-label="Search incidents" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search incidents, service or ID…" /></label>
              <label className="ws-select"><Server size={14} /><select aria-label="Filter by service" value={service} onChange={event => setService(event.target.value)}><option value="ALL">All assigned services</option>{services.map(name => <option key={name}>{name}</option>)}</select></label>
              <label className="ws-select"><Filter size={14} /><select aria-label="Filter by priority" value={priority} onChange={event => setPriority(event.target.value as Priority | 'ALL')}><option value="ALL">All priorities</option>{['P1', 'P2', 'P3', 'P4', 'P5'].map(value => <option key={value}>{value}</option>)}</select></label>
            </div>
            <div className="ws-table-tools"><button className="ws-button ws-button-compact" disabled={!selected.length} onClick={() => acknowledge(selected.map(item => item.id))}><Check size={15} />Acknowledge{selected.length ? ` (${selected.length})` : ''}</button><label><SlidersHorizontal size={14} /><select aria-label="Sort incidents" value={sort} onChange={event => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="priority">Highest priority</option></select></label></div>
            <div className="ws-table-scroll"><table className="ws-table"><thead><tr><th className="ws-checkbox-cell"><input ref={selectAll} type="checkbox" aria-label="Select all visible triggered incidents" disabled={!eligible.length} checked={eligible.length > 0 && selected.length === eligible.length} onChange={event => setSelection(event.target.checked ? eligible.map(item => item.id) : [])} /></th><th>Status</th><th>Priority</th><th>Incident</th><th>Created</th><th>Escalation</th><th><span className="ws-sr-only">Action</span></th></tr></thead><tbody>
              {visible.map(incident => <tr key={incident.id} className={selection.includes(incident.id) ? 'is-selected' : ''}>
                <td className="ws-checkbox-cell"><input type="checkbox" aria-label={`Select incident ${incident.id}`} disabled={incident.status !== 'TRIGGERED'} checked={incident.status === 'TRIGGERED' && selection.includes(incident.id)} onChange={event => setSelection(ids => event.target.checked ? [...ids, incident.id] : ids.filter(id => id !== incident.id))} /></td>
                <td><span className={`ws-status ws-status-${incident.status.toLowerCase()}`}><span />{statusLabels[incident.status]}</span></td>
                <td><span className={`ws-priority ws-${incident.priority.toLowerCase()}`}>{incident.priority}</span></td>
                <td className="ws-incident-title-cell"><button className="ws-incident-link" onClick={() => setSelectedId(incident.id)}>{incident.title}</button><div className="ws-incident-subline"><span>#{incident.id}</span><span>·</span><span>{incident.service}</span><span>·</span><span>{incident.alerts.length} {incident.alerts.length === 1 ? 'alert' : 'alerts'}</span></div></td>
                <td><time title={new Date(incident.createdAt).toLocaleString()} dateTime={new Date(incident.createdAt).toISOString()}>{relativeTime(incident.createdAt, now)}</time></td>
                <td>{incident.escalationLevel ? <span className="ws-escalation"><span />Level {incident.escalationLevel} / 2</span> : <span className="ws-muted">Stopped</span>}</td>
                <td><button className="ws-icon-button" aria-label={`View incident ${incident.id}`} onClick={() => setSelectedId(incident.id)}><ChevronRight size={18} /></button></td>
              </tr>)}
            </tbody></table></div>
            {!visible.length && <div className="ws-empty"><CircleCheck size={35} /><h3>No incidents in this view</h3><p>Try another status or clear your search and filters.</p><button className="ws-button" onClick={resetFilters}>Reset filters</button></div>}
            <div className="ws-table-footer"><span>{visible.length} of {assigned.length} assigned incidents</span><span><ShieldCheck size={13} />Responder scope</span></div>
          </section> : <section className="ws-panel ws-inbox-panel" aria-label="Notifications">
            <div className="ws-panel-heading"><div><span className="ws-heading-icon"><Inbox size={17} /></span><h2>Your inbox</h2><span className="ws-total">{unread} unread</span></div><button className="ws-text-button" disabled={!unread} onClick={() => { dispatch({ type: 'readAll' }); setNotice('Notifications marked as read. Incident status is unchanged.'); }}>Mark all as read</button></div>
            <div className="ws-inbox-toolbar"><button className="ws-button ws-button-compact" aria-pressed={unreadOnly} onClick={() => setUnreadOnly(!unreadOnly)}>{unreadOnly ? 'Unread only' : 'All notifications'}</button><span className="ws-muted">{notifications.length} notifications</span></div>
            {notifications.map(item => <article key={item.id} className={`ws-notification ${item.read ? '' : 'is-unread'}`}><span className="ws-notification-icon"><Bell size={18} /></span><div><h3>{item.title}{!item.read && <span className="ws-unread-dot" aria-label="Unread" />}</h3><p>{item.description}</p><small>#{item.incidentId} · {relativeTime(item.at, now)}</small><button className="ws-text-button" onClick={() => { dispatch({ type: 'read', id: item.id }); setSelectedId(item.incidentId); }}>Open incident <ArrowRight size={13} /></button></div>{!item.read && <button className="ws-icon-button" aria-label={`Mark notification ${item.id} as read`} onClick={() => dispatch({ type: 'read', id: item.id })}><CheckCheck size={17} /></button>}</article>)}
            {!notifications.length && <div className="ws-empty"><Inbox size={35} /><h3>You’re all caught up</h3><p>No unread notifications in this demo.</p></div>}
          </section>}
          <div className="ws-bottom-note"><ShieldCheck size={15} /><p>Incidents originate from monitoring integrations. Your Responder workspace focuses on acknowledgement, investigation and resolution.</p></div>
        </div>

        <aside className="ws-sidebar" aria-label="Responder context">
          <section className="ws-oncall-card"><div className="ws-sidebar-title"><span className="ws-oncall-dot" />YOUR ON-CALL ASSIGNMENT<span className="ws-small-badge">Static</span></div><div className="ws-oncall-person"><span className="ws-avatar">LN</span><div><h2>You’re the primary responder</h2><p>{DEMO_ACCOUNT.team}</p></div></div><div className="ws-oncall-services">{services.map(name => <span key={name}><Server size={12} />{name}</span>)}</div><p className="ws-oncall-foot">Sample assignment · no rotation schedule</p></section>
          <section className="ws-panel ws-sidebar-panel"><div className="ws-sidebar-heading"><ShieldCheck size={16} /><h2>Escalation path</h2></div><p className="ws-sidebar-description">Reference policy for the demo services.</p><ol className="ws-policy"><li><span>1</span><div><strong>Linh Nguyen <em>You</em></strong><small>Primary responder</small></div></li><li><span>2</span><div><strong>Quang Tran</strong><small>Secondary responder</small></div></li><li><span><ArrowDownLeft size={13} /></span><div><strong>Mai Pham</strong><small>Backstop after retry limits</small></div></li></ol><p className="ws-policy-note">ACK stops escalation. Timers and paging are not running in this demo.</p></section>
          <section className="ws-panel ws-sidebar-panel"><div className="ws-sidebar-heading"><Bell size={16} /><h2>Needs your attention</h2></div><p className="ws-attention-count">{counts.TRIGGERED}<span>incidents awaiting ACK</span></p><button className="ws-sidebar-link" onClick={() => { resetFilters(); chooseStatus('TRIGGERED'); }}>Review triggered incidents <ArrowRight size={16} /></button></section>
          <button className="ws-reset" onClick={() => { dispatch({ type: 'reset', at: Date.now() }); resetFilters(); setUnreadOnly(false); setSelectedId(null); setNow(Date.now()); setNotice('Sample incidents and notifications restored.'); }}><RotateCcw size={13} />Reset sample data</button>
        </aside>
      </div>
      </>}
      <WorkspacePages view={view} incidents={assigned} profile={profile} onProfile={setProfile} onIncident={setSelectedId} onView={setView} onService={name => { resetFilters(); setService(name); setStatus('ALL'); setView('incidents'); }} />
      <footer className="ws-footer"><span>NexusOps · Incident & Reliability Operations</span><span>Frontend demo · No live monitoring</span></footer>
    </main>
    {selectedIncident && <IncidentDetails key={selectedIncident.id} incident={selectedIncident} onClose={() => setSelectedId(null)} onAcknowledge={() => acknowledge([selectedIncident.id])} onResolve={reason => { dispatch({ type: 'resolve', id: selectedIncident.id, reason, at: Date.now() }); setNotice(`Incident #${selectedIncident.id} resolved. Linked alerts closed in the demo.`); }} onNote={content => { dispatch({ type: 'note', id: selectedIncident.id, content, at: Date.now(), entryId: crypto.randomUUID() }); setNotice('Note added to the incident timeline.'); }} />}
  </div>;
}
