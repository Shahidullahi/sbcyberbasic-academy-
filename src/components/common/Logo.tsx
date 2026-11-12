interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function Logo({ className = '', size = 'md', showSubtitle = true }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Original Custom Vector Shield & Cyber Node Icon */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900 p-0.5 shadow-lg shadow-cyan-500/20 ${iconSizes[size]}`}>
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden relative">
          {/* Subtle circuit lines background */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" fill="none">
            <path d="M10 20 H50 V60 H90" stroke="#38bdf8" strokeWidth="4" />
            <path d="M90 40 H50 V80 H10" stroke="#06b6d4" strokeWidth="3" />
            <circle cx="50" cy="50" r="8" fill="#38bdf8" />
          </svg>
          {/* Cyber Shield Icon */}
          <svg className="w-3/5 h-3/5 text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`font-black tracking-tight text-white font-mono ${textSizes[size]}`}>
            SB<span className="text-cyan-400">Cyber</span>Basics
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-300/80 font-mono">
              Academy
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
              Global Platform
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
