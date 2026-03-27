// ============================================================
//  Hand — Bottom section showing available cards to play
// ============================================================

import { calcSpeed } from '../battle/engine/battle_engine';

export default function Hand({ cards, queue, totalSlots, onCardClick, disabled, resources, ResourceBar }) {
  const filledCount = queue.filter(Boolean).length;
  const nullIdx = queue.findIndex(s => !s);
  const nextSlotIndex = filledCount >= totalSlots ? -1 : (nullIdx !== -1 ? nullIdx : queue.length);

  return (
    <div className="h-[35%] flex-shrink-0 flex flex-col border-t border-white/10"
      style={{ background: 'rgba(0,0,0,0.25)' }}>

      {/* Button row — 3 sections */}
      <div className="flex-shrink-0 flex border-b border-white/10" style={{ height: '2.5rem' }}>

        {/* LEFT — bag / inventory */}
        <div className="w-[25%] flex items-center justify-center border-r border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
          <span className="text-[9px] font-mono tracking-widest text-gray-500">BAG</span>
        </div>

        {/* MIDDLE — resource bar */}
        <div className="flex-1 flex items-center justify-center px-6">
          {ResourceBar && resources
            ? <ResourceBar resources={resources} />
            : <div className="w-full h-5 rounded-full bg-gray-700/60" />
          }
        </div>

        {/* RIGHT — options */}
        <div className="w-[25%] flex items-center justify-center border-l border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
          <span className="text-[9px] font-mono tracking-widest text-gray-500">OPT</span>
        </div>

      </div>

      {/* Card area — cards sit at the bottom with breathing room */}
      <div className="flex-1 flex items-start justify-center px-4 pt-2">
        {cards.map((card, idx) => {
          const wouldSpeed = nextSlotIndex >= 0
            ? calcSpeed(card.speed, nextSlotIndex)
            : null;
          const isDisabled = disabled || nextSlotIndex === -1;

          return (
            <div
              key={card.id}
              onClick={() => !isDisabled && onCardClick(card)}
              className={`group relative overflow-visible flex flex-col border-2
                transition-all duration-200
                ${isDisabled
                  ? 'opacity-40 cursor-not-allowed border-gray-700'
                  : 'cursor-pointer hover:-translate-y-8 hover:scale-110 hover:z-50'
                }`}
              style={{
                marginLeft: idx > 0 ? '-18px' : '0',
                width: '5.5rem',
                height: '8.25rem',
                background: '#09090f',
                borderColor: isDisabled ? '#374151' : card.color,
                boxShadow: isDisabled ? 'none' : `0 0 10px ${card.color}55, inset 0 0 6px ${card.color}11`,
                borderRadius: '3px',
                isolation: 'isolate',
              }}
            >
              {/* Header strip — name */}
              <div className="relative flex-shrink-0"
                style={{ background: card.color, height: '1.3rem', overflow: 'visible', zIndex: 2 }}>
                <span className="absolute inset-x-0 top-0 px-1 pt-[3px] text-[8px] font-bold font-mono text-white tracking-widest uppercase text-center leading-tight">
                  {card.name}
                </span>
              </div>

              {/* Art area */}
              <div className="relative flex-1">
                <div className="absolute inset-0 overflow-hidden">
                  {card.image
                    ? <img src={card.image} alt={card.name} className="w-full h-full object-contain" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl">{card.icon}</div>
                  }
                  {/* Scanlines */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)' }} />
                </div>
              </div>

              {/* Footer strip — speed */}
              <div className="flex items-center justify-center flex-shrink-0"
                style={{ background: '#0d0d1a', borderTop: `1px solid ${card.color}55`, height: '1.1rem' }}>
                <span className="text-[11px] font-bold font-mono" style={{ color: card.color }}>
                  SPD {wouldSpeed !== null && !isDisabled ? wouldSpeed : card.speed}
                </span>
              </div>

              {/* Tooltip */}
              {!isDisabled && (
                <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2
                  w-44 rounded-lg border border-gray-600 shadow-xl z-[100]
                  opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{ background: '#1a1a2e' }}>
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
