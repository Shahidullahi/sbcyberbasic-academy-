import { useState, useEffect, useRef } from 'react';
import { PracticalLab, LabCategory, DownloadableResource } from '../types';
import { CYBER_LABS_DATA } from '../data/cyberLabsData';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  Terminal, 
  ShieldAlert, 
  CheckCircle2, 
  Download, 
  AlertTriangle, 
  Lock, 
  Server, 
  Play, 
  HelpCircle, 
  Layers, 
  Cpu, 
  Sparkles,
  ArrowRight,
  Send,
  RotateCcw,
  BookOpen,
  Check
} from 'lucide-react';

interface LabsWorkbenchPageProps {
  onBackToDashboard: () => void;
}

export function LabsWorkbenchPage({ onBackToDashboard }: LabsWorkbenchPageProps) {
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLab, setActiveLab] = useState<PracticalLab>(CYBER_LABS_DATA[0]);
  
  // Terminal simulator state
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'cmd' | 'out' | 'err' | 'info'; text: string }>>([
    { type: 'info', text: '[SBCyberBasics Academy - Practical Cyber Laboratory Sandbox v4.2]' },
    { type: 'info', text: 'Target network: 10.10.10.0/24 | Isolated Training Environment' },
    { type: 'info', text: 'Type "help" to view lab hints or enter standard Linux/security commands.' }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Student progress on current lab
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [submittedFlag, setSubmittedFlag] = useState('');
  const [isLabCompleted, setIsLabCompleted] = useState(false);
  const [flagFeedback, setFlagFeedback] = useState<string | null>(null);

  // Cloud Firestore lab completion records
  const [savedCompletedLabIds, setSavedCompletedLabIds] = useState<string[]>([]);

  // Load student lab progress from Firestore
  useEffect(() => {
    const fetchLabStatus = async () => {
      if (!user) return;
      try {
        const labDoc = doc(db, 'users', user.uid, 'labProgress', activeLab.id);
        const snap = await getDoc(labDoc);
        if (snap.exists()) {
          const data = snap.data();
          setIsLabCompleted(data.isCompleted || false);
          setCompletedStepIds(data.completedSteps || []);
        } else {
          setIsLabCompleted(false);
          setCompletedStepIds([]);
        }
      } catch (e) {
        console.warn('Lab progress load note:', e);
      }
    };
    fetchLabStatus();
  }, [user, activeLab.id]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const categories: Array<'All' | LabCategory> = [
    'All',
    'Linux Fundamentals',
    'Networking',
    'Nmap Scanning',
    'Wireshark Analysis',
    'Snort IDS/IPS',
    'Web Security',
    'Vulnerability Assessment'
  ];

  const filteredLabs = selectedCategory === 'All'
    ? CYBER_LABS_DATA
    : CYBER_LABS_DATA.filter(l => l.category === selectedCategory);

  const handleSelectLab = (lab: PracticalLab) => {
    setActiveLab(lab);
    setCompletedStepIds([]);
    setIsLabCompleted(false);
    setSubmittedFlag('');
    setFlagFeedback(null);
    setTerminalHistory([
      { type: 'info', text: `[Active Exercise]: ${lab.title}` },
      { type: 'info', text: `Authorized Target: ${lab.authorizedTarget}` },
      { type: 'info', text: 'Type commands into prompt below. Strict educational rules of engagement apply.' }
    ]);
  };

  // Safe Terminal Command Processor
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = commandInput.trim();
    if (!cleanCmd) return;

    // Echo input
    const newHistory = [...terminalHistory, { type: 'cmd' as const, text: cleanCmd }];

    // 1. Guardrail against external attack targets
    const forbiddenPatterns = [/google\.com/i, /yahoo\.com/i, /microsoft\.com/i, /8\.8\.8\.8/, /1\.1\.1\.1/];
    const isTargetingUnauthorized = forbiddenPatterns.some(regex => regex.test(cleanCmd));

    if (isTargetingUnauthorized) {
      newHistory.push({
        type: 'err',
        text: `[POLICY VIOLATION]: Commands are restricted exclusively to authorized training target [${activeLab.authorizedTarget}]. Scanning or targeting public external infrastructure is strictly blocked.`
      });
      setTerminalHistory(newHistory);
      setCommandInput('');
      return;
    }

    // 2. Builtin utilities
    if (cleanCmd === 'clear') {
      setTerminalHistory([]);
      setCommandInput('');
      return;
    }

    if (cleanCmd === 'help') {
      newHistory.push({
        type: 'info',
        text: `Available utilities in this sandbox: nmap, wireshark, tshark, snort, find, ls, cat, id, whoami, curl, ip, arp, cvss-calc, clear.\nTarget environment: ${activeLab.authorizedTarget}`
      });
      setTerminalHistory(newHistory);
      setCommandInput('');
      return;
    }

    // 3. Search simulated response map
    let response = activeLab.simulatedTerminalResponses[cleanCmd];

    // Fuzzy matching for arguments
    if (!response) {
      const matchingKey = Object.keys(activeLab.simulatedTerminalResponses).find(k => 
        cleanCmd.startsWith(k.split(' ')[0]) && (cleanCmd.includes(k.split(' ')[1] || ''))
      );
      if (matchingKey) {
        response = activeLab.simulatedTerminalResponses[matchingKey];
      }
    }

    if (response) {
      newHistory.push({ type: 'out', text: response });

      // Automatically validate steps based on executed command
      activeLab.steps.forEach(step => {
        if (step.expectedCommand && cleanCmd.includes(step.expectedCommand.split(' ')[0])) {
          if (!completedStepIds.includes(step.id)) {
            setCompletedStepIds(prev => [...prev, step.id]);
          }
        }
      });
    } else {
      newHistory.push({
        type: 'out',
        text: `Command executed. Target [${activeLab.authorizedTarget}] returned: exit code 0.`
      });
    }

    setTerminalHistory(newHistory);
    setCommandInput('');
  };

  // Flag Verification & Firestore Persistence
  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittedFlag.trim()) return;

    if (submittedFlag.trim() === activeLab.expectedFlag) {
      setFlagFeedback('SUCCESS');
      setIsLabCompleted(true);

      // Save to Cloud Firestore
      if (user) {
        try {
          const labDoc = doc(db, 'users', user.uid, 'labProgress', activeLab.id);
          await setDoc(labDoc, {
            labId: activeLab.id,
            category: activeLab.category,
            completedSteps: activeLab.steps.map(s => s.id),
            discoveredFlags: [activeLab.expectedFlag],
            isCompleted: true,
            completedAt: new Date().toISOString()
          });
        } catch (err) {
          console.warn('Lab Firestore save note:', err);
        }
      }
    } else {
      setFlagFeedback('INVALID');
    }
  };

  const handleDownload = (material: DownloadableResource) => {
    const element = document.createElement('a');
    const file = new Blob([
      material.mockDownloadContent || `SBCyberBasics Academy Lab Material\nTitle: ${material.name}\nTarget: ${activeLab.authorizedTarget}\nCategory: ${activeLab.category}\nAuthorized for educational research only.`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = material.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-950 min-h-screen text-slate-100 font-sans pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header with Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-1">
              <Terminal className="w-4 h-4" />
              <span>SBCyberBasics Cyber Labs Workbench</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Practical Cybersecurity Laboratories
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Hands-on guided terminal exercises, packet captures, and vulnerability simulations against authorized training targets.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors border border-slate-700 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Ethical Conduct Notice & Rules of Engagement Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-amber-950/30 border border-cyan-500/30 p-5 flex items-start gap-4 shadow-xl">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-white uppercase font-mono tracking-wider">
              Rules of Engagement & Ethical Defense Policy:
            </h4>
            <p className="text-slate-300 leading-relaxed">
              All security exercises and penetration testing commands in this academy must be directed <strong>exclusively against authorized training targets</strong> (e.g. <code>10.10.10.0/24</code>, <code>dvwa-lab.local</code>). Attempting to scan or exploit unauthorized third-party systems is illegal and strictly prohibited by our charter.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Main Workbench Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Lab Selector & Active Exercise Briefing */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Lab Selector Accordion List */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Select Lab Exercise ({filteredLabs.length} Available):
              </span>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {filteredLabs.map((lab) => {
                  const isSelected = activeLab.id === lab.id;
                  return (
                    <button
                      key={lab.id}
                      onClick={() => handleSelectLab(lab)}
                      className={`w-full p-3 rounded-xl text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className="text-cyan-400">{lab.category}</span>
                        <span className="text-slate-500">{lab.durationMinutes}m</span>
                      </div>
                      <div className="text-xs line-clamp-1">{lab.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Lab Briefing Details */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-xl">
              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                    {activeLab.category}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {activeLab.difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{activeLab.title}</h2>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/30">
                  Target: <strong>{activeLab.authorizedTarget}</strong>
                </div>
              </div>

              {/* Scenario */}
              <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                <h4 className="font-bold text-white font-mono uppercase text-[11px]">Scenario Briefing:</h4>
                <p>{activeLab.scenarioBriefing}</p>
              </div>

              {/* Step-by-Step Guided Objectives */}
              <div className="space-y-2">
                <h4 className="font-bold text-white font-mono uppercase text-[11px] flex items-center justify-between">
                  <span>Guided Exercise Steps:</span>
                  <span className="text-cyan-400 font-normal">
                    {completedStepIds.length} / {activeLab.steps.length} Validated
                  </span>
                </h4>

                <div className="space-y-2">
                  {activeLab.steps.map((step, idx) => {
                    const isStepDone = completedStepIds.includes(step.id);
                    return (
                      <div 
                        key={step.id}
                        className={`p-3 rounded-xl border text-xs transition-colors flex items-start gap-2.5 ${
                          isStepDone 
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                            : 'bg-slate-950/70 border-slate-800 text-slate-300'
                        }`}
                      >
                        {isStepDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-600 text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                        )}
                        <div className="space-y-1">
                          <div>{step.instruction}</div>
                          {step.expectedCommand && (
                            <code className="text-[10px] font-mono text-cyan-400 block bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              $ {step.expectedCommand}
                            </code>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Downloadable Materials for this lab */}
              {activeLab.downloadableMaterials.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <h4 className="font-bold text-white font-mono uppercase text-[11px]">
                    Downloadable Lab Materials:
                  </h4>
                  <div className="space-y-1.5">
                    {activeLab.downloadableMaterials.map((mat) => (
                      <div
                        key={mat.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate font-mono">{mat.name}</span>
                        </div>
                        <button
                          onClick={() => handleDownload(mat)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 text-[11px] font-mono transition-colors cursor-pointer shrink-0 ml-2"
                        >
                          Download ({mat.size})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Flag Submission Console */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <h4 className="font-bold text-white font-mono uppercase text-[11px]">
                  Submit Discovered Flag:
                </h4>

                <form onSubmit={handleFlagSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={submittedFlag}
                    onChange={(e) => setSubmittedFlag(e.target.value)}
                    placeholder="SBC{...}"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:brightness-110 text-slate-950 font-mono font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    Validate Flag
                  </button>
                </form>

                {flagFeedback === 'SUCCESS' && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Flag Accepted! Lab completion verified & recorded in Firestore.</span>
                  </div>
                )}

                {flagFeedback === 'INVALID' && (
                  <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Incorrect flag. Inspect the command output in the terminal simulator.</span>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: In-Browser Simulated Terminal & Lab Sandbox */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Interactive Terminal Window */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[580px]">
              
              {/* Terminal Window Top Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="font-mono text-xs text-slate-300 ml-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    student@cyberlab-workbench: ~ (Isolated Sandbox)
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    TARGET: REACHABLE
                  </span>
                  <button
                    onClick={() => setTerminalHistory([])}
                    title="Clear Terminal"
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Terminal Output Body */}
              <div className="flex-1 p-5 font-mono text-xs overflow-y-auto space-y-2 bg-slate-950">
                {terminalHistory.map((item, i) => (
                  <div key={i} className="leading-relaxed">
                    {item.type === 'cmd' ? (
                      <div className="flex items-center gap-2 text-cyan-400">
                        <span className="text-emerald-400 font-bold">student@academy:~$</span>
                        <span className="text-white font-semibold">{item.text}</span>
                      </div>
                    ) : item.type === 'err' ? (
                      <div className="p-2.5 rounded bg-red-950/60 border border-red-500/30 text-red-300 whitespace-pre-line">
                        {item.text}
                      </div>
                    ) : item.type === 'info' ? (
                      <div className="text-slate-400 text-[11px] italic">
                        {item.text}
                      </div>
                    ) : (
                      <div className="text-slate-300 whitespace-pre-line pl-2 border-l border-slate-800 py-0.5">
                        {item.text}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Command Input Prompt */}
              <form onSubmit={handleCommandSubmit} className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 font-mono text-xs">
                <span className="text-emerald-400 font-bold shrink-0">student@academy:~$</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="Enter command (e.g. nmap, tshark, snort, find, ls, id, help)..."
                  className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-600 font-mono text-xs"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                >
                  Run
                </button>
              </form>

            </div>

            {/* Future Isolated Lab Environments Roadmap Box as requested */}
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-slate-800 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold">
                <Server className="w-4 h-4" />
                <span>Future Isolated Lab Environments Roadmap</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Upcoming Dedicated Containerized Kali Pods & WebSocket Sandboxes
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                In Phase 2 of our cyber infrastructure, students will be able to spin up dedicated per-user containerized Docker pods running full GUI Kali Linux and Metasploitable VMs over secure in-browser WebSockets and noVNC streaming.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-mono text-slate-400">
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <div className="text-white font-bold">Phase 1 (Current)</div>
                  <div>Guided In-Browser Sandbox</div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <div className="text-cyan-400 font-bold">Phase 2 (Roadmap)</div>
                  <div>Containerized Docker Pods</div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <div className="text-slate-300 font-bold">Phase 3 (Enterprise)</div>
                  <div>Kubernetes Multi-Node Topologies</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
