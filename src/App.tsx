import { useState, useEffect } from 'react';
import { Course, LearningPath } from './types';
import { COURSES_DATA } from './data/coursesData';
import { LEARNING_PATHS_DATA } from './data/learningPathsData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { fetchAllCourses, seedDefaultCourses } from './services/courseService';
import { enrollStudentInCourse } from './services/progressService';

// Layout & Common
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Homepage Sections
import { HeroSection } from './components/home/HeroSection';
import { WhyCyberSection } from './components/home/WhyCyberSection';
import { FeaturedCoursesSection } from './components/home/FeaturedCoursesSection';
import { LearningPathsSection } from './components/home/LearningPathsSection';
import { StatsSection } from './components/home/StatsSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { FaqSection } from './components/home/FaqSection';

// Protected Student Dashboard & Classroom
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { ClassroomPage } from './pages/ClassroomPage';

// Modals
import { CourseDetailModal } from './components/modals/CourseDetailModal';
import { AuthModal } from './components/modals/AuthModal';
import { VerifyCertModal } from './components/modals/VerifyCertModal';

// Dedicated Pages
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LabsWorkbenchPage } from './pages/LabsWorkbenchPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';

// Icons
import { CheckCircle2, User, LogOut, ShieldCheck, Terminal, Award } from 'lucide-react';

function AppContent() {
  const { user, userProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [coursesList, setCoursesList] = useState<Course[]>(COURSES_DATA);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeClassroomCourse, setActiveClassroomCourse] = useState<Course | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'reset'>('login');
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyModalCode, setVerifyModalCode] = useState('SBC-2026-NET01');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Synchronize courses with Cloud Firestore on mount
  useEffect(() => {
    const initCourses = async () => {
      try {
        const fetched = await fetchAllCourses();
        if (fetched && fetched.length > 0) {
          setCoursesList(fetched);
        }
      } catch (e) {
        console.warn('Courses fetch note:', e);
      }
    };
    initCourses();
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register' | 'reset') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenVerify = (code?: string) => {
    if (code) {
      setVerifyModalCode(code);
    }
    setActiveTab('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourseBySlug = (slug: string) => {
    const found = coursesList.find((c) => c.slug === slug);
    if (found) {
      setSelectedCourse(found);
    }
  };

  const handleEnrollCourse = async (course: Course) => {
    if (!user) {
      handleOpenAuth('register');
    } else {
      try {
        await enrollStudentInCourse(user.uid, course);
        showToast(`Enrolled in [${course.code}] ${course.title}. Ready at 0% starting progress.`);
        setActiveClassroomCourse(course);
        setActiveTab('classroom');
      } catch (err) {
        console.error('Enroll error:', err);
      }
    }
  };

  const handleSelectPath = async (path: LearningPath) => {
    if (!user) {
      handleOpenAuth('register');
    } else {
      showToast(`Track "${path.title}" selected. Browse courses to complete this milestone.`);
      setActiveTab('courses');
    }
  };

  const handleAuthSuccess = () => {
    showToast('Signed in successfully with Firebase. Welcome to your Dashboard!');
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Session Ribbon if User is Logged in */}
      {user && (
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-b border-cyan-500/30 py-2 px-4 text-xs font-mono">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Firebase Session:</span>
              <strong className="text-white">{userProfile?.displayName || user.displayName || user.email}</strong>
              <span className="px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 uppercase text-[10px] font-bold border border-cyan-500/40">
                {userProfile?.role || 'STUDENT'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Go to Dashboard
              </button>
              <button
                onClick={async () => {
                  await logout();
                  showToast('Signed out of student session.');
                  setActiveTab('home');
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Sticky Header */}
      <Navbar
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenAuth={handleOpenAuth}
        onOpenVerify={() => handleOpenVerify('SBC-2026-NET01')}
      />

      {/* Main View Body */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              onExploreCourses={() => {
                const el = document.getElementById('courses-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveTab('courses');
              }}
              onExplorePaths={() => {
                const el = document.getElementById('paths-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveTab('learning-paths');
              }}
              onOpenAuth={() => handleOpenAuth('register')}
            />

            <WhyCyberSection
              onExploreCourses={() => {
                const el = document.getElementById('courses-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <FeaturedCoursesSection
              courses={coursesList}
              onSelectCourse={(course) => setSelectedCourse(course)}
              onEnrollCourse={handleEnrollCourse}
            />

            <LearningPathsSection
              paths={LEARNING_PATHS_DATA}
              onSelectPath={handleSelectPath}
              onExploreCourses={() => {
                const el = document.getElementById('courses-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <StatsSection />

            <TestimonialsSection
              onVerifySample={(code) => handleOpenVerify(code)}
            />

            <FaqSection
              onContactSupport={() => setActiveTab('contact')}
            />
          </>
        )}

        {/* Protected Student Dashboard */}
        {activeTab === 'dashboard' && (
          <StudentDashboardPage
            onBrowseCourses={() => setActiveTab('courses')}
            onOpenClassroom={(course) => {
              setActiveClassroomCourse(course);
              setActiveTab('classroom');
            }}
            onOpenLabs={() => {
              setActiveTab('labs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewCertificateModal={(certId) => handleOpenVerify(certId)}
          />
        )}

        {/* Cyber Labs Workbench */}
        {activeTab === 'labs' && (
          <LabsWorkbenchPage
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* Public Certificate Verification Portal */}
        {activeTab === 'verify' && (
          <VerifyCertificatePage
            initialSearchCode={verifyModalCode}
            onExploreCourses={() => setActiveTab('courses')}
          />
        )}

        {/* Interactive Classroom Course Player */}
        {activeTab === 'classroom' && activeClassroomCourse && (
          <ClassroomPage
            course={activeClassroomCourse}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onViewCertificate={(certId) => handleOpenVerify(certId)}
          />
        )}

        {activeTab === 'courses' && (
          <div className="py-12">
            <FeaturedCoursesSection
              courses={coursesList}
              onSelectCourse={(course) => setSelectedCourse(course)}
              onEnrollCourse={handleEnrollCourse}
            />
          </div>
        )}

        {activeTab === 'learning-paths' && (
          <div className="py-12">
            <LearningPathsSection
              paths={LEARNING_PATHS_DATA}
              onSelectPath={handleSelectPath}
              onExploreCourses={() => setActiveTab('courses')}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <AboutPage
            onExploreCourses={() => setActiveTab('courses')}
            onContact={() => setActiveTab('contact')}
          />
        )}

        {activeTab === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Primary Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVerify={handleOpenVerify}
        onSelectCourse={handleSelectCourseBySlug}
      />

      {/* Course Detail / Syllabus Modal */}
      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnroll={handleEnrollCourse}
      />

      {/* Real Firebase Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Certificate Verification Modal */}
      <VerifyCertModal
        isOpen={verifyModalOpen}
        initialCode={verifyModalCode}
        onClose={() => setVerifyModalOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-xs font-mono shadow-2xl shadow-cyan-950/50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
