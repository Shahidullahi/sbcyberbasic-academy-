import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES_DATA } from '../data/coursesData';
import { Course, CertificateRecord } from '../types';
import { 
  getStudentCoursesProgress, 
  getStudentQuizAttempts, 
  getStudentCertificates, 
  toggleLessonCompletion,
  StudentCourseProgress, 
  StudentQuizAttempt, 
  StudentCertificate 
} from '../services/progressService';
import { 
  verifyCourseCompletionCriteria, 
  issueVerifiedCertificate 
} from '../services/certificateService';
import { updateStudentProfile } from '../services/authService';
import { CertificateRenderer } from '../components/certificate/CertificateRenderer';
import { sanitizeInput, isValidDisplayName } from '../utils/security';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Terminal, 
  User, 
  Save, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink,
  HelpCircle,
  Play,
  Lock,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';

interface StudentDashboardProps {
  onBrowseCourses: () => void;
  onOpenClassroom: (course: Course) => void;
  onOpenLabs: () => void;
  onViewCertificateModal: (certId: string) => void;
}

export function StudentDashboardPage({ 
  onBrowseCourses, 
  onOpenClassroom,
  onOpenLabs,
  onViewCertificateModal 
}: StudentDashboardProps) {
  const { user, userProfile, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'quizzes' | 'certificates' | 'profile'>('overview');
  const [coursesProgress, setCoursesProgress] = useState<StudentCourseProgress[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<StudentQuizAttempt[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Certificate Modal preview state
  const [selectedCertificateToRender, setSelectedCertificateToRender] = useState<CertificateRecord | null>(null);

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editOrg, setEditOrg] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Quick Lesson Checklist selector
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [claimingCertCourseId, setClaimingCertCourseId] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const loadStudentData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [prog, quizzes, certs] = await Promise.all([
        getStudentCoursesProgress(user.uid),
        getStudentQuizAttempts(user.uid),
        getStudentCertificates(user.uid)
      ]);
      setCoursesProgress(prog);
      setQuizAttempts(quizzes);
      
      // Adapt StudentCertificate to CertificateRecord format
      const formattedCerts: CertificateRecord[] = certs.map(c => ({
        id: c.id,
        verificationCode: c.verificationCode,
        uid: c.uid,
        studentName: c.studentName,
        courseId: c.courseId,
        courseCode: c.id.split('-')[2] || 'SEC',
        courseTitle: c.courseTitle,
        instructorName: 'Academy Faculty Lead',
        gradeAchieved: c.gradeAchieved,
        issuedAt: c.issuedAt,
        credentialHash: c.credentialHash,
        honorsTier: 'High Honors',
        isValid: true,
        learningObjectivesSummary: ['Hands-on laboratory execution', 'Proctored assessment validation']
      }));
      setCertificates(formattedCerts);

      if (prog.length > 0 && !selectedCourseForLessons) {
        setSelectedCourseForLessons(prog[0].courseId);
      }
    } catch (err) {
      console.error('Error fetching student dashboard records:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadStudentData();
      if (userProfile) {
        setEditName(userProfile.displayName || '');
        setEditBio(userProfile.bio || '');
        setEditOrg(userProfile.organization || '');
      }
    }
  }, [user, userProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const cleanName = sanitizeInput(editName, 60);
    const cleanBio = sanitizeInput(editBio, 300);
    const cleanOrg = sanitizeInput(editOrg, 80);

    if (!isValidDisplayName(cleanName)) {
      setActionNotice('Display name must be 2 to 50 characters (letters, numbers, spaces, and hyphens only).');
      return;
    }

    setSavingProfile(true);
    try {
      await updateStudentProfile(user.uid, {
        displayName: cleanName,
        bio: cleanBio,
        organization: cleanOrg
      });
      await refreshProfile();
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update student profile:', err);
      setActionNotice('Failed to update profile. Please verify input data.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleToggleLesson = async (courseId: string, lessonId: string) => {
    if (!user) return;
    const course = COURSES_DATA.find(c => c.id === courseId);
    if (!course) return;

    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    try {
      const result = await toggleLessonCompletion(user.uid, courseId, lessonId, totalLessons);
      
      setCoursesProgress(prev => prev.map(p => {
        if (p.courseId === courseId) {
          return {
            ...p,
            completedLessonIds: result.completedLessons,
            progressPercent: result.progressPercent,
            isCompleted: result.isCompleted
          };
        }
        return p;
      }));

      showNotice(`Lesson updated. Current Course Progress: ${result.progressPercent}%`);
    } catch (err) {
      console.error('Failed to toggle lesson completion:', err);
    }
  };

  // Strictly verify completion criteria before generating certificate
  const handleClaimCertificate = async (course: Course) => {
    if (!user) return;
    setClaimingCertCourseId(course.id);
    try {
      const criteria = await verifyCourseCompletionCriteria(user.uid, course);
      if (!criteria.canIssue) {
        showNotice(`⚠️ Criteria Not Met: ${criteria.reason}`);
        return;
      }

      const cert = await issueVerifiedCertificate(
        user.uid,
        userProfile?.displayName || user.displayName || 'Candidate',
        course,
        96
      );

      setCertificates(prev => [cert, ...prev]);
      showNotice(`🎉 Official Certificate ${cert.id} issued and verified in public ledger!`);
      setSelectedCertificateToRender(cert);
    } catch (err: any) {
      showNotice(`Could not issue certificate: ${err.message}`);
    } finally {
      setClaimingCertCourseId(null);
    }
  };

  if (!user) {
    return (
      <div className="py-24 max-w-2xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-950/50">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">Protected Student Learning Dashboard</h2>
        <p className="text-sm text-slate-300">
          You must be authenticated with your individual SBCyberBasics student account to access your private progress records, labs, quizzes, and earned certificates.
        </p>
      </div>
    );
  }

  const totalEnrolled = coursesProgress.length;
  const totalCompletedCourses = coursesProgress.filter(c => c.isCompleted).length;
  const totalCompletedLessons = coursesProgress.reduce((acc, c) => acc + (c.completedLessonIds?.length || 0), 0);
  const overallAvgProgress = totalEnrolled > 0 
    ? Math.round(coursesProgress.reduce((acc, c) => acc + c.progressPercent, 0) / totalEnrolled) 
    : 0;

  const activeCourseProgress = coursesProgress.find(c => c.courseId === selectedCourseForLessons);
  const activeCourseDetails = COURSES_DATA.find(c => c.id === selectedCourseForLessons);

  return (
    <div className="py-8 sm:py-12 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Header Bar */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg shadow-cyan-500/30">
                {(userProfile?.displayName || user.displayName || 'S').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {userProfile?.displayName || user.displayName || 'Candidate'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40 uppercase">
                    {userProfile?.role || 'STUDENT'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {user.email} • ID: <span className="text-cyan-400 font-bold">{user.uid.slice(0, 8)}...</span>
                </p>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 max-w-xl">
              {userProfile?.bio || 'Dedicated cybersecurity practitioner mastering systems defense and ethical penetration testing.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenLabs}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono transition-colors border border-cyan-500/40 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cyber Labs Workbench</span>
            </button>
            <button
              onClick={onBrowseCourses}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white text-xs font-mono font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Course Catalog</span>
            </button>
          </div>
        </div>

        {/* Action Notice Toast */}
        {actionNotice && (
          <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs font-mono flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold uppercase">Cloud Synced</span>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none font-mono text-xs">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
            { id: 'courses', label: `Enrolled Courses (${totalEnrolled})`, icon: BookOpen },
            { id: 'quizzes', label: `Quiz Results (${quizAttempts.length})`, icon: HelpCircle },
            { id: 'certificates', label: `Certificates (${certificates.length})`, icon: Award },
            { id: 'profile', label: 'Profile Settings', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Enrolled Courses</span>
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{totalEnrolled}</div>
                <div className="text-[11px] text-slate-400">{totalCompletedCourses} completed</div>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Completed Lessons</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{totalCompletedLessons}</div>
                <div className="text-[11px] text-slate-400">Synchronized in Firestore</div>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Curriculum Progress</span>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold text-cyan-300">{overallAvgProgress}%</div>
                <div className="text-[11px] text-slate-400">Average across active tracks</div>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Verified Credentials</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{certificates.length}</div>
                <div className="text-[11px] text-slate-400">SHA-256 registered</div>
              </div>
            </div>

            {/* In-Progress Hero Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Continue Active Learning</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('courses')} 
                    className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                  >
                    View All ({coursesProgress.length})
                  </button>
                </div>

                {coursesProgress.length === 0 ? (
                  <div className="text-center py-12 rounded-xl bg-slate-950/60 border border-slate-800 p-6 space-y-4">
                    <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="text-base font-bold text-white">No Courses Enrolled Yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Choose from our seven core cybersecurity disciplines to start your hands-on journey.
                    </p>
                    <button
                      onClick={onBrowseCourses}
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Browse Available Courses
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coursesProgress.map((prog) => {
                      const courseInfo = COURSES_DATA.find(c => c.id === prog.courseId);
                      if (!courseInfo) return null;
                      const isComplete = prog.progressPercent === 100;
                      return (
                        <div key={prog.courseId} className="rounded-xl bg-slate-950/80 border border-slate-800 p-5 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={courseInfo.image}
                                alt={courseInfo.title}
                                className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-400 font-mono text-[11px] font-bold border border-slate-800">
                                    {prog.courseCode}
                                  </span>
                                  <h4 className="text-sm font-bold text-white">{prog.courseTitle}</h4>
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono mt-1">
                                  {prog.completedLessonIds?.length || 0} lessons completed • Last accessed {new Date(prog.lastAccessedAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {isComplete && !prog.certificateId && (
                                <button
                                  onClick={() => handleClaimCertificate(courseInfo)}
                                  disabled={claimingCertCourseId === courseInfo.id}
                                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  <span>{claimingCertCourseId === courseInfo.id ? 'Verifying...' : 'Claim Certificate'}</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  onOpenClassroom(courseInfo);
                                }}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer shrink-0"
                              >
                                <Play className="w-3.5 h-3.5 fill-slate-950" />
                                <span>{prog.lastAccessedLessonId ? 'Resume Course' : 'Start Course'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-cyan-300 font-bold">{prog.progressPercent}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${prog.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Interactive Lesson Completion & Firestore Sync Sandbox */}
              <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Real-time Lesson Tracker</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    Live Firestore
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Toggle completed lessons below to test private student progress updates stored in your individual Cloud Firestore record:
                </p>

                {coursesProgress.length > 0 ? (
                  <>
                    <select
                      value={selectedCourseForLessons}
                      onChange={(e) => setSelectedCourseForLessons(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                    >
                      {coursesProgress.map(p => (
                        <option key={p.courseId} value={p.courseId}>
                          [{p.courseCode}] {p.courseTitle} ({p.progressPercent}%)
                        </option>
                      ))}
                    </select>

                    {activeCourseDetails && (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {activeCourseDetails.modules.flatMap(m => m.lessons).map((les) => {
                          const isDone = activeCourseProgress?.completedLessonIds?.includes(les.id) || false;
                          return (
                            <div
                              key={les.id}
                              onClick={() => handleToggleLesson(selectedCourseForLessons, les.id)}
                              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                                isDone
                                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  readOnly
                                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                                />
                                <span className="truncate">{les.title}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                                {les.duration}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-500 font-mono italic">
                    Enroll in a course from the catalogue to begin tracking lessons.
                  </p>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ENROLLED COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Your Enrolled Cybersecurity Courses</h3>
                <p className="text-xs text-slate-400">All courses currently associated with your individual student ID.</p>
              </div>
              <button
                onClick={onBrowseCourses}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                + Browse All Courses
              </button>
            </div>

            {coursesProgress.length === 0 ? (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center space-y-4">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Course Enrollments Found</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  You are not yet enrolled in any courses. Browse the course catalogue and click "Enroll Free" to begin.
                </p>
                <button
                  onClick={onBrowseCourses}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-bold"
                >
                  Browse Catalogue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coursesProgress.map((prog) => {
                  const course = COURSES_DATA.find(c => c.id === prog.courseId);
                  if (!course) return null;
                  const isComplete = prog.progressPercent === 100;
                  return (
                    <div key={prog.courseId} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between shadow-xl">
                      <div>
                        <div className="relative aspect-[21/9] w-full bg-slate-950 overflow-hidden">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-mono text-xs">
                            <span className="px-2 py-1 rounded bg-slate-950/90 text-cyan-400 border border-slate-700">
                              {course.code}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-950/80 text-slate-300 border border-slate-700">
                              {course.level}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 space-y-3">
                          <h4 className="text-lg font-bold text-white">{course.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                            {course.summary}
                          </p>

                          {/* Progress bar */}
                          <div className="space-y-1.5 pt-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-slate-400">Curriculum Progress:</span>
                              <span className="text-cyan-300 font-bold">{prog.progressPercent}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                              <div 
                                className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                                style={{ width: `${prog.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
                        <div className="text-[11px] font-mono text-slate-400">
                          {prog.completedLessonIds?.length || 0} / {course.modules.flatMap(m => m.lessons).length} Lessons Completed
                        </div>

                        <div className="flex items-center gap-2">
                          {isComplete && !prog.certificateId && (
                            <button
                              onClick={() => handleClaimCertificate(course)}
                              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Claim Certificate</span>
                            </button>
                          )}

                          <button
                            onClick={() => onOpenClassroom(course)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>{prog.lastAccessedLessonId ? 'Resume' : 'Start'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: QUIZ RESULTS */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Assessment & Examination Outcomes</h3>
              <p className="text-xs text-slate-400">Results and proctored scores recorded for your student profile.</p>
            </div>

            {quizAttempts.length === 0 ? (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Quiz Attempts Recorded</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Take the module quizzes and final exams inside the classroom to see your scores recorded here.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-950 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Quiz / Assessment Title</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Score</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {quizAttempts.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-semibold text-white">{q.quizTitle}</td>
                          <td className="p-4 font-mono text-cyan-400">{q.courseId}</td>
                          <td className="p-4 font-mono font-bold text-white">
                            {q.scorePercent}% ({q.correctCount}/{q.totalQuestions})
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                              q.passed 
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' 
                                : 'bg-red-950/80 text-red-400 border-red-500/30'
                            }`}>
                              {q.passed ? 'PASSED' : 'RETAKE NEEDED'}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-400">
                            {new Date(q.attemptedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Your Earned Digital Certificates</h3>
              <p className="text-xs text-slate-400">
                Official completion credentials verified by the academy and registered in the public verification ledger.
              </p>
            </div>

            {certificates.length === 0 ? (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center space-y-4">
                <Award className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Certificates Earned Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Strict Completion Requirement: You must complete 100% of all lessons and pass the proctored examinations in any enrolled cybersecurity course to unlock your cryptographically signed Certificate of Completion.
                </p>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-bold cursor-pointer"
                >
                  Continue Active Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div key={cert.id} className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/40 p-6 space-y-4 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>VERIFIED CREDENTIAL</span>
                      </div>
                      <span className="font-mono text-xs text-cyan-300 font-bold">{cert.id}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Recipient:</div>
                      <div className="text-base font-bold text-white">{cert.studentName}</div>
                      <div className="text-xs text-cyan-300">[{cert.courseCode}] {cert.courseTitle}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500">Achievement:</span>
                        <div className="text-emerald-400 font-bold">{cert.gradeAchieved}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Issued On:</span>
                        <div className="text-white">{new Date(cert.issuedAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCertificateToRender(cert)}
                        className="flex-1 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </button>
                      <button
                        onClick={() => onViewCertificateModal(cert.id)}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors border border-slate-800 cursor-pointer"
                        title="Open Public Registry Verification"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Student Profile Settings</h3>
              <p className="text-xs text-slate-400">Manage your academy identity, public certificate name, and biographical details.</p>
            </div>

            {profileSaveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Profile updated successfully in Cloud Firestore!</span>
              </div>
            )}

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-6">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Legal Full Name (Appears on Certificates) <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email || ''}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-500 rounded-lg px-3 py-2 text-xs cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">Managed via Firebase Authentication</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Organization / University / Employer
                  </label>
                  <input
                    type="text"
                    value={editOrg}
                    onChange={(e) => setEditOrg(e.target.value)}
                    placeholder="e.g. Federal University of Technology / Independent"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Student Bio / Security Focus Area
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Describe your current study track, technical aspirations, or target certifications..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <div className="text-xs font-mono text-slate-500">
                    Account Created: {new Date(userProfile?.createdAt || '').toLocaleDateString()}
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-mono text-xs font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>

      {/* Full Certificate Modal Display */}
      {selectedCertificateToRender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 my-8 shadow-2xl">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSelectedCertificateToRender(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CertificateRenderer 
              certificate={selectedCertificateToRender}
              onVerifyInRegistry={(id) => {
                setSelectedCertificateToRender(null);
                onViewCertificateModal(id);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
