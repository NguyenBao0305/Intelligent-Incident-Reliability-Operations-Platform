import { Activity, ArrowDown, ArrowRight, BadgeCheck, Check, CircleAlert, ClipboardCheck, Clock3, FileText, History, ListChecks, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { ProductsMenu } from '../components/ProductsMenu';
import { SolutionsMenu } from '../components/SolutionsMenu';
import { ResourcesMenu } from '../components/ResourcesMenu';
import './incident-management.css';
import './post-incident-insights.css';

function PublicHeader() {
  return <header className="landing-header im-header">
    <div className="landing-brand"><a href="#" className="im-brand" aria-label="NexusOps home">Nexus<span>Ops</span></a></div>
    <nav aria-label="Main navigation" className="landing-nav"><ProductsMenu /><SolutionsMenu /><div className="im-nav-secondary"><a href="#customers">Customer</a><ResourcesMenu /></div><a href="#pricing">Pricing</a></nav>
    <div className="landing-account im-account"><a href="#login">Log in</a><a href="#signup" className="im-header-cta">Join your team</a></div>
  </header>;
}

function ReviewPreview() {
  return <div className="pi-preview-wrap" aria-label="Illustrative post-incident review and response metric cards using sample data">
    <div className="pi-preview-glow" />
    <article className="pi-review-card">
      <div className="pi-review-top"><span><ClipboardCheck size={15} /> POST-INCIDENT REVIEW</span><span className="pi-draft-badge"><i /> AI DRAFT · NEEDS REVIEW</span></div>
      <div className="pi-review-title"><div><small>INCIDENT #1048 · PAYMENTS API</small><h2>Payment API error rate above threshold</h2></div><span className="pi-review-status">DRAFT</span></div>
      <div className="pi-review-meta"><span><Clock3 size={13} /> 09:42–10:24 UTC</span><span><Users size={13} /> 3 responders</span><span>Production</span></div>
      <div className="pi-review-summary"><span className="pi-summary-icon"><Sparkles size={15} /></span><div><strong>Summary draft</strong><p>Payment requests returned elevated 5xx responses. Responders acknowledged the incident, reviewed a deployment change and restored service using the approved response runbook.</p><small><BadgeCheck size={12} /> Claims link to incident events and action records</small></div></div>
      <div className="pi-evidence-timeline"><div className="pi-timeline-head"><span>RESPONSE TIMELINE</span><span>4 source events</span></div><div className="pi-timeline-row"><span className="pi-event-time">09:42</span><i className="pi-event-node pi-node-alert" /><div><strong>Incident triggered</strong><small>Alert A-1048 · error rate exceeded threshold</small></div></div><div className="pi-timeline-row"><span className="pi-event-time">09:46</span><i className="pi-event-node pi-node-ack" /><div><strong>Responder acknowledged</strong><small>Linh Nguyen · ownership accepted</small></div></div><div className="pi-timeline-row"><span className="pi-event-time">10:08</span><i className="pi-event-node pi-node-action" /><div><strong>Recovery action succeeded</strong><small>Runbook RB-12 · outcome confirmed</small></div></div><div className="pi-timeline-row"><span className="pi-event-time">10:24</span><i className="pi-event-node pi-node-resolved" /><div><strong>Incident resolved</strong><small>All linked alerts recovered</small></div></div></div>
      <div className="pi-review-bottom"><span><CircleAlert size={13} /> Root cause remains a hypothesis until reviewed</span><span>Sample record</span></div>
    </article>
    <div className="pi-metric-card"><span><Clock3 size={14} /> MTTA</span><strong>4m 12s</strong><small>12 incidents · sample window</small><div><i style={{ width: '58%' }} /></div></div>
    <div className="pi-action-chip"><span><ListChecks size={16} /></span><div><strong>Follow-up actions</strong><small>2 owners · due dates set</small></div><Check size={15} /></div>
    <span className="pi-preview-caption"><i />Illustrative PIR · sample data · human review required</span>
  </div>;
}

const steps = [
  { icon: History, number: '01', title: 'Preserve the incident record', text: 'Use the resolved incident, ordered timeline, responder notes, evidence and action outcomes as review inputs.' },
  { icon: Sparkles, number: '02', title: 'Draft a sourced review', text: 'AI proposes a summary, impact, timeline, hypotheses, confirmed facts, contributing factors, action items and unknowns.' },
  { icon: Users, number: '03', title: 'Edit and review together', text: 'A person checks claims against their evidence, updates the draft and moves it through the review workflow.' },
  { icon: BadgeCheck, number: '04', title: 'Approve and carry learning forward', text: 'Only approved content can be completed and considered for the knowledge base, with its review version preserved.' },
];

export function PostIncidentInsightsPage() {
  return <div className="im-page pi-page">
    <PublicHeader />
    <main>
      <section className="im-hero pi-hero">
        <div className="im-hero-copy"><div className="im-breadcrumb"><a href="#">NexusOps</a><span>/</span><span>Products</span><span>/</span><strong>Post-Incident Review &amp; Insights</strong></div>
          <span className="im-eyebrow"><i /> POST-INCIDENT REVIEW · GOVERNANCE · LEARNING</span>
          <h1>Turn incident history into <em>better next steps.</em></h1>
          <p className="im-hero-description">Build a review from the incident’s evidence and response timeline. Let AI draft the story, let people verify it, and track the follow-up work that improves reliability.</p>
          <div className="im-hero-actions"><a className="im-button im-button-primary" href="#login">Explore the demo <ArrowRight size={17} /></a><a className="im-button im-button-secondary" href="#pi-flow" onClick={event => { event.preventDefault(); document.getElementById('pi-flow')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }}>See the review flow <ArrowDown size={16} /></a></div>
          <div className="im-hero-note"><ShieldCheck size={15} /><span>AI creates a draft. A reviewer owns the final account and approval.</span></div>
        </div>
        <ReviewPreview />
      </section>

      <section id="pi-flow" className="im-flow-section pi-flow-section"><div className="im-section-heading"><span className="im-eyebrow">FROM RESOLVED INCIDENT TO SHARED LEARNING</span><h2>A review should explain what the record supports.</h2><p>Keep the source events visible as the team moves from an AI-assisted draft to an approved review and owned follow-up actions.</p></div>
        <div className="im-flow-grid">{steps.map(({ icon: Icon, number, title, text }, index) => <article className="im-flow-card" key={number}><div className="im-flow-card-top"><span className="im-flow-icon"><Icon size={19} /></span><span>{number}</span></div><h3>{title}</h3><p>{text}</p>{index < steps.length - 1 && <span className="im-flow-connector" aria-hidden="true"><ArrowRight size={15} /></span>}</article>)}</div>
        <div className="pi-flow-footnote"><CircleAlert size={15} /><span>A draft is not an approved conclusion. A close timestamp near a deployment alone cannot establish causality, and an action with UNKNOWN outcome must remain unknown in the review.</span></div>
      </section>

      <section className="pi-governance-section"><div className="pi-governance-copy"><span className="im-eyebrow">REVIEW STATES STAY EXPLICIT</span><h2>People can see what is draft, reviewed and complete.</h2><p>Each state has a clear purpose so generated text does not silently become an official account of an incident.</p><div className="pi-state-list"><div><span className="pi-state-number">01</span><span><strong>Draft</strong><small>AI creates or an editor updates review content.</small></span></div><div><span className="pi-state-number">02</span><span><strong>In review</strong><small>Reviewers check evidence, impact, timeline and actions.</small></span></div><div><span className="pi-state-number">03</span><span><strong>Approved</strong><small>An authorized reviewer accepts the current version.</small></span></div><div><span className="pi-state-number">04</span><span><strong>Completed</strong><small>Action items retain owners, due dates and status.</small></span></div></div></div>
        <div className="pi-metrics-panel"><div className="pi-metrics-heading"><span><Activity size={15} /> RESPONSE METRICS</span><span>7 DAYS · SAMPLE</span></div><div className="pi-metrics-grid"><article><small>MTTA</small><strong>4m 12s</strong><span>Average time to first ACK</span><i>12 incidents included</i></article><article><small>MTTR</small><strong>42m 08s</strong><span>Average time to resolve</span><i>9 incidents included</i></article></div><div className="pi-sparkline"><span>Incident response time · illustrative</span><svg viewBox="0 0 400 88" role="img" aria-label="Illustrative response time trend"><defs><linearGradient id="piTrendFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#76bf91" stopOpacity=".26"/><stop offset="1" stopColor="#76bf91" stopOpacity="0"/></linearGradient></defs><path d="M0 67 C26 66 30 35 58 43 S92 66 120 54 151 61 180 39 209 52 240 31 269 50 302 25 338 40 365 18 386 26 400 14V88H0Z" fill="url(#piTrendFill)"/><path d="M0 67 C26 66 30 35 58 43 S92 66 120 54 151 61 180 39 209 52 240 31 269 50 302 25 338 40 365 18 386 26 400 14" fill="none" stroke="#3c9160" strokeWidth="2.5" strokeLinecap="round"/><path d="M0 78H400M0 52H400M0 26H400" stroke="#e7efe8" strokeDasharray="3 5"/></svg></div><div className="pi-metrics-note"><ShieldCheck size={14} /><span>Always show the time window and sample count. MTTD is outside this MVP.</span></div></div>
      </section>

      <section className="pi-kb-section"><div className="pi-kb-illustration" aria-hidden="true"><div className="pi-kb-orbit pi-kb-orbit-a"/><div className="pi-kb-orbit pi-kb-orbit-b"/><div className="pi-kb-document"><span><FileText size={20}/></span><i/><i/><i/><strong>APPROVED REVIEW</strong></div><span className="pi-kb-node pi-kb-node-one"><BadgeCheck size={17}/></span><span className="pi-kb-node pi-kb-node-two"><Sparkles size={16}/></span><span className="pi-kb-node pi-kb-node-three"><History size={16}/></span></div><div className="pi-kb-copy"><span className="im-eyebrow">LEARNING WITH PROVENANCE</span><h2>Only reviewed knowledge moves forward.</h2><p>After a PIR is approved, its specific version can become a knowledge source for future investigations. Keep the source reference so responders can trace what the retrieval used.</p><a className="im-inline-link" href="#product-ai-automation">See AI Investigation &amp; Automation <ArrowRight size={16}/></a></div></section>

      <section className="pi-scope-section"><div className="pi-scope-mark"><ShieldCheck size={22}/></div><div><span className="im-eyebrow">MVP SCOPE · CURRENT UI</span><h2>Useful review workflows, with a human-owned conclusion.</h2><p>The MVP defines a versioned PIR with DRAFT → IN_REVIEW → APPROVED → COMPLETED states, evidence-backed AI drafts, basic action items and MTTA/MTTR with sample counts. The current workspace has sample analytics, but no connected PIR editor, review workflow, backend metrics or audit viewer. This public page uses illustrative records and charts.</p></div><a href="#pricing" className="pi-scope-link">See free access <ArrowRight size={15}/></a></section>

      <section className="im-final-cta pi-final-cta"><div className="im-cta-orb"/><span className="im-eyebrow">LEARN FROM EACH RESPONSE</span><h2>Make follow-up work as clear as the incident.</h2><p>Explore the NexusOps workflow for incident response, investigation and controlled automation.</p><div><a className="im-button im-button-light" href="#product-incident-management">See Incident Management <ArrowRight size={17}/></a><a className="im-cta-login" href="#product-ai-automation">Explore AI Investigation</a></div></section>
    </main>
    <footer className="im-footer"><a href="#" className="im-brand">Nexus<span>Ops</span></a><span>Incident &amp; Reliability Operations</span><a href="#product-incident-management">Incident Management <ArrowRight size={14}/></a></footer>
  </div>;
}
