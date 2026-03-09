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
          return (
            <div
              key={i}
              onClick={() => slot && !isBattling && onClearSlot(i)}
              className={`relative w-32 flex flex-col overflow-hidden rounded-lg border
                transition-all duration-200 shadow-lg
                ${slot
                  ? 'cursor-pointer border-[#ffd700]/70 shadow-[0_0_14px_rgba(255,215,0,0.2)] hover:scale-105 hover:border-[#ffd700]'
                  : 'border-dashed border-white/20'
                }`}
              style={{ background: slot ? '#fff' : 'rgba(255,255,255,0.03)' }}
            >
              {/* Banner */}
              <div className="py-1 text-center text-[9px] font-bold tracking-widest font-body truncate px-1"
                style={{ background: slot ? slot.color : 'rgba(255,255,255,0.06)', color: slot ? '#fff' : '#6b7280' }}>
                {slot ? slot.tag_type.filter(t => t !== 'WIZARD_PREP').join(' · ') : `SLOT ${i + 1}`}
              </div>

              {/* Icon */}
              <div className="flex items-center justify-center py-3 text-3xl border-b"
                style={{ background: slot ? '#f3f4f6' : 'rgba(255,255,255,0.03)', borderColor: slot ? '#e5e7eb' : 'rgba(255,255,255,0.06)', opacity: slot ? 1 : 0.3 }}>
                {slot ? slot.icon : '＋'}
              </div>

              {/* Stats */}
              <div className="flex justify-around py-1 text-[10px] font-bold"
                style={{ background: slot ? '#e5e7eb' : 'rgba(255,255,255,0.04)' }}>
                {slot ? (
                  <>
                    <span style={{ color: '#4da6ff' }}>BASE {slot.speed}</span>
                    <span style={{ color: '#ffd700' }}>{slot.calc_speed} SPD</span>
                  </>
                ) : (
                  <span style={{ color: '#4b5563' }}>
                    {PENALTIES[i] > 0 ? `−${PENALTIES[i]}% SPD` : '— SPD'}
                  </span>
                )}
              </div>

              {/* Name + Desc */}
              <div className="flex flex-col items-center px-1 py-2 flex-1">
                <div className="text-[11px] font-bold font-body tracking-wide"
                  style={{ color: slot ? '#1f2937' : '#374151', opacity: slot ? 1 : 0.35 }}>
                  {slot ? slot.name : 'empty'}
                </div>
                <div className="text-[9px] text-center mt-1 leading-tight"
                  style={{ color: slot ? '#6b7280' : 'transparent' }}>
                  {slot ? slot.desc : '.'}
                </div>
              </div>

              {/* Slot number badge */}
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/20 flex items-center justify-center
                text-[8px] font-mono" style={{ color: slot ? '#fff' : '#6b7280' }}>
                {i + 1}
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
