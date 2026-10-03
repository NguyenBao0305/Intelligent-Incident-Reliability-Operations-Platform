import { useEffect, useId, useRef, useState } from 'react';
import { Activity, ArrowRight, BellRing, ChartNoAxesCombined, ChevronDown, Sparkles, Server, Cable, ShieldCheck, ClipboardList } from 'lucide-react';
import './products-menu.css';

const products = [
  {
    title: 'Incident Management',
    description: 'Turn alerts into coordinated incident response.',
    icon: Activity,
    tone: 'mint',
  },
  {
    title: 'On-call & Escalation',
    description: 'Notify the right responders and escalate when needed.',
    icon: BellRing,
    tone: 'sage',
  },
  {
    title: 'AI Investigation & Automation',
    description: 'Investigate with evidence and review proposed actions.',
    icon: Sparkles,
    tone: 'teal',
  },
  {
    title: 'Post-Incident Review & Insights',
    description: 'Learn from incidents and track response performance.',
    icon: ChartNoAxesCombined,
    tone: 'blue',
  },
];
const linkedRoutes: Record<string, string> = {
  'Incident Management': '#product-incident-management',
  'On-call & Escalation': '#product-on-call-escalation',
  'AI Investigation & Automation': '#product-ai-automation',
  'Post-Incident Review & Insights': '#product-post-incident-insights',
  'Service Catalog': '#platform-service-catalog',
  'Monitoring Integrations': '#platform-monitoring-integrations',
  'Policies & Permissions': '#platform-policies-permissions',
  'Audit Trail': '#platform-audit-trail',
};

const platform = [
  { title: 'Service Catalog', description: 'See service ownership, criticality and dependencies.', icon: Server, tone: 'mint' },
  { title: 'Monitoring Integrations', description: 'Bring alerts into NexusOps from monitoring tools.', icon: Cable, tone: 'teal' },
  { title: 'Policies & Permissions', description: 'Define escalation paths and role-based access.', icon: ShieldCheck, tone: 'sage' },
  { title: 'Audit Trail', description: 'Keep a clear history of incident and approval actions.', icon: ClipboardList, tone: 'blue' },
];

export function ProductsMenu() {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    }
    function dismissWithKeyboard(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('keydown', dismissWithKeyboard);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      document.removeEventListener('keydown', dismissWithKeyboard);
    };
  }, [open]);

  return (
    <div ref={container} className="products-disclosure" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button ref={trigger} type="button" className="products-trigger" aria-expanded={open}
        aria-controls={panelId} onClick={() => setOpen(previous => !previous)}>
        Products <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <div id={panelId} className="products-panel">
          <p className="products-eyebrow"><span aria-hidden="true" /> EXPLORE NEXUSOPS</p>
          <div className="products-columns">
            <section className="products-group" aria-labelledby={`${panelId}-product-title`}>
              <h2 id={`${panelId}-product-title`} className="products-group-title">Product</h2>
              <ul className="products-grid" aria-label="NexusOps products">
                {products.map(({ title, description, icon: Icon, tone }) => (
                  <li key={title} className={`product-summary${linkedRoutes[title] ? ' product-summary-linked' : ''}`}>
                    {linkedRoutes[title] ? <a className="product-summary-link" href={linkedRoutes[title]} onClick={() => setOpen(false)}>
                      <span className={`product-icon product-icon-${tone}`} aria-hidden="true"><Icon size={22} strokeWidth={1.65} /></span>
                      <div><span className="product-title-link">{title}<ArrowRight size={15} aria-hidden="true" /></span><p>{description}</p></div>
                    </a> : <>
                      <span className={`product-icon product-icon-${tone}`} aria-hidden="true"><Icon size={22} strokeWidth={1.65} /></span>
                      <div><h3>{title}</h3><p>{description}</p></div>
                    </>}
                  </li>
                ))}
              </ul>
            </section>
            <section className="products-group" aria-labelledby={`${panelId}-platform-title`}>
              <h2 id={`${panelId}-platform-title`} className="products-group-title">Platform</h2>
              <ul className="products-grid" aria-label="NexusOps platform capabilities">
                {platform.map(({ title, description, icon: Icon, tone }) => (
                  <li key={title} className="product-summary product-summary-linked">
                    <a className="product-summary-link" href={linkedRoutes[title]} onClick={() => setOpen(false)}>
                      <span className={`product-icon product-icon-${tone}`} aria-hidden="true"><Icon size={22} strokeWidth={1.65} /></span>
                      <div><span className="product-title-link">{title}<ArrowRight size={15} aria-hidden="true" /></span><p>{description}</p></div>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
