import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Lock, 
  Server, 
  Layers,
  Award,
  CheckCircle,
  Play
} from 'lucide-react';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onExplorePaths: () => void;
  onOpenAuth: () => void;
}

export function HeroSection({ onExploreCourses, onExplorePaths, onOpenAuth }: HeroSectionProps) {
  const [terminalStep, setTerminalStep] = useState(0);

  const terminalLogs = [
    { cmd: 'nmap -sS -sV -p 22,80,443,8080 192.168.10.45', out: 'Host is up (0.00042s latency). Discovered open ports: 22/tcp (OpenSSH 8.9p1), 80/tcp (nginx 1.18.0), 443/tcp (TLSv1.3)' },
    { cmd: 'wireshark -r analysis.pcap -Y "tcp.flags.syn==1 && tcp.flags.ack==0"', out: 'TCP SYN stream identified: Source IP 10.14.0.12 beaconing to external C2 node on port 4444.' },
    { cmd: 'snort -q -A console -c /etc/snort/rules/local.rules -i eth0', out: '[**] [1:1000002:1] ALERT: Suspicious SQL Injection Signature in HTTP GET Payload [**]' },
    { cmd: 'iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP', out: 'Rule committed: Rate limiting brute-force attempts on SSH daemon.' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalStep((prev) => (prev + 1) % terminalLogs.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28">
      {/* Dynamic Background Glow & Grid */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/15 to-indigo-700/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Accreditation & Quality Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-md">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-semibold">SBCyberBasics Academy Standard</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Institutional Cybersecurity Education</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Structured Cybersecurity Education.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Engineered for Real Defense.
              </span>
            </h1>

            {/* Subtitle / Value Proposition */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              From raw Ethernet frames and Linux kernel permissions to ethical penetration testing, intrusion detection, and blockchain auditing. Gain structured, laboratory-tested competence with verifiable digital credentials.
            </p>

            {/* Trust bullet indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>100% Practical Labs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>7 Core Disciplines</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Zero Prior Coding Needed</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExploreCourses}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer font-mono"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Course Catalogue</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onExplorePaths}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 font-semibold text-sm transition-all active:scale-95 cursor-pointer font-mono"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Learning Paths</span>
              </button>
            </div>

            {/* Quick Registration Teaser */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex -space-x-2">
                <img className="w-7 h-7 rounded-full border-2 border-slate-950 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Student" />
                <img className="w-7 h-7 rounded-full border-2 border-slate-950 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Student" />
                <img className="w-7 h-7 rounded-full border-2 border-slate-950 object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Student" />
                <div className="w-7 h-7 rounded-full border-2 border-slate-950 bg-slate-800 text-cyan-400 font-mono text-[10px] font-bold flex items-center justify-center">
                  +14k
                </div>
              </div>
              <span>Join over <strong className="text-white font-mono">14,800+</strong> students building verified defense skills.</span>
            </div>

          </div>

          {/* Right Column: Simulated Live Cyber Terminal & Architecture Matrix */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-cyan-950/40 p-1">
              
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 rounded-t-xl border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    sbcyber-lab-workbench: ~/simulated-session
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Target: ACTIVE
                </span>
              </div>

              {/* Terminal Content Screen */}
              <div className="p-5 font-mono text-xs space-y-4 bg-slate-950/95 min-h-[290px] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-slate-500 text-[11px] leading-relaxed">
                    [SBCyberBasics v4.2.0-release - Educational Defense Sandbox]<br />
                    Connected to isolated VLAN: 192.168.10.0/24 | Mode: Real Packet Telemetry
                  </div>

                  {/* Active Simulated Command */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <span className="text-emerald-400 font-bold">student@academy:~$</span>
                      <span className="text-white font-semibold">{terminalLogs[terminalStep].cmd}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-[11px] leading-relaxed font-mono">
                      {terminalLogs[terminalStep].out}
                    </div>
                  </div>
                </div>

                {/* Status bar */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    Sandboxed Sandbox Runtime
                  </span>
                  <div className="flex gap-1.5">
                    {terminalLogs.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTerminalStep(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          terminalStep === i ? 'w-5 bg-cyan-400' : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                        aria-label={`Show command ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Feature Badges underneath terminal */}
              <div className="p-4 bg-slate-900/70 rounded-b-xl border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <Server className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">42+ Virtual Labs</div>
                    <div className="text-[10px] text-slate-400">In-browser CLI & packet trace</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Verifiable Certs</div>
                    <div className="text-[10px] text-slate-400">Unique cryptographic IDs</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
