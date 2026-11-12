import { LearningPath } from '../types';

export const LEARNING_PATHS_DATA: LearningPath[] = [
  {
    id: 'path-beginner-foundations',
    title: 'Cybersecurity Core Foundations Track',
    slug: 'cybersecurity-foundations',
    targetRole: 'Junior IT Security Technician / Associate Analyst',
    level: 'Beginner',
    estimatedWeeks: 12,
    totalCourses: 3,
    careerOutcome: 'Validates complete foundational competence across enterprise networks, Linux systems administration, and information security hygiene.',
    description: 'The mandatory starting point for anyone entering cyber defense or offensive security. Progress sequentially from physical networking packets to operating system internals and enterprise security standards.',
    highlights: [
      'Zero prior coding or cyber experience required',
      '42 interactive hands-on labs (Wireshark, Linux CLI, cryptography tools)',
      'Earn 3 individual digital certificates + Master Foundations Credential'
    ],
    courseCodes: ['NET-101', 'LIN-101', 'SEC-101']
  },
  {
    id: 'path-network-defense-soc',
    title: 'SOC Analyst & Network Defender Track',
    slug: 'network-defense-soc-analyst',
    targetRole: 'Tier 1/2 SOC Analyst / Blue Team Defense Engineer',
    level: 'Intermediate',
    estimatedWeeks: 16,
    totalCourses: 4,
    careerOutcome: 'Prepares graduates for real-world Security Operations Center roles with mastery over SIEM triage, Snort IDS rule-writing, PCAP forensics, and incident containment.',
    description: 'Specialized path for defenders. Gain deep expertise in monitoring high-traffic corporate perimeters, detecting stealthy adversaries, correlating alerts across cloud/on-prem, and containing breaches.',
    highlights: [
      'Simulated enterprise SOC environment with real traffic telemetry',
      '50+ hours of packet investigation and firewall rule engineering',
      'Direct mapping to NIST SP 800-61 and MITRE ATT&CK defensive matrices'
    ],
    courseCodes: ['NET-101', 'LIN-101', 'SEC-101', 'DEF-201']
  },
  {
    id: 'path-offensive-pentesting',
    title: 'Offensive Security & Ethical Hacker Track',
    slug: 'offensive-security-pentesting',
    targetRole: 'Penetration Tester / Junior Red Team Operator',
    level: 'Intermediate',
    estimatedWeeks: 18,
    totalCourses: 4,
    careerOutcome: 'Builds end-to-end offensive methodology from passive intelligence gathering through initial exploitation, privilege escalation, and executive reporting.',
    description: 'Learn to think and act like an adversary to expose critical flaws before malicious hackers do. Master reconnaissance, weaponization, custom exploit payloads, and lateral network movement.',
    highlights: [
      'Real-world vulnerable machine labs inspired by OSCP and PTES standards',
      'Comprehensive coverage of Nmap, Metasploit, Burp Suite, and Hashcat',
      'Hands-on vulnerability reporting portfolio deliverables'
    ],
    courseCodes: ['NET-101', 'LIN-101', 'HACK-201', 'WEB-301']
  },
  {
    id: 'path-appsec-web3',
    title: 'Modern Application & Web3 Security Track',
    slug: 'appsec-web3-security',
    targetRole: 'AppSec Engineer / Smart Contract Auditor',
    level: 'Advanced',
    estimatedWeeks: 14,
    totalCourses: 3,
    careerOutcome: 'Position yourself at the highest tier of software security, auditing complex cloud web applications and decentralized financial protocols.',
    description: 'Explore the modern attack surface: OWASP Top 10 web vulnerabilities, REST & GraphQL API security, serverless exploits, and Ethereum smart contract auditing.',
    highlights: [
      'In-depth Burp Suite interception & automated fuzzing',
      'Smart contract reentrancy and flash loan exploit simulations',
      'Static analysis and property-based automated security testing'
    ],
    courseCodes: ['SEC-101', 'WEB-301', 'BLK-301']
  }
];
