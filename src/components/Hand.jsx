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

      <div className="flex-1 flex items-center justify-center gap-[-20px] px-4">
        {cards.map((card, idx) => {
          const wouldSpeed = nextSlotIndex >= 0
            ? calcSpeed(card.speed, nextSlotIndex, totalSlots)
            : null;
          const isDisabled = disabled || nextSlotIndex === -1;

          return (
            <div
              key={card.id}
              onClick={() => !isDisabled && onCardClick(card)}
              className={`relative w-32 flex flex-col overflow-hidden rounded-lg border
                transition-all duration-200 shadow-lg
                ${isDisabled
                  ? 'opacity-40 cursor-not-allowed border-gray-700'
                  : 'cursor-pointer border-gray-600 hover:-translate-y-8 hover:scale-110 hover:border-[#ffd700] hover:z-50'
                }`}
              style={{
                background: '#fff',
                marginLeft: idx > 0 ? '-18px' : '0',
              }}
            >
              {/* Banner */}
              <div className="py-1 text-center text-[9px] font-bold text-white tracking-widest font-body"
                style={{ background: card.color }}>
                {card.tag_type.join(' · ')}
              </div>

              {/* Icon */}
              <div className="flex items-center justify-center py-3 bg-gray-100 text-3xl border-b border-gray-200">
                {card.icon}
              </div>

              {/* Stats */}
              <div className="flex justify-around py-1 bg-gray-200 text-[10px] font-bold">
                <span className="text-[#4da6ff]">BASE {card.speed}</span>
                {wouldSpeed !== null && !isDisabled && (
                  <span className="text-[#ffd700]">→ {wouldSpeed}</span>
                )}
              </div>

              {/* Name + Desc */}
              <div className="flex flex-col items-center px-1 py-2 flex-1">
                <div className="text-[11px] font-bold text-gray-800 font-body tracking-wide">{card.name}</div>
                <div className="text-[9px] text-gray-500 text-center mt-1 leading-tight">{card.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
