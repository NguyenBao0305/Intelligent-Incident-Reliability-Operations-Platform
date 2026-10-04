import { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Copy, Search, X } from 'lucide-react';
import { ProductsMenu } from '../components/ProductsMenu';
import { SolutionsMenu } from '../components/SolutionsMenu';
import { ResourcesMenu } from '../components/ResourcesMenu';
import { glossary, helpQuestions, resourceArticles, supportReportTemplate, type ResourceArticle } from './resource-content';
import { resourceGroups } from './resource-directory';
import './resource-page.css';

function CodeExample({ code }: { code: string }) {
  const [message, setMessage] = useState('');
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setMessage('Copied'); }
    catch { setMessage('Copy unavailable. Select the example text to copy it.'); }
  };
  return <div className="rd-code"><div><span>JSON · illustrative payload</span><button onClick={copy}><Copy size={14}/>Copy example</button></div><pre><code>{code}</code></pre><span role="status">{message}</span></div>;
}

function SupportReportTemplate() {
  const [message, setMessage] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(supportReportTemplate);
      setMessage('Template copied. Fill it in before sharing.');
    } catch {
      setMessage('Clipboard unavailable. Select the template and copy it manually.');
    }
  };
  return <div className="rd-support-template">
    <div className="rd-support-template-head"><div><strong>Issue report template</strong><p>Copy this checklist and fill in only the details needed to reproduce the issue.</p></div><button onClick={copy}><Copy size={14}/>Copy template</button></div>
    <label className="rd-sr-only" htmlFor="rd-support-template">Issue report template</label>
    <textarea id="rd-support-template" readOnly rows={9} value={supportReportTemplate}/>
    <p className="rd-support-status" role="status">{message || 'No ticket or email is sent from this page.'}</p>
  </div>;
}

function Glossary() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');
  const visible = glossary.filter(([term, category, definition]) => (topic === 'All' || category === topic) && `${term} ${definition}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="rd-glossary"><label className="rd-search"><Search size={17}/><input aria-label="Search glossary" placeholder="Find a term, e.g. ACK or snapshot" value={query} onChange={e => setQuery(e.target.value)}/></label><div className="rd-topics" role="group" aria-label="Glossary topics">{['All', 'Signals', 'Response', 'Automation', 'Learning'].map(t => <button key={t} aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>)}</div><p className="rd-result-count" role="status">{visible.length} terms</p><dl>{visible.map(([term, category, definition]) => <div key={term}><dt>{term}<small>{category}</small></dt><dd>{definition}</dd></div>)}</dl>{!visible.length && <div className="rd-empty"><BookOpen size={26}/><p>No matching terms. Try another word or topic.</p><button onClick={() => { setQuery(''); setTopic('All'); }}>Clear filters</button></div>}</div>;
}

export function ResourcePage({ articleKey }: { articleKey: string }) {
  const article = resourceArticles.find(item => item.key === articleKey)!;
  const [query, setQuery] = useState('');
  const [browseOpen, setBrowseOpen] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 801px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 801px)');
    const update = () => setBrowseOpen(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const Icon = article.icon;
  const index = resourceArticles.findIndex(item => item.key === article.key);
  const adjacent = [resourceArticles[index - 1], resourceArticles[index + 1]].filter((item): item is ResourceArticle => Boolean(item));
  const results = resourceArticles.filter(item => `${item.title} ${item.description} ${JSON.stringify(item.sections)} ${item.key === 'incident-glossary' ? JSON.stringify(glossary) : ''} ${item.key === 'help-support' ? JSON.stringify(helpQuestions) : ''}`.toLowerCase().includes(query.trim().toLowerCase()));
  const goTo = (id: string) => {
    const element = document.getElementById(`rd-${id}`);
    element?.focus({ preventScroll: true });
    element?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };
  return <div className="rd-page">
    <a className="rd-skip" href="#rd-content" onClick={e => { e.preventDefault(); goTo('content'); }}>Skip to content</a>
    <header className="rd-header">
      <a href="#" className="rd-brand" aria-label="NexusOps home">Nexus<span>Ops</span></a>
      <nav aria-label="Main navigation"><ProductsMenu/><SolutionsMenu/><a href="#customers">Customer</a><ResourcesMenu/><a href="#pricing">Pricing</a></nav>
      <div className="rd-account"><a href="#login">Log in</a><a className="rd-button" href="#signup">Join your team</a></div>
    </header>
    <div className="rd-shell">
      <aside className="rd-sidebar" aria-label="Resource library">
        <a className="rd-library-label" href="#resource-product-documentation"><BookOpen size={19}/>NexusOps library</a>
        <label className="rd-search"><Search size={16}/><input aria-label="Search resources" placeholder="Search resources…" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label="Clear resource search" onClick={() => setQuery('')}><X size={15}/></button>}</label>
        {query.trim() ? <div className="rd-search-results"><p role="status">{results.length} matching articles</p>{results.map(item => <a href={`#resource-${item.key}`} key={item.key} onClick={() => setQuery('')}><span>{item.title}</span><small>{item.group}</small></a>)}{!results.length && <p>Try a term such as invitation, ACK or schedule.</p>}</div> : <details className="rd-browse" open={browseOpen} onToggle={event => setBrowseOpen(event.currentTarget.open)}><summary>Browse resources</summary><nav aria-label="Documentation sections">{resourceGroups.map(group => <div key={group}><h2>{group}</h2>{resourceArticles.filter(item => item.group === group).map(item => <a href={`#resource-${item.key}`} key={item.key} aria-current={item.key === article.key ? 'page' : undefined}><item.icon size={16}/><span>{item.title}</span>{item.badge && <small>{item.badge}</small>}</a>)}</div>)}</nav></details>}
        <div className="rd-sidebar-note"><span className="rd-status-dot"/>Current project documentation<p>One team. Shared context.<br/>Clear response ownership.</p></div>
      </aside>
      <main id="rd-content" tabIndex={-1} className="rd-main">
        <nav className="rd-breadcrumb" aria-label="Breadcrumb"><a href="#">NexusOps</a><ChevronRight size={12}/><a href="#resource-product-documentation">Resources</a><ChevronRight size={12}/><span>{article.title}</span></nav>
        <section className="rd-hero" aria-labelledby="rd-title"><div><span className="rd-eyebrow"><Icon size={15}/>{article.group}{article.badge && <b>{article.badge}</b>}</span><h1 id="rd-title">{article.title}</h1><p>{article.description}</p><div className="rd-metadata"><span>{article.audience}</span><span>Scope baseline · MVP v3 · 25 Sep 2026</span></div><button className="rd-start" onClick={() => goTo(article.sections[0].id)}>Start reading <ArrowDown size={15}/></button></div><div className="rd-illustration" role="img" aria-label={`Conceptual flow: ${article.flow.join(' → ')}`}><div className="rd-orbit"/><div className="rd-book"><div className="rd-book-icon"><Icon size={32} strokeWidth={1.4}/></div><span>NEXUSOPS / FIELD NOTES</span><b>{article.title}</b><i/><i/><i/></div><div className="rd-book-tab"><Check size={13}/>MVP-aligned</div></div></section>
        <ol className="rd-flow" aria-label="Conceptual workflow">{article.flow.map((step, i) => <li key={step}><span>0{i + 1}</span><strong>{step}</strong>{i < article.flow.length - 1 && <ArrowRight size={15}/>}</li>)}</ol>
        <div className="rd-reading-layout"><article className="rd-article">{article.sections.map(section => <section key={section.id} className="rd-section" aria-labelledby={`rd-${section.id}`}><h2 id={`rd-${section.id}`} tabIndex={-1}>{section.title}</h2>{section.paragraphs?.map(text => <p key={text}>{text}</p>)}{section.code && <CodeExample code={section.code}/>} {section.table && <><p className="rd-table-hint">Swipe or scroll horizontally to see every column.</p><div className="rd-table-wrap" tabIndex={0} role="region" aria-label={`${section.title} table`}><table><thead><tr>{section.table.headings.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{section.table.rows.map((row, rowIndex) => <tr key={row[0]}>{row.map((cell, i) => { const cellLink = section.table?.cellLinks?.find(item => item.row === rowIndex && item.column === i); return i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cellLink ? <a href={cellLink.href}>{cellLink.label}</a> : cell}</td>; })}</tr>)}</tbody></table></div></>}{section.steps && <ol className="rd-steps">{section.steps.map((step, i) => <li key={step}><span>{i + 1}</span><p>{step}</p></li>)}</ol>}{section.bullets && <ul className="rd-bullets">{section.bullets.map(text => <li key={text}>{text}</li>)}</ul>}{section.note && <aside className="rd-callout"><BookOpen size={18}/><div><strong>Keep in mind</strong><p>{section.note}</p></div></aside>}{article.key === 'incident-glossary' && section.id === 'terms' && <Glossary/>}{article.key === 'help-support' && section.id === 'faq' && <div className="rd-faq">{helpQuestions.map(([question, answer]) => <details key={question}><summary>{question}<ChevronRight size={16}/></summary><p>{answer}</p></details>)}</div>}{article.key === 'help-support' && section.id === 'report' && <SupportReportTemplate/>}{section.links && <div className="rd-related">{section.links.map(l => <a key={l.href} href={l.href}>{l.label}<ArrowRight size={15}/></a>)}</div>}</section>)}
          <div className="rd-source-note"><strong>Documentation basis</strong><p>Scope baseline: NexusOps MVP v3 (25 Sep 2026). Content is cross-checked against the current project README and workspace implementation. Guides describe local prototype behavior; planned backend contracts are labeled separately.</p></div>
          <nav className="rd-adjacent" aria-label="Continue reading">{adjacent.map(item => <a href={`#resource-${item.key}`} key={item.key}><small>{resourceArticles.indexOf(item) < index ? <><ArrowLeft size={13}/>Previous</> : <>Next<ArrowRight size={13}/></>}</small><span>{item.title}</span></a>)}</nav>
        </article><aside className="rd-toc"><nav aria-label="On this page"><h2>On this page</h2>{article.sections.map(s => <button key={s.id} onClick={() => goTo(s.id)}>{s.title}</button>)}</nav><div><Icon size={22}/><strong>Try it in context</strong><p>Explore role-specific workflows with local sample data.</p><a href="#login">Open the demo <ArrowRight size={14}/></a></div></aside></div>
        <footer className="rd-footer"><span>NexusOps · Learn, respond, improve.</span><a href="#resource-help-support">Help & Support</a><a href="#resource-project-changelog">Project Changelog</a></footer>
      </main>
    </div>
  </div>;
}
