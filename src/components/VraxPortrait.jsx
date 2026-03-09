// ============================================================
//  VraxPortrait — Center focal point of player zone
// ============================================================

export default function VraxPortrait({ player }) {
  const hpPct = Math.max(0, (player.health / player.max_health) * 100);

  return (
    <div className="flex flex-col items-center">
      {/* w-64 h-96 = 256×384 = 2:3 card ratio */}
      <div className="w-64 h-96 bg-white rounded-2xl border-4 border-[#4da6ff] flex flex-col
        shadow-[0_0_60px_rgba(77,166,255,0.5)] overflow-hidden">

        {/* Banner */}
        <div className="w-full bg-[#4da6ff] py-2 text-center text-xs font-bold text-white tracking-widest font-body shrink-0">
          FIGHTER
        </div>

        {/* Portrait — takes up most of the card */}
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="w-40 h-40 rounded-full bg-amber-50 border-4 border-[#ffd700] flex items-center justify-center shadow-inner"
            style={{ fontSize: '5.5rem' }}>
            {player.icon}
          </div>
        </div>

        {/* Name */}
        <div className="text-center font-display text-xl text-gray-800 tracking-widest py-2 shrink-0">
          {player.name}
        </div>

        {/* HP Bar */}
        <div className="px-4 shrink-0">
          <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
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
          <div className="text-center text-[11px] text-gray-500 font-mono mt-1 pb-3">
            {player.health} / {player.max_health} HP
          </div>
        </div>

      </div>
    </div>
  );
}
