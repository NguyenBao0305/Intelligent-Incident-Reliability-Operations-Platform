import type { LucideIcon } from 'lucide-react';
import { Activity, ArrowDown, ArrowRight, BadgeCheck, BellRing, Check, CircleAlert, ClipboardList, Clock3, Database, GitBranch, LockKeyhole, Radio, Search, Server, ShieldCheck, Users, Waypoints, Zap } from 'lucide-react';
import { ProductsMenu } from '../components/ProductsMenu';
import { SolutionsMenu } from '../components/SolutionsMenu';
import { ResourcesMenu } from '../components/ResourcesMenu';
import './incident-management.css';
import './platform-capability.css';

export type PlatformCapabilityKey = 'service-catalog' | 'monitoring-integrations' | 'policies-permissions' | 'audit-trail';

type CapabilityStep = { icon: LucideIcon; title: string; text: string };
type PlatformCapability = {
  title: string;
  eyebrow: string;
  headline: string;
  description: string;
  note: string;
  steps: CapabilityStep[];
  benefits: { icon: LucideIcon; title: string; text: string }[];
  boundary: string;
  current: string;
  related: { title: string; href: string }[];
};

const capabilities: Record<PlatformCapabilityKey, PlatformCapability> = {
  'service-catalog': {
    title: 'Service Catalog',
    eyebrow: 'PLATFORM · SERVICE OWNERSHIP',
    headline: 'Give every incident a service it belongs to.',
    description: 'Keep ownership, criticality and service dependencies in one shared directory so responders can see what is affected and who owns the next step.',
    note: 'Services anchor alert routing, on-call, investigation and response metrics.',
    steps: [
      { icon: Server, title: 'Register a service', text: 'Create a named service within its owning team and keep its lifecycle status explicit.' },
      { icon: Users, title: 'Make ownership clear', text: 'Connect the service to its responsible team so incidents and follow-up work have an accountable group.' },
      { icon: Activity, title: 'Describe importance', text: 'Use the MVP criticality levels Critical, High or Normal alongside operational status.' },
      { icon: Waypoints, title: 'Map dependencies', text: 'Record directed service-to-service dependencies. A service cannot depend on itself.' },
    ],
    benefits: [
      { icon: BellRing, title: 'Route alerts with service context', text: 'Associate integration events and resulting incidents with a known service.' },
      { icon: Users, title: 'See who owns response', text: 'Use the service owner/team as shared context for responders and service managers.' },
      { icon: GitBranch, title: 'Understand dependency impact', text: 'Show upstream/downstream relationships without treating a dependency as proof of root cause.' },
    ],
    boundary: 'The MVP supports service create/update and disable instead of hard delete; dependency edges are directional and permission-checked at both ends. The initial scope seeds one organization and one team, while still checking membership.',
    current: 'The Responder workspace shows sample services, owners, criticality, status and dependencies. Service CRUD and permission checks are not connected to a backend.',
    related: [{ title: 'Incident Management', href: '#product-incident-management' }, { title: 'On-call & Escalation', href: '#product-on-call-escalation' }],
  },
  'monitoring-integrations': {
    title: 'Monitoring Integrations',
    eyebrow: 'PLATFORM · EVENT INTAKE',
    headline: 'Bring monitoring signals into a reliable response flow.',
    description: 'Receive alert events through a service integration, validate their identity and order, then connect meaningful signals to the right alert and incident.',
    note: 'Authentication, idempotency and recovery ordering protect the event path.',
    steps: [
      { icon: LockKeyhole, title: 'Authenticate the source', text: 'Use an integration credential scoped to its service, with rate limiting before event processing.' },
      { icon: BadgeCheck, title: 'Accept each request safely', text: 'Use an idempotency key and canonical request hash so a retry can replay its saved response.' },
      { icon: GitBranch, title: 'Order, deduplicate and group', text: 'Use stream sequence and episode identity, deduplicate open alerts and group only within the same service and configured rule/window.' },
      { icon: Zap, title: 'Update the incident lifecycle', text: 'Process TRIGGER and RESOLVE consistently; resolve an incident only when all linked alerts have recovered.' },
    ],
    benefits: [
      { icon: Radio, title: 'One validated intake path', text: 'Adapters turn source-specific events into a shared event contract before domain changes.' },
      { icon: Clock3, title: 'Retries do not duplicate work', text: 'Idempotent intake and durable processing jobs keep network retries from creating duplicate effects.' },
      { icon: ShieldCheck, title: 'Recovery events keep their meaning', text: 'A stale or unmatched resolve must not close a newer active alert or incident.' },
    ],
    boundary: 'The event-source credential is separate from user login. `Idempotency-Key` prevents request replay effects; the alert `dedupKey` groups the signal stream. Ordered `episodeId`/`sourceSequence` values distinguish recovery from stale events.',
    current: 'The Integrations page can configure and test a local sample integration. It does not issue credentials, receive external webhooks or create production alerts.',
    related: [{ title: 'Incident Management', href: '#product-incident-management' }, { title: 'AI Investigation & Automation', href: '#product-ai-automation' }],
  },
  'policies-permissions': {
    title: 'Policies & Permissions',
    eyebrow: 'PLATFORM · ACCESS AND RESPONSE RULES',
    headline: 'Make every response action answer to scope.',
    description: 'Combine role permissions with team, service and incident membership checks. Define who receives an escalation and who may take a protected action.',
    note: 'A role grants a capability; object scope decides where it can be used.',
    steps: [
      { icon: Users, title: 'Assign a baseline role', text: 'Use the MVP roles Account Admin, Team Manager, Responder and Viewer; role grants come from a fixed permission map.' },
      { icon: ShieldCheck, title: 'Check the requested capability', text: 'Gate actions such as ACK, Resolve, AI run, automation execution, service management and audit viewing.' },
      { icon: LockKeyhole, title: 'Check object scope too', text: 'Validate team membership and the target service/incident assignment inside the mutation transaction.' },
      { icon: BellRing, title: 'Define a bounded escalation path', text: 'Use two ordered levels, finite reminders and one backstop with targets in the same team.' },
    ],
    benefits: [
      { icon: ShieldCheck, title: 'Keep roles understandable', text: 'Start with seeded roles and permissions; role designer and arbitrary custom roles are outside the reduced MVP.' },
      { icon: Users, title: 'Treat incident roles locally', text: 'Commander is a role on a specific incident, not a global role that grants access everywhere.' },
      { icon: ClipboardList, title: 'Record protected decisions', text: 'Changes to escalation and approvals belong in the audit trail with their actor and scope.' },
    ],
    boundary: 'Account Admin receives the seeded permissions; Team Manager receives SERVICE_MANAGE; Responder receives incident ACK/Resolve, AI_RUN and AUTOMATION_EXECUTE. Viewer has no mutation permissions seeded here. These grants never replace team/service/incident scope checks. Commander remains incident-scoped.',
    current: 'The demo uses a fixed Responder account, local escalation-policy state and frontend-only controls. It has no role editor or server-enforced permission boundary.',
    related: [{ title: 'On-call & Escalation', href: '#product-on-call-escalation' }, { title: 'AI Investigation & Automation', href: '#product-ai-automation' }],
  },
  'audit-trail': {
    title: 'Audit Trail',
    eyebrow: 'PLATFORM · ACCOUNTABILITY',
    headline: 'Keep a trustworthy record of operational decisions.',
    description: 'Capture who changed which resource and when, with enough context to follow an incident, approval or integration event across the response.',
    note: 'Audit records are durable domain history, separate from application debug logs.',
    steps: [
      { icon: Users, title: 'Identify the actor', text: 'Record a user or system actor, including integration/service activity where applicable.' },
      { icon: ClipboardList, title: 'Describe the change', text: 'Store the action, resource, incident context and relevant before/after values.' },
      { icon: GitBranch, title: 'Connect related work', text: 'Attach a correlation ID so events across a workflow can be followed together.' },
      { icon: LockKeyhole, title: 'Read within permission scope', text: 'Let authorized viewers query by incident or correlation ID without granting access outside their scope.' },
    ],
    benefits: [
      { icon: BadgeCheck, title: 'Append-only history', text: 'Audit records cannot be silently edited or deleted after a protected mutation.' },
      { icon: Zap, title: 'Commit with the domain action', text: 'Write audit data in the same database transaction as the state mutation it explains.' },
      { icon: Search, title: 'Trace the response', text: 'Use incident and correlation identifiers to follow decisions, approvals and action outcomes.' },
    ],
    boundary: 'Audit starts in M1; the M7 viewer is scoped by AUDIT_VIEW and incident/correlation queries. Audit is not a tamper-evident external archive, compliance certification or substitute for infrastructure observability logs.',
    current: 'The workspace does not yet expose an audit viewer. The page shows sample rows only; persistent immutable audit storage and scoped queries are backend MVP work.',
    related: [{ title: 'Post-Incident Review & Insights', href: '#product-post-incident-insights' }, { title: 'AI Investigation & Automation', href: '#product-ai-automation' }],
  },
};

function PublicHeader() {
  return <header className="landing-header im-header">
    <div className="landing-brand"><a href="#" className="im-brand" aria-label="NexusOps home">Nexus<span>Ops</span></a></div>
    <nav aria-label="Main navigation" className="landing-nav"><ProductsMenu /><SolutionsMenu /><div className="im-nav-secondary"><a href="#customers">Customer</a><ResourcesMenu /></div><a href="#pricing">Pricing</a></nav>
    <div className="landing-account im-account"><a href="#login">Log in</a><a href="#signup" className="im-header-cta">Join your team</a></div>
  </header>;
}

function ServiceCatalogVisual() {
  return <div className="pp-visual pp-service-map" aria-label="Illustrative service directory and dependency map">
    <div className="pp-visual-top"><span><Server size={14}/> SERVICE CATALOG</span><span>SAMPLE GRAPH</span></div>
    <svg className="pp-map-lines" viewBox="0 0 520 230" role="img" aria-label="Payments API depends on identity service and payment database"><defs><marker id="ppArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="#8aab91" strokeWidth="1.5"/></marker></defs><path d="M249 109 C195 74 170 62 117 57" fill="none" stroke="#8aab91" strokeWidth="1.6" markerEnd="url(#ppArrow)"/><path d="M270 116 C323 147 350 165 402 173" fill="none" stroke="#8aab91" strokeWidth="1.6" markerEnd="url(#ppArrow)"/></svg>
    <div className="pp-service-node pp-service-main"><span className="pp-node-symbol"><Activity size={16}/></span><div><small>CRITICAL · DEGRADED</small><strong>payments-api</strong><span>Platform team</span></div><CircleAlert size={14}/></div>
    <div className="pp-service-node pp-service-upstream"><span className="pp-node-symbol pp-node-blue"><LockKeyhole size={15}/></span><div><small>HIGH · OPERATIONAL</small><strong>identity-service</strong><span>Dependency</span></div></div>
    <div className="pp-service-node pp-service-database"><span className="pp-node-symbol pp-node-gold"><Database size={15}/></span><div><small>NORMAL · OPERATIONAL</small><strong>payments-db</strong><span>Dependency</span></div></div>
    <div className="pp-map-foot"><span><i className="pp-critical-dot"/>Criticality</span><span><i className="pp-edge-key"/>Depends on</span><span>Sample services · not live topology</span></div>
  </div>;
}

function IntegrationVisual() {
  return <div className="pp-visual pp-integration-visual" aria-label="Illustrative event ingestion flow from monitor to incident">
    <div className="pp-visual-top"><span><Radio size={14}/> EVENT INTAKE</span><span>SIMULATED</span></div>
    <div className="pp-integration-source"><span className="pp-source-icon"><Activity size={17}/></span><div><small>MONITOR SOURCE</small><strong>checkout-monitor</strong><span>Integration key · service scoped</span></div><span className="pp-source-state"><i/>Enabled</span></div>
    <div className="pp-event-flow"><div className="pp-event-step"><span><LockKeyhole size={15}/></span><strong>Authenticate</strong><small>rate limit</small></div><i/><div className="pp-event-step"><span><BadgeCheck size={15}/></span><strong>Validate &amp; dedupe</strong><small>idempotency + sequence</small></div><i/><div className="pp-event-step"><span><GitBranch size={15}/></span><strong>Group &amp; update</strong><small>alert → incident</small></div></div>
    <div className="pp-event-example"><span className="pp-event-type"><Zap size={13}/> TRIGGER</span><div><strong>http_5xx_rate_high</strong><small>service: payments-api · episode: ep-24 · seq: 018</small></div><span className="pp-event-delivery">accepted once</span></div>
    <div className="pp-integration-foot"><Check size={13}/> Recovery events close the incident only after all linked alerts resolve.</div>
  </div>;
}

function PoliciesVisual() {
  const roles = [
    { name: 'Account Admin', grants: 'All seeded permissions', tone: 'pp-role-admin' },
    { name: 'Team Manager', grants: 'SERVICE_MANAGE', tone: 'pp-role-manager' },
    { name: 'Responder', grants: 'ACK · RESOLVE · AI_RUN · AUTOMATION_EXECUTE', tone: 'pp-role-responder' },
    { name: 'Viewer', grants: 'No mutation permission seeded', tone: 'pp-role-viewer' },
  ];
  return <div className="pp-visual pp-policy-visual" aria-label="Illustrative role, permission and resource scope checks">
    <div className="pp-visual-top"><span><ShieldCheck size={14}/> ACCESS POLICY</span><span>FIXED MVP ROLE MAP</span></div>
    <div className="pp-rbac-labels"><span>ACCOUNT ROLE</span><span>SEEDED PERMISSION GRANTS</span></div>
    <div className="pp-rbac-rows">{roles.map(role => <div className="pp-rbac-row" key={role.name}><span className={`pp-role-mark ${role.tone}`}>{role.name === 'Responder' ? <Users size={13}/> : role.name === 'Account Admin' ? <ShieldCheck size={13}/> : role.name === 'Team Manager' ? <Server size={13}/> : <LockKeyhole size={13}/>}</span><strong>{role.name}</strong><span>{role.grants}</span><Check size={14}/></div>)}</div>
    <div className="pp-scope-gate"><span><LockKeyhole size={15}/></span><div><strong>Then check object scope</strong><small>Team membership · service access · incident assignment</small></div><ArrowRight size={15}/><span className="pp-gate-result">ALLOW / DENY</span></div>
    <div className="pp-commander-note"><CircleAlert size={13}/> Commander is assigned per incident; it is not a global account role.</div>
  </div>;
}

function AuditVisual() {
  const entries = [
    { time: '10:24:08', actor: 'Linh Nguyen · RESPONDER', action: 'INCIDENT_RESOLVED', resource: 'INC-1048 · payments-api', tone: 'pp-audit-green' },
    { time: '10:08:42', actor: 'Automation Worker · SYSTEM', action: 'ACTION_SUCCEEDED', resource: 'ACT-219 · Runbook RB-12', tone: 'pp-audit-blue' },
    { time: '10:03:16', actor: 'Linh Nguyen · RESPONDER', action: 'ACTION_APPROVED', resource: 'ACT-219 · snapshot v3', tone: 'pp-audit-violet' },
    { time: '09:42:05', actor: 'checkout-monitor · INTEGRATION', action: 'INCIDENT_TRIGGERED', resource: 'INC-1048 · payments-api', tone: 'pp-audit-gold' },
  ];
  return <div className="pp-visual pp-audit-visual" aria-label="Illustrative append-only operational audit timeline">
    <div className="pp-visual-top"><span><ClipboardList size={14}/> AUDIT TRAIL</span><span>READ ONLY · SAMPLE</span></div>
    <div className="pp-audit-filter"><span><Activity size={13}/> Incident INC-1048</span><span>Correlation: cor-7f0d… <ArrowRight size={12}/></span></div>
    <div className="pp-audit-records">{entries.map(entry => <article className="pp-audit-record" key={entry.time}><span className={`pp-audit-mark ${entry.tone}`}/><div className="pp-audit-main"><div><strong>{entry.action}</strong><span>{entry.time} UTC</span></div><small>{entry.actor}</small><span className="pp-audit-resource">{entry.resource}</span></div><BadgeCheck size={14}/></article>)}</div>
    <div className="pp-audit-foot"><LockKeyhole size={13}/><span>Append-only · written with the domain change</span><span className="pp-correlation-id">cor-7f0d-9c21</span></div>
  </div>;
}

function CapabilityVisual({ capability }: { capability: PlatformCapabilityKey }) {
  if (capability === 'service-catalog') return <ServiceCatalogVisual/>;
  if (capability === 'monitoring-integrations') return <IntegrationVisual/>;
  if (capability === 'policies-permissions') return <PoliciesVisual/>;
  return <AuditVisual/>;
}

export function PlatformCapabilityPage({ capability }: { capability: PlatformCapabilityKey }) {
  const content = capabilities[capability];
  return <div className="im-page pp-page">
    <PublicHeader/>
    <main>
      <section className="im-hero pp-hero"><div className="im-hero-copy"><div className="im-breadcrumb"><a href="#">NexusOps</a><span>/</span><span>Products</span><span>/</span><strong>Platform</strong><span>/</span><strong>{content.title}</strong></div><span className="im-eyebrow"><i/> {content.eyebrow}</span><h1>{content.headline}</h1><p className="im-hero-description">{content.description}</p><div className="im-hero-actions"><a className="im-button im-button-primary" href="#login">Explore the demo <ArrowRight size={17}/></a><a className="im-button im-button-secondary" href="#pp-workflow" onClick={event => { event.preventDefault(); document.getElementById('pp-workflow')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }}>How it fits together <ArrowDown size={16}/></a></div><div className="im-hero-note"><ShieldCheck size={15}/><span>{content.note}</span></div></div><CapabilityVisual capability={capability}/></section>
      <section id="pp-workflow" className="im-flow-section pp-flow-section"><div className="im-section-heading"><span className="im-eyebrow">A SHARED PLATFORM CAPABILITY</span><h2>{capability === 'service-catalog' ? 'One service record connects response work.' : capability === 'monitoring-integrations' ? 'Protect the signal all the way to recovery.' : capability === 'policies-permissions' ? 'Apply capability and scope at every boundary.' : 'Make operational changes explainable later.'}</h2><p>{content.note}</p></div><div className="pp-step-grid">{content.steps.map(({icon:Icon,title,text},index)=><article className="pp-step-card" key={title}><div><span><Icon size={19}/></span><small>0{index+1}</small></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="im-capabilities-section pp-benefits-section"><div className="im-capabilities-intro"><span className="im-eyebrow">WHY THIS BELONGS IN PLATFORM</span><h2>{content.title} supports more than one workflow.</h2><p>Products use the same underlying record and controls, so ownership and safety stay consistent across the response lifecycle.</p><a className="im-inline-link" href="#pricing">See free access <ArrowRight size={16}/></a></div><div className="im-capability-list">{content.benefits.map(({icon:Icon,title,text},index)=><article className="im-capability" key={title}><span className={`im-capability-icon im-capability-${index}`}><Icon size={20}/></span><div><h3>{title}</h3><p>{text}</p></div><span className="im-capability-check"><Check size={15}/></span></article>)}</div></section>
      <section className="pp-boundary-section"><div className="pp-boundary-mark"><ShieldCheck size={21}/></div><div><span className="im-eyebrow">MVP SCOPE · CURRENT PREVIEW</span><h2>Here is what the MVP defines—and what this demo does.</h2><p>{content.boundary}</p><div className="pp-current-state"><span><i/>CURRENT UI</span><p>{content.current}</p></div></div><a href="#pricing">See free access <ArrowRight size={15}/></a></section>
      <section className="pp-related-section"><div><span className="im-eyebrow">RELATED NEXUSOPS PRODUCTS</span><h2>Shared platform, connected workflows.</h2></div><div>{content.related.map(({title,href})=><a className="pp-related-link" href={href} key={title}>{title}<ArrowRight size={15}/></a>)}</div></section>
      <section className="im-final-cta pp-final-cta"><div className="im-cta-orb"/><span className="im-eyebrow">EXPLORE THE NEXUSOPS WORKSPACE</span><h2>{content.title}, connected to incident response.</h2><p>See how platform context supports responders from the first signal through review and learning.</p><div><a className="im-button im-button-light" href="#login">Explore the demo <ArrowRight size={17}/></a><a className="im-cta-login" href="#product-incident-management">See Incident Management</a></div></section>
    </main>
    <footer className="im-footer"><a href="#" className="im-brand">Nexus<span>Ops</span></a><span>Incident &amp; Reliability Operations</span><a href="#">Back to home <ArrowRight size={14}/></a></footer>
  </div>;
}
