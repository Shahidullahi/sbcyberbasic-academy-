import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../config/firebase';
import { Course, CertificateRecord } from '../types';
import { StudentCourseProgress, StudentQuizAttempt } from './progressService';
import { generateSha256Digest } from '../utils/security';

// Sample verified certificates for demonstration and instant public testing
export const INITIAL_REGISTRY_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'SBC-2026-NET01',
    verificationCode: 'SBC-2026-NET01',
    uid: 'system-sample-uid-01',
    studentName: 'Amina Al-Hassan',
    courseId: 'course-net-101',
    courseCode: 'NET-101',
    courseTitle: 'Networking Fundamentals',
    instructorName: 'Engr. Marcus Vance, CISSP',
    gradeAchieved: '96.5%',
    issuedAt: '2026-10-24T14:30:00Z',
    credentialHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    honorsTier: 'High Honors',
    isValid: true,
    learningObjectivesSummary: [
      'Layer 1-7 OSI Protocol Analysis & Packet Decapsulation',
      'Enterprise VLSM IPv4 & IPv6 Subnetting Architecture',
      'Wireshark Frame Dissection & Network Troubleshooting'
    ]
  },
  {
    id: 'SBC-2026-CCDA',
    verificationCode: 'SBC-2026-CCDA',
    uid: 'system-sample-uid-02',
    studentName: 'David Chen',
    courseId: 'course-def-201',
    courseCode: 'DEF-201',
    courseTitle: 'Network Defense & Incident Response',
    instructorName: 'Sarah Jenkins, Lead Incident Responder',
    gradeAchieved: '92.0%',
    issuedAt: '2026-11-02T09:15:00Z',
    credentialHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    honorsTier: 'Honors',
    isValid: true,
    learningObjectivesSummary: [
      'Snort 3 Heuristic & Signature Detection Engineering',
      'Wireshark C2 Beaconing Forensics & PCAP Carving',
      'Zero Trust Boundary Implementation & Host Quarantine'
    ]
  },
  {
    id: 'SBC-2026-CEPT',
    verificationCode: 'SBC-2026-CEPT',
    uid: 'system-sample-uid-03',
    studentName: 'Zainab Bello',
    courseId: 'course-hack-201',
    courseCode: 'HACK-201',
    courseTitle: 'Ethical Hacking & Penetration Testing',
    instructorName: 'Kofi Mensah, Red Team Operator (OSCP/OSCE)',
    gradeAchieved: '94.8%',
    issuedAt: '2026-11-08T16:45:00Z',
    credentialHash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    honorsTier: 'High Honors',
    isValid: true,
    learningObjectivesSummary: [
      'Nmap Reconnaissance & NSE Vulnerability Auditing',
      'Metasploit Exploitation & Privilege Escalation',
      'Responsible Vulnerability Disclosure & Executive Reporting'
    ]
  }
];

// Verify if student meets the mandatory completion requirements
export async function verifyCourseCompletionCriteria(
  uid: string, 
  course: Course
): Promise<{ canIssue: boolean; reason: string; completedLessonsCount: number; totalLessonsCount: number }> {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  const progressRef = doc(db, 'users', uid, 'progress', course.id);
  try {
    const snap = await getDoc(progressRef);
    if (!snap.exists()) {
      return {
        canIssue: false,
        reason: 'You are not yet enrolled in this course.',
        completedLessonsCount: 0,
        totalLessonsCount: totalLessons
      };
    }

    const data = snap.data() as StudentCourseProgress;
    const completedCount = data.completedLessonIds?.length || 0;

    if (completedCount < totalLessons) {
      return {
        canIssue: false,
        reason: `Course completion criteria not met: ${completedCount} of ${totalLessons} lessons completed (${data.progressPercent}%). You must complete 100% of all lessons.`,
        completedLessonsCount: completedCount,
        totalLessonsCount: totalLessons
      };
    }

    return {
      canIssue: true,
      reason: 'All lessons completed and verified against academic criteria.',
      completedLessonsCount: completedCount,
      totalLessonsCount: totalLessons
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}/progress/${course.id}`);
  }
}

// Generate and record verified certificate in Cloud Firestore
export async function issueVerifiedCertificate(
  uid: string,
  studentName: string,
  course: Course,
  scoreAverage: number = 95
): Promise<CertificateRecord> {
  // Check criteria first
  const check = await verifyCourseCompletionCriteria(uid, course);
  if (!check.canIssue) {
    throw new Error(check.reason);
  }

  const cleanCourseCode = course.code.replace(/[^a-zA-Z0-9]/g, '');
  const uniqueSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const certId = `SBC-2026-${cleanCourseCode}-${uniqueSuffix}`;
  const now = new Date().toISOString();

  // Cryptographic Fingerprint using W3C Web Crypto SHA-256 over immutable certificate fields
  const hashSeed = `${certId}|${uid}|${course.id}|${course.code}|${scoreAverage}|${now}`;
  const credentialHash = await generateSha256Digest(hashSeed);

  const honorsTier: 'High Honors' | 'Honors' | 'Passing Distinction' = 
    scoreAverage >= 95 ? 'High Honors' : scoreAverage >= 85 ? 'Honors' : 'Passing Distinction';

  const certRecord: CertificateRecord = {
    id: certId,
    verificationCode: certId,
    uid,
    studentName,
    courseId: course.id,
    courseCode: course.code,
    courseTitle: course.title,
    instructorName: `${course.instructor.name} (${course.instructor.title})`,
    gradeAchieved: `${scoreAverage}% (${honorsTier})`,
    issuedAt: now,
    credentialHash,
    honorsTier,
    isValid: true,
    learningObjectivesSummary: course.learningObjectives.slice(0, 3)
  };

  const certDoc = doc(db, 'certificates', certId);
  try {
    await setDoc(certDoc, certRecord);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `certificates/${certId}`);
  }

  // Update student course progress document with certificateId
  try {
    const progressDoc = doc(db, 'users', uid, 'progress', course.id);
    await setDoc(progressDoc, { certificateId: certId, isCompleted: true }, { merge: true });
  } catch (e) {
    // Non-fatal
  }

  return certRecord;
}

// Public Certificate Verification Lookup
export async function verifyCertificateInRegistry(certId: string): Promise<CertificateRecord | null> {
  const cleanId = certId.trim().toUpperCase();

  // Check sample registry first for instant lookup
  const foundSample = INITIAL_REGISTRY_CERTIFICATES.find(c => c.id.toUpperCase() === cleanId);
  if (foundSample) {
    return foundSample;
  }

  // Query Cloud Firestore /certificates/{cleanId}
  const certDoc = doc(db, 'certificates', cleanId);
  try {
    const snap = await getDoc(certDoc);
    if (snap.exists()) {
      return snap.data() as CertificateRecord;
    }
    return null;
  } catch (err) {
    console.warn('Certificate lookup note:', err);
    return null;
  }
}
