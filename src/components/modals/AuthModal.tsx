import { useState } from 'react';
import { Logo } from '../common/Logo';
import { 
  registerStudent, 
  loginStudent, 
  loginWithGoogle, 
  resetPassword 
} from '../../services/authService';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { validatePasswordStrength, isValidDisplayName, sanitizeInput } from '../../utils/security';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register' | 'reset';
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, initialMode, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'instructor' | 'admin'>('student');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        const cleanName = sanitizeInput(fullName.trim(), 60);
        if (!isValidDisplayName(cleanName)) {
          setErrorMsg('Legal Full Name must be 2 to 50 characters (letters, spaces, hyphens, and dots only).');
          setLoading(false);
          return;
        }

        const passwordCheck = validatePasswordStrength(password);
        if (!passwordCheck.isValid) {
          setErrorMsg(`Password requirements: ${passwordCheck.feedback.join(' ')}`);
          setLoading(false);
          return;
        }

        // Public registrations are locked to 'student' role to prevent privilege escalation
        await registerStudent(email.trim().toLowerCase(), password, cleanName, 'student');
        onSuccess();
        onClose();
      } else if (mode === 'login') {
        await loginStudent(email.trim().toLowerCase(), password);
        onSuccess();
        onClose();
      } else if (mode === 'reset') {
        await resetPassword(email.trim().toLowerCase());
        setResetSent(true);
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      let friendlyMessage = 'Authentication failed. Please verify your details.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'An account with this email address already exists. Please log in.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid credentials. Please double-check your email and password.';
      } else if (err.code === 'auth/user-not-found') {
        friendlyMessage = 'No student account was found with this email address.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password must be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please enter a valid academic or personal email address.';
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setErrorMsg(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setErrorMsg(err.message || 'Google authentication was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <Logo size="sm" showSubtitle={false} />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        {mode !== 'reset' && (
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 text-xs font-mono font-semibold transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'login'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Student Login</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 text-xs font-mono font-semibold transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'register'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Account</span>
            </button>
          </div>
        )}

        {/* Reset Password Banner */}
        {mode === 'reset' && (
          <div className="px-6 pt-4 pb-2">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setResetSent(false);
                setErrorMsg(null);
              }}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              ← Back to Sign In
            </button>
            <h3 className="text-lg font-bold text-white mt-2">Reset Student Password</h3>
            <p className="text-xs text-slate-400">
              Enter your email address and Firebase will dispatch an official password reset link.
            </p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {resetSent ? (
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-2 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-bold text-white text-sm">Reset Email Dispatched</div>
              <p className="text-[11px] text-slate-300">
                Please check your inbox at <strong>{email}</strong> for instructions to reset your password.
              </p>
            </div>
          ) : (
            <>
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Legal Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amina Al-Hassan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Recorded on your official Certificate of Completion.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {mode !== 'reset' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono text-slate-300">
                      Password <span className="text-cyan-400">*</span>
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('reset');
                          setErrorMsg(null);
                        }}
                        className="text-[11px] font-mono text-cyan-400 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && password.length > 0 && (
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={`font-bold ${
                      validatePasswordStrength(password).score >= 4 
                        ? 'text-emerald-400' 
                        : validatePasswordStrength(password).score >= 3 
                        ? 'text-cyan-400' 
                        : validatePasswordStrength(password).score >= 2 
                        ? 'text-amber-400' 
                        : 'text-red-400'
                    }`}>
                      {validatePasswordStrength(password).score >= 4 ? 'Production Ready' :
                       validatePasswordStrength(password).score >= 3 ? 'Good' :
                       validatePasswordStrength(password).score >= 2 ? 'Moderate' : 'Weak'}
                    </span>
                  </div>
                  
                  {/* Visual Strength Meter Bars */}
                  <div className="grid grid-cols-4 gap-1 h-1.5">
                    {[1, 2, 3, 4].map((step) => {
                      const score = validatePasswordStrength(password).score;
                      const active = score >= step;
                      return (
                        <div
                          key={step}
                          className={`rounded-full transition-all ${
                            active
                              ? score >= 4 ? 'bg-emerald-400' : score >= 3 ? 'bg-cyan-400' : score >= 2 ? 'bg-amber-400' : 'bg-red-400'
                              : 'bg-slate-800'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono">
                    Must contain: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating with Firebase...</span>
                ) : mode === 'reset' ? (
                  <span>Dispatch Reset Link</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to Learning Dashboard' : 'Create Individual Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}

          {/* Google Sign-in Alternative */}
          {mode !== 'reset' && (
            <div className="pt-2">
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[10px] font-mono text-slate-500 uppercase">
                  Or authenticate with
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          <div className="pt-2 text-center text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Secured via Firebase Authentication & Cloud Firestore</span>
          </div>

        </form>

      </div>
    </div>
  );
}
