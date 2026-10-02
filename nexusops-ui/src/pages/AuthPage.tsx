import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, InputHTMLAttributes } from 'react';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Activity, ShieldCheck, KeyRound, Info, Mail } from 'lucide-react';
import './auth.css';

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

export function AuthPage({ mode, initialEmail }: { mode: Mode; initialEmail: string }) {
  const signup = mode === 'signup';
  const [fields, setFields] = useState<Fields>({ name: '', email: initialEmail, invitation: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [help, setHelp] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);

  function update(name: FieldName, value: string) {
    setFields(previous => ({ ...previous, [name]: value }));
    setErrors(previous => ({ ...previous, [name]: undefined, ...(name === 'password' ? { confirm: undefined } : {}) }));
    setSubmitted(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
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
    setSubmitted(Object.keys(next).length === 0);
    const first = (signup ? ['name', 'email', 'invitation', 'password', 'confirm'] : ['email', 'password']).find(key => next[key as FieldName]);
    if (first) form.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
  }

  const input = (name: FieldName) => ({ id: `auth-${name}`, name, value: fields[name], onChange: (event: ChangeEvent<HTMLInputElement>) => update(name, event.target.value), error: errors[name], required: true });

  return (
    <main className={`auth-page ${signup ? 'auth-signup' : ''}`}>
      <section className="auth-story" aria-label="About NexusOps">
        <a className="auth-brand" href="#" aria-label="NexusOps home">Nexus<span>Ops</span><span className="auth-brand-dot" /></a>
        <div className="auth-story-content">
          <span className="auth-eyebrow"><span /> BUILT FOR THE PEOPLE ON CALL</span>
          <h2>{signup ? <>Better response.<br />Starts with <em>your team.</em></> : <>When every<br />moment <em>matters.</em></>}</h2>
          <p className="auth-story-description">{signup ? 'A shared place to investigate, coordinate, and learn from every incident.' : 'Bring your alerts, responders, and next steps together. Get back to what matters.'}</p>
          <div className="auth-incident-card">
            <div className="auth-card-heading"><span><Activity size={15} /> INCIDENT WORKSPACE</span><span className="auth-example">Preview</span></div>
            <div className="auth-incident-title"><span className="auth-severity">P2</span><strong>API response latency elevated</strong></div>
            <div className="auth-service">payments-api <span>•</span> Production</div>
            <div className="auth-timeline">
              <div><span className="auth-step"><Activity size={13} /></span><p>Signal received<small>Related alerts, one clear picture</small></p><Check size={15} /></div>
              <div><span className="auth-step"><Check size={13} /></span><p>Responder acknowledged<small>Ownership established</small></p><Check size={15} /></div>
              <div><span className="auth-step auth-step-current"><ShieldCheck size={13} /></span><p>Investigating together<small>Evidence before action</small></p><span className="auth-live-dot" /></div>
            </div>
          </div>
          <div className="auth-story-caption"><ShieldCheck size={17} /><span>Human judgment. Shared context. Clear ownership.</span></div>
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

          <form ref={form} noValidate onSubmit={submit} className="auth-form">
            {signup && <Field {...input('name')} label="Full name" type="text" placeholder="Alex Morgan" autoComplete="name" maxLength={120} />}
            <Field {...input('email')} label={signup ? 'Invited email address' : 'Work email'} type="email" placeholder="you@company.com" autoComplete="username" spellCheck={false} autoCapitalize="none" />
            {signup && <Field {...input('invitation')} label="Invitation code" type="text" placeholder="Paste your invitation code" autoComplete="off" spellCheck={false} autoCapitalize="none" hint="Use the code sent to your invited email address." />}
            <Field {...input('password')} label="Password" type="password" placeholder={signup ? 'Create a password' : 'Enter your password'} autoComplete={signup ? 'new-password' : 'current-password'} hint={signup ? 'Use at least 8 characters.' : undefined} />
            {signup && <Field {...input('confirm')} label="Confirm password" type="password" placeholder="Re-enter your password" autoComplete="new-password" />}
            {!signup && <div className="auth-form-options"><span><ShieldCheck size={14} /> Your team workspace</span><button type="button" onClick={() => setHelp(!help)} aria-expanded={help} aria-controls="auth-help">Need help signing in?</button></div>}
            {help && <p id="auth-help" className="auth-help">Contact your workspace administrator if you need to recover access or receive a new invitation.</p>}
            <button className="auth-submit" type="submit">{signup ? 'Create account' : 'Log in'} <ArrowRight size={17} /></button>
            {submitted && <div className="auth-feedback" role="status"><Info size={18} /><p><strong>Form ready for connection</strong>{signup ? 'Your account has not been created. Invitation verification and registration will be available when authentication is connected.' : 'You are viewing a UI preview. Authentication is not connected yet, so no sign-in session has been created.'}</p></div>}
          </form>

          {signup && <p className="auth-invite-note"><ShieldCheck size={16} /><span>Your administrator manages workspace access and permissions.</span></p>}
          <div className="auth-preview-note"><span /> UI preview · Authentication coming soon</div>
        </div>
        <footer className="auth-form-footer"><span>© {new Date().getFullYear()} NexusOps</span><span>Clarity in every incident.</span></footer>
      </section>
    </main>
  );
}
