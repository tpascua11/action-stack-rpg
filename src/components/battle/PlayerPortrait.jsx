// ============================================================
//  PlayerPortrait — Center focal point of player zone
// ============================================================
import { COOL_FOX as fallbackImg } from '../../assets';

export default function PlayerPortrait({ player, activeAnimations = {} }) {
  const hpPct = Math.max(0, (player.health / player.max_health) * 100);
  const portrait = player.portrait ?? fallbackImg;
  const anim = activeAnimations[player.id];

  return (
    <div className="flex flex-col items-center">
      {/* w-64 h-96 = 256×384 = 2:3 card ratio */}
      <div
        className={`relative w-[14rem] h-[21rem] rounded-2xl border-4 border-[#4da6ff]
          shadow-[0_0_60px_rgba(77,166,255,0.5)] overflow-hidden ${anim?.cssClass ?? ''}`}
        style={{ '--anim-intensity': anim?.intensity ?? 1 }}
      >

        {/* Portrait fills entire card */}
        <img src={portrait} alt={player.name} className="absolute inset-0 w-full h-full object-cover" />

        {/* Overlay UI */}
        <div className="absolute inset-0 flex flex-col justify-between">

          {/* Banner */}
          <div className="w-full py-2 text-center text-xs font-bold text-[#4da6ff] tracking-widest font-body">
            {player.class_id?.toUpperCase()}
          </div>

          {/* Name + HP Bar at bottom */}
          <div className="px-4 pb-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
            <div className="text-center font-display text-xl text-white tracking-widest py-2">
              {player.name}
            </div>
            <div className="relative w-full h-5 bg-gray-600/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${hpPct}%`,
                  background: hpPct > 50 ? 'linear-gradient(90deg,#4da6ff,#80c8ff)'
                    : hpPct > 25 ? 'linear-gradient(90deg,#ff6b35,#ffa500)'
                    : 'linear-gradient(90deg,#e94560,#ff6b6b)'
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white drop-shadow">
                {player.health} / {player.max_health} HP
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
