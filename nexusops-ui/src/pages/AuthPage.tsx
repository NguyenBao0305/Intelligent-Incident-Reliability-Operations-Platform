import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, InputHTMLAttributes } from 'react';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Activity, ShieldCheck, KeyRound, Info, Mail } from 'lucide-react';
import './auth.css';
import { acceptInvitation, login, demoUsers, DEMO_PASSWORD } from '../features/access/store';
import { roleLabels } from '../features/access/policy';

type Mode = 'login' | 'signup';
type FieldName = 'name' | 'email' | 'invitation' | 'password' | 'confirm';
type Fields = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

function Field({ label, error, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const [visible, setVisible] = useState(false);
  const password = props.type === 'password';
  return (
    <div className="auth-field">
      <label htmlFor={props.id}>{label}</label>
      <div className="auth-input-wrap">
        <input {...props} type={password && visible ? 'text' : props.type} aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
          className={password ? 'auth-input auth-input-password' : 'auth-input'} />
        {password && <button type="button" className="auth-reveal" onClick={() => setVisible(!visible)}
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible}>
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>}
      </div>
      {error ? <p className="auth-error" id={`${props.id}-error`}>{error}</p> : hint && <p className="auth-hint" id={`${props.id}-hint`}>{hint}</p>}
    </div>
  );
}

export function AuthPage({ mode, initialEmail, onDemoLogin }: { mode: Mode; initialEmail: string; onDemoLogin: () => void }) {
  const signup = mode === 'signup';
  const [demoId, setDemoId] = useState('responder-demo');
  const demo = demoUsers.find(user => user.id === demoId)!;
  const [busy, setBusy] = useState(false);
  const [fields, setFields] = useState<Fields>({ name: '', email: initialEmail, invitation: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [help, setHelp] = useState(false);
  const [credentialError, setCredentialError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);

  function update(name: FieldName, value: string) {
    setFields(previous => ({ ...previous, [name]: value }));
    setErrors(previous => ({ ...previous, [name]: undefined, ...(name === 'password' ? { confirm: undefined } : {}) }));
    setSubmitted(false);
    setCredentialError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = 'Enter a valid email address.';
    if (!fields.password) next.password = 'Enter your password.';
    if (signup) {
      if (!fields.name.trim()) next.name = 'Enter your full name.';
      if (!fields.invitation.trim()) next.invitation = 'Enter the invitation code shared by your administrator.';
      if (fields.password.length < 8) next.password = 'Use at least 8 characters.';
      if (!fields.confirm || fields.confirm !== fields.password) next.confirm = 'Your passwords must match.';
    }
    setErrors(next);
    setSubmitted(false);
    if (Object.keys(next).length === 0 && !busy) {
      setBusy(true); setCredentialError('');
      try {
        if (signup) { await acceptInvitation(fields.email, fields.invitation, fields.name, fields.password); setSubmitted(true); }
        else { await login(fields.email, fields.password); onDemoLogin(); }
      } catch (error) { setCredentialError(error instanceof Error ? error.message : 'Could not complete this request.'); }
      finally { setBusy(false); }
    }
    const first = (signup ? ['name', 'email', 'invitation', 'password', 'confirm'] : ['email', 'password']).find(key => next[key as FieldName]);
    if (first) form.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
  }

  const input = (name: FieldName) => ({ id: `auth-${name}`, name, value: fields[name], onChange: (event: ChangeEvent<HTMLInputElement>) => update(name, event.target.value), error: errors[name], required: true });

  return (
    <main className={`auth-page ${signup ? 'auth-signup' : ''}`}>
      <section className="auth-story" aria-label="About NexusOps">
        <a className="auth-brand" href="#" aria-label="NexusOps home">Nexus<span>Ops</span></a>
        <div className="auth-story-content">
          <span className="auth-eyebrow"><span /> {signup ? 'ACCOUNT SETUP GUIDE' : 'SIGN-IN GUIDE'}</span>
          <h2>{signup ? <>Create your<br /><em>team account.</em></> : <>Before you<br /><em>sign in.</em></>}</h2>
          <p className="auth-story-description">{signup ? 'Use the invitation sent by your NexusOps administrator to set up your account.' : 'Use the work email linked to your NexusOps team. Your organization manages access to this workspace.'}</p>
          <div className="auth-incident-card auth-guide-card">
            <div className="auth-card-heading"><span><ShieldCheck size={15} /> {signup ? 'SIGN-UP STEPS' : 'AFTER YOU SIGN IN'}</span></div>
            {signup ? <div className="auth-guide-list" role="list">
              <div className="auth-guide-item" role="listitem"><span className="auth-guide-icon"><Mail size={15} /></span><p>Use your invited email<small>It must match the address your administrator invited.</small></p></div>
              <div className="auth-guide-item" role="listitem"><span className="auth-guide-icon"><KeyRound size={15} /></span><p>Enter your invitation code<small>Your workspace administrator provides the code.</small></p></div>
              <div className="auth-guide-item" role="listitem"><span className="auth-guide-icon"><ShieldCheck size={15} /></span><p>Create your password<small>Your role and access are assigned by your organization.</small></p></div>
            </div> : <div className="auth-guide-list" role="list">
              <div className="auth-guide-item" role="listitem"><span className="auth-guide-icon"><Activity size={15} /></span><p>Review active incidents<small>See severity, affected service and assigned responders.</small></p></div>
              <div className="auth-guide-item" role="listitem"><span className="auth-guide-icon"><Check size={15} /></span><p>Follow response progress<small>Check ACK status, timeline updates and team notes.</small></p></div>
              <div className="auth-guide-item" role="listitem"><span className="auth-guide-icon"><ShieldCheck size={15} /></span><p>Use your assigned permissions<small>Available actions depend on your account role and incident access.</small></p></div>
            </div>}
          </div>
          <div className="auth-story-caption"><ShieldCheck size={17} /><span>{signup ? 'No invitation? Ask your workspace administrator to invite you.' : 'Need access? Ask your workspace administrator for an invitation.'}</span></div>
        </div>
        <div className="auth-story-footer"><span>INTELLIGENT INCIDENT OPERATIONS</span><span>01 — READY TO RESPOND</span></div>
      </section>

      <section className="auth-form-panel" aria-label={signup ? 'Create an account' : 'Log in'}>
        <div className="auth-topbar"><a href="#"><ArrowLeft size={15} /> Back to home</a><span>{signup ? 'Already a member?' : 'Have an invitation?'} <a href={signup ? '#login' : '#signup'}>{signup ? 'Log in' : 'Join your team'} <ArrowRight size={13} /></a></span></div>
        <div className="auth-form-content">
          <div className="auth-form-icon">{signup ? <Mail size={23} /> : <KeyRound size={23} />}</div>
          <p className="auth-form-eyebrow">YOUR OPERATIONS, CONNECTED</p>
          <h1 ref={heading} tabIndex={-1}>{signup ? 'Join your team.' : 'Welcome back.'}</h1>
          <p className="auth-description">{signup ? 'Create your account with an invitation from your NexusOps administrator.' : 'Log in to your NexusOps workspace.'}</p>

          {!signup && <div className="auth-demo-account">
            <div><strong>Explore a workspace role</strong><span>Sample workspace · frontend demo</span></div>
            <label>Demo account<select aria-label="Demo account" value={demoId} onChange={event => setDemoId(event.target.value)}>{demoUsers.slice(0, 5).map(user => <option key={user.id} value={user.id}>{user.id === 'commander-demo' ? 'Manager + Responder · Commander on #1048' : user.roles.map(role => roleLabels[role]).join(' + ')}</option>)}</select></label><p>Email: <code>{demo.email}</code><br />Password: <code>{DEMO_PASSWORD}</code></p>
            <button type="button" onClick={() => {
              setFields(previous => ({ ...previous, email: demo.email, password: DEMO_PASSWORD }));
              setErrors({}); setCredentialError('');
            }}>Use demo account <ArrowRight size={15} /></button>
          </div>}
          <form ref={form} noValidate onSubmit={submit} className="auth-form">
            {signup && <Field {...input('name')} label="Full name" type="text" placeholder="Alex Morgan" autoComplete="name" maxLength={120} />}
            <Field {...input('email')} label={signup ? 'Invited email address' : 'Work email'} type="email" placeholder="you@company.com" autoComplete="username" spellCheck={false} autoCapitalize="none" />
            {signup && <Field {...input('invitation')} label="Invitation code" type="text" placeholder="Paste your invitation code" autoComplete="off" spellCheck={false} autoCapitalize="none" hint="Use the code sent to your invited email address." />}
            <Field {...input('password')} label="Password" type="password" placeholder={signup ? 'Create a password' : 'Enter your password'} autoComplete={signup ? 'new-password' : 'current-password'} hint={signup ? 'Use at least 8 characters.' : undefined} />
            {signup && <Field {...input('confirm')} label="Confirm password" type="password" placeholder="Re-enter your password" autoComplete="new-password" />}
            {!signup && <div className="auth-form-options"><span><ShieldCheck size={14} /> Your team workspace</span><button type="button" onClick={() => setHelp(!help)} aria-expanded={help} aria-controls="auth-help">Need help signing in?</button></div>}
            {help && <p id="auth-help" className="auth-help">Contact your workspace administrator if you need to recover access or receive a new invitation.</p>}
            {credentialError && <p className="auth-error" role="alert">{credentialError}</p>}
            <button className="auth-submit" type="submit" disabled={busy || submitted}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Log in'} <ArrowRight size={17} /></button>
            {submitted && <div className="auth-feedback" role="status"><Info size={18} /><p><strong>Demo account created</strong>Your invitation has been accepted on this browser. <a href="#login">Log in with your email and password.</a></p></div>}
          </form>

          {signup && <p className="auth-invite-note"><ShieldCheck size={16} /><span>Your administrator manages workspace access and permissions.</span></p>}
          <div className="auth-preview-note"><span /> {signup ? 'Local invitation demo · No email delivery' : 'Local demo accounts · No server authentication'}</div>
        </div>
        <footer className="auth-form-footer"><span>© {new Date().getFullYear()} NexusOps</span><span>Clarity in every incident.</span></footer>
      </section>
    </main>
  );
}
