// ============================================================
//  ActionQueue — Right of Vrax, shows 3 action slots + execute button
// ============================================================

export default function ActionQueue({ queue, totalSlots, onClearSlot, onExecute, isBattling, isResult }) {
  const PENALTIES = Array.from({ length: totalSlots }, (_, i) =>
    Math.round((i / totalSlots) * 100)
  );

  return (
    <div className="w-48 flex flex-col items-start justify-center gap-3 pl-3">
      <div className="text-[9px] text-gray-600 font-mono tracking-widest">ACTION QUEUE</div>

      {/* Slots */}
      <div className="flex flex-col gap-2 w-full">
        {Array.from({ length: totalSlots }).map((_, i) => {
          const slot = queue[i];
          return (
            <div
              key={i}
              onClick={() => slot && !isBattling && onClearSlot(i)}
              className={`relative w-full h-14 rounded-lg border flex items-center gap-2 px-2
                transition-all duration-200 cursor-pointer
                ${slot
                  ? 'border-[#ffd700]/60 bg-[#ffd700]/5 hover:bg-[#ffd700]/10'
                  : 'border-white/10 bg-white/5'
                }`}
            >
              {/* Slot label */}
              <div className="absolute -top-2 left-2 bg-[#0f0f1a] px-1 text-[8px] font-mono text-gray-500">
                SLOT {i + 1} {PENALTIES[i] > 0 ? `−${PENALTIES[i]}%` : ''}
              </div>

              {slot ? (
                <>
                  <span className="text-xl">{slot.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white font-body">{slot.name}</span>
                    <span className="text-[10px] text-[#ffd700] font-mono">{slot.calc_speed} SPD</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 opacity-30">
                  <span className="text-lg">＋</span>
                  <span className="text-[10px] font-mono text-gray-500">empty</span>
                </div>
              )}
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
