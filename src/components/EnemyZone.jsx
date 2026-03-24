// ============================================================
//  EnemyZone — Top section showing enemy cards with HP bars
// ============================================================

export default function EnemyZone({ enemies, shakingEnemyId }) {
  return (
    <div className="h-[22%] flex items-center justify-center gap-6 border-b border-red-900/30"
      style={{ background: 'radial-gradient(circle at center, #2a1520 0%, #0f0f1a 100%)' }}>

      {enemies.map(enemy => {
        const hpPct = Math.max(0, (enemy.health / enemy.max_health) * 100);
        const isDead = enemy.health <= 0;
        const isShaking = shakingEnemyId === enemy.id;

        return (
          <div key={enemy.id} className={`flex flex-col items-center gap-2 transition-opacity duration-500 ${isDead ? 'opacity-30' : 'opacity-100'}`}>

            {/* Enemy Card */}
            <div className={`w-28 bg-white rounded-lg border-2 border-[#e94560] flex flex-col items-center overflow-hidden
              shadow-[0_0_20px_rgba(233,69,96,0.3)] ${isShaking ? 'animate-shake' : ''}`}>
              <div className="w-full bg-[#e94560] py-1 text-center text-[10px] font-bold text-white tracking-widest font-body">
                ENEMY
              </div>
              <div className="text-5xl py-3">{enemy.icon}</div>
              <div className="font-display text-sm text-gray-800 tracking-widest mb-1">{enemy.name}</div>

              {/* HP Bar */}
              <div className="w-[85%] h-2 bg-gray-300 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${hpPct}%`,
                    background: hpPct > 50 ? 'linear-gradient(90deg,#e94560,#ff6b6b)'
                      : hpPct > 25 ? 'linear-gradient(90deg,#ff6b35,#ffa500)'
                      : 'linear-gradient(90deg,#888,#aaa)'
                  }}
                />
              </div>
              <div className="text-[10px] text-gray-500 mb-2 font-mono">{enemy.health} / {enemy.max_health}</div>
            </div>

            {/* Upcoming actions */}
            <div className="flex gap-1">
              {enemy.queue.slice(0, 2).map((action, i) => (
                <div key={i} className="bg-black/40 border border-red-900/40 rounded px-2 py-1 text-center">
                  <div className="text-[9px] text-gray-400 font-mono">{action.name}</div>
                  <div className="text-[9px] text-[#4da6ff] font-mono">SPD {action.calc_speed}</div>
                </div>
              ))}
            </div>

          </div>
        );
      })}

    </div>
  );
}
