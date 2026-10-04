import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { solutionKeys, solutions } from '../pages/solution-definitions';
import './products-menu.css';
import './solutions-menu.css';

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
        {solutionKeys.map(route => {
          const { title, description, icon: Icon, tone, problem, approach, capabilities } = solutions[route];
          return <details key={route} className="solution-card">
          <summary>
            <span className={`product-icon product-icon-${tone}`} aria-hidden="true"><Icon size={22} strokeWidth={1.65} /></span>
            <span className="solution-summary"><span className="solution-title">{title}</span><span className="solution-description">{description}</span></span>
            <ChevronDown className="solution-chevron" size={16} aria-hidden="true" />
          </summary>
          <div className="solution-detail">
            <h3>The challenge</h3><p>{problem}</p>
            <h3>How NexusOps helps</h3><p>{approach}</p>
            <h3>Related capabilities</h3><ul>{capabilities.map(capability => <li key={capability}>{capability}</li>)}</ul>
            <a className="solution-explore-link" href={`#solution-${route}`} onClick={() => setOpen(false)}>Explore this solution <ArrowRight size={14} aria-hidden="true" /></a>
          </div>
        </details>;
        })}
      </div>
      <p className="solutions-caption">Explore the workflows planned for the NexusOps MVP. The current workspace uses demo data.</p>
    </div>}
  </div>;
}
