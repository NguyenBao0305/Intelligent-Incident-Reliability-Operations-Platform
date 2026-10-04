import { Activity, BellRing, BookOpenCheck, Check, Clock3, FileCheck2, GitBranch, ListFilter, LockKeyhole, SearchCheck, Users, type LucideIcon } from 'lucide-react';

export const solutionKeys = [
  'reduce-alert-noise',
  'coordinate-incident-response',
  'investigate-with-confidence',
  'improve-after-every-incident',
] as const;

export type SolutionKey = typeof solutionKeys[number];

export type SolutionDefinition = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: 'mint' | 'sage' | 'teal' | 'blue';
  problem: string;
  approach: string;
  capabilities: string[];
  eyebrow: string;
  headline: string;
  accent: string;
  visualLabel: string;
  challenge: string;
  steps: { icon: LucideIcon; title: string; text: string }[];
  boundary: string;
  links: { label: string; href: string }[];
  scopeHref: string;
};

export const solutions: Record<SolutionKey, SolutionDefinition> = {
  'reduce-alert-noise': {
    title: 'Reduce Alert Noise',
    description: 'Turn repeated alerts into a clearer incident picture.',
    icon: ListFilter, tone: 'mint',
    problem: 'Repeated monitoring events can make it hard to see which incidents need attention.',
    approach: 'Deduplicate repeated OPEN alerts from the same integration by their deduplication key, then group eligible alerts from that service under configured rules and time windows.',
    capabilities: ['Monitoring Integrations', 'Incident Management'],
    eyebrow: 'SIGNAL QUALITY · MVP WORKFLOW',
    headline: 'Make repeated signals easier to understand.',
    accent: 'Keep one clear incident in view.',
    visualLabel: 'Illustrative event grouping · sample data',
    challenge: 'Repeated events and retries can make one service issue look like many separate problems.',
    steps: [
      { icon: Activity, title: 'Receive an ordered service event', text: 'An authenticated integration sends a trigger or recovery event with its deduplication key, episode ID and source sequence.' },
      { icon: GitBranch, title: 'Deduplicate, then group by rule', text: 'A deduplication key within its integration identifies a repeated OPEN alert. A separate rule can group eligible alerts from that service into one incident.' },
      { icon: Check, title: 'Keep the incident and alert history', text: 'Responders see the resulting incident with its linked alerts. Ordered recovery events close the relevant alert; the incident resolves only when all linked alerts are resolved.' },
    ],
    boundary: 'Grouping is deterministic within the same service, configured rule and time window; it does not infer similarity with AI. Recovery ordering uses episode ID and increasing source sequence so stale events do not incorrectly close newer alert episodes.',
    links: [{ label: 'Monitoring Integrations', href: '#platform-monitoring-integrations' }, { label: 'Incident Management', href: '#product-incident-management' }],
    scopeHref: '#platform-monitoring-integrations',
  },
  'coordinate-incident-response': {
    title: 'Coordinate Incident Response',
    description: 'Keep ownership, escalation and response progress clear.',
    icon: Users, tone: 'sage',
    problem: 'An incident needs a clear owner and a shared record of what has been done.',
    approach: 'Assign responders, record acknowledgement, escalate unanswered incidents and keep response findings in the incident timeline.',
    capabilities: ['Incident Management', 'On-call & Escalation'],
    eyebrow: 'OWNERSHIP · ACKNOWLEDGEMENT · ESCALATION',
    headline: 'Make the next responder and next step clear.',
    accent: 'Keep the response on one shared timeline.',
    visualLabel: 'Illustrative responder handoff · sample data',
    challenge: 'When ownership is unclear, teams lose time repeating triage or waiting for someone to respond.',
    steps: [
      { icon: BellRing, title: 'Route to the responsible person', text: 'The service uses its configured escalation policy snapshot to identify the first responder and the next level.' },
      { icon: Check, title: 'Acknowledge and take ownership', text: 'ACK records that work has started and stops the current escalation timer. It does not resolve the incident.' },
      { icon: Activity, title: 'Track progress to resolution', text: 'State changes, notes and decisions stay in the incident history. An unanswered incident can advance to its configured next level.' },
    ],
    boundary: 'The MVP supports static on-call assignments, two escalation levels and one finite backstop. Provider-backed email/phone/SMS delivery and rotating schedules are outside this UI preview; the planned notification path is the durable in-app inbox with realtime updates and catch-up.',
    links: [{ label: 'Incident Management', href: '#product-incident-management' }, { label: 'On-call & Escalation', href: '#product-on-call-escalation' }, { label: 'Policies & Permissions', href: '#platform-policies-permissions' }],
    scopeHref: '#product-on-call-escalation',
  },
  'investigate-with-confidence': {
    title: 'Investigate & Act with Confidence',
    description: 'Review evidence and proposed actions before execution.',
    icon: SearchCheck, tone: 'teal',
    problem: 'Responders need evidence and context before deciding which action to take.',
    approach: 'Review facts, hypotheses and missing information. Assess proposed runbooks, their approval requirements and execution safeguards.',
    capabilities: ['AI Investigation & Automation', 'Policies & Permissions', 'Audit Trail'],
    eyebrow: 'EVIDENCE · HUMAN REVIEW · GUARDED ACTION',
    headline: 'See the evidence before choosing an action.',
    accent: 'Keep people in control of remediation.',
    visualLabel: 'Illustrative investigation and approval · sample data',
    challenge: 'Responders need useful context without treating an AI hypothesis as a confirmed root cause or an approved change.',
    steps: [
      { icon: SearchCheck, title: 'Gather scoped evidence', text: 'The investigation uses incident, service, deployment and approved knowledge sources the actor is allowed to access.' },
      { icon: FileCheck2, title: 'Review facts and a proposal', text: 'Findings distinguish evidence from hypotheses and identify missing information. Suggested actions reference an allowlisted runbook.' },
      { icon: LockKeyhole, title: 'Validate and approve when required', text: 'Backend checks service scope, incident assignment, permissions, action snapshot and safeguards. An authorized human approves when required.' },
    ],
    boundary: 'AI is read-only during investigation; it cannot approve or execute its proposal. Per-instance approval is required when effective risk is HIGH, the runbook requires approval, or no valid pre-authorization exists. Dispatch remains limited to two reservations per service/runbook in 15 minutes; three consecutive FAILED/UNKNOWN executions open a 15-minute circuit breaker.',
    links: [{ label: 'AI Investigation & Automation', href: '#product-ai-automation' }, { label: 'Policies & Permissions', href: '#platform-policies-permissions' }, { label: 'Audit Trail', href: '#platform-audit-trail' }],
    scopeHref: '#product-ai-automation',
  },
  'improve-after-every-incident': {
    title: 'Improve After Every Incident',
    description: 'Capture lessons and track response performance.',
    icon: BookOpenCheck, tone: 'blue',
    problem: 'Lessons from an incident are easy to lose once the immediate response is over.',
    approach: 'Review the incident timeline, capture follow-up actions in a PIR and track MTTA and MTTR with the relevant period and sample counts.',
    capabilities: ['Post-Incident Review & Insights', 'Audit Trail'],
    eyebrow: 'POST-INCIDENT REVIEW · MEASURABLE LEARNING',
    headline: 'Carry verified learning into the next response.',
    accent: 'Make follow-up work visible and owned.',
    visualLabel: 'Illustrative PIR and metrics · sample data',
    challenge: 'Without a review and a clear owner for follow-up actions, teams can lose important context once the incident is closed.',
    steps: [
      { icon: Activity, title: 'Start from the incident record', text: 'Use the captured timeline, notes, evidence and action outcomes as the source material for a review draft.' },
      { icon: FileCheck2, title: 'Review and track follow-up', text: 'A responder prepares or edits the draft; an authorized Team Manager or Account Admin reviews and approves it. Assign owners to basic action items and track them to completion.' },
      { icon: Clock3, title: 'Read metrics in context', text: 'MTTA measures incident creation to first ACK; MTTR measures creation to Resolve. Each metric has its own eligible sample count and time window.' },
    ],
    boundary: 'An AI-generated PIR is only a draft; it cannot approve itself or assert causality from timestamps alone. The MVP reports MTTA and MTTR, not MTTD, and does not claim production uptime or customer-impact metrics.',
    links: [{ label: 'Post-Incident Review & Insights', href: '#product-post-incident-insights' }, { label: 'Audit Trail', href: '#platform-audit-trail' }],
    scopeHref: '#product-post-incident-insights',
  },
};

export const solutionPageTitles = Object.fromEntries(
  solutionKeys.map(key => [key, solutions[key].title]),
) as Record<SolutionKey, string>;
