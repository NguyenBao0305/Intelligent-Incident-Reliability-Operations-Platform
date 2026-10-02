import { useEffect, useState } from 'react';
import { AuthPage } from './pages/AuthPage';
import { ResponderDashboard } from './features/responder/ResponderDashboard';
import { hasDemoSession, setDemoSession } from './demo/auth';
import { ProductsMenu } from './components/ProductsMenu';
import './motion.css';
import { 
  ChevronDown, 
  Search, 
  ArrowRight, 
  X, 
  Sparkles,
  Star,
  Quote,
  CheckCircle2
} from 'lucide-react';

function LandingPage({ onStart }: { onStart: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [showTopBanner, setShowTopBanner] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onStart(email);
  };

  const reviews = [
    {
      id: 1,
      quote: "NexusOps reduced our alert fatigue by over 92% in our first month. The automated correlation pinpointed a database thread pool leak in 3 minutes instead of hours of manual triage.",
      author: "Alex Morgan",
      role: "Staff Site Reliability Engineer",
      company: "Finscale Cloud",
      rating: 5,
      highlight: "⚡ 65% faster MTTR",
      verified: true
    },
    {
      id: 2,
      quote: "The Human Approval Gate gives our on-call responders superpowers without risking production safety. AI proposes the rollback with full snapshot evidence, and we stay in control.",
      author: "David Tran",
      role: "VP of Engineering & Infrastructure",
      company: "PayFlow Global",
      rating: 5,
      highlight: "🛡️ 100% Safe Remediation",
      verified: true
    },
    {
      id: 3,
      quote: "Automated Post-Incident Reviews (PIR) save our Incident Commanders 3+ hours after every P1 outage. The timeline and contributing factors are generated accurately from real event streams.",
      author: "Elena Rostova",
      role: "Head of DevOps & Platform Ops",
      company: "DataStream Systems",
      rating: 5,
      highlight: "📝 Automated Postmortems",
      verified: true
    }
  ];

  const brandLogos = [
    "ACME Cloud", "DataPulse", "Nexora Tech", "FinVanguard", "KubeMatrix", "HyperScale"
  ];

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
            <div className="hidden lg:flex items-center gap-8">
            <button className="flex items-center gap-1 hover:text-emerald-700 transition cursor-pointer">
              Solutions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <a href="#pricing" className="hover:text-emerald-700 transition">
              Pricing
            </a>
            <button className="flex items-center gap-1 hover:text-emerald-700 transition cursor-pointer">
              Company <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button className="flex items-center gap-1 hover:text-emerald-700 transition cursor-pointer">
              Resources <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            </div>
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
              <span>Watch demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </a>
          </form>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PHẦN PLACEHOLDER REVIEW (CUSTOMER TESTIMONIALS & TRUST SECTION)        */}
      {/* ========================================================================= */}
      <section className="bg-slate-50/70 border-t border-slate-200/80 py-24 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-emerald-100/40 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-16">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/60 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Customer Reviews &amp; Social Proof</span>
            </div>

            <h2 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-[42px] font-semibold text-slate-900 tracking-tight leading-tight">
              Trusted by high-velocity SRE &amp; engineering teams
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Discover how modern reliability teams use NexusOps to slash alert noise, automate root-cause triage, and protect error budgets.
            </p>

            {/* Overall Rating Badge */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-600 font-medium">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-900 text-sm">4.9 / 5.0</span>
              <span className="text-slate-400">&bull;</span>
              <span>Based on 350+ reviews across industry benchmarks</span>
            </div>
          </div>

          {/* Grid of 3 Placeholder Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6 relative group"
              >
                <div className="space-y-4">
                  {/* Top: Stars & Metric Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-500 gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {rev.highlight}
                    </span>
                  </div>

                  {/* Quote Body */}
                  <div className="relative">
                    <Quote className="w-6 h-6 text-emerald-600/15 absolute -top-2 -left-1" />
                    <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed relative z-10 pt-2 font-normal">
                      &ldquo;{rev.quote}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>{rev.author}</span>
                      {rev.verified && (
                        <span title="Verified Reviewer">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{rev.role}</div>
                    <div className="text-[11px] font-semibold text-emerald-700">{rev.company}</div>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {rev.author.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trusted Brand Logotypes Placeholder Bar */}
          <div className="pt-4 flex flex-col items-center space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">
              Integrates seamlessly with modern observability &amp; infrastructure
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-65">
              {brandLogos.map((brand, idx) => (
                <div 
                  key={idx} 
                  className="font-['Outfit'] font-bold text-slate-500 text-sm tracking-wider uppercase hover:text-slate-800 transition cursor-default"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [initialEmail, setInitialEmail] = useState('');
  const [authenticated, setAuthenticated] = useState(hasDemoSession);

  useEffect(() => {
    const navigate = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);

  const workspace = hash === '#workspace';
  const mode = hash === '#login' || (workspace && !authenticated) ? 'login' : hash === '#signup' ? 'signup' : null;

  useEffect(() => {
    document.title = workspace && authenticated ? 'Responder workspace · NexusOps' : mode ? `${mode === 'login' ? 'Log in' : 'Sign up'} · NexusOps` : 'NexusOps · Incident & Reliability Operations';
  }, [mode, workspace, authenticated]);

  return <div key={mode ?? (workspace ? 'workspace' : 'home')} className="page-transition">{workspace && authenticated ? <ResponderDashboard onLogout={() => {
    setDemoSession(false);
    setAuthenticated(false);
    window.location.hash = 'login';
  }} /> : mode ? <AuthPage mode={mode} initialEmail={initialEmail} onDemoLogin={() => {
    setDemoSession(true);
    setAuthenticated(true);
    window.location.hash = 'workspace';
  }} /> : (
    <LandingPage onStart={(email) => {
      setInitialEmail(email);
      window.location.hash = 'signup';
    }} />
  )}</div>;
}

export default App;
