export type IncidentStatus = 'TRIGGERED' | 'ACKNOWLEDGED' | 'RESOLVED';
export type Priority = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
export interface TimelineEntry { id: string; at: number; text: string; kind: 'system' | 'ack' | 'resolve' | 'note' }
export interface Incident {
  source?: 'onboarding';
  id: number;
  title: string;
  service: string;
  priority: Priority;
  status: IncidentStatus;
  assignedTo: string;
  assignedName: string;
  createdAt: number;
  acknowledgedAt: number | null;
  resolvedAt: number | null;
  escalationLevel: 1 | 2 | null;
  alerts: { id: string; summary: string; status: 'OPEN' | 'RESOLVED' }[];
  timeline: TimelineEntry[];
}
export interface Notification { id: number; incidentId: number | null; title: string; description: string; at: number; read: boolean; kind?: 'setup-test' }
export interface WorkspaceState { incidents: Incident[]; notifications: Notification[] }
export const RESPONDER_ID = 'responder-demo';

export function createDemoWorkspace(now = Date.now()): WorkspaceState {
  const samples: { id: number; title: string; service: string; priority: Priority; status: IncidentStatus; minutes: number; summaries: string[]; assignedTo?: string; assignedName?: string }[] = [
    { id: 1048, title: 'Payment API error rate above threshold', service: 'payments-api', priority: 'P1', status: 'TRIGGERED', minutes: 4, summaries: ['HTTP 5xx rate above 5% for 3 minutes', 'Payment request latency p95 above 2 seconds'] },
    { id: 1047, title: 'Worker queue processing delayed', service: 'order-worker', priority: 'P2', status: 'TRIGGERED', minutes: 12, summaries: ['Oldest queued job exceeds 120 seconds'] },
    { id: 1046, title: 'Database connection pool near capacity', service: 'payments-api', priority: 'P2', status: 'ACKNOWLEDGED', minutes: 26, summaries: ['Connection pool utilization above 85%'] },
    { id: 1045, title: 'Elevated authentication latency', service: 'auth-service', priority: 'P3', status: 'ACKNOWLEDGED', minutes: 42, summaries: ['Login request latency p95 above 800 ms'] },
    { id: 1044, title: 'Order retry volume increased', service: 'order-worker', priority: 'P3', status: 'TRIGGERED', minutes: 56, summaries: ['Retry count above configured baseline'] },
    { id: 1043, title: 'Intermittent token validation failures', service: 'auth-service', priority: 'P2', status: 'RESOLVED', minutes: 95, summaries: ['Token validation error rate above 2%'] },
    { id: 1042, title: 'Payment authorization retries elevated', service: 'payments-api', priority: 'P1', status: 'TRIGGERED', minutes: 8, summaries: ['Authorization retry rate above 3%'], assignedTo: 'responder-quang', assignedName: 'Quang Tran' },
    { id: 1041, title: 'Order queue backlog growing', service: 'order-worker', priority: 'P2', status: 'ACKNOWLEDGED', minutes: 31, summaries: ['Queue depth above team threshold'], assignedTo: 'responder-quang', assignedName: 'Quang Tran' },
    { id: 1040, title: 'Authentication token refresh recovered', service: 'auth-service', priority: 'P3', status: 'RESOLVED', minutes: 130, summaries: ['Token refresh errors returned to baseline'], assignedTo: 'responder-mai', assignedName: 'Mai Pham' },
  ];
  const incidents: Incident[] = samples.map(sample => {
    const createdAt = now - sample.minutes * 60_000;
    const acknowledgedAt = sample.status === 'TRIGGERED' ? null : createdAt + 120_000;
    const resolvedAt = sample.status === 'RESOLVED' ? createdAt + 1_200_000 : null;
    const assignedName = sample.assignedName ?? 'Linh Nguyen';
    const timeline: TimelineEntry[] = [{ id: `${sample.id}-created`, at: createdAt, text: `Incident created from the monitoring simulator. Assigned to ${assignedName}.`, kind: 'system' }];
    if (acknowledgedAt) timeline.push({ id: `${sample.id}-ack`, at: acknowledgedAt, text: `${assignedName} acknowledged the incident. Escalation stopped.`, kind: 'ack' });
    if (resolvedAt) timeline.push({ id: `${sample.id}-resolved`, at: resolvedAt, text: `${assignedName} resolved the incident: monitoring returned to baseline.`, kind: 'resolve' });
    return {
      id: sample.id, title: sample.title, service: sample.service, priority: sample.priority,
      status: sample.status, assignedTo: sample.assignedTo ?? RESPONDER_ID, assignedName, createdAt, acknowledgedAt, resolvedAt,
      escalationLevel: sample.status === 'TRIGGERED' ? (sample.id === 1044 ? 2 : 1) : null,
      alerts: sample.summaries.map((summary, index) => ({ id: `ALT-${sample.id}-${index + 1}`, summary, status: sample.status === 'RESOLVED' ? 'RESOLVED' : 'OPEN' })), timeline,
    };
  });
  return {
    incidents,
    notifications: [
      { id: 1, incidentId: 1048, title: 'You have a new P1 incident', description: 'payments-api needs your acknowledgement.', at: incidents[0].createdAt, read: false },
      { id: 2, incidentId: 1047, title: 'Order worker incident assigned to you', description: 'Review the alert and acknowledge when you take ownership.', at: incidents[1].createdAt, read: false },
      { id: 3, incidentId: 1044, title: 'Escalation reached level 2', description: 'Order retry volume increased. Your assignment remains active.', at: now - 15 * 60_000, read: false },
      { id: 4, incidentId: 1046, title: 'Acknowledgement recorded', description: 'Database connection pool incident is being investigated.', at: incidents[2].acknowledgedAt!, read: true },
    ],
  };
}

export type WorkspaceAction =
  | { type: 'testNotification'; at: number }
  | { type: 'testAlert'; service: string; summary: string; priority: Priority; name: string; at: number }
  | { type: 'ack'; ids: number[]; at: number }
  | { type: 'resolve'; id: number; reason: string; at: number }
  | { type: 'note'; id: number; content: string; at: number; entryId: string }
  | { type: 'read'; id: number }
  | { type: 'readAll' }
  | { type: 'reset'; at: number };

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  if (action.type === 'reset') return createDemoWorkspace(action.at);
  if (action.type === 'testNotification') {
    return { ...state, notifications: [{ id: Math.max(0, ...state.notifications.map(item => item.id)) + 1, incidentId: null, kind: 'setup-test', title: 'Your setup test notification', description: 'Your in-app inbox received this local test. Mark it as read to confirm receipt. No email or SMS was sent.', at: action.at, read: false }, ...state.notifications] };
  }
  if (action.type === 'testAlert') {
    if (state.incidents.some(item => item.source === 'onboarding') || !['payments-api', 'order-worker', 'auth-service'].includes(action.service) || !action.summary.trim() || !['P1', 'P2', 'P3', 'P4', 'P5'].includes(action.priority)) return state;
    const id = Math.max(0, ...state.incidents.map(item => item.id)) + 1;
    const incident: Incident = { id, source: 'onboarding', title: action.summary.trim(), service: action.service, priority: action.priority, status: 'TRIGGERED', assignedTo: RESPONDER_ID, assignedName: action.name, createdAt: action.at, acknowledgedAt: null, resolvedAt: null, escalationLevel: 1, alerts: [{ id: `ALT-${id}-TEST`, summary: action.summary.trim(), status: 'OPEN' }], timeline: [{ id: `${id}-created`, at: action.at, kind: 'system', text: `Onboarding simulator created this incident and assigned it to ${action.name}. No external monitoring system was contacted.` }] };
    return { ...state, incidents: [incident, ...state.incidents], notifications: [{ id: Math.max(0, ...state.notifications.map(item => item.id)) + 1, incidentId: id, title: 'Your onboarding incident is ready', description: `${action.service}: review, acknowledge and resolve this test incident.`, at: action.at, read: false }, ...state.notifications] };
  }
  if (action.type === 'read' || action.type === 'readAll') return {
    ...state, notifications: state.notifications.map(item => action.type === 'readAll' || item.id === action.id ? { ...item, read: true } : item),
  };
  return { ...state, incidents: state.incidents.map(incident => {
    if (incident.assignedTo !== RESPONDER_ID) return incident;
    if (action.type === 'ack') {
      if (!action.ids.includes(incident.id) || incident.status !== 'TRIGGERED') return incident;
      return { ...incident, status: 'ACKNOWLEDGED', acknowledgedAt: action.at, escalationLevel: null,
        timeline: [...incident.timeline, { id: `${incident.id}-ack-${action.at}`, at: action.at, kind: 'ack', text: `${incident.assignedName} acknowledged the incident. Escalation stopped.` }] };
    }
    if (incident.id !== action.id) return incident;
    if (action.type === 'resolve') {
      if (incident.status !== 'ACKNOWLEDGED' || !action.reason.trim()) return incident;
      return { ...incident, status: 'RESOLVED', resolvedAt: action.at, escalationLevel: null,
        alerts: incident.alerts.map(alert => ({ ...alert, status: 'RESOLVED' })),
        timeline: [...incident.timeline, { id: `${incident.id}-resolve-${action.at}`, at: action.at, kind: 'resolve', text: `${incident.assignedName} resolved the incident: ${action.reason.trim()}` }] };
    }
    if (!action.content.trim()) return incident;
    return { ...incident, timeline: [...incident.timeline, { id: action.entryId, at: action.at, kind: 'note', text: action.content.trim() }] };
  }) };
}

export const statusLabels: Record<IncidentStatus, string> = { TRIGGERED: 'Triggered', ACKNOWLEDGED: 'Acknowledged', RESOLVED: 'Resolved' };
export function relativeTime(timestamp: number, now: number) {
  const minutes = Math.max(0, Math.floor((now - timestamp) / 60_000));
  if (minutes === 0) return 'Just now';
  return minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
}
