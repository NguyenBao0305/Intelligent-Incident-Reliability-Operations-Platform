import { Activity, ArrowDown, ArrowRight, BookOpenCheck, Check, CircleHelp, Clock3, FileCheck2, GitBranch, LockKeyhole, SearchCheck, ShieldCheck, Users } from 'lucide-react';
import type { ReactElement } from 'react';
import { ProductsMenu } from '../components/ProductsMenu';
import { SolutionsMenu } from '../components/SolutionsMenu';
import { ResourcesMenu } from '../components/ResourcesMenu';
import { solutionKeys, solutionPageTitles, solutions, type SolutionKey } from './solution-definitions';
import './incident-management.css';
import './solution-page.css';

function PublicHeader() {
  return <header className="landing-header im-header sol-header">
    <div className="landing-brand"><a href="#" className="im-brand" aria-label="NexusOps home">Nexus<span>Ops</span></a></div>
    <nav aria-label="Main navigation" className="landing-nav"><ProductsMenu /><SolutionsMenu /><div className="im-nav-secondary"><a href="#customers">Customer</a><ResourcesMenu /></div><a href="#pricing">Pricing</a></nav>
    <div className="landing-account im-account"><a href="#login">Log in</a><a href="#signup" className="im-header-cta">Join your team</a></div>
  </header>;
}

function AlertVisual() {
  return <div className="sol-art-board sol-alert-art">
    <div className="sol-art-heading"><span><Activity size={15} /> EVENT INTAKE</span><i>SAMPLE</i></div>
    <div className="sol-alert-layout"><div className="sol-signal-stack"><article><i className="sol-signal-dot"/><span><b>HTTP 5xx rate elevated</b><small>payments-api · trigger</small></span><small>10:42:03</small></article><article><i className="sol-signal-dot"/><span><b>Request latency rising</b><small>payments-api · grouping rule</small></span><small>10:42:08</small></article><article><i className="sol-signal-dot"/><span><b>HTTP 5xx alert repeated</b><small>payments-api · same dedup key</small></span><small>10:44:12</small></article></div><div className="sol-rule-node"><span><GitBranch size={19}/></span><b>Rule +<br/>window</b><small>same service</small></div><div className="sol-grouped-incident"><span className="sol-incident-symbol"><Activity size={20}/></span><small>ONE INCIDENT</small><b>Payment API<br/>error rate high</b><span>2 related alerts</span><i><Check size={13}/></i></div></div>
    <div className="sol-art-foot"><span><ShieldCheck size={14}/> Deterministic grouping</span><span>Illustrative · no live events</span></div>
  </div>;
}

function ResponseVisual() {
  return <div className="sol-art-board sol-response-art">
    <div className="sol-art-heading"><span><Users size={15}/> INCIDENT RESPONSE</span><i>PAYMENTS API</i></div>
    <div className="sol-response-incident"><div><small>ACTIVE INCIDENT · P1</small><b>Payment latency is elevated</b></div><span>TRIGGERED</span></div>
    <div className="sol-response-track"><div className="sol-response-marker"><Check size={12}/></div><article className="sol-response-row sol-response-primary"><span className="sol-avatar">LN</span><div><small>LEVEL 1 · ASSIGNED RESPONDER</small><b>Linh Nguyen</b></div><i><Check size={12}/> Acknowledged</i></article><div className="sol-track-line"/><div className="sol-response-marker sol-marker-next">2</div><article className="sol-response-row"><span className="sol-avatar sol-avatar-next">QT</span><div><small>LEVEL 2 · IF LEVEL 1 TIMES OUT</small><b>Quang Tran</b></div><i>Not sent</i></article></div>
    <div className="sol-response-event"><Clock3 size={14}/><span><b>ACK recorded</b><small>Escalation stopped · Level 2 was not paged</small></span><ArrowRight size={14}/></div>
    <div className="sol-art-foot"><span><Activity size={14}/> Shared response timeline</span><span>Illustrative · sample team</span></div>
  </div>;
}

function InvestigationVisual() {
  return <div className="sol-art-board sol-investigation-art">
    <div className="sol-art-heading"><span><SearchCheck size={15}/> INVESTIGATION</span><i>READ-ONLY EVIDENCE</i></div>
    <div className="sol-evidence-column"><article><span className="sol-evidence-icon"><Activity size={15}/></span><div><small>OBSERVED FACT</small><b>Error rate increased to 8.4%</b><span>payments-api · 10:42 UTC</span></div><Check size={14}/></article><article><span className="sol-evidence-icon sol-evidence-blue"><GitBranch size={15}/></span><div><small>RELATED CHANGE</small><b>Deployment v2.4.1</b><span>12 minutes before first alert</span></div><Check size={14}/></article></div>
    <div className="sol-hypothesis"><span><SearchCheck size={15}/></span><div><small>INVESTIGATION HYPOTHESIS · VERIFY</small><b>The deployment may be related.</b><p>Timing is evidence of correlation, not proof of cause.</p></div></div>
    <div className="sol-action-proposal"><div><span><LockKeyhole size={14}/> PROPOSED RUNBOOK</span><i>HIGH RISK</i></div><b>Restart payment worker pool</b><small>Approval required · sandbox executor · snapshot captured</small><button type="button" disabled>Awaiting authorized review</button></div>
    <div className="sol-art-foot"><span><ShieldCheck size={14}/> Human approval stays in control</span><span>Illustrative · no action runs here</span></div>
  </div>;
}

function LearningVisual() {
  return <div className="sol-art-board sol-learning-art">
    <div className="sol-art-heading"><span><BookOpenCheck size={15}/> POST-INCIDENT REVIEW</span><i>LAST 30 DAYS · SAMPLE</i></div>
    <div className="sol-pir-preview"><div className="sol-pir-title"><span><FileCheck2 size={17}/></span><div><small>PIR · INC-1048</small><b>Payment API latency</b></div><i>IN REVIEW</i></div><div className="sol-pir-progress"><span className="is-complete">Incident resolved</span><span className="is-current">Review findings</span><span>Follow-up actions</span></div><div className="sol-pir-action"><span><Clock3 size={12}/></span><div><b>Add latency alert threshold review</b><small>Owner: Platform team · Open</small></div><ArrowRight size={14}/></div></div>
    <div className="sol-metric-row"><article><small>MTTA · SAMPLE</small><b>4 <span>min</span></b><i>12 incidents with ACK</i><div className="sol-spark"><span/><span/><span/><span/><span/><span/></div></article><article><small>MTTR · SAMPLE</small><b>32 <span>min</span></b><i>8 resolved incidents</i><div className="sol-spark sol-spark-alt"><span/><span/><span/><span/><span/><span/></div></article></div>
    <div className="sol-art-foot"><span><Clock3 size={14}/> Metrics need a period and sample count</span><span>Illustrative · not live analytics</span></div>
  </div>;
}

const visuals: Record<SolutionKey, () => ReactElement> = {
  'reduce-alert-noise': AlertVisual,
  'coordinate-incident-response': ResponseVisual,
  'investigate-with-confidence': InvestigationVisual,
  'improve-after-every-incident': LearningVisual,
};

export function SolutionPage({ solution }: { solution: SolutionKey }) {
  const item = solutions[solution];
  const Visual = visuals[solution];
  const Icon = item.icon;
  return <div className="sol-page">
    <PublicHeader />
    <main>
      <section className="sol-hero">
        <div className="sol-hero-copy">
          <div className="sol-breadcrumb"><a href="#">NexusOps</a><span>/</span><span>Solutions</span><span>/</span><strong>{item.title}</strong></div>
          <span className="sol-eyebrow"><i/><Icon size={14}/>{item.eyebrow}</span>
          <h1>{item.headline}<br/><em>{item.accent}</em></h1>
          <p>{item.description}</p>
          <div className="sol-hero-actions"><a className="im-button im-button-primary" href="#login">Explore the demo <ArrowRight size={17}/></a><a className="im-button im-button-secondary" href="#solution-workflow" onClick={event => { event.preventDefault(); document.getElementById('solution-workflow')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }}>See the workflow <ArrowDown size={16}/></a></div>
          <div className="sol-hero-note"><ShieldCheck size={15}/><span>Mapped to the NexusOps MVP · the diagram uses sample data</span></div>
        </div>
        <div className="sol-visual-wrap"><Visual/><span className="sol-visual-caption"><i/>{item.visualLabel}</span></div>
      </section>

      <section id="solution-workflow" className="sol-workflow-section">
        <div className="sol-section-heading"><span className="im-eyebrow">A SOLUTION BUILT FROM MVP CAPABILITIES</span><h2>{item.challenge}</h2><p>Each step has a clear purpose and a defined boundary in the incident lifecycle.</p></div>
        <div className="sol-step-grid">{item.steps.map(({ icon: StepIcon, title, text }, index) => <article className="sol-step-card" key={title}><div className="sol-step-top"><span><StepIcon size={19}/></span><small>0{index + 1}</small></div><h3>{title}</h3><p>{text}</p>{index < item.steps.length - 1 && <span className="sol-step-arrow" aria-hidden="true"><ArrowRight size={14}/></span>}</article>)}</div>
      </section>

      <section className="sol-related-section"><div className="sol-related-intro"><span className="im-eyebrow">RELATED PRODUCTS & PLATFORM</span><h2>One workflow, connected capabilities.</h2><p>Solutions describe how NexusOps capabilities work together for a response team.</p></div><div className="sol-related-links">{item.links.map(link => <a href={link.href} key={link.href}><span>{link.label}</span><ArrowRight size={16}/></a>)}</div></section>

      <section className="sol-boundary-section"><div className="sol-boundary-icon"><CircleHelp size={21}/></div><div><span className="im-eyebrow">WHAT THE MVP ACTUALLY COVERS</span><h2>Designed around correctness, not inflated promises.</h2><p>{item.boundary}</p></div><a className="sol-boundary-link" href={item.scopeHref}>Review the related product scope <ArrowRight size={15}/></a></section>

      <nav className="sol-switcher" aria-label="Other solutions"><span>Explore another solution</span>{solutionKeys.filter(key => key !== solution).map(key => <a href={`#solution-${key}`} key={key}>{solutionPageTitles[key]}<ArrowRight size={14}/></a>)}</nav>

      <section className="im-final-cta sol-final-cta"><div className="im-cta-orb"/><span className="im-eyebrow">SEE THE WORKFLOW IN CONTEXT</span><h2>Follow this response flow in the NexusOps workspace.</h2><p>The workspace currently runs with local sample data. Live integrations, identity and backend workflows are not connected yet.</p><div><a className="im-button im-button-light" href="#login">Explore the demo <ArrowRight size={17}/></a><a className="im-cta-login" href="#signup">Have a team invitation? Join your team</a></div></section>
    </main>
    <footer className="im-footer sol-footer"><a href="#" className="im-brand">Nexus<span>Ops</span></a><span>Incident &amp; Reliability Operations</span><a href="#">Back to home <ArrowRight size={14}/></a></footer>
  </div>;
}
