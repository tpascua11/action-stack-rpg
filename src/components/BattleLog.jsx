// ============================================================
//  BattleLog — Middle section showing battle events
// ============================================================

import { useEffect, useRef } from 'react';

const LOG_COLORS = {
  dmg:   'text-[#e94560]',
  heal:  'text-green-400',
  buff:  'text-[#4da6ff]',
  clash: 'text-purple-400',
  info:  'text-[#ffd700]',
  normal:'text-gray-400',
};

export default function BattleLog({ logs, turn }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);

  return (
    <div className="h-[14%] bg-[#1a1a2e] border-b border-white/10 flex flex-col px-4 py-1">
      <div className="text-[9px] text-gray-600 font-mono tracking-widest mb-1">
        BATTLE LOG — T{turn}
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto flex flex-col gap-[2px]">
        {logs.map((l, i) => (
          <div key={i} className={`text-[11px] font-mono leading-tight animate-fadeIn ${LOG_COLORS[l.type] || LOG_COLORS.normal}`}>
            {l.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
