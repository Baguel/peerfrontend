"use client";

import { parsePeerName } from "../lib/utils";
import type { CallStatus } from "../lib/types";

interface AudioCallPanelProps {
  callStatus: CallStatus;
  partnerId: string | null;
  onEndCall: () => void;
}

export default function AudioCallPanel({ callStatus, partnerId, onEndCall }: AudioCallPanelProps) {
  return (
    <div className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl shadow-xl border border-indigo-800/30 relative overflow-hidden transition-all duration-300">
      <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl border ${
            callStatus === "calling"
              ? "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse"
              : "bg-green-500/20 text-green-400 border-green-500/30 animate-bounce"
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </div>
          <div className="text-center sm:text-left min-w-0">
            <span className={`text-xs uppercase tracking-widest font-bold ${
              callStatus === "calling" ? "text-amber-300" : "text-indigo-300"
            }`}>
              {callStatus === "calling" ? "Appel vocal sortant" : "Appel Vocal Actif"}
            </span>
            <h3 className="text-lg font-black text-white mt-1 break-all truncate">
              {callStatus === "calling" ? "Connexion avec : " : "En ligne avec : "}
              <span className="text-blue-400 font-black">
                {parsePeerName(partnerId || "").name}
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={onEndCall}
          className="px-6 py-3.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-sm cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
            <line x1="23" y1="1" x2="1" y2="23" />
          </svg>
          {callStatus === "calling" ? "Annuler" : "Raccrocher"}
        </button>
      </div>
    </div>
  );
}
