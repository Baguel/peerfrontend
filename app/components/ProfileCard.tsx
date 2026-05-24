"use client";

interface ProfileCardProps {
  name: string;
  peerId: string;
  copied: boolean;
  onCopy: () => void;
  microphoneAllowed: boolean | null;
  hasCamera: boolean;
}

export default function ProfileCard({
  name,
  peerId,
  copied,
  onCopy,
  microphoneAllowed,
  hasCamera,
}: ProfileCardProps) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl shadow-slate-100/40 dark:shadow-none">
      <h2 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4">Mon Profil</h2>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-slate-500 dark:text-zinc-400">Connecté en tant que :</span>
        <div className="text-base font-black text-slate-800 dark:text-zinc-50">
          {name}
        </div>

        <span className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Identifiant technique :</span>
        <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl relative overflow-hidden group">
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 break-all select-all flex-1 pr-6">
            {peerId}
          </span>
          <button
            onClick={onCopy}
            disabled={peerId === "Génération..."}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
            title="Copier l'ID"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-4.5 h-4.5 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.675A2.062 2.062 0 1118 6.002m-9 13.5H3.75a1.125 1.125 0 01-1.125-1.125V15M9 9h7.5A1.125 1.125 0 0117.625 10.125v7.5a1.125 1.125 0 01-1.125 1.125H9A1.125 1.125 0 017.875 17.5v-7.5A1.125 1.125 0 019 9z" />
              </svg>
            )}
          </button>
        </div>

        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-zinc-400">Microphone :</span>
          {microphoneAllowed === null ? (
            <span className="text-slate-400 font-semibold">Vérification...</span>
          ) : microphoneAllowed ? (
            <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Autorisé
            </span>
          ) : (
            <span className="text-red-500 font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
              Refusé
            </span>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-zinc-400">Caméra :</span>
          {hasCamera ? (
            <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Disponible
            </span>
          ) : (
            <span className="text-amber-500 font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              Indisponible
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
