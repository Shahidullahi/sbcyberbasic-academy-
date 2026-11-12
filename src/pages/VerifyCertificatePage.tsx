import { useState, useEffect } from 'react';
import { CertificateRecord } from '../types';
import { verifyCertificateInRegistry, INITIAL_REGISTRY_CERTIFICATES } from '../services/certificateService';
import { CertificateRenderer } from '../components/certificate/CertificateRenderer';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Calendar, 
  User, 
  BookOpen, 
  Hash, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface VerifyCertificatePageProps {
  initialSearchCode?: string;
  onExploreCourses: () => void;
}

export function VerifyCertificatePage({ initialSearchCode = 'SBC-2026-NET01', onExploreCourses }: VerifyCertificatePageProps) {
  const [searchCode, setSearchCode] = useState(initialSearchCode);
  const [result, setResult] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFullCertificate, setShowFullCertificate] = useState(false);

  const performLookup = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const found = await verifyCertificateInRegistry(codeToSearch.trim());
      setResult(found);
      setShowFullCertificate(false);
    } catch (err) {
      console.error('Registry verification error:', err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSearchCode) {
      performLookup(initialSearchCode);
    }
  }, [initialSearchCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(searchCode);
  };

  return (
    <div className="py-12 lg:py-20 min-h-screen bg-slate-950 font-sans text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Official Academy Registry</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Certificate of Completion Verification
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Validate the authenticity, issuance date, student name, and cryptographic SHA-256 ledger record of credentials issued by SBCyberBasics Academy.
          </p>
        </div>

        {/* Verification Search Bar */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Certificate Identification Code, e.g. SBC-2026-NET01"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Verifying Registry...' : 'Verify Credential'}</span>
            </button>
          </form>

          {/* Sample quick search pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-mono text-slate-400">
            <span>Test registered sample credentials:</span>
            {INITIAL_REGISTRY_CERTIFICATES.map((cert) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => {
                  setSearchCode(cert.id);
                  performLookup(cert.id);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-cyan-400 text-xs transition-colors cursor-pointer"
              >
                {cert.id} ({cert.courseCode})
              </button>
            ))}
          </div>
        </div>

        {/* Verification Audit Result */}
        {hasSearched && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {result ? (
              <div className="space-y-6">
                
                {/* Status Card */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                  
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/50 shrink-0">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-extrabold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                            AUTHENTIC & REGISTERED
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {result.honorsTier}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                          Official Certificate Verified
                        </h2>
                      </div>
                    </div>

                    <div className="text-left sm:text-right font-mono">
                      <div className="text-xs text-slate-400">Registry Certificate ID:</div>
                      <div className="text-sm font-bold text-cyan-300">{result.id}</div>
                    </div>
                  </div>

                  {/* Audit Attributes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-sans">
                    <div className="space-y-1 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Awarded Student:</span>
                      </div>
                      <div className="text-base font-bold text-white">{result.studentName}</div>
                    </div>

                    <div className="space-y-1 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Completed Curriculum:</span>
                      </div>
                      <div className="text-base font-bold text-cyan-300">
                        [{result.courseCode}] {result.courseTitle}
                      </div>
                    </div>

                    <div className="space-y-1 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Issuance Date:</span>
                      </div>
                      <div className="text-base font-bold text-white font-mono">
                        {new Date(result.issuedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    <div className="space-y-1 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Examination Achievement:</span>
                      </div>
                      <div className="text-sm font-semibold text-emerald-400 font-mono">
                        {result.gradeAchieved}
                      </div>
                    </div>

                    <div className="space-y-1 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 lg:col-span-2">
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-cyan-400" />
                        <span>SHA-256 Ledger Verification Hash:</span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400 select-all break-all">
                        {result.credentialHash}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Full Certificate View */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                    <span className="text-xs font-mono text-slate-400">
                      Aligned with NIST SP 800-181 NICE & MITRE ATT&CK Workforce Standards.
                    </span>

                    <button
                      onClick={() => setShowFullCertificate(!showFullCertificate)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all border border-slate-700 cursor-pointer flex items-center gap-2"
                    >
                      <span>{showFullCertificate ? 'Hide Certificate Preview' : 'View Full Certificate Document'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

                {/* Rendered Certificate Preview when toggled */}
                {showFullCertificate && (
                  <div className="animate-in fade-in slide-in-from-top-4">
                    <CertificateRenderer certificate={result} />
                  </div>
                )}

              </div>
            ) : (
              /* Invalid Search */
              <div className="rounded-2xl bg-slate-900 border border-red-500/30 p-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
                  <XCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">No Registered Credential Found</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  No certificate matching <strong>"{searchCode}"</strong> was located in the official SBCyberBasics Academy verification registry.
                </p>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-xs font-mono text-slate-400 text-left space-y-1">
                  <div className="text-white font-bold mb-1">Verification Audit Tips:</div>
                  <div>• Check for typos in the certificate identification code.</div>
                  <div>• Standard format: SBC-2026-[COURSE]-[ID].</div>
                  <div>• Ensure the credential was officially issued upon meeting 100% completion requirements.</div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
