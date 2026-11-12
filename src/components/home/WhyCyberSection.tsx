import { 
  TrendingUp, 
  ShieldAlert, 
  Cpu, 
  Briefcase, 
  CheckCircle2, 
  Terminal, 
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';

interface WhyCyberSectionProps {
  onExploreCourses: () => void;
}

export function WhyCyberSection({ onExploreCourses }: WhyCyberSectionProps) {
  const reasons = [
    {
      icon: TrendingUp,
      title: '3.5 Million Unfilled Roles Worldwide',
      badge: 'Talent Shortage',
      description: 'The global cybersecurity workforce gap continues to expand. Organizations across government, defense, banking, and technology are urgently seeking qualified practitioners who understand real systems.',
      highlight: '35% projected job growth rate through 2031 (Bureau of Labor Statistics).'
    },
    {
      icon: ShieldAlert,
      title: 'Escalating Adversarial Threat Landscape',
      badge: 'Critical Defense',
      description: 'Ransomware, automated credential stuffing, supply-chain exploits, and state-sponsored APTs threaten digital sovereignty. Defending infrastructure requires proactive, skilled analysts.',
      highlight: 'An average enterprise breach costs $4.45M—preventative skill is paramount.'
    },
    {
      icon: Briefcase,
      title: 'Recession-Resilient Career Trajectories',
      badge: 'Career Mobility',
      description: 'Cybersecurity is an indispensable core operational necessity, not an optional luxury. Roles in SOC analysis, ethical hacking, and incident response remain protected and high-earning.',
      highlight: 'Lucrative compensation packages with clear pathways to Senior Engineer & CISO.'
    },
    {
      icon: Cpu,
      title: 'The Shift to Hands-On Laboratory Mastery',
      badge: 'Pedagogy First',
      description: 'Traditional passive video courses fail in real interview technical screenings. SBCyberBasics Academy mandates real command line execution, Wireshark PCAPs, and practical assessments.',
      highlight: 'Graduate with tangible project write-ups and verified credential IDs.'
    }
  ];

  return (
    <section className="py-20 bg-slate-950/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Why Cybersecurity Matters Now</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The World Needs Capable Defenders, Not Passive Viewers.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            As critical infrastructure migrates to cloud networks and decentralized ledgers, the surface area for devastating cyber attacks has never been greater. Here is why structured cybersecurity education is your most powerful career investment.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="group relative rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/40 p-7 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800/80 text-cyan-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-300 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-cyan-400 font-medium">{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Banner: Traditional vs SBCyberBasics Academy */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                The SBCyberBasics Academy Difference
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Institutional Quality & Rigorous Practical Scaffolding
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Like Cisco Networking Academy transformed global network education, SBCyberBasics Academy provides structured prerequisite roadmaps, timed assessments, and verifiable digital proof of skills for modern cyber roles.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                onClick={onExploreCourses}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer"
              >
                <span>View Full Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
