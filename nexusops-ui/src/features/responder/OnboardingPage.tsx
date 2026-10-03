import { useState } from 'react';
import { ArrowRight, Bell, CheckCircle2, ChevronDown, Circle, ShieldCheck, Users } from 'lucide-react';
import { DEMO_ACCOUNT } from '../../demo/auth';
import type { Profile, WorkspaceView } from './workspace-types';
import type { Priority, WorkspaceState } from './model';
import { setupSteps } from './onboarding';
import type { SetupPreferences, SetupStep } from './onboarding';
import './onboarding.css';

export function OnboardingPage({ profile, workspace, preferences, completion, onPreferences, onView, onIncident, onTestNotification, onTestAlert }: {
  profile: Profile; workspace: WorkspaceState; preferences: SetupPreferences; completion: Record<SetupStep, boolean>;
  onPreferences: (value: SetupPreferences) => void; onView: (view: WorkspaceView) => void;
  onIncident: (id: number) => void; onTestNotification: () => void;
  onTestAlert: (service: string, summary: string, priority: Priority) => void;
}) {
  const [step, setStep] = useState<SetupStep>(() => setupSteps.find(item => !completion[item.id])?.id ?? 'profile');
  const [inboxDraft, setInboxDraft] = useState(preferences.inboxEnabled);
  const [service, setService] = useState('payments-api');
  const [summary, setSummary] = useState('Onboarding test · elevated API error rate');
  const [priority, setPriority] = useState<Priority>('P3');

  const [message, setMessage] = useState('');
  const completed = setupSteps.filter(item => completion[item.id]).length;
  const incident = workspace.incidents.find(item => item.source === 'onboarding');
  const testSent = workspace.notifications.some(item => item.kind === 'setup-test');
  const current = setupSteps.find(item => item.id === step)!;
  function navigate(next: SetupStep) { setStep(next); setMessage(''); }
  const next = setupSteps.find(item => !completion[item.id] && item.id !== step);

  return <div className="ob-layout">
    <aside className="ws-panel ob-checklist" aria-label="Onboarding steps">
      <div className="ob-progress-heading"><h2>Your account setup</h2><span>{completed} / {setupSteps.length}</span></div>
      <progress max={setupSteps.length} value={completed} aria-label="Onboarding progress" />
      <p>Set up your responder workspace, one step at a time.</p>
      {setupSteps.map(item => <details key={item.id} open={step === item.id} className={completion[item.id] ? 'is-complete' : ''}>
        <summary onClick={event => { event.preventDefault(); navigate(item.id); }}>{completion[item.id] ? <CheckCircle2 size={18} /> : <Circle size={18} />}<span>{item.title}<small>{completion[item.id] ? 'Complete' : 'To do'}</small></span><ChevronDown size={15} /></summary>
        <p>{item.description}</p><button className="ws-text-button" onClick={() => navigate(item.id)}>Open setup page <ArrowRight size={14} /></button>
      </details>)}
      <details className="ob-optional"><summary><Users size={18} /><span>Your team members<small>Optional · administrator managed</small></span><ChevronDown size={15} /></summary><p>Your demo team is already assigned. Ask your administrator about invitations and membership changes.</p><button className="ws-text-button" onClick={() => onView('team')}>Open People <ArrowRight size={14} /></button></details>
    </aside>
    <section className="ws-panel ob-page" aria-labelledby="ob-page-title">
      <div className="ob-page-heading"><span className="ws-kicker">RESPONDER ONBOARDING · STEP {setupSteps.findIndex(item => item.id === step) + 1}</span><h2 id="ob-page-title">{current.title}</h2><p>{current.description}</p></div>
      <div className="ob-demo-note"><ShieldCheck size={17} /><span>Practice workspace. Tests stay in this browser session; no SMS, email or external system is contacted.</span></div>

      {step === 'profile' && <div className="ob-content"><h3>Make your profile recognizable</h3><p>Confirm your display name and timezone. Add a phone number, location or photo if useful to your team.</p><dl className="ob-facts"><div><dt>Name</dt><dd>{profile.name}</dd></div><div><dt>Work email</dt><dd>{DEMO_ACCOUNT.email}</dd></div><div><dt>Timezone</dt><dd>{profile.timezone}</dd></div><div><dt>Team</dt><dd>{DEMO_ACCOUNT.team}</dd></div></dl><p className="ob-hint">This step completes when you save your profile. Your phone number is contact information; it does not enable SMS delivery.</p><button className="ws-button ws-button-primary" onClick={() => onView('profile')}>Edit and save my profile <ArrowRight size={16} /></button></div>}

      {step === 'notifications' && <div className="ob-content"><h3>Notification channel</h3><form onSubmit={event => { event.preventDefault(); onPreferences({ ...preferences, inboxEnabled: inboxDraft }); setMessage(inboxDraft ? 'In-app test notifications enabled.' : 'In-app test notifications disabled. Existing incident notifications remain available.'); }}><label className="ob-check"><input type="checkbox" checked={inboxDraft} onChange={event => setInboxDraft(event.target.checked)} /><span><strong>In-app Inbox</strong><small>Receive setup test messages inside your NexusOps workspace.</small></span></label><button className="ws-button" type="submit">Save channel preference</button></form><div className="ob-test-box"><Bell size={22} /><div><h3>Try receiving a notification</h3><p>Send a test, open Inbox and mark that message as read to confirm receipt.</p></div></div><div className="ob-actions"><button className="ws-button ws-button-primary" disabled={!preferences.inboxEnabled || inboxDraft !== preferences.inboxEnabled} onClick={() => { onTestNotification(); setMessage('Test notification delivered to Inbox. Mark it as read to finish this step.'); }}>Send test notification</button><button className="ws-button" disabled={!testSent} onClick={() => onView('inbox')}>Open Inbox <ArrowRight size={15} /></button></div><p className="ob-hint">Email, SMS and phone delivery are not available in this MVP demo.</p></div>}

      {step === 'oncall' && <div className="ob-content"><h3>Plan your on-call hours</h3><p>Create a shift with a service, responder, coverage layer and explicit start/end times. The weekly calendar shows overnight shifts and primary/secondary coverage.</p><p className="ob-hint">Save at least one valid, unexpired shift assigned to yourself to complete this step. Deleting your last eligible shift makes this step incomplete again. This draft schedule does not drive live escalation.</p><button className="ws-button ws-button-primary" onClick={() => onView('schedule')}>Open on-call scheduler <ArrowRight size={16} /></button></div>}
      {step === 'escalation' && <div className="ob-content"><h3>Configure and review an escalation policy</h3><p>Open the policy designer to choose recipients for two levels, configure ACK timeouts and reminders, and select a final backstop from your team.</p><p className="ob-hint">Run a saved policy through the virtual-clock simulation, then acknowledge it or reach the backstop and confirm your review. Editing a saved policy resets this step. Existing sample incidents keep their reference assignments.</p><button className="ws-button ws-button-primary" onClick={() => onView('escalation')}>Open escalation policies <ArrowRight size={16} /></button>{preferences.escalationConfirmed && <p className="ob-hint"><CheckCircle2 size={16} />Your saved practice policy has been reviewed.</p>}</div>}

      {step === 'integration' && <div className="ob-content"><h3>Monitoring simulator</h3><p>Use the existing demo integration to generate one onboarding incident. Real integration keys and service configuration require authorized service management.</p>{!incident ? <form className="ob-alert-form" onSubmit={event => { event.preventDefault(); if (!summary.trim() || !preferences.assignmentConfirmed || !preferences.escalationConfirmed) return; onTestAlert(service, summary.trim(), priority); setMessage('Test alert accepted. An incident and Inbox notification have been created.'); }}><label>Target service<select value={service} onChange={event => setService(event.target.value)}>{['payments-api', 'order-worker', 'auth-service'].map(name => <option key={name}>{name}</option>)}</select></label><label>Priority<select value={priority} onChange={event => setPriority(event.target.value as Priority)}>{['P1', 'P2', 'P3', 'P4', 'P5'].map(value => <option key={value}>{value}</option>)}</select></label><label className="ob-wide">Alert summary<input required maxLength={160} value={summary} onChange={event => setSummary(event.target.value)} /></label><p className="ob-hint ob-wide">Save a valid shift for yourself and complete the escalation review before sending a test.</p><button className="ws-button ws-button-primary" disabled={!summary.trim() || !preferences.assignmentConfirmed || !preferences.escalationConfirmed} type="submit">Send demo alert</button></form> : <div className="ob-result"><CheckCircle2 size={22} /><div><h3>Test alert received</h3><p>Incident #{incident.id} · {incident.service} · {incident.priority}</p><p>{incident.title}</p><button className="ws-text-button" onClick={() => navigate('response')}>Continue to incident response <ArrowRight size={15} /></button></div></div>}<p className="ob-hint">The simulator creates one incident per demo session. It does not validate a live endpoint or issue a real API key.</p></div>}

      {step === 'response' && <div className="ob-content"><h3>Practice the full response</h3><p>Open your test incident, read its alert, acknowledge ownership, then resolve it with a short resolution note.</p>{incident ? <><div className="ob-result"><ShieldCheck size={22} /><div><h3>{incident.title}</h3><p>#{incident.id} · {incident.service} · assigned to you</p><span className={`ws-status ws-status-${incident.status.toLowerCase()}`}>{incident.status.replaceAll('_', ' ')}</span></div></div><ol className="ob-response-steps"><li>Receive the alert <span>Complete</span></li><li>Acknowledge the incident <span>{incident.acknowledgedAt ? 'Complete' : 'To do'}</span></li><li>Resolve with a note <span>{incident.status === 'RESOLVED' ? 'Complete' : 'To do'}</span></li></ol><button className="ws-button ws-button-primary" onClick={() => onIncident(incident.id)}>{completion.response ? 'Review resolved incident' : 'Open test incident'} <ArrowRight size={15} /></button></> : <div className="ob-result"><div><h3>Create your test incident first</h3><p>The monitoring simulator supplies the alert for this exercise.</p><button className="ws-button" onClick={() => navigate('integration')}>Go to monitoring simulator <ArrowRight size={15} /></button></div></div>}</div>}

      <p className="ob-message" role="status">{message}</p>
      <div className="ob-page-footer"><span>{completion[step] ? <><CheckCircle2 size={17} />Step completed</> : <><Circle size={17} />Complete the actions above to finish this step</>}</span>{next && <button className="ws-text-button" onClick={() => navigate(next.id)}>Next unfinished step <ArrowRight size={15} /></button>}</div>
      {completed === setupSteps.length && <div className="ob-success"><CheckCircle2 size={24} /><div><h3>You’re ready to respond.</h3><p>All setup steps are complete for this demo session.</p><button className="ws-button" onClick={() => onView('incidents')}>Go to incidents <ArrowRight size={15} /></button></div></div>}
    </section>
  </div>;
}
