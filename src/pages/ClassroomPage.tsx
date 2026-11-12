import { useState, useEffect } from 'react';
import { Course, LessonPreview, DownloadableResource, QuizQuestion, PracticalAssignment } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  getCourseProgressForStudent, 
  toggleLessonCompletion,
  updateLastAccessedPosition,
  submitPracticalAssignment,
  recordStudentQuizAttempt,
  issueCertificateForCourse,
  StudentCourseProgress
} from '../services/progressService';
import { sanitizeInput } from '../utils/security';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Play, 
  Pause,
  FileText, 
  Terminal, 
  HelpCircle, 
  Download, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Award,
  Layers,
  Sparkles,
  BookOpen,
  Send,
  AlertCircle,
  FileCheck,
  Check,
  ExternalLink,
  Info
} from 'lucide-react';

interface ClassroomPageProps {
  course: Course;
  onBackToDashboard: () => void;
  onViewCertificate: (certId: string) => void;
}

export function ClassroomPage({ course, onBackToDashboard, onViewCertificate }: ClassroomPageProps) {
  const { user, userProfile } = useAuth();

  const allLessons = course.modules.flatMap(m => m.lessons);
  const [activeLesson, setActiveLesson] = useState<LessonPreview>(allLessons[0]);
  
  // Progress states
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<Record<string, any>>({});
  
  // Video playback simulator states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'reading' | 'assignment' | 'resources'>('video');

  // Practical assignment submission state
  const [assignmentAnswer, setAssignmentAnswer] = useState<string>('');
  const [assignmentSubmitting, setAssignmentSubmitting] = useState<boolean>(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState<boolean>(false);

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  
  // Toast notifications
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Load user progress and restore last learning position from Firestore
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const studentProg = await getCourseProgressForStudent(user.uid, course.id);
        if (studentProg) {
          setCompletedLessonIds(studentProg.completedLessonIds || []);
          setProgressPercent(studentProg.progressPercent || 0);
          setCertificateId(studentProg.certificateId || null);
          setAssignmentSubmissions(studentProg.assignmentSubmissions || {});

          // Restore last learning position if saved
          if (studentProg.lastAccessedLessonId) {
            const lastLesson = allLessons.find(l => l.id === studentProg.lastAccessedLessonId);
            if (lastLesson) {
              setActiveLesson(lastLesson);
              if (lastLesson.type === 'video') setActiveMediaTab('video');
              else if (lastLesson.type === 'reading') setActiveMediaTab('reading');
              else if (lastLesson.type === 'lab' || lastLesson.type === 'assignment') setActiveMediaTab('assignment');
            }
          }
        }
      } catch (e) {
        console.error('Error fetching course progress:', e);
      }
    };
    fetchProgress();
  }, [user, course.id]);

  // When active lesson changes, record learning position in Firestore
  const handleSelectLesson = (lesson: LessonPreview) => {
    setActiveLesson(lesson);
    setIsPlaying(false);
    setQuizSubmitted(false);
    setSelectedQuizAnswers({});
    setAssignmentSuccess(false);

    if (lesson.type === 'video') setActiveMediaTab('video');
    else if (lesson.type === 'reading') setActiveMediaTab('reading');
    else if (lesson.type === 'lab' || lesson.type === 'assignment') setActiveMediaTab('assignment');
    else if (lesson.type === 'quiz') setActiveMediaTab('reading');

    if (user) {
      updateLastAccessedPosition(user.uid, course.id, lesson.id);
    }
  };

  // Navigation: Next / Previous
  const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const handleNextLesson = () => {
    if (hasNext) {
      handleSelectLesson(allLessons[currentIndex + 1]);
    }
  };

  const handlePreviousLesson = () => {
    if (hasPrevious) {
      handleSelectLesson(allLessons[currentIndex - 1]);
    }
  };

  // Toggle lesson complete in Cloud Firestore
  const handleToggleComplete = async (lessonId: string) => {
    if (!user) return;
    try {
      const res = await toggleLessonCompletion(user.uid, course.id, lessonId, allLessons.length);
      setCompletedLessonIds(res.completedLessons);
      setProgressPercent(res.progressPercent);

      const isMarkedDone = res.completedLessons.includes(lessonId);
      if (isMarkedDone) {
        showToast('Lesson marked complete. Progress updated in Firestore.');
        // Auto-advance if not on last lesson
        if (hasNext) {
          setTimeout(() => handleNextLesson(), 700);
        }
      } else {
        showToast('Lesson marked as incomplete.');
      }

      // Check if course reached 100%
      if (res.isCompleted && !certificateId) {
        const cert = await issueCertificateForCourse(
          user.uid,
          userProfile?.displayName || user.displayName || 'Candidate',
          course,
          '95.0% (Distinction)'
        );
        setCertificateId(cert.id);
        showToast(`🎉 Congratulations! 100% completed! Certificate ${cert.id} generated!`);
      }
    } catch (e) {
      console.error('Toggle error:', e);
    }
  };

  // Submit Practical Lab Assignment to Firestore
  const handleAssignmentSubmit = async (e: React.FormEvent, assignmentId: string) => {
    e.preventDefault();
    const cleanAnswer = sanitizeInput(assignmentAnswer, 3000);
    if (!user || cleanAnswer.length < 5) {
      showToast('Assignment deliverable must be at least 5 characters.');
      return;
    }

    setAssignmentSubmitting(true);
    try {
      await submitPracticalAssignment(user.uid, course.id, assignmentId, cleanAnswer);
      setAssignmentSubmissions(prev => ({
        ...prev,
        [assignmentId]: {
          submittedAt: new Date().toISOString(),
          answerText: cleanAnswer,
          status: 'submitted'
        }
      }));
      setAssignmentSuccess(true);
      showToast('Practical assignment deliverable submitted and recorded in Firestore!');
      
      // Auto mark lesson as complete upon assignment submission
      if (!completedLessonIds.includes(activeLesson.id)) {
        await handleToggleComplete(activeLesson.id);
      }
    } catch (err) {
      console.error('Assignment submission error:', err);
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  // Submit Quiz Assessment to Firestore
  const handleQuizSubmit = async (questions: QuizQuestion[]) => {
    if (!user) return;

    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedQuizAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    try {
      await recordStudentQuizAttempt(user.uid, {
        id: `attempt-${Date.now()}`,
        courseId: course.id,
        quizTitle: activeLesson.title,
        scorePercent: score,
        totalQuestions: questions.length,
        correctCount,
        passed: score >= 75
      });
      showToast(`Quiz assessment recorded in Firestore (${score}%).`);

      // Auto mark quiz lesson complete if passed
      if (score >= 75 && !completedLessonIds.includes(activeLesson.id)) {
        await handleToggleComplete(activeLesson.id);
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    }
  };

  // Mock download resource helper
  const handleDownloadResource = (res: DownloadableResource) => {
    const element = document.createElement('a');
    const file = new Blob([
      res.mockDownloadContent || `SBCyberBasics Academy Resource: ${res.name}\nCourse: ${course.title} [${course.code}]\nFile: ${res.filename}\nType: ${res.type}\nVerified Academic Material`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = res.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded: ${res.filename}`);
  };

  const isCurrentLessonDone = completedLessonIds.includes(activeLesson.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      
      {/* Top Sticky Learning Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-16 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <div className="hidden sm:block h-4 w-px bg-slate-700" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                [{course.code}]
              </span>
              <h2 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                {course.title}
              </h2>
            </div>
            <div className="text-[11px] text-slate-400 font-mono hidden md:block">
              Current: <span className="text-white font-medium">{activeLesson.title}</span>
            </div>
          </div>
        </div>

        {/* Course Progress Status Widget */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block font-mono">
            <div className="text-[10px] text-slate-400">Total Course Progress:</div>
            <div className="text-xs font-bold text-cyan-300">{progressPercent}%</div>
          </div>

          <div className="w-20 sm:w-28 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {certificateId && (
            <button
              onClick={() => onViewCertificate(certificateId)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Earned Credential</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Notice Toast */}
      {notification && (
        <div className="fixed top-28 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono shadow-2xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Split Learning Screen */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Modular Syllabus Navigation Accordion */}
          <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Course Modules ({course.modules.length})</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {completedLessonIds.length} / {allLessons.length} Completed
              </span>
            </div>

            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <span className="line-clamp-1">{mod.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{mod.lessons.length}</span>
                  </div>

                  <div className="space-y-1 pl-1">
                    {mod.lessons.map((les) => {
                      const isCompleted = completedLessonIds.includes(les.id);
                      const isCurrent = activeLesson.id === les.id;
                      return (
                        <button
                          key={les.id}
                          onClick={() => handleSelectLesson(les)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-semibold'
                              : 'bg-slate-950/40 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : les.type === 'quiz' ? (
                              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                            ) : les.type === 'lab' || les.type === 'assignment' ? (
                              <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                            ) : (
                              <Play className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                            {les.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Active Learning Stage */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header / Media Mode Tabs */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
              
              {/* Top media toolbar */}
              <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                    activeLesson.type === 'quiz' 
                      ? 'bg-amber-950 text-amber-400 border-amber-500/30'
                      : activeLesson.type === 'lab' || activeLesson.type === 'assignment'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                      : 'bg-cyan-950 text-cyan-400 border-cyan-500/30'
                  }`}>
                    {activeLesson.type} Mode
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Est. Duration: {activeLesson.duration}
                  </span>
                </div>

                {/* Sub-tabs if lesson has multiple media */}
                <div className="flex items-center gap-1 font-mono text-xs">
                  {activeLesson.videoUrl && (
                    <button
                      onClick={() => setActiveMediaTab('video')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        activeMediaTab === 'video' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Video Lecture
                    </button>
                  )}
                  <button
                    onClick={() => setActiveMediaTab('reading')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeMediaTab === 'reading' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Notes & Theory
                  </button>
                  {(activeLesson.practicalAssignment || activeLesson.type === 'lab') && (
                    <button
                      onClick={() => setActiveMediaTab('assignment')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        activeMediaTab === 'assignment' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Practical Lab
                    </button>
                  )}
                  {activeLesson.resources && activeLesson.resources.length > 0 && (
                    <button
                      onClick={() => setActiveMediaTab('resources')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        activeMediaTab === 'resources' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Downloads ({activeLesson.resources.length})
                    </button>
                  )}
                </div>
              </div>

              {/* 1. VIDEO PLAYER VIEW */}
              {activeMediaTab === 'video' && activeLesson.videoUrl && (
                <div className="space-y-4">
                  <div className="aspect-video bg-black relative group flex flex-col items-center justify-center overflow-hidden">
                    <video
                      key={activeLesson.id}
                      src={activeLesson.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>

                  {activeLesson.transcriptSummary && (
                    <div className="px-6 pb-4">
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <div className="text-[11px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Key Lecture Takeaways & Transcript Summary:</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {activeLesson.transcriptSummary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. READING CONTENT / QUIZ VIEW */}
              {activeMediaTab === 'reading' && (
                <div className="p-6 sm:p-8 space-y-6">
                  {/* If this lesson has a Quiz */}
                  {activeLesson.quizQuestions && activeLesson.quizQuestions.length > 0 ? (
                    <div className="space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                          Proctored Module Knowledge Check
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1">
                          {activeLesson.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Answer all questions to validate competency. Passing benchmark: 75%
                        </p>
                      </div>

                      <div className="space-y-6">
                        {activeLesson.quizQuestions.map((q, qIndex) => (
                          <div key={q.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                            <h4 className="text-sm font-semibold text-white">
                              {qIndex + 1}. {q.prompt}
                            </h4>

                            {q.codeSnippet && (
                              <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                                {q.codeSnippet}
                              </pre>
                            )}

                            <div className="space-y-2 font-mono text-xs">
                              {q.options.map((opt, optIndex) => {
                                const isSelected = selectedQuizAnswers[q.id] === optIndex;
                                return (
                                  <div
                                    key={optIndex}
                                    onClick={() => !quizSubmitted && setSelectedQuizAnswers(prev => ({ ...prev, [q.id]: optIndex }))}
                                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                                      isSelected 
                                        ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                                  >
                                    <span className="text-cyan-400 mr-2 font-bold">{String.fromCharCode(65 + optIndex)}.</span>
                                    <span>{opt}</span>
                                  </div>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="pt-2 text-xs border-t border-slate-800/80">
                                {selectedQuizAnswers[q.id] === q.correctOptionIndex ? (
                                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Correct!</span>
                                  </div>
                                ) : (
                                  <div className="text-red-400 font-bold flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Incorrect (Correct answer was {String.fromCharCode(65 + q.correctOptionIndex)})</span>
                                  </div>
                                )}
                                <p className="text-slate-400 mt-1">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        ))}

                        {!quizSubmitted ? (
                          <button
                            onClick={() => handleQuizSubmit(activeLesson.quizQuestions!)}
                            disabled={Object.keys(selectedQuizAnswers).length < activeLesson.quizQuestions.length}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-mono text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
                          >
                            Submit Assessment for Scoring
                          </button>
                        ) : (
                          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-mono text-slate-400">Recorded Score:</div>
                              <div className="text-2xl font-bold text-white font-mono">{quizScore}%</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${
                              (quizScore || 0) >= 75
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                                : 'bg-red-950 text-red-400 border-red-500/30'
                            }`}>
                              {(quizScore || 0) >= 75 ? 'PASSED & RECORDED' : 'REQUIRES RETAKE'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Standard Technical Reading Notes */
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">{activeLesson.title}</h3>
                      <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
                        {activeLesson.readingContent ? (
                          <div className="whitespace-pre-line font-sans">
                            {activeLesson.readingContent}
                          </div>
                        ) : (
                          <p>
                            This lesson provides fundamental theoretical principles and practical command architectures. Proceed through the lecture video and test the configuration steps in your terminal or packet capture software.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. PRACTICAL ASSIGNMENT VIEW */}
              {activeMediaTab === 'assignment' && (
                <div className="p-6 sm:p-8 space-y-6">
                  {activeLesson.practicalAssignment ? (
                    <div className="space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                          Practical Lab Deliverable
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1">
                          {activeLesson.practicalAssignment.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">
                          {activeLesson.practicalAssignment.objective}
                        </p>
                      </div>

                      {/* Scenario briefing */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-xs font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Scenario Briefing & Target Environment:</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {activeLesson.practicalAssignment.scenario}
                        </p>
                        <div className="text-[11px] font-mono text-slate-400">
                          Target Environment: <strong className="text-white">{activeLesson.practicalAssignment.targetEnvironment}</strong>
                        </div>
                      </div>

                      {/* Steps checklist */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono uppercase text-white font-bold">Execution Steps:</h4>
                        <div className="space-y-2">
                          {activeLesson.practicalAssignment.steps.map((st, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs text-slate-300">
                              <span className="font-mono text-cyan-400 font-bold mt-0.5">0{i + 1}.</span>
                              <span>{st}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Submission Input Form */}
                      <form 
                        onSubmit={(e) => handleAssignmentSubmit(e, activeLesson.practicalAssignment!.id)}
                        className="space-y-3 pt-4 border-t border-slate-800"
                      >
                        <label className="block text-xs font-mono text-slate-300 font-bold">
                          Submit Your Deliverable Findings / Output Proof:
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={assignmentAnswer}
                          onChange={(e) => setAssignmentAnswer(e.target.value)}
                          placeholder={`Enter your discovered flag, extracted MAC address, or command execution log...\nExample: ${activeLesson.practicalAssignment.sampleDeliverableHint}`}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                        />

                        <div className="flex items-center justify-between">
                          <div className="text-[11px] text-slate-400 font-mono">
                            {assignmentSubmissions[activeLesson.practicalAssignment.id] ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Recorded in Firestore ({new Date(assignmentSubmissions[activeLesson.practicalAssignment.id].submittedAt).toLocaleDateString()})
                              </span>
                            ) : (
                              <span>Verification required for course completion</span>
                            )}
                          </div>

                          <button
                            type="submit"
                            disabled={assignmentSubmitting || !assignmentAnswer.trim()}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:brightness-110 text-slate-950 font-mono font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-md"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{assignmentSubmitting ? 'Recording...' : 'Submit Lab Proof'}</span>
                          </button>
                        </div>
                      </form>

                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No practical assignment attached to this specific lesson. Please proceed to the reading or video notes.
                    </div>
                  )}
                </div>
              )}

              {/* 4. DOWNLOADABLE RESOURCES VIEW */}
              {activeMediaTab === 'resources' && activeLesson.resources && (
                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Downloadable Lesson Materials</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeLesson.resources.map((res) => (
                      <div key={res.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono text-cyan-400 font-bold uppercase">{res.type}</span>
                            <span className="text-slate-500 font-mono text-[11px]">{res.size}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">{res.name}</h4>
                          <p className="text-xs text-slate-400 mt-1">{res.description}</p>
                        </div>

                        <button
                          onClick={() => handleDownloadResource(res)}
                          className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download {res.filename}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Action Footer */}
              <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Previous & Next lesson navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousLesson}
                    disabled={!hasPrevious}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNextLesson}
                    disabled={!hasNext}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono transition-colors cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Mark lesson completed toggle */}
                <button
                  onClick={() => handleToggleComplete(activeLesson.id)}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                    isCurrentLessonDone
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCurrentLessonDone ? 'Completed (Click to Revert)' : 'Mark Lesson as Completed'}</span>
                </button>

              </div>

            </div>

            {/* Course Information & Instructor Profile Card */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/40"
                />
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Course Faculty Lead</div>
                  <h4 className="text-sm font-bold text-white">{course.instructor.name}</h4>
                  <p className="text-xs text-slate-400">{course.instructor.title}</p>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-slate-400">Awarded Credential:</span>
                <div className="text-white font-bold">{course.badgeName}</div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
