import { Logo } from '../components/common/Logo';
import { 
  ShieldCheck, 
  Terminal, 
  Award, 
  Cpu, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Layers, 
  ArrowRight,
  Globe,
  Lock
} from 'lucide-react';

interface AboutPageProps {
  onExploreCourses: () => void;
  onContact: () => void;
}

export function AboutPage({ onExploreCourses, onContact }: AboutPageProps) {
  const leadership = [
    {
      name: 'Dr. Bashir Gusau',
      role: 'Founder & Chief Academic Officer',
      bio: 'Cybersecurity educator and systems architect specializing in telecommunications security, network infrastructure, and standardized cyber defense curriculum design.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Elena Rostova, CISSP',
      role: 'Head of Defensive Curriculum',
      bio: 'Former Enterprise CISO with 15+ years defending banking perimeters, SIEM engineering, and architecting zero-trust network boundaries.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Kofi Mensah, OSCP/OSCE',
      role: 'Director of Offensive Security Labs',
      bio: 'Veteran red team operator and penetration testing instructor who designs vulnerable machines, exploit simulations, and ethical hacking exercises.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
    }
  ];

  return (
    <div className="py-12 lg:py-20 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Institutional Profile</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            About SBCyberBasics Academy
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Founded on the conviction that cybersecurity is an empirical discipline that cannot be mastered through passive observation. We provide structured, laboratory-intensive education engineered for real-world impact.
          </p>
        </div>

        {/* The Pedagogical Framework */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Our Educational Pedagogy
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Institutional Rigor with Modern Practical Application
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Global academies such as Cisco Networking Academy established the gold standard in modular networking education. SBCyberBasics Academy honors this heritage by applying that same meticulous instructional hierarchy—prerequisites, objective tracking, timed examinations, and hands-on lab requirements—to modern cybersecurity specializations.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every learner progresses through foundational networking and Linux command-line fluency before advancing into offensive exploitation, intrusion detection, or smart contract auditing. This eliminates dangerous knowledge gaps and builds authentic professional competence.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Strict sequential prerequisite enforcement across career paths</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>100% original curriculum, simulated environments, and packet archives</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Direct alignment with NIST SP 800-181 (NICE) and MITRE ATT&CK matrices</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <Logo size="sm" />
              <span className="text-xs font-mono text-cyan-400">Charter & Standards</span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold">Principle 1: Hands-on First</div>
                <div className="text-slate-400 mt-0.5">Theory must be reinforced by a terminal command, packet trace, or code audit.</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold">Principle 2: Ethical Responsibility</div>
                <div className="text-slate-400 mt-0.5">Offensive techniques are taught exclusively for authorized defense, auditing, and hardening.</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold">Principle 3: Verifiable Mastery</div>
                <div className="text-slate-400 mt-0.5">Credentials reflect proctored examination and objective lab completions.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Leadership */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Faculty & Academic Leadership
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Taught by Practicing Security Engineers
            </h2>
            <p className="text-sm text-slate-400">
              Our course authors and instructors actively defend networks, conduct penetration tests, and audit software protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((person, i) => (
              <div key={i} className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500/40"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{person.name}</h3>
                  <div className="text-xs text-cyan-400 font-mono mt-0.5">{person.role}</div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/30 p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Begin Your Cybersecurity Journey?
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            Enroll today to access foundational coursework, hands-on lab simulations, and our active global student community.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreCourses}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Browse All Courses
            </button>
            <button
              onClick={onContact}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-medium text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              Inquire for Academic Institution
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
