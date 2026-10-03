import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, ListFilter, Users, SearchCheck, BookOpenCheck } from 'lucide-react';
import './products-menu.css';
import './solutions-menu.css';

const solutions = [
  {
    title: 'Reduce Alert Noise',
    description: 'Turn repeated alerts into a clearer incident picture.',
    icon: ListFilter, tone: 'mint',
    problem: 'Repeated monitoring events can make it hard to see which incidents need attention.',
    approach: 'Deduplicate open alerts and group related alerts within the same service using configured rules and time windows.',
    capabilities: ['Monitoring Integrations', 'Incident Management'],
  },
  {
    title: 'Coordinate Incident Response',
    description: 'Keep ownership, escalation and response progress clear.',
    icon: Users, tone: 'sage',
    problem: 'An incident needs a clear owner and a shared record of what has been done.',
    approach: 'Assign responders, acknowledge incidents, escalate unanswered notifications and keep findings together in the timeline.',
    capabilities: ['Incident Management', 'On-call & Escalation'],
  },
  {
    title: 'Investigate & Act with Confidence',
    description: 'Review evidence and proposed actions before execution.',
    icon: SearchCheck, tone: 'teal',
    problem: 'Responders need evidence and context before deciding which action to take.',
    approach: 'Review facts, hypotheses and missing information. Assess proposed runbooks and required approvals before sandbox execution.',
    capabilities: ['AI Investigation & Automation', 'Policies & Permissions', 'Audit Trail'],
  },
  {
    title: 'Improve After Every Incident',
    description: 'Capture lessons and track response performance.',
    icon: BookOpenCheck, tone: 'blue',
    problem: 'Lessons from an incident are easy to lose once the immediate response is over.',
    approach: 'Review the incident timeline, capture follow-up actions in a PIR and track MTTA and MTTR with their sample counts.',
    capabilities: ['Post-Incident Review & Insights', 'Audit Trail'],
  },
];

export function SolutionsMenu() {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    }
    function keyboard(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', keyboard);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', keyboard);
    };
  }, [open]);

  return <div ref={container} className="solutions-disclosure" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button ref={trigger} type="button" className="products-trigger" aria-expanded={open}
      aria-controls={panelId} onClick={() => setOpen(value => !value)}>
      Solutions <ChevronDown size={14} aria-hidden="true" />
    </button>
    {open && <div id={panelId} className="products-panel solutions-panel">
      <p className="products-eyebrow"><span aria-hidden="true" /> SOLUTIONS FOR YOUR RESPONSE TEAM</p>
      <div className="solutions-grid">
        {solutions.map(({ title, description, icon: Icon, tone, problem, approach, capabilities }) => <details key={title} className="solution-card">
          <summary>
            <span className={`product-icon product-icon-${tone}`} aria-hidden="true"><Icon size={22} strokeWidth={1.65} /></span>
            <span className="solution-summary"><span className="solution-title">{title}</span><span className="solution-description">{description}</span></span>
            <ChevronDown className="solution-chevron" size={16} aria-hidden="true" />
          </summary>
          <div className="solution-detail">
            <h3>The challenge</h3><p>{problem}</p>
            <h3>How NexusOps helps</h3><p>{approach}</p>
            <h3>Related capabilities</h3><ul>{capabilities.map(capability => <li key={capability}>{capability}</li>)}</ul>
          </div>
        </details>)}
      </div>
      <p className="solutions-caption">Explore the workflows planned for the NexusOps MVP. The current workspace uses demo data.</p>
    </div>}
  </div>;
}
