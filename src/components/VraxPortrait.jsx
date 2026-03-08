// ============================================================
//  VraxPortrait — Center of player zone
// ============================================================

export default function VraxPortrait({ player }) {
  const hpPct = Math.max(0, (player.health / player.max_health) * 100);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Card */}
      <div className="w-36 bg-white rounded-xl border-4 border-[#4da6ff] flex flex-col items-center
        shadow-[0_0_30px_rgba(77,166,255,0.35)] animate-pulse_glow overflow-hidden">
        <div className="w-full bg-[#4da6ff] py-1 text-center text-[10px] font-bold text-white tracking-widest font-body">
          FIGHTER
        </div>
        {/* Portrait */}
        <div className="w-24 h-24 rounded-full bg-amber-50 border-4 border-[#ffd700] flex items-center justify-center
          text-5xl mt-3 shadow-inner">
          {player.icon}
        </div>
        <div className="font-display text-base text-gray-800 tracking-widest mt-2">{player.name}</div>

        {/* HP Bar */}
        <div className="w-[85%] h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${hpPct}%`,
              background: hpPct > 50 ? 'linear-gradient(90deg,#4da6ff,#80c8ff)'
                : hpPct > 25 ? 'linear-gradient(90deg,#ff6b35,#ffa500)'
                : 'linear-gradient(90deg,#e94560,#ff6b6b)'
            }}
          />
        </div>
        <div className="text-[10px] text-gray-500 mb-3 mt-1 font-mono">{player.health} / {player.max_health}</div>
      </div>
    </div>
  );
}
