import { TESTIMONIALS_DATA } from '../../data/faqAndTestimonials';
import { Star, ShieldCheck, Quote, Info, CheckCircle2 } from 'lucide-react';

interface TestimonialsSectionProps {
  onVerifySample: (code: string) => void;
}

export function TestimonialsSection({ onVerifySample }: TestimonialsSectionProps) {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with clear sample disclaimer */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Graduate Success Pathways</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Learners Advance in Cyber Defense
          </h2>
          
          {/* Explicit sample content notice as requested */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs text-left max-w-xl mx-auto">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Sample Student Profiles:</strong> Below are representative graduate scenarios illustrating typical career transformations enabled by our curriculum.
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          {TESTIMONIALS_DATA.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/40 p-7 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-slate-950/30 relative"
            >
              {/* Sample indicator watermarking */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  Sample Graduate Story
                </span>
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <Quote className="w-8 h-8 text-cyan-500/20 absolute -top-3 -left-2 pointer-events-none" />
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic pl-4">
                  "{item.quote}"
                </p>
              </div>

              {/* Student info & Verification badge */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.studentName}
                    className="w-10 h-10 rounded-full object-cover border border-cyan-500/30"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.studentName}</h4>
                    <p className="text-xs text-cyan-400 font-mono">{item.role}</p>
                    <p className="text-[11px] text-slate-500">{item.companyOrOrg}</p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-[10px] text-slate-400 font-mono">Curriculum Completed:</div>
                  <div className="text-xs font-semibold text-slate-200">{item.courseCompleted}</div>
                  <button
                    onClick={() => onVerifySample('SBC-2026-NET01')}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{item.verificationBadge}</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
