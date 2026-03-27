// ============================================================
//  BattleQueue — All queued actions sorted highest → lowest speed
// ============================================================

import { SpeedCheckAllAvailableActions } from '../battle/engine/battle_engine';

const ENEMY_COLOR = '#e94560';

export default function BattleQueue({ characters, phase, onToggleLog, logOpen }) {
  // First action of each character with SPEED_CALC tags applied (accurate speeds)
  const firstActions = SpeedCheckAllAvailableActions(characters).map(action => ({
    ...action,
    _char: characters.find(c => c.id === action.owner_id),
    _queueIndex: 0,
  }));
  // Remaining actions (index 1+) with queue position tracked
  const remainingActions = characters.flatMap(char =>
    (char.queue || []).slice(1).map((action, i) => ({
      ...action,
      _char: char,
      _queueIndex: i + 1,
    }))
  );

  const allActions = phase === 'BATTLE'
    ? [...firstActions, ...remainingActions].sort((a, b) => {
        // Same character: always preserve queue order
        if (a.owner_id === b.owner_id) return a._queueIndex - b._queueIndex;
        // Different characters: highest speed first
        return b.calc_speed - a.calc_speed;
      })
    : [];

  return (
    <div
      className="h-[8%] flex items-center border-y border-white/10"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      {/* Scrollable card row */}
      <div className="flex-1 overflow-x-auto h-full">
        <div className="flex items-center justify-center gap-2 min-w-full h-full px-4 py-2">
        {allActions.length === 0 ? (
          <span className="text-[9px] font-mono text-gray-700 tracking-widest">NO ACTIONS QUEUED</span>
        ) : (
          allActions.map((action, i) => {
            const isPlayer = action._char.is_player;
            const color = action.color || (isPlayer ? '#4da6ff' : ENEMY_COLOR);
            const icon = action.icon || action._char.icon || '⚔️';

            return (
              <div
                key={i}
                className="flex flex-col flex-shrink-0"
                style={{
                  width: '3.5rem',
                  height: '5.25rem',
                  background: '#09090f',
                  border: `2px solid ${color}`,
                  borderRadius: '3px',
                  boxShadow: `0 0 8px ${color}44`,
                  isolation: 'isolate',
                }}
              >
                {/* Header */}
                <div
                  className="relative flex-shrink-0"
                  style={{ background: color, height: '1.1rem', overflow: 'visible', zIndex: 2 }}
                >
                  <span className="absolute inset-x-0 top-0 px-[2px] pt-[2px] text-[7px] font-bold font-mono text-white tracking-wide uppercase text-center leading-tight">
                    {action.name}
                  </span>
                </div>

                {/* Art */}
                <div className="relative flex-1">
                  <div className="absolute inset-0 overflow-hidden flex items-center justify-center"
                    style={{ background: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), ${color}` }}>
                    {action.image
                      ? <img src={action.image} alt={action.name} className="w-full h-full object-contain" />
                      : <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                    }
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)' }} />
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ background: '#0d0d1a', borderTop: `1px solid ${color}55`, height: '1rem' }}
                >
                  <span className="text-[9px] font-bold font-mono" style={{ color }}>
                    SPD {action.calc_speed}
                  </span>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>

      {/* Log toggle */}
      <div className="flex-shrink-0 px-3 border-l border-white/10 h-full flex items-center">
        <button
          onClick={onToggleLog}
          className="text-[8px] font-mono tracking-widest px-2 py-1 rounded border transition-colors"
          style={{ borderColor: logOpen ? '#4da6ff' : '#374151', color: logOpen ? '#4da6ff' : '#4b5563' }}
        >
          LOG
        </button>
      </div>
    </div>
  );
}
