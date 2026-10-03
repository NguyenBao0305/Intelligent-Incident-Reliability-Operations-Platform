import { useState } from 'react';
import { Activity, ArrowRight, BellRing, Check, ChevronRight, CircleDot, Code2, FileText, GitBranch, Layers3, Search, Server, ShieldCheck, Sparkles, Users } from 'lucide-react';
import './landing-story.css';

const tour = [
  { title: 'A shared incident record', icon: Activity, description: 'Bring related alerts, ownership and response history into one clear view.', label: 'Incident response' },
  { title: 'The right response path', icon: BellRing, description: 'Know the assigned responders and follow a bounded escalation policy when nobody acknowledges.', label: 'On-call & escalation' },
  { title: 'Evidence before action', icon: Sparkles, description: 'Review findings and proposed runbooks. Required approval stays with an authorized person.', label: 'AI investigation' },
  { title: 'Context for the next incident', icon: FileText, description: 'Keep the timeline and resolution together to support post-incident learning.', label: 'Review & insights' },
];

function WorkspaceIllustration() {
  return <div className="ls-workspace" aria-label="Illustrative Responder workspace with sample incidents">
    <div className="ls-window-bar"><span className="ls-window-dots"><i /><i /><i /></span><span>workspace.nexusops · Responder</span><span className="ls-demo-label">SAMPLE DATA</span></div>
    <div className="ls-app-bar"><strong>Nexus<span>Ops</span></strong><span className="ls-app-active">Incidents</span><span>Services</span><span>People</span><span className="ls-app-end"><BellRing size={16} /><i>LN</i></span></div>
    <div className="ls-workspace-body"><div className="ls-workspace-main"><div className="ls-workspace-title"><div><small>YOUR RESPONSE WORKSPACE</small><h3>Every incident. A clear owner.</h3></div><span className="ls-green-pill">Platform team</span></div>
      <div className="ls-stats">{[['5', 'Open incidents'], ['3', 'Triggered'], ['2', 'Acknowledged']].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span><Activity size={18} /></div>)}</div>
      <div className="ls-table"><div className="ls-table-tools"><span>Assigned to me</span><span>All</span><Search size={15} /></div><div className="ls-table-head"><span>STATUS</span><span>INCIDENT</span><span>PRIORITY</span></div>{[
        ['Triggered', 'Payment API error rate elevated', 'payments-api · 2 alerts', 'P1'],
        ['Acknowledged', 'Worker queue processing delayed', 'order-worker · 1 alert', 'P2'],
        ['Triggered', 'Authentication latency increased', 'auth-service · 1 alert', 'P3'],
      ].map(([status, title, service, priority]) => <div className="ls-table-row" key={title}><span className={`ls-status ${status === 'Triggered' ? 'ls-status-alert' : ''}`}><CircleDot size={10} />{status}</span><div><strong>{title}</strong><small>{service}</small></div><span className={`ls-priority ls-priority-${priority}`}>{priority}</span></div>)}</div>
    </div><aside className="ls-workspace-side"><span className="ls-mini-label">RESPONSE CONTEXT</span><div className="ls-avatar">LN</div><h4>Linh Nguyen</h4><p>Assigned responder</p><div className="ls-side-line"><Server size={15} /><span>payments-api</span></div><div className="ls-side-line"><Users size={15} /><span>Platform team</span></div><div className="ls-side-note"><ShieldCheck size={18} /><strong>Ownership is explicit.</strong><p>Acknowledge to take responsibility for the response.</p></div></aside></div>
  </div>;
}

function TourIllustration({ active }: { active: number }) {
  return <div className="ls-tour-art" key={active}>
    <div className="ls-art-heading"><span><Activity size={16} /> NEXUSOPS / {tour[active].label.toUpperCase()}</span><span>Illustrative preview</span></div>
    {active === 0 && <div className="ls-response-art"><span className="ls-green-pill">INCIDENT #1048</span><h3>Payment API error rate elevated</h3><p className="ls-art-muted">payments-api · Production · Priority P1</p><div className="ls-alert-pair"><div><Activity size={19} /><strong>HTTP 5xx threshold</strong><small>Related alert</small></div><div><Activity size={19} /><strong>Latency p95 elevated</strong><small>Related alert</small></div></div><div className="ls-group-rule"><GitBranch size={16} />Same service + matching rule + time window</div><div className="ls-owner-row"><span className="ls-avatar">LN</span><div><strong>Linh Nguyen</strong><small>Acknowledged · response in progress</small></div><Check size={20} /></div></div>}
    {active === 1 && <div className="ls-response-art"><span className="ls-green-pill">ESCALATION POLICY</span><h3>A clear path when no one responds.</h3><p className="ls-art-muted">Two levels, limited reminders and a final backstop.</p><div className="ls-escalation-path">{[['01', 'Primary responders', 'Notify the assigned users'], ['02', 'Secondary responders', 'Escalate after the configured ACK timeout'], ['03', 'Final backstop', 'One final notification; escalation ends']].map(([n,title,text]) => <div key={n}><span>{n}</span><div><strong>{title}</strong><small>{text}</small></div><ChevronRight size={16} /></div>)}</div><div className="ls-art-note"><ShieldCheck size={16} />Acknowledgement stops further escalation.</div></div>}
    {active === 2 && <div className="ls-response-art"><span className="ls-green-pill"><Sparkles size={12} /> INVESTIGATION CONCEPT</span><h3>Evidence, with room for judgment.</h3><div className="ls-evidence"><span>01 / OBSERVATION</span><p>Error rate increased after a recent deployment.</p><small>Sources: linked alerts · deployment history</small></div><div className="ls-evidence ls-hypothesis"><span>02 / HYPOTHESIS</span><p>The deployment may be related. Further investigation is needed.</p></div><div className="ls-approval"><ShieldCheck size={21} /><div><strong>Diagnostic runbook proposed</strong><small>Awaiting authorized review · not executed</small></div><span>Review</span></div></div>}
    {active === 3 && <div className="ls-response-art"><span className="ls-green-pill">RESPONSE HISTORY</span><h3>Keep the story behind the resolution.</h3><div className="ls-history">{[['09:41', 'Incident triggered', 'Related signals linked to payments-api'], ['09:44', 'Ownership acknowledged', 'Responder started the investigation'], ['10:06', 'Incident resolved', 'Resolution reason recorded']].map(([time,title,text]) => <div key={time}><time>{time}</time><span><strong>{title}</strong><small>{text}</small></span><Check size={14} /></div>)}</div><div className="ls-art-note"><FileText size={17} />Use the record to review what happened and what to improve.</div></div>}
  </div>;
}

export function LandingStory() {
  const [active, setActive] = useState(0);
  return <div className="landing-story">
    <section id="demo" className="ls-overview ls-section">
      <div className="ls-heading ls-centered"><span className="ls-eyebrow"><span /> MEET YOUR RESPONSE WORKSPACE</span><h2>From scattered signals<br />to a <em>shared understanding.</em></h2><p>See what needs attention, who owns the response and what happens next. NexusOps brings the essential context into one place.</p></div>
      <div className="ls-workspace-stage"><WorkspaceIllustration /></div>
      <div className="ls-overview-caption"><span><Layers3 size={15} /> One organization. One team. A connected response.</span><a href="#login">Explore the Responder demo <ArrowRight size={16} /></a></div>
    </section>

    <section className="ls-section ls-tour-section"><div className="ls-heading"><span className="ls-eyebrow">THE INCIDENT LIFECYCLE</span><h2>A clear next step.<br /><em>At every stage.</em></h2><div className="ls-heading-bottom"><p>Follow the response from the first alert to the final resolution. Explore how each part of NexusOps fits into the workflow.</p><a className="ls-text-link" href="#product-incident-management">Explore Incident Management <ArrowRight size={17} /></a></div></div>
      <div className="ls-tour"><div className="ls-tour-options" aria-label="Explore the incident lifecycle">{tour.map(({ title, icon: Icon, description }, index) => <button key={title} type="button" className={active === index ? 'is-active' : ''} aria-pressed={active === index} aria-controls="landing-tour-preview" onClick={() => setActive(index)}><span className="ls-option-icon"><Icon size={21} /></span><span><small>0{index + 1}</small><strong>{title}</strong><span>{description}</span></span><ArrowRight size={16} /></button>)}</div><div id="landing-tour-preview" className="ls-tour-canvas" aria-live="polite"><TourIllustration active={active} /></div></div>
      <p className="ls-preview-note">Interactive product illustration · AI investigation and post-incident review describe the planned MVP workflow.</p>
    </section>

    <section className="ls-connections"><div className="ls-section ls-connections-grid"><div className="ls-heading"><span className="ls-eyebrow">START WITH THE SIGNAL</span><h2>Give every alert<br /><em>the right context.</em></h2><p>Connect an event to its service, organize related alerts and bring the incident to the people responsible for it.</p><ul className="ls-check-list"><li><Check size={17} />Service ownership stays with the incident</li><li><Check size={17} />Grouping follows configured rules</li><li><Check size={17} />Response changes stay in the timeline</li></ul><a className="ls-text-link" href="#login">Explore the workspace <ArrowRight size={17} /></a></div><div className="ls-signal-map" aria-label="Concept: monitoring events flow into a service, incident and responder"><div className="ls-signal-sources"><span><Activity size={19} />Monitoring event</span><span><Code2 size={19} />Event API</span></div><div className="ls-map-connector" /><div className="ls-nexus-node"><Activity size={24} /><strong>Nexus<span>Ops</span></strong><small>Service context · alert grouping</small></div><div className="ls-map-connector" /><div className="ls-signal-destinations"><span><Layers3 size={19} />Incident record</span><span><Users size={19} />Assigned responders</span></div><p>Integration workflow concept · live connections are not active in the demo.</p></div></div></section>

    <section className="ls-closing"><div><span className="ls-eyebrow">TAKE A CLOSER LOOK</span><h2>Your next incident deserves<br /><em>a clearer response.</em></h2><p>Walk through the sample workspace and discover how NexusOps brings the response together.</p><a className="ls-cta" href="#login">Explore the free demo <ArrowRight size={18} /></a><span className="ls-closing-note">Sample data · Responder account available</span></div><div className="ls-closing-orbit" aria-hidden="true"><div /><span><Activity size={42} /></span><i /><i /><i /></div></section>
    <footer className="ls-footer"><a href="#" className="ls-footer-brand">Nexus<span>Ops</span></a><span>Incident &amp; Reliability Operations</span><a href="#product-incident-management">Incident Management</a><a href="#pricing">Free access <ArrowRight size={14} /></a></footer>
  </div>;
}
