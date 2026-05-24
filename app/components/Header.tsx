"use client";

interface HeaderProps {
  onlineCount: number;
}

export default function Header({ onlineCount }: HeaderProps) {
  return (
    <header className="w-full max-w-5xl mx-auto px-6 py-8 flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800/60">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            WebCall
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Appels Audio & Vidéo Peer-to-Peer</p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/50 dark:bg-zinc-900 border border-slate-300/30 dark:border-zinc-800/40 text-xs font-semibold">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        {onlineCount} {onlineCount > 1 ? "utilisateurs en ligne" : "utilisateur en ligne"}
      </div>
    </header>
  );
}
