import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, BookOpen, Route, ShieldCheck, Activity, BellRing, Sparkles, ClipboardCheck, BookMarked, PlayCircle, History, LifeBuoy } from 'lucide-react';
import './products-menu.css';
import './directory-menu.css';

const sections = [
  { title: 'Documentation', items: [
    { title: 'Product Documentation', description: 'Product workflows, shared platform capabilities and key concepts.', icon: BookOpen },
    { title: 'MVP Scope', description: 'The included workflows, roles and current MVP boundaries.', icon: Route },
    { title: 'Roles & Permissions', description: 'How workspace roles and incident-level access are intended to work.', icon: ShieldCheck },
    { title: 'API Reference', description: 'Event and management API contract. Draft documentation; no live API is connected.', icon: Activity, badge: 'Draft' },
  ] },
  { title: 'Guides', items: [
    { title: 'Incident Response', description: 'Read an incident, acknowledge ownership, add notes and resolve it.', icon: BellRing },
    { title: 'On-call Operations', description: 'Understand responder assignment, escalation levels and backstop.', icon: Route },
    { title: 'AI Investigation & Automation', description: 'Review evidence, proposed actions and approval steps.', icon: Sparkles },
    { title: 'Post-Incident Reviews', description: 'Learn about PIR, follow-up actions, MTTA and MTTR.', icon: ClipboardCheck },
  ] },
  { title: 'Resources', items: [
    { title: 'Incident Glossary', description: 'Definitions for Alert, Incident, ACK, Priority, Escalation and more.', icon: BookMarked },
    { title: 'Explore the Demo', description: 'Sign in to the sample Responder workspace and explore its workflows.', icon: PlayCircle },
    { title: 'Project Changelog', description: 'Follow prototype updates and completed interface milestones.', icon: History },
    { title: 'Help & Support', description: 'For this project demo, contact the workspace administrator for access.', icon: LifeBuoy },
  ] },
];

export function ResourcesMenu() {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false); };
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', keyboard);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', keyboard); };
  }, [open]);
  return <div ref={container} className="directory-disclosure" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button ref={trigger} type="button" className="products-trigger" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(value => !value)}>Resources <ChevronDown size={14} aria-hidden="true" /></button>
    {open && <div id={panelId} className="products-panel directory-panel resources-panel">
      <p className="products-eyebrow"><span aria-hidden="true" /> LEARN AND EXPLORE NEXUSOPS</p>
      <div className="resources-columns">{sections.map(section => <section className="resources-section" key={section.title} aria-labelledby={`${panelId}-${section.title}`}>
        <h2 id={`${panelId}-${section.title}`}>{section.title}</h2>
        <ul>{section.items.map(({ title, description, icon: Icon, badge }) => <li key={title}><details className="resource-item">
          <summary><Icon size={19} strokeWidth={1.7} aria-hidden="true" /><span>{title}{badge && <small>{badge}</small>}</span><ChevronDown className="directory-chevron" size={14} aria-hidden="true" /></summary>
          <p>{description}</p>
        </details></li>)}</ul>
      </section>)}</div>
      <p className="directory-caption">Resources describe the current project and MVP. API, support and operational services may be drafts or demo guidance.</p>
    </div>}
  </div>;
}
