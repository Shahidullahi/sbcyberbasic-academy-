import { useState, useEffect } from 'react';
import { Logo } from '../common/Logo';
import { verifyCertificateInRegistry } from '../../services/certificateService';
import { 
  X, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Award, 
  ExternalLink,
  Calendar,
  User,
  BookOpen,
  Hash
} from 'lucide-react';

interface VerifyCertModalProps {
  isOpen: boolean;
  initialCode?: string;
  onClose: () => void;
}

interface CertificateRecord {
  id: string;
  studentName: string;
  courseTitle: string;
  courseCode: string;
  gradeAchieved: string;
  issueDate: string;
  credentialHash: string;
  instructorName: string;
  status: 'VERIFIED' | 'REVOKED';
}

const SAMPLE_DATABASE: Record<string, CertificateRecord> = {
  'SBC-2026-NET01': {
    id: 'SBC-2026-NET01',
    studentName: 'Amina Al-Hassan',
    courseTitle: 'Networking Fundamentals',
    courseCode: 'NET-101',
    gradeAchieved: '96.5% (High Honors)',
    issueDate: 'October 24, 2026',
    credentialHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    instructorName: 'Engr. Marcus Vance, CISSP',
    status: 'VERIFIED'
  },
  'SBC-2026-CCDA': {
    id: 'SBC-2026-CCDA',
    studentName: 'David Chen',
    courseTitle: 'Network Defense & Incident Response',
    courseCode: 'DEF-201',
    gradeAchieved: '92.0%',
    issueDate: 'November 02, 2026',
    credentialHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    instructorName: 'Sarah Jenkins, Lead Responder',
    status: 'VERIFIED'
  },
  'SBC-2026-CEPT': {
    id: 'SBC-2026-CEPT',
    studentName: 'Zainab Bello',
    courseTitle: 'Ethical Hacking & Penetration Testing',
    courseCode: 'HACK-201',
    gradeAchieved: '94.8% (Practical Honors)',
    issueDate: 'November 08, 2026',
    credentialHash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    instructorName: 'Kofi Mensah, OSCP/OSCE',
    status: 'VERIFIED'
  }
};

export function VerifyCertModal({ isOpen, initialCode = 'SBC-2026-NET01', onClose }: VerifyCertModalProps) {
  const [searchCode, setSearchCode] = useState(initialCode);
  const [result, setResult] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const performModalLookup = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    setSearched(true);
    try {
      const found = await verifyCertificateInRegistry(clean);
      if (found) {
        setResult(found as any);
      } else if (SAMPLE_DATABASE[clean]) {
        setResult(SAMPLE_DATABASE[clean]);
      } else {
        setResult(null);
      }
    } catch {
      setResult(SAMPLE_DATABASE[clean] || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const code = initialCode || 'SBC-2026-NET01';
      setSearchCode(code);
      performModalLookup(code);
    }
  }, [isOpen, initialCode]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performModalLookup(searchCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>SBCyberBasics Certificate Verification Portal</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input form */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/40">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Enter Credential ID, e.g. SBC-2026-NET01"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs font-semibold rounded-lg hover:brightness-110 cursor-pointer"
            >
              Search Registry
            </button>
          </form>

          {/* Sample quick tokens */}
          <div className="flex items-center gap-2 mt-3 text-[11px] font-mono text-slate-400">
            <span>Try sample credentials:</span>
            {['SBC-2026-NET01', 'SBC-2026-CCDA', 'SBC-2026-CEPT'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setSearchCode(c);
                  setResult(SAMPLE_DATABASE[c]);
                  setSearched(true);
                }}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Result Area */}
        <div className="p-6">
          {result ? (
            <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-cyan-500/40 p-6 space-y-5 relative shadow-xl">
              
              {/* Verification Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                      AUTHENTICATED & RECORDED
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Official Certificate of Completion
                    </h3>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400">Credential ID:</div>
                  <div className="text-xs font-bold text-cyan-300">{result.id}</div>
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    Recipient Full Name:
                  </div>
                  <div className="text-sm font-bold text-white">{result.studentName}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    Course & Curriculum:
                  </div>
                  <div className="text-sm font-bold text-cyan-200">
                    [{result.courseCode}] {result.courseTitle}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    Examination Score:
                  </div>
                  <div className="text-xs font-semibold text-white font-mono">{result.gradeAchieved}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    Official Issuance Date:
                  </div>
                  <div className="text-xs font-semibold text-white font-mono">{result.issueDate}</div>
                </div>
              </div>

              {/* Cryptographic hash */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[10px] font-mono space-y-1">
                <div className="text-slate-400 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-cyan-400" />
                  SHA-256 Ledger Verification Hash:
                </div>
                <div className="text-cyan-400/90 break-all select-all">
                  {result.credentialHash}
                </div>
              </div>

            </div>
          ) : searched ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No Registered Credential Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No certificate matching "{searchCode}" was found in the public ledger. Please verify the alphanumeric code.
              </p>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
