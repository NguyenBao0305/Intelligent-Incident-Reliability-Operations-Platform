import { useEffect, useId, useRef, useState } from 'react';
import { Activity, BellRing, ChartNoAxesCombined, ChevronDown, Sparkles } from 'lucide-react';
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
    title: 'Post-Incident & Insights',
    description: 'Learn from incidents and track response performance.',
    icon: ChartNoAxesCombined,
    tone: 'blue',
  },
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
          <ul className="products-grid" aria-label="NexusOps products">
            {products.map(({ title, description, icon: Icon, tone }) => (
              <li key={title} className="product-summary">
                <span className={`product-icon product-icon-${tone}`} aria-hidden="true"><Icon size={22} strokeWidth={1.65} /></span>
                <div>
                  <h2>{title}</h2>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
