// ============================================================
//  ActionQueue — Card-shaped slots to the right of Vrax
// ============================================================

export default function ActionQueue({ queue, totalSlots, onClearSlot, onExecute, isBattling, isResult }) {
  const PENALTIES = Array.from({ length: totalSlots }, (_, i) =>
    Math.round((i / totalSlots) * 100)
  );

  return (
    <div className="flex flex-col items-start gap-3">

      {/* Slots — horizontal row, same card size as Hand */}
      <div className="flex flex-row gap-2">
        {Array.from({ length: totalSlots }).map((_, i) => {
          const slot = queue[i];
          const borderColor = slot ? slot.color : '#ffffff22';
          return (
            <div
              key={i}
              onClick={() => slot && !isBattling && onClearSlot(i)}
              className={`relative flex flex-col overflow-visible transition-all duration-200
                ${slot ? 'cursor-pointer hover:scale-105 hover:-translate-y-1' : 'border-dashed'}`}
              style={{
                width: '5.5rem',
                height: '8.25rem',
                background: '#09090f',
                border: `2px ${slot ? 'solid' : 'dashed'} ${borderColor}`,
                borderRadius: '3px',
                boxShadow: slot ? `0 0 10px ${slot.color}55, inset 0 0 6px ${slot.color}11` : 'none',
              }}
            >
              {/* Header strip */}
              <div className="flex items-center justify-center px-1 flex-shrink-0"
                style={{ background: slot ? slot.color : 'rgba(255,255,255,0.04)', height: '1.3rem' }}>
                <span className="text-[8px] font-bold font-mono tracking-widest truncate uppercase"
                  style={{ color: slot ? '#fff' : '#4b5563' }}>
                  {slot ? slot.name : `SLOT ${i + 1}`}
                </span>
              </div>

              {/* Art area */}
              <div className="relative flex-1 overflow-hidden flex items-center justify-center"
                style={{ background: slot ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
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

              {/* Footer strip */}
              <div className="flex items-center justify-center flex-shrink-0"
                style={{ background: '#0d0d1a', borderTop: `1px solid ${slot ? slot.color + '55' : '#ffffff11'}`, height: '1.1rem' }}>
                <span className="text-[11px] font-bold font-mono"
                  style={{ color: slot ? slot.color : '#4b5563' }}>
                  {slot ? `SPD ${slot.calc_speed}` : (PENALTIES[i] > 0 ? `−${PENALTIES[i]}%` : '—')}
                </span>
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
