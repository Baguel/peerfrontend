export function generateUUID() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function parsePeerName(peerId: string) {
  if (!peerId || peerId === "Génération...") {
    return { name: "Génération...", id: "" };
  }

  const underscoreIndex = peerId.indexOf("_");
  if (underscoreIndex === -1) {
    return { name: peerId, id: peerId };
  }

  const namePart = peerId.substring(0, underscoreIndex);
  const uuidPart = peerId.substring(underscoreIndex + 1);
  const dashIndex = namePart.indexOf("-");

  if (dashIndex === -1) {
    return { name: namePart, id: uuidPart };
  }

  const first = namePart.substring(0, dashIndex);
  const last = namePart.substring(dashIndex + 1);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  return {
    name: `${capitalize(first)} ${capitalize(last)}`,
    rawName: namePart,
    id: uuidPart
  };
}

export function startRingtone() {
  try {
    const audio = new Audio("/YTDown_YouTube_Wantche-ft-OG-Mahilet-BAHI_Media_TMEqxzRfKaU_009_128k.mp3");
    audio.loop = true;
    audio.volume = 0.7;
    audio.play().catch((e) => console.warn("Impossible de jouer la sonnerie :", e));

    return {
      stop: () => {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  } catch (e) {
    console.error("Erreur sonnerie :", e);
    return null;
  }
}
