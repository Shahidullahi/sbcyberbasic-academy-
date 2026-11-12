import { Course } from '../types';

export const COURSES_DATA: Course[] = [
  {
    id: 'course-net-101',
    code: 'NET-101',
    slug: 'networking-fundamentals',
    title: 'Networking Fundamentals',
    category: 'Networking',
    level: 'Beginner',
    durationHours: 36,
    totalModules: 6,
    totalLabs: 14,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    enrolledStudentsCount: 3840,
    badgeName: 'Certified Network Associate (SBC-NET)',
    isFeatured: true,
    summary: 'Master computer networking architecture, the OSI 7-layer stack, TCP/IP protocol suite, IP addressing, subnetting, VLANs, and packet analysis.',
    description: 'A comprehensive foundational course modeled after elite industry networking benchmarks. Designed for aspiring security engineers, this course takes you from raw Ethernet frames through enterprise routing protocols, switching, IPv4/IPv6 subnetting, DNS/DHCP infrastructure, and real-world packet dissection using Wireshark.',
    learningObjectives: [
      'Analyze network traffic at bit and frame levels across all 7 layers of the OSI model',
      'Perform rapid IPv4 subnetting, VLSM calculations, and IPv6 address planning',
      'Configure and troubleshoot switches, routers, VLANs, and 802.1Q trunking',
      'Diagnose TCP 3-way handshakes, sequence/ACK tracking, and connection resets in Wireshark',
      'Implement core network infrastructure services: DNS, DHCP, NAT, and ARP inspection'
    ],
    prerequisites: ['Basic computer literacy', 'No prior networking or programming experience required'],
    instructor: {
      name: 'Engr. Marcus Vance',
      title: 'Principal Network Architect & CISSP',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    modules: [
      {
        id: 'mod-net-1',
        title: 'Module 1: Network Architectures & The OSI Reference Model',
        description: 'Physical topologies, LAN/WAN concepts, and deep-dive into Layers 1 through 7.',
        lessons: [
          { 
            id: 'les-net-1-1', 
            title: '1.1 Foundations of Digital Telecommunications', 
            duration: '24m', 
            type: 'video', 
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            transcriptSummary: 'This lecture establishes how data is transformed from electrical/optical signals into digital binary representations, covering baud rate, transmission media, and baseband vs broadband communications.',
            readingContent: `### Digital Telecommunications Overview\nEvery digital message traversing the internet begins as physical voltage differentials or laser pulses. In this lesson, we explore:\n- **Guided Media**: Twisted Pair (Cat6a/Cat7), Coaxial, Single-mode & Multi-mode Fiber Optics.\n- **Signaling**: Non-Return-to-Zero (NRZ), Manchester Encoding, and Differential Signaling.\n- **Duplexing**: Half-Duplex (CSMA/CD collisions) vs Full-Duplex switched infrastructure.`,
            resources: [
              {
                id: 'res-net-1',
                name: 'Physical Layer Signal Encoding Cheat Sheet',
                type: 'pdf',
                size: '1.2 MB',
                description: 'Overview of copper cabling standards, pinouts (T568A vs T568B), and fiber connectors.',
                filename: 'signal_encoding_standards.pdf'
              }
            ]
          },
          { 
            id: 'les-net-1-2', 
            title: '1.2 The 7 Layers of OSI vs. 4 Layers of TCP/IP', 
            duration: '32m', 
            type: 'video', 
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            transcriptSummary: 'Comprehensive comparison between ISO OSI 7-Layer theoretical abstraction and the pragmatic Department of Defense 4-Layer TCP/IP stack.',
            readingContent: `### The OSI Reference Model & Encapsulation\nData encapsulation moves down the stack: Data -> Segment (L4 Transport) -> Packet (L3 Network) -> Frame (L2 Data Link) -> Bits (L1 Physical).\n\n\`\`\`\n[ Application (L7) ] -> HTTP/DNS/SSH Payload\n[ Presentation (L6) ] -> TLS Encryption / JSON Encoding\n[ Session (L5) ] -> RPC / Socket State\n[ Transport (L4) ] -> TCP/UDP Header (Ports + Sequence)\n[ Network (L3) ] -> IP Header (Src IP / Dst IP / TTL)\n[ Data Link (L2) ] -> Ethernet Frame (Src MAC / Dst MAC / CRC)\n[ Physical (L1) ] -> Bitstream Signals\n\`\`\``,
            resources: [
              {
                id: 'res-net-2',
                name: 'OSI 7-Layer Protocol Reference Chart',
                type: 'cheatsheet',
                size: '850 KB',
                description: 'Full chart mapping protocols, PDUs, and headers from Layer 1 to Layer 7.',
                filename: 'osi_protocol_matrix.pdf'
              }
            ]
          },
          { 
            id: 'les-net-1-3', 
            title: '1.3 Protocol Data Units (PDUs) & Encapsulation Drill', 
            duration: '18m', 
            type: 'reading',
            readingContent: `### Encapsulation and De-encapsulation Mechanics\nWhen your browser requests a web page, the operating system kernel constructs protocol headers in reverse sequence upon arrival.\n\nKey Concepts:\n1. **MTU (Maximum Transmission Unit)**: Standard Ethernet frame maximum payload is 1500 bytes.\n2. **FCS (Frame Check Sequence)**: 32-bit Cyclic Redundancy Check (CRC) at the Ethernet trailer verifying frame integrity.\n3. **EtherType Field**: Declares next header (0x0800 for IPv4, 0x86DD for IPv6, 0x0806 for ARP).`,
            resources: [
              {
                id: 'res-net-3',
                name: 'Frame Structure Dissection Guide',
                type: 'cheatsheet',
                size: '500 KB',
                description: 'Detailed bit layout of Ethernet II, 802.3, and VLAN tagged frames.',
                filename: 'ethernet_frame_layout.pdf'
              }
            ]
          },
          { 
            id: 'les-net-1-4', 
            title: '1.4 Hands-on Lab: Dissecting Ethernet Frames in Wireshark', 
            duration: '45m', 
            type: 'lab',
            practicalAssignment: {
              id: 'lab-net-1-4',
              title: 'Practical Lab: Wireshark Frame Dissection',
              objective: 'Analyze an enterprise packet capture file to identify MAC address spoofing and inspect IP header checksums.',
              scenario: 'An intrusion prevention alert recorded abnormal broadcast traffic originating on VLAN 10. You have been provided the raw packet capture `network_baseline.pcap`.',
              targetEnvironment: 'Wireshark 4.0 / TShark Terminal Sandbox',
              steps: [
                'Download `network_baseline.pcap` from the resources below.',
                'Open the file and apply the display filter: `eth.type == 0x0800 && ip.src == 192.168.10.45`.',
                'Inspect Packet #14: Locate the Ethernet source MAC address and vendor OUI.',
                'Examine the IP header Time-to-Live (TTL) field and determine the originating operating system.',
                'Submit the extracted MAC address and initial TTL value in the completion box below.'
              ],
              verificationCriteria: 'Accurately submit the source MAC address and TTL value discovered in Packet #14.',
              hints: [
                'MAC addresses are formatted as 6 hex octets: XX:XX:XX:XX:XX:XX.',
                'Linux default TTL is typically 64, while Windows is 128.'
              ],
              sampleDeliverableHint: 'Format: MAC: 00:0c:29:4f:8e:12 | TTL: 64'
            },
            resources: [
              {
                id: 'res-pcap-1',
                name: 'network_baseline.pcap',
                type: 'pcap',
                size: '2.4 MB',
                description: 'Raw Wireshark capture of enterprise VLAN 10 baseline broadcast and unicast frames.',
                filename: 'network_baseline.pcap',
                mockDownloadContent: 'PCAP_RAW_BINARY_DUMP_VLAN10_BASELINE_PACKET_STREAM_SBCYBERBASICS'
              }
            ]
          }
        ]
      },
      {
        id: 'mod-net-2',
        title: 'Module 2: IPv4, Subnetting & CIDR Calculation',
        description: 'Binary arithmetic, classless inter-domain routing, and VLSM network design.',
        lessons: [
          { 
            id: 'les-net-2-1', 
            title: '2.1 Binary to Decimal Conversion & IP Structure', 
            duration: '28m', 
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            transcriptSummary: 'Step-by-step masterclass on binary weights (128, 64, 32, 16, 8, 4, 2, 1) and converting 32-bit IPv4 addresses into dotted-decimal notation.',
            readingContent: `### IPv4 Address Structure\nAn IPv4 address consists of 32 bits divided into 4 octets of 8 bits each. The boundary between Network ID and Host ID is defined exclusively by the Subnet Mask.\n\nExample: \`192.168.1.10 /24\`\n- Subnet Mask: \`255.255.255.0\` (24 contiguous binary 1s followed by 8 binary 0s)\n- Total Host Bits = 8\n- Usable Hosts = 2^8 - 2 = 254 (minus Network and Broadcast addresses).`
          },
          { 
            id: 'les-net-2-2', 
            title: '2.2 Mastering Subnet Masks, Network & Broadcast IPs', 
            duration: '40m', 
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            transcriptSummary: 'How routers perform bitwise AND operations between destination IP addresses and subnet masks to determine routing table egress interfaces.'
          },
          { 
            id: 'les-net-2-3', 
            title: '2.3 Variable Length Subnet Masking (VLSM) Blueprint', 
            duration: '35m', 
            type: 'reading',
            readingContent: `### VLSM Design Principles\nVLSM allows engineers to allocate subnet masks based on specific departmental requirements rather than wasteful fixed-length boundaries.\n\nRule of thumb: Always satisfy the largest host requirements first, and use \`/30\` or \`/31\` masks for point-to-point router links.`
          },
          { 
            id: 'les-net-2-4', 
            title: '2.4 Subnetting Speed Drill & Knowledge Check', 
            duration: '30m', 
            type: 'quiz',
            quizQuestions: [
              {
                id: 'q-net-2-1',
                prompt: 'Given the network IP 172.16.0.0/20, what is the valid broadcast address for this subnet?',
                options: [
                  '172.16.20.255',
                  '172.16.15.255',
                  '172.16.255.255',
                  '172.16.31.255'
                ],
                correctOptionIndex: 1,
                explanation: 'A /20 subnet mask is 255.255.240.0. The block size in the 3rd octet is 256 - 240 = 16. The range is 172.16.0.0 through 172.16.15.255.'
              },
              {
                id: 'q-net-2-2',
                prompt: 'How many usable host IP addresses are available in a /28 subnet?',
                options: ['16', '14', '30', '12'],
                correctOptionIndex: 1,
                explanation: 'A /28 mask leaves 32 - 28 = 4 host bits. 2^4 - 2 = 16 - 2 = 14 usable hosts.'
              },
              {
                id: 'q-net-2-3',
                prompt: 'Which subnet mask is most efficient for a point-to-point connection between two routers with no other hosts?',
                options: ['255.255.255.248 (/29)', '255.255.255.252 (/30)', '255.255.255.0 (/24)', '255.255.255.240 (/28)'],
                correctOptionIndex: 1,
                explanation: 'A /30 mask provides exactly 2 usable host IP addresses (2^2 - 2 = 2), leaving zero wasted addresses.'
              }
            ]
          }
        ]
      },
      {
        id: 'mod-net-3',
        title: 'Module 3: Transport Layer & TCP/UDP Connection Dynamics',
        description: 'TCP reliability, sliding windows, UDP multiplexing, and port management.',
        lessons: [
          {
            id: 'les-net-3-1',
            title: '3.1 TCP 3-Way Handshake & Teardowns',
            duration: '30m',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            transcriptSummary: 'Deep examination of SYN, SYN-ACK, ACK handshake sequencing, window sizing, and FIN vs RST connection termination.'
          },
          {
            id: 'les-net-3-2',
            title: '3.2 UDP Characteristics in Real-time Applications',
            duration: '20m',
            type: 'reading',
            readingContent: `### User Datagram Protocol (UDP)\nUDP is a connectionless, best-effort transport layer protocol with an 8-byte header:\n- Source Port (16 bits)\n- Destination Port (16 bits)\n- Length (16 bits)\n- Checksum (16 bits)\n\nIdeal for DNS queries, DHCP broadcasts, VoIP, and video streaming where low latency supersedes guaranteed retransmission.`
          },
          {
            id: 'les-net-3-3',
            title: '3.3 Lab: Capturing SYN Floods & TCP Resets',
            duration: '50m',
            type: 'lab',
            practicalAssignment: {
              id: 'lab-net-3-3',
              title: 'Analyzing a TCP SYN Flood Denial-of-Service',
              objective: 'Inspect a malicious traffic capture to identify spoofed TCP SYN packets overwhelming a web server.',
              scenario: 'An edge web server stopped responding to legitimate HTTP requests. Network telemetry recorded 100,000+ incomplete TCP handshakes in under 30 seconds.',
              targetEnvironment: 'Wireshark / TShark',
              steps: [
                'Download `syn_flood_capture.pcap` from the resources tab.',
                'Filter for unacknowledged SYNs: `tcp.flags.syn == 1 && tcp.flags.ack == 0`.',
                'Calculate the percentage of incomplete handshakes vs completed sessions.',
                'Identify the targeted destination port.'
              ],
              verificationCriteria: 'Confirm targeted destination port and identify whether source IPs are randomized or static.',
              hints: ['Look at Conversations -> TCP tab in Wireshark to see incomplete connections.'],
              sampleDeliverableHint: 'Port 80/tcp, randomized spoofed /24 subnets'
            },
            resources: [
              {
                id: 'res-pcap-2',
                name: 'syn_flood_capture.pcap',
                type: 'pcap',
                size: '3.8 MB',
                description: 'Packet trace of volumetric SYN flood attack on enterprise perimeter.',
                filename: 'syn_flood_capture.pcap'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-lin-101',
    code: 'LIN-101',
    slug: 'linux-fundamentals',
    title: 'Linux Fundamentals for Cybersecurity',
    category: 'Linux',
    level: 'Beginner',
    durationHours: 32,
    totalModules: 5,
    totalLabs: 16,
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    enrolledStudentsCount: 4210,
    badgeName: 'Certified Linux Cyber Practitioner (SBC-LIN)',
    isFeatured: true,
    summary: 'The command-line mastery every security engineer needs: file permissions, process inspection, bash scripting, systemd, SSH, and server hardening.',
    description: 'Linux is the backbone of the internet, cloud infrastructure, and offensive/defensive cyber toolkits. This hands-on course equips students with terminal fluency, Bash automation, regex text manipulation, security permissions (chmod/chown/SUID), cron task scheduling, and defense-grade host hardening.',
    learningObjectives: [
      'Navigate the Linux Filesystem Hierarchy Standard (FHS) from command line without GUI',
      'Audit and set POSIX permissions, ACLs, SUID/SGID, and sticky bits',
      'Inspect running processes, network sockets, logs, and systemd services',
      'Automate reconnaissance and log parsing using Bash, awk, sed, and grep',
      'Harden an enterprise Linux server against unauthorized SSH access and privilege escalation'
    ],
    prerequisites: ['Basic computer usage'],
    instructor: {
      name: 'Dr. Tariq Al-Mansoor',
      title: 'DevSecOps Specialist & Linux Foundation Fellow',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    modules: [
      {
        id: 'mod-lin-1',
        title: 'Module 1: The Linux Terminal & Shell Architecture',
        description: 'Navigating Debian/RHEL systems, core utilities, redirection, and piping.',
        lessons: [
          {
            id: 'les-lin-1-1',
            title: '1.1 Terminal Emulators, Shells & Kernel Interfaces',
            duration: '20m',
            type: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            transcriptSummary: 'Introduction to standard POSIX shells, Bash environment variables, PATH configuration, and kernel system call interfaces.',
            readingContent: `### Core Linux Concepts\n- **Kernel**: Manages CPU scheduling, virtual memory, and hardware devices.\n- **Shell**: Command language interpreter executing builtin commands or spawning binary subprocesses.\n- **Standard Streams**: stdin (0), stdout (1), stderr (2).`,
            resources: [
              {
                id: 'res-lin-1',
                name: 'Linux Command Line Quick Reference',
                type: 'cheatsheet',
                size: '920 KB',
                description: 'Essential commands: ls, grep, find, awk, sed, ps, ss, systemctl.',
                filename: 'linux_cli_reference.pdf'
              }
            ]
          },
          {
            id: 'les-lin-1-2',
            title: '1.2 Navigating the FHS: /etc, /var, /proc, /dev',
            duration: '26m',
            type: 'reading',
            readingContent: `### Filesystem Hierarchy Standard (FHS)\n- \`/etc\`: Host-specific configuration files (passwd, shadow, sudoers, sshd_config).\n- \`/var/log\`: System telemetry and audit trails (auth.log, syslog, journal).\n- \`/proc\`: Pseudo-filesystem exposing kernel state and process memory.\n- \`/dev\`: Special device nodes (null, zero, random, sda).`
          },
          {
            id: 'les-lin-1-3',
            title: '1.3 Standard Input, Output, Error & Pipes (|)',
            duration: '24m',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
          },
          {
            id: 'les-lin-1-4',
            title: '1.4 Hands-on Lab: Terminal Navigation & File Wrangling',
            duration: '40m',
            type: 'lab',
            practicalAssignment: {
              id: 'lab-lin-1-4',
              title: 'Hunting Hidden Flags in the Linux Filesystem',
              objective: 'Use find, grep, and file permissions to discover a hidden security token inside a restricted system directory.',
              scenario: 'A rogue background service left an authorization artifact in an obscure subdirectory under `/var` or `/tmp`.',
              targetEnvironment: 'Ubuntu 22.04 LTS Terminal Simulator',
              steps: [
                'Execute `find /var -type f -name "*secret*" 2>/dev/null`.',
                'Examine file permissions using `ls -la`.',
                'Extract the base64 encoded flag string and decode it with `base64 -d`.',
                'Submit the decoded flag below.'
              ],
              verificationCriteria: 'Submit the exact decoded string from the hidden flag file.',
              hints: ['Use `2>/dev/null` to suppress permission denied errors during find scans.'],
              sampleDeliverableHint: 'SBC{l1nux_f1l35y5t3m_m45t3r3d}'
            }
          }
        ]
      },
      {
        id: 'mod-lin-2',
        title: 'Module 2: File Security, Permissions & Special Bits',
        description: 'Read/write/execute modes, octal representation, SUID, SGID, and Sticky Bits.',
        lessons: [
          {
            id: 'les-lin-2-1',
            title: '2.1 Dissecting Permissions: User, Group, Others',
            duration: '28m',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
          },
          {
            id: 'les-lin-2-2',
            title: '2.2 Dangerous SUID Binaries & Privilege Exploitation',
            duration: '35m',
            type: 'reading',
            readingContent: `### Setuid (SUID) Security Risks\nWhen the SUID bit (octal 4000) is set on an executable file, any unprivileged user running that binary executes with the privileges of the file owner (often root).\n\nAuditing Command:\n\`find / -perm -4000 -type f 2>/dev/null\`\n\nIf misconfigured utilities like \`find\`, \`nmap\`, or \`vim\` have SUID set, an attacker can spawn an unrestricted root shell (GTFOBins pattern).`
          },
          {
            id: 'les-lin-2-3',
            title: '2.3 Lab: Auditing World-Writable Files & SUID Escalation',
            duration: '50m',
            type: 'lab'
          }
        ]
      }
    ]
  },
  {
    id: 'course-sec-101',
    code: 'SEC-101',
    slug: 'cybersecurity-fundamentals',
    title: 'Cybersecurity Fundamentals',
    category: 'Cybersecurity',
    level: 'Beginner',
    durationHours: 30,
    totalModules: 5,
    totalLabs: 12,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    enrolledStudentsCount: 5120,
    badgeName: 'Certified Cybersecurity Practitioner (SBC-SEC)',
    isFeatured: true,
    summary: 'The bedrock of modern digital defense: CIA triad, threat landscape, cryptography, identity & access management, risk analysis, and incident frameworks.',
    description: 'An authoritative introduction to the foundational principles governing global information security. Students explore core security architecture, authentication standards (OAuth, SAML, MFA), public-key cryptography (RSA, ECC, AES), social engineering tactics, and governance models including NIST CSF and ISO 27001.',
    learningObjectives: [
      'Apply the CIA Triad and Defense-in-Depth principles to real-world infrastructure',
      'Distinguish symmetric from asymmetric cryptography and evaluate hashing algorithms',
      'Identify threat actors, attack vectors, and advanced persistent threat (APT) lifecycles',
      'Implement multi-factor authentication, least privilege, and role-based access control',
      'Execute an initial incident triage adhering to the NIST SP 800-61 framework'
    ],
    prerequisites: ['Basic understanding of operating systems and networking concepts'],
    instructor: {
      name: 'Elena Rostova',
      title: 'Former CISO & Cyber Defense Strategist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    modules: [
      {
        id: 'mod-sec-1',
        title: 'Module 1: The Core Security Triad & Threat Landscape',
        description: 'Confidentiality, Integrity, Availability, threat actors, and attack surfaces.',
        lessons: [
          {
            id: 'les-sec-1-1',
            title: '1.1 The CIA Triad & Non-Repudiation',
            duration: '20m',
            type: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
            transcriptSummary: 'Exploration of confidentiality controls (encryption), integrity mechanisms (cryptographic hashes, digital signatures), and availability (redundancy, failover, anti-DDoS).'
          },
          {
            id: 'les-sec-1-2',
            title: '1.2 Threat Actor Typologies: Script Kiddies to Nation States',
            duration: '26m',
            type: 'video'
          },
          {
            id: 'les-sec-1-3',
            title: '1.3 The Cyber Kill Chain vs. MITRE ATT&CK Matrix',
            duration: '34m',
            type: 'reading'
          }
        ]
      }
    ]
  },
  {
    id: 'course-hack-201',
    code: 'HACK-201',
    slug: 'ethical-hacking',
    title: 'Ethical Hacking & Penetration Testing',
    category: 'Ethical Hacking',
    level: 'Intermediate',
    durationHours: 48,
    totalModules: 7,
    totalLabs: 24,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    enrolledStudentsCount: 3120,
    badgeName: 'Certified Ethical Penetration Tester (SBC-CEPT)',
    isFeatured: true,
    summary: 'Master real-world offensive techniques: passive/active reconnaissance, vulnerability assessment, weaponization, Metasploit, password cracking, and post-exploitation.',
    description: 'Conducted under a strict ethical framework and legal guidelines, this intense course teaches offensive security from the mindset of skilled adversarial actors. You will learn Nmap scripting engine (NSE), Burp Suite, Hydra, Hashcat, Metasploit Framework, privilege escalation on Windows and Linux, and responsible vulnerability disclosure.',
    learningObjectives: [
      'Conduct active and passive OSINT reconnaissance without triggering defense alarms',
      'Discover and exploit unpatched CVE vulnerabilities using Metasploit and manual proof-of-concepts',
      'Execute dictionary, rule-based, and brute-force password recovery attacks with Hashcat',
      'Elevate user privileges to root on Linux via kernel flaws, misconfigurations, and cron exploitation',
      'Author formal penetration test reports with executive summaries and remediation roadmaps'
    ],
    prerequisites: ['NET-101: Networking Fundamentals', 'LIN-101: Linux Fundamentals'],
    instructor: {
      name: 'Kofi Mensah',
      title: 'Lead Red Team Operator & OSCP/OSCE',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    modules: [
      {
        id: 'mod-hack-1',
        title: 'Module 1: Ethical Hacking Laws, Ethics & Scoping',
        description: 'Rules of Engagement, legal authorization, scoping, and methodology frameworks.',
        lessons: [
          {
            id: 'les-hack-1-1',
            title: '1.1 Rules of Engagement & Computer Fraud Laws',
            duration: '22m',
            type: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          },
          {
            id: 'les-hack-1-2',
            title: '1.2 Penetration Testing Execution Standard (PTES)',
            duration: '28m',
            type: 'reading'
          }
        ]
      }
    ]
  },
  {
    id: 'course-def-201',
    code: 'DEF-201',
    slug: 'network-defense',
    title: 'Network Defense & Incident Response',
    category: 'Network Defense',
    level: 'Intermediate',
    durationHours: 42,
    totalModules: 6,
    totalLabs: 18,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    enrolledStudentsCount: 2850,
    badgeName: 'Certified Cyber Defense Analyst (SBC-CCDA)',
    isFeatured: true,
    summary: 'Build resilient defense architectures: next-gen firewalls, IDS/IPS rule writing (Snort/Suricata), SIEM log correlation, Wireshark forensics, and active hunting.',
    description: 'Step into the shoes of a Security Operations Center (SOC) Tier 2 analyst. This course focuses on tactical defense: designing zero-trust boundaries, configuring stateful and application firewalls, tuning Snort and Suricata detection rules, analyzing threat telemetry in Wazuh/Elastic SIEM, and executing structured threat containment.',
    learningObjectives: [
      'Design segmented network architectures enforcing Zero Trust Access principles',
      'Author and test custom Snort/Suricata intrusion detection signatures',
      'Ingest and correlate multi-source syslogs within an enterprise SIEM stack',
      'Detect covert command-and-control (C2) beaconing in deep Wireshark PCAPs',
      'Contain compromised nodes and preserve forensic evidence during active breaches'
    ],
    prerequisites: ['NET-101: Networking Fundamentals', 'SEC-101: Cybersecurity Fundamentals'],
    instructor: {
      name: 'Sarah Jenkins',
      title: 'Senior Incident Responder & SOC Lead',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    modules: [
      {
        id: 'mod-def-1',
        title: 'Module 1: Defense-in-Depth & Zero Trust Architecture',
        description: 'Perimeter defense, DMZs, micro-segmentation, and zero trust policies.',
        lessons: [
          {
            id: 'les-def-1-1',
            title: '1.1 The Evolution from Castle-and-Moat to Zero Trust',
            duration: '24m',
            type: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'course-web-301',
    code: 'WEB-301',
    slug: 'web-application-security',
    title: 'Web Application Security',
    category: 'Web Security',
    level: 'Intermediate',
    durationHours: 38,
    totalModules: 5,
    totalLabs: 20,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    enrolledStudentsCount: 2430,
    badgeName: 'Certified Web Application Defender (SBC-CWAD)',
    isFeatured: false,
    summary: 'Deep-dive into the OWASP Top 10: SQL injection, Cross-Site Scripting (XSS), CSRF, Server-Side Request Forgery (SSRF), broken authentication, and API security.',
    description: 'Modern cyber attacks overwhelmingly target the web layer. This course walks you through attacking and defending web applications, modern Single Page Apps, RESTful APIs, and GraphQL endpoints. Learn to exploit flaws using Burp Suite and inspect source code to implement robust sanitization and CSP defenses.',
    learningObjectives: [
      'Identify and remediate all categories of the OWASP Top 10 vulnerabilities',
      'Execute union, error, and blind SQL injection with manual tampering and sqlmap',
      'Exploit reflected, stored, and DOM-based Cross-Site Scripting (XSS)',
      'Intercept and tamper with JSON Web Tokens (JWT) and API authentication headers',
      'Deploy strong Content Security Policy (CSP) and secure session management'
    ],
    prerequisites: ['NET-101: Networking Fundamentals', 'Basic HTML/JS and HTTP understanding'],
    instructor: {
      name: 'Maya Chen',
      title: 'Principal AppSec Engineer & Bug Bounty Hunter',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    },
    modules: [
      {
        id: 'mod-web-1',
        title: 'Module 1: Web Architecture, HTTP/HTTPS & Burp Suite Proxy',
        description: 'HTTP request headers, cookies, sessions, and configuring Burp Suite interception.',
        lessons: [
          {
            id: 'les-web-1-1',
            title: '1.1 Deep Dive into HTTP/1.1 and HTTP/2 Protocol',
            duration: '22m',
            type: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'course-blk-301',
    code: 'BLK-301',
    slug: 'blockchain-security',
    title: 'Blockchain Security & Smart Contract Auditing',
    category: 'Blockchain',
    level: 'Advanced',
    durationHours: 35,
    totalModules: 5,
    totalLabs: 15,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    enrolledStudentsCount: 1680,
    badgeName: 'Certified Smart Contract Auditor (SBC-CSCA)',
    isFeatured: false,
    summary: 'Analyze cryptographic consensus, Ethereum Virtual Machine (EVM) architecture, smart contract vulnerabilities, reentrancy attacks, flash loan exploits, and formal verification.',
    description: 'Smart contracts handle billions in value with irreversible code execution. This cutting-edge curriculum covers consensus vulnerability vectors (51% attacks, eclipse attacks), Solidity security pitfalls (reentrancy, integer overflows, access control bugs), and security auditing methodologies using Slither, Echidna, and Foundry.',
    learningObjectives: [
      'Deconstruct the Ethereum Virtual Machine (EVM) opcode execution model and gas mechanics',
      'Detect and exploit historic vulnerabilities: The DAO reentrancy, Parity multi-sig bug',
      'Audit Solidity code for front-running, flash loan manipulation, and oracle desynchronization',
      'Employ static analysis tools (Slither, Mythril) and fuzzing test suites',
      'Draft formal security audit reports for decentralized protocols'
    ],
    prerequisites: ['SEC-101: Cybersecurity Fundamentals', 'Basic programming knowledge in JS/Python/Solidity'],
    instructor: {
      name: 'Alexander Novak',
      title: 'Lead Web3 Security Auditor & Protocol Researcher',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
    },
    modules: [
      {
        id: 'mod-blk-1',
        title: 'Module 1: Blockchain Architecture & Cryptographic Primitives',
        description: 'Merkle trees, SHA-256, Keccak-256, ECDSA, and consensus algorithms (PoW/PoS).',
        lessons: [
          {
            id: 'les-blk-1-1',
            title: '1.1 Cryptographic Guarantees of Distributed Ledgers',
            duration: '24m',
            type: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          }
        ]
      }
    ]
  }
];
