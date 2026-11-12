import { Logo } from '../common/Logo';
import { CertificateRecord } from '../../types';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Hash, 
  Download, 
  Printer, 
  Share2, 
  Lock,
  ExternalLink
} from 'lucide-react';

interface CertificateRendererProps {
  certificate: CertificateRecord;
  onVerifyInRegistry?: (code: string) => void;
}

export function CertificateRenderer({ certificate, onVerifyInRegistry }: CertificateRendererProps) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Cryptographically Validated & Registered</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Credential</span>
          </button>
        </div>
      </div>

      {/* High-Fidelity Security Certificate Frame */}
      <div 
        id="printable-certificate"
        className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-8 border-double border-slate-700 rounded-3xl p-8 sm:p-14 shadow-2xl text-center space-y-8 overflow-hidden select-none"
      >
        {/* Background Cyber Guilloche / Security Watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(#0284c70a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        {/* Outer Corner Ornaments */}
        <div className="absolute top-4 left-4 font-mono text-[9px] text-cyan-500/40">SEC-ID: {certificate.id}</div>
        <div className="absolute top-4 right-4 font-mono text-[9px] text-cyan-500/40">NIST SP 800-181 NICE ALIGNED</div>
        <div className="absolute bottom-4 left-4 font-mono text-[9px] text-cyan-500/40">SHA-256 VERIFIED LEDGER</div>
        <div className="absolute bottom-4 right-4 font-mono text-[9px] text-cyan-500/40">SBCYBERBASICS ACADEMY</div>

        {/* Certificate Header */}
        <div className="space-y-4 relative z-10">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 font-bold">
              Official Digital Credential of Completion
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-serif">
              Certificate of Academic & Technical Mastery
            </h1>
          </div>
        </div>

        {/* Body Text: Recipient */}
        <div className="space-y-3 relative z-10 max-w-2xl mx-auto">
          <p className="text-xs uppercase font-mono tracking-widest text-slate-400">
            This is to certify that
          </p>

          <div className="py-2 border-b-2 border-cyan-500/30 max-w-xl mx-auto">
            <span className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white font-serif tracking-tight">
              {certificate.studentName}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
            has successfully fulfilled all instructional curricula, completed 100% of required hands-on laboratory modules, and passed all proctored technical examinations for:
          </p>

          {/* Course Title Banner */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/40 shadow-inner max-w-xl mx-auto space-y-1">
            <div className="text-[11px] font-mono font-bold text-cyan-400">
              [{certificate.courseCode}]
            </div>
            <div className="text-lg sm:text-xl font-bold text-white tracking-wide">
              {certificate.courseTitle}
            </div>
            <div className="text-xs font-mono text-emerald-400 font-semibold">
              Evaluation Grade: {certificate.gradeAchieved}
            </div>
          </div>
        </div>

        {/* Core Competencies validated */}
        {certificate.learningObjectivesSummary && certificate.learningObjectivesSummary.length > 0 && (
          <div className="relative z-10 max-w-xl mx-auto space-y-1.5 text-left bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300">
            <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block mb-1">
              Validated Technical Competencies:
            </span>
            {certificate.learningObjectivesSummary.map((comp, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{comp}</span>
              </div>
            ))}
          </div>
        )}

        {/* Signatures & Seal Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-6 border-t border-slate-800/90 relative z-10 max-w-3xl mx-auto text-xs font-mono">
          
          {/* Instructor Signature */}
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="font-serif italic text-base text-cyan-300 border-b border-slate-700 pb-1">
              {certificate.instructorName.split('(')[0].trim()}
            </div>
            <div className="text-slate-400 text-[10px] uppercase">
              Lead Course Faculty & Specialist
            </div>
          </div>

          {/* Official Academy Seal */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-900 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center text-cyan-400 border border-cyan-400/40">
                <Award className="w-6 h-6 text-cyan-300" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300 mt-0.5">SEAL</span>
              </div>
            </div>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              VERIFIED CREDENTIAL
            </span>
          </div>

          {/* Issue Date & Academic Director */}
          <div className="space-y-1.5 text-center sm:text-right">
            <div className="text-white border-b border-slate-700 pb-1 font-bold">
              {formattedDate}
            </div>
            <div className="text-slate-400 text-[10px] uppercase">
              Official Date of Issuance
            </div>
          </div>

        </div>

        {/* Cryptographic Ledger Footer */}
        <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-300">Verification Hash:</span>
            <span className="text-cyan-400 font-bold select-all truncate max-w-xs">
              {certificate.credentialHash}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white font-bold">ID: {certificate.id}</span>
            {onVerifyInRegistry && (
              <button
                onClick={() => onVerifyInRegistry(certificate.id)}
                className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer flex items-center gap-1"
              >
                <span>Verify Public Registry</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
