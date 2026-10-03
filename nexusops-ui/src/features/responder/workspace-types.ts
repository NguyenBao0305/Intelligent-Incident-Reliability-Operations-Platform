export type WorkspaceView = 'incidents' | 'inbox' | 'services' | 'team' | 'ai' | 'automation' | 'profile' | 'setup' | 'schedule';
export const pageTitles: Record<WorkspaceView, string> = { incidents: 'Incident overview', inbox: 'Notification inbox', services: 'Service directory', team: 'People & teams', ai: 'AI investigation', automation: 'Automation center', profile: 'Your profile', setup: 'Account setup', schedule: 'On-call schedule' };
export interface Profile { name: string; timezone: string; title: string; department: string; phone: string; location: string; avatar: string }
