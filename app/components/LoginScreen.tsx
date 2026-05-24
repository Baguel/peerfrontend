"use client";

interface LoginScreenProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onJoin: (e: React.FormEvent) => void;
}

export default function LoginScreen({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onJoin,
}: LoginScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-slate-100 to-indigo-50 dark:from-zinc-950 dark:to-slate-950 font-sans p-6 transition-colors duration-300">
      <main className="w-full max-w-md bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-800/50 shadow-2xl rounded-3xl p-8 flex flex-col items-center gap-6">
        <div className="p-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Rejoindre WebCall
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1.5 font-medium">Entrez vos coordonnées pour vous connecter.</p>
        </div>

        <form onSubmit={onJoin} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="first" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Prénom</label>
            <input
              id="first"
              type="text"
              required
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="Ex: Jean"
              className="w-full p-3.5 bg-slate-100/50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-slate-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="last" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Nom</label>
            <input
              id="last"
              type="text"
              required
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="Ex: Dupont"
              className="w-full p-3.5 bg-slate-100/50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-slate-800 dark:text-zinc-100"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
          >
            Se connecter
          </button>
        </form>
      </main>
    </div>
  );
}
