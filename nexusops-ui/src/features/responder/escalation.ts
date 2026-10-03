export const escalationMembers = ['responder-demo', 'responder-quang', 'responder-mai'];
export interface EscalationRule { targets: string[]; timeoutMinutes: number; repeatCount: number; repeatMinutes: number }
export interface EscalationPolicy { service: string; name: string; description: string; version: number; backstop: string; rules: [EscalationRule, EscalationRule] }
export function createEscalationPolicies(): EscalationPolicy[] {
  return ['payments-api', 'order-worker', 'auth-service'].map(service => ({ service, name: `${service} response`, description: '', version: 1, backstop: 'responder-mai', rules: [
    { targets: ['responder-demo'], timeoutMinutes: 5, repeatCount: 1, repeatMinutes: 5 },
    { targets: ['responder-quang'], timeoutMinutes: 10, repeatCount: 0, repeatMinutes: 5 },
  ] }));
}
export function validatePolicy(policy: EscalationPolicy): string {
  if (!policy.name.trim() || policy.name.length > 80) return 'Enter a policy name of 1–80 characters.';
  if (!['payments-api', 'order-worker', 'auth-service'].includes(policy.service)) return 'Choose a service in your team.';
  if (!escalationMembers.includes(policy.backstop)) return 'Choose one backstop from your team.';
  if (policy.rules.length !== 2) return 'The MVP requires exactly two escalation levels.';
  for (const [index, rule] of policy.rules.entries()) {
    if (!rule.targets.length || new Set(rule.targets).size !== rule.targets.length || rule.targets.some(id => !escalationMembers.includes(id))) return `Level ${index + 1}: choose at least one unique team member.`;
    if (![rule.timeoutMinutes, rule.repeatMinutes].every(value => Number.isInteger(value) && value >= 1 && value <= 60)) return `Level ${index + 1}: timeout and reminder interval must be 1–60 minutes.`;
    if (!Number.isInteger(rule.repeatCount) || rule.repeatCount < 0 || rule.repeatCount > 5) return `Level ${index + 1}: choose 0–5 additional reminders.`;
  }
  return '';
}
export interface EscalationEvent { minute: number; level: 1 | 2 | 'backstop'; targets: string[]; label: string }
// First timeout precedes the first reminder; each reminder grants repeatMinutes to ACK.
export function escalationEvents(policy: EscalationPolicy): EscalationEvent[] {
  if (validatePolicy(policy)) return [];
  const events: EscalationEvent[] = [];
  let minute = 0;
  policy.rules.forEach((rule, index) => {
    const level = (index + 1) as 1 | 2;
    events.push({ minute, level, targets: [...rule.targets], label: `Notify level ${level}` });
    minute += rule.timeoutMinutes;
    for (let repeat = 0; repeat < rule.repeatCount; repeat++) {
      events.push({ minute, level, targets: [...rule.targets], label: `Level ${level} · reminder ${repeat + 1}/${rule.repeatCount}` });
      minute += rule.repeatMinutes;
    }
  });
  events.push({ minute, level: 'backstop', targets: [policy.backstop], label: 'Notify backstop once · escalation exhausted' });
  return events;
}
