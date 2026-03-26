// ============================================================
//  ActionQueue — Card-shaped slots to the right of Vrax
// ============================================================

export default function ActionQueue({ queue, totalSlots, enemies, retargetingSlot, onRetargetBoxClick, onClearSlot, onExecute, isBattling, isResult }) {
  const PENALTIES = Array.from({ length: totalSlots }, (_, i) => i * 20);

  return (
    <div className="flex flex-col items-start gap-3">

      {/* Slots — horizontal row, same card size as Hand */}
      <div className="flex flex-row gap-2" style={{ paddingTop: '5rem' }}>
        {Array.from({ length: totalSlots }).map((_, i) => {
          const slot = queue[i];
          const borderColor = slot ? slot.color : '#ffffff22';
          return (
            <div key={i} className="relative flex flex-col overflow-visible" style={{ width: '5.5rem' }}>

              {/* Target box */}
              {slot && !isBattling && slot.tags?.target?.length > 0 && (() => {
                const target = enemies.find(e => e.id === slot.target_id);
                const enemyNum = enemies.findIndex(e => e.id === slot.target_id) + 1;
                return (
                  <div
                    className="absolute left-0 right-0 flex flex-col items-center cursor-pointer group"
                    data-retarget-slot={i}
                    style={{ top: '-5rem', zIndex: 10, height: '4rem' }}
                    onClick={e => { e.stopPropagation(); onRetargetBoxClick(i); }}
                  >
                    <div className="relative w-full flex flex-col items-center transition-all duration-150 group-hover:brightness-125 group-hover:-translate-y-[2px]"
                      style={{
                        background: '#0d0d1a',
                        border: retargetingSlot === i ? 'none' : '1px solid #e9456066',
                        borderBottom: 'none',
                        borderRadius: '3px 3px 0 0',
                        height: '100%',
                        boxShadow: retargetingSlot === i ? '0 0 12px rgba(77,166,255,0.5)' : 'none',
                      }}
                    >
                      {/* Marching ants border */}
                      {retargetingSlot === i && (
                        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" style={{ borderRadius: '3px 3px 0 0', overflow: 'visible' }}>
                          <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
                            fill="none" stroke="#4da6ff" strokeWidth="2"
                            style={{ animation: 'pulseBorder 1.2s ease-in-out infinite' }}
                          />
                        </svg>
                      )}
                      {/* Enemy # label */}
                      <div className="w-full text-center py-[2px]"
                        style={{ background: '#e94560', borderRadius: '2px 2px 0 0' }}>
                        <span className="text-[7px] font-bold font-mono tracking-widest text-white">
                          ENEMY {enemyNum}
                        </span>
                      </div>
                      {/* Icon */}
                      <div className="flex-1 flex items-center justify-center">
                        {target?.image
                          ? <img src={target.image} alt={target.name} className="w-6 h-6 object-contain" />
                          : <span style={{ fontSize: '1.1rem' }}>{target?.icon ?? '?'}</span>
                        }
                      </div>
                      {/* Name */}
                      <div className="text-[8px] font-mono text-gray-300 tracking-wide pb-[3px] truncate px-1 text-center w-full">
                        {target?.name ?? '???'}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Card — hover and click isolated here */}
              <div
                onClick={() => slot && !isBattling && onClearSlot(i)}
                className={`flex flex-col transition-all duration-200 ${slot ? 'cursor-pointer hover:scale-105 hover:-translate-y-1' : 'border-dashed'}`}
                style={{
                  height: '8.25rem',
                  background: '#09090f',
                  border: `2px ${slot ? 'solid' : 'dashed'} ${borderColor}`,
                  borderRadius: '3px',
                  boxShadow: slot ? `0 0 10px ${slot.color}55, inset 0 0 6px ${slot.color}11` : 'none',
                  isolation: 'isolate',
                }}
              >
                {/* Header strip */}
                <div className="relative flex-shrink-0"
                  style={{ background: slot ? slot.color : 'rgba(255,255,255,0.04)', height: '1.3rem', overflow: 'visible', zIndex: 2 }}>
                  <span className="absolute inset-x-0 top-0 px-1 pt-[3px] text-[8px] font-bold font-mono tracking-widest uppercase text-center leading-tight"
                    style={{ color: slot ? '#fff' : '#4b5563' }}>
                    {slot ? slot.name : `SLOT ${i + 1}`}
                  </span>
                </div>

                {/* Art area */}
                <div className="relative flex-1"
                  style={{ background: slot ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                    {slot ? (
                      <>
                        {slot.image
                          ? <img src={slot.image} alt={slot.name} className="w-full h-full object-contain" />
                          : <span className="text-3xl">{slot.icon}</span>
                        }
                        {/* Scanlines */}
                        <div className="absolute inset-0 pointer-events-none"
                          style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)' }} />
                      </>
                    ) : (
                      <span className="text-2xl" style={{ color: '#ffffff11' }}>＋</span>
                    )}
                  </div>
                </div>

                {/* Footer strip */}
                <div className="flex items-center justify-center flex-shrink-0"
                  style={{ background: '#0d0d1a', borderTop: `1px solid ${slot ? slot.color + '55' : '#ffffff11'}`, height: '1.1rem' }}>
                  <span className="text-[11px] font-bold font-mono"
                    style={{ color: slot ? slot.color : '#4b5563' }}>
                    {slot ? `SPD ${slot.calc_speed}` : (PENALTIES[i] > 0 ? `−${PENALTIES[i]} SPD` : '—')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execute Button */}
      {isResult ? (
        <button
          className="w-full py-2 rounded-lg font-display tracking-widest text-sm text-white
            bg-[#4da6ff] hover:scale-105 transition-transform shadow-lg"
          onClick={onExecute}
        >
          NEW GAME
        </button>
      ) : (
        <button
          disabled={isBattling || !queue.some(Boolean)}
          onClick={onExecute}
          className={`w-full py-2 rounded-lg font-display tracking-widest text-sm text-white transition-all
            ${isBattling || !queue.some(Boolean)
              ? 'bg-gray-700 opacity-40 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#e94560] to-[#b83b5e] hover:scale-105 shadow-[0_0_15px_rgba(233,69,96,0.4)]'
            }`}
        >
          {isBattling ? 'RESOLVING...' : 'EXECUTE PLAN'}
        </button>
      )}
    </div>
  );
}
