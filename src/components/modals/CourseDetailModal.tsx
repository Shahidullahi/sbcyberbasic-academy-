import { Course } from '../../types';
import { 
  X, 
  Clock, 
  Layers, 
  Terminal, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  FileText, 
  HelpCircle,
  AlertCircle,
  Download,
  Award
} from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}

export function CourseDetailModal({ course, onClose, onEnroll }: CourseDetailModalProps) {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 font-sans">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-cyan-400 border border-slate-700">
              {course.code}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {course.category} • {course.level} Level
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-8">
          
          {/* Hero Banner with Course Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-slate-950 border border-slate-800 shadow-xl">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {course.title}
              </h2>
              <p className="text-xs sm:text-sm text-cyan-300 font-mono mt-1">
                Taught by {course.instructor.name} ({course.instructor.title})
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono text-xs text-cyan-400">
              Course Overview & Syllabus Scope
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                {course.durationHours} Hours
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Curriculum Duration</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                {course.totalModules} Modules
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Instructional Units</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-sm font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                {course.totalLabs} Labs
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Practical Exercises</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400" />
                {course.rating.toFixed(1)} / 5.0
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {course.enrolledStudentsCount.toLocaleString()} Enrolled
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              What You Will Master:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/50 border border-slate-800/80 p-3 rounded-xl">
                  <span className="text-cyan-400 font-mono font-bold mt-0.5">0{i + 1}.</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Prerequisites & Prior Knowledge:
              </div>
              <ul className="mt-1 space-y-1 text-xs text-slate-400">
                {course.prerequisites.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Complete Syllabus Accordion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Syllabus & Module Units ({course.modules.length} Modules)
              </h3>
              <span className="text-xs font-mono text-cyan-400">
                SBCyberBasics Standard
              </span>
            </div>

            <div className="space-y-3">
              {course.modules.map((mod) => (
                <div key={mod.id} className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">{mod.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{mod.description}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                      {mod.lessons.length} lessons
                    </span>
                  </div>

                  {/* Lessons list */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-900">
                    {mod.lessons.map((les) => (
                      <div key={les.id} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-slate-900/50 hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-2 text-slate-300">
                          {les.type === 'video' ? (
                            <Play className="w-3.5 h-3.5 text-cyan-400" />
                          ) : les.type === 'lab' || les.type === 'assignment' ? (
                            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                          ) : les.type === 'quiz' ? (
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{les.title}</span>
                          {les.isFreePreview && (
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.2 rounded">
                              Free Preview
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          {les.resources && (
                            <span className="text-slate-500 flex items-center gap-0.5" title="Downloadable Resources">
                              <Download className="w-3 h-3 text-cyan-400" />
                              {les.resources.length}
                            </span>
                          )}
                          <span className="text-slate-400">{les.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Profile */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-12 h-12 rounded-full object-cover border border-cyan-500/40"
              />
              <div>
                <div className="text-xs font-mono text-cyan-400">Course Faculty Lead</div>
                <div className="text-sm font-bold text-white">{course.instructor.name}</div>
                <div className="text-xs text-slate-400">{course.instructor.title}</div>
              </div>
            </div>
            
            <div className="text-right hidden sm:block">
              <div className="text-xs font-mono text-slate-400">Awarded Upon Passing:</div>
              <div className="text-xs font-bold text-white font-mono">{course.badgeName}</div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            Structured modular lessons • Real-time progress synchronization
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(course);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer"
            >
              <span>Enroll In Course</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
