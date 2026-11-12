export type CourseCategory = 
  | 'Networking'
  | 'Linux'
  | 'Cybersecurity'
  | 'Ethical Hacking'
  | 'Network Defense'
  | 'Web Security'
  | 'Blockchain';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface DownloadableResource {
  id: string;
  name: string;
  type: 'pcap' | 'pdf' | 'config' | 'cheatsheet' | 'script' | 'rules';
  size: string;
  description: string;
  filename: string;
  mockDownloadContent?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface PracticalAssignment {
  id: string;
  title: string;
  objective: string;
  scenario: string;
  targetEnvironment: string;
  steps: string[];
  verificationCriteria: string;
  hints: string[];
  sampleDeliverableHint: string;
}

export interface LessonPreview {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'lab' | 'reading' | 'quiz' | 'assignment';
  isFreePreview?: boolean;
  videoUrl?: string;
  videoDurationSec?: number;
  transcriptSummary?: string;
  readingContent?: string;
  resources?: DownloadableResource[];
  quizQuestions?: QuizQuestion[];
  practicalAssignment?: PracticalAssignment;
}

export interface ModulePreview {
  id: string;
  title: string;
  description: string;
  durationMinutes?: number;
  lessons: LessonPreview[];
}

export interface Course {
  id: string;
  slug: string;
  code: string;
  title: string;
  category: CourseCategory;
  level: DifficultyLevel;
  durationHours: number;
  totalModules: number;
  totalLabs: number;
  image: string;
  description: string;
  summary: string;
  learningObjectives: string[];
  prerequisites: string[];
  modules: ModulePreview[];
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  rating: number;
  enrolledStudentsCount: number;
  badgeName: string;
  isFeatured?: boolean;
}

// Certificate Model
export interface CertificateRecord {
  id: string;
  verificationCode: string;
  uid: string;
  studentName: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  instructorName: string;
  gradeAchieved: string;
  issuedAt: string;
  credentialHash: string;
  honorsTier: 'High Honors' | 'Honors' | 'Passing Distinction';
  isValid: boolean;
  learningObjectivesSummary: string[];
}

// Practical Cyber Lab Model
export type LabCategory = 
  | 'Linux Fundamentals'
  | 'Networking'
  | 'Nmap Scanning'
  | 'Wireshark Analysis'
  | 'Snort IDS/IPS'
  | 'Web Security'
  | 'Vulnerability Assessment';

export interface PracticalLab {
  id: string;
  title: string;
  category: LabCategory;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  authorizedTarget: string;
  objective: string;
  scenarioBriefing: string;
  steps: Array<{
    id: string;
    instruction: string;
    expectedCommand?: string;
    validationRegex?: string;
  }>;
  hints: string[];
  expectedFlag: string;
  flagDescription: string;
  downloadableMaterials: DownloadableResource[];
  simulatedTerminalResponses: Record<string, string>;
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  targetRole: string;
  level: DifficultyLevel;
  estimatedWeeks: number;
  totalCourses: number;
  description: string;
  highlights: string[];
  courseCodes: string[];
  careerOutcome: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  role: string;
  companyOrOrg: string;
  avatar: string;
  rating: number;
  quote: string;
  courseCompleted: string;
  verificationBadge: string;
  isSample: boolean;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface AcademyStats {
  studentsEnrolled: string;
  completionRate: string;
  handsOnLabsCount: string;
  certificationsIssued: string;
  hiringPartners: string;
}
