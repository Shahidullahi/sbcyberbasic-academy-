import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  getDoc,
  query,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../config/firebase';
import { Course } from '../types';

export interface StudentCourseProgress {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  enrolledAt: string;
  lastAccessedAt: string;
  lastAccessedLessonId?: string;
  completedLessonIds: string[];
  progressPercent: number;
  isCompleted: boolean;
  certificateId?: string;
  assignmentSubmissions?: {
    [assignmentId: string]: {
      submittedAt: string;
      answerText: string;
      status: 'submitted' | 'reviewed';
    }
  };
}

export interface StudentQuizAttempt {
  id: string;
  courseId: string;
  quizTitle: string;
  scorePercent: number;
  totalQuestions: number;
  correctCount: number;
  passed: boolean;
  attemptedAt: string;
}

export interface StudentCertificate {
  id: string;
  verificationCode: string;
  uid: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  gradeAchieved: string;
  issuedAt: string;
  credentialHash: string;
}

export async function getStudentCoursesProgress(uid: string): Promise<StudentCourseProgress[]> {
  const progressCol = collection(db, 'users', uid, 'progress');
  try {
    const snap = await getDocs(progressCol);
    return snap.docs.map(d => d.data() as StudentCourseProgress);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, `users/${uid}/progress`);
  }
}

export async function getCourseProgressForStudent(uid: string, courseId: string): Promise<StudentCourseProgress | null> {
  const progressDoc = doc(db, 'users', uid, 'progress', courseId);
  try {
    const snap = await getDoc(progressDoc);
    if (snap.exists()) {
      return snap.data() as StudentCourseProgress;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}/progress/${courseId}`);
  }
}

export async function enrollStudentInCourse(uid: string, course: Course): Promise<StudentCourseProgress> {
  const now = new Date().toISOString();
  const progressDoc = doc(db, 'users', uid, 'progress', course.id);
  
  // Clean initialization with 0% progress and first lesson as starting position
  const firstLessonId = course.modules[0]?.lessons[0]?.id || 'intro';

  const initialProgress: StudentCourseProgress = {
    courseId: course.id,
    courseCode: course.code,
    courseTitle: course.title,
    enrolledAt: now,
    lastAccessedAt: now,
    lastAccessedLessonId: firstLessonId,
    completedLessonIds: [],
    progressPercent: 0,
    isCompleted: false
  };

  try {
    await setDoc(progressDoc, initialProgress);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}/progress/${course.id}`);
  }

  // Also update user profile enrolled list
  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      const currentList: string[] = data.enrolledCourseIds || [];
      if (!currentList.includes(course.id)) {
        await updateDoc(userDocRef, {
          enrolledCourseIds: [...currentList, course.id]
        });
      }
    }
  } catch (err) {
    console.warn('User enrolled courses update note:', err);
  }

  return initialProgress;
}

export async function updateLastAccessedPosition(
  uid: string, 
  courseId: string, 
  lessonId: string
): Promise<void> {
  const progressDoc = doc(db, 'users', uid, 'progress', courseId);
  try {
    await updateDoc(progressDoc, {
      lastAccessedLessonId: lessonId,
      lastAccessedAt: new Date().toISOString()
    });
  } catch (err) {
    // Non-fatal if document does not exist yet
  }
}

export async function toggleLessonCompletion(
  uid: string, 
  courseId: string, 
  lessonId: string, 
  totalLessonsInCourse: number
): Promise<{ completedLessons: string[]; progressPercent: number; isCompleted: boolean }> {
  const progressDoc = doc(db, 'users', uid, 'progress', courseId);
  const now = new Date().toISOString();

  try {
    const snap = await getDoc(progressDoc);
    let completedLessons: string[] = [];
    
    if (snap.exists()) {
      const data = snap.data() as StudentCourseProgress;
      completedLessons = data.completedLessonIds || [];
    }

    if (completedLessons.includes(lessonId)) {
      completedLessons = completedLessons.filter(id => id !== lessonId);
    } else {
      completedLessons.push(lessonId);
    }

    const total = Math.max(1, totalLessonsInCourse);
    const progressPercent = Math.min(100, Math.round((completedLessons.length / total) * 100));
    const isCompleted = progressPercent === 100;

    await updateDoc(progressDoc, {
      completedLessonIds: completedLessons,
      progressPercent,
      isCompleted,
      lastAccessedLessonId: lessonId,
      lastAccessedAt: now
    });

    return { completedLessons, progressPercent, isCompleted };
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}/progress/${courseId}`);
  }
}

export async function submitPracticalAssignment(
  uid: string,
  courseId: string,
  assignmentId: string,
  answerText: string
): Promise<void> {
  const progressDoc = doc(db, 'users', uid, 'progress', courseId);
  const now = new Date().toISOString();

  try {
    const snap = await getDoc(progressDoc);
    let existingSubmissions: any = {};
    if (snap.exists()) {
      existingSubmissions = (snap.data() as StudentCourseProgress).assignmentSubmissions || {};
    }

    await updateDoc(progressDoc, {
      assignmentSubmissions: {
        ...existingSubmissions,
        [assignmentId]: {
          submittedAt: now,
          answerText,
          status: 'submitted'
        }
      },
      lastAccessedAt: now
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}/progress/${courseId}`);
  }
}

export async function getStudentQuizAttempts(uid: string): Promise<StudentQuizAttempt[]> {
  const attemptsCol = collection(db, 'users', uid, 'quizAttempts');
  try {
    const snap = await getDocs(attemptsCol);
    return snap.docs.map(d => d.data() as StudentQuizAttempt).sort((a, b) => 
      new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, `users/${uid}/quizAttempts`);
  }
}

export async function recordStudentQuizAttempt(
  uid: string, 
  attempt: Omit<StudentQuizAttempt, 'attemptedAt'>
): Promise<StudentQuizAttempt> {
  const now = new Date().toISOString();
  const attemptDoc = doc(db, 'users', uid, 'quizAttempts', attempt.id);
  const fullAttempt: StudentQuizAttempt = {
    ...attempt,
    attemptedAt: now
  };

  try {
    await setDoc(attemptDoc, fullAttempt);
    return fullAttempt;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}/quizAttempts/${attempt.id}`);
  }
}

export async function getStudentCertificates(uid: string): Promise<StudentCertificate[]> {
  const certsCol = collection(db, 'certificates');
  try {
    const q = query(certsCol, where('uid', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as StudentCertificate);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'certificates');
  }
}

export async function issueCertificateForCourse(
  uid: string, 
  studentName: string, 
  course: Course, 
  gradeAchieved: string
): Promise<StudentCertificate> {
  const certId = `SBC-2026-${course.code.replace(/[^a-zA-Z0-9]/g, '')}-${uid.slice(0, 4).toUpperCase()}`;
  const now = new Date().toISOString();

  const credentialHash = Array.from(
    `${certId}:${uid}:${course.id}:${now}:SBCYBERBASICS-SECRET`
  ).reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0) | 0, 0)
   .toString(16)
   .replace('-', '')
   .padStart(32, 'a') + '8f20b41c';

  const cert: StudentCertificate = {
    id: certId,
    verificationCode: certId,
    uid,
    studentName,
    courseId: course.id,
    courseTitle: course.title,
    gradeAchieved,
    issuedAt: now,
    credentialHash
  };

  const certDoc = doc(db, 'certificates', certId);
  try {
    await setDoc(certDoc, cert);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `certificates/${certId}`);
  }

  try {
    const progressDoc = doc(db, 'users', uid, 'progress', course.id);
    await updateDoc(progressDoc, {
      certificateId: certId,
      isCompleted: true,
      progressPercent: 100
    });
  } catch (e) {
    // Non-fatal
  }

  return cert;
}
