// Public demo credentials, intentionally bundled in the frontend. Not real authentication.
export const DEMO_ACCOUNT = {
  email: 'responder@nexusops.demo',
  password: 'NexusOps@2026',
  name: 'Linh Nguyen',
  initials: 'LN',
  role: 'RESPONDER',
  team: 'Platform Engineering',
} as const;

const SESSION_KEY = 'nexusops.responder-demo.v1';

export function acceptsDemoCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password;
}

export function hasDemoSession() {
  try { return sessionStorage.getItem(SESSION_KEY) === 'responder'; }
  catch { return false; }
}

export function setDemoSession(active: boolean) {
  try {
    if (active) sessionStorage.setItem(SESSION_KEY, 'responder');
    else sessionStorage.removeItem(SESSION_KEY);
  } catch { /* The app can still use its in-memory demo session. */ }
}
