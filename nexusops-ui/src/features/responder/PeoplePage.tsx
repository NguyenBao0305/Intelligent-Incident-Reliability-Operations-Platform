import { useState } from 'react';
import { ArrowRight, Search, ShieldCheck, Users, Server, ChevronRight, X, UserRound, LockKeyhole } from 'lucide-react';
import { DEMO_ACCOUNT } from '../../demo/auth';
import { RESPONDER_ID } from './model';
import type { Incident } from './model';
import type { Profile, WorkspaceView } from './workspace-types';
import './people.css';

export function PeoplePage({ profile, incidents, onView, onIncident }: {
  profile: Profile; incidents: Incident[]; onView: (view: WorkspaceView) => void; onIncident: (id: number) => void;
}) {
  const [tab, setTab] = useState<'members' | 'teams'>('members');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [duty, setDuty] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const members = [
    { id: RESPONDER_ID, name: profile.name, email: DEMO_ACCOUNT.email, role: 'Responder', duty: 'Primary', detail: 'Escalation level 1', title: profile.title || 'Incident responder', avatar: profile.avatar },
    { id: 'responder-quang', name: 'Quang Tran', email: 'quang@nexusops.demo', role: 'Responder', duty: 'Secondary', detail: 'Escalation level 2', title: 'Incident responder', avatar: '' },
    { id: 'responder-mai', name: 'Mai Pham', email: 'mai@nexusops.demo', role: 'Account Admin', duty: 'Backstop', detail: 'After bounded retries', title: 'Workspace administrator', avatar: '' },
  ];
  const visible = members.filter(member => `${member.name} ${member.email}`.toLowerCase().includes(search.trim().toLowerCase()) && (role === 'all' || member.role === role) && (duty === 'all' || member.duty === duty));
  const selected = members.find(member => member.id === selectedId);
  const openFor = (id: string) => incidents.filter(incident => incident.assignedTo === id && incident.status !== 'RESOLVED');
  const services = [...new Set(incidents.map(incident => incident.service))];
  const avatar = (member: typeof members[number]) => member.avatar
    ? <img className="pp-avatar" src={member.avatar} alt="" />
    : <span className="pp-avatar">{member.name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('')}</span>;
  function clearFilters() { setSearch(''); setRole('all'); setDuty('all'); }

  return <div className="pp-page">
    <div className="pp-overview">
      <div><span className="pp-eyebrow">CONNECTED BY RESPONSIBILITY</span><h2>The people behind your services.</h2><p>Find teammates, understand their roles and know who responds next.</p></div>
      <div className="pp-summary"><span><strong>{members.length}</strong>Members</span><span><strong>1</strong>Team</span><span><strong>{services.length}</strong>Services</span></div>
    </div>
    <button className="ws-button" onClick={() => onView('schedule')}>On-call schedule <ArrowRight size={15} /></button><div className="pp-access"><ShieldCheck size={18} /><p><strong>Your team directory</strong> · You can view teammates and edit your own profile. Membership and role changes are managed by your administrator.</p><span><LockKeyhole size={13} />Responder</span></div>
    <section className="ws-panel pp-directory" aria-label="People directory">
      <div className="pp-tabs" role="group" aria-label="Directory view"><button aria-pressed={tab === 'members'} onClick={() => setTab('members')}><UserRound size={17} />Members <span>{members.length}</span></button><button aria-pressed={tab === 'teams'} onClick={() => setTab('teams')}><Users size={17} />Teams <span>1</span></button><span className="pp-team-scope">{DEMO_ACCOUNT.team}</span></div>
      {tab === 'members' ? <>
        <div className="pp-filters">
          <label className="pp-search"><span>Search members</span><div><Search size={17} /><input type="search" placeholder="Name or email address…" value={search} onChange={event => setSearch(event.target.value)} /></div></label>
          <label><span>Account role</span><select value={role} onChange={event => setRole(event.target.value)}><option value="all">All roles</option>{[...new Set(members.map(member => member.role))].map(value => <option key={value}>{value}</option>)}</select></label>
          <label><span>Response assignment</span><select value={duty} onChange={event => setDuty(event.target.value)}><option value="all">All assignments</option>{members.map(member => <option key={member.duty}>{member.duty}</option>)}</select></label>
          {(search || role !== 'all' || duty !== 'all') && <button className="ws-text-button" onClick={clearFilters}>Clear filters</button>}
        </div>
        <div className="pp-table-scroll"><table className="pp-table"><thead><tr><th scope="col">Member</th><th scope="col">Team</th><th scope="col">Account role</th><th scope="col">Response assignment</th><th scope="col">Open incidents</th><th scope="col"><span className="ws-sr-only">Details</span></th></tr></thead><tbody>{visible.map(member => <tr key={member.id} className={selectedId === member.id ? 'is-selected' : ''}>
          <td><button className="pp-member" onClick={() => setSelectedId(member.id)} aria-label={`View ${member.name}`} aria-expanded={selectedId === member.id}>{avatar(member)}<span><strong>{member.name}{member.id === RESPONDER_ID && <small>You</small>}</strong><span>{member.email}</span></span></button></td>
          <td><span className="pp-team-tag"><Users size={13} />{DEMO_ACCOUNT.team}</span></td><td><span className={`pp-role ${member.role === 'Account Admin' ? 'pp-role-admin' : ''}`}>{member.role}</span></td>
          <td><span className="pp-duty">{member.duty}</span><small className="pp-subtext">{member.detail}</small></td><td><span className="pp-count">{openFor(member.id).length}</span></td>
          <td><button className="ws-icon-button" aria-label={`View details for ${member.name}`} onClick={() => setSelectedId(member.id)}><ChevronRight size={18} /></button></td>
        </tr>)}</tbody></table></div>
        {!visible.length && <div className="ws-empty"><Search size={28} /><h3>No matching members</h3><p>Try a different name, email or filter.</p><button className="ws-button" onClick={clearFilters}>Clear filters</button></div>}
        <div className="pp-table-footer"><span>{visible.length} of {members.length} members</span><span>Team scope · Sample directory</span></div>
      </> : <div className="pp-team-view"><div className="pp-team-heading"><span className="pp-team-symbol"><Users size={26} /></span><div><h3>{DEMO_ACCOUNT.team}</h3><p>Shared ownership of payment, order processing and authentication services.</p></div></div><div className="pp-team-facts"><div><span>Members</span><strong>{members.length} people</strong></div><div><span>Services</span><strong>{services.length} services</strong></div><div><span>Assignment model</span><strong>Static escalation</strong></div></div><div className="pp-service-tags">{services.map(service => <span key={service}><Server size={14} />{service}</span>)}</div><div className="pp-team-actions"><button className="ws-button" onClick={() => { clearFilters(); setTab('members'); }}>View members <ArrowRight size={15} /></button><button className="ws-button" onClick={() => onView('services')}>Explore services <ArrowRight size={15} /></button></div></div>}
    </section>
    {tab === 'members' && selected && <section className="ws-panel pp-detail" aria-label={`${selected.name} member details`}>
      <div className="pp-detail-heading">{avatar(selected)}<div><h3>{selected.name}</h3><p>{selected.title}</p></div><button className="ws-icon-button" aria-label="Close member details" onClick={() => setSelectedId(null)}><X size={18} /></button></div>
      <div className="pp-detail-grid"><div><span>Work email</span><strong>{selected.email}</strong></div><div><span>Team</span><strong>{DEMO_ACCOUNT.team}</strong></div><div><span>Account role</span><strong>{selected.role}</strong></div><div><span>Response assignment</span><strong>{selected.duty} · {selected.detail}</strong></div></div>
      <h4>Assigned open incidents <span>{openFor(selected.id).length}</span></h4>
      {openFor(selected.id).length ? <div className="pp-incident-list">{openFor(selected.id).map(incident => <button key={incident.id} onClick={() => onIncident(incident.id)}><span className={`ws-priority ws-${incident.priority.toLowerCase()}`}>{incident.priority}</span><span><strong>{incident.title}</strong><small>#{incident.id} · {incident.service}</small></span><ChevronRight size={16} /></button>)}</div> : <p className="pp-no-incidents">No open incidents assigned to this member.</p>}
      {selected.id === RESPONDER_ID && <button className="ws-button" onClick={() => onView('profile')}>Edit my profile <ArrowRight size={15} /></button>}
    </section>}
    <section className="pp-response"><div><span className="pp-eyebrow">KNOW WHO RESPONDS NEXT</span><h3>Your team's escalation path</h3><p>Static assignments for this MVP. Acknowledging an incident stops escalation.</p></div><ol>{members.map((member, index) => <li key={member.id}><span>{index + 1}</span><div><strong>{member.name}</strong><small>{member.duty} · {member.detail}</small></div></li>)}</ol><p className="pp-response-note">Account roles define permissions. Primary, secondary and backstop describe response assignments; Incident Commander is assigned per incident.</p></section>
  </div>;
}
