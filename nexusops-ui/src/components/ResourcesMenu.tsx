import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { resourceDirectory, resourceGroups } from '../pages/resource-directory';
import './products-menu.css';
import './directory-menu.css';

const sections = resourceGroups.map(title => ({ title, items: resourceDirectory.filter(item => item.group === title) }));

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
        <ul>{section.items.map(({ key, title, description, icon: Icon, badge }) => <li key={title}><details className="resource-item">
          <summary><Icon size={19} strokeWidth={1.7} aria-hidden="true" /><span>{title}{badge && <small>{badge}</small>}</span><ChevronDown className="directory-chevron" size={14} aria-hidden="true" /></summary>
          <p>{description}</p><a className="resource-open-link" aria-label={`Read ${title}`} href={`#resource-${key}`} onClick={() => setOpen(false)}>Read {key === 'api-reference' ? 'draft reference' : 'the article'} <ArrowRight size={14} aria-hidden="true"/></a>
        </details></li>)}</ul>
      </section>)}</div>
      <p className="directory-caption">Resources describe the current project and MVP. API, support and operational services may be drafts or demo guidance.</p>
    </div>}
  </div>;
}
