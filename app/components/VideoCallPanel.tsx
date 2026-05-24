"use client";

import { parsePeerName } from "../lib/utils";
import type { CallStatus } from "../lib/types";

interface VideoCallPanelProps {
  callStatus: CallStatus;
  partnerId: string | null;
  remoteStream: MediaStream | null;
  localStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  hasCamera: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
}

export default function VideoCallPanel({
  callStatus,
  partnerId,
  remoteStream,
  localStream,
  isMuted,
  isCameraOff,
  hasCamera,
  onToggleMute,
  onToggleCamera,
  onEndCall,
}: VideoCallPanelProps) {
  return (
    <div className="w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative min-h-[420px] aspect-video flex flex-col justify-between group">
      {callStatus === "connected" && remoteStream ? (
        <video
          ref={(el) => {
            if (el && remoteStream) {
              el.srcObject = remoteStream;
            }
          }}
          autoPlay
          playsInline
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
      ) : (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center p-8 bg-slate-900/90 gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-2xl animate-pulse">
            {parsePeerName(partnerId || "").name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Appel vidéo sortant</p>
            <h4 className="text-lg font-bold text-white mt-1">{parsePeerName(partnerId || "").name}</h4>
            <p className="text-xs text-slate-400 mt-1 animate-pulse">En attente d'acceptation...</p>
          </div>
        </div>
      )}

      {localStream && (
        <div className="absolute top-4 right-4 z-10 w-28 h-20 sm:w-36 sm:h-26 rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-xl">
          {isCameraOff ? (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[10px] text-slate-500 font-semibold text-center">
              Caméra Off
            </div>
          ) : (
            <video
              ref={(el) => {
                if (el && localStream) {
                  el.srcObject = localStream;
                }
              }}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {callStatus === "connected" && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-xl text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          {parsePeerName(partnerId || "").name}
        </div>
      )}

      <div className="w-full p-4 flex justify-center items-center gap-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 mt-auto">
        <button
          onClick={onToggleMute}
          className={`p-3.5 rounded-full border transition-all cursor-pointer ${
            isMuted
              ? "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30"
              : "bg-white/10 text-white border-white/10 hover:bg-white/20"
          }`}
          title={isMuted ? "Activer le micro" : "Couper le micro"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6v9m0-9a3 3 0 116 0v9a3 3 0 11-6 0v-9zm-3 5.625c0 2.923 2.052 5.372 4.875 5.952m0 0v1.875m0-1.875a6.762 6.762 0 005.125 0m0 0v1.875" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        <button
          onClick={onEndCall}
          className="p-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-full transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          title={callStatus === "calling" ? "Annuler l'appel" : "Raccrocher"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 rotate-[135deg]">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>

        <button
          onClick={onToggleCamera}
          disabled={!hasCamera}
          className={`p-3.5 rounded-full border transition-all cursor-pointer ${
            !hasCamera
              ? "opacity-30 cursor-not-allowed"
              : isCameraOff
                ? "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30"
                : "bg-white/10 text-white border-white/10 hover:bg-white/20"
          }`}
          title={isCameraOff ? "Activer la caméra" : "Couper la caméra"}
        >
          {isCameraOff ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.843-5.625l-2.094 2.093m0 0a11.95 11.95 0 00-4.5 4.5M12.002 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
