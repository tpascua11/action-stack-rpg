// ============================================================
//  BattleQueue — All queued actions sorted highest → lowest speed
// ============================================================

import { battle_registry } from '../../battle/registry/battle_registry';
import '../../battle/handlers'; // ensure tags are registered

const ENEMY_COLOR = '#e94560';

// Apply SPEED_CALC tags from the tag pool to an action's calc_speed (non-destructive).
function applySpeedCalc(action, tagPool) {
  let speed = action.calc_speed;
  for (const tag of tagPool) {
    const entry = battle_registry[tag.tag_name];
    if (entry?.phases?.includes('SPEED_CALC')) {
      const clone = { calc_speed: speed };
      entry.handlers['SPEED_CALC'](clone, null, tag);
      speed = clone.calc_speed;
    }
  }
  return speed;
}

// Simulate execution order the same way the battle engine does:
// each step pick the fastest queue[0] across all characters, remove it, repeat.
// Applies SPEED_CALC tags so boosted actions (e.g. after Speed Up) show correctly.
function simulateExecutionOrder(characters) {
  const queues = {};
  const tagPools = {};
  for (const char of characters) {
    if (char.health <= 0) continue;
    const filled = (char.queue || []).filter(Boolean);
    if (filled.length > 0) {
      queues[char.id] = filled.map(a => ({ ...a, _char: char }));
      tagPools[char.id] = [...(char.active_tag_pool || [])];
    }
  }

  const order = [];
  for (let step = 0; step < 50; step++) {
    const candidates = Object.entries(queues)
      .filter(([, q]) => q.length > 0)
      .map(([id, q]) => ({
        ...q[0],
        _simSpeed: applySpeedCalc(q[0], tagPools[id] || []),
      }));
    if (candidates.length === 0) break;
    candidates.sort((a, b) => b._simSpeed - a._simSpeed);
    const winner = candidates[0];
    order.push({ ...winner, calc_speed: winner._simSpeed });
    queues[winner.owner_id] = queues[winner.owner_id].slice(1);
  }
  return order;
}

export default function BattleQueue({ characters, phase }) {
  const allActions = phase === 'BATTLE' ? simulateExecutionOrder(characters) : [];

  return (
    <div
      className="h-[10rem] flex items-center border-y border-white/10"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      {/* Scrollable card row */}
      <div className="flex-1 overflow-x-auto h-full">
        <div className="flex items-center justify-center gap-2 min-w-full h-full px-4 py-2">
        {allActions.length === 0 ? (
          <span className="text-[9px] font-mono text-gray-700 tracking-widest">NO ACTIONS QUEUED</span>
        ) : (
          allActions.map((action, i) => {
            const isPlayer = action._char.faction === 'player';
            const color = action.color || (isPlayer ? '#4da6ff' : ENEMY_COLOR);
            const icon = action.icon || action._char.icon || '⚔️';

            return (
              <div
                key={i}
                className="flex flex-col flex-shrink-0"
                style={{
                  width: '5.5rem',
                  height: '8.25rem',
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
                  style={{ background: color, height: '1.3rem', overflow: 'visible', zIndex: 2 }}
                >
                  <span className="absolute inset-x-0 top-0 px-1 pt-[3px] text-[8px] font-bold font-mono text-white tracking-widest uppercase text-center leading-tight">
                    {action.name}
                  </span>
                </div>

                {/* Art */}
                <div className="relative flex-1">
                  <div className="absolute inset-0 overflow-hidden flex items-center justify-center"
                    style={{ background: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), ${color}` }}>
                    {action.image
                      ? <img src={action.image} alt={action.name} className="w-full h-full object-contain" />
                      : <span style={{ fontSize: '1.75rem' }}>{icon}</span>
                    }
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)' }} />
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ background: '#0d0d1a', borderTop: `1px solid ${color}55`, height: '1.1rem' }}
                >
                  <span className="text-[11px] font-bold font-mono" style={{ color }}>
                    SPD {action.calc_speed}
                  </span>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>

    </div>
  );
}
