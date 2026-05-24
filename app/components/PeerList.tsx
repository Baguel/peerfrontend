"use client";

import { parsePeerName } from "../lib/utils";
import type { CallStatus } from "../lib/types";

interface PeerListProps {
  peers: string[];
  callStatus: CallStatus;
  hasIncomingCall: boolean;
  hasCamera: boolean;
  onStartCall: (targetId: string, withVideo: boolean) => void;
}

export default function PeerList({ peers, callStatus, hasIncomingCall, hasCamera, onStartCall }: PeerListProps) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl shadow-slate-100/40 dark:shadow-none flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Utilisateurs connectés</h2>
        <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-semibold">
          {peers.length} disponible{peers.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-1">
        {peers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50/50 dark:bg-zinc-950/20">
            <div className="p-3 bg-slate-100 dark:bg-zinc-900 text-slate-400 dark:text-zinc-600 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-sm font-bold mb-1">Aucun autre utilisateur en ligne</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-500 max-w-[240px]">
              Ouvrez cette application dans un autre onglet ou sur un autre appareil pour tester l'appel.
            </p>
          </div>
        ) : (
          peers.map((peerId) => {
            const peerParsed = parsePeerName(peerId);
            return (
              <div
                key={peerId}
                className="p-4 bg-slate-50 dark:bg-zinc-950/60 hover:bg-slate-100/80 dark:hover:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm shrink-0">
                    {peerParsed.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-zinc-200 truncate">
                      {peerParsed.name}
                    </p>
                    <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      En ligne
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onStartCall(peerId, false)}
                    disabled={callStatus !== "idle" || hasIncomingCall}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white rounded-xl flex items-center justify-center gap-1.5 font-bold shadow-md shadow-blue-500/10 hover:shadow-lg transition-all text-xs cursor-pointer"
                    title="Appel Audio"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Audio
                  </button>

                  <button
                    onClick={() => onStartCall(peerId, true)}
                    disabled={callStatus !== "idle" || hasIncomingCall || !hasCamera}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white rounded-xl flex items-center justify-center gap-1.5 font-bold shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all text-xs cursor-pointer"
                    title="Appel Vidéo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M23 7l-7 5 7 5V7z" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    Vidéo
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
