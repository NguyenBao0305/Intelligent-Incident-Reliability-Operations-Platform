import { Activity, ArrowDown, ArrowRight, BellRing, Check, CircleHelp, Clock3, Eye, FileText, ShieldCheck, Users, Wrench } from 'lucide-react';
import { ProductsMenu } from '../components/ProductsMenu';
import { SolutionsMenu } from '../components/SolutionsMenu';
import { ResourcesMenu } from '../components/ResourcesMenu';
import './customer.css';

const audiences = [
  { icon: Activity, number: '01', title: 'SRE & platform teams', text: 'Connect a signal to its service, owner and response history. Keep the first view focused on the incident that needs attention.' },
  { icon: BellRing, number: '02', title: 'On-call responders', text: 'See who owns the response, acknowledge when you take it, and leave notes where the rest of the team can follow.' },
  { icon: Users, number: '03', title: 'Team managers', text: 'Make service ownership, coverage plans and escalation paths easier to review before the next handover.' },
  { icon: Eye, number: '04', title: 'Operational stakeholders', text: 'Follow incident status and approved post-incident learning with access suited to a read-only role.' },
];

function CustomerHeader() {
  return <header className="landing-header customer-header">
    <div className="landing-brand"><a href="#" className="customer-brand" aria-label="NexusOps home">Nexus<span>Ops</span></a></div>
    <nav aria-label="Main navigation" className="landing-nav flex items-center gap-8 text-[15px] font-medium text-slate-600">
      <ProductsMenu /><SolutionsMenu />
      <div className="customer-nav-secondary"><a href="#customers" aria-current="page">Customer</a><ResourcesMenu /></div>
      <a href="#pricing">Pricing</a>
    </nav>
    <div className="landing-account customer-account"><a href="#login">Log in</a><a className="customer-nav-cta" href="#signup">Join your team</a></div>
  </header>;
}

function ResponsePreview() {
  return <div className="customer-preview" aria-label="Illustrative incident response workspace using sample data">
    <div className="customer-preview-orbit customer-orbit-one"/><div className="customer-preview-orbit customer-orbit-two"/>
    <article className="customer-incident-card">
      <div className="customer-preview-top"><span><Activity size={15}/> NEXUSOPS · INCIDENT ROOM</span><span className="customer-sample-tag"><i/> SAMPLE</span></div>
      <div className="customer-incident-title"><div><small>PAYMENTS API · PRODUCTION</small><h2>Payment latency is elevated</h2></div><span className="customer-p1">P1</span></div>
      <div className="customer-incident-meta"><span><Clock3 size={14}/> Triggered · 4 min ago</span><span><Users size={14}/> Linh Nguyen</span></div>
      <div className="customer-alerts"><div><span className="customer-alert-icon"><Activity size={14}/></span><span><b>Error rate above threshold</b><small>payments-api · 5xx responses</small></span><i/></div><div><span className="customer-alert-icon"><Wrench size={14}/></span><span><b>Request latency rising</b><small>payments-api · p95 duration</small></span><i/></div></div>
      <div className="customer-response-line"><div className="customer-response-step is-done"><span><Check size={13}/></span><div><b>Signal grouped</b><small>Related alerts · one incident</small></div></div><div className="customer-response-step is-current"><span>2</span><div><b>Responder notified</b><small>Waiting for acknowledgement</small></div></div><div className="customer-response-step"><span>3</span><div><b>Review and learn</b><small>Capture the response timeline</small></div></div></div>
      <div className="customer-preview-foot"><ShieldCheck size={14}/> One shared response record <span>Illustrative data</span></div>
    </article>
    <div className="customer-float-chip customer-chip-ack"><span><BellRing size={15}/></span><div><b>Clear ownership</b><small>Assigned responder</small></div><Check size={15}/></div>
    <div className="customer-float-chip customer-chip-pir"><span><FileText size={15}/></span><div><b>Learn after resolve</b><small>Review stays with the incident</small></div></div>
    <span className="customer-art-caption"><i/>Sample workspace preview · no live customer data</span>
  </div>;
}

export function CustomerPage() {
  return <div className="customer-page">
    <CustomerHeader />
    <main>
      <section className="customer-hero">
        <div className="customer-hero-copy">
          <div className="customer-breadcrumb"><a href="#">NexusOps</a><span>/</span><strong>Customer</strong></div>
          <span className="customer-eyebrow"><i/> FOR THE TEAMS BEHIND RELIABLE SERVICES</span>
          <h1>When something breaks,<br/><em>work as one team.</em></h1>
          <p>Give responders and service owners a shared place to understand an incident, see who is responsible and keep the learning after it is resolved.</p>
          <div className="customer-hero-actions"><a className="customer-button customer-button-primary" href="#login">Explore the workspace <ArrowRight size={17}/></a><a className="customer-button customer-button-quiet" href="#customer-teams">Who it is for <ArrowDown size={16}/></a></div>
          <div className="customer-hero-note"><ShieldCheck size={15}/><span>One team MVP · role-based access · human-led response</span></div>
        </div>
        <ResponsePreview />
      </section>

      <section className="customer-teams" id="customer-teams">
        <div className="customer-section-heading"><span className="customer-eyebrow">MADE FOR THE RESPONSE TEAM</span><h2>Different responsibilities.<br/><em>One clear picture.</em></h2><p>NexusOps brings operational context together while keeping each person’s actions tied to their role and assignment.</p></div>
        <div className="customer-audience-grid">{audiences.map(({ icon: Icon, number, title, text }) => <article className="customer-audience-card" key={number}><div className="customer-audience-top"><span><Icon size={19}/></span><small>{number}</small></div><h3>{title}</h3><p>{text}</p><div className="customer-audience-foot"><span/>Inside the same team workspace</div></article>)}</div>
      </section>

      <section className="customer-journey">
        <div className="customer-journey-copy"><span className="customer-eyebrow">A PRACTICAL CUSTOMER JOURNEY</span><h2>From first signal<br/><em>to a better next response.</em></h2><p>Keep the incident lifecycle understandable: capture signals, establish an owner, coordinate actions, then carry verified learning forward.</p><a href="#product-incident-management" className="customer-inline-link">Explore Incident Management <ArrowRight size={16}/></a></div>
        <div className="customer-journey-steps"><article><span className="customer-step-index">01</span><div><b>Understand the signal</b><p>Relate alerts to a service and keep the evidence visible.</p></div><span className="customer-step-symbol"><Activity size={18}/></span></article><article><span className="customer-step-index">02</span><div><b>Make ownership clear</b><p>Show the assigned responder and let the right person acknowledge.</p></div><span className="customer-step-symbol"><Users size={18}/></span></article><article><span className="customer-step-index">03</span><div><b>Respond with context</b><p>Keep notes, status changes and reviewable actions together.</p></div><span className="customer-step-symbol"><ShieldCheck size={18}/></span></article><article><span className="customer-step-index">04</span><div><b>Carry the learning forward</b><p>Record a post-incident review and track its follow-up work.</p></div><span className="customer-step-symbol"><FileText size={18}/></span></article></div>
      </section>

      <section className="customer-scope-note"><span><CircleHelp size={19}/></span><div><b>A clear preview of what the MVP supports.</b><p>This page illustrates intended team workflows. The current workspace uses local sample data; monitoring delivery, email paging and backend authentication are not connected yet.</p></div><a href="#product-on-call-escalation">See the response flow <ArrowRight size={15}/></a></section>
      <section className="customer-final-cta"><div><span className="customer-eyebrow">START WITH A SHARED WORKSPACE</span><h2>Make the next response<br/><em>easier to follow.</em></h2><p>Explore the NexusOps demo or join a workspace with an invitation from your administrator.</p></div><div className="customer-cta-actions"><a className="customer-button customer-button-light" href="#login">Explore the demo <ArrowRight size={17}/></a><a className="customer-cta-secondary" href="#signup">Have an invitation? Join your team</a></div><div className="customer-cta-orb" aria-hidden="true"/></section>
    </main>
    <footer className="customer-footer"><a href="#" className="customer-brand">Nexus<span>Ops</span></a><span>Intelligent incident &amp; reliability operations</span><a href="#pricing">Free workspace preview <ArrowRight size={14}/></a></footer>
  </div>;
}
