import type { WorkspaceState } from './model';

export type SetupStep = 'profile' | 'notifications' | 'oncall' | 'escalation' | 'integration' | 'response';
export interface SetupPreferences {
  profileSaved: boolean;
  inboxEnabled: boolean;
  assignmentConfirmed: boolean;
  escalationConfirmed: boolean;
}
export const initialSetup: SetupPreferences = { profileSaved: false, inboxEnabled: false, assignmentConfirmed: false, escalationConfirmed: false };
export const setupSteps: { id: SetupStep; title: string; description: string }[] = [
  { id: 'profile', title: 'Complete your profile', description: 'Save your name, timezone and contact details. A photo is optional.' },
  { id: 'notifications', title: 'Receive a test notification', description: 'Enable the in-app test channel, send a test and mark it as read in Inbox.' },
  { id: 'oncall', title: 'Create your on-call schedule', description: 'Plan your hours and save a valid shift assigned to yourself in the weekly scheduler.' },
  { id: 'escalation', title: 'Review your escalation policy', description: 'Configure two levels and a backstop, simulate the saved policy, then confirm your review.' },
  { id: 'integration', title: 'Try a monitoring integration', description: 'Send a local test alert through the demo simulator.' },
  { id: 'response', title: 'Receive & respond to an incident', description: 'Acknowledge and resolve your onboarding incident with a resolution note.' },
];
export function setupCompletion(preferences: SetupPreferences, state: WorkspaceState): Record<SetupStep, boolean> {
  const incident = state.incidents.find(item => item.source === 'onboarding');
  return {
    profile: preferences.profileSaved,
    notifications: preferences.inboxEnabled && state.notifications.some(item => item.kind === 'setup-test' && item.read),
    oncall: preferences.assignmentConfirmed,
    escalation: preferences.escalationConfirmed,
    integration: !!incident,
    response: !!incident && incident.acknowledgedAt !== null && incident.status === 'RESOLVED',
  };
}
