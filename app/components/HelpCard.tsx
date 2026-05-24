"use client";

export default function HelpCard() {
  return (
    <div className="p-5 bg-blue-50/50 dark:bg-zinc-900/30 border border-blue-100/50 dark:border-zinc-800/40 rounded-2xl">
      <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">Comment ça marche ?</h3>
      <ul className="text-xs text-slate-600 dark:text-zinc-400 flex flex-col gap-2 list-disc list-inside">
        <li>Appelez en **Audio** pour une simple conversation vocale.</li>
        <li>Appelez en **Vidéo** pour partager vos caméras en temps réel.</li>
        <li>Vous pouvez couper votre micro ou votre caméra à tout moment pendant un appel vidéo via les contrôles.</li>
      </ul>
    </div>
  );
}
