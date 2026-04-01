// ============================================================
//  EnemyZone — Top section showing enemy cards with HP bars
//  Layout per enemy: [Tags] [Card] [Action Stack]
// ============================================================

import { ui_registry, UI_DEFAULT } from '../battle/registry/ui_registry';
import { STATUS_DEFAULT as DEFAULT_ICON } from '../asssets';

export default function EnemyZone({ enemies, shakingEnemyId, selectedTargetId, phase, onSelectTarget }) {
  return (
    <div className="flex-1 min-h-0 flex flex-row items-end justify-center gap-6 pb-2 border-b border-red-900/30"
      style={{
        background: 'radial-gradient(circle at center, #2a1520 0%, #0f0f1a 100%)',
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

            {/* Left: Tag Pool — same width as right side so card stays centered */}
            <div className="flex flex-col gap-1 shrink-0" style={{ width: '8rem' }}>
              {tags.length === 0 ? (
                <div className="flex items-center justify-center h-8">
                  <span className="text-[9px] text-gray-700 font-mono italic">no buffs</span>
                </div>
              ) : tags.slice(0, 8).map((tag, i) => {
                const display = ui_registry[tag.tag_name] || UI_DEFAULT;
                const description = display.describe(tag);
                const hasDesc = description && description !== 'active';
                return (
                  <div
                    key={i}
                    className="group relative flex flex-row items-center overflow-visible border"
                    style={{
                      minHeight: '1.75rem',
                      background: '#09090f',
                      borderColor: display.color,
                      borderRadius: '3px',
                      boxShadow: `0 0 6px ${display.color}44, inset 0 0 4px ${display.color}11`,
                    }}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 flex items-center justify-center p-0.5" style={{ width: '1.75rem', height: '1.75rem' }}>
                      <img
                        src={display.statusIcon ?? DEFAULT_ICON}
                        alt={tag.tag_name}
                        className="w-full h-full object-contain"
                        style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: '2px' }}
                      />
                    </div>

                    {/* Name + duration */}
                    <div className="flex flex-row items-center justify-between min-w-0 flex-1 self-stretch py-0.5 pr-1">
                      {(tag.stacks ?? tag.stack_count ?? 1) > 1 && (
                        <>
                          <span className="flex-shrink-0 text-[9px] text-white font-mono mr-0.5 self-center">
                            x{tag.stacks ?? tag.stack_count}
                          </span>
                          <div className="flex-shrink-0 self-stretch w-px ml-0.5 mr-1" style={{ background: 'rgba(255,255,255,0.15)' }} />
                        </>
                      )}
                      <div
                        className={`text-[9px] font-bold tracking-wide font-body leading-tight flex-1 min-w-0 flex items-center ${(tag.stacks ?? tag.stack_count ?? 1) <= 1 ? 'ml-0.5' : ''}`}
                        style={{ color: display.color }}
                      >
                        <span className="truncate">{tag.tag_name.replace(/_/g, ' ')}</span>
                      </div>
                      {tag.duration && (
                        <span className="flex-shrink-0 text-[9px] text-[#ffd700] font-mono ml-0.5 self-center">{tag.duration}⏳</span>
                      )}
                    </div>

                    {/* Tooltip */}
                    {hasDesc && (
                      <div
                        className="pointer-events-none absolute bottom-[calc(100%+6px)] left-0
                          w-40 rounded-lg border border-gray-600 shadow-xl z-[100]
                          opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                        style={{ background: '#1a1a2e' }}
                      >
                        <div className="h-1 rounded-t-lg" style={{ background: display.color }} />
                        <div className="px-3 py-2 flex flex-col gap-1">
                          <div className="text-[10px] font-bold font-body" style={{ color: display.color }}>
                            {tag.tag_name.replace(/_/g, ' ')}
                          </div>
                          <div className="text-[9px] text-gray-300 font-mono leading-tight">{description}</div>
                          {tag.duration && (
                            <div className="text-[8px] text-[#ffd700] font-mono">{tag.duration} turns remaining</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Center: Enemy Card */}
            <div
              data-enemy-id={enemy.id}
              className={`w-48 h-72 bg-white rounded-lg border-2 flex flex-col items-center overflow-hidden shrink-0 ${isShaking ? 'animate-shake' : ''}`}
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

            {/* Right: Action Stack — padded to match left width (8rem) so card stays centered */}
            <div className="shrink-0 flex items-end" style={{ width: '8rem' }}>
              <div className="relative" style={{ width: '60px', height: '76px' }}>
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

          </div>
        );
      })}

    </div>
  );
}
