import { useSyncExternalStore } from 'react';
import { createDemoWorkspace } from '../responder/model';
import type { Incident } from '../responder/model';
import { createEscalationPolicies } from '../responder/escalation';
import type { EscalationPolicy } from '../responder/escalation';
import type { Shift } from '../responder/schedule';
import { can, canRespond, roleLabels, rolePermissions } from './policy';
import type { Identity, Permission, Role } from './policy';

export const TEAM = 'platform-team';
export const DEMO_PASSWORD = 'NexusOps@2026';
export interface User extends Identity { email: string; name: string; title: string; department: string; phone: string; location: string; timezone: string; avatar: string; credential: string; sessionVersion: number; seeded?: boolean }
export interface Service { id: string; teamId: string; name: string; description: string; criticality: 'CRITICAL' | 'HIGH' | 'NORMAL'; enabled: boolean; dependencies: string[] }
export interface ScopedIncident extends Incident { teamId: string; commanderId?: string; investigation?: string }
export interface Invitation { id: string; teamId: string; email: string; roles: Role[]; token: string; invitedBy: string; expiresAt: number; status: 'PENDING' | 'ACCEPTED' | 'REVOKED' }
export interface Audit { id: string; at: number; actor: string; action: string; resource: string; detail: string; teamId: string }
export interface Integration { service: string; name: string; enabled: boolean; lastTestAt: number | null }
export interface Review { incidentId: number; status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'COMPLETED'; summary: string; followup: string; ownerId: string; completed: boolean }
export interface Action { id: string; incidentId: number; state: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUCCEEDED' | 'CANCELLED'; requestedBy: string; decidedBy?: string; executedAt?: number }
export interface Notice { id: string; userId: string; text: string; read: boolean; incidentId?: number }
export interface Data { version: 1; users: User[]; invitations: Invitation[]; services: Service[]; incidents: ScopedIncident[]; shifts: Shift[]; policies: EscalationPolicy[]; integrations: Integration[]; reviews: Review[]; actions: Action[]; audit: Audit[]; notices: Notice[] }
export const demoUsers = [
  { id: 'admin-demo', email: 'admin@nexusops.demo', name: 'An Nguyen', roles: ['ACCOUNT_ADMIN'] as Role[] },
  { id: 'manager-demo', email: 'manager@nexusops.demo', name: 'Minh Le', roles: ['TEAM_MANAGER'] as Role[] },
  { id: 'responder-demo', email: 'responder@nexusops.demo', name: 'Linh Nguyen', roles: ['RESPONDER'] as Role[] },
  { id: 'viewer-demo', email: 'viewer@nexusops.demo', name: 'Ha Tran', roles: ['VIEWER'] as Role[] },
  { id: 'commander-demo', email: 'commander@nexusops.demo', name: 'Bao Pham', roles: ['TEAM_MANAGER', 'RESPONDER'] as Role[] },
  { id: 'responder-quang', email: 'quang@nexusops.demo', name: 'Quang Tran', roles: ['RESPONDER'] as Role[] },
  { id: 'responder-mai', email: 'mai@nexusops.demo', name: 'Mai Pham', roles: ['RESPONDER'] as Role[] },
];
export function seed(): Data {
  const incidents = createDemoWorkspace().incidents.map(i => ({ ...i, teamId: TEAM, ...(i.id === 1048 ? { commanderId: 'commander-demo' } : {}) }));
  return { version: 1, users: demoUsers.map(u => ({ ...u, roles: [...u.roles], teamId: TEAM, enabled: true, seeded: true, credential: '', sessionVersion: 1, title: '', department: 'Platform Engineering', phone: '', location: '', timezone: 'Asia/Ho_Chi_Minh', avatar: '' })), invitations: [],
    services: ['payments-api', 'order-worker', 'auth-service'].map((name, i) => ({ id: name, name, teamId: TEAM, description: ['Payment authorization and checkout', 'Order processing and retries', 'Identity and authentication'][i], criticality: i === 0 ? 'CRITICAL' : 'HIGH', enabled: true, dependencies: i === 0 ? ['auth-service'] : [] })),
    incidents, shifts: [], policies: createEscalationPolicies(), integrations: [], reviews: incidents.filter(i => i.status === 'RESOLVED').map(i => ({ incidentId: i.id, status: 'DRAFT', summary: `Review of ${i.title}. Confirm impact and contributing factors against the incident timeline.`, followup: '', ownerId: i.assignedTo, completed: false })), actions: [],
    audit: [{ id: 'bootstrap', at: Date.now(), actor: 'Demo bootstrap', action: 'WORKSPACE_INITIALIZED', resource: 'Platform Engineering', detail: 'Seeded demo identities and roles. No production account created.', teamId: TEAM }],
    notices: [{ id: 'welcome', userId: 'admin-demo', text: 'Your demo workspace is ready. Invite your team from People & access.', read: false }, ...incidents.filter(i => i.status === 'TRIGGERED').map(i => ({ id: `page-${i.id}`, userId: i.assignedTo, text: `#${i.id} ${i.title}`, read: false, incidentId: i.id }))] };
}
const KEY = 'nexusops.workspace.roles.v1';
const SESSION = 'nexusops.identity.v1';
function load(): Data { try { const value = JSON.parse(localStorage.getItem(KEY) || 'null'); if (value?.version === 1 && Array.isArray(value.users) && Array.isArray(value.incidents)) return value; } catch { /* New demo. */ } return seed(); }
let snapshot: Data = load();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(fn => fn());
if (typeof window !== 'undefined') window.addEventListener('storage', event => { if (event.key === KEY) { snapshot = load(); emit(); } });
export const getData = () => snapshot;
export const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
export function useData() { return useSyncExternalStore(subscribe, getData); }
function persist(next: Data) { localStorage.setItem(KEY, JSON.stringify(next)); snapshot = next; emit(); }
export function currentUser(data = snapshot): User | undefined {
  try { const session = JSON.parse(sessionStorage.getItem(SESSION) || 'null'); return data.users.find(u => u.id === session?.id && u.enabled && u.sessionVersion === session.version); } catch { return undefined; }
}
export function logout() { sessionStorage.removeItem(SESSION); emit(); }
async function credential(password: string, salt: string = crypto.randomUUID()) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' }, key, 256);
  return `${salt}:${Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('')}`;
}
export async function login(email: string, password: string) {
  const user = snapshot.users.find(u => u.email === email.trim().toLowerCase() && u.enabled);
  if (!user || (user.credential ? await credential(password, user.credential.split(':')[0]) !== user.credential : !user.seeded || password !== DEMO_PASSWORD)) throw new Error('Email or password is incorrect, or this account is disabled.');
  const fresh = snapshot.users.find(u => u.id === user.id);
  if (!fresh?.enabled || fresh.sessionVersion !== user.sessionVersion) throw new Error('Account access changed. Please sign in again.');
  sessionStorage.setItem(SESSION, JSON.stringify({ id: fresh.id, version: fresh.sessionVersion })); emit();
}
function log(data: Data, actor: string, action: string, resource: string, detail = '') { data.audit.unshift({ id: crypto.randomUUID(), at: Date.now(), actor, action, resource, detail, teamId: TEAM }); }
function requirePermission(user: User, permission: Permission, teamId = TEAM) { if (!can(user, permission, teamId)) throw new Error('You do not have permission for this action in this team.'); }
function validRoles(roles: Role[]) { if (!roles.length || roles.some(r => !Object.hasOwn(roleLabels, r)) || new Set(roles).size !== roles.length) throw new Error('Choose at least one valid role.'); if (roles.includes('VIEWER') && roles.length > 1) throw new Error('Viewer must be used alone; use Responder for operational actions.'); }
export type Command =
  | { type: 'invite'; email: string; roles: Role[] }
  | { type: 'invitation'; id: string; operation: 'revoke' | 'resend' }
  | { type: 'user'; id: string; roles: Role[]; enabled: boolean }
  | { type: 'profile'; profile: Pick<User, 'name' | 'title' | 'department' | 'phone' | 'location' | 'timezone' | 'avatar'> }
  | { type: 'service'; service: Service }
  | { type: 'shift'; shift: Shift; remove?: boolean }
  | { type: 'policy'; policy: EscalationPolicy }
  | { type: 'integration'; integration: Integration }
  | { type: 'test-event'; service: string }
  | { type: 'incident'; id: number; operation: 'ack' | 'resolve' | 'note' | 'investigate' | 'propose'; text?: string }
  | { type: 'assign'; id: number; responderId: string; commanderId: string }
  | { type: 'action'; id: string; operation: 'approve' | 'reject' | 'execute' }
  | { type: 'review'; review: Review }
  | { type: 'read'; id?: string };

// Every mutation is checked here as well as in the UI. This is a demo boundary, not server authorization.
export function reduceCommand(source: Data, actorId: string, command: Command, now = Date.now()): Data {
  const data = structuredClone(source);
  const actor = data.users.find(u => u.id === actorId && u.enabled);
  if (!actor) throw new Error('Sign in with an active account.');
  const eligible = (id: string) => data.users.some(u => u.id === id && can(u, 'INCIDENT_ACK', actor.teamId));
  const serviceFor = (name: string) => { const s = data.services.find(s => s.name === name && s.teamId === actor.teamId); if (!s) throw new Error('Service is outside your scope.'); return s; };
  const incidentFor = (id: number) => { const i = data.incidents.find(i => i.id === id && i.teamId === actor.teamId); if (!i) throw new Error('Incident is outside your scope.'); return i; };
  const incidentAccess = (i: ScopedIncident, p: Permission) => { if (!canRespond(actor, i, p)) throw new Error('This action requires permission and assignment as responder or commander on this incident.'); };
  const timeline = (i: ScopedIncident, text: string) => i.timeline.push({ id: crypto.randomUUID(), at: now, text, kind: 'system' });
  if (command.type === 'invite') {
    requirePermission(actor, 'INVITATION_MANAGE'); validRoles(command.roles);
    const email = command.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email.');
    if (data.users.some(u => u.email === email) || data.invitations.some(i => i.email === email && i.status === 'PENDING' && i.expiresAt > now)) throw new Error('This email already has an account or an active invitation.');
    data.invitations.unshift({ id: crypto.randomUUID(), email, teamId: actor.teamId, roles: command.roles, invitedBy: actor.id, token: crypto.randomUUID(), expiresAt: now + 72 * 3600000, status: 'PENDING' });
    log(data, actor.name, 'INVITATION_CREATED', email, command.roles.join(', '));
  } else if (command.type === 'invitation') {
    requirePermission(actor, 'INVITATION_MANAGE'); const i = data.invitations.find(i => i.id === command.id && i.teamId === actor.teamId);
    if (!i || i.status !== 'PENDING') throw new Error('Only pending invitations can be changed.');
    if (command.operation === 'revoke') i.status = 'REVOKED'; else { i.token = crypto.randomUUID(); i.expiresAt = now + 72 * 3600000; }
    log(data, actor.name, `INVITATION_${command.operation.toUpperCase()}`, i.email);
  } else if (command.type === 'user') {
    requirePermission(actor, 'USER_MANAGE'); requirePermission(actor, 'ROLE_ASSIGN'); validRoles(command.roles);
    const u = data.users.find(u => u.id === command.id && u.teamId === actor.teamId); if (!u) throw new Error('Member not found.');
    if (u.roles.includes('ACCOUNT_ADMIN') && u.enabled && (!command.enabled || !command.roles.includes('ACCOUNT_ADMIN')) && !data.users.some(v => v.id !== u.id && v.enabled && v.roles.includes('ACCOUNT_ADMIN'))) throw new Error('Keep at least one active Account Admin.');
    const losesResponse = can(u, 'INCIDENT_ACK') && !(command.enabled && command.roles.some(r => rolePermissions[r].includes('INCIDENT_ACK')));
    if (!command.enabled || losesResponse) {
      const incident = data.incidents.find(i => i.status !== 'RESOLVED' && (i.assignedTo === u.id || i.commanderId === u.id));
      if (incident) throw new Error(`Transfer responsibility for incident #${incident.id} before removing response access.`);
      if (data.shifts.some(s => s.person === u.id && s.end > now)) throw new Error('Reassign upcoming on-call shifts first.');
      if (data.policies.some(p => p.backstop === u.id || p.rules.some(r => r.targets.includes(u.id)))) throw new Error('Replace this member in escalation targets and backstops first.');
    }
    log(data, actor.name, 'MEMBER_ACCESS_CHANGED', u.email, `${u.roles.join('+')} (${u.enabled}) → ${command.roles.join('+')} (${command.enabled})`);
    u.roles = command.roles; u.enabled = command.enabled; u.sessionVersion++;
  } else if (command.type === 'profile') {
    if (!command.profile.name.trim()) throw new Error('Name is required.');
    if (command.profile.avatar.length > 2800000 || (command.profile.avatar && !/^data:image\/(png|jpeg|webp);base64,/.test(command.profile.avatar))) throw new Error('Use a PNG, JPG or WebP image up to 2 MB.');
    const { name, title, department, phone, location, timezone, avatar } = command.profile;
    Object.assign(actor, { name: name.trim(), title, department, phone, location, timezone, avatar });
    data.incidents.filter(i => i.assignedTo === actor.id).forEach(i => { i.assignedName = actor.name; }); log(data, actor.name, 'PROFILE_UPDATED', actor.id);
  } else if (command.type === 'service') {
    requirePermission(actor, 'SERVICE_MANAGE', command.service.teamId); const s = command.service;
    if (!/^[a-z0-9][a-z0-9-]{1,59}$/.test(s.name) || !['CRITICAL', 'HIGH', 'NORMAL'].includes(s.criticality)) throw new Error('Use a unique service name (2–60 lowercase letters, numbers or hyphens) and a valid criticality.');
    if (data.services.some(v => v.id !== s.id && v.name === s.name)) throw new Error('Service name is already in use.');
    const existing = data.services.find(v => v.id === s.id);
    if (existing && existing.teamId !== actor.teamId) throw new Error('Service is outside your scope.');
    if (existing && existing.name !== s.name) throw new Error('Service identifier cannot be renamed after creation.');
    if (s.dependencies.some(id => id === s.id || !data.services.some(v => v.id === id && v.teamId === actor.teamId))) throw new Error('Dependencies must be other services in this team.');
    if (existing) Object.assign(existing, s); else data.services.push(s);
    log(data, actor.name, 'SERVICE_SAVED', s.name, s.enabled ? s.criticality : 'Disabled');
  } else if (command.type === 'shift') {
    requirePermission(actor, 'SCHEDULE_MANAGE'); const s = command.shift; serviceFor(s.service);
    const existingShift = data.shifts.find(v => v.id === s.id); if (existingShift) serviceFor(existingShift.service);
    if (command.remove) data.shifts = data.shifts.filter(v => v.id !== s.id);
    else {
      if (!eligible(s.person) || !Number.isFinite(s.start) || !Number.isFinite(s.end) || s.end <= now || s.end - s.start < 1800000 || s.end - s.start > 604800000 || !['Primary', 'Secondary'].includes(s.layer)) throw new Error('Choose an active responder and a future shift lasting 30 minutes to seven days.');
      if (data.shifts.some(v => v.id !== s.id && v.service === s.service && v.layer === s.layer && s.start < v.end && s.end > v.start)) throw new Error('Coverage overlaps another shift in the same service and layer.');
      data.shifts = [...data.shifts.filter(v => v.id !== s.id), s];
    }
    log(data, actor.name, command.remove ? 'SHIFT_REMOVED' : 'SHIFT_SAVED', s.service);
  } else if (command.type === 'policy') {
    requirePermission(actor, 'ESCALATION_MANAGE'); const p = command.policy; serviceFor(p.service);
    if (!p.name.trim() || p.rules.length !== 2 || !eligible(p.backstop) || p.rules.some(r => !r.targets.length || new Set(r.targets).size !== r.targets.length || r.targets.some(id => !eligible(id)) || !Number.isInteger(r.timeoutMinutes) || r.timeoutMinutes < 1 || r.timeoutMinutes > 60 || !Number.isInteger(r.repeatCount) || r.repeatCount < 0 || r.repeatCount > 5 || !Number.isInteger(r.repeatMinutes) || r.repeatMinutes < 1 || r.repeatMinutes > 60)) throw new Error('Use two levels with active responders, 1–60 minute timeouts, 0–5 reminders and one backstop.');
    const old = data.policies.find(v => v.service === p.service);
    if (old && old.version !== p.version) throw new Error('Policy changed. Reload before saving.');
    data.policies = [...data.policies.filter(v => v.service !== p.service), { ...p, version: (old?.version ?? 0) + 1 }]; log(data, actor.name, 'POLICY_SAVED', p.service);
  } else if (command.type === 'integration') {
    requirePermission(actor, 'INTEGRATION_MANAGE'); serviceFor(command.integration.service);
    if (!command.integration.name.trim()) throw new Error('Integration name is required.');
    data.integrations = [...data.integrations.filter(v => v.service !== command.integration.service), command.integration]; log(data, actor.name, 'INTEGRATION_SAVED', command.integration.service);
  } else if (command.type === 'test-event') {
    requirePermission(actor, 'INTEGRATION_MANAGE'); const s = serviceFor(command.service);
    const config = data.integrations.find(v => v.service === s.name && v.enabled); const policy = data.policies.find(p => p.service === s.name);
    if (!s.enabled || !config || !policy) throw new Error('Enable the service/integration and save an escalation policy first.');
    const target = policy.rules[0].targets.find(eligible); if (!target) throw new Error('The primary policy has no eligible responder.');
    const id = Math.max(...data.incidents.map(i => i.id), 1048) + 1; config.lastTestAt = now;
    data.incidents.unshift({ id, teamId: s.teamId, title: `Test alert from ${config.name}`, service: s.name, priority: 'P3', status: 'TRIGGERED', assignedTo: target, assignedName: data.users.find(u => u.id === target)!.name, createdAt: now, acknowledgedAt: null, resolvedAt: null, escalationLevel: 1, alerts: [{ id: `TEST-${id}`, summary: 'Local test event', status: 'OPEN' }], timeline: [{ id: crypto.randomUUID(), at: now, kind: 'system', text: `Local test routed through policy ${policy.name} v${policy.version}. No external paging.` }] });
    data.notices.unshift({ id: crypto.randomUUID(), userId: target, text: `Test incident #${id} assigned to you.`, incidentId: id, read: false }); log(data, actor.name, 'TEST_EVENT_ACCEPTED', `INC-${id}`);
  } else if (command.type === 'assign') {
    const i = incidentFor(command.id); requirePermission(actor, 'INCIDENT_ASSIGN', i.teamId);
    if (i.status === 'RESOLVED' || !eligible(command.responderId) || (command.commanderId && !eligible(command.commanderId))) throw new Error('Assign an active responder/commander to an open incident.');
    i.assignedTo = command.responderId; i.assignedName = data.users.find(u => u.id === i.assignedTo)!.name; i.commanderId = command.commanderId || undefined;
    timeline(i, `${actor.name} assigned ${i.assignedName}; commander: ${data.users.find(u => u.id === i.commanderId)?.name ?? 'none'}.`);
    for (const id of new Set([i.assignedTo, i.commanderId].filter(Boolean))) data.notices.unshift({ id: crypto.randomUUID(), userId: id!, incidentId: i.id, text: `You were assigned to incident #${i.id}.`, read: false });
    log(data, actor.name, 'INCIDENT_ASSIGNED', `INC-${i.id}`);
  } else if (command.type === 'incident') {
    const i = incidentFor(command.id); const p: Permission = ({ ack: 'INCIDENT_ACK', resolve: 'INCIDENT_RESOLVE', note: 'INCIDENT_NOTE', investigate: 'AI_RUN', propose: 'AUTOMATION_EXECUTE' } as const)[command.operation]; incidentAccess(i, p);
    if (command.operation !== 'note' && i.status === 'RESOLVED') throw new Error('This incident is resolved.');
    if (command.operation === 'ack') { if (i.status !== 'TRIGGERED') throw new Error('Only Triggered incidents can be acknowledged.'); i.status = 'ACKNOWLEDGED'; i.acknowledgedAt = now; i.escalationLevel = null; }
    if (command.operation === 'resolve') {
      if (i.status !== 'ACKNOWLEDGED' || !command.text?.trim()) throw new Error('Acknowledge the incident and provide a resolution reason.');
      i.status = 'RESOLVED'; i.resolvedAt = now; i.escalationLevel = null; i.alerts.forEach(a => { a.status = 'RESOLVED'; });
      data.actions.filter(a => a.incidentId === i.id && ['APPROVED', 'PENDING_APPROVAL'].includes(a.state)).forEach(a => { a.state = 'CANCELLED'; });
      if (!data.reviews.some(r => r.incidentId === i.id)) data.reviews.push({ incidentId: i.id, status: 'DRAFT', summary: `Resolution: ${command.text.trim()}`, followup: '', ownerId: actor.id, completed: false });
    }
    if (command.operation === 'note' && !command.text?.trim()) throw new Error('A note cannot be empty.');
    if (command.operation === 'investigate') i.investigation = `Sample investigation: ${i.alerts.length} linked alert(s) on ${i.service}. Evidence: ${i.alerts.map(a => a.id).join(', ')}. Root cause is not established. Deployment records and service metrics are missing; collect and verify them before acting. No model was called.`;
    if (command.operation === 'propose') { if (data.actions.some(a => a.incidentId === i.id && ['APPROVED', 'PENDING_APPROVAL'].includes(a.state))) throw new Error('An action is already pending for this incident.'); data.actions.unshift({ id: crypto.randomUUID(), incidentId: i.id, state: 'PENDING_APPROVAL', requestedBy: actor.id }); }
    timeline(i, `${actor.name}: ${command.operation}${command.text ? ` — ${command.text.trim()}` : ''}`); log(data, actor.name, `INCIDENT_${command.operation.toUpperCase()}`, `INC-${i.id}`);
  } else if (command.type === 'action') {
    const a = data.actions.find(a => a.id === command.id); if (!a) throw new Error('Action not found.'); const i = incidentFor(a.incidentId); incidentAccess(i, 'AUTOMATION_EXECUTE');
    if (i.status === 'RESOLVED') throw new Error('Incident is resolved; action cannot run.');
    if (command.operation === 'execute') {
      if (a.state !== 'APPROVED') throw new Error('Approve the current action first.');
      if (data.actions.filter(v => v.executedAt && v.executedAt > now - 900000 && incidentFor(v.incidentId).service === i.service).length >= 2) throw new Error('Service quota reached: two sandbox simulations per 15 minutes.');
      a.state = 'SUCCEEDED'; a.executedAt = now;
    } else { if (a.state !== 'PENDING_APPROVAL') throw new Error('This action already has a decision.'); a.state = command.operation === 'approve' ? 'APPROVED' : 'REJECTED'; a.decidedBy = actor.id; }
    timeline(i, `${actor.name}: sandbox action ${command.operation}. No external system changed.`); log(data, actor.name, `ACTION_${command.operation.toUpperCase()}`, `INC-${i.id}`);
  } else if (command.type === 'review') {
    const r = command.review; const i = incidentFor(r.incidentId); const old = data.reviews.find(v => v.incidentId === r.incidentId); if (!old || i.status !== 'RESOLVED') throw new Error('Resolve the incident before reviewing it.');
    if (old.status === 'DRAFT') { if (!can(actor, 'PIR_REVIEW') && !canRespond(actor, i, 'PIR_EDIT')) throw new Error('You cannot edit this review.'); if (!['DRAFT', 'IN_REVIEW'].includes(r.status)) throw new Error('Submit the draft for review first.'); }
    else { requirePermission(actor, 'PIR_REVIEW', i.teamId); const transitions: Record<string, string[]> = { IN_REVIEW: ['DRAFT', 'APPROVED'], APPROVED: ['APPROVED', 'COMPLETED'], COMPLETED: [] }; if (!transitions[old.status].includes(r.status)) throw new Error('Invalid review transition.'); if (old.status === 'APPROVED' && (r.summary !== old.summary || r.followup !== old.followup || r.ownerId !== old.ownerId)) throw new Error('Approved content is immutable.'); }
    if (!r.summary.trim() || !data.users.some(u => u.id === r.ownerId && u.enabled && u.teamId === actor.teamId)) throw new Error('Provide a summary and an active action owner.');
    if (r.status === 'COMPLETED' && r.followup.trim() && !r.completed) throw new Error('Complete the follow-up action before closing the review.');
    Object.assign(old, r); log(data, actor.name, `PIR_${r.status}`, `INC-${r.incidentId}`);
  } else if (command.type === 'read') { data.notices.filter(n => n.userId === actor.id && (!command.id || n.id === command.id)).forEach(n => { n.read = true; }); }
  return data;
}
export function dispatch(command: Command) { const user = currentUser(); if (!user) throw new Error('Your session has expired or access changed. Sign in again.'); persist(reduceCommand(snapshot, user.id, command)); }
export async function acceptInvitation(email: string, token: string, name: string, password: string) {
  if (!name.trim() || password.length < 8) throw new Error('Enter your name and a password with at least 8 characters.');
  const hash = await credential(password);
  const data = structuredClone(snapshot); const i = data.invitations.find(i => i.token === token.trim() && i.email === email.trim().toLowerCase());
  if (!i || i.status !== 'PENDING' || i.expiresAt <= Date.now() || data.users.some(u => u.email === i.email)) throw new Error('Invitation is invalid, expired, used or does not match this email.');
  const id = crypto.randomUUID(); data.users.push({ id, email: i.email, name: name.trim(), teamId: i.teamId, roles: [...i.roles], enabled: true, sessionVersion: 1, credential: hash, title: '', department: '', phone: '', location: '', timezone: 'Asia/Ho_Chi_Minh', avatar: '' }); i.status = 'ACCEPTED';
  log(data, name.trim(), 'INVITATION_ACCEPTED', i.email, i.roles.join(', ')); persist(data);
}
export async function changePassword(oldPassword: string, newPassword: string) {
  const user = currentUser(); if (!user || newPassword.length < 8) throw new Error('Use at least 8 characters for your new password.');
  if (user.credential ? await credential(oldPassword, user.credential.split(':')[0]) !== user.credential : oldPassword !== DEMO_PASSWORD) throw new Error('Current password is incorrect.');
  const hash = await credential(newPassword); const data = structuredClone(snapshot); const fresh = data.users.find(u => u.id === user.id);
  if (!fresh?.enabled || fresh.sessionVersion !== user.sessionVersion) throw new Error('Your access changed. Sign in again.');
  fresh.credential = hash; fresh.sessionVersion++; log(data, user.name, 'PASSWORD_CHANGED', user.id); persist(data); logout();
}
