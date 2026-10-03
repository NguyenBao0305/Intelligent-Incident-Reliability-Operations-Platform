import { useEffect, useState } from 'react';
import { AuthPage } from './pages/AuthPage';
import { Workspace } from './features/access/Workspace';
import { currentUser, useData, logout } from './features/access/store';
import { ProductsMenu } from './components/ProductsMenu';
import { SolutionsMenu } from './components/SolutionsMenu';
import { ResourcesMenu } from './components/ResourcesMenu';
import { PricingPage } from './pages/PricingPage';
import { IncidentManagementPage } from './pages/IncidentManagementPage';
import { OnCallEscalationPage } from './pages/OnCallEscalationPage';
import { AIInvestigationAutomationPage } from './pages/AIInvestigationAutomationPage';
import { PostIncidentInsightsPage } from './pages/PostIncidentInsightsPage';
import { PlatformCapabilityPage, type PlatformCapabilityKey } from './pages/PlatformCapabilityPage';
import { CustomerPage } from './pages/CustomerPage';
import './motion.css';
import { LandingStory } from './components/LandingStory';
import {
  Search, 
  ArrowRight, 
  X, 
  Sparkles
} from 'lucide-react';

const platformCapabilityTitles: Record<PlatformCapabilityKey, string> = {
  'service-catalog': 'Service Catalog',
  'monitoring-integrations': 'Monitoring Integrations',
  'policies-permissions': 'Policies & Permissions',
  'audit-trail': 'Audit Trail',
};
const platformCapabilityKeys = Object.keys(platformCapabilityTitles) as PlatformCapabilityKey[];

function LandingPage({ onStart }: { onStart: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [showTopBanner, setShowTopBanner] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onStart(email);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      {showTopBanner && (
        <div className="bg-[#042f27] text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-3 relative z-30 transition border-b border-emerald-900/40">
          <span className="text-emerald-200/90 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Anticipate and overcome major outages
          </span>
          <button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-3 py-0.5 rounded-full font-semibold text-xs transition cursor-pointer">
            Learn How
          </button>
          <button 
            onClick={() => setShowTopBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-300/60 hover:text-white cursor-pointer"
            aria-label="Close banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. MAIN HEADER / NAVIGATION */}
      <header className="landing-header w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-20 sticky top-0">
        {/* Left: NexusOps Logo - Nghệ thuật & Tinh tế */}
        <div className="landing-brand">
          <a href="#" className="group flex items-center transition cursor-pointer">
            <span className="font-['Outfit'] text-[27px] sm:text-[29px] font-semibold tracking-[-0.045em] text-slate-900 group-hover:text-emerald-700 transition">
              Nexus<span className="font-light text-emerald-600">Ops</span>
            </span>
          </a>
        </div>

          {/* Navigation Links */}
          <nav aria-label="Main navigation" className="landing-nav flex items-center gap-8 text-[15px] font-medium text-slate-600">
            <ProductsMenu />
            <SolutionsMenu />
            <div className="hidden lg:flex items-center gap-8">
              <a href="#customers" className="hover:text-emerald-700 transition">Customer</a>
              <ResourcesMenu />
            </div>
            <a href="#pricing" className="hover:text-emerald-700 transition">
              Pricing
            </a>
          </nav>

        {/* Right: Contact Us, Login, Sign Up */}
        <div className="landing-account flex items-center gap-5 sm:gap-6 text-[15px]">
          <button className="hidden sm:flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 font-medium transition cursor-pointer">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Contact Us</span>
          </button>
          <a href="#login" className="text-slate-700 hover:text-emerald-700 font-semibold transition">
            Log in
          </a>
          <a 
            href="#signup" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-semibold text-[13px] tracking-wide transition shadow-sm hover:shadow-md cursor-pointer"
          >
            Sign Up
          </a>
        </div>
      </header>

      {/* 3. HERO SECTION TRÊN (NỀN HIỆU ỨNG SỐNG ĐỘNG, NGHỆ THUẬT) */}
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 relative py-28 lg:py-36 max-w-6xl mx-auto w-full">
        
        {/* NỀN HIỆU ỨNG NGHỆ THUẬT ĐA LỚP (AURORA GLOW + ANIMATED WAVES + GRID) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
          
          {/* Lớp 1: Lưới chấm công nghệ mờ ảo (Subtle Grid) */}
          <div className="absolute inset-0 bg-grid-subtle opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"></div>

          {/* Lớp 2: Vầng sáng Aurora phát sáng chuyển động mềm mại */}
          <div className="absolute top-1/4 left-1/4 w-[480px] h-[340px] bg-gradient-to-tr from-emerald-400/25 via-teal-300/20 to-transparent blur-[110px] rounded-full animate-float-1"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[520px] h-[360px] bg-gradient-to-bl from-teal-400/20 via-emerald-300/25 to-cyan-300/15 blur-[120px] rounded-full animate-float-2"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[260px] bg-emerald-100/60 blur-[90px] rounded-full"></div>

          {/* Lớp 3: Dải sóng Vector uốn lượn đa sắc với hiệu ứng chuyển động */}
          <svg 
            className="w-[1400px] h-[700px] opacity-70 animate-wave-flow" 
            viewBox="0 0 1400 700" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="30%" stopColor="#059669" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#0d9488" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.15" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Dải sóng chính 1 (Có vệt sáng Filter Glow) */}
            <path d="M-100 290 C 250 140, 450 430, 800 250 C 1100 100, 1250 330, 1500 210" stroke="url(#waveGrad1)" strokeWidth="2" filter="url(#glow)" />
            <path d="M-100 305 C 250 155, 450 445, 800 265 C 1100 115, 1250 345, 1500 225" stroke="url(#waveGrad1)" strokeWidth="1.5" />
            <path d="M-100 320 C 250 170, 450 460, 800 280 C 1100 130, 1250 360, 1500 240" stroke="url(#waveGrad1)" strokeWidth="1.2" strokeDasharray="6 3" />
            <path d="M-100 335 C 250 185, 450 475, 800 295 C 1100 145, 1250 375, 1500 255" stroke="url(#waveGrad1)" strokeWidth="1" />
            <path d="M-100 350 C 250 200, 450 490, 800 310 C 1100 160, 1250 390, 1500 270" stroke="url(#waveGrad1)" strokeWidth="0.8" />

            {/* Dải sóng đan xen 2 uốn ngược */}
            <path d="M-100 200 C 300 380, 580 180, 920 370 C 1200 480, 1320 220, 1500 340" stroke="url(#waveGrad2)" strokeWidth="1.6" filter="url(#glow)" />
            <path d="M-100 218 C 300 398, 580 198, 920 388 C 1200 498, 1320 238, 1500 358" stroke="url(#waveGrad2)" strokeWidth="1.2" />
            <path d="M-100 236 C 300 416, 580 216, 920 406 C 1200 516, 1320 256, 1500 376" stroke="url(#waveGrad2)" strokeWidth="1" strokeDasharray="4 2" />
            <path d="M-100 254 C 300 434, 580 234, 920 424 C 1200 534, 1320 274, 1500 394" stroke="url(#waveGrad2)" strokeWidth="0.8" />
          </svg>
        </div>

        {/* NỘI DUNG CHÍNH HERO - TYPOGRAPHY NGHỆ THUẬT & THANH THOÁT */}
        <div className="relative z-10 flex flex-col items-center max-w-4xl space-y-7 sm:space-y-8">

          {/* TIÊU ĐỀ NGHỆ THUẬT */}
          <h1 className="font-['Outfit'] text-4xl sm:text-6xl md:text-[68px] lg:text-[76px] font-semibold text-slate-900 tracking-[-0.035em] leading-[1.12] text-balance">
            Intelligent Incident &amp;{' '}
            <span className="font-['Instrument_Serif'] italic font-normal text-emerald-700 text-5xl sm:text-7xl md:text-[78px] lg:text-[86px] tracking-normal">
              Reliability
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-700 bg-clip-text text-transparent font-medium">
              Operations Platform
            </span>
          </h1>

          {/* SUBTITLE */}
          <p className="text-slate-600 font-normal text-base sm:text-lg max-w-2xl leading-relaxed text-balance">
            Reduce business risk and build operational resilience on the modern NexusOps intelligence platform.
          </p>

          {/* Ô ĐIỀN EMAIL ĐỂ BẮT ĐẦU */}
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg pt-3"
          >
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email..." 
              required
              className="w-full sm:flex-1 px-5 py-3.5 bg-white/90 backdrop-blur-sm border border-slate-300 rounded-full text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 shadow-sm transition"
            />
            
            <button 
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full text-sm transition shadow-sm hover:shadow-md whitespace-nowrap cursor-pointer"
            >
              Start for free
            </button>

            <a 
              href="#demo" 
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 pl-3 transition whitespace-nowrap"
            >
              <span>Explore the workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </a>
          </form>
        </div>
      </section>

      <LandingStory />

    </div>
  );
}

export function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [initialEmail, setInitialEmail] = useState('');
  const data = useData();
  const authenticated = !!currentUser(data);

  useEffect(() => {
    const navigate = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);

  useEffect(() => {
    if (hash === '#demo') {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }));
      return;
    }
    window.scrollTo(0, 0);
  }, [hash]);

  const workspace = hash === '#workspace' || hash.startsWith('#workspace/');
  const pricing = hash === '#pricing';
  const customerPage = hash === '#customers';
  const incidentManagement = hash === '#product-incident-management';
  const onCallEscalation = hash === '#product-on-call-escalation';
  const aiAutomation = hash === '#product-ai-automation';
  const postIncidentInsights = hash === '#product-post-incident-insights';
  const platformCapability = platformCapabilityKeys.find(key => hash === `#platform-${key}`);
  const mode = hash === '#login' || (workspace && !authenticated) ? 'login' : hash === '#signup' ? 'signup' : null;

  useEffect(() => {
    document.title = workspace && authenticated ? 'Workspace · NexusOps' : incidentManagement ? 'Incident Management · NexusOps' : onCallEscalation ? 'On-call & Escalation · NexusOps' : aiAutomation ? 'AI Investigation & Automation · NexusOps' : postIncidentInsights ? 'Post-Incident Review & Insights · NexusOps' : platformCapability ? `${platformCapabilityTitles[platformCapability]} · NexusOps` : customerPage ? 'Customer · NexusOps' : pricing ? 'Pricing · NexusOps' : mode ? `${mode === 'login' ? 'Log in' : 'Sign up'} · NexusOps` : 'NexusOps · Incident & Reliability Operations';
  }, [mode, workspace, authenticated, pricing, customerPage, incidentManagement, onCallEscalation, aiAutomation, postIncidentInsights, platformCapability]);

  return <div key={mode ?? (workspace ? 'workspace' : customerPage ? 'customers' : pricing ? 'pricing' : incidentManagement ? 'product-incident-management' : onCallEscalation ? 'product-on-call-escalation' : aiAutomation ? 'product-ai-automation' : postIncidentInsights ? 'product-post-incident-insights' : platformCapability ? `platform-${platformCapability}` : 'home')} className="page-transition">{incidentManagement ? <IncidentManagementPage /> : onCallEscalation ? <OnCallEscalationPage /> : aiAutomation ? <AIInvestigationAutomationPage /> : postIncidentInsights ? <PostIncidentInsightsPage /> : platformCapability ? <PlatformCapabilityPage capability={platformCapability} /> : customerPage ? <CustomerPage /> : pricing ? <PricingPage /> : workspace && authenticated ? <Workspace onLogout={() => {
    logout();
    window.location.hash = 'login';
  }} /> : mode ? <AuthPage mode={mode} initialEmail={initialEmail} onDemoLogin={() => {
    window.location.hash = 'workspace';
  }} /> : (
    <LandingPage onStart={(email) => {
      setInitialEmail(email);
      window.location.hash = 'signup';
    }} />
  )}</div>;
}

export default App;
