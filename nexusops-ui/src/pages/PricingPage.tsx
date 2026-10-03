import { ArrowRight, Check, ShieldCheck, Sparkles, Users, Activity, Server, KeyRound } from 'lucide-react';
import { ProductsMenu } from '../components/ProductsMenu';
import { SolutionsMenu } from '../components/SolutionsMenu';
import { ResourcesMenu } from '../components/ResourcesMenu';
import './pricing.css';

const features = [
  { icon: Activity, title: 'Incident response workspace', text: 'Filter incidents, acknowledge ownership, add notes and resolve with a recorded reason.' },
  { icon: Server, title: 'Services & team context', text: 'Explore service ownership, dependencies and static on-call assignments.' },
  { icon: Sparkles, title: 'AI & automation previews', text: 'Review sample evidence reports, proposed actions and simulated approval flows.' },
  { icon: KeyRound, title: 'Your personal workspace', text: 'Read incident notifications and update your profile and avatar.' },
];
const roles = [
  { name: 'Responder', tag: 'Available in the demo', text: 'Work on incidents assigned to you: acknowledge, resolve, add notes, request AI investigation and review automation actions.', scope: 'Other visible team incidents are read-only in the demo.' },
  { name: 'Team Manager', text: 'Manage service configuration with the service-management permission defined in the MVP.', scope: 'This role does not automatically receive Responder actions.' },
  { name: 'Account Admin', text: 'Receive all permissions currently defined in the MVP, including service management, incident response, AI, automation and audit access.', scope: 'Actions still require the appropriate incident scope and state.' },
  { name: 'Viewer', text: 'A role intended for viewing information. Its detailed read permissions will be defined when backend authorization is implemented.', scope: 'A dedicated Viewer experience is not available yet.' },
];

export function PricingPage() {
  return <div className="pricing-page">
    <header className="landing-header pricing-header">
      <a className="pricing-brand" href="#" aria-label="NexusOps home">Nexus<span>Ops</span></a>
      <nav className="landing-nav pricing-nav" aria-label="Main navigation"><ProductsMenu /><SolutionsMenu /><a href="#customers">Customer</a><ResourcesMenu /><a href="#pricing" aria-current="page">Pricing</a></nav>
      <div className="landing-account pricing-account"><a href="#login">Log in</a><a className="pricing-button pricing-button-small" href="#login">Try the demo <ArrowRight size={14} /></a></div>
    </header>

    <main className="pricing-main">
      <section className="pricing-intro" aria-labelledby="pricing-title">
        <span className="pricing-eyebrow"><span /> SIMPLE, FREE ACCESS</span>
        <h1 id="pricing-title">A clearer response.<br /><em>A free place to start.</em></h1>
        <p>Get to know NexusOps with one free plan.<br />Explore how your team can manage incidents, investigate and respond together.</p>
      </section>

      <section className="pricing-plan" aria-labelledby="free-plan-title">
        <div className="pricing-plan-summary">
          <span className="pricing-plan-badge"><Sparkles size={14} /> CURRENT OFFERING</span>
          <h2 id="free-plan-title">Free</h2>
          <p className="pricing-plan-description">A workspace to explore your incident response workflow.</p>
          <div className="pricing-price">$0<span>Free access</span></div>
          <a className="pricing-button" href="#login">Explore free demo <ArrowRight size={18} /></a>
          <p className="pricing-no-card">No payment details required.</p>
          <p className="pricing-invitation">Have an invitation? <a href="#signup">Join your team</a></p>
        </div>
        <div className="pricing-plan-includes">
          <span className="pricing-eyebrow">WHAT YOU CAN EXPLORE</span>
          <h3>One workspace. A connected response.</h3>
          <p className="pricing-plan-scope"><Users size={17} /> One organization · One team · Responder demo</p>
          <ul className="pricing-feature-list">{features.map(({ icon: Icon, title, text }) => <li key={title}><span className="pricing-feature-icon"><Icon size={20} /></span><div><h4>{title}</h4><p>{text}</p></div><Check className="pricing-check" size={17} /></li>)}</ul>
          <p className="pricing-demo-note"><ShieldCheck size={16} /><span>The current version uses sample data. AI investigation and automation are simulated; changes reset when you leave or reload the workspace.</span></p>
        </div>
      </section>

      <section className="pricing-access" aria-labelledby="pricing-access-title">
        <div className="pricing-section-heading"><span className="pricing-eyebrow">ACCESS & RESPONSIBILITIES</span><h2 id="pricing-access-title">Your role defines what you can do.</h2><p>Free access follows the workspace’s role and incident permissions. Your organization assigns your role.</p></div>
        <div className="pricing-role-grid">{roles.map(role => <article className={`pricing-role ${role.tag ? 'pricing-role-featured' : ''}`} key={role.name}><div className="pricing-role-heading"><h3>{role.name}</h3>{role.tag && <span>{role.tag}</span>}</div><p>{role.text}</p><p className="pricing-role-scope"><ShieldCheck size={15} />{role.scope}</p></article>)}</div>
        <p className="pricing-role-note">This describes the MVP access model. The current demo provides a Responder account; backend authentication and the other role experiences are not connected yet. Incident Commander is an assignment on a specific incident, with access checked for that incident.</p>
      </section>
    </main>
    <footer className="pricing-footer"><a className="pricing-brand" href="#">Nexus<span>Ops</span></a><span>Incident & Reliability Operations</span><a href="#">Back to home <ArrowRight size={14} /></a></footer>
  </div>;
}
