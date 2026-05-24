"use client";

import { useEffect, useState, useRef } from "react";
import { generateUUID, parsePeerName, startRingtone } from "./lib/utils";
import type { CallStatus } from "./lib/types";
import LoginScreen from "./components/LoginScreen";
import Header from "./components/Header";
import ProfileCard from "./components/ProfileCard";
import HelpCard from "./components/HelpCard";
import IncomingCallPanel from "./components/IncomingCallPanel";
import VideoCallPanel from "./components/VideoCallPanel";
import AudioCallPanel from "./components/AudioCallPanel";
import PeerList from "./components/PeerList";
import LiveTranslator from "./components/LiveTranslator";

export default function Home() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isJoined, setIsJoined] = useState<boolean>(false);

  const [myId, setMyId] = useState<string>("Génération...");
  const [listUser, setListUser] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [peerInstance, setPeerInstance] = useState<any>(null);
  const [activeCall, setActiveCall] = useState<any>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');

  const [microphoneAllowed, setMicrophoneAllowed] = useState<boolean | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [isVideoCall, setIsVideoCall] = useState<boolean>(false);

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);

  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const isInCallRef = useRef<boolean>(false);
  const ringtoneRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFirst = localStorage.getItem("webcall_firstname") || "";
      const savedLast = localStorage.getItem("webcall_lastname") || "";
      setFirstName(savedFirst);
      setLastName(savedLast);
    }

  }, []);

  useEffect(() => {
    isInCallRef.current = (callStatus !== 'idle' || activeCall !== null || incomingCall !== null);
  }, [callStatus, activeCall, incomingCall]);

  useEffect(() => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const playIncomingRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.stop();
    }
    ringtoneRef.current = startRingtone();
  };

  const stopIncomingRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.stop();
      ringtoneRef.current = null;
    }
  };

  useEffect(() => {
    if (!isJoined) return;

    let localStream: MediaStream | null = null;
    let peer: any = null;
    let interval: NodeJS.Timeout;
    let isMounted = true;

    async function initPeer() {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true
        });

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInput = devices.some(d => d.kind === "videoinput");
          setHasCamera(videoInput);
        } catch {
          setHasCamera(false);
        }

        if (!isMounted) {
          localStream.getTracks().forEach(track => track.stop());
          return;
        }

        setMicrophoneAllowed(true);
        localStreamRef.current = localStream;

        const { default: Peer } = await import("peerjs");

        const sanitizedFirst = firstName.trim().replace(/[^a-zA-Z0-9]/g, "");
        const sanitizedLast = lastName.trim().replace(/[^a-zA-Z0-9]/g, "");
        const encodedId = `${sanitizedFirst}-${sanitizedLast}_${generateUUID()}`;

        peer = new Peer(encodedId, {
          host: 'peerbackend-0vvx.onrender.com',
          port: 443,
          secure: true,
          path: '/'
        });

        peer.on("open", (id: string) => {
          if (isMounted) {
            setMyId(id);
          }
        });

        peer.on("call", (call: any) => {
          if (!isMounted) return;

          if (isInCallRef.current) {
            call.answer();
            call.close();
            return;
          }

          setIncomingCall(call);
          playIncomingRingtone();

          call.on("close", () => {
            if (isMounted) {
              setIncomingCall(null);
              setPartnerId(null);
              setCallStatus("idle");
              setActiveCall(null);
              setRemoteStream(null);
              setIsVideoCall(false);
            }
            stopIncomingRingtone();
          });

          call.on("error", (err: any) => {
            console.error("Erreur appel entrant :", err);
            if (isMounted) {
              setIncomingCall(null);
              setPartnerId(null);
              setCallStatus("idle");
              setActiveCall(null);
              setRemoteStream(null);
              setIsVideoCall(false);
            }
            stopIncomingRingtone();
          });
        });

        if (isMounted) {
          setPeerInstance(peer);
        }

        interval = setInterval(() => {
          if (peer && !peer.destroyed) {
            peer.listAllPeers((peers: string[]) => {
              if (isMounted) {
                setListUser(peers);
              }
            });
          }
        }, 2500);

      } catch (err) {
        console.error("Microphone refusé :", err);
        if (isMounted) {
          setMicrophoneAllowed(false);
        }
      }
    }

    initPeer();

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
      stopIncomingRingtone();
    };
  }, [isJoined]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    if (typeof window !== 'undefined') {
      localStorage.setItem("webcall_firstname", firstName.trim());
      localStorage.setItem("webcall_lastname", lastName.trim());
    }
    setIsJoined(true);
  };

  const handleCopyId = () => {
    if (!myId || myId === "Génération...") return;
    navigator.clipboard.writeText(myId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startCall = async (targetId: string, withVideo: boolean) => {
    if (!peerInstance || !localStreamRef.current) return;

    let streamToSend = localStreamRef.current;

    if (withVideo) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true
        });
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = videoStream;
        streamToSend = videoStream;
      } catch {
        withVideo = false;
      }
    }

    setIsMuted(false);
    setIsCameraOff(!withVideo);
    setCallStatus("calling");
    setIsVideoCall(withVideo);
    setPartnerId(targetId);

    const call = peerInstance.call(targetId, streamToSend);
    setActiveCall(call);

    call.on("stream", (stream: any) => {
      setCallStatus("connected");
      setRemoteStream(stream);

      const hasRemoteVideo = stream.getVideoTracks().some((t: MediaStreamTrack) => t.enabled);
      if (hasRemoteVideo) {
        setIsVideoCall(true);
      }
    });

    call.on("close", () => {
      cleanupCallStates();
    });

    call.on("error", (err: any) => {
      console.error("Erreur d'appel :", err);
      cleanupCallStates();
    });
  };

  const acceptCall = async () => {
    if (!incomingCall || !localStreamRef.current) return;

    const call = incomingCall;

    call.answer(localStreamRef.current);

    setIsMuted(false);
    setIsCameraOff(true);
    setCallStatus("connected");
    setPartnerId(call.peer);
    setActiveCall(call);
    setIncomingCall(null);
    stopIncomingRingtone();

    call.on("stream", async (stream: any) => {
      setRemoteStream(stream);
      const hasRemoteVideo = stream.getVideoTracks().length > 0;
      setIsVideoCall(hasRemoteVideo);

      if (hasRemoteVideo && hasCamera) {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: true
          });
          localStreamRef.current!.getTracks().forEach(track => track.stop());
          localStreamRef.current = videoStream;
          setIsCameraOff(false);

          const senders = call.peerConnection?.getSenders();
          if (senders) {
            const videoTrack = videoStream.getVideoTracks()[0];
            const audioTrack = videoStream.getAudioTracks()[0];
            for (const sender of senders) {
              if (sender.track?.kind === "video" && videoTrack) {
                sender.replaceTrack(videoTrack);
              } else if (sender.track?.kind === "audio" && audioTrack) {
                sender.replaceTrack(audioTrack);
              }
            }
          }
        } catch {
          setIsCameraOff(true);
        }
      }
    });
  };

  const declineCall = () => {
    if (incomingCall) {
      incomingCall.close();
      setIncomingCall(null);
      stopIncomingRingtone();
    }
  };

  const endCall = () => {
    if (activeCall) {
      activeCall.close();
    }
    cleanupCallStates();
  };

  const cleanupCallStates = async () => {
    setPartnerId(null);
    setCallStatus("idle");
    setActiveCall(null);
    setRemoteStream(null);
    stopIncomingRingtone();
    setIsMuted(false);
    setIsCameraOff(false);
    setIsVideoCall(false);

    if (localStreamRef.current) {
      const hasVideo = localStreamRef.current.getVideoTracks().length > 0;
      if (hasVideo) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        try {
          const audioOnly = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          localStreamRef.current = audioOnly;
        } catch {
          localStreamRef.current = null;
        }
      }
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current && hasCamera) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };


  const onlinePeers = listUser.filter(id => id !== myId && id !== "");
  const myParsed = parsePeerName(myId);

  if (!isJoined) {
    return (
      <LoginScreen
        firstName={firstName}
        lastName={lastName}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onJoin={handleJoin}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-slate-800 dark:text-zinc-100 transition-colors duration-300">
      <Header onlineCount={onlinePeers.length} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <audio ref={remoteAudioRef} autoPlay />

        <div className="md:col-span-1 flex flex-col gap-6">
          <ProfileCard
            name={myParsed.name}
            peerId={myId}
            copied={copied}
            onCopy={handleCopyId}
            microphoneAllowed={microphoneAllowed}
            hasCamera={hasCamera}
          />
          <HelpCard />
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          {incomingCall && (
            <IncomingCallPanel
              callerPeerId={incomingCall.peer}
              onAccept={acceptCall}
              onDecline={declineCall}
            />
          )}

          {callStatus !== "idle" && (
            isVideoCall ? (
              <VideoCallPanel
                callStatus={callStatus}
                partnerId={partnerId}
                remoteStream={remoteStream}
                localStream={localStreamRef.current}
                isMuted={isMuted}
                isCameraOff={isCameraOff}
                hasCamera={hasCamera}
                onToggleMute={toggleMute}
                onToggleCamera={toggleCamera}
                onEndCall={endCall}
              />
            ) : (
              <AudioCallPanel
                callStatus={callStatus}
                partnerId={partnerId}
                onEndCall={endCall}
              />
            )
          )}

          {callStatus === "connected" && (
            <LiveTranslator isActive={callStatus === "connected"} />
          )}

          <PeerList
            peers={onlinePeers}
            callStatus={callStatus}
            hasIncomingCall={incomingCall !== null}
            hasCamera={hasCamera}
            onStartCall={startCall}
          />
        </div>
      </main>

      <footer className="w-full max-w-5xl mx-auto px-6 py-6 text-center text-xs text-slate-400 dark:text-zinc-600 border-t border-slate-200/60 dark:border-zinc-800/60 mt-12">
        <p>&copy; 2026 WebCall. Conçu pour des appels audio et vidéo instantanés et sécurisés via WebRTC.</p>
      </footer>
    </div>
  );
}
