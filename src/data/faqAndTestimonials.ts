import { Testimonial, FaqItem, AcademyStats } from '../types';

export const ACADEMY_STATS: AcademyStats = {
  studentsEnrolled: '14,850+',
  completionRate: '94.2%',
  handsOnLabsCount: '119+',
  certificationsIssued: '9,420+',
  hiringPartners: '180+'
};

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    studentName: 'Amina Al-Hassan',
    role: 'Junior SOC Analyst',
    companyOrOrg: 'FinTech Secure Ops (Sample Graduate Profile)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'Before SBCyberBasics, I had no technical confidence in networking or Linux. The sequential approach—first understanding OSI packets, then Linux permissions, and finally live Snort IDS rules—was phenomenal. The labs gave me exact talking points for my SOC interviews.',
    courseCompleted: 'SOC Analyst & Network Defender Track',
    verificationBadge: 'Verified Credential: SBC-2026-CCDA',
    isSample: true
  },
  {
    id: 'test-2',
    studentName: 'David Chen',
    role: 'Associate Penetration Tester',
    companyOrOrg: 'CyberSentinel Labs (Sample Graduate Profile)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'The Ethical Hacking course did not just teach me how to launch Metasploit modules blindly. It forced me to dissect the underlying protocol flaws, write clear remediation write-ups, and understand defensive mitigations. It feels like Cisco Academy quality with a razor-sharp security focus.',
    courseCompleted: 'Offensive Security & Ethical Hacker Track',
    verificationBadge: 'Verified Credential: SBC-2026-CEPT',
    isSample: true
  },
  {
    id: 'test-3',
    studentName: 'Zainab Bello',
    role: 'Infrastructure Security Engineer',
    companyOrOrg: 'CloudGrid Systems (Sample Graduate Profile)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'The Linux Fundamentals and Networking Fundamentals courses alone saved me hundreds of hours of trial and error. The in-browser labs and packet analysis files were immediately applicable to the enterprise Linux servers I maintain daily.',
    courseCompleted: 'Cybersecurity Core Foundations Track',
    verificationBadge: 'Verified Credential: SBC-2026-NET',
    isSample: true
  },
  {
    id: 'test-4',
    studentName: 'Lucas Morales',
    role: 'Web Application Security Consultant',
    companyOrOrg: 'AppDefend Advisory (Sample Graduate Profile)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'Finding high-quality, non-gimmicky training on Web App Security and Smart Contract auditing in one single platform is rare. The modules on SSRF, JWT tampering, and reentrancy are world-class.',
    courseCompleted: 'Modern Application & Web3 Security Track',
    verificationBadge: 'Verified Credential: SBC-2026-CWAD',
    isSample: true
  }
];

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Prerequisites & Starting Out',
    question: 'Do I need prior coding or cybersecurity experience to get started?',
    answer: 'No prior technical experience is required for our beginner courses! We recommend starting with our "Cybersecurity Core Foundations Track", which begins with Networking Fundamentals (NET-101) and Linux Fundamentals (LIN-101). These courses build foundational skills step-by-step from raw concepts up to advanced commands.'
  },
  {
    id: 'faq-2',
    category: 'Curriculum & Hands-on Labs',
    question: 'How are the practical hands-on laboratories delivered?',
    answer: 'Every module pairs conceptual lectures with practical exercises. You gain access to real downloadable network captures (PCAP files), interactive terminal simulators, configuration files, and guided step-by-step walkthroughs so you build real muscle memory rather than just memorizing definitions.'
  },
  {
    id: 'faq-3',
    category: 'Certifications & Credentials',
    question: 'How do certificates work and can employers verify them?',
    answer: 'Upon completing 100% of the lessons in a course and achieving at least 75% on the proctored module quizzes and final examination, you earn an official digital Certificate of Completion. Each certificate includes a unique cryptographic verification ID (e.g., SBC-2026-NET01) that employers can look up instantly on our public verification portal.'
  },
  {
    id: 'faq-4',
    category: 'Pacing & Scheduling',
    question: 'Is the curriculum self-paced or cohort-based?',
    answer: 'All SBCyberBasics Academy courses are 100% self-paced with lifetime access to enrolled materials. You can study on your own schedule whether you have 3 hours a week or 20 hours a week, and replay video lectures and quizzes as many times as you need.'
  },
  {
    id: 'faq-5',
    category: 'Academic Standards',
    question: 'How is this curriculum organized compared to Cisco Networking Academy?',
    answer: 'SBCyberBasics Academy applies the same rigorous instructional design principles pioneered by institutional academies: modular prerequisites, objective-based competencies, structured assessments, and hands-on laboratory reinforcement. However, our content is 100% original and specifically targeted toward high-demand modern cybersecurity disciplines including ethical hacking, threat hunting, and blockchain security.'
  },
  {
    id: 'faq-6',
    category: 'Enterprise & Academic Groups',
    question: 'Do you support universities, colleges, and corporate training cohorts?',
    answer: 'Yes. SBCyberBasics Academy provides dedicated Instructor and Administrator portals allowing academic institutions and corporate security teams to track cohort progress, assign custom deadlines, review practical assignments, and manage group enrollments.'
  }
];
