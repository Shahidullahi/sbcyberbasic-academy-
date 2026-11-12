import { LearningPath } from '../../types';
import { 
  Compass, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface LearningPathsSectionProps {
  paths: LearningPath[];
  onSelectPath: (path: LearningPath) => void;
  onExploreCourses: () => void;
}

export function LearningPathsSection({ paths, onSelectPath, onExploreCourses }: LearningPathsSectionProps) {
  return (
    <section id="paths-section" className="py-20 bg-slate-950/70 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Compass className="w-3.5 h-3.5" />
            <span>Structured Career Roadmaps</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Curated Paths for Beginners & Professionals
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminate guesswork. Follow sequenced curriculum paths designed around specific cybersecurity job outcomes and industry workforce standards.
          </p>
        </div>

        {/* Learning Paths List */}
        <div className="mt-14 space-y-8">
          {paths.map((path, idx) => (
            <div
              key={path.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 p-6 sm:p-8 transition-all duration-300 shadow-xl shadow-slate-950/40 relative overflow-hidden"
            >
              {/* Top metadata row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Track 0{idx + 1}
                  </span>
                  <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                    path.level === 'Beginner' 
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' 
                      : path.level === 'Intermediate'
                      ? 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30'
                      : 'text-amber-400 bg-amber-950/60 border-amber-500/30'
                  }`}>
                    {path.level} Level
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {path.estimatedWeeks} Weeks Est.
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    {path.totalCourses} Sequenced Courses
                  </span>
                </div>
              </div>

              {/* Title & Target Career */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <div className="lg:col-span-8 space-y-3">
                  <h3 className="text-2xl font-bold text-white hover:text-cyan-300 transition-colors">
                    {path.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                    <Briefcase className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Target Outcome: <strong className="text-white">{path.targetRole}</strong></span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-1">
                    {path.description}
                  </p>

                  {/* Highlights */}
                  <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {path.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Action & Course Sequence */}
                <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-5 space-y-4">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Sequential Curriculum:
                  </div>

                  {/* Sequence badges */}
                  <div className="flex flex-wrap gap-2">
                    {path.courseCodes.map((code, stepIndex) => (
                      <div key={code} className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono font-bold">
                          {code}
                        </span>
                        {stepIndex < path.courseCodes.length - 1 && (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onSelectPath(path)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-mono text-xs font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
                    >
                      <span>Enroll in Track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
