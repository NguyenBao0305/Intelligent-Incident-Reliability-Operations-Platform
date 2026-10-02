export type WorkspaceView = 'incidents' | 'inbox' | 'services' | 'team' | 'ai' | 'automation' | 'profile';
export const pageTitles: Record<WorkspaceView, string> = { incidents: 'Incident overview', inbox: 'Notification inbox', services: 'Service directory', team: 'Your team', ai: 'AI investigation', automation: 'Automation center', profile: 'Your profile' };
export interface Profile { name: string; timezone: string; title: string; department: string; phone: string; location: string; avatar: string }
