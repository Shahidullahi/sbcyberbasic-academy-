import { ACADEMY_STATS } from '../../data/faqAndTestimonials';
import { Users, Award, Terminal, CheckCircle2, Globe, Shield } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      label: 'Students Enrolled',
      value: ACADEMY_STATS.studentsEnrolled,
      desc: 'Active learners across 85+ countries',
      icon: Users,
    },
    {
      label: 'Hands-on Labs & PCAPs',
      value: ACADEMY_STATS.handsOnLabsCount,
      desc: 'Real simulated terminal & network traces',
      icon: Terminal,
    },
    {
      label: 'Course Completion Rate',
      value: ACADEMY_STATS.completionRate,
      desc: 'Rigorous objective-driven methodology',
      icon: CheckCircle2,
    },
    {
      label: 'Verifiable Certifications',
      value: ACADEMY_STATS.certificationsIssued,
      desc: 'Cryptographically registered IDs',
      icon: Award,
    },
    {
      label: 'Hiring & Academic Partners',
      value: ACADEMY_STATS.hiringPartners,
      desc: 'Recognizing SBCyberBasics credentials',
      icon: Globe,
    }
  ];

  return (
    <section className="py-16 bg-slate-900/60 border-y border-slate-800/80 relative overflow-hidden">
      {/* Decorative cyber grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Proven Educational Impact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Measuring Educational Excellence
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Institutional quality metrics reflecting student engagement, laboratory completion, and validated competency.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-950/80 border border-slate-800/90 p-5 text-center flex flex-col items-center justify-between hover:border-cyan-500/40 transition-colors group shadow-lg"
              >
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
                    {item.value}
                  </div>
                  <div className="text-xs font-bold text-slate-200">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-300 leading-tight">
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
