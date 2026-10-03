import {
  Activity,
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Check,
  CircleAlert,
  Clock3,
  Database,
  FileText,
  GitBranch,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Zap,
} from 'lucide-react';
import { ProductsMenu } from '../components/ProductsMenu';
import { SolutionsMenu } from '../components/SolutionsMenu';
import { ResourcesMenu } from '../components/ResourcesMenu';
import './incident-management.css';
import './ai-investigation-automation.css';

function PublicHeader() {
  return <header className="landing-header im-header">
    <div className="landing-brand"><a href="#" className="im-brand" aria-label="NexusOps home">Nexus<span>Ops</span></a></div>
    <nav aria-label="Main navigation" className="landing-nav"><ProductsMenu /><SolutionsMenu /><div className="im-nav-secondary"><a href="#customers">Customer</a><ResourcesMenu /></div><a href="#pricing">Pricing</a></nav>
    <div className="landing-account im-account"><a href="#login">Log in</a><a href="#signup" className="im-header-cta">Join your team</a></div>
  </header>;
}

function InvestigationPreview() {
  return <div className="aa-preview-wrap" aria-label="Illustrative AI investigation report and proposed action using sample data">
    <div className="aa-preview-glow" />
    <article className="aa-investigation-card">
      <div className="aa-card-top"><span><Sparkles size={15} /> INVESTIGATION REPORT</span><span className="aa-demo-badge"><i /> SAMPLE DATA</span></div>
      <div className="aa-incident-heading"><div><small>INCIDENT · PAYMENTS API</small><h2>Payment API error rate above threshold</h2></div><span className="aa-priority">P1</span></div>
      <div className="aa-status-line"><span><Activity size={13} /> Triggered</span><span><Clock3 size={13} /> 4 min ago</span><span>Run 01</span></div>

      <div className="aa-report-block">
        <div className="aa-block-heading"><span className="aa-block-icon"><FileText size={15} /></span><div><strong>What the evidence shows</strong><small>Observed facts · 3 sources</small></div><BadgeCheck size={15} /></div>
        <div className="aa-evidence-list">
          <div><span className="aa-evidence-dot aa-dot-alert" /><p><strong>5xx responses rose above the service threshold.</strong><small>Alert A-1048 · payments-api · 09:42 UTC</small></p><span className="aa-source-tag">ALERT</span></div>
          <div><span className="aa-evidence-dot aa-dot-deploy" /><p><strong>Version 2.4.1 was deployed shortly before the alert.</strong><small>Deployment D-208 · 09:36 UTC</small></p><span className="aa-source-tag">DEPLOY</span></div>
          <div><span className="aa-evidence-dot aa-dot-kb" /><p><strong>A reviewed runbook covers elevated API error rates.</strong><small>Runbook RB-12 · version 3</small></p><span className="aa-source-tag">RUNBOOK</span></div>
        </div>
      </div>

      <div className="aa-hypothesis"><span><CircleAlert size={15} /> HYPOTHESIS · NOT CONFIRMED</span><p>The timing may connect the deployment to the increase in errors. More service context is needed before calling it the cause.</p><small>Evidence supports investigation; it does not prove causality.</small></div>

      <div className="aa-action-card"><div className="aa-action-heading"><span><GitBranch size={14} /> PROPOSED RUNBOOK</span><span className="aa-approval-state">Review required</span></div><div className="aa-action-row"><span className="aa-action-icon"><Zap size={16} /></span><div><strong>Restore the previous stable version</strong><small>payments-api · production · Runbook v3</small></div><ArrowRight size={15} /></div><div className="aa-action-footer"><span><LockKeyhole size={13} /> Scope and evidence snapshot attached</span><span>Not executed</span></div></div>
    </article>
    <div className="aa-review-chip"><span><UserRoundCheck size={17} /></span><div><strong>Human review comes first</strong><small>Approve or reject the proposed action</small></div><Check size={15} /></div>
    <span className="aa-preview-caption"><i />Illustrative report · no live model or execution</span>
  </div>;
}

const steps = [
  { icon: Database, number: '01', title: 'Gather permitted context', text: 'Collect the incident, related alerts, deployment history and approved knowledge that this responder may access.' },
  { icon: Sparkles, number: '02', title: 'Investigate with evidence', text: 'Organize observed facts, possible explanations and missing information. Keep source references visible.' },
  { icon: GitBranch, number: '03', title: 'Prepare a bounded action', text: 'Select an allowlisted runbook and capture its version, target, parameters, risk and evidence snapshot.' },
  { icon: UserRoundCheck, number: '04', title: 'Review before execution', text: 'A permitted approver reviews actions that require approval. Valid preauthorization is still limited by its scope and the same safety checks.' },
];

const safeguards = [
  { icon: LockKeyhole, title: 'Access-aware knowledge', text: 'Filter approved knowledge by service and access scope before retrieval. Revoked or unauthorized material must not enter the investigation context.' },
  { icon: FileText, title: 'Evidence stays traceable', text: 'Attach source IDs to findings and freeze the evidence, runbook version, target, parameters and effective risk into an action snapshot.' },
  { icon: UserRoundCheck, title: 'People control decisions', text: 'AI can recommend an action, but it cannot approve, execute commands or bypass the role and approval checks.' },
  { icon: ShieldCheck, title: 'Execution has limits', text: 'Sandbox actions are limited to 2 per service/runbook in 15 minutes. Three consecutive failed or unknown outcomes open a 15-minute cooldown before one half-open probe.' },
];

export function AIInvestigationAutomationPage() {
  return <div className="im-page aa-page">
    <PublicHeader />
    <main>
      <section className="im-hero aa-hero">
        <div className="im-hero-copy">
          <div className="im-breadcrumb"><a href="#">NexusOps</a><span>/</span><span>Products</span><span>/</span><strong>AI Investigation &amp; Automation</strong></div>
          <span className="im-eyebrow"><i /> AI INVESTIGATION · HUMAN-GUIDED AUTOMATION</span>
          <h1>Investigate with evidence.<br /><em>Act with human oversight.</em></h1>
          <p className="im-hero-description">Bring incident signals and approved knowledge into one investigation. Review a grounded recommendation, then let policy—not an AI guess—decide whether a sandbox action may proceed.</p>
          <div className="im-hero-actions"><a className="im-button im-button-primary" href="#login">Explore the demo <ArrowRight size={17} /></a><a className="im-button im-button-secondary" href="#aa-flow" onClick={event => { event.preventDefault(); document.getElementById('aa-flow')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }}>See the workflow <ArrowDown size={16} /></a></div>
          <div className="im-hero-note"><ShieldCheck size={15} /><span>AI recommends. People control approval. Guardrails control execution.</span></div>
        </div>
        <InvestigationPreview />
      </section>

      <section id="aa-flow" className="im-flow-section aa-flow-section">
        <div className="im-section-heading"><span className="im-eyebrow">FROM INCIDENT CONTEXT TO REVIEWED ACTION</span><h2>Keep investigation and execution distinct.</h2><p>AI helps responders make sense of evidence. A separate, policy-checked automation path handles any proposed action.</p></div>
        <div className="im-flow-grid">{steps.map(({ icon: Icon, number, title, text }, index) => <article className="im-flow-card" key={number}><div className="im-flow-card-top"><span className="im-flow-icon"><Icon size={19} /></span><span>{number}</span></div><h3>{title}</h3><p>{text}</p>{index < steps.length - 1 && <span className="im-flow-connector" aria-hidden="true"><ArrowRight size={15} /></span>}</article>)}</div>
        <div className="aa-flow-footnote"><CircleAlert size={16} /><span>A deployment near an alert can be useful context, but timing alone is not proof of cause. Confidence scores are signals for review, not calibrated probabilities.</span></div>
      </section>

      <section className="aa-separation-section">
        <div className="aa-separation-heading"><span className="im-eyebrow">TWO RESPONSIBILITIES · ONE CONTROLLED FLOW</span><h2>AI explains. Automation acts within policy.</h2><p>Keeping these responsibilities separate makes recommendations easier to inspect and actions easier to govern.</p></div>
        <div className="aa-separation-grid">
          <article className="aa-separation-card aa-ai-card"><span className="aa-separation-icon"><Sparkles size={21} /></span><span className="aa-separation-label">INVESTIGATION AGENT</span><h3>Build a useful picture</h3><p>Read scoped incident data, alerts, deployments and approved knowledge. Return findings with evidence, hypotheses and gaps for the responder to review.</p><div className="aa-token-row"><span>Read-only tools</span><span>Evidence references</span><span>No execution access</span></div></article>
          <div className="aa-separation-bridge"><span><ArrowRight size={18} /></span><small>reviewed<br />proposal</small></div>
          <article className="aa-separation-card aa-automation-card"><span className="aa-separation-icon"><GitBranch size={21} /></span><span className="aa-separation-label">AUTOMATION WORKER</span><h3>Run only what is allowed</h3><p>Validate the frozen action snapshot, role permissions, required approval or valid preauthorization, target scope and safety guards before a sandbox executor receives the action.</p><div className="aa-token-row"><span>Allowlisted runbook</span><span>Approval or policy</span><span>Guarded sandbox</span></div></article>
        </div>
      </section>

      <section className="im-capabilities-section aa-safeguards-section"><div className="im-capabilities-intro"><span className="im-eyebrow">EVIDENCE AND SAFETY BUILT IN</span><h2>Useful automation starts with clear boundaries.</h2><p>Recommendations stay reviewable, and every execution path has a defined scope and safety checks.</p><a className="im-inline-link" href="#product-incident-management">See Incident Management <ArrowRight size={16} /></a></div><div className="im-capability-list">{safeguards.map(({ icon: Icon, title, text }, index) => <article className="im-capability" key={title}><span className={`im-capability-icon im-capability-${index % 3}`}><Icon size={20} /></span><div><h3>{title}</h3><p>{text}</p></div><span className="im-capability-check"><Check size={15} /></span></article>)}</div></section>

      <section className="aa-scope-section"><div className="aa-scope-mark"><ShieldCheck size={22} /></div><div className="aa-scope-copy"><span className="im-eyebrow">MVP SCOPE · CURRENT PREVIEW</span><h2>Designed for a controlled path from evidence to action.</h2><p>The MVP design targets one investigation agent with scoped alert, deployment and RAG tools, plus allowlisted runbooks, immutable action snapshots, role-checked approval and sandbox execution. Each investigation is limited to 8 tool cycles or 120 seconds; AI failure must not block ACK or escalation. Rate limits, cooldown and circuit-breaker checks remain in force after approval or preauthorization.</p><div className="aa-scope-status"><div><span className="aa-status-dot aa-status-preview" /><strong>Current UI</strong><small>Sample report and simulated approve/reject/execution flow.</small></div><div><span className="aa-status-dot aa-status-target" /><strong>MVP target</strong><small>ACL-filtered retrieval and a guarded sandbox worker are not connected in this preview.</small></div></div></div><a href="#pricing" className="aa-scope-link">See free access <ArrowRight size={15} /></a></section>

      <section className="im-final-cta aa-final-cta"><div className="im-cta-orb" /><span className="im-eyebrow">MAKE THE NEXT STEP CLEAR</span><h2>Give responders evidence they can review.</h2><p>Explore the NexusOps workspace to see the sample investigation report and the separate automation approval flow.</p><div><a className="im-button im-button-light" href="#login">Explore the demo <ArrowRight size={17} /></a><a className="im-cta-login" href="#product-on-call-escalation">See On-call &amp; Escalation</a></div></section>
    </main>
    <footer className="im-footer"><a href="#" className="im-brand">Nexus<span>Ops</span></a><span>Incident &amp; Reliability Operations</span><a href="#product-incident-management">Incident Management <ArrowRight size={14} /></a></footer>
  </div>;
}
