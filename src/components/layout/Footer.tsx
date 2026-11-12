import { useState } from 'react';
import { Logo } from '../common/Logo';
import { 
  ShieldCheck, 
  Terminal, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  Award,
  Globe
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenVerify: (code?: string) => void;
  onSelectCourse: (slug: string) => void;
}

export function Footer({ onNavigate, onOpenVerify, onSelectCourse }: FooterProps) {
  const [certInput, setCertInput] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (certInput.trim()) {
      onOpenVerify(certInput.trim());
    } else {
      onOpenVerify();
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 5000);
      setNewsletterEmail('');
    }
  };

  const corePillars = [
    { title: 'Networking Fundamentals', slug: 'networking-fundamentals', code: 'NET-101' },
    { title: 'Linux Fundamentals', slug: 'linux-fundamentals', code: 'LIN-101' },
    { title: 'Cybersecurity Fundamentals', slug: 'cybersecurity-fundamentals', code: 'SEC-101' },
    { title: 'Ethical Hacking', slug: 'ethical-hacking', code: 'HACK-201' },
    { title: 'Network Defense', slug: 'network-defense', code: 'DEF-201' },
    { title: 'Web Application Security', slug: 'web-application-security', code: 'WEB-301' },
    { title: 'Blockchain Security', slug: 'blockchain-security', code: 'BLK-301' },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 font-sans relative overflow-hidden">
      {/* Background cyber grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Top Banner: Verification & Framework Alignment */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Public Certificate Verification Registry</h4>
              <p className="text-xs text-slate-400">Validate digital credential authenticity, issuing date, and student mastery.</p>
            </div>
          </div>

          <form onSubmit={handleVerifySubmit} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="e.g. SBC-2026-NET01"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <span>Verify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs leading-relaxed text-slate-300 max-w-sm">
              SBCyberBasics Academy is an independent educational technology institution delivering structured, hands-on cybersecurity instruction designed to bridge the global cyber skills gap through laboratory-driven learning.
            </p>
            
            <div className="pt-2 flex items-center gap-2 text-xs text-cyan-300/90 font-mono">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Aligned with NIST NICE & MITRE ATT&CK Frameworks</span>
            </div>

            {/* Newsletter */}
            <div className="pt-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Subscribe to Academy Technical Advisories & Lab Releases
              </label>
              {newsletterSubscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subscribed! Check your inbox for the latest security brief.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="engineer@domain.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors border border-slate-700 cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Academy Portal
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  About the Academy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('courses')} 
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Course Catalogue
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('learning-paths')} 
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Structured Learning Paths
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('labs')} 
                  className="hover:text-cyan-300 text-cyan-400 font-mono transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Cyber Labs Workbench</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950 border border-cyan-500/40 rounded text-cyan-300">Live</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('verify')} 
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Certificate Registry
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Contact & Institutional Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: The 7 Core Disciplines */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Core Curriculum
            </h5>
            <ul className="space-y-2 text-xs">
              {corePillars.map((course) => (
                <li key={course.code}>
                  <button
                    onClick={() => onSelectCourse(course.slug)}
                    className="hover:text-cyan-300 transition-colors cursor-pointer text-left group flex items-center gap-1.5"
                  >
                    <span className="font-mono text-[10px] text-cyan-400/80 group-hover:text-cyan-300">
                      [{course.code}]
                    </span>
                    <span className="truncate">{course.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Credentials & Standards */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              Standards & Integrity
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 text-xs">•</span>
                <span>Role-aligned to NIST SP 800-181 Workforce Framework</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 text-xs">•</span>
                <span>Practical Defense against OWASP Top 10 vulnerabilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 text-xs">•</span>
                <span>Ethical Penetration Testing Execution Standard (PTES)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 text-xs">•</span>
                <span>Cryptographically signed certificates of completion</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal, Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="space-y-1 text-center md:text-left">
            <p>
              &copy; {new Date().getFullYear()} <strong className="text-slate-200">SBCyberBasics Academy</strong>. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-300">
              Disclaimer: SBCyberBasics Academy is an independent educational platform. All curriculum content and lab simulations are original. Student testimonials and success profiles represent curated sample learning experiences.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <button onClick={() => onNavigate('about')} className="hover:text-cyan-300 transition-colors">
              Privacy & Data Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('about')} className="hover:text-cyan-300 transition-colors">
              Code of Ethics
            </button>
            <span>•</span>
            <button onClick={() => onOpenVerify()} className="hover:text-cyan-300 transition-colors">
              Registry
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
