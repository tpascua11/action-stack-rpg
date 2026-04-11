// ============================================================
//  BattleLog — Fixed panel in the left column of the player zone
// ============================================================

import { useEffect, useRef } from 'react';

const LOG_COLORS = {
  dmg:   'text-[#e94560]',
  heal:  'text-green-400',
  buff:  'text-[#4da6ff]',
  clash:  'text-purple-400',
  fizzle: 'text-orange-400',
  info:  'text-[#ffd700]',
  normal:'text-gray-400',
};

export default function BattleLog({ logs, turn }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  return (
    <div
      style={{
        position:   'absolute',
        left:       0,
        top:        0,
        bottom:     0,
        width:      '600px',
        background: 'rgba(9,9,15,0.72)',
        border:     '1px solid rgba(255,255,255,0.07)',
        borderRadius: '3px',
        display:    'flex',
        flexDirection: 'column',
        zIndex:     5,
      }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-3 py-[5px] border-b border-white/[0.06]"
        style={{ background: '#131320' }}
      >
        <span className="text-[9px] font-mono tracking-widest text-gray-500">
          BATTLE LOG — T{turn}
        </span>
      </div>

      {/* Entries */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col gap-[3px]"
        style={{ padding: '6px 10px' }}
      >
        {logs.map((l, i) => (
          <div
            key={i}
            className={`text-[17px] font-mono leading-tight ${LOG_COLORS[l.type] ?? LOG_COLORS.normal}`}
          >
            {l.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
