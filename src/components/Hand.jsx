// ============================================================
//  Hand — Bottom section showing available cards to play
// ============================================================

import { calcSpeed } from '../battle/engine/battle_engine';

export default function Hand({ cards, queue, totalSlots, onCardClick, disabled }) {
  const nextSlotIndex = queue.length < totalSlots ? queue.length : -1;

  return (
    <div className="flex-1 flex flex-col border-t border-white/10"
      style={{ background: 'rgba(0,0,0,0.25)' }}>
      <div className="text-[9px] text-gray-600 font-mono tracking-widest px-4 pt-2">HAND</div>

      <div className="flex-1 flex items-end justify-center px-4 pb-3">
        {cards.map((card, idx) => {
          const wouldSpeed = nextSlotIndex >= 0
            ? calcSpeed(card.speed, nextSlotIndex, totalSlots)
            : null;
          const isDisabled = disabled || nextSlotIndex === -1;

          return (
            <div
              key={card.id}
              onClick={() => !isDisabled && onCardClick(card)}
              className={`group relative overflow-visible rounded-lg border
                transition-all duration-200 shadow-lg
                ${isDisabled
                  ? 'opacity-40 cursor-not-allowed border-gray-700'
                  : 'cursor-pointer border-gray-600 hover:-translate-y-8 hover:scale-110 hover:border-[#ffd700] hover:z-50'
                }`}
              style={{
                background: '#fff',
                marginLeft: idx > 0 ? '-18px' : '0',
                width: '5.5rem',
                height: '8.25rem',
            }}
            >
              {/* Art fills entire card */}
              <div className="absolute inset-0 flex items-center justify-center text-3xl rounded-lg"
                style={{ background: card.color + '33' }}>
                {card.icon}
              </div>

              {/* Overlay UI */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {/* Speed — top left */}
                <div className="flex justify-start p-1">
                  <span className="text-[10px] font-bold font-mono text-white bg-black/50 rounded px-1">
                    {wouldSpeed !== null && !isDisabled ? wouldSpeed : card.speed}
                  </span>
                </div>

                {/* Name — bottom */}
                <div className="px-1 pb-1"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                  <div className="text-center text-[10px] font-bold text-white font-body tracking-wide truncate">
                    {card.name}
                  </div>
                </div>
              </div>

              {/* Tooltip */}
              {!isDisabled && (
                <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2
                  w-44 rounded-lg border border-gray-600 shadow-xl z-[100]
                  opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{ background: '#1a1a2e' }}>
                  {/* Colour bar */}
                  <div className="h-1 rounded-t-lg" style={{ background: card.color }} />
                  <div className="px-3 py-2 flex flex-col gap-1">
                    <div className="text-[11px] font-bold text-white font-body">{card.name}</div>
                    <div className="text-[9px] text-gray-400 font-mono">{card.tag_type.join(' · ')}</div>
                    <div className="text-[10px] text-gray-300 leading-tight mt-1">{card.desc}</div>
                    <div className="text-[9px] text-[#4da6ff] font-mono mt-1">BASE SPD {card.speed}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
