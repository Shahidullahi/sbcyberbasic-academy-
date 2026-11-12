import { useState } from 'react';
import { Course, CourseCategory } from '../../types';
import { 
  BookOpen, 
  Clock, 
  Terminal, 
  Layers, 
  Star, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Search,
  Filter,
  Shield,
  Award
} from 'lucide-react';

interface FeaturedCoursesSectionProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
}

export function FeaturedCoursesSection({ 
  courses, 
  onSelectCourse, 
  onEnrollCourse 
}: FeaturedCoursesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = [
    'All',
    'Networking',
    'Linux',
    'Cybersecurity',
    'Ethical Hacking',
    'Network Defense',
    'Web Security',
    'Blockchain'
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || course.level === selectedDifficulty;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-500/30';
      case 'Intermediate':
        return 'text-cyan-400 bg-cyan-950/70 border-cyan-500/30';
      case 'Advanced':
        return 'text-amber-400 bg-amber-950/70 border-amber-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <section id="courses-section" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Standardized Academy Curriculum</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cybersecurity Course Catalogue
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Explore seven comprehensive disciplines engineered with interactive video lessons, downloadable packet captures, and proctored examinations.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Displaying <strong className="text-cyan-400 font-semibold">{filteredCourses.length}</strong> available courses
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by title, code or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Level:
            </span>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10 border-b border-slate-800/80">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer font-mono ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-950/40 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
            >
              <div>
                {/* Course Image Banner */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Header badges over image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-950/90 text-cyan-400 border border-slate-700 backdrop-blur-md">
                      {course.code}
                    </span>
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border backdrop-blur-md ${getDifficultyColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {course.durationHours} Hours
                    </span>
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      {course.totalLabs} Practical Labs
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Course Title */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {course.summary}
                    </p>
                  </div>

                  {/* Course Modules & Labs Metric Row */}
                  <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-800/80 text-center font-mono text-xs">
                    <div className="p-1.5 rounded-lg bg-slate-950/60 flex items-center justify-center gap-1.5 text-slate-300">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{course.totalModules} Modules</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-950/60 flex items-center justify-center gap-1.5 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating.toFixed(1)} ({course.enrolledStudentsCount.toLocaleString()})</span>
                    </div>
                  </div>

                  {/* Key Learning Objectives */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                      Core Objectives:
                    </div>
                    {course.learningObjectives.slice(0, 2).map((obj, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{obj}</span>
                      </div>
                    ))}
                  </div>

                  {/* Instructor Bio Snippet */}
                  <div className="flex items-center gap-2 pt-1">
                    <img 
                      src={course.instructor.avatar} 
                      alt={course.instructor.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700" 
                    />
                    <div className="text-left text-xs">
                      <span className="text-white font-semibold">{course.instructor.name}</span>
                      <span className="text-slate-500 ml-1.5 font-mono text-[10px]">Lead</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => onSelectCourse(course)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-mono font-medium transition-colors text-center cursor-pointer"
                >
                  Syllabus Details
                </button>
                <button
                  onClick={() => onEnrollCourse(course)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
                >
                  <span>Enroll Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
