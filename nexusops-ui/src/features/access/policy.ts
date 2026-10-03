export const roleLabels = { ACCOUNT_ADMIN: 'Account Admin', TEAM_MANAGER: 'Team Manager', RESPONDER: 'Responder', VIEWER: 'Viewer' } as const;
export type Role = keyof typeof roleLabels;
export const permissions = ['READ', 'PEOPLE_VIEW', 'USER_MANAGE', 'ROLE_ASSIGN', 'INVITATION_MANAGE', 'SERVICE_MANAGE', 'SCHEDULE_MANAGE', 'ESCALATION_MANAGE', 'INTEGRATION_MANAGE', 'INCIDENT_ACK', 'INCIDENT_RESOLVE', 'INCIDENT_NOTE', 'INCIDENT_ASSIGN', 'AI_RUN', 'AUTOMATION_EXECUTE', 'PIR_EDIT', 'PIR_REVIEW', 'AUDIT_VIEW'] as const;
export type Permission = typeof permissions[number];
export const rolePermissions: Record<Role, readonly Permission[]> = {
  ACCOUNT_ADMIN: permissions,
  TEAM_MANAGER: ['READ', 'PEOPLE_VIEW', 'SERVICE_MANAGE', 'SCHEDULE_MANAGE', 'ESCALATION_MANAGE', 'INTEGRATION_MANAGE', 'PIR_REVIEW', 'INCIDENT_ASSIGN'],
  RESPONDER: ['READ', 'PEOPLE_VIEW', 'INCIDENT_ACK', 'INCIDENT_RESOLVE', 'INCIDENT_NOTE', 'AI_RUN', 'AUTOMATION_EXECUTE', 'PIR_EDIT'],
  VIEWER: ['READ'],
};
export interface Identity { id: string; teamId: string; roles: Role[]; enabled: boolean }
export function can(user: Identity, permission: Permission, teamId = user.teamId) {
  return user.enabled && user.teamId === teamId && user.roles.some(role => rolePermissions[role]?.includes(permission));
}
export function assigned(user: Identity, incident: { assignedTo: string; commanderId?: string }) { return incident.assignedTo === user.id || incident.commanderId === user.id; }
export function canRespond(user: Identity, incident: { assignedTo: string; commanderId?: string; teamId: string }, permission: Permission) { return can(user, permission, incident.teamId) && assigned(user, incident); }
