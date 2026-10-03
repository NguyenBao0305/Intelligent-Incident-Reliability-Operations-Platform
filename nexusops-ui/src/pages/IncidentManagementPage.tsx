import { Activity, ArrowDown, ArrowRight, BellRing, Check, CircleDot, Clock3, FileText, GitBranch, Layers3, ShieldCheck, Users, Zap } from 'lucide-react';
import { ProductsMenu } from '../components/ProductsMenu';
import { SolutionsMenu } from '../components/SolutionsMenu';
import { ResourcesMenu } from '../components/ResourcesMenu';
import './incident-management.css';

const steps = [
  { icon: Layers3, number: '01', title: 'Bring related alerts together', text: 'Organize matching signals into one incident using service, rule and time-window criteria from the MVP.' },
  { icon: Users, number: '02', title: 'Make ownership visible', text: 'Show the assigned responder, incident priority and current status in one shared record.' },
  { icon: BellRing, number: '03', title: 'Acknowledge and coordinate', text: 'The responder ACKs to take responsibility. Notes and timeline entries keep the response understandable.' },
  { icon: Check, number: '04', title: 'Resolve with context', text: 'Record why the incident was resolved and retain its alert and response history for later review.' },
];

const capabilities = [
  { icon: Activity, title: 'One incident record', text: 'See linked alerts, service, priority, status, owner and response timeline together.' },
  { icon: ShieldCheck, title: 'Clear response boundaries', text: 'ACK means taking ownership. Resolve is a separate action with its own conditions and reason.' },
  { icon: FileText, title: 'Context that stays together', text: 'Keep responder notes and important state changes with the incident as the response progresses.' },
];

function PublicHeader() {
  return <header className="landing-header im-header">
    <div className="landing-brand"><a href="#" className="im-brand" aria-label="NexusOps home">Nexus<span>Ops</span></a></div>
    <nav aria-label="Main navigation" className="landing-nav">
      <ProductsMenu /><SolutionsMenu />
      <div className="im-nav-secondary"><a href="#customers">Customer</a><ResourcesMenu /></div>
      <a href="#pricing">Pricing</a>
    </nav>
    <div className="landing-account im-account"><a href="#login">Log in</a><a href="#signup" className="im-header-cta">Join your team</a></div>
  </header>;
}

function IncidentPreview() {
  return <div className="im-preview-wrap" aria-label="Illustrative incident preview using sample data">
    <div className="im-preview-glow" />
    <article className="im-preview-card">
      <div className="im-preview-top"><span className="im-preview-brand"><Activity size={16} /> RESPONSE WORKSPACE</span><span className="im-sample-pill"><i /> SAMPLE INCIDENT</span></div>
      <div className="im-preview-title-row"><div><span className="im-preview-kicker">PAYMENTS API · PRODUCTION</span><h2>Payment API error rate above threshold</h2></div><span className="im-p1">P1</span></div>
      <div className="im-preview-meta"><span><CircleDot size={13} /> Triggered</span><span><Clock3 size={13} /> 4 min ago</span><span><Users size={13} /> Linh Nguyen</span></div>
      <div className="im-preview-divider" />
      <div className="im-signal-list"><div className="im-signal-heading"><span>RELATED SIGNALS</span><span>2 alerts · grouped by service</span></div><div><span className="im-signal-icon"><Activity size={14} /></span><span><strong>HTTP 5xx rate above 5%</strong><small>payments-api · production</small></span><span className="im-signal-state">Active</span></div><div><span className="im-signal-icon"><Zap size={14} /></span><span><strong>Request latency p95 elevated</strong><small>payments-api · production</small></span><span className="im-signal-state">Active</span></div></div>
      <div className="im-preview-timeline"><div className="im-timeline-track"><i /><i /><i /></div><div><span><strong>Incident created</strong><small>Ownership assigned to Linh</small></span><span><strong>Responder notified</strong><small>Awaiting acknowledgement</small></span><span><strong>Next step</strong><small>ACK to take ownership</small></span></div></div>
      <div className="im-preview-footer"><span><ShieldCheck size={14} /> One record. Clear ownership.</span><span>Demo data</span></div>
    </article>
    <div className="im-floating-chip im-floating-alert"><span><Activity size={15} /></span><div><strong>2 related alerts</strong><small>Same service · one incident</small></div><Check size={15} /></div>
    <div className="im-floating-chip im-floating-owner"><span className="im-owner-avatar">LN</span><div><strong>Responder assigned</strong><small>Ready to acknowledge</small></div></div>
    <div className="im-art-caption"><span />Illustrative preview · sample data</div>
  </div>;
}

export function IncidentManagementPage() {
  return <div className="im-page">
    <PublicHeader />
    <main>
      <section className="im-hero">
        <div className="im-hero-copy">
          <div className="im-breadcrumb"><a href="#">NexusOps</a><span>/</span><span>Products</span><span>/</span><strong>Incident Management</strong></div>
          <span className="im-eyebrow"><i /> INCIDENT MANAGEMENT · MVP WORKFLOW</span>
          <h1>Turn alerts into a response <em>everyone can follow.</em></h1>
          <p className="im-hero-description">Bring related alerts, responder ownership and investigation notes into one incident record—from the first signal through resolution.</p>
          <div className="im-hero-actions"><a className="im-button im-button-primary" href="#login">Explore the demo <ArrowRight size={17} /></a><a className="im-button im-button-secondary" href="#incident-flow" onClick={event => { event.preventDefault(); document.getElementById('incident-flow')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }}>See how it works <ArrowDown size={16} /></a></div>
          <div className="im-hero-note"><ShieldCheck size={15} /><span>Designed for one clear response flow. This preview uses sample data.</span></div>
        </div>
        <IncidentPreview />
      </section>

      <section id="incident-flow" className="im-flow-section">
        <div className="im-section-heading"><span className="im-eyebrow">FROM SIGNAL TO RESOLVED RECORD</span><h2>A response with a clear next step.</h2><p>Incident Management connects the essential actions responders take during an incident.</p></div>
        <div className="im-flow-grid">{steps.map(({ icon: Icon, number, title, text }, index) => <article className="im-flow-card" key={number}><div className="im-flow-card-top"><span className="im-flow-icon"><Icon size={19} /></span><span>{number}</span></div><h3>{title}</h3><p>{text}</p>{index < steps.length - 1 && <span className="im-flow-connector" aria-hidden="true"><ArrowRight size={15} /></span>}</article>)}</div>
        <div className="im-flow-footnote"><GitBranch size={15} /><span>Alert grouping follows configured rules within the same service; the MVP does not use AI to decide which alerts belong together.</span></div>
      </section>

      <section className="im-capabilities-section">
        <div className="im-capabilities-intro"><span className="im-eyebrow">BUILT AROUND ACCOUNTABILITY</span><h2>Everything responders need to see the incident clearly.</h2><p>Keep the response understandable as responsibility moves from detection to human action.</p><a className="im-inline-link" href="#login">See the Responder workspace <ArrowRight size={16} /></a></div>
        <div className="im-capability-list">{capabilities.map(({ icon: Icon, title, text }, index) => <article className="im-capability" key={title}><span className={`im-capability-icon im-capability-${index}`}><Icon size={20} /></span><div><h3>{title}</h3><p>{text}</p></div><span className="im-capability-check"><Check size={15} /></span></article>)}</div>
      </section>

      <section className="im-boundary-section"><div className="im-boundary-mark"><ShieldCheck size={22} /></div><div><span className="im-eyebrow">MVP BOUNDARIES</span><h2>Human ownership stays visible.</h2><p>An incident is not resolved just because an alert was read. A responder first acknowledges ownership, investigates and records the resolution. Escalation and notifications are presented as workflow concepts in this public preview; live paging and monitoring connections are not active.</p></div><a href="#pricing" className="im-boundary-link">See free access <ArrowRight size={16} /></a></section>

      <section className="im-final-cta"><div className="im-cta-orb" /><span className="im-eyebrow">READY TO EXPLORE?</span><h2>See incident response in the NexusOps workspace.</h2><p>Open the sample Responder experience and follow an incident from its alert through ACK and resolution.</p><div><a className="im-button im-button-light" href="#login">Explore the demo <ArrowRight size={17} /></a><a className="im-cta-login" href="#signup">Have a team invitation? Join your team</a></div></section>
    </main>
    <footer className="im-footer"><a href="#" className="im-brand">Nexus<span>Ops</span></a><span>Incident &amp; Reliability Operations</span><a href="#">Back to home <ArrowRight size={14} /></a></footer>
  </div>;
}
