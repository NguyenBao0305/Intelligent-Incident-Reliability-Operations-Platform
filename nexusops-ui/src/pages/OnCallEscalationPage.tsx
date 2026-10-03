import { ArrowDown, ArrowRight, BellRing, CalendarDays, Check, Clock3, GitBranch, ShieldCheck, Users } from 'lucide-react';
import { ProductsMenu } from '../components/ProductsMenu';
import { SolutionsMenu } from '../components/SolutionsMenu';
import { ResourcesMenu } from '../components/ResourcesMenu';
import './incident-management.css';
import './on-call-escalation.css';

function PublicHeader() {
  return <header className="landing-header im-header">
    <div className="landing-brand"><a href="#" className="im-brand" aria-label="NexusOps home">Nexus<span>Ops</span></a></div>
    <nav aria-label="Main navigation" className="landing-nav"><ProductsMenu /><SolutionsMenu /><div className="im-nav-secondary"><a href="#customers">Customer</a><ResourcesMenu /></div><a href="#pricing">Pricing</a></nav>
    <div className="landing-account im-account"><a href="#login">Log in</a><a href="#signup" className="im-header-cta">Join your team</a></div>
  </header>;
}

function SchedulePreview() {
  return <div className="oc-preview-shell" aria-label="Illustrative weekly on-call schedule and escalation policy using sample data">
    <div className="oc-orbit oc-orbit-one" /><div className="oc-orbit oc-orbit-two" />
    <div className="oc-schedule-card">
      <div className="oc-schedule-top"><span><CalendarDays size={15} /> ON-CALL SCHEDULE</span><span className="oc-zone">Asia / Ho Chi Minh</span></div>
      <div className="oc-schedule-title"><div><small>PAYMENTS API · RESPONSE COVERAGE</small><h2>Team coverage</h2></div><span className="oc-week-label">THIS WEEK <ArrowRight size={12} /></span></div>
      <div className="oc-week-grid"><div className="oc-week-corner" /><div className="oc-day">MON<span>12</span></div><div className="oc-day">TUE<span>13</span></div><div className="oc-day">WED<span>14</span></div><div className="oc-day">THU<span>15</span></div><div className="oc-day">FRI<span>16</span></div><div className="oc-day">SAT<span>17</span></div><div className="oc-day">SUN<span>18</span></div>
        <div className="oc-layer-name"><i className="oc-dot-primary" />Primary</div><div className="oc-shift oc-primary-shift"><span className="oc-avatar">LN</span><span><strong>Linh Nguyen</strong><small>Primary responder</small></span><span className="oc-shift-mark"><Check size={13} /></span></div>
        <div className="oc-layer-name"><i className="oc-dot-secondary" />Secondary</div><div className="oc-shift oc-secondary-shift"><span className="oc-avatar oc-avatar-secondary">QT</span><span><strong>Quang Tran</strong><small>Backup coverage</small></span><span className="oc-shift-mark"><Check size={13} /></span></div>
      </div>
      <div className="oc-schedule-foot"><Clock3 size={13} /><span>Coverage is shown in the selected team timezone.</span><span>Sample schedule</span></div>
    </div>
    <div className="oc-policy-card"><div className="oc-policy-heading"><span><GitBranch size={15} /> ESCALATION POLICY</span><span>v1</span></div><div className="oc-policy-step"><span className="oc-step-no">01</span><div><strong>Notify Primary</strong><small>Wait 5 min · 1 reminder</small></div><Check size={14} /></div><div className="oc-policy-step"><span className="oc-step-no">02</span><div><strong>Notify Secondary</strong><small>Wait 10 min · no repeat</small></div><Check size={14} /></div><div className="oc-policy-backstop"><ShieldCheck size={16} /><span><strong>Backstop · once</strong><small>Then stop escalation</small></span></div></div>
    <span className="oc-preview-caption"><i />Illustrative schedule and policy · demo data</span>
  </div>;
}

const capabilities = [
  { icon: CalendarDays, title: 'Plan service coverage', text: 'See who covers each service, when their shift begins and what layer they provide.' },
  { icon: BellRing, title: 'Define a response path', text: 'Choose one or more responders at each level, with clear ACK timeouts and finite reminders.' },
  { icon: ShieldCheck, title: 'End with a backstop', text: 'Give one fallback person a final notification, then stop instead of escalating forever.' },
];

export function OnCallEscalationPage() {
  return <div className="im-page oc-page">
    <PublicHeader />
    <main>
      <section className="im-hero oc-hero">
        <div className="im-hero-copy"><div className="im-breadcrumb"><a href="#">NexusOps</a><span>/</span><span>Products</span><span>/</span><strong>On-call &amp; Escalation</strong></div>
          <span className="im-eyebrow"><i /> ON-CALL &amp; ESCALATION · MVP WORKFLOW</span>
          <h1>Know who is on call.<br /><em>Know what happens next.</em></h1>
          <p className="im-hero-description">Plan responder coverage for each service, then define a finite path for incidents that have not been acknowledged.</p>
          <div className="im-hero-actions"><a className="im-button im-button-primary" href="#login">Explore the demo <ArrowRight size={17} /></a><a className="im-button im-button-secondary" href="#oc-flow" onClick={event => { event.preventDefault(); document.getElementById('oc-flow')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }}>See the response path <ArrowDown size={16} /></a></div>
          <div className="im-hero-note"><ShieldCheck size={15} /><span>Schedules describe coverage. Escalation policies define the notification order.</span></div>
        </div>
        <SchedulePreview />
      </section>

      <section id="oc-flow" className="im-flow-section oc-flow-section"><div className="im-section-heading"><span className="im-eyebrow">TWO PARTS · ONE RESPONSE PLAN</span><h2>Coverage first. Escalation when needed.</h2><p>Keep the weekly assignment separate from the incident’s notification policy, while making both easy to understand.</p></div>
        <div className="oc-relationship"><article className="oc-relationship-card"><span className="oc-relationship-icon"><CalendarDays size={21} /></span><span className="oc-card-label">01 · COVERAGE</span><h3>On-call schedule</h3><p>Assign responders to a service and time window. The schedule answers: who is covering now?</p><ul><li><Check size={14} />Service and team context</li><li><Check size={14} />Primary and secondary coverage</li><li><Check size={14} />Timezone-aware shift view</li></ul><a href="#login">Open the schedule demo <ArrowRight size={15} /></a></article><div className="oc-flow-link"><span><ArrowRight size={19} /></span><small>incident stays<br />unacknowledged</small></div><article className="oc-relationship-card oc-policy-relationship"><span className="oc-relationship-icon"><GitBranch size={21} /></span><span className="oc-card-label">02 · RESPONSE ORDER</span><h3>Escalation policy</h3><p>Set who receives each notification and when to move on. The policy answers: what happens if there is no ACK?</p><ul><li><Check size={14} />Two ordered levels</li><li><Check size={14} />Bounded timeouts and reminders</li><li><Check size={14} />One final backstop</li></ul><a href="#login">Review the response demo <ArrowRight size={15} /></a></article></div>
      </section>

      <section className="oc-timeline-section"><div className="oc-timeline-copy"><span className="im-eyebrow">A BOUNDED ESCALATION PATH</span><h2>Unanswered incidents<br /><em>have a clear endpoint.</em></h2><p>When an incident is triggered, notify the first level. If nobody acknowledges before the configured timeout, continue through the saved policy. An ACK stops future escalation.</p><div className="oc-timeline-disclaimer"><ShieldCheck size={16} />The public page shows the MVP sequence; this preview does not send real notifications.</div></div>
        <div className="oc-timeline-card"><div className="oc-timeline-head"><span>PAYMENTS API · POLICY PREVIEW</span><span>NO ACK PATH</span></div><div className="oc-timeline"><div className="oc-timeline-entry"><span className="oc-time">T+00</span><span className="oc-timeline-node"><BellRing size={14} /></span><div><strong>Notify Primary responders</strong><small>Start the configured ACK timeout</small></div></div><div className="oc-timeline-entry"><span className="oc-time">T+05</span><span className="oc-timeline-node"><BellRing size={14} /></span><div><strong>Send the configured reminder</strong><small>Only if no one has acknowledged</small></div></div><div className="oc-timeline-entry"><span className="oc-time">T+10</span><span className="oc-timeline-node"><Users size={14} /></span><div><strong>Escalate to Secondary</strong><small>Start level two's ACK timeout</small></div></div><div className="oc-timeline-entry"><span className="oc-time">T+20</span><span className="oc-timeline-node oc-final-node"><ShieldCheck size={14} /></span><div><strong>Notify the backstop once</strong><small>Policy is exhausted and stops here</small></div></div></div><div className="oc-ack-stop"><Check size={15} /><span><strong>If a responder ACKs at any step</strong><small>Cancel pending escalation steps.</small></span></div></div>
      </section>

      <section className="im-capabilities-section oc-capabilities"><div className="im-capabilities-intro"><span className="im-eyebrow">DESIGNED FOR CLEAR HANDOFFS</span><h2>Coverage and ownership people can understand.</h2><p>Make service coverage visible, keep response rules bounded and give responders a predictable next step.</p><a className="im-inline-link" href="#login">Explore the Responder workspace <ArrowRight size={16} /></a></div><div className="im-capability-list">{capabilities.map(({icon:Icon,title,text},index)=><article className="im-capability" key={title}><span className={`im-capability-icon im-capability-${index}`}><Icon size={20}/></span><div><h3>{title}</h3><p>{text}</p></div><span className="im-capability-check"><Check size={15}/></span></article>)}</div></section>

      <section className="oc-scope"><span className="oc-scope-icon"><ShieldCheck size={21}/></span><div><span className="im-eyebrow">MVP SCOPE · DEMO STATUS</span><h2>Practical coverage, bounded escalation.</h2><p>The MVP supports static on-call assignments and an escalation policy with two levels, multiple targets per level, finite reminders and one backstop. The workspace’s weekly schedule and policy designer currently use local sample state. Shifts do not automatically become policy targets; live paging, background rotation and daylight-saving transitions are not active.</p></div><a href="#pricing">See free access <ArrowRight size={15}/></a></section>

      <section className="im-final-cta oc-final-cta"><div className="im-cta-orb"/><span className="im-eyebrow">PLAN YOUR RESPONSE</span><h2>Put coverage and escalation in context.</h2><p>Open the Responder demo to explore the weekly schedule and review a sample policy.</p><div><a className="im-button im-button-light" href="#login">Explore the demo <ArrowRight size={17}/></a><a className="im-cta-login" href="#product-incident-management">See Incident Management</a></div></section>
    </main>
    <footer className="im-footer"><a href="#" className="im-brand">Nexus<span>Ops</span></a><span>Incident &amp; Reliability Operations</span><a href="#product-incident-management">Incident Management <ArrowRight size={14}/></a></footer>
  </div>;
}
