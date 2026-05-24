"use client";

import { parsePeerName } from "../lib/utils";

interface IncomingCallProps {
  callerPeerId: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingCallPanel({ callerPeerId, onAccept, onDecline }: IncomingCallProps) {
  return (
    <div className="p-6 bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl shadow-xl border border-emerald-800/30 relative overflow-hidden animate-bounce">
      <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 animate-pulse shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div className="text-center sm:text-left min-w-0">
            <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">Appel Audio/Vidéo Entrant</span>
            <h3 className="text-lg font-black text-white mt-1 break-all truncate">
              {parsePeerName(callerPeerId).name} vous appelle
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={onAccept}
            className="flex-1 sm:flex-none px-5 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Accepter
          </button>

          <button
            onClick={onDecline}
            className="flex-1 sm:flex-none px-5 py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}
