// ============================================================
//  EnemyZone — Top section showing enemy cards with HP bars
//  Layout per enemy: [Tags] [Card] [Action Stack]
// ============================================================

import { ui_registry, UI_DEFAULT } from '../battle/registry/ui_registry';

export default function EnemyZone({ enemies, shakingEnemyId, selectedTargetId, phase, onSelectTarget }) {
  return (
    <div className="flex-1 min-h-0 grid pb-2 border-b border-red-900/30"
      style={{
        background: 'radial-gradient(circle at center, #2a1520 0%, #0f0f1a 100%)',
        gridTemplateColumns: 'repeat(5, 1fr)',
      }}>

      {enemies.map(enemy => {
        const hpPct = Math.max(0, (enemy.health / enemy.max_health) * 100);
        const isDead = enemy.health <= 0;
        const isShaking = shakingEnemyId === enemy.id;
        const isSelected = selectedTargetId === enemy.id && !isDead;
        const isSelectable = phase === 'QUEUE_SETUP' && !isDead;
        const tags = enemy.active_tag_pool || [];
        const actions = enemy.queue || [];
        const visibleActions = actions.slice(0, 3);

        return (
          <div
            key={enemy.id}
            className={`flex flex-row items-end justify-center gap-1.5 transition-opacity duration-500 ${isDead ? 'opacity-30' : 'opacity-100'} ${isSelectable ? 'cursor-pointer' : ''}`}
            onClick={e => { if (!isSelectable) return; e.stopPropagation(); onSelectTarget(enemy.id); }}
          >

            {/* Left: Tag List */}
            <div className="flex flex-col gap-1 items-end w-10 shrink-0">
              {tags.slice(0, 5).map((tag, i) => {
                const display = ui_registry[tag.tag_name] || UI_DEFAULT;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-0.5 rounded px-1 py-0.5 w-full"
                    style={{
                      background: display.color + '22',
                      border: `1px solid ${display.color}55`,
                    }}
                    title={display.describe(tag)}
                  >
                    <span className="text-[9px] leading-none">{display.icon}</span>
                    <span
                      className="text-[7px] font-mono font-bold leading-none truncate"
                      style={{ color: display.color }}
                    >
                      {tag.tag_name.replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Center: Enemy Card */}
            <div
              data-enemy-id={enemy.id}
              className={`w-32 h-48 bg-white rounded-lg border-2 flex flex-col items-center overflow-hidden shrink-0 ${isShaking ? 'animate-shake' : ''}`}
              style={{
                borderColor: isSelected ? '#ff0030' : '#e94560',
                boxShadow: isSelected
                  ? '0 0 28px rgba(255,0,48,0.8), 0 0 8px rgba(255,0,48,0.5)'
                  : '0 0 20px rgba(233,69,96,0.3)',
              }}
            >
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
                    background: hpPct > 50
                      ? 'linear-gradient(90deg,#e94560,#ff6b6b)'
                      : hpPct > 25
                        ? 'linear-gradient(90deg,#ff6b35,#ffa500)'
                        : 'linear-gradient(90deg,#888,#aaa)',
                  }}
                />
              </div>
              <div className="text-[10px] text-gray-500 mb-2 font-mono">{enemy.health} / {enemy.max_health}</div>
            </div>

            {/* Right: Action Stack */}
            <div className="relative shrink-0" style={{ width: '60px', height: '76px' }}>
              {visibleActions.length === 0 ? (
                <div
                  className="absolute inset-0 rounded border flex items-center justify-center"
                  style={{ borderColor: '#3a1020', background: '#0d0509' }}
                >
                  <span className="text-[9px] text-gray-700 font-mono">—</span>
                </div>
              ) : (
                /* Render back-to-front so front card sits on top in DOM */
                [...visibleActions].reverse().map((action, ri) => {
                  const frontIndex = visibleActions.length - 1 - ri; // 0 = next action (front)
                  const isTop = frontIndex === 0;
                  const offsetY = frontIndex * 4;
                  const offsetX = frontIndex * 4;

                  return (
                    <div
                      key={ri}
                      className="absolute rounded border flex flex-col items-center overflow-hidden"
                      style={{
                        width: '48px',
                        height: '64px',
                        top: offsetY,
                        left: offsetX,
                        background: isTop ? '#1a0a0f' : '#110408',
                        borderColor: isTop ? '#e94560' : '#4a1020',
                        boxShadow: isTop ? '0 2px 10px rgba(233,69,96,0.45)' : 'none',
                        zIndex: visibleActions.length - frontIndex,
                      }}
                    >
                      {isTop ? (
                        <>
                          <div
                            className="w-full py-0.5 text-center text-[7px] font-bold text-white tracking-wider font-body shrink-0"
                            style={{ background: '#e94560' }}
                          >
                            NEXT
                          </div>
                          <div className="flex-1 flex flex-col items-center justify-center px-1 gap-0.5">
                            <div className="text-[8px] text-gray-200 font-mono font-bold text-center leading-tight">
                              {action.name}
                            </div>
                            <div className="text-[8px] text-[#4da6ff] font-mono">
                              {action.calc_speed}
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Back cards just show a subtle header to look like a card back */
                        <div
                          className="w-full py-0.5 text-center text-[7px] font-bold tracking-wider font-body"
                          style={{ background: '#2a0810', color: '#6a2030' }}
                        >
                          ···
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        );
      })}

    </div>
  );
}
